// ---------------------------------------------------------------------------
// Shared types for the space-faker package.
// ---------------------------------------------------------------------------

export interface LatLng {
  lat: number;
  lng: number;
}

export type SpacecraftStatus = 'in-orbit' | 'docked' | 'in-transit' | 'decommissioned';

export type SpacecraftType =
  | 'Satellite'
  | 'Space Station'
  | 'Probe'
  | 'Rover'
  | 'Crew Capsule'
  | 'Cargo Freighter'
  | 'Telescope'
  | 'Lander'
  | 'Orbiter'
  | 'CubeSat';

export type Platform = 'LEOStar' | 'GEOStar' | 'Interplanetary';

export type SpacecraftClass =
  | 'Sentinel'
  | 'Explorer'
  | 'Pioneer'
  | 'Vanguard'
  | 'Odyssey'
  | 'Meridian'
  | 'Commercial'
  | 'Research'
  | 'SmallSat';

export interface Spacecraft {
  id: string;
  name: string;
  noradId: string;
  cosparId: string;
  operator: string;
  spacecraftType: SpacecraftType;
  platform: Platform;
  spacecraftClass: SpacecraftClass;
  lengthM: number;
  solarPanelSpanM: number;
  powerKw: number;
  massKg: number;
  callSign: string;
  launchSite: string;
  status: SpacecraftStatus;
  position: LatLng;
  inclination: number;
  velocityKmS: number;
  raan: number;
  timestamp: string;
}

export interface OrbitPoint {
  lat: number;
  lng: number;
  inclination: number;
  velocityKmS: number;
  timestamp: string;
}

export interface OrbitTrack {
  spacecraftId: string;
  positions: OrbitPoint[];
}

export interface Person {
  id: string;
  name: string;
  rank: string;
  role: string;
  agency: string;
  badgeNumber: string;
}

export type ProbeType =
  | 'Orbiter'
  | 'Lander'
  | 'Rover'
  | 'Flyby Probe'
  | 'Sample Return';

export type ProbeStatus =
  | 'cruising'
  | 'in-orbit'
  | 'on-surface'
  | 'returning'
  | 'contact-lost';

export interface Probe {
  id: string;
  designation: string;
  type: ProbeType;
  program: string;
  operationsCenter: string;
  position: LatLng;
  altitudeKm: number;
  inclination: number;
  velocityKmS: number;
  status: ProbeStatus;
}

export interface ProbeTrackPoint {
  lat: number;
  lng: number;
  altitudeKm: number;
  inclination: number;
  velocityKmS: number;
  timestamp: string;
}

export interface ProbeTrack {
  probeId: string;
  positions: ProbeTrackPoint[];
}

export type EventType =
  | 'Launch'
  | 'Docking'
  | 'Anomaly'
  | 'Conjunction Warning'
  | 'Reentry'
  | 'EVA'
  | 'Observation';

export type EventSeverity = 'low' | 'medium' | 'high' | 'critical';

export type EventStatus = 'open' | 'assigned' | 'resolved';

export interface SpaceEvent {
  id: string;
  eventId: string;
  type: EventType;
  severity: EventSeverity;
  status: EventStatus;
  position: LatLng;
  timestamp: string;
  description: string;
  anomalyType?: string;
  craftInvolved?: string;
}

export type SectorType = 'LEO' | 'MEO' | 'GEO' | 'HEO' | 'Cislunar' | 'Deep Space';

export interface SectorBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface OrbitalSector {
  id: string;
  name: string;
  type: SectorType;
  region: number;
  bounds: SectorBounds;
  center: LatLng;
}

export interface Station {
  id: string;
  name: string;
  stationCode: string;
  lat: number;
  lng: number;
  country: string;
  state: string;
  capabilities: string[];
  dishDiameterM: number;
  dataThroughputTbDay: number;
}

export type TrackingType = 'Radar' | 'Optical' | 'Radio';

export interface GroundTrackSector {
  id: string;
  name: string;
  region: number;
  bounds: SectorBounds;
  assignedStation: string;
  trackingType: TrackingType;
}

export interface ObservationEvent {
  id: string;
  eventId: string;
  type: string;
  latitude: number;
  longitude: number;
  date: string;
  status: EventStatus;
  objectsTracked: number;
  description: string;
}

// ---------------------------------------------------------------------------
// Observational-astronomy types
// ---------------------------------------------------------------------------

export type DeepSkyObjectType =
  | 'Galaxy'
  | 'Emission Nebula'
  | 'Planetary Nebula'
  | 'Open Cluster'
  | 'Globular Cluster'
  | 'Double Star'
  | 'Variable Star'
  | 'Supernova Remnant';

export interface DeepSkyObject {
  id: string;
  /** Catalog designation, e.g. 'M31' or 'NGC 7000'. */
  designation: string;
  commonName: string;
  type: DeepSkyObjectType;
  constellation: string;
  /** Right ascension, e.g. '00h 42m'. */
  ra: string;
  /** Declination, e.g. '+41° 16''. */
  dec: string;
  /** Apparent visual magnitude (lower = brighter). */
  magnitude: number;
  distanceLy: number;
  discoveredYear: number;
}

export type DetectionMethod =
  | 'Transit'
  | 'Radial Velocity'
  | 'Direct Imaging'
  | 'Microlensing'
  | 'Astrometry';

export interface Exoplanet {
  id: string;
  name: string;
  hostStar: string;
  method: DetectionMethod;
  /** Orbital period in days. */
  periodDays: number;
  /** Radius in Earth radii (R⊕). */
  radiusEarth: number;
  /** Mass in Earth masses (M⊕). */
  massEarth: number;
  distanceLy: number;
  discoveredYear: number;
  confirmed: boolean;
  /** 0-100 Earth-similarity / habitability index. */
  habitabilityScore: number;
}

export type ObservatoryType = 'Optical' | 'Radio' | 'Infrared' | 'Space';

export interface Observatory {
  id: string;
  name: string;
  site: string;
  /** Primary mirror / dish aperture in metres. */
  apertureM: number;
  type: ObservatoryType;
  altitudeM: number;
  operator: string;
}

/** Antoniadi seeing scale: 1 (perfect) to 5 (very poor). */
export type SeeingScale = 1 | 2 | 3 | 4 | 5;

export type TransparencyGrade = 'Excellent' | 'Good' | 'Fair' | 'Poor';

export type ObservationStatus = 'scheduled' | 'observing' | 'complete' | 'aborted';

export type ObservationPriority = 'low' | 'medium' | 'high';

/** A single target observation within an observing run. */
export interface Observation {
  id: string;
  target: string;
  targetType: DeepSkyObjectType;
  instrument: string;
  seeing: SeeingScale;
  limitingMagnitude: number;
  startTime: string;
  durationMin: number;
  notes: string;
}

/** A night's observing run at an observatory, with nested observations. */
export interface ObservationSession {
  id: string;
  runId: string;
  observatory: string;
  observer: string;
  date: string;
  status: ObservationStatus;
  transparency: TransparencyGrade;
  priority: ObservationPriority;
  targetCount: number;
  observations: Observation[];
}
