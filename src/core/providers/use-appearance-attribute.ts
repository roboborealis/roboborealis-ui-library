'use client';

import * as React from 'react';

import type { StorageAdapter } from '../storage-adapter';

/**
 * Where a provider writes its appearance attribute.
 *
 * `'documentElement'` puts it on `<html>`, which is what a single-themed app wants.
 *
 * `'none'` writes no DOM at all; the consumer spreads the returned attribute bag onto an element it
 * renders. That is the only way to scope an appearance setting to part of the page — an app serving
 * a separately-styled public site from the same root layout cannot afford to re-tokenize `<html>`.
 */
export type ApplyTo = 'documentElement' | 'none';

/** `fontFamily` → `data-font-family`. Mirrors how `dataset` maps to attribute names. */
function toAttributeName(datasetKey: string): string {
  return `data-${datasetKey.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`)}`;
}

/**
 * `serialize` for settings whose stored, DOM and in-memory forms are all the same string.
 *
 * Exists so callers can pass a stable module-level reference instead of an inline arrow. The
 * converters below are hook dependencies, so an inline arrow would be a new function every render
 * and rebuild the setter each time.
 */
export const passthroughValue = <T extends string>(value: T): string => value;

export interface AppearanceAttributeOptions<T> {
  /** `dataset` key this setting owns, e.g. `density`, `fontFamily`, `glassMode`. */
  datasetKey: string;
  applyTo: ApplyTo;
  storageAdapter: StorageAdapter;
  /** Fully-resolved storage key — the caller owns any `:suffix` convention. */
  storageKey: string;
  /** Server-resolved seed, used when the adapter is inert (SSR). */
  initial: T | undefined;
  defaultValue: T;
  /**
   * Narrows an untrusted stored or DOM string. Returns undefined to reject it.
   *
   * All three converters must be stable references (module-level functions, not inline arrows) —
   * they are hook dependencies, so a fresh identity each render rebuilds the setter each render.
   */
  parse: (raw: string) => T | undefined;
  /** Value as persisted to storage. Use `passthroughValue` when the form is unchanged. */
  serialize: (value: T) => string;
  /** Value as written to the DOM. Defaults to `serialize` when the two forms agree. */
  toAttribute?: (value: T) => string;
}

/**
 * The read/write/expose cycle every appearance provider needs, in one place.
 *
 * Density, font-family and glass-mode are the same component three times over: seed from the DOM or
 * storage, mirror to an attribute in an effect, persist on set, and hand consumers an attribute bag
 * for the scoped case. Each used to carry its own copy — including the same comments — so adding
 * `applyTo` and `initial` meant making the identical change three times, and a fix to one copy did
 * not reach the others. A fourth axis would have been a fourth copy.
 *
 * `RoboThemeProvider` deliberately does **not** use this. It owns two attributes at once, and its
 * mode is a *derived* value rather than the stored one, so its effect has to key on the resolution
 * rather than on state. Forcing it through here would mean parameterising away the one thing that
 * makes it different.
 *
 * @returns `[value, setValue, attributes]` — spread `attributes` when `applyTo` is `'none'`.
 */
export function useAppearanceAttribute<T>({
  datasetKey,
  applyTo,
  storageAdapter,
  storageKey,
  initial,
  defaultValue,
  parse,
  serialize,
  toAttribute = serialize,
}: AppearanceAttributeOptions<T>): [T, (next: T) => void, Record<string, string>] {
  const ownsDocument = applyTo === 'documentElement';
  const attributeName = toAttributeName(datasetKey);

  const [value, setValueState] = React.useState<T>(() => {
    // Consuming apps commonly hardcode these attributes in their root layout to match the theme CSS
    // they import, and that server-rendered value is the real answer the moment this mounts — so it
    // outranks storage and defaults. Only consulted when this provider owns the attribute: under
    // `applyTo: 'none'` it belongs to somebody else, and adopting it would be reading their state.
    if (ownsDocument && typeof document !== 'undefined') {
      const fromDocument = document.documentElement.dataset[datasetKey];
      if (fromDocument !== undefined) {
        const parsed = parse(fromDocument);
        if (parsed !== undefined) return parsed;
      }
    }

    const stored = storageAdapter.get(storageKey);
    if (stored !== null) {
      const parsed = parse(stored);
      if (parsed !== undefined) return parsed;
    }

    return initial ?? defaultValue;
  });

  React.useEffect(() => {
    if (!ownsDocument || typeof document === 'undefined') return;
    document.documentElement.dataset[datasetKey] = toAttribute(value);
  }, [ownsDocument, datasetKey, value, toAttribute]);

  const setValue = React.useCallback(
    (next: T) => {
      setValueState(next);
      storageAdapter.set(storageKey, serialize(next));
      // Written eagerly as well as in the effect, so the change lands in the same frame as the
      // click rather than one paint later.
      if (ownsDocument && typeof document !== 'undefined') {
        document.documentElement.dataset[datasetKey] = toAttribute(next);
      }
    },
    [ownsDocument, datasetKey, storageAdapter, storageKey, serialize, toAttribute]
  );

  const attributes = React.useMemo(
    () => ({ [attributeName]: toAttribute(value) }),
    [attributeName, value, toAttribute]
  );

  return [value, setValue, attributes];
}
