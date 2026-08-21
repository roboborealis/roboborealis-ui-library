// ---------------------------------------------------------------------------
// Data — root Overview (showcase card-grid style)
// ---------------------------------------------------------------------------

import type { Meta, StoryObj } from '@storybook/react';

import { OverviewLinkCards } from '../lib/storybook/overview-layout';

const meta: Meta = {
  title: 'Data',
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj;

export const Overview: Story = {
  name: 'Data Overview',
  render: () => (
    <div style={{ maxWidth: 860 }}>
      <h2 style={{ margin: '0 0 6px', fontWeight: 700, fontSize: 22 }}>Data</h2>
      <p style={{ margin: '0 0 24px', fontSize: 13, color: 'var(--secondary-text)', maxWidth: 600 }}>
        Everything for displaying data — charts, tables, graph/network visualizations, and maps.
      </p>
      <OverviewLinkCards
        cards={[
          {
            title: 'Charts',
            description: 'Bar, line, area, pie, KPI, plus heatmaps, treemap, sunburst, gauge, sankey, funnel.',
            links: [
              { label: 'All chart types', id: 'data-charts--overview' },
              { label: 'ECharts', id: 'data-charts-echarts--overview' },
            ],
          },
          {
            title: 'Tables',
            description: 'Static RoboTable, interactive RoboDataTable, and the email-safe RoboEmailTable.',
            links: [{ label: 'All tables', id: 'data-tables--overview' }],
          },
          {
            title: 'Visualizations',
            description: 'Force graph, radar, correlation matrix, bubble, timeline, entity dossier, OSINT.',
            links: [{ label: 'All visualizations', id: 'data-visualizations--overview' }],
          },
        ]}
      />
    </div>
  ),
};
