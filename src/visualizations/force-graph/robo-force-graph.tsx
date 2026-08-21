import * as React from 'react';

import { cn } from '@/lib/utils';

import { RoboLoading } from '@/feedback/loading/robo-loading';
import type { RoboOsintEntity, RoboOsintRelationship } from '../types';
import type { RoboTypeRegistry } from '../registry';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface RoboForceGraphProps {
  entities: RoboOsintEntity[];
  relationships: RoboOsintRelationship[];
  registry: RoboTypeRegistry;
  width?: number;
  height?: number;
  /** Currently selected entity IDs */
  selectedEntityIds?: Set<string>;
  /** Currently focused entity ID */
  focusedEntityId?: string | null;
  /** Called when node is clicked */
  onEntityClick?: (entity: RoboOsintEntity) => void;
  className?: string;
  ref?: React.Ref<HTMLDivElement>;
}

// ---------------------------------------------------------------------------
// Simulation node state
// ---------------------------------------------------------------------------

interface SimNode {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  fx?: number;
  fy?: number;
  mass: number;
}

// ---------------------------------------------------------------------------
// Seeded pseudo-random (LCG) for deterministic initial positions
// ---------------------------------------------------------------------------

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

function entitySeed(entities: RoboOsintEntity[]): number {
  return entities.reduce((acc, e) => {
    let h = 0;
    for (let i = 0; i < e.id.length; i++) {
      h = (Math.imul(31, h) + e.id.charCodeAt(i)) | 0;
    }
    return (acc ^ h) >>> 0;
  }, 0x9e3779b9);
}

// ---------------------------------------------------------------------------
// Build initial simulation nodes
// ---------------------------------------------------------------------------

function buildNodes(
  entities: RoboOsintEntity[],
  width: number,
  height: number,
): SimNode[] {
  const padding = 60;
  const rng = seededRandom(entitySeed(entities));
  return entities.map((e) => ({
    id: e.id,
    x: padding + rng() * (width - padding * 2),
    y: padding + rng() * (height - padding * 2),
    vx: 0,
    vy: 0,
    mass: 1,
  }));
}

// ---------------------------------------------------------------------------
// Simulation tick
// ---------------------------------------------------------------------------

const IDEAL_DIST = 80;
const DAMPING = 0.85;
const CENTER_STRENGTH = 0.002;
const LINK_STRENGTH = 0.1;
const MIN_DIST = 30;

function tick(
  nodes: SimNode[],
  edges: Array<{ source: string; target: string }>,
  width: number,
  height: number,
): void {
  const n = nodes.length;
  if (n === 0) return;

  const cx = width / 2;
  const cy = height / 2;
  const k = Math.sqrt((width * height) / n) * 1.5;

  // Build lookup for O(1) access
  const byId = new Map<string, SimNode>();
  for (const node of nodes) {
    byId.set(node.id, node);
  }

  // Accumulate forces
  const fx = new Float64Array(n);
  const fy = new Float64Array(n);

  // 1. Center force
  for (let i = 0; i < n; i++) {
    fx[i] += (cx - nodes[i].x) * CENTER_STRENGTH;
    fy[i] += (cy - nodes[i].y) * CENTER_STRENGTH;
  }

  // 2. Charge / repulsion (O(n²))
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const dx = nodes[j].x - nodes[i].x;
      const dy = nodes[j].y - nodes[i].y;
      const dist = Math.max(Math.sqrt(dx * dx + dy * dy), MIN_DIST);
      const force = (k * k) / dist;
      const nx = (dx / dist) * force;
      const ny = (dy / dist) * force;
      // i repels away from j
      fx[i] -= nx;
      fy[i] -= ny;
      // j repels away from i
      fx[j] += nx;
      fy[j] += ny;
    }
  }

  // 3. Link / spring force
  for (const edge of edges) {
    const src = byId.get(edge.source);
    const tgt = byId.get(edge.target);
    if (!src || !tgt) continue;
    const si = nodes.indexOf(src);
    const ti = nodes.indexOf(tgt);
    if (si === -1 || ti === -1) continue;
    const dx = tgt.x - src.x;
    const dy = tgt.y - src.y;
    const dist = Math.max(Math.sqrt(dx * dx + dy * dy), 1);
    const displacement = dist - IDEAL_DIST;
    const force = displacement * LINK_STRENGTH;
    const nx = (dx / dist) * force;
    const ny = (dy / dist) * force;
    fx[si] += nx;
    fy[si] += ny;
    fx[ti] -= nx;
    fy[ti] -= ny;
  }

  // 4. Integrate velocity + position
  for (let i = 0; i < n; i++) {
    const node = nodes[i];
    // Fixed nodes (being dragged) don't move via simulation
    if (node.fx !== undefined && node.fy !== undefined) {
      node.x = node.fx;
      node.y = node.fy;
      node.vx = 0;
      node.vy = 0;
      continue;
    }
    node.vx = (node.vx + fx[i]) * DAMPING;
    node.vy = (node.vy + fy[i]) * DAMPING;
    node.x += node.vx;
    node.y += node.vy;
  }
}

function isConverged(nodes: SimNode[]): boolean {
  for (const n of nodes) {
    if (n.fx !== undefined) continue;
    if (Math.abs(n.vx) > 0.1 || Math.abs(n.vy) > 0.1) return false;
  }
  return true;
}

// ---------------------------------------------------------------------------
// Drag helpers — convert from SVG root coords to pan/zoom canvas coords
// ---------------------------------------------------------------------------

function svgPoint(
  svg: SVGSVGElement,
  clientX: number,
  clientY: number,
): { x: number; y: number } {
  const pt = svg.createSVGPoint();
  pt.x = clientX;
  pt.y = clientY;
  const ctm = svg.getScreenCTM();
  if (!ctm) return { x: clientX, y: clientY };
  const transformed = pt.matrixTransform(ctm.inverse());
  return { x: transformed.x, y: transformed.y };
}

// ---------------------------------------------------------------------------
// Node radius — pure function, hoisted to module scope (no re-creation per render)
// ---------------------------------------------------------------------------

function nodeRadius(entity: RoboOsintEntity): number {
  return entity.riskScore != null ? 12 + entity.riskScore / 10 : 16;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const MARKER_ID = 'robo-force-graph-arrow';
const GLOW_FILTER_ID = 'robo-force-graph-glow';
const MAX_TICKS = 300;

/**
 * RoboForceGraph — SVG force-directed graph for OSINT entity/relationship data.
 *
 * Renders entities as nodes and relationships as directed edges. Implements a
 * Verlet spring simulation (no D3). Supports pan/zoom, drag, selection, and
 * focus states.
 *
 * @example
 * ```tsx
 * <RoboForceGraph
 *   entities={entities}
 *   relationships={relationships}
 *   registry={registry}
 *   width={800}
 *   height={600}
 *   selectedEntityIds={selectedIds}
 *   onEntityClick={(entity) => setSelected(entity.id)}
 * />
 * ```
 */
function RoboForceGraph({
  entities,
  relationships,
  registry,
  width = 800,
  height = 600,
  selectedEntityIds,
  focusedEntityId,
  onEntityClick,
  className,
  ref,
}: RoboForceGraphProps) {
    // -----------------------------------------------------------------------
    // Simulation state (mutable ref — does NOT need to cause re-renders on
    // every tick; we write directly to the DOM via refs on SVG elements)
    // -----------------------------------------------------------------------
    const nodesRef = React.useRef<SimNode[]>([]);
    const tickCountRef = React.useRef(0);
    const rafRef = React.useRef<number | null>(null);
    const svgRef = React.useRef<SVGSVGElement | null>(null);
    const canvasGroupRef = React.useRef<SVGGElement | null>(null);
    const nodeGroupsRef = React.useRef<Map<string, SVGGElement>>(new Map());
    const edgeLinesRef = React.useRef<Map<string, SVGLineElement>>(new Map());

    // -----------------------------------------------------------------------
    // Loader state — hidden until simulation has settled
    // -----------------------------------------------------------------------
    const [simulationDone, setSimulationDone] = React.useState(false);

    // -----------------------------------------------------------------------
    // Pan / zoom state
    // -----------------------------------------------------------------------
    const [pan, setPan] = React.useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [zoom, setZoom] = React.useState(1);
    const panRef = React.useRef(pan);
    const zoomRef = React.useRef(zoom);
    panRef.current = pan;
    zoomRef.current = zoom;

    // Is panning via middle-click / Ctrl+drag
    const isPanningRef = React.useRef(false);
    const panStartRef = React.useRef<{ x: number; y: number; px: number; py: number } | null>(
      null,
    );

    // -----------------------------------------------------------------------
    // Drag state
    // -----------------------------------------------------------------------
    const dragNodeIdRef = React.useRef<string | null>(null);

    // -----------------------------------------------------------------------
    // Build edge lookup
    // -----------------------------------------------------------------------
    const edgeList = React.useMemo(
      () =>
        relationships.map((r) => ({ source: r.sourceEntityId, target: r.targetEntityId })),
      [relationships],
    );

    // -----------------------------------------------------------------------
    // Initialise / re-initialise simulation when inputs change
    // -----------------------------------------------------------------------
    React.useEffect(() => {
      if (entities.length === 0) {
        setSimulationDone(true);
        return;
      }
      setSimulationDone(false);
      nodesRef.current = buildNodes(entities, width, height);
      tickCountRef.current = 0;
    }, [entities, width, height]);

    // -----------------------------------------------------------------------
    // Simulation loop
    // -----------------------------------------------------------------------
    React.useEffect(() => {
      const runLoop = () => {
        if (document.visibilityState === 'hidden') {
          rafRef.current = requestAnimationFrame(runLoop);
          return;
        }

        const nodes = nodesRef.current;
        tick(nodes, edgeList, width, height);
        tickCountRef.current += 1;

        // Write directly to DOM elements to avoid React re-render overhead
        for (const node of nodes) {
          const g = nodeGroupsRef.current.get(node.id);
          if (g) {
            g.setAttribute('transform', `translate(${node.x},${node.y})`);
          }
        }

        // Update edge line endpoints
        const byId = new Map(nodes.map((n) => [n.id, n]));
        for (const rel of relationships) {
          const line = edgeLinesRef.current.get(rel.id);
          if (!line) continue;
          const src = byId.get(rel.sourceEntityId);
          const tgt = byId.get(rel.targetEntityId);
          if (!src || !tgt) continue;
          line.setAttribute('x1', String(src.x));
          line.setAttribute('y1', String(src.y));
          line.setAttribute('x2', String(tgt.x));
          line.setAttribute('y2', String(tgt.y));
        }

        const done =
          tickCountRef.current >= MAX_TICKS || isConverged(nodes);

        if (!done) {
          rafRef.current = requestAnimationFrame(runLoop);
        } else {
          setSimulationDone(true);
        }
      };

      rafRef.current = requestAnimationFrame(runLoop);

      return () => {
        if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      };
    }, [entities, relationships, edgeList, width, height]);

    // -----------------------------------------------------------------------
    // Pause on visibility change
    // -----------------------------------------------------------------------
    React.useEffect(() => {
      const handleVisibility = () => {
        if (document.visibilityState === 'visible' && rafRef.current === null) {
          // Simulation already settled — nothing to resume
        }
      };
      document.addEventListener('visibilitychange', handleVisibility);
      return () => document.removeEventListener('visibilitychange', handleVisibility);
    }, []);

    // -----------------------------------------------------------------------
    // Wheel zoom
    // -----------------------------------------------------------------------
    const handleWheel = React.useCallback(
      (e: React.WheelEvent<SVGSVGElement>) => {
        e.preventDefault();
        const delta = e.deltaY < 0 ? 1.1 : 0.9;
        setZoom((z) => Math.min(4, Math.max(0.5, z * delta)));
      },
      [],
    );

    // -----------------------------------------------------------------------
    // Pan (middle-click or Ctrl+drag) — mouse handlers on SVG root
    // -----------------------------------------------------------------------
    const handleMouseDownSvg = React.useCallback(
      (e: React.MouseEvent<SVGSVGElement>) => {
        const isMiddle = e.button === 1;
        const isCtrl = e.button === 0 && e.ctrlKey;
        if (isMiddle || isCtrl) {
          e.preventDefault();
          isPanningRef.current = true;
          panStartRef.current = {
            x: e.clientX,
            y: e.clientY,
            px: panRef.current.x,
            py: panRef.current.y,
          };
        }
      },
      [],
    );

    const handleMouseMoveSvg = React.useCallback(
      (e: React.MouseEvent<SVGSVGElement>) => {
        // Pan
        if (isPanningRef.current && panStartRef.current) {
          const dx = e.clientX - panStartRef.current.x;
          const dy = e.clientY - panStartRef.current.y;
          setPan({ x: panStartRef.current.px + dx, y: panStartRef.current.py + dy });
        }

        // Node drag
        const dragId = dragNodeIdRef.current;
        if (dragId) {
          const svg = svgRef.current;
          if (!svg) return;
          const pt = svgPoint(svg, e.clientX, e.clientY);
          // Convert from SVG root coords to canvas coords (accounting for pan/zoom)
          const canvasX = (pt.x - panRef.current.x) / zoomRef.current;
          const canvasY = (pt.y - panRef.current.y) / zoomRef.current;
          const node = nodesRef.current.find((n) => n.id === dragId);
          if (node) {
            node.fx = canvasX;
            node.fy = canvasY;
          }
        }
      },
      [],
    );

    const handleMouseUpSvg = React.useCallback(() => {
      isPanningRef.current = false;
      panStartRef.current = null;

      // Release dragged node
      const dragId = dragNodeIdRef.current;
      if (dragId) {
        const node = nodesRef.current.find((n) => n.id === dragId);
        if (node) {
          node.fx = undefined;
          node.fy = undefined;
        }
        dragNodeIdRef.current = null;
        // Resume simulation after drag
        tickCountRef.current = 0;
      }
    }, []);

    // -----------------------------------------------------------------------
    // Node drag start
    // -----------------------------------------------------------------------
    const handleNodeMouseDown = React.useCallback(
      (e: React.MouseEvent<SVGGElement>, entityId: string) => {
        // Only primary button for node drag
        if (e.button !== 0 || e.ctrlKey) return;
        e.stopPropagation();
        dragNodeIdRef.current = entityId;
      },
      [],
    );

    // -----------------------------------------------------------------------
    // Node click
    // -----------------------------------------------------------------------
    const handleNodeClick = React.useCallback(
      (e: React.MouseEvent<SVGGElement>, entity: RoboOsintEntity) => {
        e.stopPropagation();
        onEntityClick?.(entity);
      },
      [onEntityClick],
    );

    // -----------------------------------------------------------------------
    // Register node / edge DOM element refs
    // -----------------------------------------------------------------------
    const setNodeGroupRef = React.useCallback(
      (id: string) => (el: SVGGElement | null) => {
        if (el) nodeGroupsRef.current.set(id, el);
        else nodeGroupsRef.current.delete(id);
      },
      [],
    );

    const setEdgeLineRef = React.useCallback(
      (id: string) => (el: SVGLineElement | null) => {
        if (el) edgeLinesRef.current.set(id, el);
        else edgeLinesRef.current.delete(id);
      },
      [],
    );

    // -----------------------------------------------------------------------
    // Merge forwarded ref onto wrapper div; SVG uses its own internal ref
    // -----------------------------------------------------------------------
    const setWrapperRef = React.useCallback(
      (el: HTMLDivElement | null) => {
        if (typeof ref === 'function') ref(el);
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = el;
      },
      [ref],
    );

    // -----------------------------------------------------------------------
    // Render
    // -----------------------------------------------------------------------
    return (
      <div
        ref={setWrapperRef}
        className={cn('relative select-none', className)}
        style={{
          width,
          height,
          background: 'var(--card)',
          borderRadius: 'var(--radius)',
          overflow: 'hidden',
        }}
      >
        {/* Loader — covers graph until simulation has settled */}
        {!simulationDone && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--card)',
              zIndex: 1,
            }}
            aria-live='polite'
            aria-label='Graph loading'
          >
            <RoboLoading size='md' />
          </div>
        )}

        {/* SVG — always rendered so simulation can write positions to DOM refs.
            Fades in once the layout has converged. */}
        <svg
          ref={svgRef}
          width={width}
          height={height}
          className='cursor-default'
          style={{
            opacity: simulationDone ? 1 : 0,
            transition: 'opacity 0.35s ease',
            overflow: 'hidden',
            display: 'block',
          }}
          onWheel={handleWheel}
          onMouseDown={handleMouseDownSvg}
          onMouseMove={handleMouseMoveSvg}
          onMouseUp={handleMouseUpSvg}
          onMouseLeave={handleMouseUpSvg}
          aria-label={entities.length === 0 ? 'Force graph — no entities to display' : 'OSINT force-directed graph'}
          role='img'
          aria-hidden={!simulationDone}
        >
          {entities.length === 0 && (
            <text
              x={width / 2}
              y={height / 2}
              textAnchor='middle'
              dominantBaseline='middle'
              style={{
                fill: 'var(--muted-foreground)',
                fontSize: 14,
                fontFamily: 'var(--font-sans)',
              }}
            >
              No entities to display
            </text>
          )}
        {/* Defs — arrow marker + glow filter */}
        <defs>
          <marker
            id={MARKER_ID}
            viewBox='0 0 10 10'
            refX='9'
            refY='5'
            markerWidth='6'
            markerHeight='6'
            orient='auto-start-reverse'
          >
            <path d='M 0 0 L 10 5 L 0 10 z' fill='var(--muted-foreground)' />
          </marker>

          <filter id={GLOW_FILTER_ID} x='-50%' y='-50%' width='200%' height='200%'>
            <feGaussianBlur stdDeviation='3' result='blur' />
            <feMerge>
              <feMergeNode in='blur' />
              <feMergeNode in='SourceGraphic' />
            </feMerge>
          </filter>
        </defs>

        {/* Pan/zoom canvas */}
        <g
          ref={canvasGroupRef}
          transform={`translate(${pan.x},${pan.y}) scale(${zoom})`}
        >
          {/* ----------------------------------------------------------------
              Edges — rendered first so they appear behind nodes
          ----------------------------------------------------------------- */}
          <g aria-hidden='true'>
            {relationships.map((rel) => {
              const relConfig = registry.getRelationshipTypeConfig(rel.type);
              const srcNode = nodesRef.current.find((n) => n.id === rel.sourceEntityId);
              const tgtNode = nodesRef.current.find((n) => n.id === rel.targetEntityId);
              const x1 = srcNode?.x ?? 0;
              const y1 = srcNode?.y ?? 0;
              const x2 = tgtNode?.x ?? 0;
              const y2 = tgtNode?.y ?? 0;

              return (
                <line
                  key={rel.id}
                  ref={setEdgeLineRef(rel.id)}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={relConfig.color}
                  strokeWidth={relConfig.defaultWidth}
                  strokeDasharray={relConfig.dashArray ?? undefined}
                  strokeOpacity={0.6}
                  markerEnd={relConfig.directional ? `url(#${MARKER_ID})` : undefined}
                  style={{ transition: 'stroke-opacity 0.15s' }}
                  className='robo-force-graph-edge'
                >
                  <title>
                    {relConfig.label}
                    {rel.label ? ` — ${rel.label}` : ''}
                    {` (confidence: ${Math.round(rel.confidence * 100)}%)`}
                  </title>
                </line>
              );
            })}
          </g>

          {/* ----------------------------------------------------------------
              Nodes
          ----------------------------------------------------------------- */}
          <g>
            {entities.map((entity) => {
              const entityConfig = registry.getEntityTypeConfig(entity.type);
              const r = nodeRadius(entity);
              const isSelected = selectedEntityIds?.has(entity.id) ?? false;
              const isFocused = focusedEntityId === entity.id;

              const initNode = nodesRef.current.find((n) => n.id === entity.id);
              const initX = initNode?.x ?? width / 2;
              const initY = initNode?.y ?? height / 2;

              return (
                <g
                  key={entity.id}
                  ref={setNodeGroupRef(entity.id)}
                  transform={`translate(${initX},${initY})`}
                  onMouseDown={(e) => handleNodeMouseDown(e, entity.id)}
                  onClick={(e) => handleNodeClick(e, entity)}
                  style={{ cursor: 'pointer' }}
                  role='button'
                  aria-label={`${entity.name} (${entityConfig.label})`}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onEntityClick?.(entity);
                    }
                  }}
                >
                  {/* Glow ring for focused node */}
                  {isFocused && (
                    <circle
                      r={r + 8}
                      fill='none'
                      stroke={entityConfig.color}
                      strokeWidth={3}
                      strokeOpacity={0.5}
                      filter={`url(#${GLOW_FILTER_ID})`}
                    />
                  )}

                  {/* Main circle */}
                  <circle
                    r={r}
                    fill={entityConfig.color}
                    stroke={isSelected ? 'white' : 'none'}
                    strokeWidth={isSelected ? 2 : 0}
                    strokeOpacity={isSelected ? 1 : 0}
                    filter={isFocused ? `url(#${GLOW_FILTER_ID})` : undefined}
                  />

                  {/* Entity label */}
                  <text
                    y={r + 12}
                    textAnchor='middle'
                    dominantBaseline='hanging'
                    style={{
                      fill: 'var(--foreground)',
                      fontSize: 10,
                      fontFamily: 'var(--font-sans)',
                      pointerEvents: 'none',
                    }}
                  >
                    {entity.name.length > 20
                      ? `${entity.name.slice(0, 18)}…`
                      : entity.name}
                  </text>

                  {/* Native SVG tooltip */}
                  <title>
                    {`${entity.name} — ${entityConfig.label}`}
                    {`\nConfidence: ${Math.round(entity.confidence * 100)}%`}
                    {entity.riskScore != null
                      ? `\nRisk score: ${entity.riskScore}`
                      : ''}
                  </title>
                </g>
              );
            })}
          </g>
        </g>

          {/* Inline hover opacity rule for edges */}
          <style>{`
            .robo-force-graph-edge:hover {
              stroke-opacity: 1 !important;
            }
          `}</style>
        </svg>
      </div>
    );
}

RoboForceGraph.displayName = 'RoboForceGraph';

export { RoboForceGraph };
