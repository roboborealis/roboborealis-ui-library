'use client';

import * as React from 'react';

import { type StorageAdapter, createLocalStorageAdapter } from '../storage-adapter';
import { useAppearanceAttribute } from './use-appearance-attribute';
import type { ApplyTo } from './use-appearance-attribute';

const defaultStorageAdapter = createLocalStorageAdapter();

interface GlassModeContextValue {
  glassMode: boolean;
  setGlassMode: (glassMode: boolean) => void;
  /** Spread onto your own element when `applyTo` is `'none'`. */
  glassModeAttributes: Record<string, string>;
}

const GlassModeContext = React.createContext<GlassModeContextValue | null>(null);

/**
 * Fallback returned by `useGlassMode()` when no `RoboGlassModeProvider` is mounted.
 * Deliberately does NOT throw (unlike `useDensity`/`useTheme`) — map overlay panels
 * (`RoboFloatingPanel`, `RoboSheet`, `RoboInfoIsland`, ...) call this hook internally and
 * must keep working standalone: in Storybook, in apps that haven't adopted the
 * provider yet, and in unit tests that render a panel in isolation.
 */
const NOOP_GLASS_MODE: GlassModeContextValue = {
  glassMode: false,
  setGlassMode: () => undefined,
  glassModeAttributes: { 'data-glass-mode': 'off' },
};

export interface RoboGlassModeProviderProps {
  defaultGlassMode?: boolean;
  /** Server-resolved state, for apps that persist to cookies. See RoboThemeProvider's `initial`. */
  initial?: boolean;
  /**
   * Where `data-glass-mode` is written. `'none'` writes nothing — spread `glassModeAttributes`
   * onto an element you render instead, to scope the setting to part of the page.
   */
  applyTo?: ApplyTo;
  storageAdapter?: StorageAdapter;
  storageKey?: string;
  children: React.ReactNode;
}

/**
 * Accepts both spellings this setting has: the DOM carries `on`/`off` (readable in a CSS attribute
 * selector), while storage carries `true`/`false`. One parser covers both, so a value written by
 * either side reads back correctly.
 */
const parseGlassMode = (raw: string): boolean | undefined => {
  if (raw === 'on' || raw === 'true') return true;
  if (raw === 'off' || raw === 'false') return false;
  return undefined;
};

const serializeGlassMode = (value: boolean): string => String(value);
const glassModeToAttribute = (value: boolean): string => (value ? 'on' : 'off');

/**
 * RoboGlassModeProvider — app-wide setting controlling whether map-overlay panels
 * (`RoboFloatingPanel` and everything built on it, `RoboSheet`/`RoboHoverSheet`,
 * `RoboInfoIsland`) render a translucent glass surface or a solid one by default.
 * Any panel can still override this per-instance via its own `transparent` prop.
 *
 * @example
 * ```tsx
 * <RoboGlassModeProvider>
 *   <App />
 * </RoboGlassModeProvider>
 * ```
 */
function RoboGlassModeProvider({
  defaultGlassMode = false,
  initial,
  applyTo = 'documentElement',
  storageAdapter = defaultStorageAdapter,
  storageKey = 'robo-glass-mode',
  children,
}: RoboGlassModeProviderProps) {
  const [glassMode, setGlassMode, glassModeAttributes] = useAppearanceAttribute<boolean>({
    datasetKey: 'glassMode',
    applyTo,
    storageAdapter,
    storageKey,
    initial,
    defaultValue: defaultGlassMode,
    parse: parseGlassMode,
    serialize: serializeGlassMode,
    toAttribute: glassModeToAttribute,
  });

  const value = React.useMemo<GlassModeContextValue>(
    () => ({ glassMode, setGlassMode, glassModeAttributes }),
    [glassMode, setGlassMode, glassModeAttributes]
  );

  return <GlassModeContext.Provider value={value}>{children}</GlassModeContext.Provider>;
}
RoboGlassModeProvider.displayName = 'RoboGlassModeProvider';

/**
 * useGlassMode — reads the app-wide glass-mode setting. Safe to call from any
 * component, whether or not a `RoboGlassModeProvider` is mounted above it — falls
 * back to `{ glassMode: false, setGlassMode: noop }` rather than throwing.
 */
function useGlassMode(): GlassModeContextValue {
  const ctx = React.useContext(GlassModeContext);
  return ctx ?? NOOP_GLASS_MODE;
}

export { RoboGlassModeProvider, useGlassMode };
