'use client';

import * as React from 'react';
import { X } from 'lucide-react';

import { cn } from '@/lib/utils';

import type { BulkActionDef } from '../types';

// ---------------------------------------------------------------------------
// TableBulkActions — floating action bar when rows are selected
// ---------------------------------------------------------------------------

export interface TableBulkActionsProps<TData> {
  selectedRows: TData[];
  selectedCount: number;
  bulkActions: BulkActionDef<TData>[];
  onDeselectAll: () => void;
}

/**
 * TableBulkActions — floating bar shown when one or more rows are selected.
 *
 * Displays the selected row count, action buttons from the `bulkActions` prop,
 * and a dismiss button to deselect all rows. Renders below the table with
 * a slide-up entrance animation.
 *
 * @example
 * ```tsx
 * <TableBulkActions
 *   selectedRows={selectedRows}
 *   selectedCount={3}
 *   bulkActions={[
 *     { id: 'delete', label: 'Delete', variant: 'destructive', onAction: handleDelete },
 *     { id: 'export', label: 'Export', onAction: handleExport },
 *   ]}
 *   onDeselectAll={() => table.toggleAllRowsSelected(false)}
 * />
 * ```
 */
export function TableBulkActions<TData>({
  selectedRows,
  selectedCount,
  bulkActions,
  onDeselectAll,
}: TableBulkActionsProps<TData>) {
  if (selectedCount === 0) return null;

  return (
    <div
      role="toolbar"
      aria-label="Bulk actions"
      className={cn(
        'flex items-center gap-3 px-4 py-2',
        'border-t border-[var(--border)]',
        'bg-[var(--primary)]/5',
        'animate-in slide-in-from-bottom-2 fade-in duration-[var(--duration-normal)]',
      )}
    >
      {/* Selected count */}
      <span className="text-sm font-medium text-[var(--foreground)]">
        {selectedCount} row{selectedCount === 1 ? '' : 's'} selected
      </span>

      {/* Action buttons */}
      <div className="flex items-center gap-1.5">
        {bulkActions.map((action) => {
          const isDisabled =
            typeof action.disabled === 'function'
              ? action.disabled(selectedRows)
              : action.disabled;

          return (
            <button
              key={action.id}
              type="button"
              disabled={isDisabled}
              onClick={() => action.onAction(selectedRows)}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-[var(--radius)] px-3 py-1.5 text-xs font-medium',
                'transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-1',
                action.variant === 'destructive'
                  ? 'bg-[var(--destructive)] text-[var(--destructive-foreground)] hover:bg-[var(--destructive)]/90'
                  : 'bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary)]/90',
                isDisabled && 'cursor-not-allowed opacity-50',
              )}
            >
              {action.icon}
              {action.label}
            </button>
          );
        })}
      </div>

      {/* Deselect all */}
      <button
        type="button"
        onClick={onDeselectAll}
        aria-label="Deselect all rows"
        className={cn(
          'ml-auto inline-flex items-center gap-1 rounded-[var(--radius)] px-2 py-1 text-xs',
          'text-[var(--muted-foreground)] hover:text-[var(--foreground)]',
          'hover:bg-[var(--muted)]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-1',
          'transition-colors',
        )}
      >
        <X className="h-3 w-3" aria-hidden="true" />
        Deselect
      </button>
    </div>
  );
}
