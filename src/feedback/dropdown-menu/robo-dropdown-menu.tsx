import * as React from 'react';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';

import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Primitives — re-exported with Robo naming
// ---------------------------------------------------------------------------

/** Root dropdown menu — controls open/closed state. */
const RoboDropdownMenu = DropdownMenuPrimitive.Root;
RoboDropdownMenu.displayName = 'RoboDropdownMenu';

/** The element that opens the menu on click. Pass `asChild` to use your own trigger element. */
const RoboDropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
RoboDropdownMenuTrigger.displayName = 'RoboDropdownMenuTrigger';

// ---------------------------------------------------------------------------
// RoboDropdownMenuContent
// ---------------------------------------------------------------------------

/**
 * RoboDropdownMenuContent — the floating menu panel rendered on open.
 *
 * - Click trigger to open/close (Radix default).
 * - ESC closes, arrow keys navigate items (Radix handles).
 * - Focus trap when open (Radix handles).
 */
function RoboDropdownMenuContent({
  className,
  align = 'end',
  sideOffset = 8,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content> & {
  ref?: React.Ref<React.ComponentRef<typeof DropdownMenuPrimitive.Content>>;
}) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        ref={ref}
        align={align}
        sideOffset={sideOffset}
        className={cn(
          'z-50 min-w-[10rem] rounded-lg border border-[var(--border)] bg-[var(--card)] p-1 shadow-lg',
          'data-[state=open]:animate-in data-[state=closed]:animate-out',
          'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
          'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
          'data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2',
          className
        )}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  );
}
RoboDropdownMenuContent.displayName = 'RoboDropdownMenuContent';

// ---------------------------------------------------------------------------
// RoboDropdownMenuItem
// ---------------------------------------------------------------------------

export interface RoboDropdownMenuItemProps
  extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> {
  /** Use 'destructive' for actions like "Sign out" or "Delete". */
  variant?: 'default' | 'destructive';
  ref?: React.Ref<React.ComponentRef<typeof DropdownMenuPrimitive.Item>>;
}

function RoboDropdownMenuItem({ className, variant = 'default', ref, ...props }: RoboDropdownMenuItemProps) {
  return (
    <DropdownMenuPrimitive.Item
      ref={ref}
      className={cn(
        'flex cursor-pointer select-none items-center gap-2 rounded-[var(--radius-sm)] px-2 py-1.5 text-sm outline-none',
        'transition-colors duration-[var(--duration-fast)]',
        'data-[highlighted]:bg-[var(--accent)] data-[highlighted]:text-[var(--accent-foreground)]',
        'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        variant === 'destructive'
          ? 'text-[var(--destructive)] data-[highlighted]:bg-[var(--destructive)] data-[highlighted]:text-[var(--destructive-foreground)]'
          : 'text-[var(--foreground)]',
        className
      )}
      {...props}
    />
  );
}
RoboDropdownMenuItem.displayName = 'RoboDropdownMenuItem';

// ---------------------------------------------------------------------------
// RoboDropdownMenuLabel / RoboDropdownMenuSeparator
// ---------------------------------------------------------------------------

function RoboDropdownMenuLabel({
  className,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
  ref?: React.Ref<React.ComponentRef<typeof DropdownMenuPrimitive.Label>>;
}) {
  return (
    <DropdownMenuPrimitive.Label
      ref={ref}
      className={cn(
        'px-2 py-1.5 text-xs font-medium uppercase tracking-wider text-[var(--muted-foreground)]',
        className
      )}
      {...props}
    />
  );
}
RoboDropdownMenuLabel.displayName = 'RoboDropdownMenuLabel';

function RoboDropdownMenuSeparator({
  className,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator> & {
  ref?: React.Ref<React.ComponentRef<typeof DropdownMenuPrimitive.Separator>>;
}) {
  return (
    <DropdownMenuPrimitive.Separator
      ref={ref}
      className={cn('-mx-1 my-1 h-px bg-[var(--border)]', className)}
      {...props}
    />
  );
}
RoboDropdownMenuSeparator.displayName = 'RoboDropdownMenuSeparator';

export {
  RoboDropdownMenu,
  RoboDropdownMenuTrigger,
  RoboDropdownMenuContent,
  RoboDropdownMenuItem,
  RoboDropdownMenuLabel,
  RoboDropdownMenuSeparator,
};
