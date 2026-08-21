import * as React from 'react';

import { useMaskReplay } from '@/core/hooks/use-mask-replay';

import {
  buildPanelTransition,
  type RoboTransitionVariant,
  type DepthFadeMotionProps,
  type RoboSheetSide,
} from './variants/panel-transitions';
import type { RoboAnimationTokens } from './config/types';

// ---------------------------------------------------------------------------
// usePanelTransitionMotion — the shared peek↔expand transition logic for
// always-mounted resize panels (RoboPeekSheet, RoboQuickPanel). Both components
// previously carried a byte-identical copy of this block; the source comments
// in each literally cross-referenced the other. It lives here once.
//
// The caller owns only its size dimension (e.g. `{ width: '240px' }`); this
// hook layers the depth-fade / iris-clip / masked-variant behaviour on top and
// returns ready-to-spread motion props, plus the mask-replay state the caller
// renders its MaskOverlay from.
// ---------------------------------------------------------------------------

export interface UsePanelTransitionMotionParams {
  transitionVariant: RoboTransitionVariant;
  tokens: RoboAnimationTokens;
  /** Result of useReducedMotion() — nullable, matching motion/react. */
  reduced: boolean | null;
  side: RoboSheetSide;
  expanded: boolean;
}

export interface PanelTransitionMotion {
  /** True when the panel resizes along the x-axis (left/right sides). */
  horizontal: boolean;
  /** The CSS dimension the panel animates: 'width' (horizontal) or 'height'. */
  sizeKey: 'width' | 'height';
  /** Mask overlay component for curtain-wipe / pixel-dissolve / venetian-blinds, or null. */
  MaskOverlay: ReturnType<typeof buildPanelTransition>['MaskOverlay'];
  /** Whether the mask overlay should currently render. */
  maskVisible: boolean;
  /** Key that forces the mask to replay on each peek↔expand toggle. */
  maskCycleKey: number;
  /**
   * Layer the active transition variant onto the caller's base animate target
   * (its size dimension) and return props to spread onto the panel's motion.div.
   */
  buildMotionProps: (baseAnimate: Record<string, unknown>) => {
    animate: Record<string, unknown>;
    transition: Record<string, unknown> | undefined;
  };
}

const isHorizontalSide = (side: RoboSheetSide) => side === 'left' || side === 'right';

export function usePanelTransitionMotion({
  transitionVariant,
  tokens,
  reduced,
  side,
  expanded,
}: UsePanelTransitionMotionParams): PanelTransitionMotion {
  const horizontal = isHorizontalSide(side);
  const sizeKey: 'width' | 'height' = horizontal ? 'width' : 'height';

  const { motionProps, MaskOverlay, clipPathHidden, clipPathVisible, staggerConfig, slatConfig } =
    React.useMemo(
      () => buildPanelTransition(transitionVariant, tokens, !!reduced, { side, family: 'resize' }),
      [transitionVariant, tokens, reduced, side]
    );

  // `unmountDelayMs` is computed per variant from the actual stagger/slat config
  // buildPanelTransition returned — NOT a flat durationNormal — so masked
  // variants keep their stagger-aware exit timing.
  const unmountDelayMs = React.useMemo(() => {
    if (reduced) return 0;
    switch (transitionVariant) {
      case 'pixel-dissolve':
        // staggerConfig (incl. cellCount) is guaranteed present for this variant;
        // the `?? 0` fallbacks are defensive against the type's optionality only.
        return (
          (staggerConfig?.staggerChildren ?? 0) * ((staggerConfig?.cellCount ?? 1) - 1) * 1000 + tokens.durationNormal
        );
      case 'venetian-blinds':
        return (
          (staggerConfig?.staggerChildren ?? 0) * ((slatConfig?.slatCount ?? 1) - 1) * 1000 + tokens.durationNormal
        );
      case 'curtain-wipe':
      default:
        return tokens.durationNormal;
    }
  }, [reduced, transitionVariant, staggerConfig, slatConfig, tokens.durationNormal]);

  const { visible: maskVisible, cycleKey: maskCycleKey } = useMaskReplay(
    !!MaskOverlay,
    expanded,
    !!reduced,
    unmountDelayMs
  );

  // depth-fade reinterpretation for the resize family: motionProps.animate's
  // values are the "revealed" (expanded) look, motionProps.initial's are the
  // "receded" (peek) look — deliberately `initial`, not `exit` (whose flat
  // blur(0px) would make depth-fade indistinguishable from a plain fade).
  // Opacity is pinned to 1 in both states since these panels are always mounted.
  const isDepthFade = transitionVariant === 'depth-fade';
  const depthFadeProps = React.useMemo(() => {
    if (!isDepthFade) return null;
    // Route through `unknown` to narrow motionProps (declared Record<string,
    // unknown>) to the shared module's exported DepthFadeMotionProps.
    const mp = motionProps as unknown as DepthFadeMotionProps;
    return expanded
      ? { opacity: 1, scale: mp.animate.scale, filter: mp.animate.filter, transition: mp.animate.transition }
      : { opacity: 1, scale: mp.initial.scale, filter: mp.initial.filter, transition: mp.exit.transition };
  }, [isDepthFade, motionProps, expanded]);

  const buildMotionProps = (baseAnimate: Record<string, unknown>) => {
    const animate: Record<string, unknown> =
      isDepthFade && depthFadeProps
        ? { ...baseAnimate, opacity: depthFadeProps.opacity, scale: depthFadeProps.scale, filter: depthFadeProps.filter }
        : transitionVariant === 'iris-clip'
          ? { ...baseAnimate, clipPath: expanded ? clipPathVisible : clipPathHidden }
          : { ...baseAnimate };
    const transition = isDepthFade && depthFadeProps
      ? depthFadeProps.transition
      : (motionProps as { transition?: Record<string, unknown> }).transition;
    return { animate, transition };
  };

  return { horizontal, sizeKey, MaskOverlay, maskVisible, maskCycleKey, buildMotionProps };
}
