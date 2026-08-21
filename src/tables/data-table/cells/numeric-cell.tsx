'use client';

import * as React from 'react';
import type { CellContext } from '@tanstack/react-table';

import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// NumericCell — locale-aware number formatting with optional unit suffix
// ---------------------------------------------------------------------------

export interface NumericCellConfig {
  /** Intl.NumberFormat options. Default: no special formatting. */
  formatOptions?: Intl.NumberFormatOptions;
  /** Locale string. Default: 'en-US'. */
  locale?: string;
  /** Unit suffix displayed after the number (e.g., 'km', 'km/s', '%'). */
  unit?: string;
  /** Color the number red when negative. Default: false. */
  colorNegative?: boolean;
}

/**
 * Creates a TanStack cell renderer for numeric values with locale-aware formatting.
 *
 * @example
 * ```tsx
 * columnHelper.accessor('distance', {
 *   header: 'Distance',
 *   cell: createNumericCell({ unit: 'km', formatOptions: { maximumFractionDigits: 1 } }),
 *   meta: { align: 'right' },
 * })
 * ```
 */
export function createNumericCell<TData>(
  config: NumericCellConfig = {},
): (info: CellContext<TData, unknown>) => React.ReactNode {
  const { formatOptions, locale = 'en-US', unit, colorNegative = false } = config;

  const formatter = new Intl.NumberFormat(locale, formatOptions);

  return function NumericCell(info: CellContext<TData, unknown>) {
    const raw = info.getValue();
    if (raw === null || raw === undefined) return null;

    const num = typeof raw === 'number' ? raw : Number(raw);
    if (isNaN(num)) return <span className="text-[var(--muted-foreground)]">—</span>;

    const formatted = formatter.format(num);
    const isNeg = colorNegative && num < 0;

    return (
      <span
        className={cn(
          'tabular-nums',
          isNeg && 'text-[var(--destructive)]',
        )}
      >
        {formatted}
        {unit && <span className="ml-0.5 text-[var(--muted-foreground)]">{unit}</span>}
      </span>
    );
  };
}
