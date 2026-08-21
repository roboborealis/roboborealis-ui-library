import type { RoboAnimationTokens, RoboMotionTransition, RoboSpringTransition } from './types';

export type AnimationPreset = 'subtle' | 'standard' | 'expressive';

export interface RoboAnimationPreset {
  enter: RoboMotionTransition | RoboSpringTransition;
  exit:  RoboMotionTransition;
}

export function buildPresets(t: RoboAnimationTokens): Record<AnimationPreset, RoboAnimationPreset> {
  const spring: RoboSpringTransition = {
    type:      'spring',
    stiffness: t.springStiffness,
    damping:   t.springDamping,
    mass:      t.springMass,
  };
  return {
    subtle: {
      enter: { duration: t.durationFast   / 1000, ease: t.easeEnter },
      exit:  { duration: t.durationFast   / 1000, ease: t.easeExit  },
    },
    standard: {
      enter: { duration: t.durationNormal / 1000, ease: t.easeEnter },
      exit:  { duration: t.durationFast   / 1000, ease: t.easeExit  },
    },
    expressive: {
      enter: spring,
      exit:  { duration: t.durationFast   / 1000, ease: t.easeExit  },
    },
  };
}
