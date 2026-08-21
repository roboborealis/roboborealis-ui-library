import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import type { SemanticColor } from '@/lib/types';
import { RoboScaleIn } from '@/animations';

const badgeVariants = cva(
  'inline-flex items-center font-medium',
  {
    variants: {
      usage: {
        label: 'rounded-full px-2.5 py-0.5',
        status: 'rounded-full px-2.5 py-0.5',
        count: 'rounded-full px-2 py-0.5 tabular-nums',
      },
      badgeColor: {
        default:
          'robo-badge-default bg-[var(--muted)] text-[var(--foreground)]',
        primary:
          'robo-badge-primary bg-[var(--primary)] text-[var(--primary-foreground)]',
        success:
          'robo-badge-success bg-[var(--success)] text-[var(--success-foreground)]',
        warning:
          'robo-badge-warning bg-[var(--warning)] text-[var(--warning-foreground)]',
        destructive:
          'robo-badge-destructive bg-[var(--destructive)] text-[var(--destructive-foreground)]',
      },
      size: {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base',
      },
    },
    defaultVariants: {
      usage: 'label',
      badgeColor: 'default',
      size: 'md',
    },
  }
);

export const BADGE_USAGES = ['label', 'status', 'count'] as const;
export const BADGE_COLORS = ['default', 'primary', 'success', 'warning', 'destructive'] as const;
export const BADGE_SIZES = ['sm', 'md', 'lg'] as const;
export type BadgeUsage = typeof BADGE_USAGES[number];
export type BadgeSize = typeof BADGE_SIZES[number];

type BadgeColor = SemanticColor;

export interface RoboBadgeProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'color'>,
    VariantProps<typeof badgeVariants> {
  /** Semantic color of the badge */
  color?: BadgeColor;
  /** For usage="count": the numeric value to display. Renders "99+" when > 99. */
  count?: number;
  children?: React.ReactNode;
  /** Scale badge in on mount. Default: false */
  animate?: boolean;
  ref?: React.Ref<HTMLSpanElement>;
}

const dotColorClass: Record<BadgeColor, string> = {
  default: 'bg-[var(--muted)]',
  primary: 'bg-[var(--primary)]',
  success: 'bg-[var(--success)]',
  warning: 'bg-[var(--warning)]',
  destructive: 'bg-[var(--destructive)]',
};

/**
 * RoboBadge — flexible badge for status indicators, counts, and labels.
 *
 * @example
 * ```tsx
 * <RoboBadge>New</RoboBadge>
 * <RoboBadge usage="status" color="success">Online</RoboBadge>
 * <RoboBadge usage="count" count={7}>Notifications</RoboBadge>
 * ```
 */
function RoboBadge({ className, usage = 'label', color, size, count, children, animate = false, ref, ...props }: RoboBadgeProps) {
  const resolvedBadgeColor: BadgeColor = color ?? 'default';

    const renderContent = () => {
      if (usage === 'count' && count !== undefined) {
        return count > 99 ? '99+' : String(count);
      }
      if (usage === 'status') {
        return (
          <>
            <span
              aria-hidden='true'
              className={cn(
                'inline-block w-2 h-2 rounded-full me-1 shrink-0',
                dotColorClass[resolvedBadgeColor]
              )}
            />
            {children}
          </>
        );
      }
      return children;
    };

    const ariaProps: React.HTMLAttributes<HTMLSpanElement> = {};
    if (usage === 'status') {
      ariaProps.role = 'status';
    }
    if (usage === 'count' && count !== undefined) {
      const countLabel = count > 99 ? 'More than 99 notifications' : String(count);
      ariaProps['aria-label'] = typeof children === 'string' ? `${children}: ${countLabel}` : countLabel;
    }

    const badge = (
      <span
        ref={ref}
        data-glow
        className={cn(
          badgeVariants({ usage, badgeColor: resolvedBadgeColor, size }),
          className
        )}
        {...ariaProps}
        {...props}
      >
        {renderContent()}
      </span>
    );

    return animate ? <RoboScaleIn preset='expressive'>{badge}</RoboScaleIn> : badge;
}
RoboBadge.displayName = 'RoboBadge';

export type { BadgeColor };
export { RoboBadge, badgeVariants };
