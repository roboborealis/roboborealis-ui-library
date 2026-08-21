import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// RoboDescriptionList — semantic <dl>/<dt>/<dd> key-value display.
//
// Promoted from the entity-dossier's property grid into a general primitive:
// satellite detail panels, report metadata blocks, settings summaries — anywhere
// labeled values are read, not edited. RoboDossierPropertyGrid now consumes
// this component.
// ---------------------------------------------------------------------------

/**
 * Converts a snake_case or kebab-case key to Title Case.
 * e.g. "operator" → "Operator", "norad-id" → "Norad Id"
 */
export function formatKey(key: string): string {
  return key
    .replace(/[_-]/g, ' ')
    .replace(/\w\S*/g, (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
}

/**
 * Formats an arbitrary value for display.
 * - string / number → String(v)
 * - boolean → "Yes" / "No"
 * - null / undefined → "—"
 * - array → join(", ")
 * - object → compact JSON, truncated to 60 chars
 */
export function formatValue(v: unknown): string {
  if (v === null || v === undefined) return '—';
  if (typeof v === 'boolean') return v ? 'Yes' : 'No';
  if (typeof v === 'string') return v;
  if (typeof v === 'number') return String(v);
  if (Array.isArray(v)) {
    return v.map((item) => formatValue(item)).join(', ');
  }
  if (typeof v === 'object') {
    // JSON.stringify throws on circular references — entity properties are
    // arbitrary Record<string, unknown>, so a cycle must not crash the render
    let json: string;
    try {
      json = JSON.stringify(v);
    } catch {
      return '[object]';
    }
    return json.length > 60 ? json.slice(0, 57) + '...' : json;
  }
  return String(v);
}

const descriptionListVariants = cva('', {
  variants: {
    layout: {
      /** Two-column label | value grid (the dossier style) */
      grid: 'grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5',
      /** Label stacked above value, one pair per block */
      stacked: 'flex flex-col gap-3',
    },
  },
  defaultVariants: {
    layout: 'grid',
  },
});

export const DESCRIPTION_LIST_LAYOUTS = ['grid', 'stacked'] as const;
export type DescriptionListLayout = (typeof DESCRIPTION_LIST_LAYOUTS)[number];

export interface RoboDescriptionListProps
  extends React.HTMLAttributes<HTMLDListElement>,
    VariantProps<typeof descriptionListVariants> {
  /**
   * Data-driven convenience: an object rendered as term/detail pairs with
   * formatKey/formatValue applied. Omit and pass RoboDescriptionTerm /
   * RoboDescriptionDetail children for full control.
   */
  items?: Record<string, unknown>;
  ref?: React.Ref<HTMLDListElement>;
}

/**
 * RoboDescriptionList — semantic key-value display on `<dl>/<dt>/<dd>`.
 *
 * @example Data-driven
 * ```tsx
 * <RoboDescriptionList items={{ operator: 'NASA', norad_id: 25544, signal_active: true }} />
 * ```
 *
 * @example Composed
 * ```tsx
 * <RoboDescriptionList layout="stacked">
 *   <RoboDescriptionTerm>Spacecraft</RoboDescriptionTerm>
 *   <RoboDescriptionDetail>Voyager 1</RoboDescriptionDetail>
 * </RoboDescriptionList>
 * ```
 */
function RoboDescriptionList({
  className,
  layout,
  items,
  children,
  ref,
  ...props
}: RoboDescriptionListProps) {
  const stacked = layout === 'stacked';

  return (
    <dl
      ref={ref}
      data-slot="description-list"
      className={cn(descriptionListVariants({ layout }), className)}
      {...props}
    >
      {items
        ? Object.entries(items).map(([key, value]) =>
            stacked ? (
              <div key={key} data-slot="description-group">
                <RoboDescriptionTerm>{formatKey(key)}</RoboDescriptionTerm>
                <RoboDescriptionDetail>{formatValue(value)}</RoboDescriptionDetail>
              </div>
            ) : (
              <React.Fragment key={key}>
                <RoboDescriptionTerm>{formatKey(key)}</RoboDescriptionTerm>
                <RoboDescriptionDetail>{formatValue(value)}</RoboDescriptionDetail>
              </React.Fragment>
            )
          )
        : children}
    </dl>
  );
}
RoboDescriptionList.displayName = 'RoboDescriptionList';

export interface RoboDescriptionTermProps extends React.HTMLAttributes<HTMLElement> {
  ref?: React.Ref<HTMLElement>;
}

function RoboDescriptionTerm({ className, ref, ...props }: RoboDescriptionTermProps) {
  return (
    <dt
      ref={ref}
      data-slot="description-term"
      className={cn(
        'text-xs text-[var(--secondary-text)] font-medium leading-5 whitespace-nowrap',
        className
      )}
      {...props}
    />
  );
}
RoboDescriptionTerm.displayName = 'RoboDescriptionTerm';

export interface RoboDescriptionDetailProps extends React.HTMLAttributes<HTMLElement> {
  ref?: React.Ref<HTMLElement>;
}

function RoboDescriptionDetail({ className, ref, ...props }: RoboDescriptionDetailProps) {
  return (
    <dd
      ref={ref}
      data-slot="description-detail"
      className={cn(
        'text-sm text-[var(--foreground)] font-normal leading-5 break-words min-w-0',
        className
      )}
      {...props}
    />
  );
}
RoboDescriptionDetail.displayName = 'RoboDescriptionDetail';

export { RoboDescriptionList, RoboDescriptionTerm, RoboDescriptionDetail };
