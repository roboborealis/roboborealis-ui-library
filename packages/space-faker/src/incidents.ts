import { faker } from '@faker-js/faker';

import { makeSpacecraftName } from './vessels';
import type {
  EventSeverity,
  EventStatus,
  EventType,
  ObservationEvent,
  SpaceEvent,
} from './types';

const REGIONS = [1, 5, 7, 8, 9, 11, 13, 14];

const EVENT_TYPES: EventType[] = [
  'Launch',
  'Docking',
  'Anomaly',
  'Conjunction Warning',
  'Reentry',
  'EVA',
  'Observation',
];

const SEVERITIES: EventSeverity[] = ['low', 'medium', 'high', 'critical'];

const STATUSES: EventStatus[] = ['open', 'assigned', 'resolved'];

const ANOMALY_TYPES = [
  'Power Bus Fault',
  'Attitude Control Loss',
  'Thermal Excursion',
  'Comms Blackout',
  'Propellant Leak',
];

const ANOMALY_DESCRIPTIONS = [
  'Spacecraft entered safe mode after power bus fault',
  'Loss of attitude control detected, reaction wheels saturated',
  'Thermal excursion on payload deck exceeding limits',
  'Telemetry dropout during pass, ground contact lost',
  'Propellant pressure anomaly flagged by onboard fault detection',
  'Solar array failed to deploy on schedule',
];

const CONJUNCTION_DESCRIPTIONS = [
  'Close approach with catalogued debris, miss distance under 1 km',
  'Conjunction with defunct satellite, collision probability elevated',
  'Debris fragment on intersecting orbit, screening in progress',
  'Predicted conjunction requires collision-avoidance maneuver',
  'Two active spacecraft on converging orbits, coordination underway',
];

const REENTRY_DESCRIPTIONS = [
  'Uncontrolled reentry predicted within 48-hour window',
  'Deorbit burn confirmed, debris footprint over open ocean',
  'Reentry breakup observed, surviving fragments possible',
];

const DOCKING_DESCRIPTIONS = [
  'Crew capsule soft capture with station docking port',
  'Cargo freighter berthing operations in progress',
  'Automated rendezvous and docking sequence initiated',
];

const OBSERVATION_DESCRIPTIONS = [
  'New object catalogued from optical tracking pass',
  'Radar track refined for uncorrelated target',
  'Photometric observation logged for tumbling body',
];

function makeEventId(): string {
  const year = faker.number.int({ min: 2023, max: 2025 });
  const region = faker.helpers.arrayElement(REGIONS);
  const seq = faker.string.numeric(6);
  return `${year}-${region}-${seq}`;
}

function randomPosition(): { lat: number; lng: number } {
  return {
    lat: faker.number.float({ min: -60, max: 60, fractionDigits: 5 }),
    lng: faker.number.float({ min: -180, max: 180, fractionDigits: 5 }),
  };
}

function descriptionFor(type: EventType): string {
  switch (type) {
    case 'Anomaly':
      return faker.helpers.arrayElement(ANOMALY_DESCRIPTIONS);
    case 'Conjunction Warning':
      return faker.helpers.arrayElement(CONJUNCTION_DESCRIPTIONS);
    case 'Reentry':
      return faker.helpers.arrayElement(REENTRY_DESCRIPTIONS);
    case 'Docking':
      return faker.helpers.arrayElement(DOCKING_DESCRIPTIONS);
    case 'Launch':
      return 'Vehicle cleared the tower, nominal ascent to parking orbit';
    case 'EVA':
      return 'Extravehicular activity underway for external maintenance';
    case 'Observation':
      return faker.helpers.arrayElement(OBSERVATION_DESCRIPTIONS);
  }
}

/**
 * Generate an observation event with an event id and realistic description.
 *
 * @param seed - Optional numeric seed for reproducible output.
 */
export function makeObservationEvent(seed?: number): ObservationEvent {
  if (seed !== undefined) {
    faker.seed(seed);
  }

  const pos = randomPosition();
  return {
    id: faker.string.uuid(),
    eventId: makeEventId(),
    type: faker.helpers.arrayElement([
      'Optical Tracking',
      'Radar Survey',
      'Photometric Pass',
      'Catalog Update',
    ]),
    latitude: pos.lat,
    longitude: pos.lng,
    date: faker.date.recent({ days: 365 }).toISOString(),
    status: faker.helpers.arrayElement(STATUSES),
    objectsTracked: faker.number.int({ min: 0, max: 12 }),
    description: faker.helpers.arrayElement(OBSERVATION_DESCRIPTIONS),
  };
}

/**
 * Generate a conjunction-warning event.
 *
 * @param seed - Optional numeric seed for reproducible output.
 */
export function makeConjunctionWarning(seed?: number): SpaceEvent {
  if (seed !== undefined) {
    faker.seed(seed);
  }

  return {
    id: faker.string.uuid(),
    eventId: makeEventId(),
    type: 'Conjunction Warning',
    severity: faker.helpers.arrayElement<EventSeverity>(['medium', 'high']),
    status: faker.helpers.arrayElement(STATUSES),
    position: randomPosition(),
    timestamp: faker.date.recent({ days: 30 }).toISOString(),
    description: faker.helpers.arrayElement(CONJUNCTION_DESCRIPTIONS),
    craftInvolved: makeSpacecraftName(),
  };
}

/**
 * Generate a critical spacecraft anomaly alert with an anomaly type.
 *
 * @param seed - Optional numeric seed for reproducible output.
 */
export function makeAnomalyAlert(seed?: number): SpaceEvent {
  if (seed !== undefined) {
    faker.seed(seed);
  }

  return {
    id: faker.string.uuid(),
    eventId: makeEventId(),
    type: 'Anomaly',
    severity: 'critical',
    status: faker.helpers.arrayElement<EventStatus>(['open', 'assigned']),
    position: randomPosition(),
    timestamp: faker.date.recent({ days: 2 }).toISOString(),
    description: faker.helpers.arrayElement(ANOMALY_DESCRIPTIONS),
    anomalyType: faker.helpers.arrayElement(ANOMALY_TYPES),
    craftInvolved: makeSpacecraftName(),
  };
}

/**
 * Generate a random space event of any type.
 *
 * @param seed - Optional numeric seed for reproducible output.
 */
export function makeSpaceEvent(seed?: number): SpaceEvent {
  if (seed !== undefined) {
    faker.seed(seed);
  }

  const type = faker.helpers.arrayElement(EVENT_TYPES);
  const event: SpaceEvent = {
    id: faker.string.uuid(),
    eventId: makeEventId(),
    type,
    severity: faker.helpers.arrayElement(SEVERITIES),
    status: faker.helpers.arrayElement(STATUSES),
    position: randomPosition(),
    timestamp: faker.date.recent({ days: 30 }).toISOString(),
    description: descriptionFor(type),
  };

  if (type === 'Anomaly') {
    event.anomalyType = faker.helpers.arrayElement(ANOMALY_TYPES);
  }
  if (type === 'Anomaly' || type === 'Conjunction Warning' || type === 'Docking') {
    event.craftInvolved = makeSpacecraftName();
  }

  return event;
}

/**
 * Generate `count` events spread over the past `days` days, with realistic
 * clustering — more events during daylight hours and on weekdays. Suitable
 * for calendar-heatmap data.
 *
 * @param count - Number of events to create.
 * @param days - Window in days over which to spread events.
 * @param seed - Optional numeric seed for reproducible output.
 */
export function makeEventHistory(
  count: number,
  days: number,
  seed?: number,
): SpaceEvent[] {
  if (seed !== undefined) {
    faker.seed(seed);
  }

  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;
  const events: SpaceEvent[] = [];

  for (let i = 0; i < count; i++) {
    // Pick a day offset, biased so recent days are slightly more likely.
    const dayOffset = Math.floor(Math.pow(faker.number.float({ min: 0, max: 1 }), 1.3) * days);
    const dayStart = now - dayOffset * dayMs;
    const date = new Date(dayStart);

    // Weekday bias: if weekend, ~40% chance to shift to a nearby weekday.
    const weekday = date.getDay();
    if ((weekday === 0 || weekday === 6) && faker.datatype.boolean({ probability: 0.4 })) {
      date.setDate(date.getDate() - (weekday === 0 ? 2 : 1));
    }

    // Daylight bias: hours 6–18 weighted heavier than night hours.
    const hour = faker.datatype.boolean({ probability: 0.7 })
      ? faker.number.int({ min: 6, max: 18 })
      : faker.number.int({ min: 0, max: 23 });
    date.setHours(hour, faker.number.int({ min: 0, max: 59 }), 0, 0);

    const event = makeSpaceEvent();
    event.timestamp = date.toISOString();
    events.push(event);
  }

  return events.sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  );
}
