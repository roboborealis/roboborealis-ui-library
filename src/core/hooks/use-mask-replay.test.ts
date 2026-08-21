// ---------------------------------------------------------------------------
// @roboborealis/components/core — useMaskReplay tests
//
// Direct coverage for the shared mount/unmount-cycling hook behind the
// masked panel-transition variants (curtain-wipe / pixel-dissolve /
// venetian-blinds) on always-mounted, toggle-driven panels (RoboPeekSheet,
// RoboQuickPanel) — previously only exercised indirectly via
// robo-peek-sheet.test.tsx. See use-mask-replay.ts's doc comment for the full
// rationale behind `unmountDelayMs` and the rapid-toggle correctness fix
// this test suite specifically regression-tests.
// ---------------------------------------------------------------------------

import { renderHook, act } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

import { useMaskReplay } from './use-mask-replay';

describe('useMaskReplay', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('starts inert: not visible, cycleKey at 0', () => {
    const { result } = renderHook(() => useMaskReplay(true, false, false, 200));
    expect(result.current.visible).toBe(false);
    expect(result.current.cycleKey).toBe(0);
  });

  it('does not trigger a cycle on first render/mount, only on a subsequent toggle', () => {
    const { result, rerender } = renderHook(({ toggleValue }) => useMaskReplay(true, toggleValue, false, 200), {
      initialProps: { toggleValue: false },
    });
    expect(result.current.visible).toBe(false);

    // Re-rendering with the SAME toggleValue must not start a cycle.
    rerender({ toggleValue: false });
    expect(result.current.visible).toBe(false);
    expect(result.current.cycleKey).toBe(0);
  });

  it('a normal toggle makes the mask visible and bumps cycleKey', () => {
    const { result, rerender } = renderHook(({ toggleValue }) => useMaskReplay(true, toggleValue, false, 200), {
      initialProps: { toggleValue: false },
    });

    rerender({ toggleValue: true });
    expect(result.current.visible).toBe(true);
    expect(result.current.cycleKey).toBe(1);
  });

  it('unmounts the mask again once unmountDelayMs elapses', () => {
    const { result, rerender } = renderHook(({ toggleValue }) => useMaskReplay(true, toggleValue, false, 200), {
      initialProps: { toggleValue: false },
    });

    rerender({ toggleValue: true });
    expect(result.current.visible).toBe(true);

    act(() => {
      vi.advanceTimersByTime(199);
    });
    expect(result.current.visible).toBe(true);

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current.visible).toBe(false);
  });

  it('a second toggle replays the cycle after the first has fully unmounted', () => {
    const { result, rerender } = renderHook(({ toggleValue }) => useMaskReplay(true, toggleValue, false, 200), {
      initialProps: { toggleValue: false },
    });

    rerender({ toggleValue: true });
    expect(result.current.visible).toBe(true);
    expect(result.current.cycleKey).toBe(1);

    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current.visible).toBe(false);

    rerender({ toggleValue: false });
    expect(result.current.visible).toBe(true);
    expect(result.current.cycleKey).toBe(2);
  });

  // -------------------------------------------------------------------------
  // Rapid-toggle correctness — regression test for the same-value setState
  // bail-out bug fixed during RoboPeekSheet's development (see use-mask-replay.ts's
  // doc comment, "Rapid-toggle correctness"). If `cycleKey` were a plain ref
  // bumped inside the effect and read directly in JSX rather than real React
  // state, a second toggle arriving while `visible` is still `true` from the
  // first toggle would call `setVisible(true)` again — a same-value setState
  // React bails out on with no re-render — so the bumped ref would never
  // actually be picked up. The observable symptom isn't that `visible`
  // becomes false; it's that `cycleKey` fails to advance for the second
  // toggle. This test asserts `cycleKey` genuinely advances on each toggle,
  // even when a second toggle arrives before the first cycle's unmount timer
  // has fired.
  // -------------------------------------------------------------------------

  it('replays on a rapid second toggle that arrives before the first cycle unmounts (regression)', () => {
    const { result, rerender } = renderHook(({ toggleValue }) => useMaskReplay(true, toggleValue, false, 200), {
      initialProps: { toggleValue: false },
    });

    // First toggle.
    rerender({ toggleValue: true });
    expect(result.current.visible).toBe(true);
    expect(result.current.cycleKey).toBe(1);

    // Advance LESS than unmountDelayMs — first cycle's mask is still
    // mounted/visible when the second toggle below fires.
    act(() => {
      vi.advanceTimersByTime(50);
    });
    expect(result.current.visible).toBe(true);

    // Second toggle, fired mid-cycle. `visible` is already `true`, so a
    // same-value `setVisible(true)` alone would bail out — `cycleKey` must
    // still advance via its own unconditional state-setter bump.
    rerender({ toggleValue: false });
    expect(result.current.visible).toBe(true);
    expect(result.current.cycleKey).toBe(2);

    // The fresh cycle's timer should govern the unmount, not the original's
    // (already-cleared) timer — advancing to just past the original timer's
    // scheduled point (50 + 150 = 200ms from first toggle) must NOT unmount
    // yet, since the second toggle restarted the clock at t=50.
    act(() => {
      vi.advanceTimersByTime(150);
    });
    expect(result.current.visible).toBe(true);

    // Now let the fresh (second) cycle's own full delay elapse.
    act(() => {
      vi.advanceTimersByTime(50);
    });
    expect(result.current.visible).toBe(false);

    // A third toggle must still replay correctly.
    rerender({ toggleValue: true });
    expect(result.current.visible).toBe(true);
    expect(result.current.cycleKey).toBe(3);
  });

  // -------------------------------------------------------------------------
  // reduced motion
  // -------------------------------------------------------------------------

  describe('reduced motion', () => {
    it('still cycles (visible flips true then false) but unmounts immediately regardless of unmountDelayMs', () => {
      const { result, rerender } = renderHook(({ toggleValue }) => useMaskReplay(true, toggleValue, true, 5000), {
        initialProps: { toggleValue: false },
      });

      rerender({ toggleValue: true });
      expect(result.current.visible).toBe(true);

      // Reduced motion collapses the delay to effectively 0, regardless of
      // the large unmountDelayMs passed in — advancing a single tick (0ms)
      // should be enough for the scheduled setTimeout(..., 0) to fire.
      act(() => {
        vi.advanceTimersByTime(0);
      });
      expect(result.current.visible).toBe(false);
    });
  });

  // -------------------------------------------------------------------------
  // hasMask
  // -------------------------------------------------------------------------

  describe('hasMask', () => {
    it('stays inert when hasMask is false — no cycle starts on toggle', () => {
      const { result, rerender } = renderHook(({ toggleValue }) => useMaskReplay(false, toggleValue, false, 200), {
        initialProps: { toggleValue: false },
      });

      rerender({ toggleValue: true });
      expect(result.current.visible).toBe(false);
      expect(result.current.cycleKey).toBe(0);
    });

    it('forces visible back to false if hasMask flips from true to false mid-cycle (cleanup)', () => {
      const { result, rerender } = renderHook(
        ({ toggleValue, hasMask }) => useMaskReplay(hasMask, toggleValue, false, 200),
        { initialProps: { toggleValue: false, hasMask: true } }
      );

      rerender({ toggleValue: true, hasMask: true });
      expect(result.current.visible).toBe(true);

      // Switch away from a masked variant (e.g. a Storybook variant
      // switcher) before the unmount timer would have fired on its own —
      // no stale mask should stay mounted.
      rerender({ toggleValue: true, hasMask: false });
      expect(result.current.visible).toBe(false);
    });
  });
});
