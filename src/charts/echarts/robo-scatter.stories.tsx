import type { Meta, StoryObj } from '@storybook/react';

import { CHART_DATASET } from './mock-data';
import { RoboScatterChart } from './robo-scatter';

const SEVERITY_ORDER = ['low', 'medium', 'high', 'critical'];
const incidentAqiData = CHART_DATASET.incidentScatterSeries.flatMap((s) =>
  s.data.map(([lng, lat]) => [lng, lat, SEVERITY_ORDER.indexOf(s.name)] as [number, number, number]),
);
const incidentAqiSeries = [{ name: 'Severity', data: incidentAqiData as [number, number][] }];

export const componentMeta = {
  description: 'Scatter plot of points across an x and y axis, optionally sized or colored',
  category: 'visualization' as const,
  keywords: ['scatter', 'plot', 'xy', 'correlation', 'cluster', 'points', 'bubble', 'distribution', 'two variable', 'relationship'],
  whenToUse: 'For showing the relationship between two numeric variables — like velocity versus mass',
  whenNotToUse: 'For categorical comparison use RoboBarChart; for many dimensions use RoboParallelCoordinatesChart',
  pairsWith: ['RoboCard', 'RoboParallelCoordinatesChart', 'RoboStatCard'],
  a11y: 'Renders to a canvas with role img and an aria-label prop that falls back to the title; pair with a data table for screen reader users',
};

const meta: Meta<typeof RoboScatterChart> = {
  excludeStories: ['componentMeta'],
  title: 'Data/Charts/ECharts/RoboScatterChart',
  component: RoboScatterChart,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    height: { control: { type: 'number', min: 200, max: 700, step: 50 } },
    showLegend: { control: 'boolean' },
    showTooltip: { control: 'boolean' },
    colorByValue: { control: 'boolean' },
    isLoading: { control: 'boolean' },
  },
};
export default meta;

type Story = StoryObj<typeof RoboScatterChart>;

export const SatelliteSpeedTonnage: Story = {
  args: {
    series: CHART_DATASET.satelliteScatterSeries,
    title: 'Constellation Performance — Velocity vs Mass',
    xAxisLabel: 'Velocity (km/s)',
    yAxisLabel: 'Mass (kg)',
    height: 420,
    showLegend: true,
  },
};

export const ConstellationClustering: Story = {
  name: 'Constellation Clustering — Velocity vs Power',
  args: {
    series: CHART_DATASET.satelliteClusterSeries,
    title: 'Constellation Behavior Clusters — Velocity vs Power',
    xAxisLabel: 'Velocity (km/s)',
    yAxisLabel: 'Power (kW)',
    height: 420,
    showLegend: true,
  },
};

export const IncidentAqiColor: Story = {
  args: {
    series: incidentAqiSeries,
    colorByValue: true,
    xAxisLabel: 'Longitude',
    yAxisLabel: 'Latitude',
    title: 'Anomaly Distribution — Severity Heatmap',
    height: 420,
  },
};

export const Loading: Story = {
  args: {
    series: [],
    height: 420,
    isLoading: true,
  },
};

export const Playground: Story = {
  args: {
    series: CHART_DATASET.satelliteScatterSeries,
    title: 'Constellation Performance — Velocity vs Mass',
    xAxisLabel: 'Velocity (km/s)',
    yAxisLabel: 'Mass (kg)',
    height: 420,
    showLegend: true,
  },
};
