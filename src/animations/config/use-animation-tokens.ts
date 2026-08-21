import * as React from 'react';
import type { RoboAnimationTokens, MotionEasing } from './types';

// Motion.dev requires cubic-bezier as [x1, y1, x2, y2], not a CSS string.
function parseCubicBezier(css: string, fallback: MotionEasing): MotionEasing {
  const m = css.match(/cubic-bezier\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*\)/);
  if (!m) return fallback;
  return [parseFloat(m[1]), parseFloat(m[2]), parseFloat(m[3]), parseFloat(m[4])];
}

const FALLBACK: RoboAnimationTokens = {
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

export function readAnimationTokens(): RoboAnimationTokens {
  if (typeof document === 'undefined') return FALLBACK;
  const s = getComputedStyle(document.documentElement);
  const ease = (v: string, fb: MotionEasing): MotionEasing =>
    parseCubicBezier(s.getPropertyValue(v).trim(), fb);
  const num = (v: string, fb: number) => {
    const raw = s.getPropertyValue(v).trim().replace('ms', '');
    const n = parseFloat(raw);
    return isNaN(n) ? fb : n;
  };
  return {
    durationInstant: num('--duration-instant', FALLBACK.durationInstant),
    durationFast:    num('--duration-fast',    FALLBACK.durationFast),
    durationNormal:  num('--duration-normal',  FALLBACK.durationNormal),
    durationSlow:    num('--duration-slow',    FALLBACK.durationSlow),
    easeDefault:     ease('--ease-default',    FALLBACK.easeDefault),
    easeEnter:       ease('--ease-enter',      FALLBACK.easeEnter),
    easeExit:        ease('--ease-exit',       FALLBACK.easeExit),
    easeSpring:      ease('--ease-spring',     FALLBACK.easeSpring),
    springStiffness: num('--spring-stiffness', FALLBACK.springStiffness),
    springDamping:   num('--spring-damping',   FALLBACK.springDamping),
    springMass:      num('--spring-mass',      FALLBACK.springMass),
  };
}

export function useAnimationTokens(): RoboAnimationTokens {
  const [tokens, setTokens] = React.useState<RoboAnimationTokens>(readAnimationTokens);

  React.useEffect(() => {
    const observer = new MutationObserver(() => setTokens(readAnimationTokens()));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'data-mode'],
    });
    return () => observer.disconnect();
  }, []);

  return tokens;
}
