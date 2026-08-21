import * as React from 'react';

import { createTypeRegistry } from '@/visualizations/registry';
import type { RoboTypeRegistry } from '@/visualizations/registry';
import type {
  RoboCorrelationFilters,
  RoboDataSourceConfig,
  RoboOsintEntity,
  RoboOsintEvent,
  RoboOsintRelationship,
} from '@/visualizations/types';

// ---------------------------------------------------------------------------
// Default filter state
// ---------------------------------------------------------------------------

const DEFAULT_FILTERS: RoboCorrelationFilters = {
  entityTypes: [],
  sourceTypes: [],
  severityLevels: [],
  searchQuery: '',
  dateRange: null,
  geoRegion: null,
  minConfidence: 0,
  minRiskScore: 0,
};

// ---------------------------------------------------------------------------
// Filter helpers
// ---------------------------------------------------------------------------

function filterEntities(
  entities: RoboOsintEntity[],
  filters: RoboCorrelationFilters,
): RoboOsintEntity[] {
  return entities.filter((entity) => {
    // entityTypes — must match one of the specified types
    if (filters.entityTypes.length > 0 && !filters.entityTypes.includes(entity.type)) {
      return false;
    }

    // sourceTypes — entity must have at least one source in the filter list
    if (
      filters.sourceTypes.length > 0 &&
      !entity.sources.some((s) => filters.sourceTypes.includes(s))
    ) {
      return false;
    }

    // searchQuery — case-insensitive match on name or any alias
    if (filters.searchQuery.trim() !== '') {
      const query = filters.searchQuery.toLowerCase();
      const nameMatch = entity.name.toLowerCase().includes(query);
      const aliasMatch = entity.aliases?.some((alias) =>
        alias.toLowerCase().includes(query),
      ) ?? false;
      if (!nameMatch && !aliasMatch) {
        return false;
      }
    }

    // dateRange — lastSeen must fall within [start, end]
    if (filters.dateRange !== null) {
      const [start, end] = filters.dateRange;
      const lastSeenMs = entity.lastSeen;
      if (lastSeenMs < start.getTime() || lastSeenMs > end.getTime()) {
        return false;
      }
    }

    // minConfidence — exclude entities below the threshold
    if (entity.confidence < filters.minConfidence) {
      return false;
    }

    // minRiskScore — exclude entities with a defined riskScore below the threshold
    if (
      entity.riskScore !== undefined &&
      entity.riskScore < filters.minRiskScore
    ) {
      return false;
    }

    // geoRegion — skipped in initial version (always passes through)

    return true;
  });
}

function filterRelationships(
  relationships: RoboOsintRelationship[],
  passedEntityIds: Set<string>,
): RoboOsintRelationship[] {
  return relationships.filter(
    (rel) =>
      passedEntityIds.has(rel.sourceEntityId) &&
      passedEntityIds.has(rel.targetEntityId),
  );
}

// ---------------------------------------------------------------------------
// Reducer — filter and selection state
// ---------------------------------------------------------------------------

interface CorrelationState {
  filters: RoboCorrelationFilters;
  selectedEntityIds: Set<string>;
  focusedEntityId: string | null;
}

type CorrelationAction =
  | { type: 'SET_FILTERS'; payload: Partial<RoboCorrelationFilters> }
  | { type: 'RESET_FILTERS' }
  | { type: 'SELECT_ENTITY'; id: string; mode: 'replace' | 'toggle' | 'add' }
  | { type: 'CLEAR_SELECTION' }
  | { type: 'FOCUS_ENTITY'; id: string | null };

function correlationReducer(
  state: CorrelationState,
  action: CorrelationAction,
): CorrelationState {
  switch (action.type) {
    case 'SET_FILTERS':
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
      };

    case 'RESET_FILTERS':
      return { ...state, filters: { ...DEFAULT_FILTERS } };

    case 'SELECT_ENTITY': {
      const { id, mode } = action;
      if (mode === 'replace') {
        return { ...state, selectedEntityIds: new Set([id]) };
      }
      if (mode === 'toggle') {
        const next = new Set(state.selectedEntityIds);
        if (next.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
        }
        return { ...state, selectedEntityIds: next };
      }
      // add
      return {
        ...state,
        selectedEntityIds: new Set([...state.selectedEntityIds, id]),
      };
    }

    case 'CLEAR_SELECTION':
      return { ...state, selectedEntityIds: new Set() };

    case 'FOCUS_ENTITY':
      return { ...state, focusedEntityId: action.id };

    default:
      return state;
  }
}

// ---------------------------------------------------------------------------
// Context value shape
// ---------------------------------------------------------------------------

export interface RoboCorrelationContextValue {
  // Data
  entities: RoboOsintEntity[];
  relationships: RoboOsintRelationship[];
  events: RoboOsintEvent[];
  dataSources: RoboDataSourceConfig[];
  // Filter state
  filters: RoboCorrelationFilters;
  // Derived (post-filter)
  filteredEntities: RoboOsintEntity[];
  filteredRelationships: RoboOsintRelationship[];
  // Selection / focus
  selectedEntityIds: Set<string>;
  focusedEntityId: string | null;
  // Registry
  registry: RoboTypeRegistry;
  // Actions
  actions: {
    setFilters: (partial: Partial<RoboCorrelationFilters>) => void;
    resetFilters: () => void;
    selectEntity: (id: string, mode?: 'replace' | 'toggle' | 'add') => void;
    clearSelection: () => void;
    focusEntity: (id: string | null) => void;
    getEntityById: (id: string) => RoboOsintEntity | undefined;
    getRelationshipsForEntity: (entityId: string) => RoboOsintRelationship[];
    getEventsForEntity: (entityId: string) => RoboOsintEvent[];
  };
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const RoboCorrelationContext = React.createContext<RoboCorrelationContextValue | null>(
  null,
);
RoboCorrelationContext.displayName = 'RoboCorrelationContext';

/**
 * useRoboCorrelation — consume the OSINT correlation context.
 *
 * Must be called inside a `RoboCorrelationProvider`. Throws if used outside.
 *
 * @example
 * ```tsx
 * function EntityList() {
 *   const { filteredEntities, actions } = useRoboCorrelation();
 *   return (
 *     <ul>
 *       {filteredEntities.map((e) => (
 *         <li key={e.id} onClick={() => actions.selectEntity(e.id)}>
 *           {e.name}
 *         </li>
 *       ))}
 *     </ul>
 *   );
 * }
 * ```
 */
export function useRoboCorrelation(): RoboCorrelationContextValue {
  const ctx = React.use(RoboCorrelationContext);
  if (ctx === null) {
    throw new Error(
      'useRoboCorrelation must be used within a RoboCorrelationProvider',
    );
  }
  return ctx;
}

// ---------------------------------------------------------------------------
// Provider props
// ---------------------------------------------------------------------------

export interface RoboCorrelationProviderProps {
  /** All entities in the OSINT knowledge graph */
  entities: RoboOsintEntity[];
  /** All relationships between entities */
  relationships: RoboOsintRelationship[];
  /** Optional timeline events associated with entities */
  events?: RoboOsintEvent[];
  /** Optional data source configurations */
  dataSources?: RoboDataSourceConfig[];
  /** Initial filter overrides applied on first render */
  defaultFilters?: Partial<RoboCorrelationFilters>;
  /** Called whenever filter state changes */
  onFiltersChange?: (filters: RoboCorrelationFilters) => void;
  /** Called whenever the entity selection changes */
  onSelectionChange?: (ids: string[]) => void;
  children: React.ReactNode;
}

// ---------------------------------------------------------------------------
// RoboCorrelationProvider
// ---------------------------------------------------------------------------

/**
 * RoboCorrelationProvider — root context provider for the OSINT correlation system.
 *
 * Manages entity/relationship/event data, filter state, entity selection,
 * and exposes a stable type registry for visual configuration. All OSINT
 * components must be mounted inside this provider.
 *
 * @example
 * ```tsx
 * <RoboCorrelationProvider
 *   entities={entities}
 *   relationships={relationships}
 *   events={events}
 *   dataSources={dataSources}
 *   onFiltersChange={(f) => console.log('filters changed', f)}
 * >
 *   <RoboCorrelationGraph />
 * </RoboCorrelationProvider>
 * ```
 */
function RoboCorrelationProvider({
  entities,
  relationships,
  events = [],
  dataSources = [],
  defaultFilters,
  onFiltersChange,
  onSelectionChange,
  children,
}: RoboCorrelationProviderProps): React.ReactElement {
  // Stable type registry — one instance per provider mount
  const registry = React.useMemo(() => createTypeRegistry(), []);

  // Reducer for filter + selection + focus state
  const [state, dispatch] = React.useReducer(correlationReducer, undefined, () => ({
    filters: { ...DEFAULT_FILTERS, ...defaultFilters },
    selectedEntityIds: new Set<string>(),
    focusedEntityId: null,
  }));

  // Notify parent when filters change
  const prevFiltersRef = React.useRef<RoboCorrelationFilters>(state.filters);
  React.useEffect(() => {
    if (prevFiltersRef.current !== state.filters) {
      prevFiltersRef.current = state.filters;
      onFiltersChange?.(state.filters);
    }
  }, [state.filters, onFiltersChange]);

  // Notify parent when selection changes
  const prevSelectionRef = React.useRef<Set<string>>(state.selectedEntityIds);
  React.useEffect(() => {
    if (prevSelectionRef.current !== state.selectedEntityIds) {
      prevSelectionRef.current = state.selectedEntityIds;
      onSelectionChange?.([...state.selectedEntityIds]);
    }
  }, [state.selectedEntityIds, onSelectionChange]);

  // Derived — filtered entities and relationships
  const filteredEntities = React.useMemo(
    () => filterEntities(entities, state.filters),
    [entities, state.filters],
  );

  const filteredEntityIdSet = React.useMemo(
    () => new Set(filteredEntities.map((e) => e.id)),
    [filteredEntities],
  );

  const filteredRelationships = React.useMemo(
    () => filterRelationships(relationships, filteredEntityIdSet),
    [relationships, filteredEntityIdSet],
  );

  // Entity lookup map for O(1) access
  const entityMap = React.useMemo(
    () => new Map(entities.map((e) => [e.id, e])),
    [entities],
  );

  // Stable action callbacks
  const setFilters = React.useCallback(
    (partial: Partial<RoboCorrelationFilters>) => {
      dispatch({ type: 'SET_FILTERS', payload: partial });
    },
    [],
  );

  const resetFilters = React.useCallback(() => {
    dispatch({ type: 'RESET_FILTERS' });
  }, []);

  const selectEntity = React.useCallback(
    (id: string, mode: 'replace' | 'toggle' | 'add' = 'replace') => {
      dispatch({ type: 'SELECT_ENTITY', id, mode });
    },
    [],
  );

  const clearSelection = React.useCallback(() => {
    dispatch({ type: 'CLEAR_SELECTION' });
  }, []);

  const focusEntity = React.useCallback((id: string | null) => {
    dispatch({ type: 'FOCUS_ENTITY', id });
  }, []);

  const getEntityById = React.useCallback(
    (id: string): RoboOsintEntity | undefined => entityMap.get(id),
    [entityMap],
  );

  const getRelationshipsForEntity = React.useCallback(
    (entityId: string): RoboOsintRelationship[] =>
      relationships.filter(
        (r) => r.sourceEntityId === entityId || r.targetEntityId === entityId,
      ),
    [relationships],
  );

  const getEventsForEntity = React.useCallback(
    (entityId: string): RoboOsintEvent[] =>
      events.filter((ev) => ev.entityId === entityId),
    [events],
  );

  // Stable actions object — only recreated when any callback changes
  const actions = React.useMemo(
    () => ({
      setFilters,
      resetFilters,
      selectEntity,
      clearSelection,
      focusEntity,
      getEntityById,
      getRelationshipsForEntity,
      getEventsForEntity,
    }),
    [
      setFilters,
      resetFilters,
      selectEntity,
      clearSelection,
      focusEntity,
      getEntityById,
      getRelationshipsForEntity,
      getEventsForEntity,
    ],
  );

  const contextValue = React.useMemo<RoboCorrelationContextValue>(
    () => ({
      entities,
      relationships,
      events,
      dataSources,
      filters: state.filters,
      filteredEntities,
      filteredRelationships,
      selectedEntityIds: state.selectedEntityIds,
      focusedEntityId: state.focusedEntityId,
      registry,
      actions,
    }),
    [
      entities,
      relationships,
      events,
      dataSources,
      state.filters,
      filteredEntities,
      filteredRelationships,
      state.selectedEntityIds,
      state.focusedEntityId,
      registry,
      actions,
    ],
  );

  return (
    <RoboCorrelationContext value={contextValue}>
      {children}
    </RoboCorrelationContext>
  );
}
RoboCorrelationProvider.displayName = 'RoboCorrelationProvider';

export { RoboCorrelationContext, RoboCorrelationProvider };
