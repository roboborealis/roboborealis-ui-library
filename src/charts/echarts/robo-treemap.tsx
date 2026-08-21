'use client';

import ReactECharts from 'echarts-for-react';
import { useMemo } from 'react';

import { cn } from '@/lib/utils';
import { RoboFadeIn } from '@/animations';

import { getChartColors, useRoboEChartsTheme } from './echarts-theme';

export interface RoboTreemapNode {
  name: string;
  value?: number;
  children?: RoboTreemapNode[];
  itemStyle?: { color?: string };
}

export interface RoboTreemapProps {
  data: RoboTreemapNode[];
  title?: string;
  height?: number;
  colorScheme?: 'categorical' | 'sequential';
  isLoading?: boolean;
  className?: string;
  /** Fade chart in on mount. Default: false */
  animateEntrance?: boolean;
}

function collectValues(nodes: RoboTreemapNode[], acc: number[]): void {
  for (const node of nodes) {
    if (typeof node.value === 'number') acc.push(node.value);
    if (node.children) collectValues(node.children, acc);
  }
}

// Annotate parent nodes with sum of children so visualMap has a value to map for every node.
function annotateValues(nodes: RoboTreemapNode[]): RoboTreemapNode[] {
  return nodes.map((n) => {
    if (!n.children || n.children.length === 0) return n;
    const children = annotateValues(n.children);
    const sum = children.reduce((s, c) => s + (c.value ?? 0), 0);
    return { ...n, value: n.value ?? sum, children };
  });
}

export function RoboTreemap({
  data,
  title,
  height = 350,
  colorScheme = 'categorical',
  isLoading = false,
  className,
  animateEntrance = false,
}: RoboTreemapProps) {
  const theme = useRoboEChartsTheme();
  const colors = getChartColors();

  const option = useMemo(() => {
    const sequential = colorScheme === 'sequential';
    const annotated = sequential ? annotateValues(data) : data;
    const vals: number[] = [];
    if (sequential) collectValues(annotated, vals);
    const min = vals.length ? Math.min(...vals) : 0;
    const max = vals.length ? Math.max(...vals) : 1;

    return {
      ...(title ? { title: { text: title, left: 'center', top: 4 } } : {}),
      tooltip: {
        formatter: (p: { name: string; value: number }) =>
          `${p.name}: <b>${p.value}</b>`,
      },
      ...(sequential
        ? {
            visualMap: {
              show: false,
              min,
              max,
              inRange: {
                color: [colors[4] ?? '#94a3b8', colors[0] ?? '#f97316'],
              },
            },
          }
        : {}),
      series: [
        {
          type: 'treemap',
          top: title ? 52 : 16,
          data: annotated,
          ...(sequential ? {} : { color: colors }),
          roam: false,
          nodeClick: false,
          breadcrumb: { show: false },
          label: { show: true, formatter: '{b}' },
          itemStyle: { borderColor: 'transparent', gapWidth: 2 },
        },
      ],
    };
  }, [data, title, colorScheme, colors]);

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
      aria-label={title ?? 'Treemap chart'}
    >
      <ReactECharts option={option} theme={theme} style={{ height }} notMerge />
    </div>
  );
  return animateEntrance ? <RoboFadeIn preset='standard'>{chart}</RoboFadeIn> : chart;
}
