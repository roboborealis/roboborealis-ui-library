import type { Meta, StoryObj } from '@storybook/react';

import { makeEventHistory } from '@roboborealis/space-faker';

import { RoboHeatmap } from './robo-heatmap';

const HOURS = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`);
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function buildTrafficData(): [number, number, number][] {
  const result: [number, number, number][] = [];
  for (let day = 0; day < 7; day++) {
    for (let hour = 0; hour < 24; hour++) {
      const isWeekday = day >= 1 && day <= 5;
      const isDaytime = hour >= 6 && hour <= 20;
      const base = isWeekday && isDaytime ? 40 : 8;
      const peak = hour >= 8 && hour <= 10 ? 30 : hour >= 16 && hour <= 18 ? 25 : 0;
      result.push([hour, day, Math.round(base + peak + Math.random() * 15)]);
    }
  }
  return result;
}

function buildIncidentHeatData(): [number, number, number][] {
  const incidents = makeEventHistory(300, 90);
  const grid: number[][] = Array.from({ length: 7 }, () => Array(24).fill(0));
  for (const inc of incidents) {
    const d = new Date(inc.timestamp);
    const day = d.getDay();
    const hour = d.getHours();
    grid[day][hour] += 1;
  }
  const result: [number, number, number][] = [];
  for (let day = 0; day < 7; day++) {
    for (let hour = 0; hour < 24; hour++) {
      result.push([hour, day, grid[day][hour]]);
    }
  }
  return result;
}

const trafficData = buildTrafficData();
const incidentData = buildIncidentHeatData();

export const componentMeta = {
  description: 'Grid heatmap coloring cells by value across two categorical or spatial axes',
  category: 'visualization' as const,
  keywords: ['heatmap', 'grid', 'matrix', 'intensity', 'density', 'two-axis', 'cells', 'traffic', 'frequency', 'color scale'],
  whenToUse: 'For showing value intensity across two axes — like ground-station passes by sector and hour',
  whenNotToUse: 'For correlation coefficients use RoboCorrelationHeatmap; for daily calendar density use RoboCalendarHeatmap',
  pairsWith: ['RoboCard', 'RoboCorrelationHeatmap', 'RoboStatCard'],
  a11y: 'Renders to a canvas with role img and an aria-label derived from the title prop; pair with a data table for screen reader users',
};

const meta: Meta<typeof RoboHeatmap> = {
  excludeStories: ['componentMeta'],
  title: 'Data/Charts/ECharts/RoboHeatmap',
  component: RoboHeatmap,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    height: { control: { type: 'number', min: 200, max: 600, step: 50 } },
    isLoading: { control: 'boolean' },
  },
};
export default meta;

type Story = StoryObj<typeof RoboHeatmap>;

export const SatelliteTraffic: Story = {
  name: 'Ground-Station Passes by Hour & Day — Goldstone',
  args: {
    data: trafficData,
    xCategories: HOURS,
    yCategories: DAYS,
    title: 'Goldstone Complex — Contact Pass Intensity',
    height: 380,
  },
};

export const IncidentFrequency: Story = {
  name: 'Anomaly Event Frequency by Hour & Day',
  args: {
    data: incidentData,
    xCategories: HOURS,
    yCategories: DAYS,
    title: 'LEO Sector — Anomaly Event Frequency (90 days)',
    height: 380,
    colorRange: ['rgba(148,163,184,0.15)', '#ef4444'],
  },
};

export const Loading: Story = {
  name: 'Loading State',
  args: {
    data: [],
    xCategories: HOURS,
    yCategories: DAYS,
    height: 380,
    isLoading: true,
  },
};

export const Playground: Story = {
  args: {
    data: trafficData,
    xCategories: HOURS,
    yCategories: DAYS,
    title: 'Contact Pass Intensity',
    height: 380,
    isLoading: false,
  },
};
