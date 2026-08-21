import type { Meta, StoryObj } from '@storybook/react';

import { CHART_DATASET } from './mock-data';
import { aggregateByHour, aggregateCraftTypes } from './mock-data';
import { RoboNightingaleChart } from './robo-nightingale-chart';

const HOUR_GROUPS: { label: string; hours: number[] }[] = [
  { label: 'Night (00–05)', hours: [0, 1, 2, 3, 4, 5] },
  { label: 'Morning (06–11)', hours: [6, 7, 8, 9, 10, 11] },
  { label: 'Afternoon (12–17)', hours: [12, 13, 14, 15, 16, 17] },
  { label: 'Evening (18–23)', hours: [18, 19, 20, 21, 22, 23] },
];

const hourlyMap = aggregateByHour(CHART_DATASET.incidents);

const incidentsByWatchGroup = HOUR_GROUPS.map(({ label, hours }) => ({
  name: label,
  value: hours.reduce((sum, h) => sum + (hourlyMap[h]?.value ?? 0), 0),
}));

const satelliteTypeData = aggregateCraftTypes(CHART_DATASET.constellation).map((d) => ({
  name: d.name,
  value: d.value,
}));

export const componentMeta = {
  description: 'Polar rose chart where category sectors extend outward by value as radial bars',
  category: 'visualization' as const,
  keywords: ['nightingale', 'rose', 'polar', 'coxcomb', 'radial bar', 'wind rose', 'sector', 'cyclical', 'distribution', 'composition'],
  whenToUse: 'For comparing category magnitudes arranged radially — like incident distribution by watch group',
  whenNotToUse: 'For accurate magnitude reading use RoboBarChart; for simple part-of-whole use RoboPieChart',
  pairsWith: ['RoboCard', 'RoboPieChart', 'RoboBarChart'],
  a11y: 'Renders to a canvas with role img and an aria-label prop that falls back to the title; pair with a data table for screen reader users',
};

const meta: Meta<typeof RoboNightingaleChart> = {
  excludeStories: ['componentMeta'],
  title: 'Data/Charts/ECharts/RoboNightingaleChart',
  component: RoboNightingaleChart,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    roseType: { control: 'radio', options: ['area', 'radius'] },
    height: { control: { type: 'number', min: 200, max: 800, step: 50 } },
    isLoading: { control: 'boolean' },
  },
};
export default meta;

type Story = StoryObj<typeof RoboNightingaleChart>;

export const IncidentsByHourOfDay: Story = {
  name: 'Incidents by Watch Group (Hour of Day)',
  args: {
    data: incidentsByWatchGroup,
    title: 'Mission Control — Event Distribution by Watch Group',
    roseType: 'area',
    height: 420,
  },
};

export const SatelliteTypeDistribution: Story = {
  name: 'Spacecraft Type Distribution',
  args: {
    data: satelliteTypeData,
    title: 'Constellation Composition by Spacecraft Type',
    roseType: 'radius',
    height: 420,
  },
};

export const Loading: Story = {
  name: 'Loading State',
  args: {
    data: [],
    height: 420,
    isLoading: true,
  },
};

export const Playground: Story = {
  args: {
    data: incidentsByWatchGroup,
    title: 'Nightingale Rose Chart',
    roseType: 'area',
    height: 420,
    isLoading: false,
  },
};
