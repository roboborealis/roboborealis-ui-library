import * as React from 'react';
import { Switch } from 'radix-ui';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

/* ------------------------------------------------------------------ */
/* Track / thumb sizing via CVA                                          */
/* ------------------------------------------------------------------ */

const trackVariants = cva(
  [
    'relative inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent',
    'bg-[var(--muted)] transition-colors duration-[var(--duration-normal)]',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]',
    'disabled:cursor-not-allowed disabled:opacity-50',
    'data-[state=checked]:bg-[var(--primary)]',
  ].join(' '),
  {
    variants: {
      size: {
        sm: 'h-5 w-9',
        md: 'h-6 w-11',
        lg: 'h-7 w-[3.25rem]',
      },
    },
    defaultVariants: { size: 'md' },
  }
);

const thumbVariants = cva(
  [
    'pointer-events-none block rounded-full bg-white shadow-sm ring-0',
    'transition-transform duration-[var(--duration-normal)]',
  ].join(' '),
  {
    variants: {
      size: {
        sm: 'h-4 w-4 data-[state=checked]:translate-x-4',
        md: 'h-5 w-5 data-[state=checked]:translate-x-5',
        lg: 'h-6 w-6 data-[state=checked]:translate-x-[1.75rem]',
      },
    },
    defaultVariants: { size: 'md' },
  }
);

/* ------------------------------------------------------------------ */
/* RoboSwitch                                                             */
/* ------------------------------------------------------------------ */

export interface RoboSwitchProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof Switch.Root>,
    'checked' | 'onCheckedChange'
  >,
    VariantProps<typeof trackVariants> {
  /** Visible label */
  label?: string;
  /** Sub-label / description */
  description?: string;
  /** Controlled state */
  checked?: boolean;
  /** Change handler */
  onCheckedChange?: (checked: boolean) => void;
  ref?: React.Ref<React.ComponentRef<typeof Switch.Root>>;
}

/**
 * RoboSwitch — Accessible toggle switch built on Radix UI Switch.
 *
 * Track: muted bg when off, --primary when on.
 * Smooth thumb transition with size variants: sm / md / lg.
 *
 * @example
 * ```tsx
 * <RoboSwitch label="Enable notifications" size="md" />
 * <RoboSwitch label="Dark mode" description="Applies globally" size="lg" checked={dark} onCheckedChange={setDark} />
 * ```
 */
function RoboSwitch({
  className,
  label,
  description,
  size = 'md',
  checked,
  onCheckedChange,
  disabled,
  id: idProp,
  ref,
  ...props
}: RoboSwitchProps) {
    const generatedId = React.useId();
    const id = idProp ?? generatedId;

    return (
      <div className={cn('flex items-start gap-3', className)}>
        <Switch.Root
          ref={ref}
          id={id}
          checked={checked}
          onCheckedChange={onCheckedChange}
          disabled={disabled}
          className={trackVariants({ size })}
          {...props}
        >
          <Switch.Thumb className={thumbVariants({ size })} />
        </Switch.Root>

        {(label || description) && (
          <div className='flex flex-col'>
            {label && (
              <label
                htmlFor={id}
                className={cn(
                  'text-sm font-medium leading-none',
                  disabled
                    ? 'cursor-not-allowed text-[var(--muted-foreground)]'
                    : 'cursor-pointer text-[var(--foreground)]'
                )}
              >
                {label}
              </label>
            )}
            {description && (
              <span className='mt-0.5 text-xs text-[var(--muted-foreground)]'>
                {description}
              </span>
            )}
          </div>
        )}
      </div>
    );
}
RoboSwitch.displayName = 'RoboSwitch';

export { RoboSwitch, trackVariants, thumbVariants };
