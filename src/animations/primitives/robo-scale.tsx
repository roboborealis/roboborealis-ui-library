import * as React from 'react';
import { motion, useReducedMotion } from 'motion/react';

import { cn } from '@/lib/utils';
import { buildPresets } from '../config/animation-presets';
import { useAnimationTokens } from '../config/use-animation-tokens';
import type { AnimationPreset } from '../config/animation-presets';

export interface RoboScaleInProps {
  children: React.ReactNode;
  /** Starting scale factor. Default: 0.92 */
  initialScale?: number;
  /** CSS transform-origin. Default: 'center' */
  origin?: string;
  preset?: AnimationPreset;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function RoboScaleIn({
  children,
  initialScale = 0.92,
  origin       = 'center',
  preset       = 'expressive',
  delay        = 0,
  className,
  style,
}: RoboScaleInProps) {
  const tokens     = useAnimationTokens();
  const presets    = buildPresets(tokens);
  const reduced    = useReducedMotion();
  const transition = { ...presets[preset].enter, delay };

  return (
    <motion.div
      className={cn(className)}
      style={{ transformOrigin: origin, ...style }}
      initial={{ opacity: 0, scale: reduced ? 1 : initialScale }}
      animate={{ opacity: 1, scale: 1 }}
      transition={transition}
    >
      {children}
    </motion.div>
  );
}
