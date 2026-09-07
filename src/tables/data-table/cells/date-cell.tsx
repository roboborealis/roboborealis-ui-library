'use client';

import * as React from 'react';
import type { CellContext } from '@tanstack/react-table';

import { formatDateLong } from '@/core/formatting/format-date';
import { useDateFormatOptional } from '@/core/providers/robo-date-format-provider';

// ---------------------------------------------------------------------------
// DateCell — formatted date with optional relative time tooltip
// ---------------------------------------------------------------------------

export interface DateCellConfig {
  /** Intl.DateTimeFormat options. Default: medium date + short time. */
  formatOptions?: Intl.DateTimeFormatOptions;
  /** Locale string. Default: 'en-US'. */
  locale?: string;
  /** Show relative time ("2 hours ago") below the formatted date. Default: false. */
  showRelative?: boolean;
}

const DEFAULT_OPTIONS: Intl.DateTimeFormatOptions = {
  dateStyle: 'medium',
  timeStyle: 'short',
};

function getRelativeTime(date: Date): string {
  const now = Date.now();
  const diff = now - date.getTime();
  const absDiff = Math.abs(diff);
  const future = diff < 0;

  const seconds = Math.floor(absDiff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  let label: string;
  if (days > 0) {
    label = `${days}d`;
  } else if (hours > 0) {
    label = `${hours}h`;
  } else if (minutes > 0) {
    label = `${minutes}m`;
  } else {
    label = 'just now';
  }

  if (label === 'just now') return label;
  return future ? `in ${label}` : `${label} ago`;
}

/**
 * Creates a TanStack cell renderer that formats date values.
 *
 * Accepts `Date`, ISO string, or Unix timestamp (number).
 *
 * When `formatOptions` is omitted, the cell reacts live to the app's
 * `RoboDateFormatProvider` setting (if one is mounted) instead of a fixed
 * `Intl.DateTimeFormat` — pass `formatOptions` explicitly to opt out and pin
 * a specific format regardless of that setting.
 *
 * @example
 * ```tsx
 * columnHelper.accessor('createdAt', {
 *   header: 'Created',
 *   cell: createDateCell({ showRelative: true }),
 * })
 * ```
 */
export function createDateCell<TData>(
  config: DateCellConfig = {},
): (info: CellContext<TData, unknown>) => React.ReactNode {
  const { formatOptions, locale = 'en-US', showRelative = false } = config;

  const explicitFormatter = formatOptions ? new Intl.DateTimeFormat(locale, formatOptions) : null;
  const fallbackFormatter = new Intl.DateTimeFormat(locale, DEFAULT_OPTIONS);

  return function DateCell(info: CellContext<TData, unknown>) {
    const dateFormatCtx = useDateFormatOptional();
    const raw = info.getValue();
    if (raw === null || raw === undefined) return null;

    let date: Date;
    if (raw instanceof Date) {
      date = raw;
    } else if (typeof raw === 'number') {
      date = new Date(raw);
    } else {
      date = new Date(String(raw));
    }

    if (isNaN(date.getTime())) return <span className="text-[var(--muted-foreground)]">—</span>;

    const formatted = explicitFormatter
      ? explicitFormatter.format(date)
      : dateFormatCtx
        ? dateFormatCtx.formatDate(date)
        : fallbackFormatter.format(date);
    const iso = date.toISOString();

    return (
      <time dateTime={iso} title={formatDateLong(date)}>
        <span>{formatted}</span>
        {showRelative && (
          <span className="block text-xs text-[var(--muted-foreground)]">
            {getRelativeTime(date)}
          </span>
        )}
      </time>
    );
  };
}
