import * as React from 'react';

// ---------------------------------------------------------------------------
// Shared mount/unmount-cycling logic for masked panel-transition variants
// (curtain-wipe / pixel-dissolve / venetian-blinds) on always-mounted,
// toggle-driven panels (RoboPeekSheet, RoboQuickPanel). Extracted once a
// second consumer (RoboQuickPanel, structurally identical to RoboPeekSheet —
// always mounted, resizes on a boolean toggle rather than mounting/
// unmounting) needed the exact same mechanism, mirroring the precedent set
// by `usePeekPin` in this same directory.
// ---------------------------------------------------------------------------

export interface UseMaskReplayResult {
  /** Whether the mask overlay should currently be mounted. Gate rendering
   *  `<MaskOverlay>` (inside your own `<AnimatePresence>`) on this. */
  visible: boolean;
  /** Bump-per-cycle counter — use as the mask wrapper's React `key` so
   *  `AnimatePresence` treats every toggle as a fresh mount, even if a rapid
   *  second toggle arrives before `visible` has had a chance to flip back to
   *  `false` (see "Rapid-toggle correctness" below). */
  cycleKey: number;
}

/**
 * `useMaskReplay` — makes a `panel-transitions.ts` `MaskOverlay` (built to
 * animate its `initial`/`animate`/`exit` exactly once per mount/unmount,
 * which fits `RoboSheetContent`'s real `AnimatePresence` mount/unmount) work
 * correctly on a panel that's *always mounted* and only toggles a boolean
 * (`RoboPeekSheet`'s `expanded`, `RoboQuickPanel`'s equivalent).
 *
 * Rendering `<MaskOverlay>` as a permanently-mounted sibling would play its
 * reveal animation exactly once, on first render, and then sit there
 * inertly forever — it would never replay on later toggles, defeating the
 * point of a masked "reveal" variant entirely.
 *
 * This hook instead mounts the mask for the duration of each toggle's
 * transition (`unmountDelayMs`, computed by the caller — see below) and
 * unmounts it again once that time has elapsed, wrapped by the caller in its
 * own local `<AnimatePresence>` so the mask's own `exit` still plays before
 * removal:
 *
 * ```tsx
 * const { visible, cycleKey } = useMaskReplay(!!MaskOverlay, expanded, !!reduced, unmountDelayMs);
 * // ...
 * {MaskOverlay && (
 *   <AnimatePresence>
 *     {visible && (
 *       <div aria-hidden='true' key={cycleKey}>
 *         <MaskOverlay glass={glass} />
 *       </div>
 *     )}
 *   </AnimatePresence>
 * )}
 * ```
 *
 * ## `unmountDelayMs`
 *
 * The caller computes this from whatever `buildPanelTransition` returned for
 * the active variant — it is NOT a flat constant. A flat `durationNormal`
 * (220ms) badly undershoots masks with an internal per-cell/per-slat
 * stagger: `pixel-dissolve`'s 48-cell grid needs
 * `staggerConfig.staggerChildren * (cellCount - 1) + durationNormal/1000`
 * (~925ms at default tokens), and `venetian-blinds`' 8 slats need
 * `slatConfig.staggerChildren * (slatConfig.slatCount - 1) + durationNormal/1000`
 * (~316ms) — both well past 220ms. Unmounting early cuts the stagger off
 * mid-flight, producing a visible snap instead of a smooth reveal. Only
 * `curtain-wipe` (a flat, unstaggered two-mask slide) is actually covered by
 * the flat duration. Pass `0` when `reduced` — the mask should still
 * mount/unmount once (for a consistent DOM shape across variants/renders)
 * but must not visibly linger.
 *
 * ## Rapid-toggle correctness
 *
 * `cycleKey` is real React state (not a ref read directly in JSX): if
 * `expanded` toggles again before the previous cycle's unmount timer has
 * fired, `visible` is already `true`, so a same-value `setVisible(true)`
 * would be bailed out by React and never re-render — leaving a
 * ref-based key un-picked-up and the replay silently skipped. Deriving the
 * key from its own state setter (`setCycleKey(k => k + 1)`), called
 * unconditionally on every toggle, guarantees a fresh render (and thus a
 * fresh `key` `AnimatePresence` can see) regardless of `visible`'s current
 * value.
 *
 * @param hasMask Whether the active variant has a `MaskOverlay` at all
 *   (`!!buildPanelTransition(...).MaskOverlay`). When `false`, this hook is
 *   inert — `visible` stays `false` and no timers are scheduled.
 * @param toggleValue The boolean this panel toggles between its two states
 *   (`expanded`) — every change is one "cycle" to replay.
 * @param reduced Collapses `unmountDelayMs` to an effectively-immediate
 *   unmount (still cycles, just without a visible lingering mask).
 * @param unmountDelayMs How long to keep the mask mounted before unmounting
 *   it again, in ms — see "unmountDelayMs" above. Ignored (treated as `0`)
 *   when `reduced`.
 */
export function useMaskReplay(
  hasMask: boolean,
  toggleValue: boolean,
  reduced: boolean,
  unmountDelayMs: number
): UseMaskReplayResult {
  const [visible, setVisible] = React.useState(false);
  const [cycleKey, setCycleKey] = React.useState(0);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const isFirstRenderRef = React.useRef(true);

  React.useEffect(() => {
    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      return;
    }
    if (!hasMask) return;

    // Unconditional state-setter bump, not a ref increment read directly in
    // JSX — guarantees a re-render (and thus a fresh key AnimatePresence can
    // observe) even if `visible` is already `true` from a rapid prior toggle,
    // where a same-value `setVisible(true)` alone would otherwise be bailed
    // out by React with no re-render at all.
    setCycleKey((k) => k + 1);
    setVisible(true);

    const delay = reduced ? 0 : unmountDelayMs;
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setVisible(false), delay);

    return () => clearTimeout(timeoutRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only `toggleValue` should retrigger a replay cycle; `hasMask`/`reduced`/`unmountDelayMs` changing mid-cycle shouldn't itself start a new one.
  }, [toggleValue]);

  // Once a variant stops having a mask (e.g. switched away in a Storybook
  // variant switcher), make sure no stale mask stays mounted.
  React.useEffect(() => {
    if (!hasMask) setVisible(false);
  }, [hasMask]);

  return { visible, cycleKey };
}
