import { readAnimationTokens } from './use-animation-tokens';

describe('readAnimationTokens', () => {
  it('returns fallback values when no CSS vars are set', () => {
    const tokens = readAnimationTokens();
    expect(tokens.durationFast).toBe(120);
    expect(tokens.durationNormal).toBe(220);
    expect(tokens.springStiffness).toBe(260);
    expect(tokens.springDamping).toBe(20);
    expect(tokens.easeEnter).toEqual([0, 0, 0.2, 1]);
  });
});
