import { describe, it, expect } from 'vitest';
import { estimateStepDurationMs, ACTION_OVERHEAD_MS } from './index';
import type { Action } from './index';

describe('estimateStepDurationMs', () => {
  it('returns overhead for click', () => {
    const step: Action = { action: 'click', selector: '#btn' };
    expect(estimateStepDurationMs(step)).toBe(ACTION_OVERHEAD_MS);
  });

  it('returns overhead for click_at', () => {
    const step: Action = { action: 'click_at', x: 400, y: 300 };
    expect(estimateStepDurationMs(step)).toBe(ACTION_OVERHEAD_MS);
  });

  it('returns overhead for double_click_at', () => {
    const step: Action = { action: 'double_click_at', x: 600, y: 250 };
    expect(estimateStepDurationMs(step)).toBe(ACTION_OVERHEAD_MS);
  });

  it('returns overhead for type', () => {
    const step: Action = { action: 'type', selector: '#input', text: 'hello' };
    expect(estimateStepDurationMs(step)).toBe(ACTION_OVERHEAD_MS);
  });

  it('returns overhead for scroll', () => {
    const step: Action = { action: 'scroll', direction: 'down', amount: 300 };
    expect(estimateStepDurationMs(step)).toBe(ACTION_OVERHEAD_MS);
  });

  it('returns overhead for keyboard', () => {
    const step: Action = { action: 'keyboard', key: 'Tab' };
    expect(estimateStepDurationMs(step)).toBe(ACTION_OVERHEAD_MS);
  });

  it('returns overhead for select', () => {
    const step: Action = { action: 'select', selector: 'select', value: 'a' };
    expect(estimateStepDurationMs(step)).toBe(ACTION_OVERHEAD_MS);
  });

  it('adds hover duration to overhead', () => {
    const step: Action = { action: 'hover', selector: '#btn', duration: 800 };
    expect(estimateStepDurationMs(step)).toBe(800 + ACTION_OVERHEAD_MS);
  });

  it('returns overhead for hover without explicit duration', () => {
    const step: Action = { action: 'hover', selector: '#btn' };
    expect(estimateStepDurationMs(step)).toBe(ACTION_OVERHEAD_MS);
  });

  it('adds timeout value to overhead for wait:timeout', () => {
    const step: Action = { action: 'wait', for: 'timeout', value: 2000 };
    expect(estimateStepDurationMs(step)).toBe(2000 + ACTION_OVERHEAD_MS);
  });

  it('returns overhead for wait:selector', () => {
    const step: Action = { action: 'wait', for: 'selector', value: '#root' };
    expect(estimateStepDurationMs(step)).toBe(ACTION_OVERHEAD_MS);
  });

  it('returns overhead for set_theme', () => {
    const step: Action = { action: 'set_theme', theme: 'midnight', mode: 'dark' };
    expect(estimateStepDurationMs(step)).toBe(ACTION_OVERHEAD_MS);
  });
});
