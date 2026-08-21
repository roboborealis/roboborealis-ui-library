import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RoboDensityProvider, useDensity } from './robo-density-provider';
import type { StorageAdapter } from '../storage-adapter';

// Helper component that reads the density context
function DensityDisplay() {
  const { density, setDensity } = useDensity();
  return (
    <div>
      <span data-testid='density-value'>{density}</span>
      <button onClick={() => setDensity('compact')}>Set Compact</button>
      <button onClick={() => setDensity('comfortable')}>Set Comfortable</button>
      <button onClick={() => setDensity('spacious')}>Set Spacious</button>
    </div>
  );
}

function ThrowingComponent() {
  useDensity();
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

describe('RoboDensityProvider', () => {
  afterEach(() => {
    // Clean up data-density on documentElement between tests
    delete document.documentElement.dataset.density;
  });

  it('renders children', () => {
    render(
      <RoboDensityProvider>
        <span>hello</span>
      </RoboDensityProvider>
    );
    expect(screen.getByText('hello')).toBeInTheDocument();
  });

  it('sets data-density="comfortable" on documentElement by default', () => {
    render(
      <RoboDensityProvider>
        <DensityDisplay />
      </RoboDensityProvider>
    );
    expect(document.documentElement.dataset.density).toBe('comfortable');
  });

  it('uses a custom defaultDensity when no storageAdapter value exists', () => {
    render(
      <RoboDensityProvider defaultDensity='spacious'>
        <DensityDisplay />
      </RoboDensityProvider>
    );
    expect(document.documentElement.dataset.density).toBe('spacious');
    expect(screen.getByTestId('density-value')).toHaveTextContent('spacious');
  });

  it('reads initial density from storageAdapter when provided', () => {
    const adapter = makeMockAdapter({ 'robo-density': 'compact' });
    render(
      <RoboDensityProvider storageAdapter={adapter}>
        <DensityDisplay />
      </RoboDensityProvider>
    );
    expect(adapter.get).toHaveBeenCalledWith('robo-density');
    expect(screen.getByTestId('density-value')).toHaveTextContent('compact');
    expect(document.documentElement.dataset.density).toBe('compact');
  });

  it('setDensity() updates documentElement.dataset.density', async () => {
    render(
      <RoboDensityProvider>
        <DensityDisplay />
      </RoboDensityProvider>
    );
    await userEvent.click(screen.getByText('Set Spacious'));
    expect(document.documentElement.dataset.density).toBe('spacious');
    expect(screen.getByTestId('density-value')).toHaveTextContent('spacious');
  });

  it('setDensity() persists to storageAdapter when provided', async () => {
    const adapter = makeMockAdapter();
    render(
      <RoboDensityProvider storageAdapter={adapter}>
        <DensityDisplay />
      </RoboDensityProvider>
    );
    await userEvent.click(screen.getByText('Set Compact'));
    expect(adapter.set).toHaveBeenCalledWith('robo-density', 'compact');
  });

  it('falls back to defaultDensity when storageAdapter.get returns null', () => {
    const adapter = makeMockAdapter(); // empty store — get returns null
    render(
      <RoboDensityProvider defaultDensity='spacious' storageAdapter={adapter}>
        <DensityDisplay />
      </RoboDensityProvider>
    );
    expect(screen.getByTestId('density-value')).toHaveTextContent('spacious');
  });

  it('respects a pre-existing data-density on documentElement over defaultDensity', () => {
    document.documentElement.dataset.density = 'spacious';

    render(
      <RoboDensityProvider>
        <DensityDisplay />
      </RoboDensityProvider>
    );

    expect(screen.getByTestId('density-value')).toHaveTextContent('spacious');
  });

  it('prefers a pre-existing data-density over a stored value', () => {
    document.documentElement.dataset.density = 'spacious';
    const adapter = makeMockAdapter({ 'robo-density': 'compact' });

    render(
      <RoboDensityProvider storageAdapter={adapter}>
        <DensityDisplay />
      </RoboDensityProvider>
    );

    expect(screen.getByTestId('density-value')).toHaveTextContent('spacious');
  });

  it('useDensity() throws when called outside RoboDensityProvider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() => render(<ThrowingComponent />)).toThrow(
      'useDensity must be used within RoboDensityProvider'
    );
    spy.mockRestore();
  });

  it('uses custom storageKey when provided', async () => {
    const adapter = makeMockAdapter();
    render(
      <RoboDensityProvider storageAdapter={adapter} storageKey='my-density'>
        <DensityDisplay />
      </RoboDensityProvider>
    );
    await userEvent.click(screen.getByText('Set Compact'));
    expect(adapter.set).toHaveBeenCalledWith('my-density', 'compact');
  });

  it('defaults storageAdapter to persistent localStorage-backed storage when omitted', async () => {
    window.localStorage.clear();
    const { unmount } = render(
      <RoboDensityProvider>
        <DensityDisplay />
      </RoboDensityProvider>
    );
    await userEvent.click(screen.getByText('Set Compact'));
    expect(window.localStorage.getItem('robo-density')).toBe('compact');
    unmount();

    render(
      <RoboDensityProvider>
        <DensityDisplay />
      </RoboDensityProvider>
    );
    expect(screen.getByTestId('density-value')).toHaveTextContent('compact');
    window.localStorage.clear();
  });
});

describe('RoboDensityProvider applyTo', () => {
  function DensityAttrs() {
    const { densityAttributes } = useDensity();
    return <span data-testid='attrs'>{JSON.stringify(densityAttributes)}</span>;
  }

  afterEach(() => {
    delete document.documentElement.dataset.density;
  });

  it("writes nothing to documentElement when applyTo is 'none'", async () => {
    render(
      <RoboDensityProvider applyTo='none' storageAdapter={makeMockAdapter()}>
        <DensityDisplay />
      </RoboDensityProvider>
    );
    expect(document.documentElement.dataset.density).toBeUndefined();

    await userEvent.click(screen.getByText('Set Compact'));
    expect(document.documentElement.dataset.density).toBeUndefined();
    expect(screen.getByTestId('density-value')).toHaveTextContent('compact');
  });

  it('exposes densityAttributes for the consumer to spread', () => {
    render(
      <RoboDensityProvider applyTo='none' storageAdapter={makeMockAdapter({ 'robo-density': 'spacious' })}>
        <DensityAttrs />
      </RoboDensityProvider>
    );
    expect(screen.getByTestId('attrs')).toHaveTextContent(
      JSON.stringify({ 'data-density': 'spacious' })
    );
  });

  it("does not adopt an existing data-density when applyTo is 'none'", () => {
    // That attribute belongs to whoever owns <html> — a scoped provider reading it would be
    // picking up another app's state.
    document.documentElement.dataset.density = 'compact';
    render(
      <RoboDensityProvider applyTo='none' storageAdapter={makeMockAdapter()} defaultDensity='spacious'>
        <DensityDisplay />
      </RoboDensityProvider>
    );
    expect(screen.getByTestId('density-value')).toHaveTextContent('spacious');
  });

  it('seeds from initial when the storage adapter is inert', () => {
    render(
      <RoboDensityProvider applyTo='none' storageAdapter={makeMockAdapter()} initial='compact'>
        <DensityDisplay />
      </RoboDensityProvider>
    );
    expect(screen.getByTestId('density-value')).toHaveTextContent('compact');
  });
});
