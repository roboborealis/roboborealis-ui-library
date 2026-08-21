import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  Satellite,
  FileText,
  Map,
  Settings,
  Users,
  Bell,
  Search,
  BarChart2,
  LogOut,
  Home,
} from 'lucide-react';

import { RoboCommandPalette, type CommandGroup } from './robo-command-palette';
import { RoboBadge } from '@/core/badge/robo-badge';
import { RoboButton } from '@/core/button/robo-button';
import { RoboTopbar } from '@/navigation/topbar/robo-topbar';


export const componentMeta = {
  description: 'Keyboard-activated command search overlay for power users',
  category: 'navigation' as const,
  keywords: ['command', 'palette', 'search', 'keyboard', 'shortcut', 'spotlight', 'omnibar', 'k'],
  whenToUse: 'For power-user quick navigation and action execution via keyboard (Cmd+K pattern)',
  whenNotToUse: 'For simple search use RoboInput with search icon; for menus use RoboDropdownMenu',
  pairsWith: ['RoboDialog', 'RoboInput', 'RoboTopbar'],
  a11y: 'Uses role="dialog" with combobox pattern; manages focus and announces results to screen readers',
};
const meta: Meta<typeof RoboCommandPalette> = {
  title: 'Components/Navigation/RoboCommandPalette',
  excludeStories: ['componentMeta'],
    component: RoboCommandPalette,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};
export default meta;

type Story = StoryObj<typeof RoboCommandPalette>;

// ---------------------------------------------------------------------------
// Shared command groups
// ---------------------------------------------------------------------------

const navGroup: CommandGroup = {
  heading: 'Navigation',
  items: [
    { id: 'home',       label: 'Dashboard',        icon: <Home className='h-4 w-4' />,     shortcut: 'G H', onSelect: () => {} },
    { id: 'satellites',    label: 'Satellite Registry',   icon: <Satellite className='h-4 w-4' />,     shortcut: 'G V', onSelect: () => {} },
    { id: 'map',        label: 'Live Map',          icon: <Map className='h-4 w-4' />,      shortcut: 'G M', onSelect: () => {} },
    { id: 'reports',    label: 'Reports',           icon: <FileText className='h-4 w-4' />, shortcut: 'G R', onSelect: () => {} },
    { id: 'analytics',  label: 'Analytics',         icon: <BarChart2 className='h-4 w-4' />,              onSelect: () => {} },
  ],
};

const actionsGroup: CommandGroup = {
  heading: 'Actions',
  items: [
    { id: 'new-report',  label: 'New Mission Report',   icon: <FileText className='h-4 w-4' />, shortcut: 'N R', onSelect: () => {} },
    { id: 'new-satellite',  label: 'Register Satellite',      icon: <Satellite className='h-4 w-4' />,                    onSelect: () => {} },
    { id: 'search',      label: 'Search Satellites',       icon: <Search className='h-4 w-4' />,   shortcut: '/',  onSelect: () => {} },
  ],
};

const settingsGroup: CommandGroup = {
  heading: 'Settings',
  items: [
    { id: 'profile',       label: 'My Profile',         icon: <Users className='h-4 w-4' />,    onSelect: () => {} },
    { id: 'notifications', label: 'Notifications',      icon: <Bell className='h-4 w-4' />,     onSelect: () => {} },
    { id: 'settings',      label: 'System Settings',    icon: <Settings className='h-4 w-4' />, onSelect: () => {} },
    { id: 'logout',        label: 'Sign Out',           icon: <LogOut className='h-4 w-4' />,   onSelect: () => {},  },
  ],
};

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

/**
 * All Variants — the palette renders as a body-portaled overlay, so its open
 * states cannot sit side by side. This shows the fully-populated open state
 * with multiple categories (navigation, actions, settings). For the isolated
 * empty and disabled-item states see the EmptyState and WithDisabledItems
 * stories below.
 */
export const AllVariants: Story = {
  name: 'All Variants',
  render: () => {
    const [open, setOpen] = React.useState(true);
    return (
      <RoboCommandPalette
        open={open}
        onOpenChange={setOpen}
        groups={[navGroup, actionsGroup, settingsGroup]}
        placeholder='Search commands, pages, actions…'
      />
    );
  },
};

/** Click the button or press ⌘K to open. */
export const Default: Story = {
  name: 'Default (click to open)',
  render: () => {
    const [open, setOpen] = React.useState(false);

    React.useEffect(() => {
      const handler = (e: KeyboardEvent) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
          e.preventDefault();
          setOpen((o) => !o);
        }
      };
      window.addEventListener('keydown', handler);
      return () => window.removeEventListener('keydown', handler);
    }, []);

    return (
      <>
        <RoboButton variant='outline' size='sm' onClick={() => setOpen(true)}>
          <Search className='h-4 w-4' />
          Search commands…
          <RoboBadge usage='label' size='sm'>⌘K</RoboBadge>
        </RoboButton>

        <RoboCommandPalette
          open={open}
          onOpenChange={setOpen}
          groups={[navGroup, actionsGroup, settingsGroup]}
          placeholder='Search commands, pages, actions…'
        />
      </>
    );
  },
};

/** Pre-opened for documentation purposes. */
export const OpenByDefault: Story = {
  name: 'Open (docs view)',
  render: () => {
    const [open, setOpen] = React.useState(true);
    return (
      <RoboCommandPalette
        open={open}
        onOpenChange={setOpen}
        groups={[navGroup, actionsGroup, settingsGroup]}
        placeholder='Search commands, pages, actions…'
      />
    );
  },
};

/** With a disabled item in one of the groups. */
export const WithDisabledItems: Story = {
  name: 'With Disabled Items',
  render: () => {
    const [open, setOpen] = React.useState(true);
    const groups: CommandGroup[] = [
      navGroup,
      {
        heading: 'Actions',
        items: [
          { id: 'new-report', label: 'New Mission Report', icon: <FileText className='h-4 w-4' />, onSelect: () => {} },
          { id: 'bulk-export', label: 'Bulk Export (coming soon)', icon: <FileText className='h-4 w-4' />, disabled: true, onSelect: () => {} },
        ],
      },
    ];
    return (
      <RoboCommandPalette
        open={open}
        onOpenChange={setOpen}
        groups={groups}
        placeholder='Type to search…'
      />
    );
  },
};

/** Empty state — nothing matches the query. */
export const EmptyState: Story = {
  name: 'Empty State',
  render: () => {
    const [open, setOpen] = React.useState(true);
    return (
      <RoboCommandPalette
        open={open}
        onOpenChange={setOpen}
        groups={[]}
        searchValue='zzz no match'
        placeholder='Search…'
        emptyMessage='No commands found for this search.'
      />
    );
  },
};

/**
 * Topbar-integrated trigger — the sanctioned pattern for making Cmd+K
 * discoverable: a visible `commandPaletteTrigger` slot on RoboTopbar, paired
 * with a global keydown listener and RoboCommandPalette. This is exactly what
 * AppShellTemplate wires up by default.
 */
export const TopbarTrigger: Story = {
  name: 'In Context — RoboTopbar Integration',
  render: () => {
    const [open, setOpen] = React.useState(false);

    React.useEffect(() => {
      const handler = (e: KeyboardEvent) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
          e.preventDefault();
          setOpen((o) => !o);
        }
      };
      window.addEventListener('keydown', handler);
      return () => window.removeEventListener('keydown', handler);
    }, []);

    return (
      <div style={{ marginBottom: 8 }}>
        <RoboTopbar
          logo={<span style={{ fontWeight: 700 }}>Acme</span>}
          commandPaletteTrigger={
            <RoboButton variant='outline' size='sm' onClick={() => setOpen(true)}>
              <Search className='h-4 w-4' />
              <span className='hidden sm:inline'>Search…</span>
              <RoboBadge usage='label' size='sm'>⌘K</RoboBadge>
            </RoboButton>
          }
        />

        <RoboCommandPalette
          open={open}
          onOpenChange={setOpen}
          groups={[navGroup, actionsGroup, settingsGroup]}
        />
      </div>
    );
  },
};
