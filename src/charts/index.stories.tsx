import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { RoboStatCard } from './stat-card/robo-stat-card';
import { RoboBarChart } from './bar-chart/robo-bar-chart';
import { RoboLineChart } from './line-chart/robo-line-chart';
import { RoboAreaChart } from './area-chart/robo-area-chart';
import { RoboPieChart } from './pie-chart/robo-pie-chart';

import { RoboNightingaleChart } from './echarts/robo-nightingale-chart';
import { RoboSingleAxisScatterChart } from './echarts/robo-single-axis-scatter-chart';
import { RoboThemeRiverChart } from './echarts/robo-theme-river-chart';
import { RoboMatrixSparkline } from './echarts/robo-matrix-sparkline';
import { RoboCalendarHeatmap } from './echarts/robo-calendar-heatmap';
import { RoboCalendarBarChart } from './echarts/robo-calendar-bar-chart';
import { RoboCalendarScatterChart } from './echarts/robo-calendar-scatter-chart';
import { RoboCalendarIconChart } from './echarts/robo-calendar-icon-chart';
import { RoboSunburstChart } from './echarts/robo-sunburst-chart';
import { RoboTreemap } from './echarts/robo-treemap';
import { RoboCirclePacking } from './echarts/robo-circle-packing';
import { RoboFunnelChart } from './echarts/robo-funnel-chart';
import { RoboScatterChart } from './echarts/robo-scatter';
import { RoboHeatmap } from './echarts/robo-heatmap';
import { RoboCorrelationHeatmap } from './echarts/robo-correlation-heatmap';
import { RoboParallelCoordinatesChart } from './echarts/robo-parallel-coordinates-chart';
import { RoboSankeyFlowChart } from './echarts/robo-sankey-flow-chart';
import { RoboChordDiagram } from './echarts/robo-chord-diagram';
import { RoboGaugeChart } from './echarts/robo-gauge-chart';
import { CHART_DATASET } from './echarts/mock-data';

import {
  OverviewAccordion,
  OverviewGroup,
  OverviewSection,
} from '../lib/storybook/overview-layout';

// ---------------------------------------------------------------------------
// Base-chart sample data (copied from each component's Default story)
// ---------------------------------------------------------------------------

const reportsByType = [
  { type: 'FR', count: 312 },
  { type: 'PR', count: 589 },
  { type: 'SP', count: 88 },
  { type: 'DR', count: 47 },
];

const lineMonthly = [
  { month: 'Jan', active: 142, overdue: 8, docked: 31 },
  { month: 'Feb', active: 138, overdue: 12, docked: 28 },
  { month: 'Mar', active: 155, overdue: 6, docked: 34 },
  { month: 'Apr', active: 162, overdue: 9, docked: 29 },
  { month: 'May', active: 171, overdue: 5, docked: 36 },
  { month: 'Jun', active: 168, overdue: 11, docked: 32 },
  { month: 'Jul', active: 175, overdue: 7, docked: 38 },
  { month: 'Aug', active: 182, overdue: 4, docked: 41 },
];

const weeklySatellites = [
  { week: 'W1', active: 148, docked: 32 },
  { week: 'W2', active: 152, docked: 28 },
  { week: 'W3', active: 161, docked: 35 },
  { week: 'W4', active: 158, docked: 30 },
  { week: 'W5', active: 174, docked: 38 },
  { week: 'W6', active: 169, docked: 33 },
  { week: 'W7', active: 182, docked: 41 },
  { week: 'W8', active: 178, docked: 37 },
];

const satellitesByFlag = [
  { name: 'NASA', value: 312 },
  { name: 'ESA', value: 189 },
  { name: 'Roscosmos', value: 142 },
  { name: 'JAXA', value: 98 },
  { name: 'Other', value: 201 },
];

// ---------------------------------------------------------------------------
// ECharts sample data (copied from each component's story)
// ---------------------------------------------------------------------------

// Two-level hierarchy for the Sunburst (verbatim from RoboSunburstChart stories)
const SPACE_FLAVOR = [
  {
    name: 'LEO',
    children: [
      { name: 'Probe', value: 42 },
      { name: 'Satellite', value: 38 },
      { name: 'CubeSat', value: 27 },
    ],
  },
  {
    name: 'MEO',
    children: [
      { name: 'Probe', value: 31 },
      { name: 'Telescope', value: 55 },
      { name: 'Cargo Freighter', value: 18 },
    ],
  },
  {
    name: 'GEO',
    children: [
      { name: 'Orbiter', value: 64 },
      { name: 'Tug', value: 22 },
    ],
  },
];

// Heatmap axes (verbatim from RoboHeatmap stories)
const HOURS = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`);
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Parallel-coordinates axes (verbatim from RoboParallelCoordinatesChart stories)
const SPACECRAFT_AXES = [
  { dim: 0, name: 'Velocity (km/s)' },
  { dim: 1, name: 'Power (kW)' },
  { dim: 2, name: 'Mass (kg)' },
  { dim: 3, name: 'Length (m)' },
  { dim: 4, name: 'Solar Span (m)' },
];

// Calendar charts derive their year from the seeded incident data
const incidentYear = CHART_DATASET.incidentCalendarScatter[0]?.[0]
  ? parseInt(CHART_DATASET.incidentCalendarScatter[0][0].substring(0, 4), 10)
  : new Date().getFullYear();

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta: Meta = {
  title: 'Data/Charts',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    a11y: { config: {} },
  },
};
export default meta;

// ---------------------------------------------------------------------------
// Overview — every chart component, grouped by family
// ---------------------------------------------------------------------------

function OverviewStory() {
  return (
    <div style={{ padding: 24 }}>
      <OverviewAccordion open="first">
        {/* -------------------------------------------------------------- */}
        <OverviewGroup
          value="kpi"
          title="KPI / Stat"
          description="Single-number tiles for dashboard headers — a metric with a label and trend."
        >
          <OverviewSection title="RoboStatCard" description="A row of headline metrics with change indicators.">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
              <RoboStatCard label="Active satellites" value={182} change={12.5} changeLabel="vs last month" />
              <RoboStatCard label="Reports filed (MTD)" value="1,036" change={8.3} changeLabel="vs last month" />
              <RoboStatCard label="Overdue reports" value={12} change={-3.8} changeLabel="vs last month" />
              <RoboStatCard label="Avg response time" value="3.2 hrs" change={-11} changeLabel="vs last week" />
            </div>
          </OverviewSection>
        </OverviewGroup>

        {/* -------------------------------------------------------------- */}
        <OverviewGroup
          value="comparison"
          title="Comparison"
          description="Compare magnitudes across discrete categories."
        >
          <OverviewSection title="RoboBarChart" description="Categorical comparison as vertical bars.">
            <RoboBarChart
              data={reportsByType}
              xAxisKey="type"
              bars={[{ dataKey: 'count', name: 'Reports filed' }]}
              height={260}
            />
          </OverviewSection>
          <OverviewSection title="RoboNightingaleChart" description="Polar rose — category magnitudes arranged radially.">
            <RoboNightingaleChart
              data={CHART_DATASET.satelliteTypeDistribution}
              title="Constellation Composition by Satellite Type"
              roseType="radius"
              height={280}
            />
          </OverviewSection>
          <OverviewSection title="RoboSingleAxisScatterChart" description="Points distributed along one axis, grouped by category row.">
            <RoboSingleAxisScatterChart
              series={CHART_DATASET.satelliteSingleAxisSeries}
              title="Constellation — Mass Activity by Satellite Type"
              height={280}
            />
          </OverviewSection>
        </OverviewGroup>

        {/* -------------------------------------------------------------- */}
        <OverviewGroup
          value="trend"
          title="Trend / Temporal"
          description="Values over time — lines, areas, streams, and calendar grids."
        >
          <OverviewSection title="RoboLineChart" description="Time-series trend line.">
            <RoboLineChart
              data={lineMonthly}
              xAxisKey="month"
              lines={[{ dataKey: 'active', name: 'Active satellites' }]}
              height={260}
            />
          </OverviewSection>
          <OverviewSection title="RoboAreaChart" description="Filled area for cumulative volume over time.">
            <RoboAreaChart
              data={weeklySatellites}
              xAxisKey="week"
              areas={[{ dataKey: 'active', name: 'Active satellites' }]}
              height={260}
            />
          </OverviewSection>
          <OverviewSection title="RoboThemeRiverChart" description="Stacked stream graph of category volume over time.">
            <RoboThemeRiverChart
              data={CHART_DATASET.incidentThemeRiver}
              title="Mission Control — Anomaly Type Volume Over Time"
              height={300}
            />
          </OverviewSection>
          <OverviewSection title="RoboMatrixSparkline" description="Small-multiple grid of tiny trend lines.">
            <RoboMatrixSparkline
              {...CHART_DATASET.matrixSparkline}
              title="Constellation Metrics Matrix — Velocity, Mass, Power, Length, Solar Span by Satellite Type"
            />
          </OverviewSection>
          <OverviewSection title="RoboCalendarHeatmap" description="Daily value intensity shaded across a year.">
            <RoboCalendarHeatmap
              data={CHART_DATASET.incidentsByDate}
              year={incidentYear}
              title="Deep Space Network — Daily Anomaly Count"
              height={180}
            />
          </OverviewSection>
          <OverviewSection title="RoboCalendarBarChart" description="One daily value per day-cell as a small bar.">
            <RoboCalendarBarChart
              data={CHART_DATASET.incidentCalendarScatter}
              year={incidentYear}
              title="Deep Space Network — Anomaly Events per Day"
              height={200}
            />
          </OverviewSection>
          <OverviewSection title="RoboCalendarScatterChart" description="Daily count as a sized dot on a calendar grid.">
            <RoboCalendarScatterChart
              data={CHART_DATASET.incidentCalendarScatter}
              year={incidentYear}
              title="Mission Control — Daily Anomaly Count"
              height={200}
              colorRange={['#fde68a', '#dc2626']}
            />
          </OverviewSection>
          <OverviewSection title="RoboCalendarIconChart" description="Themed icon per day-cell on a calendar grid.">
            <RoboCalendarIconChart
              data={CHART_DATASET.incidentCalendarScatter}
              year={incidentYear}
              icon="satellite"
              title="Anomaly Events — Satellite Calendar View"
              height={200}
            />
          </OverviewSection>
        </OverviewGroup>

        {/* -------------------------------------------------------------- */}
        <OverviewGroup
          value="hierarchy"
          title="Part-to-whole / Hierarchy"
          description="Proportions and nested breakdowns of a whole."
        >
          <OverviewSection title="RoboPieChart" description="Part-to-whole with a handful of segments.">
            <RoboPieChart data={satellitesByFlag} donut height={260} />
          </OverviewSection>
          <OverviewSection title="RoboSunburstChart" description="Radial hierarchy as concentric rings.">
            <RoboSunburstChart
              data={SPACE_FLAVOR}
              title="Orbital Region and Satellite Type Mix"
              height={300}
            />
          </OverviewSection>
          <OverviewSection title="RoboTreemap" description="Nested rectangles sized by value.">
            <RoboTreemap
              data={CHART_DATASET.constellationHierarchy}
              title="Constellation Asset Breakdown — Type → Class → Status"
              height={300}
              colorScheme="categorical"
            />
          </OverviewSection>
          <OverviewSection title="RoboCirclePacking" description="Packed bubbles sized by value within groups.">
            <RoboCirclePacking
              nodes={CHART_DATASET.circlePackingNodes}
              title="Constellation Bubble Packing — Satellites by Mass"
              height={300}
            />
          </OverviewSection>
          <OverviewSection title="RoboFunnelChart" description="A quantity narrowing through ordered stages.">
            <RoboFunnelChart
              stages={CHART_DATASET.reportFunnel}
              title="Anomaly Report Processing Pipeline"
              height={300}
            />
          </OverviewSection>
        </OverviewGroup>

        {/* -------------------------------------------------------------- */}
        <OverviewGroup
          value="distribution"
          title="Distribution / Correlation"
          description="Spread of values and relationships between variables."
        >
          <OverviewSection title="RoboScatterChart" description="Relationship between two numeric variables.">
            <RoboScatterChart
              series={CHART_DATASET.satelliteScatterSeries}
              title="Constellation Performance — Velocity vs Mass"
              xAxisLabel="Velocity (km/s)"
              yAxisLabel="Mass (kg)"
              height={300}
              showLegend
            />
          </OverviewSection>
          <OverviewSection title="RoboHeatmap" description="Value intensity across two categorical axes.">
            <RoboHeatmap
              data={CHART_DATASET.incidentHourDayGrid}
              xCategories={HOURS}
              yCategories={DAYS}
              title="Deep Space Network — Anomaly Frequency"
              height={300}
            />
          </OverviewSection>
          <OverviewSection title="RoboCorrelationHeatmap" description="Pairwise correlation matrix between variables.">
            <RoboCorrelationHeatmap
              labels={CHART_DATASET.satelliteCorrelationLabels}
              correlations={CHART_DATASET.satelliteCorrelationMatrix}
              title="Satellite Dimension Correlations — Velocity, Mass, Length, Solar Span, Power"
              height={300}
            />
          </OverviewSection>
          <OverviewSection title="RoboParallelCoordinatesChart" description="Records compared across several numeric dimensions.">
            <RoboParallelCoordinatesChart
              series={CHART_DATASET.satelliteParallelSeries}
              axes={SPACECRAFT_AXES}
              title="Constellation — Satellite Characteristics by Type (5 Dimensions)"
              height={300}
              lineOpacity={0.3}
            />
          </OverviewSection>
        </OverviewGroup>

        {/* -------------------------------------------------------------- */}
        <OverviewGroup
          value="flow"
          title="Flow / Network"
          description="Directed flows and relationships between entities."
        >
          <OverviewSection title="RoboSankeyFlowChart" description="Multi-stage value flow through named stages.">
            <RoboSankeyFlowChart
              nodes={CHART_DATASET.incidentFlowNodes}
              links={CHART_DATASET.incidentFlowLinks}
              title="Anomaly Flow — Type to Resolution"
              height={300}
            />
          </OverviewSection>
          <OverviewSection title="RoboChordDiagram" description="Pairwise relationships among a fixed set of entities.">
            <RoboChordDiagram
              nodes={CHART_DATASET.chordNodes}
              links={CHART_DATASET.chordLinks}
              lineColorMode="source"
              title="Constellation Type Co-location — Shared Launch Site Presence"
              height={300}
            />
          </OverviewSection>
        </OverviewGroup>

        {/* -------------------------------------------------------------- */}
        <OverviewGroup
          value="gauge"
          title="Gauge"
          description="One value against a scale or target."
        >
          <OverviewSection title="RoboGaugeChart" description="Radial gauge for a single KPI against a range.">
            <RoboGaugeChart
              value={Math.round(CHART_DATASET.constellationReadinessPct)}
              variant="arc"
              name="Constellation Ready"
              unit="%"
              height={280}
            />
          </OverviewSection>
        </OverviewGroup>
      </OverviewAccordion>
    </div>
  );
}

export const Overview: StoryObj = {
  name: 'Overview — all chart families',
  render: () => <OverviewStory />,
  parameters: {
    docs: {
      description: {
        story:
          'Every chart component in the library, grouped by family (KPI/Stat, Comparison, ' +
          'Trend/Temporal, Part-to-whole/Hierarchy, Distribution/Correlation, Flow/Network, ' +
          'Gauge). Each family is a collapsible accordion group; only the first starts expanded ' +
          'because the page mounts many live charts. One representative instance per component, ' +
          'wired with the same seeded mock data its own story uses.',
      },
    },
  },
};

// ---------------------------------------------------------------------------
// StatCard-only stories (kept from the original file)
// ---------------------------------------------------------------------------

export const StatCardNegativeTrend: StoryObj = {
  name: 'StatCard — negative trend',
  render: () => (
    <div style={{ padding: 24 }}>
      <RoboStatCard
        label='Anomaly Alerts'
        value={7}
        change={-22.2}
        changeLabel='vs last month'
      />
    </div>
  ),
};

export const StatCardWithIcon: StoryObj = {
  name: 'StatCard — with icon slot',
  render: () => (
    <div style={{ padding: 24 }}>
      <RoboStatCard
        label='Recovery Missions'
        value={3}
        change={0}
        changeLabel='no change'
        icon={
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width={20}
            height={20}
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth={2}
            aria-hidden='true'
          >
            <path d='M3 17l2-8h14l2 8H3z' />
            <path d='M12 9V3' />
            <path d='M8 9V5' />
            <path d='M16 9V5' />
          </svg>
        }
      />
    </div>
  ),
};

export const StatCardGrid: StoryObj = {
  name: 'StatCard — grid of four',
  render: () => (
    <div
      style={{
        padding: 24,
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 16,
      }}
    >
      <RoboStatCard label='Active Satellites' value={172} change={8.4} changeLabel='vs last month' />
      <RoboStatCard label='Reports Filed' value={140} change={12.0} changeLabel='vs last month' />
      <RoboStatCard label='Active Alerts' value={9} change={-10.0} changeLabel='vs last month' />
      <RoboStatCard label='System Health' value='98.2%' />
    </div>
  ),
};
