import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const pageShellVariants = cva('min-h-screen bg-[var(--background)]', {
  variants: {
    variant: {
      default: '',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export interface RoboPageShellProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof pageShellVariants> {
  /** Optional sidebar slot — rendered on the left */
  sidebar?: React.ReactNode;
  /** Optional topbar slot — rendered at the top of the main area */
  topbar?: React.ReactNode;
  /** Main page content */
  children: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
}

/**
 * RoboPageShell — full viewport layout with optional sidebar and topbar.
 *
 * Uses CSS Grid to create a two-column layout (sidebar + main) when a sidebar
 * is provided. The main area uses flex-column with a sticky topbar and
 * scrollable content area.
 *
 * @example
 * ```tsx
 * <RoboPageShell sidebar={<RoboSidebar items={navItems} />} topbar={<RoboTopbar />}>
 *   <div className="p-6">Page content</div>
 * </RoboPageShell>
 * ```
 */
function RoboPageShell({ className, variant, sidebar, topbar, children, ref, ...props }: RoboPageShellProps) {
  return (
    <div
      ref={ref}
      className={cn(
        pageShellVariants({ variant }),
        sidebar ? 'grid grid-cols-[auto_1fr]' : 'grid grid-cols-1',
        className
      )}
      {...props}
    >
      {/* Sidebar column */}
      {sidebar && (
        // z-10: `sticky` always creates a stacking context (even at z-index:auto),
        // so without an explicit value here this column's z-index:auto loses the
        // outer stacking-order tie-break to whatever's later in the DOM — i.e. the
        // main content column, including any heavily-layered content it renders
        // (e.g. a WebGL canvas). That can trap a sidebar descendant's own
        // fixed-position content behind later-painted sibling content despite its
        // own higher z-index, since a child's z-index only wins within its nearest
        // stacking-context ancestor, not against sibling contexts outside it. An
        // explicit z-index here fixes that at the source, and remains needed for
        // any sidebar-adjacent floating UI (e.g. tooltips).
        <div className='h-screen sticky top-0 z-10 overflow-hidden' data-slot='sidebar'>
          {sidebar}
        </div>
      )}

      {/* Main area */}
      <div className='flex flex-col min-h-screen overflow-hidden' data-slot='main'>
        {/* Topbar */}
        {topbar && (
          <div className='flex-shrink-0' data-slot='topbar'>
            {topbar}
          </div>
        )}

        {/* Scrollable content */}
        <main
          className='flex-1 overflow-y-auto'
          data-slot='content'
        >
          {children}
        </main>
      </div>
    </div>
  );
}
RoboPageShell.displayName = 'RoboPageShell';

export { RoboPageShell, pageShellVariants };
