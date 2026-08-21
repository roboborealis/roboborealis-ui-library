import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Home, BarChart2, FileText, Settings, Users, ChevronRight } from 'lucide-react';

import { RoboSidebar } from './robo-sidebar';
import type { RoboSidebarItem } from './robo-sidebar';
import { OverviewStack, OverviewSection } from '../../lib/storybook/overview-layout';

// ---------------------------------------------------------------------------
// Content background — a plain filled surface behind the sidebar demos, so the
// collapsed rail's own tooltips (side='right') can be verified rendering on top
// of sibling content.
// ---------------------------------------------------------------------------

const navItems: RoboSidebarItem[] = [
  { id: 'home', label: 'Home', icon: <Home size={18} />, href: '/home' },
  {
    id: 'reports',
    label: 'Reports',
    icon: <FileText size={18} />,
    children: [
      { id: 'reports-fr', label: 'Final Reports', icon: <ChevronRight size={16} />, href: '/reports/fr' },
      { id: 'reports-pr', label: 'Position Reports', icon: <ChevronRight size={16} />, href: '/reports/pr' },
    ],
  },
  { id: 'analytics', label: 'Analytics', icon: <BarChart2 size={18} />, href: '/analytics' },
  { id: 'users', label: 'Users', icon: <Users size={18} />, href: '/users' },
  { id: 'settings', label: 'Settings', icon: <Settings size={18} />, href: '/settings' },
];


export const componentMeta = {
  description:
    'Collapsible vertical navigation panel for primary app structure. Click the toggle button to collapse to an icon-only rail or expand back — a plain click-to-toggle model with no hover-preview or overlay.',
  category: 'navigation' as const,
  keywords: ['sidebar', 'nav', 'menu', 'navigation', 'panel', 'collapse', 'drawer', 'rail', 'icon'],
  whenToUse: 'For primary desktop app navigation — collapsible sidebar with sections and icons',
  whenNotToUse: 'For mobile bottom nav use RoboBottomNav; for contextual tabs use RoboTabs',
  pairsWith: ['RoboPageShell', 'RoboTopbar', 'RoboBadge', 'RoboTooltip'],
  a11y: 'Uses role="navigation" with aria-label — always exactly one landmark. Collapsed state shows tooltips for icon-only items; the toggle button is a plain, single-click control.',
};
const meta: Meta<typeof RoboSidebar> = {
  title: 'Components/Navigation/RoboSidebar',
  excludeStories: ['componentMeta'],
    component: RoboSidebar,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div style={{ height: '100vh', display: 'flex' }}>
        <Story />
        <div style={{ flex: 1, padding: '1rem' }}>Main content area</div>
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof RoboSidebar>;

export const AllVariants: Story = {
  name: 'All Variants',
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [(Story) => <Story />],
  render: () => (
    <OverviewStack>
      <OverviewSection title='Expanded (default)'>
        <div style={{ display: 'flex', height: 420, border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
          <RoboSidebar items={navItems} activePath='/home' />
        </div>
      </OverviewSection>

      <OverviewSection title='Minimal items'>
        <div style={{ display: 'flex', height: 420, border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
          <RoboSidebar
            items={[
              { id: 'home', label: 'Home', icon: <Home size={18} />, href: '/home' },
              { id: 'settings', label: 'Settings', icon: <Settings size={18} />, href: '/settings' },
            ]}
            activePath='/home'
          />
        </div>
      </OverviewSection>

      <OverviewSection title='Collapsed (icon-only rail)'>
        <div style={{ display: 'flex', height: 420, border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
          <RoboSidebar items={navItems} activePath='/home' collapsed />
        </div>
      </OverviewSection>
    </OverviewStack>
  ),
};

export const Default: Story = {
  args: {
    items: navItems,
    activePath: '/home',
  },
};

/**
 * Starts collapsed to the icon-only rail. Click the toggle button at the
 * bottom to expand back to the full labeled nav.
 */
export const Collapsed: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Click the toggle button to expand the collapsed rail back to the full labeled nav.',
      },
    },
  },
  args: {
    items: navItems,
    activePath: '/home',
    collapsed: true,
  },
};

export const WithActiveReports: Story = {
  args: {
    items: navItems,
    activePath: '/analytics',
  },
};

export const NoActiveItem: Story = {
  args: {
    items: navItems,
  },
};

export const MinimalItems: Story = {
  args: {
    items: [
      { id: 'home', label: 'Home', icon: <Home size={18} />, href: '/home' },
      { id: 'settings', label: 'Settings', icon: <Settings size={18} />, href: '/settings' },
    ],
    activePath: '/home',
  },
};

export const WithFooterItems: Story = {
  name: 'With Pinned Footer Item (Settings)',
  args: {
    items: [
      { id: 'home', label: 'Home', icon: <Home size={18} />, href: '/home' },
      { id: 'analytics', label: 'Analytics', icon: <BarChart2 size={18} />, href: '/analytics' },
      { id: 'users', label: 'Users', icon: <Users size={18} />, href: '/users' },
    ],
    footerItems: [
      { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
    ],
    activePath: '/home',
  },
};
