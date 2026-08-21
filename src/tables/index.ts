// @roboborealis/components/tables — DataTable with sort, filter, pagination, selection
// Powered by TanStack Table v8

export { RoboDataTable } from './data-table/robo-data-table';

// Static "dumb" table — zero dependencies, no TanStack. For read-only data,
// print, and server-rendered reports. RoboEmailTable renders inline-styled
// HTML that survives email clients.
export {
  RoboTable,
  RoboTableHeader,
  RoboTableBody,
  RoboTableFooter,
  RoboTableRow,
  RoboTableHead,
  RoboTableCell,
  RoboTableCaption,
} from './table/robo-table';
export type { RoboTableProps, TableVariant } from './table/robo-table';
export { RoboEmailTable } from './table/robo-email-table';
export type { RoboEmailTableProps, RoboEmailTableColumn } from './table/robo-email-table';

export type {
  RoboDataTableProps,
  RoboColumnMeta,
  RoboFilterType,
  CellEditProps,
  BulkActionDef,
  SavedView,
  SavedViewState,
  // Re-exported TanStack types consumers need
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
  ColumnDef,
} from './data-table/types';

// Cell renderer factories
export {
  createStatusCell,
  createAvatarCell,
  createDateCell,
  createNumericCell,
  createActionsCell,
  createProgressCell,
  createLinkCell,
  createBooleanCell,
  createCourseCell,
} from './data-table/cells';

export type {
  StatusCellConfig,
  AvatarCellConfig,
  DateCellConfig,
  NumericCellConfig,
  ActionsCellConfig,
  ActionItem,
  ProgressCellConfig,
  LinkCellConfig,
  BooleanCellConfig,
  CourseCellConfig,
} from './data-table/cells';

// Hooks
export { useTableExport } from './data-table/hooks/use-table-export';
export type { UseTableExportOptions, UseTableExportReturn } from './data-table/hooks/use-table-export';

export { useVirtualRows } from './data-table/hooks/use-virtual-rows';
export type { UseVirtualRowsOptions, UseVirtualRowsReturn } from './data-table/hooks/use-virtual-rows';

export { useInlineEdit } from './data-table/hooks/use-inline-edit';
export type { EditingCell, UseInlineEditReturn } from './data-table/hooks/use-inline-edit';

export { useKeyboardNav } from './data-table/hooks/use-keyboard-nav';
export type { UseKeyboardNavOptions, UseKeyboardNavReturn } from './data-table/hooks/use-keyboard-nav';

export { useSavedViews } from './data-table/hooks/use-saved-views';
export type { UseSavedViewsOptions, UseSavedViewsReturn } from './data-table/hooks/use-saved-views';

// Sub-components (for advanced composition)
export { InlineEditCell } from './data-table/components/inline-edit-cell';
export type { InlineEditCellProps } from './data-table/components/inline-edit-cell';

export { createSelectionColumn, SelectionCheckbox } from './data-table/components/table-selection-column';
export type { SelectionCheckboxProps } from './data-table/components/table-selection-column';

export { createExpandColumn, ExpandToggle } from './data-table/components/table-expand-column';
export type { ExpandToggleProps } from './data-table/components/table-expand-column';

// Debounced global-filter search input, styled to match RoboDataTable's own
// built-in one — use with `hideGlobalSearchInput` + `toolbarLeft`/`toolbarRight`
// to relocate or restyle the search box (e.g. RoboTablePanel puts row-count in
// toolbarLeft and this in toolbarRight instead of the default left placement).
export { GlobalSearchInput } from './data-table/components/table-toolbar';
export type { GlobalSearchInputProps } from './data-table/components/table-toolbar';
