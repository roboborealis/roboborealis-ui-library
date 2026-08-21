import { faker } from '@faker-js/faker';

import type { Probe, ProbeStatus, ProbeType } from './types';

interface ProbeSpec {
  type: ProbeType;
  minVelocity: number;
  maxVelocity: number;
  minAltitude: number;
  maxAltitude: number;
}

const SPECS: ProbeSpec[] = [
  // Orbiter — inserts into orbit around a target body
  { type: 'Orbiter', minVelocity: 3, maxVelocity: 8, minAltitude: 200, maxAltitude: 35000 },
  // Flyby Probe — high cruise velocity, deep space
  { type: 'Flyby Probe', minVelocity: 10, maxVelocity: 16, minAltitude: 20000, maxAltitude: 40000 },
  // Lander — descends to a surface
  { type: 'Lander', minVelocity: 0, maxVelocity: 2, minAltitude: 0, maxAltitude: 300 },
  // Rover — operates on a surface
  { type: 'Rover', minVelocity: 0, maxVelocity: 1, minAltitude: 0, maxAltitude: 5 },
  // Sample Return — round-trip mission
  { type: 'Sample Return', minVelocity: 5, maxVelocity: 12, minAltitude: 500, maxAltitude: 38000 },
];

const PROGRAMS = [
  'Mars Exploration Program',
  'Lunar Discovery Program',
  'Outer Planets Program',
  'Near-Earth Object Program',
  'Heliophysics Program',
  'Planetary Defense Program',
  'Sample Return Program',
];

const OPERATIONS_CENTERS = [
  'Jet Propulsion Lab',
  'Goddard Space Flight Center',
  'ESOC Darmstadt',
  'JAXA Sagamihara',
  'ISRO Bengaluru',
  'Applied Physics Laboratory',
  'Ames Research Center',
];

const STATUSES: ProbeStatus[] = [
  'cruising',
  'in-orbit',
  'on-surface',
  'returning',
  'contact-lost',
];

/**
 * Generate a deep-space probe with type-appropriate velocity and altitude.
 *
 * @param seed - Optional numeric seed for reproducible output.
 */
export function makeProbe(seed?: number): Probe {
  if (seed !== undefined) {
    faker.seed(seed);
  }

  const spec = faker.helpers.arrayElement(SPECS);
  const program = faker.helpers.arrayElement(PROGRAMS);

  return {
    id: faker.string.uuid(),
    designation: 'PRB-' + faker.string.numeric(4),
    type: spec.type,
    program,
    operationsCenter: faker.helpers.arrayElement(OPERATIONS_CENTERS),
    position: {
      lat: faker.number.float({ min: -60, max: 60, fractionDigits: 5 }),
      lng: faker.number.float({ min: -180, max: 180, fractionDigits: 5 }),
    },
    altitudeKm: faker.number.int({ min: spec.minAltitude, max: spec.maxAltitude }),
    inclination: faker.number.int({ min: 0, max: 359 }),
    velocityKmS: faker.number.float({ min: spec.minVelocity, max: spec.maxVelocity, fractionDigits: 2 }),
    status: faker.helpers.arrayElement(STATUSES),
  };
}
