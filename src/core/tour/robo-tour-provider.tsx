'use client';

import * as React from 'react';

import { type StorageAdapter, createLocalStorageAdapter } from '../storage-adapter';

const defaultStorageAdapter = createLocalStorageAdapter();

/** A registered tour merged with its current completion state — what `list()`
 *  returns for a Settings UI. */
export interface RegisteredTour {
  id: string;
  label: string;
  completed: boolean;
}

interface TourContextValue {
  register: (id: string, label: string) => void;
  unregister: (id: string) => void;
  isCompleted: (id: string) => boolean;
  complete: (id: string) => void;
  restart: (id: string) => void;
  subscribeRestart: (id: string, handler: () => void) => () => void;
  list: () => RegisteredTour[];
}

const TourContext = React.createContext<TourContextValue | null>(null);

export interface RoboTourProviderProps {
  storageAdapter?: StorageAdapter;
  /** Prefix for each tour's own storage key: `${storageKeyPrefix}:${id}`.
   *  Default: `'robo-tour'`. Every tour gets its own key (rather than one JSON
   *  blob) so unrelated tours — and unrelated Storybook stories mounting
   *  different starters — never collide on a shared "seen" flag. */
  storageKeyPrefix?: string;
  children: React.ReactNode;
}

/**
 * RoboTourProvider — app-wide registry of guided product tours. Mirrors
 * `RoboKeybindProvider`'s registry shape: components register a named tour
 * (id + label) via `useTour`, each tour's completed flag persists under its
 * own storage key via the shared `StorageAdapter`, and a Settings UI can list
 * every registered tour generically via `useTourRegistry().list()` — adding a
 * second or third tour later needs no Settings code change.
 *
 * @example
 * ```tsx
 * <RoboTourProvider>
 *   <App />
 * </RoboTourProvider>
 * ```
 */
function RoboTourProvider({
  storageAdapter = defaultStorageAdapter,
  storageKeyPrefix = 'robo-tour',
  children,
}: RoboTourProviderProps) {
  const toursRef = React.useRef<Map<string, { label: string }>>(new Map());
  const restartHandlersRef = React.useRef<Map<string, Set<() => void>>>(new Map());
  const [completedMap, setCompletedMap] = React.useState<Record<string, boolean>>({});
  const [registryVersion, setRegistryVersion] = React.useState(0);

  const storageKey = React.useCallback((id: string) => `${storageKeyPrefix}:${id}`, [storageKeyPrefix]);

  const register = React.useCallback(
    (id: string, label: string) => {
      const isNew = !toursRef.current.has(id);
      toursRef.current.set(id, { label });
      if (isNew) {
        const stored = storageAdapter.get(storageKey(id));
        setCompletedMap((prev) => ({ ...prev, [id]: stored === 'true' }));
        setRegistryVersion((v) => v + 1);
      }
    },
    [storageAdapter, storageKey]
  );

  const unregister = React.useCallback((id: string) => {
    const existed = toursRef.current.delete(id);
    restartHandlersRef.current.delete(id);
    if (existed) setRegistryVersion((v) => v + 1);
  }, []);

  const isCompleted = React.useCallback((id: string) => completedMap[id] ?? false, [completedMap]);

  const complete = React.useCallback(
    (id: string) => {
      storageAdapter.set(storageKey(id), 'true');
      setCompletedMap((prev) => ({ ...prev, [id]: true }));
    },
    [storageAdapter, storageKey]
  );

  const restart = React.useCallback(
    (id: string) => {
      storageAdapter.set(storageKey(id), 'false');
      setCompletedMap((prev) => ({ ...prev, [id]: false }));
      restartHandlersRef.current.get(id)?.forEach((handler) => handler());
    },
    [storageAdapter, storageKey]
  );

  const subscribeRestart = React.useCallback((id: string, handler: () => void) => {
    let handlers = restartHandlersRef.current.get(id);
    if (!handlers) {
      handlers = new Set();
      restartHandlersRef.current.set(id, handlers);
    }
    handlers.add(handler);
    return () => {
      handlers!.delete(handler);
    };
  }, []);

  const list = React.useCallback((): RegisteredTour[] => {
    return Array.from(toursRef.current.entries()).map(([id, { label }]) => ({
      id,
      label,
      completed: completedMap[id] ?? false,
    }));
    // `registryVersion` isn't read directly, but this must re-derive whenever
    // a tour registers/unregisters so `list()` reflects the current set.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [completedMap, registryVersion]);

  const value = React.useMemo<TourContextValue>(
    () => ({ register, unregister, isCompleted, complete, restart, subscribeRestart, list }),
    [register, unregister, isCompleted, complete, restart, subscribeRestart, list]
  );

  return <TourContext value={value}>{children}</TourContext>;
}
RoboTourProvider.displayName = 'RoboTourProvider';

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------

export interface TourAction {
  /** Stable, namespaced id, e.g. `"map-dashboard-starter"`. Also used as the
   *  storage key suffix. */
  id: string;
  /** Human-readable label shown in the Settings tour list. */
  label: string;
}

interface UseTourResult {
  completed: boolean;
  complete: () => void;
  /** Subscribe to explicit restarts (e.g. triggered from
   *  `RoboTourSettingsCard`). Returns an unsubscribe function. */
  onRestart: (handler: () => void) => () => void;
}

/**
 * Registers a named tour and returns its completion state, a completion
 * setter, and a restart subscription. Used internally by `RoboProductTour`,
 * but also exported for consumers who want to drive `react-joyride` (or a
 * fully custom tooltip renderer) themselves.
 *
 * Safe to call outside a mounted `RoboTourProvider`: falls back to local,
 * non-persisted state, matching the no-throw fallback `useGlassMode()` /
 * `useRegisterKeybind()` use — `RoboProductTour` keeps working standalone in
 * Storybook, unit tests, and apps that haven't adopted the provider yet.
 */
function useTour(action: TourAction): UseTourResult {
  const ctx = React.use(TourContext);
  const [fallbackCompleted, setFallbackCompleted] = React.useState(false);
  const fallbackHandlersRef = React.useRef<Set<() => void>>(new Set());

  React.useEffect(() => {
    if (!ctx) return;
    ctx.register(action.id, action.label);
    return () => ctx.unregister(action.id);
    // Depend on `ctx.register`/`ctx.unregister` themselves (individually
    // stable), NOT on `ctx` as a whole — mirrors `useRegisterKeybind`'s
    // reasoning: `ctx`'s container object is recreated on registry churn,
    // which would otherwise re-run this effect and loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctx?.register, ctx?.unregister, action.id, action.label]);

  if (!ctx) {
    return {
      completed: fallbackCompleted,
      complete: () => setFallbackCompleted(true),
      onRestart: (handler) => {
        fallbackHandlersRef.current.add(handler);
        return () => fallbackHandlersRef.current.delete(handler);
      },
    };
  }

  return {
    completed: ctx.isCompleted(action.id),
    complete: () => ctx.complete(action.id),
    onRestart: (handler) => ctx.subscribeRestart(action.id, handler),
  };
}

interface UseTourRegistryResult {
  list: () => RegisteredTour[];
  restart: (id: string) => void;
  restartAll: () => void;
}

/**
 * Whole-registry accessor for admin/Settings UIs that list and restart every
 * registered tour, not just one (`RoboTourSettingsCard` uses this). Unlike
 * `useTour`, this throws outside a mounted `RoboTourProvider` — there's no
 * meaningful "list of registered tours" without a shared registry to read
 * from (mirrors `useKeybindRegistry`).
 */
function useTourRegistry(): UseTourRegistryResult {
  const ctx = React.use(TourContext);
  if (!ctx) {
    throw new Error('useTourRegistry must be used within a RoboTourProvider');
  }
  return {
    list: ctx.list,
    restart: ctx.restart,
    restartAll: () => ctx.list().forEach((tour) => ctx.restart(tour.id)),
  };
}

export { RoboTourProvider, useTour, useTourRegistry };
