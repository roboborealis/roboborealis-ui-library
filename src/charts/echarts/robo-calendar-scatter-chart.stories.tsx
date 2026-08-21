import type { Meta, StoryObj } from '@storybook/react';

import { CHART_DATASET } from './mock-data';
import { RoboCalendarScatterChart } from './robo-calendar-scatter-chart';

// ConstellationActivityDays: count of satellites with a recorded position per calendar day
function buildConstellationActivityDays(): [string, number][] {
  const counts = new Map<string, number>();
  for (const v of CHART_DATASET.constellation) {
    const date = v.timestamp.split('T')[0];
    if (date) counts.set(date, (counts.get(date) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => [date, count]);
}

const constellationActivityDays = buildConstellationActivityDays();
const constellationYear = constellationActivityDays[0]?.[0]
  ? parseInt(constellationActivityDays[0][0].substring(0, 4), 10)
  : new Date().getFullYear();

// Derive the year from incident calendar data
const incidentYear = CHART_DATASET.incidentCalendarScatter[0]?.[0]
  ? parseInt(CHART_DATASET.incidentCalendarScatter[0][0].substring(0, 4), 10)
  : new Date().getFullYear();

export const componentMeta = {
  description: 'Calendar grid where each day carries a scatter point scaled by value',
  category: 'visualization' as const,
  keywords: ['calendar', 'scatter', 'daily', 'day', 'bubble', 'point', 'activity', 'year', 'count', 'size'],
  whenToUse: 'For plotting a daily count as a sized dot on a calendar grid — like satellites reporting position per day',
  whenNotToUse: 'For color intensity use RoboCalendarHeatmap; for bar height comparison use RoboCalendarBarChart',
  pairsWith: ['RoboCard', 'RoboStatCard', 'RoboCalendarHeatmap'],
  a11y: 'Renders to a canvas with role img and an aria-label prop that falls back to the title; pair with a data table for screen reader users',
};

const meta: Meta<typeof RoboCalendarScatterChart> = {
  excludeStories: ['componentMeta'],
  title: 'Data/Charts/ECharts/RoboCalendarScatterChart',
  component: RoboCalendarScatterChart,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    height: { control: { type: 'number', min: 100, max: 400, step: 20 } },
    isLoading: { control: 'boolean' },
  },
};
export default meta;

type Story = StoryObj<typeof RoboCalendarScatterChart>;

export const IncidentBubbles: Story = {
  name: 'Incident Bubbles (Daily Count)',
  args: {
    data: CHART_DATASET.incidentCalendarScatter,
    year: incidentYear,
    title: 'Mission Control — Daily Anomaly Count',
    height: 200,
    colorRange: ['#fde68a', '#dc2626'],
  },
};

export const ConstellationActivityDays: Story = {
  name: 'Constellation Activity Days (Satellites Reporting)',
  args: {
    data: constellationActivityDays,
    year: constellationYear,
    title: 'Constellation — Satellites with Position Report by Day',
    height: 200,
  },
};

export const Loading: Story = {
  name: 'Loading State',
  args: {
    data: [],
    height: 200,
    isLoading: true,
  },
};

export const Playground: Story = {
  args: {
    data: CHART_DATASET.incidentCalendarScatter,
    year: incidentYear,
    title: 'Calendar Scatter Chart',
    height: 200,
    isLoading: false,
  },
};
