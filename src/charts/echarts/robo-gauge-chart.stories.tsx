import type { Meta, StoryObj } from '@storybook/react';

import { CHART_DATASET } from './mock-data';
import { RoboGaugeChart } from './robo-gauge-chart';

export const componentMeta = {
  description: 'Radial gauge showing a single value against a range with threshold bands',
  category: 'visualization' as const,
  keywords: ['gauge', 'dial', 'kpi', 'threshold', 'percentage', 'speedometer', 'single value', 'compliance score', 'meter', 'readiness'],
  whenToUse: 'For showing one value against a scale or target — like constellation readiness percent or a compliance score',
  whenNotToUse: 'For comparing many values use RoboBarChart; for a bare number with a delta use RoboStatCard',
  pairsWith: ['RoboStatCard', 'RoboCard'],
  a11y: 'Renders to a canvas with role img and an aria-label prop that falls back to the gauge name; expose the value in adjacent text',
};

const meta: Meta<typeof RoboGaugeChart> = {
  excludeStories: ['componentMeta'],
  title: 'Data/Charts/ECharts/RoboGaugeChart',
  component: RoboGaugeChart,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    variant: { control: 'select', options: ['arc', 'ring', 'grade'] },
    value: { control: { type: 'number', min: 0, max: 100, step: 1 } },
    height: { control: { type: 'number', min: 150, max: 500, step: 50 } },
    isLoading: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof RoboGaugeChart>;

export const ConstellationReadinessArc: Story = {
  args: {
    value: Math.round(CHART_DATASET.constellationReadinessPct),
    variant: 'arc',
    name: 'Constellation Ready',
    unit: '%',
    height: 300,
  },
};

export const FuelRingGauge: Story = {
  args: {
    value: 68,
    variant: 'ring',
    name: 'Fuel Reserve',
    unit: '%',
    height: 300,
  },
};

const GRADE_THRESHOLDS = [
  { value: 33, color: '#ef4444' },
  { value: 67, color: '#f59e0b' },
  { value: 100, color: '#22c55e' },
];

export const IncidentResolutionGrade: Story = {
  args: {
    value: Math.round(CHART_DATASET.incidentResolutionPct),
    variant: 'grade',
    colorThresholds: GRADE_THRESHOLDS,
    name: 'Resolution Rate',
    unit: '%',
    height: 300,
  },
};

export const Loading: Story = {
  args: {
    value: 0,
    height: 300,
    isLoading: true,
  },
};

export const Playground: Story = {
  args: {
    value: 72,
    variant: 'arc',
    name: 'Mission Ready',
    unit: '%',
    height: 300,
  },
};
