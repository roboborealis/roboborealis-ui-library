'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

import { RoboCard } from '@/core/card/robo-card';
import { RoboSkeletonLoading } from '@/feedback/skeleton/robo-skeleton';
import { RoboNumberTicker } from '../../animations/advanced/robo-number-ticker';

export interface RoboStatCardProps {
  label: string;
  value: string | number;
  /** Percentage change — positive = up (green), negative = down (red) */
  change?: number;
  /** Contextual label, e.g. "vs last month" */
  changeLabel?: string;
  /** Optional icon rendered in the top-right corner */
  icon?: React.ReactNode;
  /** Show skeleton placeholders instead of the value while data is fetching. */
  isLoading?: boolean;
  /**
   * Animate the numeric value with a spring counting effect on mount.
   * Only applies when `value` is a number. Default: false
   */
  animateValue?: boolean;
  /** Fade card in on mount. Default: false */
  animateEntrance?: boolean;
  className?: string;
  ref?: React.Ref<HTMLDivElement>;
}

/**
 * RoboStatCard — A metric display card that shows a key value with optional
 * trend indicator.
 *
 * All colors come from CSS variable tokens — no hardcoded hex values.
 * Positive `change` displays a green up-arrow; negative displays a red
 * down-arrow.
 *
 * @example
 * ```tsx
 * <RoboStatCard
 *   label="Active Satellites"
 *   value={142}
 *   change={8.4}
 *   changeLabel="vs last month"
 *   icon={<ShipIcon />}
 * />
 * ```
 */
function RoboStatCard({ label, value, change, changeLabel, icon, isLoading = false, animateValue = false, animateEntrance = false, className, ref }: RoboStatCardProps) {
    const hasChange = change !== undefined;
    const isPositive = hasChange && change >= 0;

    if (isLoading) {
      // Deliberately NOT animated: the entrance fade should play when real data
      // arrives (the loading→loaded swap mounts RoboFadeIn), not on the skeleton.
      return (
        <RoboCard
          ref={ref}
          aria-busy='true'
          aria-label='Loading'
          className={cn('relative flex flex-col gap-3 px-5 py-4', className)}
        >
          <RoboSkeletonLoading variant='text' width='45%' />
          <RoboSkeletonLoading variant='rect' height={32} width='55%' />
          <RoboSkeletonLoading variant='text' width={96} />
        </RoboCard>
      );
    }

    return (
      <RoboCard
        ref={ref}
        animateEntrance={animateEntrance}
        className={cn('relative flex flex-col gap-2 px-5 py-4', className)}
      >
        {/* Top row: label + icon */}
        <div className='flex items-start justify-between gap-2'>
          <p
            style={{
              color: 'var(--secondary-text)',
              fontSize: '0.75rem',
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {label}
          </p>
          {icon !== undefined && (
            <span
              aria-hidden='true'
              style={{ color: 'var(--secondary-text)', flexShrink: 0 }}
            >
              {icon}
            </span>
          )}
        </div>

        {/* Value */}
        <p
          style={{
            color: 'var(--foreground)',
            fontSize: '2rem',
            fontWeight: 700,
            lineHeight: 1,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {animateValue && typeof value === 'number' ? (
            <RoboNumberTicker value={value} />
          ) : (
            value
          )}
        </p>

        {/* Change indicator */}
        {hasChange && (
          <div className='flex items-center gap-1' aria-live='polite'>
            {/* Arrow */}
            <span
              aria-hidden='true'
              style={{
                color: isPositive
                  ? 'var(--success-text)'
                  : 'var(--destructive-text)',
                fontSize: '0.875rem',
                fontWeight: 700,
              }}
            >
              {isPositive ? '↑' : '↓'}
            </span>
            <span
              style={{
                color: isPositive
                  ? 'var(--success-text)'
                  : 'var(--destructive-text)',
                fontSize: '0.875rem',
                fontWeight: 600,
              }}
              aria-label={`${isPositive ? 'Up' : 'Down'} ${Math.abs(change)}%${changeLabel ? ` ${changeLabel}` : ''}`}
            >
              {Math.abs(change).toFixed(1)}%
            </span>
            {changeLabel !== undefined && (
              <span
                style={{
                  color: 'var(--secondary-text)',
                  fontSize: '0.75rem',
                }}
              >
                {changeLabel}
              </span>
            )}
          </div>
        )}
      </RoboCard>
    );
}
RoboStatCard.displayName = 'RoboStatCard';

export { RoboStatCard };
