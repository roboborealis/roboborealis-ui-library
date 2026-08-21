import type { Action } from '../actions/index';
import { estimateStepDurationMs } from '../actions/index';

export function splitSteps(steps: Action[], maxMs: number): Action[][] {
  if (steps.length === 0) return [];

  const chunks: Action[][] = [];
  let currentChunk: Action[] = [];
  let currentMs = 0;

  for (const step of steps) {
    const duration = estimateStepDurationMs(step);
    // Strict > is intentional: a chunk accumulated to exactly maxMs is not flushed.
    // A step is only split into a new chunk when it would push the total over the limit.
    if (currentMs + duration > maxMs && currentChunk.length > 0) {
      chunks.push(currentChunk);
      currentChunk = [step];
      currentMs = duration;
    } else {
      currentChunk.push(step);
      currentMs += duration;
    }
  }

  if (currentChunk.length > 0) chunks.push(currentChunk);
  return chunks;
}

export function totalDurationMs(steps: Action[]): number {
  return steps.reduce((sum, step) => sum + estimateStepDurationMs(step), 0);
}
