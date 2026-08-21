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
