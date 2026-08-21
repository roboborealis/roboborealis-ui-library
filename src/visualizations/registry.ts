// ---------------------------------------------------------------------------
// @roboborealis/components/osint — Entity & Relationship Type Registry
//
// Maps type strings to visual config (icon, color, label, size). Ships with
// sensible defaults for all built-in types; consumers call register*() to add
// new ones at runtime. Unknown types get a generic fallback — no switch
// statements that break on new data.
// ---------------------------------------------------------------------------

import type { RoboEntityType, RoboRelationshipType } from './types';

// ---------------------------------------------------------------------------
// Entity type visual config
// ---------------------------------------------------------------------------

/** Visual configuration for an entity type in the graph/UI. */
export interface RoboEntityTypeConfig {
  /** CSS color (use theme variable or hex) */
  color: string;
  /** Human-readable label */
  label: string;
  /** Lucide icon name (or custom icon key) */
  icon: string;
  /** Default node size in graph views */
  defaultSize: number;
  /** Optional category for grouping in filters */
  category?: string;
  /**
   * Property keys to prefer for RoboEntityInspectorPanel's compact view and
   * copy text, in priority order. Purely additive/optional — every other
   * consumer of this config (RoboEntityDossier, RoboForceGraph,
   * RoboCorrelationMatrix, RoboFilterPanel) ignores it.
   */
  compactFields?: string[];
}

/** Fallback config for unknown entity types. */
const FALLBACK_ENTITY_CONFIG: RoboEntityTypeConfig = {
  color: 'var(--muted-foreground)',
  label: 'Unknown',
  icon: 'circle',
  defaultSize: 24,
  category: 'other',
};

/** Built-in entity type defaults. */
const DEFAULT_ENTITY_TYPES: Record<string, RoboEntityTypeConfig> = {
  'spacecraft': {
    color: 'var(--marker-coral)',
    label: 'Spacecraft',
    icon: 'rocket',
    defaultSize: 28,
    category: 'orbital',
    compactFields: ['operator', 'craft_type'],
  },
  'aircraft': {
    color: 'var(--marker-gold)',
    label: 'Aircraft',
    icon: 'plane',
    defaultSize: 26,
    category: 'airborne',
  },
  'satellite': {
    color: 'var(--marker-teal)',
    label: 'Satellite',
    icon: 'satellite',
    defaultSize: 22,
    category: 'space',
    compactFields: ['operator', 'orbit_type'],
  },
  'person': {
    color: 'var(--marker-indigo)',
    label: 'Person',
    icon: 'user',
    defaultSize: 24,
    category: 'human',
  },
  'company': {
    color: 'var(--marker-magenta)',
    label: 'Company',
    icon: 'building-2',
    defaultSize: 30,
    category: 'organization',
    compactFields: ['industry', 'hq_country'],
  },
  'organization': {
    color: 'var(--marker-magenta)',
    label: 'Organization',
    icon: 'building',
    defaultSize: 30,
    category: 'organization',
  },
  'ground-station': {
    color: 'var(--marker-green)',
    label: 'Ground Station',
    icon: 'radio-tower',
    defaultSize: 32,
    category: 'infrastructure',
    compactFields: ['operator', 'station_type'],
  },
  'orbital-sector': {
    color: 'var(--marker-forest)',
    label: 'Orbital Sector',
    icon: 'orbit',
    defaultSize: 26,
    category: 'orbital',
  },
  'facility': {
    color: 'var(--marker-slate)',
    label: 'Facility',
    icon: 'warehouse',
    defaultSize: 26,
    category: 'infrastructure',
    compactFields: ['facility_type', 'operator'],
  },
  'cell-tower': {
    color: 'var(--marker-violet)',
    label: 'Cell Tower',
    icon: 'signal',
    defaultSize: 22,
    category: 'infrastructure',
    compactFields: ['carrier', 'network_type'],
  },
  'power-plant': {
    color: 'var(--marker-amber)',
    label: 'Power Plant',
    icon: 'zap',
    defaultSize: 28,
    category: 'infrastructure',
  },
  'water-facility': {
    color: 'var(--marker-cyan)',
    label: 'Water Facility',
    icon: 'droplets',
    defaultSize: 26,
    category: 'infrastructure',
  },
  'agency': {
    color: 'var(--marker-steel)',
    label: 'Agency',
    icon: 'landmark',
    defaultSize: 30,
    category: 'administrative',
  },
  'airport': {
    color: 'var(--marker-coral)',
    label: 'Airport',
    icon: 'plane-takeoff',
    defaultSize: 28,
    category: 'infrastructure',
    compactFields: ['iata_code', 'country'],
  },
  'region': {
    color: 'var(--marker-gold)',
    label: 'Region',
    icon: 'map',
    defaultSize: 30,
    category: 'administrative',
    compactFields: ['name', 'category'],
  },
  'orbital-region': {
    color: 'var(--marker-teal)',
    label: 'Orbital Region',
    icon: 'orbit',
    defaultSize: 30,
    category: 'orbital',
    compactFields: ['name', 'area_km2'],
  },
  'country': {
    color: 'var(--marker-indigo)',
    label: 'Country',
    icon: 'globe',
    defaultSize: 32,
    category: 'administrative',
    compactFields: ['iso_code', 'capital'],
  },
  'city': {
    color: 'var(--marker-magenta)',
    label: 'City',
    icon: 'landmark',
    defaultSize: 28,
    category: 'administrative',
    compactFields: ['country', 'population'],
  },
  'building': {
    color: 'var(--marker-emerald)',
    label: 'Building',
    icon: 'building',
    defaultSize: 24,
    category: 'infrastructure',
    compactFields: ['building_type', 'address'],
  },
  'cable': {
    color: 'var(--marker-coral)',
    label: 'Cable',
    icon: 'cable',
    defaultSize: 24,
    category: 'infrastructure',
    compactFields: ['owners', 'length_km'],
  },
  'train': {
    color: 'var(--marker-gold)',
    label: 'Train',
    icon: 'train-front',
    defaultSize: 26,
    category: 'transport',
    compactFields: ['line', 'next_stop'],
  },
  'traffic-incident': {
    color: 'var(--marker-teal)',
    label: 'Traffic Incident',
    icon: 'traffic-cone',
    defaultSize: 24,
    category: 'transport',
    compactFields: ['severity', 'road_name'],
  },
  'coordinate': {
    color: 'var(--muted-foreground)',
    label: 'Coordinate',
    icon: 'map-pin',
    defaultSize: 22,
    category: 'other',
    compactFields: [],
  },
};

// ---------------------------------------------------------------------------
// Relationship type visual config
// ---------------------------------------------------------------------------

/** Visual configuration for a relationship type in the graph/UI. */
export interface RoboRelationshipTypeConfig {
  /** CSS color for the edge */
  color: string;
  /** Human-readable label */
  label: string;
  /** Dash pattern (empty = solid) */
  dashArray?: string;
  /** Default edge width */
  defaultWidth: number;
  /** Whether to show directional arrow */
  directional: boolean;
}

/** Fallback config for unknown relationship types. */
const FALLBACK_RELATIONSHIP_CONFIG: RoboRelationshipTypeConfig = {
  color: 'var(--muted-foreground)',
  label: 'Related',
  defaultWidth: 1,
  directional: false,
};

/** Built-in relationship type defaults. */
const DEFAULT_RELATIONSHIP_TYPES: Record<string, RoboRelationshipTypeConfig> = {
  'owner': {
    color: 'var(--marker-coral)',
    label: 'Owner',
    defaultWidth: 2,
    directional: true,
  },
  'operator': {
    color: 'var(--marker-gold)',
    label: 'Operator',
    defaultWidth: 2,
    directional: true,
  },
  'charterer': {
    color: 'var(--marker-teal)',
    label: 'Lessee',
    defaultWidth: 1.5,
    directional: true,
  },
  'crew': {
    color: 'var(--marker-indigo)',
    label: 'Crew',
    defaultWidth: 1,
    directional: true,
  },
  'flag': {
    color: 'var(--marker-steel)',
    label: 'Registered To',
    defaultWidth: 1.5,
    directional: true,
  },
  'port-call': {
    color: 'var(--marker-green)',
    label: 'Ground Contact',
    dashArray: '6 3',
    defaultWidth: 1.5,
    directional: true,
  },
  'co-located': {
    color: 'var(--marker-orange)',
    label: 'Co-Located',
    dashArray: '4 4',
    defaultWidth: 1,
    directional: false,
  },
  'communication': {
    color: 'var(--marker-violet)',
    label: 'Communication',
    dashArray: '2 2',
    defaultWidth: 1,
    directional: false,
  },
  'financial': {
    color: 'var(--marker-yellow)',
    label: 'Financial',
    defaultWidth: 2,
    directional: true,
  },
  'subsidiary': {
    color: 'var(--marker-magenta)',
    label: 'Subsidiary',
    defaultWidth: 1.5,
    directional: true,
  },
  'proximity': {
    color: 'var(--marker-orange)',
    label: 'Proximity',
    dashArray: '8 4',
    defaultWidth: 1,
    directional: false,
  },
  'rendezvous': {
    color: 'var(--marker-red)',
    label: 'Rendezvous',
    defaultWidth: 2,
    directional: false,
  },
};

// ---------------------------------------------------------------------------
// Registry class
// ---------------------------------------------------------------------------

/**
 * Mutable registry that maps type strings to visual configuration.
 *
 * Ships with sensible defaults; consumers call `registerEntityType()` or
 * `registerRelationshipType()` to add or override types at runtime.
 *
 * @example
 * ```ts
 * const registry = createTypeRegistry();
 * registry.registerEntityType('crypto-wallet', {
 *   color: 'var(--marker-amber)',
 *   label: 'Crypto Wallet',
 *   icon: 'wallet',
 *   defaultSize: 24,
 *   category: 'financial',
 * });
 * ```
 */
export interface RoboTypeRegistry {
  /** Register or override an entity type configuration. */
  registerEntityType: (type: string, config: RoboEntityTypeConfig) => void;
  /** Register or override a relationship type configuration. */
  registerRelationshipType: (type: string, config: RoboRelationshipTypeConfig) => void;
  /** Get config for an entity type (returns fallback for unknown types). */
  getEntityTypeConfig: (type: RoboEntityType) => RoboEntityTypeConfig;
  /** Get config for a relationship type (returns fallback for unknown types). */
  getRelationshipTypeConfig: (type: RoboRelationshipType) => RoboRelationshipTypeConfig;
  /** Get all registered entity types (for building filter UI). */
  getEntityTypes: () => Array<{ type: string; config: RoboEntityTypeConfig }>;
  /** Get all registered relationship types (for building legend UI). */
  getRelationshipTypes: () => Array<{ type: string; config: RoboRelationshipTypeConfig }>;
}

/**
 * Creates a new type registry with built-in defaults.
 *
 * Each `RoboCorrelationProvider` instance holds its own registry. This
 * factory function ensures isolated state between providers.
 */
export function createTypeRegistry(): RoboTypeRegistry {
  const entityTypes = new Map<string, RoboEntityTypeConfig>(
    Object.entries(DEFAULT_ENTITY_TYPES),
  );
  const relationshipTypes = new Map<string, RoboRelationshipTypeConfig>(
    Object.entries(DEFAULT_RELATIONSHIP_TYPES),
  );

  return {
    registerEntityType(type, config) {
      entityTypes.set(type, config);
    },

    registerRelationshipType(type, config) {
      relationshipTypes.set(type, config);
    },

    getEntityTypeConfig(type) {
      return entityTypes.get(type) ?? FALLBACK_ENTITY_CONFIG;
    },

    getRelationshipTypeConfig(type) {
      return relationshipTypes.get(type) ?? FALLBACK_RELATIONSHIP_CONFIG;
    },

    getEntityTypes() {
      return Array.from(entityTypes.entries()).map(([type, config]) => ({
        type,
        config,
      }));
    },

    getRelationshipTypes() {
      return Array.from(relationshipTypes.entries()).map(([type, config]) => ({
        type,
        config,
      }));
    },
  };
}
