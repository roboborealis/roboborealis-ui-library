import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const stackVariants = cva('', {
  variants: {
    direction: {
      vertical: 'flex-col',
      horizontal: 'flex-row',
    },
    gap: {
      none: 'gap-0',
      xs: 'gap-2',
      sm: 'gap-3',
      md: 'gap-4',
      lg: 'gap-6',
      xl: 'gap-8',
    },
    align: {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      stretch: 'items-stretch',
      baseline: 'items-baseline',
    },
    justify: {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      between: 'justify-between',
      around: 'justify-around',
      evenly: 'justify-evenly',
    },
  },
  defaultVariants: {
    direction: 'vertical',
    gap: 'md',
    align: 'stretch',
    justify: 'start',
  },
});

export const STACK_DIRECTIONS = ['vertical', 'horizontal'] as const;
export const STACK_GAPS = ['none', 'xs', 'sm', 'md', 'lg', 'xl'] as const;
export const STACK_ALIGNS = ['start', 'center', 'end', 'stretch', 'baseline'] as const;
export const STACK_JUSTIFIES = ['start', 'center', 'end', 'between', 'around', 'evenly'] as const;
export type StackDirection = typeof STACK_DIRECTIONS[number];
export type StackGap = typeof STACK_GAPS[number];
export type StackAlign = typeof STACK_ALIGNS[number];
export type StackJustify = typeof STACK_JUSTIFIES[number];

export interface RoboStackProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof stackVariants> {
  /** When true, adds `flex-wrap` to allow items to wrap. Default: false. */
  wrap?: boolean;
  /** When true, uses `inline-flex` instead of `flex`. Default: false. */
  inline?: boolean;
  ref?: React.Ref<HTMLDivElement>;
}

/**
 * RoboStack — Flexbox stack container with direction, gap, alignment, and wrap support.
 *
 * @example
 * ```tsx
 * <RoboStack direction="horizontal" gap="sm" align="center" justify="between">
 *   <span>Left</span>
 *   <span>Right</span>
 * </RoboStack>
 * ```
 */
function RoboStack({
  className,
  direction,
  gap,
  align,
  justify,
  wrap = false,
  inline = false,
  children,
  ref,
  ...props
}: RoboStackProps) {
  return (
    <div
      ref={ref}
      data-slot='stack'
      className={cn(
        inline ? 'inline-flex' : 'flex',
        stackVariants({ direction, gap, align, justify }),
        wrap && 'flex-wrap',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
RoboStack.displayName = 'RoboStack';

export { RoboStack, stackVariants };
