import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from '@radix-ui/react-slot';

import { cn } from '@/lib/utils';
import { usePointerGlow, mergePointerGlow } from '@/lib/use-pointer-glow';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-[var(--radius)] font-medium transition-colors duration-[var(--duration-fast)] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        default:
          'bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)]',
        secondary:
          'bg-[var(--secondary)] text-[var(--secondary-foreground)] hover:opacity-90',
        tertiary:
          'bg-[var(--tertiary)] text-[var(--tertiary-foreground)] hover:opacity-90',
        // --primary-text, not --primary. These two draw the label straight onto
        // whatever surface is behind them, and --primary is tuned to carry white
        // text as a fill, not to BE text: it measured 2.38:1 on Global's dark card,
        // which is what made the editor toolbar's icons unreadable. --primary-text
        // is the same hue lightened (dark mode) or darkened (light) to clear 4.5:1
        // on card/background/popover, matching the existing --destructive-text and
        // --success-text pattern.
        ghost:
          'bg-transparent text-[var(--primary-text)] hover:bg-[var(--accent)]',
        destructive:
          'bg-[var(--destructive)] text-[var(--destructive-foreground)] hover:opacity-90',
        outline:
          'border border-[var(--primary)] bg-transparent text-[var(--primary-text)] hover:bg-[var(--accent)]',
      },
      size: {
        sm: 'h-[var(--btn-h-sm)] px-[var(--btn-px-sm)] text-xs min-w-[64px]',
        md: 'h-[var(--btn-h-md)] px-[var(--btn-px-md)] text-sm min-w-[80px]',
        lg: 'h-[var(--btn-h-lg)] px-[var(--btn-px-lg)] text-base min-w-[96px]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export const BUTTON_VARIANTS = ['default', 'secondary', 'tertiary', 'ghost', 'destructive', 'outline'] as const;
export const BUTTON_SIZES = ['sm', 'md', 'lg'] as const;
export type ButtonVariant = typeof BUTTON_VARIANTS[number];
export type ButtonSize = typeof BUTTON_SIZES[number];

export interface RoboButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Render as a child element (useful for link-as-button patterns via Radix Slot) */
  asChild?: boolean;
  ref?: React.Ref<HTMLButtonElement>;
}

/**
 * RoboButton — branded button component.
 *
 * All colors use CSS variable tokens from theme-aurora.css.
 * No hardcoded hex values. Fully accessible (WCAG 2.1 AA).
 *
 * @example
 * ```tsx
 * <RoboButton>Click me</RoboButton>
 * <RoboButton variant="secondary">Secondary</RoboButton>
 * <RoboButton variant="tertiary">Tertiary</RoboButton>
 * <RoboButton variant="outline" size="lg">Outlined Large</RoboButton>
 * <RoboButton variant="destructive">Delete</RoboButton>
 * <RoboButton asChild><a href="/path">Link</a></RoboButton>
 * ```
 */
function RoboButton({
  className,
  variant,
  size,
  asChild = false,
  type,
  ref,
  onPointerMove,
  ...props
}: RoboButtonProps) {
  const Comp = asChild ? Slot : 'button';
  const { onPointerMove: glowMove } = usePointerGlow<HTMLButtonElement>();

  return (
    <Comp
      ref={ref}
      data-slot='button'
      data-glow
      data-variant={variant}
      data-size={size}
      type={asChild ? type : (type ?? 'button')}
      className={cn(buttonVariants({ variant, size }), className)}
      onPointerMove={mergePointerGlow(glowMove, onPointerMove)}
      {...props}
    />
  );
}
RoboButton.displayName = 'RoboButton';

export { RoboButton, buttonVariants };
