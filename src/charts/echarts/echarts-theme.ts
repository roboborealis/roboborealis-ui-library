'use client';

import * as echarts from 'echarts/core';

/** Resolve a CSS custom property to its raw string value. */
function cssVar(name: string): string {
  if (typeof document === 'undefined') return '';
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

/**
 * Convert any valid CSS color string (including oklch, hsl, CSS vars, etc.) to
 * a hex string that ECharts' canvas-based color parser can understand.
 *
 * Two-step: resolve CSS custom properties via a DOM span (canvas can't do this),
 * then use a 1×1 canvas to convert any remaining modern color syntax (oklch,
 * lch, lab, color(), etc.) to '#rrggbb'. The canvas fillStyle getter always
 * returns hex or rgba(), regardless of how the color was specified — this
 * handles Chrome's behaviour of preserving oklch in getComputedStyle().color.
 */
export function resolveToRgb(cssColor: string): string {
  if (!cssColor) return '';
  if (typeof document === 'undefined') return cssColor;
  try {
    // Step 1: resolve CSS custom properties — canvas cannot process var(--x).
    let color = cssColor;
    if (cssColor.includes('var(')) {
      const el = document.createElement('span');
      el.style.cssText = `position:absolute;color:${cssColor}`;
      document.documentElement.appendChild(el);
      color = getComputedStyle(el).color || cssColor;
      document.documentElement.removeChild(el);
    }

    // Step 2: if already in a format ECharts zrender understands, return early.
    if (/^(#[0-9a-fA-F]{3,8}|rgba?\()/.test(color)) return color;

    // Step 3: use canvas pixel to normalise oklch / lch / lab / color() / hsl etc.
    // fillStyle getter in Chrome 111+ preserves oklch unchanged; getImageData always
    // returns sRGB bytes so it is the only reliable cross-format conversion path.
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext('2d');
    if (!ctx) return color;
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
    if (a === 0) return color; // invalid or transparent — keep original
    return `rgb(${r},${g},${b})`;
  } catch {
    return cssColor;
  }
}

/** Returns 6 chart colors resolved from CSS variables as rgb() strings. */
export function getChartColors(): string[] {
  return [
    cssVar('--chart-1'),
    cssVar('--chart-2'),
    cssVar('--chart-3'),
    cssVar('--chart-4'),
    cssVar('--chart-5'),
    cssVar('--chart-6'),
  ]
    .filter(Boolean)
    .map(resolveToRgb)
    .filter(Boolean);
}

let _registeredThemeKey = '';

/**
 * Registers and returns the Robo ECharts theme keyed by the current chart-1 value.
 * Call once per component mount. Returns the theme name to pass to ReactECharts.
 */
export function useRoboEChartsTheme(): string {
  if (typeof document === 'undefined') return 'light';

  const colors = getChartColors();
  const themeKey = `robo-${colors[0] ?? 'default'}`;

  if (_registeredThemeKey !== themeKey) {
    _registeredThemeKey = themeKey;

    const bg = resolveToRgb(cssVar('--background'));
    const cardBg = resolveToRgb(cssVar('--card'));
    const border = resolveToRgb(cssVar('--border'));
    const fg = resolveToRgb(cssVar('--foreground'));
    const mutedFg = resolveToRgb(cssVar('--muted-foreground'));

    echarts.registerTheme('robo', {
      color: colors,
      backgroundColor: 'transparent',
      textStyle: {
        fontFamily: 'inherit',
        color: fg,
      },
      label: {
        color: fg,
        textBorderColor: 'transparent',
        textBorderWidth: 0,
      },
      title: {
        textStyle: { color: fg },
        subtextStyle: { color: mutedFg },
      },
      legend: {
        textStyle: { color: fg },
      },
      tooltip: {
        backgroundColor: cardBg || bg,
        borderColor: border,
        textStyle: { color: fg },
      },
      axisPointer: {
        lineStyle: { color: border },
        crossStyle: { color: border },
      },
      grid: {
        borderColor: border,
      },
      categoryAxis: {
        axisLine: { lineStyle: { color: border } },
        axisTick: { lineStyle: { color: border } },
        axisLabel: { color: mutedFg },
        splitLine: { lineStyle: { color: border } },
      },
      valueAxis: {
        axisLine: { lineStyle: { color: border } },
        axisTick: { lineStyle: { color: border } },
        axisLabel: { color: mutedFg },
        splitLine: { lineStyle: { color: border } },
      },
      animation: true,
      animationDuration: 600,
      animationEasing: 'cubicOut',
      animationDurationUpdate: 300,
      animationEasingUpdate: 'cubicOut',
    });
  }

  return 'robo';
}

/** Base tooltip formatter returning Robo-styled HTML tooltip. */
export function getRoboTooltipFormatter(
  params: unknown,
  _ticket: string,
  _callback: unknown,
): string {
  // ECharts passes params as array for multi-series or object for single
  const items = Array.isArray(params) ? params : [params];
  const label =
    (items[0] as { name?: string; axisValue?: string })?.name ??
    (items[0] as { axisValue?: string })?.axisValue ??
    '';

  const rows = items
    .map((p: unknown) => {
      const item = p as { seriesName?: string; value?: unknown; color?: string };
      const val = Array.isArray(item.value) ? item.value[item.value.length - 1] : item.value;
      return `<div style="display:flex;align-items:center;gap:6px">
        <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${item.color ?? ''}"></span>
        <span>${item.seriesName ?? ''}</span>
        <span style="margin-left:auto;font-weight:600">${val ?? ''}</span>
      </div>`;
    })
    .join('');

  return `<div style="min-width:140px"><div style="margin-bottom:4px;font-size:0.75rem;opacity:0.7">${label}</div>${rows}</div>`;
}
