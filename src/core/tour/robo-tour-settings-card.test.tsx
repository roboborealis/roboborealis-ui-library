import * as React from 'react';
import { render, screen, act } from '@testing-library/react';
import { axe } from 'vitest-axe';

import { RoboTourSettingsCard } from './robo-tour-settings-card';
import { RoboTourProvider, useTour } from './robo-tour-provider';

function RegisterTour({ id, label }: { id: string; label: string }) {
  useTour({ id, label });
  return null;
}

describe('RoboTourSettingsCard', () => {
  afterEach(() => {
    window.localStorage.clear();
  });

  it('renders a placeholder message when no tours are registered', () => {
    render(
      <RoboTourProvider>
        <RoboTourSettingsCard />
      </RoboTourProvider>
    );
    expect(screen.getByText('No tours are registered for this app yet.')).toBeInTheDocument();
  });

  it('lists every registered tour with its label and completion status', () => {
    render(
      <RoboTourProvider>
        <RegisterTour id='map-dashboard-starter' label='Map dashboard tour' />
        <RegisterTour id='app-shell' label='Basic app tour' />
        <RoboTourSettingsCard />
      </RoboTourProvider>
    );
    expect(screen.getByText('Map dashboard tour')).toBeInTheDocument();
    expect(screen.getByText('Basic app tour')).toBeInTheDocument();
    expect(screen.getAllByText('Not yet taken')).toHaveLength(2);
  });

  it('clicking Restart tour marks the tour not-completed again', () => {
    function Consumer() {
      const { completed, complete } = useTour({ id: 'test-tour', label: 'Test tour' });
      return (
        <div>
          <span data-testid='completed'>{String(completed)}</span>
          <button onClick={complete}>Complete</button>
        </div>
      );
    }
    render(
      <RoboTourProvider>
        <Consumer />
        <RoboTourSettingsCard />
      </RoboTourProvider>
    );
    act(() => screen.getByText('Complete').click());
    expect(screen.getByTestId('completed')).toHaveTextContent('true');
    expect(screen.getByText('Completed')).toBeInTheDocument();

    act(() => screen.getByText('Restart tour').click());
    expect(screen.getByTestId('completed')).toHaveTextContent('false');
    expect(screen.getByText('Not yet taken')).toBeInTheDocument();
  });

  it('throws outside a mounted RoboTourProvider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() => render(<RoboTourSettingsCard />)).toThrow('useTourRegistry must be used within a RoboTourProvider');
    spy.mockRestore();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <RoboTourProvider>
        <RegisterTour id='test-tour' label='Test tour' />
        <RoboTourSettingsCard />
      </RoboTourProvider>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has correct displayName', () => {
    expect(RoboTourSettingsCard.displayName).toBe('RoboTourSettingsCard');
  });
});
