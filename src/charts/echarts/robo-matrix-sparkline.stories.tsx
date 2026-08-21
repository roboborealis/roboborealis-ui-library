import type { Meta, StoryObj } from '@storybook/react';

import { CHART_DATASET } from './mock-data';
import { RoboMatrixSparkline } from './robo-matrix-sparkline';

export const componentMeta = {
  description: 'Grid of tiny sparkline trends, one mini chart per metric or entity',
  category: 'visualization' as const,
  keywords: ['sparkline', 'matrix', 'mini chart', 'trend', 'small multiples', 'grid', 'micro', 'metrics', 'overview', 'inline'],
  whenToUse: 'For showing many small trend lines side by side as small multiples — like a trend per constellation metric',
  whenNotToUse: 'For one detailed trend use RoboLineChart; for exact values use RoboDataTable',
  pairsWith: ['RoboCard', 'RoboStatCard', 'RoboDataTable', 'RoboLineChart'],
  a11y: 'Renders to a canvas with role img and an aria-label prop that falls back to the title; pair with a data table for screen reader users',
};

const meta: Meta<typeof RoboMatrixSparkline> = {
  excludeStories: ['componentMeta'],
  title: 'Data/Charts/ECharts/RoboMatrixSparkline',
  component: RoboMatrixSparkline,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    cellHeight: { control: { type: 'number', min: 40, max: 160, step: 10 } },
    height: { control: { type: 'number', min: 200, max: 1000, step: 50 } },
    isLoading: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof RoboMatrixSparkline>;

export const SatelliteMetrics: Story = {
  args: {
    ...CHART_DATASET.matrixSparkline,
    title:
      'Constellation Metrics Matrix — Velocity, Mass, Power, Length, Solar Span by Satellite Type',
  },
};

export const Compact: Story = {
  args: {
    ...CHART_DATASET.matrixSparkline,
    cellHeight: 60,
    title: 'Compact Metrics View',
  },
};

export const Loading: Story = {
  args: {
    rows: [],
    columns: [],
    data: [],
    isLoading: true,
  },
};

export const Playground: Story = {
  args: {
    ...CHART_DATASET.matrixSparkline,
    title: 'Constellation Metrics Matrix',
    cellHeight: 80,
    isLoading: false,
  },
};
