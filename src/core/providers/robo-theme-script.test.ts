import { applyRoboThemeAttributes, getRoboThemeScript } from './robo-theme-script';

function mockMatchMedia(matches: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: vi.fn().mockReturnValue({
      matches,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
    }),
  });
}

/** Mirrors what getRoboThemeScript resolves for the default options. */
const DEFAULT_CONFIG = {
  storageKey: 'robo-theme',
  defaultTheme: 'midnight',
  fallbackMode: 'dark',
};

describe('applyRoboThemeAttributes', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    delete document.documentElement.dataset.theme;
    delete document.documentElement.dataset.mode;
    window.localStorage.clear();
    // @ts-expect-error — restore jsdom's absent matchMedia
    delete window.matchMedia;
  });

  it('applies a stored theme and mode', () => {
    window.localStorage.setItem('robo-theme:theme', 'aurora');
    window.localStorage.setItem('robo-theme:mode', 'light');

    applyRoboThemeAttributes(DEFAULT_CONFIG);

    expect(document.documentElement.dataset.theme).toBe('aurora');
    expect(document.documentElement.dataset.mode).toBe('light');
  });

  it('resolves a stored system preference against the OS', () => {
    mockMatchMedia(true);
    window.localStorage.setItem('robo-theme:mode', 'system');

    applyRoboThemeAttributes(DEFAULT_CONFIG);

    // data-mode must always be concrete — the theme CSS matches dark/light and nothing else.
    expect(document.documentElement.dataset.mode).toBe('dark');
  });

  it('resolves system to light when the OS prefers light', () => {
    mockMatchMedia(false);
    window.localStorage.setItem('robo-theme:mode', 'system');

    applyRoboThemeAttributes(DEFAULT_CONFIG);

    expect(document.documentElement.dataset.mode).toBe('light');
  });

  it('falls back to the configured defaults when nothing is stored', () => {
    applyRoboThemeAttributes({
      storageKey: 'robo-theme',
      defaultTheme: 'aurora',
      fallbackMode: 'light',
    });

    expect(document.documentElement.dataset.theme).toBe('aurora');
    expect(document.documentElement.dataset.mode).toBe('light');
  });

  it('ignores unrecognised stored values rather than applying them', () => {
    window.localStorage.setItem('robo-theme:theme', 'chartreuse');
    window.localStorage.setItem('robo-theme:mode', 'sideways');

    applyRoboThemeAttributes({
      storageKey: 'robo-theme',
      defaultTheme: 'sol',
      fallbackMode: 'dark',
    });

    expect(document.documentElement.dataset.theme).toBe('sol');
    expect(document.documentElement.dataset.mode).toBe('dark');
  });

  it('reads the configured storageKey', () => {
    window.localStorage.setItem('robo-color-theme:mode', 'light');

    applyRoboThemeAttributes({ ...DEFAULT_CONFIG, storageKey: 'robo-color-theme' });

    expect(document.documentElement.dataset.mode).toBe('light');
  });

  it('does not throw when storage is unavailable', () => {
    const getItem = vi.spyOn(window.localStorage, 'getItem').mockImplementation(() => {
      throw new Error('SecurityError: storage is disabled');
    });

    // A blocking script that throws is a blank page, not a mis-themed one.
    expect(() => applyRoboThemeAttributes(DEFAULT_CONFIG)).not.toThrow();

    getItem.mockRestore();
  });

  it('does not throw when matchMedia is unavailable and the preference is system', () => {
    window.localStorage.setItem('robo-theme:mode', 'system');
    // jsdom leaves matchMedia undefined, which is also true of some embedded webviews.
    expect(() => applyRoboThemeAttributes(DEFAULT_CONFIG)).not.toThrow();
  });
});

describe('getRoboThemeScript', () => {
  it('serializes the tested function together with its resolved config', () => {
    const source = getRoboThemeScript({ storageKey: 'robo-color-theme', defaultMode: 'system' });

    expect(source.startsWith('(')).toBe(true);
    expect(source).toContain('data-mode');
    // The config is the only interpolated part, and it arrives JSON-encoded.
    expect(source).toContain(
      JSON.stringify({
        storageKey: 'robo-color-theme',
        defaultTheme: 'midnight',
        fallbackMode: 'system',
      })
    );
  });

  it("derives fallbackMode from the palette when defaultMode is omitted", () => {
    // Aurora is a light-first palette; Midnight is dark-first.
    expect(getRoboThemeScript({ defaultTheme: 'aurora' })).toContain('"fallbackMode":"light"');
    expect(getRoboThemeScript({ defaultTheme: 'midnight' })).toContain('"fallbackMode":"dark"');
  });

  it('is self-contained — the serialized body references no outer bindings', () => {
    /*
     * The guard for the rule documented on applyRoboThemeAttributes. If someone adds an import or
     * a module constant to that function, TypeScript compiles it happily and the browser then
     * throws ReferenceError in a blocking script — a blank page before first paint. The only
     * identifiers the body may reach for are true globals and its own `config` argument.
     */
    const body = getRoboThemeScript();

    expect(body).not.toMatch(/PREFERS_DARK_QUERY|THEME_DEFAULT_MODE|isMode|isTheme/);
    // A downlevelling helper would show up as one of these.
    expect(body).not.toMatch(/__[a-zA-Z]*(assign|spread|awaiter|rest|importDefault)/);
  });

  describe('option validation', () => {
    // storageKey is the only option that is not a closed union, so it is the only one that could
    // carry arbitrary text into a <script> body. Rejecting is safer than escaping.
    it.each([
      ["'+alert(1)+'", 'quote break-out'],
      ['</script><script>alert(1)//', 'script tag break-out'],
      ['key with spaces', 'disallowed characters'],
      ['', 'empty'],
    ])('rejects a storageKey with %s', (storageKey) => {
      expect(() => getRoboThemeScript({ storageKey })).toThrow(/storageKey must match/);
    });

    it('rejects an unknown defaultTheme', () => {
      expect(() => getRoboThemeScript({ defaultTheme: 'chartreuse' as never })).toThrow(
        /unknown defaultTheme/
      );
    });

    it('rejects an unknown defaultMode', () => {
      expect(() => getRoboThemeScript({ defaultMode: 'sideways' as never })).toThrow(
        /unknown defaultMode/
      );
    });

    it('accepts a namespaced storageKey', () => {
      expect(() => getRoboThemeScript({ storageKey: 'robo-color-theme' })).not.toThrow();
    });
  });
});
