'use client';

import ReactECharts from 'echarts-for-react';
import { useMemo } from 'react';

import { cn } from '@/lib/utils';
import { RoboFadeIn } from '@/animations';

import { getChartColors, useRoboEChartsTheme } from './echarts-theme';

export interface RoboSankeyFlowChartProps {
  /** Every node referenced by `links` (as either `source` or `target`) must appear here. */
  nodes: { name: string }[];
  links: { source: string; target: string; value: number }[];
  title?: string;
  height?: number;
  isLoading?: boolean;
  className?: string;
  'aria-label'?: string;
  /** Fade chart in on mount. Default: false */
  animateEntrance?: boolean;
}

/**
 * RoboSankeyFlowChart — general-purpose multi-column value-flow Sankey
 * (e.g. incident type -> severity -> status, or revenue source -> cost
 * category). For entity/relationship graphs use RoboForceGraph or
 * RoboCorrelationMatrix (@roboborealis/components/visualizations) instead
 * — see charts.md's Flow/Network table.
 */
export function RoboSankeyFlowChart({
  nodes,
  links,
  title,
  height = 380,
  isLoading = false,
  className,
  'aria-label': ariaLabel,
  animateEntrance = false,
}: RoboSankeyFlowChartProps) {
  const theme = useRoboEChartsTheme();
  const colors = getChartColors();

  const option = useMemo(
    () => ({
      ...(title ? { title: { text: title, left: 'center', top: 4 } } : {}),
      tooltip: { trigger: 'item', triggerOn: 'mousemove' },
      series: [
        {
          type: 'sankey',
          top: title ? 52 : 16,
          nodeWidth: 16,
          nodeGap: 10,
          emphasis: { focus: 'adjacency' },
          data: nodes.map((n, i) => ({
            name: n.name,
            itemStyle: { color: colors[i % colors.length] },
          })),
          links: links.map((l) => ({
            source: l.source,
            target: l.target,
            value: l.value,
          })),
          lineStyle: { color: 'source', opacity: 0.45, curveness: 0.45 },
          label: { show: true },
        },
      ],
    }),
    [nodes, links, title, colors]
  );

  if (isLoading) {
    return (
      <div
        className={cn('animate-pulse bg-muted rounded', className)}
        style={{ height }}
      />
    );
  }

  const chart = (
    <div
      className={cn('w-full', className)}
      role='img'
      aria-label={ariaLabel ?? title ?? 'Sankey flow chart'}
    >
      <ReactECharts option={option} theme={theme} style={{ height }} notMerge />
    </div>
  );
  return animateEntrance ? <RoboFadeIn preset='standard'>{chart}</RoboFadeIn> : chart;
}
