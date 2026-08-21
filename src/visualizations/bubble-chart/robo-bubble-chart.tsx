// ---------------------------------------------------------------------------
// RoboBubbleChart — 2-D scatter plot with sized, colored bubbles
//
// X axis: first numeric dimension (e.g. confidence)
// Y axis: second numeric dimension (e.g. risk score)
// Bubble size: third numeric dimension (e.g. relationship count)
// Bubble color: entity type (passed as part of each item)
//
// All three dimensions are normalized 0–1 by the caller so the component
// stays data-agnostic. Hover shows a tooltip; click is optional.
//
// Usage:
//   <RoboBubbleChart
//     items={entityBubbles}
//     xLabel='Confidence'
//     yLabel='Risk Score'
//     sizeLabel='Relationships'
//   />
// ---------------------------------------------------------------------------

import * as React from 'react';

import { motion, useReducedMotion } from 'motion/react';

import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface RoboBubbleItem {
  id: string;
  /** Primary display label */
  label: string;
  /** X position — normalized 0–1 */
  x: number;
  /** Y position — normalized 0–1 */
  y: number;
  /** Bubble size — normalized 0–1 */
  size: number;
  /** CSS color */
  color: string;
  /** Human-readable type label (for tooltip) */
  typeLabel: string;
  /** Extra tooltip metadata */
  metadata?: Record<string, unknown>;
}

export interface RoboBubbleChartProps {
  items: RoboBubbleItem[];
  xLabel?: string;
  yLabel?: string;
  sizeLabel?: string;
  /** Number of gridline ticks on each axis (default: 5) */
  xTicks?: number;
  yTicks?: number;
  width?: number;
  height?: number;
  onItemClick?: (item: RoboBubbleItem) => void;
  /** Animate bubbles on mount with spring pop. Respects prefers-reduced-motion. Default: true */
  animated?: boolean;
  className?: string;
  ref?: React.Ref<SVGSVGElement>;
}

// ---------------------------------------------------------------------------
// Layout constants — module-level
// ---------------------------------------------------------------------------

const PAD = { top: 16, right: 20, bottom: 52, left: 58 } as const;
const MIN_R = 4;
const MAX_R = 18;

// ---------------------------------------------------------------------------
// Sub-components — module-level (rerender-no-inline-components)
// ---------------------------------------------------------------------------

function AxisGrid({
  xTicks,
  yTicks,
  chartW,
  chartH,
  padLeft,
  padTop,
}: {
  xTicks: number;
  yTicks: number;
  chartW: number;
  chartH: number;
  padLeft: number;
  padTop: number;
}) {
  return (
    <>
      {Array.from({ length: yTicks + 1 }, (_, i) => {
        const frac = i / yTicks;
        const y = padTop + (1 - frac) * chartH;
        return (
          <g key={`yg-${i}`}>
            <line
              x1={padLeft}
              y1={y}
              x2={padLeft + chartW}
              y2={y}
              stroke='var(--border)'
              strokeWidth={1}
            />
            <text
              x={padLeft - 8}
              y={y}
              textAnchor='end'
              dominantBaseline='middle'
              style={{ fill: 'var(--muted-foreground)', fontSize: 10 }}
            >
              {Math.round(frac * 100)}
            </text>
          </g>
        );
      })}
      {Array.from({ length: xTicks + 1 }, (_, i) => {
        const frac = i / xTicks;
        const x = padLeft + frac * chartW;
        return (
          <g key={`xg-${i}`}>
            <line
              x1={x}
              y1={padTop}
              x2={x}
              y2={padTop + chartH}
              stroke='var(--border)'
              strokeWidth={1}
            />
            <text
              x={x}
              y={padTop + chartH + 16}
              textAnchor='middle'
              style={{ fill: 'var(--muted-foreground)', fontSize: 10 }}
            >
              {Math.round(frac * 100)}
            </text>
          </g>
        );
      })}
    </>
  );
}

function Bubble({
  item,
  cx,
  cy,
  r,
  hovered,
  onClick,
  onMouseEnter,
  onMouseLeave,
  xLabel,
  yLabel,
  sizeLabel,
  delay,
}: {
  item: RoboBubbleItem;
  cx: number;
  cy: number;
  r: number;
  hovered: boolean;
  onClick?: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  xLabel: string;
  yLabel: string;
  sizeLabel?: string;
  delay?: number;
}) {
  const title = `${item.label} (${item.typeLabel})\n${xLabel}: ${Math.round(item.x * 100)}\n${yLabel}: ${Math.round(item.y * 100)}${sizeLabel ? `\n${sizeLabel}: ${Math.round(item.size * 100)}` : ''}`;

  const sharedProps = {
    cx: Math.round(cx * 10) / 10,
    cy: Math.round(cy * 10) / 10,
    r,
    fill: item.color,
    fillOpacity: hovered ? 0.88 : 0.6,
    stroke: item.color,
    strokeWidth: hovered ? 2 : 1,
    strokeOpacity: hovered ? 1 : 0.35,
    style: {
      cursor: onClick ? 'pointer' : 'default',
      transition: 'fill-opacity 0.12s, stroke-opacity 0.12s',
      transformOrigin: `${Math.round(cx * 10) / 10}px ${Math.round(cy * 10) / 10}px`,
    },
    onMouseEnter,
    onMouseLeave,
    onClick,
    'aria-label': item.label,
  };

  if (delay === undefined) {
    return <circle {...sharedProps}><title>{title}</title></circle>;
  }
  return (
    <motion.circle
      {...sharedProps}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20, delay }}
    >
      <title>{title}</title>
    </motion.circle>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

function RoboBubbleChart({
  items,
  xLabel = 'X',
  yLabel = 'Y',
  sizeLabel,
  xTicks = 5,
  yTicks = 5,
  width = 560,
  height = 400,
  onItemClick,
  animated = true,
  className,
  ref,
}: RoboBubbleChartProps) {
    const reduced = useReducedMotion();
    const shouldAnimate = animated && !reduced;
    const [hoveredId, setHoveredId] = React.useState<string | null>(null);

    const chartW = width - PAD.left - PAD.right;
    const chartH = height - PAD.top - PAD.bottom;

    // Stable callbacks — use refs so bubbles don't re-render when hoveredId changes
    // (rerender-use-ref-transient-values)
    const hoveredIdRef = React.useRef(hoveredId);
    hoveredIdRef.current = hoveredId;

    // Derived coordinate helpers — computed per render, not stored in state
    function px(x: number) {
      return PAD.left + x * chartW;
    }
    function py(y: number) {
      return PAD.top + (1 - y) * chartH;
    }
    function pr(s: number) {
      return MIN_R + s * (MAX_R - MIN_R);
    }

    // Sort so smaller bubbles render on top (js-tosorted-immutable)
    const sorted = React.useMemo(
      () => [...items].sort((a, b) => b.size - a.size),
      [items],
    );

    return (
      <svg
        ref={ref}
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{
          background: 'var(--card)',
          borderRadius: 'var(--radius)',
          fontFamily: 'var(--font-sans)',
        }}
        className={cn('select-none', className)}
        aria-label='Bubble chart'
        role='img'
      >
        {/* Grid */}
        <AxisGrid
          xTicks={xTicks}
          yTicks={yTicks}
          chartW={chartW}
          chartH={chartH}
          padLeft={PAD.left}
          padTop={PAD.top}
        />

        {/* Axis labels */}
        <text
          x={PAD.left + chartW / 2}
          y={height - 10}
          textAnchor='middle'
          style={{ fill: 'var(--muted-foreground)', fontSize: 11, fontWeight: 500 }}
        >
          {xLabel}
        </text>
        <text
          x={14}
          y={PAD.top + chartH / 2}
          textAnchor='middle'
          transform={`rotate(-90, 14, ${PAD.top + chartH / 2})`}
          style={{ fill: 'var(--muted-foreground)', fontSize: 11, fontWeight: 500 }}
        >
          {yLabel}
        </text>

        {/* Bubbles */}
        {sorted.map((item, i) => (
          <Bubble
            key={item.id}
            item={item}
            cx={px(item.x)}
            cy={py(item.y)}
            r={pr(item.size)}
            hovered={hoveredId === item.id}
            onClick={onItemClick ? () => onItemClick(item) : undefined}
            onMouseEnter={() => setHoveredId(item.id)}
            onMouseLeave={() => setHoveredId(null)}
            xLabel={xLabel}
            yLabel={yLabel}
            sizeLabel={sizeLabel}
            delay={shouldAnimate ? i * 0.04 : undefined}
          />
        ))}

        {/* Hover label */}
        {hoveredId !== null &&
          items.map((item) => {
            if (item.id !== hoveredId) return null;
            const r = pr(item.size);
            return (
              <text
                key={`lbl-${item.id}`}
                x={Math.round(px(item.x))}
                y={Math.round(py(item.y) - r - 5)}
                textAnchor='middle'
                style={{
                  fill: 'var(--foreground)',
                  fontSize: 10,
                  fontWeight: 600,
                  pointerEvents: 'none',
                }}
              >
                {item.label.length > 18 ? item.label.slice(0, 17) + '…' : item.label}
              </text>
            );
          })}
      </svg>
    );
}

RoboBubbleChart.displayName = 'RoboBubbleChart';

export { RoboBubbleChart };
