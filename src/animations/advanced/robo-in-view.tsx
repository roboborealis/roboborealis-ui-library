import * as React from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';

import { cn } from '@/lib/utils';
import { buildPresets } from '../config/animation-presets';
import { useAnimationTokens } from '../config/use-animation-tokens';
import type { AnimationPreset } from '../config/animation-presets';

export interface RoboInViewProps {
  children: React.ReactNode;
  /** Fire once when first visible. Default: true */
  once?: boolean;
  /** Fraction of element that must be visible. Default: 0.1 */
  threshold?: number;
  preset?: AnimationPreset;
  /** Y offset to slide from. Default: 16 */
  slideY?: number;
  className?: string;
}

export function RoboInView({
  children,
  once      = true,
  threshold = 0.1,
  preset    = 'standard',
  slideY    = 16,
  className,
}: RoboInViewProps) {
  const ref        = React.useRef<HTMLDivElement>(null);
  const inView     = useInView(ref, { once, amount: threshold });
  const tokens     = useAnimationTokens();
  const presets    = buildPresets(tokens);
  const reduced    = useReducedMotion();
  const transition = presets[preset].enter;

  return (
    <motion.div
      ref={ref}
      className={cn(className)}
      initial={{ opacity: 0, y: reduced ? 0 : slideY }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: reduced ? 0 : slideY }}
      transition={transition}
    >
      {children}
    </motion.div>
  );
}
