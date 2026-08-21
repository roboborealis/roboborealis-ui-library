'use client';

import * as React from 'react';

// ---------------------------------------------------------------------------
// useKeyboardNav — ARIA grid keyboard navigation pattern
// ---------------------------------------------------------------------------

export interface UseKeyboardNavOptions {
  /** The ref to the table container element. */
  containerRef: React.RefObject<HTMLElement | null>;
  /** Whether keyboard navigation is enabled. */
  enabled?: boolean;
  /** Total number of rows (including header). */
  rowCount: number;
  /** Total number of columns. */
  columnCount: number;
}

export interface UseKeyboardNavReturn {
  /** Currently focused cell [rowIndex, colIndex] or null. */
  focusedCell: [number, number] | null;
  /** Event handler to attach to the table container. */
  onKeyDown: (e: React.KeyboardEvent) => void;
  /** Get tabIndex for a cell. 0 for focused, -1 otherwise. */
  getCellTabIndex: (rowIndex: number, colIndex: number) => 0 | -1;
  /** Set focus to a specific cell. */
  setFocusedCell: (rowIndex: number, colIndex: number) => void;
}

/**
 * Hook implementing ARIA grid arrow-key navigation (roving tabindex).
 *
 * - Arrow keys move between cells
 * - Home/End move to first/last column in current row
 * - Ctrl+Home/End move to first/last cell in the grid
 * - Tab moves focus out of the grid
 *
 * @example
 * ```tsx
 * const nav = useKeyboardNav({
 *   containerRef: tableRef,
 *   enabled: true,
 *   rowCount: rows.length + 1,
 *   columnCount: columns.length,
 * });
 * ```
 */
export function useKeyboardNav(
  options: UseKeyboardNavOptions,
): UseKeyboardNavReturn {
  const { enabled = true, rowCount, columnCount } = options;

  const [focusedCell, setFocusedCellState] = React.useState<[number, number] | null>(null);

  const setFocusedCell = React.useCallback(
    (row: number, col: number) => {
      const clampedRow = Math.max(0, Math.min(row, rowCount - 1));
      const clampedCol = Math.max(0, Math.min(col, columnCount - 1));
      setFocusedCellState([clampedRow, clampedCol]);
    },
    [rowCount, columnCount],
  );

  const onKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (!enabled || !focusedCell) return;

      const [row, col] = focusedCell;
      let nextRow = row;
      let nextCol = col;
      let handled = false;

      switch (e.key) {
        case 'ArrowUp':
          nextRow = Math.max(0, row - 1);
          handled = true;
          break;
        case 'ArrowDown':
          nextRow = Math.min(rowCount - 1, row + 1);
          handled = true;
          break;
        case 'ArrowLeft':
          nextCol = Math.max(0, col - 1);
          handled = true;
          break;
        case 'ArrowRight':
          nextCol = Math.min(columnCount - 1, col + 1);
          handled = true;
          break;
        case 'Home':
          if (e.ctrlKey) {
            nextRow = 0;
            nextCol = 0;
          } else {
            nextCol = 0;
          }
          handled = true;
          break;
        case 'End':
          if (e.ctrlKey) {
            nextRow = rowCount - 1;
            nextCol = columnCount - 1;
          } else {
            nextCol = columnCount - 1;
          }
          handled = true;
          break;
        case 'PageUp':
          nextRow = Math.max(0, row - 10);
          handled = true;
          break;
        case 'PageDown':
          nextRow = Math.min(rowCount - 1, row + 10);
          handled = true;
          break;
      }

      if (handled) {
        e.preventDefault();
        setFocusedCell(nextRow, nextCol);
      }
    },
    [enabled, focusedCell, rowCount, columnCount, setFocusedCell],
  );

  const getCellTabIndex = React.useCallback(
    (rowIndex: number, colIndex: number): 0 | -1 => {
      if (!enabled) return -1;
      if (!focusedCell) {
        // Default: first cell is tabbable
        return rowIndex === 0 && colIndex === 0 ? 0 : -1;
      }
      return focusedCell[0] === rowIndex && focusedCell[1] === colIndex ? 0 : -1;
    },
    [enabled, focusedCell],
  );

  return { focusedCell, onKeyDown, getCellTabIndex, setFocusedCell };
}
