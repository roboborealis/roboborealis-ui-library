'use client';

import * as React from 'react';
import type { ColumnDef, CellContext } from '@tanstack/react-table';
import { ChevronRight } from 'lucide-react';

import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// ExpandToggle — inline expand/collapse chevron
// ---------------------------------------------------------------------------

export interface ExpandToggleProps {
  isExpanded: boolean;
  canExpand: boolean;
  onToggle: () => void;
  depth: number;
  rowId: string;
}

function ExpandToggle({ isExpanded, canExpand, onToggle, depth, rowId }: ExpandToggleProps) {
  if (!canExpand) {
    // Reserve space for alignment when sibling rows are expandable
    return <span style={{ paddingLeft: depth * 16 + 24 }} />;
  }

  return (
    <button
      type="button"
      onClick={onToggle}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onToggle();
        }
      }}
      aria-expanded={isExpanded}
      aria-label={isExpanded ? `Collapse row ${rowId}` : `Expand row ${rowId}`}
      style={{ paddingLeft: depth * 16 }}
      className={cn(
        'inline-flex items-center justify-center rounded p-0.5',
        'text-[var(--muted-foreground)] hover:text-[var(--foreground)]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]',
        'transition-transform duration-[var(--duration-fast)]',
      )}
    >
      <ChevronRight
        className={cn(
          'h-4 w-4 transition-transform duration-[var(--duration-fast)]',
          isExpanded && 'rotate-90',
        )}
        aria-hidden="true"
      />
    </button>
  );
}

// ---------------------------------------------------------------------------
// createExpandColumn — builds the auto-prepended expand toggle column
// ---------------------------------------------------------------------------

/**
 * Creates a TanStack display column with expand/collapse chevron toggles.
 *
 * Auto-prepended by RoboDataTable when `enableExpanding` is true. Supports
 * sub-row hierarchy with visual indentation based on row depth.
 */
export function createExpandColumn<TData>(): ColumnDef<TData, unknown> {
  return {
    id: '_expander',
    size: 40,
    minSize: 40,
    maxSize: 40,
    enableSorting: false,
    enableColumnFilter: false,
    enableResizing: false,
    enablePinning: false,
    enableHiding: false,
    header: () => <span className="sr-only">Expand row</span>,
    cell: ({ row }: CellContext<TData, unknown>) => (
      <ExpandToggle
        isExpanded={row.getIsExpanded()}
        canExpand={row.getCanExpand()}
        onToggle={row.getToggleExpandedHandler()}
        depth={row.depth}
        rowId={row.id}
      />
    ),
  };
}

export { ExpandToggle };
