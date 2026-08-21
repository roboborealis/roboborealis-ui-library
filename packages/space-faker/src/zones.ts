import { faker } from '@faker-js/faker';

import type {
  GroundTrackSector,
  OrbitalSector,
  SectorBounds,
  SectorType,
  TrackingType,
} from './types';

interface RegionArea {
  region: number;
  name: string;
  bounds: SectorBounds;
}

const REGIONS: Record<number, RegionArea> = {
  1: { region: 1, name: 'North Atlantic', bounds: { north: 47, south: 41, east: -66, west: -75 } },
  5: { region: 5, name: 'Mid-Atlantic', bounds: { north: 41, south: 36, east: -73, west: -80 } },
  7: { region: 7, name: 'Equatorial', bounds: { north: 31, south: 17, east: -75, west: -100 } },
  8: { region: 8, name: 'Gulf', bounds: { north: 32, south: 24, east: -85, west: -105 } },
  9: { region: 9, name: 'Northern', bounds: { north: 49, south: 41, east: -75, west: -93 } },
  11: { region: 11, name: 'Pacific Southwest', bounds: { north: 38, south: 32, east: -117, west: -125 } },
  13: { region: 13, name: 'Pacific Northwest', bounds: { north: 50, south: 45, east: -117, west: -125 } },
  14: { region: 14, name: 'Pacific', bounds: { north: 28, south: 15, east: -140, west: -180 } },
};

const SECTOR_TYPES: SectorType[] = ['LEO', 'MEO', 'GEO', 'HEO', 'Cislunar', 'Deep Space'];

const TRACKING_TYPES: TrackingType[] = ['Radar', 'Optical', 'Radio'];

const STATION_NETWORKS = [
  'Deep Space Network',
  'Space Surveillance Network',
  'Near Earth Network',
  'Optical Tracking Array',
  'Radio Interferometer Group',
];

function centerOf(bounds: SectorBounds): { lat: number; lng: number } {
  return {
    lat: (bounds.north + bounds.south) / 2,
    lng: (bounds.east + bounds.west) / 2,
  };
}

/**
 * Carve a sub-rectangle out of a region's bounds for a ground-track sector.
 */
function subBounds(area: SectorBounds): SectorBounds {
  const latSpan = (area.north - area.south) * faker.number.float({ min: 0.3, max: 0.6 });
  const lngSpan = (area.east - area.west) * faker.number.float({ min: 0.3, max: 0.6 });
  const south = faker.number.float({ min: area.south, max: area.north - latSpan });
  const west = faker.number.float({ min: area.west, max: area.east - lngSpan });
  return {
    south,
    north: south + latSpan,
    west,
    east: west + lngSpan,
  };
}

/**
 * Generate a ground-track sector within a given region (1–14).
 * Falls back to region 7 for regions without defined bounds.
 *
 * @param region - Ground-track region number.
 * @param seed - Optional numeric seed for reproducible output.
 */
export function makeGroundTrackSector(region: number, seed?: number): GroundTrackSector {
  if (seed !== undefined) {
    faker.seed(seed);
  }

  const area = REGIONS[region] ?? REGIONS[7];
  const bounds = subBounds(area.bounds);
  const trackingType = faker.helpers.arrayElement(TRACKING_TYPES);

  return {
    id: faker.string.uuid(),
    name: `R${area.region} ${area.name} — ${faker.location.cardinalDirection()} Sector`,
    region: area.region,
    bounds,
    assignedStation: `R${area.region} ${faker.helpers.arrayElement(STATION_NETWORKS)}`,
    trackingType,
  };
}

/**
 * Generate an orbital sector for a random region.
 *
 * @param seed - Optional numeric seed for reproducible output.
 */
export function makeOrbitalSector(seed?: number): OrbitalSector {
  if (seed !== undefined) {
    faker.seed(seed);
  }

  const area = faker.helpers.arrayElement(Object.values(REGIONS));
  const type = faker.helpers.arrayElement(SECTOR_TYPES);
  return {
    id: faker.string.uuid(),
    name: `${area.name} ${type} Sector`,
    type,
    region: area.region,
    bounds: area.bounds,
    center: centerOf(area.bounds),
  };
}
