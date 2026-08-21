// ---------------------------------------------------------------------------
// Data/Charts/ECharts — Overview (showcase card-grid style)
//
// The ECharts advanced chart family. Each links to that chart's full variants.
// For a live all-families view see the Data/Charts overview.
// ---------------------------------------------------------------------------

import type { Meta, StoryObj } from '@storybook/react';

import { OverviewLinkCards } from '../../lib/storybook/overview-layout';

const meta: Meta = {
  title: 'Data/Charts/ECharts',
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj;

export const Overview: Story = {
  name: 'ECharts Overview',
  render: () => (
    <div style={{ maxWidth: 860 }}>
      <h2 style={{ margin: '0 0 6px', fontWeight: 700, fontSize: 22 }}>ECharts</h2>
      <p style={{ margin: '0 0 24px', fontSize: 13, color: 'var(--secondary-text)', maxWidth: 600 }}>
        Advanced Apache ECharts chart types. Click any chart to see its variants. For a live view of all
        chart families together, see the Data / Charts overview.
      </p>
      <OverviewLinkCards
        cards={[
          {
            title: 'Calendar',
            description: 'Values laid out on a calendar grid.',
            links: [
              { label: 'Heatmap', id: 'data-charts-echarts-robocalendarheatmap--m-l-e-operations' },
              { label: 'Bar', id: 'data-charts-echarts-robocalendarbarchart--incidents-by-day' },
              { label: 'Scatter', id: 'data-charts-echarts-robocalendarscatterchart--constellation-activity-days' },
              { label: 'Icon', id: 'data-charts-echarts-robocalendariconchart--satellite-calendar' },
            ],
          },
          {
            title: 'Hierarchy',
            description: 'Nested breakdowns of a whole.',
            links: [
              { label: 'Treemap', id: 'data-charts-echarts-robotreemap--disk-usage' },
              { label: 'Sunburst', id: 'data-charts-echarts-robosunburstchart--constellation-hierarchy' },
              { label: 'Circle Packing', id: 'data-charts-echarts-robocirclepacking--constellation-bubbles' },
              { label: 'Funnel', id: 'data-charts-echarts-robofunnelchart--pyramid' },
            ],
          },
          {
            title: 'Distribution / Correlation',
            description: 'Spread of values and relationships between variables.',
            links: [
              { label: 'Heatmap', id: 'data-charts-echarts-roboheatmap--incident-frequency' },
              { label: 'Correlation Heatmap', id: 'data-charts-echarts-robocorrelationheatmap--satellite-dimensions' },
              { label: 'Scatter', id: 'data-charts-echarts-roboscatterchart--constellation-clustering' },
              { label: 'Single-Axis Scatter', id: 'data-charts-echarts-robosingleaxisscatterchart--incidents-by-severity' },
              { label: 'Parallel Coordinates', id: 'data-charts-echarts-roboparallelcoordinateschart--incident-response-metrics' },
            ],
          },
          {
            title: 'Flow / Network',
            description: 'Directed flows and relationships.',
            links: [
              { label: 'Sankey', id: 'data-charts-echarts-robosankeyflowchart--incident-flow' },
              { label: 'Chord', id: 'data-charts-echarts-robochorddiagram--port-co-location' },
            ],
          },
          {
            title: 'Comparison',
            description: 'Compare magnitudes and compositions.',
            links: [
              { label: 'Nightingale', id: 'data-charts-echarts-robonightingalechart--incidents-by-hour-of-day' },
              { label: 'Matrix Sparkline', id: 'data-charts-echarts-robomatrixsparkline--compact' },
              { label: 'Theme River', id: 'data-charts-echarts-robothemeriverchart--incident-type-composition' },
            ],
          },
          {
            title: 'Gauge',
            description: 'One value against a scale or target.',
            links: [
              { label: 'Gauge', id: 'data-charts-echarts-robogaugechart--constellation-readiness-arc' },
            ],
          },
        ]}
      />
    </div>
  ),
};
