import * as React from 'react';
import { render, screen, within, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { FormStarterTemplate } from './form-starter';
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

describe('FormStarterTemplate', () => {
  afterEach(() => {
    window.localStorage.clear();
  });

  it('renders without crashing', () => {
    render(<FormStarterTemplate />);
  });

  it('renders the sidebar nav items', () => {
    render(<FormStarterTemplate />);
    expect(screen.getByText('Submissions')).toBeInTheDocument();
    expect(screen.getByText('Data')).toBeInTheDocument();
  });

  it('renders the Form + Validation content', () => {
    render(<FormStarterTemplate />);
    expect(screen.getByText('New Submission')).toBeInTheDocument();
    expect(screen.getByText('Details')).toBeInTheDocument();
  });

  it('clicking the Settings footer item switches to a settings view with the tour card', () => {
    render(<FormStarterTemplate />);
    const nav = screen.getByRole('navigation', { name: 'Main navigation' });
    act(() => within(nav).getByText('Settings').click());
    expect(screen.getByText('Product tour')).toBeInTheDocument();
    expect(screen.queryByText('New Submission')).not.toBeInTheDocument();
  });

  it('auto-runs the first-run tour and highlights the form fields', async () => {
    render(<FormStarterTemplate />);
    expect(await screen.findByText(/validation runs as you go/i)).toBeInTheDocument();
  });

  it('opens the Quick Panel via its toggle keybind (mod+/)', () => {
    render(<FormStarterTemplate />);
    expect(screen.getByRole('complementary', { name: 'Quick panel' })).toHaveAttribute('data-expanded', 'false');
    openQuickPanel();
    expect(screen.getByRole('complementary', { name: 'Quick panel' })).toHaveAttribute('data-expanded', 'true');
  });

  it('Settings shows a Keybinds group listing the Quick Panel shortcut', () => {
    render(<FormStarterTemplate />);
    const nav = screen.getByRole('navigation', { name: 'Main navigation' });
    act(() => within(nav).getByText('Settings').click());
    expect(screen.getByText('Keybinds')).toBeInTheDocument();
    expect(screen.getByText('Toggle Quick Panel')).toBeInTheDocument();
  });

  it('switching to the Notifications tab shows the notification list', async () => {
    const user = userEvent.setup();
    render(<FormStarterTemplate />);
    openQuickPanel();
    expect(screen.queryByText(/Submission #4821 received/i)).not.toBeInTheDocument();
    await user.click(screen.getByRole('tab', { name: /notifications/i }));
    expect(screen.getByText(/Submission #4821 received/i)).toBeInTheDocument();
    // "Notifications" now appears both as the tab trigger and the section header above the list.
    expect(screen.getAllByText('Notifications').length).toBeGreaterThanOrEqual(2);
  });
});
