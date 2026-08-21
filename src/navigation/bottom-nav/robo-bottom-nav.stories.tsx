import type { Meta, StoryObj } from '@storybook/react';
import { Home, FileText, BarChart2, Settings, Map } from 'lucide-react';

import { RoboBottomNav } from './robo-bottom-nav';
import type { RoboBottomNavItem } from './robo-bottom-nav';

const navItems: RoboBottomNavItem[] = [
  { label: 'Home', icon: <Home size={20} />, href: '/home' },
  { label: 'Reports', icon: <FileText size={20} />, href: '/reports' },
  { label: 'Map', icon: <Map size={20} />, href: '/map' },
  { label: 'Analytics', icon: <BarChart2 size={20} />, href: '/analytics' },
  { label: 'Settings', icon: <Settings size={20} />, href: '/settings' },
];


export const componentMeta = {
  description: 'Mobile bottom navigation bar for primary app sections',
  category: 'navigation' as const,
  keywords: ['bottom', 'nav', 'mobile', 'tab', 'bar', 'footer', 'navigation', 'app'],
  whenToUse: 'For mobile app bottom navigation with 3-5 primary destinations',
  whenNotToUse: 'For desktop navigation use RoboSidebar; for contextual tabs use RoboTabs',
  pairsWith: ['RoboPageShell', 'RoboBadge'],
  a11y: 'Uses role="navigation" with aria-label; active item indicated with aria-current="page"',
};
const meta: Meta<typeof RoboBottomNav> = {
  title: 'Components/Navigation/RoboBottomNav',
  excludeStories: ['componentMeta'],
    component: RoboBottomNav,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div style={{ height: '100vh', position: 'relative' }}>
        <div style={{ padding: '1rem' }}>Page content here</div>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof RoboBottomNav>;

export const Default: Story = {
  args: {
    items: navItems,
  },
};

export const WithActiveHome: Story = {
  args: {
    items: navItems,
    activePath: '/home',
  },
};

export const WithActiveReports: Story = {
  args: {
    items: navItems,
    activePath: '/reports',
  },
};

export const ThreeItems: Story = {
  args: {
    items: navItems.slice(0, 3),
    activePath: '/home',
  },
};
