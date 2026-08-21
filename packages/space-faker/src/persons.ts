import { faker } from '@faker-js/faker';

import type { Person } from './types';

const ROLES = [
  'Mission Commander',
  'Flight Engineer',
  'Payload Specialist',
  'Flight Director',
  'Principal Investigator',
  'Astrophysicist',
  'Propulsion Engineer',
  'Mission Scientist',
];

const RANKS = [
  'Colonel',
  'Captain',
  'Commander',
  'Lieutenant Colonel',
  'Major',
  'Dr.',
  'Professor',
];

const AGENCIES = [
  'NASA',
  'ESA',
  'JAXA',
  'ISRO',
  'Roscosmos',
  'CNSA',
  'CSA',
];

// Real astronauts and space scientists.
const CREW_NAMES = [
  'Neil Armstrong',
  'Buzz Aldrin',
  'Yuri Gagarin',
  'Valentina Tereshkova',
  'Sally Ride',
  'Mae Jemison',
  'John Glenn',
  'Michael Collins',
  'Jim Lovell',
  'Chris Hadfield',
  'Tim Peake',
  'Peggy Whitson',
];

const SCIENTIST_NAMES = [
  'Carl Sagan',
  'Edwin Hubble',
  'Johannes Kepler',
  'Galileo Galilei',
  'Nicolaus Copernicus',
  'Marie Curie',
  'Stephen Hawking',
  'William Herschel',
  'Annie Jump Cannon',
  'Vera Rubin',
  'Cecilia Payne-Gaposchkin',
  'Neil deGrasse Tyson',
];

const ALL_NAMES = [...CREW_NAMES, ...SCIENTIST_NAMES];

function makeBadgeNumber(): string {
  return faker.string.numeric(6);
}

/**
 * Generate a mission commander.
 *
 * @param seed - Optional numeric seed for reproducible output.
 */
export function makeCommander(seed?: number): Person {
  if (seed !== undefined) {
    faker.seed(seed);
  }

  return {
    id: faker.string.uuid(),
    name: faker.helpers.arrayElement(CREW_NAMES),
    rank: faker.helpers.arrayElement(RANKS),
    role: 'Mission Commander',
    agency: faker.helpers.arrayElement(AGENCIES),
    badgeNumber: makeBadgeNumber(),
  };
}

/**
 * Generate an array of `count` mission crew members.
 *
 * @param count - Number of crew members to create.
 * @param seed - Optional numeric seed for reproducible output.
 */
export function makeCrew(count: number, seed?: number): Person[] {
  if (seed !== undefined) {
    faker.seed(seed);
  }
  return Array.from({ length: count }, () => {
    const role = faker.helpers.arrayElement(ROLES);
    return {
      id: faker.string.uuid(),
      name: faker.helpers.arrayElement(ALL_NAMES),
      rank: faker.helpers.arrayElement(RANKS),
      role,
      agency: faker.helpers.arrayElement(AGENCIES),
      badgeNumber: makeBadgeNumber(),
    };
  });
}

/**
 * Generate a single crew member — flight crew or mission science staff.
 *
 * @param seed - Optional numeric seed for reproducible output.
 */
export function makeCrewMember(seed?: number): Person {
  if (seed !== undefined) {
    faker.seed(seed);
  }

  const role = faker.helpers.arrayElement(ROLES);
  return {
    id: faker.string.uuid(),
    name: faker.helpers.arrayElement(ALL_NAMES),
    rank: faker.helpers.arrayElement(RANKS),
    role,
    agency: faker.helpers.arrayElement(AGENCIES),
    badgeNumber: makeBadgeNumber(),
  };
}
