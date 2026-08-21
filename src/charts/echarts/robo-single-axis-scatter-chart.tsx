'use client';

import ReactECharts from 'echarts-for-react';
import { useMemo } from 'react';

import { cn } from '@/lib/utils';
import { RoboFadeIn } from '@/animations';

import { getChartColors, useRoboEChartsTheme } from './echarts-theme';

export interface RoboSingleAxisScatterChartSeries {
  name: string;
  /** [ISO timestamp or category string, numeric value] pairs */
  data: [string, number][];
}

export interface RoboSingleAxisScatterChartProps {
  series: RoboSingleAxisScatterChartSeries[];
  title?: string;
  height?: number;
  /** Min symbol size in px */
  minSymbolSize?: number;
  /** Max symbol size in px */
  maxSymbolSize?: number;
  isLoading?: boolean;
  className?: string;
  'aria-label'?: string;
  /** Fade chart in on mount. Default: false */
  animateEntrance?: boolean;
}

export function RoboSingleAxisScatterChart({
  series,
  title,
  height = 420,
  minSymbolSize = 4,
  maxSymbolSize = 28,
  isLoading = false,
  className,
  'aria-label': ariaLabel,
  animateEntrance = false,
}: RoboSingleAxisScatterChartProps) {
  const theme = useRoboEChartsTheme();
  const colors = getChartColors();

  const allValues = useMemo(
    () => series.flatMap((s) => s.data.map((d) => d[1])),
    [series],
  );
  const maxVal = useMemo(() => Math.max(...allValues, 1), [allValues]);

  // Determine axis type: if any value looks like a date string, use 'time'; else 'category'
  const axisType = useMemo<'time' | 'category'>(() => {
    const sample = series[0]?.data[0]?.[0] ?? '';
    return /^\d{4}-\d{2}-\d{2}/.test(sample) ? 'time' : 'category';
  }, [series]);

  const count = series.length || 1;
  const rowH = Math.floor(80 / count);

  const singleAxis = useMemo(
    () =>
      series.map((s, i) => ({
        idx: i,
        type: axisType,
        name: s.name,
        nameLocation: 'end' as const,
        nameGap: 8,
        top: `${8 + i * rowH}%`,
        height: `${rowH - 4}%`,
        axisLabel: { interval: 'auto', fontSize: 10 },
      })),
    [series, axisType, rowH],
  );

  const option = useMemo(
    () => ({
      ...(title ? { title: { text: title, left: 'center', top: 4 } } : {}),
      tooltip: {
        trigger: 'axis',
        formatter: (params: unknown) => {
          const items = Array.isArray(params) ? params : [params];
          const p = items[0] as { seriesName?: string; value?: [string, number] };
          if (!p?.value) return '';
          return `${p.seriesName}: <b>${p.value[1]}</b>`;
        },
      },
      singleAxis,
      series: series.map((s, i) => ({
        name: s.name,
        type: 'scatter',
        singleAxisIndex: i,
        coordinateSystem: 'singleAxis',
        data: s.data,
        symbolSize: (val: [string, number]) => {
          const ratio = val[1] / maxVal;
          return minSymbolSize + ratio * (maxSymbolSize - minSymbolSize);
        },
        itemStyle: { color: colors[i % colors.length], opacity: 0.7 },
        emphasis: { itemStyle: { opacity: 1 } },
      })),
    }),
    [series, singleAxis, title, colors, maxVal, minSymbolSize, maxSymbolSize],
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
      aria-label={ariaLabel ?? title ?? 'Single axis scatter chart'}
    >
      <ReactECharts option={option} theme={theme} style={{ height }} notMerge />
    </div>
  );
  return animateEntrance ? <RoboFadeIn preset='standard'>{chart}</RoboFadeIn> : chart;
}
