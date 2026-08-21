import * as React from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';

import { cn } from '@/lib/utils';

// ── Root ────────────────────────────────────────────────────────────────────

/**
 * RoboAccordion — collapsible panel set built on Radix Accordion.
 * Supports `type="single"` (one panel at a time) and `type="multiple"`.
 *
 * @example
 * ```tsx
 * // Single (only one open at a time, collapsible)
 * <RoboAccordion type="single" collapsible>
 *   <RoboAccordionItem value="overview">
 *     <RoboAccordionTrigger>Overview</RoboAccordionTrigger>
 *     <RoboAccordionContent>Details here…</RoboAccordionContent>
 *   </RoboAccordionItem>
 * </RoboAccordion>
 *
 * // Multiple (several panels open simultaneously)
 * <RoboAccordion type="multiple">
 *   …items…
 * </RoboAccordion>
 * ```
 */
function RoboAccordion({ className, ref, ...props }: RoboAccordionProps) {
  return (
    <AccordionPrimitive.Root
      ref={ref}
      className={cn('w-full', className)}
      {...props}
    />
  );
}
RoboAccordion.displayName = 'RoboAccordion';

// ── Item ─────────────────────────────────────────────────────────────────────

function RoboAccordionItem({ className, ref, ...props }: RoboAccordionItemProps) {
  return (
    <AccordionPrimitive.Item
      ref={ref}
      className={cn('border-b border-[var(--border)] last:border-b-0', className)}
      {...props}
    />
  );
}
RoboAccordionItem.displayName = 'RoboAccordionItem';

// ── Trigger ───────────────────────────────────────────────────────────────────

interface AccordionTriggerExtendedProps
  extends React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> {
  /** Replaces the default chevron icon */
  icon?: React.ReactNode;
  ref?: React.Ref<React.ComponentRef<typeof AccordionPrimitive.Trigger>>;
}

function RoboAccordionTrigger({ className, icon, children, ref, ...props }: AccordionTriggerExtendedProps) {
  return (
    <AccordionPrimitive.Header className='flex'>
      <AccordionPrimitive.Trigger
        ref={ref}
        className={cn(
          'flex flex-1 items-center justify-between py-4 text-sm font-medium',
          'text-[var(--foreground)] transition-all',
          'hover:text-[var(--primary)]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-1 rounded-sm',
          '[&[data-state=open]>svg]:rotate-180',
          className
        )}
        {...props}
      >
        {children}
        {icon ?? (
          <ChevronDown
            aria-hidden='true'
            className='h-4 w-4 shrink-0 text-[var(--secondary-text)] transition-transform duration-[var(--duration-normal)]'
          />
        )}
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}
RoboAccordionTrigger.displayName = 'RoboAccordionTrigger';

// ── Content ───────────────────────────────────────────────────────────────────

function RoboAccordionContent({ className, children, ref, ...props }: RoboAccordionContentProps) {
  return (
    <AccordionPrimitive.Content
      ref={ref}
      className={cn(
        'overflow-hidden text-sm text-[var(--secondary-text)] bg-[var(--muted)]',
        'data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down',
        className
      )}
      {...props}
    >
      <div className='px-4 pb-4 pt-0'>{children}</div>
    </AccordionPrimitive.Content>
  );
}
RoboAccordionContent.displayName = 'RoboAccordionContent';

export type RoboAccordionProps = React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Root> & {
  ref?: React.Ref<React.ComponentRef<typeof AccordionPrimitive.Root>>;
};
export type RoboAccordionItemProps = React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item> & {
  ref?: React.Ref<React.ComponentRef<typeof AccordionPrimitive.Item>>;
};
export type RoboAccordionTriggerProps = AccordionTriggerExtendedProps;
export type RoboAccordionContentProps = React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content> & {
  ref?: React.Ref<React.ComponentRef<typeof AccordionPrimitive.Content>>;
};

export {
  RoboAccordion,
  RoboAccordionItem,
  RoboAccordionTrigger,
  RoboAccordionContent,
};
