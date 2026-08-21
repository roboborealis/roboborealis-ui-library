// Config & hooks
export { useAnimationTokens, readAnimationTokens } from './config/use-animation-tokens';
export { buildPresets } from './config/animation-presets';
export type { RoboAnimationTokens, RoboMotionTransition, RoboSpringTransition } from './config/types';
export type { AnimationPreset, RoboAnimationPreset } from './config/animation-presets';

// Panel transition variants (RoboSheet / RoboPeekSheet / RoboQuickPanel)
export { buildPanelTransition, CurtainWipeMask, PixelGridMask, VenetianBlindsMask } from './variants/panel-transitions';
export type {
  RoboTransitionVariant,
  PanelTransitionFamily,
  PanelTransitionContext,
  PanelTransitionResult,
  PanelMaskOverlayProps,
  StaggerConfig,
  SlatConfig,
  CurtainWipeMaskProps,
  PixelGridMaskProps,
  VenetianBlindsMaskProps,
  DepthFadeMotionProps,
} from './variants/panel-transitions';

// Primitives
export { RoboFadeIn } from './primitives/robo-fade';
export type { RoboFadeInProps } from './primitives/robo-fade';

export { RoboSlideIn } from './primitives/robo-slide';
export type { RoboSlideInProps, SlideDirection } from './primitives/robo-slide';

export { RoboScaleIn } from './primitives/robo-scale';
export type { RoboScaleInProps } from './primitives/robo-scale';

export { RoboStagger } from './primitives/robo-stagger';
export type { RoboStaggerProps } from './primitives/robo-stagger';

// Advanced
export { RoboInView } from './advanced/robo-in-view';
export type { RoboInViewProps } from './advanced/robo-in-view';

export { RoboNumberTicker } from './advanced/robo-number-ticker';
export type { RoboNumberTickerProps } from './advanced/robo-number-ticker';

export { RoboTextEffect } from './advanced/robo-text-effect';
export type { RoboTextEffectProps, TextEffectVariant, TextEffectSplit } from './advanced/robo-text-effect';

export { RoboTransitionPanel } from './advanced/robo-transition-panel';
export type { RoboTransitionPanelProps, RoboTransitionPanelItem, TransitionPanelDirection } from './advanced/robo-transition-panel';
