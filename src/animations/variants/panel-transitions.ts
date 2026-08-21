import * as React from 'react';
import { motion } from 'motion/react';

import { cn } from '@/lib/utils';
import { getPanelSurfaceClasses } from '@/core/glass-surface';

import { buildPresets } from '../config/animation-presets';
import type { RoboAnimationTokens } from '../config/types';

/** Edge a panel slides from. */
export type RoboSheetSide = 'top' | 'right' | 'bottom' | 'left';

// ---------------------------------------------------------------------------
// NOTE ON FILE EXTENSION: this module renders React elements (the mask
// components below) but is kept as a `.ts` file, matching the plan's spec —
// so every element is built with `React.createElement` instead of JSX
// (this repo's `tsconfig` uses `"jsx": "react-jsx"`, which TypeScript only
// parses inside `.tsx` files).
// ---------------------------------------------------------------------------

// `motion/react` components accept dynamic prop shapes (computed animate
// keys, `data-slot`, etc.) that don't fit React.createElement's strict typed
// overloads — cast to `any` at this single call site rather than sprinkling
// `as unknown as ...` through every element below.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const h = React.createElement as (type: any, props: any, ...children: any[]) => React.ReactElement;

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

/**
 * Selectable enter/exit transition for `RoboSheet`, `RoboPeekSheet`, and
 * `RoboQuickPanel`. `'default'` reproduces each component's existing,
 * hand-written animation exactly — picking it (or omitting the prop
 * entirely) is a zero-behavior-change no-op for every existing consumer.
 */
export type RoboTransitionVariant =
  | 'default'
  | 'curtain-wipe'
  | 'pixel-dissolve'
  | 'iris-clip'
  | 'venetian-blinds'
  | 'depth-fade';

/**
 * Which structural family the calling component belongs to — the two
 * families need different `motionProps` shapes for the same variant (see
 * `buildPanelTransition`'s doc comment).
 *
 * - `'modal'` — `RoboSheet`: mounts/unmounts via `AnimatePresence`, animates
 *   `initial`/`animate`/`exit` on a `motion.div` that slides in from
 *   `getSlideOffset(side)` and fades opacity.
 * - `'resize'` — `RoboPeekSheet` / `RoboQuickPanel`: always mounted, animates a
 *   single size dimension (`width`/`height`) between a peek and expanded
 *   footprint via a bare `animate`/`transition` pair (no `initial`/`exit` —
 *   there's no mount/unmount to animate across).
 */
export type PanelTransitionFamily = 'modal' | 'resize';

export interface PanelTransitionContext {
  /** Which edge the panel is docked to / slides from. */
  side: RoboSheetSide;
  family: PanelTransitionFamily;
}

/** Props every `MaskOverlay` component accepts. Variant-specific extra props
 *  (if any) are added on top of this in each component's own prop type. */
export interface PanelMaskOverlayProps {
  /** Resolves the mask's surface color via `getPanelSurfaceClasses(glass)` —
   *  same glass/solid setting the panel itself is rendered with. */
  glass?: boolean;
  className?: string;
}

/** `pixel-dissolve`'s per-cell stagger, exposed so callers can wire it onto
 *  the grid's parent `motion.div` via `transition={{ staggerChildren, delayChildren }}`. */
export interface StaggerConfig {
  staggerChildren: number;
  delayChildren: number;
  /** Total number of cells in the pixel-dissolve grid (`rows * cols`) — the
   *  same count `PixelGridMask` renders internally. Exposed so callers
   *  computing a mask's total replay/unmount duration (`staggerChildren *
   *  (cellCount - 1) + durationNormal/1000`, see `RoboPeekSheet`/
   *  `RoboQuickPanel`'s `unmountDelayMs`) don't have to re-derive or duplicate
   *  the grid density as a separate hardcoded constant of their own. Mirrors
   *  `SlatConfig.slatCount`'s equivalent role for `venetian-blinds`. */
  cellCount: number;
}

/** `venetian-blinds`' per-family/per-side slat geometry. */
export interface SlatConfig {
  orientation: 'horizontal' | 'vertical';
  /** Which transform axis each slat animates 0→1 (enter) / 1→0 (exit). */
  scaleAxis: 'scaleX' | 'scaleY';
  slatCount: number;
  /** Whether alternating slats flip `transformOrigin` (top/bottom or
   *  left/right) for a more organic "blinds opening" feel. Always `false`
   *  when `reduced` — no flourish beyond the base scale animation. */
  alternateOrigin: boolean;
}

/**
 * Result of `buildPanelTransition`. Every field beyond `motionProps` is
 * optional and only populated for the variants that need it:
 *
 * - `MaskOverlay` — present for `curtain-wipe`, `pixel-dissolve`,
 *   `venetian-blinds` (variants that composite an extra masking layer over
 *   the panel). Absent for `iris-clip`/`depth-fade`/`default`, which only
 *   ever modify the panel's own `motionProps`.
 *
 *   **Identity warning:** `buildPanelTransition` returns a freshly created
 *   `MaskOverlay` component on every call. If a caller invokes
 *   `buildPanelTransition` inline during render, React sees a new component
 *   type each render and remounts the entire mask subtree — losing any
 *   in-flight animation state — on every unrelated parent re-render, not
 *   just when `variant`/`tokens`/`reduced`/`ctx` actually change. Callers
 *   that re-render frequently should memoize the result (e.g.
 *   `useMemo(() => buildPanelTransition(...), [variant, tokens, reduced,
 *   ctx.side, ctx.family])`) so `MaskOverlay`'s identity is stable across
 *   renders that don't change those inputs.
 *
 *   **Composition requirement (modal family only):** for masked variants
 *   (`curtain-wipe`/`pixel-dissolve`/`venetian-blinds`), the panel's own
 *   `motion.div` gets a no-op `opacity: 1 → 1` transition — all the real
 *   enter/exit animation lives in the sibling `MaskOverlay`. `MaskOverlay`
 *   MUST be rendered *inside* the same `AnimatePresence`/mount boundary as
 *   the panel content (e.g. as a sibling of `children` inside
 *   `RoboSheetContent`'s `motion.div`, not outside `AnimatePresence`
 *   entirely) so its own `exit` animation is honored by
 *   `AnimatePresence` before unmount, rather than being cut short.
 * - `clipOrigin` — present only for `iris-clip`. For `family: 'modal'`,
 *   already baked into `motionProps.initial`/`animate`/`exit`'s `clipPath`
 *   strings. For `family: 'resize'`, exposed standalone (and via
 *   `clipPathHidden`/`clipPathVisible`, see below) since the resize
 *   `motion.div` has no `initial`/`exit` states for `buildPanelTransition`
 *   to write into.
 * - `clipPathHidden` / `clipPathVisible` — present only for `iris-clip` with
 *   `family: 'resize'`. The two `clip-path: circle(...)` string values the
 *   calling component must animate between itself (e.g.
 *   `animate={{ clipPath: expanded ? clipPathVisible : clipPathHidden }}`),
 *   since the resize family's `motion.div` never mounts/unmounts the way
 *   `initial`/`exit` would require. Absent for every other variant and for
 *   `family: 'modal'` (where the clip animation is already fully expressed
 *   in `motionProps`).
 * - `staggerConfig` — present only for `pixel-dissolve`; spread onto the
 *   grid's parent `motion.div` transition, e.g.
 *   `transition={{ ...staggerConfig, ...presets.standard.enter }}`. Also
 *   already wired into the `MaskOverlay`'s own internal cells/parent — a
 *   caller does not need to re-apply it unless building a custom mask.
 * - `slatConfig` — present only for `venetian-blinds`; describes slat count/
 *   orientation/scale-axis/origin-alternation for the `VenetianBlindsMask`.
 */
export interface PanelTransitionResult {
  /**
   * Spread directly onto the component's animated `motion.div`.
   *
   * - `family: 'modal'` — always has the shape
   *   `{ initial, animate: {..., transition}, exit: {..., transition} }`,
   *   matching `RoboSheetContent`'s existing `motion.div` today.
   * - `family: 'resize'` — for every variant **except `depth-fade`**, has the
   *   shape `{ transition }` alone (a bare timing object), with no other
   *   keys. The instance-specific `animate` target (the
   *   `{ [sizeKey]: expanded ? ... : ... }` object) is NOT included here,
   *   since `buildPanelTransition` has no knowledge of `expanded`/
   *   `peekSize`/`expandedSize` — those stay owned by the calling component,
   *   which should spread this `transition` onto its own `animate` object,
   *   e.g. `<motion.div animate={{ [sizeKey]: ... }} {...motionProps} />`.
   *   Variants that need extra instance-driven values for the resize family
   *   (currently only `iris-clip`'s clip-path) expose them via dedicated,
   *   separately typed fields on `PanelTransitionResult` (see
   *   `clipPathHidden`/`clipPathVisible` above) rather than smuggling extra
   *   keys into `motionProps`.
   *
   *   **Exception — `depth-fade`:** per the plan, this variant is identical
   *   for both families (no extra DOM, richer values plugged into whichever
   *   animate object the caller already owns), so it returns the full
   *   `{ initial, animate: {..., transition}, exit: {..., transition} }`
   *   shape for `family: 'resize'` too, same as modal. A `RoboPeekSheet`/
   *   `RoboQuickPanel` integration wiring up `depth-fade` should spread
   *   `initial`/`animate`/`exit` from `motionProps` alongside — not instead
   *   of — its own `{ [sizeKey]: ... }` animate target, e.g.
   *   `<motion.div initial={motionProps.initial} animate={{ [sizeKey]: ...,
   *   ...motionProps.animate }} exit={motionProps.exit} />`. This is the one
   *   documented exception to the "resize is always bare `{ transition }`"
   *   rule above — check `variant === 'depth-fade'` before assuming the bare
   *   shape.
   */
  motionProps: Record<string, unknown>;
  MaskOverlay?: React.ComponentType<PanelMaskOverlayProps>;
  clipOrigin?: string;
  /** `iris-clip` + `family: 'resize'` only — see field docs above. */
  clipPathHidden?: string;
  /** `iris-clip` + `family: 'resize'` only — see field docs above. */
  clipPathVisible?: string;
  staggerConfig?: StaggerConfig;
  slatConfig?: SlatConfig;
}

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

const HORIZONTAL_SIDES: ReadonlySet<RoboSheetSide> = new Set(['left', 'right']);
const isHorizontal = (side: RoboSheetSide) => HORIZONTAL_SIDES.has(side);

/** Reproduces `robo-sheet.tsx`'s `getSlideOffset` exactly, so `'default'` for
 *  `family: 'modal'` is byte-for-byte identical to today's behavior. */
function getSlideOffset(side: RoboSheetSide, reduced: boolean): { x: number | string; y: number | string } {
  if (reduced) return { x: 0, y: 0 };
  switch (side) {
    case 'top':    return { x: 0, y: '-100%' };
    case 'bottom': return { x: 0, y: '100%' };
    case 'left':   return { x: '-100%', y: 0 };
    case 'right':  return { x: '100%', y: 0 };
  }
}

/** The edge each side's peek handle sits on — used to anchor `iris-clip`'s
 *  origin at the handle rather than the panel center for the resize family. */
const HANDLE_ORIGIN: Record<RoboSheetSide, string> = {
  // Handle sits flush against the edge that faces the map/app content, i.e.
  // the *opposite* edge from where the panel is docked.
  left:   '100% 50%',
  right:  '0% 50%',
  top:    '50% 100%',
  bottom: '50% 0%',
};

const PIXEL_GRID_ROWS = 6;
const PIXEL_GRID_COLS = 8;
const VENETIAN_SLAT_COUNT = 8;

// ---------------------------------------------------------------------------
// 'default'
// ---------------------------------------------------------------------------

function buildDefault(
  tokens: RoboAnimationTokens,
  reduced: boolean,
  ctx: PanelTransitionContext,
): PanelTransitionResult {
  const presets = buildPresets(tokens);
  const enterTransition = reduced ? { duration: 0 } : presets.standard.enter;
  const exitTransition = reduced ? { duration: 0 } : presets.standard.exit;

  if (ctx.family === 'modal') {
    const offset = getSlideOffset(ctx.side, reduced);
    return {
      motionProps: {
        initial: { ...offset, opacity: 0 },
        animate: { x: 0, y: 0, opacity: 1, transition: enterTransition },
        exit: { ...offset, opacity: 0, transition: exitTransition },
      },
    };
  }

  // family: 'resize' — bare transition timing; the instance owns the
  // `animate` target (`{ [sizeKey]: expanded ? ... : ... }`), matching
  // RoboPeekSheet/RoboQuickPanel's existing `transition={presets.standard.enter}`.
  return {
    motionProps: {
      transition: enterTransition,
    },
  };
}

// ---------------------------------------------------------------------------
// 'curtain-wipe'
// ---------------------------------------------------------------------------

export interface CurtainWipeMaskProps extends PanelMaskOverlayProps {
  /** Axis the two masks split/slide along. Modal family always splits full-
   *  viewport halves along `x`; resize family splits along the panel's short
   *  axis (perpendicular to the size dimension being animated). */
  axis: 'x' | 'y';
  /** Enter timing applied to both masks' `animate` (e.g.
   *  `presets.standard.enter`, already collapsed to `{ duration: 0 }` by the
   *  caller when `reduced`). */
  enterTransition: Record<string, unknown>;
  /** Exit timing applied to both masks' `exit`. */
  exitTransition: Record<string, unknown>;
}

/** Two solid theme-surface panels that slide apart (enter) / together (exit)
 *  like a stage curtain, revealing or concealing the content underneath. */
function CurtainWipeMask({
  glass,
  axis,
  enterTransition,
  exitTransition,
  className,
}: CurtainWipeMaskProps): React.ReactElement {
  const surfaceClasses = getPanelSurfaceClasses(!!glass);
  const isX = axis === 'x';
  const axisKey = isX ? 'x' : 'y';

  return h(
    'div',
    { className: cn('pointer-events-none absolute inset-0 z-10 flex overflow-hidden', className) },
    h(motion.div, {
      'data-slot': 'curtain-wipe-mask-start',
      className: cn(surfaceClasses, isX ? 'h-full w-1/2' : 'h-1/2 w-full'),
      initial: { [axisKey]: 0 },
      animate: { [axisKey]: '-100%', transition: enterTransition },
      exit: { [axisKey]: 0, transition: exitTransition },
    }),
    h(motion.div, {
      'data-slot': 'curtain-wipe-mask-end',
      className: cn(surfaceClasses, isX ? 'h-full w-1/2' : 'h-1/2 w-full'),
      initial: { [axisKey]: 0 },
      animate: { [axisKey]: '100%', transition: enterTransition },
      exit: { [axisKey]: 0, transition: exitTransition },
    }),
  );
}
CurtainWipeMask.displayName = 'CurtainWipeMask';

function buildCurtainWipe(
  tokens: RoboAnimationTokens,
  reduced: boolean,
  ctx: PanelTransitionContext,
): PanelTransitionResult {
  const presets = buildPresets(tokens);
  const enterTransition = reduced ? { duration: 0 } : presets.standard.enter;
  const exitTransition = reduced ? { duration: 0 } : presets.standard.exit;

  // Modal family splits full-viewport halves horizontally (x); resize family
  // splits along the short axis, perpendicular to whichever dimension the
  // panel itself is resizing (its "long" axis).
  const axis: CurtainWipeMaskProps['axis'] = ctx.family === 'modal' ? 'x' : isHorizontal(ctx.side) ? 'y' : 'x';

  const motionProps =
    ctx.family === 'modal'
      ? {
          initial: { opacity: 1 },
          animate: { opacity: 1, transition: enterTransition },
          exit: { opacity: 1, transition: exitTransition },
        }
      : { transition: enterTransition };

  const MaskOverlay: React.ComponentType<PanelMaskOverlayProps> = ({ glass, className }) =>
    h(CurtainWipeMask, { glass, axis, enterTransition, exitTransition, className });
  MaskOverlay.displayName = 'CurtainWipeMaskOverlay';

  return { motionProps, MaskOverlay };
}

// ---------------------------------------------------------------------------
// 'pixel-dissolve'
// ---------------------------------------------------------------------------

export interface PixelGridMaskProps extends PanelMaskOverlayProps {
  rows?: number;
  cols?: number;
  reduced: boolean;
  /** Per-cell enter/exit timing (e.g. `presets.standard.enter`/`.exit`,
   *  already collapsed to `{ duration: 0 }` by the caller when `reduced`). */
  transition: Record<string, unknown>;
  /** Spread onto the grid's parent `motion.div` so cells fade in a stagger
   *  instead of all at once. `{ staggerChildren: 0, delayChildren: 0 }` when
   *  `reduced` — see `buildPixelDissolve`. */
  staggerConfig: StaggerConfig;
}

/** NxM grid of theme-colored squares, each fading opacity independently with
 *  a per-cell stagger — the motion.dev "curtain reveal" homage, built with
 *  plain CSS-grid + `motion/react` stagger (no canvas/WebGL). Cells are sized
 *  in `%`, so the same grid tiles correctly whether the panel underneath is
 *  at `peekSize` or `expandedSize`. */
function PixelGridMask({
  glass,
  rows = PIXEL_GRID_ROWS,
  cols = PIXEL_GRID_COLS,
  reduced,
  transition,
  staggerConfig,
  className,
}: PixelGridMaskProps): React.ReactElement {
  const surfaceClasses = getPanelSurfaceClasses(!!glass);
  const cellCount = rows * cols;

  const cells = Array.from({ length: cellCount }, (_, i) =>
    h(motion.div, {
      key: i,
      'data-slot': 'pixel-dissolve-cell',
      className: surfaceClasses,
      variants: {
        hidden: { opacity: reduced ? 0 : 1 },
        visible: { opacity: 0 },
      },
      transition,
    }),
  );

  return h(
    motion.div,
    {
      'data-slot': 'pixel-dissolve-mask',
      className: cn('pointer-events-none absolute inset-0 z-10 grid overflow-hidden', className),
      style: { gridTemplateRows: `repeat(${rows}, 1fr)`, gridTemplateColumns: `repeat(${cols}, 1fr)` },
      initial: 'hidden',
      animate: 'visible',
      exit: 'hidden',
      transition: { ...staggerConfig },
    },
    cells,
  );
}
PixelGridMask.displayName = 'PixelGridMask';

function buildPixelDissolve(
  tokens: RoboAnimationTokens,
  reduced: boolean,
  ctx: PanelTransitionContext,
): PanelTransitionResult {
  const presets = buildPresets(tokens);
  const enterTransition = reduced ? { duration: 0 } : presets.standard.enter;
  const exitTransition = reduced ? { duration: 0 } : presets.standard.exit;

  const staggerConfig: StaggerConfig = reduced
    ? { staggerChildren: 0, delayChildren: 0, cellCount: PIXEL_GRID_ROWS * PIXEL_GRID_COLS }
    : { staggerChildren: tokens.durationInstant / 1000 / 4, delayChildren: 0, cellCount: PIXEL_GRID_ROWS * PIXEL_GRID_COLS };

  const MaskOverlay: React.ComponentType<PanelMaskOverlayProps> = ({ glass, className }) =>
    h(PixelGridMask, { glass, reduced, transition: enterTransition, staggerConfig, className });
  MaskOverlay.displayName = 'PixelDissolveMaskOverlay';

  const motionProps =
    ctx.family === 'modal'
      ? {
          initial: { opacity: 1 },
          animate: { opacity: 1, transition: enterTransition },
          exit: { opacity: 1, transition: exitTransition },
        }
      : { transition: enterTransition };

  return { motionProps, MaskOverlay, staggerConfig };
}

// ---------------------------------------------------------------------------
// 'iris-clip'
// ---------------------------------------------------------------------------

function resolveClipOrigin(ctx: PanelTransitionContext): string {
  if (ctx.family === 'modal') return '50% 50%';
  return HANDLE_ORIGIN[ctx.side];
}

function buildIrisClip(
  tokens: RoboAnimationTokens,
  reduced: boolean,
  ctx: PanelTransitionContext,
): PanelTransitionResult {
  const presets = buildPresets(tokens);
  const enterTransition = reduced ? { duration: 0 } : presets.standard.enter;
  const exitTransition = reduced ? { duration: 0 } : presets.standard.exit;
  const origin = resolveClipOrigin(ctx);

  // NOTE(browser-support): no existing Robo component animates `clip-path`
  // today — confirm against this library's target browser matrix before
  // relying on this variant as more than a Storybook preview.
  const clipHidden = `circle(0% at ${origin})`;
  const clipVisible = `circle(150% at ${origin})`;

  if (ctx.family === 'modal') {
    return {
      motionProps: {
        initial: { clipPath: clipHidden, opacity: 1 },
        animate: { clipPath: clipVisible, opacity: 1, transition: enterTransition },
        exit: { clipPath: clipHidden, opacity: 1, transition: exitTransition },
      },
      clipOrigin: origin,
    };
  }

  // family: 'resize' — motionProps stays the strict `{ transition }` shape;
  // the clip-path values a caller needs (there's no initial/exit state to
  // bake them into) are exposed as their own typed fields instead.
  return {
    motionProps: { transition: enterTransition },
    clipOrigin: origin,
    clipPathHidden: clipHidden,
    clipPathVisible: clipVisible,
  };
}

// ---------------------------------------------------------------------------
// 'venetian-blinds'
// ---------------------------------------------------------------------------

export interface VenetianBlindsMaskProps extends PanelMaskOverlayProps {
  slatConfig: SlatConfig;
  transition: Record<string, unknown>;
  staggerConfig: StaggerConfig;
}

/** N slat strips that stagger-scale open (enter) / closed (exit) like
 *  venetian blinds, alternating `transformOrigin` per strip for an organic
 *  feel (suppressed when `reduced`). Orientation/scale-axis are resolved by
 *  `buildPanelTransition` from `ctx.side` before reaching this component. */
function VenetianBlindsMask({
  glass,
  slatConfig,
  transition,
  staggerConfig,
  className,
}: VenetianBlindsMaskProps): React.ReactElement {
  const surfaceClasses = getPanelSurfaceClasses(!!glass);
  const { orientation, scaleAxis, slatCount, alternateOrigin } = slatConfig;
  const horizontal = orientation === 'horizontal';

  const slats = Array.from({ length: slatCount }, (_, i) => {
    const origin = alternateOrigin ? (i % 2 === 0 ? '0% 0%' : '100% 100%') : '50% 50%';
    return h(motion.div, {
      key: i,
      'data-slot': 'venetian-blinds-slat',
      className: cn(surfaceClasses, horizontal ? 'w-full flex-1' : 'h-full flex-1'),
      style: { transformOrigin: origin },
      variants: {
        closed: { [scaleAxis]: 0 },
        open: { [scaleAxis]: 1 },
      },
      transition,
    });
  });

  return h(
    motion.div,
    {
      'data-slot': 'venetian-blinds-mask',
      className: cn(
        'pointer-events-none absolute inset-0 z-10 flex overflow-hidden',
        horizontal ? 'flex-col' : 'flex-row',
        className,
      ),
      initial: 'closed',
      animate: 'open',
      exit: 'closed',
      transition: { ...staggerConfig },
    },
    slats,
  );
}
VenetianBlindsMask.displayName = 'VenetianBlindsMask';

function buildVenetianBlinds(
  tokens: RoboAnimationTokens,
  reduced: boolean,
  ctx: PanelTransitionContext,
): PanelTransitionResult {
  const presets = buildPresets(tokens);
  const enterTransition = reduced ? { duration: 0 } : presets.standard.enter;
  const exitTransition = reduced ? { duration: 0 } : presets.standard.exit;

  const horizontal = ctx.side === 'top' || ctx.side === 'bottom';
  const slatConfig: SlatConfig = {
    orientation: horizontal ? 'horizontal' : 'vertical',
    scaleAxis: horizontal ? 'scaleY' : 'scaleX',
    slatCount: VENETIAN_SLAT_COUNT,
    alternateOrigin: !reduced,
  };

  // Keep the *total* stagger duration within roughly durationNormal so the
  // full sweep doesn't feel sluggish next to the other variants.
  const staggerChildren = reduced ? 0 : tokens.durationNormal / 1000 / (VENETIAN_SLAT_COUNT * 2);
  // `cellCount` isn't meaningful for a slat-based mask (there's no pixel
  // grid) — callers computing venetian-blinds' unmount delay use
  // `slatConfig.slatCount` instead (see RoboPeekSheet/RoboQuickPanel's
  // `unmountDelayMs`). Populated with `slatConfig.slatCount` anyway so the
  // field always reflects a real, non-arbitrary count rather than a bare
  // placeholder like `1`.
  const staggerConfig: StaggerConfig = { staggerChildren, delayChildren: 0, cellCount: slatConfig.slatCount };

  const MaskOverlay: React.ComponentType<PanelMaskOverlayProps> = ({ glass, className }) =>
    h(VenetianBlindsMask, { glass, slatConfig, transition: enterTransition, staggerConfig, className });
  MaskOverlay.displayName = 'VenetianBlindsMaskOverlay';

  const motionProps =
    ctx.family === 'modal'
      ? {
          initial: { opacity: 1 },
          animate: { opacity: 1, transition: enterTransition },
          exit: { opacity: 1, transition: exitTransition },
        }
      : { transition: enterTransition };

  return { motionProps, MaskOverlay, slatConfig, staggerConfig };
}

// ---------------------------------------------------------------------------
// 'depth-fade'
// ---------------------------------------------------------------------------

const DEPTH_FADE_BLUR_PX = 4;

/**
 * The exact `motionProps` shape `buildDepthFade` returns — for BOTH families
 * (see `PanelTransitionResult.motionProps`'s doc comment above for why
 * `depth-fade` is the one variant that returns this modal-shaped object even
 * under `family: 'resize'`). Exported so resize-family callers that need to
 * pick individual fields back apart (rather than spreading the object
 * wholesale, which doesn't fit an always-mounted, toggle-driven `motion.div`
 * — see `RoboPeekSheet`'s depth-fade reinterpretation) can cast against a
 * real type instead of an inline structural guess that would compile fine
 * and fail silently at runtime if this shape ever changes.
 */
export interface DepthFadeMotionProps {
  initial: { opacity: number; scale: number; filter: string };
  animate: { opacity: number; scale: number; filter: string; transition: Record<string, unknown> };
  exit: { opacity: number; scale: number; filter: string; transition: Record<string, unknown> };
}

function buildDepthFade(
  tokens: RoboAnimationTokens,
  reduced: boolean,
  _ctx: PanelTransitionContext,
): PanelTransitionResult {
  const presets = buildPresets(tokens);
  const enterTransition = reduced ? { duration: 0 } : presets.expressive.enter;
  const exitTransition = reduced ? { duration: 0 } : presets.standard.exit;

  const initialScale = reduced ? 1 : 0.96;
  const exitScale = reduced ? 1 : 0.98;
  const initialBlur = reduced ? 'blur(0px)' : `blur(${DEPTH_FADE_BLUR_PX}px)`;

  // Identical for both families — no extra DOM, richer values plugged into
  // whichever `x`/`y`/`opacity` (modal) or `[sizeKey]` (resize) animate
  // object the caller already owns.
  //
  // Left to plain inference (not annotated `: DepthFadeMotionProps` here) so
  // it keeps satisfying `PanelTransitionResult.motionProps: Record<string,
  // unknown>` below the same way every other variant's `motionProps` does —
  // `DepthFadeMotionProps`'s `transition` fields are typed loosely as
  // `Record<string, unknown>` for exactly that reason (see its doc comment),
  // and exist so *external* callers reading `motionProps` back apart (e.g.
  // `RoboPeekSheet`'s depth-fade reinterpretation) can cast against a real,
  // exported shape instead of an inline structural guess.
  const motionProps = {
    initial: { opacity: 0, scale: initialScale, filter: initialBlur },
    animate: { opacity: 1, scale: 1, filter: 'blur(0px)', transition: enterTransition },
    exit: { opacity: 0, scale: exitScale, filter: 'blur(0px)', transition: exitTransition },
  };

  return { motionProps };
}

// ---------------------------------------------------------------------------
// buildPanelTransition
// ---------------------------------------------------------------------------

/**
 * Resolves a `RoboTransitionVariant` into the `motion/react` props (plus,
 * for some variants, a masking overlay component and layout config) needed
 * to render it — for either the modal family (`RoboSheet`) or the resize
 * family (`RoboPeekSheet` / `RoboQuickPanel`).
 *
 * Every variant (including `'default'`) wraps its transition exactly as
 * today's hand-written code does: `reduced ? { duration: 0 } : <variant's
 * transition>` — this function performs that substitution internally;
 * callers never branch on `reduced` themselves.
 *
 * ## Return contract (see `PanelTransitionResult` for full field docs)
 *
 * - `motionProps` — always present. Spread onto the component's existing
 *   animated `motion.div`. Shape depends on `ctx.family`:
 *   - `'modal'`: `{ initial, animate: {..., transition}, exit: {..., transition} }`
 *   - `'resize'`: `{ transition }` alone for every variant **except
 *     `depth-fade`** — callers keep owning their own
 *     `animate={{ [sizeKey]: ... }}` target and merge this transition in.
 *     `depth-fade` is the one exception: it returns the full modal-shaped
 *     `{ initial, animate, exit }` object for `family: 'resize'` too (see
 *     `PanelTransitionResult.motionProps`'s field doc for how to merge it
 *     with the size-keyed animate target).
 * - `MaskOverlay` — only for `curtain-wipe` / `pixel-dissolve` /
 *   `venetian-blinds`. Render it as a `pointer-events-none` absolutely
 *   positioned layer above the panel's content, e.g.
 *   `{MaskOverlay && <MaskOverlay glass={glass} />}`, and — for the modal
 *   family — as a sibling *inside* the same `AnimatePresence`/mount boundary
 *   as the panel content, so its own exit animation is honored before
 *   unmount. Absent (`undefined`) for `iris-clip` / `depth-fade` / `default`.
 *   **This is a freshly created component on every call** — memoize the
 *   result (e.g. `useMemo` keyed on `variant`/`tokens`/`reduced`/`ctx`) if
 *   called inline during render, or the mask subtree remounts (losing
 *   in-flight animation state) on every unrelated re-render. See
 *   `PanelTransitionResult.MaskOverlay`'s field doc for the full detail.
 * - `clipOrigin` / `clipPathHidden` / `clipPathVisible` — only for
 *   `iris-clip`; the latter two only for `family: 'resize'`.
 * - `staggerConfig` — only for `pixel-dissolve`.
 * - `slatConfig` — only for `venetian-blinds`.
 *
 * All mask/grid/slat coloring resolves via `getPanelSurfaceClasses(glass)` —
 * never a hardcoded color — so masks always match whatever glass/solid
 * setting the panel itself is rendered with.
 */
export function buildPanelTransition(
  variant: RoboTransitionVariant,
  tokens: RoboAnimationTokens,
  reduced: boolean,
  ctx: PanelTransitionContext,
): PanelTransitionResult {
  switch (variant) {
    case 'default':
      return buildDefault(tokens, reduced, ctx);
    case 'curtain-wipe':
      return buildCurtainWipe(tokens, reduced, ctx);
    case 'pixel-dissolve':
      return buildPixelDissolve(tokens, reduced, ctx);
    case 'iris-clip':
      return buildIrisClip(tokens, reduced, ctx);
    case 'venetian-blinds':
      return buildVenetianBlinds(tokens, reduced, ctx);
    case 'depth-fade':
      return buildDepthFade(tokens, reduced, ctx);
  }
}

export { CurtainWipeMask, PixelGridMask, VenetianBlindsMask };
