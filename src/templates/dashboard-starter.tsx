// =============================================================================
// TEMPLATE: DashboardStarterTemplate — Full starter app (sidebar + Dashboard Grid)
//
// Not one of the numbered 1-7 archetypes — a full "starter app" composition:
// AppShellTemplate's sidebar navigation chrome wrapping the Dashboard Grid
// archetype (Archetype 5) as the primary page. Use this to bootstrap a whole
// new app whose main purpose is an operational dashboard.
//
// Pattern:  RoboSidebar (nav chrome) | DashboardGridTemplate (page + its own topbar)
// State:    Local `view` toggle (main | settings) — gives the Settings footer
//           item, previously a dead href, an actual destination: a minimal
//           settings view carrying the first-run product tour's restart card
//           and a Keybinds section.
// Quick panel: RoboQuickPanel is mounted once in DashboardStarterContent below,
//           wired to a reassignable keybind via useKeybind — Cmd/Ctrl+/
//           toggles it open. Matches AppShellTemplate/MapDashboardStarterTemplate's
//           pattern so every starter ships the same always-available utility
//           panel + shortcut. Reassign it from Settings → Keybinds card
//           (RoboKeybindRecorder), which is what RoboKeybindProvider (below)
//           makes possible.
// Use for:  "What apps can be made" — copy this whole file (plus dashboard-grid.tsx
//           and _shared.tsx) to bootstrap a dashboard-first app from scratch.
//
// Why reuse DashboardGridTemplate instead of duplicating its JSX: the archetype
// content (KPI cards, trend charts, activity table) is real business logic that
// would drift if copied twice. This starter only owns the sidebar/nav chrome —
// copy-adapt that part; the page content stays a single source of truth.
//
// CONSUMER IMPORTS (use these in your app):
//   import { RoboSidebar, RoboQuickPanel, RoboQuickPanelHeader, RoboQuickPanelTitle,
//            RoboQuickPanelBody, RoboQuickPanelPinButton, RoboTabs, RoboTabsList,
//            RoboTabsTrigger, RoboTabsContent } from '@roboborealis/components/navigation';
//   import { RoboThemeProvider, RoboDensityProvider, RoboDateFormatProvider, RoboGlassModeProvider,
//            RoboFontFamilyProvider, RoboTourProvider, RoboProductTour, RoboTourSettingsCard,
//            RoboKeybindProvider, RoboKeybindRecorder, useTheme, useDensity, useDateFormat,
//            useGlassMode, useFontFamily, useKeybind, useKeybindRegistry,
//            DATE_FORMAT_OPTIONS } from '@roboborealis/components/core';
//   import { RoboRadioGroup, RoboSelect } from '@roboborealis/components/forms';
//   import { DashboardGridTemplate } from '@roboborealis/components/templates';
//
// Settings view: Appearance (color theme, mode, density, font family) + Global
// (date format, glass mode) groups, on top of the existing Keybinds/Help groups
// — mirrors AppShellTemplate's SettingsView (minus its map-specific settings
// group) so every starter template ships the same baseline Settings page
// instead of each app reinventing it from scratch.
//
// Root layout requirement: this Settings view's Color theme picker offers all
// three themes (Midnight/Aurora/Neutral), so your app's layout.tsx must import
// all three theme CSS files — importing just one and picking a different
// theme in Settings breaks every --card/--border/--foreground token. Same
// for Font family: import all six @roboborealis/components/fonts/* packages
// so the actual @font-face rules exist. See docs/theming-guide.md.
//
// Product tour: RoboTourProvider + RoboProductTour below register this starter's
// first-run guided tour (KPI row → charts → activity feed → Settings) — it
// auto-runs once (persisted to localStorage) and is restartable any time from
// the "Product tour" card RoboTourSettingsCard renders in the Settings view.
// =============================================================================
//
// COPY-ADAPTABLE TEMPLATE — all TODO comments below are intentional injection
// points, not bugs or tech debt. Copy this file into your app and fill them in.
// See docs/agent-first-architecture.md for the copy-adapt workflow.
// =============================================================================

import * as React from 'react';
import { Home, BarChart2, Layers, Settings } from 'lucide-react';

import { RoboSidebar } from '@/navigation/sidebar/robo-sidebar';
import type { RoboSidebarItem } from '@/navigation/sidebar/robo-sidebar';
import {
  RoboQuickPanel,
  RoboQuickPanelHeader,
  RoboQuickPanelTitle,
  RoboQuickPanelBody,
  RoboQuickPanelPinButton,
  useRoboQuickPanel,
} from '@/navigation/quick-panel/robo-quick-panel';
import { RoboTabs, RoboTabsList, RoboTabsTrigger, RoboTabsContent } from '@/navigation/tabs/robo-tabs';
import { RoboCard, RoboCardHeader, RoboCardBody } from '@/core/card/robo-card';
import { RoboBadge } from '@/core/badge/robo-badge';
import { RoboButton } from '@/core/button/robo-button';
import { RoboDivider } from '@/layout/divider/robo-divider';
import { RoboRadioGroup } from '@/forms/radio-group/robo-radio-group';
import { RoboThemeProvider, useTheme } from '@/core/providers/robo-theme-provider';
import { RoboDensityProvider, useDensity } from '@/core/providers/robo-density-provider';
import { RoboDateFormatProvider, useDateFormat } from '@/core/providers/robo-date-format-provider';
import { RoboGlassModeProvider, useGlassMode } from '@/core/providers/robo-glass-mode-provider';
import { RoboFontFamilyProvider, useFontFamily } from '@/core/providers/robo-font-family-provider';
import { RoboSelect } from '@/forms/select/robo-select';
import { DATE_FORMAT_OPTIONS } from '@/core/formatting/format-date';
import { RoboKeybindProvider, useKeybind, useKeybindRegistry } from '@/core/keybinds/robo-keybind-provider';
import { RoboKeybindRecorder } from '@/core/keybind-recorder/robo-keybind-recorder';
import { RoboTourProvider } from '@/core/tour/robo-tour-provider';
import { RoboProductTour, type RoboTourStep } from '@/core/tour/robo-product-tour';
import { RoboTourSettingsCard } from '@/core/tour/robo-tour-settings-card';
import type { Mode, Theme } from '@/core/providers/robo-theme-provider';
import type { Density } from '@/core/providers/robo-density-provider';
import type { DateFormatId } from '@/core/formatting/format-date';
import type { FontFamily } from '@/core/providers/robo-font-family-provider';

import { MODE_OPTIONS } from './_shared';
import { DashboardGridTemplate } from './dashboard-grid';

// ---------------------------------------------------------------------------
// Style constants — matches AppShellTemplate's own inline-style convention
// ---------------------------------------------------------------------------

const listItemStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '10px 0',
};

const settingsPageStyle: React.CSSProperties = {
  margin: '0 auto',
  width: '100%',
  maxWidth: 640,
  padding: '20px 24px',
  display: 'flex',
  flexDirection: 'column',
  gap: 24,
};

const settingsGroupStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
};

const settingsGroupHeadingStyle: React.CSSProperties = {
  margin: '8px 0 0',
  fontSize: '1rem',
  fontWeight: 600,
  color: 'var(--foreground)',
};

const THEME_OPTIONS: { value: Theme; label: string; description: string }[] = [
  { value: 'midnight', label: 'Midnight', description: 'Dark theme' },
  { value: 'aurora',   label: 'Aurora',   description: 'Light theme' },
  { value: 'sol', label: 'Sol', description: 'Warm desert-sunset palette' },
];

const DENSITY_OPTIONS: { value: Density; label: string; description: string }[] = [
  { value: 'compact',     label: 'Compact',     description: 'Tighter spacing, smaller controls' },
  { value: 'comfortable', label: 'Comfortable', description: 'Default spacing' },
  { value: 'spacious',    label: 'Spacious',    description: 'Looser spacing, larger controls' },
];

const GLASS_MODE_OPTIONS: { value: 'on' | 'off'; label: string; description: string }[] = [
  { value: 'off', label: 'Solid', description: 'Floating panels (e.g. the Quick Panel) use an opaque card background' },
  { value: 'on',  label: 'Glass', description: 'Floating panels use a translucent, blurred glass surface instead' },
];

const FONT_FAMILY_OPTIONS: { value: FontFamily; label: string; description: string }[] = [
  { value: 'inter',        label: 'Inter',        description: 'Previous default — neutral, general-purpose sans-serif' },
  { value: 'dm-sans',      label: 'DM Sans',       description: 'Default — clean geometric sans-serif' },
  { value: 'varela',       label: 'Varela',        description: 'Optimized for small, dense text' },
  { value: 'open-sans',    label: 'Open Sans',     description: 'Optimized for small, dense text' },
  { value: 'opendyslexic', label: 'OpenDyslexic',  description: 'Accessibility font for dyslexic readers' },
  { value: 'sora',         label: 'Sora',          description: 'Rounded, modern geometric sans-serif' },
];

// Matches RoboEntityDossier's own section-header convention (see
// DESIGN.md's "Entity Dossier" pattern) — reused here for the Quick
// Panel's Settings/Notifications tabs so grouped info reads the same way
// across the design system.
const SECTION_HEADER_CLASS = 'text-xs font-semibold uppercase tracking-widest text-[var(--muted-foreground)]';

// ---------------------------------------------------------------------------
// TODO: Replace nav items with your app's actual navigation structure
// ---------------------------------------------------------------------------

const navItems: RoboSidebarItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <Home     size={18} />, href: '/' },
  { id: 'reports',   label: 'Reports',   icon: <BarChart2 size={18} />, href: '/reports' },
  { id: 'data',      label: 'Data',      icon: <Layers    size={18} />, href: '/data' },
];

// ---------------------------------------------------------------------------
// Product tour steps — targets the section ids added to DashboardGridTemplate
// (dashboard-grid.tsx) plus the Settings footer item below, found by its
// visible label since RoboSidebarItem has no data-attribute passthrough.
// ---------------------------------------------------------------------------

function sidebarItemByLabel(label: string): () => HTMLElement | null {
  return () => {
    const nav = document.querySelector('nav[aria-label="Main navigation"]');
    if (!nav) return null;
    for (const el of nav.querySelectorAll('a, button')) {
      if (el.textContent?.trim() === label) return el as HTMLElement;
    }
    return null;
  };
}

const DASHBOARD_TOUR_STEPS: RoboTourStep[] = [
  {
    target: '#dashboard-grid-kpi-row',
    title: 'Key metrics',
    content: 'Your top-line KPIs, at a glance — swap these for your real metrics.',
    skipBeacon: true,
  },
  {
    target: '#dashboard-grid-charts-row',
    title: 'Trends',
    content: 'Charts break down activity and category trends over time.',
    skipBeacon: true,
  },
  {
    target: '#dashboard-grid-activity-feed',
    title: 'Recent activity',
    content: 'A live feed of the latest events — wire this to your real data source.',
    skipBeacon: true,
  },
  {
    target: sidebarItemByLabel('Settings'),
    title: 'Settings',
    content: 'Head to Settings any time to retake this tour.',
    placement: 'right',
    skipBeacon: true,
  },
];

// ---------------------------------------------------------------------------
// Quick Panel tabs — Settings first, Notifications last. Reads
// activeTab/setActiveTab via useRoboQuickPanel() instead of prop-drilling,
// same convention as AppShellTemplate's QuickPanelDemoTabs.
// ---------------------------------------------------------------------------

const NOTIFICATIONS = [
  'New KPI threshold breached',
  'Weekly trend report ready',
  'Activity feed refreshed',
];

function QuickPanelTabsContent() {
  const { mode, setMode } = useTheme();
  const { activeTab, setActiveTab } = useRoboQuickPanel();

  return (
    <RoboTabs value={activeTab} onValueChange={setActiveTab}>
      <RoboTabsList variant='pill'>
        <RoboTabsTrigger variant='pill' value='settings'>Settings</RoboTabsTrigger>
        <RoboTabsTrigger variant='pill' value='notifications' style={{ gap: 6 }}>
          Notifications
          <RoboBadge usage='count' color='destructive' size='sm' count={NOTIFICATIONS.length} aria-label={`Notifications: ${NOTIFICATIONS.length} unread`} />
        </RoboTabsTrigger>
      </RoboTabsList>

      <RoboTabsContent value='settings'>
        <span className={SECTION_HEADER_CLASS}>Mode</span>
        <div style={{ marginTop: 8 }}>
          <RoboRadioGroup options={MODE_OPTIONS} orientation='horizontal' value={mode} onValueChange={(v) => setMode(v as Mode)} />
        </div>
      </RoboTabsContent>

      <RoboTabsContent value='notifications'>
        <span className={SECTION_HEADER_CLASS}>Notifications</span>
        <div style={{ marginTop: 8 }}>
          {NOTIFICATIONS.map((n, i) => (
            <React.Fragment key={n}>
              {i > 0 && <RoboDivider decorative />}
              <p style={{ margin: 0, padding: '8px 0', fontSize: '0.8125rem', color: 'var(--foreground)' }}>{n}</p>
            </React.Fragment>
          ))}
        </div>
      </RoboTabsContent>
    </RoboTabs>
  );
}

// ---------------------------------------------------------------------------
// Settings view — the Settings footer item's first real destination. Mirrors
// AppShellTemplate's SettingsView (minus its Map settings group, which is
// specific to map-based templates): Appearance (color theme, mode, density,
// font family) and Global (date format, glass mode) groups, backed by the
// real RoboThemeProvider / RoboDensityProvider / RoboDateFormatProvider /
// RoboGlassModeProvider / RoboFontFamilyProvider (persist to localStorage by
// default), plus Keybinds and Help as before.
// ---------------------------------------------------------------------------

function SettingsView() {
  const { theme, setTheme, mode, setMode } = useTheme();
  const { density, setDensity } = useDensity();
  const { dateFormat, setDateFormat } = useDateFormat();
  const { glassMode, setGlassMode } = useGlassMode();
  const { fontFamily, setFontFamily } = useFontFamily();
  const { list, setCombo, resetCombo } = useKeybindRegistry();
  const keybinds = list();

  return (
    <div style={settingsPageStyle}>
      <div>
        <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: 'var(--foreground)' }}>Settings</h1>
      </div>

      <div style={settingsGroupStyle}>
        <h2 style={settingsGroupHeadingStyle}>Appearance</h2>

        <RoboCard>
          <RoboCardHeader>Color theme</RoboCardHeader>
          <RoboCardBody>
            <RoboRadioGroup options={THEME_OPTIONS} value={theme} onValueChange={(v) => setTheme(v as Theme)} />
          </RoboCardBody>
        </RoboCard>

        <RoboCard>
          <RoboCardHeader>Mode</RoboCardHeader>
          <RoboCardBody>
            <RoboRadioGroup options={MODE_OPTIONS} orientation='horizontal' value={mode} onValueChange={(v) => setMode(v as Mode)} />
          </RoboCardBody>
        </RoboCard>

        <RoboCard>
          <RoboCardHeader>Density</RoboCardHeader>
          <RoboCardBody>
            <RoboRadioGroup options={DENSITY_OPTIONS} value={density} onValueChange={(v) => setDensity(v as Density)} />
          </RoboCardBody>
        </RoboCard>

        <RoboCard>
          <RoboCardHeader>Font family</RoboCardHeader>
          <RoboCardBody>
            <RoboRadioGroup options={FONT_FAMILY_OPTIONS} value={fontFamily} onValueChange={(v) => setFontFamily(v as FontFamily)} />
          </RoboCardBody>
        </RoboCard>
      </div>

      <div style={settingsGroupStyle}>
        <h2 style={settingsGroupHeadingStyle}>Global</h2>

        <RoboCard>
          <RoboCardHeader>Date format</RoboCardHeader>
          <RoboCardBody>
            <RoboSelect
              options={DATE_FORMAT_OPTIONS}
              value={dateFormat}
              onValueChange={(v) => setDateFormat(v as DateFormatId)}
            />
          </RoboCardBody>
        </RoboCard>

        <RoboCard>
          <RoboCardHeader>Glass mode</RoboCardHeader>
          <RoboCardBody>
            <RoboRadioGroup
              options={GLASS_MODE_OPTIONS}
              value={glassMode ? 'on' : 'off'}
              onValueChange={(v) => setGlassMode(v === 'on')}
            />
          </RoboCardBody>
        </RoboCard>
      </div>

      <div style={settingsGroupStyle}>
        <h2 style={settingsGroupHeadingStyle}>Keybinds</h2>
        <RoboCard>
          <RoboCardHeader>Shortcuts</RoboCardHeader>
          <RoboCardBody>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {keybinds.map((keybind) => {
                const conflict = keybinds.find((other) => other.id !== keybind.id && other.combo === keybind.combo);
                return (
                  <div key={keybind.id} style={listItemStyle}>
                    <span style={{ fontSize: '0.875rem', color: 'var(--foreground)' }}>{keybind.label}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <RoboKeybindRecorder
                        combo={keybind.combo}
                        onChange={(next) => setCombo(keybind.id, next)}
                        conflictWith={conflict?.label}
                      />
                      {keybind.isCustomized && (
                        <RoboButton variant='ghost' size='sm' onClick={() => resetCombo(keybind.id)}>
                          Reset
                        </RoboButton>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </RoboCardBody>
        </RoboCard>
      </div>

      <div style={settingsGroupStyle}>
        <h2 style={settingsGroupHeadingStyle}>Help</h2>
        <RoboTourSettingsCard />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Template component
// ---------------------------------------------------------------------------

function DashboardStarterContent() {
  const [view, setView] = React.useState<'main' | 'settings'>('main');
  const [quickPanelOpen, setQuickPanelOpen] = React.useState(false);
  const [quickPanelActiveTab, setQuickPanelActiveTab] = React.useState('settings');

  // Reassignable from Settings → Keybinds. Toggles the quick panel open/closed
  // from anywhere in the app. Same id/defaultCombo as the other starters —
  // copy-adapting more than one into the same app shouldn't collide.
  useKeybind(
    { id: 'robo.quick-panel.toggle', label: 'Toggle Quick Panel', defaultCombo: 'mod+/' },
    () => setQuickPanelOpen((o) => !o)
  );

  // Pinned below the scrollable nav list, above the sidebar's own collapse
  // toggle — matches AppShellTemplate's ("Basic App") Settings placement.
  // TODO: point this at your real settings route instead of the local view toggle.
  const footerItems: RoboSidebarItem[] = [
    { id: 'settings', label: 'Settings', icon: <Settings size={18} />, onSelect: () => setView('settings') },
  ];

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <RoboProductTour
        id='dashboard-starter'
        label='Dashboard tour'
        steps={DASHBOARD_TOUR_STEPS}
        onBeforeStart={() => setView('main')}
      />
      {/* Double-click anywhere in the expanded body (besides interactive controls) also pins it
          open — same as the explicit pin button, just discoverable without hunting for it. */}
      <RoboQuickPanel
        open={quickPanelOpen}
        onOpenChange={setQuickPanelOpen}
        activeTab={quickPanelActiveTab}
        onActiveTabChange={setQuickPanelActiveTab}
      >
        <RoboQuickPanelHeader>
          <RoboQuickPanelTitle>Quick panel</RoboQuickPanelTitle>
          <RoboQuickPanelPinButton />
        </RoboQuickPanelHeader>
        <RoboQuickPanelBody>
          <QuickPanelTabsContent />
        </RoboQuickPanelBody>
      </RoboQuickPanel>
      {/* TODO: Replace activePath with your router's current path (e.g. usePathname()) */}
      {/* Click the toggle button (built into RoboSidebar) to collapse/expand the rail;
          nothing to wire up. */}
      <RoboSidebar
        items={navItems}
        footerItems={footerItems}
        activePath={view === 'main' ? '/' : undefined}
      />
      <div style={{ flex: 1, minWidth: 0, overflow: 'auto' }}>
        {view === 'main' ? <DashboardGridTemplate /> : <SettingsView />}
      </div>
    </div>
  );
}

export function DashboardStarterTemplate() {
  return (
    // Starter apps bootstrap a whole new app, so they self-provide keybind +
    // theme + density context (same as AppShellTemplate). If your app already
    // mounts these providers at the root, remove this wrapping when you
    // copy-adapt. RoboKeybindProvider is outermost so useKeybind (called
    // inside DashboardStarterContent) can find it.
    <RoboKeybindProvider>
      <RoboThemeProvider>
        <RoboDensityProvider>
          <RoboDateFormatProvider>
            <RoboGlassModeProvider>
              <RoboFontFamilyProvider>
                <RoboTourProvider>
                  <DashboardStarterContent />
                </RoboTourProvider>
              </RoboFontFamilyProvider>
            </RoboGlassModeProvider>
          </RoboDateFormatProvider>
        </RoboDensityProvider>
      </RoboThemeProvider>
    </RoboKeybindProvider>
  );
}
