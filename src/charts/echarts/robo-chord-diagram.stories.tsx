import type { Meta, StoryObj } from '@storybook/react';

import { CHART_DATASET } from './mock-data';
import { RoboChordDiagram } from './robo-chord-diagram';

export const componentMeta = {
  description: 'Circular diagram of weighted relationships between entities drawn as ribbons',
  category: 'visualization' as const,
  keywords: ['chord', 'relationship', 'flow', 'network', 'connection', 'ribbon', 'matrix', 'co-occurrence', 'links', 'entities'],
  whenToUse: 'For showing pairwise relationships or shared connections among a fixed set of entities — like constellation types sharing launch sites',
  whenNotToUse: 'For directed multi-stage flow use a Sankey-style layout; for hierarchy use RoboTreemap or RoboSunburstChart',
  pairsWith: ['RoboCard', 'RoboCorrelationHeatmap', 'RoboStatCard'],
  a11y: 'Renders to a canvas with role img and an aria-label prop that falls back to the title; pair with a data table for screen reader users',
};

const meta: Meta<typeof RoboChordDiagram> = {
  excludeStories: ['componentMeta'],
  title: 'Data/Charts/ECharts/RoboChordDiagram',
  component: RoboChordDiagram,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    lineColorMode: {
      control: 'inline-radio',
      options: ['source', 'target'],
    },
    height: { control: { type: 'number', min: 200, max: 800, step: 50 } },
    isLoading: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof RoboChordDiagram>;

export const PortCoLocation: Story = {
  name: 'Launch Site Co-location (Source-Colored)',
  args: {
    nodes: CHART_DATASET.chordNodes,
    links: CHART_DATASET.chordLinks,
    lineColorMode: 'source',
    title: 'Constellation Type Co-location — Shared Launch Site Presence',
    height: 420,
  },
};

export const SourceColored: Story = {
  name: 'Source-Colored Edges',
  args: {
    nodes: CHART_DATASET.chordNodes,
    links: CHART_DATASET.chordLinks,
    lineColorMode: 'source',
    title: 'Source-Colored Edge Flow',
    height: 420,
  },
};

export const TargetColored: Story = {
  name: 'Target-Colored Edges',
  args: {
    nodes: CHART_DATASET.chordNodes,
    links: CHART_DATASET.chordLinks,
    lineColorMode: 'target',
    title: 'Target-Colored Edge Flow',
    height: 420,
  },
};

export const Loading: Story = {
  name: 'Loading State',
  args: { nodes: [], links: [], height: 420, isLoading: true },
};

export const Playground: Story = {
  args: {
    nodes: [],
    links: [],
    lineColorMode: 'source',
    title: 'Chord Diagram',
    height: 420,
    isLoading: false,
  },
};
