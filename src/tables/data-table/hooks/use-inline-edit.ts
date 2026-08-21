'use client';

import * as React from 'react';

// ---------------------------------------------------------------------------
// useInlineEdit — manages inline cell editing state
// ---------------------------------------------------------------------------

export interface EditingCell {
  rowId: string;
  columnId: string;
}

export interface UseInlineEditReturn {
  /** Currently editing cell, or null. */
  editingCell: EditingCell | null;
  /** Start editing a specific cell. */
  startEditing: (rowId: string, columnId: string) => void;
  /** Cancel the current edit. */
  cancelEditing: () => void;
  /** Commit the edit and call the onCellEdit callback. */
  commitEdit: (value: unknown) => void;
  /** Check if a specific cell is being edited. */
  isEditing: (rowId: string, columnId: string) => boolean;
}

/**
 * Hook that manages inline editing state for a data table.
 *
 * Tracks which cell is being edited and provides commit/cancel actions.
 * Only one cell can be edited at a time.
 *
 * @example
 * ```tsx
 * const { editingCell, startEditing, cancelEditing, commitEdit, isEditing } = useInlineEdit({
 *   onCellEdit: (rowId, columnId, value) => updateData(rowId, columnId, value),
 * });
 * ```
 */
export function useInlineEdit(options: {
  onCellEdit?: (rowId: string, columnId: string, value: unknown) => void;
}): UseInlineEditReturn {
  const { onCellEdit } = options;

  const [editingCell, setEditingCell] = React.useState<EditingCell | null>(null);

  const startEditing = React.useCallback((rowId: string, columnId: string) => {
    setEditingCell({ rowId, columnId });
  }, []);

  const cancelEditing = React.useCallback(() => {
    setEditingCell(null);
  }, []);

  const commitEdit = React.useCallback(
    (value: unknown) => {
      if (editingCell && onCellEdit) {
        onCellEdit(editingCell.rowId, editingCell.columnId, value);
      }
      setEditingCell(null);
    },
    [editingCell, onCellEdit],
  );

  const isEditing = React.useCallback(
    (rowId: string, columnId: string) => {
      return editingCell?.rowId === rowId && editingCell?.columnId === columnId;
    },
    [editingCell],
  );

  return { editingCell, startEditing, cancelEditing, commitEdit, isEditing };
}
