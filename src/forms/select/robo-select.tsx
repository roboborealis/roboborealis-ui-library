import * as React from 'react';
import { Select } from 'radix-ui';
import { ChevronDown, Check } from 'lucide-react';
import { cva } from 'class-variance-authority';

import { cn } from '@/lib/utils';

/* ------------------------------------------------------------------ */
/* Primitive re-exports (advanced composition use)                      */
/* ------------------------------------------------------------------ */

const RoboSelectRoot = Select.Root;
RoboSelectRoot.displayName = 'RoboSelectRoot';

const RoboSelectValue = Select.Value;
RoboSelectValue.displayName = 'RoboSelectValue';

const RoboSelectPortal = Select.Portal;
RoboSelectPortal.displayName = 'RoboSelectPortal';

/* ------------------------------------------------------------------ */
/* Trigger                                                              */
/* ------------------------------------------------------------------ */

const triggerVariants = cva(
  [
    'flex h-10 w-full items-center justify-between gap-2 rounded-[var(--radius)]',
    'border bg-[var(--input)] px-3 py-2 text-sm text-[var(--foreground)]',
    'transition-colors duration-[var(--duration-fast)]',
    'focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:ring-offset-2 focus:ring-offset-[var(--background)]',
    'disabled:cursor-not-allowed disabled:opacity-50',
    'data-[placeholder]:text-[var(--muted-foreground)]',
  ].join(' '),
  {
    variants: {
      state: {
        default: 'border-[var(--border)]',
        error: 'border-[var(--destructive)] focus:ring-[var(--destructive)]',
      },
    },
    defaultVariants: { state: 'default' },
  }
);

export interface RoboSelectTriggerProps
  extends React.ComponentPropsWithoutRef<typeof Select.Trigger> {
  error?: boolean;
  className?: string;
  ref?: React.Ref<React.ComponentRef<typeof Select.Trigger>>;
}

function RoboSelectTrigger({ className, children, error, ref, ...props }: RoboSelectTriggerProps) {
  return (
  <Select.Trigger
    ref={ref}
    className={cn(triggerVariants({ state: error ? 'error' : 'default' }), className)}
    {...props}
  >
    {children}
    <Select.Icon asChild>
      <ChevronDown
        className='h-4 w-4 shrink-0 text-[var(--muted-foreground)]'
        aria-hidden='true'
      />
    </Select.Icon>
  </Select.Trigger>
  );
}
RoboSelectTrigger.displayName = 'RoboSelectTrigger';

/* ------------------------------------------------------------------ */
/* Content / Viewport                                                   */
/* ------------------------------------------------------------------ */

function RoboSelectContent({
  className,
  children,
  position = 'popper',
  ref,
  ...props
}: React.ComponentPropsWithoutRef<typeof Select.Content> & {
  ref?: React.Ref<React.ComponentRef<typeof Select.Content>>;
}) {
  return (
  <Select.Portal>
    <Select.Content
      ref={ref}
      position={position}
      sideOffset={4}
      className={cn(
        'relative z-50 min-w-[8rem] overflow-hidden rounded-[var(--radius)]',
        'border border-[var(--border)] bg-[var(--popover)] text-[var(--popover-foreground)]',
        'shadow-[var(--shadow-md)]',
        'data-[state=open]:animate-in data-[state=closed]:animate-out',
        'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
        'data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2',
        'duration-[var(--duration-fast)]',
        position === 'popper' && 'w-[var(--radix-select-trigger-width)]',
        className
      )}
      {...props}
    >
      <Select.Viewport
        className={cn(
          'p-1',
          position === 'popper' && 'max-h-[var(--radix-select-content-available-height)]'
        )}
      >
        {children}
      </Select.Viewport>
    </Select.Content>
  </Select.Portal>
  );
}
RoboSelectContent.displayName = 'RoboSelectContent';

/* ------------------------------------------------------------------ */
/* Item                                                                 */
/* ------------------------------------------------------------------ */

function RoboSelectItem({
  className,
  children,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<typeof Select.Item> & {
  ref?: React.Ref<React.ComponentRef<typeof Select.Item>>;
}) {
  return (
  <Select.Item
    ref={ref}
    className={cn(
      'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm',
      'text-[var(--foreground)] outline-none',
      'focus:bg-[var(--accent)] focus:text-[var(--accent-foreground)]',
      'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className
    )}
    {...props}
  >
    <span className='absolute left-2 flex h-3.5 w-3.5 items-center justify-center'>
      <Select.ItemIndicator>
        <Check className='h-4 w-4 text-[var(--primary)]' aria-hidden='true' />
      </Select.ItemIndicator>
    </span>
    <Select.ItemText>{children}</Select.ItemText>
  </Select.Item>
  );
}
RoboSelectItem.displayName = 'RoboSelectItem';

/* ------------------------------------------------------------------ */
/* Combined labeled component                                           */
/* ------------------------------------------------------------------ */

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface RoboSelectProps {
  /** Visible label */
  label?: string;
  /** Placeholder shown when no value selected */
  placeholder?: string;
  /** Options array */
  options: SelectOption[];
  /** Helper text shown below the trigger */
  helperText?: string;
  /** Error message — triggers error styling */
  error?: string;
  /** Disable the entire select */
  disabled?: boolean;
  /** Controlled value */
  value?: string;
  /** Default value (uncontrolled) */
  defaultValue?: string;
  /** Change handler */
  onValueChange?: (value: string) => void;
  /** Additional class on the wrapper */
  className?: string;
  /** id for the trigger (auto-generated if omitted) */
  id?: string;
  /** name attribute (forwarded for form compat) */
  name?: string;
  /** required attribute */
  required?: boolean;
  /** Accessible name when no visible label is rendered (e.g. filter toolbars) */
  'aria-label'?: string;
  ref?: React.Ref<HTMLButtonElement>;
}

/**
 * RoboSelect — Accessible select built on Radix UI Select.
 *
 * Keyboard: Space/Enter opens, Arrow keys navigate, ESC closes.
 * WCAG 2.1 AA: focus ring, aria-labelledby, aria-describedby, aria-required.
 *
 * @example
 * ```tsx
 * <RoboSelect
 *   label="Country"
 *   placeholder="Select a country"
 *   options={[{ value: 'us', label: 'United States' }, { value: 'uk', label: 'United Kingdom' }]}
 *   onValueChange={(v) => console.log(v)}
 * />
 * ```
 */
function RoboSelect({
  label,
  placeholder,
  options,
  helperText,
  error,
  disabled,
  value,
  defaultValue,
  onValueChange,
  className,
  id: idProp,
  name,
  required,
  'aria-label': ariaLabel,
  ref,
}: RoboSelectProps) {
    const generatedId = React.useId();
    const id = idProp ?? generatedId;
    const labelId = `${id}-label`;
    const helperId = `${id}-helper`;
    const errorId = `${id}-error`;

    const describedByIds: string[] = [];
    if (helperText && !error) describedByIds.push(helperId);
    if (error) describedByIds.push(errorId);

    return (
      <div className={cn('flex flex-col gap-1.5', className)}>
        {label && (
          <label
            id={labelId}
            htmlFor={id}
            className='text-sm font-medium text-[var(--foreground)]'
          >
            {label}
            {required && (
              <span className='ml-1 text-[var(--destructive)]' aria-hidden='true'>
                *
              </span>
            )}
          </label>
        )}

        <Select.Root
          value={value}
          defaultValue={defaultValue}
          onValueChange={onValueChange}
          disabled={disabled}
          name={name}
          required={required}
        >
          <RoboSelectTrigger
            ref={ref}
            id={id}
            error={!!error}
            aria-labelledby={label ? labelId : undefined}
            aria-label={!label ? ariaLabel : undefined}
            aria-describedby={describedByIds.length > 0 ? describedByIds.join(' ') : undefined}
            aria-invalid={error ? true : undefined}
            aria-required={required}
          >
            <Select.Value placeholder={placeholder ?? 'Select…'} />
          </RoboSelectTrigger>

          <RoboSelectContent>
            {options?.map((opt) => (
              <RoboSelectItem key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </RoboSelectItem>
            ))}
          </RoboSelectContent>
        </Select.Root>

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
RoboSelect.displayName = 'RoboSelect';

export {
  RoboSelect,
  RoboSelectRoot,
  RoboSelectTrigger,
  RoboSelectContent,
  RoboSelectItem,
  RoboSelectValue,
  RoboSelectPortal,
};
