'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Info, CheckCircle, AlertTriangle, XCircle, Siren, X } from 'lucide-react';

import { RoboIconButton } from '@/core/button/robo-icon-button';
import { cn } from '@/lib/utils';
import { RoboSlideIn } from '@/animations';

// ---------------------------------------------------------------------------
// Keyframe — React 19 deduplicates by href and hoists to <head>.
// Emits a leftward glow-pulse from the alert's left stripe (emergency only).
// Mirrors the 2 s on / 2 s off rhythm of robo-attention-loop.
// ---------------------------------------------------------------------------
const EMERGENCY_KEYFRAMES = `
  @keyframes robo-left-strobe {
    /* 0 – 50% = 2 s ON: glow expands left, fades out */
    0%    { box-shadow: 0 0 0 0 var(--destructive); opacity: 0; }
    10%   { box-shadow: -3px 0 8px 2px var(--destructive); opacity: 0.85; }
    32%   { box-shadow: -7px 0 14px 3px var(--destructive); opacity: 0.5; }
    49%   { box-shadow: -12px 0 22px 0px var(--destructive); opacity: 0; }
    /* 50% reset */
    50%   { box-shadow: 0 0 0 0 var(--destructive); opacity: 0; }
    /* 50 – 100% = 2 s OFF */
    100%  { box-shadow: 0 0 0 0 var(--destructive); opacity: 0; }
  }
`;

const alertVariants = cva(
  'relative flex gap-3 rounded-lg border-l-4 p-4 text-sm',
  {
    variants: {
      variant: {
        info: 'bg-[var(--primary)]/10 border-[var(--primary)] text-[var(--primary)]',
        success:
          'bg-[var(--success)]/10 border-[var(--success)] text-[var(--success-text)]',
        warning:
          'bg-[var(--warning)]/10 border-[var(--warning)] text-[var(--warning-text)]',
        error:
          'bg-[var(--destructive)]/10 border-[var(--destructive)] text-[var(--destructive)]',
        emergency:
          'bg-[var(--destructive)]/10 border-[var(--destructive)] text-[var(--destructive)]',
      },
    },
    defaultVariants: {
      variant: 'info',
    },
  }
);

export const ALERT_VARIANTS = ['info', 'success', 'warning', 'error', 'emergency'] as const;
export type AlertVariant = typeof ALERT_VARIANTS[number];

const variantIcons: Record<string, React.ElementType> = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: XCircle,
  emergency: Siren,
};

export interface RoboAlertProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'>,
    VariantProps<typeof alertVariants> {
  /** Severity of the alert */
  variant: 'info' | 'success' | 'warning' | 'error' | 'emergency';
  /** Optional bold title displayed above the message */
  title?: string;
  /** When true, shows a dismiss (X) button */
  dismissible?: boolean;
  /** Called when the dismiss button is clicked */
  onDismiss?: () => void;
  /** Alert message content */
  children: React.ReactNode;
  /** Slide alert in from top on mount. Default: false */
  animate?: boolean;
  ref?: React.Ref<HTMLDivElement>;
}

/**
 * RoboAlert — inline status message that persists in the DOM (not a toast).
 *
 * - `role="alert"` for error/warning/emergency (assertive)
 * - `role="status"` for info/success (polite)
 *
 * The `emergency` variant adds a leftward glow-pulse animation on the left
 * stripe — 2 s on / 2 s off, mirroring the map-layer emergency strobe.
 *
 * @example
 * ```tsx
 * <RoboAlert variant="emergency" title="ANOMALY" dismissible onDismiss={() => {}}>
 *   Satellite signal loss — immediate assistance required.
 * </RoboAlert>
 * ```
 */
function RoboAlert({
  className,
  variant,
  title,
  dismissible = false,
  onDismiss,
  children,
  animate = false,
  ref,
  ...props
}: RoboAlertProps) {
  const [visible, setVisible] = React.useState(true);

  if (!visible) return null;

  const Icon = variantIcons[variant ?? 'info'];
  const isAssertive = variant === 'error' || variant === 'warning' || variant === 'emergency';
  const role = isAssertive ? 'alert' : 'status';

  const handleDismiss = () => {
    setVisible(false);
    onDismiss?.();
  };

  const alertDiv = (
    <div
      ref={ref}
      role={role}
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      {/* Left-stripe strobe — emergency only */}
      {variant === 'emergency' ? (
        <div
          data-testid='emergency-strobe'
          aria-hidden='true'
          className='absolute inset-y-0 left-0 w-1 pointer-events-none rounded-l-lg'
          style={{ animation: 'robo-left-strobe 4s ease-out infinite' }}
        />
      ) : null}
      <Icon className='h-5 w-5 shrink-0 mt-0.5' aria-hidden='true' />
      <div className='flex-1 min-w-0'>
        {title !== undefined ? (
          <p className='font-semibold mb-1'>{title}</p>
        ) : null}
        <div>{children}</div>
      </div>
      {dismissible ? (
        <RoboIconButton
          aria-label='Dismiss alert'
          variant='ghost'
          size='sm'
          onClick={handleDismiss}
          className='shrink-0 ml-auto -mt-0.5'
        >
          <X className='h-4 w-4' aria-hidden='true' />
        </RoboIconButton>
      ) : null}
    </div>
  );

  return (
    <>
      {variant === 'emergency' && (
        <style href='robo-left-strobe-kf' precedence='default'>{EMERGENCY_KEYFRAMES}</style>
      )}
      {animate ? <RoboSlideIn from='top'>{alertDiv}</RoboSlideIn> : alertDiv}
    </>
  );
}
RoboAlert.displayName = 'RoboAlert';

export { RoboAlert, alertVariants };
