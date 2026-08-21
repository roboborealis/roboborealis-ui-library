// Motion.dev accepts cubic-bezier as a [x1, y1, x2, y2] tuple, not a CSS string.
export type MotionEasing = [number, number, number, number];

export interface RoboAnimationTokens {
  durationInstant: number;
  durationFast:    number;
  durationNormal:  number;
  durationSlow:    number;
  easeDefault:     MotionEasing;
  easeEnter:       MotionEasing;
  easeExit:        MotionEasing;
  easeSpring:      MotionEasing;
  springStiffness: number;
  springDamping:   number;
  springMass:      number;
}

export interface RoboMotionTransition {
  duration: number;
  ease:     MotionEasing;
}

export interface RoboSpringTransition {
  type:      'spring';
  stiffness: number;
  damping:   number;
  mass:      number;
}
