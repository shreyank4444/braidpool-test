import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Loader2, InfoIcon as Info } from 'lucide-react';
import Card from '../common/Card'; // Assuming Card is already refactored

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
  height = 300,
  data = mockHashrateData,
  loading = false,
}) => {
  const chartRef = useRef<SVGSVGElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const getCssVariable = (variableName: string) => {
      if (typeof window !== 'undefined') {
        return getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
      }
      return ''; // Fallback for SSR or non-browser environments if any
    };

    setError(null);
    if (!data || data.length === 0) {
      setError('No hashrate data available');
      return;
    }

    try {
      d3.select(chartRef.current).selectAll('*').remove();

      const margin = { top: 30, right: 30, bottom: 50, left: 60 };
      const width = chartRef.current.clientWidth - margin.left - margin.right;
      const chartHeight = height - margin.top - margin.bottom;

      const svg = d3
        .select(chartRef.current)
        .attr('width', width + margin.left + margin.right)
        .attr('height', height)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      const x = d3
        .scaleBand()
        .domain(data.map((d) => d.time))
        .range([0, width])
        .padding(0.1);

      const y = d3
        .scaleLinear()
        .domain([0, 100])
        .range([chartHeight, 0]);

      svg
        .append('g')
        .attr('transform', `translate(0,${chartHeight})`)
        .call(d3.axisBottom(x))
        .selectAll('text')
        .style('fill', getCssVariable('--muted-foreground') || '#b0b0b0')
        .style('font-size', '12px');

      svg
        .append('g')
        .call(
          d3
            .axisLeft(y)
            .tickValues([0, 20, 40, 60, 80, 100])
            .tickFormat((d) => `${d}`)
        )
        .selectAll('text')
        .style('fill', getCssVariable('--muted-foreground') || '#b0b0b0')
        .style('font-size', '12px');

      svg
        .append('g')
        .attr('class', 'grid')
        .selectAll('line')
        .data([0, 20, 40, 60, 80, 100])
        .enter()
        .append('line')
        .attr('x1', 0)
        .attr('x2', width)
        .attr('y1', (d) => y(d))
        .attr('y2', (d) => y(d))
        .attr('stroke', getCssVariable('--border') || '#424242')
        .attr('stroke-dasharray', '3,3');

      const line = d3
        .line<{ time: string; value: number }>()
        .x((d) => x(d.time)! + x.bandwidth() / 2)
        .y((d) => y(d.value))
        .curve(d3.curveMonotoneX);

      svg
        .append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', getCssVariable('--primary') || '#3986e8')
        .attr('stroke-width', 2.5)
        .attr('d', line);

      svg
        .selectAll('.dot')
        .data(data)
        .enter()
        .append('circle')
        .attr('class', 'dot')
        .attr('cx', (d) => x(d.time)! + x.bandwidth() / 2)
        .attr('cy', (d) => y(d.value))
        .attr('r', 4)
        .attr('fill', getCssVariable('--primary') || '#3986e8')
        .attr('stroke', getCssVariable('--card') || '#1e1e1e')
        .attr('stroke-width', 2);

      svg
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', -margin.left + 15)
        .attr('x', -chartHeight / 2)
        .attr('text-anchor', 'middle')
        .style('fill', getCssVariable('--muted-foreground') || '#b0b0b0')
        .text('PH/s');

      svg
        .append('text')
        .attr('y', chartHeight + margin.bottom - 10)
        .attr('x', width / 2)
        .attr('text-anchor', 'middle')
        .style('fill', getCssVariable('--muted-foreground') || '#b0b0b0')
        .text('Time');

      console.log(
        '🔄 Pool hashrate chart rendered with',
        data.length,
        'data points'
      );
    } catch (err) {
      console.error('❌ Error rendering hashrate chart:', err);
      setError('Error rendering hashrate chart');
    }
  }, [height, data]); // Removed theme from dependencies

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col justify-center items-center h-full p-6 text-foreground">
          <Loader2 className="h-10 w-10 text-primary animate-spin mb-3" />
          <p className="text-sm text-muted-foreground">Loading hashrate data...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col justify-center items-center h-full p-6">
          <div className="w-full flex flex-col items-center justify-center bg-destructive/10 border border-destructive/30 text-destructive p-4 rounded-md text-center">
            <Info className="h-8 w-8 mb-2" />
            <p className="text-sm font-medium">{error}</p>
            <p className="text-xs mt-1 text-destructive/80">— Check your connection or try again later</p>
          </div>
        </div>
      );
    }

    return <svg ref={chartRef} style={{ width: '100%', height: '100%' }} />;
  };

  return (
    <Card
      title="Pool Hashrate"
      subtitle="Live network performance over time"
      accentColor="var(--primary)" // Updated accentColor
    >
      <div className="w-full overflow-hidden" style={{ height: height }}>
        {renderContent()}
      </div>
    </Card>
  );
};

export default PoolHashrateChart;
