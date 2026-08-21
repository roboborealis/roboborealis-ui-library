import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const dividerVariants = cva('', {
  variants: {
    variant: {
      solid: '',
      dashed: '',
      dotted: '',
    },
  },
  defaultVariants: {
    variant: 'solid',
  },
});

export interface RoboDividerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>,
    VariantProps<typeof dividerVariants> {
  /** Layout axis — default `'horizontal'` */
  orientation?: 'horizontal' | 'vertical';
  /** Optional label rendered in the center of the divider */
  label?: React.ReactNode;
  /** When `true` the divider is purely decorative (default). When `false`, exposes `role="separator"`. */
  decorative?: boolean;
  ref?: React.Ref<HTMLDivElement>;
}

/**
 * RoboDivider — A layout divider with optional centered label.
 *
 * All colors use CSS variable tokens from the active theme.
 * Supports solid, dashed, and dotted line styles.
 *
 * @example
 * ```tsx
 * // Simple horizontal rule
 * <RoboDivider />
 *
 * // With a label
 * <RoboDivider label="OR" />
 *
 * // Vertical
 * <RoboDivider orientation="vertical" />
 *
 * // Dashed, non-decorative (exposed to screen readers)
 * <RoboDivider variant="dashed" decorative={false} />
 * ```
 */
function RoboDivider({
  className,
  orientation = 'horizontal',
  label,
  variant = 'solid',
  decorative = true,
  ref,
  ...props
}: RoboDividerProps) {
    const isVertical = orientation === 'vertical';
    const isDecorative = decorative;

    const ariaProps = isDecorative
      ? { role: 'none' as const, 'aria-hidden': true as const }
      : {
          role: 'separator' as const,
          'aria-orientation': orientation,
        };

    /* ---------------------------------------------------------------- */
    /* Vertical divider — no label support                                */
    /* ---------------------------------------------------------------- */

    if (isVertical) {
      return (
        <div
          ref={ref}
          data-slot='divider'
          className={cn('w-px self-stretch bg-[var(--border)]', className)}
          {...ariaProps}
          {...props}
        />
      );
    }

    /* ---------------------------------------------------------------- */
    /* Horizontal with label                                              */
    /* ---------------------------------------------------------------- */

    if (label) {
      const lineClass =
        variant === 'solid'
          ? 'h-px flex-1 bg-[var(--border)]'
          : 'flex-1 border-0 border-b border-[var(--border)]';

      const lineStyle: React.CSSProperties =
        variant === 'dashed'
          ? { borderStyle: 'dashed' }
          : variant === 'dotted'
            ? { borderStyle: 'dotted' }
            : {};

      return (
        <div
          ref={ref}
          data-slot='divider'
          className={cn('flex items-center gap-3', className)}
          {...ariaProps}
          {...props}
        >
          <span className={lineClass} style={lineStyle} aria-hidden='true' />
          <span className='shrink-0 text-xs text-[var(--muted-foreground)]'>{label}</span>
          <span className={lineClass} style={lineStyle} aria-hidden='true' />
        </div>
      );
    }

    /* ---------------------------------------------------------------- */
    /* Horizontal without label                                           */
    /* ---------------------------------------------------------------- */

    const horizontalClass =
      variant === 'solid'
        ? 'h-px w-full bg-[var(--border)]'
        : 'w-full border-0 border-b border-[var(--border)]';

    const horizontalStyle: React.CSSProperties =
      variant === 'dashed'
        ? { borderStyle: 'dashed' }
        : variant === 'dotted'
          ? { borderStyle: 'dotted' }
          : {};

    return (
      <div
        ref={ref}
        data-slot='divider'
        className={cn(horizontalClass, className)}
        style={horizontalStyle}
        {...ariaProps}
        {...props}
      />
    );
}
RoboDivider.displayName = 'RoboDivider';

export { RoboDivider, dividerVariants };
