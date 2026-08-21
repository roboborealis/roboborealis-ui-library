'use client';

import * as React from 'react';
import { Select } from 'radix-ui';
import { ChevronDown, Check, Search } from 'lucide-react';

import { cn } from '@/lib/utils';

import { FLAG_DATA } from './flag-data';
import { RoboFlag } from './robo-flag';

/* ------------------------------------------------------------------ */
/* Props                                                                */
/* ------------------------------------------------------------------ */

export interface RoboFlagSelectProps {
  /** Visible label rendered above the trigger */
  label?: string;
  /** Placeholder shown when no value is selected */
  placeholder?: string;
  /**
   * Limit the list to a subset of ISO codes.
   * Default: all 255 countries.
   * @example ['us', 'gb', 'au', 'ca', 'nz'] // Five Eyes
   */
  countries?: string[];
  /** Error message — triggers error border + aria-invalid */
  error?: string;
  /** Controlled value (ISO alpha-2 code) */
  value?: string;
  /** Default value for uncontrolled usage */
  defaultValue?: string;
  /** Called when the user selects a country */
  onValueChange?: (code: string) => void;
  /** Show a search/filter input at the top of the dropdown. Default: true */
  searchable?: boolean;
  /** Disable the entire control */
  disabled?: boolean;
  /** Additional className on the outer wrapper */
  className?: string;
  /** Mark the field as required */
  required?: boolean;
  /** id for the trigger element */
  id?: string;
  ref?: React.Ref<HTMLButtonElement>;
}

/* ------------------------------------------------------------------ */
/* Component                                                            */
/* ------------------------------------------------------------------ */

/**
 * RoboFlagSelect — Country code dropdown with inline flag icons and optional search.
 *
 * Each item shows a flag + country name. The trigger displays the selected flag
 * + name once a value is chosen. Pass `countries` to restrict the list.
 *
 * @example
 * // All 255 countries
 * <RoboFlagSelect label="Country" onValueChange={(code) => setValue(code)} />
 *
 * @example
 * // Restricted list
 * <RoboFlagSelect
 *   label="Nationality"
 *   countries={['us', 'gb', 'au', 'ca', 'nz']}
 *   onValueChange={setNationality}
 * />
 */
function RoboFlagSelect({
  label,
  placeholder = 'Select a country…',
  countries,
  error,
  value,
  defaultValue,
  onValueChange,
  searchable = true,
  disabled,
  className,
  required,
  id: idProp,
  ref,
}: RoboFlagSelectProps) {
  const generatedId = React.useId();
  const id = idProp ?? generatedId;
  const labelId = `${id}-label`;
  const errorId = `${id}-error`;

  const [search, setSearch] = React.useState('');
  const [open, setOpen] = React.useState(false);

  // Track internal value so we can render flag in the trigger
  const [internalValue, setInternalValue] = React.useState(
    value ?? defaultValue ?? ''
  );

  // Sync controlled value changes
  React.useEffect(() => {
    if (value !== undefined) setInternalValue(value);
  }, [value]);

  const handleValueChange = (code: string) => {
    if (value === undefined) setInternalValue(code);
    onValueChange?.(code);
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) setSearch('');
  };

  // Build the display list
  const allOptions = React.useMemo(() => {
    const base = countries
      ? FLAG_DATA.filter((f) => countries.includes(f.code))
      : FLAG_DATA;
    if (!search.trim()) return base;
    const q = search.toLowerCase();
    return base.filter(
      (f) => f.label.toLowerCase().includes(q) || f.code.includes(q)
    );
  }, [countries, search]);

  const selectedEntry = FLAG_DATA.find((f) => f.code === internalValue);

  const triggerClasses = cn(
    'flex h-10 w-full items-center justify-between gap-2 rounded-[var(--radius)]',
    'border bg-[var(--input)] px-3 py-2 text-sm text-[var(--foreground)]',
    'transition-colors duration-[var(--duration-fast)]',
    'focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:ring-offset-2 focus:ring-offset-[var(--background)]',
    'disabled:cursor-not-allowed disabled:opacity-50',
    error
      ? 'border-[var(--destructive)] focus:ring-[var(--destructive)]'
      : 'border-[var(--border)]'
  );

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
        open={open}
        onOpenChange={handleOpenChange}
        value={internalValue || undefined}
        onValueChange={handleValueChange}
        disabled={disabled}
        required={required}
      >
        <Select.Trigger
          ref={ref}
          id={id}
          className={triggerClasses}
          aria-labelledby={label ? labelId : undefined}
          aria-describedby={error ? errorId : undefined}
          aria-invalid={error ? true : undefined}
          aria-required={required}
        >
          <span className='flex items-center gap-2 overflow-hidden'>
            {selectedEntry ? (
              <>
                <RoboFlag code={selectedEntry.code} size='xs' aria-hidden='true' />
                <span className='truncate'>{selectedEntry.label}</span>
              </>
            ) : (
              <span className='text-[var(--muted-foreground)]'>{placeholder}</span>
            )}
          </span>
          <Select.Icon asChild>
            <ChevronDown
              className='h-4 w-4 shrink-0 text-[var(--muted-foreground)]'
              aria-hidden='true'
            />
          </Select.Icon>
        </Select.Trigger>

        <Select.Portal>
          <Select.Content
            position='popper'
            sideOffset={4}
            className={cn(
              'relative z-50 overflow-hidden rounded-[var(--radius)]',
              'border border-[var(--border)] bg-[var(--popover)] text-[var(--popover-foreground)]',
              'shadow-[var(--shadow-md)]',
              'data-[state=open]:animate-in data-[state=closed]:animate-out',
              'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
              'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
              'duration-[var(--duration-fast)]',
              'w-[var(--radix-select-trigger-width)] min-w-[180px]'
            )}
          >
            {/* Search input — outside the scrollable viewport */}
            {searchable && (
              <div className='flex items-center gap-2 border-b border-[var(--border)] px-3 py-2'>
                <Search
                  className='h-4 w-4 shrink-0 text-[var(--muted-foreground)]'
                  aria-hidden='true'
                />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.stopPropagation()}
                  placeholder='Search countries…'
                  autoFocus
                  aria-label='Search countries'
                  className={cn(
                    'w-full bg-transparent text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]',
                    'outline-none border-none'
                  )}
                />
              </div>
            )}

            <Select.Viewport className='max-h-60 overflow-y-auto p-1'>
              {allOptions.length === 0 ? (
                <div className='py-3 text-center text-sm text-[var(--muted-foreground)]'>
                  No countries found
                </div>
              ) : (
                allOptions.map((f) => (
                  <Select.Item
                    key={f.code}
                    value={f.code}
                    className={cn(
                      'relative flex w-full cursor-default select-none items-center gap-2 rounded-sm py-1.5 pl-2 pr-8 text-sm',
                      'text-[var(--foreground)] outline-none',
                      'focus:bg-[var(--accent)] focus:text-[var(--accent-foreground)]',
                      'data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
                    )}
                  >
                    <RoboFlag code={f.code} size='xs' aria-hidden='true' />
                    <Select.ItemText>{f.label}</Select.ItemText>
                    <span className='absolute right-2 flex h-3.5 w-3.5 items-center justify-center'>
                      <Select.ItemIndicator>
                        <Check
                          className='h-4 w-4 text-[var(--primary)]'
                          aria-hidden='true'
                        />
                      </Select.ItemIndicator>
                    </span>
                  </Select.Item>
                ))
              )}
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>

      {error && (
        <p id={errorId} role='alert' className='text-xs text-[var(--destructive)]'>
          {error}
        </p>
      )}
    </div>
  );
}
RoboFlagSelect.displayName = 'RoboFlagSelect';

export { RoboFlagSelect };
