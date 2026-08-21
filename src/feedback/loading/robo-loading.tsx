'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

import { OrbitScene } from './orbit-scene';

// ---------------------------------------------------------------------------
// CVA variants
// ---------------------------------------------------------------------------

const loadingVariants = cva(
  'flex flex-col items-center justify-center text-center',
  {
    variants: {
      size: {
        sm: '[&_.robo-loading-svg]:w-20',
        md: '[&_.robo-loading-svg]:w-28',
        lg: '[&_.robo-loading-svg]:w-40',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface RoboLoadingProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>,
    VariantProps<typeof loadingVariants> {
  /** Accessible label for the loader. Defaults to "Loading". */
  label?: string;
  ref?: React.Ref<HTMLDivElement>;
}

// ---------------------------------------------------------------------------
// RoboLoading
// ---------------------------------------------------------------------------

/**
 * RoboLoading — orbiting-satellite loading indicator.
 *
 * A satellite tracks a circular orbit around a central planet while distant
 * stars twinkle. Use for compact or inline loading states where a branded
 * indicator is preferred.
 *
 * Colors adapt automatically to the active theme and dark/light mode via CSS
 * variables. Respects `prefers-reduced-motion` — all animation stops when the
 * user has reduced motion enabled.
 *
 * @example
 * ```tsx
 * <RoboLoading />
 * <RoboLoading size="lg" label="Fetching telemetry" />
 * ```
 */
function RoboLoading({ className, size, label, ref, ...props }: RoboLoadingProps) {
  return (
    <div
      ref={ref}
      role="status"
      aria-label={label ?? 'Loading'}
      aria-busy="true"
      className={cn(loadingVariants({ size }), className)}
      {...props}
    >
      <div className="robo-loading-svg" aria-hidden="true">
        <OrbitScene />
      </div>
    </div>
  );
}
RoboLoading.displayName = 'RoboLoading';

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

export { RoboLoading, loadingVariants };
