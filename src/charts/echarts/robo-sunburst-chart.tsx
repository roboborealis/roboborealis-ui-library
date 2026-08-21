'use client';

import ReactECharts from 'echarts-for-react';
import { useMemo } from 'react';

import { cn } from '@/lib/utils';
import { RoboFadeIn } from '@/animations';

import { getChartColors, useRoboEChartsTheme } from './echarts-theme';

export interface RoboSunburstChartNode {
  name: string;
  value?: number;
  children?: RoboSunburstChartNode[];
}

export interface RoboSunburstChartProps {
  data: RoboSunburstChartNode[];
  title?: string;
  height?: number;
  rounded?: boolean;
  colorByValue?: boolean;
  isLoading?: boolean;
  className?: string;
  'aria-label'?: string;
  /** Fade chart in on mount. Default: false */
  animateEntrance?: boolean;
}

function collectAllValues(nodes: RoboSunburstChartNode[]): number[] {
  const vals: number[] = [];
  for (const n of nodes) {
    if (n.value !== undefined) vals.push(n.value);
    if (n.children) vals.push(...collectAllValues(n.children));
  }
  return vals;
}

function annotateValues(nodes: RoboSunburstChartNode[]): RoboSunburstChartNode[] {
  return nodes.map((n) => {
    if (!n.children || n.children.length === 0) return n;
    const children = annotateValues(n.children);
    const sum = children.reduce((s, c) => s + (c.value ?? 0), 0);
    return { ...n, value: n.value ?? sum, children };
  });
}

function parseRgb(rgb: string): [number, number, number] {
  const m = /rgb\((\d+),\s*(\d+),\s*(\d+)\)/.exec(rgb);
  return m ? [+m[1]!, +m[2]!, +m[3]!] : [128, 128, 128];
}

function lerpColor(a: [number, number, number], b: [number, number, number], t: number): string {
  return `rgb(${Math.round(a[0] + (b[0] - a[0]) * t)},${Math.round(a[1] + (b[1] - a[1]) * t)},${Math.round(a[2] + (b[2] - a[2]) * t)})`;
}

// ECharts sunburst ignores visualMap on hierarchical nodes — apply color scale via itemStyle.
function applyColorScale(
  nodes: RoboSunburstChartNode[],
  min: number,
  max: number,
  colorA: [number, number, number],
  colorB: [number, number, number],
): RoboSunburstChartNode[] {
  return nodes.map((n) => {
    const t = max > min ? ((n.value ?? min) - min) / (max - min) : 0;
    return {
      ...n,
      itemStyle: { color: lerpColor(colorA, colorB, t) },
      children: n.children ? applyColorScale(n.children, min, max, colorA, colorB) : undefined,
    };
  });
}

export function RoboSunburstChart({
  data,
  title,
  height = 420,
  rounded = false,
  colorByValue = false,
  isLoading = false,
  className,
  'aria-label': ariaLabel,
  animateEntrance = false,
}: RoboSunburstChartProps) {
  const theme = useRoboEChartsTheme();
  const colors = getChartColors();

  const option = useMemo(() => {
    let seriesData = data;
    if (colorByValue) {
      const withValues = annotateValues(data);
      const allVals = collectAllValues(withValues);
      const min = allVals.length ? Math.min(...allVals) : 0;
      const max = allVals.length ? Math.max(...allVals) : 1;
      const colorA = parseRgb(colors[0] ?? 'rgb(249,115,22)');
      const colorB = parseRgb(colors[3] ?? 'rgb(59,130,246)');
      seriesData = applyColorScale(withValues, min, max, colorA, colorB);
    }

    return {
      ...(title ? { title: { text: title, left: 'center', top: 4 } } : {}),
      tooltip: { trigger: 'item' },
      series: [
        {
          type: 'sunburst',
          data: seriesData,
          radius: ['10%', '90%'],
          emphasis: { focus: 'ancestor' },
          itemStyle: rounded
            ? { borderRadius: 6, borderWidth: 2, borderColor: 'transparent' }
            : { borderWidth: 1 },
          levels: [
            {},
            { r0: '10%', r: '40%', label: { rotate: 'tangential' } },
            { r0: '40%', r: '70%', label: { align: 'right' } },
            { r0: '70%', r: '90%', label: { position: 'outside', silent: false }, itemStyle: { borderWidth: 3 } },
          ],
        },
      ],
    };
  }, [data, title, rounded, colorByValue, colors]);

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
      aria-label={ariaLabel ?? title ?? 'Sunburst chart'}
    >
      <ReactECharts option={option} theme={theme} style={{ height }} notMerge />
    </div>
  );
  return animateEntrance ? <RoboFadeIn preset='standard'>{chart}</RoboFadeIn> : chart;
}
