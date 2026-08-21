import * as React from 'react';
import { useSpring, useTransform, motion, useReducedMotion } from 'motion/react';

import { cn } from '@/lib/utils';
import { useAnimationTokens } from '../config/use-animation-tokens';

export interface RoboNumberTickerProps {
  /** Target number */
  value: number;
  /** Starting value. Default: 0 */
  from?: number;
  /** Decimal places. Default: 0 */
  decimalPlaces?: number;
  /** Locale for formatting. Default: 'en-US' */
  locale?: string;
  /** Intl.NumberFormat options */
  formatOptions?: Intl.NumberFormatOptions;
  className?: string;
}

export function RoboNumberTicker({
  value,
  from          = 0,
  decimalPlaces = 0,
  locale        = 'en-US',
  formatOptions,
  className,
}: RoboNumberTickerProps) {
  const tokens  = useAnimationTokens();
  const reduced = useReducedMotion();

  const springValue = useSpring(reduced ? value : from, {
    stiffness: tokens.springStiffness,
    damping:   tokens.springDamping,
    mass:      tokens.springMass,
  });

  React.useEffect(() => {
    springValue.set(value);
  }, [value, springValue]);

  const formatted = useTransform(springValue, (v: number) =>
    new Intl.NumberFormat(locale, {
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces,
      ...formatOptions,
    }).format(v)
  );

  return (
    <motion.span
      role="status"
      className={cn('tabular-nums', className)}
      aria-live="polite"
      aria-atomic="true"
    >
      {formatted}
    </motion.span>
  );
}
