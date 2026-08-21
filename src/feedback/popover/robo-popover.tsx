import * as React from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

import { cn } from '@/lib/utils';
import { useControllableState } from '@/lib/use-controllable-state';
import { buildPresets } from '../../animations/config/animation-presets';
import { useAnimationTokens } from '../../animations/config/use-animation-tokens';

// ---------------------------------------------------------------------------
// Open-state context — lets RoboPopoverContent gate its own AnimatePresence
// mount/unmount instead of relying on Radix's CSS-transition-based Presence
// (this repo has no tailwindcss-animate plugin, so data-[state] driven
// animate-in/out classes are no-ops; motion/react needs a real boolean).
// ---------------------------------------------------------------------------

const RoboPopoverOpenContext = React.createContext(false);

// ---------------------------------------------------------------------------
// Primitives — re-exported with Robo naming
// ---------------------------------------------------------------------------

export type RoboPopoverProps = React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Root>;

/** Root popover — controls open/closed state. Pass `modal` to change focus-trap behavior. */
function RoboPopover({ open, defaultOpen, onOpenChange, children, ...props }: RoboPopoverProps) {
  const [resolvedOpen, handleOpenChange] = useControllableState({
    prop: open,
    defaultProp: defaultOpen ?? false,
    onChange: onOpenChange,
  });

  return (
    <RoboPopoverOpenContext value={resolvedOpen}>
      <PopoverPrimitive.Root open={resolvedOpen} onOpenChange={handleOpenChange} {...props}>
        {children}
      </PopoverPrimitive.Root>
    </RoboPopoverOpenContext>
  );
}
RoboPopover.displayName = 'RoboPopover';

/** The element that opens the popover on click. */
const RoboPopoverTrigger = PopoverPrimitive.Trigger;
RoboPopoverTrigger.displayName = 'RoboPopoverTrigger';

/** Close button inside the popover. */
const RoboPopoverClose = PopoverPrimitive.Close;
RoboPopoverClose.displayName = 'RoboPopoverClose';

/**
 * Virtual or real anchor point the popover positions itself against,
 * independent of the trigger — e.g. a zero-size element placed at a map
 * click's pixel coordinate, so the popover opens without a DOM trigger.
 */
const RoboPopoverAnchor = PopoverPrimitive.Anchor;
RoboPopoverAnchor.displayName = 'RoboPopoverAnchor';

// ---------------------------------------------------------------------------
// RoboPopoverContent
// ---------------------------------------------------------------------------

/**
 * RoboPopoverContent — the floating panel rendered on popover open.
 *
 * - Click trigger to open/close (Radix default).
 * - ESC closes (Radix handles).
 * - Focus trap when open (Radix handles).
 * - Collision detection and positioning handled by Radix.
 * - Fade + scale enter/exit via motion/react, gated by `RoboPopoverOpenContext`
 *   (see note above on why this repo can't rely on Radix's CSS Presence).
 */
function RoboPopoverContent({
  className,
  align = 'start',
  sideOffset = 8,
  children,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> & {
  ref?: React.Ref<React.ComponentRef<typeof PopoverPrimitive.Content>>;
}) {
  const open = React.use(RoboPopoverOpenContext);
  const tokens = useAnimationTokens();
  const presets = buildPresets(tokens);
  const reduced = useReducedMotion();

  return (
    <AnimatePresence>
      {open && (
        <PopoverPrimitive.Portal forceMount>
          <PopoverPrimitive.Content ref={ref} asChild forceMount align={align} sideOffset={sideOffset} {...props}>
            <motion.div
              data-slot='popover-content'
              className={cn(
                'z-50 w-72 rounded-lg border border-[var(--border)] bg-[var(--card)] p-4 shadow-lg',
                className
              )}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1, transition: reduced ? { duration: 0 } : presets.subtle.enter }}
              exit={{ opacity: 0, scale: 0.95, transition: reduced ? { duration: 0 } : presets.subtle.exit }}
            >
              {children}
            </motion.div>
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
      )}
    </AnimatePresence>
  );
}
RoboPopoverContent.displayName = 'RoboPopoverContent';

export { RoboPopover, RoboPopoverTrigger, RoboPopoverContent, RoboPopoverClose, RoboPopoverAnchor };
