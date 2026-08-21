// ---------------------------------------------------------------------------
// RoboDataTable defaults
// ---------------------------------------------------------------------------

/** Default page size for pagination */
export const DEFAULT_PAGE_SIZE = 25;

/** Available page size options in the pagination dropdown */
export const DEFAULT_PAGE_SIZE_OPTIONS = [10, 25, 50, 100] as const;

/** Number of skeleton rows to show during initial loading */
export const SKELETON_ROW_COUNT = 5;

/** Default storage key prefix for column state persistence */
export const DEFAULT_STORAGE_KEY = 'robo-datatable';

/** Debounce delay (ms) for global filter input */
export const GLOBAL_FILTER_DEBOUNCE_MS = 300;
