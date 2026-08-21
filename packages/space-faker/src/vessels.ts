import { faker } from '@faker-js/faker';

import type {
  Platform,
  Spacecraft,
  SpacecraftClass,
  SpacecraftStatus,
  SpacecraftType,
} from './types';

const SPACECRAFT_TYPES: SpacecraftType[] = [
  'Satellite',
  'Space Station',
  'Probe',
  'Rover',
  'Crew Capsule',
  'Cargo Freighter',
  'Telescope',
  'Lander',
  'Orbiter',
  'CubeSat',
];

const PLATFORMS: Platform[] = ['LEOStar', 'GEOStar', 'Interplanetary'];

const SPACECRAFT_CLASSES: SpacecraftClass[] = [
  'Sentinel',
  'Explorer',
  'Pioneer',
  'Vanguard',
  'Odyssey',
  'Meridian',
  'Commercial',
  'Research',
  'SmallSat',
];

const OPERATORS = [
  'NASA',
  'ESA',
  'JAXA',
  'ISRO',
  'Roscosmos',
  'CNSA',
  'SpaceX',
  'Rocket Lab',
  'Blue Origin',
  'Arianespace',
  'KARI',
  'UAE Space Agency',
  'CSA',
  'DLR',
  'UKSA',
  'ASI',
  'CNES',
  'AEB',
];

const LAUNCH_SITES = [
  'Cape Canaveral',
  'Kennedy LC-39A',
  'Vandenberg',
  'Baikonur',
  'Kourou',
  'Tanegashima',
  'Satish Dhawan',
  'Jiuquan',
  'Wenchang',
  'Plesetsk',
  'Mahia',
  'Boca Chica',
  'Wallops',
  'Uchinoura',
  'Sohae',
  'Palmachim',
];

const STATUSES: SpacecraftStatus[] = ['in-orbit', 'docked', 'in-transit', 'decommissioned'];

const CELESTIAL_NAMES = [
  'Orion',
  'Vega',
  'Andromeda',
  'Lyra',
  'Sirius',
  'Rigel',
  'Cassiopeia',
  'Aquila',
  'Draco',
  'Hyperion',
  'Artemis',
  'Sentinel',
];

const MISSION_FAMILIES = [
  'Kepler',
  'Cassini',
  'Voyager',
  'Cosmos',
  'Sentinel',
  'Landsat',
  'GOES',
  'Starlink',
  'Hubble',
  'Meridian',
];

/** Generate a realistic spacecraft name (celestial proper name or mission designator). */
export function makeSpacecraftName(): string {
  if (faker.datatype.boolean({ probability: 0.35 })) {
    return faker.helpers.arrayElement(CELESTIAL_NAMES);
  }
  const family = faker.helpers.arrayElement(MISSION_FAMILIES);
  const number = faker.number.int({ min: 1, max: 3200 });
  return `${family}-${number}`;
}

function makeNoradId(): string {
  // 5-digit satellite catalog number.
  return faker.string.numeric({ length: 5, allowLeadingZeros: false });
}

function makeCosparId(): string {
  // International designator, e.g. '2024-045A'.
  const year = faker.number.int({ min: 1998, max: 2025 });
  const launch = faker.string.numeric({ length: 3, allowLeadingZeros: true });
  const piece = faker.string.alpha({ length: 1, casing: 'upper' });
  return `${year}-${launch}${piece}`;
}

function makeCallSign(): string {
  // ITU-style prefix + letters/digits.
  const prefix = faker.helpers.arrayElement(['N', 'K', 'R', 'J']);
  const letters = faker.string.alpha({ length: 2, casing: 'upper' });
  const digits = faker.string.numeric(4);
  return `${prefix}${letters}-${digits}`;
}

/**
 * Generate a single spacecraft with realistic data.
 *
 * @param seed - Optional numeric seed for reproducible output.
 */
export function makeSpacecraft(seed?: number): Spacecraft {
  if (seed !== undefined) {
    faker.seed(seed);
  }

  const spacecraftType = faker.helpers.arrayElement(SPACECRAFT_TYPES);
  const velocityKmS = faker.number.float({ min: 0, max: 8, fractionDigits: 2 });
  const inclination = faker.number.int({ min: 0, max: 359 });

  return {
    id: faker.string.uuid(),
    name: makeSpacecraftName(),
    noradId: makeNoradId(),
    cosparId: makeCosparId(),
    operator: faker.helpers.arrayElement(OPERATORS),
    spacecraftType,
    platform: faker.helpers.arrayElement(PLATFORMS),
    spacecraftClass: faker.helpers.arrayElement(SPACECRAFT_CLASSES),
    lengthM: faker.number.int({ min: 1, max: 110 }),
    solarPanelSpanM: faker.number.int({ min: 2, max: 73 }),
    powerKw: faker.number.float({ min: 0.5, max: 84, fractionDigits: 1 }),
    massKg: faker.number.int({ min: 4, max: 420000 }),
    callSign: makeCallSign(),
    launchSite: faker.helpers.arrayElement(LAUNCH_SITES),
    status: faker.helpers.arrayElement(STATUSES),
    position: {
      lat: faker.number.float({ min: -60, max: 60, fractionDigits: 5 }),
      lng: faker.number.float({ min: -180, max: 180, fractionDigits: 5 }),
    },
    inclination,
    velocityKmS,
    raan: faker.number.int({ min: 0, max: 359 }),
    timestamp: new Date().toISOString(),
  };
}

/**
 * Generate an array of `count` spacecraft (a constellation / catalog).
 *
 * @param count - Number of spacecraft to create.
 * @param seed - Optional numeric seed for reproducible output.
 */
export function makeConstellation(count: number, seed?: number): Spacecraft[] {
  if (seed !== undefined) {
    faker.seed(seed);
  }
  // Call makeSpacecraft without re-seeding so each entry advances the sequence.
  return Array.from({ length: count }, () => makeSpacecraft());
}
