'use client';

import ReactECharts from 'echarts-for-react';
import { useMemo } from 'react';

import { cn } from '@/lib/utils';
import { RoboFadeIn } from '@/animations';

import { getChartColors, useRoboEChartsTheme } from './echarts-theme';

export interface RoboHeatmapProps {
  data: [x: number, y: number, value: number][];
  xCategories: string[];
  yCategories: string[];
  title?: string;
  height?: number;
  colorRange?: [string, string];
  isLoading?: boolean;
  className?: string;
  /** Fade chart in on mount. Default: false */
  animateEntrance?: boolean;
}

export function RoboHeatmap({
  data,
  xCategories,
  yCategories,
  title,
  height = 350,
  colorRange,
  isLoading = false,
  className,
  animateEntrance = false,
}: RoboHeatmapProps) {
  const theme = useRoboEChartsTheme();
  const colors = getChartColors();
  const min = Math.min(...data.map((d) => d[2]));
  const max = Math.max(...data.map((d) => d[2]));

  const option = useMemo(
    () => ({
      ...(title ? { title: { text: title, left: 'center', top: 4 } } : {}),
      tooltip: {
        position: 'top',
        formatter: (p: { data: number[] }) =>
          `${xCategories[p.data[0]]} / ${yCategories[p.data[1]]}: <b>${p.data[2]}</b>`,
      },
      grid: { top: title ? 52 : 16, right: 80, bottom: 40, left: 60 },
      xAxis: { type: 'category', data: xCategories, splitArea: { show: true } },
      yAxis: { type: 'category', data: yCategories, splitArea: { show: true } },
      visualMap: {
        min,
        max,
        calculable: true,
        orient: 'vertical',
        right: 0,
        top: 'center',
        inRange: {
          color: colorRange ?? [colors[4] ?? '#94a3b8', colors[0] ?? '#f97316'],
        },
      },
      series: [
        {
          type: 'heatmap',
          data,
          label: { show: false },
          emphasis: {
            itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.5)' },
          },
        },
      ],
    }),
    [data, xCategories, yCategories, title, colorRange, colors, min, max],
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
      aria-label={title ?? 'Heatmap chart'}
    >
      <ReactECharts option={option} theme={theme} style={{ height }} notMerge />
    </div>
  );
  return animateEntrance ? <RoboFadeIn preset='standard'>{chart}</RoboFadeIn> : chart;
}
