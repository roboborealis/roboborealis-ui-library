// ---------------------------------------------------------------------------
// OSINT Relationship Generator — Deterministic mock data for Storybook
//
// Produces ~150-200 realistic relationships: ownership, operator registration,
// ground contacts, personnel, subsidiary links, and proximity/conjunction events.
// ---------------------------------------------------------------------------

import type { RoboOsintEntity, RoboOsintRelationship, RoboRelationshipType } from '@/visualizations/types';

import { createRng } from './seed-random';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const DAY_MS = 86_400_000;

/** Haversine great-circle distance in kilometers between two sub-satellite points. */
function distanceKm(
  a: { lng: number; lat: number },
  b: { lng: number; lat: number },
): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const sinLat = Math.sin(dLat / 2);
  const sinLng = Math.sin(dLng / 2);
  const h = sinLat * sinLat + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * sinLng * sinLng;
  return 2 * Math.asin(Math.sqrt(h)) * 6371; // Earth radius in km
}

let _relId = 0;

function makeRel(
  rng: ReturnType<typeof createRng>,
  sourceEntityId: string,
  targetEntityId: string,
  type: RoboRelationshipType,
  source: string,
  opts: {
    confidence?: number;
    label?: string;
    strength?: number;
    metadata?: Record<string, unknown>;
  } = {},
): RoboOsintRelationship {
  const now = Date.now();
  _relId += 1;
  return {
    id: `rel-${String(_relId).padStart(4, '0')}`,
    sourceEntityId,
    targetEntityId,
    type,
    confidence: opts.confidence ?? 0.7 + rng.next() * 0.3,
    source,
    firstSeen: now - rng.nextInt(1, 30) * DAY_MS,
    lastSeen: now - rng.nextInt(0, DAY_MS),
    label: opts.label,
    strength: opts.strength ?? 0.5 + rng.next() * 0.5,
    metadata: opts.metadata,
  };
}

// ---------------------------------------------------------------------------
// Main generator
// ---------------------------------------------------------------------------

/**
 * Generate deterministic OSINT relationships from a set of entities.
 *
 * @param entities - Output of `generateEntities()`
 * @param seed     - RNG seed string (default: `'robo-osint-relationships'`)
 * @returns ~150–200 `RoboOsintRelationship` objects
 */
export function generateRelationships(
  entities: RoboOsintEntity[],
  seed = 'robo-osint-relationships',
): RoboOsintRelationship[] {
  const rng = createRng(seed);
  _relId = 0; // Reset counter for determinism

  const rels: RoboOsintRelationship[] = [];

  // Partition entities by type
  const spacecraft = entities.filter((e) => e.type === 'spacecraft');
  const companies = entities.filter((e) => e.type === 'company');
  const persons = entities.filter((e) => e.type === 'person');
  const stations = entities.filter((e) => e.type === 'ground-station');
  const agencies = entities.filter((e) => e.type === 'agency');

  // -------------------------------------------------------------------
  // Spacecraft → Company (owner) — 3-4 craft per company, shared ownership
  // -------------------------------------------------------------------
  const shuffledCraft = rng.shuffle(spacecraft);
  for (let i = 0; i < shuffledCraft.length; i++) {
    if (!companies.length) break;
    const craft = shuffledCraft[i];
    // Distribute craft across companies (round-robin with some randomness)
    const companyIdx = i % companies.length;
    const company = companies[companyIdx];
    rels.push(
      makeRel(rng, craft.id, company.id, 'owner', 'registry', {
        confidence: 0.85 + rng.next() * 0.15,
        label: 'registered operator',
        strength: 0.9,
      }),
    );
  }

  // -------------------------------------------------------------------
  // Spacecraft → Agency (registered to)
  // -------------------------------------------------------------------
  for (const craft of spacecraft) {
    const matchingAgency = agencies.find((a) => a.operator === craft.operator);
    if (matchingAgency) {
      rels.push(
        makeRel(rng, craft.id, matchingAgency.id, 'flag', 'registry', {
          confidence: 1.0,
          label: `operator: ${matchingAgency.name}`,
          strength: 1.0,
        }),
      );
    }
  }

  // -------------------------------------------------------------------
  // Spacecraft → Ground Station (contact) — 2-5 contacts per craft
  // -------------------------------------------------------------------
  for (const craft of spacecraft) {
    const contactCount = rng.nextInt(2, 5);
    const selectedStations = rng.shuffle(stations).slice(0, contactCount);
    for (const station of selectedStations) {
      rels.push(
        makeRel(rng, craft.id, station.id, 'port-call', 'ground-network', {
          confidence: 0.8 + rng.next() * 0.2,
          label: `contact at ${station.name}`,
          metadata: {
            contactDate: Date.now() - rng.nextInt(1, 25) * DAY_MS,
            purpose: rng.pick(['downlink', 'ranging', 'commanding', 'maintenance', 'pass']),
          },
        }),
      );
    }
  }

  // -------------------------------------------------------------------
  // Company → Person (beneficial owner, director)
  // -------------------------------------------------------------------
  const shuffledPersons = rng.shuffle(persons);
  for (let i = 0; i < companies.length && shuffledPersons.length > 0; i++) {
    const company = companies[i];
    // 1-2 persons per company
    const personCount = rng.nextInt(1, 2);
    for (let j = 0; j < personCount; j++) {
      const person = shuffledPersons[(i * 2 + j) % shuffledPersons.length];
      const role = (person.properties.role as string) ?? 'director';
      rels.push(
        makeRel(rng, company.id, person.id, 'owner', 'registry', {
          confidence: 0.6 + rng.next() * 0.3,
          label: role,
          strength: 0.7 + rng.next() * 0.3,
        }),
      );
    }
  }

  // -------------------------------------------------------------------
  // Company → Company (subsidiary) — 2-3 pairs
  // -------------------------------------------------------------------
  const subsidiaryCount = rng.nextInt(2, 3);
  const shuffledCompanies = rng.shuffle(companies);
  for (let i = 0; i < subsidiaryCount && i + 1 < shuffledCompanies.length; i++) {
    rels.push(
      makeRel(
        rng,
        shuffledCompanies[i].id,
        shuffledCompanies[i + 1].id,
        'subsidiary',
        'registry',
        {
          confidence: 0.5 + rng.next() * 0.4,
          label: 'subsidiary of',
          strength: 0.6,
        },
      ),
    );
  }

  // -------------------------------------------------------------------
  // Person → Spacecraft (crew) — a few crew relationships
  // -------------------------------------------------------------------
  const crewPersons = persons.filter((p) =>
    ['commander', 'flight-director'].includes(p.properties.role as string),
  );
  for (const person of crewPersons) {
    if (!spacecraft.length) break;
    const craft = rng.pick(spacecraft);
    rels.push(
      makeRel(rng, person.id, craft.id, 'crew', 'humint', {
        confidence: 0.5 + rng.next() * 0.4,
        label: person.properties.role as string,
        strength: 0.6,
      }),
    );
  }

  // -------------------------------------------------------------------
  // Spacecraft–Spacecraft proximity / conjunction (5-8 events)
  // -------------------------------------------------------------------
  const proximityCount = rng.nextInt(5, 8);
  const positionedCraft = spacecraft.filter((v) => v.position);
  let proximityAdded = 0;

  for (let i = 0; i < positionedCraft.length && proximityAdded < proximityCount; i++) {
    for (let j = i + 1; j < positionedCraft.length && proximityAdded < proximityCount; j++) {
      const a = positionedCraft[i];
      const b = positionedCraft[j];
      if (a.position && b.position) {
        const dist = distanceKm(a.position, b.position);
        if (dist < 800) {
          const isConjunction = dist < 100;
          rels.push(
            makeRel(
              rng,
              a.id,
              b.id,
              isConjunction ? 'rendezvous' : 'proximity',
              'telemetry',
              {
                confidence: isConjunction ? 0.5 + rng.next() * 0.3 : 0.3 + rng.next() * 0.4,
                label: isConjunction
                  ? `conjunction (~${dist.toFixed(1)} km)`
                  : `proximity (~${dist.toFixed(0)} km)`,
                strength: isConjunction ? 0.8 : 0.4,
                metadata: { distanceKm: Math.round(dist * 10) / 10 },
              },
            ),
          );
          proximityAdded++;
        }
      }
    }
  }

  // If not enough proximity events from real distances, add some synthetic ones
  while (proximityAdded < 5) {
    if (positionedCraft.length < 2) break;
    const a = rng.pick(positionedCraft);
    const filtered = positionedCraft.filter((v) => v.id !== a.id);
    if (!filtered.length) break;
    const b = rng.pick(filtered);
    rels.push(
      makeRel(rng, a.id, b.id, 'proximity', 'satellite', {
        confidence: 0.3 + rng.next() * 0.3,
        label: 'proximity (optically observed)',
        strength: 0.3 + rng.next() * 0.3,
      }),
    );
    proximityAdded++;
  }

  // -------------------------------------------------------------------
  // Co-located (craft sharing a station contact window) — 3-5 pairs
  // -------------------------------------------------------------------
  if (stations.length) {
    const colocatedCount = rng.nextInt(3, 5);
    for (let i = 0; i < colocatedCount; i++) {
      const station = rng.pick(stations);
      const pair = rng.shuffle(spacecraft).slice(0, 2);
      if (pair.length === 2) {
        rels.push(
          makeRel(rng, pair[0].id, pair[1].id, 'co-located', 'ground-network', {
            confidence: 0.6 + rng.next() * 0.3,
            label: `co-located at ${station.name}`,
            strength: 0.5,
            metadata: { stationId: station.id },
          }),
        );
      }
    }
  }

  return rels;
}
