import { createRng } from './seed';
import type {
  OrbitPoint,
  OrbitTrack,
  Probe,
  ProbeTrack,
  ProbeTrackPoint,
  Spacecraft,
} from './types';

const DEG_PER_UNIT_LAT = 60;

function clampLat(lat: number): number {
  return Math.max(-90, Math.min(90, lat));
}

function wrapLng(lng: number): number {
  let result = lng;
  while (result > 180) result -= 360;
  while (result < -180) result += 360;
  return result;
}

function wrapAngle(angle: number): number {
  return ((angle % 360) + 360) % 360;
}

/**
 * Convert a distance + inclination into a lat/lng delta from a starting point.
 * Uses a cosine correction on longitude for the local latitude.
 */
function step(
  lat: number,
  lng: number,
  inclinationDeg: number,
  dist: number,
): { lat: number; lng: number } {
  const inclinationRad = (inclinationDeg * Math.PI) / 180;
  const dLat = (dist * Math.cos(inclinationRad)) / DEG_PER_UNIT_LAT;
  const latCorrection = Math.max(Math.cos((lat * Math.PI) / 180), 0.01);
  const dLng = (dist * Math.sin(inclinationRad)) / (DEG_PER_UNIT_LAT * latCorrection);
  return {
    lat: clampLat(lat + dLat),
    lng: wrapLng(lng + dLng),
  };
}

/**
 * Advance a spacecraft's sub-satellite point forward by `deltaHours`, returning
 * a new spacecraft with updated position, inclination, and timestamp. Pure —
 * does not mutate input.
 */
export function advanceSpacecraftPosition(
  spacecraft: Spacecraft,
  deltaHours: number,
): Spacecraft {
  if (spacecraft.status !== 'in-orbit') {
    return { ...spacecraft, timestamp: new Date().toISOString() };
  }

  const dist = spacecraft.velocityKmS * deltaHours;
  const { lat, lng } = step(
    spacecraft.position.lat,
    spacecraft.position.lng,
    spacecraft.inclination,
    dist,
  );

  // Use the current position as a seed so drift is stable per craft/position.
  const rng = createRng(
    `${spacecraft.id}:${spacecraft.position.lat}:${spacecraft.position.lng}`,
  );
  const inclinationDrift = (rng.next() - 0.5) * 6; // ±3°
  const velocityJitter = 1 + (rng.next() - 0.5) * 0.2; // ±10%

  return {
    ...spacecraft,
    position: { lat, lng },
    inclination: wrapAngle(spacecraft.inclination + inclinationDrift),
    raan: wrapAngle(spacecraft.inclination + inclinationDrift),
    velocityKmS: Math.max(0, Math.round(spacecraft.velocityKmS * velocityJitter * 100) / 100),
    timestamp: new Date().toISOString(),
  };
}

/**
 * Generate a realistic ground track for a spacecraft, starting 24h ago and
 * advancing forward `hours` hours at `intervalMinutes` intervals.
 *
 * @param spacecraft - Spacecraft whose starting position seeds the track.
 * @param hours - Total duration of the track in hours.
 * @param intervalMinutes - Minutes between track points.
 * @param seed - Optional numeric seed for reproducible output.
 */
export function makeOrbitTrack(
  spacecraft: Spacecraft,
  hours: number,
  intervalMinutes: number,
  seed?: number,
): OrbitTrack {
  const rng = createRng(seed !== undefined ? `ot:${seed}` : `ot:${spacecraft.id}`);
  const steps = Math.max(1, Math.floor((hours * 60) / intervalMinutes));
  const startMs = Date.now() - 24 * 60 * 60 * 1000;
  const intervalMs = intervalMinutes * 60 * 1000;

  let lat = spacecraft.position.lat;
  let lng = spacecraft.position.lng;
  let inclination = spacecraft.inclination;
  let velocityKmS = spacecraft.velocityKmS;

  const positions: OrbitPoint[] = [];

  for (let i = 0; i <= steps; i++) {
    positions.push({
      lat,
      lng,
      inclination: wrapAngle(inclination),
      velocityKmS: Math.round(velocityKmS * 100) / 100,
      timestamp: new Date(startMs + i * intervalMs).toISOString(),
    });

    const dist = velocityKmS * (intervalMinutes / 60);
    const next = step(lat, lng, inclination, dist);
    lat = next.lat;
    lng = next.lng;
    inclination = wrapAngle(inclination + (rng.next() - 0.5) * 6); // ±3°
    velocityKmS = Math.max(0, velocityKmS * (1 + (rng.next() - 0.5) * 0.2)); // ±10%
  }

  return { spacecraftId: spacecraft.id, positions };
}

/**
 * Generate a realistic track for a probe. Higher speeds and altitude than
 * orbiting spacecraft, with wider heading changes.
 *
 * @param probe - Probe whose starting position seeds the track.
 * @param hours - Total duration of the track in hours.
 * @param intervalMinutes - Minutes between track points.
 * @param seed - Optional numeric seed for reproducible output.
 */
export function makeProbeTrack(
  probe: Probe,
  hours: number,
  intervalMinutes: number,
  seed?: number,
): ProbeTrack {
  const rng = createRng(seed !== undefined ? `pt:${seed}` : `pt:${probe.id}`);
  const steps = Math.max(1, Math.floor((hours * 60) / intervalMinutes));
  const startMs = Date.now() - 24 * 60 * 60 * 1000;
  const intervalMs = intervalMinutes * 60 * 1000;

  let lat = probe.position.lat;
  let lng = probe.position.lng;
  let inclination = probe.inclination;
  let velocityKmS = Math.max(2, probe.velocityKmS);
  let altitudeKm = probe.altitudeKm || 400;

  const positions: ProbeTrackPoint[] = [];

  for (let i = 0; i <= steps; i++) {
    positions.push({
      lat,
      lng,
      altitudeKm: Math.round(altitudeKm),
      inclination: wrapAngle(inclination),
      velocityKmS: Math.round(velocityKmS * 100) / 100,
      timestamp: new Date(startMs + i * intervalMs).toISOString(),
    });

    const dist = velocityKmS * (intervalMinutes / 60);
    const next = step(lat, lng, inclination, dist);
    lat = next.lat;
    lng = next.lng;
    // Transfer arc: larger, biased inclination changes.
    inclination = wrapAngle(inclination + (rng.next() - 0.4) * 30);
    velocityKmS = Math.min(16, Math.max(2, velocityKmS * (1 + (rng.next() - 0.5) * 0.2)));
    altitudeKm = Math.min(40000, Math.max(200, altitudeKm + (rng.next() - 0.5) * 4000));
  }

  return { probeId: probe.id, positions };
}
