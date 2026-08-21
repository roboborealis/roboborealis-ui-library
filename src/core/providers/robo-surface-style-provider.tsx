'use client';

import * as React from 'react';

import { type StorageAdapter, createLocalStorageAdapter } from '../storage-adapter';
import { useAppearanceAttribute } from './use-appearance-attribute';
import type { ApplyTo } from './use-appearance-attribute';

const defaultStorageAdapter = createLocalStorageAdapter();

/** App-wide visual surface treatment, orthogonal to the colour theme and mode. */
export const SURFACE_STYLES = ['flat', 'glass', 'neumorphism'] as const;
export type SurfaceStyle = (typeof SURFACE_STYLES)[number];

const isSurfaceStyle = (value: unknown): value is SurfaceStyle =>
  typeof value === 'string' && (SURFACE_STYLES as readonly string[]).includes(value);

interface SurfaceStyleContextValue {
  surfaceStyle: SurfaceStyle;
  setSurfaceStyle: (surfaceStyle: SurfaceStyle) => void;
  /** Spread onto your own element when `applyTo` is `'none'`. */
  surfaceStyleAttributes: Record<string, string>;
}

const SurfaceStyleContext = React.createContext<SurfaceStyleContextValue | null>(null);

/**
 * Fallback returned by `useSurfaceStyle()` when no `RoboSurfaceStyleProvider` is mounted.
 * Deliberately does NOT throw (mirrors `useGlassMode`) — components read this hook
 * internally and must keep working standalone: in Storybook, in apps that haven't
 * adopted the provider yet, and in unit tests that render a component in isolation.
 */
const NOOP_SURFACE_STYLE: SurfaceStyleContextValue = {
  surfaceStyle: 'flat',
  setSurfaceStyle: () => undefined,
  surfaceStyleAttributes: { 'data-surface-style': 'flat' },
};

export interface RoboSurfaceStyleProviderProps {
  defaultSurfaceStyle?: SurfaceStyle;
  /** Server-resolved state, for apps that persist to cookies. See RoboThemeProvider's `initial`. */
  initial?: SurfaceStyle;
  /**
   * Where `data-surface-style` is written. `'none'` writes nothing — spread
   * `surfaceStyleAttributes` onto an element you render instead, to scope the setting to
   * part of the page.
   */
  applyTo?: ApplyTo;
  storageAdapter?: StorageAdapter;
  storageKey?: string;
  children: React.ReactNode;
}

const parseSurfaceStyle = (raw: string): SurfaceStyle | undefined =>
  isSurfaceStyle(raw) ? raw : undefined;

const serializeSurfaceStyle = (value: SurfaceStyle): string => value;
const surfaceStyleToAttribute = (value: SurfaceStyle): string => value;

/**
 * RoboSurfaceStyleProvider — app-wide setting for the visual surface treatment,
 * orthogonal to the colour theme (midnight/aurora/sol) and mode (light/dark). One of
 * `flat` (no shadows, standard flat design), `glass` (translucent blurred overlay
 * panels — coordinate with `RoboGlassModeProvider`), or `neumorphism` (soft
 * extruded/pressed shadows derived from the theme's own surface colours).
 *
 * Writes `data-surface-style="flat|glass|neumorphism"` on `<html>`; the scoped CSS in
 * `themes/surface-styles.css` keys off it. Defaults to `flat` — adopting the provider
 * opts the app into flat design; leaving the provider unmounted keeps the library's
 * historical shadowed default (non-breaking).
 *
 * Glass is fundamentally a map-overlay-panel treatment (`RoboFloatingPanel`, `RoboSheet`,
 * `RoboInfoIsland`, `RoboQuickPanel`) read via `useGlassMode()`. When you set this to
 * `glass`, also call `setGlassMode(true)` so those panels turn translucent.
 *
 * @example
 * ```tsx
 * <RoboSurfaceStyleProvider defaultSurfaceStyle="flat">
 *   <App />
 * </RoboSurfaceStyleProvider>
 * ```
 */
function RoboSurfaceStyleProvider({
  defaultSurfaceStyle = 'flat',
  initial,
  applyTo = 'documentElement',
  storageAdapter = defaultStorageAdapter,
  storageKey = 'robo-surface-style',
  children,
}: RoboSurfaceStyleProviderProps) {
  const [surfaceStyle, setSurfaceStyle, surfaceStyleAttributes] =
    useAppearanceAttribute<SurfaceStyle>({
      datasetKey: 'surfaceStyle',
      applyTo,
      storageAdapter,
      storageKey,
      initial,
      defaultValue: defaultSurfaceStyle,
      parse: parseSurfaceStyle,
      serialize: serializeSurfaceStyle,
      toAttribute: surfaceStyleToAttribute,
    });

  const value = React.useMemo<SurfaceStyleContextValue>(
    () => ({ surfaceStyle, setSurfaceStyle, surfaceStyleAttributes }),
    [surfaceStyle, setSurfaceStyle, surfaceStyleAttributes]
  );

  return (
    <SurfaceStyleContext.Provider value={value}>{children}</SurfaceStyleContext.Provider>
  );
}
RoboSurfaceStyleProvider.displayName = 'RoboSurfaceStyleProvider';

/**
 * useSurfaceStyle — reads the app-wide surface style. Safe to call from any component,
 * whether or not a `RoboSurfaceStyleProvider` is mounted above it — falls back to
 * `{ surfaceStyle: 'flat', setSurfaceStyle: noop }` rather than throwing.
 */
function useSurfaceStyle(): SurfaceStyleContextValue {
  const ctx = React.useContext(SurfaceStyleContext);
  return ctx ?? NOOP_SURFACE_STYLE;
}

export { RoboSurfaceStyleProvider, useSurfaceStyle };
