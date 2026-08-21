import type { Meta, StoryObj } from '@storybook/react';
import { fn } from 'storybook/test';
import { Search } from 'lucide-react';

import { RoboAvatar } from '@/core/avatar/robo-avatar';
import { RoboButton } from '@/core/button/robo-button';
import { RoboBadge } from '@/core/badge/robo-badge';

import { RoboTopbar } from './robo-topbar';
import { OverviewStack, OverviewSection } from '../../lib/storybook/overview-layout';


export const componentMeta = {
  description: 'Horizontal header bar with branding, navigation, and user actions',
  category: 'navigation' as const,
  keywords: ['topbar', 'header', 'navbar', 'appbar', 'toolbar', 'branding', 'actions'],
  whenToUse: 'For app header with logo, primary navigation, search, and user menu',
  whenNotToUse: 'For content toolbars within a page use a custom toolbar layout',
  pairsWith: ['RoboSidebar', 'RoboAvatar', 'RoboBreadcrumbs', 'RoboCommandPalette'],
  a11y: 'Uses role="banner" (or header element); contains primary navigation landmark',
};

/** The sanctioned commandPaletteTrigger composition — pair with a Cmd+K keydown listener and RoboCommandPalette. */
const CommandPaletteTriggerExample = () => (
  <RoboButton variant='outline' size='sm' onClick={() => {}}>
    <Search className='h-4 w-4' />
    <span>Search…</span>
    <RoboBadge usage='label' size='sm'>⌘K</RoboBadge>
  </RoboButton>
);
const meta: Meta<typeof RoboTopbar> = {
  title: 'Components/Navigation/RoboTopbar',
  excludeStories: ['componentMeta'],
    component: RoboTopbar,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    onMenuToggle: fn(),
  },
};
export default meta;

type Story = StoryObj<typeof RoboTopbar>;

export const AllVariants: Story = {
  name: 'All Variants',
  render: () => (
    <OverviewStack>
      <OverviewSection title='Minimal'>
        <RoboTopbar logo={<span style={{ fontWeight: 700 }}>Acme</span>} />
      </OverviewSection>

      <OverviewSection title='With nav links'>
        <RoboTopbar
          logo={<span style={{ fontWeight: 700 }}>Acme</span>}
          navLinks={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Reports', href: '/reports' },
            { label: 'Analytics', href: '/analytics' },
          ]}
        />
      </OverviewSection>

      <OverviewSection title='With action buttons'>
        <RoboTopbar
          logo={<span style={{ fontWeight: 700 }}>Acme Hub</span>}
          navLinks={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Constellation', href: '/constellation' },
          ]}
          userMenu={
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <RoboButton variant='outline' size='sm'>
                Sign out
              </RoboButton>
              <RoboAvatar fallback='MT' size='sm' />
            </div>
          }
        />
      </OverviewSection>

      <OverviewSection title='With command palette trigger (⌘K)'>
        <RoboTopbar
          logo={<span style={{ fontWeight: 700 }}>Acme Hub</span>}
          navLinks={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Constellation', href: '/constellation' },
          ]}
          commandPaletteTrigger={<CommandPaletteTriggerExample />}
          userMenu={<RoboAvatar fallback='MT' size='sm' />}
        />
      </OverviewSection>
    </OverviewStack>
  ),
};

export const Default: Story = {
  args: {},
};

export const WithLogo: Story = {
  args: {
    logo: (
      <span style={{ fontWeight: 700, fontSize: '1.1rem', letterSpacing: '-0.02em' }}>
        Acme
      </span>
    ),
  },
};

export const WithNavLinks: Story = {
  args: {
    logo: <span style={{ fontWeight: 700 }}>Acme</span>,
    navLinks: [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Reports', href: '/reports' },
      { label: 'Analytics', href: '/analytics' },
    ],
  },
};

export const WithUserMenu: Story = {
  args: {
    logo: <span style={{ fontWeight: 700 }}>Acme</span>,
    navLinks: [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Reports', href: '/reports' },
    ],
    userMenu: (
      <RoboButton variant='outline' size='sm'>
        Matt Taylor
      </RoboButton>
    ),
  },
};

export const WithoutMenuToggle: Story = {
  name: 'Without Hamburger (onMenuToggle omitted)',
  args: {
    onMenuToggle: undefined,
    logo: <span style={{ fontWeight: 700 }}>Acme</span>,
  },
};

export const FullTopbar: Story = {
  args: {
    logo: <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>Acme Hub</span>,
    navLinks: [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Reports', href: '/reports' },
      { label: 'Constellation', href: '/constellation' },
    ],
    userMenu: (
      <RoboAvatar fallback='MT' size='sm' />
    ),
  },
};

/** The sanctioned pattern for making Cmd+K discoverable — pair with a global keydown listener and RoboCommandPalette (see RoboCommandPalette's "In Context — RoboTopbar Integration" story). */
export const WithCommandPaletteTrigger: Story = {
  name: 'With Command Palette Trigger (⌘K)',
  args: {
    logo: <span style={{ fontWeight: 700 }}>Acme</span>,
    navLinks: [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Reports', href: '/reports' },
    ],
    commandPaletteTrigger: <CommandPaletteTriggerExample />,
    userMenu: <RoboAvatar fallback='MT' size='sm' />,
  },
};
