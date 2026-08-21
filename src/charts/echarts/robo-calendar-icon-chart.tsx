'use client';

import ReactECharts from 'echarts-for-react';
import { useMemo } from 'react';

import { cn } from '@/lib/utils';
import { RoboFadeIn } from '@/animations';

import { getChartColors, useRoboEChartsTheme } from './echarts-theme';

export type CelestialIconSymbol = 'satellite' | 'rocket' | 'star' | 'planet';

const CELESTIAL_ICON_PATHS: Record<CelestialIconSymbol, string> = {
  // Satellite: body with two solar-panel wings
  satellite:
    'path://M -3,-3 L 3,-3 L 3,3 L -3,3 Z M -11,-2 L -4,-2 L -4,2 L -11,2 Z M 4,-2 L 11,-2 L 11,2 L 4,2 Z',
  // Rocket: nose cone, fuselage, and fins
  rocket:
    'path://M 0,-12 C 4,-7 5,0 5,6 L -5,6 C -5,0 -4,-7 0,-12 Z M -5,4 L -9,10 L -5,8 Z M 5,4 L 9,10 L 5,8 Z',
  // Star: five-point star
  star: 'path://M 0,-11 L 3,-3 L 11,-3 L 5,2 L 7,10 L 0,5 L -7,10 L -5,2 L -11,-3 L -3,-3 Z',
  // Planet: sphere with an elliptical ring
  planet:
    'path://M 0,-6 A 6,6 0 1,0 0,6 A 6,6 0 1,0 0,-6 M -11,0 A 11,4 0 1,0 11,0 A 11,4 0 1,0 -11,0',
};

export interface RoboCalendarIconChartProps {
  /** [ISO-date 'YYYY-MM-DD', numeric value] tuples. Value drives icon size. */
  data: [string, number][];
  year?: number;
  /** Celestial icon shape. Default: 'satellite' */
  icon?: CelestialIconSymbol;
  title?: string;
  height?: number;
  /** Two-color range for the visualMap gradient [low, high]. */
  colorRange?: [string, string];
  isLoading?: boolean;
  className?: string;
  'aria-label'?: string;
  /** Fade chart in on mount. Default: false */
  animateEntrance?: boolean;
}

export function RoboCalendarIconChart({
  data,
  year,
  icon = 'satellite',
  title,
  height = 200,
  colorRange,
  isLoading = false,
  className,
  'aria-label': ariaLabel,
  animateEntrance = false,
}: RoboCalendarIconChartProps) {
  const theme = useRoboEChartsTheme();
  const colors = getChartColors();

  const derivedYear = useMemo(() => {
    if (year !== undefined) return year;
    const first = data[0]?.[0];
    if (first) {
      const parsed = parseInt(first.substring(0, 4), 10);
      if (!isNaN(parsed)) return parsed;
    }
    return new Date().getFullYear();
  }, [year, data]);

  const vals = useMemo(() => data.map((d) => d[1]), [data]);
  const min = useMemo(() => Math.min(...vals, 0), [vals]);
  const max = useMemo(() => Math.max(...vals, 1), [vals]);

  const option = useMemo(() => {
    const border =
      typeof document !== 'undefined'
        ? getComputedStyle(document.documentElement).getPropertyValue('--border').trim()
        : '#e2e8f0';
    const mutedFg =
      typeof document !== 'undefined'
        ? getComputedStyle(document.documentElement)
            .getPropertyValue('--muted-foreground')
            .trim()
        : '#94a3b8';

    return {
      ...(title ? { title: { text: title, left: 'center', top: 4 } } : {}),
      tooltip: {
        formatter: (p: { data: [string, number] }) =>
          `${p.data[0]}: <b>${p.data[1]}</b>`,
      },
      ...(colorRange
        ? {
            visualMap: {
              min,
              max,
              show: true,
              orient: 'horizontal',
              left: 'center',
              bottom: 4,
              itemWidth: 12,
              itemHeight: 120,
              inRange: { color: colorRange },
            },
          }
        : {}),
      calendar: {
        top: title ? 48 : 16,
        left: 36,
        right: 16,
        bottom: colorRange ? 44 : 24,
        range: String(derivedYear),
        orient: 'horizontal',
        cellSize: ['auto', 16],
        yearLabel: { show: false },
        monthLabel: { nameMap: 'EN', fontSize: 10, color: mutedFg },
        dayLabel: {
          firstDay: 0,
          nameMap: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
          fontSize: 9,
          color: mutedFg,
        },
        itemStyle: { borderWidth: 0.5, borderColor: border },
      },
      series: [
        {
          type: 'scatter',
          coordinateSystem: 'calendar',
          data,
          symbol: CELESTIAL_ICON_PATHS[icon],
          symbolSize: (val: [string, number]) =>
            Math.max(6, Math.min(20, val[1] * 2)),
          itemStyle: {
            color: colorRange ? undefined : (colors[0] ?? '#f97316'),
            opacity: 0.85,
          },
          emphasis: { itemStyle: { opacity: 1 } },
        },
      ],
    };
  }, [data, derivedYear, title, icon, colorRange, colors, min, max]);

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
      aria-label={ariaLabel ?? title ?? 'Calendar icon chart'}
    >
      <ReactECharts option={option} theme={theme} style={{ height }} notMerge />
    </div>
  );
  return animateEntrance ? <RoboFadeIn preset='standard'>{chart}</RoboFadeIn> : chart;
}
