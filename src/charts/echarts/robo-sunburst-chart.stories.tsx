import type { Meta, StoryObj } from '@storybook/react';

import { CHART_DATASET } from './mock-data';
import { RoboSunburstChart } from './robo-sunburst-chart';

const SPACE_FLAVOR = [
  {
    name: 'LEO',
    children: [
      { name: 'Satellite', value: 42 },
      { name: 'CubeSat', value: 38 },
      { name: 'Space Station', value: 27 },
    ],
  },
  {
    name: 'GEO',
    children: [
      { name: 'Satellite', value: 31 },
      { name: 'Telescope', value: 55 },
      { name: 'Cargo Freighter', value: 18 },
    ],
  },
  {
    name: 'Deep Space',
    children: [
      { name: 'Probe', value: 64 },
      { name: 'Orbiter', value: 22 },
    ],
  },
];

// 2-level: spacecraft type → operational status (avoids 3-level noise with spacecraftClass)
const constellationHierarchy = (() => {
  const byType: Record<string, Record<string, number>> = {};
  for (const v of CHART_DATASET.constellation) {
    if (!byType[v.spacecraftType]) byType[v.spacecraftType] = {};
    byType[v.spacecraftType][v.status] = (byType[v.spacecraftType][v.status] ?? 0) + 1;
  }
  return Object.entries(byType).map(([type, statuses]) => ({
    name: type,
    children: Object.entries(statuses).map(([status, count]) => ({
      name: status,
      value: count,
    })),
  }));
})();

export const componentMeta = {
  description: 'Radial hierarchy of concentric rings sized by value at each level',
  category: 'visualization' as const,
  keywords: ['sunburst', 'hierarchy', 'radial', 'rings', 'drill down', 'nested', 'tree', 'proportion', 'breakdown', 'levels'],
  whenToUse: 'For showing a multi-level hierarchy as concentric rings — like constellation composition by type then status',
  whenNotToUse: 'For rectangular hierarchy use RoboTreemap; for flat part-of-whole use RoboPieChart',
  pairsWith: ['RoboTreemap', 'RoboCirclePacking', 'RoboCard'],
  a11y: 'Renders to a canvas with role img and an aria-label prop that falls back to the title; pair with a data table for screen reader users',
};

const meta: Meta<typeof RoboSunburstChart> = {
  excludeStories: ['componentMeta'],
  title: 'Data/Charts/ECharts/RoboSunburstChart',
  component: RoboSunburstChart,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    rounded: { control: 'boolean' },
    colorByValue: { control: 'boolean' },
    height: { control: { type: 'number', min: 200, max: 800, step: 50 } },
    isLoading: { control: 'boolean' },
  },
};
export default meta;

type Story = StoryObj<typeof RoboSunburstChart>;

export const ConstellationHierarchy: Story = {
  name: 'Constellation Hierarchy (Type > Status)',
  args: {
    data: constellationHierarchy,
    title: 'Constellation Composition — Type and Status Breakdown',
    height: 500,
  },
};

export const RoundedSunburst: Story = {
  name: 'Rounded Segments',
  args: {
    data: SPACE_FLAVOR,
    title: 'Orbital Regime Profile (Rounded)',
    rounded: true,
    height: 460,
  },
};

export const VisualMapSunburst: Story = {
  name: 'Color by Value (VisualMap)',
  args: {
    data: SPACE_FLAVOR,
    title: 'Spacecraft by Regime — Color Scaled by Count',
    colorByValue: true,
    height: 500,
  },
};

export const SpaceFlavorProfile: Story = {
  name: 'Orbital Regime Profile (Static)',
  args: {
    data: SPACE_FLAVOR,
    title: 'Orbital Regime and Spacecraft Type Mix',
    height: 460,
  },
};

export const Loading: Story = {
  name: 'Loading State',
  args: {
    data: [],
    height: 500,
    isLoading: true,
  },
};

export const Playground: Story = {
  args: {
    data: constellationHierarchy,
    title: 'Sunburst Chart',
    height: 500,
    rounded: false,
    colorByValue: false,
    isLoading: false,
  },
};
