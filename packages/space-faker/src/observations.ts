import { faker } from '@faker-js/faker';

import { makeCatalog } from './celestial';
import { OBSERVATORY_NAMES } from './observatories';
import type {
  DeepSkyObjectType,
  Observation,
  ObservationPriority,
  ObservationSession,
  ObservationStatus,
  SeeingScale,
  TransparencyGrade,
} from './types';

const TRANSPARENCY: TransparencyGrade[] = ['Excellent', 'Good', 'Fair', 'Poor'];
const PRIORITIES: ObservationPriority[] = ['low', 'medium', 'high'];
const RUN_STATUSES: ObservationStatus[] = ['scheduled', 'observing', 'complete', 'aborted'];

const INSTRUMENTS = [
  'HIRES spectrograph',
  'wide-field imager',
  'CCD photometer',
  'echelle spectrograph',
  'adaptive-optics camera',
  'narrowband imager',
];

const OBSERVERS = [
  'Dr. Vera Rubin',
  'Dr. Carl Chandra',
  'Dr. Nadia Okonkwo',
  'Dr. Liam Tanaka',
  'Dr. Priya Anand',
  'Dr. Marcus Webb',
  'Dr. Elena Sokolova',
  'Dr. Omar Farouk',
];

function seeing(): SeeingScale {
  return faker.helpers.arrayElement([1, 2, 3, 4, 5]) as SeeingScale;
}

/**
 * Generate a single target observation.
 *
 * @param seed - Optional numeric seed for reproducible output.
 */
export function makeObservation(seed?: number): Observation {
  if (seed !== undefined) {
    faker.seed(seed);
  }
  const [target] = makeCatalog(1);
  return {
    id: faker.string.uuid(),
    target: `${target.designation} — ${target.commonName}`,
    targetType: target.type as DeepSkyObjectType,
    instrument: faker.helpers.arrayElement(INSTRUMENTS),
    seeing: seeing(),
    limitingMagnitude: faker.number.float({ min: 12, max: 24, fractionDigits: 1 }),
    startTime: faker.date.recent({ days: 30 }).toISOString(),
    durationMin: faker.number.int({ min: 5, max: 180 }),
    notes: faker.helpers.arrayElement([
      'Clear frames, guiding nominal.',
      'Thin cirrus mid-session.',
      'Target low on horizon at start.',
      'Excellent seeing throughout.',
      'Lost 20 min to passing cloud.',
      'Companion resolved cleanly.',
    ]),
  };
}

/**
 * Generate a flat observing schedule of `count` runs (no nested observations),
 * suited to a schedule table.
 *
 * @param count - Number of scheduled runs.
 * @param seed - Optional numeric seed for reproducible output.
 */
export function makeObservingSchedule(count: number, seed?: number): ObservationSession[] {
  if (seed !== undefined) {
    faker.seed(seed);
  }
  return Array.from({ length: count }, () => {
    const targetCount = faker.number.int({ min: 1, max: 12 });
    return {
      id: faker.string.uuid(),
      runId: `RUN-${faker.string.numeric(5)}`,
      observatory: faker.helpers.arrayElement(OBSERVATORY_NAMES),
      observer: faker.helpers.arrayElement(OBSERVERS),
      date: faker.date.soon({ days: 45 }).toISOString(),
      status: faker.helpers.arrayElement(RUN_STATUSES),
      transparency: faker.helpers.arrayElement(TRANSPARENCY),
      priority: faker.helpers.arrayElement(PRIORITIES),
      targetCount,
      observations: [],
    };
  });
}

/**
 * Generate `runs` completed observing runs, each with nested per-target
 * observations, for master-detail tables.
 *
 * @param runs - Number of observing runs.
 * @param seed - Optional numeric seed for reproducible output.
 */
export function makeObservationHistory(runs: number, seed?: number): ObservationSession[] {
  if (seed !== undefined) {
    faker.seed(seed);
  }
  return Array.from({ length: runs }, () => {
    const targetCount = faker.number.int({ min: 1, max: 8 });
    const observations = Array.from({ length: targetCount }, () => makeObservation());
    return {
      id: faker.string.uuid(),
      runId: `RUN-${faker.string.numeric(5)}`,
      observatory: faker.helpers.arrayElement(OBSERVATORY_NAMES),
      observer: faker.helpers.arrayElement(OBSERVERS),
      date: faker.date.recent({ days: 365 }).toISOString(),
      status: faker.helpers.arrayElement(['complete', 'complete', 'aborted'] as ObservationStatus[]),
      transparency: faker.helpers.arrayElement(TRANSPARENCY),
      priority: faker.helpers.arrayElement(PRIORITIES),
      targetCount,
      observations,
    };
  });
}
