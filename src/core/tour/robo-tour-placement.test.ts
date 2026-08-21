import { ensureSafePlacement, type Viewport } from './robo-tour-placement';
import type { RoboTourStep } from './robo-product-tour';

const VIEWPORT: Viewport = { width: 1024, height: 768 };

function rect(partial: Partial<DOMRect>): DOMRect {
  return {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: 0,
    height: 0,
    x: 0,
    y: 0,
    toJSON: () => ({}),
    ...partial,
  } as DOMRect;
}

const BASE_STEP: RoboTourStep = { target: '#target', content: 'Step content' };

describe('ensureSafePlacement', () => {
  it('leaves an unset placement alone when the default bottom side has room', () => {
    const target = rect({ top: 300, bottom: 340, left: 300, right: 400 });
    const result = ensureSafePlacement(BASE_STEP, target, VIEWPORT);
    expect(result.placement).toBeUndefined();
  });

  it('leaves an explicit placement alone when that side has room', () => {
    const step: RoboTourStep = { ...BASE_STEP, placement: 'right' };
    const target = rect({ top: 300, bottom: 340, left: 300, right: 400 });
    const result = ensureSafePlacement(step, target, VIEWPORT);
    expect(result.placement).toBe('right');
  });

  it('passes through "center" without measuring room', () => {
    const step: RoboTourStep = { ...BASE_STEP, placement: 'center' };
    // Zero-room rect that would otherwise force a fallback — 'center' must bypass the check entirely.
    const target = rect({ top: 0, left: 0, right: VIEWPORT.width, bottom: VIEWPORT.height });
    const result = ensureSafePlacement(step, target, VIEWPORT);
    expect(result.placement).toBe('center');
  });

  it('passes through "auto" without measuring room', () => {
    const step: RoboTourStep = { ...BASE_STEP, placement: 'auto' };
    const target = rect({ top: 0, left: 0, right: VIEWPORT.width, bottom: VIEWPORT.height });
    const result = ensureSafePlacement(step, target, VIEWPORT);
    expect(result.placement).toBe('auto');
  });

  it('falls back to "center" when a full-viewport target has no room on any side', () => {
    // e.g. AppShellTemplate's '#app-shell-dashboard-content' or MapDashboardStarterTemplate's map.
    const target = rect({ top: 0, left: 0, right: VIEWPORT.width, bottom: VIEWPORT.height });
    const result = ensureSafePlacement(BASE_STEP, target, VIEWPORT);
    expect(result.placement).toBe('center');
  });

  it('redirects a default-bottom placement to "right" for a full-height narrow sidebar', () => {
    // e.g. TableStarterTemplate's '#filter-table-detail-filters' aside.
    const target = rect({ top: 0, left: 0, right: 280, bottom: VIEWPORT.height });
    const result = ensureSafePlacement(BASE_STEP, target, VIEWPORT);
    expect(result.placement).toBe('right');
  });

  it('redirects a default-bottom placement to "left" for a full-height sidebar on the right edge', () => {
    const target = rect({ top: 0, left: VIEWPORT.width - 280, right: VIEWPORT.width, bottom: VIEWPORT.height });
    const result = ensureSafePlacement(BASE_STEP, target, VIEWPORT);
    expect(result.placement).toBe('left');
  });

  it('redirects an explicit "top" placement to "bottom" for a top-pinned toolbar', () => {
    // This is the reported bug: a full-width header/toolbar near the top of the
    // viewport, explicitly (or by convention) placed 'top' — which has zero room
    // above it and renders the tooltip off-screen above the browser viewport.
    const step: RoboTourStep = { ...BASE_STEP, placement: 'top' };
    const target = rect({ top: 0, left: 0, right: VIEWPORT.width, bottom: 60 });
    const result = ensureSafePlacement(step, target, VIEWPORT);
    expect(result.placement).toBe('bottom');
  });

  it('redirects a default-bottom placement to "top" for a bottom-pinned bar', () => {
    const target = rect({ top: VIEWPORT.height - 60, left: 0, right: VIEWPORT.width, bottom: VIEWPORT.height });
    const result = ensureSafePlacement(BASE_STEP, target, VIEWPORT);
    expect(result.placement).toBe('top');
  });

  it('preserves the rest of the step when overriding placement', () => {
    const step: RoboTourStep = { target: '#target', title: 'Title', content: 'Content', skipBeacon: true };
    const target = rect({ top: 0, left: 0, right: VIEWPORT.width, bottom: VIEWPORT.height });
    const result = ensureSafePlacement(step, target, VIEWPORT);
    expect(result).toMatchObject({ target: '#target', title: 'Title', content: 'Content', skipBeacon: true });
  });
});
