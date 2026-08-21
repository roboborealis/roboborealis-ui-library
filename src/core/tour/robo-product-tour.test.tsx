import * as React from 'react';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { RoboProductTour, type RoboTourStep } from './robo-product-tour';
import { RoboTourProvider, useTour, useTourRegistry } from './robo-tour-provider';
import type { StorageAdapter } from '../storage-adapter';

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

function CompletedIndicator({ id }: { id: string }) {
  const { completed } = useTour({ id, label: 'Test tour' });
  return <span data-testid='completed'>{String(completed)}</span>;
}

const ONE_STEP: RoboTourStep[] = [
  { target: '#tour-target', content: 'Step content', skipBeacon: true },
];

describe('RoboProductTour', () => {
  afterEach(() => {
    window.localStorage.clear();
  });

  it('renders without crashing when its target exists', () => {
    render(
      <RoboTourProvider>
        <div id='tour-target'>Target</div>
        <RoboProductTour id='test-tour' label='Test tour' steps={ONE_STEP} />
      </RoboTourProvider>
    );
    expect(screen.getByText('Target')).toBeInTheDocument();
  });

  it('auto-starts and shows the step tooltip when the tour has not been completed', async () => {
    render(
      <RoboTourProvider>
        <div id='tour-target'>Target</div>
        <RoboProductTour id='test-tour' label='Test tour' steps={ONE_STEP} />
      </RoboTourProvider>
    );
    expect(await screen.findByText('Step content')).toBeInTheDocument();
  });

  it('does not auto-start when the tour is already marked completed', () => {
    const adapter = makeMockAdapter({ 'robo-tour:test-tour': 'true' });
    render(
      <RoboTourProvider storageAdapter={adapter}>
        <div id='tour-target'>Target</div>
        <RoboProductTour id='test-tour' label='Test tour' steps={ONE_STEP} />
      </RoboTourProvider>
    );
    expect(screen.queryByText('Step content')).not.toBeInTheDocument();
  });

  it('skips steps whose target is not present in the DOM instead of hanging', () => {
    const missingTargetSteps: RoboTourStep[] = [
      { target: '#does-not-exist', content: 'Never shown', skipBeacon: true },
    ];
    expect(() =>
      render(
        <RoboTourProvider>
          <RoboProductTour id='test-tour' label='Test tour' steps={missingTargetSteps} />
        </RoboTourProvider>
      )
    ).not.toThrow();
    expect(screen.queryByText('Never shown')).not.toBeInTheDocument();
  });

  it('calls onBeforeStart before the tour starts', async () => {
    const onBeforeStart = vi.fn();
    render(
      <RoboTourProvider>
        <div id='tour-target'>Target</div>
        <RoboProductTour id='test-tour' label='Test tour' steps={ONE_STEP} onBeforeStart={onBeforeStart} />
      </RoboTourProvider>
    );
    await screen.findByText('Step content');
    expect(onBeforeStart).toHaveBeenCalledTimes(1);
  });

  it('marks the tour completed when the user skips it mid-tour', async () => {
    // A single-step tour renders only the final "Last" button (no "Skip") —
    // use two steps so a real Skip button is present to click.
    const twoSteps: RoboTourStep[] = [
      { target: '#tour-target', content: 'Step 1', skipBeacon: true },
      { target: '#tour-target-2', content: 'Step 2', skipBeacon: true },
    ];
    const adapter = makeMockAdapter();
    const user = userEvent.setup();
    render(
      <RoboTourProvider storageAdapter={adapter}>
        <div id='tour-target'>Target</div>
        <div id='tour-target-2'>Target 2</div>
        <RoboProductTour id='test-tour' label='Test tour' steps={twoSteps} />
        <CompletedIndicator id='test-tour' />
      </RoboTourProvider>
    );
    expect(screen.getByTestId('completed')).toHaveTextContent('false');
    const skipButton = await screen.findByRole('button', { name: /skip/i });
    await act(async () => {
      await user.click(skipButton);
    });
    expect(await screen.findByTestId('completed')).toHaveTextContent('true');
    expect(adapter.set).toHaveBeenCalledWith('robo-tour:test-tour', 'true');
  });

  it('restarting the tour from the registry re-runs a previously-completed tour', async () => {
    function RestartButton() {
      const { restart } = useTourRegistry();
      return <button onClick={() => restart('test-tour')}>Restart</button>;
    }
    const adapter = makeMockAdapter({ 'robo-tour:test-tour': 'true' });
    render(
      <RoboTourProvider storageAdapter={adapter}>
        <div id='tour-target'>Target</div>
        <RoboProductTour id='test-tour' label='Test tour' steps={ONE_STEP} />
        <RestartButton />
      </RoboTourProvider>
    );
    // Already completed — the tooltip should not be showing yet.
    expect(screen.queryByText('Step content')).not.toBeInTheDocument();
    act(() => screen.getByText('Restart').click());
    expect(await screen.findByText('Step content')).toBeInTheDocument();
  });
});
