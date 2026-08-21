'use client';

import * as React from 'react';
import { type Table } from '@tanstack/react-table';
import { Search, X } from 'lucide-react';

import { cn } from '@/lib/utils';

import { GLOBAL_FILTER_DEBOUNCE_MS } from '../constants';

// ---------------------------------------------------------------------------
// GlobalSearchInput
// ---------------------------------------------------------------------------

export interface GlobalSearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

/**
 * GlobalSearchInput — debounced search input for global table filtering.
 *
 * Maintains a local `inputValue` for immediate UI updates and debounces
 * propagation to the parent by GLOBAL_FILTER_DEBOUNCE_MS (300ms). Syncs
 * back when the external `value` prop changes (e.g. after resetFilters()).
 */
export function GlobalSearchInput({ value, onChange }: GlobalSearchInputProps) {
  const [inputValue, setInputValue] = React.useState(value);
  const onChangeRef = React.useRef(onChange);
  onChangeRef.current = onChange;

  // Sync back when the external value changes (e.g. reset)
  React.useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Debounce propagation to parent
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onChangeRef.current(inputValue);
    }, GLOBAL_FILTER_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [inputValue]);

  const handleClear = () => {
    setInputValue('');
    // Fire immediately on clear — no debounce needed
    onChange('');
  };

  return (
    <div className="relative flex items-center">
      <Search
        className="pointer-events-none absolute left-2.5 h-3.5 w-3.5 text-[var(--muted-foreground)]"
        aria-hidden="true"
      />
      <input
        type="search"
        role="searchbox"
        aria-label="Search table"
        placeholder="Search all columns..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className={cn(
          'h-8 w-56 rounded-[var(--radius)] pl-8 pr-8 text-sm',
          'bg-[var(--background)] text-[var(--foreground)]',
          'border border-[var(--border)]',
          'placeholder:text-[var(--muted-foreground)]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-1',
          'transition-colors',
        )}
      />
      {inputValue && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={handleClear}
          className={cn(
            'absolute right-2 flex h-4 w-4 items-center justify-center rounded-full',
            'text-[var(--muted-foreground)] hover:text-[var(--foreground)]',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]',
            'transition-colors',
          )}
        >
          <X className="h-3 w-3" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// FilterChip
// ---------------------------------------------------------------------------

interface FilterChipProps<TData> {
  table: Table<TData>;
  columnId: string;
  filterValue: unknown;
}

/**
 * FilterChip — pill badge representing an active column filter.
 *
 * Displays the column name (from columnDef.header) and a string
 * representation of the active filter value. The dismiss button clears
 * the filter for that column via TanStack Table's setFilterValue API.
 */
function FilterChip<TData>({ table, columnId, filterValue }: FilterChipProps<TData>) {
  const column = table.getColumn(columnId);

  if (!column) return null;

  const headerDef = column.columnDef.header;
  const columnLabel =
    typeof headerDef === 'string' ? headerDef : columnId;

  const displayValue = Array.isArray(filterValue)
    ? filterValue.join(', ')
    : String(filterValue);

  const handleDismiss = () => {
    column.setFilterValue(undefined);
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
        'bg-[var(--primary)]/10 text-[var(--primary)]',
        'border border-[var(--primary)]/20',
      )}
    >
      <span className="font-semibold">{columnLabel}:</span>
      <span>{displayValue}</span>
      <button
        type="button"
        aria-label={`Remove filter: ${columnLabel}`}
        onClick={handleDismiss}
        className={cn(
          'ml-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full',
          'hover:bg-[var(--primary)]/20',
          'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--ring)]',
          'transition-colors',
        )}
      >
        <X className="h-2.5 w-2.5" aria-hidden="true" />
      </button>
    </span>
  );
}

// ---------------------------------------------------------------------------
// TableToolbar
// ---------------------------------------------------------------------------

export interface TableToolbarProps<TData> {
  table: Table<TData>;
  enableGlobalFilter?: boolean;
  globalFilter: string;
  onGlobalFilterChange: (value: string) => void;
  isFiltered: boolean;
  resetFilters: () => void;
  toolbarLeft?: React.ReactNode;
  toolbarRight?: React.ReactNode;
  /**
   * Suppress the built-in search box while `enableGlobalFilter` keeps global
   * filtering active — for consumers rendering their own search input
   * elsewhere (e.g. `toolbarRight`) via the exported `GlobalSearchInput`.
   * Default: false.
   */
  hideGlobalSearchInput?: boolean;
}

/**
 * TableToolbar — toolbar sitting above RoboDataTable.
 *
 * Renders global search input, active column filter chips, a "Clear all"
 * button, and optional left/right slot props for custom controls. Returns
 * `null` when there is nothing to display.
 *
 * Fully keyboard-accessible and WCAG 2.1 AA compliant.
 *
 * @example
 * ```tsx
 * <TableToolbar
 *   table={table}
 *   enableGlobalFilter
 *   globalFilter={globalFilter}
 *   onGlobalFilterChange={setGlobalFilter}
 *   isFiltered={isFiltered}
 *   resetFilters={resetFilters}
 *   toolbarRight={<ColumnVisibilityToggle table={table} />}
 * />
 * ```
 */
export function TableToolbar<TData>({
  table,
  enableGlobalFilter = false,
  globalFilter,
  onGlobalFilterChange,
  isFiltered,
  resetFilters,
  toolbarLeft,
  toolbarRight,
  hideGlobalSearchInput = false,
}: TableToolbarProps<TData>) {
  // Collect active column filter state — each entry is [columnId, filterValue]
  const activeColumnFilters = table
    .getState()
    .columnFilters.filter((f) => f.value !== undefined && f.value !== '');

  // Determine whether there is anything worth rendering
  const hasGlobalSearch = enableGlobalFilter && !hideGlobalSearchInput;
  const hasColumnFilters = activeColumnFilters.length > 0;
  const hasClearAll = isFiltered;
  const hasSlots = toolbarLeft !== undefined || toolbarRight !== undefined;

  if (!hasGlobalSearch && !hasColumnFilters && !hasClearAll && !hasSlots) {
    return null;
  }

  return (
    <div
      role="toolbar"
      aria-label="Table toolbar"
      className={cn(
        'flex flex-wrap items-center justify-between gap-x-4 gap-y-2',
        'border-b border-[var(--border)] px-4 py-2',
      )}
    >
      {/* Left section — search + filter chips + clear all */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Slot: toolbarLeft — positioned before the search input */}
        {toolbarLeft}

        {/* Global search */}
        {enableGlobalFilter && !hideGlobalSearchInput && (
          <GlobalSearchInput
            value={globalFilter}
            onChange={onGlobalFilterChange}
          />
        )}

        {/* Active column filter chips */}
        {activeColumnFilters.map((filter) => (
          <FilterChip
            key={filter.id}
            table={table}
            columnId={filter.id}
            filterValue={filter.value}
          />
        ))}

        {/* Clear all filters button */}
        {hasClearAll && (
          <button
            type="button"
            onClick={resetFilters}
            className={cn(
              'inline-flex items-center gap-1 rounded-[var(--radius)] px-2 py-1 text-xs',
              'text-[var(--muted-foreground)] hover:text-[var(--foreground)]',
              'hover:bg-[var(--muted)]',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-1',
              'transition-colors',
            )}
          >
            <X className="h-3 w-3" aria-hidden="true" />
            Clear all
          </button>
        )}
      </div>

      {/* Right section — toolbarRight slot */}
      {toolbarRight !== undefined && (
        <div className="flex items-center gap-2">{toolbarRight}</div>
      )}
    </div>
  );
}
