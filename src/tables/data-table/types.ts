import type * as React from 'react';
import type {
  ColumnDef as TanStackColumnDef,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  ColumnOrderState,
  ColumnPinningState,
  PaginationState,
  RowSelectionState,
  ExpandedState,
  Row,
  Table,
  FilterFn,
  OnChangeFn,
} from '@tanstack/react-table';
import type { StorageAdapter } from '@/core/storage-adapter';

// ---------------------------------------------------------------------------
// Re-export TanStack types consumers will need
// ---------------------------------------------------------------------------

export type {
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  ColumnOrderState,
  ColumnPinningState,
  PaginationState,
  RowSelectionState,
  ExpandedState,
  Row,
  Table,
  OnChangeFn,
};

// Re-export TanStack ColumnDef renamed to avoid confusion
export type { TanStackColumnDef as ColumnDef };

// ---------------------------------------------------------------------------
// Column meta extension — Robo-specific metadata on TanStack columns
// ---------------------------------------------------------------------------

export type RoboFilterType = 'text' | 'select' | 'range' | 'date' | 'boolean';

export interface RoboColumnMeta<TData = unknown, TValue = unknown> {
  /** Cell content alignment */
  align?: 'left' | 'center' | 'right';
  /** Filter UI type for per-column filtering */
  filterType?: RoboFilterType;
  /** Options for 'select' filter type */
  filterOptions?: Array<{ label: string; value: string }>;
  /** Whether this cell is editable (for inline editing) */
  editable?: boolean;
  /** Custom edit component for inline editing */
  editComponent?: React.ComponentType<CellEditProps<TData, TValue>>;
  /** Whether this column can be pinned */
  pinnable?: boolean;
  /** Whether this column is included in exports */
  exportable?: boolean;
  /** Custom export header label (defaults to column header) */
  exportHeader?: string;
  /** Whether this column participates in global filter */
  enableGlobalFilter?: boolean;
}

// ---------------------------------------------------------------------------
// TanStack module augmentation for Robo column meta
// ---------------------------------------------------------------------------

declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface ColumnMeta<TData, TValue> extends RoboColumnMeta<TData, TValue> {}
}

// ---------------------------------------------------------------------------
// Cell editing types
// ---------------------------------------------------------------------------

export interface CellEditProps<TData = unknown, TValue = unknown> {
  value: TValue;
  row: Row<TData>;
  columnId: string;
  onCommit: (value: TValue) => void;
  onCancel: () => void;
}

// ---------------------------------------------------------------------------
// Bulk action types
// ---------------------------------------------------------------------------

export interface BulkActionDef<TData = unknown> {
  id: string;
  label: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'destructive';
  disabled?: boolean | ((selectedRows: TData[]) => boolean);
  onAction: (selectedRows: TData[]) => void;
}

// ---------------------------------------------------------------------------
// Saved view types
// ---------------------------------------------------------------------------

export interface SavedViewState {
  sorting: SortingState;
  columnFilters: ColumnFiltersState;
  columnVisibility: VisibilityState;
  columnOrder: ColumnOrderState;
  columnPinning: ColumnPinningState;
  globalFilter: string;
  pageSize: number;
}

export interface SavedView {
  id: string;
  name: string;
  isDefault: boolean;
  createdAt: string;
  state: SavedViewState;
}

// ---------------------------------------------------------------------------
// RoboDataTable props
// ---------------------------------------------------------------------------

export interface RoboDataTableProps<TData = Record<string, unknown>> {
  // --- Data ---
  /** Row data array */
  data: TData[];
  /** TanStack column definitions */
  columns: TanStackColumnDef<TData, unknown>[];
  /** Unique row ID extractor (defaults to row index) */
  getRowId?: (originalRow: TData, index: number) => string;

  // --- Loading / Empty / Error States ---
  /** Initial load: show skeleton rows */
  isLoading?: boolean;
  /** Refetch: show overlay while data refreshes (data stays visible) */
  isFetching?: boolean;
  /** Custom empty state content */
  emptyState?: React.ReactNode;
  /** Custom error state content */
  errorState?: React.ReactNode;

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
  enableSavedViews?: boolean;

  // --- Server-Side Mode ---
  manualSorting?: boolean;
  manualFiltering?: boolean;
  manualPagination?: boolean;
  /** Total row count for server-side pagination */
  rowCount?: number;
  /** Total page count for server-side pagination */
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
  /** Initial page size (default: 25) */
  pageSize?: number;
  /** Page size options in dropdown (default: [10, 25, 50, 100]) */
  pageSizeOptions?: number[];

  // --- Expanding / Nested Rows ---
  /** Get sub-rows for hierarchical data (TanStack native sub-rows) */
  getSubRows?: (originalRow: TData, index: number) => TData[] | undefined;
  /** Custom expansion template for different-column nested content */
  renderExpandedRow?: (row: Row<TData>) => React.ReactNode;
  /** Allow multiple rows expanded at once (default: false) */
  allowMultipleExpanded?: boolean;
  /**
   * Toggle a row's expansion when the row itself is clicked, not only the
   * chevron (default: false). Additive: the chevron stays the keyboard/AT
   * control. Clicks that land on an interactive descendant (link, button,
   * input, etc.) are ignored, so controls inside the row keep working.
   */
  expandOnRowClick?: boolean;

  // --- Row Selection ---
  /** Enable select-all checkbox in header */
  enableSelectAll?: boolean;
  /** Predicate to disable selection on specific rows */
  enableRowSelectionFn?: (row: Row<TData>) => boolean;

  // --- Bulk Actions ---
  bulkActions?: BulkActionDef<TData>[];

  // --- Inline Editing ---
  onCellEdit?: (rowId: string, columnId: string, value: unknown) => void;

  // --- Saved Views ---
  savedViews?: SavedView[];
  onViewSave?: (view: SavedView) => void;
  onViewDelete?: (viewId: string) => void;
  onViewLoad?: (view: SavedView) => void;

  // --- Persistence ---
  storageAdapter?: StorageAdapter;
  storageKey?: string;

  // --- Custom Global Filter ---
  globalFilterFn?: FilterFn<TData>;

  // --- Virtualization ---
  /** Enable virtual scrolling for large datasets (1000+ rows). Default: false. */
  enableVirtualization?: boolean;
  /** Row height in pixels for the virtualizer. Default: 40. */
  virtualRowHeight?: number;
  /** Number of rows to render beyond the visible area. Default: 10. */
  virtualOverscan?: number;

  // --- Styling ---
  className?: string;
  /** Density override (inherits from CSS data-density by default) */
  density?: 'compact' | 'comfortable' | 'spacious';
  /** Alternating row background colors */
  striped?: boolean;
  /** Cell borders */
  bordered?: boolean;
  /** Sticky table header */
  stickyHeader?: boolean;
  /** Fade rows in on initial render. Default: false */
  animateRows?: boolean;
  /** Stagger-fade rows in on mount with CSS animation-delay per row. Default: false */
  animateRowStagger?: boolean;

  // --- Slot Props ---
  /** Custom content in toolbar left area */
  toolbarLeft?: React.ReactNode;
  /** Custom content in toolbar right area */
  toolbarRight?: React.ReactNode;
  /**
   * Suppress the built-in global search box while `enableGlobalFilter` keeps
   * filtering active — for consumers rendering their own search input
   * elsewhere (e.g. `toolbarRight`) via the exported `GlobalSearchInput`
   * (`@/tables/data-table/components/table-toolbar`). Default: false.
   */
  hideGlobalSearchInput?: boolean;

  // --- Accessibility ---
  'aria-label'?: string;
  /** Visible table caption */
  caption?: string;

  // --- Ref ---
  /** Exposes TanStack Table instance for imperative operations */
  tableRef?: React.Ref<Table<TData> | null>;
}
