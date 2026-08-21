'use client';

/**
 * Resolve a CSS custom property chart color at runtime.
 *
 * Cycles through `--chart-1` … `--chart-5` by index.
 *
 * @param index - Zero-based color index (auto-wraps at 5)
 * @param el    - Element whose computed style is read (defaults to `<html>`)
 */
export function getChartColor(
  index: number,
  el: Element = document.documentElement,
): string {
  const vars = [
    '--chart-1',
    '--chart-2',
    '--chart-3',
    '--chart-4',
    '--chart-5',
  ];
  return getComputedStyle(el)
    .getPropertyValue(vars[index % vars.length])
    .trim();
}

/**
 * Resolve a single CSS custom property (design token) to its concrete value.
 *
 * SVG visualizations (`RoboRadarChart`, `RoboTimeline`) accept `var(--token)`
 * color strings directly. Use this only when you need the *resolved* value —
 * e.g. to derive an alpha variant or feed a canvas/WebGL API.
 *
 * Client-only: reads `getComputedStyle`, so call it inside an effect or event
 * handler — never during render or on the server.
 *
 * @param token    - CSS custom property name, e.g. `--chart-1`
 * @param fallback - Returned when the token is unset/empty (default: `''`)
 * @param el       - Element whose computed style is read (defaults to `<html>`)
 */
export function resolveToken(
  token: string,
  fallback = '',
  el: Element = document.documentElement,
): string {
  const value = getComputedStyle(el).getPropertyValue(token).trim();
  return value || fallback;
}

/**
 * Return a style object suitable for a Recharts `<Tooltip>` `contentStyle` prop.
 *
 * Colors are read from the active CSS theme variables so the tooltip always
 * matches the current theme / mode.
 *
 * @param el - Element whose computed style is read (defaults to `<html>`)
 */
export function getTooltipStyle(
  el: Element = document.documentElement,
): React.CSSProperties {
  const cs = getComputedStyle(el);
  return {
    backgroundColor: cs.getPropertyValue('--card').trim(),
    border: `1px solid ${cs.getPropertyValue('--border').trim()}`,
    borderRadius: cs.getPropertyValue('--radius').trim(),
    color: cs.getPropertyValue('--foreground').trim(),
    fontSize: '0.875rem',
    boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
  };
}
