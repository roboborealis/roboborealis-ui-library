import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';

import { cn } from '@/lib/utils';
import { RoboFadeIn } from '@/animations';

export interface RoboProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  /** Current progress value (0 to max). Omit for indeterminate. */
  value?: number;
  /** Maximum value (default: 100) */
  max?: number;
  /** When true, shows an animated indeterminate state */
  indeterminate?: boolean;
  /** Accessible label for the progress bar */
  label?: string;
  /** When true, renders the percentage value as text above the bar */
  showLabel?: boolean;
  /**
   * When set, ignores `value`/`indeterminate` and fills the bar from 0 → 100 %
   * over this CSS duration, looping with linear easing. Useful for syncing a
   * visual timer to an animation cycle. The bar is decorative in this mode.
   * @example duration="3.4s"
   */
  duration?: string;
  /** Fade progress bar in on mount. Default: false */
  animateEntrance?: boolean;
  ref?: React.Ref<React.ComponentRef<typeof ProgressPrimitive.Root>>;
}

/**
 * RoboProgress — determinate and indeterminate progress bar.
 *
 * Built on Radix UI Progress for correct ARIA semantics.
 * Indeterminate mode uses a CSS slide animation (no JS timers).
 *
 * @example
 * ```tsx
 * <RoboProgress value={60} showLabel />
 * <RoboProgress indeterminate label="Uploading file" />
 * ```
 */
function RoboProgress({
  className,
  value,
  max = 100,
  indeterminate = false,
  label,
  showLabel = false,
  duration,
  animateEntrance = false,
  ref,
  ...props
}: RoboProgressProps) {
  const percentage = indeterminate || duration
    ? null
    : Math.min(100, Math.max(0, ((value ?? 0) / max) * 100));

  const content = (
    <div className='w-full'>
      {showLabel && percentage !== null && (
        <div className='mb-1 text-sm text-[var(--foreground)] font-medium'>
          {label ? `${label}: ` : ''}{Math.round(percentage)}%
        </div>
      )}
      <ProgressPrimitive.Root
        ref={ref}
        value={indeterminate || duration ? undefined : (value ?? 0)}
        max={max}
        aria-label={label ?? 'Progress'}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={indeterminate || duration ? undefined : (value ?? 0)}
        aria-hidden={duration ? 'true' : undefined}
        data-indeterminate={indeterminate ? '' : undefined}
        className={cn(
          'relative h-2 w-full overflow-hidden rounded-full bg-[var(--muted)]',
          className
        )}
        {...props}
      >
        <ProgressPrimitive.Indicator
          className={cn(
            'h-full bg-[var(--primary)]',
            duration        && 'robo-progress-timer',
            indeterminate   && 'robo-progress-indeterminate',
            !duration && !indeterminate && 'transition-all',
          )}
          style={
            duration
              ? { '--robo-timer-duration': duration } as React.CSSProperties
              : indeterminate
                ? undefined
                : { width: `${percentage}%` }
          }
        />
      </ProgressPrimitive.Root>
      <style>{`
        @keyframes robo-slide {
          0% { transform: translateX(-100%); width: 40%; }
          50% { width: 60%; }
          100% { transform: translateX(250%); width: 40%; }
        }
        .robo-progress-indeterminate {
          width: 40%;
          animation: robo-slide 1.4s ease-in-out infinite;
        }
        @keyframes robo-progress-timer {
          from { width: 0%; }
          to   { width: 100%; }
        }
        .robo-progress-timer {
          animation: robo-progress-timer var(--robo-timer-duration, 1s) linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .robo-progress-indeterminate,
          .robo-progress-timer {
            animation: none;
            width: 100%;
            opacity: 0.4;
          }
        }
      `}</style>
    </div>
  );

  return animateEntrance ? <RoboFadeIn preset='standard'>{content}</RoboFadeIn> : content;
}
RoboProgress.displayName = 'RoboProgress';

export { RoboProgress };
