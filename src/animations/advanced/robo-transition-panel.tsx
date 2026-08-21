import * as React from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

import { cn } from '@/lib/utils';
import { useAnimationTokens } from '../config/use-animation-tokens';

export interface RoboTransitionPanelItem {
  key: string;
  content: React.ReactNode;
}

export type TransitionPanelDirection = 'horizontal' | 'vertical' | 'fade';

export interface RoboTransitionPanelProps {
  panels: RoboTransitionPanelItem[];
  activeKey: string;
  /** Animation direction. Default: 'horizontal' */
  direction?: TransitionPanelDirection;
  className?: string;
}

export function RoboTransitionPanel({
  panels,
  activeKey,
  direction = 'horizontal',
  className,
}: RoboTransitionPanelProps) {
  const tokens  = useAnimationTokens();
  const reduced = useReducedMotion();
  const SLIDE   = 32;
  const axis    = direction === 'horizontal' ? 'x' : direction === 'vertical' ? 'y' : null;

  const variants = {
    enter:  { opacity: 0, ...(axis && !reduced ? { [axis]:  SLIDE } : {}) },
    center: { opacity: 1, ...(axis             ? { [axis]: 0      } : {}) },
    exit:   { opacity: 0, ...(axis && !reduced ? { [axis]: -SLIDE } : {}) },
  };

  const transition = {
    duration: tokens.durationNormal / 1000,
    ease:     tokens.easeDefault,
  };

  const active = panels.find(p => p.key === activeKey);

  return (
    <div className={cn('relative overflow-hidden', className)}>
      <AnimatePresence mode="wait" initial={false}>
        {active && (
          <motion.div
            key={activeKey}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={transition}
          >
            {active.content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
