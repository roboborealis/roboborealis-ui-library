import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Home, FileText, Settings } from 'lucide-react';

import { RoboPageShell } from './robo-page-shell';
import { OverviewStack, OverviewSection } from '../../lib/storybook/overview-layout';

const MockSidebar = () => (
  <nav
    aria-label='Main navigation'
    style={{
      width: '14rem',
      height: '100%',
      background: 'var(--card)',
      borderRight: '1px solid var(--border)',
      padding: '1rem 0.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.25rem',
    }}
  >
    {[
      { label: 'Home', icon: <Home size={16} />, href: '/home' },
      { label: 'Reports', icon: <FileText size={16} />, href: '/reports' },
      { label: 'Settings', icon: <Settings size={16} />, href: '/settings' },
    ].map((item) => (
      <a
        key={item.href}
        href={item.href}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 0.75rem',
          borderRadius: '6px',
          textDecoration: 'none',
          fontSize: '14px',
          color: 'var(--foreground)',
        }}
      >
        {item.icon}
        {item.label}
      </a>
    ))}
  </nav>
);

const MockTopbar = () => (
  <header
    role='banner'
    aria-label='Top navigation'
    style={{
      height: '3.5rem',
      display: 'flex',
      alignItems: 'center',
      padding: '0 1rem',
      background: 'var(--card)',
      borderBottom: '1px solid var(--border)',
      fontWeight: 700,
    }}
  >
    Acme Hub
  </header>
);

const MockContent = () => (
  <div style={{ padding: '1.5rem' }}>
    <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>
      Dashboard
    </h1>
    <p style={{ color: 'var(--muted-foreground)', lineHeight: 1.6 }}>
      Main content area. This is the scrollable region below the topbar.
    </p>
  </div>
);


export const componentMeta = {
  description: 'Full-page layout scaffold with sidebar, topbar, and content area',
  category: 'layout' as const,
  keywords: ['page', 'shell', 'layout', 'scaffold', 'app', 'chrome', 'sidebar', 'topbar', 'wrapper'],
  whenToUse: 'As the outermost layout wrapper for every page — provides sidebar, topbar, and content area',
  whenNotToUse: 'For map-centric pages compose RoboMapbox + RoboFloatingPanel directly (map archetypes have no template); for embedded widgets skip the shell',
  pairsWith: ['RoboSidebar', 'RoboTopbar', 'RoboBreadcrumbs', 'RoboDensityProvider'],
  a11y: 'Provides proper landmark structure (banner, navigation, main); skip-to-content link included',
};
const meta: Meta<typeof RoboPageShell> = {
  title: 'Components/Layout/RoboPageShell',
  excludeStories: ['componentMeta'],
    component: RoboPageShell,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};
export default meta;

type Story = StoryObj<typeof RoboPageShell>;

/** All shell configurations shown together as framed previews. */
export const AllVariants: Story = {
  name: 'All Variants',
  parameters: { layout: 'padded' },
  render: () => {
    const frameBoxClass = 'h-64 overflow-hidden rounded-[var(--radius)] border border-[var(--border)]';
    return (
      <OverviewStack>
        <OverviewSection title='Content only'>
          <div className={frameBoxClass}>
            <RoboPageShell>
              <MockContent />
            </RoboPageShell>
          </div>
        </OverviewSection>
        <OverviewSection title='With topbar'>
          <div className={frameBoxClass}>
            <RoboPageShell topbar={<MockTopbar />}>
              <MockContent />
            </RoboPageShell>
          </div>
        </OverviewSection>
        <OverviewSection title='With sidebar'>
          <div className={frameBoxClass}>
            <RoboPageShell sidebar={<MockSidebar />}>
              <MockContent />
            </RoboPageShell>
          </div>
        </OverviewSection>
        <OverviewSection title='Full layout'>
          <div className={frameBoxClass}>
            <RoboPageShell sidebar={<MockSidebar />} topbar={<MockTopbar />}>
              <MockContent />
            </RoboPageShell>
          </div>
        </OverviewSection>
      </OverviewStack>
    );
  },
};

export const ContentOnly: Story = {
  render: () => (
    <RoboPageShell>
      <MockContent />
    </RoboPageShell>
  ),
};

export const WithTopbar: Story = {
  render: () => (
    <RoboPageShell topbar={<MockTopbar />}>
      <MockContent />
    </RoboPageShell>
  ),
};

export const WithSidebar: Story = {
  render: () => (
    <RoboPageShell sidebar={<MockSidebar />}>
      <MockContent />
    </RoboPageShell>
  ),
};

export const FullLayout: Story = {
  render: () => (
    <RoboPageShell sidebar={<MockSidebar />} topbar={<MockTopbar />}>
      <MockContent />
    </RoboPageShell>
  ),
};
