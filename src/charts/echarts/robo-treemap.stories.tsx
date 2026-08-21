import type { Meta, StoryObj } from '@storybook/react';

import { makeConstellation, makeEventHistory } from '@roboborealis/space-faker';
import type { RoboTreemapNode } from './robo-treemap';

import { RoboTreemap } from './robo-treemap';

function buildConstellationTreemap(): RoboTreemapNode[] {
  const constellation = makeConstellation(120, 42);
  const byType: Record<string, Record<string, Record<string, number>>> = {};
  for (const v of constellation) {
    if (!byType[v.spacecraftType]) byType[v.spacecraftType] = {};
    if (!byType[v.spacecraftType][v.spacecraftClass]) byType[v.spacecraftType][v.spacecraftClass] = {};
    const cur = byType[v.spacecraftType][v.spacecraftClass][v.status] ?? 0;
    byType[v.spacecraftType][v.spacecraftClass][v.status] = cur + 1;
  }
  return Object.entries(byType).map(([type, classes]) => ({
    name: type,
    children: Object.entries(classes).map(([cls, statuses]) => ({
      name: cls,
      children: Object.entries(statuses).map(([status, count]) => ({
        name: status,
        value: count,
      })),
    })),
  }));
}

function buildIncidentTreemap(): RoboTreemapNode[] {
  const incidents = makeEventHistory(250, 180);
  const byType: Record<string, Record<string, number>> = {};
  for (const inc of incidents) {
    if (!byType[inc.type]) byType[inc.type] = {};
    byType[inc.type][inc.severity] = (byType[inc.type][inc.severity] ?? 0) + 1;
  }
  return Object.entries(byType).map(([type, severities]) => ({
    name: type,
    children: Object.entries(severities).map(([severity, count]) => ({
      name: severity,
      value: count,
    })),
  }));
}

const constellationData = buildConstellationTreemap();
const incidentData = buildIncidentTreemap();

const diskData: RoboTreemapNode[] = [
  {
    name: 'Mission Control',
    children: [
      { name: 'Ephemeris & Orbits', value: 2480 },
      { name: 'Telemetry Data', value: 1820 },
      { name: 'Anomaly Records', value: 1240 },
    ],
  },
  {
    name: 'Catalog Records',
    children: [
      { name: 'NORAD Catalog', value: 3120 },
      { name: 'Payload Logs', value: 980 },
      { name: 'Conjunction Files', value: 1650 },
    ],
  },
  {
    name: 'Comms & Logs',
    children: [
      { name: 'Downlink Logs', value: 760 },
      { name: 'Position Reports', value: 2100 },
      { name: 'Event Reports', value: 1340 },
    ],
  },
];

export const componentMeta = {
  description: 'Nested rectangles sizing hierarchy nodes by value',
  category: 'visualization' as const,
  keywords: ['treemap', 'hierarchy', 'nested', 'rectangles', 'proportion', 'drill down', 'breakdown', 'tree', 'area', 'composition'],
  whenToUse: 'For showing a hierarchy where rectangle area encodes value — like constellation assets by type, class, and status',
  whenNotToUse: 'For radial hierarchy use RoboSunburstChart; for packed bubbles use RoboCirclePacking',
  pairsWith: ['RoboSunburstChart', 'RoboCirclePacking', 'RoboCard'],
  a11y: 'Renders to a canvas with role img and an aria-label derived from the title prop; pair with a data table for screen reader users',
};

const meta: Meta<typeof RoboTreemap> = {
  excludeStories: ['componentMeta'],
  title: 'Data/Charts/ECharts/RoboTreemap',
  component: RoboTreemap,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    colorScheme: { control: 'select', options: ['categorical', 'sequential'] },
    height: { control: { type: 'number', min: 200, max: 700, step: 50 } },
    isLoading: { control: 'boolean' },
  },
};
export default meta;

type Story = StoryObj<typeof RoboTreemap>;

export const ConstellationAssetBreakdown: Story = {
  name: 'Constellation Asset Breakdown — by Type & Class',
  args: {
    data: constellationData,
    title: 'Constellation Asset Breakdown — Type → Class → Status',
    height: 450,
    colorScheme: 'categorical',
  },
};

export const IncidentSeverityMap: Story = {
  name: 'Event Severity Map — Sequential Gradient',
  args: {
    data: incidentData,
    title: 'LEO Sector — Event Type & Severity Distribution (180 days)',
    height: 400,
    colorScheme: 'sequential',
  },
};

export const DiskUsage: Story = {
  name: 'Disk Usage Treemap — Mission Control Storage',
  args: {
    data: diskData,
    title: 'Mission Control Storage — Disk Usage by Subsystem (GB)',
    height: 380,
    colorScheme: 'sequential',
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
    data: constellationData,
    title: 'Constellation Asset Breakdown',
    height: 450,
    colorScheme: 'categorical',
  },
};
