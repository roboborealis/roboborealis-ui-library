import * as React from 'react';
import { motion, useReducedMotion } from 'motion/react';

import { cn } from '@/lib/utils';
import { buildPresets } from '../config/animation-presets';
import { useAnimationTokens } from '../config/use-animation-tokens';
import type { AnimationPreset } from '../config/animation-presets';

export type SlideDirection = 'top' | 'bottom' | 'left' | 'right';

const OFFSETS: Record<SlideDirection, { x: number; y: number }> = {
  top:    { x: 0,   y: -24 },
  bottom: { x: 0,   y:  24 },
  left:   { x: -24, y: 0   },
  right:  { x:  24, y: 0   },
};

export interface RoboSlideInProps {
  children: React.ReactNode;
  /** Direction the content slides in from. Default: 'bottom' */
  from?: SlideDirection;
  preset?: AnimationPreset;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function RoboSlideIn({
  children,
  from     = 'bottom',
  preset   = 'expressive',
  delay    = 0,
  className,
  style,
}: RoboSlideInProps) {
  const tokens     = useAnimationTokens();
  const presets    = buildPresets(tokens);
  const reduced    = useReducedMotion();
  const { x, y }  = reduced ? { x: 0, y: 0 } : OFFSETS[from];
  const transition = { ...presets[preset].enter, delay };

  return (
    <motion.div
      className={cn(className)}
      style={style}
      initial={{ opacity: 0, x, y }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={transition}
    >
      {children}
    </motion.div>
  );
}
