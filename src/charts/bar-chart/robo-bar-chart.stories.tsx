import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { RoboBarChart } from './robo-bar-chart';
import { RoboLoading } from '../../feedback/loading/robo-loading';


export const componentMeta = {
  description: 'Vertical or horizontal bar chart for categorical comparison',
  category: 'visualization' as const,
  keywords: ['bar', 'chart', 'column', 'categorical', 'comparison', 'histogram', 'graph'],
  whenToUse: 'For comparing discrete categories — satellite counts by type, monthly report totals',
  whenNotToUse: 'For time-series trends use RoboLineChart or RoboAreaChart; for part-of-whole use RoboPieChart',
  pairsWith: ['RoboStatCard', 'RoboCard', 'RoboTooltip', 'RoboSelect'],
  a11y: 'Provide data table alternative; use aria-label on chart container describing the comparison',
};
const meta: Meta<typeof RoboBarChart> = {
  title: 'Data/Charts/RoboBarChart',
  excludeStories: ['componentMeta'],
    component: RoboBarChart,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    isLoading:   { control: 'boolean' },
    orientation: { control: 'radio', options: ['vertical', 'horizontal'] },
    stacked:     { control: 'boolean' },
    height:      { control: { type: 'number', min: 150, max: 600, step: 50 } },
    showGrid:    { control: 'boolean' },
    showLegend:  { control: 'boolean' },
    showTooltip: { control: 'boolean' },
  },
};
export default meta;

type Story = StoryObj<typeof RoboBarChart>;

// ---------------------------------------------------------------------------
// Sample data
// ---------------------------------------------------------------------------

const reportsByType = [
  { type: 'FR', count: 312 },
  { type: 'PR', count: 589 },
  { type: 'SP', count: 88 },
  { type: 'DR', count: 47 },
];

const quarterlyByFlag = [
  { quarter: 'Q1', usa: 95,  gbr: 42, nor: 31 },
  { quarter: 'Q2', usa: 108, gbr: 38, nor: 29 },
  { quarter: 'Q3', usa: 112, gbr: 51, nor: 35 },
  { quarter: 'Q4', usa: 98,  gbr: 44, nor: 27 },
];

const satellitesByRegion = [
  { region: 'Low Earth Orbit',    satellites: 142 },
  { region: 'Medium Earth Orbit', satellites: 98 },
  { region: 'Geostationary',      satellites: 71 },
  { region: 'Highly Elliptical',  satellites: 54 },
  { region: 'Cislunar',           satellites: 18 },
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
          <p style={{ fontSize: '0.75rem', color: 'var(--secondary-text)', marginBottom: 8 }}>Vertical (single series)</p>
          <RoboBarChart data={reportsByType} xAxisKey='type' bars={[{ dataKey: 'count', name: 'Reports filed' }]} height={260} />
        </div>
        <div>
          <p style={{ fontSize: '0.75rem', color: 'var(--secondary-text)', marginBottom: 8 }}>Horizontal</p>
          <RoboBarChart data={satellitesByRegion} xAxisKey='region' bars={[{ dataKey: 'satellites', name: 'Active satellites' }]} orientation='horizontal' height={260} />
        </div>
        <div>
          <p style={{ fontSize: '0.75rem', color: 'var(--secondary-text)', marginBottom: 8 }}>Grouped</p>
          <RoboBarChart data={quarterlyByFlag} xAxisKey='quarter' bars={[{ dataKey: 'usa', name: 'NASA' }, { dataKey: 'gbr', name: 'ESA' }, { dataKey: 'nor', name: 'Roscosmos' }]} height={260} />
        </div>
        <div>
          <p style={{ fontSize: '0.75rem', color: 'var(--secondary-text)', marginBottom: 8 }}>Stacked</p>
          <RoboBarChart data={quarterlyByFlag} xAxisKey='quarter' bars={[{ dataKey: 'usa', name: 'NASA' }, { dataKey: 'gbr', name: 'ESA' }, { dataKey: 'nor', name: 'Roscosmos' }]} stacked height={260} />
        </div>
      </div>
    );
  },
};

export const Default: Story = {
  args: {
    data: reportsByType,
    xAxisKey: 'type',
    bars: [{ dataKey: 'count', name: 'Reports filed' }],
    height: 300,
  },
};

export const Grouped: Story = {
  name: 'Grouped Bars',
  args: {
    data: quarterlyByFlag,
    xAxisKey: 'quarter',
    bars: [
      { dataKey: 'usa', name: 'NASA' },
      { dataKey: 'gbr', name: 'ESA' },
      { dataKey: 'nor', name: 'Roscosmos' },
    ],
    height: 300,
  },
};

export const Stacked: Story = {
  name: 'Stacked Bars',
  args: {
    data: quarterlyByFlag,
    xAxisKey: 'quarter',
    bars: [
      { dataKey: 'usa', name: 'NASA' },
      { dataKey: 'gbr', name: 'ESA' },
      { dataKey: 'nor', name: 'Roscosmos' },
    ],
    stacked: true,
    height: 300,
  },
};

export const Horizontal: Story = {
  name: 'Horizontal Bars',
  args: {
    data: satellitesByRegion,
    xAxisKey: 'region',
    bars: [{ dataKey: 'satellites', name: 'Active satellites' }],
    orientation: 'horizontal',
    height: 320,
  },
};

export const CustomColors: Story = {
  name: 'Custom Colors',
  args: {
    data: reportsByType,
    xAxisKey: 'type',
    bars: [{ dataKey: 'count', name: 'Reports', color: 'var(--primary)' }],
    height: 280,
    showLegend: false,
  },
};

export const Loading: Story = {
  name: 'Loading State',
  args: {
    data: [],
    xAxisKey: 'type',
    bars: [],
    height: 300,
    isLoading: true,
  },
};

export const Playground: Story = {
  args: {
    data: reportsByType,
    xAxisKey: 'type',
    bars: [{ dataKey: 'count', name: 'Reports filed' }],
    height: 300,
    orientation: 'vertical',
    stacked: false,
    showGrid: true,
    showLegend: true,
    showTooltip: true,
  },
};
