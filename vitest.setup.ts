import '@testing-library/jest-dom/vitest';
import { expect } from 'vitest';
import * as axeMatchers from 'vitest-axe/matchers';

// axe a11y matchers (toHaveNoViolations) — registered globally so test files
// only import { axe } from 'vitest-axe'
expect.extend(axeMatchers);

// cmdk (and some other libs) uses ResizeObserver — jsdom doesn't include it.
if (typeof global.ResizeObserver === 'undefined') {
  global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

// @floating-ui/react-dom (via react-joyride, used by RoboProductTour) probes
// IntersectionObserver for layout-shift-aware auto-updating — jsdom doesn't
// include it either.
if (typeof global.IntersectionObserver === 'undefined') {
  global.IntersectionObserver = class IntersectionObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof IntersectionObserver;
}

// jsdom implements no media queries, so `window.matchMedia` is absent and
// anything reading a user preference throws on first render. Reports "no
// preference" for every query, exercising the default path rather than the
// reduced-motion fallback.
if (typeof window.matchMedia !== 'function') {
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
    // Deprecated pre-EventTarget API; some libraries still feature-detect it.
    addListener: () => {},
    removeListener: () => {},
  })) as typeof window.matchMedia;
}

// cmdk calls scrollIntoView on list items during keyboard navigation — jsdom no-ops it.
if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = function () {};
}

// Radix UI (Select, Combobox, etc.) calls hasPointerCapture/setPointerCapture when
// a trigger is clicked — jsdom doesn't implement these PointerEvent APIs.
if (!HTMLElement.prototype.hasPointerCapture) {
  HTMLElement.prototype.hasPointerCapture = () => false;
  HTMLElement.prototype.setPointerCapture = () => {};
  HTMLElement.prototype.releasePointerCapture = () => {};
}

// jsdom's PointerEvent does not inherit MouseEvent coordinate/button props —
// `clientX`/`clientY` come back undefined, so any pointer-drag handler that reads
// them (e.g. RoboFloatingPanel) sees a zero delta under `fireEvent.pointer*`.
// Back PointerEvent with MouseEvent so coordinates flow through, and carry the
// pointer-specific fields libraries feature-detect on.
{
  const NativePointerEvent = (globalThis as { PointerEvent?: typeof PointerEvent }).PointerEvent;
  const coordsDropped =
    !NativePointerEvent ||
    new NativePointerEvent('pointermove', { clientX: 1 }).clientX !== 1;
  if (coordsDropped) {
    class PointerEventPolyfill extends MouseEvent {
      public readonly pointerId: number;
      public readonly pointerType: string;
      public readonly isPrimary: boolean;
      public readonly width: number;
      public readonly height: number;
      public readonly pressure: number;
      constructor(type: string, params: PointerEventInit = {}) {
        super(type, params);
        this.pointerId = params.pointerId ?? 0;
        this.pointerType = params.pointerType ?? '';
        this.isPrimary = params.isPrimary ?? false;
        this.width = params.width ?? 1;
        this.height = params.height ?? 1;
        this.pressure = params.pressure ?? 0;
      }
    }
    global.PointerEvent = PointerEventPolyfill as unknown as typeof PointerEvent;
    window.PointerEvent = PointerEventPolyfill as unknown as typeof PointerEvent;
  }
}

// jsdom does not implement canvas 2D contexts (milsymbol and chart internals
// probe them). Return null instead of throwing "Not implemented".
if (typeof HTMLCanvasElement !== 'undefined') {
  HTMLCanvasElement.prototype.getContext = (() => null) as typeof HTMLCanvasElement.prototype.getContext;
}

// jsdom throws on getComputedStyle with a pseudo-element argument (Radix and
// motion probe ::before/::after) — drop the second argument.
const _getComputedStyle = window.getComputedStyle.bind(window);
window.getComputedStyle = ((elt: Element, pseudoElt?: string | null) =>
  pseudoElt ? _getComputedStyle(elt) : _getComputedStyle(elt)) as typeof window.getComputedStyle;
