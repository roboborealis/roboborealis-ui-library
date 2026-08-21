import * as React from 'react';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RoboThemeProvider, useTheme } from './robo-theme-provider';
import type { StorageAdapter } from '../storage-adapter';

function ThemeDisplay() {
  const { theme, mode, resolvedMode, setTheme, setMode, themeAttributes } = useTheme();
  return (
    <div>
      <span data-testid='theme-value'>{theme}</span>
      <span data-testid='mode-value'>{mode}</span>
      <span data-testid='resolved-mode-value'>{resolvedMode}</span>
      <span data-testid='attrs'>{JSON.stringify(themeAttributes)}</span>
      <button onClick={() => setTheme('aurora')}>Set Aurora</button>
      <button onClick={() => setTheme('midnight')}>Set Midnight</button>
      <button onClick={() => setMode('light')}>Set Light</button>
      <button onClick={() => setMode('dark')}>Set Dark</button>
      <button onClick={() => setMode('system')}>Set System</button>
    </div>
  );
}

/**
 * jsdom does not implement `matchMedia`, so it is undefined unless a test installs this. That is
 * also why the pre-existing tests below never see `system` behaviour: with no `matchMedia`,
 * `prefersDark()` returns false and nothing subscribes.
 *
 * Returns an `emit` so a test can simulate the user changing their OS appearance mid-session.
 */
function mockMatchMedia(matches: boolean) {
  const listeners = new Set<(event: MediaQueryListEvent) => void>();
  const mql = {
    matches,
    addEventListener: vi.fn((_: string, cb: (event: MediaQueryListEvent) => void) => {
      listeners.add(cb);
    }),
    removeEventListener: vi.fn((_: string, cb: (event: MediaQueryListEvent) => void) => {
      listeners.delete(cb);
    }),
  };
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: vi.fn().mockReturnValue(mql),
  });
  return {
    mql,
    listenerCount: () => listeners.size,
    emit(next: boolean) {
      mql.matches = next;
      act(() => {
        listeners.forEach((cb) => cb({ matches: next } as MediaQueryListEvent));
      });
    },
  };
}

function ThrowingComponent() {
  useTheme();
  return null;
}

function makeMockAdapter(initial: Record<string, string> = {}): StorageAdapter {
  const store = { ...initial };
  return {
    get: vi.fn((key: string) => store[key] ?? null),
    set: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    remove: vi.fn((key: string) => {
      delete store[key];
    }),
  };
}

describe('RoboThemeProvider', () => {
  afterEach(() => {
    delete document.documentElement.dataset.theme;
    delete document.documentElement.dataset.mode;
  });

  it('renders children', () => {
    render(
      <RoboThemeProvider storageAdapter={makeMockAdapter()}>
        <span>hello</span>
      </RoboThemeProvider>
    );
    expect(screen.getByText('hello')).toBeInTheDocument();
  });

  it('sets data-theme="midnight" and data-mode="dark" on documentElement by default', () => {
    render(
      <RoboThemeProvider storageAdapter={makeMockAdapter()}>
        <ThemeDisplay />
      </RoboThemeProvider>
    );
    expect(document.documentElement.dataset.theme).toBe('midnight');
    expect(document.documentElement.dataset.mode).toBe('dark');
    expect(screen.getByTestId('theme-value')).toHaveTextContent('midnight');
    expect(screen.getByTestId('mode-value')).toHaveTextContent('dark');
  });

  it('reads initial theme/mode from storageAdapter when provided', () => {
    const adapter = makeMockAdapter({
      'robo-theme:theme': 'aurora',
      'robo-theme:mode': 'light',
    });
    render(
      <RoboThemeProvider storageAdapter={adapter}>
        <ThemeDisplay />
      </RoboThemeProvider>
    );
    expect(screen.getByTestId('theme-value')).toHaveTextContent('aurora');
    expect(screen.getByTestId('mode-value')).toHaveTextContent('light');
    expect(document.documentElement.dataset.theme).toBe('aurora');
    expect(document.documentElement.dataset.mode).toBe('light');
  });

  it('setMode() updates documentElement.dataset.mode', async () => {
    render(
      <RoboThemeProvider storageAdapter={makeMockAdapter()}>
        <ThemeDisplay />
      </RoboThemeProvider>
    );
    await userEvent.click(screen.getByText('Set Light'));
    expect(document.documentElement.dataset.mode).toBe('light');
    expect(screen.getByTestId('mode-value')).toHaveTextContent('light');
  });

  it('setMode() persists to storageAdapter', async () => {
    const adapter = makeMockAdapter();
    render(
      <RoboThemeProvider storageAdapter={adapter}>
        <ThemeDisplay />
      </RoboThemeProvider>
    );
    await userEvent.click(screen.getByText('Set Light'));
    expect(adapter.set).toHaveBeenCalledWith('robo-theme:mode', 'light');
  });

  it('setTheme() switches theme and updates documentElement.dataset.theme', async () => {
    render(
      <RoboThemeProvider storageAdapter={makeMockAdapter()}>
        <ThemeDisplay />
      </RoboThemeProvider>
    );
    expect(screen.getByTestId('theme-value')).toHaveTextContent('midnight');

    await userEvent.click(screen.getByText('Set Aurora'));
    expect(screen.getByTestId('theme-value')).toHaveTextContent('aurora');
    expect(document.documentElement.dataset.theme).toBe('aurora');
  });

  it('setTheme() persists theme to storageAdapter', async () => {
    const adapter = makeMockAdapter();
    render(
      <RoboThemeProvider storageAdapter={adapter}>
        <ThemeDisplay />
      </RoboThemeProvider>
    );
    await userEvent.click(screen.getByText('Set Aurora'));
    expect(adapter.set).toHaveBeenCalledWith('robo-theme:theme', 'aurora');
  });

  it('falls back to defaults when storageAdapter.get returns null', () => {
    const adapter = makeMockAdapter(); // empty — always returns null
    render(
      <RoboThemeProvider storageAdapter={adapter}>
        <ThemeDisplay />
      </RoboThemeProvider>
    );
    expect(screen.getByTestId('theme-value')).toHaveTextContent('midnight');
    expect(screen.getByTestId('mode-value')).toHaveTextContent('dark');
  });

  it('respects a pre-existing data-theme/data-mode on documentElement over defaultTheme/defaultMode', () => {
    // Simulates a consuming app's root layout hardcoding <html data-theme="sol"
    // data-mode="light"> server-side (the documented usage pattern) without also
    // remembering to pass a matching defaultTheme/defaultMode prop.
    document.documentElement.dataset.theme = 'sol';
    document.documentElement.dataset.mode = 'light';

    render(
      <RoboThemeProvider storageAdapter={makeMockAdapter()}>
        <ThemeDisplay />
      </RoboThemeProvider>
    );

    expect(screen.getByTestId('theme-value')).toHaveTextContent('sol');
    expect(screen.getByTestId('mode-value')).toHaveTextContent('light');
  });

  it('prefers a pre-existing data-theme over a stored value', () => {
    document.documentElement.dataset.theme = 'sol';
    const adapter = makeMockAdapter({ 'robo-theme:theme': 'aurora' });

    render(
      <RoboThemeProvider storageAdapter={adapter}>
        <ThemeDisplay />
      </RoboThemeProvider>
    );

    expect(screen.getByTestId('theme-value')).toHaveTextContent('sol');
  });

  it('useTheme() throws when called outside RoboThemeProvider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() => render(<ThrowingComponent />)).toThrow(
      'useTheme must be used within RoboThemeProvider'
    );
    spy.mockRestore();
  });

  it('accepts a custom defaultMode prop', () => {
    render(
      <RoboThemeProvider storageAdapter={makeMockAdapter()} defaultTheme='midnight' defaultMode='light'>
        <ThemeDisplay />
      </RoboThemeProvider>
    );
    expect(screen.getByTestId('mode-value')).toHaveTextContent('light');
    expect(document.documentElement.dataset.mode).toBe('light');
  });

  it('uses custom storageKey when provided', async () => {
    const adapter = makeMockAdapter();
    render(
      <RoboThemeProvider storageAdapter={adapter} storageKey='my-theme'>
        <ThemeDisplay />
      </RoboThemeProvider>
    );
    await userEvent.click(screen.getByText('Set Light'));
    expect(adapter.set).toHaveBeenCalledWith('my-theme:mode', 'light');
  });

  it('defaults storageAdapter to persistent localStorage-backed storage when omitted', async () => {
    window.localStorage.clear();
    const { unmount } = render(
      <RoboThemeProvider>
        <ThemeDisplay />
      </RoboThemeProvider>
    );
    await userEvent.click(screen.getByText('Set Light'));
    expect(window.localStorage.getItem('robo-theme:mode')).toBe('light');
    unmount();

    render(
      <RoboThemeProvider>
        <ThemeDisplay />
      </RoboThemeProvider>
    );
    expect(screen.getByTestId('mode-value')).toHaveTextContent('light');
    window.localStorage.clear();
  });

  describe('system mode', () => {
    afterEach(() => {
      // @ts-expect-error — removing the mock so unrelated tests see jsdom's absent matchMedia
      delete window.matchMedia;
    });

    it('resolves a stored system preference against the OS', () => {
      mockMatchMedia(true);
      render(
        <RoboThemeProvider storageAdapter={makeMockAdapter({ 'robo-theme:mode': 'system' })}>
          <ThemeDisplay />
        </RoboThemeProvider>
      );

      expect(screen.getByTestId('mode-value')).toHaveTextContent('system');
      expect(screen.getByTestId('resolved-mode-value')).toHaveTextContent('dark');
      // data-mode must carry a concrete value — the theme CSS matches only dark/light.
      expect(document.documentElement.dataset.mode).toBe('dark');
    });

    it('follows the OS when it changes while the preference is system', () => {
      const media = mockMatchMedia(false);
      render(
        <RoboThemeProvider storageAdapter={makeMockAdapter({ 'robo-theme:mode': 'system' })}>
          <ThemeDisplay />
        </RoboThemeProvider>
      );
      expect(document.documentElement.dataset.mode).toBe('light');

      media.emit(true);

      expect(screen.getByTestId('resolved-mode-value')).toHaveTextContent('dark');
      expect(document.documentElement.dataset.mode).toBe('dark');
      // The stored preference is untouched — only its resolution changed.
      expect(screen.getByTestId('mode-value')).toHaveTextContent('system');
    });

    it('ignores the OS when the preference is an explicit light or dark', () => {
      const media = mockMatchMedia(false);
      render(
        <RoboThemeProvider storageAdapter={makeMockAdapter({ 'robo-theme:mode': 'dark' })}>
          <ThemeDisplay />
        </RoboThemeProvider>
      );

      // Nothing subscribed, so there is no listener that could overwrite a pinned mode.
      expect(media.listenerCount()).toBe(0);
      media.emit(true);
      expect(document.documentElement.dataset.mode).toBe('dark');
    });

    it('unsubscribes from the OS on unmount and when the preference leaves system', async () => {
      const media = mockMatchMedia(false);
      const { unmount } = render(
        <RoboThemeProvider storageAdapter={makeMockAdapter({ 'robo-theme:mode': 'system' })}>
          <ThemeDisplay />
        </RoboThemeProvider>
      );
      expect(media.listenerCount()).toBe(1);

      await userEvent.click(screen.getByText('Set Dark'));
      expect(media.listenerCount()).toBe(0);

      await userEvent.click(screen.getByText('Set System'));
      expect(media.listenerCount()).toBe(1);

      unmount();
      expect(media.listenerCount()).toBe(0);
    });

    it('persists the preference rather than its resolved value', async () => {
      mockMatchMedia(true);
      const adapter = makeMockAdapter();
      render(
        <RoboThemeProvider storageAdapter={adapter}>
          <ThemeDisplay />
        </RoboThemeProvider>
      );

      await userEvent.click(screen.getByText('Set System'));

      // Storing 'dark' here would quietly demote "follow the OS" to whatever the OS happened
      // to be at the moment of the click.
      expect(adapter.set).toHaveBeenCalledWith('robo-theme:mode', 'system');
      expect(document.documentElement.dataset.mode).toBe('dark');
    });

    it('keeps a stored system preference across a remount, despite a resolved data-mode', () => {
      // The provider's own effect leaves data-mode='light' behind. On remount, reading the DOM
      // before storage would take that as the preference and silently convert system to a hard
      // light — permanently, on the next write. Storage is checked first precisely to stop that.
      mockMatchMedia(false);
      const adapter = makeMockAdapter({ 'robo-theme:mode': 'system' });

      const { unmount } = render(
        <RoboThemeProvider storageAdapter={adapter}>
          <ThemeDisplay />
        </RoboThemeProvider>
      );
      expect(document.documentElement.dataset.mode).toBe('light');
      unmount();

      render(
        <RoboThemeProvider storageAdapter={adapter}>
          <ThemeDisplay />
        </RoboThemeProvider>
      );
      expect(screen.getByTestId('mode-value')).toHaveTextContent('system');
    });

    it("derives the default mode from the theme in use, not the defaultTheme prop", () => {
      // A stored palette outranks defaultTheme, but no mode has ever been chosen. The fallback has
      // to key on the palette that actually won: 'aurora' is light-first, 'midnight' dark-first, so
      // reading the prop here would open an Aurora app in dark for every first-time user.
      const adapter = makeMockAdapter({ 'robo-theme:theme': 'aurora' });

      render(
        <RoboThemeProvider storageAdapter={adapter} defaultTheme='midnight'>
          <ThemeDisplay />
        </RoboThemeProvider>
      );

      expect(screen.getByTestId('theme-value')).toHaveTextContent('aurora');
      expect(screen.getByTestId('resolved-mode-value')).toHaveTextContent('light');
    });

    it('still honours a hardcoded data-mode when nothing is stored', () => {
      // Storage outranks the DOM, but an empty store must not: a consumer declaring
      // <html data-mode="light"> to match the CSS it imported is still the best available answer.
      document.documentElement.dataset.mode = 'light';
      render(
        <RoboThemeProvider storageAdapter={makeMockAdapter()} defaultTheme='midnight'>
          <ThemeDisplay />
        </RoboThemeProvider>
      );
      expect(screen.getByTestId('mode-value')).toHaveTextContent('light');
    });

    it('does not revert data-mode to a stale value when the theme changes', async () => {
      /*
       * Regression test — the bug this whole change exists to kill.
       *
       * The effect writes both data-theme and data-mode, so it re-runs on a theme change. It used
       * to write a `mode` held in state that never tracked the OS, so: OS flips to dark, then the
       * user picks a different palette, and data-mode snapped back to the mode from page load —
       * while Tailwind's `dark` class stayed put. Tailwind and the design tokens then disagreed
       * about which mode the page was in, and nothing repaired it.
       */
      const media = mockMatchMedia(false);
      render(
        <RoboThemeProvider storageAdapter={makeMockAdapter({ 'robo-theme:mode': 'system' })}>
          <ThemeDisplay />
        </RoboThemeProvider>
      );
      expect(document.documentElement.dataset.mode).toBe('light');

      media.emit(true);
      expect(document.documentElement.dataset.mode).toBe('dark');

      await userEvent.click(screen.getByText('Set Aurora'));

      expect(document.documentElement.dataset.theme).toBe('aurora');
      expect(document.documentElement.dataset.mode).toBe('dark');
    });
  });

  describe('applyTo', () => {
    it("writes nothing to documentElement when applyTo is 'none'", () => {
      render(
        <RoboThemeProvider applyTo='none' storageAdapter={makeMockAdapter()}>
          <ThemeDisplay />
        </RoboThemeProvider>
      );

      expect(document.documentElement.dataset.theme).toBeUndefined();
      expect(document.documentElement.dataset.mode).toBeUndefined();
    });

    it("exposes themeAttributes for the consumer to spread when applyTo is 'none'", () => {
      render(
        <RoboThemeProvider
          applyTo='none'
          storageAdapter={makeMockAdapter({ 'robo-theme:theme': 'aurora', 'robo-theme:mode': 'light' })}
        >
          <ThemeDisplay />
        </RoboThemeProvider>
      );

      expect(screen.getByTestId('attrs')).toHaveTextContent(
        JSON.stringify({ 'data-theme': 'aurora', 'data-mode': 'light' })
      );
    });

    it("does not adopt an existing data-theme when applyTo is 'none'", () => {
      // That attribute belongs to whoever owns <html> — another app on the page, or a stale
      // value. A scoped provider reading it would be picking up someone else's state.
      document.documentElement.dataset.theme = 'sol';
      render(
        <RoboThemeProvider applyTo='none' storageAdapter={makeMockAdapter()} defaultTheme='aurora'>
          <ThemeDisplay />
        </RoboThemeProvider>
      );

      expect(screen.getByTestId('theme-value')).toHaveTextContent('aurora');
    });

    it("setTheme and setMode write no DOM when applyTo is 'none'", async () => {
      render(
        <RoboThemeProvider applyTo='none' storageAdapter={makeMockAdapter()}>
          <ThemeDisplay />
        </RoboThemeProvider>
      );

      await userEvent.click(screen.getByText('Set Aurora'));
      await userEvent.click(screen.getByText('Set Light'));

      expect(document.documentElement.dataset.theme).toBeUndefined();
      expect(document.documentElement.dataset.mode).toBeUndefined();
      expect(screen.getByTestId('theme-value')).toHaveTextContent('aurora');
      expect(screen.getByTestId('mode-value')).toHaveTextContent('light');
    });
  });

  describe('initial', () => {
    it('seeds from initial when the storage adapter is inert', () => {
      // Mirrors SSR: every adapter is a noop on the server, so initial is the only source the
      // first server render has. This is what lets a cookie-backed app render the right
      // attributes with no inline script.
      render(
        <RoboThemeProvider
          applyTo='none'
          storageAdapter={makeMockAdapter()}
          initial={{ theme: 'sol', mode: 'light' }}
        >
          <ThemeDisplay />
        </RoboThemeProvider>
      );

      expect(screen.getByTestId('theme-value')).toHaveTextContent('sol');
      expect(screen.getByTestId('mode-value')).toHaveTextContent('light');
    });

    it('lets a stored value outrank initial', () => {
      // After hydration the client adapter can read the cookie itself, and it is the more
      // recent truth — initial is a snapshot from render time.
      render(
        <RoboThemeProvider
          applyTo='none'
          storageAdapter={makeMockAdapter({ 'robo-theme:mode': 'dark' })}
          initial={{ mode: 'light' }}
        >
          <ThemeDisplay />
        </RoboThemeProvider>
      );

      expect(screen.getByTestId('mode-value')).toHaveTextContent('dark');
    });

    it('ignores an unrecognised initial value', () => {
      render(
        <RoboThemeProvider
          applyTo='none'
          storageAdapter={makeMockAdapter()}
          // Cookies are untrusted input — a hand-edited value must not become state.
          initial={{ mode: 'chartreuse' as never }}
          defaultTheme='midnight'
        >
          <ThemeDisplay />
        </RoboThemeProvider>
      );

      expect(screen.getByTestId('mode-value')).toHaveTextContent('dark');
    });
  });
});
