import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// RoboKbd — keyboard shortcut chip on a semantic <kbd> element.
// Extracted from the command palette's inline styling so shortcut hints look
// identical everywhere (menus, tooltips, docs, settings pages).
// ---------------------------------------------------------------------------

const kbdVariants = cva(
  'inline-flex items-center gap-0.5 rounded border border-[var(--border)] bg-[var(--muted)] font-mono text-[var(--secondary-text)]',
  {
    variants: {
      size: {
        sm: 'px-1 py-px text-[10px]',
        md: 'px-1.5 py-0.5 text-xs',
      },
    },
    defaultVariants: {
      size: 'sm',
    },
  }
);

export const KBD_SIZES = ['sm', 'md'] as const;
export type KbdSize = (typeof KBD_SIZES)[number];

export interface RoboKbdProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof kbdVariants> {
  ref?: React.Ref<HTMLElement>;
}

/**
 * RoboKbd — keyboard key / shortcut indicator.
 *
 * @example
 * ```tsx
 * <RoboKbd>⌘K</RoboKbd>
 * <RoboKbd size="md">Ctrl</RoboKbd> + <RoboKbd size="md">S</RoboKbd>
 * ```
 */
function RoboKbd({ className, size, ref, ...props }: RoboKbdProps) {
  return (
    <kbd
      ref={ref}
      data-slot="kbd"
      className={cn(kbdVariants({ size }), className)}
      {...props}
    />
  );
}
RoboKbd.displayName = 'RoboKbd';

export { RoboKbd };
