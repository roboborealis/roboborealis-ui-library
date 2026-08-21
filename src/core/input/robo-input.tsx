import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const inputVariants = cva(
  [
    'flex w-full rounded-[var(--radius)] border bg-[var(--input)]',
    'px-3 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]',
    'transition-colors duration-[var(--duration-fast)]',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-1',
    'disabled:pointer-events-none disabled:opacity-50',
    'file:border-0 file:bg-transparent file:text-sm file:font-medium',
  ].join(' '),
  {
    variants: {
      inputSize: {
        sm: 'h-[var(--input-h-sm)] text-xs',
        md: 'h-[var(--input-h-md)] text-sm',
        lg: 'h-[var(--input-h-lg)] text-base',
      },
      state: {
        default: 'border-[var(--border)] focus-visible:border-[var(--primary)]',
        error:
          'border-[var(--destructive)] focus-visible:ring-[var(--destructive)] focus-visible:border-[var(--destructive)]',
        success:
          'border-[var(--success)] focus-visible:ring-[var(--success)] focus-visible:border-[var(--success)]',
        warning:
          'border-[var(--warning)] focus-visible:ring-[var(--warning)] focus-visible:border-[var(--warning)]',
      },
    },
    defaultVariants: {
      inputSize: 'md',
      state: 'default',
    },
  }
);

export const INPUT_SIZES = ['sm', 'md', 'lg'] as const;
export const INPUT_STATES = ['default', 'error', 'success', 'warning'] as const;
export type InputSize = typeof INPUT_SIZES[number];
export type InputState = typeof INPUT_STATES[number];

export interface RoboInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  /** Visual validation state */
  state?: 'default' | 'error' | 'success' | 'warning';
  /** Helper or error text displayed below the input */
  helperText?: string;
  /** Label displayed above the input */
  label?: string;
  /** Whether the field is required */
  required?: boolean;
  /** Leading icon or element inside the input */
  leadingIcon?: React.ReactNode;
  /** Trailing icon or element inside the input */
  trailingIcon?: React.ReactNode;
  ref?: React.Ref<HTMLInputElement>;
}

/**
 * RoboInput — styled text input with validation states and optional label/helper text.
 *
 * @example
 * ```tsx
 * <RoboInput label="Email" placeholder="user@example.com" />
 * <RoboInput label="NORAD ID" state="error" helperText="Invalid NORAD ID format" />
 * <RoboInput state="success" helperText="Satellite found" value="25544" />
 * ```
 */
function RoboInput({
  className,
  inputSize,
  state = 'default',
  helperText,
  label,
  required,
  leadingIcon,
  trailingIcon,
  id,
  ref,
  ...props
}: RoboInputProps) {
    const generatedId = React.useId();
    const inputId = id ?? generatedId;
    const helperId = helperText ? `${inputId}-helper` : undefined;

    const helperColor = {
      default: 'text-[var(--secondary-text)]',
      error: 'text-[var(--destructive)]',
      success: 'text-[var(--success-text)]',
      warning: 'text-[var(--warning-text)]',
    }[state];

    const input = (
      <input
        ref={ref}
        id={inputId}
        aria-describedby={helperId}
        aria-invalid={state === 'error' ? true : undefined}
        aria-required={required}
        required={required}
        className={cn(
          inputVariants({ inputSize, state }),
          leadingIcon && 'pl-9',
          trailingIcon && 'pr-9',
          className
        )}
        {...props}
      />
    );

    if (!label && !helperText && !leadingIcon && !trailingIcon) {
      return input;
    }

    return (
      <div className='flex flex-col gap-1.5'>
        {label && (
          <label
            htmlFor={inputId}
            className='text-sm font-medium text-[var(--foreground)]'
          >
            {label}
            {required && (
              <span aria-hidden='true' className='ml-0.5 text-[var(--destructive)]'>
                *
              </span>
            )}
          </label>
        )}

        {leadingIcon || trailingIcon ? (
          <div className='relative'>
            {leadingIcon && (
              <span
                aria-hidden='true'
                className='pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]'
              >
                {leadingIcon}
              </span>
            )}
            {input}
            {trailingIcon && (
              <span
                aria-hidden='true'
                className='pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]'
              >
                {trailingIcon}
              </span>
            )}
          </div>
        ) : (
          input
        )}

        {helperText && (
          <p id={helperId} className={cn('text-xs', helperColor)} role={state === 'error' ? 'alert' : undefined}>
            {helperText}
          </p>
        )}
      </div>
    );
}
RoboInput.displayName = 'RoboInput';

export { RoboInput, inputVariants };
