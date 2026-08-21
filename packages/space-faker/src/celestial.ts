import { faker } from '@faker-js/faker';

import type { DeepSkyObject, DeepSkyObjectType } from './types';

// ---------------------------------------------------------------------------
// Curated real deep-sky objects (Messier + NGC). Amateur astronomers will
// recognise these, so the mock catalog reads as genuine, not garbage.
// ---------------------------------------------------------------------------

interface DsoSeed {
  designation: string;
  commonName: string;
  type: DeepSkyObjectType;
  constellation: string;
  ra: string;
  dec: string;
  magnitude: number;
  distanceLy: number;
  discoveredYear: number;
}

const CATALOG: DsoSeed[] = [
  { designation: 'M31', commonName: 'Andromeda Galaxy', type: 'Galaxy', constellation: 'Andromeda', ra: '00h 42m', dec: '+41° 16\'', magnitude: 3.4, distanceLy: 2537000, discoveredYear: 964 },
  { designation: 'M42', commonName: 'Orion Nebula', type: 'Emission Nebula', constellation: 'Orion', ra: '05h 35m', dec: '-05° 23\'', magnitude: 4.0, distanceLy: 1344, discoveredYear: 1610 },
  { designation: 'M45', commonName: 'Pleiades', type: 'Open Cluster', constellation: 'Taurus', ra: '03h 47m', dec: '+24° 07\'', magnitude: 1.6, distanceLy: 444, discoveredYear: -1000 },
  { designation: 'M13', commonName: 'Great Hercules Cluster', type: 'Globular Cluster', constellation: 'Hercules', ra: '16h 41m', dec: '+36° 28\'', magnitude: 5.8, distanceLy: 22200, discoveredYear: 1714 },
  { designation: 'M51', commonName: 'Whirlpool Galaxy', type: 'Galaxy', constellation: 'Canes Venatici', ra: '13h 30m', dec: '+47° 12\'', magnitude: 8.4, distanceLy: 23000000, discoveredYear: 1773 },
  { designation: 'M57', commonName: 'Ring Nebula', type: 'Planetary Nebula', constellation: 'Lyra', ra: '18h 54m', dec: '+33° 02\'', magnitude: 8.8, distanceLy: 2283, discoveredYear: 1779 },
  { designation: 'M27', commonName: 'Dumbbell Nebula', type: 'Planetary Nebula', constellation: 'Vulpecula', ra: '19h 60m', dec: '+22° 43\'', magnitude: 7.5, distanceLy: 1360, discoveredYear: 1764 },
  { designation: 'M81', commonName: "Bode's Galaxy", type: 'Galaxy', constellation: 'Ursa Major', ra: '09h 55m', dec: '+69° 04\'', magnitude: 6.9, distanceLy: 11800000, discoveredYear: 1774 },
  { designation: 'M104', commonName: 'Sombrero Galaxy', type: 'Galaxy', constellation: 'Virgo', ra: '12h 40m', dec: '-11° 37\'', magnitude: 8.0, distanceLy: 29300000, discoveredYear: 1781 },
  { designation: 'M8', commonName: 'Lagoon Nebula', type: 'Emission Nebula', constellation: 'Sagittarius', ra: '18h 04m', dec: '-24° 23\'', magnitude: 6.0, distanceLy: 4100, discoveredYear: 1654 },
  { designation: 'M1', commonName: 'Crab Nebula', type: 'Supernova Remnant', constellation: 'Taurus', ra: '05h 35m', dec: '+22° 01\'', magnitude: 8.4, distanceLy: 6500, discoveredYear: 1731 },
  { designation: 'M3', commonName: 'Messier 3', type: 'Globular Cluster', constellation: 'Canes Venatici', ra: '13h 42m', dec: '+28° 23\'', magnitude: 6.2, distanceLy: 33900, discoveredYear: 1764 },
  { designation: 'M44', commonName: 'Beehive Cluster', type: 'Open Cluster', constellation: 'Cancer', ra: '08h 40m', dec: '+19° 59\'', magnitude: 3.7, distanceLy: 577, discoveredYear: -260 },
  { designation: 'NGC 7000', commonName: 'North America Nebula', type: 'Emission Nebula', constellation: 'Cygnus', ra: '20h 59m', dec: '+44° 20\'', magnitude: 4.0, distanceLy: 1600, discoveredYear: 1786 },
  { designation: 'NGC 869', commonName: 'Double Cluster (h Persei)', type: 'Open Cluster', constellation: 'Perseus', ra: '02h 19m', dec: '+57° 09\'', magnitude: 3.7, distanceLy: 7500, discoveredYear: 130 },
  { designation: 'NGC 6543', commonName: "Cat's Eye Nebula", type: 'Planetary Nebula', constellation: 'Draco', ra: '17h 58m', dec: '+66° 38\'', magnitude: 8.1, distanceLy: 3300, discoveredYear: 1786 },
  { designation: 'NGC 253', commonName: 'Sculptor Galaxy', type: 'Galaxy', constellation: 'Sculptor', ra: '00h 47m', dec: '-25° 17\'', magnitude: 7.2, distanceLy: 11400000, discoveredYear: 1783 },
  { designation: 'NGC 6960', commonName: 'Veil Nebula (Witch\'s Broom)', type: 'Supernova Remnant', constellation: 'Cygnus', ra: '20h 45m', dec: '+30° 43\'', magnitude: 7.0, distanceLy: 2400, discoveredYear: 1784 },
  { designation: 'Albireo', commonName: 'Albireo (β Cygni)', type: 'Double Star', constellation: 'Cygnus', ra: '19h 30m', dec: '+27° 57\'', magnitude: 3.1, distanceLy: 430, discoveredYear: 1755 },
  { designation: 'Mizar', commonName: 'Mizar & Alcor', type: 'Double Star', constellation: 'Ursa Major', ra: '13h 23m', dec: '+54° 55\'', magnitude: 2.2, distanceLy: 83, discoveredYear: 1617 },
  { designation: 'Algol', commonName: 'Algol (β Persei)', type: 'Variable Star', constellation: 'Perseus', ra: '03h 08m', dec: '+40° 57\'', magnitude: 2.1, distanceLy: 90, discoveredYear: 1667 },
  { designation: 'Mira', commonName: 'Mira (ο Ceti)', type: 'Variable Star', constellation: 'Cetus', ra: '02h 19m', dec: '-02° 58\'', magnitude: 3.5, distanceLy: 300, discoveredYear: 1596 },
  { designation: 'M20', commonName: 'Trifid Nebula', type: 'Emission Nebula', constellation: 'Sagittarius', ra: '18h 02m', dec: '-23° 02\'', magnitude: 6.3, distanceLy: 5200, discoveredYear: 1764 },
  { designation: 'M63', commonName: 'Sunflower Galaxy', type: 'Galaxy', constellation: 'Canes Venatici', ra: '13h 16m', dec: '+42° 02\'', magnitude: 8.6, distanceLy: 29300000, discoveredYear: 1779 },
  { designation: 'M15', commonName: 'Great Pegasus Cluster', type: 'Globular Cluster', constellation: 'Pegasus', ra: '21h 30m', dec: '+12° 10\'', magnitude: 6.2, distanceLy: 33600, discoveredYear: 1746 },
  { designation: 'M22', commonName: 'Sagittarius Cluster', type: 'Globular Cluster', constellation: 'Sagittarius', ra: '18h 36m', dec: '-23° 54\'', magnitude: 5.1, distanceLy: 10600, discoveredYear: 1665 },
  { designation: 'M97', commonName: 'Owl Nebula', type: 'Planetary Nebula', constellation: 'Ursa Major', ra: '11h 15m', dec: '+55° 01\'', magnitude: 9.9, distanceLy: 2030, discoveredYear: 1781 },
  { designation: 'NGC 2237', commonName: 'Rosette Nebula', type: 'Emission Nebula', constellation: 'Monoceros', ra: '06h 32m', dec: '+05° 03\'', magnitude: 9.0, distanceLy: 5200, discoveredYear: 1865 },
  { designation: 'NGC 4565', commonName: 'Needle Galaxy', type: 'Galaxy', constellation: 'Coma Berenices', ra: '12h 36m', dec: '+25° 59\'', magnitude: 9.6, distanceLy: 42700000, discoveredYear: 1785 },
  { designation: 'M92', commonName: 'Messier 92', type: 'Globular Cluster', constellation: 'Hercules', ra: '17h 17m', dec: '+43° 08\'', magnitude: 6.3, distanceLy: 26700, discoveredYear: 1777 },
];

/**
 * Build a single deep-sky object. Draws from a curated real catalog and,
 * for counts beyond the catalog, synthesises plausible NGC entries.
 */
export function makeDeepSkyObject(seed?: number): DeepSkyObject {
  if (seed !== undefined) {
    faker.seed(seed);
  }
  const base = faker.helpers.arrayElement(CATALOG);
  return { id: faker.string.uuid(), ...base };
}

/**
 * Build a catalog of `count` deep-sky objects. Uses the curated set first
 * (deduped), then generates synthetic NGC objects to reach `count`.
 *
 * @param count - Number of objects to return.
 * @param seed - Optional numeric seed for reproducible output.
 */
export function makeCatalog(count: number, seed?: number): DeepSkyObject[] {
  if (seed !== undefined) {
    faker.seed(seed);
  }
  const types: DeepSkyObjectType[] = [
    'Galaxy',
    'Emission Nebula',
    'Planetary Nebula',
    'Open Cluster',
    'Globular Cluster',
    'Double Star',
    'Variable Star',
    'Supernova Remnant',
  ];
  const constellations = [
    'Orion', 'Ursa Major', 'Cygnus', 'Lyra', 'Andromeda', 'Cassiopeia',
    'Sagittarius', 'Scorpius', 'Perseus', 'Leo', 'Draco', 'Auriga',
  ];

  const out: DeepSkyObject[] = [];
  const curated = faker.helpers.shuffle([...CATALOG]);
  for (let i = 0; i < count; i++) {
    if (i < curated.length) {
      out.push({ id: faker.string.uuid(), ...curated[i] });
      continue;
    }
    // Synthesise a plausible NGC entry beyond the curated set.
    const type = faker.helpers.arrayElement(types);
    out.push({
      id: faker.string.uuid(),
      designation: `NGC ${faker.number.int({ min: 1000, max: 7840 })}`,
      commonName: `${faker.helpers.arrayElement(constellations)} ${type}`,
      type,
      constellation: faker.helpers.arrayElement(constellations),
      ra: `${String(faker.number.int({ min: 0, max: 23 })).padStart(2, '0')}h ${String(faker.number.int({ min: 0, max: 59 })).padStart(2, '0')}m`,
      dec: `${faker.datatype.boolean() ? '+' : '-'}${String(faker.number.int({ min: 0, max: 89 })).padStart(2, '0')}° ${String(faker.number.int({ min: 0, max: 59 })).padStart(2, '0')}'`,
      magnitude: faker.number.float({ min: 3, max: 13, fractionDigits: 1 }),
      distanceLy: faker.number.int({ min: 400, max: 60000000 }),
      discoveredYear: faker.number.int({ min: 1750, max: 1920 }),
    });
  }
  return out;
}
