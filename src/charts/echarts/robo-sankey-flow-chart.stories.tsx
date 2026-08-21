import type { Meta, StoryObj } from '@storybook/react';

import { CHART_DATASET } from './mock-data';
import { RoboSankeyFlowChart } from './robo-sankey-flow-chart';

export const componentMeta = {
  description: 'Multi-column value-flow Sankey diagram — e.g. category -> stage -> outcome',
  category: 'visualization' as const,
  keywords: ['sankey', 'flow', 'value flow', 'stages', 'pipeline', 'nodes', 'links', 'multi-stage'],
  whenToUse:
    'For a directed, multi-stage flow of a quantity through named stages (3+ columns) — like incidents flowing from type through severity to resolution status, or revenue flowing from source through cost categories',
  whenNotToUse:
    'For entity/relationship graphs use RoboForceGraph or RoboCorrelationMatrix (@roboborealis/components/visualizations); for pairwise relationships among a fixed set of entities use RoboChordDiagram',
  pairsWith: ['RoboCard', 'RoboStatCard'],
  a11y: 'Renders to a canvas with role img and an aria-label prop that falls back to the title; pair with a data table for screen reader users',
};

const meta: Meta<typeof RoboSankeyFlowChart> = {
  excludeStories: ['componentMeta'],
  title: 'Data/Charts/ECharts/RoboSankeyFlowChart',
  component: RoboSankeyFlowChart,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    height: { control: { type: 'number', min: 200, max: 800, step: 50 } },
    isLoading: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof RoboSankeyFlowChart>;

export const IncidentFlow: Story = {
  name: 'Incident Type -> Severity -> Status',
  args: {
    nodes: CHART_DATASET.incidentFlowNodes,
    links: CHART_DATASET.incidentFlowLinks,
    title: 'Incident Flow — Type to Resolution',
    height: 420,
  },
};

export const Loading: Story = {
  name: 'Loading State',
  args: { nodes: [], links: [], height: 420, isLoading: true },
};

export const Playground: Story = {
  args: {
    nodes: CHART_DATASET.incidentFlowNodes,
    links: CHART_DATASET.incidentFlowLinks,
    title: 'Sankey Flow Chart',
    height: 420,
    isLoading: false,
  },
};
