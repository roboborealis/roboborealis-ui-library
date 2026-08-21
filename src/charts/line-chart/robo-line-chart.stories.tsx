import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { RoboLineChart } from './robo-line-chart';
import { RoboLoading } from '../../feedback/loading/robo-loading';


export const componentMeta = {
  description: 'Line chart for time-series data and trend visualization',
  category: 'visualization' as const,
  keywords: ['line', 'chart', 'time', 'series', 'trend', 'graph', 'xy', 'plot'],
  whenToUse: 'For time-series trends, multi-series comparison, or continuous data over time',
  whenNotToUse: 'For categorical comparison use RoboBarChart; for cumulative volume use RoboAreaChart',
  pairsWith: ['RoboStatCard', 'RoboCard', 'RoboTooltip', 'RoboDatePicker'],
  a11y: 'Provide data table alternative; interactive tooltips should be keyboard accessible',
};
const meta: Meta<typeof RoboLineChart> = {
  title: 'Data/Charts/RoboLineChart',
  excludeStories: ['componentMeta'],
    component: RoboLineChart,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    isLoading:   { control: 'boolean' },
    height:      { control: { type: 'number', min: 150, max: 600, step: 50 } },
    showGrid:    { control: 'boolean' },
    showLegend:  { control: 'boolean' },
    showTooltip: { control: 'boolean' },
  },
};
export default meta;

type Story = StoryObj<typeof RoboLineChart>;

// ---------------------------------------------------------------------------
// Sample data
// ---------------------------------------------------------------------------

const monthlyData = [
  { month: 'Jan', active: 142, overdue: 8,  docked: 31 },
  { month: 'Feb', active: 138, overdue: 12, docked: 28 },
  { month: 'Mar', active: 155, overdue: 6,  docked: 34 },
  { month: 'Apr', active: 162, overdue: 9,  docked: 29 },
  { month: 'May', active: 171, overdue: 5,  docked: 36 },
  { month: 'Jun', active: 168, overdue: 11, docked: 32 },
  { month: 'Jul', active: 175, overdue: 7,  docked: 38 },
  { month: 'Aug', active: 182, overdue: 4,  docked: 41 },
];

const dailyPositions = Array.from({ length: 14 }, (_, i) => ({
  day: `Apr ${i + 1}`,
  speed: Math.round(12 + Math.random() * 8),
}));

const eightSeriesData = [
  { month: 'Jan', cargo: 210, probe: 145, passenger: 78, fishing: 42, bulk: 95, container: 130, tug: 28, other: 35 },
  { month: 'Feb', cargo: 225, probe: 138, passenger: 82, fishing: 38, bulk: 102, container: 125, tug: 31, other: 40 },
  { month: 'Mar', cargo: 198, probe: 152, passenger: 88, fishing: 51, bulk: 88, container: 143, tug: 26, other: 44 },
  { month: 'Apr', cargo: 242, probe: 141, passenger: 85, fishing: 45, bulk: 110, container: 136, tug: 33, other: 38 },
  { month: 'May', cargo: 256, probe: 160, passenger: 92, fishing: 49, bulk: 118, container: 148, tug: 29, other: 42 },
  { month: 'Jun', cargo: 231, probe: 155, passenger: 96, fishing: 43, bulk: 105, container: 151, tug: 35, other: 47 },
  { month: 'Jul', cargo: 269, probe: 148, passenger: 90, fishing: 55, bulk: 123, container: 158, tug: 31, other: 51 },
  { month: 'Aug', cargo: 248, probe: 163, passenger: 98, fishing: 47, bulk: 115, container: 162, tug: 37, other: 55 },
];

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
          <p style={{ fontSize: '0.75rem', color: 'var(--secondary-text)', marginBottom: 8 }}>Single line</p>
          <RoboLineChart data={monthlyData} xAxisKey='month' lines={[{ dataKey: 'active', name: 'Active satellites' }]} height={260} />
        </div>
        <div>
          <p style={{ fontSize: '0.75rem', color: 'var(--secondary-text)', marginBottom: 8 }}>Multiple lines</p>
          <RoboLineChart data={monthlyData} xAxisKey='month' lines={[{ dataKey: 'active', name: 'Active' }, { dataKey: 'overdue', name: 'Overdue' }, { dataKey: 'docked', name: 'Docked' }]} height={260} />
        </div>
        <div>
          <p style={{ fontSize: '0.75rem', color: 'var(--secondary-text)', marginBottom: 8 }}>Dense series (8 lines)</p>
          <RoboLineChart data={eightSeriesData} xAxisKey='month' lines={[{ dataKey: 'cargo', name: 'Cargo Freighter' }, { dataKey: 'probe', name: 'Probe' }, { dataKey: 'passenger', name: 'Crew Capsule' }, { dataKey: 'fishing', name: 'CubeSat' }, { dataKey: 'bulk', name: 'Heavy Lifter' }, { dataKey: 'container', name: 'Orbiter' }, { dataKey: 'tug', name: 'Tug' }, { dataKey: 'other', name: 'Other' }]} height={260} />
        </div>
        <div>
          <p style={{ fontSize: '0.75rem', color: 'var(--secondary-text)', marginBottom: 8 }}>Custom colors</p>
          <RoboLineChart data={monthlyData} xAxisKey='month' lines={[{ dataKey: 'active', name: 'Active', color: 'var(--success)' }, { dataKey: 'overdue', name: 'Overdue', color: 'var(--destructive)' }, { dataKey: 'docked', name: 'Docked', color: 'var(--primary)' }]} height={260} />
        </div>
      </div>
    );
  },
};

export const Default: Story = {
  args: {
    data: monthlyData,
    xAxisKey: 'month',
    lines: [{ dataKey: 'active', name: 'Active satellites' }],
    height: 300,
  },
};

export const MultiLine: Story = {
  name: 'Multiple Lines',
  args: {
    data: monthlyData,
    xAxisKey: 'month',
    lines: [
      { dataKey: 'active',  name: 'Active' },
      { dataKey: 'overdue', name: 'Overdue' },
      { dataKey: 'docked',  name: 'Docked' },
    ],
    height: 300,
  },
};

export const TwoLines: Story = {
  name: 'Dual Series — 2 lines',
  args: {
    data: monthlyData,
    xAxisKey: 'month',
    lines: [
      { dataKey: 'active',  name: 'Active' },
      { dataKey: 'overdue', name: 'Overdue' },
    ],
    height: 300,
  },
};

export const EightLines: Story = {
  name: 'Dense Series — 8 lines',
  args: {
    data: eightSeriesData,
    xAxisKey: 'month',
    // Colors cycle through --chart-1…--chart-6 then repeat for series 7 and 8
    lines: [
      { dataKey: 'cargo',     name: 'Cargo Freighter' },
      { dataKey: 'probe',    name: 'Probe' },
      { dataKey: 'passenger', name: 'Crew Capsule' },
      { dataKey: 'fishing',   name: 'CubeSat' },
      { dataKey: 'bulk',      name: 'Heavy Lifter' },
      { dataKey: 'container', name: 'Orbiter' },
      { dataKey: 'tug',       name: 'Tug' },
      { dataKey: 'other',     name: 'Other' },
    ],
    height: 350,
  },
};

export const CustomColors: Story = {
  name: 'Custom Colors',
  args: {
    data: monthlyData,
    xAxisKey: 'month',
    lines: [
      { dataKey: 'active',  name: 'Active',  color: 'var(--success)' },
      { dataKey: 'overdue', name: 'Overdue', color: 'var(--destructive)' },
      { dataKey: 'docked',  name: 'Docked',  color: 'var(--primary)' },
    ],
    height: 300,
  },
};

export const SingleMetric: Story = {
  name: 'Single Metric — Velocity Trend',
  args: {
    data: dailyPositions,
    xAxisKey: 'day',
    lines: [{ dataKey: 'speed', name: 'Velocity (km/s)', strokeWidth: 2 }],
    height: 250,
    showLegend: false,
    'aria-label': 'Satellite velocity over the last 14 days',
  },
};

export const NoGrid: Story = {
  name: 'No Grid Lines',
  args: {
    data: monthlyData,
    xAxisKey: 'month',
    lines: [{ dataKey: 'active', name: 'Active' }, { dataKey: 'overdue', name: 'Overdue' }],
    showGrid: false,
    height: 280,
  },
};

export const Loading: Story = {
  name: 'Loading State',
  args: {
    data: [],
    xAxisKey: 'month',
    lines: [],
    height: 300,
    isLoading: true,
  },
};

export const Playground: Story = {
  args: {
    data: monthlyData,
    xAxisKey: 'month',
    lines: [{ dataKey: 'active', name: 'Active satellites' }],
    height: 300,
    showGrid: true,
    showLegend: true,
    showTooltip: true,
  },
};
