'use client';

import * as React from 'react';
import type { CellContext } from '@tanstack/react-table';

import { RoboAvatar } from '@/core/avatar/robo-avatar';
import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// AvatarCell — renders a RoboAvatar with an optional name label
// ---------------------------------------------------------------------------

export interface AvatarCellConfig {
  /** Accessor for the image URL (key path on the row data). */
  srcAccessor?: string;
  /** Accessor for the display name. */
  nameAccessor?: string;
  /** Accessor for fallback initials (1–2 chars). Defaults to first chars of name. */
  fallbackAccessor?: string;
  /** Avatar size. Default: 'sm'. */
  size?: 'xs' | 'sm' | 'md';
}

function getNestedValue(obj: unknown, path: string): unknown {
  return path.split('.').reduce((acc: unknown, key) => {
    if (acc && typeof acc === 'object') return (acc as Record<string, unknown>)[key];
    return undefined;
  }, obj);
}

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

/**
 * Creates a TanStack cell renderer that displays a RoboAvatar + name.
 *
 * @example
 * ```tsx
 * columnHelper.accessor('name', {
 *   header: 'Operator',
 *   cell: createAvatarCell({ nameAccessor: 'name', srcAccessor: 'avatarUrl' }),
 * })
 * ```
 */
export function createAvatarCell<TData>(
  config: AvatarCellConfig = {},
): (info: CellContext<TData, unknown>) => React.ReactNode {
  const { srcAccessor, nameAccessor, fallbackAccessor, size = 'sm' } = config;

  return function AvatarCell(info: CellContext<TData, unknown>) {
    const row = info.row.original as Record<string, unknown>;

    const name = nameAccessor
      ? String(getNestedValue(row, nameAccessor) ?? '')
      : String(info.getValue() ?? '');

    const src = srcAccessor
      ? (getNestedValue(row, srcAccessor) as string | undefined)
      : undefined;

    const fallback = fallbackAccessor
      ? String(getNestedValue(row, fallbackAccessor) ?? '')
      : getInitials(name);

    if (!name) return null;

    return (
      <span className={cn('inline-flex items-center gap-2')}>
        <RoboAvatar
          src={src}
          alt={name}
          fallback={fallback}
          size={size}
        />
        <span className="truncate">{name}</span>
      </span>
    );
  };
}
