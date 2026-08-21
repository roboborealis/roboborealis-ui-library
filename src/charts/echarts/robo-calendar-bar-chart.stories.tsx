import type { Meta, StoryObj } from '@storybook/react';

import { CHART_DATASET } from './mock-data';
import { RoboCalendarBarChart } from './robo-calendar-bar-chart';

const incidentYear = CHART_DATASET.incidentCalendarScatter[0]?.[0]
  ? parseInt(CHART_DATASET.incidentCalendarScatter[0][0].substring(0, 4), 10)
  : new Date().getFullYear();

export const componentMeta = {
  description: 'Calendar grid where each day cell is a small bar sized by a daily value',
  category: 'visualization' as const,
  keywords: ['calendar', 'bar', 'daily', 'per-day', 'day', 'activity', 'time-series', 'count', 'year', 'incidents'],
  whenToUse: 'For showing one daily metric across weeks or a year as day-cell bars — like anomaly events per day',
  whenNotToUse: 'For encoding magnitude by color instead of bar height use RoboCalendarHeatmap; for smooth trends use RoboLineChart',
  pairsWith: ['RoboCard', 'RoboStatCard', 'RoboCalendarHeatmap'],
  a11y: 'Renders to a canvas with role img and an aria-label prop that falls back to the title; pair with a data table for screen reader users',
};

const meta: Meta<typeof RoboCalendarBarChart> = {
  excludeStories: ['componentMeta'],
  title: 'Data/Charts/ECharts/RoboCalendarBarChart',
  component: RoboCalendarBarChart,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    height: { control: { type: 'number', min: 100, max: 400, step: 20 } },
    barMaxWidth: { control: { type: 'number', min: 2, max: 16, step: 1 } },
    isLoading: { control: 'boolean' },
  },
};
export default meta;

type Story = StoryObj<typeof RoboCalendarBarChart>;

export const IncidentsByDay: Story = {
  name: 'Incidents By Day',
  args: {
    data: CHART_DATASET.incidentCalendarScatter,
    year: incidentYear,
    title: 'Deep Space Network — Anomaly Events per Day',
    height: 200,
  },
};

export const WithGradient: Story = {
  name: 'With Gradient',
  args: {
    data: CHART_DATASET.incidentCalendarScatter,
    year: incidentYear,
    title: 'Anomaly Density Calendar (Gradient)',
    height: 220,
    colorRange: ['rgba(148,163,184,0.15)', '#ef4444'],
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
    title: 'Calendar Bar Chart',
    height: 200,
    barMaxWidth: 6,
    isLoading: false,
  },
};
