// ---------------------------------------------------------------------------
// RoboTimeline — Event swimlane timeline
//
// Renders each lane as a horizontal row with its events plotted on a shared
// time axis. Useful for seeing when things were active, spotting gaps (dark
// periods), and correlating events across lanes.
//
// Two input shapes are supported (pick whichever fits your data):
//   • Domain-neutral — `lanes` + `items` (id / label / timestamp / description).
//     A lane's activity bar (`start`/`end`) defaults to the min/max of that
//     lane's item timestamps, so you rarely need to supply them.
//   • OSINT — `entities` (RoboOsintEntity[]) + `events` (RoboOsintEvent[]).
//     Kept for the OSINT suite; still fully supported.
//
// SSR: this is a client component (it renders via motion/react through the
// `/visualizations` barrel). In the Next.js App Router, import it lazily:
//   const RoboTimeline = dynamic(
//     () => import('@roboborealis/components/visualizations').then((m) => m.RoboTimeline),
//     { ssr: false },
//   );
//
// Usage:
//   <RoboTimeline lanes={lanes} items={items} ariaLabel='Savings milestones' />
//   <RoboTimeline entities={entities} events={events} width={900} />
// ---------------------------------------------------------------------------

import * as React from 'react';

import { motion, useReducedMotion } from 'motion/react';

import { cn } from '@/lib/utils';
import { RoboFadeIn } from '@/animations';

import type { RoboOsintEntity, RoboOsintEvent, RoboOsintSeverity } from '../types';

// ---------------------------------------------------------------------------
// Severity colour table
// ---------------------------------------------------------------------------

const SEV_COLORS: Record<string, string> = {
  info:     '#6b7280',
  low:      '#22c55e',
  medium:   '#f59e0b',
  high:     '#ef4444',
  critical: '#dc2626',
};

function sevColor(s?: RoboOsintSeverity): string {
  return SEV_COLORS[s ?? 'info'] ?? SEV_COLORS.info;
}

// ---------------------------------------------------------------------------
// Layout
// ---------------------------------------------------------------------------

const LABEL_W    = 148;  // lane label column
const PAD_TOP    = 38;   // space for axis labels
const PAD_RIGHT  = 16;
const ROW_H      = 34;
const DOT_R      = 4.5;
const TICK_COUNT = 6;
const LEGEND_H   = 22;

// ---------------------------------------------------------------------------
// Time formatting
// ---------------------------------------------------------------------------

function fmtAxisTime(ts: number, range: number): string {
  const d = new Date(ts);
  if (range <= 86_400_000) {
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  }
  if (range <= 30 * 86_400_000) {
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
  return d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
}

function fmtTooltipTime(ts: number): string {
  return new Date(ts).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// ---------------------------------------------------------------------------
// Public input types
// ---------------------------------------------------------------------------

/**
 * A domain-neutral timeline lane (one horizontal row).
 *
 * `start`/`end` bound the row's activity bar; when omitted they default to the
 * earliest/latest timestamp among this lane's items.
 */
export interface RoboTimelineLane {
  /** Unique identifier — items reference this via `laneId` */
  id: string;
  /** Row label shown in the left column */
  label: string;
  /** Activity-bar start (epoch ms). Defaults to the earliest of this lane's items. */
  start?: number;
  /** Activity-bar end (epoch ms). Defaults to the latest of this lane's items. */
  end?: number;
  /** Accent colour for the lane's activity bar (any CSS colour / `var(--token)`). */
  color?: string;
}

/**
 * A domain-neutral timeline item (one dot on a lane).
 */
export interface RoboTimelineItem {
  /** Unique identifier */
  id: string;
  /** Id of the lane this item belongs to */
  laneId: string;
  /** When the item occurred (epoch ms) */
  timestamp: number;
  /** Short label (used in the tooltip when `description` is absent) */
  label?: string;
  /** Tooltip body */
  description?: string;
  /** Colours the dot via the shared severity scale (info→critical). */
  severity?: RoboOsintSeverity;
  /** Explicit dot colour — overrides `severity`. Accepts a literal or `var(--token)`. */
  color?: string;
}

// ---------------------------------------------------------------------------
// Internal render model — both input shapes normalize to this
// ---------------------------------------------------------------------------

interface RenderItem {
  id: string;
  timestamp: number;
  tooltip: string;
  color: string;
}

interface RenderLane {
  id: string;
  label: string;
  start: number;
  end: number;
  color?: string;
  items: RenderItem[];
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface RoboTimelineProps {
  /** Domain-neutral lanes (rows). Provide with `items`. Takes precedence over `entities`. */
  lanes?: RoboTimelineLane[];
  /** Domain-neutral items (dots). Provide with `lanes`. Takes precedence over `events`. */
  items?: RoboTimelineItem[];
  /** OSINT entities to display as rows (filtered to those with events) */
  entities?: RoboOsintEntity[];
  /** OSINT events to plot on the timeline */
  events?: RoboOsintEvent[];
  /** Override the earliest displayed time */
  startTime?: number;
  /** Override the latest displayed time */
  endTime?: number;
  /** Maximum rows to show (default: 20) */
  maxRows?: number;
  width?: number;
  /** Height is calculated from row count unless overridden */
  height?: number;
  className?: string;
  /** Accessible label for the SVG. Default: 'Event timeline' */
  ariaLabel?: string;
  /** Fade timeline in on mount. Default: false */
  animateEntrance?: boolean;
  /** Animate activity bars growing and event dots popping in. Respects prefers-reduced-motion. Default: true */
  animated?: boolean;
  ref?: React.Ref<SVGSVGElement>;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

function RoboTimeline({
  lanes,
  items,
  entities,
  events,
  startTime,
  endTime,
  maxRows = 20,
  width = 820,
  height,
  className,
  ariaLabel,
  animateEntrance = false,
  animated = true,
  ref,
}: RoboTimelineProps) {
    const reduced = useReducedMotion();
    const shouldAnimate = animated && !reduced;

    // Normalize either input shape (neutral lanes/items, or OSINT entities/events)
    // into a single render model. `lanes`/`items` win when provided.
    const { renderLanes, allTimestamps, showLegend } = React.useMemo(() => {
      const useNeutral = lanes != null || items != null;

      let srcLanes: RoboTimelineLane[] = useNeutral
        ? lanes ?? []
        : (entities ?? []).map((e) => ({
            id: e.id,
            label: e.name,
            start: e.firstSeen,
            end: e.lastSeen,
          }));

      const srcItems: RoboTimelineItem[] = useNeutral
        ? items ?? []
        : (events ?? []).map((ev) => ({
            id: ev.id,
            laneId: ev.entityId,
            timestamp: ev.timestamp,
            description: ev.description,
            severity: ev.severity,
          }));

      // Neutral items supplied without lanes → derive one lane per distinct
      // laneId (label = laneId) so passing `items` alone renders instead of
      // silently showing the empty state.
      if (useNeutral && srcLanes.length === 0 && srcItems.length > 0) {
        const derived = new Map<string, RoboTimelineLane>();
        for (const it of srcItems) {
          if (!derived.has(it.laneId)) {
            derived.set(it.laneId, { id: it.laneId, label: it.laneId });
          }
        }
        srcLanes = [...derived.values()];
      }

      // Group items by lane, resolving each dot's colour and tooltip up front.
      const byLane = new Map<string, RenderItem[]>();
      for (const it of srcItems) {
        const list = byLane.get(it.laneId) ?? [];
        list.push({
          id: it.id,
          timestamp: it.timestamp,
          tooltip: it.description ?? it.label ?? '',
          color: it.color ?? sevColor(it.severity),
        });
        byLane.set(it.laneId, list);
      }

      const built: RenderLane[] = srcLanes.map((ln) => {
        const laneItems = byLane.get(ln.id) ?? [];
        // Fill only the missing bound from item timestamps — preserving any
        // caller-supplied start/end. Iterative min/max (not Math.min(...spread))
        // stays safe for lanes with very many items.
        let start = ln.start;
        let end = ln.end;
        if ((start == null || end == null) && laneItems.length > 0) {
          let mn = Infinity;
          let mx = -Infinity;
          for (const it of laneItems) {
            if (it.timestamp < mn) mn = it.timestamp;
            if (it.timestamp > mx) mx = it.timestamp;
          }
          if (start == null) start = mn;
          if (end == null) end = mx;
        }
        return { id: ln.id, label: ln.label, start: start ?? 0, end: end ?? 0, color: ln.color, items: laneItems };
      });

      // Show the severity legend only when at least one item leans on the
      // severity scale (i.e. no explicit colour) — hidden for neutral data
      // that supplies its own colours, so no OSINT vocabulary leaks in.
      const legend = srcItems.length > 0 && srcItems.some((it) => it.color == null);

      return {
        renderLanes: built,
        allTimestamps: srcItems.map((i) => i.timestamp),
        showLegend: legend,
      };
    }, [lanes, items, entities, events]);

    // Only show lanes that have at least one item; sort by most recent activity
    const visibleLanes = React.useMemo(
      () =>
        renderLanes
          .filter((l) => l.items.length > 0)
          .sort((a, b) => b.end - a.end)
          .slice(0, maxRows),
      [renderLanes, maxRows],
    );

    // Compute time range from items
    const { tStart, tEnd } = React.useMemo(() => {
      if (startTime != null && endTime != null) {
        return { tStart: startTime, tEnd: endTime };
      }
      let mn = Infinity;
      let mx = -Infinity;
      for (const ts of allTimestamps) {
        if (ts < mn) mn = ts;
        if (ts > mx) mx = ts;
      }
      if (!Number.isFinite(mn) || !Number.isFinite(mx)) {
        mn = 0;
        mx = 1;
      }
      const pad = Math.max((mx - mn) * 0.04, 3_600_000);
      return { tStart: startTime ?? mn - pad, tEnd: endTime ?? mx + pad };
    }, [allTimestamps, startTime, endTime]);

    const tRange = Math.max(tEnd - tStart, 1);
    const chartW = width - LABEL_W - PAD_RIGHT;
    const rowCount = visibleLanes.length;
    const legendH = showLegend ? LEGEND_H : 0;
    const svgH = height ?? PAD_TOP + rowCount * ROW_H + legendH + 8;

    function xOf(ts: number): number {
      return LABEL_W + ((ts - tStart) / tRange) * chartW;
    }

    // ---------------------------------------------------------------------------
    // Empty state
    // ---------------------------------------------------------------------------
    if (rowCount === 0) {
      return (
        <svg
          ref={ref}
          width={width}
          height={100}
          style={{
            background: 'var(--card)',
            borderRadius: 'var(--radius)',
            fontFamily: 'var(--font-sans)',
          }}
          className={cn(className)}
        >
          <text
            x={width / 2}
            y={50}
            textAnchor='middle'
            dominantBaseline='middle'
            style={{ fill: 'var(--muted-foreground)', fontSize: 13 }}
          >
            No events to display
          </text>
        </svg>
      );
    }

    // ---------------------------------------------------------------------------
    // Render
    // ---------------------------------------------------------------------------
    const timeline = (
      <svg
        ref={ref}
        width={width}
        height={svgH}
        viewBox={`0 0 ${width} ${svgH}`}
        style={{
          background: 'var(--card)',
          borderRadius: 'var(--radius)',
          fontFamily: 'var(--font-sans)',
        }}
        className={cn('select-none', className)}
        aria-label={ariaLabel ?? 'Event timeline'}
        role='img'
      >
        {/* ----------------------------------------------------------------
            Time axis ticks + vertical grid lines
        ----------------------------------------------------------------- */}
        {Array.from({ length: TICK_COUNT }, (_, i) => {
          const ts = tStart + (i / (TICK_COUNT - 1)) * tRange;
          const x = xOf(ts);
          return (
            <g key={i}>
              <line
                x1={x}
                y1={PAD_TOP - 8}
                x2={x}
                y2={svgH - legendH - 8}
                stroke='var(--border)'
                strokeWidth={1}
              />
              <text
                x={x}
                y={PAD_TOP - 11}
                textAnchor='middle'
                style={{ fill: 'var(--muted-foreground)', fontSize: 10 }}
              >
                {fmtAxisTime(ts, tRange)}
              </text>
            </g>
          );
        })}

        {/* ----------------------------------------------------------------
            Lane rows
        ----------------------------------------------------------------- */}
        {visibleLanes.map((lane, rowIdx) => {
          const y = PAD_TOP + rowIdx * ROW_H + ROW_H / 2;

          return (
            <g key={lane.id}>
              {/* Row separator */}
              {rowIdx > 0 && (
                <line
                  x1={0}
                  y1={PAD_TOP + rowIdx * ROW_H}
                  x2={width}
                  y2={PAD_TOP + rowIdx * ROW_H}
                  stroke='var(--border)'
                  strokeWidth={0.5}
                  strokeOpacity={0.4}
                />
              )}

              {/* Lane label */}
              <text
                x={LABEL_W - 10}
                y={y}
                textAnchor='end'
                dominantBaseline='middle'
                style={{ fill: 'var(--foreground)', fontSize: 11, fontWeight: 500 }}
              >
                {lane.label.length > 19 ? lane.label.slice(0, 18) + '…' : lane.label}
              </text>

              {/* Activity bar: start → end */}
              {(() => {
                const barX = Math.max(LABEL_W, xOf(lane.start));
                const barW = Math.max(
                  2,
                  Math.min(xOf(lane.end), width - PAD_RIGHT) - barX,
                );
                const barFill = lane.color ?? 'var(--muted)';
                const rowDelay = shouldAnimate ? rowIdx * 0.06 : undefined;
                if (rowDelay !== undefined) {
                  return (
                    <motion.rect
                      x={barX}
                      y={y - 2}
                      width={barW}
                      height={4}
                      fill={barFill}
                      rx={2}
                      initial={{ scaleX: 0, opacity: 0 }}
                      animate={{ scaleX: 1, opacity: 1 }}
                      style={{ transformOrigin: `${barX}px ${y}px` }}
                      transition={{ duration: 0.3, delay: rowDelay, ease: [0, 0, 0.2, 1] }}
                    />
                  );
                }
                return (
                  <rect x={barX} y={y - 2} width={barW} height={4} fill={barFill} rx={2} />
                );
              })()}

              {/* Event dots */}
              {lane.items.map((item, dotIdx) => {
                const ex = xOf(item.timestamp);
                if (ex < LABEL_W || ex > width - PAD_RIGHT) return null;
                const dotDelay = shouldAnimate ? rowIdx * 0.06 + dotIdx * 0.03 + 0.1 : undefined;
                if (dotDelay !== undefined) {
                  return (
                    <motion.circle
                      key={item.id}
                      cx={ex}
                      cy={y}
                      r={DOT_R}
                      fill={item.color}
                      stroke='var(--card)'
                      strokeWidth={1.5}
                      style={{ cursor: 'default', transformOrigin: `${ex}px ${y}px` }}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 260, damping: 20, delay: dotDelay }}
                    >
                      <title>{`${lane.label}\n${fmtTooltipTime(item.timestamp)}\n${item.tooltip}`}</title>
                    </motion.circle>
                  );
                }
                return (
                  <circle
                    key={item.id}
                    cx={ex}
                    cy={y}
                    r={DOT_R}
                    fill={item.color}
                    stroke='var(--card)'
                    strokeWidth={1.5}
                    style={{ cursor: 'default' }}
                  >
                    <title>{`${lane.label}\n${fmtTooltipTime(item.timestamp)}\n${item.tooltip}`}</title>
                  </circle>
                );
              })}
            </g>
          );
        })}

        {/* ----------------------------------------------------------------
            Severity legend (shown only when items use the severity scale)
        ----------------------------------------------------------------- */}
        {showLegend && (
          <g transform={`translate(${LABEL_W}, ${svgH - LEGEND_H + 5})`}>
            {Object.entries(SEV_COLORS).map(([sev, color], i) => (
              <g key={sev} transform={`translate(${i * 84}, 0)`}>
                <circle cx={5} cy={5} r={4} fill={color} />
                <text
                  x={13}
                  y={9}
                  style={{
                    fill: 'var(--muted-foreground)',
                    fontSize: 10,
                    textTransform: 'capitalize',
                  }}
                >
                  {sev}
                </text>
              </g>
            ))}
          </g>
        )}
      </svg>
    );
    return animateEntrance ? <RoboFadeIn preset='standard'>{timeline}</RoboFadeIn> : timeline;
}

RoboTimeline.displayName = 'RoboTimeline';

export { RoboTimeline };
