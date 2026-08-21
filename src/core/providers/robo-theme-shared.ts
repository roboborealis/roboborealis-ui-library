/**
 * Types, unions and resolution shared by `RoboThemeProvider` and `getRoboThemeScript`.
 *
 * Deliberately free of the `'use client'` directive and of any React import: the pre-paint
 * script builder is plain string generation that a server component calls, while the provider
 * is a client component. Both need the same unions — and the script builder needs them at
 * runtime, to validate its options before interpolating them into a `<script>` body. Keeping
 * one copy is what stops the two from disagreeing about what a valid theme or mode is.
 */

/** Theme palette. Selects which `theme-*.css` token block applies. */
type Theme = 'midnight' | 'aurora' | 'sol';

/**
 * The stored light/dark *preference*. `system` defers to the OS.
 *
 * Distinct from `ResolvedMode` because `system` is not a paintable value — see `resolveMode`.
 */
type Mode = 'dark' | 'light' | 'system';

/** A concrete light/dark value. What `data-mode` always carries. */
type ResolvedMode = 'dark' | 'light';

const THEMES = ['midnight', 'aurora', 'sol'] as const;
const MODES = ['dark', 'light', 'system'] as const;

/**
 * Each palette's natural mode, used when nothing else specifies one. Midnight reads as a dark
 * theme, Aurora as a light one.
 */
const THEME_DEFAULT_MODE: Record<Theme, ResolvedMode> = {
  midnight: 'dark',
  aurora: 'light',
  sol: 'dark',
};

/** The media query behind the `system` preference. */
const PREFERS_DARK_QUERY = '(prefers-color-scheme: dark)';

/**
 * The settings `RoboThemeProvider` and `getRoboThemeScript` must agree on.
 *
 * They are independent code paths reading the same storage — the script before first paint, the
 * provider after mount — so a disagreement about the storage key or the defaults shows up as the
 * script painting one thing and the provider immediately rendering another. Declaring the shape
 * once lets a consumer pass a single object to both and make that class of mismatch impossible.
 */
interface RoboThemeConfig {
  storageKey?: string;
  defaultTheme?: Theme;
  defaultMode?: Mode;
}

function isTheme(value: unknown): value is Theme {
  return typeof value === 'string' && (THEMES as readonly string[]).includes(value);
}

function isMode(value: unknown): value is Mode {
  return typeof value === 'string' && (MODES as readonly string[]).includes(value);
}

/**
 * Reads the OS preference. Returns `false` wherever there is no `matchMedia` to ask — the
 * server, and older test environments.
 */
function prefersDark(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia(PREFERS_DARK_QUERY).matches
  );
}

/**
 * Collapses a preference to the value that actually paints.
 *
 * `systemPrefersDark` is passed in rather than read here so the provider can hold it in state and
 * re-render when the OS changes, instead of calling `matchMedia` during render.
 *
 * Total over `Mode` — every member is either already concrete or is `system`, so there is no
 * fallback branch to reach. Callers pass a value already narrowed by `isMode`.
 */
function resolveMode(mode: Mode, systemPrefersDark: boolean): ResolvedMode {
  return mode === 'system' ? (systemPrefersDark ? 'dark' : 'light') : mode;
}

export {
  MODES,
  PREFERS_DARK_QUERY,
  THEMES,
  THEME_DEFAULT_MODE,
  isMode,
  isTheme,
  prefersDark,
  resolveMode,
};
export type { Mode, RoboThemeConfig, ResolvedMode, Theme };
