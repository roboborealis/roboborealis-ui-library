import type { Meta, StoryObj } from '@storybook/react';

import { CHART_DATASET } from './mock-data';
import { buildSingleAxisSeries } from './mock-data';
import { RoboSingleAxisScatterChart } from './robo-single-axis-scatter-chart';

// SatelliteActivityByType: mass per satellite plotted on a time axis, one row per satellite type
const satelliteActivitySeries = buildSingleAxisSeries(CHART_DATASET.constellation);

// IncidentsBySeverity: one row per severity level, x = timestamp, y = sequential index within severity
// This shows temporal clustering of incidents by severity
type SeverityLevel = 'low' | 'medium' | 'high' | 'critical';
const SEVERITY_ORDER: SeverityLevel[] = ['low', 'medium', 'high', 'critical'];

function buildIncidentSeveritySeries(): { name: string; data: [string, number][] }[] {
  const bySeverity = new Map<SeverityLevel, [string, number][]>();
  for (const sev of SEVERITY_ORDER) bySeverity.set(sev, []);

  const counters: Record<string, number> = {};
  for (const inc of CHART_DATASET.incidents) {
    const sev = inc.severity as SeverityLevel;
    if (!bySeverity.has(sev)) continue;
    counters[sev] = (counters[sev] ?? 0) + 1;
    bySeverity.get(sev)!.push([inc.timestamp, counters[sev]!]);
  }

  return SEVERITY_ORDER.map((sev) => ({
    name: sev.charAt(0).toUpperCase() + sev.slice(1),
    data: bySeverity.get(sev) ?? [],
  }));
}

const incidentSeveritySeries = buildIncidentSeveritySeries();

export const componentMeta = {
  description: 'Points distributed along a single axis, often grouped in rows by category',
  category: 'visualization' as const,
  keywords: ['single axis', 'scatter', 'strip', 'dot plot', 'one dimension', 'distribution', 'timeline', 'rows', 'category', 'spread'],
  whenToUse: 'For showing distribution of values along one axis grouped by category — like mass activity by satellite type',
  whenNotToUse: 'For two-variable relationships use RoboScatterChart; for exact counts use RoboBarChart',
  pairsWith: ['RoboCard', 'RoboScatterChart', 'RoboStatCard'],
  a11y: 'Renders to a canvas with role img and an aria-label prop that falls back to the title; pair with a data table for screen reader users',
};

const meta: Meta<typeof RoboSingleAxisScatterChart> = {
  excludeStories: ['componentMeta'],
  title: 'Data/Charts/ECharts/RoboSingleAxisScatterChart',
  component: RoboSingleAxisScatterChart,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    height: { control: { type: 'number', min: 200, max: 900, step: 50 } },
    minSymbolSize: { control: { type: 'number', min: 2, max: 20, step: 1 } },
    maxSymbolSize: { control: { type: 'number', min: 10, max: 60, step: 2 } },
    isLoading: { control: 'boolean' },
  },
};
export default meta;

type Story = StoryObj<typeof RoboSingleAxisScatterChart>;

export const SatelliteActivityByType: Story = {
  name: 'Satellite Activity by Type (Mass over Time)',
  args: {
    series: satelliteActivitySeries,
    title: 'Constellation — Mass Activity by Satellite Type',
    height: 500,
  },
};

export const IncidentsBySeverity: Story = {
  name: 'Anomalies by Severity Level (Temporal Distribution)',
  args: {
    series: incidentSeveritySeries,
    title: 'Mission Control — Anomaly Temporal Distribution by Severity',
    height: 420,
  },
};

export const Loading: Story = {
  name: 'Loading State',
  args: {
    series: [],
    height: 420,
    isLoading: true,
  },
};

export const Playground: Story = {
  args: {
    series: satelliteActivitySeries,
    title: 'Single Axis Scatter Chart',
    height: 500,
    minSymbolSize: 4,
    maxSymbolSize: 28,
    isLoading: false,
  },
};
