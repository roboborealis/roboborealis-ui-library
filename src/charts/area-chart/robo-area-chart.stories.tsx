import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { RoboAreaChart } from './robo-area-chart';
import { RoboLoading } from '../../feedback/loading/robo-loading';


export const componentMeta = {
  description: 'Filled area chart for showing trends and cumulative values over time',
  category: 'visualization' as const,
  keywords: ['area', 'chart', 'trend', 'time', 'series', 'cumulative', 'fill', 'graph'],
  whenToUse: 'For showing volume or cumulative trends over time — stacked areas for part-to-whole',
  whenNotToUse: 'For precise point comparison use RoboLineChart; for categories use RoboBarChart',
  pairsWith: ['RoboStatCard', 'RoboCard', 'RoboTooltip'],
  a11y: 'Provide data table alternative or aria-label summary of the trend; chart is aria-hidden',
};
const meta: Meta<typeof RoboAreaChart> = {
  title: 'Data/Charts/RoboAreaChart',
  excludeStories: ['componentMeta'],
    component: RoboAreaChart,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    isLoading:   { control: 'boolean' },
    stacked:     { control: 'boolean' },
    height:      { control: { type: 'number', min: 150, max: 600, step: 50 } },
    showGrid:    { control: 'boolean' },
    showLegend:  { control: 'boolean' },
    showTooltip: { control: 'boolean' },
  },
};
export default meta;

type Story = StoryObj<typeof RoboAreaChart>;

// ---------------------------------------------------------------------------
// Sample data
// ---------------------------------------------------------------------------

const weeklySatellites = [
  { week: 'W1',  active: 148, docked: 32 },
  { week: 'W2',  active: 152, docked: 28 },
  { week: 'W3',  active: 161, docked: 35 },
  { week: 'W4',  active: 158, docked: 30 },
  { week: 'W5',  active: 174, docked: 38 },
  { week: 'W6',  active: 169, docked: 33 },
  { week: 'W7',  active: 182, docked: 41 },
  { week: 'W8',  active: 178, docked: 37 },
  { week: 'W9',  active: 191, docked: 44 },
  { week: 'W10', active: 188, docked: 40 },
];

const reportTrend = Array.from({ length: 12 }, (_, i) => ({
  month: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i],
  filed: 80 + Math.round(Math.random() * 60),
  overdue: 2 + Math.round(Math.random() * 14),
}));

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

export const AllVariants: Story = {
  name: 'All Variants',
  render: () => {
    const [ready, setReady] = React.useState(false);
    React.useEffect(() => {
      const t = setTimeout(() => setReady(true), 800);
      return () => clearTimeout(t);
    }, []);
    if (!ready) return <RoboLoading />;
    return (
      <div className='grid grid-cols-2 gap-6'>
        <div>
          <p style={{ fontSize: '0.75rem', color: 'var(--secondary-text)', marginBottom: 8 }}>Single area</p>
          <RoboAreaChart data={weeklySatellites} xAxisKey='week' areas={[{ dataKey: 'active', name: 'Active satellites' }]} height={260} />
        </div>
        <div>
          <p style={{ fontSize: '0.75rem', color: 'var(--secondary-text)', marginBottom: 8 }}>Multiple areas</p>
          <RoboAreaChart data={weeklySatellites} xAxisKey='week' areas={[{ dataKey: 'active', name: 'Active' }, { dataKey: 'docked', name: 'Docked' }]} height={260} />
        </div>
        <div>
          <p style={{ fontSize: '0.75rem', color: 'var(--secondary-text)', marginBottom: 8 }}>Stacked</p>
          <RoboAreaChart data={weeklySatellites} xAxisKey='week' areas={[{ dataKey: 'active', name: 'Active' }, { dataKey: 'docked', name: 'Docked' }]} stacked height={260} />
        </div>
        <div>
          <p style={{ fontSize: '0.75rem', color: 'var(--secondary-text)', marginBottom: 8 }}>Custom colors</p>
          <RoboAreaChart data={reportTrend} xAxisKey='month' areas={[{ dataKey: 'filed', name: 'Filed', color: 'var(--primary)', fillOpacity: 0.2 }, { dataKey: 'overdue', name: 'Overdue', color: 'var(--destructive)', fillOpacity: 0.15 }]} height={260} />
        </div>
      </div>
    );
  },
};

export const Default: Story = {
  args: {
    data: weeklySatellites,
    xAxisKey: 'week',
    areas: [{ dataKey: 'active', name: 'Active satellites' }],
    height: 300,
  },
};

export const MultiArea: Story = {
  name: 'Multiple Areas',
  args: {
    data: weeklySatellites,
    xAxisKey: 'week',
    areas: [
      { dataKey: 'active', name: 'Active' },
      { dataKey: 'docked', name: 'Docked' },
    ],
    height: 300,
  },
};

export const Stacked: Story = {
  name: 'Stacked Areas',
  args: {
    data: weeklySatellites,
    xAxisKey: 'week',
    areas: [
      { dataKey: 'active', name: 'Active' },
      { dataKey: 'docked', name: 'Docked' },
    ],
    stacked: true,
    height: 300,
  },
};

export const CustomColors: Story = {
  name: 'Custom Colors',
  args: {
    data: reportTrend,
    xAxisKey: 'month',
    areas: [
      { dataKey: 'filed',   name: 'Filed',   color: 'var(--primary)',     fillOpacity: 0.2 },
      { dataKey: 'overdue', name: 'Overdue', color: 'var(--destructive)', fillOpacity: 0.15 },
    ],
    height: 300,
  },
};

export const HighFillOpacity: Story = {
  name: 'High Fill Opacity',
  args: {
    data: weeklySatellites,
    xAxisKey: 'week',
    areas: [{ dataKey: 'active', name: 'Active satellites', fillOpacity: 0.4 }],
    showLegend: false,
    height: 260,
  },
};

export const Loading: Story = {
  name: 'Loading State',
  args: {
    data: [],
    xAxisKey: 'week',
    areas: [],
    height: 300,
    isLoading: true,
  },
};

export const Playground: Story = {
  args: {
    data: weeklySatellites,
    xAxisKey: 'week',
    areas: [{ dataKey: 'active', name: 'Active satellites' }],
    height: 300,
    stacked: false,
    showGrid: true,
    showLegend: true,
    showTooltip: true,
  },
};
