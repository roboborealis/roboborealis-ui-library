'use client';

import * as React from 'react';

import { type StorageAdapter, createLocalStorageAdapter } from '../storage-adapter';
import {
  PREFERS_DARK_QUERY,
  THEME_DEFAULT_MODE,
  isMode,
  isTheme,
  prefersDark,
  resolveMode,
} from './robo-theme-shared';
import type { Mode, RoboThemeConfig, ResolvedMode, Theme } from './robo-theme-shared';

const defaultStorageAdapter = createLocalStorageAdapter();

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  /** The stored preference — may be `system`. Bind settings controls to this. */
  mode: Mode;
  setMode: (mode: Mode) => void;
  /** The concrete mode currently applied. Drive styling decisions off this. */
  resolvedMode: ResolvedMode;
  /**
   * The attributes this provider would write. Spread these onto your own element when
   * `applyTo` is `'none'`.
   */
  themeAttributes: { 'data-theme': Theme; 'data-mode': ResolvedMode };
}

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

/**
 * Extends `RoboThemeConfig` (`storageKey`, `defaultTheme`, `defaultMode`) so the same object can
 * be spread into both this provider and `getRoboThemeScript` — see that function's doc comment.
 */
export interface RoboThemeProviderProps extends RoboThemeConfig {
  /**
   * Server-resolved state, for apps that persist preferences somewhere readable during SSR
   * (cookies, a user record). On the server every `StorageAdapter` is inert, so this is the
   * only way the first server render can carry the right values — which is what makes a
   * zero-flash first paint possible without any inline script.
   */
  initial?: Partial<{ theme: Theme; mode: Mode }>;
  /**
   * Where the resolved attributes are written.
   *
   * `'documentElement'` (default) writes `data-theme`/`data-mode` onto `<html>`.
   *
   * `'none'` writes nothing at all; spread `themeAttributes` from `useTheme()` onto an element
   * you render instead. Use this when the theme must be scoped to part of the page — an app
   * that serves a separately-styled public site from the same root layout cannot afford to
   * re-tokenize `<html>`. Because CSS custom properties inherit and every `theme-*.css` block
   * is scoped under `[data-theme='…']`, putting the attributes on a wrapper re-tokenizes that
   * subtree only.
   */
  applyTo?: 'documentElement' | 'none';
  storageAdapter?: StorageAdapter;
  storageKey?: string;
  children: React.ReactNode;
}

function RoboThemeProvider({
  defaultTheme = 'midnight',
  defaultMode,
  initial,
  applyTo = 'documentElement',
  storageAdapter = defaultStorageAdapter,
  storageKey = 'robo-theme',
  children,
}: RoboThemeProviderProps) {
  const ownsDocument = applyTo === 'documentElement';

  // Only consult `<html>` when this provider is the thing that writes it. Under
  // `applyTo: 'none'` the attribute belongs to somebody else — another app on the page, or a
  // stale value — and adopting it would be reading someone else's state.
  const readDocument = (attribute: 'theme' | 'mode'): string | undefined => {
    if (!ownsDocument || typeof document === 'undefined') return undefined;
    return document.documentElement.dataset[attribute];
  };

  // Consuming apps commonly hardcode `<html data-theme="...">` in their root layout to match
  // whichever theme CSS file they import (see theme-*.css's own "Activate:" doc comment) — that
  // server-rendered attribute is the actual source of truth for "which theme is this app using"
  // the moment this component mounts. Prefer it over storage and defaults so a consumer that
  // forgets a matching defaultTheme prop doesn't get silently switched to this provider's own
  // default ('midnight') and end up with every --card/--border/--foreground token resolving to
  // nothing because that theme's CSS was never imported.
  const [theme, setThemeState] = React.useState<Theme>(() => {
    const domTheme = readDocument('theme');
    if (isTheme(domTheme)) return domTheme;
    const stored = storageAdapter.get(`${storageKey}:theme`);
    if (isTheme(stored)) return stored;
    if (isTheme(initial?.theme)) return initial.theme;
    return defaultTheme;
  });

  /*
   * `mode` deliberately checks storage BEFORE the DOM, which is the opposite of `theme` above.
   *
   * `theme` round-trips losslessly: the value stored is the value written to `data-theme`, so
   * reading it back can only ever return what was already there. `mode` does not. The stored
   * preference may be `system`, while `data-mode` can only ever hold the *resolved* `light` or
   * `dark`. Reading the DOM first would therefore see `light`, take it as the preference, and
   * silently convert a saved `system` into a hard `light` — permanently, on the next write.
   *
   * The DOM is still consulted, just after storage, so a consumer hardcoding
   * `<html data-mode="dark">` is still honoured for a user who has never chosen anything. That
   * was the point of preferring the DOM in the first place: stop the provider's *default* from
   * overriding a declared attribute. A real stored preference outranking it is correct.
   */
  const [mode, setModeState] = React.useState<Mode>(() => {
    const stored = storageAdapter.get(`${storageKey}:mode`);
    if (isMode(stored)) return stored;
    if (isMode(initial?.mode)) return initial.mode;
    const domMode = readDocument('mode');
    if (isMode(domMode)) return domMode;
    // Keyed on `theme` — the palette actually resolved above — not on the `defaultTheme` prop. A
    // consumer can pass `defaultTheme='midnight'` (dark-first) while storage holds `aurora`
    // (light-first); falling back to the prop's natural mode would then open an Aurora-palette app
    // in dark for anyone who has never chosen a mode.
    return defaultMode ?? THEME_DEFAULT_MODE[theme];
  });

  /*
   * Seeded synchronously rather than in an effect so the very first render already agrees with
   * the OS. Starting `false` and correcting afterwards would make the provider paint light and
   * then flip to dark — reintroducing exactly the flash that pre-paint scripts exist to remove.
   *
   * SSR caveat: `prefersDark()` is `false` on the server, because the OS preference is simply
   * not knowable there. That only matters for `applyTo: 'none'` consumers who render
   * `themeAttributes` into their markup while the preference is `system` — they may hydrate
   * with `light` and correct to `dark`. Pin the mode, or accept the one-frame correction; there
   * is no server-side answer to `prefers-color-scheme`.
   */
  const [systemPrefersDark, setSystemPrefersDark] = React.useState<boolean>(prefersDark);

  /*
   * Watch the OS only while the preference actually defers to it. An explicit light/dark choice
   * does not change when the OS does, so there is nothing to subscribe to — and no listener
   * means no chance of one firing and overwriting a pinned mode.
   */
  React.useEffect(() => {
    if (mode !== 'system') return;
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;

    const query = window.matchMedia(PREFERS_DARK_QUERY);
    setSystemPrefersDark(query.matches);

    const onChange = (event: MediaQueryListEvent) => setSystemPrefersDark(event.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, [mode]);

  const resolvedMode = resolveMode(mode, systemPrefersDark);

  /*
   * Keyed on `resolvedMode`, not `mode`. That distinction is the whole fix: this effect writes
   * both attributes, so it re-runs whenever `theme` changes. Previously it wrote a `mode` held
   * in state that never tracked the OS, which meant changing the palette after an OS mode change
   * rewrote `data-mode` from a stale value — leaving Tailwind's `dark` class and the design
   * tokens disagreeing about which mode the page was in. `resolvedMode` is derived on every
   * render, so there is no stale value left to write.
   */
  React.useEffect(() => {
    if (!ownsDocument || typeof document === 'undefined') return;
    document.documentElement.dataset.theme = theme;
    document.documentElement.dataset.mode = resolvedMode;
  }, [ownsDocument, theme, resolvedMode]);

  const setTheme = React.useCallback(
    (next: Theme) => {
      setThemeState(next);
      storageAdapter.set(`${storageKey}:theme`, next);
      if (applyTo === 'documentElement' && typeof document !== 'undefined') {
        document.documentElement.dataset.theme = next;
      }
    },
    [applyTo, storageAdapter, storageKey]
  );

  const setMode = React.useCallback(
    (next: Mode) => {
      setModeState(next);
      // The *preference* is persisted, `system` included — storing the resolved value instead
      // would quietly demote "follow the OS" to whatever the OS happened to be at the time.
      storageAdapter.set(`${storageKey}:mode`, next);
      if (applyTo === 'documentElement' && typeof document !== 'undefined') {
        // Reads the OS afresh rather than using `systemPrefersDark` state: that state is only kept
        // current while the preference *is* `system`, so on the transition into `system` it can
        // still hold a value from before the OS last changed.
        document.documentElement.dataset.mode = resolveMode(
          next,
          next === 'system' ? prefersDark() : false
        );
      }
    },
    [applyTo, storageAdapter, storageKey]
  );

  const value = React.useMemo<ThemeContextValue>(
    () => ({
      theme,
      setTheme,
      mode,
      setMode,
      resolvedMode,
      themeAttributes: { 'data-theme': theme, 'data-mode': resolvedMode },
    }),
    [theme, setTheme, mode, setMode, resolvedMode]
  );

  return <ThemeContext value={value}>{children}</ThemeContext>;
}
RoboThemeProvider.displayName = 'RoboThemeProvider';

function useTheme(): ThemeContextValue {
  const ctx = React.use(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within RoboThemeProvider');
  return ctx;
}

export { RoboThemeProvider, useTheme };
export type { Mode, ResolvedMode, Theme };
