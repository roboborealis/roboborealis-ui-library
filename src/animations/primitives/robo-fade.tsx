import * as React from 'react';
import { motion, useReducedMotion } from 'motion/react';

import { cn } from '@/lib/utils';
import { buildPresets } from '../config/animation-presets';
import { useAnimationTokens } from '../config/use-animation-tokens';
import type { AnimationPreset } from '../config/animation-presets';

export interface RoboFadeInProps {
  children: React.ReactNode;
  /** Animation intensity. Default: 'standard' */
  preset?: AnimationPreset;
  /** Y offset (px) to slide up while fading. Default: 8 */
  slideY?: number;
  /** X offset (px) to slide while fading. Default: 0 */
  slideX?: number;
  /** Delay before animation starts (seconds). Default: 0 */
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function RoboFadeIn({
  children,
  preset   = 'standard',
  slideY   = 8,
  slideX   = 0,
  delay    = 0,
  className,
  style,
}: RoboFadeInProps) {
  const tokens     = useAnimationTokens();
  const presets    = buildPresets(tokens);
  const reduced    = useReducedMotion();
  const transition = { ...presets[preset].enter, delay };

  return (
    <motion.div
      className={cn(className)}
      style={style}
      initial={{ opacity: 0, y: reduced ? 0 : slideY, x: reduced ? 0 : slideX }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      transition={transition}
    >
      {children}
    </motion.div>
  );
}
