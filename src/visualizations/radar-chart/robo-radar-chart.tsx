// ---------------------------------------------------------------------------
// RoboRadarChart — Spider / radar chart for entity threat profiling
//
// Renders N-dimensional data as a filled polygon on a regular-polygon grid.
// Useful for comparing entity profiles across dimensions such as confidence,
// risk score, source coverage, relationship density, and recency.
//
// Supports multiple overlaid profiles for entity comparison.
//
// Mixed-magnitude data: give each `RoboRadarAxis` its own `min`/`max` so axes
// with very different ranges (e.g. $800 vs $40) don't collapse toward the
// centre. A common normalization is `max = 1.25 × the largest plotted value`
// on that axis. See the design docs.
//
// SSR: client component. In the Next.js App Router import it lazily:
//   const RoboRadarChart = dynamic(
//     () => import('@roboborealis/components/visualizations').then((m) => m.RoboRadarChart),
//     { ssr: false },
//   );
//
// Usage:
//   <RoboRadarChart axes={THREAT_AXES} profiles={[profile1, profile2]} />
// ---------------------------------------------------------------------------

import * as React from 'react';

import { motion, useReducedMotion } from 'motion/react';

import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface RoboRadarAxis {
  id: string;
  /** Display label shown at the axis tip */
  label: string;
  /** Minimum value on this axis (default: 0) */
  min?: number;
  /** Maximum value on this axis (default: 100) */
  max?: number;
}

export interface RoboRadarProfile {
  id: string;
  label: string;
  /**
   * CSS color for this profile's polygon. Applied directly as the SVG
   * `fill`/`stroke`, so a `var(--token)` string (e.g. `var(--chart-1)`)
   * resolves against the active theme — no need to pre-resolve to a hex.
   * If you need a concrete color (e.g. for alpha math), resolve it with
   * `resolveToken('--chart-1')` from `@roboborealis/components/visualizations`.
   */
  color: string;
  /** Axis id → raw value mapping */
  values: Record<string, number>;
}

export interface RoboRadarChartProps {
  axes: RoboRadarAxis[];
  profiles: RoboRadarProfile[];
  /** Number of concentric grid rings (default: 4) */
  gridLevels?: number;
  width?: number;
  height?: number;
  /** Animate chart elements on mount. Respects prefers-reduced-motion. Default: true */
  animated?: boolean;
  className?: string;
  ref?: React.Ref<SVGSVGElement>;
}

// ---------------------------------------------------------------------------
// Geometry helpers — module-level so they are never re-created per render
// ---------------------------------------------------------------------------

function axisAngle(i: number, n: number): number {
  // Start at top (−π/2) and go clockwise
  return (i / n) * Math.PI * 2 - Math.PI / 2;
}

function polarXY(
  angle: number,
  radius: number,
  cx: number,
  cy: number,
): { x: number; y: number } {
  return {
    x: cx + radius * Math.cos(angle),
    y: cy + radius * Math.sin(angle),
  };
}

function buildPolygonPoints(
  radii: number[],
  cx: number,
  cy: number,
): string {
  const n = radii.length;
  return radii
    .map((r, i) => {
      const { x, y } = polarXY(axisAngle(i, n), r, cx, cy);
      return `${Math.round(x * 10) / 10},${Math.round(y * 10) / 10}`;
    })
    .join(' ');
}

// Shared easing for opacity animations — matches easeEnter token
const EASE_ENTER = [0, 0, 0.2, 1] as const;

// ---------------------------------------------------------------------------
// Sub-components (module-level — avoids rerender-no-inline-components)
// ---------------------------------------------------------------------------

function GridRing({
  axes,
  level,
  levels,
  maxR,
  cx,
  cy,
  delay,
}: {
  axes: RoboRadarAxis[];
  level: number;
  levels: number;
  maxR: number;
  cx: number;
  cy: number;
  delay?: number;
}) {
  const frac = (level + 1) / levels;
  const r = maxR * frac;
  const pts = buildPolygonPoints(Array(axes.length).fill(r), cx, cy);
  const labelY = cy - r + 3;

  const inner = (
    <>
      <polygon points={pts} fill='none' stroke='var(--border)' strokeWidth={1} />
      <text
        x={cx + 4}
        y={labelY}
        style={{
          fill: 'var(--muted-foreground)',
          fontSize: 8,
          fontWeight: 500,
          stroke: 'var(--card)',
          strokeWidth: 2,
          paintOrder: 'stroke',
        }}
      >
        {Math.round(frac * 100)}%
      </text>
    </>
  );

  if (delay === undefined) return <g>{inner}</g>;
  return (
    <motion.g
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.22, delay, ease: EASE_ENTER }}
    >
      {inner}
    </motion.g>
  );
}

function AxisSpoke({
  axis,
  index,
  count,
  maxR,
  cx,
  cy,
  delay,
}: {
  axis: RoboRadarAxis;
  index: number;
  count: number;
  maxR: number;
  cx: number;
  cy: number;
  delay?: number;
}) {
  const angle = axisAngle(index, count);
  const tip = polarXY(angle, maxR, cx, cy);
  const labelPt = polarXY(angle, maxR + 26, cx, cy);
  const anchor =
    Math.abs(tip.x - cx) < 4 ? 'middle' : tip.x < cx ? 'end' : 'start';

  const inner = (
    <>
      <line
        x1={cx}
        y1={cy}
        x2={Math.round(tip.x * 10) / 10}
        y2={Math.round(tip.y * 10) / 10}
        stroke='var(--border)'
        strokeWidth={1}
      />
      <text
        x={Math.round(labelPt.x)}
        y={Math.round(labelPt.y)}
        textAnchor={anchor}
        dominantBaseline='middle'
        style={{
          fill: 'var(--foreground)',
          fontSize: 12,
          fontWeight: 700,
          stroke: 'var(--background)',
          strokeWidth: 4,
          paintOrder: 'stroke',
        }}
      >
        {axis.label}
      </text>
    </>
  );

  if (delay === undefined) return <g>{inner}</g>;
  return (
    <motion.g
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.22, delay, ease: EASE_ENTER }}
    >
      {inner}
    </motion.g>
  );
}

function ProfilePolygon({
  profile,
  axes,
  maxR,
  cx,
  cy,
  delay,
}: {
  profile: RoboRadarProfile;
  axes: RoboRadarAxis[];
  maxR: number;
  cx: number;
  cy: number;
  delay?: number;
}) {
  const radii = axes.map((axis) => {
    const raw = profile.values[axis.id] ?? 0;
    const mn = axis.min ?? 0;
    const mx = axis.max ?? 100;
    const normalized = Math.max(0, Math.min(1, (raw - mn) / (mx - mn)));
    return maxR * normalized;
  });
  const pts = buildPolygonPoints(radii, cx, cy);

  const polygon = (
    <polygon
      points={pts}
      fill={profile.color}
      fillOpacity={0.18}
      stroke={profile.color}
      strokeWidth={2}
      strokeLinejoin='round'
    />
  );

  if (delay === undefined) return polygon;
  return (
    <motion.g
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      style={{ transformOrigin: `${cx}px ${cy}px` }}
      transition={{ type: 'spring', stiffness: 260, damping: 20, delay }}
    >
      {polygon}
    </motion.g>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

function RoboRadarChart({
  axes,
  profiles,
  gridLevels = 4,
  width = 380,
  height = 380,
  animated = true,
  className,
  ref,
}: RoboRadarChartProps) {
    const reduced = useReducedMotion();
    const shouldAnimate = animated && !reduced;

    const cx = width / 2;
    const cy = height / 2;
    // Leave room for axis labels — 72px margin ensures longest labels clear the card edge
    const maxR = Math.min(width, height) / 2 - 72;
    const n = axes.length;

    // Animation timing: rings stagger in, then spokes, then profiles
    const ringsEnd = (gridLevels - 1) * 0.05 + 0.22;
    const spokesBase = ringsEnd + 0.04;
    const profilesBase = spokesBase + axes.length * 0.03 + 0.12;

    if (n < 3) {
      return (
        <svg
          ref={ref}
          width={width}
          height={height}
          style={{
            overflow: 'visible',
            fontFamily: 'var(--font-sans)',
          }}
          className={cn(className)}
        >
          <rect x={0} y={0} width={width} height={height} rx={6} fill='var(--card)' />
          <text
            x={width / 2}
            y={height / 2}
            textAnchor='middle'
            dominantBaseline='middle'
            style={{ fill: 'var(--muted-foreground)', fontSize: 13 }}
          >
            Need at least 3 axes
          </text>
        </svg>
      );
    }

    const legendTop = height - 12 - profiles.length * 18;

    return (
      <svg
        ref={ref}
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{
          overflow: 'visible',
          fontFamily: 'var(--font-sans)',
        }}
        className={cn('select-none', className)}
        aria-label='Radar chart'
        role='img'
      >
        {/* Card background — as a rect so labels can overflow the SVG bounds */}
        <rect x={0} y={0} width={width} height={height} rx={6} fill='var(--card)' />
        {/* Grid rings */}
        {Array.from({ length: gridLevels }, (_, lvl) => (
          <GridRing
            key={lvl}
            axes={axes}
            level={lvl}
            levels={gridLevels}
            maxR={maxR}
            cx={cx}
            cy={cy}
            delay={shouldAnimate ? lvl * 0.05 : undefined}
          />
        ))}

        {/* Axis spokes */}
        {axes.map((axis, i) => (
          <AxisSpoke
            key={axis.id}
            axis={axis}
            index={i}
            count={n}
            maxR={maxR}
            cx={cx}
            cy={cy}
            delay={shouldAnimate ? spokesBase + i * 0.03 : undefined}
          />
        ))}

        {/* Profile polygons */}
        {profiles.map((profile, i) => (
          <ProfilePolygon
            key={profile.id}
            profile={profile}
            axes={axes}
            maxR={maxR}
            cx={cx}
            cy={cy}
            delay={shouldAnimate ? profilesBase + i * 0.08 : undefined}
          />
        ))}

        {/* Legend */}
        {profiles.length > 1 && (
          <g transform={`translate(12, ${legendTop})`}>
            {profiles.map((p, i) => (
              <g key={p.id} transform={`translate(0, ${i * 18})`}>
                <rect
                  x={0}
                  y={-7}
                  width={12}
                  height={12}
                  fill={p.color}
                  rx={2}
                  fillOpacity={0.85}
                />
                <text
                  x={17}
                  y={3}
                  style={{ fill: 'var(--foreground)', fontSize: 11, fontWeight: 600 }}
                >
                  {p.label}
                </text>
              </g>
            ))}
          </g>
        )}
      </svg>
    );
}

RoboRadarChart.displayName = 'RoboRadarChart';

export { RoboRadarChart };
