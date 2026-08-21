'use client';

import * as React from 'react';

import { type StorageAdapter, createLocalStorageAdapter } from '../storage-adapter';
import { passthroughValue, useAppearanceAttribute } from './use-appearance-attribute';
import type { ApplyTo } from './use-appearance-attribute';

type FontFamily = 'inter' | 'dm-sans' | 'varela' | 'open-sans' | 'opendyslexic' | 'sora';

const FONT_FAMILIES: readonly FontFamily[] = [
  'inter',
  'dm-sans',
  'varela',
  'open-sans',
  'opendyslexic',
  'sora',
];

const defaultStorageAdapter = createLocalStorageAdapter();

interface FontFamilyContextValue {
  fontFamily: FontFamily;
  setFontFamily: (fontFamily: FontFamily) => void;
  /** Spread onto your own element when `applyTo` is `'none'`. */
  fontFamilyAttributes: Record<string, string>;
}

const FontFamilyContext = React.createContext<FontFamilyContextValue | null>(null);

export interface RoboFontFamilyProviderProps {
  defaultFontFamily?: FontFamily;
  /** Server-resolved state, for apps that persist to cookies. See RoboThemeProvider's `initial`. */
  initial?: FontFamily;
  /**
   * Where `data-font-family` is written. `'none'` writes nothing — spread `fontFamilyAttributes`
   * onto an element you render instead, to scope the setting to part of the page.
   */
  applyTo?: ApplyTo;
  storageAdapter?: StorageAdapter;
  storageKey?: string;
  children: React.ReactNode;
}

const parseFontFamily = (raw: string): FontFamily | undefined =>
  (FONT_FAMILIES as readonly string[]).includes(raw) ? (raw as FontFamily) : undefined;

function RoboFontFamilyProvider({
  defaultFontFamily = 'dm-sans',
  initial,
  applyTo = 'documentElement',
  storageAdapter = defaultStorageAdapter,
  storageKey = 'robo-font-family',
  children,
}: RoboFontFamilyProviderProps) {
  const [fontFamily, setFontFamily, fontFamilyAttributes] = useAppearanceAttribute<FontFamily>({
    datasetKey: 'fontFamily',
    applyTo,
    storageAdapter,
    storageKey,
    initial,
    defaultValue: defaultFontFamily,
    parse: parseFontFamily,
    serialize: passthroughValue,
  });

  const value = React.useMemo<FontFamilyContextValue>(
    () => ({ fontFamily, setFontFamily, fontFamilyAttributes }),
    [fontFamily, setFontFamily, fontFamilyAttributes]
  );

  return <FontFamilyContext.Provider value={value}>{children}</FontFamilyContext.Provider>;
}
RoboFontFamilyProvider.displayName = 'RoboFontFamilyProvider';

function useFontFamily(): FontFamilyContextValue {
  const ctx = React.useContext(FontFamilyContext);
  if (!ctx) throw new Error('useFontFamily must be used within RoboFontFamilyProvider');
  return ctx;
}

export { RoboFontFamilyProvider, useFontFamily };
export type { FontFamily };
