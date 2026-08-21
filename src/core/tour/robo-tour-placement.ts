import type { RoboTourStep } from './robo-product-tour';

type BaseDirection = 'top' | 'bottom' | 'left' | 'right';

/** Plain viewport dimensions — decoupled from `window` so this stays pure and testable. */
export interface Viewport {
  width: number;
  height: number;
}

// Default tooltip width (380) + offset (10) + arrow (16), rounded up for a small buffer.
const MIN_HORIZONTAL_SPACE = 420;
// No fixed tooltip height (it's content-driven) — this covers a typical title + content + footer.
const MIN_VERTICAL_SPACE = 200;

function baseDirectionOf(placement: RoboTourStep['placement']): BaseDirection | undefined {
  if (!placement || placement === 'center' || placement === 'auto') return undefined;
  return placement.split('-')[0] as BaseDirection;
}

function roomFor(direction: BaseDirection, rect: DOMRect, viewport: Viewport): number {
  switch (direction) {
    case 'top':
      return rect.top;
    case 'bottom':
      return viewport.height - rect.bottom;
    case 'left':
      return rect.left;
    case 'right':
      return viewport.width - rect.right;
  }
}

function hasRoom(direction: BaseDirection, rect: DOMRect, viewport: Viewport): boolean {
  const min = direction === 'left' || direction === 'right' ? MIN_HORIZONTAL_SPACE : MIN_VERTICAL_SPACE;
  return roomFor(direction, rect, viewport) >= min;
}

/**
 * Joyride's flip/shift middleware can only reposition within the axis its
 * chosen placement started on — against a target whose edge already sits at
 * (or past) the viewport boundary, every candidate on that axis is off-screen
 * too, and flip settles for the least-bad option instead of failing. Measure
 * the target's actual on-screen room and fall back to a side that has it (or
 * `'center'`, which ignores the target rect entirely) before Joyride gets a
 * chance to guess wrong. A `placement` that already fits — explicit or
 * Joyride's own `'bottom'` default — passes through unchanged.
 */
export function ensureSafePlacement(step: RoboTourStep, rect: DOMRect, viewport: Viewport): RoboTourStep {
  if (step.placement === 'center' || step.placement === 'auto') return step;
  const requestedDirection = baseDirectionOf(step.placement) ?? 'bottom';
  if (hasRoom(requestedDirection, rect, viewport)) return step;
  const fallbackOrder: BaseDirection[] = ['bottom', 'top', 'right', 'left'];
  const safeDirection = fallbackOrder.find((direction) => hasRoom(direction, rect, viewport));
  return { ...step, placement: safeDirection ?? 'center' };
}
