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

export interface RoboAreaChartArea {
  dataKey: string;
  name?: string;
  color?: string;
  fillOpacity?: number;
}

export interface RoboAreaChartProps {
  data: Record<string, unknown>[];
  areas: RoboAreaChartArea[];
  xAxisKey: string;
  height?: number;
  /** Show a centered loader instead of the chart while data is fetching. */
  isLoading?: boolean;
  stacked?: boolean;
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
 * RoboAreaChart — Responsive area chart built on ECharts.
 *
 * Each area is a smoothed line series with a translucent fill. Colors resolve
 * from the active CSS variable theme. Supports stacking.
 *
 * @example
 * ```tsx
 * <RoboAreaChart
 *   data={[{ month: 'Jan', value: 400 }]}
 *   areas={[{ dataKey: 'value', name: 'Value' }]}
 *   xAxisKey="month"
 * />
 * ```
 */
function RoboAreaChart({
  data,
  areas,
  xAxisKey,
  height = 300,
  isLoading = false,
  stacked = false,
  showGrid = true,
  showLegend = true,
  showTooltip = true,
  className,
  'aria-label': ariaLabel = 'Area chart',
  animateEntrance = false,
  ref,
}: RoboAreaChartProps) {
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
          ? { data: areas.map((a) => a.name ?? a.dataKey), top: 4 }
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
        series: areas.map((area, i) => {
          const color = area.color ?? colors[i % colors.length];
          return {
            name: area.name ?? area.dataKey,
            type: 'line',
            data: data.map((d) => d[area.dataKey] as number | null),
            stack: stacked ? 'total' : undefined,
            lineStyle: { width: 2, color },
            itemStyle: { color },
            areaStyle: { opacity: area.fillOpacity ?? 0.15, color },
            smooth: true,
            showSymbol: false,
          };
        }),
      }),
      [data, areas, xAxisKey, stacked, showGrid, showLegend, showTooltip, colors],
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
RoboAreaChart.displayName = 'RoboAreaChart';

export { RoboAreaChart };
