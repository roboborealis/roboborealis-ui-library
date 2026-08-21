// ---------------------------------------------------------------------------
// OSINT Entity Generator — Deterministic mock data for Storybook
//
// Generates ~100 entities across 7 categories: spacecraft, aircraft, companies,
// persons, ground stations, infrastructure, and space agencies. Spacecraft
// positions are sub-satellite points spread across the globe.
// ---------------------------------------------------------------------------

import type { RoboOsintEntity } from '@/visualizations/types';

import { createRng } from './seed-random';

// ---------------------------------------------------------------------------
// Static data tables
// ---------------------------------------------------------------------------

const SPACECRAFT_SERIES = ['I', 'II', 'III', '2A', '3B', 'X'] as const;

const SPACECRAFT_NAMES = [
  'VOYAGER', 'CASSINI', 'ARTEMIS', 'SENTINEL', 'ORION', 'KEPLER',
  'HUBBLE', 'MAGELLAN', 'GALILEO', 'JUNO', 'PIONEER', 'NEW HORIZONS',
  'AURORA', 'POLARIS', 'DRACO', 'LYRA', 'VEGA', 'RIGEL',
  'ANDROMEDA', 'CYGNUS', 'PERSEUS', 'ATLAS', 'CERES', 'HELIOS',
  'ODYSSEY', 'SOLSTICE', 'ZENITH', 'MERIDIAN', 'CELESTIA', 'NEBULA',
] as const;

const SPACECRAFT_TYPES = ['satellite', 'probe', 'telescope', 'crew-capsule', 'cargo-freighter', 'station'] as const;

const AGENCIES: { code: string; name: string }[] = [
  { code: 'NASA', name: 'NASA' },
  { code: 'ESA', name: 'European Space Agency' },
  { code: 'JAXA', name: 'JAXA' },
  { code: 'ISRO', name: 'ISRO' },
  { code: 'ROS', name: 'Roscosmos' },
  { code: 'SPX', name: 'SpaceX' },
];

const AIRCRAFT_TYPES = [
  { model: 'WB-57 High Altitude', role: 'airborne-observatory' },
  { model: 'C-130J Hercules', role: 'transport' },
  { model: 'RQ-4 Global Hawk', role: 'high-altitude-uav' },
  { model: '737-800', role: 'commercial' },
  { model: 'A320neo', role: 'commercial' },
  { model: 'SOFIA 747SP', role: 'airborne-observatory' },
  { model: 'S-92 Recovery', role: 'recovery-helicopter' },
  { model: 'Dash 8 Q400', role: 'regional' },
] as const;

const AIRCRAFT_CALLSIGNS = [
  'NASA905', 'HALO01', 'GHAWK3', 'DLH872', 'UAL143',
  'SOFIA1', 'RESCUE2', 'ASTRA301', 'BER55', 'JAL210',
  'AFR777', 'NASA906', 'C130J-1', 'QFA901', 'SPX505',
] as const;

const COMPANY_NAMES = [
  'Orbital Dynamics Corp.', 'Helios Aerospace', 'Vega Launch Systems',
  'Meridian Satellite Co.', 'Stellar Logistics Ltd.', 'Polaris Space Industries',
  'Aphelion Robotics PLC', 'Zenith Orbital Inc.', 'Nova Propulsion Group',
  'Celestia Ground Services',
] as const;

const COMPANY_COUNTRIES = ['US', 'FR', 'JP', 'IN', 'RU', 'DE', 'GB', 'LU', 'CA', 'AU'] as const;

const PERSON_NAMES = [
  { name: 'Neil Armstrong', role: 'commander' },
  { name: 'Valentina Tereshkova', role: 'flight-director' },
  { name: 'Mae Jemison', role: 'principal-investigator' },
  { name: 'Carl Sagan', role: 'principal-investigator' },
  { name: 'Yuri Gagarin', role: 'commander' },
  { name: 'Sally Ride', role: 'flight-director' },
  { name: 'Chiaki Mukai', role: 'director' },
  { name: 'Marie Curie', role: 'registered-agent' },
] as const;

// Deep Space Network, launch, and tracking sites worldwide.
const GROUND_STATIONS: { name: string; lng: number; lat: number; country: string }[] = [
  { name: 'Goldstone', lng: -116.9, lat: 35.43, country: 'US' },
  { name: 'Robledo', lng: -4.25, lat: 40.43, country: 'ES' },
  { name: 'Tidbinbilla', lng: 148.98, lat: -35.4, country: 'AU' },
  { name: 'Kourou', lng: -52.77, lat: 5.25, country: 'GF' },
  { name: 'Baikonur', lng: 63.34, lat: 45.96, country: 'KZ' },
  { name: 'Cape Canaveral', lng: -80.6, lat: 28.39, country: 'US' },
  { name: 'Svalbard', lng: 15.41, lat: 78.23, country: 'NO' },
  { name: 'Esrange', lng: 20.96, lat: 67.86, country: 'SE' },
  { name: 'Wallops', lng: -75.48, lat: 37.94, country: 'US' },
  { name: 'Kaena Point', lng: -158.27, lat: 21.57, country: 'US' },
  { name: 'Dongara', lng: 115.35, lat: -29.05, country: 'AU' },
  { name: 'Hartebeesthoek', lng: 27.68, lat: -25.89, country: 'ZA' },
];

const INFRASTRUCTURE_TYPES = [
  'cell-tower', 'cell-tower', 'cell-tower', 'cell-tower',
  'cell-tower', 'cell-tower', 'cell-tower',
  'power-plant', 'power-plant', 'power-plant', 'power-plant',
  'power-plant', 'power-plant', 'power-plant',
  'water-facility', 'water-facility', 'water-facility',
  'water-facility', 'water-facility', 'water-facility',
] as const;

const SOURCES_BY_TYPE: Record<string, string[]> = {
  spacecraft: ['telemetry', 'satellite', 'ground-network'],
  aircraft: ['adsb', 'satellite'],
  company: ['registry', 'humint'],
  person: ['registry', 'humint'],
  'ground-station': ['ground-network', 'satellite'],
  'cell-tower': ['sigint', 'satellite'],
  'power-plant': ['satellite'],
  'water-facility': ['satellite'],
  agency: ['registry'],
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const DAY_MS = 86_400_000;
const HOUR_MS = 3_600_000;

/** NORAD catalog id (5-digit satellite catalog number). */
function generateNoradId(rng: ReturnType<typeof createRng>): string {
  return String(rng.nextInt(10_000, 99_999));
}

/** COSPAR / international designator (e.g. "2021-047B"). */
function generateCosparId(rng: ReturnType<typeof createRng>): string {
  const year = rng.nextInt(1998, 2025);
  const launch = String(rng.nextInt(1, 199)).padStart(3, '0');
  const piece = String.fromCharCode(65 + rng.nextInt(0, 5));
  return `${year}-${launch}${piece}`;
}

function generateIcaoHex(rng: ReturnType<typeof createRng>): string {
  return rng.nextInt(0x400000, 0xffffff).toString(16).toUpperCase();
}

// ---------------------------------------------------------------------------
// Main generator
// ---------------------------------------------------------------------------

/**
 * Generate ~100 deterministic OSINT entities for a space-domain-awareness demo.
 *
 * @param seed - RNG seed string (default: `'robo-osint-entities'`)
 * @returns An array of `RoboOsintEntity` objects
 */
export function generateEntities(seed = 'robo-osint-entities'): RoboOsintEntity[] {
  const rng = createRng(seed);
  const now = Date.now();
  const entities: RoboOsintEntity[] = [];

  // Helper: random timestamp within the last N days
  const recentTs = (maxDaysAgo: number): number =>
    now - rng.nextInt(0, maxDaysAgo * DAY_MS);

  // Helper: random "last seen" within the last 24 hours
  const lastSeenTs = (): number =>
    now - rng.nextInt(0, 24 * HOUR_MS);

  // -------------------------------------------------------------------
  // Spacecraft (30)
  // -------------------------------------------------------------------
  const shuffledNames = rng.shuffle(SPACECRAFT_NAMES);
  for (let i = 0; i < 30; i++) {
    const series = rng.pick(SPACECRAFT_SERIES);
    const craftName = shuffledNames[i % shuffledNames.length];
    const agency = rng.pick(AGENCIES);
    const craftType = rng.pick(SPACECRAFT_TYPES);
    const riskBase = craftType === 'crew-capsule' ? 15 : craftType === 'cargo-freighter' ? 35 : 25;

    entities.push({
      id: `spacecraft-${String(i + 1).padStart(3, '0')}`,
      type: 'spacecraft',
      name: `${craftName} ${series}`,
      aliases: i % 5 === 0 ? [`${craftName} (prev. designation)`] : undefined,
      position: {
        lng: -180 + rng.next() * 360,
        lat: -60 + rng.next() * 120,
      },
      sources: SOURCES_BY_TYPE['spacecraft'],
      confidence: 0.7 + rng.next() * 0.3,
      firstSeen: recentTs(30),
      lastSeen: lastSeenTs(),
      operator: agency.code,
      riskScore: rng.nextInt(riskBase - 10, riskBase + 30),
      properties: {
        noradId: generateNoradId(rng),
        cosparId: generateCosparId(rng),
        craftType,
        massKg: rng.nextInt(120, 22_000),
        operatorName: agency.name,
        status: rng.pick(['operational', 'safe-mode', 'maneuvering', 'operational', 'operational']),
        velocityKmS: Number((6.5 + rng.next() * 1.3).toFixed(2)),
        inclination: rng.nextInt(0, 98),
      },
    });
  }

  // -------------------------------------------------------------------
  // Aircraft (15) — airborne tracking / recovery support
  // -------------------------------------------------------------------
  const shuffledCallsigns = rng.shuffle(AIRCRAFT_CALLSIGNS);
  for (let i = 0; i < 15; i++) {
    const acType = rng.pick(AIRCRAFT_TYPES);
    const isSpecialized = ['airborne-observatory', 'high-altitude-uav', 'recovery-helicopter'].includes(acType.role);
    const altMin = acType.role === 'recovery-helicopter' ? 500 : 5_000;
    const altMax = acType.role === 'high-altitude-uav' ? 60_000 : 45_000;

    entities.push({
      id: `aircraft-${String(i + 1).padStart(3, '0')}`,
      type: 'aircraft',
      name: shuffledCallsigns[i % shuffledCallsigns.length],
      position: {
        lng: -120 + rng.next() * 240,
        lat: -40 + rng.next() * 80,
        alt: rng.nextInt(altMin, altMax),
      },
      sources: SOURCES_BY_TYPE['aircraft'],
      confidence: 0.8 + rng.next() * 0.2,
      firstSeen: recentTs(14),
      lastSeen: lastSeenTs(),
      riskScore: isSpecialized ? rng.nextInt(5, 25) : rng.nextInt(0, 10),
      properties: {
        icaoHex: generateIcaoHex(rng),
        aircraftType: acType.model,
        role: acType.role,
        altitude: rng.nextInt(altMin, altMax),
        speed: rng.nextInt(150, 500),
        heading: rng.nextInt(0, 359),
      },
    });
  }

  // -------------------------------------------------------------------
  // Companies (10)
  // -------------------------------------------------------------------
  for (let i = 0; i < 10; i++) {
    const country = rng.pick(COMPANY_COUNTRIES);
    entities.push({
      id: `company-${String(i + 1).padStart(3, '0')}`,
      type: 'company',
      name: COMPANY_NAMES[i],
      sources: SOURCES_BY_TYPE['company'],
      confidence: 0.6 + rng.next() * 0.4,
      firstSeen: recentTs(30),
      lastSeen: lastSeenTs(),
      operator: country,
      riskScore: rng.nextInt(10, 60),
      properties: {
        registrationCountry: country,
        constellation_size: rng.nextInt(2, 15),
        sector: rng.pick(['launch', 'satellite-mfg', 'ground-systems', 'propulsion', 'earth-observation']),
      },
    });
  }

  // -------------------------------------------------------------------
  // Persons (8)
  // -------------------------------------------------------------------
  for (let i = 0; i < 8; i++) {
    const person = PERSON_NAMES[i];
    entities.push({
      id: `person-${String(i + 1).padStart(3, '0')}`,
      type: 'person',
      name: person.name,
      sources: SOURCES_BY_TYPE['person'],
      confidence: 0.5 + rng.next() * 0.4,
      firstSeen: recentTs(30),
      lastSeen: lastSeenTs(),
      riskScore: rng.nextInt(5, 50),
      properties: {
        role: person.role,
        nationality: rng.pick(['US', 'RU', 'JP', 'IN', 'FR', 'CN', 'DE', 'CA']),
      },
    });
  }

  // -------------------------------------------------------------------
  // Ground stations (12)
  // -------------------------------------------------------------------
  for (let i = 0; i < GROUND_STATIONS.length; i++) {
    const station = GROUND_STATIONS[i];
    entities.push({
      id: `station-${String(i + 1).padStart(3, '0')}`,
      type: 'ground-station',
      name: `${station.name} Ground Station`,
      position: { lng: station.lng, lat: station.lat },
      sources: SOURCES_BY_TYPE['ground-station'],
      confidence: 1.0,
      firstSeen: now - 30 * DAY_MS,
      lastSeen: now,
      operator: station.country,
      properties: {
        stationCode: `${station.country}${station.name.slice(0, 3).toUpperCase()}`,
        stationType: rng.pick(['deep-space', 'tracking', 'telemetry', 'launch-support']),
        antennaCount: rng.nextInt(4, 30),
      },
    });
  }

  // -------------------------------------------------------------------
  // Infrastructure (20)
  // -------------------------------------------------------------------
  for (let i = 0; i < 20; i++) {
    const infraType = INFRASTRUCTURE_TYPES[i];
    const siteLng = -180 + rng.next() * 360;
    const siteLat = -55 + rng.next() * 110;
    const labelPrefix = infraType === 'cell-tower'
      ? 'Tower'
      : infraType === 'power-plant'
        ? 'Plant'
        : 'Facility';

    entities.push({
      id: `infra-${String(i + 1).padStart(3, '0')}`,
      type: infraType,
      name: `${labelPrefix} ${rng.pick(['Alpha', 'Bravo', 'Charlie', 'Delta', 'Echo', 'Foxtrot', 'Golf', 'Hotel'])}-${rng.nextInt(100, 999)}`,
      position: { lng: siteLng, lat: siteLat },
      sources: SOURCES_BY_TYPE[infraType] ?? ['satellite'],
      confidence: 0.85 + rng.next() * 0.15,
      firstSeen: recentTs(30),
      lastSeen: lastSeenTs(),
      riskScore: rng.nextInt(0, 15),
      properties: {
        infraType,
        status: rng.pick(['operational', 'operational', 'maintenance', 'unknown']),
      },
    });
  }

  // -------------------------------------------------------------------
  // Agencies (6)
  // -------------------------------------------------------------------
  for (let i = 0; i < AGENCIES.length; i++) {
    const ag = AGENCIES[i];
    entities.push({
      id: `agency-${ag.code.toLowerCase()}`,
      type: 'agency',
      name: ag.name,
      sources: SOURCES_BY_TYPE['agency'],
      confidence: 1.0,
      firstSeen: now - 30 * DAY_MS,
      lastSeen: now,
      operator: ag.code,
      properties: {
        agencyCode: ag.code,
        trackedObjects: rng.nextInt(200, 12_000),
      },
    });
  }

  return entities;
}
