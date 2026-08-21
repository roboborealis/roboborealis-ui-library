// ---------------------------------------------------------------------------
// Data/Visualizations — Overview (showcase card-grid style)
//
// Most visualizations are heavy SVG renders and several are context-coupled,
// so the overview links out rather than mounting them all.
// ---------------------------------------------------------------------------

import type { Meta, StoryObj } from '@storybook/react';

import { OverviewLinkCards } from '../lib/storybook/overview-layout';

const meta: Meta = {
  title: 'Data/Visualizations',
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj;

export const Overview: Story = {
  name: 'Visualizations Overview',
  render: () => (
    <div style={{ maxWidth: 860 }}>
      <h2 style={{ margin: '0 0 6px', fontWeight: 700, fontSize: 22 }}>Visualizations</h2>
      <p style={{ margin: '0 0 24px', fontSize: 13, color: 'var(--secondary-text)', maxWidth: 600 }}>
        Graph, network, and multi-dimensional visualizations for OSINT and analysis. Click any component
        to see its full variant set.
      </p>
      <OverviewLinkCards
        cards={[
          {
            title: 'Relational / Network',
            description: 'Node-link and connection views.',
            links: [
              { label: 'RoboForceGraph', id: 'data-visualizations-roboforcegraph--all-variants' },
              { label: 'RoboConnectionLine', id: 'data-visualizations-roboconnectionline--all-variants' },
            ],
          },
          {
            title: 'Multi-dimensional',
            description: 'Compare entities across many axes.',
            links: [
              { label: 'RoboRadarChart', id: 'data-visualizations-roboradarchart--all-variants' },
              { label: 'RoboCorrelationMatrix', id: 'data-visualizations-robocorrelationmatrix--all-variants' },
              { label: 'RoboBubbleChart', id: 'data-visualizations-robobubblechart--all-variants' },
            ],
          },
          {
            title: 'Temporal',
            description: 'Activity over time.',
            links: [{ label: 'RoboTimeline', id: 'data-visualizations-robotimeline--all-variants' }],
          },
          {
            title: 'Entity detail',
            description: 'Deep-dive on one entity with its relationships.',
            links: [{ label: 'RoboEntityDossier', id: 'data-visualizations-roboentitydossier--all-variants' }],
          },
          {
            title: 'OSINT workbench',
            description: 'Provider-coupled filter panel + data feed sharing correlation state.',
            links: [
              { label: 'RoboCorrelationProvider', id: 'data-visualizations-robocorrelationprovider--all-variants' },
              { label: 'RoboFilterPanel', id: 'data-visualizations-robofilterpanel--all-variants' },
              { label: 'RoboDataFeed', id: 'data-visualizations-robodatafeed--all-variants' },
            ],
          },
        ]}
      />
    </div>
  ),
};
