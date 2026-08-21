// =============================================================================
// TEMPLATE: AppShellTemplate — Foundational template (not part of the 7-archetype
// decision tree — see design-ui-feature.md). The mandatory starting point for any
// new app; all other Starter templates in this directory build on this shell.
//
// Pattern:  RoboPageShell + RoboSidebar (with pinned Settings footer) + RoboTopbar
//           + content area that swaps between a dashboard view and a working
//           settings page (color theme + mode + density + date format + glass mode).
// State:    Local `view` toggle (dashboard | settings) — no router needed to
//           see the full pattern working. Swap for real routes in your app.
// Use for:  The default starting point for any new app. Wire up your router's
//           active path, add nav items, replace dashboard widgets with your
//           real data components.
//
// CONSUMER IMPORTS (use these in your app):
//   import { RoboPageShell } from '@roboborealis/components/layout';
//   import { RoboSidebar, RoboTopbar, RoboTabs, RoboTabsList, RoboTabsTrigger, RoboTabsContent,
//            RoboQuickPanel, RoboQuickPanelHeader, RoboQuickPanelTitle, RoboQuickPanelBody,
//            RoboQuickPanelPinButton, useRoboQuickPanel } from '@roboborealis/components/navigation';
//   import { RoboCard, RoboCardHeader, RoboCardBody, RoboStatCard, RoboRadioGroup, RoboSelect,
//            RoboSlider, RoboSwitch, RoboInput, RoboBadge, RoboDivider, RoboThemeProvider,
//            RoboDensityProvider, RoboDateFormatProvider, RoboGlassModeProvider,
//            RoboFontFamilyProvider, RoboKeybindProvider,
//            RoboKeybindRecorder, RoboTourProvider, RoboProductTour, RoboTourSettingsCard,
//            useTheme, useDensity, useDateFormat, useGlassMode,
//            useFontFamily, useKeybind,
//            useKeybindRegistry } from '@roboborealis/components/core';
//   import { RoboAlert } from '@roboborealis/components/feedback';
//
// Product tour: RoboTourProvider (below) plus one <RoboProductTour> registers
// this app's first-run guided tour — it auto-runs once (persisted to
// localStorage), walks a new user through the sidebar, command palette,
// main content, then Settings, and is restartable any time from the
// "Product tour" card RoboTourSettingsCard adds to SettingsView.
//
// Glass mode: wrapping the app in RoboGlassModeProvider (below) is what makes
// every RoboFloatingPanel/RoboSheet/RoboHoverSheet/RoboInfoIsland in the app
// default to a translucent glass surface instead of a solid one — this is
// the "bake it into every app from here on" hook for that setting.
//
// Quick panel: RoboQuickPanel is mounted once in AppShellContent below, wired
// to two reassignable keybinds via useKeybind — Cmd/Ctrl+/ toggles it open,
// and L jumps straight to its Layers tab. Both are reassignable from the
// Keybinds card in Settings (RoboKeybindRecorder), which is what
// RoboKeybindProvider (below) makes possible.
//
// Settings groups: SettingsView organizes its cards into labeled groups
// (Appearance, Global, Map settings, Keybinds) via a plain heading above each
// cluster — this repo's actual convention for grouping settings (see
// the design docs), not an accordion or nested cards. Add new settings to
// whichever existing group fits, or start a new one the same way.
//
// Root layout requirement: SettingsView's Color theme picker offers all three
// themes (Midnight/Aurora/Neutral), so your app's layout.tsx must import all
// three theme CSS files — importing just one and picking a different theme in
// Settings breaks every --card/--border/--foreground token. Same for Font
// family: import all six @roboborealis/components/fonts/* packages so the
// actual @font-face rules exist. See docs/theming-guide.md.
// =============================================================================
//
// COPY-ADAPTABLE TEMPLATE — all TODO comments below are intentional injection
// points, not bugs or tech debt. Copy this file into your app and fill them in.
// See docs/agent-first-architecture.md for the copy-adapt workflow.
// =============================================================================

import * as React from 'react';
import {
  Home, Settings, BarChart2, Users, Layers, ChevronRight, Search,
} from 'lucide-react';

import { RoboPageShell } from '@/layout/page-shell/robo-page-shell';
import { RoboSidebar }   from '@/navigation/sidebar/robo-sidebar';
import { RoboTopbar }    from '@/navigation/topbar/robo-topbar';
import { RoboCommandPalette } from '@/navigation/command-palette/robo-command-palette';
import { RoboTabs, RoboTabsList, RoboTabsTrigger, RoboTabsContent } from '@/navigation/tabs/robo-tabs';
import {
  RoboQuickPanel,
  RoboQuickPanelHeader,
  RoboQuickPanelTitle,
  RoboQuickPanelBody,
  RoboQuickPanelPinButton,
  useRoboQuickPanel,
} from '@/navigation/quick-panel/robo-quick-panel';
import { RoboCard, RoboCardHeader, RoboCardBody } from '@/core/card/robo-card';
import { RoboAccordion, RoboAccordionItem, RoboAccordionTrigger, RoboAccordionContent } from '@/core/accordion/robo-accordion';
import { RoboLoading } from '@/feedback/loading/robo-loading';
import { RoboSkeletonLoading } from '@/feedback/skeleton/robo-skeleton';
import { RoboEmptyState } from '@/feedback/empty-state/robo-empty-state';
import { RoboErrorState } from '@/feedback/error-state/robo-error-state';
import { RoboErrorBoundary } from '@/feedback/error-boundary/robo-error-boundary';
import {
  RoboDropdownMenu,
  RoboDropdownMenuTrigger,
  RoboDropdownMenuContent,
  RoboDropdownMenuItem,
  RoboDropdownMenuLabel,
  RoboDropdownMenuSeparator,
} from '@/feedback/dropdown-menu/robo-dropdown-menu';
import { RoboBreadcrumbs } from '@/navigation/breadcrumbs/robo-breadcrumbs';
import { RoboStatCard }  from '@/charts/stat-card/robo-stat-card';
import { RoboBadge }     from '@/core/badge/robo-badge';
import { RoboButton }    from '@/core/button/robo-button';
import { RoboAvatar }    from '@/core/avatar/robo-avatar';
import { RoboAlert }     from '@/feedback/alert/robo-alert';
import { RoboDivider }   from '@/layout/divider/robo-divider';
import { RoboRadioGroup } from '@/forms/radio-group/robo-radio-group';
import { RoboSelect } from '@/forms/select/robo-select';
import { RoboSlider } from '@/forms/slider/robo-slider';
import { RoboSwitch } from '@/forms/switch/robo-switch';
import { RoboInput } from '@/core/input/robo-input';
import { RoboThemeProvider, useTheme } from '@/core/providers/robo-theme-provider';
import { RoboDensityProvider, useDensity } from '@/core/providers/robo-density-provider';
import { RoboDateFormatProvider, useDateFormat } from '@/core/providers/robo-date-format-provider';
import { RoboGlassModeProvider, useGlassMode } from '@/core/providers/robo-glass-mode-provider';
import { RoboFontFamilyProvider, useFontFamily } from '@/core/providers/robo-font-family-provider';
import { RoboKeybindProvider, useKeybind, useKeybindRegistry } from '@/core/keybinds/robo-keybind-provider';
import { RoboKeybindRecorder } from '@/core/keybind-recorder/robo-keybind-recorder';
import { RoboTourProvider } from '@/core/tour/robo-tour-provider';
import { RoboProductTour, type RoboTourStep } from '@/core/tour/robo-product-tour';
import { RoboTourSettingsCard } from '@/core/tour/robo-tour-settings-card';
import { DATE_FORMAT_OPTIONS } from '@/core/formatting/format-date';
import type { RoboSidebarItem } from '@/navigation/sidebar/robo-sidebar';
import type { RoboBreadcrumbItem } from '@/navigation/breadcrumbs/robo-breadcrumbs';
import type { CommandGroup } from '@/navigation/command-palette/robo-command-palette';
import type { Theme, Mode } from '@/core/providers/robo-theme-provider';
import type { Density } from '@/core/providers/robo-density-provider';
import type { DateFormatId } from '@/core/providers/robo-date-format-provider';
import type { FontFamily } from '@/core/providers/robo-font-family-provider';

import { KPI_GRID, MODE_OPTIONS } from './_shared';

// ---------------------------------------------------------------------------
// Style constants
// ---------------------------------------------------------------------------

const contentStyle: React.CSSProperties = {
  padding: '1.5rem',
  display: 'flex',
  flexDirection: 'column',
  gap: 24,
};


const widgetGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 16,
};

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

// Matches RoboEntityDossier's own section-header convention (see
// DESIGN.md's "Entity Dossier" pattern) — reused here for the Quick
// Panel's Recent/Notifications/Settings tabs so grouped info reads the same
// way across the design system.
const SECTION_HEADER_CLASS = 'text-xs font-semibold uppercase tracking-widest text-[var(--muted-foreground)]';

// ---------------------------------------------------------------------------
// TODO: Replace nav items with your app's actual navigation structure
// ---------------------------------------------------------------------------

// TODO: 'not-found' and 'error' are demonstrated via the "Pattern previews" buttons
// below since this template has no real router — wire them to your router's
// not-found handling and a top-level RoboErrorBoundary in a real app.
type AppView = 'dashboard' | 'settings' | 'not-found' | 'error';

// Dashboard is the root/home view, so it doesn't get a breadcrumb trail.
// TODO: derive this from your router's current path instead.
const BREADCRUMBS: Partial<Record<AppView, RoboBreadcrumbItem[]>> = {
  settings: [{ label: 'Home', href: '/' }, { label: 'Settings' }],
  'not-found': [{ label: 'Home', href: '/' }, { label: 'Page not found' }],
  error: [{ label: 'Home', href: '/' }, { label: 'Error' }],
};

const navItems: RoboSidebarItem[] = [
  { id: 'home',     label: 'Home',     icon: <Home     size={18} />, href: '/' },
  {
    id: 'section-a',
    label: 'Section A',
    icon: <Layers size={18} />,
    children: [
      { id: 'section-a-1', label: 'Sub-page 1', icon: <ChevronRight size={16} />, href: '/section-a/1' },
      { id: 'section-a-2', label: 'Sub-page 2', icon: <ChevronRight size={16} />, href: '/section-a/2' },
    ],
  },
  { id: 'analytics', label: 'Analytics', icon: <BarChart2 size={18} />, href: '/analytics' },
  { id: 'users',     label: 'Users',     icon: <Users    size={18} />, href: '/users' },
];

// ---------------------------------------------------------------------------
// Product tour — RoboSidebarItem has no data-attribute passthrough, so the
// Settings footer item (rendered from `footerItems` below, onSelect-driven —
// no href to select on) is targeted by its visible label via a function
// target instead of depending on RoboSidebar internals.
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

const APP_SHELL_TOUR_STEPS: RoboTourStep[] = [
  {
    target: 'nav[aria-label="Main navigation"]',
    title: 'Navigation',
    content: 'Your primary navigation lives here — add pages as your app grows.',
    placement: 'right',
    skipBeacon: true,
  },
  {
    target: '#app-shell-command-palette-trigger',
    title: 'Command palette',
    content: 'Press ⌘K (or click here) any time to jump to a page or action instantly.',
    skipBeacon: true,
  },
  {
    target: '#app-shell-dashboard-content',
    title: 'Main content',
    content: "This is your main content area — replace it with your app's real dashboard.",
    placement: 'center',
    skipBeacon: true,
  },
  {
    target: sidebarItemByLabel('Settings'),
    title: 'Settings',
    content: 'Head to Settings any time to change the theme, density, or retake this tour.',
    placement: 'right',
    skipBeacon: true,
  },
];


// ---------------------------------------------------------------------------
// TODO: Replace example items with real recent-activity data
// ---------------------------------------------------------------------------

interface RecentItem {
  id: string;
  label: string;
  meta: string;
  statusColor: 'success' | 'warning' | 'destructive';
  statusLabel: string;
}

const recentItems: RecentItem[] = [
  { id: 'a1', label: 'Item Alpha',   meta: 'Updated 2 min ago',  statusColor: 'success',     statusLabel: 'Active' },
  { id: 'a2', label: 'Item Beta',    meta: 'Updated 14 min ago', statusColor: 'success',     statusLabel: 'Active' },
  { id: 'a3', label: 'Item Gamma',   meta: 'Updated 1 hr ago',   statusColor: 'warning',     statusLabel: 'Pending' },
  { id: 'a4', label: 'Item Delta',   meta: 'Updated 3 hr ago',   statusColor: 'destructive', statusLabel: 'Overdue' },
];

// ---------------------------------------------------------------------------
// Settings page — color theme, mode, density, date format, and glass mode,
// all backed by the real RoboThemeProvider / RoboDensityProvider /
// RoboDateFormatProvider / RoboGlassModeProvider (persist to localStorage by
// default).
// ---------------------------------------------------------------------------

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
  { value: 'off', label: 'Solid',  description: 'Map-overlay panels (floating panels, sheets, info island) use an opaque card background' },
  { value: 'on',  label: 'Glass',  description: 'Map-overlay panels use a translucent, blurred glass surface instead' },
];

const FONT_FAMILY_OPTIONS: { value: FontFamily; label: string; description: string }[] = [
  { value: 'inter',        label: 'Inter',        description: 'Previous default — neutral, general-purpose sans-serif' },
  { value: 'dm-sans',      label: 'DM Sans',       description: 'Default — clean geometric sans-serif' },
  { value: 'varela',       label: 'Varela',        description: 'Optimized for small, dense text' },
  { value: 'open-sans',    label: 'Open Sans',     description: 'Optimized for small, dense text' },
  { value: 'opendyslexic', label: 'OpenDyslexic',  description: 'Accessibility font for dyslexic readers' },
  { value: 'sora',         label: 'Sora',          description: 'Rounded, modern geometric sans-serif' },
];


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
        <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: 'var(--foreground)' }}>
          Settings
        </h1>
        <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
          Personalize the color theme, layout density, date format, font family, glass mode, map
          defaults, and keybinds for this app.
        </p>
      </div>

      {/* Appearance — visual/display personalization. Room to grow: theming
          tokens, animation intensity, etc. all belong here alongside theme,
          mode, density, and font family. */}
      <div style={settingsGroupStyle}>
        <h2 style={settingsGroupHeadingStyle}>Appearance</h2>

        <RoboCard>
          <RoboCardHeader>Color theme</RoboCardHeader>
          <RoboCardBody>
            <RoboRadioGroup
              options={THEME_OPTIONS}
              value={theme}
              onValueChange={(v) => setTheme(v as Theme)}
            />
          </RoboCardBody>
        </RoboCard>

        <RoboCard>
          <RoboCardHeader>Mode</RoboCardHeader>
          <RoboCardBody>
            <RoboRadioGroup
              options={MODE_OPTIONS}
              orientation='horizontal'
              value={mode}
              onValueChange={(v) => setMode(v as Mode)}
            />
          </RoboCardBody>
        </RoboCard>

        <RoboCard>
          <RoboCardHeader>Density</RoboCardHeader>
          <RoboCardBody>
            <RoboRadioGroup
              options={DENSITY_OPTIONS}
              value={density}
              onValueChange={(v) => setDensity(v as Density)}
            />
          </RoboCardBody>
        </RoboCard>

        <RoboCard>
          <RoboCardHeader>Font family</RoboCardHeader>
          <RoboCardBody>
            <RoboRadioGroup
              options={FONT_FAMILY_OPTIONS}
              value={fontFamily}
              onValueChange={(v) => setFontFamily(v as FontFamily)}
            />
          </RoboCardBody>
        </RoboCard>
      </div>

      {/* Global — cross-cutting behavior that applies app-wide regardless of
          area or feature (as opposed to Appearance's purely visual concerns). */}
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

      {/* Keybinds — reassignable global shortcuts, registered via
          RoboKeybindProvider/useKeybind from anywhere in the app. */}
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

      {/* Help — RoboTourSettingsCard lists every tour registered with
          RoboTourProvider (just this app's basic tour today) and lets the
          user retake any of them. */}
      <div style={settingsGroupStyle}>
        <h2 style={settingsGroupHeadingStyle}>Help</h2>
        <RoboTourSettingsCard />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 404 view — composed from RoboEmptyState (decorative-only) + heading + action,
// the same pattern used for empty tables/lists elsewhere in this library.
// TODO: wire this to your router's actual not-found route.
// ---------------------------------------------------------------------------

function NotFoundView({ onNavigate }: { onNavigate: (view: AppView) => void }) {
  return (
    <div style={{ ...contentStyle, alignItems: 'center', justifyContent: 'center', textAlign: 'center', height: '100%' }}>
      <RoboEmptyState size='lg' label='Page not found' />
      <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: 'var(--foreground)' }}>
        Page not found
      </h1>
      <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
        The page you're looking for doesn't exist or has moved.
      </p>
      <RoboButton onClick={() => onNavigate('dashboard')}>Back to Home</RoboButton>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Full-page error view — the manual-trigger case (e.g. a caught API error you
// choose to render full-page). For errors thrown during render, RoboErrorBoundary
// (wrapping the content area below) handles the automatic-catch case instead.
// ---------------------------------------------------------------------------

function ErrorView({ onNavigate }: { onNavigate: (view: AppView) => void }) {
  return (
    <div style={{ ...contentStyle, alignItems: 'center', justifyContent: 'center', height: '100%' }}>
      <RoboErrorState variant='error' onRetry={() => onNavigate('dashboard')} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Dashboard view — TODO: replace with your real page content
// ---------------------------------------------------------------------------

function DashboardView({ onNavigate }: { onNavigate: (view: AppView) => void }) {
  // Simulated fetch delay — stand-in for a real tRPC/REST call. Real apps should
  // gate this on actual query `isLoading` state, not a timer. Demonstrates the
  // intended pairing: RoboSkeletonLoading for in-section data, distinct from the
  // full-page RoboLoading splash used for initial app bootstrap.
  const [dataLoading, setDataLoading] = React.useState(true);
  React.useEffect(() => {
    const timer = setTimeout(() => setDataLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div id='app-shell-dashboard-content' style={contentStyle}>

      {/* Page heading — TODO: replace with real page title */}
      <div>
        <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: 'var(--foreground)' }}>
          Dashboard
        </h1>
        <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
          Overview {/* TODO */}
        </p>
      </div>

      {/* Optional alert — TODO: remove or wire to real alert condition */}
      <RoboAlert variant='warning' title='Attention required'>
        {/* TODO: Replace with your real alert trigger */}
        Some items require your attention.
      </RoboAlert>

      {/* KPI row — TODO: replace labels, values, change%, icons with real metrics */}
      {dataLoading ? (
        <div style={KPI_GRID}>
          {Array.from({ length: 4 }).map((_, i) => (
            <RoboSkeletonLoading key={i} variant='rect' height={88} />
          ))}
        </div>
      ) : (
        <div style={KPI_GRID}>
          <RoboStatCard label="Total Items"   value={247} change={4.1}  changeLabel="vs last month" />
          <RoboStatCard label="Active"        value={89}  change={8.3}  changeLabel="vs last week" />
          <RoboStatCard label="Processed"     value={34}  change={12.0} changeLabel="vs yesterday" />
          <RoboStatCard label="Alerts"        value={3}   change={-25}  changeLabel="vs yesterday" />
        </div>
      )}

      <RoboDivider />

      {/* Widget grid — TODO: replace with your real content widgets */}
      <div style={widgetGridStyle}>

        {/* Recent activity widget */}
        <RoboCard>
          <RoboCardHeader>
            <p style={{ margin: 0, fontSize: '0.9375rem', fontWeight: 700 }}>
              Recent Activity {/* TODO */}
            </p>
          </RoboCardHeader>
          <RoboCardBody>
            {dataLoading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {Array.from({ length: 4 }).map((_, i) => (
                  <RoboSkeletonLoading key={i} variant='text' height={16} />
                ))}
              </div>
            ) : (
              <div>
                {recentItems.map((item, i) => (
                  <React.Fragment key={item.id}>
                    {i > 0 && <RoboDivider decorative />}
                    <div style={listItemStyle}>
                      <div>
                        <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--foreground)' }}>{item.label}</p>
                        <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>{item.meta}</p>
                      </div>
                      <RoboBadge usage='label' color={item.statusColor} size='sm'>
                        {item.statusLabel}
                      </RoboBadge>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            )}
          </RoboCardBody>
        </RoboCard>

        {/* Status widget — TODO: replace with your system/service status */}
        <RoboCard>
          <RoboCardHeader>
            <p style={{ margin: 0, fontSize: '0.9375rem', fontWeight: 700 }}>
              System Status {/* TODO */}
            </p>
          </RoboCardHeader>
          <RoboCardBody>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {[
                { label: 'Service A', status: 'Operational', color: 'success'     as const },
                { label: 'Service B', status: 'Operational', color: 'success'     as const },
                { label: 'Service C', status: 'Degraded',    color: 'warning'     as const },
                { label: 'Service D', status: 'Operational', color: 'success'     as const },
              ].map((item, i, arr) => (
                <div
                  key={item.label}
                  style={{
                    ...listItemStyle,
                    borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : undefined,
                  }}
                >
                  <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--foreground)' }}>{item.label}</p>
                  <RoboBadge usage='status' color={item.color} size='sm'>{item.status}</RoboBadge>
                </div>
              ))}
            </div>
          </RoboCardBody>
        </RoboCard>

      </div>

      {/* Pattern previews — the template has no real router, so these are the only
          way to reach the 404/error views in this demo. TODO: delete this card;
          wire your router's not-found route and RoboErrorBoundary instead. */}
      <RoboCard>
        <RoboCardHeader>
          <p style={{ margin: 0, fontSize: '0.9375rem', fontWeight: 700 }}>
            Pattern previews
          </p>
        </RoboCardHeader>
        <RoboCardBody>
          <div style={{ display: 'flex', gap: 8 }}>
            <RoboButton variant='outline' size='sm' onClick={() => onNavigate('not-found')}>
              Preview 404 page
            </RoboButton>
            <RoboButton variant='outline' size='sm' onClick={() => onNavigate('error')}>
              Preview error state
            </RoboButton>
          </div>
        </RoboCardBody>
      </RoboCard>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Quick panel demo content — TODO: replace with your real quick-access
// content. Demonstrates composing RoboTabs (pill variant) inside
// RoboQuickPanelBody, reading activeTab/setActiveTab via useRoboQuickPanel()
// instead of prop-drilling, and a RoboBadge count on a tab trigger.
// ---------------------------------------------------------------------------

const LAYER_GROUPS = [
  { id: 'threats', label: 'Orbital hazards', color: '#dc2626', layers: [{ id: 'piracy', label: 'Debris conjunctions' }, { id: 'gdelt', label: 'Space-weather events' }] },
  { id: 'infra', label: 'Infrastructure', color: '#16a34a', layers: [{ id: 'cables', label: 'Ground stations' }] },
] as const;

// A smaller version of the "Dense Grouped List Pattern" (`DESIGN.md`)
// composed as plain content — same reasoning `RoboPeekSheet`'s own stories
// document: nesting the real, draggable `RoboLayersPanel` inside another
// already-positioned panel would fight both components' own positioning.
function QuickPanelLayersDemo() {
  const [checked, setChecked] = React.useState<Record<string, boolean>>({ piracy: true, cables: true });
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {LAYER_GROUPS.map((group) => (
        <div key={group.id}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <span aria-hidden='true' style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: group.color }} />
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--foreground)' }}>{group.label}</span>
          </div>
          {group.layers.map((layer) => (
            <label key={layer.id} style={{ display: 'flex', alignItems: 'center', gap: 8, paddingLeft: 14, paddingBlock: 2, fontSize: '0.8125rem' }}>
              <input
                type='checkbox'
                checked={checked[layer.id] ?? false}
                onChange={(e) => setChecked((prev) => ({ ...prev, [layer.id]: e.target.checked }))}
              />
              <span>{layer.label}</span>
            </label>
          ))}
        </div>
      ))}
    </div>
  );
}

const QUICK_PANEL_NOTIFICATIONS = ['New alert near VOY-1042', 'Item Alpha entered active status', 'Telemetry log TL-2291 submitted'];

// Recent items grouped by status — "Active" vs "Needs attention" — the same
// two buckets `recentItems`' own statusColor values already imply, rather
// than inventing a taxonomy. Entity-Dossier-style: RoboAccordion type="multiple",
// both groups open by default (see DESIGN.md's "Entity Dossier" pattern).
const RECENT_GROUPS = [
  { id: 'active', label: 'Active', match: (item: RecentItem) => item.statusColor === 'success' },
  { id: 'attention', label: 'Needs attention', match: (item: RecentItem) => item.statusColor !== 'success' },
] as const;

function QuickPanelDemoTabs() {
  const { mode, setMode } = useTheme();
  const { glassMode, setGlassMode } = useGlassMode();
  const { activeTab, setActiveTab } = useRoboQuickPanel();

  return (
    <RoboTabs value={activeTab} onValueChange={setActiveTab}>
      <RoboTabsList variant='pill'>
        <RoboTabsTrigger variant='pill' value='recent'>Recent</RoboTabsTrigger>
        <RoboTabsTrigger variant='pill' value='notifications' style={{ gap: 6 }}>
          Notifications
          <RoboBadge usage='count' color='destructive' size='sm' count={3} aria-label='Notifications: 3 unread' />
        </RoboTabsTrigger>
        <RoboTabsTrigger variant='pill' value='settings'>Settings</RoboTabsTrigger>
        <RoboTabsTrigger variant='pill' value='layers'>Layers</RoboTabsTrigger>
      </RoboTabsList>

      <RoboTabsContent value='recent'>
        <RoboAccordion type='multiple' defaultValue={['active', 'attention']}>
          {RECENT_GROUPS.map((group) => {
            const items = recentItems.filter(group.match);
            if (items.length === 0) return null;
            return (
              <RoboAccordionItem key={group.id} value={group.id}>
                <RoboAccordionTrigger>
                  <span className={SECTION_HEADER_CLASS}>{group.label} ({items.length})</span>
                </RoboAccordionTrigger>
                <RoboAccordionContent>
                  <div>
                    {items.map((item, i) => (
                      <React.Fragment key={item.id}>
                        {i > 0 && <RoboDivider decorative />}
                        <div style={listItemStyle}>
                          <div>
                            <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--foreground)' }}>{item.label}</p>
                            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>{item.meta}</p>
                          </div>
                          <RoboBadge usage='label' color={item.statusColor} size='sm'>
                            {item.statusLabel}
                          </RoboBadge>
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                </RoboAccordionContent>
              </RoboAccordionItem>
            );
          })}
        </RoboAccordion>
      </RoboTabsContent>

      <RoboTabsContent value='notifications'>
        <span className={SECTION_HEADER_CLASS}>Notifications</span>
        <div style={{ marginTop: 8 }}>
          {QUICK_PANEL_NOTIFICATIONS.map((n, i) => (
            <React.Fragment key={n}>
              {i > 0 && <RoboDivider decorative />}
              <p style={{ margin: 0, padding: '8px 0', fontSize: '0.8125rem', color: 'var(--foreground)' }}>{n}</p>
            </React.Fragment>
          ))}
        </div>
      </RoboTabsContent>

      <RoboTabsContent value='settings'>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <span className={SECTION_HEADER_CLASS}>Mode</span>
            <div style={{ marginTop: 8 }}>
              <RoboRadioGroup options={MODE_OPTIONS} orientation='horizontal' value={mode} onValueChange={(v) => setMode(v as Mode)} />
            </div>
          </div>
          <div>
            <span className={SECTION_HEADER_CLASS}>Glass mode</span>
            <div style={{ marginTop: 8 }}>
              <RoboRadioGroup options={GLASS_MODE_OPTIONS} value={glassMode ? 'on' : 'off'} onValueChange={(v) => setGlassMode(v === 'on')} />
            </div>
          </div>
        </div>
      </RoboTabsContent>

      <RoboTabsContent value='layers'>
        <QuickPanelLayersDemo />
      </RoboTabsContent>
    </RoboTabs>
  );
}

// ---------------------------------------------------------------------------
// Shell — TODO: replace initials/href values with your real user session data
// ---------------------------------------------------------------------------

function AppTopbar({
  onMenuToggle,
  onNavigate,
  onOpenCommandPalette,
}: {
  onMenuToggle: () => void;
  onNavigate: (view: AppView) => void;
  onOpenCommandPalette: () => void;
}) {
  return (
    <RoboTopbar
      onMenuToggle={onMenuToggle}
      logo={
        // TODO: Replace with your app name / logo component
        <span style={{ fontWeight: 700, fontSize: '1rem', letterSpacing: '-0.01em' }}>
          My Application
        </span>
      }
      navLinks={[
        { label: 'Home',        href: '/' },
        { label: 'Section A',   href: '/section-a' },
        { label: 'Analytics',   href: '/analytics' },
      ]}
      commandPaletteTrigger={
        <RoboButton id='app-shell-command-palette-trigger' variant='outline' size='sm' onClick={onOpenCommandPalette}>
          <Search className='h-4 w-4' />
          <span className='hidden sm:inline'>Search…</span>
          <RoboBadge usage='label' size='sm'>⌘K</RoboBadge>
        </RoboButton>
      }
      userMenu={
        <RoboDropdownMenu>
          <RoboDropdownMenuTrigger asChild>
            {/* TODO: Replace fallback initials with the signed-in user's */}
            <button aria-label="User menu">
              <RoboAvatar fallback="AB" size="sm" />
            </button>
          </RoboDropdownMenuTrigger>
          <RoboDropdownMenuContent align="end">
            <RoboDropdownMenuLabel>My Account</RoboDropdownMenuLabel>
            <RoboDropdownMenuSeparator />
            <RoboDropdownMenuItem onSelect={() => onNavigate('settings')}>Settings</RoboDropdownMenuItem>
            {/* TODO: wire to your real sign-out flow */}
            <RoboDropdownMenuItem variant="destructive" onSelect={() => undefined}>Sign out</RoboDropdownMenuItem>
          </RoboDropdownMenuContent>
        </RoboDropdownMenu>
      }
    />
  );
}

function AppSidebar({ view, onNavigate }: { view: AppView; onNavigate: (view: AppView) => void }) {
  // Pinned below the scrollable nav list, above the sidebar's own collapse toggle.
  // TODO: point this at your real settings route instead of the local view toggle.
  const footerItems: RoboSidebarItem[] = [
    { id: 'settings', label: 'Settings', icon: <Settings size={18} />, onSelect: () => onNavigate('settings') },
  ];

  // Click the toggle button (built into RoboSidebar) to collapse/expand the rail;
  // nothing to wire up.
  return (
    <RoboSidebar
      items={navItems}
      footerItems={footerItems}
      // TODO: Replace with your router's current path (e.g. usePathname())
      activePath={view === 'dashboard' ? '/' : undefined}
    />
  );
}

// ---------------------------------------------------------------------------
// Template component
// ---------------------------------------------------------------------------

function AppShellContent() {
  const [view, setView] = React.useState<AppView>('dashboard');
  const [sidebarVisible, setSidebarVisible] = React.useState(true);
  const [commandPaletteOpen, setCommandPaletteOpen] = React.useState(false);
  const [quickPanelOpen, setQuickPanelOpen] = React.useState(false);
  const [quickPanelActiveTab, setQuickPanelActiveTab] = React.useState('recent');

  // Reassignable from Settings → Keybinds (RoboKeybindRecorder). Toggles the
  // quick panel open/closed from anywhere in the app.
  useKeybind(
    { id: 'robo.quick-panel.toggle', label: 'Toggle Quick Panel', defaultCombo: 'mod+/' },
    () => setQuickPanelOpen((o) => !o)
  );
  // A second, independent registered action — proves the registry supports
  // more than one shortcut. Opens the panel straight to its Layers tab.
  // Unmodified single-letter shortcuts need `allowInEditableFields: false`
  // (the default) so typing the word "layers" doesn't hijack focus.
  useKeybind(
    { id: 'robo.quick-panel.tab.layers', label: 'Open Layers', defaultCombo: 'l' },
    () => {
      setQuickPanelOpen(true);
      setQuickPanelActiveTab('layers');
    }
  );

  // Simulated initial bootstrap (auth/session check, first data fetch, etc.).
  // TODO: Replace with your real bootstrap condition — this timer is a stand-in.
  const [initialLoading, setInitialLoading] = React.useState(true);
  React.useEffect(() => {
    const timer = setTimeout(() => setInitialLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);

  // ⌘K / Ctrl+K — the sanctioned pattern from RoboCommandPalette's own docs.
  // NOTE: candidate for a future migration to RoboKeybindProvider/useKeybind
  // (see the quick-panel shortcuts above) so it becomes reassignable too —
  // left as a raw listener here since that's still what RoboCommandPalette's
  // own JSDoc documents; out of scope for this change.
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((o) => !o);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // TODO: Replace with your real router navigation for nav-item entries that
  // don't map to a local view (Section A, Analytics, Users below).
  const commandGroups: CommandGroup[] = [
    {
      heading: 'Navigate',
      items: [
        { id: 'nav-home', label: 'Home', icon: <Home size={16} />, onSelect: () => setView('dashboard') },
        { id: 'nav-analytics', label: 'Analytics', icon: <BarChart2 size={16} />, onSelect: () => undefined },
        { id: 'nav-users', label: 'Users', icon: <Users size={16} />, onSelect: () => undefined },
      ],
    },
    {
      heading: 'Settings',
      items: [
        { id: 'settings', label: 'Settings', icon: <Settings size={16} />, onSelect: () => setView('settings') },
      ],
    },
  ];

  if (initialLoading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <RoboLoading size='lg' label='Loading application' />
      </div>
    );
  }

  return (
    <div style={{ height: '100vh' }}>
      <RoboProductTour
        id='app-shell'
        label='Basic app tour'
        steps={APP_SHELL_TOUR_STEPS}
        onBeforeStart={() => {
          setView('dashboard');
          setSidebarVisible(true);
        }}
      />
      <RoboCommandPalette
        open={commandPaletteOpen}
        onOpenChange={setCommandPaletteOpen}
        groups={commandGroups}
      />
      {/* Double-click anywhere in the expanded body (besides interactive controls) also pins it
          open — same as the explicit pin button, just discoverable without hunting for it. */}
      <RoboQuickPanel
        side='right'
        icon={<Layers className='h-3.5 w-3.5' />}
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
          <QuickPanelDemoTabs />
        </RoboQuickPanelBody>
      </RoboQuickPanel>
      <RoboPageShell
        sidebar={sidebarVisible ? <AppSidebar view={view} onNavigate={setView} /> : undefined}
        topbar={
          <AppTopbar
            onMenuToggle={() => setSidebarVisible((v) => !v)}
            onNavigate={setView}
            onOpenCommandPalette={() => setCommandPaletteOpen(true)}
          />
        }
      >
        {/* TODO: Derive from your router's current path instead of this local view map. */}
        {BREADCRUMBS[view] && (
          <div style={{ padding: '0.75rem 1.5rem 0' }}>
            <RoboBreadcrumbs items={BREADCRUMBS[view]!} />
          </div>
        )}

        {/* Catches unexpected render errors in the content area — the automatic-catch
            case. The "Preview error state" button below demonstrates the manual-trigger
            case (ErrorView) side by side. */}
        <RoboErrorBoundary onRetry={() => setView('dashboard')}>
          {view === 'dashboard' && <DashboardView onNavigate={setView} />}
          {view === 'settings' && <SettingsView />}
          {view === 'not-found' && <NotFoundView onNavigate={setView} />}
          {view === 'error' && <ErrorView onNavigate={setView} />}
        </RoboErrorBoundary>
      </RoboPageShell>
    </div>
  );
}

export function AppShellTemplate() {
  return (
    <RoboKeybindProvider>
      <RoboTourProvider>
        <RoboThemeProvider>
          <RoboDensityProvider>
            <RoboDateFormatProvider>
              <RoboGlassModeProvider>
                <RoboFontFamilyProvider>
                  <AppShellContent />
                </RoboFontFamilyProvider>
              </RoboGlassModeProvider>
            </RoboDateFormatProvider>
          </RoboDensityProvider>
        </RoboThemeProvider>
      </RoboTourProvider>
    </RoboKeybindProvider>
  );
}
