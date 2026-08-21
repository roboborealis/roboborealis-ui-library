import * as React from 'react';
import { render, screen, within, act, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';

import { AppShellTemplate } from './app-shell';

// ---------------------------------------------------------------------------
// The shell shows a RoboLoading splash for 900ms (bootstrap), then the
// dashboard view runs its own 600ms skeleton timer before real content. Fake
// timers with shouldAdvanceTime keep user-event responsive; advancing past both
// timers reveals the fully loaded dashboard.
// ---------------------------------------------------------------------------

function setup() {
  return userEvent.setup({ advanceTimers: vi.advanceTimersByTime.bind(vi) });
}

// RoboErrorState (used by the error view / boundary fallback) reads matchMedia,
// which jsdom doesn't implement.
function mockMatchMedia(matches: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockReturnValue({
      matches,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
    }),
  });
}

function flushBootstrap() {
  // 900ms bootstrap splash, then 600ms in-dashboard skeleton timer.
  act(() => { vi.advanceTimersByTime(1000); });
  act(() => { vi.advanceTimersByTime(700); });
}

describe('AppShellTemplate', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    mockMatchMedia(false);
    localStorage.clear();
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it('shows the loading splash first, then renders the shell', () => {
    render(<AppShellTemplate />);

    // Bootstrap splash
    expect(
      screen.getByRole('status', { name: 'Loading application' }),
    ).toBeInTheDocument();

    flushBootstrap();

    // Splash gone, dashboard heading present
    expect(
      screen.queryByRole('status', { name: 'Loading application' }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument();
  });

  it('renders the sidebar nav items and the pinned Settings footer item', () => {
    render(<AppShellTemplate />);
    flushBootstrap();

    const nav = screen.getByRole('navigation', { name: 'Main navigation' });
    expect(within(nav).getByText('Home')).toBeInTheDocument();
    expect(within(nav).getByText('Section A')).toBeInTheDocument();
    expect(within(nav).getByText('Analytics')).toBeInTheDocument();
    expect(within(nav).getByText('Users')).toBeInTheDocument();
    // Pinned footer item
    expect(within(nav).getByText('Settings')).toBeInTheDocument();
  });

  it('opens the command palette on Cmd+K', () => {
    render(<AppShellTemplate />);
    flushBootstrap();

    // The global keydown handler lives on window
    act(() => {
      window.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'k', metaKey: true }),
      );
    });

    const dialog = screen.getByRole('dialog');
    expect(
      within(dialog).getByPlaceholderText('Search commands…'),
    ).toBeInTheDocument();
  });

  it('opens the command palette when the topbar trigger button is clicked', async () => {
    const user = setup();
    render(<AppShellTemplate />);
    flushBootstrap();

    await user.click(screen.getByRole('button', { name: /search/i }));

    const dialog = screen.getByRole('dialog');
    expect(
      within(dialog).getByPlaceholderText('Search commands…'),
    ).toBeInTheDocument();
  });

  it('switches to the settings view with theme, mode, density, date format, surface style, and font family controls', async () => {
    const user = setup();
    render(<AppShellTemplate />);
    flushBootstrap();

    const nav = screen.getByRole('navigation', { name: 'Main navigation' });
    await user.click(within(nav).getByText('Settings'));

    // Settings page heading + the six control cards
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument();
    expect(screen.getByText('Color theme')).toBeInTheDocument();
    expect(screen.getByText('Mode')).toBeInTheDocument();
    expect(screen.getByText('Density')).toBeInTheDocument();
    expect(screen.getByText('Date format')).toBeInTheDocument();
    expect(screen.getByText('Surface style')).toBeInTheDocument();
    expect(screen.getByText('Font family')).toBeInTheDocument();
    // A theme option from the radio group
    expect(screen.getByText('Midnight')).toBeInTheDocument();
    // The surface-style radio options
    expect(screen.getByText('Flat')).toBeInTheDocument();
    expect(screen.getByText('Glass')).toBeInTheDocument();
    expect(screen.getByText('Neumorphism')).toBeInTheDocument();
    // A font family option from the radio group
    expect(screen.getByText('DM Sans')).toBeInTheDocument();
  });

  it('toggling glass mode in settings updates document.documentElement.dataset.glassMode', async () => {
    const user = setup();
    render(<AppShellTemplate />);
    flushBootstrap();

    const nav = screen.getByRole('navigation', { name: 'Main navigation' });
    await user.click(within(nav).getByText('Settings'));

    expect(document.documentElement.dataset.glassMode).toBe('off');
    await user.click(screen.getByText('Glass'));
    expect(document.documentElement.dataset.glassMode).toBe('on');
  });

  it('changing font family in settings updates document.documentElement.dataset.fontFamily', async () => {
    const user = setup();
    render(<AppShellTemplate />);
    flushBootstrap();

    const nav = screen.getByRole('navigation', { name: 'Main navigation' });
    await user.click(within(nav).getByText('Settings'));

    expect(document.documentElement.dataset.fontFamily).toBe('dm-sans');
    await user.click(screen.getByText('OpenDyslexic'));
    expect(document.documentElement.dataset.fontFamily).toBe('opendyslexic');
  });

  it('reaches the 404 view via the pattern-preview action', async () => {
    const user = setup();
    render(<AppShellTemplate />);
    flushBootstrap();

    await user.click(screen.getByRole('button', { name: /preview 404 page/i }));

    expect(screen.getByRole('heading', { name: 'Page not found' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /back to home/i })).toBeInTheDocument();
  });

  it('Quick Panel Recent tab groups items into Active / Needs attention accordions', () => {
    render(<AppShellTemplate />);
    flushBootstrap();

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: '/', metaKey: true }));
    });

    expect(screen.getByText('Active (2)')).toBeInTheDocument();
    expect(screen.getByText('Needs attention (2)')).toBeInTheDocument();
    // "Item Alpha" also appears in the main dashboard's own Recent Activity widget.
    expect(screen.getAllByText('Item Alpha').length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByText('Updated 2 min ago').length).toBeGreaterThanOrEqual(2);
  });

  it('has no axe violations on the dashboard view', async () => {
    const { container } = render(<AppShellTemplate />);
    flushBootstrap();

    expect(await axe(container)).toHaveNoViolations();
  });
});
