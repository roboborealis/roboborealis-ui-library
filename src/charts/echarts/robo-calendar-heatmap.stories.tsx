import type { Meta, StoryObj } from '@storybook/react';

import { makeEventHistory } from '@roboborealis/space-faker';

import { RoboCalendarHeatmap } from './robo-calendar-heatmap';

const CURRENT_YEAR = 2025;

function buildCalendarData(count: number): { date: string; value: number }[] {
  const incidents = makeEventHistory(count, 365);
  const byDate: Record<string, number> = {};
  for (const inc of incidents) {
    const d = new Date(inc.timestamp);
    if (d.getFullYear() !== CURRENT_YEAR) continue;
    const key = `${CURRENT_YEAR}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    byDate[key] = (byDate[key] ?? 0) + 1;
  }
  return Object.entries(byDate).map(([date, value]) => ({ date, value }));
}

const sarData = buildCalendarData(280);
const mleData = buildCalendarData(180);

export const componentMeta = {
  description: 'Calendar grid where each day cell is colored by value intensity',
  category: 'visualization' as const,
  keywords: ['calendar', 'heatmap', 'daily', 'day', 'intensity', 'density', 'year', 'github', 'activity', 'frequency'],
  whenToUse: 'For showing daily value intensity over a long period — like daily case count shaded by volume across a year',
  whenNotToUse: 'For comparing exact daily magnitudes use RoboCalendarBarChart; for variable-vs-variable grids use RoboHeatmap',
  pairsWith: ['RoboCard', 'RoboStatCard', 'RoboCalendarBarChart'],
  a11y: 'Renders to a canvas with role img and an aria-label derived from the title prop; pair with a data table for screen reader users',
};

const meta: Meta<typeof RoboCalendarHeatmap> = {
  excludeStories: ['componentMeta'],
  title: 'Data/Charts/ECharts/RoboCalendarHeatmap',
  component: RoboCalendarHeatmap,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    year: { control: { type: 'number', min: 2020, max: 2030 } },
    height: { control: { type: 'number', min: 150, max: 400, step: 25 } },
    isLoading: { control: 'boolean' },
  },
};
export default meta;

type Story = StoryObj<typeof RoboCalendarHeatmap>;

export const SARIncidents: Story = {
  name: 'Anomaly Event Frequency — LEO Sector (2025)',
  args: {
    data: sarData,
    year: CURRENT_YEAR,
    title: 'LEO Sector — Daily Anomaly Event Count (2025)',
    height: 180,
  },
};

export const MLEOperations: Story = {
  name: 'Conjunction Warnings — LEO Sector (2025)',
  args: {
    data: mleData,
    year: CURRENT_YEAR,
    title: 'LEO Sector — Conjunction Warning Screenings (2025)',
    height: 180,
    colorRange: ['rgba(148,163,184,0.15)', '#3b82f6'],
  },
};

export const Loading: Story = {
  name: 'Loading State',
  args: {
    data: [],
    year: CURRENT_YEAR,
    height: 220,
    isLoading: true,
  },
};

export const Playground: Story = {
  args: {
    data: sarData,
    year: CURRENT_YEAR,
    title: 'Anomaly Event Frequency',
    height: 220,
  },
};
