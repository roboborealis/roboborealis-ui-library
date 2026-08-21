import * as React from 'react';

/**
 * Pointer-glow: a themed highlight that tracks the cursor over any element carrying
 * `data-glow`. The CSS (see the `[data-glow]` rules in `themes/surface-styles.css`)
 * paints a masked border-ring `radial-gradient` at `--robo-glow-x` / `--robo-glow-y`;
 * this module keeps those two custom properties updated.
 *
 * A single document-level `pointermove` listener (rAF-throttled) updates whichever
 * `[data-glow]` element is under the cursor — so any number of components glow from
 * one listener, and a component only needs the `data-glow` attribute. This also works
 * for replaced elements (an `<input>` can't host a `::after`) when the attribute is
 * placed on a wrapping element.
 */

let installed = false;

/** Installs the shared pointer listener once. Idempotent; safe to call repeatedly. */
export function installPointerGlow(): void {
  if (installed || typeof document === 'undefined') return;
  installed = true;

  let frame = 0;
  let pending: { el: HTMLElement; x: number; y: number } | null = null;

  const flush = () => {
    frame = 0;
    if (!pending) return;
    pending.el.style.setProperty('--robo-glow-x', `${pending.x}px`);
    pending.el.style.setProperty('--robo-glow-y', `${pending.y}px`);
    pending = null;
  };

  document.addEventListener(
    'pointermove',
    (event) => {
      const target = event.target as Element | null;
      const el = target?.closest?.('[data-glow]') as HTMLElement | null;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      pending = { el, x: event.clientX - rect.left, y: event.clientY - rect.top };
      if (!frame) frame = requestAnimationFrame(flush);
    },
    { passive: true }
  );
}

/**
 * usePointerGlow — ensures the shared pointer-glow listener is installed, and returns
 * an `onPointerMove` handler for elements that prefer a self-contained local handler
 * (e.g. so the effect works even before the global listener is installed). Most
 * components only need the `data-glow` attribute plus this hook (or any other glowing
 * component on the page) to install the listener.
 *
 * @example
 * ```tsx
 * const { onPointerMove } = usePointerGlow<HTMLButtonElement>();
 * return <button data-glow onPointerMove={onPointerMove}>Click</button>;
 * ```
 */
export function usePointerGlow<T extends HTMLElement = HTMLElement>() {
  React.useEffect(() => {
    installPointerGlow();
  }, []);

  const onPointerMove = React.useCallback((event: React.PointerEvent<T>) => {
    const el = event.currentTarget;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--robo-glow-x', `${event.clientX - rect.left}px`);
    el.style.setProperty('--robo-glow-y', `${event.clientY - rect.top}px`);
  }, []);

  return { onPointerMove };
}

/**
 * Composes the pointer-glow handler with a caller-provided `onPointerMove` so both run.
 * Use inside a component that already forwards an `onPointerMove` prop.
 */
export function mergePointerGlow<T extends HTMLElement>(
  glow: (event: React.PointerEvent<T>) => void,
  provided?: (event: React.PointerEvent<T>) => void
) {
  if (!provided) return glow;
  return (event: React.PointerEvent<T>) => {
    glow(event);
    provided(event);
  };
}
