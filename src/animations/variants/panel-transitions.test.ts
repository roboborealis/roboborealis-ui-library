import * as React from 'react';
import { render } from '@testing-library/react';
import { motion } from 'motion/react';

import { getPanelSurfaceClasses, GLASS_SURFACE_CLASSES, SOLID_SURFACE_CLASSES } from '@/core/glass-surface';

import { buildPanelTransition } from './panel-transitions';
import type { PanelTransitionContext } from './panel-transitions';
import { FALLBACK_TOKENS } from './test-fixtures';

const modalRight: PanelTransitionContext = { side: 'right', family: 'modal' };
const modalTop: PanelTransitionContext = { side: 'top', family: 'modal' };
const resizeRight: PanelTransitionContext = { side: 'right', family: 'resize' };
const resizeLeft: PanelTransitionContext = { side: 'left', family: 'resize' };
const resizeTop: PanelTransitionContext = { side: 'top', family: 'resize' };
const resizeBottom: PanelTransitionContext = { side: 'bottom', family: 'resize' };

describe('buildPanelTransition — default variant', () => {
  it('modal family: reproduces the slide offset + opacity fade for a given side, not reduced', () => {
    const result = buildPanelTransition('default', FALLBACK_TOKENS, false, modalRight);
    expect(result.motionProps.initial).toEqual({ x: '100%', y: 0, opacity: 0 });
    expect(result.motionProps.animate).toMatchObject({ x: 0, y: 0, opacity: 1 });
    expect(result.motionProps.exit).toMatchObject({ x: '100%', y: 0, opacity: 0 });
  });

  it('modal family: offset differs per side (top slides in from -100% on y)', () => {
    const result = buildPanelTransition('default', FALLBACK_TOKENS, false, modalTop);
    expect(result.motionProps.initial).toEqual({ x: 0, y: '-100%', opacity: 0 });
  });

  it('modal family: reduced motion collapses the offset to zero and duration to 0', () => {
    const result = buildPanelTransition('default', FALLBACK_TOKENS, true, modalRight);
    expect(result.motionProps.initial).toEqual({ x: 0, y: 0, opacity: 0 });
    const animateTransition = (result.motionProps.animate as { transition: { duration: number } }).transition;
    expect(animateTransition).toEqual({ duration: 0 });
  });

  it('modal family: uses presets.standard timing when not reduced', () => {
    const result = buildPanelTransition('default', FALLBACK_TOKENS, false, modalRight);
    const animateTransition = (result.motionProps.animate as { transition: { duration: number; ease: unknown } }).transition;
    expect(animateTransition.duration).toBeCloseTo(FALLBACK_TOKENS.durationNormal / 1000);
    expect(animateTransition.ease).toEqual(FALLBACK_TOKENS.easeEnter);
  });

  it('resize family: returns a bare transition timing object (no offset/opacity — instance owns the animate target)', () => {
    const result = buildPanelTransition('default', FALLBACK_TOKENS, false, resizeRight);
    expect(result.motionProps.transition).toMatchObject({
      duration: FALLBACK_TOKENS.durationNormal / 1000,
      ease: FALLBACK_TOKENS.easeEnter,
    });
    expect(result.motionProps.initial).toBeUndefined();
    expect(result.motionProps.animate).toBeUndefined();
  });

  it('resize family: reduced motion returns duration 0', () => {
    const result = buildPanelTransition('default', FALLBACK_TOKENS, true, resizeRight);
    expect(result.motionProps.transition).toEqual({ duration: 0 });
  });

  it('has no MaskOverlay for either family', () => {
    expect(buildPanelTransition('default', FALLBACK_TOKENS, false, modalRight).MaskOverlay).toBeUndefined();
    expect(buildPanelTransition('default', FALLBACK_TOKENS, false, resizeRight).MaskOverlay).toBeUndefined();
  });
});

describe('buildPanelTransition — reduced motion contract (all variants)', () => {
  const variants = ['curtain-wipe', 'pixel-dissolve', 'iris-clip', 'venetian-blinds', 'depth-fade'] as const;

  it.each(variants)('%s: every transition-like value collapses to duration 0 when reduced', (variant) => {
    const result = buildPanelTransition(variant, FALLBACK_TOKENS, true, modalRight);
    const seen: unknown[] = [];
    const collectTransitions = (value: unknown) => {
      if (!value || typeof value !== 'object') return;
      const record = value as Record<string, unknown>;
      if ('transition' in record) seen.push(record.transition);
      for (const key of Object.keys(record)) {
        if (key !== 'transition') collectTransitions(record[key]);
      }
    };
    collectTransitions(result.motionProps);
    if (typeof result.motionProps.transition !== 'undefined') {
      expect(result.motionProps.transition).toMatchObject({ duration: 0 });
    }
    seen.forEach((t) => expect(t).toMatchObject({ duration: 0 }));
  });

  it('pixel-dissolve: stagger delay is 0 when reduced', () => {
    const result = buildPanelTransition('pixel-dissolve', FALLBACK_TOKENS, true, modalRight);
    expect(result.staggerConfig?.staggerChildren).toBe(0);
    expect(result.staggerConfig?.delayChildren).toBe(0);
  });

  it('pixel-dissolve: stagger delay is nonzero when not reduced', () => {
    const result = buildPanelTransition('pixel-dissolve', FALLBACK_TOKENS, false, modalRight);
    expect(result.staggerConfig?.staggerChildren).toBeGreaterThan(0);
  });

  it('venetian-blinds: alternating transformOrigin flourish is suppressed when reduced', () => {
    const result = buildPanelTransition('venetian-blinds', FALLBACK_TOKENS, true, modalRight);
    expect(result.slatConfig?.alternateOrigin).toBe(false);
  });

  it('venetian-blinds: alternating transformOrigin flourish is enabled when not reduced', () => {
    const result = buildPanelTransition('venetian-blinds', FALLBACK_TOKENS, false, modalRight);
    expect(result.slatConfig?.alternateOrigin).toBe(true);
  });
});

describe('buildPanelTransition — MaskOverlay presence', () => {
  it('curtain-wipe returns a MaskOverlay', () => {
    expect(buildPanelTransition('curtain-wipe', FALLBACK_TOKENS, false, modalRight).MaskOverlay).toBeDefined();
  });

  it('pixel-dissolve returns a MaskOverlay', () => {
    expect(buildPanelTransition('pixel-dissolve', FALLBACK_TOKENS, false, modalRight).MaskOverlay).toBeDefined();
  });

  it('venetian-blinds returns a MaskOverlay', () => {
    expect(buildPanelTransition('venetian-blinds', FALLBACK_TOKENS, false, modalRight).MaskOverlay).toBeDefined();
  });

  it('iris-clip does NOT return a MaskOverlay', () => {
    expect(buildPanelTransition('iris-clip', FALLBACK_TOKENS, false, modalRight).MaskOverlay).toBeUndefined();
  });

  it('depth-fade does NOT return a MaskOverlay', () => {
    expect(buildPanelTransition('depth-fade', FALLBACK_TOKENS, false, modalRight).MaskOverlay).toBeUndefined();
  });
});

describe('pixel-dissolve — stagger/transition actually reach the rendered mask', () => {
  // `motion.div` is a `forwardRef` exotic component (`{ render: Function }`),
  // not a plain function — spying on its `.render` method lets us capture
  // the exact props React passed it for each rendered node, so we can prove
  // `transition`/`staggerConfig` are threaded onto the real elements
  // `PixelGridMask` renders, not just present on the plain JS object
  // `buildPanelTransition` returns (which the previous test suite never
  // checked, and how the missing wiring shipped unnoticed).
  function spyOnMotionDiv() {
    return vi.spyOn(motion.div, 'render');
  }

  function findCallsBySlot(spy: ReturnType<typeof spyOnMotionDiv>, slot: string) {
    return (spy.mock.calls as unknown as Array<[Record<string, unknown>]>).filter(
      (call) => call[0]?.['data-slot'] === slot,
    );
  }

  it('forwards a non-zero transition and staggerConfig onto the parent and cell motion.div elements', () => {
    const spy = spyOnMotionDiv();
    const { MaskOverlay } = buildPanelTransition('pixel-dissolve', FALLBACK_TOKENS, false, modalRight);
    if (!MaskOverlay) throw new Error('expected a MaskOverlay for pixel-dissolve');
    render(React.createElement(MaskOverlay, { glass: false }));

    const parentCalls = findCallsBySlot(spy, 'pixel-dissolve-mask');
    const cellCalls = findCallsBySlot(spy, 'pixel-dissolve-cell');

    expect(parentCalls.length).toBeGreaterThan(0);
    expect(cellCalls.length).toBeGreaterThan(0);

    // Parent must receive the (nonzero, not-reduced) stagger config.
    const parentTransition = parentCalls[0][0]?.transition as { staggerChildren?: number; delayChildren?: number };
    expect(parentTransition?.staggerChildren).toBeGreaterThan(0);

    // Every cell must receive the enter/exit timing, not an empty object.
    cellCalls.forEach(([props]) => {
      const cellTransition = props?.transition as { duration?: number } | undefined;
      expect(cellTransition).toBeDefined();
      expect(cellTransition?.duration).toBeCloseTo(FALLBACK_TOKENS.durationNormal / 1000);
    });

    spy.mockRestore();
  });

  it('forwards a zero-duration transition and zeroed staggerConfig when reduced', () => {
    const spy = spyOnMotionDiv();
    const { MaskOverlay } = buildPanelTransition('pixel-dissolve', FALLBACK_TOKENS, true, modalRight);
    if (!MaskOverlay) throw new Error('expected a MaskOverlay for pixel-dissolve');
    render(React.createElement(MaskOverlay, { glass: false }));

    const parentCalls = findCallsBySlot(spy, 'pixel-dissolve-mask');
    const cellCalls = findCallsBySlot(spy, 'pixel-dissolve-cell');

    const parentTransition = parentCalls[0][0]?.transition as { staggerChildren?: number; delayChildren?: number };
    expect(parentTransition?.staggerChildren).toBe(0);
    expect(parentTransition?.delayChildren).toBe(0);

    cellCalls.forEach(([props]) => {
      expect(props?.transition).toEqual({ duration: 0 });
    });

    spy.mockRestore();
  });
});

describe('curtain-wipe — transition actually reaches both rendered masks', () => {
  // Same technique as the pixel-dissolve suite above: spy on `motion.div`'s
  // `.render` method (it's a forwardRef exotic component, not a plain
  // function) to capture the exact props React passed each rendered node.
  function spyOnMotionDiv() {
    return vi.spyOn(motion.div, 'render');
  }

  function findCallsBySlot(spy: ReturnType<typeof spyOnMotionDiv>, slot: string) {
    return (spy.mock.calls as unknown as Array<[Record<string, unknown>]>).filter(
      (call) => call[0]?.['data-slot'] === slot,
    );
  }

  it('forwards non-zero enter/exit transitions onto both mask motion.div elements', () => {
    const spy = spyOnMotionDiv();
    const { MaskOverlay } = buildPanelTransition('curtain-wipe', FALLBACK_TOKENS, false, modalRight);
    if (!MaskOverlay) throw new Error('expected a MaskOverlay for curtain-wipe');
    render(React.createElement(MaskOverlay, { glass: false }));

    const startCalls = findCallsBySlot(spy, 'curtain-wipe-mask-start');
    const endCalls = findCallsBySlot(spy, 'curtain-wipe-mask-end');

    expect(startCalls.length).toBeGreaterThan(0);
    expect(endCalls.length).toBeGreaterThan(0);

    [...startCalls, ...endCalls].forEach(([props]) => {
      const animate = props?.animate as { transition?: { duration?: number } } | undefined;
      const exit = props?.exit as { transition?: { duration?: number } } | undefined;
      expect(animate?.transition).toBeDefined();
      expect(animate?.transition?.duration).toBeCloseTo(FALLBACK_TOKENS.durationNormal / 1000);
      expect(exit?.transition).toBeDefined();
      expect(exit?.transition?.duration).toBeCloseTo(FALLBACK_TOKENS.durationFast / 1000);
    });

    spy.mockRestore();
  });

  it('forwards duration-0 transitions onto both masks when reduced', () => {
    const spy = spyOnMotionDiv();
    const { MaskOverlay } = buildPanelTransition('curtain-wipe', FALLBACK_TOKENS, true, modalRight);
    if (!MaskOverlay) throw new Error('expected a MaskOverlay for curtain-wipe');
    render(React.createElement(MaskOverlay, { glass: false }));

    const startCalls = findCallsBySlot(spy, 'curtain-wipe-mask-start');
    const endCalls = findCallsBySlot(spy, 'curtain-wipe-mask-end');

    [...startCalls, ...endCalls].forEach(([props]) => {
      const animate = props?.animate as { transition?: { duration?: number } } | undefined;
      const exit = props?.exit as { transition?: { duration?: number } } | undefined;
      expect(animate?.transition).toEqual({ duration: 0 });
      expect(exit?.transition).toEqual({ duration: 0 });
    });

    spy.mockRestore();
  });
});

describe('buildPanelTransition — iris-clip origin', () => {
  it('modal family always uses the panel center', () => {
    const result = buildPanelTransition('iris-clip', FALLBACK_TOKENS, false, modalRight);
    expect(result.clipOrigin).toBe('50% 50%');
    const resultTop = buildPanelTransition('iris-clip', FALLBACK_TOKENS, false, modalTop);
    expect(resultTop.clipOrigin).toBe('50% 50%');
  });

  it('resize family uses a handle-relative origin that varies by side', () => {
    const right = buildPanelTransition('iris-clip', FALLBACK_TOKENS, false, resizeRight);
    const left = buildPanelTransition('iris-clip', FALLBACK_TOKENS, false, resizeLeft);
    const top = buildPanelTransition('iris-clip', FALLBACK_TOKENS, false, resizeTop);
    const bottom = buildPanelTransition('iris-clip', FALLBACK_TOKENS, false, resizeBottom);

    // Handle sits on the edge facing the map/app content — origin should be
    // on that same edge, not a generic center.
    expect(right.clipOrigin).toBe('0% 50%');
    expect(left.clipOrigin).toBe('100% 50%');
    expect(top.clipOrigin).toBe('50% 100%');
    expect(bottom.clipOrigin).toBe('50% 0%');

    const origins = new Set([right.clipOrigin, left.clipOrigin, top.clipOrigin, bottom.clipOrigin]);
    expect(origins.size).toBe(4);
  });

  it('animates clipPath between a 0% and 150% circle at the resolved origin', () => {
    const result = buildPanelTransition('iris-clip', FALLBACK_TOKENS, false, modalRight);
    expect(result.motionProps.initial).toMatchObject({ clipPath: 'circle(0% at 50% 50%)' });
    expect(result.motionProps.animate).toMatchObject({ clipPath: 'circle(150% at 50% 50%)' });
  });

  it('modal family: motionProps stays the documented { initial, animate, exit } shape — no stray clip-path keys', () => {
    const result = buildPanelTransition('iris-clip', FALLBACK_TOKENS, false, modalRight);
    expect(Object.keys(result.motionProps).sort()).toEqual(['animate', 'exit', 'initial']);
    expect(result.clipPathHidden).toBeUndefined();
    expect(result.clipPathVisible).toBeUndefined();
  });

  it('resize family: motionProps stays the strict { transition } shape — clip-path values live on their own typed fields', () => {
    const result = buildPanelTransition('iris-clip', FALLBACK_TOKENS, false, resizeRight);
    expect(Object.keys(result.motionProps)).toEqual(['transition']);
    expect(result.clipPathHidden).toBe('circle(0% at 0% 50%)');
    expect(result.clipPathVisible).toBe('circle(150% at 0% 50%)');
  });

  it('resize family: clip-path fields use the same handle-relative origin as clipOrigin', () => {
    const left = buildPanelTransition('iris-clip', FALLBACK_TOKENS, false, resizeLeft);
    expect(left.clipPathHidden).toBe(`circle(0% at ${left.clipOrigin})`);
    expect(left.clipPathVisible).toBe(`circle(150% at ${left.clipOrigin})`);
  });
});

describe('buildPanelTransition — venetian-blinds slat orientation', () => {
  it('top/bottom docked panels use horizontal slats animating scaleY', () => {
    const top = buildPanelTransition('venetian-blinds', FALLBACK_TOKENS, false, resizeTop);
    const bottom = buildPanelTransition('venetian-blinds', FALLBACK_TOKENS, false, resizeBottom);
    expect(top.slatConfig?.orientation).toBe('horizontal');
    expect(top.slatConfig?.scaleAxis).toBe('scaleY');
    expect(bottom.slatConfig?.orientation).toBe('horizontal');
    expect(bottom.slatConfig?.scaleAxis).toBe('scaleY');
  });

  it('left/right docked panels use vertical slats animating scaleX', () => {
    const left = buildPanelTransition('venetian-blinds', FALLBACK_TOKENS, false, resizeLeft);
    const right = buildPanelTransition('venetian-blinds', FALLBACK_TOKENS, false, resizeRight);
    expect(left.slatConfig?.orientation).toBe('vertical');
    expect(left.slatConfig?.scaleAxis).toBe('scaleX');
    expect(right.slatConfig?.orientation).toBe('vertical');
    expect(right.slatConfig?.scaleAxis).toBe('scaleX');
  });

  it('modal family orientation also follows side (top/bottom horizontal, left/right vertical)', () => {
    const top = buildPanelTransition('venetian-blinds', FALLBACK_TOKENS, false, modalTop);
    const right = buildPanelTransition('venetian-blinds', FALLBACK_TOKENS, false, modalRight);
    expect(top.slatConfig?.orientation).toBe('horizontal');
    expect(right.slatConfig?.orientation).toBe('vertical');
  });

  it('keeps total stagger duration within roughly durationNormal', () => {
    const result = buildPanelTransition('venetian-blinds', FALLBACK_TOKENS, false, modalRight);
    const slatCount = result.slatConfig?.slatCount ?? 0;
    const stagger = result.staggerConfig?.staggerChildren ?? 0;
    const totalStagger = slatCount * stagger * 1000;
    expect(totalStagger).toBeLessThanOrEqual(FALLBACK_TOKENS.durationNormal * 1.5);
  });
});

describe('buildPanelTransition — depth-fade', () => {
  it('provides scale, opacity, and a subtle blur filter on enter/exit', () => {
    const result = buildPanelTransition('depth-fade', FALLBACK_TOKENS, false, modalRight);
    expect(result.motionProps.initial).toMatchObject({ opacity: 0, scale: 0.96, filter: 'blur(4px)' });
    expect(result.motionProps.animate).toMatchObject({ opacity: 1, scale: 1, filter: 'blur(0px)' });
    expect(result.motionProps.exit).toMatchObject({ opacity: 0, scale: 0.98, filter: 'blur(0px)' });
  });

  it('caps blur at 4px or less', () => {
    const result = buildPanelTransition('depth-fade', FALLBACK_TOKENS, false, modalRight);
    const initial = result.motionProps.initial as { filter: string };
    const blurMatch = initial.filter.match(/blur\((\d+)px\)/);
    expect(blurMatch).not.toBeNull();
    expect(Number(blurMatch?.[1])).toBeLessThanOrEqual(4);
  });

  it('uses expressive (spring) timing on enter and standard timing on exit', () => {
    const result = buildPanelTransition('depth-fade', FALLBACK_TOKENS, false, modalRight);
    const animate = result.motionProps.animate as { transition: { type?: string } };
    const exit = result.motionProps.exit as { transition: { type?: string; duration?: number } };
    expect(animate.transition.type).toBe('spring');
    expect(exit.transition.type).toBeUndefined();
    expect(exit.transition.duration).toBeCloseTo(FALLBACK_TOKENS.durationFast / 1000);
  });

  it('behaves identically for modal and resize families', () => {
    const modal = buildPanelTransition('depth-fade', FALLBACK_TOKENS, false, modalRight);
    const resize = buildPanelTransition('depth-fade', FALLBACK_TOKENS, false, resizeRight);
    expect(modal.motionProps.initial).toEqual(resize.motionProps.initial);
    expect(modal.motionProps.animate).toEqual(resize.motionProps.animate);
    expect(modal.MaskOverlay).toBeUndefined();
    expect(resize.MaskOverlay).toBeUndefined();
  });

  it('is the one documented exception to "resize returns bare { transition }" — it returns the full initial/animate/exit shape for resize too', () => {
    const resize = buildPanelTransition('depth-fade', FALLBACK_TOKENS, false, resizeRight);
    expect(Object.keys(resize.motionProps).sort()).toEqual(['animate', 'exit', 'initial']);
  });
});

describe('buildPanelTransition — resize family motionProps contract (every variant except depth-fade)', () => {
  const variants = ['default', 'curtain-wipe', 'pixel-dissolve', 'iris-clip', 'venetian-blinds'] as const;

  it.each(variants)('%s: resize family motionProps is exactly { transition }, no other keys', (variant) => {
    const result = buildPanelTransition(variant, FALLBACK_TOKENS, false, resizeRight);
    expect(Object.keys(result.motionProps)).toEqual(['transition']);
  });

  it('reduced motion drops scale/blur and uses duration 0', () => {
    const result = buildPanelTransition('depth-fade', FALLBACK_TOKENS, true, modalRight);
    const animate = result.motionProps.animate as { transition: { duration: number } };
    expect(animate.transition).toEqual({ duration: 0 });
  });
});

describe('MaskOverlay components use getPanelSurfaceClasses for coloring', () => {
  const cases: Array<[Parameters<typeof buildPanelTransition>[0], PanelTransitionContext]> = [
    ['curtain-wipe', modalRight],
    ['pixel-dissolve', modalRight],
    ['venetian-blinds', modalRight],
  ];

  it.each(cases)('%s renders classes matching getPanelSurfaceClasses(glass), never a hardcoded color', (variant, ctx) => {
    const { MaskOverlay } = buildPanelTransition(variant, FALLBACK_TOKENS, false, ctx);
    if (!MaskOverlay) throw new Error(`expected a MaskOverlay for ${variant}`);

    const { container: glassContainer } = render(React.createElement(MaskOverlay, { glass: true }));
    const { container: solidContainer } = render(React.createElement(MaskOverlay, { glass: false }));

    const glassHtml = glassContainer.innerHTML;
    const solidHtml = solidContainer.innerHTML;

    // Every surface-colored node's class list must come verbatim from the
    // shared recipe — not a one-off hex/rgb value invented locally.
    expect(glassHtml).toContain(GLASS_SURFACE_CLASSES.split(' ')[0]);
    expect(solidHtml).toContain(SOLID_SURFACE_CLASSES.split(' ')[0]);
    expect(glassHtml).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
    expect(solidHtml).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
    expect(glassHtml).not.toBe(solidHtml);
  });

  it('sanity check: getPanelSurfaceClasses itself differs between glass and solid', () => {
    expect(getPanelSurfaceClasses(true)).not.toBe(getPanelSurfaceClasses(false));
  });
});
