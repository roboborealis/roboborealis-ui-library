import * as React from 'react';
import { render, screen, act } from '@testing-library/react';

import { RoboTourProvider, useTour, useTourRegistry } from './robo-tour-provider';
import type { StorageAdapter } from '../storage-adapter';

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

function TourConsumer({ id = 'test.tour', label = 'Test tour' }: { id?: string; label?: string }) {
  const { completed, complete, onRestart } = useTour({ id, label });
  const [restarted, setRestarted] = React.useState(0);
  React.useEffect(() => onRestart(() => setRestarted((n) => n + 1)), [onRestart]);
  return (
    <div>
      <span data-testid='completed'>{String(completed)}</span>
      <span data-testid='restarted'>{restarted}</span>
      <button onClick={complete}>Complete</button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('RoboTourProvider', () => {
  afterEach(() => {
    window.localStorage.clear();
  });

  it('renders children', () => {
    render(
      <RoboTourProvider>
        <p>Content</p>
      </RoboTourProvider>
    );
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('a newly registered tour starts as not completed', () => {
    render(
      <RoboTourProvider>
        <TourConsumer />
      </RoboTourProvider>
    );
    expect(screen.getByTestId('completed')).toHaveTextContent('false');
  });

  it('complete() persists completion under a per-tour storage key', () => {
    const adapter = makeMockAdapter();
    render(
      <RoboTourProvider storageAdapter={adapter}>
        <TourConsumer id='map-dashboard-starter' />
      </RoboTourProvider>
    );
    act(() => screen.getByText('Complete').click());
    expect(screen.getByTestId('completed')).toHaveTextContent('true');
    expect(adapter.set).toHaveBeenCalledWith('robo-tour:map-dashboard-starter', 'true');
  });

  it('a tour registered with a previously-completed storage key starts completed', () => {
    const adapter = makeMockAdapter({ 'robo-tour:app-shell': 'true' });
    render(
      <RoboTourProvider storageAdapter={adapter}>
        <TourConsumer id='app-shell' />
      </RoboTourProvider>
    );
    expect(screen.getByTestId('completed')).toHaveTextContent('true');
  });

  it('two tours persist independently under distinct storage keys', () => {
    const adapter = makeMockAdapter();
    render(
      <RoboTourProvider storageAdapter={adapter}>
        <TourConsumer id='tour-a' label='Tour A' />
        <TourConsumer id='tour-b' label='Tour B' />
      </RoboTourProvider>
    );
    const [buttonA] = screen.getAllByText('Complete');
    act(() => buttonA.click());
    const completedSpans = screen.getAllByTestId('completed');
    expect(completedSpans[0]).toHaveTextContent('true');
    expect(completedSpans[1]).toHaveTextContent('false');
    expect(adapter.set).toHaveBeenCalledWith('robo-tour:tour-a', 'true');
    expect(adapter.set).not.toHaveBeenCalledWith('robo-tour:tour-b', 'true');
  });

  it('useTourRegistry().restart marks the tour not-completed and notifies its onRestart subscribers', () => {
    function Registry() {
      const { restart } = useTourRegistry();
      return <button onClick={() => restart('test.tour')}>Restart</button>;
    }
    const adapter = makeMockAdapter({ 'robo-tour:test.tour': 'true' });
    render(
      <RoboTourProvider storageAdapter={adapter}>
        <TourConsumer />
        <Registry />
      </RoboTourProvider>
    );
    expect(screen.getByTestId('completed')).toHaveTextContent('true');
    act(() => screen.getByText('Restart').click());
    expect(screen.getByTestId('completed')).toHaveTextContent('false');
    expect(screen.getByTestId('restarted')).toHaveTextContent('1');
    expect(adapter.set).toHaveBeenCalledWith('robo-tour:test.tour', 'false');
  });

  it('useTourRegistry().list lists every registered tour with its label and completion state', () => {
    function Registry() {
      const { list } = useTourRegistry();
      return (
        <ul>
          {list().map((tour) => (
            <li key={tour.id}>
              {tour.label}: {String(tour.completed)}
            </li>
          ))}
        </ul>
      );
    }
    render(
      <RoboTourProvider>
        <TourConsumer id='tour-a' label='Tour A' />
        <TourConsumer id='tour-b' label='Tour B' />
        <Registry />
      </RoboTourProvider>
    );
    expect(screen.getByText('Tour A: false')).toBeInTheDocument();
    expect(screen.getByText('Tour B: false')).toBeInTheDocument();
  });

  it('useTourRegistry().restartAll restarts every registered tour', () => {
    function Registry() {
      const { restartAll } = useTourRegistry();
      return <button onClick={restartAll}>Restart all</button>;
    }
    const adapter = makeMockAdapter({ 'robo-tour:tour-a': 'true', 'robo-tour:tour-b': 'true' });
    render(
      <RoboTourProvider storageAdapter={adapter}>
        <TourConsumer id='tour-a' label='Tour A' />
        <TourConsumer id='tour-b' label='Tour B' />
        <Registry />
      </RoboTourProvider>
    );
    const completedBefore = screen.getAllByTestId('completed');
    expect(completedBefore[0]).toHaveTextContent('true');
    expect(completedBefore[1]).toHaveTextContent('true');
    act(() => screen.getByText('Restart all').click());
    const completedAfter = screen.getAllByTestId('completed');
    expect(completedAfter[0]).toHaveTextContent('false');
    expect(completedAfter[1]).toHaveTextContent('false');
  });

  it('useTourRegistry throws outside a mounted RoboTourProvider', () => {
    function Registry() {
      useTourRegistry();
      return null;
    }
    const spy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() => render(<Registry />)).toThrow('useTourRegistry must be used within a RoboTourProvider');
    spy.mockRestore();
  });

  it('useTour does not throw outside a provider and still tracks local completion', () => {
    render(<TourConsumer />);
    expect(screen.getByTestId('completed')).toHaveTextContent('false');
    act(() => screen.getByText('Complete').click());
    expect(screen.getByTestId('completed')).toHaveTextContent('true');
  });

  it('unregistering on unmount removes the tour from the registry list', () => {
    function Registry() {
      const { list } = useTourRegistry();
      return <span data-testid='count'>{list().length}</span>;
    }
    function Wrapper({ mounted }: { mounted: boolean }) {
      return (
        <RoboTourProvider>
          {mounted && <TourConsumer />}
          <Registry />
        </RoboTourProvider>
      );
    }
    const { rerender } = render(<Wrapper mounted />);
    expect(screen.getByTestId('count')).toHaveTextContent('1');
    rerender(<Wrapper mounted={false} />);
    expect(screen.getByTestId('count')).toHaveTextContent('0');
  });
});
