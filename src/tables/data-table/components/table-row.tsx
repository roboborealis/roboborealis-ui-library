'use client';

import * as React from 'react';
import { flexRender, type Row } from '@tanstack/react-table';

import { cn } from '@/lib/utils';

import { getAlignClass, getDensityCellClass } from './cell-classes';
import { InlineEditCell, type InlineEditCellProps } from './inline-edit-cell';
import type { UseInlineEditReturn } from '../hooks/use-inline-edit';
import type { UseKeyboardNavReturn } from '../hooks/use-keyboard-nav';
import type { RoboColumnMeta } from '../types';

// ---------------------------------------------------------------------------
// TableRow
// ---------------------------------------------------------------------------

export interface TableRowProps<TData> {
  row: Row<TData>;
  /** Row index in the visible rows (1-based, 0 is header) */
  rowIndex: number;
  /** Custom expansion template for expanded rows */
  renderExpandedRow?: (row: Row<TData>) => React.ReactNode;
  /** Number of visible columns (used for expanded row colSpan) */
  visibleColumnCount: number;
  /** Inline editing callback */
  onCellEdit?: (rowId: string, columnId: string, value: unknown) => void;
  /** Inline edit state from useInlineEdit hook */
  inlineEdit?: UseInlineEditReturn;
  /** Keyboard navigation state from useKeyboardNav hook */
  keyboardNav?: UseKeyboardNavReturn;
  /** CSS animation-delay value for stagger entrance. Adds animate-in fade-in class. */
  animationDelay?: string;
  /** Row/cell padding density. Default: 'comfortable' */
  density?: 'compact' | 'comfortable' | 'spacious';
  /** Tint this row for zebra striping. Computed by the caller from row parity. */
  isStriped?: boolean;
}

export function TableRow<TData>({
  row,
  rowIndex,
  renderExpandedRow,
  visibleColumnCount,
  onCellEdit,
  inlineEdit,
  keyboardNav,
  animationDelay,
  density,
  isStriped,
}: TableRowProps<TData>) {
  const isSelected = row.getIsSelected();
  const isExpanded = row.getIsExpanded();

  return (
    <>
      <tr
        aria-selected={isSelected || undefined}
        data-state={isSelected ? 'selected' : undefined}
        style={animationDelay ? { animationDelay } : undefined}
        className={cn(
          'border-b border-[var(--border)] hover:bg-[var(--accent)] transition-colors',
          isStriped && !isSelected && 'bg-[var(--border)]/70',
          isSelected && 'bg-[var(--primary)]/10',
          animationDelay && 'animate-in fade-in duration-[var(--duration-normal)]',
        )}
      >
        {row.getVisibleCells().map((cell, colIndex) => {
          const meta = cell.column.columnDef.meta as RoboColumnMeta | undefined;
          const align = meta?.align;
          const pinnedSide = cell.column.getIsPinned();
          const isEditable = meta?.editable === true && !!onCellEdit;
          const isCellEditing = isEditable && inlineEdit
            ? inlineEdit.isEditing(row.id, cell.column.id)
            : false;

          const cellContent = flexRender(cell.column.columnDef.cell, cell.getContext());

          return (
            <td
              key={cell.id}
              tabIndex={keyboardNav ? keyboardNav.getCellTabIndex(rowIndex, colIndex) : undefined}
              onFocus={() => keyboardNav?.setFocusedCell(rowIndex, colIndex)}
              style={{
                width: cell.column.getSize(),
                left: pinnedSide === 'left' ? `${cell.column.getStart('left')}px` : undefined,
                right: pinnedSide === 'right' ? `${cell.column.getAfter('right')}px` : undefined,
              }}
              className={cn(
                getDensityCellClass(density),
                getAlignClass(align),
                pinnedSide && 'sticky z-10 bg-[var(--background)]',
                pinnedSide === 'left' && 'border-r-2 border-r-[var(--primary)]/30',
                pinnedSide === 'right' && 'border-l-2 border-l-[var(--primary)]/30',
              )}
            >
              {isEditable && inlineEdit ? (
                <InlineEditCell
                  isEditing={isCellEditing}
                  value={cell.getValue()}
                  onStartEdit={() => inlineEdit.startEditing(row.id, cell.column.id)}
                  onCommit={(value) => inlineEdit.commitEdit(value)}
                  onCancel={() => inlineEdit.cancelEditing()}
                  editComponent={meta?.editComponent as InlineEditCellProps['editComponent']}
                >
                  {cellContent}
                </InlineEditCell>
              ) : (
                cellContent
              )}
            </td>
          );
        })}
      </tr>

      {/* Expanded row content */}
      {isExpanded && renderExpandedRow && (
        <tr className="border-b border-[var(--border)] bg-[var(--muted)]/50">
          <td colSpan={visibleColumnCount} className={getDensityCellClass(density)}>
            {renderExpandedRow(row)}
          </td>
        </tr>
      )}
    </>
  );
}
