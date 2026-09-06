'use client';

import * as React from 'react';
import type { Row, Table } from '@tanstack/react-table';

import { cn } from '@/lib/utils';

import { TableRow } from './table-row';
import { TableLoadingState } from './table-loading-state';
import { TableEmptyState } from './table-empty-state';
import { TableErrorState } from './table-error-state';
import { TableFetchingOverlay } from './table-fetching-overlay';
import type { UseVirtualRowsReturn } from '../hooks/use-virtual-rows';
import type { UseInlineEditReturn } from '../hooks/use-inline-edit';
import type { UseKeyboardNavReturn } from '../hooks/use-keyboard-nav';

// ---------------------------------------------------------------------------
// TableBody
// ---------------------------------------------------------------------------

export interface TableBodyProps<TData> {
  table: Table<TData>;
  /** Initial load: show skeleton rows instead of data */
  isLoading?: boolean;
  /** Refetch: data stays visible with an overlay */
  isFetching?: boolean;
  /** Fade rows in on initial render. Default: false */
  animateRows?: boolean;
  /** Stagger-fade rows in with CSS animation-delay per row. Default: false */
  animateRowStagger?: boolean;
  /** Custom empty state content */
  emptyState?: React.ReactNode;
  /** Custom error state content */
  errorState?: React.ReactNode;
  /** Custom expansion template for expanded rows */
  renderExpandedRow?: (row: Row<TData>) => React.ReactNode;
  /** Toggle a row's expansion on row click, not only the chevron. Default: false */
  expandOnRowClick?: boolean;
  /** Inline editing callback */
  onCellEdit?: (rowId: string, columnId: string, value: unknown) => void;
  /** Inline edit state from useInlineEdit hook */
  inlineEdit?: UseInlineEditReturn;
  /** Keyboard navigation state from useKeyboardNav hook */
  keyboardNav?: UseKeyboardNavReturn;
  /** Virtual row rendering — pass from useVirtualRows hook. Null = standard render. */
  virtualRows?: UseVirtualRowsReturn | null;
  /** Row/cell padding density. Default: 'comfortable' */
  density?: 'compact' | 'comfortable' | 'spacious';
  /** Tint every other row for readability. Default: false */
  striped?: boolean;
}

export function TableBody<TData>({
  table,
  isLoading = false,
  isFetching = false,
  emptyState,
  errorState,
  renderExpandedRow,
  expandOnRowClick = false,
  onCellEdit,
  inlineEdit,
  keyboardNav,
  virtualRows,
  animateRows = false,
  animateRowStagger = false,
  density,
  striped = false,
}: TableBodyProps<TData>) {
  const rows = table.getRowModel().rows;
  const visibleColumnCount = table.getVisibleLeafColumns().length;

  // Error state takes priority
  if (errorState) {
    return (
      <tbody>
        <TableErrorState colCount={visibleColumnCount}>
          {errorState}
        </TableErrorState>
      </tbody>
    );
  }

  // Initial loading state (no data yet)
  if (isLoading) {
    return (
      <tbody>
        <TableLoadingState colCount={visibleColumnCount} />
      </tbody>
    );
  }

  // Empty state (after filtering or genuinely no data)
  if (rows.length === 0) {
    return (
      <tbody>
        <TableEmptyState colCount={visibleColumnCount}>
          {emptyState}
        </TableEmptyState>
      </tbody>
    );
  }

  // -------------------------------------------------------------------------
  // Virtual rendering mode — only render visible rows in the viewport
  // -------------------------------------------------------------------------
  if (virtualRows) {
    const { virtualItems, totalSize } = virtualRows;

    return (
      <tbody className="relative">
        {/* Top spacer to offset visible rows */}
        {virtualItems.length > 0 && virtualItems[0].start > 0 && (
          <tr aria-hidden="true">
            <td
              colSpan={visibleColumnCount}
              style={{ height: virtualItems[0].start, padding: 0, border: 'none' }}
            />
          </tr>
        )}

        {virtualItems.map((virtualItem) => {
          const row = rows[virtualItem.index];
          if (!row) return null;
          return (
            <TableRow
              key={row.id}
              row={row}
              rowIndex={virtualItem.index + 1}
              renderExpandedRow={renderExpandedRow}
              expandOnRowClick={expandOnRowClick}
              visibleColumnCount={visibleColumnCount}
              onCellEdit={onCellEdit}
              inlineEdit={inlineEdit}
              keyboardNav={keyboardNav}
              density={density}
              isStriped={striped && virtualItem.index % 2 === 1}
            />
          );
        })}

        {/* Bottom spacer */}
        {virtualItems.length > 0 && (
          <tr aria-hidden="true">
            <td
              colSpan={visibleColumnCount}
              style={{
                height: Math.max(0, totalSize - virtualItems[virtualItems.length - 1].end),
                padding: 0,
                border: 'none',
              }}
            />
          </tr>
        )}

        {isFetching && <TableFetchingOverlay colCount={visibleColumnCount} />}
      </tbody>
    );
  }

  // -------------------------------------------------------------------------
  // Standard rendering — all rows
  // -------------------------------------------------------------------------
  return (
    <tbody className={cn('relative', animateRows && 'animate-in fade-in duration-[var(--duration-normal)]')}>
      {rows.map((row, index) => (
        <TableRow
          key={row.id}
          row={row}
          rowIndex={index + 1}
          renderExpandedRow={renderExpandedRow}
          expandOnRowClick={expandOnRowClick}
          visibleColumnCount={visibleColumnCount}
          onCellEdit={onCellEdit}
          inlineEdit={inlineEdit}
          keyboardNav={keyboardNav}
          animationDelay={animateRowStagger ? `${index * 30}ms` : undefined}
          density={density}
          isStriped={striped && index % 2 === 1}
        />
      ))}
      {isFetching && <TableFetchingOverlay colCount={visibleColumnCount} />}
    </tbody>
  );
}
