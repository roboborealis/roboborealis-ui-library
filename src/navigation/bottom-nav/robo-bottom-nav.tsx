'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import { useRoboRouterAdapter } from '@/navigation/router-adapter';

const bottomNavVariants = cva(
  'fixed bottom-0 left-0 right-0 z-40 flex flex-row items-stretch bg-[var(--card)] border-t border-[var(--border)]',
  {
    variants: {
      variant: {
        default: '',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface RoboBottomNavItem {
  label: string;
  icon: React.ReactNode;
  href: string;
}

export interface RoboBottomNavProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'children'>,
    VariantProps<typeof bottomNavVariants> {
  items: RoboBottomNavItem[];
  activePath?: string;
  ref?: React.Ref<HTMLElement>;
}

/**
 * RoboBottomNav — mobile bottom navigation bar with icon and label per item.
 *
 * @example
 * ```tsx
 * <RoboBottomNav
 *   items={[
 *     { label: 'Home', icon: <Home />, href: '/home' },
 *     { label: 'Reports', icon: <FileText />, href: '/reports' },
 *   ]}
 *   activePath="/home"
 * />
 * ```
 */
function RoboBottomNav({ className, variant, items, activePath, ref, ...props }: RoboBottomNavProps) {
  const { Link: RouterLink, usePathname } = useRoboRouterAdapter();
  const routerPathname = usePathname();
  const effectiveActivePath = activePath ?? (routerPathname || undefined);

  return (
    <nav
      ref={ref}
      role='navigation'
      aria-label='Bottom navigation'
      className={cn(bottomNavVariants({ variant }), className)}
      {...props}
    >
      {items.map((item) => {
        const isActive = effectiveActivePath === item.href;
        return (
          <RouterLink
            key={item.href}
            to={item.href}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              // Min 44×44px touch target
              'flex flex-col items-center justify-center gap-1 flex-1 min-h-[3.5rem] min-w-[2.75rem] px-2 py-2',
              'text-xs font-medium transition-colors duration-[var(--duration-fast)]',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-inset',
              isActive
                ? 'text-[var(--primary)]'
                : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
            )}
          >
            <span className='flex items-center justify-center w-6 h-6 flex-shrink-0'>
              {item.icon}
            </span>
            <span className='truncate max-w-full'>{item.label}</span>
          </RouterLink>
        );
      })}
    </nav>
  );
}
RoboBottomNav.displayName = 'RoboBottomNav';

export { RoboBottomNav, bottomNavVariants };
