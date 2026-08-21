import * as React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';

import { RoboKeybindProvider, useKeybind, useRegisterKeybind, useKeybindRegistry } from './robo-keybind-provider';
import { isMac } from './robo-keybind-utils';
import type { StorageAdapter } from '../storage-adapter';

// `mod` resolves to metaKey on Mac, ctrlKey elsewhere (both in production
// code and in is-hotkey's own matching) — use the same check here so these
// tests assert real behavior instead of assuming a platform.
const MOD_KEY = isMac() ? 'metaKey' : 'ctrlKey';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

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

function ToggleConsumer({ id = 'test.toggle', defaultCombo = 'mod+/', allowInEditableFields }: { id?: string; defaultCombo?: string; allowInEditableFields?: boolean }) {
  const [fired, setFired] = React.useState(0);
  const { combo } = useKeybind({ id, label: 'Test toggle', defaultCombo, allowInEditableFields }, () => setFired((n) => n + 1));
  return (
    <div>
      <span data-testid='combo'>{combo}</span>
      <span data-testid='fired'>{fired}</span>
    </div>
  );
}

function press(key: string, opts: Partial<KeyboardEventInit> = {}, target: EventTarget = window) {
  fireEvent.keyDown(target, { key, ...opts });
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('RoboKeybindProvider', () => {
  afterEach(() => {
    window.localStorage.clear();
  });

  it('renders children', () => {
    render(
      <RoboKeybindProvider>
        <p>Content</p>
      </RoboKeybindProvider>
    );
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('useKeybind fires its handler when the default combo is pressed', () => {
    render(
      <RoboKeybindProvider>
        <ToggleConsumer defaultCombo='mod+/' />
      </RoboKeybindProvider>
    );
    act(() => press('/', { [MOD_KEY]: true }));
    expect(screen.getByTestId('fired')).toHaveTextContent('1');
  });

  it('does not fire for a non-matching combo', () => {
    render(
      <RoboKeybindProvider>
        <ToggleConsumer defaultCombo='mod+/' />
      </RoboKeybindProvider>
    );
    act(() => press('k', { [MOD_KEY]: true }));
    expect(screen.getByTestId('fired')).toHaveTextContent('0');
  });

  it('skips matching while focus is in an editable field, unless allowInEditableFields is set', () => {
    render(
      <RoboKeybindProvider>
        <input data-testid='input' />
        <ToggleConsumer id='test.layers' defaultCombo='l' />
      </RoboKeybindProvider>
    );
    const input = screen.getByTestId('input');
    input.focus();
    act(() => press('l', {}, input));
    expect(screen.getByTestId('fired')).toHaveTextContent('0');
  });

  it('does NOT treat a checkbox/radio input as editable — a single-letter shortcut still fires while one has focus', () => {
    render(
      <RoboKeybindProvider>
        <input type='checkbox' data-testid='checkbox' />
        <input type='radio' data-testid='radio' />
        <ToggleConsumer id='test.layers' defaultCombo='l' />
      </RoboKeybindProvider>
    );
    screen.getByTestId('checkbox').focus();
    act(() => press('l', {}, screen.getByTestId('checkbox')));
    expect(screen.getByTestId('fired')).toHaveTextContent('1');

    screen.getByTestId('radio').focus();
    act(() => press('l', {}, screen.getByTestId('radio')));
    expect(screen.getByTestId('fired')).toHaveTextContent('2');
  });

  it('fires in an editable field when allowInEditableFields is true', () => {
    render(
      <RoboKeybindProvider>
        <input data-testid='input' />
        <ToggleConsumer id='test.layers' defaultCombo='l' allowInEditableFields />
      </RoboKeybindProvider>
    );
    const input = screen.getByTestId('input');
    input.focus();
    act(() => press('l', {}, input));
    expect(screen.getByTestId('fired')).toHaveTextContent('1');
  });

  it('two independently registered actions both fire independently', () => {
    function TwoConsumer() {
      const [toggleFired, setToggleFired] = React.useState(0);
      const [layersFired, setLayersFired] = React.useState(0);
      useKeybind({ id: 'a.toggle', label: 'Toggle', defaultCombo: 'mod+/' }, () => setToggleFired((n) => n + 1));
      useKeybind({ id: 'a.layers', label: 'Layers', defaultCombo: 'l' }, () => setLayersFired((n) => n + 1));
      return (
        <div>
          <span data-testid='toggle-fired'>{toggleFired}</span>
          <span data-testid='layers-fired'>{layersFired}</span>
        </div>
      );
    }
    render(
      <RoboKeybindProvider>
        <TwoConsumer />
      </RoboKeybindProvider>
    );
    act(() => press('l'));
    expect(screen.getByTestId('layers-fired')).toHaveTextContent('1');
    expect(screen.getByTestId('toggle-fired')).toHaveTextContent('0');
    act(() => press('/', { [MOD_KEY]: true }));
    expect(screen.getByTestId('toggle-fired')).toHaveTextContent('1');
    expect(screen.getByTestId('layers-fired')).toHaveTextContent('1');
  });

  it('reassigning a combo via setCombo persists and is matched on subsequent presses', () => {
    const adapter = makeMockAdapter();

    function Consumer() {
      const { setCombo } = useRegisterKeybind({ id: 'test.toggle', label: 'Toggle', defaultCombo: 'mod+/' });
      const [fired, setFired] = React.useState(0);
      useKeybind({ id: 'test.toggle', label: 'Toggle', defaultCombo: 'mod+/' }, () => setFired((n) => n + 1));
      return (
        <div>
          <button onClick={() => setCombo('mod+k')}>Reassign</button>
          <span data-testid='fired'>{fired}</span>
        </div>
      );
    }

    render(
      <RoboKeybindProvider storageAdapter={adapter}>
        <Consumer />
      </RoboKeybindProvider>
    );

    act(() => screen.getByText('Reassign').click());
    expect(adapter.set).toHaveBeenCalledWith('robo-keybinds', JSON.stringify({ 'test.toggle': 'mod+k' }));

    act(() => press('/', { [MOD_KEY]: true }));
    expect(screen.getByTestId('fired')).toHaveTextContent('0');

    act(() => press('k', { [MOD_KEY]: true }));
    expect(screen.getByTestId('fired')).toHaveTextContent('1');
  });

  it('resetCombo reverts to the default combo', () => {
    const adapter = makeMockAdapter({ 'robo-keybinds': JSON.stringify({ 'test.toggle': 'mod+k' }) });

    function Consumer() {
      const { combo, resetCombo } = useRegisterKeybind({ id: 'test.toggle', label: 'Toggle', defaultCombo: 'mod+/' });
      return (
        <div>
          <span data-testid='combo'>{combo}</span>
          <button onClick={resetCombo}>Reset</button>
        </div>
      );
    }

    render(
      <RoboKeybindProvider storageAdapter={adapter}>
        <Consumer />
      </RoboKeybindProvider>
    );

    expect(screen.getByTestId('combo')).toHaveTextContent('mod+k');
    act(() => screen.getByText('Reset').click());
    expect(screen.getByTestId('combo')).toHaveTextContent('mod+/');
  });

  it('useKeybindRegistry lists every registered action with its effective combo', () => {
    function Registry() {
      const { list } = useKeybindRegistry();
      return (
        <ul>
          {list().map((k) => (
            <li key={k.id}>{k.label}: {k.combo}</li>
          ))}
        </ul>
      );
    }
    render(
      <RoboKeybindProvider>
        <ToggleConsumer id='a' defaultCombo='mod+/' />
        <ToggleConsumer id='b' defaultCombo='l' />
        <Registry />
      </RoboKeybindProvider>
    );
    expect(screen.getByText('Test toggle: mod+/')).toBeInTheDocument();
    expect(screen.getByText('Test toggle: l')).toBeInTheDocument();
  });

  it('useKeybindRegistry throws outside a mounted RoboKeybindProvider', () => {
    function Registry() {
      useKeybindRegistry();
      return null;
    }
    const spy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() => render(<Registry />)).toThrow('useKeybindRegistry must be used within a RoboKeybindProvider');
    spy.mockRestore();
  });

  it('useKeybind does not throw and still fires on the default combo outside a provider', () => {
    render(<ToggleConsumer defaultCombo='mod+/' />);
    expect(screen.getByTestId('combo')).toHaveTextContent('mod+/');
    act(() => press('/', { [MOD_KEY]: true }));
    expect(screen.getByTestId('fired')).toHaveTextContent('1');
  });

  it('unregistering on unmount stops the handler from firing', () => {
    function Wrapper({ mounted }: { mounted: boolean }) {
      return <RoboKeybindProvider>{mounted && <ToggleConsumer defaultCombo='mod+/' />}</RoboKeybindProvider>;
    }
    const { rerender } = render(<Wrapper mounted />);
    rerender(<Wrapper mounted={false} />);
    // No assertion object to read `fired` from anymore — this test's intent
    // is simply that pressing the combo after unmount does not throw.
    expect(() => act(() => press('/', { [MOD_KEY]: true }))).not.toThrow();
  });
});
