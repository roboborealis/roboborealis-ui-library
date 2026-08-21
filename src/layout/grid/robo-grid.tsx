import * as React from 'react';

import { cn } from '@/lib/utils';

type ColCount = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
type GapSize = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const gapMap: Record<GapSize, string> = {
  none: 'gap-0',
  xs: 'gap-2',
  sm: 'gap-3',
  md: 'gap-4',
  lg: 'gap-6',
  xl: 'gap-8',
};

const gapXMap: Record<GapSize, string> = {
  none: 'gap-x-0',
  xs: 'gap-x-2',
  sm: 'gap-x-3',
  md: 'gap-x-4',
  lg: 'gap-x-6',
  xl: 'gap-x-8',
};

const gapYMap: Record<GapSize, string> = {
  none: 'gap-y-0',
  xs: 'gap-y-2',
  sm: 'gap-y-3',
  md: 'gap-y-4',
  lg: 'gap-y-6',
  xl: 'gap-y-8',
};

export interface RoboGridProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Number of columns (default: 12). Applied via inline style — no dynamic Tailwind classes. */
  cols?: ColCount;
  /** Number of columns at md breakpoint (≥768px). */
  colsMd?: ColCount;
  /** Number of columns at lg breakpoint (≥1024px). */
  colsLg?: ColCount;
  /** Number of columns at xl breakpoint (≥1280px). */
  colsXl?: ColCount;
  /** Gap between grid cells (default: 'md'). */
  gap?: GapSize;
  /**
   * When provided, `gap` controls column gap and `rowGap` controls row gap
   * (applied via `gap-x-*` and `gap-y-*` separately).
   */
  rowGap?: GapSize;
  ref?: React.Ref<HTMLDivElement>;
}

/** Builds the responsive CSS rule block for a single breakpoint. */
function buildMediaRule(minWidth: number, safeId: string, cols: ColCount): string {
  return (
    `@media (min-width: ${minWidth}px) {` +
    ` [data-robo-grid-id="${safeId}"]` +
    ` { grid-template-columns: repeat(${cols}, minmax(0, 1fr)); }` +
    ` }`
  );
}

/**
 * RoboGrid — CSS Grid container with responsive column support.
 *
 * Responsive breakpoints are scoped by a unique `data-robo-grid-id` attribute
 * and injected via a `<style>` element (textContent, never innerHTML) so that
 * arbitrary column counts work without dynamic Tailwind class generation.
 *
 * @example
 * ```tsx
 * <RoboGrid cols={3} colsMd={6} colsLg={12} gap="md">
 *   <div>Cell 1</div>
 *   <div>Cell 2</div>
 *   <div>Cell 3</div>
 * </RoboGrid>
 * ```
 */
function RoboGrid({
  className,
  cols = 12,
  colsMd,
  colsLg,
  colsXl,
  gap = 'md',
  rowGap,
  style,
  children,
  ref,
  ...props
}: RoboGridProps) {
    const id = React.useId();
    // React.useId() may contain colons which are invalid in CSS attribute selectors.
    const safeId = id.replace(/:/g, '-');

    const styleRef = React.useRef<HTMLStyleElement | null>(null);

    const hasResponsive =
      colsMd !== undefined || colsLg !== undefined || colsXl !== undefined;

    React.useEffect(() => {
      if (!hasResponsive) return;

      const rules: string[] = [];
      if (colsMd !== undefined) rules.push(buildMediaRule(768, safeId, colsMd));
      if (colsLg !== undefined) rules.push(buildMediaRule(1024, safeId, colsLg));
      if (colsXl !== undefined) rules.push(buildMediaRule(1280, safeId, colsXl));

      const el = document.createElement('style');
      el.textContent = rules.join('\n');
      document.head.appendChild(el);
      styleRef.current = el;

      return () => {
        el.remove();
        styleRef.current = null;
      };
    }, [hasResponsive, safeId, colsMd, colsLg, colsXl]);

    const gapClasses =
      rowGap !== undefined
        ? cn(gapXMap[gap], gapYMap[rowGap])
        : gapMap[gap];

    return (
      <div
        ref={ref}
        data-slot='grid'
        data-robo-grid-id={safeId}
        className={cn('grid', gapClasses, className)}
        style={{
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
    );
}
RoboGrid.displayName = 'RoboGrid';

export { RoboGrid };
