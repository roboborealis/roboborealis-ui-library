import type { Meta, StoryObj } from '@storybook/react';

import { CHART_DATASET } from './mock-data';
import { RoboCorrelationHeatmap } from './robo-correlation-heatmap';

export const componentMeta = {
  description: 'Square matrix heatmap of pairwise correlation coefficients between variables',
  category: 'visualization' as const,
  keywords: ['correlation', 'matrix', 'heatmap', 'coefficient', 'variables', 'relationship', 'pairwise', 'statistics', 'covariance', 'grid'],
  whenToUse: 'For showing how strongly numeric variables move together as a color-coded correlation matrix',
  whenNotToUse: 'For counts across two categorical axes use RoboHeatmap; for calendar-time density use RoboCalendarHeatmap',
  pairsWith: ['RoboCard', 'RoboHeatmap', 'RoboScatterChart'],
  a11y: 'Renders to a canvas with role img and an aria-label prop that falls back to the title; pair with a data table for screen reader users',
};

const meta: Meta<typeof RoboCorrelationHeatmap> = {
  excludeStories: ['componentMeta'],
  title: 'Data/Charts/ECharts/RoboCorrelationHeatmap',
  component: RoboCorrelationHeatmap,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    height: { control: { type: 'number', min: 200, max: 800, step: 50 } },
    isLoading: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof RoboCorrelationHeatmap>;

export const SatelliteDimensions: Story = {
  args: {
    labels: CHART_DATASET.satelliteCorrelationLabels,
    correlations: CHART_DATASET.satelliteCorrelationMatrix,
    title:
      'Satellite Dimension Correlations — Velocity, Mass, Length, Solar Span, Power',
    height: 420,
  },
};

export const Loading: Story = {
  args: {
    labels: [],
    correlations: [],
    isLoading: true,
  },
};

export const Playground: Story = {
  args: {
    labels: CHART_DATASET.satelliteCorrelationLabels,
    correlations: CHART_DATASET.satelliteCorrelationMatrix,
    title: 'Satellite Dimension Correlations',
    height: 420,
    isLoading: false,
  },
};
