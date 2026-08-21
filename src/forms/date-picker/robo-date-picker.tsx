'use client';

import * as React from 'react';
import { Popover } from 'radix-ui';
import {
  DayPicker,
  type DateRange,
  type Matcher,
  type DateBefore,
  type DateAfter,
} from 'react-day-picker';
import { format } from 'date-fns';
import { CalendarDays, X } from 'lucide-react';

import { cn } from '@/lib/utils';

/* ------------------------------------------------------------------ */
/* Helper — format a display string for trigger button                  */
/* ------------------------------------------------------------------ */

function formatDisplay(
  mode: 'single' | 'range',
  value?: Date,
  rangeValue?: DateRange
): string {
  if (mode === 'range') {
    if (!rangeValue) return '';
    const { from, to } = rangeValue;
    if (from && to) return `${format(from, 'MMM d, yyyy')} – ${format(to, 'MMM d, yyyy')}`;
    if (from) return `${format(from, 'MMM d, yyyy')} – …`;
    return '';
  }
  return value ? format(value, 'MMM d, yyyy') : '';
}

/* ------------------------------------------------------------------ */
/* Shared calendar styles using CSS variables                            */
/* ------------------------------------------------------------------ */

const calendarClassNames = {
  root: 'p-3',
  months: 'flex flex-col sm:flex-row gap-4',
  month: 'flex flex-col gap-4',
  month_caption: 'flex items-center justify-center pt-1 relative',
  caption_label: 'text-sm font-medium text-[var(--foreground)]',
  nav: 'flex items-center gap-1',
  button_previous: [
    'absolute left-1 flex h-7 w-7 items-center justify-center rounded-[var(--radius-sm)]',
    'border border-[var(--border)] bg-transparent text-[var(--muted-foreground)]',
    'hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]',
    'disabled:pointer-events-none disabled:opacity-50',
  ].join(' '),
  button_next: [
    'absolute right-1 flex h-7 w-7 items-center justify-center rounded-[var(--radius-sm)]',
    'border border-[var(--border)] bg-transparent text-[var(--muted-foreground)]',
    'hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]',
    'disabled:pointer-events-none disabled:opacity-50',
  ].join(' '),
  month_grid: 'w-full border-collapse space-y-1',
  weekdays: 'flex',
  weekday: 'text-[var(--muted-foreground)] rounded-md w-9 text-center text-xs font-medium',
  week: 'flex w-full mt-1',
  day: 'relative p-0 text-center text-sm focus-within:relative focus-within:z-20',
  day_button: [
    'h-9 w-9 rounded-[var(--radius-sm)] text-sm font-normal',
    'text-[var(--foreground)] transition-colors',
    'hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]',
    'disabled:pointer-events-none disabled:opacity-50',
    'aria-selected:opacity-100',
  ].join(' '),
  selected: [
    '[&>button]:bg-[var(--primary)] [&>button]:text-[var(--primary-foreground)]',
    '[&>button]:hover:bg-[var(--primary-hover)] [&>button]:hover:text-[var(--primary-foreground)]',
  ].join(' '),
  today: '[&>button]:font-bold [&>button]:underline',
  outside: '[&>button]:text-[var(--muted-foreground)] [&>button]:opacity-50',
  disabled: '[&>button]:text-[var(--muted-foreground)] [&>button]:opacity-50',
  range_middle: [
    '[&>button]:rounded-none [&>button]:bg-[var(--accent)] [&>button]:text-[var(--accent-foreground)]',
    '[&>button]:hover:bg-[var(--accent)] [&>button]:hover:text-[var(--accent-foreground)]',
  ].join(' '),
  range_start: '[&>button]:rounded-l-[var(--radius-sm)] [&>button]:rounded-r-none',
  range_end: '[&>button]:rounded-r-[var(--radius-sm)] [&>button]:rounded-l-none',
  hidden: 'invisible',
};

/* ------------------------------------------------------------------ */
/* RoboDatePicker                                                         */
/* ------------------------------------------------------------------ */

export interface RoboDatePickerProps {
  /** Visible label */
  label?: string;
  /** Placeholder text shown when no date selected */
  placeholder?: string;
  /** Controlled single date value */
  value?: Date;
  /** Change handler for single mode */
  onChange?: (date: Date | undefined) => void;
  /** Single date or range selection */
  mode?: 'single' | 'range';
  /** Disable the picker */
  disabled?: boolean;
  /** Helper text */
  helperText?: string;
  /** Error message */
  error?: string;
  /** Minimum selectable date */
  minDate?: Date;
  /** Maximum selectable date */
  maxDate?: Date;
  /** Additional days to disable (Matchers accepted by react-day-picker v9) */
  disabledDays?: Matcher | Matcher[];
  /** Additional wrapper class */
  className?: string;
  /** id for the trigger button */
  id?: string;
  /** required attribute on trigger */
  required?: boolean;
  ref?: React.Ref<HTMLButtonElement>;
}

/**
 * RoboDatePicker — Calendar date picker built on react-day-picker v9 + Radix Popover.
 *
 * Renders a trigger button that opens a popover calendar.
 * All colors use CSS variable tokens — no hardcoded hex values.
 * WCAG 2.1 AA: focus ring, aria-label, aria-invalid, aria-describedby.
 *
 * @example
 * ```tsx
 * <RoboDatePicker label="Start date" value={date} onChange={setDate} />
 * <RoboDatePicker label="Date range" mode="range" />
 * ```
 */
function RoboDatePicker({
  label,
  placeholder = 'Select a date',
  value,
  onChange,
  mode = 'single',
  disabled,
  helperText,
  error,
  minDate,
  maxDate,
  disabledDays,
  className,
  id: idProp,
  required,
  ref,
}: RoboDatePickerProps) {
    const generatedId = React.useId();
    const id = idProp ?? generatedId;
    const labelId = `${id}-label`;
    const helperId = `${id}-helper`;
    const errorId = `${id}-error`;

    const [open, setOpen] = React.useState(false);
    const [rangeValue, setRangeValue] = React.useState<DateRange | undefined>(undefined);

    const describedByIds: string[] = [];
    if (helperText && !error) describedByIds.push(helperId);
    if (error) describedByIds.push(errorId);

    const displayText =
      mode === 'range'
        ? formatDisplay('range', undefined, rangeValue) || placeholder
        : formatDisplay('single', value, undefined) || placeholder;

    const hasValue =
      mode === 'range'
        ? !!rangeValue?.from
        : !!value;

    /* Build disabled matcher list */
    const buildDisabled = (): Matcher | Matcher[] | undefined => {
      const matchers: Matcher[] = [];
      if (minDate) matchers.push({ before: minDate } satisfies DateBefore);
      if (maxDate) matchers.push({ after: maxDate } satisfies DateAfter);
      if (disabledDays) {
        if (Array.isArray(disabledDays)) {
          matchers.push(...(disabledDays as Matcher[]));
        } else {
          matchers.push(disabledDays as Matcher);
        }
      }
      return matchers.length === 1 ? matchers[0] : matchers.length > 1 ? matchers : undefined;
    };

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

        <Popover.Root open={open} onOpenChange={disabled ? undefined : setOpen}>
          <Popover.Trigger asChild>
            <button
              ref={ref}
              id={id}
              type='button'
              disabled={disabled}
              aria-labelledby={label ? labelId : undefined}
              aria-describedby={describedByIds.length > 0 ? describedByIds.join(' ') : undefined}
              aria-invalid={error ? true : undefined}
              aria-required={required}
              aria-expanded={open}
              aria-haspopup='dialog'
              className={cn(
                'flex h-10 w-full items-center justify-between gap-2 rounded-[var(--radius)]',
                'border bg-[var(--input)] px-3 py-2 text-sm',
                'transition-colors duration-[var(--duration-fast)]',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]',
                'disabled:cursor-not-allowed disabled:opacity-50',
                error
                  ? 'border-[var(--destructive)]'
                  : 'border-[var(--border)]',
                hasValue ? 'text-[var(--foreground)]' : 'text-[var(--muted-foreground)]'
              )}
            >
              <span className='flex items-center gap-2'>
                <CalendarDays className='h-4 w-4 shrink-0 text-[var(--muted-foreground)]' aria-hidden='true' />
                {displayText}
              </span>
              {hasValue && (
                <span
                  role='button'
                  tabIndex={0}
                  aria-label='Clear date'
                  onClick={(e) => {
                    e.stopPropagation();
                    if (mode === 'single') onChange?.(undefined);
                    else setRangeValue(undefined);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.stopPropagation();
                      if (mode === 'single') onChange?.(undefined);
                      else setRangeValue(undefined);
                    }
                  }}
                  className='rounded-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--ring)]'
                >
                  <X className='h-3.5 w-3.5' aria-hidden='true' />
                </span>
              )}
            </button>
          </Popover.Trigger>

          <Popover.Portal>
            <Popover.Content
              align='start'
              sideOffset={4}
              className={cn(
                'z-50 rounded-[var(--radius-lg)] border border-[var(--border)]',
                'bg-[var(--popover)] text-[var(--popover-foreground)]',
                'shadow-[var(--shadow-md)]',
                'data-[state=open]:animate-in data-[state=closed]:animate-out',
                'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
                'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
                'data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2',
                'duration-[var(--duration-fast)]'
              )}
            >
              {mode === 'single' ? (
                <DayPicker
                  mode='single'
                  selected={value}
                  onSelect={(day) => {
                    onChange?.(day);
                    setOpen(false);
                  }}
                  disabled={buildDisabled()}
                  classNames={calendarClassNames}
                  showOutsideDays
                />
              ) : (
                <DayPicker
                  mode='range'
                  selected={rangeValue}
                  onSelect={(range) => {
                    setRangeValue(range);
                    if (range?.from && range?.to) setOpen(false);
                  }}
                  disabled={buildDisabled()}
                  classNames={calendarClassNames}
                  showOutsideDays
                />
              )}
              <Popover.Arrow className='fill-[var(--popover)]' />
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>

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
RoboDatePicker.displayName = 'RoboDatePicker';

export { RoboDatePicker };
export type { DateRange };
