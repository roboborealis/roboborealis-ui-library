'use client';

import ReactECharts from 'echarts-for-react';
import { useMemo } from 'react';

import { cn } from '@/lib/utils';
import { RoboFadeIn } from '@/animations';

import { getChartColors, useRoboEChartsTheme } from './echarts-theme';

export interface RoboParallelAxis {
  dim: number;
  name: string;
}

export interface RoboParallelCoordinatesSeries {
  name: string;
  data: number[][];
}

export interface RoboParallelCoordinatesChartProps {
  series: RoboParallelCoordinatesSeries[];
  axes: RoboParallelAxis[];
  title?: string;
  height?: number;
  /** Opacity of individual lines (0–1). Lower values help reveal density. */
  lineOpacity?: number;
  isLoading?: boolean;
  className?: string;
  'aria-label'?: string;
  /** Fade chart in on mount. Default: false */
  animateEntrance?: boolean;
}

export function RoboParallelCoordinatesChart({
  series,
  axes,
  title,
  height = 440,
  lineOpacity = 0.35,
  isLoading = false,
  className,
  'aria-label': ariaLabel,
  animateEntrance = false,
}: RoboParallelCoordinatesChartProps) {
  const theme = useRoboEChartsTheme();
  const colors = getChartColors();

  const option = useMemo(
    () => ({
      ...(title ? { title: { text: title, left: 'center', top: 4 } } : {}),
      legend: {
        top: title ? 36 : 8,
        type: 'scroll',
        data: series.map((s) => s.name),
      },
      tooltip: { trigger: 'item' },
      parallelAxis: axes.map((ax) => ({
        dim: ax.dim,
        name: ax.name,
        nameTextStyle: { padding: [0, 0, 8, 0] },
      })),
      parallel: {
        top: title ? 80 : 52,
        bottom: 40,
        left: 64,
        right: 64,
        parallelAxisDefault: {
          nameLocation: 'end',
          nameGap: 20,
        },
      },
      series: series.map((s, i) => ({
        name: s.name,
        type: 'parallel',
        lineStyle: {
          color: colors[i % colors.length],
          opacity: lineOpacity,
          width: 1,
        },
        emphasis: {
          lineStyle: { opacity: 1, width: 2 },
        },
        data: s.data,
      })),
    }),
    [series, axes, title, lineOpacity, colors],
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
      aria-label={ariaLabel ?? title ?? 'Parallel coordinates chart'}
    >
      <ReactECharts option={option} theme={theme} style={{ height }} notMerge />
    </div>
  );
  return animateEntrance ? <RoboFadeIn preset='standard'>{chart}</RoboFadeIn> : chart;
}
