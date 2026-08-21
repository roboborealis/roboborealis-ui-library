import { faker } from '@faker-js/faker';

import type { Station } from './types';

interface StationSeed {
  name: string;
  stationCode: string;
  lat: number;
  lng: number;
  country: string;
  state: string;
}

// Real ground stations, observatories, and launch/tracking sites.
const STATIONS: StationSeed[] = [
  { name: 'Goldstone Deep Space', stationCode: 'DSS-14', lat: 35.43, lng: -116.89, country: 'USA', state: 'CA' },
  { name: 'Madrid Deep Space', stationCode: 'DSS-63', lat: 40.43, lng: -4.25, country: 'Spain', state: 'Madrid' },
  { name: 'Canberra Deep Space', stationCode: 'DSS-43', lat: -35.4, lng: 148.98, country: 'Australia', state: 'ACT' },
  { name: 'White Sands', stationCode: 'WSC', lat: 32.5, lng: -106.61, country: 'USA', state: 'NM' },
  { name: 'Wallops Flight Facility', stationCode: 'WFF', lat: 37.94, lng: -75.47, country: 'USA', state: 'VA' },
  { name: 'Kennedy Space Center', stationCode: 'KSC', lat: 28.57, lng: -80.65, country: 'USA', state: 'FL' },
  { name: 'Vandenberg', stationCode: 'VSFB', lat: 34.74, lng: -120.57, country: 'USA', state: 'CA' },
  { name: 'Mauna Kea Observatory', stationCode: 'MKO', lat: 19.82, lng: -155.47, country: 'USA', state: 'HI' },
  { name: 'Green Bank Telescope', stationCode: 'GBT', lat: 38.43, lng: -79.84, country: 'USA', state: 'WV' },
  { name: 'Arecibo Site', stationCode: 'AO', lat: 18.34, lng: -66.75, country: 'USA', state: 'PR' },
  { name: 'Kwajalein Atoll', stationCode: 'RTS', lat: 8.72, lng: 167.73, country: 'USA', state: 'MH' },
  { name: 'Svalbard Satellite', stationCode: 'SG', lat: 78.23, lng: 15.4, country: 'Norway', state: 'Svalbard' },
  { name: 'Kiruna Station', stationCode: 'KRN', lat: 67.86, lng: 20.96, country: 'Sweden', state: 'Norrbotten' },
  { name: 'Poker Flat Range', stationCode: 'PFRR', lat: 65.13, lng: -147.47, country: 'USA', state: 'AK' },
  { name: 'Cape Canaveral', stationCode: 'CCSFS', lat: 28.49, lng: -80.58, country: 'USA', state: 'FL' },
  { name: 'Johnson Space Center', stationCode: 'JSC', lat: 29.56, lng: -95.09, country: 'USA', state: 'TX' },
  { name: 'Jet Propulsion Lab', stationCode: 'JPL', lat: 34.2, lng: -118.17, country: 'USA', state: 'CA' },
  { name: 'Guiana Space Centre', stationCode: 'CSG', lat: 5.24, lng: -52.77, country: 'France', state: 'Kourou' },
  { name: 'Usuda Deep Space', stationCode: 'UDSC', lat: 36.13, lng: 138.36, country: 'Japan', state: 'Nagano' },
];

const CAPABILITIES = [
  'Uplink',
  'Downlink',
  'Telemetry',
  'Optical Tracking',
  'Laser Ranging',
];

function buildStation(seed: StationSeed): Station {
  const capabilityCount = faker.number.int({ min: 2, max: 5 });
  return {
    id: seed.stationCode,
    name: seed.name,
    stationCode: seed.stationCode,
    lat: seed.lat,
    lng: seed.lng,
    country: seed.country,
    state: seed.state,
    capabilities: faker.helpers.arrayElements(CAPABILITIES, capabilityCount),
    dishDiameterM: faker.number.float({ min: 12, max: 70, fractionDigits: 1 }),
    dataThroughputTbDay: faker.number.int({ min: 1, max: 250 }),
  };
}

/**
 * Generate a single real ground station with synthesized capability fields.
 *
 * @param seed - Optional numeric seed for reproducible output.
 */
export function makeStation(seed?: number): Station {
  if (seed !== undefined) {
    faker.seed(seed);
  }
  return buildStation(faker.helpers.arrayElement(STATIONS));
}

/**
 * Return the full list of real ground stations with synthesized fields.
 */
export function makeStationList(): Station[] {
  return STATIONS.map(buildStation);
}
