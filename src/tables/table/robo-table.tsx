import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// RoboTable — the "dumb" table. Static, semantic <table> markup with token
// styling and zero dependencies (no TanStack). For sorting, filtering,
// pagination, selection, or editing use RoboDataTable instead.
//
// Cell padding scales with the density system via --density-scale, so the
// same table reads compact on ops dashboards and spacious in reports.
// ---------------------------------------------------------------------------

const tableVariants = cva(
  'w-full caption-bottom text-sm border-collapse ' +
    '[&_th]:px-[calc(var(--density-scale,1)*1rem)] [&_th]:py-[calc(var(--density-scale,1)*0.75rem)] ' +
    '[&_td]:px-[calc(var(--density-scale,1)*1rem)] [&_td]:py-[calc(var(--density-scale,1)*0.75rem)]',
  {
    variants: {
      variant: {
        default: '',
        striped: '[&_tbody_tr:nth-child(even)]:bg-[var(--border)]/45',
        bordered:
          'border border-[var(--border)] [&_th]:border [&_th]:border-[var(--border)] [&_td]:border [&_td]:border-[var(--border)]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export const TABLE_VARIANTS = ['default', 'striped', 'bordered'] as const;
export type TableVariant = (typeof TABLE_VARIANTS)[number];

export interface RoboTableProps
  extends React.TableHTMLAttributes<HTMLTableElement>,
    VariantProps<typeof tableVariants> {
  ref?: React.Ref<HTMLTableElement>;
}

/**
 * RoboTable — static, read-only HTML table with zero dependencies.
 *
 * The lightweight counterpart to RoboDataTable: real `<table>/<thead>/<tbody>`
 * semantics, token-driven styling, density-aware cell padding, and nothing
 * else. Renders server-side and prints cleanly.
 *
 * @example
 * ```tsx
 * <RoboTable variant="striped">
 *   <RoboTableHeader>
 *     <RoboTableRow>
 *       <RoboTableHead>Spacecraft</RoboTableHead>
 *       <RoboTableHead>Status</RoboTableHead>
 *     </RoboTableRow>
 *   </RoboTableHeader>
 *   <RoboTableBody>
 *     <RoboTableRow>
 *       <RoboTableCell>Artemis II</RoboTableCell>
 *       <RoboTableCell>In Transit</RoboTableCell>
 *     </RoboTableRow>
 *   </RoboTableBody>
 * </RoboTable>
 * ```
 */
function RoboTable({ className, variant, ref, ...props }: RoboTableProps) {
  return (
    <div data-slot="table-container" className="relative w-full overflow-x-auto">
      <table
        ref={ref}
        data-slot="table"
        className={cn(tableVariants({ variant }), className)}
        {...props}
      />
    </div>
  );
}
RoboTable.displayName = 'RoboTable';

export interface RoboTableSectionProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  ref?: React.Ref<HTMLTableSectionElement>;
}

function RoboTableHeader({ className, ref, ...props }: RoboTableSectionProps) {
  return (
    <thead
      ref={ref}
      data-slot="table-header"
      className={cn('border-b border-[var(--border)] bg-[var(--muted)]', className)}
      {...props}
    />
  );
}
RoboTableHeader.displayName = 'RoboTableHeader';

function RoboTableBody({ className, ref, ...props }: RoboTableSectionProps) {
  return (
    <tbody
      ref={ref}
      data-slot="table-body"
      className={cn('[&_tr:last-child]:border-0', className)}
      {...props}
    />
  );
}
RoboTableBody.displayName = 'RoboTableBody';

function RoboTableFooter({ className, ref, ...props }: RoboTableSectionProps) {
  return (
    <tfoot
      ref={ref}
      data-slot="table-footer"
      className={cn(
        'border-t border-[var(--border)] bg-[var(--muted)] font-medium',
        className
      )}
      {...props}
    />
  );
}
RoboTableFooter.displayName = 'RoboTableFooter';

export interface RoboTableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  ref?: React.Ref<HTMLTableRowElement>;
}

function RoboTableRow({ className, ref, ...props }: RoboTableRowProps) {
  return (
    <tr
      ref={ref}
      data-slot="table-row"
      className={cn('border-b border-[var(--border)] transition-colors', className)}
      {...props}
    />
  );
}
RoboTableRow.displayName = 'RoboTableRow';

export interface RoboTableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  ref?: React.Ref<HTMLTableCellElement>;
}

function RoboTableHead({ className, scope = 'col', ref, ...props }: RoboTableHeadProps) {
  return (
    <th
      ref={ref}
      scope={scope}
      data-slot="table-head"
      className={cn(
        'text-left align-middle font-medium text-[var(--secondary-text)]',
        className
      )}
      {...props}
    />
  );
}
RoboTableHead.displayName = 'RoboTableHead';

export interface RoboTableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  ref?: React.Ref<HTMLTableCellElement>;
}

function RoboTableCell({ className, ref, ...props }: RoboTableCellProps) {
  return (
    <td
      ref={ref}
      data-slot="table-cell"
      className={cn('align-middle text-[var(--foreground)]', className)}
      {...props}
    />
  );
}
RoboTableCell.displayName = 'RoboTableCell';

export interface RoboTableCaptionProps extends React.HTMLAttributes<HTMLTableCaptionElement> {
  ref?: React.Ref<HTMLTableCaptionElement>;
}

function RoboTableCaption({ className, ref, ...props }: RoboTableCaptionProps) {
  return (
    <caption
      ref={ref}
      data-slot="table-caption"
      className={cn('mt-4 text-sm text-[var(--secondary-text)]', className)}
      {...props}
    />
  );
}
RoboTableCaption.displayName = 'RoboTableCaption';

export {
  RoboTable,
  RoboTableHeader,
  RoboTableBody,
  RoboTableFooter,
  RoboTableRow,
  RoboTableHead,
  RoboTableCell,
  RoboTableCaption,
};
