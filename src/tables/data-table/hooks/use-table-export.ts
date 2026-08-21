'use client';

import * as React from 'react';
import type { Table, Column } from '@tanstack/react-table';

import type { RoboExportColumn } from '@/core/export-button/robo-export-button';

// ---------------------------------------------------------------------------
// useTableExport — extracts export-ready data from a TanStack Table instance
// ---------------------------------------------------------------------------

export interface UseTableExportOptions<TData> {
  table: Table<TData>;
  /**
   * When true, only export rows currently matching filters and pagination.
   * When false (default), export all rows after filtering (ignores pagination).
   */
  paginatedOnly?: boolean;
}

export interface UseTableExportReturn {
  /** Column definitions for RoboExportButton. */
  exportColumns: RoboExportColumn[];
  /** All filtered data (ignores pagination). */
  getExportData: () => Record<string, unknown>[];
  /** Only selected rows. */
  getSelectedExportData: () => Record<string, unknown>[];
}

function isExportableColumn<TData>(col: Column<TData>): boolean {
  // Skip internal columns (selection, expander)
  if (col.id.startsWith('_')) return false;
  // Respect meta.exportable = false
  if (col.columnDef.meta?.exportable === false) return false;
  return true;
}

function getColumnExportHeader<TData>(col: Column<TData>): string {
  // Use explicit export header from meta, or fall back to column header string
  if (col.columnDef.meta?.exportHeader) return col.columnDef.meta.exportHeader;
  const header = col.columnDef.header;
  if (typeof header === 'string') return header;
  return col.id;
}

function extractRowData<TData>(
  row: TData,
  columns: Column<TData>[],
): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const col of columns) {
    const accessorFn = (col.columnDef as { accessorFn?: (row: TData, index: number) => unknown }).accessorFn;
    const accessorKey = (col.columnDef as { accessorKey?: string }).accessorKey;

    if (accessorFn) {
      result[col.id] = accessorFn(row, 0);
    } else if (accessorKey && typeof row === 'object' && row !== null) {
      result[col.id] = (row as Record<string, unknown>)[accessorKey];
    } else {
      result[col.id] = undefined;
    }
  }
  return result;
}

/**
 * Hook that extracts export-ready data from a TanStack Table instance
 * for use with RoboExportButton.
 *
 * @example
 * ```tsx
 * const { exportColumns, getExportData, getSelectedExportData } = useTableExport({ table });
 *
 * <RoboExportButton
 *   data={getExportData()}
 *   columns={exportColumns}
 *   filename="satellite-constellation"
 * />
 * ```
 */
export function useTableExport<TData>(
  options: UseTableExportOptions<TData>,
): UseTableExportReturn {
  const { table } = options;

  const exportableColumns = React.useMemo(() => {
    return table.getAllLeafColumns().filter(isExportableColumn);
  }, [table]);

  const exportColumns = React.useMemo<RoboExportColumn[]>(() => {
    return exportableColumns.map((col) => ({
      key: col.id,
      label: getColumnExportHeader(col),
    }));
  }, [exportableColumns]);

  const getExportData = React.useCallback((): Record<string, unknown>[] => {
    // Get all filtered rows (ignores pagination)
    const rows = table.getFilteredRowModel().rows;
    return rows.map((row) => extractRowData(row.original, exportableColumns));
  }, [table, exportableColumns]);

  const getSelectedExportData = React.useCallback((): Record<string, unknown>[] => {
    const rows = table.getSelectedRowModel().rows;
    return rows.map((row) => extractRowData(row.original, exportableColumns));
  }, [table, exportableColumns]);

  return { exportColumns, getExportData, getSelectedExportData };
}
