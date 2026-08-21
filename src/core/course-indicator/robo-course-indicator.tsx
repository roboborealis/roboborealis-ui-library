import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { MoveUp } from 'lucide-react';

import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// CourseIndicator variants
// ---------------------------------------------------------------------------

const courseIndicatorVariants = cva(
  'inline-flex items-center tabular-nums',
  {
    variants: {
      size: {
        sm: 'gap-0.5 text-xs',
        md: 'gap-1 text-sm',
        lg: 'gap-1.5 text-base',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

// ---------------------------------------------------------------------------
// Icon size map — matches text size proportionally
// ---------------------------------------------------------------------------

const defaultIconSize: Record<'sm' | 'md' | 'lg', number> = {
  sm: 12,
  md: 16,
  lg: 20,
};

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type CourseDisplay = 'arrow' | 'value' | 'both';

export interface RoboCourseIndicatorProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'children'>,
    VariantProps<typeof courseIndicatorVariants> {
  /** Course heading in degrees (0–360). Null/undefined renders a dash. */
  course: number | null | undefined;
  /** What to display. Default: 'both'. */
  display?: CourseDisplay;
  /** Override the arrow icon size in pixels. Uses size-proportional default when omitted. */
  iconSize?: number;
  ref?: React.Ref<HTMLSpanElement>;
}

// ---------------------------------------------------------------------------
// RoboCourseIndicator
// ---------------------------------------------------------------------------

/**
 * RoboCourseIndicator — displays an orbital course heading as a rotated arrow,
 * a numeric degree value, or both.
 *
 * Used across satellite tracking tables, mission legs, and route displays wherever
 * course/heading needs to be shown at a glance.
 *
 * @example
 * ```tsx
 * <RoboCourseIndicator course={142} />
 * <RoboCourseIndicator course={270} display="arrow" size="lg" />
 * <RoboCourseIndicator course={45} display="value" />
 * ```
 */
function RoboCourseIndicator({
  course,
  display = 'both',
  iconSize,
  size = 'md',
  className,
  ref,
  ...props
}: RoboCourseIndicatorProps) {
    // Null / undefined → dash placeholder
    if (course === null || course === undefined) {
      return (
        <span
          ref={ref}
          className={cn(courseIndicatorVariants({ size }), 'text-[var(--secondary-text)]', className)}
          {...props}
        >
          —
        </span>
      );
    }

    const normalized = ((course % 360) + 360) % 360;
    const resolvedIconSize = iconSize ?? defaultIconSize[size ?? 'md'];
    const showArrow = display === 'arrow' || display === 'both';
    const showValue = display === 'value' || display === 'both';

    // When arrow-only, add aria-label so screen readers still announce the value
    const a11yProps = display === 'arrow'
      ? { role: 'img' as const, 'aria-label': `Course: ${course}°` }
      : {};

    return (
      <span
        ref={ref}
        className={cn(courseIndicatorVariants({ size }), className)}
        {...a11yProps}
        {...props}
      >
        {showArrow && (
          <MoveUp
            size={resolvedIconSize}
            style={{
              transform: `rotate(${normalized}deg)`,
              transition: 'transform 0.2s',
            }}
            aria-hidden="true"
          />
        )}
        {showValue && <span>{course}°</span>}
      </span>
    );
}
RoboCourseIndicator.displayName = 'RoboCourseIndicator';

export { RoboCourseIndicator, courseIndicatorVariants };
