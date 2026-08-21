import { faker } from '@faker-js/faker';

import type { Observatory, ObservatoryType } from './types';

// ---------------------------------------------------------------------------
// Curated real observatories, so instrument/site names read as genuine.
// ---------------------------------------------------------------------------

interface ObservatorySeed {
  name: string;
  site: string;
  apertureM: number;
  type: ObservatoryType;
  altitudeM: number;
  operator: string;
}

const OBSERVATORIES: ObservatorySeed[] = [
  { name: 'Keck I', site: 'Mauna Kea, Hawaii', apertureM: 10, type: 'Optical', altitudeM: 4145, operator: 'W. M. Keck Observatory' },
  { name: 'Very Large Telescope UT1', site: 'Cerro Paranal, Chile', apertureM: 8.2, type: 'Optical', altitudeM: 2635, operator: 'ESO' },
  { name: 'Gemini North', site: 'Mauna Kea, Hawaii', apertureM: 8.1, type: 'Optical', altitudeM: 4213, operator: 'NOIRLab' },
  { name: 'Subaru', site: 'Mauna Kea, Hawaii', apertureM: 8.2, type: 'Optical', altitudeM: 4139, operator: 'NAOJ' },
  { name: 'Green Bank Telescope', site: 'Green Bank, West Virginia', apertureM: 100, type: 'Radio', altitudeM: 807, operator: 'NRAO' },
  { name: 'ALMA', site: 'Chajnantor Plateau, Chile', apertureM: 12, type: 'Radio', altitudeM: 5058, operator: 'ESO / NRAO / NAOJ' },
  { name: 'Hale Telescope', site: 'Palomar Mountain, California', apertureM: 5.1, type: 'Optical', altitudeM: 1712, operator: 'Caltech' },
  { name: 'Anglo-Australian Telescope', site: 'Siding Spring, Australia', apertureM: 3.9, type: 'Optical', altitudeM: 1164, operator: 'AAO' },
  { name: 'James Webb Space Telescope', site: 'Sun-Earth L2', apertureM: 6.5, type: 'Infrared', altitudeM: 1500000000, operator: 'NASA / ESA / CSA' },
  { name: 'Hubble Space Telescope', site: 'Low Earth Orbit', apertureM: 2.4, type: 'Space', altitudeM: 540000, operator: 'NASA / ESA' },
  { name: 'Arecibo (legacy)', site: 'Arecibo, Puerto Rico', apertureM: 305, type: 'Radio', altitudeM: 498, operator: 'NSF' },
  { name: 'Nordic Optical Telescope', site: 'La Palma, Canary Islands', apertureM: 2.56, type: 'Optical', altitudeM: 2382, operator: 'NOT' },
];

/**
 * Generate a single observatory drawn from the curated real set.
 *
 * @param seed - Optional numeric seed for reproducible output.
 */
export function makeObservatory(seed?: number): Observatory {
  if (seed !== undefined) {
    faker.seed(seed);
  }
  const base = faker.helpers.arrayElement(OBSERVATORIES);
  return { id: faker.string.uuid(), ...base };
}

/** Return the full curated observatory list (stable order, generated ids). */
export function makeObservatoryList(seed?: number): Observatory[] {
  if (seed !== undefined) {
    faker.seed(seed);
  }
  return OBSERVATORIES.map((base) => ({ id: faker.string.uuid(), ...base }));
}

/** Just the instrument names, handy for select options. */
export const OBSERVATORY_NAMES: string[] = OBSERVATORIES.map((o) => o.name);
