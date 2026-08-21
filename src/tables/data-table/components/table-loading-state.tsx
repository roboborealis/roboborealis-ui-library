'use client';

import { SKELETON_ROW_COUNT } from '../constants';

// ---------------------------------------------------------------------------
// SkeletonRow — single row of animated skeleton cells
// ---------------------------------------------------------------------------

function SkeletonRow({ colCount }: { colCount: number }) {
  return (
    <tr>
      {Array.from({ length: colCount }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 rounded bg-[var(--muted)] animate-pulse" />
        </td>
      ))}
    </tr>
  );
}

// ---------------------------------------------------------------------------
// TableLoadingState
// ---------------------------------------------------------------------------

export interface TableLoadingStateProps {
  /** Number of visible columns for the skeleton cells */
  colCount: number;
  /** Number of skeleton rows to render. Defaults to SKELETON_ROW_COUNT. */
  rowCount?: number;
}

export function TableLoadingState({
  colCount,
  rowCount = SKELETON_ROW_COUNT,
}: TableLoadingStateProps) {
  return (
    <>
      {Array.from({ length: rowCount }).map((_, i) => (
        <SkeletonRow key={i} colCount={colCount} />
      ))}
    </>
  );
}
