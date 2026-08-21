import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Map, FileText, Satellite, Bell, Settings } from 'lucide-react';

import { RoboBottomNav } from './robo-bottom-nav';
import type { RoboBottomNavItem } from './robo-bottom-nav';
import { OverviewStack, OverviewSection } from '../../lib/storybook/overview-layout';

const meta: Meta<typeof RoboBottomNav> = {
  title: 'Components/Navigation/RoboBottomNav',
  component: RoboBottomNav,
  parameters: {
    layout: 'fullscreen',
  },
};
export default meta;

type Story = StoryObj<typeof RoboBottomNav>;

// ---------------------------------------------------------------------------
// Item sets
// ---------------------------------------------------------------------------

const threeItems: RoboBottomNavItem[] = [
  { label: 'Map', icon: <Map size={20} />, href: '/map' },
  { label: 'Reports', icon: <FileText size={20} />, href: '/reports' },
  { label: 'Settings', icon: <Settings size={20} />, href: '/settings' },
];

const fourItems: RoboBottomNavItem[] = [
  { label: 'Map', icon: <Map size={20} />, href: '/map' },
  { label: 'Reports', icon: <FileText size={20} />, href: '/reports' },
  { label: 'Satellites', icon: <Satellite size={20} />, href: '/satellites' },
  { label: 'Settings', icon: <Settings size={20} />, href: '/settings' },
];

const fiveItems: RoboBottomNavItem[] = [
  { label: 'Map', icon: <Map size={20} />, href: '/map' },
  { label: 'Reports', icon: <FileText size={20} />, href: '/reports' },
  { label: 'Satellites', icon: <Satellite size={20} />, href: '/satellites' },
  { label: 'Alerts', icon: <Bell size={20} />, href: '/alerts' },
  { label: 'Settings', icon: <Settings size={20} />, href: '/settings' },
];

// ---------------------------------------------------------------------------
// Shared decorator
// ---------------------------------------------------------------------------

const pageDecorator = (Story: React.ComponentType) => (
  <div style={{ height: '100vh', position: 'relative', background: 'var(--background)' }}>
    <div style={{ padding: '1rem', paddingBottom: '6rem', color: 'var(--foreground)' }}>
      Page content here
    </div>
    <Story />
  </div>
);

// ---------------------------------------------------------------------------
// Nav preview wrapper — defined at module level, not inside render
// ---------------------------------------------------------------------------

const navWrapperStyle: React.CSSProperties = {
  position: 'relative',
  height: 72,
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius)',
  overflow: 'hidden',
  marginBottom: '1rem',
};

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

export const AllVariants: Story = {
  name: 'All Variants',
  render: () => (
    <OverviewStack>
      <OverviewSection title='3-item nav — active: Map'>
        <div style={navWrapperStyle}>
          <RoboBottomNav
            items={threeItems}
            activePath='/map'
            style={{ position: 'absolute', bottom: 0 }}
          />
        </div>
      </OverviewSection>

      <OverviewSection title='4-item nav (default) — active: Reports'>
        <div style={navWrapperStyle}>
          <RoboBottomNav
            items={fourItems}
            activePath='/reports'
            style={{ position: 'absolute', bottom: 0 }}
          />
        </div>
      </OverviewSection>

      <OverviewSection title='5-item nav — active: Alerts'>
        <div style={{ ...navWrapperStyle }}>
          <RoboBottomNav
            items={fiveItems}
            activePath='/alerts'
            style={{ position: 'absolute', bottom: 0 }}
          />
        </div>
      </OverviewSection>
    </OverviewStack>
  ),
  decorators: [pageDecorator],
};
