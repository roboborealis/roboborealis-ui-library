'use client';

import ReactECharts from 'echarts-for-react';
import { useMemo } from 'react';

import { cn } from '@/lib/utils';
import { RoboFadeIn } from '@/animations';

import { getChartColors, useRoboEChartsTheme } from './echarts-theme';

export type RoboGaugeVariant = 'arc' | 'ring' | 'grade';

export interface RoboGaugeColorThreshold {
  value: number;
  color: string;
}

export interface RoboGaugeChartProps {
  value: number;
  variant?: RoboGaugeVariant;
  min?: number;
  max?: number;
  name?: string;
  unit?: string;
  colorThresholds?: RoboGaugeColorThreshold[];
  height?: number;
  isLoading?: boolean;
  className?: string;
  'aria-label'?: string;
  /** Fade chart in on mount. Default: false */
  animateEntrance?: boolean;
}

export function RoboGaugeChart({
  value,
  variant = 'arc',
  min = 0,
  max = 100,
  name,
  unit,
  colorThresholds,
  height = 280,
  isLoading = false,
  className,
  'aria-label': ariaLabel,
  animateEntrance = false,
}: RoboGaugeChartProps) {
  const theme = useRoboEChartsTheme();
  const colors = getChartColors();

  const option = useMemo(() => {
    const fg =
      typeof document !== 'undefined'
        ? getComputedStyle(document.documentElement).getPropertyValue('--foreground').trim()
        : '#ffffff';
    const mutedFg =
      typeof document !== 'undefined'
        ? getComputedStyle(document.documentElement).getPropertyValue('--muted-foreground').trim()
        : '#888';

    const detailFormatter = unit ? `{value}${unit}` : '{value}';

    if (variant === 'ring') {
      return {
        series: [
          {
            type: 'gauge',
            startAngle: 90,
            endAngle: 90 - 360,
            min,
            max,
            radius: '80%',
            detail: { formatter: detailFormatter, fontSize: 28, color: fg },
            title: { offsetCenter: [0, '80%'], color: mutedFg },
            data: [{ value, name }],
            pointer: { show: false },
            progress: { show: true, width: 20 },
            axisLine: { lineStyle: { width: 20, color: [[1, 'rgba(128,128,128,0.15)']] } },
            axisTick: { show: false },
            splitLine: { show: false },
            axisLabel: { show: false },
          },
        ],
      };
    }

    if (variant === 'grade') {
      const normalizedThresholds: [number, string][] = (colorThresholds ?? [])
        .map((t): [number, string] => [t.value / (max || 100), t.color])
        .sort((a, b) => a[0] - b[0]);

      const lastVal = normalizedThresholds[normalizedThresholds.length - 1]?.[0] ?? 0;
      if (lastVal < 1) {
        normalizedThresholds.push([1, '#ccc']);
      }

      return {
        series: [
          {
            type: 'gauge',
            startAngle: 200,
            endAngle: -20,
            min,
            max,
            detail: { formatter: detailFormatter, fontSize: 24, color: fg },
            title: { offsetCenter: [0, '70%'], color: mutedFg },
            data: [{ value, name }],
            axisLine: { lineStyle: { width: 18, color: normalizedThresholds } },
            progress: { show: false },
            pointer: { show: true },
            axisTick: { show: false },
            splitLine: { show: true },
            axisLabel: { show: true, color: mutedFg },
          },
        ],
      };
    }

    return {
      series: [
        {
          type: 'gauge',
          startAngle: 200,
          endAngle: -20,
          min,
          max,
          detail: { formatter: detailFormatter, fontSize: 24, color: fg },
          title: { offsetCenter: [0, '70%'], color: mutedFg },
          data: [{ value, name }],
          axisLine: { lineStyle: { width: 18, color: [[1, colors[0]]] } },
          progress: { show: true, width: 18 },
          pointer: { show: true },
          axisTick: { show: false },
          splitLine: { show: false },
          axisLabel: { show: false },
        },
      ],
    };
  }, [value, variant, min, max, name, unit, colorThresholds, colors]);

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
      aria-label={ariaLabel ?? name ?? 'Gauge chart'}
    >
      <ReactECharts option={option} theme={theme} style={{ height }} notMerge />
    </div>
  );
  return animateEntrance ? <RoboFadeIn preset='standard'>{chart}</RoboFadeIn> : chart;
}
