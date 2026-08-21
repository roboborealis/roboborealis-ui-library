'use client';

import * as React from 'react';
import type { CellContext } from '@tanstack/react-table';
import { ExternalLink } from 'lucide-react';

import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// LinkCell — clickable link with optional external icon
// ---------------------------------------------------------------------------

export interface LinkCellConfig {
  /** Accessor for the URL (key path on row data). If omitted, the cell value is used. */
  hrefAccessor?: string;
  /** Accessor for the display label. If omitted, the cell value is used. */
  labelAccessor?: string;
  /** Open in new tab. Default: true. */
  external?: boolean;
  /** Show external link icon. Default: true when external. */
  showIcon?: boolean;
}

function getNestedValue(obj: unknown, path: string): unknown {
  return path.split('.').reduce((acc: unknown, key) => {
    if (acc && typeof acc === 'object') return (acc as Record<string, unknown>)[key];
    return undefined;
  }, obj);
}

/**
 * Creates a TanStack cell renderer that renders a clickable link.
 *
 * @example
 * ```tsx
 * columnHelper.accessor('name', {
 *   header: 'Document',
 *   cell: createLinkCell({ hrefAccessor: 'documentUrl' }),
 * })
 * ```
 */
export function createLinkCell<TData>(
  config: LinkCellConfig = {},
): (info: CellContext<TData, unknown>) => React.ReactNode {
  const { hrefAccessor, labelAccessor, external = true, showIcon = external } = config;

  return function LinkCell(info: CellContext<TData, unknown>) {
    const row = info.row.original as Record<string, unknown>;
    const cellValue = String(info.getValue() ?? '');

    const href = hrefAccessor
      ? String(getNestedValue(row, hrefAccessor) ?? '')
      : cellValue;

    const label = labelAccessor
      ? String(getNestedValue(row, labelAccessor) ?? '')
      : cellValue;

    if (!href || !label) return null;

    return (
      <a
        href={href}
        {...(external && { target: '_blank', rel: 'noopener noreferrer' })}
        className={cn(
          'inline-flex items-center gap-1 text-[var(--primary)] underline-offset-4',
          'hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]',
          'rounded',
        )}
      >
        <span className="truncate">{label}</span>
        {showIcon && (
          <ExternalLink className="h-3 w-3 shrink-0" aria-hidden="true" />
        )}
      </a>
    );
  };
}
