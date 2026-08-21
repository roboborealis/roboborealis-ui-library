import * as React from 'react';
import { motion, useReducedMotion, type TargetAndTransition } from 'motion/react';

import { cn } from '@/lib/utils';
import { useAnimationTokens } from '../config/use-animation-tokens';

export type TextEffectVariant = 'fade' | 'slide-up' | 'blur';
export type TextEffectSplit   = 'word' | 'char';

export interface RoboTextEffectProps {
  text: string;
  /** Animation style. Default: 'fade' */
  variant?: TextEffectVariant;
  /** How to split the text. Default: 'word' */
  split?: TextEffectSplit;
  /** Stagger delay between units (seconds). Default: 0.04 */
  staggerDelay?: number;
  /** HTML element to render wrapper as. Default: 'span' */
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
}

const VARIANTS: Record<TextEffectVariant, { hidden: TargetAndTransition; visible: TargetAndTransition }> = {
  fade:       { hidden: { opacity: 0 }, visible: { opacity: 1 } },
  'slide-up': { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } },
  blur:       { hidden: { opacity: 0, filter: 'blur(4px)' }, visible: { opacity: 1, filter: 'blur(0px)' } },
};

export function RoboTextEffect({
  text,
  variant      = 'fade',
  split        = 'word',
  staggerDelay = 0.04,
  as: _as      = 'span',
  className,
}: RoboTextEffectProps) {
  const tokens  = useAnimationTokens();
  const reduced = useReducedMotion();

  const units = split === 'char' ? text.split('') : text.split(' ');

  const containerVariants = {
    hidden:  {},
    visible: {
      transition: {
        staggerChildren: reduced ? 0 : staggerDelay,
      },
    },
  };

  const itemVariants = {
    hidden:  VARIANTS[variant].hidden,
    visible: {
      ...VARIANTS[variant].visible,
      transition: {
        duration: tokens.durationNormal / 1000,
        ease:     tokens.easeEnter,
      },
    },
  };

  return (
    <motion.span
      className={cn('inline-flex flex-wrap', className)}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      aria-label={text}
    >
      {units.map((unit, i) => (
        <motion.span
          key={i}
          className={split === 'word' && i < units.length - 1 ? 'mr-[0.25em]' : undefined}
          variants={itemVariants}
          aria-hidden="true"
        >
          {unit}
        </motion.span>
      ))}
    </motion.span>
  );
}
