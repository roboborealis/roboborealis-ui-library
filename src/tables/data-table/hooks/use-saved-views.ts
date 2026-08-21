'use client';

import * as React from 'react';
import type { Table } from '@tanstack/react-table';

import type { StorageAdapter } from '@/core/storage-adapter';
import type { SavedView, SavedViewState } from '../types';

// ---------------------------------------------------------------------------
// useSavedViews — view persistence via StorageAdapter
// ---------------------------------------------------------------------------

export interface UseSavedViewsOptions<TData> {
  table: Table<TData>;
  /** StorageAdapter for persistence (localStorage, noop, etc.). */
  storageAdapter?: StorageAdapter;
  /** Storage key prefix. Views stored under `${storageKey}:saved-views`. */
  storageKey?: string;
  /** Externally managed saved views (server-side). */
  savedViews?: SavedView[];
  /** Callback when a view is saved. */
  onViewSave?: (view: SavedView) => void;
  /** Callback when a view is deleted. */
  onViewDelete?: (viewId: string) => void;
  /** Callback when a view is loaded. */
  onViewLoad?: (view: SavedView) => void;
}

export interface UseSavedViewsReturn {
  /** All saved views. */
  views: SavedView[];
  /** Currently active view, or null. */
  activeView: SavedView | null;
  /** Save the current table state as a new or updated view. */
  saveView: (name: string, viewId?: string) => void;
  /** Delete a saved view by ID. */
  deleteView: (viewId: string) => void;
  /** Load a saved view (applies its state to the table). */
  loadView: (viewId: string) => void;
  /** Set a view as the default. */
  setDefaultView: (viewId: string) => void;
  /** Reset table to default state (no view applied). */
  resetToDefault: () => void;
}

function captureTableState<TData>(table: Table<TData>): SavedViewState {
  return {
    sorting: table.getState().sorting,
    columnFilters: table.getState().columnFilters,
    columnVisibility: table.getState().columnVisibility,
    columnOrder: table.getState().columnOrder,
    columnPinning: table.getState().columnPinning,
    globalFilter: table.getState().globalFilter ?? '',
    pageSize: table.getState().pagination.pageSize,
  };
}

function generateId(): string {
  return `view_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Hook that manages saved table views — saving, loading, deleting, and
 * persisting via a StorageAdapter.
 *
 * Views capture: sorting, filters, visibility, order, pinning, global filter, page size.
 *
 * @example
 * ```tsx
 * const { views, saveView, loadView, deleteView } = useSavedViews({
 *   table,
 *   storageAdapter: createLocalStorageAdapter(),
 *   storageKey: 'satellite-constellation',
 * });
 * ```
 */
export function useSavedViews<TData>(
  options: UseSavedViewsOptions<TData>,
): UseSavedViewsReturn {
  const {
    table,
    storageAdapter,
    storageKey = 'robo-table',
    savedViews: externalViews,
    onViewSave,
    onViewDelete,
    onViewLoad,
  } = options;

  const fullKey = `${storageKey}:saved-views`;

  // Initialize views from storage or external prop
  const [views, setViews] = React.useState<SavedView[]>(() => {
    if (externalViews) return externalViews;
    if (storageAdapter) {
      const stored = storageAdapter.get(fullKey);
      if (stored) {
        try {
          return JSON.parse(stored) as SavedView[];
        } catch {
          return [];
        }
      }
    }
    return [];
  });

  const [activeViewId, setActiveViewId] = React.useState<string | null>(null);

  // Sync external views when prop changes
  React.useEffect(() => {
    if (externalViews) {
      setViews(externalViews);
    }
  }, [externalViews]);

  // Stabilize external callbacks via refs
  const onViewSaveRef = React.useRef(onViewSave);
  onViewSaveRef.current = onViewSave;
  const onViewDeleteRef = React.useRef(onViewDelete);
  onViewDeleteRef.current = onViewDelete;
  const onViewLoadRef = React.useRef(onViewLoad);
  onViewLoadRef.current = onViewLoad;

  // Persist views to storage on change
  const persistViews = React.useCallback(
    (updatedViews: SavedView[]) => {
      setViews(updatedViews);
      if (storageAdapter) {
        storageAdapter.set(fullKey, JSON.stringify(updatedViews));
      }
    },
    [storageAdapter, fullKey],
  );

  const applyViewState = React.useCallback(
    (state: SavedViewState) => {
      table.setSorting(state.sorting);
      table.setColumnFilters(state.columnFilters);
      table.setColumnVisibility(state.columnVisibility);
      table.setColumnOrder(state.columnOrder);
      table.setColumnPinning(state.columnPinning);
      table.setGlobalFilter(state.globalFilter);
      table.setPagination((prev) => ({
        ...prev,
        pageSize: state.pageSize,
      }));
    },
    [table],
  );

  // Load default view on mount
  React.useEffect(() => {
    const defaultView = views.find((v) => v.isDefault);
    if (defaultView && !activeViewId) {
      applyViewState(defaultView.state);
      setActiveViewId(defaultView.id);
    }
    // Only run on mount — table and applyViewState are stable
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveView = React.useCallback(
    (name: string, viewId?: string) => {
      const state = captureTableState(table);

      if (viewId) {
        // Update existing view
        const updated = views.map((v) =>
          v.id === viewId ? { ...v, name, state } : v,
        );
        persistViews(updated);
        const updatedView = updated.find((v) => v.id === viewId);
        if (updatedView) onViewSaveRef.current?.(updatedView);
      } else {
        // Create new view
        const newView: SavedView = {
          id: generateId(),
          name,
          isDefault: views.length === 0,
          createdAt: new Date().toISOString(),
          state,
        };
        persistViews([...views, newView]);
        setActiveViewId(newView.id);
        onViewSaveRef.current?.(newView);
      }
    },
    [table, views, persistViews],
  );

  const deleteView = React.useCallback(
    (viewId: string) => {
      const updated = views.filter((v) => v.id !== viewId);
      persistViews(updated);
      if (activeViewId === viewId) {
        setActiveViewId(null);
      }
      onViewDeleteRef.current?.(viewId);
    },
    [views, activeViewId, persistViews],
  );

  const loadView = React.useCallback(
    (viewId: string) => {
      const view = views.find((v) => v.id === viewId);
      if (!view) return;
      applyViewState(view.state);
      setActiveViewId(viewId);
      onViewLoadRef.current?.(view);
    },
    [views, applyViewState],
  );

  const setDefaultView = React.useCallback(
    (viewId: string) => {
      const updated = views.map((v) => ({
        ...v,
        isDefault: v.id === viewId,
      }));
      persistViews(updated);
    },
    [views, persistViews],
  );

  const resetToDefault = React.useCallback(() => {
    table.resetSorting();
    table.resetColumnFilters();
    table.resetColumnVisibility();
    table.resetColumnOrder();
    table.resetColumnPinning();
    table.setGlobalFilter('');
    table.resetPagination();
    setActiveViewId(null);
  }, [table]);

  const activeView = views.find((v) => v.id === activeViewId) ?? null;

  return {
    views,
    activeView,
    saveView,
    deleteView,
    loadView,
    setDefaultView,
    resetToDefault,
  };
}
