import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const skeletonVariants = cva(
  'bg-[var(--muted)] motion-safe:animate-pulse',
  {
    variants: {
      variant: {
        text: 'h-4 w-full rounded',
        circle: 'rounded-full',
        rect: 'rounded',
      },
    },
    defaultVariants: {
      variant: 'text',
    },
  }
);

export interface RoboSkeletonLoadingProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {
  /** Width of the skeleton element (e.g. "100px", "50%") */
  width?: string | number;
  /** Height of the skeleton element (e.g. "100px", "2rem") */
  height?: string | number;
  ref?: React.Ref<HTMLDivElement>;
}

/**
 * RoboSkeletonLoading — decorative loading placeholder. Use liberally for data loading states.
 *
 * Respects `prefers-reduced-motion` via `motion-safe:animate-pulse`.
 * Always `aria-hidden="true"` since it is purely decorative.
 *
 * @example
 * ```tsx
 * <RoboSkeletonLoading variant="text" />
 * <RoboSkeletonLoading variant="circle" width={48} height={48} />
 * <RoboSkeletonLoading variant="rect" width="100%" height={120} />
 * ```
 */
function RoboSkeletonLoading({ className, variant, width, height, style, ref, ...props }: RoboSkeletonLoadingProps) {
  const inlineStyle: React.CSSProperties = {
    ...style,
    ...(width !== undefined ? { width: typeof width === 'number' ? `${width}px` : width } : {}),
    ...(height !== undefined ? { height: typeof height === 'number' ? `${height}px` : height } : {}),
  };

  return (
    <div
      ref={ref}
      aria-hidden='true'
      className={cn(skeletonVariants({ variant }), className)}
      style={Object.keys(inlineStyle).length > 0 ? inlineStyle : undefined}
      {...props}
    />
  );
}
RoboSkeletonLoading.displayName = 'RoboSkeletonLoading';

export { RoboSkeletonLoading, skeletonVariants };
