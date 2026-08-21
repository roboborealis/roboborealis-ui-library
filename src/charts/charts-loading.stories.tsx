import * as React from 'react';
import { useState, useEffect } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { RoboAreaChart } from './area-chart/robo-area-chart';
import { RoboBarChart } from './bar-chart/robo-bar-chart';
import { RoboLineChart } from './line-chart/robo-line-chart';
import { RoboPieChart } from './pie-chart/robo-pie-chart';
import { RoboStatCard } from './stat-card/robo-stat-card';
import { RoboProgress } from '@/feedback/progress/robo-progress';

// ---------------------------------------------------------------------------
// Sample data
// ---------------------------------------------------------------------------

const monthlyData = [
  { month: 'Jan', satellites: 120, reports: 85 },
  { month: 'Feb', satellites: 135, reports: 92 },
  { month: 'Mar', satellites: 148, reports: 110 },
  { month: 'Apr', satellites: 142, reports: 98 },
  { month: 'May', satellites: 160, reports: 125 },
  { month: 'Jun', satellites: 172, reports: 140 },
];

const pieData = [
  { name: 'Cargo Freighter', value: 420 },
  { name: 'Probe', value: 215 },
  { name: 'Crew Capsule', value: 130 },
  { name: 'CubeSat', value: 85 },
  { name: 'Other', value: 60 },
];

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STATE_DURATION_MS = 3000;
const PROGRESS_TICK_MS = 50;

// ---------------------------------------------------------------------------
// Style constants
// ---------------------------------------------------------------------------

const outerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 24,
  padding: 24,
};

const headerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
};

const stateLabelStyle: React.CSSProperties = {
  fontSize: '0.8rem',
  color: 'var(--muted-foreground)',
  margin: 0,
};

const kpiRowStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: 16,
};

const chartsRowStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 16,
};

const chartLabelStyle: React.CSSProperties = {
  fontSize: '0.7rem',
  fontWeight: 700,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: 'var(--muted-foreground)',
  marginBottom: 8,
};

// ---------------------------------------------------------------------------
// Demo component
// ---------------------------------------------------------------------------

function ChartsLoadingDemo() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [countdown, setCountdown] = useState(STATE_DURATION_MS / 1000);

  useEffect(() => {
    const stateTimer = setInterval(() => {
      setIsLoading((v) => !v);
      setProgress(0);
      setCountdown(STATE_DURATION_MS / 1000);
    }, STATE_DURATION_MS);

    return () => clearInterval(stateTimer);
  }, []);

  useEffect(() => {
    setProgress(0);
    setCountdown(STATE_DURATION_MS / 1000);

    const increment = 100 / (STATE_DURATION_MS / PROGRESS_TICK_MS);
    const progressTimer = setInterval(() => {
      setProgress((p) => Math.min(p + increment, 100));
    }, PROGRESS_TICK_MS);

    const countdownTimer = setInterval(() => {
      setCountdown((c) => Math.max(c - 1, 0));
    }, 1000);

    return () => {
      clearInterval(progressTimer);
      clearInterval(countdownTimer);
    };
  }, [isLoading]);

  return (
    <div style={outerStyle}>
      {/* Status bar */}
      <div style={headerStyle}>
        <RoboProgress value={progress} />
        <p style={stateLabelStyle}>
          {isLoading
            ? 'Loading chart data...'
            : `Data loaded — switching in ${countdown}s...`}
        </p>
      </div>

      {/* KPI stat cards */}
      <div>
        <p style={chartLabelStyle}>Stat Cards</p>
        <div style={kpiRowStyle}>
          <RoboStatCard label='Active Satellites' value={172} change={8.4} changeLabel='vs last month' isLoading={isLoading} />
          <RoboStatCard label='Reports Filed' value={140} change={12.0} changeLabel='vs last month' isLoading={isLoading} />
          <RoboStatCard label='Active Alerts' value={9} change={-10.0} changeLabel='vs last month' isLoading={isLoading} />
          <RoboStatCard label='System Health' value='98.2%' isLoading={isLoading} />
        </div>
      </div>

      {/* Charts grid */}
      <div style={chartsRowStyle}>
        <div>
          <p style={chartLabelStyle}>Line Chart</p>
          <RoboLineChart
            data={monthlyData}
            lines={[
              { dataKey: 'satellites', name: 'Satellites' },
              { dataKey: 'reports', name: 'Reports' },
            ]}
            xAxisKey='month'
            height={220}
            isLoading={isLoading}
          />
        </div>
        <div>
          <p style={chartLabelStyle}>Bar Chart</p>
          <RoboBarChart
            data={monthlyData}
            bars={[
              { dataKey: 'satellites', name: 'Satellites' },
              { dataKey: 'reports', name: 'Reports' },
            ]}
            xAxisKey='month'
            height={220}
            isLoading={isLoading}
          />
        </div>
        <div>
          <p style={chartLabelStyle}>Area Chart</p>
          <RoboAreaChart
            data={monthlyData}
            areas={[
              { dataKey: 'satellites', name: 'Satellites' },
              { dataKey: 'reports', name: 'Reports' },
            ]}
            xAxisKey='month'
            height={220}
            isLoading={isLoading}
          />
        </div>
        <div>
          <p style={chartLabelStyle}>Pie / Donut Chart</p>
          <RoboPieChart
            data={pieData}
            donut
            height={220}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta: Meta = {
  title: 'Data/Charts/Loading Sequences',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};
export default meta;

export const AllChartsLoading: StoryObj = {
  name: 'All Charts — Loading → Loaded',
  render: () => <ChartsLoadingDemo />,
};
