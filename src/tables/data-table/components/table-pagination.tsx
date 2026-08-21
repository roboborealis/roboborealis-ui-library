'use client';

import * as React from 'react';
import { type Table } from '@tanstack/react-table';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

import { cn } from '@/lib/utils';
import { RoboIconButton } from '@/core/button/robo-icon-button';

import { DEFAULT_PAGE_SIZE_OPTIONS } from '../constants';

// ---------------------------------------------------------------------------
// TablePagination
// ---------------------------------------------------------------------------

export interface TablePaginationProps<TData> {
  table: Table<TData>;
  /** Page size options shown in the dropdown. Defaults to [10, 25, 50, 100]. */
  pageSizeOptions?: number[];
}

/**
 * TablePagination — pagination bar for RoboDataTable.
 *
 * Sits below the table. Shows row range text on the left and page size
 * selector + navigation buttons on the right. Fully keyboard-accessible
 * and WCAG 2.1 AA compliant.
 *
 * @example
 * ```tsx
 * <TablePagination table={table} pageSizeOptions={[10, 25, 50]} />
 * ```
 */
export function TablePagination<TData>({
  table,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS as unknown as number[],
}: TablePaginationProps<TData>) {
  const { pageIndex, pageSize } = table.getState().pagination;
  const pageCount = table.getPageCount();
  const rowCount = table.getRowCount();

  // Compute the 1-based row range shown on the current page
  const firstRow = rowCount === 0 ? 0 : pageIndex * pageSize + 1;
  const lastRow = Math.min((pageIndex + 1) * pageSize, rowCount);

  const canPrevious = table.getCanPreviousPage();
  const canNext = table.getCanNextPage();

  const handlePageSizeChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      table.setPageSize(Number(e.target.value));
    },
    [table],
  );

  return (
    <nav
      aria-label="Table pagination"
      className={cn(
        'flex flex-wrap items-center justify-between gap-x-6 gap-y-2',
        'border-t border-[var(--border)] px-4 py-2 text-sm text-[var(--muted-foreground)]',
      )}
    >
      {/* Left — row range summary */}
      <span className="shrink-0 tabular-nums" aria-live="polite" aria-atomic="true">
        {rowCount === 0
          ? 'No rows'
          : `Showing ${firstRow}–${lastRow} of ${rowCount} row${rowCount === 1 ? '' : 's'}`}
      </span>

      {/* Right — page size selector + nav buttons */}
      <div className="flex items-center gap-3">
        {/* Page size selector */}
        <label className="flex items-center gap-2">
          <span className="text-[var(--muted-foreground)]">Rows per page</span>
          <select
            value={pageSize}
            onChange={handlePageSizeChange}
            aria-label="Rows per page"
            className={cn(
              'rounded-[var(--radius)] border border-[var(--border)]',
              'bg-[var(--background)] text-[var(--foreground)]',
              'px-2 py-1 text-sm',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2',
              'cursor-pointer',
            )}
          >
            {pageSizeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        {/* Page number display */}
        <span
          className="tabular-nums text-[var(--muted-foreground)]"
          aria-current="page"
          aria-label={`Page ${pageCount === 0 ? 0 : pageIndex + 1} of ${pageCount}`}
        >
          Page{' '}
          <span className="font-medium text-[var(--foreground)]">
            {pageCount === 0 ? 0 : pageIndex + 1}
          </span>{' '}
          of{' '}
          <span className="font-medium text-[var(--foreground)]">{pageCount}</span>
        </span>

        {/* Navigation buttons */}
        <div className="flex items-center gap-0.5" role="group" aria-label="Page navigation">
          <RoboIconButton
            variant="ghost"
            size="sm"
            aria-label="First page"
            onClick={() => table.setPageIndex(0)}
            disabled={!canPrevious}
          >
            <ChevronsLeft size={16} aria-hidden="true" />
          </RoboIconButton>

          <RoboIconButton
            variant="ghost"
            size="sm"
            aria-label="Previous page"
            onClick={() => table.previousPage()}
            disabled={!canPrevious}
          >
            <ChevronLeft size={16} aria-hidden="true" />
          </RoboIconButton>

          <RoboIconButton
            variant="ghost"
            size="sm"
            aria-label="Next page"
            onClick={() => table.nextPage()}
            disabled={!canNext}
          >
            <ChevronRight size={16} aria-hidden="true" />
          </RoboIconButton>

          <RoboIconButton
            variant="ghost"
            size="sm"
            aria-label="Last page"
            onClick={() => table.setPageIndex(pageCount - 1)}
            disabled={!canNext}
          >
            <ChevronsRight size={16} aria-hidden="true" />
          </RoboIconButton>
        </div>
      </div>
    </nav>
  );
}
