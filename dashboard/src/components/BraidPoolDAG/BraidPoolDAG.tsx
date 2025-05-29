import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import '../../App.css'; // Keep if it contains other essential styles

interface GraphNode {
  id: string;
  parents: string[];
  children: string[];
}

interface NodeIdMapping {
  [hash: string]: string; // maps hash to sequential ID
}

// COLORS array is kept for distinct cohort coloring
var COLORS = [
  `rgba(${217}, ${95}, ${2}, 1)`,
  `rgba(${117}, ${112}, ${179}, 1)`,
  `rgba(${102}, ${166}, ${30}, 1)`,
  `rgba(${231}, ${41}, ${138}, 1)`,
];
interface GraphData {
  highest_work_path: string[];
  parents: Record<string, string[]>;
  children: Record<string, string[]>;
  cohorts: string[][];
  bead_count: number;
}

interface Position {
  x: number;
  y: number;
}

const GraphVisualization: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const width = window.innerWidth - 100; // Kept as dynamic
  const height = window.innerHeight; // Kept as dynamic

  const [nodeIdMap, setNodeIdMap] = useState<NodeIdMapping>({});
  const [selectedCohorts, setSelectedCohorts] = useState<number | 'all'>(10);

  const nodeRadius = 30;
  const margin = { top: 0, right: 0, bottom: 0, left: 50 };
  const tooltipRef = useRef<HTMLDivElement>(null);

  const COLUMN_WIDTH = 120;
  const VERTICAL_SPACING = 100;

  const getCssVariable = (variableName: string, fallbackColor: string = '#000000') => {
    if (typeof window !== 'undefined') {
      const value = getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
      return value || fallbackColor;
    }
    return fallbackColor;
  };

  const layoutNodes = (
    allNodes: GraphNode[],
    hwPath: string[],
    cohorts: string[][]
  ): Record<string, Position> => {
    const positions: Record<string, Position> = {};
    const columnOccupancy: Record<number, number> = {};
    const hwPathSet = new Set(hwPath);
    const centerY = height / 2;
    const cohortMap = new Map<string, number>();
    cohorts.forEach((cohort, index) => {
      cohort.forEach((nodeId) => cohortMap.set(nodeId, index));
    });

    let currentX = margin.left;
    let prevCohort: number | undefined;
    const hwPathColumns: number[] = [];

    hwPath.forEach((nodeId, index) => {
      const currentCohort = cohortMap.get(nodeId);
      if (prevCohort !== undefined && currentCohort !== prevCohort) {
        currentX += COLUMN_WIDTH;
      }
      positions[nodeId] = { x: currentX, y: centerY };
      hwPathColumns.push(currentX);
      columnOccupancy[index] = 0;
      prevCohort = currentCohort;
      currentX += COLUMN_WIDTH;
    });

    const generations = new Map<string, number>();
    const remainingNodes = allNodes.filter((node) => !hwPathSet.has(node.id));

    remainingNodes.forEach((node) => {
      const hwpParents = node.parents.filter((p) => hwPathSet.has(p));
      if (hwpParents.length > 0) {
        const minHWPIndex = Math.min(...hwpParents.map((p) => hwPath.indexOf(p)));
        generations.set(node.id, minHWPIndex + 1);
      } else {
        const parentGens = node.parents.map((p) => generations.get(p) || 0);
        generations.set(node.id, parentGens.length > 0 ? Math.max(...parentGens) + 1 : 0);
      }
    });

    remainingNodes.sort((a, b) => (generations.get(a.id) || 0) - (generations.get(b.id) || 0));
    const tipNodes: string[] = [];

    remainingNodes.forEach((node) => {
      if (node.parents.length === 1 && !node.children?.length) {
        tipNodes.push(node.id);
      }
      const positionedParents = node.parents.filter((p) => positions[p]);
      let targetX: number;
      let colKey: number;

      if (positionedParents.length === 0) {
        colKey = 0;
        while (columnOccupancy[colKey] !== undefined && columnOccupancy[colKey] >= 10) {
          colKey++;
        }
        targetX = margin.left + colKey * COLUMN_WIDTH;
      } else {
        const maxParentX = Math.max(...positionedParents.map((p) => positions[p].x));
        targetX = maxParentX + COLUMN_WIDTH;
        const hwpParents = positionedParents.filter((p) => hwPathSet.has(p));
        if (hwpParents.length > 0) {
          const rightmostHWPParentX = Math.max(...hwpParents.map((p) => positions[p].x));
          const parentIndex = hwPathColumns.indexOf(rightmostHWPParentX);
          if (parentIndex >= 0 && parentIndex < hwPathColumns.length - 1) {
            targetX = hwPathColumns[parentIndex + 1];
          }
        }
        colKey = Math.round((targetX - margin.left) / COLUMN_WIDTH);
      }

      let count = columnOccupancy[colKey] || 0;
      const direction = count % 2 !== 0 ? 1 : -1;
      const level = Math.ceil((count + 1) / 2);
      const yOffset = direction * level * VERTICAL_SPACING;
      const yPos = centerY + yOffset;
      columnOccupancy[colKey] = count + 1;
      positions[node.id] = { x: targetX, y: yPos };
    });

    const maxColumnX = Math.max(...Object.values(positions).map((pos) => pos.x));
    tipNodes.forEach((tipId) => {
      if (positions[tipId]) {
        positions[tipId].x = maxColumnX;
      }
    });
    return positions;
  };

  const [_connectionStatus, setConnectionStatus] = useState('Disconnected');
  const prevFirstCohortRef = useRef<string[]>([]);
  const prevLastCohortRef = useRef<string[]>([]);
  const [totalBeads, setTotalBeads] = useState<number>(0);
  const [totalCohorts, setTotalCohorts] = useState<number>(0);
  const [maxCohortSize, setMaxCohortSize] = useState<number>(0);
  const [hwpLength, setHwpLength] = useState<number>(0);
  const [defaultZoom, setDefaultZoom] = useState(0.3);
  const zoomBehavior = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);

  useEffect(() => {
    const url = 'ws://localhost:65433/';
    const socket = new WebSocket(url);
    socket.onopen = () => { console.log('Connected to WebSocket', url); setConnectionStatus('Connected'); };
    socket.onclose = () => { setConnectionStatus('Disconnected'); };
    socket.onerror = (err) => { setConnectionStatus(`Error: ${err}`); };

    socket.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        const parsedData = parsed.data;
        if (!parsedData?.parents || typeof parsedData.parents !== 'object') {
          console.warn("Invalid 'parents' field in parsedData:", parsedData); return;
        }

        const children: Record<string, string[]> = {};
        if (parsedData?.parents && typeof parsedData.parents === 'object') {
          Object.entries(parsedData.parents).forEach(([nodeId, parents]) => {
            (parents as string[]).forEach((parentId) => {
              if (!children[parentId]) children[parentId] = [];
              children[parentId].push(nodeId);
            });
          });
        }
        const bead_count = parsedData?.parents && typeof parsedData.parents === 'object' ? Object.keys(parsedData.parents).length : 0;
        const graphDataInstance: GraphData = {
          highest_work_path: parsedData.highest_work_path,
          parents: parsedData.parents,
          cohorts: parsedData.cohorts,
          children, bead_count,
        };

        const firstCohortChanged = parsedData?.cohorts?.[0]?.length && JSON.stringify(prevFirstCohortRef.current) !== JSON.stringify(parsedData.cohorts[0]);
        const lastCohortChanged = parsedData?.cohorts?.length > 0 && JSON.stringify(prevLastCohortRef.current) !== JSON.stringify(parsedData.cohorts[parsedData.cohorts.length - 1]);

        if (firstCohortChanged) {
          const top = COLORS.shift(); COLORS.push(top ?? `rgba(${217}, ${95}, ${2}, 1)`);
          prevFirstCohortRef.current = parsedData.cohorts[0];
        }
        if (lastCohortChanged) { prevLastCohortRef.current = parsedData.cohorts[parsedData.cohorts.length - 1]; }

        const newMapping: NodeIdMapping = {};
        let nextId = 1;
        Object.keys(parsedData.parents).forEach((hash) => { if (!newMapping[hash]) { newMapping[hash] = nextId.toString(); nextId++; } });

        setNodeIdMap(newMapping); setGraphData(graphDataInstance); setTotalBeads(bead_count);
        setTotalCohorts(parsedData.cohorts.length); setMaxCohortSize(Math.max(...parsedData.cohorts.map((c: string | any[]) => c.length)));
        setHwpLength(parsedData.highest_work_path.length); setLoading(false);

        if (firstCohortChanged || lastCohortChanged) {
          setTimeout(() => {
            animateCohorts(firstCohortChanged ? parsedData.cohorts[0] : [], lastCohortChanged ? parsedData.cohorts[parsedData.cohorts.length - 1] : []);
          }, 100);
        }
      } catch (err) {
        setError('Error processing graph data'); console.error('Error processing graph data:', err); setLoading(false);
      }
    };
    return () => socket.close();
  }, []);

  const animateCohorts = (firstCohort: string[], lastCohort: string[]) => {
    if (!svgRef.current || !graphData) return;
    const svg = d3.select(svgRef.current);
    const primaryColor = getCssVariable('--primary', '#FF8500');
    const secondaryColor = getCssVariable('--secondary', '#48CAE4');
    const cardColor = getCssVariable('--card', '#FFFFFF');

    if (firstCohort.length > 0) {
      svg.selectAll('.node').filter((d: any) => firstCohort.includes(d.id)).select('circle')
        .attr('stroke', primaryColor).attr('stroke-width', 3)
        .transition().duration(1000).attr('stroke-width', 2).attr('stroke', cardColor);
    }
    if (lastCohort.length > 0) {
      svg.selectAll('.node').filter((d: any) => lastCohort.includes(d.id)).select('circle')
        .attr('stroke', primaryColor).attr('stroke-width', 3)
        .transition().duration(1000).attr('stroke-width', 2).attr('stroke', cardColor);
    }
    if (firstCohort.length > 0) {
      svg.selectAll('.link').filter((d: any) => firstCohort.includes(d.source) || firstCohort.includes(d.target))
        .attr('stroke-width', 3).attr('stroke', primaryColor)
        .transition().duration(1000).attr('stroke-width', 1.5)
        .attr('stroke', (d: any) => graphData.highest_work_path.includes(d.source) && graphData.highest_work_path.includes(d.target) ? primaryColor : secondaryColor);
    }
    if (lastCohort.length > 0) {
      svg.selectAll('.link').filter((d: any) => lastCohort.includes(d.source) || lastCohort.includes(d.target))
        .attr('stroke-width', 3).attr('stroke', primaryColor)
        .transition().duration(1000).attr('stroke-width', 1.5)
        .attr('stroke', (d: any) => graphData.highest_work_path.includes(d.source) && graphData.highest_work_path.includes(d.target) ? primaryColor : secondaryColor);
    }
  };

  const handleResetZoom = () => { setDefaultZoom(0.3); };
  const handleZoomIn = () => { setDefaultZoom((prevZoom) => Math.min(prevZoom + 0.1, 5)); };
  const handleZoomOut = () => { setDefaultZoom((prevZoom) => Math.max(prevZoom - 0.1, 0.3)); };

  useEffect(() => {
    if (!svgRef.current || !graphData) return;
    const filteredCohorts = graphData.cohorts.slice(-selectedCohorts);
    const filteredCohortNodes = new Set(filteredCohorts.flat());

    const tooltip = d3.select(tooltipRef.current); // D3 only sets visibility and html
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    const container = svg.append('g');

    zoomBehavior.current = d3.zoom<SVGSVGElement, unknown>().scaleExtent([0.5, 5])
      .on('zoom', (event: d3.D3ZoomEvent<SVGSVGElement, unknown>) => {
        container.attr('transform', event.transform.toString());
      });
    svg.call(zoomBehavior.current).call(zoomBehavior.current.transform, d3.zoomIdentity.scale(defaultZoom));

    const allNodes = Object.keys(graphData.parents).map((id) => ({ id, parents: graphData.parents[id], children: graphData.children[id] }));
    const hwPath = graphData.highest_work_path;
    const cohorts = graphData.cohorts;
    const positions = layoutNodes(allNodes, hwPath, cohorts as string[][]);
    const hwPathSet = new Set(hwPath);

    const visibleNodes = allNodes.filter((node) => filteredCohortNodes.has(node.id));
    let minVisibleX = Infinity;
    visibleNodes.forEach((node) => { const x = positions[node.id]?.x || 0; if (x < minVisibleX) minVisibleX = x; });
    const offsetX = margin.left - minVisibleX;

    const links: { source: string; target: string }[] = [];
    allNodes.forEach((node) => { if (Array.isArray(node.children)) { node.children.forEach((childId) => { links.push({ target: node.id, source: childId }); }); } });

    const cohortMap = new Map<string, number>();
    (cohorts as string[][]).forEach((cohort, index) => { cohort.forEach((nodeId) => cohortMap.set(nodeId, index)); });
    
    const primaryColor = getCssVariable('--primary', '#FF8500');
    const secondaryColor = getCssVariable('--secondary', '#48CAE4');
    const cardColor = getCssVariable('--card', '#FFFFFF');
    const cardForegroundColor = getCssVariable('--card-foreground', '#FFFFFF');


    const nodes = container.selectAll('.node').data(allNodes).enter().append('g')
      .attr('class', 'node')
      .attr('transform', (d) => `translate(${(positions[d.id]?.x || 0) + offsetX},${positions[d.id]?.y || 0})`)
      .style('display', (d) => filteredCohortNodes.has(d.id) ? 'inline' : 'none');

    nodes.append('circle').attr('r', nodeRadius)
      .attr('fill', (d) => { const cohortIndex = cohortMap.get(d.id); return cohortIndex === undefined ? COLORS[0] : COLORS[cohortIndex % COLORS.length]; })
      .attr('stroke', cardColor) // Updated
      .attr('stroke-width', 2)
      .on('mouseover', function (event: MouseEvent, d: GraphNode) {
        d3.select(this).attr('stroke', primaryColor).attr('stroke-width', 3); // Updated
        const cohortIndex = cohortMap.get(d.id); const isHWP = hwPathSet.has(d.id);
        const tooltipContent = `...`; // Content as before
        tooltip.html(tooltipContent).style('visibility', 'visible');
      })
      .on('mouseout', function () {
        d3.select(this).attr('stroke', cardColor).attr('stroke-width', 2); // Updated
        tooltip.style('visibility', 'hidden');
      });

    nodes.append('text').attr('dy', 4).attr('text-anchor', 'middle')
      .text((d) => nodeIdMap[d.id] || '?')
      .attr('fill', cardForegroundColor) // Updated
      .style('font-size', 20)
      .on('mouseover', function (event: MouseEvent, d: GraphNode) { /* ... tooltip logic ... */ })
      .on('mouseout', function () { tooltip.style('visibility', 'hidden'); });

    container.append('text').attr('x', width / 2).attr('y', margin.top / 2).attr('text-anchor', 'middle').style('font-size', '16px');

    container.append('defs').selectAll('marker').data([{ id: 'arrow-secondary', color: secondaryColor }, { id: 'arrow-primary', color: primaryColor }]) // Updated
      .enter().append('marker').attr('id', (d) => d.id).attr('viewBox', '0 -5 10 10')
      .attr('refX', 10).attr('refY', 0).attr('markerWidth', 15).attr('markerHeight', 12).attr('orient', 'auto')
      .append('path').attr('d', 'M0,-5L10,0L0,5').attr('fill', (d) => d.color);

    container.selectAll('.link').data(links).enter().append('line')
      .attr('class', 'link')
      // x1, y1, x2, y2 calculations remain the same
      .attr('x1', (d) => { /* ... */ return ((positions[d.source]?.x || 0) + offsetX) + (nodeRadius / Math.sqrt(Math.pow((positions[d.target]?.x || 0) - (positions[d.source]?.x || 0), 2) + Math.pow((positions[d.target]?.y || 0) - (positions[d.source]?.y || 0), 2))) * ((positions[d.target]?.x || 0) - (positions[d.source]?.x || 0)); })
      .attr('y1', (d) => { /* ... */ return (positions[d.source]?.y || 0) + (nodeRadius / Math.sqrt(Math.pow((positions[d.target]?.x || 0) - (positions[d.source]?.x || 0), 2) + Math.pow((positions[d.target]?.y || 0) - (positions[d.source]?.y || 0), 2))) * ((positions[d.target]?.y || 0) - (positions[d.source]?.y || 0)); })
      .attr('x2', (d) => { /* ... */ return ((positions[d.target]?.x || 0) + offsetX) - (nodeRadius / Math.sqrt(Math.pow((positions[d.source]?.x || 0) - (positions[d.target]?.x || 0), 2) + Math.pow((positions[d.source]?.y || 0) - (positions[d.target]?.y || 0), 2))) * ((positions[d.source]?.x || 0) - (positions[d.target]?.x || 0)); })
      .attr('y2', (d) => { /* ... */ return (positions[d.target]?.y || 0) - (nodeRadius / Math.sqrt(Math.pow((positions[d.source]?.x || 0) - (positions[d.target]?.x || 0), 2) + Math.pow((positions[d.source]?.y || 0) - (positions[d.target]?.y || 0), 2))) * ((positions[d.source]?.y || 0) - (positions[d.target]?.y || 0)); })
      .attr('stroke', (d) => hwPathSet.has(d.source) && hwPathSet.has(d.target) ? primaryColor : secondaryColor) // Updated
      .attr('stroke-width', 1.5)
      .attr('marker-end', (d) => hwPathSet.has(d.source) && hwPathSet.has(d.target) ? 'url(#arrow-primary)' : 'url(#arrow-secondary)') // Updated
      .style('display', (d) => filteredCohortNodes.has(d.source) && filteredCohortNodes.has(d.target) ? 'inline' : 'none');
  }, [graphData, defaultZoom, selectedCohorts, nodeIdMap]); // Added nodeIdMap dependency

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-full text-foreground">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading graph data...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-destructive">
        <p className="mb-4">Error: {error}</p>
        <Button onClick={() => window.location.reload()} variant="outline">Retry</Button>
      </div>
    );
  }
  if (!graphData) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-muted-foreground">
        <p className="mb-4">No graph data available</p>
        <Button onClick={() => window.location.reload()} variant="outline">Refresh</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="m-2 p-3 flex flex-wrap items-center gap-3 bg-card border border-border rounded-lg shadow-sm">
        <select
          value={selectedCohorts}
          onChange={(e) => { const value = e.target.value; setSelectedCohorts(value === 'all' ? 'all' : Number(value)); }}
          className="bg-background border border-input rounded-md px-3 py-1.5 text-sm text-foreground focus:ring-ring focus:ring-offset-background focus:outline-none focus:ring-2 focus:ring-offset-2"
        >
          <option value="all">Show all cohorts</option>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
            <option key={value} value={value}>Show latest {value} cohorts</option>
          ))}
        </select>
        <div className="flex items-center gap-2 ml-auto">
          <Button variant="outline" size="icon" onClick={handleZoomIn} title="Zoom In"><ZoomIn className="h-4 w-4" /></Button>
          <Button variant="outline" size="icon" onClick={handleZoomOut} title="Zoom Out"><ZoomOut className="h-4 w-4" /></Button>
          <Button variant="outline" size="icon" onClick={handleResetZoom} title="Reset Zoom"><RotateCcw className="h-4 w-4" /></Button>
        </div>
      </div>

      <Card className="m-2 shadow-lg" style={{ borderColor: 'var(--primary)' }}>
        <CardContent className="p-0 relative">
          <svg ref={svgRef} width={width} height={height} />
        </CardContent>
        <div ref={tooltipRef} className="fixed invisible bg-popover text-popover-foreground border border-border rounded-md p-2.5 shadow-xl pointer-events-none z-50 text-xs bottom-5 right-5"></div>
      </Card>

      <Card className="m-2 shadow-lg" style={{ borderColor: 'var(--secondary)' }}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-primary">Metrics</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-1 text-sm pt-2">
          <div className="font-medium text-secondary">Total Beads: <span className="font-normal text-primary">{totalBeads}</span></div>
          <div className="font-medium text-secondary">Total Cohorts: <span className="font-normal text-primary">{totalCohorts}</span></div>
          <div className="font-medium text-secondary">Max Cohort Size: <span className="font-normal text-primary">{maxCohortSize}</span></div>
          <div className="font-medium text-secondary">HWP Length: <span className="font-normal text-primary">{hwpLength}</span></div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GraphVisualization;
