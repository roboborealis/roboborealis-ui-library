'use client';

import ReactECharts from 'echarts-for-react';
import { useMemo } from 'react';

import { cn } from '@/lib/utils';
import { RoboFadeIn } from '@/animations';

import { getRoboTooltipFormatter, useRoboEChartsTheme } from './echarts-theme';

export interface RoboThemeRiverChartProps {
  /** Tuples of [ISO-date string, numeric value, stream name] */
  data: [string, number, string][];
  title?: string;
  height?: number;
  isLoading?: boolean;
  className?: string;
  'aria-label'?: string;
  /** Fade chart in on mount. Default: false */
  animateEntrance?: boolean;
}

export function RoboThemeRiverChart({
  data,
  title,
  height = 420,
  isLoading = false,
  className,
  'aria-label': ariaLabel,
  animateEntrance = false,
}: RoboThemeRiverChartProps) {
  const theme = useRoboEChartsTheme();

  const legend = useMemo(
    () => [...new Set(data.map((d) => d[2]))].sort(),
    [data],
  );

  const option = useMemo(
    () => ({
      ...(title ? { title: { text: title, left: 'center', top: 4 } } : {}),
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'line' },
        formatter: getRoboTooltipFormatter,
      },
      legend: {
        top: title ? 36 : 8,
        type: 'scroll',
        data: legend,
      },
      singleAxis: {
        top: title ? 80 : 52,
        bottom: 40,
        axisTick: {},
        axisLabel: {},
        type: 'time',
        axisPointer: { animation: true, label: { show: true } },
        splitLine: { show: true, lineStyle: { type: 'dashed', opacity: 0.2 } },
      },
      series: [
        {
          type: 'themeRiver',
          emphasis: { focus: 'series' },
          data,
        },
      ],
    }),
    [data, title, legend],
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
      aria-label={ariaLabel ?? title ?? 'Theme river chart'}
    >
      <ReactECharts option={option} theme={theme} style={{ height }} notMerge />
    </div>
  );
  return animateEntrance ? <RoboFadeIn preset='standard'>{chart}</RoboFadeIn> : chart;
}
