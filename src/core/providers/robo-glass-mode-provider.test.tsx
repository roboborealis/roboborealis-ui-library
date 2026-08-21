import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RoboGlassModeProvider, useGlassMode } from './robo-glass-mode-provider';
import type { StorageAdapter } from '../storage-adapter';

function GlassModeDisplay() {
  const { glassMode, setGlassMode } = useGlassMode();
  return (
    <div>
      <span data-testid='glass-mode-value'>{String(glassMode)}</span>
      <button onClick={() => setGlassMode(true)}>Turn On</button>
      <button onClick={() => setGlassMode(false)}>Turn Off</button>
    </div>
  );
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

describe('RoboGlassModeProvider', () => {
  afterEach(() => {
    delete document.documentElement.dataset.glassMode;
  });

  it('renders children', () => {
    render(
      <RoboGlassModeProvider>
        <span>hello</span>
      </RoboGlassModeProvider>
    );
    expect(screen.getByText('hello')).toBeInTheDocument();
  });

  it('sets data-glass-mode="off" on documentElement by default', () => {
    render(
      <RoboGlassModeProvider>
        <GlassModeDisplay />
      </RoboGlassModeProvider>
    );
    expect(document.documentElement.dataset.glassMode).toBe('off');
    expect(screen.getByTestId('glass-mode-value')).toHaveTextContent('false');
  });

  it('uses a custom defaultGlassMode when no storageAdapter value exists', () => {
    render(
      <RoboGlassModeProvider defaultGlassMode>
        <GlassModeDisplay />
      </RoboGlassModeProvider>
    );
    expect(document.documentElement.dataset.glassMode).toBe('on');
    expect(screen.getByTestId('glass-mode-value')).toHaveTextContent('true');
  });

  it('reads initial glassMode from storageAdapter when provided', () => {
    const adapter = makeMockAdapter({ 'robo-glass-mode': 'true' });
    render(
      <RoboGlassModeProvider storageAdapter={adapter}>
        <GlassModeDisplay />
      </RoboGlassModeProvider>
    );
    expect(adapter.get).toHaveBeenCalledWith('robo-glass-mode');
    expect(screen.getByTestId('glass-mode-value')).toHaveTextContent('true');
    expect(document.documentElement.dataset.glassMode).toBe('on');
  });

  it('setGlassMode() updates documentElement.dataset.glassMode', async () => {
    render(
      <RoboGlassModeProvider>
        <GlassModeDisplay />
      </RoboGlassModeProvider>
    );
    await userEvent.click(screen.getByText('Turn On'));
    expect(document.documentElement.dataset.glassMode).toBe('on');
    expect(screen.getByTestId('glass-mode-value')).toHaveTextContent('true');
  });

  it('setGlassMode() persists to storageAdapter when provided', async () => {
    const adapter = makeMockAdapter();
    render(
      <RoboGlassModeProvider storageAdapter={adapter}>
        <GlassModeDisplay />
      </RoboGlassModeProvider>
    );
    await userEvent.click(screen.getByText('Turn On'));
    expect(adapter.set).toHaveBeenCalledWith('robo-glass-mode', 'true');
  });

  it('uses custom storageKey when provided', async () => {
    const adapter = makeMockAdapter();
    render(
      <RoboGlassModeProvider storageAdapter={adapter} storageKey='my-glass-mode'>
        <GlassModeDisplay />
      </RoboGlassModeProvider>
    );
    await userEvent.click(screen.getByText('Turn On'));
    expect(adapter.set).toHaveBeenCalledWith('my-glass-mode', 'true');
  });

  it('defaults storageAdapter to persistent localStorage-backed storage when omitted', async () => {
    window.localStorage.clear();
    const { unmount } = render(
      <RoboGlassModeProvider>
        <GlassModeDisplay />
      </RoboGlassModeProvider>
    );
    await userEvent.click(screen.getByText('Turn On'));
    expect(window.localStorage.getItem('robo-glass-mode')).toBe('true');
    unmount();

    render(
      <RoboGlassModeProvider>
        <GlassModeDisplay />
      </RoboGlassModeProvider>
    );
    expect(screen.getByTestId('glass-mode-value')).toHaveTextContent('true');
    window.localStorage.clear();
  });

  it('useGlassMode() does NOT throw outside RoboGlassModeProvider — returns a safe fallback', () => {
    function StandaloneReader() {
      const { glassMode } = useGlassMode();
      return <span data-testid='standalone'>{String(glassMode)}</span>;
    }
    expect(() => render(<StandaloneReader />)).not.toThrow();
    expect(screen.getByTestId('standalone')).toHaveTextContent('false');
  });

  it('useGlassMode()\'s fallback setGlassMode is a harmless no-op outside a provider', () => {
    function StandaloneSetter() {
      const { setGlassMode } = useGlassMode();
      return <button onClick={() => setGlassMode(true)}>Set</button>;
    }
    render(<StandaloneSetter />);
    expect(async () => {
      await userEvent.click(screen.getByText('Set'));
    }).not.toThrow();
  });
});

describe('RoboGlassModeProvider applyTo', () => {
  function GlassModeAttrs() {
    const { glassModeAttributes } = useGlassMode();
    return <span data-testid='attrs'>{JSON.stringify(glassModeAttributes)}</span>;
  }

  afterEach(() => {
    delete document.documentElement.dataset.glassMode;
  });

  it("writes nothing to documentElement when applyTo is 'none'", async () => {
    render(
      <RoboGlassModeProvider applyTo='none' storageAdapter={makeMockAdapter()}>
        <GlassModeDisplay />
      </RoboGlassModeProvider>
    );
    expect(document.documentElement.dataset.glassMode).toBeUndefined();

    await userEvent.click(screen.getByText('Turn On'));
    expect(document.documentElement.dataset.glassMode).toBeUndefined();
    expect(screen.getByTestId('glass-mode-value')).toHaveTextContent('true');
  });

  it('exposes glassModeAttributes for the consumer to spread', () => {
    render(
      <RoboGlassModeProvider applyTo='none' storageAdapter={makeMockAdapter({ 'robo-glass-mode': 'true' })}>
        <GlassModeAttrs />
      </RoboGlassModeProvider>
    );
    expect(screen.getByTestId('attrs')).toHaveTextContent(
      JSON.stringify({ 'data-glass-mode': 'on' })
    );
  });

  it("does not adopt an existing data-glass-mode when applyTo is 'none'", () => {
    document.documentElement.dataset.glassMode = 'on';
    render(
      <RoboGlassModeProvider applyTo='none' storageAdapter={makeMockAdapter()} defaultGlassMode={false}>
        <GlassModeDisplay />
      </RoboGlassModeProvider>
    );
    expect(screen.getByTestId('glass-mode-value')).toHaveTextContent('false');
  });

  it('seeds from initial when the storage adapter is inert', () => {
    render(
      <RoboGlassModeProvider applyTo='none' storageAdapter={makeMockAdapter()} initial>
        <GlassModeDisplay />
      </RoboGlassModeProvider>
    );
    expect(screen.getByTestId('glass-mode-value')).toHaveTextContent('true');
  });

  it('still returns the noop fallback attributes with no provider mounted', () => {
    // useGlassMode deliberately does not throw — map overlay panels call it standalone.
    render(<GlassModeAttrs />);
    expect(screen.getByTestId('attrs')).toHaveTextContent(
      JSON.stringify({ 'data-glass-mode': 'off' })
    );
  });
});
