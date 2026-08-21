import { resolveToken } from './utils';

// ---------------------------------------------------------------------------
// resolveToken — CSS custom property resolver used by the SVG visualizations
// ---------------------------------------------------------------------------

describe('resolveToken', () => {
  afterEach(() => {
    document.documentElement.style.removeProperty('--test-token');
  });

  it('resolves a set token to its value', () => {
    document.documentElement.style.setProperty('--test-token', '#123456');
    expect(resolveToken('--test-token')).toBe('#123456');
  });

  it('returns the fallback when the token is unset', () => {
    expect(resolveToken('--definitely-missing-token', 'transparent')).toBe('transparent');
  });

  it('returns an empty string by default when the token is unset', () => {
    expect(resolveToken('--definitely-missing-token')).toBe('');
  });

  it('reads from a supplied element', () => {
    const el = document.createElement('div');
    el.style.setProperty('--test-token', 'rgb(1, 2, 3)');
    document.body.appendChild(el);
    expect(resolveToken('--test-token', '', el)).toBe('rgb(1, 2, 3)');
    document.body.removeChild(el);
  });
});
