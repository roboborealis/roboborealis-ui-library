import * as React from 'react';

import { cn } from '@/lib/utils';

export interface RoboSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Orientation of the separator line */
  orientation?: 'horizontal' | 'vertical';
  /** Optional centered label text for horizontal separators */
  label?: string;
  ref?: React.Ref<HTMLDivElement>;
}

/**
 * RoboSeparator — visual divider between content sections.
 *
 * Horizontal (default): a full-width line with an optional centered label.
 * Vertical: a 1px line that stretches to fill its container.
 *
 * @example
 * ```tsx
 * <RoboSeparator />
 * <RoboSeparator orientation="vertical" />
 * <RoboSeparator label="Or continue with" />
 * ```
 */
function RoboSeparator({ className, orientation = 'horizontal', label, ref, ...props }: RoboSeparatorProps) {
    if (orientation === 'vertical') {
      return (
        <div
          ref={ref}
          role='separator'
          aria-orientation='vertical'
          className={cn('w-px self-stretch bg-[var(--border)]', className)}
          {...props}
        />
      );
    }

    if (!label) {
      return (
        <div
          ref={ref}
          role='separator'
          aria-orientation='horizontal'
          className={cn('h-px bg-[var(--border)]', className)}
          {...props}
        />
      );
    }

    return (
      <div
        ref={ref}
        role='separator'
        aria-orientation='horizontal'
        className={cn('flex items-center gap-3', className)}
        {...props}
      >
        <div className='flex-1 h-px bg-[var(--border)]' />
        <span className='text-xs text-[var(--secondary-text)] shrink-0'>
          {label}
        </span>
        <div className='flex-1 h-px bg-[var(--border)]' />
      </div>
    );
}
RoboSeparator.displayName = 'RoboSeparator';

export { RoboSeparator };
