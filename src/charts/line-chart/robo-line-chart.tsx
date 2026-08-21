'use client';

import * as React from 'react';
import ReactECharts from 'echarts-for-react';

import { cn } from '@/lib/utils';
import { RoboFadeIn } from '@/animations';

import { RoboLoading } from '@/feedback/loading/robo-loading';
import {
  getChartColors,
  getRoboTooltipFormatter,
  useRoboEChartsTheme,
} from '../echarts/echarts-theme';

export interface RoboLineChartLine {
  dataKey: string;
  name?: string;
  color?: string;
  strokeWidth?: number;
}

export interface RoboLineChartProps {
  data: Record<string, unknown>[];
  lines: RoboLineChartLine[];
  xAxisKey: string;
  height?: number;
  /** Show a centered loader instead of the chart while data is fetching. */
  isLoading?: boolean;
  showGrid?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
  className?: string;
  'aria-label'?: string;
  /** Fade chart in on mount. Default: false */
  animateEntrance?: boolean;
  ref?: React.Ref<HTMLDivElement>;
}

/**
 * RoboLineChart — Responsive line chart built on ECharts.
 *
 * All colors use CSS variable tokens from the active theme. Pass `lines` to
 * configure each data series. Colors default to `var(--chart-1)` through
 * `var(--chart-6)` in cycle order.
 *
 * @example
 * ```tsx
 * <RoboLineChart
 *   data={[{ month: 'Jan', value: 40 }]}
 *   lines={[{ dataKey: 'value', name: 'Value' }]}
 *   xAxisKey="month"
 * />
 * ```
 */
function RoboLineChart({
  data,
  lines,
  xAxisKey,
  height = 300,
  isLoading = false,
  showGrid = true,
  showLegend = true,
  showTooltip = true,
  className,
  'aria-label': ariaLabel = 'Line chart',
  animateEntrance = false,
  ref,
}: RoboLineChartProps) {
    const theme = useRoboEChartsTheme();
    const colors = getChartColors();

    const option = React.useMemo(
      () => ({
        grid: {
          top: showLegend ? 40 : 16,
          right: 16,
          bottom: 36,
          left: 48,
          containLabel: true,
        },
        legend: showLegend
          ? { data: lines.map((l) => l.name ?? l.dataKey), top: 4 }
          : undefined,
        tooltip: showTooltip
          ? { trigger: 'axis', formatter: getRoboTooltipFormatter }
          : undefined,
        xAxis: {
          type: 'category',
          data: data.map((d) => d[xAxisKey] as string),
          boundaryGap: false,
          splitLine: { show: showGrid },
        },
        yAxis: { type: 'value', splitLine: { show: showGrid } },
        series: lines.map((line, i) => ({
          name: line.name ?? line.dataKey,
          type: 'line',
          data: data.map((d) => d[line.dataKey] as number | null),
          lineStyle: {
            width: line.strokeWidth ?? 2,
            color: line.color ?? colors[i % colors.length],
          },
          itemStyle: { color: line.color ?? colors[i % colors.length] },
          smooth: true,
          showSymbol: false,
        })),
      }),
      [data, lines, xAxisKey, showGrid, showLegend, showTooltip, colors],
    );

    if (isLoading) {
      return (
        <div
          className={cn('flex items-center justify-center w-full', className)}
          style={{ height }}
        >
          <RoboLoading size='sm' />
        </div>
      );
    }

    const chart = (
      <div
        ref={ref}
        aria-label={ariaLabel}
        role='img'
        className={cn('w-full', className)}
        style={{ height }}
      >
        <ReactECharts
          option={option}
          theme={theme}
          style={{ height: '100%' }}
          notMerge
        />
      </div>
    );
    return animateEntrance ? <RoboFadeIn preset='standard'>{chart}</RoboFadeIn> : chart;
}
RoboLineChart.displayName = 'RoboLineChart';

export { RoboLineChart };
