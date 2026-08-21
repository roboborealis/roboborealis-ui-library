import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Craft, FileText, AlertTriangle, MapPin, Clock } from 'lucide-react';

import { RoboStatCard } from './robo-stat-card';
import { RoboLoading } from '../../feedback/loading/robo-loading';


export const componentMeta = {
  description: 'KPI display card with value, label, trend indicator, and optional sparkline',
  category: 'visualization' as const,
  keywords: ['stat', 'kpi', 'metric', 'card', 'number', 'trend', 'dashboard', 'indicator'],
  whenToUse: 'For dashboard KPI tiles — showing a metric value with label, trend, and optional chart',
  whenNotToUse: 'For detailed data use RoboDataTable; for narrative content use RoboCard',
  pairsWith: ['RoboGrid', 'RoboLineChart', 'RoboBadge', 'RoboCard'],
  a11y: 'Use aria-label on the card describing the full metric context (e.g., "Active satellites: 42, up 5%")',
};
const meta: Meta<typeof RoboStatCard> = {
  title: 'Data/Charts/RoboStatCard',
  excludeStories: ['componentMeta'],
    component: RoboStatCard,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    label:       { control: 'text' },
    value:       { control: 'text' },
    change:      { control: 'number' },
    changeLabel: { control: 'text' },
    isLoading:   { control: 'boolean' },
  },
};
export default meta;

type Story = StoryObj<typeof RoboStatCard>;

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
        <RoboStatCard label='Active satellites' value={182} icon={<Craft className='h-5 w-5' />} />
        <RoboStatCard label='Reports filed (MTD)' value='1,036' change={8.3} changeLabel='vs last month' icon={<FileText className='h-5 w-5' />} />
        <RoboStatCard label='Overdue reports' value={12} change={-3.8} changeLabel='vs last month' icon={<AlertTriangle className='h-5 w-5' />} />
        <RoboStatCard label='Total missions' value={1_204} change={0} changeLabel='vs last week' icon={<MapPin className='h-5 w-5' />} />
        <RoboStatCard label='Avg response time' value='3.2 hrs' change={-11} changeLabel='vs last week' icon={<Clock className='h-5 w-5' />} />
        <RoboStatCard label='' value='' isLoading />
      </div>
    );
  },
};

export const Default: Story = {
  args: { label: 'Active satellites', value: 182 },
};

export const PositiveTrend: Story = {
  name: 'Positive Trend',
  args: {
    label: 'Active satellites',
    value: 182,
    change: 12.5,
    changeLabel: 'vs last month',
  },
};

export const NegativeTrend: Story = {
  name: 'Negative Trend',
  args: {
    label: 'Overdue reports',
    value: 12,
    change: -3.8,
    changeLabel: 'vs last month',
  },
};

export const NoChange: Story = {
  name: 'No Change (change = 0)',
  args: {
    label: 'Total missions',
    value: 1_204,
    change: 0,
    changeLabel: 'vs last week',
  },
};

export const WithIcon: Story = {
  name: 'With Icon',
  args: {
    label: 'Registered satellites',
    value: '2,847',
    change: 4.1,
    changeLabel: 'vs last quarter',
    icon: <Craft className='h-5 w-5' />,
  },
};

export const FormattedValue: Story = {
  name: 'Formatted Values',
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, maxWidth: 520 }}>
      <RoboStatCard label='Reports filed' value='1,036' change={8.3} changeLabel='vs last month' icon={<FileText className='h-5 w-5' />} />
      <RoboStatCard label='Active alerts' value={4} change={-25} changeLabel='vs yesterday' icon={<AlertTriangle className='h-5 w-5' />} />
      <RoboStatCard label='Ports covered' value={127} change={2.4} changeLabel='this year' icon={<MapPin className='h-5 w-5' />} />
      <RoboStatCard label='Avg response time' value='3.2 hrs' change={-11} changeLabel='vs last week' icon={<Clock className='h-5 w-5' />} />
    </div>
  ),
};

/** Dashboard KPI strip — typical 4-card header row. */
export const DashboardKPIs: Story = {
  name: 'In Context — Dashboard KPIs',
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
      <RoboStatCard
        label='Active satellites'
        value={182}
        change={12.5}
        changeLabel='vs last month'
        icon={<Craft className='h-5 w-5' />}
      />
      <RoboStatCard
        label='Reports filed (MTD)'
        value='1,036'
        change={8.3}
        changeLabel='vs last month'
        icon={<FileText className='h-5 w-5' />}
      />
      <RoboStatCard
        label='Overdue reports'
        value={12}
        change={-3.8}
        changeLabel='vs last month'
        icon={<AlertTriangle className='h-5 w-5' />}
      />
      <RoboStatCard
        label='Avg response time'
        value='3.2 hrs'
        change={-11}
        changeLabel='vs last week'
        icon={<Clock className='h-5 w-5' />}
      />
    </div>
  ),
};

export const Loading: Story = {
  name: 'Loading State',
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, maxWidth: 720 }}>
      <RoboStatCard label='' value='' isLoading />
      <RoboStatCard label='' value='' isLoading />
      <RoboStatCard label='' value='' isLoading />
      <RoboStatCard label='' value='' isLoading />
    </div>
  ),
};

export const Playground: Story = {
  args: {
    label: 'Metric label',
    value: 142,
    change: 5.2,
    changeLabel: 'vs last month',
  },
};
