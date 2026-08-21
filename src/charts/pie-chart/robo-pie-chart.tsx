'use client';

import * as React from 'react';
import ReactECharts from 'echarts-for-react';

import { cn } from '@/lib/utils';
import { RoboFadeIn } from '@/animations';

import { RoboLoading } from '@/feedback/loading/robo-loading';
import { getChartColors, useRoboEChartsTheme } from '../echarts/echarts-theme';

export interface RoboPieChartDataItem {
  name: string;
  value: number;
  color?: string;
}

export interface RoboPieChartProps {
  data: RoboPieChartDataItem[];
  /** When true, renders as a donut chart (inner hole) */
  donut?: boolean;
  height?: number;
  /** Show a centered loader instead of the chart while data is fetching. */
  isLoading?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
  showLabels?: boolean;
  className?: string;
  'aria-label'?: string;
  /** Fade chart in on mount. Default: false */
  animateEntrance?: boolean;
  ref?: React.Ref<HTMLDivElement>;
}

/**
 * RoboPieChart — Responsive pie / donut chart built on ECharts.
 *
 * Slice colors resolve from `var(--chart-1)` through `var(--chart-6)` at
 * runtime via `getComputedStyle`. Per-item `color` overrides are supported.
 *
 * @example
 * ```tsx
 * <RoboPieChart
 *   data={[{ name: 'Alpha', value: 60 }, { name: 'Beta', value: 40 }]}
 *   donut
 * />
 * ```
 */
function RoboPieChart({
  data,
  donut = false,
  height = 300,
  isLoading = false,
  showLegend = true,
  showTooltip = true,
  showLabels = false,
  className,
  'aria-label': ariaLabel = 'Pie chart',
  animateEntrance = false,
  ref,
}: RoboPieChartProps) {
    const theme = useRoboEChartsTheme();
    const colors = getChartColors();

    const option = React.useMemo(
      () => ({
        legend: showLegend
          ? { data: data.map((d) => d.name), bottom: 4 }
          : undefined,
        tooltip: showTooltip
          ? { trigger: 'item', formatter: '{b}: {c} ({d}%)' }
          : undefined,
        series: [
          {
            type: 'pie',
            radius: donut ? ['40%', '70%'] : '70%',
            center: ['50%', '50%'],
            label: { show: showLabels },
            labelLine: { show: showLabels },
            data: data.map((item, i) => ({
              name: item.name,
              value: item.value,
              itemStyle: { color: item.color ?? colors[i % colors.length] },
            })),
          },
        ],
      }),
      [data, donut, showLegend, showTooltip, showLabels, colors],
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
RoboPieChart.displayName = 'RoboPieChart';

export { RoboPieChart };
