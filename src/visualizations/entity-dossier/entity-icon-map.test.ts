import { describe, it, expect } from 'vitest';
import {
  PlaneTakeoff,
  Map,
  Waves,
  Globe,
  Landmark,
  Building,
  Cable,
  TrainFront,
  TrafficCone,
  MapPin,
  Circle,
} from 'lucide-react';
import { getEntityIcon } from './entity-icon-map';

describe('getEntityIcon — new entity type icons', () => {
  it.each([
    ['plane-takeoff', PlaneTakeoff],
    ['map', Map],
    ['waves', Waves],
    ['globe', Globe],
    ['landmark', Landmark],
    ['building', Building],
    ['cable', Cable],
    ['train-front', TrainFront],
    ['traffic-cone', TrafficCone],
    ['map-pin', MapPin],
  ])('resolves "%s" to the correct Lucide component', (name, expected) => {
    expect(getEntityIcon(name)).toBe(expected);
  });

  it('still falls back to Circle for an unregistered icon name', () => {
    expect(getEntityIcon('not-a-real-icon')).toBe(Circle);
  });
});
