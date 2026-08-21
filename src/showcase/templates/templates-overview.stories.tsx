// ---------------------------------------------------------------------------
// TEMPLATES SHOWCASE — Starter apps
//
// Every export of @roboborealis/components/templates has a live preview under
// Showcase/Templates. This file holds the full "Starter apps" (sidebar/topbar
// chrome + one dominant page — copy the whole file to bootstrap a new app).
// The 7 content-only templates (Archetypes 1, 4-7 + variants, dropped into an
// existing app's own RoboPageShell) each have their own preview in
// content-templates.stories.tsx under Showcase/Templates/Content.
//
// Select the right one programmatically:
//   import { archetypes, templates } from '@roboborealis/components/agent-context';
//   archetypes.find(a => a.keywords.some(k => description.includes(k)));
// ---------------------------------------------------------------------------

import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { AppShellTemplate }          from '../../templates/app-shell';
import { DashboardStarterTemplate }  from '../../templates/dashboard-starter';
import { TableStarterTemplate }      from '../../templates/table-starter';
import { FormStarterTemplate }       from '../../templates/form-starter';

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta: Meta = {
  title: 'Showcase/Templates',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Copy-adaptable page templates. Import from `@roboborealis/components/templates`. ' +
          'Starter apps (below) are full sidebar+page compositions for bootstrapping a new app. ' +
          'Each has generic placeholder data and `TODO` comments at every domain injection point. ' +
          'See `src/templates/` for source files with full inline documentation.',
      },
    },
  },
};
export default meta;

type Story = StoryObj;

// ===========================================================================
// STARTER APPS — full "what apps can be made" compositions
// ===========================================================================

export const BasicApp: Story = {
  name: 'Basic App',
  render: () => <AppShellTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          '**Basic App.** The default starting point for any new app: sidebar ' +
          'navigation with a pinned Settings footer item, topbar, a dashboard view (KPI row + ' +
          '2-widget grid), and a working Settings view (color theme, mode, and density — backed ' +
          'by `RoboThemeProvider` / `RoboDensityProvider`, both persisted to localStorage by default). ' +
          'Import: `import { AppShellTemplate } from "@roboborealis/components/templates"`',
      },
    },
  },
};

export const DashboardStarter: Story = {
  name: 'Dashboard Starter',
  render: () => <DashboardStarterTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          '**Dashboard Starter.** Sidebar navigation chrome + the Dashboard Grid archetype ' +
          '(KPI row, trend charts, activity feed) as the primary page. Copy this whole file ' +
          '(plus `dashboard-grid.tsx` and `_shared.tsx`) to bootstrap a dashboard-first app. ' +
          'Import: `import { DashboardStarterTemplate } from "@roboborealis/components/templates"`',
      },
    },
  },
};

export const TableStarter: Story = {
  name: 'Table Starter',
  render: () => <TableStarterTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          '**Table Starter.** Sidebar navigation chrome + the Filter + Table + Detail archetype ' +
          '(browse → inspect) as the primary page. Copy this whole file (plus ' +
          '`filter-table-detail.tsx`) to bootstrap a records/registry app. ' +
          'Import: `import { TableStarterTemplate } from "@roboborealis/components/templates"`',
      },
    },
  },
};

export const FormStarter: Story = {
  name: 'Form Starter',
  render: () => <FormStarterTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          '**Form Starter.** Sidebar navigation chrome + the Form + Validation archetype ' +
          '(react-hook-form + Zod, post-submit success state) as the primary page. Copy this ' +
          'whole file (plus `form-validation.tsx` and `_shared.tsx`) to bootstrap a data-entry app. ' +
          'Import: `import { FormStarterTemplate } from "@roboborealis/components/templates"`',
      },
    },
  },
};
