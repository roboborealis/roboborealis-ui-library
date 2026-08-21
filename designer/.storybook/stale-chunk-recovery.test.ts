import { beforeEach, describe, expect, it } from 'vitest';

import { recordReload, shouldReload } from './stale-chunk-recovery';

// The reload guard is the only risky part of this module: `vite:preloadError`
// fires on any failed chunk fetch, including a server that is simply down, so
// an unguarded handler turns one bad deploy into an infinite reload loop.

/** Minimal in-memory Storage — jsdom's sessionStorage persists across tests in the same file. */
function createStorage(initial: Record<string, string> = {}): Storage {
  const map = new Map(Object.entries(initial));
  return {
    get length() {
      return map.size;
    },
    clear: () => map.clear(),
    getItem: (k: string) => map.get(k) ?? null,
    key: (i: number) => [...map.keys()][i] ?? null,
    removeItem: (k: string) => void map.delete(k),
    setItem: (k: string, v: string) => void map.set(k, v),
  };
}

describe('stale chunk recovery guard', () => {
  let storage: Storage;

  beforeEach(() => {
    storage = createStorage();
  });

  it('reloads on the first failure', () => {
    expect(shouldReload(storage)).toBe(true);
  });

  it('stops after three reloads, so a permanently broken deploy settles on the error', () => {
    for (let i = 0; i < 3; i++) {
      expect(shouldReload(storage)).toBe(true);
      recordReload(storage);
    }
    expect(shouldReload(storage)).toBe(false);
  });

  it('treats a corrupt stored count as no prior reload rather than throwing', () => {
    expect(shouldReload(createStorage({ 'robo:stale-chunk-reload-count': 'NaN' }))).toBe(true);
  });
});
