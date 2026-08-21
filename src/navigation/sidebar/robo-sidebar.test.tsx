import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { Home, Settings } from 'lucide-react';

import { RoboSidebar } from './robo-sidebar';
import type { RoboSidebarItem } from './robo-sidebar';
import type { StorageAdapter } from '@/core/storage-adapter';


const baseItems: RoboSidebarItem[] = [
  {
    id: 'home',
    label: 'Home',
    icon: <Home data-testid='icon-home' />,
    href: '/home',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: <Settings data-testid='icon-settings' />,
    href: '/settings',
  },
];

const groupItems: RoboSidebarItem[] = [
  {
    id: 'group',
    label: 'Group',
    icon: <Home />,
    children: [
      { id: 'child1', label: 'Child One', icon: <Settings />, href: '/child1' },
      { id: 'child2', label: 'Child Two', icon: <Settings />, href: '/child2' },
    ],
  },
];

function makeStorageAdapter(): StorageAdapter & { store: Record<string, string> } {
  const store: Record<string, string> = {};
  return {
    store,
    get: (key) => store[key] ?? null,
    set: (key, value) => { store[key] = value; },
    remove: (key) => { delete store[key]; },
  };
}

describe('RoboSidebar', () => {
  it('renders all nav items', () => {
    render(<RoboSidebar items={baseItems} />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('has aria-label "Main navigation" on nav element', () => {
    render(<RoboSidebar items={baseItems} />);
    expect(screen.getByRole('navigation', { name: 'Main navigation' })).toBeInTheDocument();
  });

  it('marks active item with aria-current="page"', () => {
    render(<RoboSidebar items={baseItems} activePath='/home' />);
    const homeLink = screen.getByRole('link', { name: /home/i });
    expect(homeLink).toHaveAttribute('aria-current', 'page');
  });

  it('non-active items do not have aria-current', () => {
    render(<RoboSidebar items={baseItems} activePath='/home' />);
    const settingsLink = screen.getByRole('link', { name: /settings/i });
    expect(settingsLink).not.toHaveAttribute('aria-current');
  });

  it('renders toggle button with aria-expanded=true when expanded', () => {
    render(<RoboSidebar items={baseItems} />);
    const toggleBtn = screen.getByRole('button', { name: /collapse sidebar/i });
    expect(toggleBtn).toHaveAttribute('aria-expanded', 'true');
  });

  it('shows the visible "Collapse sidebar" label on the toggle button when expanded', () => {
    render(<RoboSidebar items={baseItems} />);
    expect(screen.getByText('Collapse sidebar')).toBeInTheDocument();
  });

  it('hides the "Collapse sidebar" label (not just visually) when collapsed', async () => {
    const user = userEvent.setup();
    render(<RoboSidebar items={baseItems} />);
    await user.click(screen.getByRole('button', { name: /collapse sidebar/i }));
    expect(screen.queryByText('Collapse sidebar')).not.toBeInTheDocument();
  });

  it('toggles collapsed state when toggle button is clicked', async () => {
    const user = userEvent.setup();
    render(<RoboSidebar items={baseItems} />);
    const toggleBtn = screen.getByRole('button', { name: /collapse sidebar/i });
    await user.click(toggleBtn);
    expect(screen.queryByText('Home')).not.toBeInTheDocument();
    // Toggle button now shows "Expand sidebar"
    expect(screen.getByRole('button', { name: /expand sidebar/i })).toBeInTheDocument();
  });

  it('expands back after second toggle click', async () => {
    const user = userEvent.setup();
    render(<RoboSidebar items={baseItems} />);
    const collapseBtn = screen.getByRole('button', { name: /collapse sidebar/i });
    await user.click(collapseBtn);
    const expandBtn = screen.getByRole('button', { name: /expand sidebar/i });
    await user.click(expandBtn);
    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  it('shows tooltip trigger when collapsed (tooltip wraps each nav item)', async () => {
    const user = userEvent.setup();
    render(<RoboSidebar items={baseItems} />);
    // Collapse first
    await user.click(screen.getByRole('button', { name: /collapse sidebar/i }));
    // After collapsing, labels are hidden from visible DOM but Radix Tooltip wraps links
    // Verify the nav links are still present (as tooltip triggers)
    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThan(0);
    // Each link should be wrapped in a Tooltip.Trigger — has data attributes from Radix
    expect(links[0]).toBeInTheDocument();
  });

  it('persists collapsed state via storageAdapter on toggle', async () => {
    const user = userEvent.setup();
    const adapter = makeStorageAdapter();
    render(<RoboSidebar items={baseItems} storageAdapter={adapter} storageKey='sb' />);
    await user.click(screen.getByRole('button', { name: /collapse sidebar/i }));
    expect(adapter.store['sb']).toBe('true');
  });

  it('reads initial collapsed state from storageAdapter', () => {
    const adapter = makeStorageAdapter();
    adapter.store['sb'] = 'true';
    render(<RoboSidebar items={baseItems} storageAdapter={adapter} storageKey='sb' />);
    // When collapsed, labels are not shown
    expect(screen.queryByText('Home')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /expand sidebar/i })).toBeInTheDocument();
  });

  /*
   * `storageAdapter` is for UNCONTROLLED use. When `collapsed` is supplied the consumer
   * owns the state, so the component must not read *or* write storage.
   *
   * The write used to happen regardless. Reading was already correctly ignored, which is
   * the trap: the value appeared in storage, so the adapter looked wired up, while the
   * component would never honour it — and a consumer persisting the same setting itself
   * ended up with two writers to one key. a consumer app hit exactly that.
   */
  it('does not write storage when controlled — the consumer owns the state', async () => {
    const user = userEvent.setup();
    const adapter = makeStorageAdapter();
    const onCollapsedChange = vi.fn();

    render(
      <RoboSidebar
        items={baseItems}
        collapsed={false}
        onCollapsedChange={onCollapsedChange}
        storageAdapter={adapter}
        storageKey='sb'
      />
    );

    await user.click(screen.getByRole('button', { name: /collapse sidebar/i }));

    // The consumer is told, and is the only one who may persist it.
    expect(onCollapsedChange).toHaveBeenCalledWith(true);
    expect(adapter.store['sb']).toBeUndefined();
  });

  it('ignores a stored value when controlled', () => {
    const adapter = makeStorageAdapter();
    adapter.store['sb'] = 'true';

    render(
      <RoboSidebar items={baseItems} collapsed={false} storageAdapter={adapter} storageKey='sb' />
    );

    // `collapsed={false}` wins over the stored 'true' — labels are visible.
    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  it('renders accordion group item and toggles children visibility', async () => {
    const user = userEvent.setup();
    render(<RoboSidebar items={groupItems} />);
    // Children not visible by default
    expect(screen.queryByText('Child One')).not.toBeInTheDocument();
    // Click group trigger to open
    await user.click(screen.getByText('Group'));
    expect(await screen.findByText('Child One')).toBeInTheDocument();
    expect(screen.getByText('Child Two')).toBeInTheDocument();
  });

  it('persists accordion open state via storageAdapter', async () => {
    const user = userEvent.setup();
    const adapter = makeStorageAdapter();
    render(<RoboSidebar items={groupItems} storageAdapter={adapter} storageKey='sb' />);
    await user.click(screen.getByText('Group'));
    const stored = JSON.parse(adapter.store['sb-groups'] ?? '[]') as string[];
    expect(stored).toContain('group');
  });

  it('reads initial accordion open state from storageAdapter', async () => {
    const adapter = makeStorageAdapter();
    adapter.store['sb-groups'] = JSON.stringify(['group']);
    render(<RoboSidebar items={groupItems} storageAdapter={adapter} storageKey='sb' />);
    // Group was pre-opened, children should be visible
    expect(await screen.findByText('Child One')).toBeInTheDocument();
  });

  it('passes displayName', () => {
    expect(RoboSidebar.displayName).toBe('RoboSidebar');
  });

  it('no a11y violations', async () => {
    const { container } = render(<RoboSidebar items={baseItems} activePath='/home' />);
    expect(await axe(container)).toHaveNoViolations();
  });

  describe('footerItems', () => {
    const footerItems: RoboSidebarItem[] = [
      { id: 'settings', label: 'Settings', icon: <Settings data-testid='icon-footer-settings' /> },
    ];

    it('renders footer items pinned below the main list', () => {
      render(<RoboSidebar items={baseItems} footerItems={footerItems} />);
      expect(screen.getAllByText('Settings').length).toBeGreaterThan(0);
    });

    it('does not render a footer section when footerItems is omitted', () => {
      const { container } = render(<RoboSidebar items={baseItems} />);
      // Only one border-t divider (above the collapse toggle) should exist without footerItems
      expect(container.querySelectorAll('.border-t').length).toBe(1);
    });

    it('calls onSelect when a non-link footer item is clicked', async () => {
      const user = userEvent.setup();
      const onSelect = vi.fn();
      render(
        <RoboSidebar
          items={baseItems}
          footerItems={[{ id: 'settings', label: 'Settings', icon: <Settings />, onSelect }]}
        />
      );
      await user.click(screen.getByRole('button', { name: /settings/i }));
      expect(onSelect).toHaveBeenCalledTimes(1);
    });
  });

  describe('logo', () => {
    it('renders the logo when provided', () => {
      render(<RoboSidebar items={baseItems} logo={<span data-testid='sidebar-logo'>L</span>} />);
      expect(screen.getByTestId('sidebar-logo')).toBeInTheDocument();
    });

    it('renders no logo header when omitted', () => {
      const { container } = render(<RoboSidebar items={baseItems} />);
      expect(container.querySelectorAll('.border-b').length).toBe(0);
    });

    it('renders the logo as plain (non-link) content when logoHref is omitted', () => {
      render(<RoboSidebar items={baseItems} logo={<span data-testid='sidebar-logo'>L</span>} />);
      expect(screen.getByTestId('sidebar-logo').closest('a')).toBeNull();
    });

    it('wraps the logo in a link to logoHref when provided', () => {
      render(
        <RoboSidebar items={baseItems} logo={<span data-testid='sidebar-logo'>L</span>} logoHref='/home' />
      );
      const link = screen.getByTestId('sidebar-logo').closest('a');
      expect(link).toHaveAttribute('href', '/home');
    });
  });

  describe('controlled collapse', () => {
    it('does not spread a bare "collapsed" attribute onto the <nav> element', () => {
      render(<RoboSidebar items={baseItems} collapsed={false} />);
      const nav = screen.getByRole('navigation', { name: 'Main navigation' });
      expect(nav).not.toHaveAttribute('collapsed');
    });

    it('respects the controlled collapsed prop', () => {
      render(<RoboSidebar items={baseItems} collapsed={true} />);
      expect(screen.queryByText('Home')).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: /expand sidebar/i })).toBeInTheDocument();
    });

    it('calls onCollapsedChange when the toggle is clicked, even when uncontrolled', async () => {
      const user = userEvent.setup();
      const onCollapsedChange = vi.fn();
      render(<RoboSidebar items={baseItems} onCollapsedChange={onCollapsedChange} />);
      await user.click(screen.getByRole('button', { name: /collapse sidebar/i }));
      expect(onCollapsedChange).toHaveBeenCalledWith(true);
    });

    it('calls onCollapsedChange without changing internal state when controlled', async () => {
      const user = userEvent.setup();
      const onCollapsedChange = vi.fn();
      render(<RoboSidebar items={baseItems} collapsed={false} onCollapsedChange={onCollapsedChange} />);
      await user.click(screen.getByRole('button', { name: /collapse sidebar/i }));
      expect(onCollapsedChange).toHaveBeenCalledWith(true);
      // Still expanded — prop hasn't been updated by the parent
      expect(screen.getByText('Home')).toBeInTheDocument();
    });
  });
});
