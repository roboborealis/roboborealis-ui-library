'use client';

import ReactECharts from 'echarts-for-react';
import { useMemo } from 'react';

import { cn } from '@/lib/utils';
import { RoboFadeIn } from '@/animations';

import { getChartColors, useRoboEChartsTheme } from './echarts-theme';

export interface RoboCalendarHeatmapProps {
  /** Each entry's `date` is a 'YYYY-MM-DD' string. */
  data: { date: string; value: number }[];
  year: number;
  title?: string;
  height?: number;
  colorRange?: [string, string];
  isLoading?: boolean;
  className?: string;
  /** Fade chart in on mount. Default: false */
  animateEntrance?: boolean;
}

export function RoboCalendarHeatmap({
  data,
  year,
  title,
  height = 180,
  colorRange,
  isLoading = false,
  className,
  animateEntrance = false,
}: RoboCalendarHeatmapProps) {
  const theme = useRoboEChartsTheme();
  const colors = getChartColors();
  const vals = data.map((d) => d.value);
  const min = Math.min(...vals, 0);
  const max = Math.max(...vals, 1);

  const option = useMemo(
    () => ({
      ...(title ? { title: { text: title, left: 'center', top: 4 } } : {}),
      tooltip: {
        formatter: (p: { data: [string, number] }) =>
          `${p.data[0]}: <b>${p.data[1]}</b>`,
      },
      visualMap: {
        min,
        max,
        show: true,
        orient: 'horizontal',
        left: 'center',
        bottom: 4,
        itemWidth: 12,
        itemHeight: 120,
        inRange: {
          color: colorRange ?? [
            'rgba(148,163,184,0.15)',
            colors[0] ?? '#f97316',
          ],
        },
      },
      calendar: {
        top: title ? 48 : 16,
        left: 36,
        right: 16,
        bottom: 36,
        range: String(year),
        orient: 'horizontal',
        cellSize: ['auto', 'auto'],
        yearLabel: { show: false },
        monthLabel: { nameMap: 'EN', fontSize: 10 },
        dayLabel: {
          firstDay: 0,
          nameMap: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
          fontSize: 9,
        },
        itemStyle: { borderWidth: 0.5, borderColor: 'rgba(128,128,128,0.2)' },
      },
      series: [
        {
          type: 'heatmap',
          coordinateSystem: 'calendar',
          data: data.map((d) => [d.date, d.value]),
        },
      ],
    }),
    [data, year, title, colorRange, colors, min, max],
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
      aria-label={title ?? 'Calendar heatmap'}
    >
      <ReactECharts option={option} theme={theme} style={{ height }} notMerge />
    </div>
  );
  return animateEntrance ? <RoboFadeIn preset='standard'>{chart}</RoboFadeIn> : chart;
}
