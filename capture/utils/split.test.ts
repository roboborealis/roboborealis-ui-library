import { describe, it, expect } from 'vitest';
import { splitSteps, totalDurationMs } from './split';
import type { Action } from '../actions/index';

const click = (selector: string): Action => ({ action: 'click', selector });
const wait = (ms: number): Action => ({ action: 'wait', for: 'timeout', value: ms });

describe('splitSteps', () => {
  it('returns single chunk when total duration is under the limit', () => {
    // 5 clicks × 200ms = 1000ms, well under 60000ms
    const steps = [click('#a'), click('#b'), click('#c'), click('#d'), click('#e')];
    const chunks = splitSteps(steps, 60_000);
    expect(chunks).toHaveLength(1);
    expect(chunks[0]).toHaveLength(5);
  });

  it('splits into two chunks when duration exceeds the limit', () => {
    // 3 × (2000 + 200)ms = 6600ms; limit = 4400ms → first 2 fit, third overflows
    const steps = [wait(2000), wait(2000), wait(2000)];
    const chunks = splitSteps(steps, 4_400);
    expect(chunks).toHaveLength(2);
    expect(chunks[0]).toHaveLength(2);
    expect(chunks[1]).toHaveLength(1);
  });

  it('does not split when accumulated duration exactly equals the limit', () => {
    // 3 × wait(2000) = 3 × 2200ms = 6600ms exactly; strict > means no flush at equality
    const steps = [wait(2000), wait(2000), wait(2000)];
    const chunks = splitSteps(steps, 6_600);
    expect(chunks).toHaveLength(1);
    expect(chunks[0]).toHaveLength(3);
  });

  it('produces three chunks when steps overflow twice', () => {
    // 6 × wait(2000) = 6 × 2200ms = 13200ms; limit 4400ms → chunks of 2 steps each
    const steps = [wait(2000), wait(2000), wait(2000), wait(2000), wait(2000), wait(2000)];
    const chunks = splitSteps(steps, 4_400);
    expect(chunks).toHaveLength(3);
    expect(chunks[0]).toHaveLength(2);
    expect(chunks[1]).toHaveLength(2);
    expect(chunks[2]).toHaveLength(2);
  });

  it('never splits mid-step: first step always goes into the first chunk even if it exceeds limit', () => {
    // Limit = 100ms; each click = 200ms overhead. First step must land in chunk 1.
    const steps = [click('#a'), click('#b')];
    const chunks = splitSteps(steps, 100);
    expect(chunks[0]).toHaveLength(1);
    expect(chunks[1]).toHaveLength(1);
  });

  it('returns empty array for empty input', () => {
    expect(splitSteps([], 60_000)).toEqual([]);
  });
});

describe('totalDurationMs', () => {
  it('sums estimated durations', () => {
    // 2 clicks × 200ms + 1 wait(1000) × (1000+200ms) = 1600ms
    const steps: Action[] = [click('#a'), click('#b'), wait(1000)];
    expect(totalDurationMs(steps)).toBe(1600);
  });

  it('returns 0 for empty array', () => {
    expect(totalDurationMs([])).toBe(0);
  });
});
