'use client';

import ReactECharts from 'echarts-for-react';
import { useMemo } from 'react';

import { cn } from '@/lib/utils';
import { RoboFadeIn } from '@/animations';

import { getChartColors, useRoboEChartsTheme } from './echarts-theme';

export interface RoboMatrixSparklineProps {
  /** Row labels (e.g. satellite types) */
  rows: string[];
  /** Column labels (e.g. metric names) */
  columns: string[];
  /** data[rowIdx][colIdx] = array of values (the sparkline time series) */
  data: number[][][];
  /** X-axis tick labels (optional, not shown by default) */
  xLabels?: string[];
  title?: string;
  /** Height per cell in pixels. Default: 80 */
  cellHeight?: number;
  /** Optional explicit total height override. Defaults to a value computed from rows × cellHeight. */
  height?: number;
  isLoading?: boolean;
  className?: string;
  'aria-label'?: string;
  /** Fade chart in on mount. Default: false */
  animateEntrance?: boolean;
}

const ROW_LABEL_WIDTH_PX = 80;

export function RoboMatrixSparkline({
  rows,
  columns,
  data,
  xLabels,
  title,
  cellHeight = 80,
  height,
  isLoading = false,
  className,
  'aria-label': ariaLabel,
  animateEntrance = false,
}: RoboMatrixSparklineProps) {
  const theme = useRoboEChartsTheme();
  const colors = getChartColors();

  const R = rows.length;
  const C = columns.length;

  const titleOffset = title ? 40 : 12;
  const headerRowOffset = 20;
  const computedHeight =
    height ?? R * cellHeight + titleOffset + headerRowOffset + 8;

  const option = useMemo(() => {
    const cellCount = R * C;
    const seriesLength = data[0]?.[0]?.length ?? 10;
    const xAxisData =
      xLabels ?? Array.from({ length: seriesLength }, (_, i) => String(i));

    return {
      ...(title ? { title: { text: title, left: 'center', top: 4 } } : {}),
      tooltip: { trigger: 'axis' },
      grid: Array.from({ length: cellCount }, (_, idx) => {
        const row = Math.floor(idx / C);
        const col = idx % C;
        const cellW = (100 - 4) / C;
        return {
          left: `${ROW_LABEL_WIDTH_PX + col * (cellW + 4 / C)}px`,
          width: `${cellW - 1}%`,
          top: titleOffset + headerRowOffset + row * cellHeight + 4,
          height: cellHeight - 12,
          show: true,
          borderColor: 'var(--border)',
          borderWidth: 1,
        };
      }),
      xAxis: Array.from({ length: cellCount }, (_, idx) => ({
        type: 'category',
        gridIndex: idx,
        data: xAxisData,
        show: false,
        boundaryGap: false,
      })),
      yAxis: Array.from({ length: cellCount }, (_, idx) => ({
        type: 'value',
        gridIndex: idx,
        show: false,
      })),
      series: Array.from({ length: cellCount }, (_, idx) => {
        const row = Math.floor(idx / C);
        const col = idx % C;
        return {
          type: 'line',
          xAxisIndex: idx,
          yAxisIndex: idx,
          data: data[row]?.[col] ?? [],
          showSymbol: false,
          lineStyle: { width: 1.5, color: colors[col % colors.length] },
          areaStyle: { opacity: 0.1, color: colors[col % colors.length] },
          smooth: true,
        };
      }),
      graphic: [
        ...columns.map((col, colIdx) => {
          const cellW = (100 - 4) / C;
          return {
            type: 'text' as const,
            left: `${ROW_LABEL_WIDTH_PX + colIdx * (cellW + 4 / C) + (cellW - 1) / 2}%`,
            top: titleOffset,
            style: {
              text: col,
              fill: 'var(--muted-foreground)',
              font: '11px sans-serif',
              textAlign: 'center' as const,
            },
          };
        }),
        ...rows.map((row, rowIdx) => ({
          type: 'text' as const,
          left: 0,
          top:
            titleOffset +
            headerRowOffset +
            rowIdx * cellHeight +
            cellHeight / 2 -
            6,
          style: {
            text: row,
            fill: 'var(--muted-foreground)',
            font: '10px sans-serif',
            textAlign: 'left' as const,
            width: ROW_LABEL_WIDTH_PX - 8,
            overflow: 'truncate' as const,
          },
        })),
      ],
    };
  }, [
    rows,
    columns,
    data,
    xLabels,
    title,
    cellHeight,
    colors,
    R,
    C,
    titleOffset,
  ]);

  if (isLoading) {
    return (
      <div
        className={cn('animate-pulse bg-muted rounded', className)}
        style={{ height: height ?? 320 }}
      />
    );
  }

  const chart = (
    <div
      className={cn('w-full', className)}
      role='img'
      aria-label={ariaLabel ?? title ?? 'Matrix sparkline chart'}
    >
      <ReactECharts
        option={option}
        theme={theme}
        style={{ height: computedHeight }}
        notMerge
      />
    </div>
  );
  return animateEntrance ? <RoboFadeIn preset='standard'>{chart}</RoboFadeIn> : chart;
}
