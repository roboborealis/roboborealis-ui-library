'use client';

import * as React from 'react';
import { Download } from 'lucide-react';

import type { RoboButtonProps } from '@/core/button/robo-button';
import { RoboActionButton } from '@/core/action-button/robo-action-button';

/** Column definition for the exported file. */
export interface RoboExportColumn {
  /** Key in each data object to read. */
  key: string;
  /** Human-readable header label. */
  label: string;
}

export interface RoboExportButtonProps
  extends Omit<RoboButtonProps, 'children' | 'onClick'> {
  /** Rows to export — array of plain objects. */
  data: Record<string, unknown>[];
  /**
   * Column definitions. If omitted, columns are inferred from the keys of the
   * first data row (in insertion order).
   */
  columns?: RoboExportColumn[];
  /** Base filename without extension. Default: 'export' */
  filename?: string;
  /** Output format. `'xlsx'` uses HTML-table-in-Excel trick (no extra dep). Default: 'csv' */
  format?: 'csv' | 'xlsx';
  /** Button label and tooltip. Defaults to 'Export CSV' or 'Export Excel'. */
  label?: string;
  /** Icon-only square button — no visible text label. Default: false */
  iconOnly?: boolean;
  /** Called after the file download is triggered. */
  onExport?: () => void;
  ref?: React.Ref<HTMLButtonElement>;
}

// ---------------------------------------------------------------------------
// Export helpers
// ---------------------------------------------------------------------------

/** Escape a cell value for RFC 4180 CSV. */
function escapeCsv(value: unknown): string {
  if (value === null || value === undefined) return '';
  const str = String(value);
  // Wrap in quotes if the value contains a comma, quote, or newline
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function buildCsv(cols: RoboExportColumn[], rows: Record<string, unknown>[]): string {
  const header = cols.map((c) => escapeCsv(c.label)).join(',');
  const body = rows.map((row) => cols.map((c) => escapeCsv(row[c.key])).join(',')).join('\n');
  return `${header}\n${body}`;
}

function buildXlsHtml(cols: RoboExportColumn[], rows: Record<string, unknown>[]): string {
  const th = cols.map((c) => `<th>${c.label}</th>`).join('');
  const trs = rows
    .map((row) => {
      const tds = cols.map((c) => `<td>${row[c.key] ?? ''}</td>`).join('');
      return `<tr>${tds}</tr>`;
    })
    .join('');
  // Microsoft Office HTML spreadsheet format — no library required
  return `<html xmlns:o="urn:schemas-microsoft-com:office:office"
    xmlns:x="urn:schemas-microsoft-com:office:excel"
    xmlns="http://www.w3.org/TR/REC-html40">
  <head><meta charset="utf-8" /></head>
  <body>
    <table><thead><tr>${th}</tr></thead><tbody>${trs}</tbody></table>
  </body>
</html>`;
}

function triggerDownload(content: string, mimeType: string, filename: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.style.display = 'none';
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * RoboExportButton — downloads table data as CSV or Excel with one click.
 *
 * Excel uses the HTML-table trick (no SheetJS or other dependencies). The
 * downloaded `.xls` file opens directly in Microsoft Excel and LibreOffice.
 *
 * @example
 * ```tsx
 * const data = [{ name: 'Satellite A', noradId: '25544' }];
 *
 * // CSV
 * <RoboExportButton data={data} filename="satellites" />
 *
 * // Excel (icon only)
 * <RoboExportButton data={data} filename="satellites" format="xlsx" iconOnly />
 *
 * // Custom columns
 * <RoboExportButton
 *   data={data}
 *   columns={[{ key: 'name', label: 'Satellite Name' }, { key: 'noradId', label: 'NORAD ID' }]}
 *   filename="satellite-report"
 * />
 * ```
 */
function RoboExportButton({
  data,
  columns,
  filename = 'export',
  format = 'csv',
  label,
  iconOnly = false,
  onExport,
  className,
  size = 'sm',
  variant = 'ghost',
  ref,
  ...props
}: RoboExportButtonProps) {
  const resolvedLabel = label ?? (format === 'xlsx' ? 'Export Excel' : 'Export CSV');

    const handleExport = React.useCallback(() => {
      if (data.length === 0) return;

      const cols: RoboExportColumn[] =
        columns ??
        Object.keys(data[0]).map((key) => ({ key, label: key }));

      if (format === 'xlsx') {
        const html = buildXlsHtml(cols, data);
        triggerDownload(html, 'application/vnd.ms-excel', `${filename}.xls`);
      } else {
        const csv = buildCsv(cols, data);
        triggerDownload(csv, 'text/csv;charset=utf-8;', `${filename}.csv`);
      }

      onExport?.();
    }, [data, columns, filename, format, onExport]);

    const icon = <Download className='h-3.5 w-3.5' aria-hidden='true' />;

    return (
      <RoboActionButton
        ref={ref}
        icon={icon}
        label={resolvedLabel}
        iconOnly={iconOnly}
        size={size}
        variant={variant}
        onClick={handleExport}
        data-slot='export-button'
        className={className}
        {...props}
      />
  );
}
RoboExportButton.displayName = 'RoboExportButton';

export { RoboExportButton };
