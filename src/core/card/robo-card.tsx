import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import { usePointerGlow, mergePointerGlow } from '@/lib/use-pointer-glow';
import { RoboFadeIn } from '@/animations';

const cardVariants = cva('rounded-[var(--radius-lg)]', {
  variants: {
    variant: {
      default:
        'bg-[var(--card)] text-[var(--card-foreground)] shadow-[var(--shadow-md)] border border-[var(--border)]',
      outlined:
        'bg-[var(--card)] border-2 border-[var(--border)]',
      elevated:
        'bg-[var(--card)] shadow-[var(--shadow-lg)]',
      ghost:
        'bg-transparent',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export const CARD_VARIANTS = ['default', 'outlined', 'elevated', 'ghost'] as const;
export type CardVariant = typeof CARD_VARIANTS[number];

export interface RoboCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  /** Adds hover shadow transition and cursor-pointer */
  hoverable?: boolean;
  /** Fade card in on mount. Default: false */
  animateEntrance?: boolean;
  ref?: React.Ref<HTMLDivElement>;
}

/**
 * RoboCard — container card with header/body/footer slot pattern.
 *
 * When `onClick` is provided the card renders as an interactive element with
 * `role="button"`, `tabIndex=0`, and keyboard activation (Enter/Space), so
 * keyboard-only and screen-reader users can activate it.
 *
 * @example
 * ```tsx
 * <RoboCard variant="elevated" hoverable>
 *   <RoboCardHeader>Title</RoboCardHeader>
 *   <RoboCardBody>Content goes here</RoboCardBody>
 *   <RoboCardFooter>Actions</RoboCardFooter>
 * </RoboCard>
 * ```
 */
function RoboCard({ className, variant, hoverable, onClick, onKeyDown, onPointerMove, animateEntrance = false, ref, ...props }: RoboCardProps) {
  const isInteractive = Boolean(onClick);
  const { onPointerMove: glowMove } = usePointerGlow<HTMLDivElement>();

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        e.currentTarget.click();
      }
      onKeyDown?.(e);
    };

    const card = (
      <div
        ref={ref}
        data-slot='card'
        data-glow
        role={isInteractive ? 'button' : undefined}
        tabIndex={isInteractive ? 0 : undefined}
        onClick={onClick}
        onKeyDown={isInteractive ? handleKeyDown : onKeyDown}
        onPointerMove={mergePointerGlow(glowMove, onPointerMove)}
        className={cn(
          '@container',
          cardVariants({ variant }),
          hoverable && 'transition-shadow hover:shadow-[var(--shadow-lg)] cursor-pointer',
          isInteractive &&
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 cursor-pointer',
          className
        )}
        {...props}
      />
    );

    return animateEntrance ? <RoboFadeIn preset='standard'>{card}</RoboFadeIn> : card;
}
RoboCard.displayName = 'RoboCard';

/**
 * RoboCardHeader — top section of a card, typically holds a title.
 */
function RoboCardHeader({
  className,
  ref,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> }) {
  return (
    <div
      ref={ref}
      className={cn('flex flex-col gap-1 p-[var(--card-p)] pb-0', className)}
      {...props}
    />
  );
}
RoboCardHeader.displayName = 'RoboCardHeader';

/**
 * RoboCardBody — main content area of a card.
 */
function RoboCardBody({
  className,
  ref,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> }) {
  return (
    <div
      ref={ref}
      className={cn('p-[var(--card-p)]', className)}
      {...props}
    />
  );
}
RoboCardBody.displayName = 'RoboCardBody';

/**
 * RoboCardFooter — bottom section of a card, typically holds actions.
 */
function RoboCardFooter({
  className,
  ref,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> }) {
  return (
    <div
      ref={ref}
      className={cn('flex items-center p-[var(--card-p)] pt-0', '@max-[280px]:flex-col', className)}
      {...props}
    />
  );
}
RoboCardFooter.displayName = 'RoboCardFooter';

export { RoboCard, RoboCardHeader, RoboCardBody, RoboCardFooter, cardVariants };
