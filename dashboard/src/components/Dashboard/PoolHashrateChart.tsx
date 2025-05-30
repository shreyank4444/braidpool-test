import React, { useEffect, useRef, useState } from 'react';
// Removed MUI imports: Box, Typography, useTheme, CircularProgress, Alert
import * as d3 from 'd3';
import colors from '../../theme/colors'; // Kept for D3 chart styling
import Card from '../common/Card'; // Assuming this is the migrated shadcn/ui Card

import {
  Alert as ShadcnAlert,
  AlertDescription,
  AlertTitle,
} from '~/components/ui/alert';
import { Loader2, Info, AlertTriangle } from 'lucide-react';

// Mock data for the hashrate over time
const mockHashrateData = [
  { time: '43m', value: 68.2 },
  { time: '40m', value: 72.5 },
  { time: '36m', value: 93.1 },
  { time: '32m', value: 86.7 },
  { time: '28m', value: 79.5 },
  { time: '24m', value: 84.8 },
  { time: '23m', value: 89.2 },
  { time: '22m', value: 98.3 },
];

interface PoolHashrateChartProps {
  height?: number;
  data?: Array<{ time: string; value: number }>;
  loading?: boolean;
}

const PoolHashrateChart: React.FC<PoolHashrateChartProps> = ({
  height = 300, // Default height for the chart container div
  data = mockHashrateData, // Prop for data, defaults to mock
  loading = false,
}) => {
  const chartRef = useRef<SVGSVGElement>(null);
  // Removed: const theme = useTheme();
  const [chartError, setChartError] = useState<string | null>(null); // Renamed to avoid conflict with 'error' prop if ever added

  useEffect(() => {
    // If loading, don't try to render chart
    if (loading) {
        // Clear previous chart content when loading new data
        if (chartRef.current) {
            d3.select(chartRef.current).selectAll('*').remove();
        }
        setChartError(null); // Clear previous errors
        return;
    }

    if (!chartRef.current) return;

    // Clear previous error state
    setChartError(null);

    // Check if data is empty or invalid
    if (!data || data.length === 0) {
      setChartError('No hashrate data available to display.'); // Specific message for no data
      d3.select(chartRef.current).selectAll('*').remove(); // Clear chart area
      return;
    }

    try {
      d3.select(chartRef.current).selectAll('*').remove();

      const margin = { top: 30, right: 30, bottom: 50, left: 60 };
      // Use clientWidth of the parent of SVG for responsive width
      const parentWidth = (chartRef.current.parentNode as HTMLElement)?.clientWidth || chartRef.current.clientWidth;
      const width = parentWidth - margin.left - margin.right;
      const chartHeight = height - margin.top - margin.bottom;

      if (width <= 0 || chartHeight <= 0) {
        setChartError("Chart container has invalid dimensions.");
        return;
      }

      const svg = d3
        .select(chartRef.current)
        .attr('width', width + margin.left + margin.right)
        .attr('height', height)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      const x = d3
        .scaleBand<string>()
        .domain(data.map((d) => d.time))
        .range([0, width])
        .padding(0.1);

      const y = d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => d.value) || 100]) // Dynamic Y-axis or fixed 0-100
        .range([chartHeight, 0]);

      svg
        .append('g')
        .attr('transform', `translate(0,${chartHeight})`)
        .call(d3.axisBottom(x))
        .selectAll('text')
        .style('fill', colors.textSecondary)
        .style('font-size', '10px'); // Adjusted font size

      svg
        .append('g')
        .call(d3.axisLeft(y).ticks(5)) // Adjusted ticks
        .selectAll('text')
        .style('fill', colors.textSecondary)
        .style('font-size', '10px'); // Adjusted font size
      
      svg
        .append('g')
        .attr('class', 'grid')
        .call(d3.axisLeft(y)
            .ticks(5)
            .tickSize(-width)
            .tickFormat(() => "")
        )
        .selectAll('line')
        .attr('stroke', colors.chartGrid)
        .attr('stroke-dasharray', '2,2'); // Adjusted dasharray

      const line = d3
        .line<{ time: string; value: number }>()
        .x((d) => (x(d.time) ?? 0) + x.bandwidth() / 2) // Added nullish coalescing for x(d.time)
        .y((d) => y(d.value))
        .curve(d3.curveMonotoneX);

      svg
        .append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', colors.chartLine)
        .attr('stroke-width', 2) // Adjusted stroke-width
        .attr('d', line);

      svg
        .selectAll('.dot')
        .data(data)
        .enter()
        .append('circle')
        .attr('class', 'dot')
        .attr('cx', (d) => (x(d.time) ?? 0) + x.bandwidth() / 2) // Added nullish coalescing
        .attr('cy', (d) => y(d.value))
        .attr('r', 3) // Adjusted radius
        .attr('fill', colors.chartLine)
        .attr('stroke', colors.chartBackground)
        .attr('stroke-width', 1.5); // Adjusted stroke-width

      svg
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', -margin.left + 20) // Adjusted position
        .attr('x', -chartHeight / 2)
        .attr('text-anchor', 'middle')
        .style('fill', colors.textSecondary)
        .style('font-size', '12px') // Explicit font size
        .text('PH/s');
      
      // X-axis label removed as per typical D3 chart style unless explicitly needed
      // ... (console logs removed for brevity)

    } catch (err) {
      console.error('❌ Error rendering hashrate chart:', err);
      setChartError('Error rendering hashrate chart.');
    }
  }, [height, data, loading]); // Added loading to dependencies

  const renderChartArea = () => {
    if (loading) {
      return (
        <div className={`flex flex-col items-center justify-center h-full min-h-[${height}px]`}>
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground mt-2">Loading chart data...</p>
        </div>
      );
    }

    if (chartError === 'No hashrate data available to display.') {
      return (
        <div className={`flex items-center justify-center h-full min-h-[${height}px] p-4`}>
          <ShadcnAlert variant="default" className="w-full max-w-md">
            <Info className="h-4 w-4" />
            <AlertTitle>No Data Available</AlertTitle>
            <AlertDescription>{chartError}</AlertDescription>
          </ShadcnAlert>
        </div>
      );
    }
    
    if (chartError) {
      return (
        <div className={`flex items-center justify-center h-full min-h-[${height}px] p-4`}>
          <ShadcnAlert variant="destructive" className="w-full max-w-md">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error Loading Chart</AlertTitle>
            <AlertDescription>{chartError}</AlertDescription>
          </ShadcnAlert>
        </div>
      );
    }
    // Ensure the SVG has a key that changes if data changes significantly, or ensure D3 correctly handles updates.
    // The current useEffect clears and redraws, which is fine for this scope.
    return <svg ref={chartRef} className="w-full h-full" />;
  };
  
  return (
    <Card
      title="Pool Hashrate"
      subtitle="Live network performance over time"
      // Using a CSS variable for accentColor or a direct hex value if colors.ts is removed
      accentColor="hsl(var(--primary))" 
    >
      {/* Replaced Box with div and Tailwind classes, ensuring height is passed for the chart area */}
      <div className={`w-full overflow-hidden text-xs h-[${height}px]`}>
        {renderChartArea()}
      </div>
    </Card>
  );
};

export default PoolHashrateChart;
