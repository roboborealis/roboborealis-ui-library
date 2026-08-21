import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { X } from 'lucide-react';

import { cn } from '@/lib/utils';
import { RoboScaleIn } from '@/animations';

const chipVariants = cva(
  'flex w-fit items-center gap-1.5 font-medium transition-colors',
  {
    variants: {
      variant: {
        default:
          'bg-[var(--muted)] text-[var(--foreground)] border border-[var(--border)]',
        primary:
          'bg-[var(--primary)] text-[var(--primary-foreground)] border border-transparent',
        success:
          'bg-[var(--success)]/15 text-[var(--success-text)] border border-[var(--success)]/30',
        warning:
          'bg-[var(--warning)]/15 text-[var(--warning-text)] border border-[var(--warning)]/30',
        destructive:
          'bg-[var(--destructive)]/15 text-[var(--destructive)] border border-[var(--destructive)]/30',
        outline:
          'bg-transparent text-[var(--foreground)] border border-[var(--border)]',
      },
      size: {
        sm: 'rounded-full px-2 py-0.5 text-[10px]',
        md: 'rounded-full px-2.5 py-1 text-xs',
        lg: 'rounded-md px-3 py-1.5 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface RoboChipProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'color'>,
    VariantProps<typeof chipVariants> {
  /** Icon or element shown before the label */
  icon?: React.ReactNode;
  /** Callback fired when the dismiss button is clicked; enables dismiss button */
  onDismiss?: () => void;
  /** Label for the dismiss button (for screen readers) */
  dismissLabel?: string;
  /** Scale chip in on mount. Default: false */
  animate?: boolean;
  ref?: React.Ref<HTMLSpanElement>;
}

/**
 * RoboChip — compact label for filtering, tagging, and selection.
 * Pass `onDismiss` to enable the remove/dismiss button.
 *
 * @example
 * ```tsx
 * <RoboChip>In transit</RoboChip>
 * <RoboChip variant="success" onDismiss={() => remove(id)}>Active</RoboChip>
 * <RoboChip variant="primary" icon={<SatelliteIcon />}>Voyager 1</RoboChip>
 * ```
 */
function RoboChip({
  className,
  variant,
  size,
  icon,
  onDismiss,
  dismissLabel = 'Remove',
  children,
  animate = false,
  ref,
  ...props
}: RoboChipProps) {
  const chip = (
      <span
        ref={ref}
        role={onDismiss ? 'group' : undefined}
        aria-label={onDismiss ? String(children) : undefined}
        className={cn(chipVariants({ variant, size }), className)}
        {...props}
      >
        {icon && <span aria-hidden='true' className='shrink-0'>{icon}</span>}
        {children}
        {onDismiss && (
          <button
            type='button'
            aria-label={dismissLabel}
            onClick={onDismiss}
            className={cn(
              'inline-flex items-center justify-center rounded-full p-0.5 ms-0.5',
              'opacity-70 hover:opacity-100 focus-visible:outline-none',
              'focus-visible:ring-1 focus-visible:ring-current transition-opacity',
              '-me-0.5'
            )}
          >
            <X
              aria-hidden='true'
              className={cn(
                size === 'sm' && 'h-2.5 w-2.5',
                (size === 'md' || !size) && 'h-3 w-3',
                size === 'lg' && 'h-3.5 w-3.5'
              )}
            />
          </button>
        )}
      </span>
    );

    return animate ? <RoboScaleIn preset='expressive'>{chip}</RoboScaleIn> : chip;
}
RoboChip.displayName = 'RoboChip';

export { RoboChip, chipVariants };
