import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  RoboSurfaceStyleProvider,
  useSurfaceStyle,
  SURFACE_STYLES,
} from './robo-surface-style-provider';
import type { SurfaceStyle } from './robo-surface-style-provider';
import type { StorageAdapter } from '../storage-adapter';

function SurfaceStyleDisplay() {
  const { surfaceStyle, setSurfaceStyle } = useSurfaceStyle();
  return (
    <div>
      <span data-testid='surface-style-value'>{surfaceStyle}</span>
      {SURFACE_STYLES.map((s) => (
        <button key={s} onClick={() => setSurfaceStyle(s)}>{`Set ${s}`}</button>
      ))}
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

describe('RoboSurfaceStyleProvider', () => {
  afterEach(() => {
    delete document.documentElement.dataset.surfaceStyle;
  });

  it('renders children', () => {
    render(
      <RoboSurfaceStyleProvider>
        <span>hello</span>
      </RoboSurfaceStyleProvider>
    );
    expect(screen.getByText('hello')).toBeInTheDocument();
  });

  it('sets data-surface-style="flat" on documentElement by default', () => {
    render(
      <RoboSurfaceStyleProvider>
        <SurfaceStyleDisplay />
      </RoboSurfaceStyleProvider>
    );
    expect(document.documentElement.dataset.surfaceStyle).toBe('flat');
    expect(screen.getByTestId('surface-style-value')).toHaveTextContent('flat');
  });

  it('uses a custom defaultSurfaceStyle when no storageAdapter value exists', () => {
    render(
      <RoboSurfaceStyleProvider defaultSurfaceStyle='neumorphism'>
        <SurfaceStyleDisplay />
      </RoboSurfaceStyleProvider>
    );
    expect(document.documentElement.dataset.surfaceStyle).toBe('neumorphism');
    expect(screen.getByTestId('surface-style-value')).toHaveTextContent('neumorphism');
  });

  it('reads initial surface style from storageAdapter when provided', () => {
    const adapter = makeMockAdapter({ 'robo-surface-style': 'glass' });
    render(
      <RoboSurfaceStyleProvider storageAdapter={adapter}>
        <SurfaceStyleDisplay />
      </RoboSurfaceStyleProvider>
    );
    expect(adapter.get).toHaveBeenCalledWith('robo-surface-style');
    expect(screen.getByTestId('surface-style-value')).toHaveTextContent('glass');
    expect(document.documentElement.dataset.surfaceStyle).toBe('glass');
  });

  it('ignores an unknown stored value and falls back to the default', () => {
    const adapter = makeMockAdapter({ 'robo-surface-style': 'bogus' });
    render(
      <RoboSurfaceStyleProvider storageAdapter={adapter}>
        <SurfaceStyleDisplay />
      </RoboSurfaceStyleProvider>
    );
    expect(screen.getByTestId('surface-style-value')).toHaveTextContent('flat');
  });

  it.each(SURFACE_STYLES)('setSurfaceStyle(%s) updates documentElement.dataset', async (style) => {
    render(
      <RoboSurfaceStyleProvider>
        <SurfaceStyleDisplay />
      </RoboSurfaceStyleProvider>
    );
    await userEvent.click(screen.getByText(`Set ${style}`));
    expect(document.documentElement.dataset.surfaceStyle).toBe(style);
    expect(screen.getByTestId('surface-style-value')).toHaveTextContent(style);
  });

  it('setSurfaceStyle() persists to storageAdapter when provided', async () => {
    const adapter = makeMockAdapter();
    render(
      <RoboSurfaceStyleProvider storageAdapter={adapter}>
        <SurfaceStyleDisplay />
      </RoboSurfaceStyleProvider>
    );
    await userEvent.click(screen.getByText('Set glass'));
    expect(adapter.set).toHaveBeenCalledWith('robo-surface-style', 'glass');
  });

  it('uses custom storageKey when provided', async () => {
    const adapter = makeMockAdapter();
    render(
      <RoboSurfaceStyleProvider storageAdapter={adapter} storageKey='my-surface'>
        <SurfaceStyleDisplay />
      </RoboSurfaceStyleProvider>
    );
    await userEvent.click(screen.getByText('Set neumorphism'));
    expect(adapter.set).toHaveBeenCalledWith('my-surface', 'neumorphism');
  });

  it('useSurfaceStyle() does NOT throw outside a provider — returns a safe fallback', () => {
    function StandaloneReader() {
      const { surfaceStyle } = useSurfaceStyle();
      return <span data-testid='standalone'>{surfaceStyle}</span>;
    }
    expect(() => render(<StandaloneReader />)).not.toThrow();
    expect(screen.getByTestId('standalone')).toHaveTextContent('flat');
  });
});

describe('RoboSurfaceStyleProvider applyTo', () => {
  function SurfaceStyleAttrs() {
    const { surfaceStyleAttributes } = useSurfaceStyle();
    return <span data-testid='attrs'>{JSON.stringify(surfaceStyleAttributes)}</span>;
  }

  afterEach(() => {
    delete document.documentElement.dataset.surfaceStyle;
  });

  it("writes nothing to documentElement when applyTo is 'none'", async () => {
    render(
      <RoboSurfaceStyleProvider applyTo='none' storageAdapter={makeMockAdapter()}>
        <SurfaceStyleDisplay />
      </RoboSurfaceStyleProvider>
    );
    expect(document.documentElement.dataset.surfaceStyle).toBeUndefined();

    await userEvent.click(screen.getByText('Set glass'));
    expect(document.documentElement.dataset.surfaceStyle).toBeUndefined();
    expect(screen.getByTestId('surface-style-value')).toHaveTextContent('glass');
  });

  it('exposes surfaceStyleAttributes for the consumer to spread', () => {
    render(
      <RoboSurfaceStyleProvider
        applyTo='none'
        storageAdapter={makeMockAdapter({ 'robo-surface-style': 'neumorphism' })}
      >
        <SurfaceStyleAttrs />
      </RoboSurfaceStyleProvider>
    );
    expect(screen.getByTestId('attrs')).toHaveTextContent(
      JSON.stringify({ 'data-surface-style': 'neumorphism' })
    );
  });

  it('seeds from initial when the storage adapter is inert', () => {
    render(
      <RoboSurfaceStyleProvider
        applyTo='none'
        storageAdapter={makeMockAdapter()}
        initial={'glass' as SurfaceStyle}
      >
        <SurfaceStyleDisplay />
      </RoboSurfaceStyleProvider>
    );
    expect(screen.getByTestId('surface-style-value')).toHaveTextContent('glass');
  });

  it('still returns the noop fallback attributes with no provider mounted', () => {
    render(<SurfaceStyleAttrs />);
    expect(screen.getByTestId('attrs')).toHaveTextContent(
      JSON.stringify({ 'data-surface-style': 'flat' })
    );
  });
});
