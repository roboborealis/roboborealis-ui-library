import { describe, it, expect } from 'vitest';
import { createTypeRegistry } from './registry';

describe('createTypeRegistry — compactFields', () => {
  it('ground-station has compactFields configured', () => {
    const registry = createTypeRegistry();
    expect(registry.getEntityTypeConfig('ground-station').compactFields).toEqual(['operator', 'station_type']);
  });

  it('spacecraft has compactFields configured', () => {
    const registry = createTypeRegistry();
    expect(registry.getEntityTypeConfig('spacecraft').compactFields).toEqual(['operator', 'craft_type']);
  });

  it('a genuinely unknown type still falls back to the generic config with no compactFields', () => {
    const registry = createTypeRegistry();
    const config = registry.getEntityTypeConfig('totally-made-up-type');
    expect(config.label).toBe('Unknown');
    expect(config.compactFields).toBeUndefined();
  });
});

describe('createTypeRegistry — new built-in entity types', () => {
  const cases: Array<[string, { icon: string; label: string; compactFields: string[] }]> = [
    ['airport', { icon: 'plane-takeoff', label: 'Airport', compactFields: ['iata_code', 'country'] }],
    ['region', { icon: 'map', label: 'Region', compactFields: ['name', 'category'] }],
    ['orbital-region', { icon: 'orbit', label: 'Orbital Region', compactFields: ['name', 'area_km2'] }],
    ['country', { icon: 'globe', label: 'Country', compactFields: ['iso_code', 'capital'] }],
    ['city', { icon: 'landmark', label: 'City', compactFields: ['country', 'population'] }],
    ['building', { icon: 'building', label: 'Building', compactFields: ['building_type', 'address'] }],
    ['cable', { icon: 'cable', label: 'Cable', compactFields: ['owners', 'length_km'] }],
    ['train', { icon: 'train-front', label: 'Train', compactFields: ['line', 'next_stop'] }],
    ['traffic-incident', { icon: 'traffic-cone', label: 'Traffic Incident', compactFields: ['severity', 'road_name'] }],
    ['coordinate', { icon: 'map-pin', label: 'Coordinate', compactFields: [] }],
  ];

  it.each(cases)('%s has the expected icon/label/compactFields', (type, expected) => {
    const registry = createTypeRegistry();
    const config = registry.getEntityTypeConfig(type);
    expect(config.icon).toBe(expected.icon);
    expect(config.label).toBe(expected.label);
    expect(config.compactFields).toEqual(expected.compactFields);
  });
});
