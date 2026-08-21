'use client';

import * as React from 'react';
import { useVirtualizer, type VirtualItem } from '@tanstack/react-virtual';
import type { Table } from '@tanstack/react-table';

// ---------------------------------------------------------------------------
// useVirtualRows — wraps @tanstack/react-virtual for table row virtualization
// ---------------------------------------------------------------------------

export interface UseVirtualRowsOptions<TData> {
  table: Table<TData>;
  /** Height of each row in pixels. Default: 40. */
  rowHeight?: number;
  /** Number of rows to render above/below the visible area. Default: 10. */
  overscan?: number;
  /** Whether virtualization is enabled. When false, returns null. */
  enabled?: boolean;
}

export interface UseVirtualRowsReturn {
  /** Ref to attach to the scrollable container. */
  parentRef: React.RefObject<HTMLDivElement | null>;
  /** Total height of all virtualized rows (px). */
  totalSize: number;
  /** The virtual items to render. */
  virtualItems: VirtualItem[];
}

/**
 * Hook that virtualizes table rows for large datasets (1000+ rows).
 *
 * Returns `null` when `enabled` is false so the table renders all rows normally.
 *
 * @example
 * ```tsx
 * const virtual = useVirtualRows({
 *   table,
 *   rowHeight: 40,
 *   overscan: 10,
 *   enabled: data.length > 500,
 * });
 * ```
 */
export function useVirtualRows<TData>(
  options: UseVirtualRowsOptions<TData>,
): UseVirtualRowsReturn | null {
  const { table, rowHeight = 40, overscan = 10, enabled = true } = options;

  const parentRef = React.useRef<HTMLDivElement>(null);

  const rows = table.getRowModel().rows;

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => rowHeight,
    overscan,
  });

  // Return null when virtualization is disabled — caller uses standard rendering
  if (!enabled) return null;

  return {
    parentRef,
    totalSize: virtualizer.getTotalSize(),
    virtualItems: virtualizer.getVirtualItems(),
  };
}
