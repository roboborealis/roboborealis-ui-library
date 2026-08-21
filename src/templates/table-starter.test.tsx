import * as React from 'react';
import { render, screen, within, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { TableStarterTemplate } from './table-starter';
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

describe('TableStarterTemplate', () => {
  afterEach(() => {
    window.localStorage.clear();
  });

  it('renders without crashing', () => {
    render(<TableStarterTemplate />);
  });

  it('renders the sidebar nav items', () => {
    render(<TableStarterTemplate />);
    expect(screen.getByText('Records')).toBeInTheDocument();
    expect(screen.getByText('Data')).toBeInTheDocument();
  });

  it('renders the Filter + Table + Detail content', () => {
    render(<TableStarterTemplate />);
    expect(screen.getByText('Browse Records')).toBeInTheDocument();
    expect(screen.getByText('Record Alpha')).toBeInTheDocument();
  });

  it('clicking the Settings footer item switches to a settings view with the tour card', () => {
    render(<TableStarterTemplate />);
    const nav = screen.getByRole('navigation', { name: 'Main navigation' });
    act(() => within(nav).getByText('Settings').click());
    expect(screen.getByText('Product tour')).toBeInTheDocument();
    expect(screen.queryByText('Browse Records')).not.toBeInTheDocument();
  });

  it('auto-runs the first-run tour and highlights the filter panel', async () => {
    render(<TableStarterTemplate />);
    expect(await screen.findByText(/Narrow the list/i)).toBeInTheDocument();
  });

  it('opens the Quick Panel via its toggle keybind (mod+/)', () => {
    render(<TableStarterTemplate />);
    expect(screen.getByRole('complementary', { name: 'Quick panel' })).toHaveAttribute('data-expanded', 'false');
    openQuickPanel();
    expect(screen.getByRole('complementary', { name: 'Quick panel' })).toHaveAttribute('data-expanded', 'true');
  });

  it('Settings shows a Keybinds group listing the Quick Panel shortcut', () => {
    render(<TableStarterTemplate />);
    const nav = screen.getByRole('navigation', { name: 'Main navigation' });
    act(() => within(nav).getByText('Settings').click());
    expect(screen.getByText('Keybinds')).toBeInTheDocument();
    expect(screen.getByText('Toggle Quick Panel')).toBeInTheDocument();
  });

  it('switching to the Notifications tab shows the notification list', async () => {
    const user = userEvent.setup();
    render(<TableStarterTemplate />);
    openQuickPanel();
    expect(screen.queryByText(/Record RPT-2291 updated/i)).not.toBeInTheDocument();
    await user.click(screen.getByRole('tab', { name: /notifications/i }));
    expect(screen.getByText(/Record RPT-2291 updated/i)).toBeInTheDocument();
    // "Notifications" now appears both as the tab trigger and the section header above the list.
    expect(screen.getAllByText('Notifications').length).toBeGreaterThanOrEqual(2);
  });
});
