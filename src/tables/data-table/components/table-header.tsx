'use client';

import * as React from 'react';
import {
  flexRender,
  type Header,
  type Table,
} from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ArrowUpDown, GripVertical, Pin } from 'lucide-react';

import { cn } from '@/lib/utils';
import { getAlignClass, getDensityCellClass } from './cell-classes';
import { ColumnFilter } from './column-filter';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function ariaSortValue(
  sorted: false | 'asc' | 'desc',
): 'ascending' | 'descending' | 'none' {
  if (sorted === 'asc') return 'ascending';
  if (sorted === 'desc') return 'descending';
  return 'none';
}

/** Cycle through pin states: unpinned → left → right → unpinned */
function nextPinState(current: false | 'left' | 'right'): false | 'left' | 'right' {
  if (current === false) return 'left';
  if (current === 'left') return 'right';
  return false;
}

// ---------------------------------------------------------------------------
// SortIcon
// ---------------------------------------------------------------------------

function SortIcon({ sorted }: { sorted: false | 'asc' | 'desc' }) {
  if (sorted === 'asc') {
    return <ArrowUp className="ml-1 inline h-3 w-3" aria-hidden="true" />;
  }
  if (sorted === 'desc') {
    return <ArrowDown className="ml-1 inline h-3 w-3" aria-hidden="true" />;
  }
  return <ArrowUpDown className="ml-1 inline h-3 w-3 opacity-40" aria-hidden="true" />;
}

// ---------------------------------------------------------------------------
// HeaderCell — individual <th> with sort + drag-reorder + resize + pin
// ---------------------------------------------------------------------------

interface ColumnMeta {
  align?: 'left' | 'center' | 'right';
  /** Set to false to hide the pin toggle button even when enableColumnPinning is true */
  pinnable?: boolean;
}

interface HeaderCellProps<TData> {
  header: Header<TData, unknown>;
  enableSorting: boolean;
  enableColumnFilters: boolean;
  enableColumnReordering: boolean;
  enableColumnResizing: boolean;
  enableColumnPinning: boolean;
  stickyHeader: boolean;
  density?: 'compact' | 'comfortable' | 'spacious';
  onDragStart: (e: React.DragEvent<HTMLTableCellElement>, headerId: string) => void;
  onDragOver: (e: React.DragEvent<HTMLTableCellElement>) => void;
  onDrop: (e: React.DragEvent<HTMLTableCellElement>, headerId: string) => void;
}

function HeaderCell<TData>({
  header,
  enableSorting,
  enableColumnFilters,
  enableColumnReordering,
  enableColumnResizing,
  enableColumnPinning,
  stickyHeader,
  density,
  onDragStart,
  onDragOver,
  onDrop,
}: HeaderCellProps<TData>) {
  const canSort = enableSorting && header.column.getCanSort();
  const sorted = header.column.getIsSorted();
  const meta = header.column.columnDef.meta as ColumnMeta | undefined;
  const align = meta?.align;

  // Column pinning
  const pinnedSide = header.column.getIsPinned();
  const canPin = enableColumnPinning && meta?.pinnable !== false;

  // Resolve sticky offset for pinned columns
  const pinnedLeftOffset = pinnedSide === 'left' ? header.column.getStart('left') : undefined;
  const pinnedRightOffset = pinnedSide === 'right' ? header.column.getAfter('right') : undefined;

  // Column sizing — always apply getSize() (remove Phase 1 shortcut)
  const colDef = header.column.columnDef;
  const colSize = header.getSize();
  const colMinSize = colDef.minSize;
  const colMaxSize = colDef.maxSize;

  const handleSortClick = (e: React.MouseEvent) => {
    if (!canSort) return;
    // Shift+click enables multi-sort via TanStack's built-in support
    header.column.toggleSorting(undefined, e.shiftKey);
  };

  const handlePinToggle = () => {
    const current = header.column.getIsPinned();
    header.column.pin(nextPinState(current));
  };

  const isResizing = enableColumnResizing && header.column.getIsResizing();

  return (
    <th
      key={header.id}
      scope="col"
      colSpan={header.colSpan}
      aria-sort={canSort ? ariaSortValue(sorted) : undefined}
      draggable={enableColumnReordering}
      onDragStart={
        enableColumnReordering
          ? (e) => onDragStart(e, header.id)
          : undefined
      }
      onDragOver={enableColumnReordering ? onDragOver : undefined}
      onDrop={
        enableColumnReordering
          ? (e) => onDrop(e, header.id)
          : undefined
      }
      style={{
        width: colSize,
        minWidth: colMinSize,
        maxWidth: colMaxSize,
        // Sticky positioning for pinned columns
        left: pinnedLeftOffset !== undefined ? `${pinnedLeftOffset}px` : undefined,
        right: pinnedRightOffset !== undefined ? `${pinnedRightOffset}px` : undefined,
      }}
      className={cn(
        getDensityCellClass(density),
        'font-medium bg-[var(--muted)] text-[var(--muted-foreground)] select-none',
        // Sticky header (z-10 baseline)
        stickyHeader && 'sticky top-0 z-10',
        // Pinned columns need sticky positioning; pinned headers sit above the z-10 sticky row
        pinnedSide && 'sticky z-20',
        // Pinned visual border indicators
        pinnedSide === 'left' && 'border-r-2 border-r-[var(--primary)]/30',
        pinnedSide === 'right' && 'border-l-2 border-l-[var(--primary)]/30',
        // Relative positioning required for the absolute resize handle
        enableColumnResizing && 'relative',
        // Visual feedback while actively resizing
        isResizing && 'opacity-80',
        getAlignClass(align),
      )}
    >
      {header.isPlaceholder ? null : (
        <div className="flex items-center gap-1 group">
          {enableColumnReordering && (
            <GripVertical
              className="h-3 w-3 cursor-grab opacity-40 flex-shrink-0"
              aria-hidden="true"
            />
          )}
          {canSort ? (
            <button
              type="button"
              onClick={handleSortClick}
              className="flex items-center gap-0.5 hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] rounded"
            >
              {flexRender(header.column.columnDef.header, header.getContext())}
              <SortIcon sorted={sorted} />
            </button>
          ) : (
            <span>
              {flexRender(header.column.columnDef.header, header.getContext())}
            </span>
          )}

          {/* Column filter — per-column filter popover */}
          {enableColumnFilters && header.column.getCanFilter() && (
            <ColumnFilter column={header.column} />
          )}

          {/* Pin toggle button — only shown when enableColumnPinning and column is pinnable */}
          {canPin && (
            <button
              type="button"
              onClick={handlePinToggle}
              title={
                pinnedSide === false
                  ? 'Pin column left'
                  : pinnedSide === 'left'
                    ? 'Pin column right'
                    : 'Unpin column'
              }
              aria-label={
                pinnedSide === false
                  ? `Pin ${String(header.column.columnDef.header)} column left`
                  : pinnedSide === 'left'
                    ? `Pin ${String(header.column.columnDef.header)} column right`
                    : `Unpin ${String(header.column.columnDef.header)} column`
              }
              aria-pressed={pinnedSide !== false}
              className={cn(
                'ml-auto flex-shrink-0 rounded p-0.5',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]',
                // Always visible when pinned; hover-only when unpinned
                pinnedSide !== false
                  ? 'opacity-100 text-[var(--primary)]'
                  : 'opacity-0 group-hover:opacity-60 hover:!opacity-100 hover:text-[var(--foreground)]',
                'transition-opacity',
              )}
            >
              <Pin
                className={cn(
                  'h-3 w-3',
                  pinnedSide === 'right' && 'scale-x-[-1]',
                )}
                aria-hidden="true"
              />
            </button>
          )}
        </div>
      )}

      {/* Resize handle — absolute-positioned on the right edge of the <th> */}
      {enableColumnResizing && header.column.getCanResize() && (
        <div
          onMouseDown={header.getResizeHandler()}
          onTouchStart={header.getResizeHandler()}
          onDoubleClick={() => header.column.resetSize()}
          className={cn(
            'absolute right-0 top-0 h-full w-1 cursor-col-resize select-none touch-none',
            'bg-transparent hover:bg-[var(--primary)]/50',
            isResizing && 'bg-[var(--primary)]',
          )}
          role="separator"
          aria-orientation="vertical"
          aria-label={`Resize ${String(header.column.columnDef.header)} column`}
        />
      )}
    </th>
  );
}

// ---------------------------------------------------------------------------
// TableHeader
// ---------------------------------------------------------------------------

export interface TableHeaderProps<TData> {
  table: Table<TData>;
  enableSorting?: boolean;
  /** Enable per-column filter popovers */
  enableColumnFilters?: boolean;
  enableColumnReordering?: boolean;
  /** Enable drag-to-resize column width handles */
  enableColumnResizing?: boolean;
  /** Enable sticky pinning of columns to the left or right edge */
  enableColumnPinning?: boolean;
  /** Make header cells sticky at the top of the scroll container */
  stickyHeader?: boolean;
  /** Header cell padding density. Default: 'comfortable' */
  density?: 'compact' | 'comfortable' | 'spacious';
}

export function TableHeader<TData>({
  table,
  enableSorting = false,
  enableColumnFilters = false,
  enableColumnReordering = false,
  enableColumnResizing = false,
  enableColumnPinning = false,
  stickyHeader = false,
  density,
}: TableHeaderProps<TData>) {
  const dragSourceRef = React.useRef<string | null>(null);

  const handleDragStart = React.useCallback(
    (e: React.DragEvent<HTMLTableCellElement>, headerId: string) => {
      dragSourceRef.current = headerId;
      e.dataTransfer.effectAllowed = 'move';
    },
    [],
  );

  const handleDragOver = React.useCallback(
    (e: React.DragEvent<HTMLTableCellElement>) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
    },
    [],
  );

  const handleDrop = React.useCallback(
    (e: React.DragEvent<HTMLTableCellElement>, targetId: string) => {
      e.preventDefault();
      const sourceId = dragSourceRef.current;
      if (sourceId === null || sourceId === targetId) {
        dragSourceRef.current = null;
        return;
      }

      const currentOrder = table.getState().columnOrder;
      const allColumns = table.getAllLeafColumns().map((col) => col.id);
      const order = currentOrder.length > 0 ? [...currentOrder] : [...allColumns];

      const fromIndex = order.indexOf(sourceId);
      const toIndex = order.indexOf(targetId);

      if (fromIndex === -1 || toIndex === -1) {
        dragSourceRef.current = null;
        return;
      }

      order.splice(fromIndex, 1);
      order.splice(toIndex, 0, sourceId);
      table.setColumnOrder(order);

      dragSourceRef.current = null;
    },
    [table],
  );

  return (
    <thead>
      {table.getHeaderGroups().map((headerGroup) => (
        <tr key={headerGroup.id}>
          {headerGroup.headers.map((header) => (
            <HeaderCell
              key={header.id}
              header={header}
              enableSorting={enableSorting}
              enableColumnFilters={enableColumnFilters}
              enableColumnReordering={enableColumnReordering}
              enableColumnResizing={enableColumnResizing}
              enableColumnPinning={enableColumnPinning}
              stickyHeader={stickyHeader}
              density={density}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            />
          ))}
        </tr>
      ))}
    </thead>
  );
}
