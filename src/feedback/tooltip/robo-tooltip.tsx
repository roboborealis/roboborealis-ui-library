import * as React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';

import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Primitives — re-exported with Robo naming
// ---------------------------------------------------------------------------

/** Default hover delay (ms) before a tooltip opens, kept short so hints feel instant. */
export const DEFAULT_TOOLTIP_DELAY_MS = 150;

/** Wraps your app (or a subtree) to enable tooltip functionality. */
function RoboTooltipProvider({
  delayDuration = DEFAULT_TOOLTIP_DELAY_MS,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return <TooltipPrimitive.Provider delayDuration={delayDuration} {...props} />;
}
RoboTooltipProvider.displayName = 'RoboTooltipProvider';

/** Root tooltip — controls open/closed state. */
const RoboTooltip = TooltipPrimitive.Root;
RoboTooltip.displayName = 'RoboTooltip';

/** The element that triggers the tooltip on hover/focus. */
const RoboTooltipTrigger = TooltipPrimitive.Trigger;
RoboTooltipTrigger.displayName = 'RoboTooltipTrigger';

// ---------------------------------------------------------------------------
// RoboTooltipContent
// ---------------------------------------------------------------------------

/**
 * RoboTooltipContent — the tooltip bubble.
 *
 * - Small, dark text bubble using CSS variable tokens.
 * - Radix handles: positioning, collision detection, `role="tooltip"`, `aria-describedby`.
 */
function RoboTooltipContent({
  className,
  sideOffset = 6,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> & {
  ref?: React.Ref<React.ComponentRef<typeof TooltipPrimitive.Content>>;
}) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        className={cn(
          'z-50 rounded px-2 py-1 text-xs bg-[var(--foreground)] text-[var(--background)] shadow-md',
          'data-[state=delayed-open]:data-[side=top]:animate-in',
          'data-[state=delayed-open]:data-[side=bottom]:animate-in',
          'data-[state=delayed-open]:slide-in-from-bottom-1',
          'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
          'duration-[var(--duration-fast)]',
          className
        )}
        {...props}
      />
    </TooltipPrimitive.Portal>
  );
}
RoboTooltipContent.displayName = 'RoboTooltipContent';

export {
  RoboTooltipProvider,
  RoboTooltip,
  RoboTooltipTrigger,
  RoboTooltipContent,
};
