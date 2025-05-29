import React, { useRef, useEffect } from 'react';
import { Separator } from '@/components/ui/separator';
import Card from '../common/Card';
import * as d3 from 'd3'; // Keep d3 import
import { cn } from '@/lib/utils'; // For FeeRate dot color

// Mock data (kept as is)
const latencyData = [
  { time: '5m', value: 215 }, { time: '10m', value: 223 }, { time: '15m', value: 198 },
  { time: '20m', value: 205 }, { time: '25m', value: 231 }, { time: '30m', value: 227 },
  { time: '35m', value: 212 }, { time: '40m', value: 219 }, { time: '45m', value: 208 },
  { time: '50m', value: 201 }, { time: '55m', value: 197 }, { time: '60m', value: 203 },
];
const mempoolData = {
  size: '183.7 MB', txCount: '12,487', nextBlockFees: '0.00042 BTC',
  feeRates: { high: '21 sat/vB', medium: '14 sat/vB', low: '8 sat/vB' },
  feeEstimates: { fastest: '~10 min', fast: '~30 min', standard: '~1 hour', economy: '~3 hours' },
};

// StatItem component for displaying a statistic with label
const StatItem = ({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color?: string;
}) => (
  <div className="mb-4">
    <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
    <p
      className={`text-lg font-medium ${!color ? 'text-foreground' : ''}`}
      style={color ? { color: color } : {}}
    >
      {value}
    </p>
  </div>
);

// Fee rate component for displaying fee levels
const FeeRate = ({
  level,
  rate,
  time,
}: {
  level: string;
  rate: string;
  time: string;
}) => (
  <div className="flex justify-between items-center mb-3">
    <div className="flex items-center">
      <div
        className={cn(
          "w-2 h-2 rounded-full mr-3 flex-shrink-0",
          level === 'Fastest' ? 'bg-red-500' // Destructive
          : level === 'Fast' ? 'bg-orange-500' // Warning
          : level === 'Standard' ? 'bg-green-500' // Success
          : 'bg-muted-foreground' // Default/Muted
        )}
      ></div>
      <p className="text-sm text-foreground">{level}</p>
    </div>
    <p className="text-sm text-muted-foreground">{rate}</p>
    <p className="text-sm text-muted-foreground">{time}</p>
  </div>
);

const MempoolLatencyStats = () => {
  const chartRef = useRef<SVGSVGElement>(null); // For D3 chart

  // Effect for D3 chart rendering (simplified, no error/loading state from props)
  useEffect(() => {
    if (!chartRef.current || latencyData.length === 0) return;

    const getCssVariable = (variableName: string, fallback: string) => {
      if (typeof window !== 'undefined') {
        return getComputedStyle(document.documentElement).getPropertyValue(variableName).trim() || fallback;
      }
      return fallback;
    };
    
    d3.select(chartRef.current).selectAll('*').remove();

    const height = 200; // Fixed height for the chart area
    const margin = { top: 5, right: 5, bottom: 5, left: 5 }; // Minimal margins
    const width = chartRef.current.clientWidth - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const svg = d3
      .select(chartRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Simplified scales - adjust domain based on actual latencyData values if needed
    const x = d3
      .scaleLinear()
      .domain([0, latencyData.length - 1])
      .range([0, width]);

    const yMin = d3.min(latencyData, d => d.value) || 190;
    const yMax = d3.max(latencyData, d => d.value) || 240;
    const y = d3
      .scaleLinear()
      .domain([yMin - 5, yMax + 5]) // Dynamic Y scale with padding
      .range([chartHeight, 0]);

    const line = d3
      .line<{ time: string; value: number }>()
      .x((_d, i) => x(i))
      .y((d) => y(d.value))
      .curve(d3.curveMonotoneX);

    svg
      .append('path')
      .datum(latencyData)
      .attr('fill', 'none')
      .attr('stroke', getCssVariable('--primary', '#3986e8'))
      .attr('stroke-width', 2)
      .attr('d', line);

    svg
      .selectAll('.dot')
      .data(latencyData)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('cx', (_d, i) => x(i))
      .attr('cy', (d) => y(d.value))
      .attr('r', 3)
      .attr('fill', getCssVariable('--primary', '#3986e8'))
      .attr('stroke', getCssVariable('--card', '#1e1e1e')) // Assuming --card is background
      .attr('stroke-width', 1);

  }, [latencyData]); // Rerun if data changes

  return (
    <Card
      title="Network Performance"
      subtitle="Mempool stats and latency metrics"
      accentColor="var(--primary)"
    >
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Mempool Stats */}
        <div className="flex-1 w-full">
          <div className="bg-card text-foreground rounded-lg border border-primary/20 p-4 h-full">
            <h3 className="text-xl font-semibold text-foreground mb-4">
              Mempool Status
            </h3>

            <div className="grid grid-cols-2 gap-x-2 gap-y-4 mb-4">
              <StatItem label="SIZE" value={mempoolData.size} />
              <StatItem label="TRANSACTIONS" value={mempoolData.txCount} />
              <StatItem
                label="NEXT BLOCK FEES"
                value={mempoolData.nextBlockFees}
                color="var(--secondary)" // Using CSS variable
              />
              <StatItem
                label="HIGH PRIORITY FEE"
                value={mempoolData.feeRates.high}
                color="var(--destructive)" // Using CSS variable
              />
            </div>

            <Separator className="my-4" />

            <h4 className="text-base font-medium text-foreground mb-3">
              Fee Estimates
            </h4>

            <FeeRate
              level="Fastest"
              rate={mempoolData.feeRates.high}
              time={mempoolData.feeEstimates.fastest}
            />
            <FeeRate
              level="Fast"
              rate={mempoolData.feeRates.medium}
              time={mempoolData.feeEstimates.fast}
            />
            <FeeRate
              level="Standard"
              rate={mempoolData.feeRates.medium}
              time={mempoolData.feeEstimates.standard}
            />
            <FeeRate
              level="Economy"
              rate={mempoolData.feeRates.low}
              time={mempoolData.feeEstimates.economy}
            />
          </div>
        </div>

        {/* Latency Stats */}
        <div className="flex-1 w-full">
          <div className="bg-card text-foreground rounded-lg border border-primary/20 p-4 h-full">
            <h3 className="text-xl font-semibold text-foreground mb-4">
              Network Latency
            </h3>

            <div className="flex justify-between mb-4">
              <p className="text-xs text-muted-foreground">Current: <span className="text-foreground font-medium">203 ms</span></p>
              <p className="text-xs text-muted-foreground">Avg (1h): <span className="text-foreground font-medium">211 ms</span></p>
              <p className="text-xs text-muted-foreground">Best: <span className="text-green-500 font-medium">197 ms</span></p>
            </div>
            
            <div className="h-48 mt-6 relative">
              <svg ref={chartRef} width="100%" height="100%"></svg>
            </div>

            <Separator className="my-4" /> {/* Adjusted margin to my-4 from my-2 */}

            <div className="grid grid-cols-3 gap-x-2 mt-4">
              <StatItem label="SWITCHING TIME" value="1.8s" />
              <StatItem label="LAMBDA" value="1.87" />
              <StatItem label="A PARAMETER" value="3.2" />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MempoolLatencyStats;
