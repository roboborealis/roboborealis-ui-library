'use client';

import * as React from 'react';
import type { ColumnDef, HeaderContext, CellContext } from '@tanstack/react-table';

import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Selection checkbox — reusable for header (select-all) and cell (per-row)
// ---------------------------------------------------------------------------

export interface SelectionCheckboxProps {
  checked: boolean;
  indeterminate?: boolean;
  onChange: (checked: boolean) => void;
  'aria-label': string;
}

function SelectionCheckbox({
  checked,
  indeterminate = false,
  onChange,
  'aria-label': ariaLabel,
}: SelectionCheckboxProps) {
  const ref = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (ref.current) {
      ref.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  return (
    <input
      ref={ref}
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      aria-label={ariaLabel}
      className={cn(
        'h-4 w-4 cursor-pointer rounded accent-[var(--primary)]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-1',
      )}
    />
  );
}

// ---------------------------------------------------------------------------
// createSelectionColumn — builds the auto-prepended checkbox column
// ---------------------------------------------------------------------------

/**
 * Creates a TanStack display column with header select-all checkbox
 * and per-row selection checkboxes.
 *
 * Auto-prepended by RoboDataTable when `enableRowSelection` is true.
 */
export function createSelectionColumn<TData>(): ColumnDef<TData, unknown> {
  return {
    id: '_selection',
    size: 40,
    minSize: 40,
    maxSize: 40,
    enableSorting: false,
    enableColumnFilter: false,
    enableResizing: false,
    enablePinning: false,
    enableHiding: false,
    header: ({ table }: HeaderContext<TData, unknown>) => {
      const isAllSelected = table.getIsAllRowsSelected();
      const isSomeSelected = table.getIsSomeRowsSelected();

      return (
        <SelectionCheckbox
          checked={isAllSelected}
          indeterminate={!isAllSelected && isSomeSelected}
          onChange={table.toggleAllRowsSelected}
          aria-label={
            isAllSelected
              ? 'Deselect all rows'
              : 'Select all rows'
          }
        />
      );
    },
    cell: ({ row }: CellContext<TData, unknown>) => {
      if (!row.getCanSelect()) return null;

      return (
        <SelectionCheckbox
          checked={row.getIsSelected()}
          onChange={row.toggleSelected}
          aria-label={`Select row ${row.id}`}
        />
      );
    },
  };
}

// ---------------------------------------------------------------------------
// Export SelectionCheckbox for potential reuse
// ---------------------------------------------------------------------------

export { SelectionCheckbox };
