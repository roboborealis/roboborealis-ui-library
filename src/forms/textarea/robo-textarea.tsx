import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const textareaVariants = cva(
  [
    'w-full rounded-[var(--radius)] border bg-[var(--input)] px-3 py-2 text-sm text-[var(--foreground)]',
    'placeholder:text-[var(--muted-foreground)]',
    'transition-colors duration-[var(--duration-fast)]',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]',
    'disabled:cursor-not-allowed disabled:opacity-50',
  ].join(' '),
  {
    variants: {
      state: {
        default: 'border-[var(--border)]',
        error: 'border-[var(--destructive)] focus-visible:ring-[var(--destructive)]',
      },
      resize: {
        none: 'resize-none',
        vertical: 'resize-y',
        both: 'resize',
      },
    },
    defaultVariants: {
      state: 'default',
      resize: 'vertical',
    },
  }
);

export interface RoboTextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'aria-invalid'>,
    VariantProps<typeof textareaVariants> {
  /** Visible label rendered above the textarea */
  label?: string;
  /** Helper text shown below the textarea */
  helperText?: string;
  /** Error message — triggers error styling and aria-invalid */
  error?: string;
  /** Number of visible text rows */
  rows?: number;
  /** Maximum character count */
  maxLength?: number;
  /** Show character count when maxLength is set */
  showCount?: boolean;
  /** Resize behavior */
  resize?: 'none' | 'vertical' | 'both';
  ref?: React.Ref<HTMLTextAreaElement>;
}

/**
 * RoboTextarea — Multi-line text input with label, helper text, error and character count.
 *
 * All colors use CSS variable tokens from the active theme.
 * WCAG 2.1 AA: visible focus ring, aria-invalid on error, aria-describedby for helper/error.
 *
 * @example
 * ```tsx
 * <RoboTextarea label="Description" helperText="Max 200 chars" maxLength={200} showCount />
 * <RoboTextarea label="Notes" error="This field is required" />
 * ```
 */
function RoboTextarea({
  className,
  label,
  helperText,
  error,
  rows = 4,
  maxLength,
  showCount = false,
  resize = 'vertical',
  id: idProp,
  value,
  defaultValue,
  onChange,
  disabled,
  ref,
  ...props
}: RoboTextareaProps) {
    const generatedId = React.useId();
    const id = idProp ?? generatedId;
    const helperId = `${id}-helper`;
    const errorId = `${id}-error`;

    const [internalValue, setInternalValue] = React.useState(
      defaultValue !== undefined ? String(defaultValue) : ''
    );

    const isControlled = value !== undefined;
    const currentValue = isControlled ? String(value) : internalValue;
    const charCount = currentValue.length;

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (!isControlled) {
        setInternalValue(e.target.value);
      }
      onChange?.(e);
    };

    const describedByIds: string[] = [];
    if (helperText && !error) describedByIds.push(helperId);
    if (error) describedByIds.push(errorId);

    return (
      <div className='flex flex-col gap-1.5'>
        {label && (
          <label
            htmlFor={id}
            className='text-sm font-medium text-[var(--foreground)]'
          >
            {label}
          </label>
        )}

        <div data-glow className='relative rounded-[var(--radius)]'>
          <textarea
            ref={ref}
            id={id}
            rows={rows}
            maxLength={maxLength}
            disabled={disabled}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedByIds.length > 0 ? describedByIds.join(' ') : undefined}
            value={isControlled ? value : undefined}
            defaultValue={!isControlled ? defaultValue : undefined}
            onChange={handleChange}
            className={cn(
              textareaVariants({ state: error ? 'error' : 'default', resize }),
              className
            )}
            {...props}
          />
        </div>

        <div className='flex items-start justify-between gap-2'>
          <div className='flex-1'>
            {error ? (
              <p
                id={errorId}
                role='alert'
                className='text-xs text-[var(--destructive)]'
              >
                {error}
              </p>
            ) : helperText ? (
              <p id={helperId} className='text-xs text-[var(--muted-foreground)]'>
                {helperText}
              </p>
            ) : null}
          </div>

          {showCount && maxLength !== undefined && (
            <p
              className={cn(
                'shrink-0 text-xs tabular-nums',
                charCount > maxLength
                  ? 'text-[var(--destructive)]'
                  : 'text-[var(--muted-foreground)]'
              )}
              aria-live='polite'
              aria-atomic='true'
            >
              {charCount}/{maxLength}
            </p>
          )}
        </div>
      </div>
    );
}
RoboTextarea.displayName = 'RoboTextarea';

export { RoboTextarea, textareaVariants };
