import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// RoboFieldList — a compact striped label/value readout.
//
// Label on the left (muted), value on the right (mono, medium, right-aligned),
// with optional zebra striping and a per-row divider. Built for dense record
// readouts in floating panels, inspector cards, and anomaly summaries — a
// single record's fields, not multi-row tabular data.
//
// Sibling primitives:
//   - RoboDescriptionList — plain two-column key-value grid (no striping)
//   - RoboTable / RoboDataTable — rows-and-columns of many records
// ---------------------------------------------------------------------------

const fieldRowVariants = cva(
  'flex items-start justify-between gap-2 px-1.5 py-1 text-xs border-b border-[var(--border)]',
  {
    variants: {
      striped: {
        true: '[&:nth-child(even)]:bg-[var(--border)]/70',
        false: '',
      },
    },
    defaultVariants: {
      striped: true,
    },
  }
);

export interface RoboFieldListItem {
  /** Left-hand label */
  label: React.ReactNode;
  /** Right-hand value (rendered mono, right-aligned) */
  value: React.ReactNode;
}

export interface RoboFieldListProps
  extends React.HTMLAttributes<HTMLDListElement>,
    VariantProps<typeof fieldRowVariants> {
  fields: readonly RoboFieldListItem[];
  ref?: React.Ref<HTMLDListElement>;
}

/**
 * RoboFieldList — striped label/value readout for a single record's fields.
 *
 * @example
 * ```tsx
 * <RoboFieldList
 *   fields={[
 *     { label: 'NORAD ID', value: '25544' },
 *     { label: 'Altitude', value: '420 km' },
 *   ]}
 * />
 * ```
 */
function RoboFieldList({ fields, striped = true, className, ref, ...props }: RoboFieldListProps) {
  return (
    <dl ref={ref} data-slot="field-list" className={cn('flex flex-col', className)} {...props}>
      {fields.map((field, index) => (
        <div key={index} className={fieldRowVariants({ striped })} data-slot="field-list-row">
          <dt className="shrink-0 min-w-[4.5rem] text-[var(--muted-foreground)]">{field.label}</dt>
          <dd className="font-mono font-medium text-right text-[var(--card-foreground)] break-all">
            {field.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
RoboFieldList.displayName = 'RoboFieldList';

export { RoboFieldList };
