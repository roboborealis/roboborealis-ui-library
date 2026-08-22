'use client';

import * as React from 'react';

import { type StorageAdapter, createLocalStorageAdapter } from '../storage-adapter';
import { passthroughValue, useAppearanceAttribute } from './use-appearance-attribute';
import type { ApplyTo } from './use-appearance-attribute';

type Density = 'compact' | 'comfortable' | 'spacious';

const DENSITIES: readonly Density[] = ['compact', 'comfortable', 'spacious'];

const defaultStorageAdapter = createLocalStorageAdapter();

interface DensityContextValue {
  density: Density;
  setDensity: (density: Density) => void;
  /** Spread onto your own element when `applyTo` is `'none'`. */
  densityAttributes: Record<string, string>;
}

const DensityContext = React.createContext<DensityContextValue | null>(null);

export interface RoboDensityProviderProps {
  defaultDensity?: Density;
  /** Server-resolved state, for apps that persist to cookies. See RoboThemeProvider's `initial`. */
  initial?: Density;
  /**
   * Where `data-density` is written. `'none'` writes nothing — spread `densityAttributes` onto an
   * element you render instead, to scope the setting to part of the page.
   */
  applyTo?: ApplyTo;
  storageAdapter?: StorageAdapter;
  storageKey?: string;
  children: React.ReactNode;
}

const parseDensity = (raw: string): Density | undefined =>
  (DENSITIES as readonly string[]).includes(raw) ? (raw as Density) : undefined;

function RoboDensityProvider({
  defaultDensity = 'comfortable',
  initial,
  applyTo = 'documentElement',
  storageAdapter = defaultStorageAdapter,
  storageKey = 'robo-density',
  children,
}: RoboDensityProviderProps) {
  const [density, setDensity, densityAttributes] = useAppearanceAttribute<Density>({
    datasetKey: 'density',
    applyTo,
    storageAdapter,
    storageKey,
    initial,
    defaultValue: defaultDensity,
    parse: parseDensity,
    serialize: passthroughValue,
  });

  const value = React.useMemo<DensityContextValue>(
    () => ({ density, setDensity, densityAttributes }),
    [density, setDensity, densityAttributes]
  );

  return <DensityContext value={value}>{children}</DensityContext>;
}
RoboDensityProvider.displayName = 'RoboDensityProvider';

function useDensity(): DensityContextValue {
  const ctx = React.use(DensityContext);
  if (!ctx) throw new Error('useDensity must be used within RoboDensityProvider');
  return ctx;
}

export { RoboDensityProvider, useDensity };
export type { Density };
