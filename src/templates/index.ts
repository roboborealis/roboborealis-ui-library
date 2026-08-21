// @roboborealis/components/templates — Copy-adaptable page templates for each UI archetype.
//
// Each template is a standalone React component with generic placeholder data,
// TODO comments at every injection point, and @roboborealis/components/* import comments
// showing how to wire it into your consuming app.
//
// Usage:
//   import { FilterTableDetailTemplate } from '@roboborealis/components/templates';
//
// Content-only archetype templates (Archetypes 4-7 — drop into an existing app's shell):
//   FilterTableDetailTemplate  — Archetype 6: filter panel + table + conditional detail pane
//   DashboardGridTemplate      — Archetype 5: KPI cards + trend charts + activity table
//   ListSearchTemplate         — Archetype 4: search/filter toolbar + paginated table
//   FormValidationTemplate     — Archetype 7: react-hook-form + Zod + 2-col field grid
//   FilterTableTemplate        — Archetype 6 (no-detail): filter toolbar + table only
//
// Foundational shell (not a numbered archetype — default starting point for ANY new app):
//   AppShellTemplate           — full app shell with sidebar (pinned Settings footer),
//                                 topbar, dashboard view, and a working settings page
//                                 (theme + mode + density). The base every Starter
//                                 template below builds on. Shown as "Basic App" in
//                                 Storybook's Showcase/Templates section.
//   DataDashboardTemplate      — compact variant of Dashboard Grid: KPI cards +
//                                 activity table (no charts, no sidebar)
//
// Full starter apps ("Templates" per docs/agent-first-architecture.md — shell +
// one dominant content archetype, copy this to bootstrap a whole new app).
// These 4 are AppShellTemplate's siblings, built the same way (copy-adapt, not
// props composition):
//   DashboardStarterTemplate   — AppShellTemplate's shell + Dashboard Grid content
//   TableStarterTemplate       — AppShellTemplate's shell + Filter+Table+Detail content
//   FormStarterTemplate        — AppShellTemplate's shell + Form+Validation content

export { FilterTableDetailTemplate } from './filter-table-detail';
export { DashboardGridTemplate }     from './dashboard-grid';
export { ListSearchTemplate }        from './list-search';
export { FormValidationTemplate }    from './form-validation';
export { FilterTableTemplate }       from './filter-table';
export { AppShellTemplate }          from './app-shell';
export { DataDashboardTemplate }     from './data-dashboard';
export { DashboardStarterTemplate }  from './dashboard-starter';
export { TableStarterTemplate }      from './table-starter';
export { FormStarterTemplate }       from './form-starter';
