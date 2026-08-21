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

export interface RoboBarChartBar {
  dataKey: string;
  name?: string;
  color?: string;
}

export interface RoboBarChartProps {
  data: Record<string, unknown>[];
  bars: RoboBarChartBar[];
  xAxisKey: string;
  height?: number;
  /** Show a centered loader instead of the chart while data is fetching. */
  isLoading?: boolean;
  /** `'vertical'` (default) = vertical bars; `'horizontal'` = horizontal bars */
  orientation?: 'vertical' | 'horizontal';
  showGrid?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
  stacked?: boolean;
  className?: string;
  'aria-label'?: string;
  /** Fade chart in on mount. Default: false */
  animateEntrance?: boolean;
  ref?: React.Ref<HTMLDivElement>;
}

/**
 * RoboBarChart — Responsive bar chart built on ECharts.
 *
 * Supports both vertical (default) and horizontal orientations, and optional
 * stacking. All colors resolve from the active CSS-variable theme.
 *
 * @example
 * ```tsx
 * <RoboBarChart
 *   data={[{ month: 'Jan', sales: 120 }]}
 *   bars={[{ dataKey: 'sales', name: 'Sales' }]}
 *   xAxisKey="month"
 * />
 * ```
 */
function RoboBarChart({
  data,
  bars,
  xAxisKey,
  height = 300,
  isLoading = false,
  orientation = 'vertical',
  showGrid = true,
  showLegend = true,
  showTooltip = true,
  stacked = false,
  className,
  'aria-label': ariaLabel = 'Bar chart',
  animateEntrance = false,
  ref,
}: RoboBarChartProps) {
    const theme = useRoboEChartsTheme();
    const colors = getChartColors();

    const option = React.useMemo(() => {
      const isHorizontal = orientation === 'horizontal';
      const categories = data.map((d) => d[xAxisKey] as string);

      const categoryAxis = {
        type: 'category' as const,
        data: categories,
        splitLine: { show: false },
      };
      const valueAxis = {
        type: 'value' as const,
        splitLine: { show: showGrid },
      };

      return {
        grid: {
          top: showLegend ? 40 : 16,
          right: 16,
          bottom: 36,
          left: 48,
          containLabel: true,
        },
        legend: showLegend
          ? { data: bars.map((b) => b.name ?? b.dataKey), top: 4 }
          : undefined,
        tooltip: showTooltip
          ? {
              trigger: 'axis',
              axisPointer: { type: 'shadow' },
              formatter: getRoboTooltipFormatter,
            }
          : undefined,
        xAxis: isHorizontal ? valueAxis : categoryAxis,
        yAxis: isHorizontal ? categoryAxis : valueAxis,
        series: bars.map((bar, i) => ({
          name: bar.name ?? bar.dataKey,
          type: 'bar',
          data: data.map((d) => d[bar.dataKey] as number | null),
          stack: stacked ? 'total' : undefined,
          itemStyle: { color: bar.color ?? colors[i % colors.length] },
          barMaxWidth: 48,
        })),
      };
    }, [
      data,
      bars,
      xAxisKey,
      orientation,
      showGrid,
      showLegend,
      showTooltip,
      stacked,
      colors,
    ]);

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
RoboBarChart.displayName = 'RoboBarChart';

export { RoboBarChart };
