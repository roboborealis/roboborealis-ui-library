'use client';

import ReactECharts from 'echarts-for-react';
import { useMemo } from 'react';

import { cn } from '@/lib/utils';
import { RoboFadeIn } from '@/animations';

import { getChartColors, useRoboEChartsTheme } from './echarts-theme';

export interface RoboCirclePackingNode {
  name: string;
  value: number;
  category?: string;
}

export interface RoboCirclePackingProps {
  nodes: RoboCirclePackingNode[];
  title?: string;
  height?: number;
  minBubbleSize?: number;
  maxBubbleSize?: number;
  isLoading?: boolean;
  className?: string;
  'aria-label'?: string;
  /** Fade chart in on mount. Default: false */
  animateEntrance?: boolean;
}

export function RoboCirclePacking({
  nodes,
  title,
  height = 380,
  minBubbleSize = 20,
  maxBubbleSize = 80,
  isLoading = false,
  className,
  'aria-label': ariaLabel,
  animateEntrance = false,
}: RoboCirclePackingProps) {
  const theme = useRoboEChartsTheme();
  const colors = getChartColors();

  const option = useMemo(() => {
    // Deduplicate node names — ECharts graph requires unique names/IDs
    const nameCounts: Record<string, number> = {};
    const deduped = nodes.map((n) => {
      const count = (nameCounts[n.name] = (nameCounts[n.name] ?? 0) + 1);
      return count > 1 ? { ...n, name: `${n.name} (${count})` } : n;
    });

    const categories = Array.from(
      new Set(deduped.map((n) => n.category ?? 'Other'))
    );
    const values = deduped.map((n) => n.value);
    const min = values.length ? Math.min(...values) : 0;
    const max = values.length ? Math.max(...values) : 1;
    const span = max - min || 1;

    return {
      ...(title ? { title: { text: title, left: 'center', top: 4 } } : {}),
      tooltip: { trigger: 'item', formatter: '{b}: {c}' },
      legend: { data: categories, bottom: 0 },
      series: [
        {
          type: 'graph',
          layout: 'force',
          top: title ? 52 : 16,
          animation: true,
          force: {
            repulsion: 200,
            gravity: 0.1,
            edgeLength: 50,
          },
          roam: true,
          draggable: true,
          data: deduped.map((n) => {
            const category = n.category ?? 'Other';
            const categoryIndex = categories.indexOf(category);
            const ratio = (n.value - min) / span;
            return {
              name: n.name,
              value: n.value,
              category: categoryIndex,
              symbolSize:
                minBubbleSize + ratio * (maxBubbleSize - minBubbleSize),
              itemStyle: { color: colors[categoryIndex % colors.length] },
              label: { show: false },
            };
          }),
          links: [],
          categories: categories.map((name, i) => ({
            name,
            itemStyle: { color: colors[i % colors.length] },
          })),
        },
      ],
    };
  }, [nodes, title, minBubbleSize, maxBubbleSize, colors]);

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
      aria-label={ariaLabel ?? title ?? 'Circle packing chart'}
    >
      <ReactECharts option={option} theme={theme} style={{ height }} notMerge />
    </div>
  );
  return animateEntrance ? <RoboFadeIn preset='standard'>{chart}</RoboFadeIn> : chart;
}
