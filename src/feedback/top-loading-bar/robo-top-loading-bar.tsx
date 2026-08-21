import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const topLoadingBarVariants = cva('fixed inset-x-0 top-0 z-50 overflow-x-hidden bg-transparent', {
  variants: {
    size: {
      sm: 'h-0.5',
      md: 'h-[3px]',
      lg: 'h-1',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export interface RoboTopLoadingBarProps
  extends React.ComponentPropsWithoutRef<'div'>,
    VariantProps<typeof topLoadingBarVariants> {
  /** Show/animate the bar. When false, the component renders nothing. */
  active: boolean;
  /** Exact bar thickness in px, overriding `size`. */
  height?: number;
  ref?: React.Ref<HTMLDivElement>;
}

/**
 * RoboTopLoadingBar — thin indeterminate progress bar pinned to the top of the
 * viewport, for signalling background/route-level loading without a layout
 * shift (e.g. an NProgress-style bar for async data fetches).
 *
 * @example
 * ```tsx
 * <RoboTopLoadingBar active={isAnyLayerLoading} />
 * <RoboTopLoadingBar active={isLoading} size="lg" />
 * ```
 */
function RoboTopLoadingBar({ className, active, size, height, ref, style, ...props }: RoboTopLoadingBarProps) {
  if (!active) return null;

  return (
    <div
      ref={ref}
      data-slot='top-loading-bar'
      role='progressbar'
      aria-label='Loading'
      aria-valuetext='Loading'
      className={cn(topLoadingBarVariants({ size }), className)}
      style={height != null ? { ...style, height } : style}
      {...props}
    >
      {/* Constant glowing base track. */}
      <div
        className='absolute inset-0 bg-[var(--primary)]/50'
        style={{ boxShadow: '0 0 6px 1px var(--primary)' }}
      />
      {/* Brighter, blurred pulse sweeping across the base track. */}
      <div
        className='robo-top-loading-bar-pulse absolute inset-y-0 left-0 w-1/3'
        style={{
          background: 'linear-gradient(90deg, transparent, var(--primary), transparent)',
          filter: 'blur(2px)',
          boxShadow: '0 0 10px 2px var(--primary)',
        }}
      />
      <style>{`
        @keyframes robo-top-loading-bar-pulse {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
        .robo-top-loading-bar-pulse {
          animation: robo-top-loading-bar-pulse 1.8s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .robo-top-loading-bar-pulse {
            animation: none;
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
RoboTopLoadingBar.displayName = 'RoboTopLoadingBar';

export { RoboTopLoadingBar, topLoadingBarVariants };
