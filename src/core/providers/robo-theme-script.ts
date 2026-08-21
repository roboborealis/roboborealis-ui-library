import { THEME_DEFAULT_MODE, isMode, isTheme } from './robo-theme-shared';
import type { RoboThemeConfig } from './robo-theme-shared';

/**
 * `storageKey` is the one option that is not a closed union, so it is the one that could carry
 * arbitrary text into a `<script>` body. Rather than escape it — which invites a subtle mistake —
 * restrict it to characters that cannot terminate a string literal or a script tag, and reject
 * anything else outright.
 */
const SAFE_STORAGE_KEY = /^[A-Za-z0-9_:-]+$/;

/**
 * Serialized once at module load rather than per call. The body is static, and `getRoboThemeScript`
 * is called from a server component — potentially once per request.
 */
let serializedBody: string | undefined;

/** The resolved, validated arguments the inline script receives. */
export interface RoboThemeScriptConfig {
  storageKey: string;
  defaultTheme: string;
  fallbackMode: string;
}

/**
 * The body of the pre-paint script, written as a real function so it can be unit-tested by
 * calling it — not by evaluating a string.
 *
 * **This function is serialized with `Function.prototype.toString()`**, which imposes two rules
 * that are easy to break by accident:
 *
 * 1. **No references to anything outside its own body.** No imports, no module constants, no
 *    closure variables. Everything it needs arrives via `config`, and the media query is inlined
 *    as a literal. A reference to an outer binding would compile fine here and then throw
 *    `ReferenceError` in the browser, before first paint, taking the page down with it.
 * 2. **No syntax that makes TypeScript emit a helper.** Optional chaining, spread, `async` and
 *    friends can all be downlevelled into calls to injected `__helper` functions, which are outer
 *    references by another name. The build targets ES2022, so `let`/`const`, template literals and
 *    optional catch binding are all emitted as written — but keep an eye on this if the target ever
 *    drops. A test asserts the serialized output contains no `__helper` reference.
 *
 * The `try`/`catch` is not optional: this runs as a blocking script, so an exception here is a
 * blank page rather than a mis-themed one. Storage can genuinely be unavailable (Safari private
 * browsing, disabled cookies, embedded webviews).
 */
export function applyRoboThemeAttributes(config: RoboThemeScriptConfig): void {
  try {
    const element = document.documentElement;
    const store = window.localStorage;

    let theme = store.getItem(config.storageKey + ':theme');
    if (theme !== 'midnight' && theme !== 'aurora' && theme !== 'sol') {
      theme = config.defaultTheme;
    }
    element.setAttribute('data-theme', theme);

    let mode = store.getItem(config.storageKey + ':mode');
    if (mode !== 'dark' && mode !== 'light' && mode !== 'system') {
      mode = config.fallbackMode;
    }
    // Resolved here rather than left for the provider: data-mode must always hold a concrete
    // value, because the theme CSS matches [data-mode='dark'] / [data-mode='light'] and nothing
    // else. A literal 'system' would match neither and leave every token unresolved.
    if (mode === 'system') {
      mode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    element.setAttribute('data-mode', mode);
  } catch {
    // Storage or matchMedia unavailable — leave whatever the server rendered in place.
  }
}

export type RoboThemeScriptOptions = RoboThemeConfig;

/**
 * Builds the body of a blocking inline script that applies the saved palette and light/dark mode
 * to `<html>` **before first paint**.
 *
 * This exists because a React effect can never win the first paint: by the time any provider has
 * mounted the browser has already painted, so a user whose saved mode differs from the default
 * sees a flash of the wrong one. Only a synchronous script in `<head>` runs early enough.
 *
 * Returns a string rather than a component so this package stays framework-agnostic — it has no
 * `next` dependency and should not gain one. In Next's App Router:
 *
 * ```tsx
 * import Script from 'next/script';
 * import { getRoboThemeScript, RoboThemeProvider } from '@roboborealis/components/core';
 *
 * // One object into both, so the script and the provider cannot disagree about the defaults.
 * const themeConfig = { storageKey: 'robo-color-theme', defaultTheme: 'midnight', defaultMode: 'system' } as const;
 *
 * <Script id='robo-theme' strategy='beforeInteractive'>{getRoboThemeScript(themeConfig)}</Script>
 * <RoboThemeProvider {...themeConfig}>{children}</RoboThemeProvider>
 * ```
 *
 * Two constraints:
 *
 * - **localStorage only.** An inline script cannot read a custom `StorageAdapter`. Apps that
 *   persist to cookies do not need this at all — they can read the cookie during SSR and pass
 *   `initial` to the provider, which gets the attributes into the server HTML directly.
 * - **The options must match the provider's.** They are independent code paths reading the same
 *   storage; if their defaults differ, the script paints one thing and the provider then renders
 *   another. Passing one shared config object to both is the way to make that impossible.
 *
 * @throws If `storageKey` contains anything outside `[A-Za-z0-9_:-]`, or either default is not a
 * known union member.
 */
export function getRoboThemeScript(options: RoboThemeScriptOptions = {}): string {
  const { storageKey = 'robo-theme', defaultTheme = 'midnight', defaultMode } = options;

  if (!SAFE_STORAGE_KEY.test(storageKey)) {
    throw new Error(
      `getRoboThemeScript: storageKey must match ${String(SAFE_STORAGE_KEY)}, received "${storageKey}"`
    );
  }
  if (!isTheme(defaultTheme)) {
    throw new Error(`getRoboThemeScript: unknown defaultTheme "${String(defaultTheme)}"`);
  }
  if (defaultMode !== undefined && !isMode(defaultMode)) {
    throw new Error(`getRoboThemeScript: unknown defaultMode "${String(defaultMode)}"`);
  }

  const config: RoboThemeScriptConfig = {
    storageKey,
    defaultTheme,
    fallbackMode: defaultMode ?? THEME_DEFAULT_MODE[defaultTheme],
  };

  // Serializing the function rather than hand-writing the JS keeps one tested implementation.
  // JSON.stringify is what makes the interpolation safe — the values are already validated above,
  // and this escapes them regardless.
  serializedBody ??= applyRoboThemeAttributes.toString();
  // `<` is escaped so a value can never close the surrounding <script> element. Nothing validated
  // above can contain one today — that is what the union checks and SAFE_STORAGE_KEY guarantee — so
  // this is belt and braces: it means loosening that charset later cannot silently become an XSS.
  // JSON.stringify does not escape `<` on its own.
  const serializedConfig = JSON.stringify(config).replace(/</g, '\\u003c');
  return `(${serializedBody})(${serializedConfig})`;
}
