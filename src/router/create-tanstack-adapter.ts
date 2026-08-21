import * as React from 'react';
import { Link, useRouterState } from '@tanstack/react-router';

import type { RoboRouterAdapter, RoboRouterLinkProps } from '@/navigation/router-adapter';

function useTanStackPathname(): string {
  return useRouterState({ select: (s) => s.location.pathname });
}

/**
 * Creates a RoboRouterAdapter wired to TanStack Router.
 *
 * Set up once at the app root, before RouterProvider:
 * ```tsx
 * import { createTanStackAdapter } from '@roboborealis/components/router';
 * import { RoboRouterAdapterProvider } from '@roboborealis/components/navigation';
 *
 * <RoboRouterAdapterProvider adapter={createTanStackAdapter()}>
 *   <RouterProvider router={router} />
 * </RoboRouterAdapterProvider>
 * ```
 *
 * After this, all Robo navigation components (RoboSidebar, RoboTopbar, RoboBreadcrumbs,
 * RoboBottomNav) automatically use TanStack <Link> and detect the active path from
 * the router — no activePath prop needed.
 */
export function createTanStackAdapter(): RoboRouterAdapter {
  return {
    // Cast to our adapter interface — TanStack Link accepts `to: string` at runtime
    Link: Link as unknown as React.ComponentType<RoboRouterLinkProps>,
    usePathname: useTanStackPathname,
  };
}

// Re-export types for consumer convenience
export type { RoboRouterAdapter, RoboRouterLinkProps };
