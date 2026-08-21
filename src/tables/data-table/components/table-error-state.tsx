'use client';

import type * as React from 'react';

import { RoboErrorState } from '@/feedback/error-state/robo-error-state';

// ---------------------------------------------------------------------------
// TableErrorState
// ---------------------------------------------------------------------------

export interface TableErrorStateProps {
  /** Number of visible columns for the colSpan */
  colCount: number;
  /** Custom error state content. Falls back to a default message. */
  children?: React.ReactNode;
}

export function TableErrorState({ colCount, children }: TableErrorStateProps) {
  return (
    <tr>
      <td
        colSpan={colCount}
        className="px-4 py-8 text-center text-sm"
      >
        {children ?? <RoboErrorState variant="error" size="sm" />}
      </td>
    </tr>
  );
}
