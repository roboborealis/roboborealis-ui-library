'use client';
import * as React from 'react';
import { type Column } from '@tanstack/react-table';
import { Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ColumnFilterProps<TData> {
  column: Column<TData, unknown>;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function isActive(value: unknown): boolean {
  if (value === undefined || value === null) return false;
  if (Array.isArray(value)) {
    return value.some((v) => v !== undefined && v !== null && v !== '');
  }
  if (typeof value === 'string') return value.length > 0;
  return true;
}

// ---------------------------------------------------------------------------
// TextFilter
// ---------------------------------------------------------------------------

interface TextFilterProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
}

function TextFilter({ value, onChange, onClear }: TextFilterProps) {
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const [local, setLocal] = React.useState(value ?? '');

  React.useEffect(() => {
    setLocal(value ?? '');
  }, [value]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const next = e.target.value;
    setLocal(next);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      onChange(next);
    }, 300);
  }

  React.useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  return (
    <div className="flex flex-col gap-2">
      <input
        type="text"
        aria-label="Filter text"
        className="w-full rounded-[var(--radius)] border border-[var(--border)] bg-[var(--background)] px-2 py-1.5 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
        placeholder="Search…"
        value={local}
        onChange={handleChange}
      />
      {local.length > 0 && (
        <button
          type="button"
          onClick={onClear}
          className="self-start text-xs text-[var(--muted-foreground)] underline underline-offset-2 hover:text-[var(--foreground)]"
        >
          Clear
        </button>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// SelectFilter
// ---------------------------------------------------------------------------

interface FilterOption {
  label: string;
  value: string | number | boolean;
}

interface SelectFilterProps {
  options: FilterOption[];
  selected: Array<string | number | boolean>;
  onChange: (selected: Array<string | number | boolean>) => void;
  onClear: () => void;
}

function SelectFilter({ options, selected, onChange, onClear }: SelectFilterProps) {
  function toggle(val: string | number | boolean) {
    if (selected.includes(val)) {
      onChange(selected.filter((v) => v !== val));
    } else {
      onChange([...selected, val]);
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      <ul role="list" className="flex flex-col gap-1">
        {options.map((opt) => {
          const id = `cf-select-${String(opt.value)}`;
          const checked = selected.includes(opt.value);
          return (
            <li key={String(opt.value)}>
              <label
                htmlFor={id}
                className="flex cursor-pointer items-center gap-2 rounded-[var(--radius)] px-1 py-0.5 text-sm text-[var(--foreground)] hover:bg-[var(--accent)]"
              >
                <input
                  id={id}
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggle(opt.value)}
                  className="h-3.5 w-3.5 accent-[var(--primary)]"
                  aria-checked={checked}
                />
                <span>{opt.label}</span>
              </label>
            </li>
          );
        })}
      </ul>
      {selected.length > 0 && (
        <button
          type="button"
          onClick={onClear}
          className="self-start text-xs text-[var(--muted-foreground)] underline underline-offset-2 hover:text-[var(--foreground)]"
        >
          Clear
        </button>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// RangeFilter
// ---------------------------------------------------------------------------

interface RangeFilterProps {
  value: [number | '', number | ''];
  onChange: (value: [number | '', number | '']) => void;
  onClear: () => void;
}

function RangeFilter({ value, onChange, onClear }: RangeFilterProps) {
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const [local, setLocal] = React.useState<[string, string]>([
    value[0] !== '' && value[0] !== undefined ? String(value[0]) : '',
    value[1] !== '' && value[1] !== undefined ? String(value[1]) : '',
  ]);

  React.useEffect(() => {
    setLocal([
      value[0] !== '' && value[0] !== undefined ? String(value[0]) : '',
      value[1] !== '' && value[1] !== undefined ? String(value[1]) : '',
    ]);
  }, [value]);

  function commit(next: [string, string]) {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      onChange([
        next[0] !== '' ? Number(next[0]) : '',
        next[1] !== '' ? Number(next[1]) : '',
      ]);
    }, 300);
  }

  React.useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  const hasValue = local[0] !== '' || local[1] !== '';

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1.5">
        <input
          type="number"
          aria-label="Minimum value"
          placeholder="Min"
          value={local[0]}
          onChange={(e) => {
            const next: [string, string] = [e.target.value, local[1]];
            setLocal(next);
            commit(next);
          }}
          className="w-full rounded-[var(--radius)] border border-[var(--border)] bg-[var(--background)] px-2 py-1.5 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
        />
        <span className="shrink-0 text-xs text-[var(--muted-foreground)]">–</span>
        <input
          type="number"
          aria-label="Maximum value"
          placeholder="Max"
          value={local[1]}
          onChange={(e) => {
            const next: [string, string] = [local[0], e.target.value];
            setLocal(next);
            commit(next);
          }}
          className="w-full rounded-[var(--radius)] border border-[var(--border)] bg-[var(--background)] px-2 py-1.5 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
        />
      </div>
      {hasValue && (
        <button
          type="button"
          onClick={onClear}
          className="self-start text-xs text-[var(--muted-foreground)] underline underline-offset-2 hover:text-[var(--foreground)]"
        >
          Clear
        </button>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// DateFilter
// ---------------------------------------------------------------------------

interface DateFilterProps {
  value: [string, string];
  onChange: (value: [string, string]) => void;
  onClear: () => void;
}

function DateFilter({ value, onChange, onClear }: DateFilterProps) {
  const [local, setLocal] = React.useState<[string, string]>([
    value[0] ?? '',
    value[1] ?? '',
  ]);

  React.useEffect(() => {
    setLocal([value[0] ?? '', value[1] ?? '']);
  }, [value]);

  const hasValue = local[0] !== '' || local[1] !== '';

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-1.5">
        <label className="flex flex-col gap-0.5">
          <span className="text-xs text-[var(--muted-foreground)]">From</span>
          <input
            type="date"
            aria-label="Date from"
            value={local[0]}
            onChange={(e) => {
              const next: [string, string] = [e.target.value, local[1]];
              setLocal(next);
              onChange(next);
            }}
            className="w-full rounded-[var(--radius)] border border-[var(--border)] bg-[var(--background)] px-2 py-1.5 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
          />
        </label>
        <label className="flex flex-col gap-0.5">
          <span className="text-xs text-[var(--muted-foreground)]">To</span>
          <input
            type="date"
            aria-label="Date to"
            value={local[1]}
            onChange={(e) => {
              const next: [string, string] = [local[0], e.target.value];
              setLocal(next);
              onChange(next);
            }}
            className="w-full rounded-[var(--radius)] border border-[var(--border)] bg-[var(--background)] px-2 py-1.5 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
          />
        </label>
      </div>
      {hasValue && (
        <button
          type="button"
          onClick={onClear}
          className="self-start text-xs text-[var(--muted-foreground)] underline underline-offset-2 hover:text-[var(--foreground)]"
        >
          Clear
        </button>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// BooleanFilter
// ---------------------------------------------------------------------------

interface BooleanFilterProps {
  value: boolean | undefined;
  onChange: (value: boolean | undefined) => void;
}

function BooleanFilter({ value, onChange }: BooleanFilterProps) {
  const options: { label: string; val: boolean | undefined }[] = [
    { label: 'All', val: undefined },
    { label: 'Yes', val: true },
    { label: 'No', val: false },
  ];

  return (
    <fieldset className="flex flex-col gap-1" aria-label="Boolean filter">
      <legend className="sr-only">Filter by boolean value</legend>
      {options.map((opt) => {
        const id = `cf-bool-${opt.label.toLowerCase()}`;
        const checked =
          opt.val === undefined ? value === undefined : value === opt.val;
        return (
          <label
            key={opt.label}
            htmlFor={id}
            className="flex cursor-pointer items-center gap-2 rounded-[var(--radius)] px-1 py-0.5 text-sm text-[var(--foreground)] hover:bg-[var(--accent)]"
          >
            <input
              id={id}
              type="radio"
              name="cf-bool-group"
              checked={checked}
              onChange={() => onChange(opt.val)}
              className="h-3.5 w-3.5 accent-[var(--primary)]"
              aria-checked={checked}
            />
            <span>{opt.label}</span>
          </label>
        );
      })}
    </fieldset>
  );
}

// ---------------------------------------------------------------------------
// ColumnFilter (main component)
// ---------------------------------------------------------------------------

export function ColumnFilter<TData>({ column }: ColumnFilterProps<TData>) {
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const meta = column.columnDef.meta as
    | {
        filterType?: 'text' | 'select' | 'range' | 'date' | 'boolean';
        filterOptions?: FilterOption[];
      }
    | undefined;

  const filterType = meta?.filterType ?? 'text';
  const filterOptions = meta?.filterOptions ?? [];
  const currentValue = column.getFilterValue();
  const active = isActive(currentValue);

  // Click-outside detection
  React.useEffect(() => {
    if (!open) return;

    function handlePointerDown(e: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [open]);

  // Escape key closes panel
  React.useEffect(() => {
    if (!open) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpen(false);
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  function clearFilter() {
    column.setFilterValue(undefined);
  }

  function renderFilterContent() {
    switch (filterType) {
      case 'text': {
        return (
          <TextFilter
            value={(currentValue as string) ?? ''}
            onChange={(val) => column.setFilterValue(val === '' ? undefined : val)}
            onClear={clearFilter}
          />
        );
      }
      case 'select': {
        return (
          <SelectFilter
            options={filterOptions}
            selected={(currentValue as Array<string | number | boolean>) ?? []}
            onChange={(vals) =>
              column.setFilterValue(vals.length === 0 ? undefined : vals)
            }
            onClear={clearFilter}
          />
        );
      }
      case 'range': {
        const rangeVal = (currentValue as [number | '', number | '']) ?? ['', ''];
        return (
          <RangeFilter
            value={rangeVal}
            onChange={(val) => {
              const isEmpty = val[0] === '' && val[1] === '';
              column.setFilterValue(isEmpty ? undefined : val);
            }}
            onClear={clearFilter}
          />
        );
      }
      case 'date': {
        const dateVal = (currentValue as [string, string]) ?? ['', ''];
        return (
          <DateFilter
            value={dateVal}
            onChange={(val) => {
              const isEmpty = val[0] === '' && val[1] === '';
              column.setFilterValue(isEmpty ? undefined : val);
            }}
            onClear={clearFilter}
          />
        );
      }
      case 'boolean': {
        return (
          <BooleanFilter
            value={currentValue as boolean | undefined}
            onChange={(val) => column.setFilterValue(val)}
          />
        );
      }
      default:
        return null;
    }
  }

  return (
    <div ref={containerRef} className="relative inline-flex">
      <button
        type="button"
        aria-label={`Filter column${active ? ' (active)' : ''}`}
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          'inline-flex items-center justify-center rounded p-0.5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]',
          'hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]',
          active
            ? 'text-[var(--primary)]'
            : 'text-[var(--muted-foreground)]',
        )}
      >
        <Filter size={14} aria-hidden="true" />
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Column filter"
          className={cn(
            'absolute left-0 top-full z-30 mt-1',
            'min-w-[200px]',
            'rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card)] shadow-md',
            'p-3',
          )}
        >
          {renderFilterContent()}
        </div>
      )}
    </div>
  );
}
