import { faker } from '@faker-js/faker';

import type { DetectionMethod, Exoplanet } from './types';

const METHODS: DetectionMethod[] = [
  'Transit',
  'Radial Velocity',
  'Direct Imaging',
  'Microlensing',
  'Astrometry',
];

// Real host-star families exoplanet catalogs draw from.
const HOST_FAMILIES = [
  'Kepler',
  'TOI',
  'HD',
  'Gliese',
  'TRAPPIST',
  'K2',
  'WASP',
  'HAT-P',
  'Proxima',
  'GJ',
];

const PLANET_LETTERS = ['b', 'c', 'd', 'e', 'f', 'g'];

/**
 * Generate a single exoplanet with plausible catalog values.
 *
 * @param seed - Optional numeric seed for reproducible output.
 */
export function makeExoplanet(seed?: number): Exoplanet {
  if (seed !== undefined) {
    faker.seed(seed);
  }
  const family = faker.helpers.arrayElement(HOST_FAMILIES);
  const hostStar = `${family}-${faker.number.int({ min: 1, max: 9999 })}`;
  const name = `${hostStar} ${faker.helpers.arrayElement(PLANET_LETTERS)}`;
  const radiusEarth = faker.number.float({ min: 0.4, max: 12, fractionDigits: 2 });
  // Larger planets skew more massive; keep it loosely physical.
  const massEarth = faker.number.float({
    min: radiusEarth * 0.5,
    max: radiusEarth * radiusEarth * 3,
    fractionDigits: 2,
  });

  return {
    id: faker.string.uuid(),
    name,
    hostStar,
    method: faker.helpers.arrayElement(METHODS),
    periodDays: faker.number.float({ min: 0.5, max: 1200, fractionDigits: 2 }),
    radiusEarth,
    massEarth,
    distanceLy: faker.number.int({ min: 4, max: 8000 }),
    discoveredYear: faker.number.int({ min: 1995, max: 2025 }),
    confirmed: faker.datatype.boolean({ probability: 0.72 }),
    habitabilityScore: faker.number.int({ min: 0, max: 100 }),
  };
}

/**
 * Generate a catalog of `count` exoplanets.
 *
 * @param count - Number of exoplanets to create.
 * @param seed - Optional numeric seed for reproducible output.
 */
export function makeExoplanetCatalog(count: number, seed?: number): Exoplanet[] {
  if (seed !== undefined) {
    faker.seed(seed);
  }
  return Array.from({ length: count }, () => makeExoplanet());
}
