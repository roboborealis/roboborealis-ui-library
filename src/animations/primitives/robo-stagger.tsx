import * as React from 'react';
import { motion, useReducedMotion } from 'motion/react';

import { cn } from '@/lib/utils';
import { useAnimationTokens } from '../config/use-animation-tokens';

export interface RoboStaggerProps {
  children: React.ReactNode;
  /** Delay between each child (seconds). Default: 0.05 */
  staggerDelay?: number;
  /** Y offset for each child entrance. Default: 12 */
  slideY?: number;
  /** Delay before the first child starts (seconds). Default: 0 */
  initialDelay?: number;
  /** className on the outer container div */
  className?: string;
  /**
   * className on each item wrapper div. Pass "contents" to make wrappers
   * layout-transparent so flex/grid containers work normally.
   */
  itemClassName?: string;
}

export function RoboStagger({
  children,
  staggerDelay  = 0.05,
  slideY        = 12,
  initialDelay  = 0,
  className,
  itemClassName,
}: RoboStaggerProps) {
  const tokens  = useAnimationTokens();
  const reduced = useReducedMotion();

  const containerVariants = {
    hidden:  {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren:   initialDelay,
      },
    },
  };

  const itemVariants = {
    hidden:  { opacity: 0, y: reduced ? 0 : slideY },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: tokens.durationNormal / 1000,
        ease:     tokens.easeEnter,
      },
    },
  };

  return (
    <motion.div
      className={cn(className)}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {React.Children.map(children, (child, i) => (
        <motion.div key={i} className={cn(itemClassName)} variants={itemVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
