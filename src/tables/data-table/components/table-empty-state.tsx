'use client';

import type * as React from 'react';

import { RoboEmptyState } from '@/feedback/empty-state/robo-empty-state';

// ---------------------------------------------------------------------------
// TableEmptyState
// ---------------------------------------------------------------------------

export interface TableEmptyStateProps {
  /** Number of visible columns for the colSpan */
  colCount: number;
  /** Custom empty state content. Falls back to a default message. */
  children?: React.ReactNode;
}

export function TableEmptyState({ colCount, children }: TableEmptyStateProps) {
  return (
    <tr>
      <td
        colSpan={colCount}
        className="px-4 py-8 text-center text-sm text-[var(--muted-foreground)]"
      >
        {children ?? (
          <div className="flex flex-col items-center gap-2">
            <RoboEmptyState size="sm" />
            <span>No data available.</span>
          </div>
        )}
      </td>
    </tr>
  );
}
