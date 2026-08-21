import * as React from 'react';

// ---------------------------------------------------------------------------
// RoboEmailTable — a data-driven table that renders with INLINE STYLES ONLY,
// for HTML email bodies and exported report documents.
//
// Email clients strip <style> tags and do not resolve CSS custom properties,
// so this component intentionally uses literal color values instead of the
// token system — a documented exemption from the no-hardcoded-colors rule.
// Every row sets an explicit background (white, or the stripe grey) so the
// table is fully self-contained and never inherits the client/canvas colour —
// it reads correctly in any client and in both light and dark chrome.
//
// For on-screen UI always use RoboTable (token-styled) or RoboDataTable.
// ---------------------------------------------------------------------------

const EMAIL_COLORS = {
  text: '#1a1d21',
  secondaryText: '#5a616b',
  border: '#d5d9de',
  headerBg: '#f0f2f4',
  stripeBg: '#f7f8f9',
  rowBg: '#ffffff',
} as const;

export interface RoboEmailTableColumn<Row> {
  /** Key into the row object */
  key: keyof Row & string;
  /** Column header label */
  header: string;
  /** Horizontal alignment. Default: left */
  align?: 'left' | 'center' | 'right';
}

export interface RoboEmailTableProps<Row extends Record<string, React.ReactNode>> {
  columns: readonly RoboEmailTableColumn<Row>[];
  rows: readonly Row[];
  /** Optional caption rendered above the table */
  caption?: string;
  /** Zebra-stripe the body rows. Default: true */
  striped?: boolean;
  /** Table width. Default: '100%' */
  width?: string;
}

const baseCell: React.CSSProperties = {
  padding: '8px 12px',
  border: `1px solid ${EMAIL_COLORS.border}`,
  fontSize: '14px',
  lineHeight: 1.4,
  color: EMAIL_COLORS.text,
};

/**
 * RoboEmailTable — inline-styled static table for email and report HTML.
 *
 * Render to markup with react-dom/server for an email body:
 *
 * @example
 * ```tsx
 * import { renderToStaticMarkup } from 'react-dom/server';
 *
 * const html = renderToStaticMarkup(
 *   <RoboEmailTable
 *     caption="Flight Plan — Artemis II"
 *     columns={[
 *       { key: 'port', header: 'Ground Station' },
 *       { key: 'eta', header: 'Acquired', align: 'right' },
 *     ]}
 *     rows={[{ port: 'Goldstone DSN', eta: '2026-07-04 14:00Z' }]}
 *   />
 * );
 * ```
 */
function RoboEmailTable<Row extends Record<string, React.ReactNode>>({
  columns,
  rows,
  caption,
  striped = true,
  width = '100%',
}: RoboEmailTableProps<Row>) {
  return (
    <table
      data-slot="email-table"
      cellPadding={0}
      cellSpacing={0}
      style={{
        width,
        borderCollapse: 'collapse',
        fontFamily: 'Arial, Helvetica, sans-serif',
      }}
    >
      {caption && (
        <caption
          style={{
            captionSide: 'top',
            textAlign: 'left',
            padding: '0 0 8px 0',
            fontSize: '14px',
            fontWeight: 'bold',
            color: EMAIL_COLORS.text,
          }}
        >
          {caption}
        </caption>
      )}
      <thead>
        <tr>
          {columns.map((col) => (
            <th
              key={col.key}
              scope="col"
              style={{
                ...baseCell,
                textAlign: col.align ?? 'left',
                backgroundColor: EMAIL_COLORS.headerBg,
                color: EMAIL_COLORS.text,
                fontWeight: 'bold',
              }}
            >
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIndex) => (
          <tr
            key={rowIndex}
            style={{
              backgroundColor:
                striped && rowIndex % 2 === 1
                  ? EMAIL_COLORS.stripeBg
                  : EMAIL_COLORS.rowBg,
            }}
          >
            {columns.map((col) => (
              <td key={col.key} style={{ ...baseCell, textAlign: col.align ?? 'left' }}>
                {row[col.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
RoboEmailTable.displayName = 'RoboEmailTable';

export { RoboEmailTable };
