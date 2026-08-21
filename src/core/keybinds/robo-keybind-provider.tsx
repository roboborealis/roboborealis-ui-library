'use client';

import * as React from 'react';

import { type StorageAdapter, createLocalStorageAdapter } from '../storage-adapter';
import { comboMatchesEvent } from './robo-keybind-utils';
import type { KeybindAction, KeybindCombo, RegisteredKeybind } from './robo-keybind-types';

const defaultStorageAdapter = createLocalStorageAdapter();

type KeybindOverrides = Record<string, KeybindCombo>;

// <input> types that don't accept typed text — a checkbox/radio/range/etc.
// shouldn't block a single-letter shortcut just because it happens to have
// focus, unlike a text/search/number/email/password field.
const NON_EDITABLE_INPUT_TYPES = new Set([
  'checkbox', 'radio', 'button', 'submit', 'reset', 'range', 'color', 'file', 'image',
]);

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  if (target.tagName === 'TEXTAREA') return true;
  if (target.tagName === 'INPUT') {
    return !NON_EDITABLE_INPUT_TYPES.has((target as HTMLInputElement).type);
  }
  return false;
}

interface KeybindContextValue {
  getCombo: (id: string) => KeybindCombo | undefined;
  register: (action: KeybindAction) => void;
  unregister: (id: string) => void;
  setCombo: (id: string, combo: KeybindCombo) => void;
  resetCombo: (id: string) => void;
  subscribe: (id: string, handler: () => void) => () => void;
  list: () => RegisteredKeybind[];
}

const KeybindContext = React.createContext<KeybindContextValue | null>(null);

export interface RoboKeybindProviderProps {
  storageAdapter?: StorageAdapter;
  /** Default: `'robo-keybinds'`. One JSON blob holding every user override. */
  storageKey?: string;
  children: React.ReactNode;
}

/**
 * RoboKeybindProvider — app-wide registry of reassignable keyboard shortcuts.
 * Components register a named action (id + label + default combo) via
 * `useKeybind`/`useRegisterKeybind`; user overrides persist under one storage
 * key, layered on top of the code-registered defaults, via the same
 * `StorageAdapter` every other Robo preference provider uses.
 *
 * Mounts a single global `keydown` listener — not one per registered
 * shortcut — that matches every action's effective combo against each event,
 * and skips matching while focus is in an editable field (`<input>`,
 * `<textarea>`, `contenteditable`) unless the action opts in via
 * `allowInEditableFields`. Without this guard, an unmodified shortcut like a
 * bare `l` would hijack focus every time that letter is typed anywhere.
 *
 * @example
 * ```tsx
 * <RoboKeybindProvider>
 *   <App />
 * </RoboKeybindProvider>
 * ```
 */
function RoboKeybindProvider({
  storageAdapter = defaultStorageAdapter,
  storageKey = 'robo-keybinds',
  children,
}: RoboKeybindProviderProps) {
  const actionsRef = React.useRef<Map<string, KeybindAction>>(new Map());
  const handlersRef = React.useRef<Map<string, Set<() => void>>>(new Map());
  const [registryVersion, setRegistryVersion] = React.useState(0);

  const [overrides, setOverrides] = React.useState<KeybindOverrides>(() => {
    const stored = storageAdapter.get(storageKey);
    if (!stored) return {};
    try {
      const parsed: unknown = JSON.parse(stored);
      return parsed && typeof parsed === 'object' ? (parsed as KeybindOverrides) : {};
    } catch {
      return {};
    }
  });

  const persist = React.useCallback(
    (next: KeybindOverrides) => {
      setOverrides(next);
      storageAdapter.set(storageKey, JSON.stringify(next));
    },
    [storageAdapter, storageKey]
  );

  const getCombo = React.useCallback(
    (id: string) => overrides[id] ?? actionsRef.current.get(id)?.defaultCombo,
    [overrides]
  );

  const register = React.useCallback((action: KeybindAction) => {
    const isNew = !actionsRef.current.has(action.id);
    actionsRef.current.set(action.id, action);
    if (isNew) setRegistryVersion((v) => v + 1);
  }, []);

  const unregister = React.useCallback((id: string) => {
    const existed = actionsRef.current.delete(id);
    handlersRef.current.delete(id);
    if (existed) setRegistryVersion((v) => v + 1);
  }, []);

  const setCombo = React.useCallback(
    (id: string, combo: KeybindCombo) => persist({ ...overrides, [id]: combo }),
    [overrides, persist]
  );

  const resetCombo = React.useCallback(
    (id: string) => {
      const next = { ...overrides };
      delete next[id];
      persist(next);
    },
    [overrides, persist]
  );

  const subscribe = React.useCallback((id: string, handler: () => void) => {
    let handlers = handlersRef.current.get(id);
    if (!handlers) {
      handlers = new Set();
      handlersRef.current.set(id, handlers);
    }
    handlers.add(handler);
    return () => {
      handlers!.delete(handler);
    };
  }, []);

  const list = React.useCallback((): RegisteredKeybind[] => {
    return Array.from(actionsRef.current.values()).map((action) => {
      const combo = overrides[action.id] ?? action.defaultCombo;
      return { ...action, combo, isCustomized: combo !== action.defaultCombo };
    });
    // `registryVersion` isn't read directly, but this must re-derive whenever
    // an action registers/unregisters so `list()` reflects the current set.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [overrides, registryVersion]);

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const editable = isEditableTarget(event.target);
      for (const action of actionsRef.current.values()) {
        if (editable && !action.allowInEditableFields) continue;
        const combo = overrides[action.id] ?? action.defaultCombo;
        if (!comboMatchesEvent(combo, event)) continue;
        const handlers = handlersRef.current.get(action.id);
        if (!handlers || handlers.size === 0) continue;
        event.preventDefault();
        handlers.forEach((handler) => handler());
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [overrides]);

  const value = React.useMemo<KeybindContextValue>(
    () => ({ getCombo, register, unregister, setCombo, resetCombo, subscribe, list }),
    [getCombo, register, unregister, setCombo, resetCombo, subscribe, list]
  );

  return <KeybindContext.Provider value={value}>{children}</KeybindContext.Provider>;
}
RoboKeybindProvider.displayName = 'RoboKeybindProvider';

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------

interface UseRegisterKeybindResult {
  combo: KeybindCombo;
  isCustomized: boolean;
  setCombo: (combo: KeybindCombo) => void;
  resetCombo: () => void;
}

/**
 * Registers a keybind action's metadata and returns its effective combo plus
 * setters — without subscribing a handler. Use this for a component that
 * only needs to read/display/edit a combo (e.g. the Settings keybinds list).
 *
 * Safe to call outside a mounted `RoboKeybindProvider`: falls back to local,
 * non-persisted state seeded with `action.defaultCombo`, matching the
 * no-throw fallback `useGlassMode()` uses (`robo-glass-mode-provider.tsx`) —
 * components using this hook keep working standalone in Storybook, unit
 * tests, and apps that haven't adopted the provider yet.
 */
function useRegisterKeybind(action: KeybindAction): UseRegisterKeybindResult {
  const ctx = React.useContext(KeybindContext);
  const [fallbackCombo, setFallbackCombo] = React.useState(action.defaultCombo);

  React.useEffect(() => {
    if (!ctx) return;
    ctx.register(action);
    return () => ctx.unregister(action.id);
    // Depend on `ctx.register`/`ctx.unregister` themselves (individually
    // stable — memoized with `[]` deps in the provider), NOT on `ctx` as a
    // whole. `ctx`'s container object is recreated whenever `list()` changes
    // (e.g. on every register/unregister, to keep the Settings UI reactive)
    // — depending on the container here would re-run this effect on that
    // same churn, re-registering the action, bumping the registry version
    // again, and looping forever.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctx?.register, ctx?.unregister, action.id, action.label, action.defaultCombo, action.allowInEditableFields]);

  if (!ctx) {
    return {
      combo: fallbackCombo,
      isCustomized: fallbackCombo !== action.defaultCombo,
      setCombo: setFallbackCombo,
      resetCombo: () => setFallbackCombo(action.defaultCombo),
    };
  }

  const combo = ctx.getCombo(action.id) ?? action.defaultCombo;
  return {
    combo,
    isCustomized: combo !== action.defaultCombo,
    setCombo: (next: KeybindCombo) => ctx.setCombo(action.id, next),
    resetCombo: () => ctx.resetCombo(action.id),
  };
}

/**
 * Registers a keybind action AND subscribes `handler` to fire whenever its
 * current combo is pressed. This is the one-line self-wire a component like
 * `RoboQuickPanel` uses: `useKeybind({ id, label, defaultCombo }, () => toggle())`.
 *
 * Falls back to a local, provider-less `keydown` listener when no
 * `RoboKeybindProvider` is mounted, matching `useRegisterKeybind`'s fallback —
 * the handler still fires on `action.defaultCombo`, just without shared
 * registration or persistence.
 */
function useKeybind(action: KeybindAction, handler: () => void): UseRegisterKeybindResult {
  const ctx = React.useContext(KeybindContext);
  const result = useRegisterKeybind(action);
  const handlerRef = React.useRef(handler);
  handlerRef.current = handler;

  React.useEffect(() => {
    if (ctx) return ctx.subscribe(action.id, () => handlerRef.current());

    const listener = (event: KeyboardEvent) => {
      const editable = isEditableTarget(event.target);
      if (editable && !action.allowInEditableFields) return;
      if (!comboMatchesEvent(result.combo, event)) return;
      event.preventDefault();
      handlerRef.current();
    };
    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
    // Same reasoning as `useRegisterKeybind`'s effect: depend on `ctx.subscribe`
    // (stable) rather than `ctx` (recreated on registry churn).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctx?.subscribe, action.id, action.allowInEditableFields, result.combo]);

  return result;
}

interface UseKeybindRegistryResult {
  list: () => RegisteredKeybind[];
  setCombo: (id: string, combo: KeybindCombo) => void;
  resetCombo: (id: string) => void;
}

/**
 * Whole-registry accessor for admin/settings UIs that list and edit every
 * registered shortcut, not just one (`AppShellTemplate`'s Keybinds settings
 * card uses this). Unlike `useKeybind`/`useRegisterKeybind`, this throws
 * outside a mounted `RoboKeybindProvider` — there's no meaningful "list of
 * registered actions" without a shared registry to read from.
 */
function useKeybindRegistry(): UseKeybindRegistryResult {
  const ctx = React.useContext(KeybindContext);
  if (!ctx) {
    throw new Error('useKeybindRegistry must be used within a RoboKeybindProvider');
  }
  return { list: ctx.list, setCombo: ctx.setCombo, resetCombo: ctx.resetCombo };
}

export { RoboKeybindProvider, useRegisterKeybind, useKeybind, useKeybindRegistry };
