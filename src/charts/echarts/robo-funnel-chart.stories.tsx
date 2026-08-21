import type { Meta, StoryObj } from '@storybook/react';

import { CHART_DATASET } from './mock-data';
import { RoboFunnelChart } from './robo-funnel-chart';

const INSPECTION_FUNNEL = [
  { name: 'Satellites Targeted', value: 240 },
  { name: 'Contacted', value: 198 },
  { name: 'Diagnostics Run', value: 171 },
  { name: 'Anomalies Found', value: 89 },
  { name: 'Safe-Mode Commanded', value: 23 },
];

export const componentMeta = {
  description: 'Stacked funnel showing a quantity shrinking across sequential stages',
  category: 'visualization' as const,
  keywords: ['funnel', 'pipeline', 'stages', 'conversion', 'drop-off', 'steps', 'process', 'attrition', 'sequential', 'completion'],
  whenToUse: 'For showing how a quantity narrows through ordered stages — like reports moving through a processing pipeline',
  whenNotToUse: 'For unordered category comparison use RoboBarChart; for part-of-whole at one moment use RoboPieChart',
  pairsWith: ['RoboCard', 'RoboStatCard', 'RoboBarChart'],
  a11y: 'Renders to a canvas with role img and an aria-label prop that falls back to the title; pair with a data table for screen reader users',
};

const meta: Meta<typeof RoboFunnelChart> = {
  excludeStories: ['componentMeta'],
  title: 'Data/Charts/ECharts/RoboFunnelChart',
  component: RoboFunnelChart,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    sort: { control: 'select', options: ['descending', 'ascending', 'none'] },
    showPercentage: { control: 'boolean' },
    height: { control: { type: 'number', min: 200, max: 700, step: 50 } },
    isLoading: { control: 'boolean' },
  },
};
export default meta;

type Story = StoryObj<typeof RoboFunnelChart>;

export const ReportPipeline: Story = {
  name: 'Report Processing Pipeline',
  args: {
    stages: CHART_DATASET.reportFunnel,
    title: 'Anomaly Report Processing Pipeline',
    height: 380,
  },
};

export const WithPercentage: Story = {
  name: 'Completion Rates (Percentage)',
  args: {
    stages: CHART_DATASET.reportFunnel,
    showPercentage: true,
    title: 'Pipeline Completion Rates',
    height: 380,
  },
};

export const SatelliteInspection: Story = {
  name: 'Satellite Inspection Funnel',
  args: {
    stages: INSPECTION_FUNNEL,
    title: 'Mission Assurance — Satellite Inspection Funnel',
    height: 380,
  },
};

export const Pyramid: Story = {
  name: 'Inverted Pyramid',
  args: {
    stages: CHART_DATASET.reportFunnel,
    sort: 'ascending',
    title: 'Inverted Pyramid View',
    height: 380,
  },
};

export const Loading: Story = {
  name: 'Loading State',
  args: {
    stages: [],
    height: 380,
    isLoading: true,
  },
};

export const Playground: Story = {
  args: {
    stages: CHART_DATASET.reportFunnel,
    sort: 'descending',
    showPercentage: false,
    title: 'Funnel Chart',
    height: 380,
    isLoading: false,
  },
};
