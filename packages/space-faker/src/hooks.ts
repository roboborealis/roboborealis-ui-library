import { useEffect, useState } from 'react';

import { advanceSpacecraftPosition } from './tracks';
import { makeConstellation } from './vessels';
import type { Spacecraft } from './types';

/**
 * Returns a live-updating constellation for use in Storybook map stories.
 * Generates `count` spacecraft and advances their positions every `intervalMs` ms.
 * Uses useEffect for cleanup on unmount.
 *
 * @param count - Number of spacecraft to generate.
 * @param intervalMs - Update cadence in milliseconds (default 2000).
 * @param seed - Optional numeric seed for reproducible initial constellation.
 */
export function useConstellationStream(
  count: number,
  intervalMs: number = 2000,
  seed?: number,
): Spacecraft[] {
  const [spacecraft, setSpacecraft] = useState<Spacecraft[]>(() => makeConstellation(count, seed));

  useEffect(() => {
    const id = setInterval(() => {
      setSpacecraft((prev) =>
        prev.map((s) => advanceSpacecraftPosition(s, intervalMs / 1000 / 3600)),
      );
    }, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return spacecraft;
}
