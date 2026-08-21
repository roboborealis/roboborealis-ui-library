import * as React from 'react';

import { motion, useReducedMotion } from 'motion/react';

import { cn } from '@/lib/utils';
import type { RoboOsintEntity, RoboOsintRelationship } from '@/visualizations/types';
import type { RoboTypeRegistry } from '@/visualizations/registry';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface RoboCorrelationMatrixProps {
  entities: RoboOsintEntity[];
  relationships: RoboOsintRelationship[];
  registry: RoboTypeRegistry;
  /** Max cell size in pixels. Default: 48 */
  maxCellSize?: number;
  /** Called when a cell is clicked */
  onCellClick?: (sourceType: string, targetType: string, count: number) => void;
  /** Animate cells cascading in on mount. Respects prefers-reduced-motion. Default: true */
  animated?: boolean;
  className?: string;
}

// ---------------------------------------------------------------------------
// Matrix computation
// ---------------------------------------------------------------------------

interface MatrixData {
  types: string[];
  matrix: number[][];
  maxCount: number;
}

function buildMatrix(
  entities: RoboOsintEntity[],
  relationships: RoboOsintRelationship[],
): MatrixData {
  // Collect unique entity types, preserving insertion order.
  const typeSet = new Set<string>();
  for (const e of entities) {
    typeSet.add(e.type);
  }
  const types = Array.from(typeSet);
  const typeIndex = new Map<string, number>();
  types.forEach((t, i) => typeIndex.set(t, i));

  const n = types.length;
  const matrix: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));

  // Build entity id → type lookup.
  const entityTypeMap = new Map<string, string>();
  for (const e of entities) {
    entityTypeMap.set(e.id, e.type);
  }

  for (const rel of relationships) {
    const srcType = entityTypeMap.get(rel.sourceEntityId);
    const tgtType = entityTypeMap.get(rel.targetEntityId);
    if (!srcType || !tgtType) continue;
    const si = typeIndex.get(srcType);
    const ti = typeIndex.get(tgtType);
    if (si === undefined || ti === undefined) continue;
    matrix[si][ti] += 1;
  }

  let maxCount = 0;
  for (const row of matrix) {
    for (const val of row) {
      if (val > maxCount) maxCount = val;
    }
  }

  return { types, matrix, maxCount };
}

// ---------------------------------------------------------------------------
// RoboCorrelationMatrix
// ---------------------------------------------------------------------------

const LABEL_WIDTH = 96;
const HEADER_HEIGHT = 80;
const LEGEND_HEIGHT = 36;
const PADDING = 8;

/**
 * RoboCorrelationMatrix — SVG heatmap showing relationship density between
 * entity types. Cell colour intensity scales with the relationship count.
 *
 * @example
 * ```tsx
 * <RoboCorrelationMatrix
 *   entities={entities}
 *   relationships={relationships}
 *   registry={registry}
 *   onCellClick={(src, tgt, n) => filterBy(src, tgt)}
 * />
 * ```
 */
function RoboCorrelationMatrix({
  entities,
  relationships,
  registry,
  maxCellSize = 48,
  onCellClick,
  animated = true,
  className,
}: RoboCorrelationMatrixProps) {
  const reduced = useReducedMotion();
  const shouldAnimate = animated && !reduced;
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = React.useState(480);

  // Observe container width for responsive cell sizing.
  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width;
      if (w) setContainerWidth(w);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { types, matrix, maxCount } = React.useMemo(
    () => buildMatrix(entities, relationships),
    [entities, relationships],
  );

  const n = types.length;

  if (n === 0) {
    return (
      <div className={cn('flex items-center justify-center p-8 text-sm text-[var(--muted-foreground)]', className)}>
        No entity data to display.
      </div>
    );
  }

  const availableWidth = containerWidth - LABEL_WIDTH - PADDING * 2;
  const cellSize = Math.min(maxCellSize, Math.max(16, Math.floor(availableWidth / n)));
  const gridWidth = cellSize * n;
  const svgWidth = LABEL_WIDTH + gridWidth + PADDING;
  const svgHeight = HEADER_HEIGHT + cellSize * n + LEGEND_HEIGHT + PADDING;

  return (
    <div ref={containerRef} className={cn('w-full overflow-x-auto', className)}>
      <svg
        width={svgWidth}
        height={svgHeight}
        role="img"
        aria-label="Correlation matrix showing relationship density between entity types"
      >
        {/* Column headers (rotated) */}
        {types.map((type, colIdx) => {
          const config = registry.getEntityTypeConfig(type);
          const x = LABEL_WIDTH + colIdx * cellSize + cellSize / 2;
          return (
            <g key={`col-header-${type}`}>
              <text
                x={0}
                y={0}
                transform={`translate(${x}, ${HEADER_HEIGHT - 8}) rotate(-45)`}
                textAnchor="start"
                fontSize={11}
                fill="var(--foreground)"
                fontFamily="var(--font-sans, system-ui)"
              >
                {config.label}
              </text>
            </g>
          );
        })}

        {/* Row headers + cells */}
        {types.map((rowType, rowIdx) => {
          const rowConfig = registry.getEntityTypeConfig(rowType);
          const y = HEADER_HEIGHT + rowIdx * cellSize;

          return (
            <g key={`row-${rowType}`}>
              {/* Row label */}
              <text
                x={LABEL_WIDTH - 6}
                y={y + cellSize / 2}
                textAnchor="end"
                dominantBaseline="middle"
                fontSize={11}
                fill="var(--foreground)"
                fontFamily="var(--font-sans, system-ui)"
              >
                {rowConfig.label}
              </text>

              {/* Cells */}
              {types.map((colType, colIdx) => {
                const count = matrix[rowIdx][colIdx];
                const x = LABEL_WIDTH + colIdx * cellSize;
                const opacity = maxCount > 0 ? count / maxCount : 0;
                const isZero = count === 0;
                const isClickable = count > 0 && onCellClick != null;
                const cellDelay = shouldAnimate ? (rowIdx * n + colIdx) * 0.015 : undefined;
                const cx = x + 1 + (cellSize - 2) / 2;
                const cy = y + 1 + (cellSize - 2) / 2;
                const cellRect = cellDelay !== undefined ? (
                  <motion.rect
                    x={x + 1}
                    y={y + 1}
                    width={cellSize - 2}
                    height={cellSize - 2}
                    fill={isZero ? 'var(--muted)' : 'var(--primary)'}
                    fillOpacity={isZero ? 1 : opacity}
                    rx={2}
                    initial={{ opacity: 0, scale: 0.75 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{ transformOrigin: `${cx}px ${cy}px` }}
                    transition={{ duration: 0.18, delay: cellDelay, ease: [0, 0, 0.2, 1] }}
                  />
                ) : (
                  <rect
                    x={x + 1}
                    y={y + 1}
                    width={cellSize - 2}
                    height={cellSize - 2}
                    fill={isZero ? 'var(--muted)' : 'var(--primary)'}
                    fillOpacity={isZero ? 1 : opacity}
                    rx={2}
                  />
                );

                return (
                  // SVG shape elements (<rect>) don't support aria-* per spec — role/aria-label go on the <g> wrapper
                  <g
                    key={`cell-${rowType}-${colType}`}
                    role={isClickable ? 'button' : undefined}
                    aria-label={
                      isClickable
                        ? `${rowConfig.label} to ${registry.getEntityTypeConfig(colType).label}: ${count} relationship${count !== 1 ? 's' : ''}`
                        : undefined
                    }
                    tabIndex={isClickable ? 0 : undefined}
                    onClick={isClickable ? () => onCellClick(rowType, colType, count) : undefined}
                    onKeyDown={
                      isClickable
                        ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onCellClick(rowType, colType, count); } }
                        : undefined
                    }
                    style={{ cursor: isClickable ? 'pointer' : 'default' }}
                  >
                    {cellRect}

                    {/* Tooltip via SVG title */}
                    <title>
                      {`${rowConfig.label} → ${registry.getEntityTypeConfig(colType).label}: ${count}`}
                    </title>

                    {/* Count label — only when cell is large enough and non-zero */}
                    {count > 0 && cellSize >= 24 && (
                      <text
                        x={x + cellSize / 2}
                        y={y + cellSize / 2}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize={Math.min(11, cellSize * 0.35)}
                        fill={opacity > 0.5 ? 'var(--primary-foreground)' : 'var(--foreground)'}
                        fontFamily="var(--font-sans, system-ui)"
                        style={{ pointerEvents: 'none' }}
                      >
                        {count}
                      </text>
                    )}
                  </g>
                );
              })}
            </g>
          );
        })}

        {/* Legend */}
        {maxCount > 0 && (() => {
          const legendY = HEADER_HEIGHT + cellSize * n + PADDING + 4;
          const legendWidth = Math.min(160, gridWidth);
          const legendX = LABEL_WIDTH;
          const steps = 5;

          return (
            <g>
              <text
                x={legendX}
                y={legendY}
                fontSize={10}
                fill="var(--muted-foreground)"
                fontFamily="var(--font-sans, system-ui)"
              >
                Relationship count
              </text>
              {Array.from({ length: steps }).map((_, i) => {
                const t = i / (steps - 1);
                const cellW = legendWidth / steps;
                return (
                  <rect
                    key={`legend-${i}`}
                    x={legendX + i * cellW}
                    y={legendY + 12}
                    width={cellW}
                    height={12}
                    fill="var(--primary)"
                    fillOpacity={t}
                  />
                );
              })}
              <text
                x={legendX}
                y={legendY + 36}
                fontSize={9}
                fill="var(--muted-foreground)"
                fontFamily="var(--font-sans, system-ui)"
              >
                0
              </text>
              <text
                x={legendX + legendWidth}
                y={legendY + 36}
                fontSize={9}
                textAnchor="end"
                fill="var(--muted-foreground)"
                fontFamily="var(--font-sans, system-ui)"
              >
                {maxCount}
              </text>
            </g>
          );
        })()}
      </svg>
    </div>
  );
}

RoboCorrelationMatrix.displayName = 'RoboCorrelationMatrix';

export { RoboCorrelationMatrix };
