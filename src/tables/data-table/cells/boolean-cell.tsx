'use client';

import * as React from 'react';
import type { CellContext } from '@tanstack/react-table';
import { Check, X } from 'lucide-react';

import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// BooleanCell — check/x icon for boolean values
// ---------------------------------------------------------------------------

export interface BooleanCellConfig {
  /** Label for true state. Default: 'Yes'. */
  trueLabel?: string;
  /** Label for false state. Default: 'No'. */
  falseLabel?: string;
  /** Show the text label next to the icon. Default: false. */
  showLabel?: boolean;
}

/**
 * Creates a TanStack cell renderer that displays check/x icons for boolean values.
 *
 * @example
 * ```tsx
 * columnHelper.accessor('verified', {
 *   header: 'Verified',
 *   cell: createBooleanCell({ trueLabel: 'Verified', falseLabel: 'Unverified' }),
 *   meta: { align: 'center' },
 * })
 * ```
 */
export function createBooleanCell<TData>(
  config: BooleanCellConfig = {},
): (info: CellContext<TData, unknown>) => React.ReactNode {
  const { trueLabel = 'Yes', falseLabel = 'No', showLabel = false } = config;

  return function BooleanCell(info: CellContext<TData, unknown>) {
    const raw = info.getValue();
    if (raw === null || raw === undefined) {
      return <span className="text-[var(--muted-foreground)]">—</span>;
    }

    const value = Boolean(raw);
    const label = value ? trueLabel : falseLabel;

    return (
      <span
        role="img"
        className={cn(
          'inline-flex items-center gap-1',
          value ? 'text-[var(--success-text)]' : 'text-[var(--muted-foreground)]',
        )}
        aria-label={label}
      >
        {value ? (
          <Check className="h-4 w-4" aria-hidden="true" />
        ) : (
          <X className="h-4 w-4" aria-hidden="true" />
        )}
        {showLabel && <span className="text-sm">{label}</span>}
      </span>
    );
  };
}
