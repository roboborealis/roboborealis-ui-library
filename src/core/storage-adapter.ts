/**
 * StorageAdapter — thin abstraction over browser storage.
 *
 * Enables SSR-safe access to localStorage and provides a noop fallback
 * for environments where storage is unavailable (server-side rendering).
 */
export interface StorageAdapter {
  get(key: string): string | null;
  set(key: string, value: string): void;
  remove(key: string): void;
}

/**
 * noopStorageAdapter — does nothing; always returns null for get().
 * Used as a fallback in SSR and test environments.
 */
export const noopStorageAdapter: StorageAdapter = {
  get: () => null,
  set: () => undefined,
  remove: () => undefined,
};

/**
 * createLocalStorageAdapter — returns a StorageAdapter backed by window.localStorage.
 * Falls back to noopStorageAdapter when window is not defined (SSR).
 *
 * @example
 * const storage = createLocalStorageAdapter();
 * storage.set('theme', 'theme-midnight');
 * storage.get('theme'); // 'theme-midnight'
 */
export function createLocalStorageAdapter(): StorageAdapter {
  if (typeof window === 'undefined') return noopStorageAdapter;
  return {
    get: (key) => window.localStorage.getItem(key),
    set: (key, value) => window.localStorage.setItem(key, value),
    remove: (key) => window.localStorage.removeItem(key),
  };
}

/** A year — appearance is a durable preference, not session state. */
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

/** Parses a `document.cookie` / `Cookie:` header string into a plain map. */
export function parseCookieHeader(cookieString: string): Record<string, string> {
  return cookieString
    .split(';')
    .map((part) => part.trim())
    .filter(Boolean)
    .reduce<Record<string, string>>((acc, part) => {
      const index = part.indexOf('=');
      if (index > 0) {
        acc[part.slice(0, index)] = decodeURIComponent(part.slice(index + 1));
      }
      return acc;
    }, {});
}

export interface CookieStorageAdapterOptions {
  maxAgeSeconds?: number;
  path?: string;
  sameSite?: 'Lax' | 'Strict';
}

/**
 * createCookieStorageAdapter — returns a StorageAdapter backed by `document.cookie`.
 *
 * Use this instead of localStorage when the *server* needs to know the preference. A server
 * component can read the cookie during SSR and hand it to a provider as `initial`, so the very
 * first server-rendered HTML already carries the right `data-theme`/`data-mode`. That removes the
 * flash of the wrong theme outright — no pre-paint inline script required, which localStorage
 * always needs because the server cannot see it.
 *
 * Falls back to `noopStorageAdapter` when `document` is undefined, which is exactly why `initial`
 * exists: during SSR this adapter reads nothing, so the server render has no other source.
 *
 * `SameSite=Lax` and no `Secure` flag, so it works on `http://localhost` as well as https —
 * these values are display preferences, not credentials.
 *
 * @example
 * const storage = createCookieStorageAdapter();
 * <RoboThemeProvider storageAdapter={storage} initial={{ mode: modeFromCookie }} />
 */
export function createCookieStorageAdapter(
  options: CookieStorageAdapterOptions = {}
): StorageAdapter {
  if (typeof document === 'undefined') return noopStorageAdapter;

  const { maxAgeSeconds = COOKIE_MAX_AGE_SECONDS, path = '/', sameSite = 'Lax' } = options;
  const attributes = `Path=${path}; SameSite=${sameSite}`;

  return {
    get: (key) => parseCookieHeader(document.cookie)[key] ?? null,
    set: (key, value) => {
      document.cookie = `${key}=${encodeURIComponent(value)}; ${attributes}; Max-Age=${maxAgeSeconds}`;
    },
    remove: (key) => {
      document.cookie = `${key}=; ${attributes}; Max-Age=0`;
    },
  };
}
