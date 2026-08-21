import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { RoboPieChart } from './robo-pie-chart';
import { RoboLoading } from '../../feedback/loading/robo-loading';


export const componentMeta = {
  description: 'Pie or donut chart for part-to-whole proportional visualization',
  category: 'visualization' as const,
  keywords: ['pie', 'donut', 'chart', 'proportion', 'percentage', 'share', 'segment'],
  whenToUse: 'For showing proportion of a whole with 2-6 segments — status breakdown, type distribution',
  whenNotToUse: 'For more than 6 categories use RoboBarChart; for trends use RoboLineChart',
  pairsWith: ['RoboStatCard', 'RoboCard', 'RoboTooltip', 'RoboBadge'],
  a11y: 'Provide accessible text summary of proportions; segments need aria-label with value and percentage',
};
const meta: Meta<typeof RoboPieChart> = {
  title: 'Data/Charts/RoboPieChart',
  excludeStories: ['componentMeta'],
    component: RoboPieChart,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    isLoading:   { control: 'boolean' },
    donut:       { control: 'boolean' },
    showLabels:  { control: 'boolean' },
    showLegend:  { control: 'boolean' },
    showTooltip: { control: 'boolean' },
    height:      { control: { type: 'number', min: 150, max: 500, step: 50 } },
  },
};
export default meta;

type Story = StoryObj<typeof RoboPieChart>;

// ---------------------------------------------------------------------------
// Sample data
// ---------------------------------------------------------------------------

const satellitesByFlag = [
  { name: 'NASA',      value: 312 },
  { name: 'ESA',       value: 189 },
  { name: 'Roscosmos', value: 142 },
  { name: 'JAXA',      value: 98 },
  { name: 'Other',     value: 201 },
];

const reportTypes = [
  { name: 'Final Report (FR)',    value: 312 },
  { name: 'Position Report (PR)', value: 589 },
  { name: 'Special Report (SP)',  value: 88 },
  { name: 'Deviation (DR)',       value: 47 },
];

const satelliteStatus = [
  { name: 'Active',  value: 182, color: 'var(--success)' },
  { name: 'Docked',  value: 41,  color: 'var(--primary)' },
  { name: 'Overdue', value: 12,  color: 'var(--warning)' },
  { name: 'Alert',   value: 4,   color: 'var(--destructive)' },
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
          <p style={{ fontSize: '0.75rem', color: 'var(--secondary-text)', marginBottom: 8 }}>Pie</p>
          <RoboPieChart data={satellitesByFlag} height={260} />
        </div>
        <div>
          <p style={{ fontSize: '0.75rem', color: 'var(--secondary-text)', marginBottom: 8 }}>Donut</p>
          <RoboPieChart data={satellitesByFlag} donut height={260} />
        </div>
        <div>
          <p style={{ fontSize: '0.75rem', color: 'var(--secondary-text)', marginBottom: 8 }}>With slice labels</p>
          <RoboPieChart data={reportTypes} showLabels height={260} />
        </div>
        <div>
          <p style={{ fontSize: '0.75rem', color: 'var(--secondary-text)', marginBottom: 8 }}>Custom colors (semantic)</p>
          <RoboPieChart data={satelliteStatus} donut height={260} aria-label='Satellite status distribution' />
        </div>
      </div>
    );
  },
};

export const Default: Story = {
  args: {
    data: satellitesByFlag,
    height: 320,
  },
};

export const Donut: Story = {
  name: 'Donut Chart',
  args: {
    data: satellitesByFlag,
    donut: true,
    height: 320,
  },
};

export const WithSliceLabels: Story = {
  name: 'With Slice Labels',
  args: {
    data: reportTypes,
    showLabels: true,
    height: 360,
  },
};

export const CustomColors: Story = {
  name: 'Custom Colors (semantic)',
  args: {
    data: satelliteStatus,
    donut: true,
    height: 300,
    'aria-label': 'Satellite status distribution',
  },
};

export const NoLegend: Story = {
  name: 'No Legend',
  args: {
    data: reportTypes,
    showLegend: false,
    showLabels: true,
    height: 280,
  },
};

/** Side-by-side comparison of Pie vs Donut. */
export const PieVsDonut: Story = {
  name: 'Pie vs Donut',
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
      <div>
        <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginBottom: 8, textAlign: 'center' }}>Pie</p>
        <RoboPieChart data={satellitesByFlag} height={260} />
      </div>
      <div>
        <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginBottom: 8, textAlign: 'center' }}>Donut</p>
        <RoboPieChart data={satellitesByFlag} donut height={260} />
      </div>
    </div>
  ),
};

export const Loading: Story = {
  name: 'Loading State',
  args: {
    data: [],
    height: 320,
    isLoading: true,
  },
};

export const Playground: Story = {
  args: {
    data: satellitesByFlag,
    height: 320,
    donut: false,
    showLabels: false,
    showLegend: true,
    showTooltip: true,
  },
};
