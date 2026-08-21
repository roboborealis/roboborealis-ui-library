import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  Map,
  FileText,
  Satellite,
  Bell,
  Settings,
  Search,
  ChevronRight,
  LogOut,
  Users,
  BarChart2,
} from 'lucide-react';

import { RoboBottomNav } from './bottom-nav/robo-bottom-nav';
import { RoboBreadcrumbs } from './breadcrumbs/robo-breadcrumbs';
import { RoboCommandPalette, type CommandGroup } from './command-palette/robo-command-palette';
import { RoboSidebar } from './sidebar/robo-sidebar';
import type { RoboSidebarItem } from './sidebar/robo-sidebar';
import { RoboTabs, RoboTabsList, RoboTabsTrigger, RoboTabsContent } from './tabs/robo-tabs';
import { RoboTopbar } from './topbar/robo-topbar';
import { RoboCommandHints } from './command-palette/robo-command-hints';
import { OverviewAccordion, OverviewGroup, StoryLink } from '../lib/storybook/overview-layout';

// ---------------------------------------------------------------------------
// Meta — overview page, no single component
// ---------------------------------------------------------------------------

const meta: Meta = {
  title: 'Components/Navigation',
  parameters: {
    layout: 'fullscreen',
  },
};
export default meta;

type Story = StoryObj;

// ---------------------------------------------------------------------------
// Shared data — defined at module level
// ---------------------------------------------------------------------------

const bottomNavItems = [
  { label: 'Map', icon: <Map size={20} />, href: '/map' },
  { label: 'Reports', icon: <FileText size={20} />, href: '/reports' },
  { label: 'Satellites', icon: <Satellite size={20} />, href: '/satellites' },
  { label: 'Alerts', icon: <Bell size={20} />, href: '/alerts' },
  { label: 'Settings', icon: <Settings size={20} />, href: '/settings' },
];

const breadcrumbsShort = [
  { label: 'Home', href: '/' },
  { label: 'Mission Ops', href: '/mission-ops' },
  { label: 'Satellite Reports' },
];

const breadcrumbsOverflow = [
  { label: 'Home', href: '/' },
  { label: 'Mission Ops', href: '/mission-ops' },
  { label: 'Low Earth Orbit', href: '/mission-ops/low-earth-orbit' },
  { label: 'Satellite Reports', href: '/mission-ops/low-earth-orbit/satellite-reports' },
  { label: 'Final Reports', href: '/mission-ops/low-earth-orbit/satellite-reports/final' },
  { label: 'FR Report #1234' },
];

const sidebarItems: RoboSidebarItem[] = [
  { id: 'map', label: 'Live Map', icon: <Map size={18} />, href: '/map' },
  {
    id: 'reports',
    label: 'Reports',
    icon: <FileText size={18} />,
    children: [
      { id: 'reports-fr', label: 'Final Reports', icon: <ChevronRight size={16} />, href: '/reports/fr' },
      { id: 'reports-pr', label: 'Position Reports', icon: <ChevronRight size={16} />, href: '/reports/pr' },
    ],
  },
  { id: 'satellites', label: 'Satellites', icon: <Satellite size={18} />, href: '/satellites' },
  { id: 'alerts', label: 'Alerts', icon: <Bell size={18} />, href: '/alerts' },
  { id: 'settings', label: 'Settings', icon: <Settings size={18} />, href: '/settings' },
];

const commandGroups: CommandGroup[] = [
  {
    heading: 'Navigation',
    items: [
      { id: 'map', label: 'Live Map', icon: <Map className='h-4 w-4' />, shortcut: 'G M', onSelect: () => {} },
      { id: 'satellites', label: 'Satellite Registry', icon: <Satellite className='h-4 w-4' />, shortcut: 'G V', onSelect: () => {} },
      { id: 'reports', label: 'Reports', icon: <FileText className='h-4 w-4' />, shortcut: 'G R', onSelect: () => {} },
      { id: 'analytics', label: 'Analytics', icon: <BarChart2 className='h-4 w-4' />, onSelect: () => {} },
    ],
  },
  {
    heading: 'Actions',
    items: [
      { id: 'new-report', label: 'New Mission Report', icon: <FileText className='h-4 w-4' />, shortcut: 'N R', onSelect: () => {} },
      { id: 'search', label: 'Search Satellites', icon: <Search className='h-4 w-4' />, shortcut: '/', onSelect: () => {} },
    ],
  },
  {
    heading: 'Account',
    items: [
      { id: 'profile', label: 'My Profile', icon: <Users className='h-4 w-4' />, onSelect: () => {} },
      { id: 'logout', label: 'Sign Out', icon: <LogOut className='h-4 w-4' />, onSelect: () => {} },
    ],
  },
];

const topbarLogoElement = (
  <span style={{ fontWeight: 700, fontSize: '1.1rem', letterSpacing: '-0.02em' }}>
    Acme
  </span>
);

const topbarNavLinks = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Reports', href: '/reports' },
  { label: 'Constellation', href: '/constellation' },
];

const topbarUserMenu = (
  <div
    style={{
      width: 32,
      height: 32,
      borderRadius: '50%',
      background: 'var(--primary)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--primary-foreground)',
      fontSize: '13px',
      fontWeight: 600,
      cursor: 'pointer',
    }}
  >
    MT
  </div>
);

// ---------------------------------------------------------------------------
// Shared styles — module level, never inline
// ---------------------------------------------------------------------------

const pageStyle: React.CSSProperties = {
  padding: '1.5rem',
  background: 'var(--background)',
  minHeight: '100vh',
  color: 'var(--foreground)',
};

const cardStyle: React.CSSProperties = {
  background: 'var(--card)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius)',
  overflow: 'hidden',
};

const sidebarPreviewStyle: React.CSSProperties = {
  display: 'flex',
  height: 320,
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius)',
  overflow: 'hidden',
};

const sidebarContentStyle: React.CSSProperties = {
  flex: 1,
  padding: '1rem',
  color: 'var(--muted-foreground)',
  fontSize: '0.875rem',
};

const navBottomWrapperStyle: React.CSSProperties = {
  position: 'relative',
  height: 72,
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius)',
  overflow: 'hidden',
};

const breadcrumbRowStyle: React.CSSProperties = {
  padding: '0.75rem 1rem',
  background: 'var(--card)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius)',
  marginBottom: '0.5rem',
};

const subLabelStyle: React.CSSProperties = {
  fontSize: '0.7rem',
  color: 'var(--muted-foreground)',
  marginBottom: '0.35rem',
};

const tabsGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '1rem',
};

const tabsCardStyle: React.CSSProperties = {
  padding: '1rem',
  background: 'var(--card)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius)',
};

const tabsContentStyle: React.CSSProperties = {
  padding: '0.75rem',
  background: 'var(--muted)',
  borderRadius: 'var(--radius)',
  fontSize: '0.875rem',
  color: 'var(--muted-foreground)',
};

const commandPlaceholderStyle: React.CSSProperties = {
  padding: '1rem',
  background: 'var(--card)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius)',
  fontSize: '0.875rem',
  color: 'var(--muted-foreground)',
};

// ---------------------------------------------------------------------------
// Sub-components — defined at module level (not inside render)
// ---------------------------------------------------------------------------

function CommandPaletteSection() {
  const [open, setOpen] = React.useState(true);

  return (
    <div style={commandPlaceholderStyle}>
      <p style={{ marginBottom: '0.5rem' }}>
        Command palette is open by default. Press ESC or click outside to close, then
        re-open with the button below.
      </p>
      <button
        type='button'
        onClick={() => setOpen(true)}
        style={{
          padding: '4px 12px',
          borderRadius: 'var(--radius)',
          border: '1px solid var(--border)',
          background: 'var(--muted)',
          cursor: 'pointer',
          fontSize: '13px',
          color: 'var(--foreground)',
        }}
      >
        <Search style={{ display: 'inline', width: 13, height: 13, marginRight: 6 }} />
        Re-open palette
      </button>
      <RoboCommandPalette
        open={open}
        onOpenChange={setOpen}
        groups={commandGroups}
        placeholder='Search commands, pages, actions…'
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Story
// ---------------------------------------------------------------------------

export const Overview: Story = {
  name: 'Navigation Overview',
  render: () => (
    <div style={pageStyle}>
      <OverviewAccordion>

        {/* Topbar */}
        <OverviewGroup value="topbar" title="Topbar">
          <div style={cardStyle}>
            <RoboTopbar
              logo={topbarLogoElement}
              navLinks={topbarNavLinks}
              userMenu={topbarUserMenu}
            />
          </div>
        </OverviewGroup>

        {/* Sidebar */}
        <OverviewGroup value="sidebar" title="Sidebar">
          <div style={sidebarPreviewStyle}>
            <RoboSidebar items={sidebarItems} activePath='/map' />
            <div style={sidebarContentStyle}>Main content area</div>
          </div>
        </OverviewGroup>

        {/* Bottom Nav */}
        <OverviewGroup value="bottom-nav" title="Bottom Nav">
          <div style={navBottomWrapperStyle}>
            <RoboBottomNav
              items={bottomNavItems}
              activePath='/satellites'
              style={{ position: 'absolute', bottom: 0 }}
            />
          </div>
        </OverviewGroup>

        {/* Breadcrumbs */}
        <OverviewGroup value="breadcrumbs" title="Breadcrumbs">
          <p style={subLabelStyle}>Default (3 items)</p>
          <div style={breadcrumbRowStyle}>
            <RoboBreadcrumbs items={breadcrumbsShort} />
          </div>
          <p style={subLabelStyle}>Overflow (6 items, maxItems=4)</p>
          <div style={breadcrumbRowStyle}>
            <RoboBreadcrumbs items={breadcrumbsOverflow} maxItems={4} />
          </div>
        </OverviewGroup>

        {/* Tabs */}
        <OverviewGroup value="tabs" title="Tabs">
          <div style={tabsGridStyle}>
            <div style={tabsCardStyle}>
              <p style={subLabelStyle}>Horizontal</p>
              <RoboTabs defaultValue='overview' orientation='horizontal'>
                <RoboTabsList orientation='horizontal'>
                  <RoboTabsTrigger value='overview' orientation='horizontal'>Overview</RoboTabsTrigger>
                  <RoboTabsTrigger value='satellites' orientation='horizontal'>Satellites</RoboTabsTrigger>
                  <RoboTabsTrigger value='reports' orientation='horizontal'>Reports</RoboTabsTrigger>
                  <RoboTabsTrigger value='alerts' orientation='horizontal'>Alerts</RoboTabsTrigger>
                </RoboTabsList>
                <RoboTabsContent value='overview' orientation='horizontal'>
                  <div style={tabsContentStyle}>Constellation-wide metrics and active mission summary.</div>
                </RoboTabsContent>
                <RoboTabsContent value='satellites' orientation='horizontal'>
                  <div style={tabsContentStyle}>Registered satellite catalog and NORAD ID index.</div>
                </RoboTabsContent>
                <RoboTabsContent value='reports' orientation='horizontal'>
                  <div style={tabsContentStyle}>FR, PR, and DR mission report archive.</div>
                </RoboTabsContent>
                <RoboTabsContent value='alerts' orientation='horizontal'>
                  <div style={tabsContentStyle}>Active anomaly alerts and zone notifications.</div>
                </RoboTabsContent>
              </RoboTabs>
            </div>
            <div style={tabsCardStyle}>
              <p style={subLabelStyle}>Vertical</p>
              <RoboTabs defaultValue='overview' orientation='vertical'>
                <RoboTabsList orientation='vertical'>
                  <RoboTabsTrigger value='overview' orientation='vertical'>Overview</RoboTabsTrigger>
                  <RoboTabsTrigger value='satellites' orientation='vertical'>Satellites</RoboTabsTrigger>
                  <RoboTabsTrigger value='reports' orientation='vertical'>Reports</RoboTabsTrigger>
                  <RoboTabsTrigger value='alerts' orientation='vertical'>Alerts</RoboTabsTrigger>
                </RoboTabsList>
                <RoboTabsContent value='overview' orientation='vertical'>
                  <div style={tabsContentStyle}>Constellation-wide metrics and active mission summary.</div>
                </RoboTabsContent>
                <RoboTabsContent value='satellites' orientation='vertical'>
                  <div style={tabsContentStyle}>Registered satellite catalog and NORAD ID index.</div>
                </RoboTabsContent>
                <RoboTabsContent value='reports' orientation='vertical'>
                  <div style={tabsContentStyle}>FR, PR, and DR mission report archive.</div>
                </RoboTabsContent>
                <RoboTabsContent value='alerts' orientation='vertical'>
                  <div style={tabsContentStyle}>Active anomaly alerts and zone notifications.</div>
                </RoboTabsContent>
              </RoboTabs>
            </div>
          </div>
        </OverviewGroup>

        {/* Command Palette */}
        <OverviewGroup value="command-palette" title="Command Palette">
          <CommandPaletteSection />
        </OverviewGroup>

        {/* Command Hints */}
        <OverviewGroup value="command-hints" title="Command Hints">
          <RoboCommandHints />
        </OverviewGroup>

        {/* Quick Panel (stateful — link out) */}
        <OverviewGroup value="quick-panel" title="Quick Panel">
          <p style={{ margin: 0, color: 'var(--secondary-text)' }}>
            A pinnable, tabbed floating panel. It is stateful and glass-mode aware — see{' '}
            <StoryLink id="components-navigation-roboquickpanel--default">the RoboQuickPanel stories</StoryLink>.
          </p>
        </OverviewGroup>

      </OverviewAccordion>
    </div>
  ),
};
