'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import { RoboButton } from '@/core/button/robo-button';
import { RoboFadeIn } from '@/animations';

import {
  ErrorStatic,
  ErrorFrame1,
  ErrorFrame2,
  ErrorFrame3,
  ErrorFrame4,
  ErrorFrame5,
  ErrorFrame6,
  ErrorFrame7,
  ErrorFrame8,
  ErrorFrame9,
  ErrorFrame10,
  ErrorFrame11,
  ErrorFrame12,
} from './error-scene';

// ---------------------------------------------------------------------------
// Animation frames array
// ---------------------------------------------------------------------------

const ERROR_FRAMES = [
  ErrorFrame1,
  ErrorFrame2,
  ErrorFrame3,
  ErrorFrame4,
  ErrorFrame5,
  ErrorFrame6,
  ErrorFrame7,
  ErrorFrame8,
  ErrorFrame9,
  ErrorFrame10,
  ErrorFrame11,
  ErrorFrame12,
];

const FRAME_COUNT = ERROR_FRAMES.length;

// ---------------------------------------------------------------------------
// CVA variants
// ---------------------------------------------------------------------------

const errorStateVariants = cva(
  'flex flex-col items-center justify-center text-center gap-2',
  {
    variants: {
      size: {
        sm: '[&_.robo-error-state-svg]:w-16',
        md: '[&_.robo-error-state-svg]:w-24',
        lg: '[&_.robo-error-state-svg]:w-32',
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

export interface RoboErrorStateProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>,
    VariantProps<typeof errorStateVariants> {
  /** Display mode: 'loading' plays animation once, 'error' plays then shows error UI. Default: 'loading'. */
  variant?: 'loading' | 'error';
  /** Frame interval in ms. Default: 65. */
  frameInterval?: number;
  /** Error message text. Default: "...uh... We have a problem?". */
  errorMessage?: string;
  /** Callback for the retry button (error variant only). */
  onRetry?: () => void;
  /** Retry button text. Default: "Try again". */
  retryLabel?: string;
  /** Accessible label. Default: "Loading". */
  label?: string;
  /** Fade component in on mount. Default: false */
  animateEntrance?: boolean;
  ref?: React.Ref<HTMLDivElement>;
}

// ---------------------------------------------------------------------------
// Reduced motion detection
// ---------------------------------------------------------------------------

function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  React.useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return prefersReducedMotion;
}

// ---------------------------------------------------------------------------
// RoboErrorState
// ---------------------------------------------------------------------------

/**
 * RoboErrorState — animated astronaut-adrift loading and error state indicator.
 *
 * The brand mascot plays a 12-frame tumbling animation. In error mode,
 * a message and retry button appear once the animation completes.
 *
 * Colors adapt automatically to the active theme via CSS variables.
 *
 * @example
 * ```tsx
 * // Loading indicator
 * <RoboErrorState />
 *
 * // Error with retry
 * <RoboErrorState variant="error" onRetry={() => reset()} />
 *
 * // Large size
 * <RoboErrorState size="lg" />
 * ```
 */
function RoboErrorState({
  className,
  variant = 'loading',
  size,
  frameInterval = 65,
  errorMessage = "...uh... We have a problem?",
  onRetry,
  retryLabel = 'Try again',
  label,
  animateEntrance = false,
  ref,
  ...props
}: RoboErrorStateProps) {
  const reducedMotion = usePrefersReducedMotion();
  const [frameIndex, setFrameIndex] = React.useState(
    reducedMotion ? FRAME_COUNT - 1 : 0,
  );
  const [animationDone, setAnimationDone] = React.useState(reducedMotion);

  React.useEffect(() => {
    if (animationDone) return;

    const intervalId = setInterval(() => {
      setFrameIndex((prev) => {
        if (prev >= FRAME_COUNT - 1) {
          clearInterval(intervalId);
          setAnimationDone(true);
          return FRAME_COUNT - 1;
        }
        return prev + 1;
      });
    }, frameInterval);

    return () => clearInterval(intervalId);
  }, [animationDone, frameInterval]);

  const CurrentFrame = ERROR_FRAMES[frameIndex];
  const showError = variant === 'error' && animationDone;

  const content = (
    <div
      ref={ref}
      role="status"
      aria-label={label ?? (variant === 'error' ? 'Error' : 'Loading')}
      aria-busy={!animationDone || undefined}
      className={cn(errorStateVariants({ size }), className)}
      {...props}
    >
      <div className="robo-error-state-svg" aria-hidden="true">
        <CurrentFrame />
      </div>

      {showError && (
        <>
          <p className="text-sm font-bold text-[var(--foreground)]">
            {errorMessage}
          </p>
          {onRetry && (
            <RoboButton variant="outline" size="sm" onClick={onRetry}>
              {retryLabel}
            </RoboButton>
          )}
        </>
      )}
    </div>
  );

  return animateEntrance ? <RoboFadeIn preset='standard'>{content}</RoboFadeIn> : content;
}
RoboErrorState.displayName = 'RoboErrorState';

// ---------------------------------------------------------------------------
// RoboErrorStateStatic — static satellite illustration (no animation)
// ---------------------------------------------------------------------------

export interface RoboErrorStateStaticProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>,
    VariantProps<typeof errorStateVariants> {
  /** Accessible label. Default: "Satellite". */
  label?: string;
  ref?: React.Ref<HTMLDivElement>;
}

/**
 * RoboErrorStateStatic — static satellite illustration.
 *
 * Use as a decorative element or empty state illustration.
 * Colors adapt automatically to the active theme via CSS variables.
 *
 * @example
 * ```tsx
 * <RoboErrorStateStatic size="lg" />
 * ```
 */
function RoboErrorStateStatic({ className, size, label, ref, ...props }: RoboErrorStateStaticProps) {
  return (
    <div
      ref={ref}
      role="img"
      aria-label={label ?? 'Satellite'}
      className={cn(errorStateVariants({ size }), className)}
      {...props}
    >
      <div className="robo-error-state-svg" aria-hidden="true">
        <ErrorStatic />
      </div>
    </div>
  );
}
RoboErrorStateStatic.displayName = 'RoboErrorStateStatic';

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

export { RoboErrorState, RoboErrorStateStatic, errorStateVariants };
