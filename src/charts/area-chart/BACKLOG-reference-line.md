# Backlog: RoboAreaChart — optional reference / marker line

> Note added by an external consumer (the personal **vantage** dashboard, which
> vendors `@roboborealis/components`). Written per permission from the repo owner.
> No code change was made here — this is a feature request for a maintainer to
> pick up through the normal Git workflow.

## What's requested

Add an optional way to draw a **vertical reference line at a specific x-axis
category** on `RoboAreaChart` (`src/charts/area-chart/robo-area-chart.tsx`).

Today `RoboAreaChartProps` is:
`{ data, areas, xAxisKey, height, isLoading, stacked, showGrid, showLegend,
showTooltip, className, aria-label, animateEntrance }` — there is no way to mark a
single category.

## Suggested shape (non-binding)

A `referenceLine?: { x: string | number; label?: string }` prop (or an array for
multiple), rendered via the underlying ECharts `markLine` on the series, themed with
the existing Robo chart tokens (same theming path the component already uses). Keep it
purely additive and optional so no existing usage changes.

## Why (use case)

vantage's finances page has an Average/Monthly view. In Monthly view it wants to mark
the currently-selected month on a 12-month cash-flow area chart. With no reference-line
prop, vantage currently falls back to a text caption ("● Viewing June 2025") beneath the
chart as a stopgap.

## Acceptance

- New prop is optional; omitting it renders exactly as today.
- When set, a labeled vertical line appears at the given x category, theme-aware
  (light/dark) like the rest of the chart.
- Covered by a unit test + a Storybook variant, per this repo's conventions.

When shipped and released, vantage will bump its vendored tarball and replace the
caption with the real line (tracked in vantage `docs/TODO.md §5`).
