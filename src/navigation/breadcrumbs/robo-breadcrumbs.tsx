'use client';

import * as React from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { ChevronRight, MoreHorizontal } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import { useRoboRouterAdapter } from '@/navigation/router-adapter';

const breadcrumbsVariants = cva('flex items-center flex-wrap gap-0', {
  variants: {
    variant: {
      default: '',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export interface RoboBreadcrumbItem {
  label: string;
  href?: string;
}

export interface RoboBreadcrumbsProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'children'>,
    VariantProps<typeof breadcrumbsVariants> {
  items: RoboBreadcrumbItem[];
  /** Maximum number of items to display before collapsing. Default: 4 */
  maxItems?: number;
  /** Stagger-fade items in on mount. Default: false */
  animate?: boolean;
  ref?: React.Ref<HTMLElement>;
}

const linkClasses = cn(
  'text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)]',
  'transition-colors duration-[var(--duration-fast)] underline-offset-4 hover:underline',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-1 rounded-sm'
);

const currentClasses = 'text-sm font-medium text-[var(--foreground)]';

function BreadcrumbLink({ item }: { item: RoboBreadcrumbItem }) {
  const { Link: RouterLink } = useRoboRouterAdapter();
  if (item.href) {
    return (
      <RouterLink to={item.href} className={linkClasses}>
        {item.label}
      </RouterLink>
    );
  }
  return <span className={linkClasses}>{item.label}</span>;
}

function BreadcrumbSeparator() {
  return (
    <span aria-hidden='true' className='flex items-center px-1 text-[var(--muted-foreground)]'>
      <ChevronRight className='w-4 h-4' />
    </span>
  );
}

/**
 * RoboBreadcrumbs — semantic breadcrumb navigation with overflow collapse.
 *
 * When items exceed `maxItems`, middle items collapse into a "..." dropdown.
 * The first and last items are always shown.
 *
 * @example
 * ```tsx
 * <RoboBreadcrumbs
 *   items={[
 *     { label: 'Home', href: '/' },
 *     { label: 'Reports', href: '/reports' },
 *     { label: 'Annual Report' },
 *   ]}
 * />
 * ```
 */
function RoboBreadcrumbs({ className, variant, items, maxItems = 4, animate = false, ref, ...props }: RoboBreadcrumbsProps) {
  const { Link: RouterLink } = useRoboRouterAdapter();
  const needsCollapse = items.length > maxItems;

  // Always show first and last; collapse the middle ones
  const firstItem = items[0];
  const lastItem = items[items.length - 1];
  const collapsedItems = items.slice(1, items.length - 1);
  // Visible middle items when not collapsing
  const visibleItems = needsCollapse ? [] : items.slice(1, items.length - 1);

  return (
    <nav
      ref={ref}
      aria-label='Breadcrumb'
      className={cn(breadcrumbsVariants({ variant }), className)}
      {...props}
    >
      <ol className='flex items-center flex-wrap gap-0 list-none p-0 m-0'>
        {/* Always render first item */}
        {items.length > 0 && (
          <li
            className={cn('flex items-center', animate && 'animate-in fade-in duration-[var(--duration-normal)]')}
            style={animate ? { animationDelay: '0ms' } : undefined}
          >
            {items.length === 1 ? (
              <span className={currentClasses} aria-current='page'>
                {firstItem.label}
              </span>
            ) : (
              <BreadcrumbLink item={firstItem} />
            )}
          </li>
        )}

        {/* Middle items — collapsed */}
        {needsCollapse && collapsedItems.length > 0 && (
          <>
            <li aria-hidden='true'>
              <BreadcrumbSeparator />
            </li>
            <li
              className={cn('flex items-center', animate && 'animate-in fade-in duration-[var(--duration-normal)]')}
              style={animate ? { animationDelay: '40ms' } : undefined}
            >
              <DropdownMenu.Root>
                <DropdownMenu.Trigger
                  aria-label='Show hidden breadcrumbs'
                  className={cn(
                    'inline-flex items-center justify-center w-7 h-7 rounded-md',
                    'text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--accent)]',
                    'transition-colors duration-[var(--duration-fast)]',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-1'
                  )}
                >
                  <MoreHorizontal className='w-4 h-4' />
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.Content
                    align='start'
                    sideOffset={4}
                    className={cn(
                      'z-50 min-w-[8rem] rounded-md border border-[var(--border)]',
                      'bg-[var(--popover)] text-[var(--popover-foreground)]',
                      'shadow-md p-1'
                    )}
                  >
                    {collapsedItems.map((item) => (
                      <DropdownMenu.Item key={item.href ?? item.label} asChild>
                        {item.href ? (
                          <RouterLink
                            to={item.href}
                            className={cn(
                              'flex items-center px-3 py-1.5 text-sm rounded-sm cursor-pointer',
                              'hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]',
                              'focus-visible:outline-none focus-visible:bg-[var(--accent)]',
                              'select-none'
                            )}
                          >
                            {item.label}
                          </RouterLink>
                        ) : (
                          <span
                            className={cn(
                              'flex items-center px-3 py-1.5 text-sm rounded-sm',
                              'select-none'
                            )}
                          >
                            {item.label}
                          </span>
                        )}
                      </DropdownMenu.Item>
                    ))}
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            </li>
          </>
        )}

        {/* Middle items — visible (when not collapsed) */}
        {!needsCollapse &&
          visibleItems.map((item, idx) => (
            <React.Fragment key={item.href ?? item.label}>
              <li aria-hidden='true'>
                <BreadcrumbSeparator />
              </li>
              <li
                className={cn('flex items-center', animate && 'animate-in fade-in duration-[var(--duration-normal)]')}
                style={animate ? { animationDelay: `${(idx + 1) * 40}ms` } : undefined}
              >
                <BreadcrumbLink item={item} />
              </li>
            </React.Fragment>
          ))}

        {/* Last item — always current page */}
        {items.length > 1 && (
          <>
            <li aria-hidden='true'>
              <BreadcrumbSeparator />
            </li>
            <li
              className={cn('flex items-center', animate && 'animate-in fade-in duration-[var(--duration-normal)]')}
              style={animate ? { animationDelay: `${(needsCollapse ? 2 : visibleItems.length + 1) * 40}ms` } : undefined}
            >
              <span className={currentClasses} aria-current='page'>
                {lastItem.label}
              </span>
            </li>
          </>
        )}
      </ol>
    </nav>
  );
}
RoboBreadcrumbs.displayName = 'RoboBreadcrumbs';

export { RoboBreadcrumbs, breadcrumbsVariants };
