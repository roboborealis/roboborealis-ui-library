// ---------------------------------------------------------------------------
// Deterministic PRNG — Linear Congruential Generator (LCG)
//
// Seeded from a string hash. Produces identical sequences for the same seed
// across all platforms, making Storybook demos fully reproducible.
// ---------------------------------------------------------------------------

/** A seeded random-number generator with convenience helpers. */
export interface SeededRng {
  /** Returns a float in [0, 1). */
  next(): number;
  /** Returns an integer in [min, max] (inclusive). */
  nextInt(min: number, max: number): number;
  /** Returns a random element from `arr`. */
  pick<T>(arr: readonly T[]): T;
  /** Returns a new shuffled copy of `arr` (Fisher–Yates). */
  shuffle<T>(arr: readonly T[]): T[];
}

/**
 * Hash a string to a 32-bit unsigned integer (FNV-1a).
 * Produces a good distribution for short seeds.
 */
function fnv1a(str: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

/**
 * Create a deterministic PRNG seeded from the given string.
 *
 * Uses a Lehmer / Park–Miller LCG with modulus 2^31 - 1 (Mersenne prime).
 * Period: 2^31 - 2 (~2.1 billion). More than sufficient for mock data.
 *
 * @param seed - Any string. The same string always produces the same sequence.
 */
export function createRng(seed: string): SeededRng {
  // Ensure a non-zero start state
  let state = fnv1a(seed) || 1;

  function next(): number {
    // Lehmer LCG: state = state * 48271 mod (2^31 - 1)
    state = (state * 48271) % 0x7fffffff;
    return (state - 1) / 0x7ffffffe;
  }

  function nextInt(min: number, max: number): number {
    return Math.floor(next() * (max - min + 1)) + min;
  }

  function pick<T>(arr: readonly T[]): T {
    return arr[nextInt(0, arr.length - 1)];
  }

  function shuffle<T>(arr: readonly T[]): T[] {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = nextInt(0, i);
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  return { next, nextInt, pick, shuffle };
}
