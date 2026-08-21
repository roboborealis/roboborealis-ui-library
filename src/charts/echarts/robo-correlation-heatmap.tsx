'use client';

import ReactECharts from 'echarts-for-react';
import { useMemo } from 'react';

import { cn } from '@/lib/utils';
import { RoboFadeIn } from '@/animations';

import { getChartColors, useRoboEChartsTheme } from './echarts-theme';

export interface RoboCorrelationHeatmapProps {
  /** Variable names — n labels → n×n matrix */
  labels: string[];
  /** Row-major n×n correlation values (−1 to +1) */
  correlations: number[][];
  title?: string;
  height?: number;
  isLoading?: boolean;
  className?: string;
  'aria-label'?: string;
  /** Fade chart in on mount. Default: false */
  animateEntrance?: boolean;
}

export function RoboCorrelationHeatmap({
  labels,
  correlations,
  title,
  height = 420,
  isLoading = false,
  className,
  'aria-label': ariaLabel,
  animateEntrance = false,
}: RoboCorrelationHeatmapProps) {
  const theme = useRoboEChartsTheme();
  const colors = getChartColors();

  const option = useMemo(
    () => ({
      ...(title ? { title: { text: title, left: 'center', top: 4 } } : {}),
      tooltip: {
        formatter: (p: { data: number[] }) =>
          `${labels[p.data[1]]} ↔ ${labels[p.data[0]]}: <b>${p.data[2].toFixed(2)}</b>`,
      },
      grid: { top: title ? 60 : 20, right: 100, bottom: 60, left: 80 },
      xAxis: {
        type: 'category',
        data: labels,
        axisLabel: { rotate: 30, interval: 0 },
        splitArea: { show: true },
      },
      yAxis: {
        type: 'category',
        data: labels,
        splitArea: { show: true },
      },
      visualMap: {
        min: -1,
        max: 1,
        calculable: true,
        orient: 'vertical',
        right: 0,
        top: 'center',
        inRange: {
          color: [colors[4] ?? '#ef4444', '#94a3b8', colors[0] ?? '#f97316'],
        },
        text: ['+1', '-1'],
      },
      series: [
        {
          type: 'heatmap',
          data: correlations.flatMap((row, yi) =>
            row.map((val, xi) => [xi, yi, val]),
          ),
          label: {
            show: true,
            formatter: (p: { data: number[] }) => p.data[2].toFixed(2),
            fontSize: 11,
          },
          emphasis: {
            itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.5)' },
          },
        },
      ],
    }),
    [labels, correlations, title, colors],
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
      aria-label={ariaLabel ?? title ?? 'Correlation heatmap chart'}
    >
      <ReactECharts option={option} theme={theme} style={{ height }} notMerge />
    </div>
  );
  return animateEntrance ? <RoboFadeIn preset='standard'>{chart}</RoboFadeIn> : chart;
}
