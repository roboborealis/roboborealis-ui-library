/**
 * UI Archetype Registry
 *
 * Machine-readable catalog of the templated page layout archetypes (Archetypes 1,
 * 4-7 in design-ui-feature.md's decision tree — Archetypes 2-3 are map-based and
 * still have no template). Also includes 'app-shell' and 'data-dashboard', two
 * foundational/variant templates that are NOT part of the numbered 1-7 archetype
 * scheme (app-shell is the mandatory shell every Starter template builds on;
 * data-dashboard is a compact, no-chart variant of the 'dashboard-grid' archetype).
 *
 * Agents can query this to select the right template for a given feature description
 * without reading prose documentation.
 *
 * Usage:
 *   import { archetypes } from '@roboborealis/components/agent-context';
 *
 *   // Find archetype by keyword match
 *   const match = archetypes.find(a => a.keywords.some(k => description.includes(k)));
 *   // match.templateExport → import from '@roboborealis/components/templates'
 *   // match.storyPath     → find in Storybook for a live preview
 */

export interface Archetype {
  /** Stable machine-readable ID */
  id: string;
  /** Human-readable name */
  name: string;
  /** Keywords that describe feature requests that match this archetype */
  keywords: readonly string[];
  /** One-line description of the layout structure */
  layout: string;
  /** Robo components used in this archetype (import from their respective subpaths) */
  components: readonly string[];
  /** Component subpaths needed — import from '@roboborealis/components/<subpath>' */
  subpaths: readonly string[];
  /** Export name from '@roboborealis/components/templates' */
  templateExport: string;
  /** Storybook path for live preview */
  storyPath: string;
  /** Brief description of when to choose this archetype */
  whenToUse: string;
}

export const archetypes: readonly Archetype[] = [
  {
    // Not one of the numbered 1-7 archetypes — the mandatory foundational shell
    // every Starter template (Basic App, Dashboard/Table/Form Starter) builds on.
    id: 'app-shell',
    name: 'App Shell',
    keywords: ['app', 'shell', 'layout', 'scaffold', 'skeleton', 'frame', 'chrome', 'sidebar', 'topbar', 'navigation', 'nav', 'full page', 'main layout', 'new app', 'starting point', 'default shell', 'settings', 'settings page', 'color theme', 'density'],
    layout: 'RoboPageShell + RoboSidebar (pinned Settings footer) + RoboTopbar + content area with dashboard/settings views',
    components: ['RoboPageShell', 'RoboSidebar', 'RoboTopbar', 'RoboStatCard', 'RoboAlert', 'RoboRadioGroup', 'RoboThemeProvider', 'RoboDensityProvider'],
    subpaths: ['@roboborealis/components/layout', '@roboborealis/components/navigation', '@roboborealis/components/core', '@roboborealis/components/charts', '@roboborealis/components/forms'],
    templateExport: 'AppShellTemplate',
    storyPath: 'Showcase/Templates/Basic App',
    whenToUse: 'The default starting point for ANY new app — always start here first, even before checking other archetypes. Ships a working sidebar + topbar shell with a pinned Settings footer item and a real settings page (color theme, mode, density). Only reach for a different archetype once the app shell exists and you are adding a specific page inside it.',
  },
  {
    // Not a separately numbered archetype — a compact, no-chart variant of
    // 'dashboard-grid' (Archetype 5) for dropping into an existing page/modal.
    id: 'data-dashboard',
    name: 'Data Dashboard',
    keywords: ['dashboard', 'kpi', 'metrics', 'overview', 'summary', 'stats', 'at-a-glance', 'activity feed', 'widget', 'stat card', 'statcard'],
    layout: '4× RoboStatCard row + RoboCard-wrapped RoboDataTable (no charts)',
    components: ['RoboStatCard', 'RoboDataTable', 'RoboCard', 'RoboCardHeader', 'RoboCardBody'],
    subpaths: ['@roboborealis/components/charts', '@roboborealis/components/tables', '@roboborealis/components/core'],
    templateExport: 'DataDashboardTemplate',
    storyPath: 'Showcase/Templates/Content/Data Dashboard (compact)',
    whenToUse: 'Adding a compact dashboard panel (KPI row + recent activity table) inside an existing page or modal. No charts, no sidebar.',
  },
  {
    id: 'list-search',
    name: 'List + Search',
    keywords: ['list', 'registry', 'inventory', 'catalog', 'manifest', 'search', 'searchable', 'browse', 'export', 'download', 'paginated list', 'filterable list'],
    layout: 'RoboPageShell + toolbar (search + filters + export) + RoboDataTable',
    components: ['RoboPageShell', 'RoboDataTable', 'RoboInput', 'RoboSelect', 'RoboButton', 'RoboBadge'],
    subpaths: ['@roboborealis/components/layout', '@roboborealis/components/tables', '@roboborealis/components/core', '@roboborealis/components/forms'],
    templateExport: 'ListSearchTemplate',
    storyPath: 'Showcase/Templates/Content/List + Search',
    whenToUse: 'Full-page searchable registry or inventory — users search, filter, and optionally export a list of records.',
  },
  {
    id: 'filter-table',
    name: 'Filter + Table',
    keywords: ['filter', 'filtered', 'report', 'log', 'audit', 'history', 'transactions', 'records', 'tabular', 'toolbar above table'],
    layout: 'RoboPageShell + filter toolbar + RoboDataTable (no detail pane)',
    components: ['RoboPageShell', 'RoboDataTable', 'RoboInput', 'RoboSelect', 'RoboBadge'],
    subpaths: ['@roboborealis/components/layout', '@roboborealis/components/tables', '@roboborealis/components/core', '@roboborealis/components/forms'],
    templateExport: 'FilterTableTemplate',
    storyPath: 'Showcase/Templates/Content/Filter + Table',
    whenToUse: 'Filtered record lists where clicking a row navigates to a detail page (not a side pane) — e.g. audit logs, submitted reports, transaction history.',
  },
  {
    id: 'dashboard-grid',
    name: 'Dashboard Grid',
    keywords: ['ops center', 'operations center', 'analytics', 'trend', 'charts', 'bar chart', 'line chart', 'kpi + charts', 'monitoring', 'live dashboard', 'full dashboard'],
    layout: 'RoboPageShell + 4× RoboStatCard + RoboLineChart + RoboBarChart + RoboDataTable activity feed',
    components: ['RoboPageShell', 'RoboStatCard', 'RoboLineChart', 'RoboBarChart', 'RoboDataTable', 'RoboBadge'],
    subpaths: ['@roboborealis/components/layout', '@roboborealis/components/charts', '@roboborealis/components/tables', '@roboborealis/components/core'],
    templateExport: 'DashboardGridTemplate',
    storyPath: 'Showcase/Templates/Content/Dashboard Grid',
    whenToUse: 'Full-page operational dashboard with KPIs, trend charts, and a recent activity feed. Use when the page IS the dashboard, not a widget within another page.',
  },
  {
    id: 'filter-table-detail',
    name: 'Filter + Table + Detail',
    keywords: ['browse', 'inspect', 'drill down', 'drill-down', 'select', 'side panel', 'detail pane', 'detail panel', 'split view', '3-column', 'three column', 'filter and detail', 'inspect record'],
    layout: '3-column flex: filter sidebar (240px) | RoboDataTable | conditional detail pane (280px)',
    components: ['RoboDataTable', 'RoboCard', 'RoboCardHeader', 'RoboCardBody', 'RoboInput', 'RoboSelect', 'RoboBadge', 'RoboSeparator'],
    subpaths: ['@roboborealis/components/tables', '@roboborealis/components/core', '@roboborealis/components/forms'],
    templateExport: 'FilterTableDetailTemplate',
    storyPath: 'Showcase/Templates/Content/Filter + Table + Detail',
    whenToUse: 'Browse → inspect workflow: filter a list, click a row to see full details in a side pane without navigating away. No page shell wrapping — drop inside a RoboPageShell.',
  },
  {
    id: 'form-validation',
    name: 'Form + Validation',
    keywords: ['form', 'submit', 'create', 'edit', 'input', 'validation', 'zod', 'react-hook-form', 'entry', 'new record', 'report', 'submission', 'wizard step', 'data entry'],
    layout: 'RoboPageShell + RoboForm + RoboFormField in 2-column grid + success state',
    components: ['RoboPageShell', 'RoboForm', 'RoboFormField', 'RoboInput', 'RoboSelect', 'RoboTextarea', 'RoboRadioGroup', 'RoboSwitch', 'RoboCard', 'RoboButton'],
    subpaths: ['@roboborealis/components/layout', '@roboborealis/components/forms', '@roboborealis/components/core'],
    templateExport: 'FormValidationTemplate',
    storyPath: 'Showcase/Templates/Content/Form + Validation',
    whenToUse: 'Multi-field data entry page with field-level Zod validation, react-hook-form, and a post-submit success state. Use for create/edit flows.',
  },
] as const;
