'use client';

import * as React from 'react';

export interface RoboRouterLinkProps {
  to: string;
  className?: string;
  'aria-current'?: React.AriaAttributes['aria-current'];
  children: React.ReactNode;
}

export interface RoboRouterAdapter {
  Link: React.ComponentType<RoboRouterLinkProps>;
  usePathname: () => string;
}

const defaultAdapter: RoboRouterAdapter = {
  Link: ({ to, children, ...props }: RoboRouterLinkProps) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
  usePathname: () => '',
};

const RoboRouterAdapterContext =
  React.createContext<RoboRouterAdapter>(defaultAdapter);

export interface RoboRouterAdapterProviderProps {
  adapter: RoboRouterAdapter;
  children: React.ReactNode;
}

function RoboRouterAdapterProvider({ adapter, children }: RoboRouterAdapterProviderProps) {
  return (
    <RoboRouterAdapterContext.Provider value={adapter}>
      {children}
    </RoboRouterAdapterContext.Provider>
  );
}
RoboRouterAdapterProvider.displayName = 'RoboRouterAdapterProvider';

function useRoboRouterAdapter(): RoboRouterAdapter {
  return React.useContext(RoboRouterAdapterContext);
}

export { RoboRouterAdapterProvider, useRoboRouterAdapter };
