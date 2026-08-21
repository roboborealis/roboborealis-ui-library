'use client';

import ReactECharts from 'echarts-for-react';
import { useMemo } from 'react';

import { cn } from '@/lib/utils';
import { RoboFadeIn } from '@/animations';

import { getChartColors, useRoboEChartsTheme } from './echarts-theme';

export interface RoboFunnelStage {
  name: string;
  value: number;
}

export interface RoboFunnelChartProps {
  stages: RoboFunnelStage[];
  /** Sort order. Default: 'descending' (classic funnel, largest at top) */
  sort?: 'descending' | 'ascending' | 'none';
  /** Show percentage labels instead of raw counts */
  showPercentage?: boolean;
  title?: string;
  height?: number;
  isLoading?: boolean;
  className?: string;
  'aria-label'?: string;
  /** Fade chart in on mount. Default: false */
  animateEntrance?: boolean;
}

export function RoboFunnelChart({
  stages,
  sort = 'descending',
  showPercentage = false,
  title,
  height = 380,
  isLoading = false,
  className,
  'aria-label': ariaLabel,
  animateEntrance = false,
}: RoboFunnelChartProps) {
  const theme = useRoboEChartsTheme();
  const colors = getChartColors();

  const option = useMemo(
    () => ({
      ...(title ? { title: { text: title, left: 'center', top: 4 } } : {}),
      tooltip: {
        trigger: 'item',
        formatter: showPercentage
          ? (p: { name: string; value: number }) => {
              const total = stages[0]?.value ?? 1;
              const pct = ((p.value / total) * 100).toFixed(1);
              return `${p.name}: <b>${p.value}</b> (${pct}%)`;
            }
          : '{b}: <b>{c}</b>',
      },
      series: [
        {
          type: 'funnel',
          left: '10%',
          width: '80%',
          top: title ? 44 : 16,
          bottom: 16,
          sort,
          gap: 2,
          label: {
            show: true,
            position: 'inside',
            formatter: showPercentage
              ? (p: { name: string; value: number }) => {
                  const total = stages[0]?.value ?? 1;
                  const pct = ((p.value / total) * 100).toFixed(0);
                  return `${p.name}\n${pct}%`;
                }
              : '{b}\n{c}',
            color: '#fff',
          },
          emphasis: {
            label: { fontSize: 14, fontWeight: 'bold' },
          },
          itemStyle: {
            borderColor: 'transparent',
            borderWidth: 2,
          },
          data: stages.map((s, i) => ({
            name: s.name,
            value: s.value,
            itemStyle: { color: colors[i % colors.length] },
          })),
        },
      ],
    }),
    [stages, sort, showPercentage, title, colors],
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
      aria-label={ariaLabel ?? title ?? 'Funnel chart'}
    >
      <ReactECharts option={option} theme={theme} style={{ height }} notMerge />
    </div>
  );
  return animateEntrance ? <RoboFadeIn preset='standard'>{chart}</RoboFadeIn> : chart;
}
