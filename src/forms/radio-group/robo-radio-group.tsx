import * as React from 'react';
import { RadioGroup } from 'radix-ui';

import { cn } from '@/lib/utils';

/* ------------------------------------------------------------------ */
/* Radio item                                                            */
/* ------------------------------------------------------------------ */

interface RoboRadioItemProps
  extends React.ComponentPropsWithoutRef<typeof RadioGroup.Item> {
  label: string;
  description?: string;
  ref?: React.Ref<React.ComponentRef<typeof RadioGroup.Item>>;
}

function RoboRadioItem({ value, label, description, disabled, className, id: idProp, ref, ...props }: RoboRadioItemProps) {
  const generatedId = React.useId();
  const id = idProp ?? generatedId;

  return (
    <div className={cn('flex items-start gap-2', className)}>
      <RadioGroup.Item
        ref={ref}
        id={id}
        value={value}
        disabled={disabled}
        data-glow
        className={cn(
          'mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full',
          'border border-[var(--border)] bg-[var(--input)]',
          'transition-colors duration-[var(--duration-fast)]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'data-[state=checked]:border-[var(--primary)]'
        )}
        {...props}
      >
        <RadioGroup.Indicator className='flex items-center justify-center'>
          <span
            className='block h-2 w-2 rounded-full bg-[var(--primary)]'
            aria-hidden='true'
          />
        </RadioGroup.Indicator>
      </RadioGroup.Item>

      <div className='flex flex-col'>
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
        {description && (
          <span className='mt-0.5 text-xs text-[var(--muted-foreground)]'>
            {description}
          </span>
        )}
      </div>
    </div>
  );
}
RoboRadioItem.displayName = 'RoboRadioItem';

/* ------------------------------------------------------------------ */
/* RoboRadioGroup                                                         */
/* ------------------------------------------------------------------ */

export interface RadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface RoboRadioGroupProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof RadioGroup.Root>,
    'orientation' | 'aria-label' | 'aria-labelledby'
  > {
  /** Options array */
  options: RadioOption[];
  /** Layout direction */
  orientation?: 'horizontal' | 'vertical';
  /** Group label (rendered as legend) */
  label?: string;
  /** Error message */
  error?: string;
  /** Helper text */
  helperText?: string;
  /** Controlled value */
  value?: string;
  /** Change handler */
  onValueChange?: (value: string) => void;
  ref?: React.Ref<React.ComponentRef<typeof RadioGroup.Root>>;
}

/**
 * RoboRadioGroup — Accessible radio group built on Radix UI RadioGroup.
 *
 * Filled circle indicator uses --primary color.
 * WCAG 2.1 AA: keyboard nav (arrow keys), focus ring, aria-invalid, aria-describedby.
 *
 * @example
 * ```tsx
 * <RoboRadioGroup
 *   label="Notification frequency"
 *   options={[
 *     { value: 'daily', label: 'Daily' },
 *     { value: 'weekly', label: 'Weekly', description: 'Sent every Monday' },
 *   ]}
 *   value={freq}
 *   onValueChange={setFreq}
 * />
 * ```
 */
function RoboRadioGroup({
  options,
  orientation = 'vertical',
  label,
  error,
  helperText,
  value,
  onValueChange,
  disabled,
  className,
  id: idProp,
  ref,
  ...props
}: RoboRadioGroupProps) {
    const groupId = React.useId();
    const legendId = `${groupId}-legend`;
    const errorId = `${groupId}-error`;
    const helperId = `${groupId}-helper`;

    const describedByIds: string[] = [];
    if (helperText && !error) describedByIds.push(helperId);
    if (error) describedByIds.push(errorId);

    return (
      <fieldset className='flex flex-col gap-1.5 border-0 p-0'>
        {label && (
          <legend
            id={legendId}
            className='mb-1 text-sm font-medium text-[var(--foreground)]'
          >
            {label}
          </legend>
        )}

        <RadioGroup.Root
          ref={ref}
          value={value}
          onValueChange={onValueChange}
          disabled={disabled}
          orientation={orientation === 'horizontal' ? 'horizontal' : 'vertical'}
          aria-labelledby={label ? legendId : undefined}
          aria-describedby={describedByIds.length > 0 ? describedByIds.join(' ') : undefined}
          aria-invalid={error ? true : undefined}
          className={cn(
            'flex gap-3',
            orientation === 'vertical' ? 'flex-col' : 'flex-row flex-wrap',
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <RoboRadioItem
              key={opt.value}
              value={opt.value}
              label={opt.label}
              description={opt.description}
              disabled={disabled || opt.disabled}
            />
          ))}
        </RadioGroup.Root>

        {error ? (
          <p id={errorId} role='alert' className='text-xs text-[var(--destructive)]'>
            {error}
          </p>
        ) : helperText ? (
          <p id={helperId} className='text-xs text-[var(--muted-foreground)]'>
            {helperText}
          </p>
        ) : null}
      </fieldset>
    );
}
RoboRadioGroup.displayName = 'RoboRadioGroup';

export { RoboRadioGroup, RoboRadioItem };
