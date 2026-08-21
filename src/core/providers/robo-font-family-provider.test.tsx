import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RoboFontFamilyProvider, useFontFamily } from './robo-font-family-provider';
import type { StorageAdapter } from '../storage-adapter';

// Helper component that reads the font-family context
function FontFamilyDisplay() {
  const { fontFamily, setFontFamily } = useFontFamily();
  return (
    <div>
      <span data-testid='font-family-value'>{fontFamily}</span>
      <button onClick={() => setFontFamily('inter')}>Set Inter</button>
      <button onClick={() => setFontFamily('dm-sans')}>Set DM Sans</button>
      <button onClick={() => setFontFamily('varela')}>Set Varela</button>
      <button onClick={() => setFontFamily('open-sans')}>Set Open Sans</button>
      <button onClick={() => setFontFamily('opendyslexic')}>Set OpenDyslexic</button>
      <button onClick={() => setFontFamily('sora')}>Set Sora</button>
    </div>
  );
}

function ThrowingComponent() {
  useFontFamily();
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

describe('RoboFontFamilyProvider', () => {
  afterEach(() => {
    // Clean up data-font-family on documentElement between tests
    delete document.documentElement.dataset.fontFamily;
  });

  it('renders children', () => {
    render(
      <RoboFontFamilyProvider>
        <span>hello</span>
      </RoboFontFamilyProvider>
    );
    expect(screen.getByText('hello')).toBeInTheDocument();
  });

  it('sets data-font-family="dm-sans" on documentElement by default', () => {
    render(
      <RoboFontFamilyProvider>
        <FontFamilyDisplay />
      </RoboFontFamilyProvider>
    );
    expect(document.documentElement.dataset.fontFamily).toBe('dm-sans');
  });

  it('uses a custom defaultFontFamily when no storageAdapter value exists', () => {
    render(
      <RoboFontFamilyProvider defaultFontFamily='opendyslexic'>
        <FontFamilyDisplay />
      </RoboFontFamilyProvider>
    );
    expect(document.documentElement.dataset.fontFamily).toBe('opendyslexic');
    expect(screen.getByTestId('font-family-value')).toHaveTextContent('opendyslexic');
  });

  it('reads initial font family from storageAdapter when provided', () => {
    const adapter = makeMockAdapter({ 'robo-font-family': 'inter' });
    render(
      <RoboFontFamilyProvider storageAdapter={adapter}>
        <FontFamilyDisplay />
      </RoboFontFamilyProvider>
    );
    expect(adapter.get).toHaveBeenCalledWith('robo-font-family');
    expect(screen.getByTestId('font-family-value')).toHaveTextContent('inter');
    expect(document.documentElement.dataset.fontFamily).toBe('inter');
  });

  it('setFontFamily() updates documentElement.dataset.fontFamily', async () => {
    render(
      <RoboFontFamilyProvider>
        <FontFamilyDisplay />
      </RoboFontFamilyProvider>
    );
    await userEvent.click(screen.getByText('Set Sora'));
    expect(document.documentElement.dataset.fontFamily).toBe('sora');
    expect(screen.getByTestId('font-family-value')).toHaveTextContent('sora');
  });

  it('setFontFamily() persists to storageAdapter when provided', async () => {
    const adapter = makeMockAdapter();
    render(
      <RoboFontFamilyProvider storageAdapter={adapter}>
        <FontFamilyDisplay />
      </RoboFontFamilyProvider>
    );
    await userEvent.click(screen.getByText('Set Varela'));
    expect(adapter.set).toHaveBeenCalledWith('robo-font-family', 'varela');
  });

  it('falls back to defaultFontFamily when storageAdapter.get returns null', () => {
    const adapter = makeMockAdapter(); // empty store — get returns null
    render(
      <RoboFontFamilyProvider defaultFontFamily='open-sans' storageAdapter={adapter}>
        <FontFamilyDisplay />
      </RoboFontFamilyProvider>
    );
    expect(screen.getByTestId('font-family-value')).toHaveTextContent('open-sans');
  });

  it('useFontFamily() throws when called outside RoboFontFamilyProvider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() => render(<ThrowingComponent />)).toThrow(
      'useFontFamily must be used within RoboFontFamilyProvider'
    );
    spy.mockRestore();
  });

  it('uses custom storageKey when provided', async () => {
    const adapter = makeMockAdapter();
    render(
      <RoboFontFamilyProvider storageAdapter={adapter} storageKey='my-font-family'>
        <FontFamilyDisplay />
      </RoboFontFamilyProvider>
    );
    await userEvent.click(screen.getByText('Set Inter'));
    expect(adapter.set).toHaveBeenCalledWith('my-font-family', 'inter');
  });

  it('defaults storageAdapter to persistent localStorage-backed storage when omitted', async () => {
    window.localStorage.clear();
    const { unmount } = render(
      <RoboFontFamilyProvider>
        <FontFamilyDisplay />
      </RoboFontFamilyProvider>
    );
    await userEvent.click(screen.getByText('Set Inter'));
    expect(window.localStorage.getItem('robo-font-family')).toBe('inter');
    unmount();

    render(
      <RoboFontFamilyProvider>
        <FontFamilyDisplay />
      </RoboFontFamilyProvider>
    );
    expect(screen.getByTestId('font-family-value')).toHaveTextContent('inter');
    window.localStorage.clear();
  });
});

describe('RoboFontFamilyProvider applyTo', () => {
  function FontFamilyAttrs() {
    const { fontFamilyAttributes } = useFontFamily();
    return <span data-testid='attrs'>{JSON.stringify(fontFamilyAttributes)}</span>;
  }

  afterEach(() => {
    delete document.documentElement.dataset.fontFamily;
  });

  it("writes nothing to documentElement when applyTo is 'none'", async () => {
    render(
      <RoboFontFamilyProvider applyTo='none' storageAdapter={makeMockAdapter()}>
        <FontFamilyDisplay />
      </RoboFontFamilyProvider>
    );
    expect(document.documentElement.dataset.fontFamily).toBeUndefined();

    await userEvent.click(screen.getByText('Set Sora'));
    expect(document.documentElement.dataset.fontFamily).toBeUndefined();
    expect(screen.getByTestId('font-family-value')).toHaveTextContent('sora');
  });

  it('exposes fontFamilyAttributes for the consumer to spread', () => {
    render(
      <RoboFontFamilyProvider
        applyTo='none'
        storageAdapter={makeMockAdapter({ 'robo-font-family': 'varela' })}
      >
        <FontFamilyAttrs />
      </RoboFontFamilyProvider>
    );
    expect(screen.getByTestId('attrs')).toHaveTextContent(
      JSON.stringify({ 'data-font-family': 'varela' })
    );
  });

  it("does not adopt an existing data-font-family when applyTo is 'none'", () => {
    document.documentElement.dataset.fontFamily = 'inter';
    render(
      <RoboFontFamilyProvider
        applyTo='none'
        storageAdapter={makeMockAdapter()}
        defaultFontFamily='sora'
      >
        <FontFamilyDisplay />
      </RoboFontFamilyProvider>
    );
    expect(screen.getByTestId('font-family-value')).toHaveTextContent('sora');
  });

  it('seeds from initial when the storage adapter is inert', () => {
    render(
      <RoboFontFamilyProvider applyTo='none' storageAdapter={makeMockAdapter()} initial='open-sans'>
        <FontFamilyDisplay />
      </RoboFontFamilyProvider>
    );
    expect(screen.getByTestId('font-family-value')).toHaveTextContent('open-sans');
  });
});
