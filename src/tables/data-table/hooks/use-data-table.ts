'use client';

import { useState, useRef, useMemo, useCallback } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getExpandedRowModel,
} from '@tanstack/react-table';
import type {
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  ColumnOrderState,
  ColumnPinningState,
  PaginationState,
  RowSelectionState,
  ExpandedState,
  OnChangeFn,
  Table,
  FilterFn,
  Row,
  Updater,
} from '@tanstack/react-table';

import { DEFAULT_PAGE_SIZE, DEFAULT_PAGE_SIZE_OPTIONS } from '../constants';

// ---------------------------------------------------------------------------
// Hook input props — subset of RoboDataTableProps relevant to table state
// ---------------------------------------------------------------------------

export interface UseDataTableProps<TData> {
  // --- Data ---
  data: TData[];
  columns: ColumnDef<TData, unknown>[];
  getRowId?: (originalRow: TData, index: number) => string;

  // --- Feature Flags ---
  enableSorting?: boolean;
  enableMultiSort?: boolean;
  enableFiltering?: boolean;
  enableGlobalFilter?: boolean;
  enableColumnFilters?: boolean;
  enablePagination?: boolean;
  enableRowSelection?: boolean;
  enableMultiRowSelection?: boolean;
  enableColumnPinning?: boolean;
  enableColumnResizing?: boolean;
  enableColumnReordering?: boolean;
  enableColumnVisibility?: boolean;
  enableExpanding?: boolean;

  // --- Server-Side Mode ---
  manualSorting?: boolean;
  manualFiltering?: boolean;
  manualPagination?: boolean;
  rowCount?: number;
  pageCount?: number;

  // --- Controlled State ---
  sorting?: SortingState;
  onSortingChange?: OnChangeFn<SortingState>;
  columnFilters?: ColumnFiltersState;
  onColumnFiltersChange?: OnChangeFn<ColumnFiltersState>;
  globalFilter?: string;
  onGlobalFilterChange?: (value: string) => void;
  columnVisibility?: VisibilityState;
  onColumnVisibilityChange?: OnChangeFn<VisibilityState>;
  columnOrder?: ColumnOrderState;
  onColumnOrderChange?: OnChangeFn<ColumnOrderState>;
  columnPinning?: ColumnPinningState;
  onColumnPinningChange?: OnChangeFn<ColumnPinningState>;
  pagination?: PaginationState;
  onPaginationChange?: OnChangeFn<PaginationState>;
  rowSelection?: RowSelectionState;
  onRowSelectionChange?: OnChangeFn<RowSelectionState>;
  expanded?: ExpandedState;
  onExpandedChange?: OnChangeFn<ExpandedState>;

  // --- Pagination Config ---
  pageSize?: number;
  pageSizeOptions?: number[];

  // --- Expanding / Nested Rows ---
  getSubRows?: (originalRow: TData, index: number) => TData[] | undefined;
  allowMultipleExpanded?: boolean;
  /** When true, every row is expandable (used for template-mode expansion via renderExpandedRow). */
  renderExpandedRow?: boolean;

  // --- Row Selection ---
  enableSelectAll?: boolean;
  enableRowSelectionFn?: (row: Row<TData>) => boolean;

  // --- Custom Global Filter ---
  globalFilterFn?: FilterFn<TData>;
}

// ---------------------------------------------------------------------------
// Hook return type — TanStack Table instance + convenience derived state
// ---------------------------------------------------------------------------

export interface UseDataTableReturn<TData> {
  /** The TanStack Table instance */
  table: Table<TData>;
  /** Current global filter value */
  globalFilterValue: string;
  /** Set the global filter value */
  setGlobalFilter: (value: string) => void;
  /** True when at least one column filter or global filter is active */
  isFiltered: boolean;
  /** True when the table has zero rows after filtering */
  isEmpty: boolean;
  /** Count of selected rows */
  selectedRowCount: number;
  /** Reset all column filters and global filter to their defaults */
  resetFilters: () => void;
  /** Reset sorting to its default (empty) state */
  resetSorting: () => void;
}

// ---------------------------------------------------------------------------
// Helper: create a controlled-or-uncontrolled state pair
// ---------------------------------------------------------------------------

/**
 * Returns [state, onChangeHandler] where:
 * - If `controlled` is provided, it is used as the state source and
 *   `onControlledChange` is forwarded as the handler.
 * - Otherwise, internal React state is used with `initialValue`.
 */
function useControlledState<TState>(
  controlled: TState | undefined,
  onControlledChange: OnChangeFn<TState> | undefined,
  initialValue: TState,
): [TState, OnChangeFn<TState>] {
  const [internal, setInternal] = useState<TState>(initialValue);

  const isControlled = controlled !== undefined;
  const state = isControlled ? controlled : internal;

  // Stabilize the external callback via ref so onChange identity doesn't churn
  const onControlledChangeRef = useRef(onControlledChange);
  onControlledChangeRef.current = onControlledChange;

  const onChange: OnChangeFn<TState> = useCallback(
    (updaterOrValue: Updater<TState>) => {
      if (isControlled) {
        onControlledChangeRef.current?.(updaterOrValue);
      } else {
        setInternal(updaterOrValue);
      }
    },
    [isControlled],
  );

  return [state, onChange];
}

// ---------------------------------------------------------------------------
// useDataTable hook
// ---------------------------------------------------------------------------

export function useDataTable<TData>(
  props: UseDataTableProps<TData>,
): UseDataTableReturn<TData> {
  const {
    // Data
    data,
    columns,
    getRowId,

    // Feature flags
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
    enableColumnReordering: _enableColumnReordering = false,
    enableColumnVisibility: _enableColumnVisibility = false,
    enableExpanding = false,

    // Server-side mode
    manualSorting = false,
    manualFiltering = false,
    manualPagination = false,
    rowCount,
    pageCount,

    // Controlled state
    sorting: controlledSorting,
    onSortingChange,
    columnFilters: controlledColumnFilters,
    onColumnFiltersChange,
    globalFilter: controlledGlobalFilter,
    onGlobalFilterChange,
    columnVisibility: controlledColumnVisibility,
    onColumnVisibilityChange,
    columnOrder: controlledColumnOrder,
    onColumnOrderChange,
    columnPinning: controlledColumnPinning,
    onColumnPinningChange,
    pagination: controlledPagination,
    onPaginationChange,
    rowSelection: controlledRowSelection,
    onRowSelectionChange,
    expanded: controlledExpanded,
    onExpandedChange,

    // Pagination config
    pageSize = DEFAULT_PAGE_SIZE,
    pageSizeOptions: _pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS as unknown as number[],

    // Expanding
    getSubRows,
    allowMultipleExpanded = false,
    renderExpandedRow: hasRenderExpandedRow = false,

    // Row selection
    enableSelectAll: _enableSelectAll = true,
    enableRowSelectionFn,

    // Custom global filter
    globalFilterFn,
  } = props;

  // -------------------------------------------------------------------------
  // State pairs: controlled or uncontrolled
  // -------------------------------------------------------------------------

  const [sorting, setSorting] = useControlledState<SortingState>(
    controlledSorting,
    onSortingChange,
    [],
  );

  const [columnFilters, setColumnFilters] = useControlledState<ColumnFiltersState>(
    controlledColumnFilters,
    onColumnFiltersChange,
    [],
  );

  // Global filter uses a simpler string state with a different callback signature
  const [internalGlobalFilter, setInternalGlobalFilter] = useState<string>('');
  const isGlobalFilterControlled = controlledGlobalFilter !== undefined;
  const globalFilterState = isGlobalFilterControlled
    ? controlledGlobalFilter
    : internalGlobalFilter;

  const handleGlobalFilterChange = useCallback(
    (updaterOrValue: Updater<string>) => {
      const newValue =
        typeof updaterOrValue === 'function'
          ? (updaterOrValue as (prev: string) => string)(globalFilterState)
          : updaterOrValue;

      if (isGlobalFilterControlled) {
        onGlobalFilterChange?.(newValue);
      } else {
        setInternalGlobalFilter(newValue);
      }
    },
    [isGlobalFilterControlled, onGlobalFilterChange, globalFilterState],
  );

  const [columnVisibility, setColumnVisibility] = useControlledState<VisibilityState>(
    controlledColumnVisibility,
    onColumnVisibilityChange,
    {},
  );

  const [columnOrder, setColumnOrder] = useControlledState<ColumnOrderState>(
    controlledColumnOrder,
    onColumnOrderChange,
    [],
  );

  const [columnPinning, setColumnPinning] = useControlledState<ColumnPinningState>(
    controlledColumnPinning,
    onColumnPinningChange,
    {},
  );

  const [paginationState, setPaginationState] = useControlledState<PaginationState>(
    controlledPagination,
    onPaginationChange,
    { pageIndex: 0, pageSize },
  );

  const [rowSelection, setRowSelection] = useControlledState<RowSelectionState>(
    controlledRowSelection,
    onRowSelectionChange,
    {},
  );

  const [expanded, setExpanded] = useControlledState<ExpandedState>(
    controlledExpanded,
    onExpandedChange,
    {},
  );

  // -------------------------------------------------------------------------
  // Single-expand enforcement: when allowMultipleExpanded is false, expanding
  // one row collapses all others.
  // -------------------------------------------------------------------------

  const handleExpandedChange: OnChangeFn<ExpandedState> = useCallback(
    (updaterOrValue: Updater<ExpandedState>) => {
      if (allowMultipleExpanded) {
        setExpanded(updaterOrValue);
        return;
      }

      // Resolve the next expanded state
      const nextExpanded =
        typeof updaterOrValue === 'function'
          ? (updaterOrValue as (prev: ExpandedState) => ExpandedState)(expanded)
          : updaterOrValue;

      // If `true` (expand all) — pass through; TanStack uses `true` for "all expanded"
      if (nextExpanded === true) {
        setExpanded(nextExpanded);
        return;
      }

      // Find newly expanded rows (present in next but not in previous)
      const prevRecord = expanded === true ? {} : (expanded as Record<string, boolean>);
      const nextRecord = nextExpanded as Record<string, boolean>;
      const newlyExpanded = Object.keys(nextRecord).filter(
        (key) => nextRecord[key] && !prevRecord[key],
      );

      // Keep only the most recently expanded row
      if (newlyExpanded.length > 0) {
        const lastExpanded = newlyExpanded[newlyExpanded.length - 1];
        setExpanded({ [lastExpanded]: true });
      } else {
        // All rows collapsed — pass through
        setExpanded(nextExpanded);
      }
    },
    [allowMultipleExpanded, expanded, setExpanded],
  );

  // -------------------------------------------------------------------------
  // Build TanStack Table options
  // -------------------------------------------------------------------------

  const table = useReactTable<TData>({
    data,
    columns,
    getRowId,
    getCoreRowModel: getCoreRowModel(),

    // --- Sorting ---
    enableSorting,
    enableMultiSort,
    manualSorting,
    state: {
      sorting,
      columnFilters,
      globalFilter: globalFilterState,
      columnVisibility,
      columnOrder,
      columnPinning,
      pagination: paginationState,
      rowSelection,
      expanded,
    },
    onSortingChange: setSorting,
    ...(!manualSorting && enableSorting
      ? { getSortedRowModel: getSortedRowModel() }
      : {}),

    // --- Filtering ---
    enableColumnFilters: enableFiltering || enableColumnFilters,
    enableGlobalFilter: enableFiltering || enableGlobalFilter,
    manualFiltering,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: handleGlobalFilterChange,
    ...(globalFilterFn ? { globalFilterFn } : {}),
    ...(!manualFiltering && (enableFiltering || enableColumnFilters || enableGlobalFilter)
      ? { getFilteredRowModel: getFilteredRowModel() }
      : {}),

    // --- Pagination ---
    manualPagination,
    onPaginationChange: setPaginationState,
    ...(rowCount !== undefined ? { rowCount } : {}),
    ...(pageCount !== undefined ? { pageCount } : {}),
    ...(!manualPagination && enablePagination
      ? { getPaginationRowModel: getPaginationRowModel() }
      : {}),

    // --- Row Selection ---
    enableRowSelection: enableRowSelection
      ? (enableRowSelectionFn ?? true)
      : false,
    enableMultiRowSelection,
    enableSubRowSelection: enableMultiRowSelection,
    onRowSelectionChange: setRowSelection,

    // --- Column Features ---
    enableColumnResizing,
    enablePinning: enableColumnPinning,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnOrderChange: setColumnOrder,
    onColumnPinningChange: setColumnPinning,

    // --- Expanding ---
    enableExpanding,
    onExpandedChange: handleExpandedChange,
    getSubRows,
    // When renderExpandedRow is provided, every row is expandable (template mode).
    // Without this, TanStack only allows expansion for rows with sub-rows.
    ...(hasRenderExpandedRow ? { getRowCanExpand: () => true } : {}),
    ...(enableExpanding
      ? { getExpandedRowModel: getExpandedRowModel() }
      : {}),
  });

  // -------------------------------------------------------------------------
  // Derived convenience state
  // -------------------------------------------------------------------------

  const isFiltered = useMemo(() => {
    const hasColumnFilters = columnFilters.length > 0;
    const hasGlobalFilter = globalFilterState !== '' && globalFilterState !== undefined;
    return hasColumnFilters || hasGlobalFilter;
  }, [columnFilters, globalFilterState]);

  const isEmpty = useMemo(
    () => table.getRowModel().rows.length === 0,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [table.getRowModel().rows.length],
  );

  const selectedRowCount = useMemo(
    () => table.getSelectedRowModel().rows.length,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [table.getSelectedRowModel().rows.length],
  );

  const resetFilters = useCallback(() => {
    setColumnFilters([]);
    handleGlobalFilterChange('');
  }, [setColumnFilters, handleGlobalFilterChange]);

  const resetSorting = useCallback(() => {
    setSorting([]);
  }, [setSorting]);

  return {
    table,
    globalFilterValue: globalFilterState,
    setGlobalFilter: handleGlobalFilterChange,
    isFiltered,
    isEmpty,
    selectedRowCount,
    resetFilters,
    resetSorting,
  };
}
