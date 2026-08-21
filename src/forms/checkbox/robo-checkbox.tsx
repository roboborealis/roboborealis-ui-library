import * as React from 'react';
import { Checkbox } from 'radix-ui';
import { Check, Minus } from 'lucide-react';

import { cn } from '@/lib/utils';

/* ------------------------------------------------------------------ */
/* Single Checkbox                                                       */
/* ------------------------------------------------------------------ */

export interface RoboCheckboxProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof Checkbox.Root>,
    'checked' | 'onCheckedChange'
  > {
  /** Visible label */
  label?: string;
  /** Optional sub-label / description rendered below the label */
  description?: string;
  /** Helper text shown below the checkbox row */
  helperText?: string;
  /** Error message */
  error?: string;
  /** Indeterminate state (dash icon) */
  indeterminate?: boolean;
  /** Controlled checked state */
  checked?: boolean | 'indeterminate';
  /** Change handler */
  onCheckedChange?: (checked: boolean | 'indeterminate') => void;
  ref?: React.Ref<React.ComponentRef<typeof Checkbox.Root>>;
}

/**
 * RoboCheckbox — Accessible checkbox built on Radix UI Checkbox.
 *
 * Checked: solid primary fill with white Check icon.
 * Indeterminate: solid primary fill with Minus icon.
 * WCAG 2.1 AA: visible focus ring, aria-invalid on error, aria-describedby.
 *
 * @example
 * ```tsx
 * <RoboCheckbox label="Accept terms" description="Required to continue" />
 * <RoboCheckbox label="All" indeterminate />
 * ```
 */
function RoboCheckbox({
  className,
  label,
  description,
  helperText,
  error,
  indeterminate,
  checked,
  onCheckedChange,
  id: idProp,
  disabled,
  ref,
  ...props
}: RoboCheckboxProps) {
    const generatedId = React.useId();
    const id = idProp ?? generatedId;
    const labelId = `${id}-label`;
    const helperId = `${id}-helper`;
    const errorId = `${id}-error`;

    const resolvedChecked: boolean | 'indeterminate' =
      indeterminate ? 'indeterminate' : (checked ?? false);

    const describedByIds: string[] = [];
    if (helperText && !error) describedByIds.push(helperId);
    if (error) describedByIds.push(errorId);

    return (
      <div className='flex flex-col gap-1.5'>
        <div className='flex items-start gap-2'>
          <Checkbox.Root
            ref={ref}
            id={id}
            checked={resolvedChecked}
            onCheckedChange={onCheckedChange}
            disabled={disabled}
            data-glow
            aria-invalid={error ? true : undefined}
            aria-labelledby={label ? labelId : undefined}
            aria-describedby={describedByIds.length > 0 ? describedByIds.join(' ') : undefined}
            className={cn(
              'mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border border-[var(--border)]',
              'bg-[var(--input)] transition-colors duration-[var(--duration-fast)]',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]',
              'disabled:cursor-not-allowed disabled:opacity-50',
              'data-[state=checked]:border-[var(--primary)] data-[state=checked]:bg-[var(--primary)]',
              'data-[state=indeterminate]:border-[var(--primary)] data-[state=indeterminate]:bg-[var(--primary)]',
              error && 'border-[var(--destructive)]',
              className
            )}
            {...props}
          >
            <Checkbox.Indicator className='flex items-center justify-center text-[var(--primary-foreground)]'>
              {resolvedChecked === 'indeterminate' ? (
                <Minus className='h-3 w-3' aria-hidden='true' />
              ) : (
                <Check className='h-3 w-3' aria-hidden='true' />
              )}
            </Checkbox.Indicator>
          </Checkbox.Root>

          {(label || description) && (
            <div className='flex flex-col'>
              {label && (
                <label
                  id={labelId}
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

        {error ? (
          <p id={errorId} role='alert' className='text-xs text-[var(--destructive)]'>
            {error}
          </p>
        ) : helperText ? (
          <p id={helperId} className='text-xs text-[var(--muted-foreground)]'>
            {helperText}
          </p>
        ) : null}
      </div>
    );
}
RoboCheckbox.displayName = 'RoboCheckbox';

/* ------------------------------------------------------------------ */
/* Checkbox Group                                                        */
/* ------------------------------------------------------------------ */

export interface CheckboxGroupOption {
  name: string;
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface RoboCheckboxGroupProps {
  /** Array of checkbox options */
  options: CheckboxGroupOption[];
  /** Currently checked values */
  value?: string[];
  /** Change handler receives updated array of checked values */
  onChange?: (values: string[]) => void;
  /** Group label */
  label?: string;
  /** Helper text */
  helperText?: string;
  /** Error message */
  error?: string;
  /** Disable all checkboxes */
  disabled?: boolean;
  /** Additional wrapper class */
  className?: string;
  ref?: React.Ref<HTMLFieldSetElement>;
}

/**
 * RoboCheckboxGroup — Renders an array of checkboxes in a fieldset.
 *
 * @example
 * ```tsx
 * <RoboCheckboxGroup
 *   label="Permissions"
 *   options={[
 *     { name: 'read', value: 'read', label: 'Read' },
 *     { name: 'write', value: 'write', label: 'Write' },
 *   ]}
 *   value={selected}
 *   onChange={setSelected}
 * />
 * ```
 */
function RoboCheckboxGroup({
  options,
  value = [],
  onChange,
  label,
  helperText,
  error,
  disabled,
  className,
  ref,
}: RoboCheckboxGroupProps) {
    const groupId = React.useId();
    const errorId = `${groupId}-error`;
    const helperId = `${groupId}-helper`;

    const toggle = (val: string) => {
      if (!onChange) return;
      if (value.includes(val)) {
        onChange(value.filter((v) => v !== val));
      } else {
        onChange([...value, val]);
      }
    };

    return (
      <fieldset
        ref={ref}
        className={cn('flex flex-col gap-2 border-0 p-0', className)}
        aria-describedby={
          error ? errorId : helperText ? helperId : undefined
        }
      >
        {label && (
          <legend className='mb-1 text-sm font-medium text-[var(--foreground)]'>
            {label}
          </legend>
        )}

        {options.map((opt) => (
          <RoboCheckbox
            key={opt.value}
            id={`${groupId}-${opt.value}`}
            label={opt.label}
            description={opt.description}
            checked={value.includes(opt.value)}
            onCheckedChange={() => toggle(opt.value)}
            disabled={disabled || opt.disabled}
            error={undefined}
          />
        ))}

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
RoboCheckboxGroup.displayName = 'RoboCheckboxGroup';

export { RoboCheckbox, RoboCheckboxGroup };
