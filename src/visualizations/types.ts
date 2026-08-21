// ---------------------------------------------------------------------------
// @roboborealis/components/osint — Core type definitions
//
// Extensibility-first: all "type" fields accept arbitrary strings via the
// (string & {}) pattern. Built-in types get default icons/colors via the
// registry; unknown types fall back to a generic visual.
// ---------------------------------------------------------------------------

import type { Polygon as GeoJSONPolygon } from 'geojson';

/** A geographic/spatial coordinate. */
export interface RoboCoordinate {
  lng: number;
  lat: number;
  alt?: number;
}

// ---------------------------------------------------------------------------
// Entity types — open union (consumers can add their own)
// ---------------------------------------------------------------------------

/**
 * Built-in entity categories. Pass any string — the registry provides
 * fallback visuals for unknown types.
 */
export type RoboEntityType =
  | 'spacecraft'
  | 'aircraft'
  | 'satellite'
  | 'person'
  | 'company'
  | 'organization'
  | 'ground-station'
  | 'orbital-sector'
  | 'facility'
  | 'cell-tower'
  | 'power-plant'
  | 'water-facility'
  | 'agency'
  | 'airport'
  | 'region'
  | 'orbital-region'
  | 'country'
  | 'city'
  | 'building'
  | 'cable'
  | 'train'
  | 'traffic-incident'
  | 'coordinate'
  | (string & {});

// ---------------------------------------------------------------------------
// Relationship types — open union
// ---------------------------------------------------------------------------

/**
 * Built-in relationship categories. Consumers may pass any string; the
 * registry provides fallback edge styling for unknown types.
 */
export type RoboRelationshipType =
  | 'owner'
  | 'operator'
  | 'charterer'
  | 'crew'
  | 'flag'
  | 'port-call'
  | 'co-located'
  | 'communication'
  | 'financial'
  | 'subsidiary'
  | 'proximity'
  | 'rendezvous'
  | (string & {});

// ---------------------------------------------------------------------------
// Severity — open union
// ---------------------------------------------------------------------------

export type RoboOsintSeverity =
  | 'info'
  | 'low'
  | 'medium'
  | 'high'
  | 'critical'
  | (string & {});

// ---------------------------------------------------------------------------
// Entity
// ---------------------------------------------------------------------------

/**
 * An entity in the OSINT knowledge graph.
 *
 * `properties` is intentionally `Record<string, unknown>` — typed
 * discriminated unions live at the consumer level, not in the library.
 * The library renders whatever is in `properties` without assuming structure.
 */
export interface RoboOsintEntity {
  /** Unique identifier */
  id: string;
  /** Entity category — determines default icon, color, size via the registry */
  type: RoboEntityType;
  /** Primary display name */
  name: string;
  /** Alternate names or aliases */
  aliases?: string[];
  /** Primary geographic position (if applicable) */
  position?: RoboCoordinate;
  /** Data sources that contributed to this entity */
  sources: string[];
  /** Overall confidence score (0–1) */
  confidence: number;
  /** First observed timestamp (epoch ms) */
  firstSeen: number;
  /** Most recent observation timestamp (epoch ms) */
  lastSeen: number;
  /** Arbitrary domain-specific properties (NORAD ID, COSPAR, ICAO, etc.) */
  properties: Record<string, unknown>;
  /** ISO 3166-1 alpha-2 operator code (for satellites, companies) */
  operator?: string;
  /** Optional symbol ID code for domain-specific iconography when present */
  iconKey?: string;
  /** Risk/threat score (0–100) */
  riskScore?: number;
}

// ---------------------------------------------------------------------------
// Relationship
// ---------------------------------------------------------------------------

/** A directed relationship between two entities. */
export interface RoboOsintRelationship {
  /** Unique relationship identifier */
  id: string;
  /** Source entity ID (origin of the relationship) */
  sourceEntityId: string;
  /** Target entity ID (destination of the relationship) */
  targetEntityId: string;
  /** Relationship category — determines default edge style via the registry */
  type: RoboRelationshipType;
  /** Confidence in this relationship (0–1) */
  confidence: number;
  /** Data source that established this relationship */
  source: string;
  /** When the relationship was first observed (epoch ms) */
  firstSeen: number;
  /** When the relationship was last confirmed (epoch ms) */
  lastSeen: number;
  /** Optional human-readable label shown on edges */
  label?: string;
  /** Strength weight (0–1) — controls edge width in graph views */
  strength?: number;
  /** Relationship-specific metadata */
  metadata?: Record<string, unknown>;
}

// ---------------------------------------------------------------------------
// Event
// ---------------------------------------------------------------------------

/**
 * An observation, activity, or intelligence event in the OSINT timeline.
 * `type` is an open string — no hardcoded event type enum.
 */
export interface RoboOsintEvent {
  /** Unique event identifier */
  id: string;
  /** The entity this event relates to */
  entityId: string;
  /** Event category (e.g. 'telemetry-report', 'ground-contact', 'optical-obs') */
  type: string;
  /** Data source that produced this event */
  source: string;
  /** When the event occurred (epoch ms) */
  timestamp: number;
  /** Geographic position at event time (if applicable) */
  position?: RoboCoordinate;
  /** Human-readable event description */
  description: string;
  /** Severity level */
  severity?: RoboOsintSeverity;
  /** Event-specific metadata */
  metadata?: Record<string, unknown>;
}

// ---------------------------------------------------------------------------
// Data source configuration — pluggable OSINT providers
// ---------------------------------------------------------------------------

/**
 * Defines an OSINT data source. Consumers push to this array to register
 * new providers — no component code changes needed.
 */
export interface RoboDataSourceConfig {
  /** Unique source identifier (e.g. 'telemetry', 'adsb', 'satellite', 'weather') */
  id: string;
  /** Human-readable label (e.g. 'Telemetry Downlink') */
  label: string;
  /** CSS color for badges and feed indicators (use CSS variable or hex) */
  color: string;
  /** React node or icon component for source badges */
  icon?: React.ReactNode;
  /** Whether this source is enabled by default in filters */
  defaultEnabled?: boolean;
  /** Optional description for tooltips */
  description?: string;
}

// ---------------------------------------------------------------------------
// Correlation filter state
// ---------------------------------------------------------------------------

/** Active filter state managed by RoboCorrelationProvider. */
export interface RoboCorrelationFilters {
  /** Filter by entity types */
  entityTypes: string[];
  /** Filter by data source IDs */
  sourceTypes: string[];
  /** Filter by severity levels */
  severityLevels: string[];
  /** Free-text search query */
  searchQuery: string;
  /** Date range filter [start, end] */
  dateRange: [Date, Date] | null;
  /** Geographic region filter (GeoJSON polygon) */
  geoRegion: GeoJSONPolygon | null;
  /** Confidence threshold (0–1) — entities below are filtered out */
  minConfidence: number;
  /** Risk score threshold (0–100) — entities below are hidden */
  minRiskScore: number;
}
