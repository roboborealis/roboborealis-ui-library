'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

import type { RoboDataTableProps } from './types';
import { useDataTable } from './hooks/use-data-table';
import { TableHeader } from './components/table-header';
import { TableBody } from './components/table-body';
import { TablePagination } from './components/table-pagination';
import { TableToolbar } from './components/table-toolbar';
import { TableBulkActions } from './components/table-bulk-actions';
import { createSelectionColumn } from './components/table-selection-column';
import { createExpandColumn } from './components/table-expand-column';
import { useVirtualRows } from './hooks/use-virtual-rows';
import { useInlineEdit } from './hooks/use-inline-edit';
import { useKeyboardNav } from './hooks/use-keyboard-nav';

// ---------------------------------------------------------------------------
// RoboDataTable — TanStack Table v8 powered data table
// ---------------------------------------------------------------------------

/**
 * RoboDataTable — enterprise-grade data table for enterprise applications.
 *
 * Built on TanStack Table v8. Supports sorting, pagination, filtering, row selection,
 * column pinning/resize/reorder, nested/expandable rows, inline editing, and saved views.
 *
 * Enable features via boolean flags — a table with zero flags is a simple read-only table.
 *
 * @example
 * ```tsx
 * import { createColumnHelper } from '@tanstack/react-table';
 * import { RoboDataTable } from '@roboborealis/components/tables';
 *
 * const columnHelper = createColumnHelper<Satellite>();
 * const columns = [
 *   columnHelper.accessor('name', { header: 'Satellite', enableSorting: true }),
 *   columnHelper.accessor('status', { header: 'Status' }),
 * ];
 *
 * <RoboDataTable
 *   columns={columns}
 *   data={satellites}
 *   enableSorting
 *   enablePagination
 *   pageSize={25}
 * />
 * ```
 */
function RoboDataTable<TData = Record<string, unknown>>(
  props: RoboDataTableProps<TData> & { ref?: React.Ref<HTMLDivElement> },
) {
  const {
    // Data (passed to hook)
    data,
    columns,
    getRowId,

    // Loading / Empty / Error States
    isLoading = false,
    isFetching = false,
    emptyState,
    errorState,

    // Feature Flags (passed to hook)
    enableSorting = false,
    enableMultiSort = false,
    enableFiltering = false,
    enableGlobalFilter = false,
    enableColumnFilters = false,
    enablePagination = false,
    enableRowSelection = false,
    enableMultiRowSelection = false,
    enableColumnPinning = false,
    enableColumnResizing = false,
    enableColumnReordering = false,
    enableColumnVisibility = false,
    enableExpanding = false,
    enableSavedViews: _enableSavedViews = false,

    // Server-Side Mode (passed to hook)
    manualSorting = false,
    manualFiltering = false,
    manualPagination = false,
    rowCount,
    pageCount,

    // Controlled State (passed to hook)
    sorting,
    onSortingChange,
    columnFilters,
    onColumnFiltersChange,
    globalFilter,
    onGlobalFilterChange,
    columnVisibility,
    onColumnVisibilityChange,
    columnOrder,
    onColumnOrderChange,
    columnPinning,
    onColumnPinningChange,
    pagination,
    onPaginationChange,
    rowSelection,
    onRowSelectionChange,
    expanded,
    onExpandedChange,

    // Pagination Config (passed to hook)
    pageSize,
    pageSizeOptions: _pageSizeOptions,

    // Expanding / Nested Rows
    getSubRows,
    renderExpandedRow,
    allowMultipleExpanded,

    // Row Selection (passed to hook)
    enableSelectAll: _enableSelectAll = true,
    enableRowSelectionFn,

    // Bulk Actions
    bulkActions,

    // Inline Editing
    onCellEdit,

    // Saved Views (future phase)
    savedViews: _savedViews,
    onViewSave: _onViewSave,
    onViewDelete: _onViewDelete,
    onViewLoad: _onViewLoad,

    // Persistence (future phase)
    storageAdapter: _storageAdapter,
    storageKey: _storageKey,

    // Custom Global Filter (passed to hook)
    globalFilterFn,

    // Virtualization
    enableVirtualization = false,
    virtualRowHeight,
    virtualOverscan,

    // Styling
    className,
    density,
    striped = false,
    bordered = false,
    stickyHeader = false,
    animateRows = false,
    animateRowStagger = false,

    // Slot Props
    toolbarLeft,
    toolbarRight,
    hideGlobalSearchInput,

    // Accessibility
    'aria-label': ariaLabel,
    caption,

    // Ref
    tableRef,
    ref,
  } = props;

  // -------------------------------------------------------------------------
  // Auto-prepend selection checkbox column when row selection is enabled
  // -------------------------------------------------------------------------

  const effectiveColumns = React.useMemo(() => {
    const prepended = [];
    if (enableRowSelection) {
      prepended.push(createSelectionColumn<TData>());
    }
    if (enableExpanding) {
      prepended.push(createExpandColumn<TData>());
    }
    if (prepended.length === 0) return columns;
    return [...prepended, ...columns];
  }, [enableRowSelection, enableExpanding, columns]);

  // -------------------------------------------------------------------------
  // Create TanStack Table instance via the useDataTable hook
  // -------------------------------------------------------------------------

  const { table, globalFilterValue, setGlobalFilter, isFiltered, resetFilters, selectedRowCount } = useDataTable<TData>({
    data,
    columns: effectiveColumns,
    getRowId,

    enableSorting,
    enableMultiSort,
    enableFiltering,
    enableGlobalFilter,
    enableColumnFilters,
    enablePagination,
    enableRowSelection,
    enableMultiRowSelection,
    enableColumnPinning,
    enableColumnResizing,
    enableColumnReordering,
    enableColumnVisibility,
    enableExpanding,

    manualSorting,
    manualFiltering,
    manualPagination,
    rowCount,
    pageCount,

    sorting,
    onSortingChange,
    columnFilters,
    onColumnFiltersChange,
    globalFilter,
    onGlobalFilterChange,
    columnVisibility,
    onColumnVisibilityChange,
    columnOrder,
    onColumnOrderChange,
    columnPinning,
    onColumnPinningChange,
    pagination,
    onPaginationChange,
    rowSelection,
    onRowSelectionChange,
    expanded,
    onExpandedChange,

    pageSize,

    getSubRows,
    allowMultipleExpanded,
    renderExpandedRow: !!renderExpandedRow,

    enableRowSelectionFn,

    globalFilterFn,
  });

  // -------------------------------------------------------------------------
  // Expose TanStack Table instance via tableRef
  // -------------------------------------------------------------------------

  React.useImperativeHandle(
    tableRef,
    () => table,
    [table],
  );

  // -------------------------------------------------------------------------
  // Virtualization (Phase 7)
  // -------------------------------------------------------------------------

  const virtualRows = useVirtualRows({
    table,
    rowHeight: virtualRowHeight,
    overscan: virtualOverscan,
    enabled: enableVirtualization,
  });

  // -------------------------------------------------------------------------
  // Inline Editing (Phase 8)
  // -------------------------------------------------------------------------

  const inlineEdit = useInlineEdit({ onCellEdit });

  // -------------------------------------------------------------------------
  // Keyboard Navigation (Phase 8)
  // -------------------------------------------------------------------------

  const tableContainerRef = React.useRef<HTMLDivElement>(null);
  const rows = table.getRowModel().rows;
  const visibleColumns = table.getVisibleLeafColumns();

  const keyboardNav = useKeyboardNav({
    containerRef: tableContainerRef,
    enabled: rows.length > 0,
    rowCount: rows.length + 1, // +1 for header row
    columnCount: visibleColumns.length,
  });

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  // When virtualized, the scroll container wraps the table and has the parentRef
  const scrollContainerRef = virtualRows?.parentRef;

  return (
    <div
      ref={ref}
      className={cn('robo-data-table w-full', className)}
      data-density={density}
    >
      {/* Toolbar — global search, filter chips, slot props */}
      <TableToolbar
        table={table}
        enableGlobalFilter={enableGlobalFilter}
        globalFilter={globalFilterValue}
        onGlobalFilterChange={setGlobalFilter}
        isFiltered={isFiltered}
        resetFilters={resetFilters}
        toolbarLeft={toolbarLeft}
        toolbarRight={toolbarRight}
        hideGlobalSearchInput={hideGlobalSearchInput}
      />

      <div
        ref={(el) => {
          // Merge refs: scrollContainerRef (virtual) + tableContainerRef (keyboard nav)
          if (scrollContainerRef) {
            (scrollContainerRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
          }
          tableContainerRef.current = el;
        }}
        onKeyDown={keyboardNav.onKeyDown}
        className={cn(
          'w-full overflow-x-auto',
          (stickyHeader || enableVirtualization) && 'max-h-[80vh] overflow-y-auto',
        )}
      >
        <table
          className={cn(
            'w-full border-collapse text-sm',
            bordered && '[&_td]:border [&_td]:border-[var(--border)] [&_th]:border [&_th]:border-[var(--border)]',
          )}
          role={enableRowSelection || onCellEdit ? 'grid' : 'table'}
          aria-label={ariaLabel}
          aria-busy={isLoading || isFetching || undefined}
        >
          {caption && (
            <caption className="sr-only">{caption}</caption>
          )}

          <TableHeader
            table={table}
            enableSorting={enableSorting}
            enableColumnFilters={enableColumnFilters || enableFiltering}
            enableColumnReordering={enableColumnReordering}
            enableColumnResizing={enableColumnResizing}
            enableColumnPinning={enableColumnPinning}
            stickyHeader={stickyHeader || enableVirtualization}
            density={density}
          />

          <TableBody
            table={table}
            isLoading={isLoading}
            isFetching={isFetching}
            emptyState={emptyState}
            errorState={errorState}
            renderExpandedRow={renderExpandedRow}
            onCellEdit={onCellEdit}
            inlineEdit={inlineEdit}
            keyboardNav={keyboardNav}
            virtualRows={virtualRows}
            animateRows={animateRows}
            animateRowStagger={animateRowStagger}
            striped={striped}
            density={density}
          />
        </table>
      </div>

      {enablePagination && (
        <TablePagination table={table} pageSizeOptions={_pageSizeOptions} />
      )}

      {/* Bulk actions bar — shown when rows are selected and bulkActions are provided */}
      {enableRowSelection && bulkActions && bulkActions.length > 0 && (
        <TableBulkActions
          selectedRows={table.getSelectedRowModel().rows.map((r) => r.original)}
          selectedCount={selectedRowCount}
          bulkActions={bulkActions}
          onDeselectAll={() => table.toggleAllRowsSelected(false)}
        />
      )}
    </div>
  );
}

(RoboDataTable as unknown as { displayName: string }).displayName = 'RoboDataTable';

export { RoboDataTable };
