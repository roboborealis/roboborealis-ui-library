import {
  Anchor,
  Building,
  Building2,
  Cable,
  Circle,
  Droplets,
  Flag,
  Globe,
  Landmark,
  Map,
  MapPin,
  Orbit,
  Plane,
  PlaneTakeoff,
  RadioTower,
  Rocket,
  Satellite,
  Signal,
  TrafficCone,
  TrainFront,
  User,
  Warehouse,
  Waves,
  Zap,
  type LucideIcon,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Entity type icon name → Lucide icon component
//
// `RoboEntityTypeConfig.icon` (src/visualizations/registry.ts) stores a Lucide
// icon name string so consumers can register custom entity types without a
// compile-time dependency on lucide-react. This map resolves the built-in
// names to their actual components; `getEntityIcon` falls back to `Circle`
// for any name a consumer registers that isn't in this map, so unknown icons
// degrade gracefully instead of crashing.
// ---------------------------------------------------------------------------

const ENTITY_ICON_MAP: Record<string, LucideIcon> = {
  'rocket': Rocket,
  'orbit': Orbit,
  'radio-tower': RadioTower,
  'plane': Plane,
  'plane-takeoff': PlaneTakeoff,
  'satellite': Satellite,
  'user': User,
  'building-2': Building2,
  'building': Building,
  'anchor': Anchor,
  'warehouse': Warehouse,
  'signal': Signal,
  'zap': Zap,
  'droplets': Droplets,
  'flag': Flag,
  'circle': Circle,
  'map': Map,
  'map-pin': MapPin,
  'waves': Waves,
  'globe': Globe,
  'landmark': Landmark,
  'cable': Cable,
  'train-front': TrainFront,
  'traffic-cone': TrafficCone,
};

/** Resolve a Lucide icon name (from `RoboEntityTypeConfig.icon`) to its component. */
export function getEntityIcon(name: string): LucideIcon {
  return ENTITY_ICON_MAP[name] ?? Circle;
}
