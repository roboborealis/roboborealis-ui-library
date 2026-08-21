'use client';

import { RoboLoading } from '@/feedback/loading/robo-loading';

// ---------------------------------------------------------------------------
// TableFetchingOverlay
// ---------------------------------------------------------------------------

export interface TableFetchingOverlayProps {
  /** Number of visible columns for the colSpan */
  colCount: number;
}

/**
 * Semi-transparent overlay rendered as a `<tr>` that covers the table body
 * during a refetch. The parent `<tbody>` must have `position: relative`.
 *
 * Uses an absolutely-positioned `<td>` overlaying the body content so that
 * existing data rows remain visible underneath.
 */
export function TableFetchingOverlay({ colCount }: TableFetchingOverlayProps) {
  return (
    <tr
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none"
      style={{ display: 'table-row' }}
    >
      <td
        colSpan={colCount}
        className="absolute inset-0 flex items-center justify-center bg-[var(--background)]/60 transition-opacity duration-[var(--duration-normal)]"
      >
        <RoboLoading size="sm" label="Refreshing data" />
      </td>
    </tr>
  );
}
