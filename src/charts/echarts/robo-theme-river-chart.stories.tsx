import type { Meta, StoryObj } from '@storybook/react';

import { CHART_DATASET } from './mock-data';
import { RoboThemeRiverChart } from './robo-theme-river-chart';

// SatelliteStatusOverTime: distribute 200 satellites across 12 monthly slots by index
const SPACECRAFT_STATUS_LABELS = ['Operational', 'Safe Mode', 'Station-Keeping', 'Loss of Signal'];

function buildSatelliteStatusRiver(): [string, number, string][] {
  const rows: [string, number, string][] = [];
  const satellites = CHART_DATASET.constellation;
  for (let month = 0; month < 12; month++) {
    const date = new Date(2024, month, 15).toISOString().split('T')[0] as string;
    const counts: Record<string, number> = {};
    for (const label of SPACECRAFT_STATUS_LABELS) counts[label] = 0;
    satellites.forEach((v, i) => {
      const slotMonth = 11 - (i % 12);
      if (slotMonth === month) {
        const label = SPACECRAFT_STATUS_LABELS[i % SPACECRAFT_STATUS_LABELS.length] as string;
        counts[label] = (counts[label] ?? 0) + 1;
      }
    });
    for (const [label, count] of Object.entries(counts)) {
      rows.push([date, count, label]);
    }
  }
  return rows;
}

const satelliteStatusRiver = buildSatelliteStatusRiver();

export const componentMeta = {
  description: 'Stacked stream graph showing category volumes flowing over time',
  category: 'visualization' as const,
  keywords: ['theme river', 'stream graph', 'stacked area', 'flow', 'over time', 'volume', 'trend', 'composition', 'temporal', 'streamgraph'],
  whenToUse: 'For showing how several category volumes shift over time as flowing bands — like anomaly types by month',
  whenNotToUse: 'For a single series use RoboAreaChart; for exact stacked totals use RoboBarChart',
  pairsWith: ['RoboCard', 'RoboAreaChart', 'RoboLineChart'],
  a11y: 'Renders to a canvas with role img and an aria-label prop that falls back to the title; pair with a data table for screen reader users',
};

const meta: Meta<typeof RoboThemeRiverChart> = {
  excludeStories: ['componentMeta'],
  title: 'Data/Charts/ECharts/RoboThemeRiverChart',
  component: RoboThemeRiverChart,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    height: { control: { type: 'number', min: 200, max: 800, step: 50 } },
    isLoading: { control: 'boolean' },
  },
};
export default meta;

type Story = StoryObj<typeof RoboThemeRiverChart>;

export const IncidentTypeComposition: Story = {
  name: 'Anomaly Type Composition Over Time',
  args: {
    data: CHART_DATASET.incidentThemeRiver,
    title: 'Mission Control — Anomaly Type Volume Over Time',
    height: 460,
  },
};

export const SatelliteStatusOverTime: Story = {
  name: 'Satellite Status Distribution Over Time',
  args: {
    data: satelliteStatusRiver,
    title: 'Constellation — Satellite Status Distribution (2024)',
    height: 460,
  },
};

export const Loading: Story = {
  name: 'Loading State',
  args: {
    data: [],
    height: 460,
    isLoading: true,
  },
};

export const Playground: Story = {
  args: {
    data: CHART_DATASET.incidentThemeRiver,
    title: 'Theme River Chart',
    height: 460,
    isLoading: false,
  },
};
