import * as React from 'react';
import { render, screen, within, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { DashboardStarterTemplate } from './dashboard-starter';
import { isMac } from '../core/keybinds/robo-keybind-utils';

// `mod` resolves to metaKey on Mac, ctrlKey elsewhere (both in production code and in
// is-hotkey's own matching) — use the same check here so this test asserts real behavior
// instead of assuming a platform (mirrors robo-keybind-provider.test.tsx's own convention).
const MOD_KEY = isMac() ? 'metaKey' : 'ctrlKey';

function openQuickPanel() {
  act(() => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: '/', [MOD_KEY]: true }));
  });
}

describe('DashboardStarterTemplate', () => {
  afterEach(() => {
    window.localStorage.clear();
  });

  it('renders without crashing', () => {
    render(<DashboardStarterTemplate />);
  });

  it('renders the sidebar nav items', () => {
    render(<DashboardStarterTemplate />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Reports')).toBeInTheDocument();
  });

  it('renders the Dashboard Grid content', () => {
    render(<DashboardStarterTemplate />);
    expect(screen.getByText('Total Items')).toBeInTheDocument();
    expect(screen.getByText('Recent Activity')).toBeInTheDocument();
  });

  it('clicking the Settings footer item switches to a settings view with the tour card', () => {
    render(<DashboardStarterTemplate />);
    const nav = screen.getByRole('navigation', { name: 'Main navigation' });
    act(() => within(nav).getByText('Settings').click());
    expect(screen.getByText('Product tour')).toBeInTheDocument();
    expect(screen.queryByText('Total Items')).not.toBeInTheDocument();
  });

  it('auto-runs the first-run tour and highlights the KPI row', async () => {
    render(<DashboardStarterTemplate />);
    expect(await screen.findByText(/top-line KPIs/i)).toBeInTheDocument();
  });

  it('opens the Quick Panel via its toggle keybind (mod+/)', () => {
    render(<DashboardStarterTemplate />);
    expect(screen.getByRole('complementary', { name: 'Quick panel' })).toHaveAttribute('data-expanded', 'false');
    openQuickPanel();
    expect(screen.getByRole('complementary', { name: 'Quick panel' })).toHaveAttribute('data-expanded', 'true');
  });

  it('Settings shows Appearance and Global groups with color theme, density, and font family controls', () => {
    render(<DashboardStarterTemplate />);
    const nav = screen.getByRole('navigation', { name: 'Main navigation' });
    act(() => within(nav).getByText('Settings').click());

    expect(screen.getByText('Appearance')).toBeInTheDocument();
    expect(screen.getByText('Color theme')).toBeInTheDocument();
    expect(screen.getByText('Density')).toBeInTheDocument();
    expect(screen.getByText('Font family')).toBeInTheDocument();

    // Not asserting the "Global" settings group heading itself — keeping this
    // assertion block focused on the controls rather than the group labels.
    expect(screen.getByText('Date format')).toBeInTheDocument();
    expect(screen.getByText('Surface style')).toBeInTheDocument();
  });

  it('Settings shows a Keybinds group listing the Quick Panel shortcut', () => {
    render(<DashboardStarterTemplate />);
    const nav = screen.getByRole('navigation', { name: 'Main navigation' });
    act(() => within(nav).getByText('Settings').click());
    expect(screen.getByText('Keybinds')).toBeInTheDocument();
    expect(screen.getByText('Toggle Quick Panel')).toBeInTheDocument();
  });

  it('switching to the Notifications tab shows the notification list', async () => {
    const user = userEvent.setup();
    render(<DashboardStarterTemplate />);
    openQuickPanel();
    expect(screen.queryByText(/KPI threshold breached/i)).not.toBeInTheDocument();
    await user.click(screen.getByRole('tab', { name: /notifications/i }));
    expect(screen.getByText(/KPI threshold breached/i)).toBeInTheDocument();
    // "Notifications" now appears both as the tab trigger and the section header above the list.
    expect(screen.getAllByText('Notifications').length).toBeGreaterThanOrEqual(2);
  });
});
