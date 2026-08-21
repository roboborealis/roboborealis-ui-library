'use client';

import * as React from 'react';
import type { CellContext } from '@tanstack/react-table';

import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// ProgressCell — inline progress bar with percentage label
// ---------------------------------------------------------------------------

export interface ProgressCellConfig {
  /** Thresholds for color changes. Default: { warning: 50, success: 80 }. */
  thresholds?: { warning?: number; success?: number };
  /** Show the numeric percentage label. Default: true. */
  showLabel?: boolean;
  /** Height of the bar in px. Default: 6. */
  barHeight?: number;
}

/**
 * Creates a TanStack cell renderer showing an inline progress bar.
 *
 * Expects a numeric value 0–100.
 *
 * @example
 * ```tsx
 * columnHelper.accessor('completion', {
 *   header: 'Progress',
 *   cell: createProgressCell({ thresholds: { warning: 30, success: 70 } }),
 * })
 * ```
 */
export function createProgressCell<TData>(
  config: ProgressCellConfig = {},
): (info: CellContext<TData, unknown>) => React.ReactNode {
  const {
    thresholds = { warning: 50, success: 80 },
    showLabel = true,
    barHeight = 6,
  } = config;

  return function ProgressCell(info: CellContext<TData, unknown>) {
    const raw = info.getValue();
    if (raw === null || raw === undefined) return null;

    const value = Math.min(100, Math.max(0, Number(raw)));
    if (isNaN(value)) return null;

    const warningAt = thresholds.warning ?? 50;
    const successAt = thresholds.success ?? 80;

    let barColor: string;
    if (value >= successAt) {
      barColor = 'bg-[var(--success)]';
    } else if (value >= warningAt) {
      barColor = 'bg-[var(--warning)]';
    } else {
      barColor = 'bg-[var(--destructive)]';
    }

    return (
      <span className="inline-flex w-full items-center gap-2">
        <span
          className="flex-1 overflow-hidden rounded-full bg-[var(--muted)]"
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${Math.round(value)}% complete`}
          style={{ height: barHeight }}
        >
          <span
            className={cn('block h-full rounded-full transition-all duration-[var(--duration-slow)]', barColor)}
            style={{ width: `${value}%` }}
          />
        </span>
        {showLabel && (
          <span className="w-10 text-right text-xs tabular-nums text-[var(--secondary-text)]">
            {Math.round(value)}%
          </span>
        )}
      </span>
    );
  };
}
