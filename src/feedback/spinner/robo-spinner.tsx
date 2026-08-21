import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils';

const spinnerVariants = cva(
  'text-[var(--primary)] motion-safe:animate-spin',
  {
    variants: {
      size: {
        sm: 'h-4 w-4',
        md: 'h-6 w-6',
        lg: 'h-8 w-8',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

export interface RoboSpinnerLoadingProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof spinnerVariants> {
  /** Accessible label for the spinner (defaults to "Loading") */
  label?: string;
  ref?: React.Ref<HTMLSpanElement>;
}

/**
 * RoboSpinnerLoading — accessible inline loading indicator for in-progress operations.
 *
 * Uses Lucide Loader2 with `motion-safe:animate-spin` to respect
 * the user's `prefers-reduced-motion` media query.
 *
 * @example
 * ```tsx
 * <RoboSpinnerLoading />
 * <RoboSpinnerLoading size="lg" label="Fetching satellite data" />
 * ```
 */
function RoboSpinnerLoading({ className, size, label, ref, ...props }: RoboSpinnerLoadingProps) {
  return (
    <span
      ref={ref}
      role='progressbar'
      aria-label={label ?? 'Loading'}
      aria-busy='true'
      className={cn('inline-flex items-center justify-center', className)}
      {...props}
    >
      <Loader2 className={cn(spinnerVariants({ size }))} aria-hidden='true' />
    </span>
  );
}
RoboSpinnerLoading.displayName = 'RoboSpinnerLoading';

export { RoboSpinnerLoading, spinnerVariants };
