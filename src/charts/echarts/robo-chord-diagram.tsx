'use client';

import ReactECharts from 'echarts-for-react';
import { useMemo } from 'react';

import { cn } from '@/lib/utils';
import { RoboFadeIn } from '@/animations';

import { getChartColors, useRoboEChartsTheme } from './echarts-theme';

export interface RoboChordDiagramProps {
  nodes: { name: string; value?: number }[];
  links: { source: string; target: string; value: number }[];
  /** Controls how edge colors are determined. Default: 'source' */
  lineColorMode?: 'source' | 'target';
  title?: string;
  height?: number;
  isLoading?: boolean;
  className?: string;
  'aria-label'?: string;
  /** Fade chart in on mount. Default: false */
  animateEntrance?: boolean;
}

export function RoboChordDiagram({
  nodes,
  links,
  lineColorMode = 'source',
  title,
  height = 380,
  isLoading = false,
  className,
  'aria-label': ariaLabel,
  animateEntrance = false,
}: RoboChordDiagramProps) {
  const theme = useRoboEChartsTheme();
  const colors = getChartColors();

  const option = useMemo(
    () => ({
      ...(title ? { title: { text: title, left: 'center', top: 4 } } : {}),
      tooltip: { trigger: 'item' },
      legend: { data: nodes.map((n) => n.name), bottom: 0 },
      series: [
        {
          type: 'graph',
          layout: 'circular',
          top: title ? 52 : 16,
          circular: { rotateLabel: true },
          data: nodes.map((n, i) => ({
            name: n.name,
            value: n.value ?? 1,
            symbolSize:
              typeof n.value === 'number'
                ? Math.max(20, Math.min(60, Math.sqrt(n.value) * 2))
                : 30,
            itemStyle: { color: colors[i % colors.length] },
            label: { show: true },
          })),
          links: links.map((l) => ({
            source: l.source,
            target: l.target,
            value: l.value,
            lineStyle: {
              color: lineColorMode,
              width: Math.max(1, Math.min(8, l.value / 5)),
              curveness: 0.3,
              opacity: 0.7,
            },
          })),
          emphasis: { focus: 'adjacency' },
          roam: false,
          lineStyle: {
            color: lineColorMode,
            curveness: 0.3,
            opacity: 0.6,
          },
        },
      ],
    }),
    [nodes, links, lineColorMode, title, colors]
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
      aria-label={ariaLabel ?? title ?? 'Chord diagram chart'}
    >
      <ReactECharts option={option} theme={theme} style={{ height }} notMerge />
    </div>
  );
  return animateEntrance ? <RoboFadeIn preset='standard'>{chart}</RoboFadeIn> : chart;
}
