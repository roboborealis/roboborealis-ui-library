import type { Meta, StoryObj } from '@storybook/react';

import { CHART_DATASET } from './mock-data';
import { RoboParallelCoordinatesChart } from './robo-parallel-coordinates-chart';

const SPACECRAFT_AXES = [
  { dim: 0, name: 'Velocity (km/s)' },
  { dim: 1, name: 'Power (kW)' },
  { dim: 2, name: 'Mass (kg)' },
  { dim: 3, name: 'Length (m)' },
  { dim: 4, name: 'Solar Span (m)' },
];

const SEVERITY_INDEX: Record<string, number> = {
  low: 1,
  medium: 2,
  high: 3,
  critical: 4,
};

const INCIDENT_AXES = [
  { dim: 0, name: 'Hour of Day' },
  { dim: 1, name: 'Severity (1–4)' },
  { dim: 2, name: 'Latitude' },
  { dim: 3, name: 'Longitude' },
];

type IncidentSeriesName =
  | 'Launch'
  | 'Docking'
  | 'Anomaly'
  | 'Conjunction Warning'
  | 'Reentry'
  | 'EVA'
  | 'Observation';

function buildIncidentParallel(): { name: string; data: number[][] }[] {
  const byType = new Map<IncidentSeriesName, number[][]>();
  for (const inc of CHART_DATASET.incidents) {
    const type = inc.type as IncidentSeriesName;
    if (!byType.has(type)) byType.set(type, []);
    const hour = new Date(inc.timestamp).getHours();
    byType.get(type)!.push([
      hour,
      SEVERITY_INDEX[inc.severity] ?? 1,
      Number(inc.position.lat.toFixed(3)),
      Number(inc.position.lng.toFixed(3)),
    ]);
  }
  return Array.from(byType.entries()).map(([name, data]) => ({ name, data }));
}

const incidentResponseSeries = buildIncidentParallel();

export const componentMeta = {
  description: 'Multiple parallel axes with lines linking each records value across dimensions',
  category: 'visualization' as const,
  keywords: ['parallel coordinates', 'multivariate', 'dimensions', 'axes', 'profile', 'comparison', 'high dimensional', 'clusters', 'lines', 'attributes'],
  whenToUse: 'For comparing records across several numeric dimensions at once — like spacecraft characteristics by type',
  whenNotToUse: 'For two variables use RoboScatterChart; for a single ranking use RoboBarChart',
  pairsWith: ['RoboCard', 'RoboScatterChart', 'RoboDataTable'],
  a11y: 'Renders to a canvas with role img and an aria-label prop that falls back to the title; pair with a data table for screen reader users',
};

const meta: Meta<typeof RoboParallelCoordinatesChart> = {
  excludeStories: ['componentMeta'],
  title: 'Data/Charts/ECharts/RoboParallelCoordinatesChart',
  component: RoboParallelCoordinatesChart,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    height: { control: { type: 'number', min: 200, max: 800, step: 50 } },
    lineOpacity: { control: { type: 'number', min: 0.05, max: 1, step: 0.05 } },
    isLoading: { control: 'boolean' },
  },
};
export default meta;

type Story = StoryObj<typeof RoboParallelCoordinatesChart>;

export const SatelliteMultiDimProfile: Story = {
  name: 'Spacecraft Multi-Dimensional Profile by Type',
  args: {
    series: CHART_DATASET.satelliteParallelSeries,
    axes: SPACECRAFT_AXES,
    title: 'Constellation — Spacecraft Characteristics by Type (5 Dimensions)',
    height: 500,
    lineOpacity: 0.3,
  },
};

export const IncidentResponseMetrics: Story = {
  name: 'Event Metrics (Hour, Severity, Position)',
  args: {
    series: incidentResponseSeries,
    axes: INCIDENT_AXES,
    title: 'Mission Control — Event Metrics by Type (4 Dimensions)',
    height: 500,
    lineOpacity: 0.4,
  },
};

export const Loading: Story = {
  name: 'Loading State',
  args: {
    series: [],
    axes: SPACECRAFT_AXES,
    height: 500,
    isLoading: true,
  },
};

export const Playground: Story = {
  args: {
    series: CHART_DATASET.satelliteParallelSeries,
    axes: SPACECRAFT_AXES,
    title: 'Parallel Coordinates Chart',
    height: 500,
    lineOpacity: 0.35,
    isLoading: false,
  },
};
