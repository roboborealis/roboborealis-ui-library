// ---------------------------------------------------------------------------
// TEMPLATES SHOWCASE — Content-only templates
//
// Live previews for the 6 content-only templates: drop one into an existing
// app's own RoboPageShell when adding a single new page (unlike the Starter
// apps in templates-overview.stories.tsx, which bootstrap a whole new app).
//
// Archetype numbering follows design-ui-feature.md's decision tree.
// ---------------------------------------------------------------------------

import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { ListSearchTemplate }        from '../../templates/list-search';
import { FilterTableTemplate }       from '../../templates/filter-table';
import { FilterTableDetailTemplate } from '../../templates/filter-table-detail';
import { DashboardGridTemplate }     from '../../templates/dashboard-grid';
import { DataDashboardTemplate }     from '../../templates/data-dashboard';
import { FormValidationTemplate }    from '../../templates/form-validation';

const meta: Meta = {
  title: 'Showcase/Templates/Content',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Content-only page templates — import from `@roboborealis/components/templates` and drop into ' +
          'your app\'s existing shell when adding a single new page. Each is a copy-adaptable component ' +
          'with generic placeholder data and `TODO` comments at every domain injection point. ' +
          'Bootstrapping a whole new app instead? Use the Starter apps one level up in `Showcase/Templates`.',
      },
    },
  },
};
export default meta;

type Story = StoryObj;

export const ListSearch: Story = {
  name: 'List + Search',
  render: () => <ListSearchTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          '**Archetype 4 — List + Search.** Full-page searchable registry: toolbar (search + filters + export) ' +
          'over a paginated RoboDataTable. Use for inventories, catalogs, and manifests. ' +
          'Import: `import { ListSearchTemplate } from "@roboborealis/components/templates"` — then replace the ' +
          'placeholder rows and columns at the `TODO` markers with your domain data.',
      },
    },
  },
};

export const FilterTable: Story = {
  name: 'Filter + Table',
  render: () => <FilterTableTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          '**Archetype 6 (no-detail variant) — Filter + Table.** Filter toolbar over a RoboDataTable where clicking ' +
          'a row navigates to a separate detail page. Use for audit logs, submitted reports, transaction history. ' +
          'Import: `import { FilterTableTemplate } from "@roboborealis/components/templates"` — wire the row click ' +
          'to your router at the `TODO` marker.',
      },
    },
  },
};

export const FilterTableDetail: Story = {
  name: 'Filter + Table + Detail',
  render: () => <FilterTableDetailTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          '**Archetype 6 — Filter + Table + Detail.** 3-column browse → inspect workflow: filter sidebar, ' +
          'RoboDataTable, and a conditional detail pane that opens on row select — no navigation away. ' +
          'Import: `import { FilterTableDetailTemplate } from "@roboborealis/components/templates"` — replace the ' +
          'placeholder record shape and detail-pane fields at the `TODO` markers.',
      },
    },
  },
};

export const DashboardGrid: Story = {
  name: 'Dashboard Grid',
  render: () => <DashboardGridTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          '**Archetype 5 — Dashboard Grid.** Full-page operational dashboard: 4× RoboStatCard KPI row, trend ' +
          'charts (line + bar), and a recent-activity RoboDataTable. Use when the page IS the dashboard. ' +
          'Import: `import { DashboardGridTemplate } from "@roboborealis/components/templates"` — swap KPIs, ' +
          'chart series, and activity rows at the `TODO` markers.',
      },
    },
  },
};

export const DataDashboard: Story = {
  name: 'Data Dashboard (compact)',
  render: () => <DataDashboardTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          '**Compact variant of Archetype 5 — Data Dashboard.** KPI row + activity table, no charts, no sidebar — ' +
          'for dropping a dashboard panel inside an existing page or modal. ' +
          'Import: `import { DataDashboardTemplate } from "@roboborealis/components/templates"`.',
      },
    },
  },
};

export const FormValidation: Story = {
  name: 'Form + Validation',
  render: () => <FormValidationTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          '**Archetype 7 — Form + Validation.** Multi-field data-entry page: react-hook-form + Zod field-level ' +
          'validation in a 2-column grid, with a post-submit success state. Use for create/edit flows. ' +
          'Import: `import { FormValidationTemplate } from "@roboborealis/components/templates"` — replace the ' +
          'Zod schema and field grid at the `TODO` markers, then wire the submit handler to your API.',
      },
    },
  },
};
