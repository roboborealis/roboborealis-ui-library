'use client';

import ReactECharts from 'echarts-for-react';
import { useMemo } from 'react';

import { RoboFadeIn } from '@/animations';
import { cn } from '@/lib/utils';

import { getChartColors, useRoboEChartsTheme } from './echarts-theme';

export interface RoboScatterSeries {
  name: string;
  data: [number, number][];
}

export interface RoboScatterChartProps {
  series: RoboScatterSeries[];
  xAxisLabel?: string;
  yAxisLabel?: string;
  title?: string;
  /**
   * When true, expects series[0].data as [x, y, colorValue] triples.
   * Enables a continuous visualMap to color points by the 3rd value.
   */
  colorByValue?: boolean;
  colorRange?: [string, string];
  height?: number;
  showLegend?: boolean;
  showTooltip?: boolean;
  isLoading?: boolean;
  className?: string;
  animateEntrance?: boolean;
  'aria-label'?: string;
}

export function RoboScatterChart({
  series,
  xAxisLabel,
  yAxisLabel,
  title,
  colorByValue = false,
  colorRange,
  height = 350,
  showLegend = true,
  showTooltip = true,
  isLoading = false,
  className,
  animateEntrance = false,
  'aria-label': ariaLabel,
}: RoboScatterChartProps) {
  const theme = useRoboEChartsTheme();
  const colors = getChartColors();

  const option = useMemo(() => {
    const grid = {
      top: showLegend && !colorByValue ? 40 : 16,
      right: 16,
      bottom: xAxisLabel ? 56 : 40,
      left: yAxisLabel ? 64 : 48,
      containLabel: true,
    };

    const xAxis = {
      type: 'value' as const,
      name: xAxisLabel,
      nameLocation: 'middle' as const,
      nameGap: 30,
    };

    const yAxis = {
      type: 'value' as const,
      name: yAxisLabel,
      nameLocation: 'middle' as const,
      nameGap: 40,
    };

    if (colorByValue) {
      const rawData = series[0]?.data ?? [];
      const colorValues = rawData.map((d) => (d as unknown as number[])[2] ?? 0);
      const minVal = colorValues.length ? Math.min(...colorValues) : 0;
      const maxVal = colorValues.length ? Math.max(...colorValues) : 1;
      const defaultRange: [string, string] = [colors[4] ?? '#94a3b8', colors[0] ?? '#f97316'];

      return {
        ...(title ? { title: { text: title, left: 'center', top: 4 } } : {}),
        ...(showTooltip
          ? {
              tooltip: {
                trigger: 'item' as const,
                formatter: (p: { value: number[] }) => {
                  const [x, y, val] = p.value;
                  return `x: <b>${x}</b><br/>y: <b>${y}</b><br/>value: <b>${val}</b>`;
                },
              },
            }
          : {}),
        grid,
        xAxis,
        yAxis,
        visualMap: {
          min: minVal,
          max: maxVal,
          calculable: true,
          orient: 'horizontal',
          bottom: 0,
          left: 'center',
          inRange: {
            color: colorRange ?? defaultRange,
          },
        },
        series: [
          {
            type: 'scatter',
            data: rawData,
            symbolSize: 8,
          },
        ],
      };
    }

    return {
      ...(title ? { title: { text: title, left: 'center', top: 4 } } : {}),
      ...(showTooltip
        ? {
            tooltip: {
              trigger: 'item' as const,
              formatter: (p: { seriesName: string; value: number[] }) => {
                const [x, y] = p.value;
                return `${p.seriesName}<br/>x: <b>${x}</b><br/>y: <b>${y}</b>`;
              },
            },
          }
        : {}),
      legend: showLegend
        ? { show: true, top: 8, data: series.map((s) => s.name) }
        : { show: false },
      grid,
      xAxis,
      yAxis,
      series: series.map((s, i) => ({
        type: 'scatter',
        name: s.name,
        data: s.data,
        symbolSize: 8,
        itemStyle: {
          color: colors[i % colors.length],
        },
      })),
    };
  }, [series, xAxisLabel, yAxisLabel, title, colorByValue, colorRange, colors, showLegend, showTooltip]);

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
      aria-label={ariaLabel ?? title ?? 'Scatter chart'}
    >
      <ReactECharts option={option} theme={theme} style={{ height }} notMerge />
    </div>
  );
  return animateEntrance ? <RoboFadeIn preset='standard'>{chart}</RoboFadeIn> : chart;
}
