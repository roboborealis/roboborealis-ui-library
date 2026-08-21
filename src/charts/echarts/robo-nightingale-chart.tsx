'use client';

import ReactECharts from 'echarts-for-react';
import { useMemo } from 'react';

import { cn } from '@/lib/utils';
import { RoboFadeIn } from '@/animations';

import { useRoboEChartsTheme } from './echarts-theme';

export interface RoboNightingaleChartDataItem {
  name: string;
  value: number;
}

export interface RoboNightingaleChartProps {
  data: RoboNightingaleChartDataItem[];
  title?: string;
  height?: number;
  /** 'area' uses equal-length slices (angle encodes value); 'radius' varies radius. */
  roseType?: 'area' | 'radius';
  isLoading?: boolean;
  className?: string;
  'aria-label'?: string;
  /** Fade chart in on mount. Default: false */
  animateEntrance?: boolean;
}

export function RoboNightingaleChart({
  data,
  title,
  height = 420,
  roseType = 'area',
  isLoading = false,
  className,
  'aria-label': ariaLabel,
  animateEntrance = false,
}: RoboNightingaleChartProps) {
  const theme = useRoboEChartsTheme();

  const option = useMemo(
    () => ({
      ...(title ? { title: { text: title, left: 'center', top: 4 } } : {}),
      tooltip: {
        trigger: 'item',
        formatter: (p: { name: string; value: number; percent: number }) =>
          `${p.name}: <b>${p.value}</b> (${p.percent}%)`,
      },
      legend: {
        top: title ? 36 : 8,
        type: 'scroll',
      },
      series: [
        {
          type: 'pie',
          roseType,
          radius: ['15%', '75%'],
          center: ['50%', '58%'],
          data,
          label: {
            show: true,
            formatter: '{b}: {d}%',
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0,0,0,0.5)',
            },
          },
        },
      ],
    }),
    [data, title, roseType],
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
      aria-label={ariaLabel ?? title ?? 'Nightingale chart'}
    >
      <ReactECharts option={option} theme={theme} style={{ height }} notMerge />
    </div>
  );
  return animateEntrance ? <RoboFadeIn preset='standard'>{chart}</RoboFadeIn> : chart;
}
