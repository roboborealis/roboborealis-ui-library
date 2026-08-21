'use client';

import * as React from 'react';
import * as Accordion from '@radix-ui/react-accordion';
import { ChevronDown, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import type { StorageAdapter } from '@/core/storage-adapter';
import { RoboStagger } from '@/animations';
import { useRoboRouterAdapter } from '@/navigation/router-adapter';
import {
  RoboTooltipProvider,
  RoboTooltip,
  RoboTooltipTrigger,
  RoboTooltipContent,
} from '@/feedback/tooltip/robo-tooltip';

export interface RoboSidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href?: string;
  children?: RoboSidebarItem[];
  /** Called when a non-link, non-group item is activated (ignored if `href` or `children` is set) */
  onSelect?: () => void;
}

const sidebarVariants = cva(
  'flex flex-col h-full bg-[var(--card)] border-r border-[var(--border)] transition-[width] duration-[var(--duration-normal)] overflow-hidden',
  {
    variants: {
      collapsed: {
        true: 'w-16',
        false: 'w-56',
      },
    },
    defaultVariants: {
      collapsed: false,
    },
  }
);

export interface RoboSidebarProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'children'>,
    Omit<VariantProps<typeof sidebarVariants>, 'collapsed'> {
  items: RoboSidebarItem[];
  /**
   * Brand/home mark pinned above the scrollable nav list. Rendered at a
   * fixed size regardless of collapsed state; pass an icon-only mark that
   * reads fine at the rail's compact width. Purely decorative unless
   * `logoHref` is set — give the content itself an accessible name (e.g. an
   * `<img alt="...">`) since the link wrapper carries none of its own.
   */
  logo?: React.ReactNode;
  /** When set, wraps `logo` in a router link to this path (e.g. `/home`) — click-to-home. Omit to keep the logo purely decorative. */
  logoHref?: string;
  /** Items pinned below the scrollable list, above the built-in collapse toggle (e.g. Settings) */
  footerItems?: RoboSidebarItem[];
  activePath?: string;
  storageAdapter?: StorageAdapter;
  storageKey?: string;
  /** Controls collapse state. Omit to let the sidebar manage its own state internally. */
  collapsed?: boolean;
  /** Called whenever the built-in collapse toggle is clicked, whether or not `collapsed` is controlled. */
  onCollapsedChange?: (collapsed: boolean) => void;
  /** Section label shown above footerItems when the sidebar is expanded */
  footerLabel?: string;
  /** Called whenever the collapsed state changes */
  onCollapseChange?: (collapsed: boolean) => void;
  /** Stagger-animate nav items in on mount. Default: false */
  animateItems?: boolean;
  ref?: React.Ref<HTMLElement>;
}

function SidebarNavItem({
  item,
  activePath,
  isCollapsed,
  depth = 0,
  openGroups,
  onGroupToggle,
}: {
  item: RoboSidebarItem;
  activePath?: string;
  isCollapsed: boolean;
  depth?: number;
  openGroups: Set<string>;
  onGroupToggle: (id: string) => void;
}) {
  const { Link: RouterLink, usePathname } = useRoboRouterAdapter();
  const routerPathname = usePathname();
  const effectiveActivePath = activePath ?? (routerPathname || undefined);
  const isActive = item.href ? effectiveActivePath === item.href : false;
  const hasChildren = item.children && item.children.length > 0;

  const itemClasses = cn(
    'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium w-full cursor-pointer',
    'transition-colors duration-[var(--duration-fast)]',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-1',
    'hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]',
    isActive
      ? 'bg-[var(--accent)] text-[var(--accent-foreground)]'
      : 'text-[var(--foreground)]',
    isCollapsed && 'justify-center px-2',
    depth > 0 && !isCollapsed && 'ml-6 w-[calc(100%-1.5rem)]'
  );

  const content = (
    <span
      className={cn('flex items-center gap-3', isCollapsed && 'justify-center')}
    >
      <span className='flex-shrink-0 w-5 h-5 flex items-center justify-center'>
        {item.icon}
      </span>
      {!isCollapsed && (
        <span className='flex-1 truncate text-left'>{item.label}</span>
      )}
      {!isCollapsed && hasChildren && (
        <ChevronDown
          className={cn(
            'w-4 h-4 flex-shrink-0 transition-transform duration-[var(--duration-normal)]',
            openGroups.has(item.id) && 'rotate-180'
          )}
        />
      )}
    </span>
  );

  if (hasChildren) {
    return (
      <Accordion.Item value={item.id}>
        <Accordion.Trigger
          className={itemClasses}
          aria-expanded={openGroups.has(item.id)}
          onClick={() => onGroupToggle(item.id)}
        >
          {content}
        </Accordion.Trigger>
        <Accordion.Content>
          {!isCollapsed && (
            <div className='mt-0.5 space-y-0.5'>
              {item.children!.map((child) => (
                <SidebarNavItem
                  key={child.id}
                  item={child}
                  activePath={activePath}
                  isCollapsed={isCollapsed}
                  depth={depth + 1}
                  openGroups={openGroups}
                  onGroupToggle={onGroupToggle}
                />
              ))}
            </div>
          )}
        </Accordion.Content>
      </Accordion.Item>
    );
  }

  const linkEl = item.href ? (
    <RouterLink
      to={item.href}
      className={itemClasses}
      aria-current={isActive ? 'page' : undefined}
    >
      {content}
    </RouterLink>
  ) : (
    <button
      type='button'
      className={itemClasses}
      aria-current={isActive ? 'page' : undefined}
      onClick={item.onSelect}
    >
      {content}
    </button>
  );

  if (isCollapsed) {
    return (
      <RoboTooltip>
        <RoboTooltipTrigger asChild>{linkEl}</RoboTooltipTrigger>
        <RoboTooltipContent side='right' sideOffset={8}>
          {item.label}
        </RoboTooltipContent>
      </RoboTooltip>
    );
  }

  return linkEl;
}

/**
 * RoboSidebar — collapsible side navigation with accordion groups and tooltip support.
 *
 * Collapses to a persistent icon-only rail via the built-in toggle button —
 * a plain click-to-toggle model (no hover-preview, no overlay), matching
 * shadcn's sidebar "icon" collapsible mode. `collapsed`/`onCollapsedChange`
 * control the state directly.
 *
 * **`storageAdapter` applies to UNCONTROLLED use only.** Pass `collapsed` and the
 * component defers to you entirely — it will neither read nor write storage, because
 * a controlled component does not own its own state. Pick one:
 *
 * - *Uncontrolled + `storageAdapter`* — simplest; the rail remembers itself.
 * - *Controlled `collapsed` + `onCollapsedChange`* — for apps that persist elsewhere,
 *   e.g. a cookie the server reads so the first paint is already correct. Do not also
 *   pass `storageAdapter`; it will do nothing.
 *
 * @example Uncontrolled, remembers itself
 * ```tsx
 * <RoboSidebar
 *   items={navItems}
 *   activePath="/dashboard"
 *   storageAdapter={createLocalStorageAdapter()}
 *   storageKey="sidebar-state"
 * />
 * ```
 *
 * @example Controlled by the app
 * ```tsx
 * <RoboSidebar
 *   items={navItems}
 *   activePath="/dashboard"
 *   collapsed={collapsed}
 *   onCollapsedChange={setCollapsed}
 * />
 * ```
 */
function RoboSidebar({
  className,
  items,
  logo,
  logoHref,
  footerItems,
  activePath,
  storageAdapter,
  storageKey = 'robo-sidebar-collapsed',
  collapsed: collapsedProp,
  onCollapsedChange,
  footerLabel,
  onCollapseChange,
  animateItems = false,
  ref,
  ...props
}: RoboSidebarProps) {
  const { Link: RouterLink } = useRoboRouterAdapter();
  const isControlled = collapsedProp !== undefined;

  const [internalCollapsed, setInternalCollapsed] = React.useState<boolean>(() => {
    if (storageAdapter) {
      const stored = storageAdapter.get(storageKey);
      return stored === 'true';
    }
    return false;
  });

  const isCollapsed = collapsedProp ?? internalCollapsed;

  const [openGroups, setOpenGroups] = React.useState<Set<string>>(() => {
    if (storageAdapter) {
      const stored = storageAdapter.get(`${storageKey}-groups`);
      if (stored) {
        try {
          return new Set<string>(JSON.parse(stored) as string[]);
        } catch {
          // ignore parse errors
        }
      }
    }
    return new Set<string>();
  });

  const handleToggleCollapse = () => {
    const next = !isCollapsed;
    if (!isControlled) {
      setInternalCollapsed(next);
    }
    /*
     * Only persist when UNCONTROLLED.
     *
     * `storageAdapter` is read into `internalCollapsed`, which `isCollapsed` ignores
     * whenever `collapsed` is supplied — correct controlled semantics: if you control
     * the state, you own persisting it. But the write used to happen regardless, so a
     * controlled consumer got a second writer to its own key, behind its back and with
     * no reader. It looked like the adapter worked (the value appeared in storage) while
     * the component would never honour it, and a consumer persisting the same state
     * itself ended up with two sources of truth for one setting.
     *
     * a consumer app hit exactly that: it passed a storageAdapter, rendered controlled, and
     * had to move persistence into its own provider once the value never came back.
     */
    if (storageAdapter && !isControlled) {
      storageAdapter.set(storageKey, String(next));
    }
    onCollapsedChange?.(next);
    onCollapseChange?.(next);
  };

  const handleGroupToggle = (id: string) => {
    setOpenGroups((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      if (storageAdapter) {
        storageAdapter.set(`${storageKey}-groups`, JSON.stringify([...next]));
      }
      return next;
    });
  };

  const isExpanded = !isCollapsed;

  const toggleButton = (
    <RoboTooltip>
      <RoboTooltipTrigger asChild>
        <button
          type='button'
          onClick={handleToggleCollapse}
          aria-expanded={isExpanded}
          aria-label={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
          className={cn(
            'flex items-center gap-3 w-full h-10 px-3 rounded-md',
            'text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--accent)]',
            'transition-colors duration-[var(--duration-fast)]',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-1',
            !isExpanded && 'justify-center px-2'
          )}
        >
          <span className='flex-shrink-0 w-5 h-5 flex items-center justify-center'>
            {isExpanded ? <PanelLeftClose className='w-5 h-5' /> : <PanelLeftOpen className='w-5 h-5' />}
          </span>
          {isExpanded && (
            <span className='flex-1 truncate text-left text-sm font-medium'>
              {isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
            </span>
          )}
        </button>
      </RoboTooltipTrigger>
      <RoboTooltipContent side='right' sideOffset={8}>
        {isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
      </RoboTooltipContent>
    </RoboTooltip>
  );

  const renderNavContent = (isCollapsedForRender: boolean) => (
    <>
      {logo && (
        <div className='flex items-center justify-center h-14 border-b border-[var(--border)] flex-shrink-0'>
          {logoHref ? (
            <RouterLink
              to={logoHref}
              className='flex items-center justify-center w-full h-full rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-1'
            >
              {logo}
            </RouterLink>
          ) : (
            logo
          )}
        </div>
      )}

      <div className='flex-1 overflow-y-auto py-3 px-2 space-y-0.5'>
        <Accordion.Root
          type='multiple'
          value={[...openGroups]}
          className='space-y-0.5'
        >
          {animateItems ? (
            <RoboStagger>
              {items.map((item) => (
                <SidebarNavItem
                  key={item.id}
                  item={item}
                  activePath={activePath}
                  isCollapsed={isCollapsedForRender}
                  openGroups={openGroups}
                  onGroupToggle={handleGroupToggle}
                />
              ))}
            </RoboStagger>
          ) : (
            items.map((item) => (
              <SidebarNavItem
                key={item.id}
                item={item}
                activePath={activePath}
                isCollapsed={isCollapsedForRender}
                openGroups={openGroups}
                onGroupToggle={handleGroupToggle}
              />
            ))
          )}
        </Accordion.Root>
      </div>

      {footerItems && footerItems.length > 0 && (
        <div className='border-t border-[var(--border)] py-2 px-2 overflow-y-auto max-h-64 flex-shrink-0'>
          {!isCollapsedForRender && footerLabel && (
            <p className='px-3 py-1 mb-1 text-xs font-semibold uppercase tracking-widest text-[var(--muted-foreground)] select-none'>
              {footerLabel}
            </p>
          )}
          <Accordion.Root type='multiple' value={[...openGroups]} className='space-y-0.5'>
            {footerItems.map((item) => (
              <SidebarNavItem
                key={item.id}
                item={item}
                activePath={activePath}
                isCollapsed={isCollapsedForRender}
                openGroups={openGroups}
                onGroupToggle={handleGroupToggle}
              />
            ))}
          </Accordion.Root>
        </div>
      )}

      <div className='border-t border-[var(--border)] p-2 flex-shrink-0'>
        {toggleButton}
      </div>
    </>
  );

  return (
    <RoboTooltipProvider>
      <nav
        ref={ref}
        aria-label='Main navigation'
        className={cn(sidebarVariants({ collapsed: isCollapsed }), className)}
        {...props}
      >
        {renderNavContent(isCollapsed)}
      </nav>
    </RoboTooltipProvider>
  );
}
RoboSidebar.displayName = 'RoboSidebar';

export { RoboSidebar, sidebarVariants };
