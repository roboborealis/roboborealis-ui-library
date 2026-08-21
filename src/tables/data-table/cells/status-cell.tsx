'use client';

import * as React from 'react';
import type { CellContext } from '@tanstack/react-table';

import { RoboChip } from '@/core/chip/robo-chip';

// ---------------------------------------------------------------------------
// StatusCell — renders a RoboChip status pill from a string value
// ---------------------------------------------------------------------------

type StatusChipVariant = 'default' | 'primary' | 'success' | 'warning' | 'destructive' | 'outline';

export interface StatusCellConfig {
  /** Map of value → chip variant. Unmapped values fall back to 'default'. */
  colorMap: Record<string, StatusChipVariant>;
  /** Optional map of value → display label. If omitted, the raw value is shown. */
  labelMap?: Record<string, string>;
}

/**
 * Creates a TanStack cell renderer that displays the cell value as a
 * RoboChip status pill.
 *
 * @example
 * ```tsx
 * columnHelper.accessor('status', {
 *   header: 'Status',
 *   cell: createStatusCell({
 *     colorMap: { active: 'success', inactive: 'default', alert: 'destructive' },
 *     labelMap: { active: 'Active', inactive: 'Inactive', alert: 'Alert' },
 *   }),
 * })
 * ```
 */
export function createStatusCell<TData>(
  config: StatusCellConfig,
): (info: CellContext<TData, unknown>) => React.ReactNode {
  return function StatusCell(info: CellContext<TData, unknown>) {
    const raw = info.getValue();
    if (raw === null || raw === undefined) return null;
    const value = String(raw);
    const variant = config.colorMap[value] ?? 'default';
    const label = config.labelMap?.[value] ?? value;

    return (
      <RoboChip variant={variant} size="sm">
        {label}
      </RoboChip>
    );
  };
}
