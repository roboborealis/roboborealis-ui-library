import type { RoboAnimationTokens } from '../config/types';

/** Deterministic token set for tests — mirrors the fallback values in
 *  `use-animation-tokens.ts` so assertions don't depend on `:root` CSS vars. */
export const FALLBACK_TOKENS: RoboAnimationTokens = {
  durationInstant: 60,
  durationFast:    120,
  durationNormal:  220,
  durationSlow:    380,
  easeDefault:     [0.4, 0, 0.2, 1],
  easeEnter:       [0, 0, 0.2, 1],
  easeExit:        [0.4, 0, 1, 1],
  easeSpring:      [0.34, 1.56, 0.64, 1],
  springStiffness: 260,
  springDamping:   20,
  springMass:      1,
};
