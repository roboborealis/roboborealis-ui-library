// ---------------------------------------------------------------------------
// SHOWCASE PATTERN — Dashboard Grid (Archetype 5)
//
// Observatory Night: at-a-glance KPI summary, trend charts, and a recent
// activity feed for a night's observing. Read-only — no user interaction.
//
// Pattern: RoboPageShell + 4× RoboStatCard + RoboLineChart + RoboBarChart
//          + compact RoboDataTable
// ---------------------------------------------------------------------------

import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { createColumnHelper } from '@tanstack/react-table';
import { Activity, Clock, Gauge, Sparkles, Telescope } from 'lucide-react';
import { RoboBarChart, RoboLineChart, RoboStatCard } from '@roboborealis/components/charts';
import { RoboDataTable, createDateCell, createStatusCell } from '@roboborealis/components/tables';
import { RoboPageShell } from '@roboborealis/components/layout';
import { RoboBadge, RoboSeparator } from '@roboborealis/components/core';


// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const NIGHTLY_DATA = [
  { night: 'Mon', observed: 22, planned: 28 },
  { night: 'Tue', observed: 31, planned: 33 },
  { night: 'Wed', observed: 12, planned: 30 },
  { night: 'Thu', observed: 29, planned: 30 },
  { night: 'Fri', observed: 34, planned: 34 },
  { night: 'Sat', observed: 41, planned: 42 },
  { night: 'Sun', observed: 38, planned: 40 },
];

const TYPE_DATA = [
  { type: 'Galaxy',   count: 74 },
  { type: 'Nebula',   count: 52 },
  { type: 'Cluster',  count: 38 },
  { type: 'Double',   count: 21 },
  { type: 'Variable', count: 14 },
];

type EventSeverity = 'info' | 'warning' | 'critical';

interface ActivityEvent {
  id: string;
  target: string;
  event: string;
  severity: EventSeverity;
  timestamp: Date;
}

const RECENT_EVENTS: ActivityEvent[] = [
  { id: 'e1', target: 'M42 — Orion Nebula',   event: 'Observation complete — 45 min exposure logged', severity: 'info',     timestamp: new Date(Date.now() - 420_000) },
  { id: 'e2', target: 'NGC 4526',             event: 'Transient candidate flagged for follow-up',     severity: 'warning',  timestamp: new Date(Date.now() - 900_000) },
  { id: 'e3', target: 'Dome',                 event: 'Weather hold — cloud cover exceeded 60%',        severity: 'critical', timestamp: new Date(Date.now() - 3_600_000) },
  { id: 'e4', target: 'M13 — Hercules',       event: 'Target acquired — guiding locked',               severity: 'info',     timestamp: new Date(Date.now() - 7_200_000) },
  { id: 'e5', target: 'Calibration',          event: 'Flat frames captured for all filters',           severity: 'info',     timestamp: new Date(Date.now() - 14_400_000) },
];

const SEVERITY_COLOR_MAP: Record<EventSeverity, 'muted' | 'warning' | 'destructive'> = {
  info:     'muted',
  warning:  'warning',
  critical: 'destructive',
};

// ---------------------------------------------------------------------------
// Activity table columns
// ---------------------------------------------------------------------------

const col = createColumnHelper<ActivityEvent>();

const activityColumns = [
  col.accessor('target', {
    header: 'Target',
    size: 200,
    cell: (info) => <span style={{ fontWeight: 500 }}>{info.getValue()}</span>,
  }),
  col.accessor('event', {
    header: 'Event',
    size: 300,
  }),
  col.accessor('severity', {
    header: 'Severity',
    size: 100,
    cell: createStatusCell({ colorMap: SEVERITY_COLOR_MAP }),
  }),
  col.accessor('timestamp', {
    header: 'Time',
    size: 140,
    cell: createDateCell({ showRelative: true }),
  }),
];

// ---------------------------------------------------------------------------
// Topbar stub
// ---------------------------------------------------------------------------

function DashboardTopbar() {
  return (
    <div
      style={{
        height: 52,
        display: 'flex',
        alignItems: 'center',
        padding: '0 20px',
        borderBottom: '1px solid var(--border)',
        background: 'var(--card)',
        gap: 12,
      }}
    >
      <Activity size={18} style={{ opacity: 0.6 }} />
      <span style={{ fontWeight: 700, fontSize: 15 }}>Observatory Night</span>
      <RoboBadge variant='status' style={{ marginLeft: 4 }}>Live</RoboBadge>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Section heading
// ---------------------------------------------------------------------------

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ margin: '0 0 12px', fontSize: 12, fontWeight: 700, opacity: 0.45, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
      {children}
    </p>
  );
}

// ---------------------------------------------------------------------------
// Pattern component
// ---------------------------------------------------------------------------

function ObservatoryDashboard() {
  return (
    <RoboPageShell topbar={<DashboardTopbar />}>
      <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* KPI row */}
        <div>
          <SectionHeading>Key Metrics — Tonight</SectionHeading>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
            <RoboStatCard
              label="Objects Observed"
              value={38}
              change={4.2}
              changeLabel="vs last night"
              icon={<Sparkles size={18} />}
            />
            <RoboStatCard
              label="Clear Hours"
              value="6.4 h"
              change={-1.1}
              changeLabel="vs last night"
              icon={<Clock size={18} />}
            />
            <RoboStatCard
              label="Active Instruments"
              value={5}
              change={1}
              changeLabel="online now"
              icon={<Telescope size={18} />}
            />
            <RoboStatCard
              label="Median Seeing"
              value={'1.8"'}
              icon={<Gauge size={18} />}
            />
          </div>
        </div>

        <RoboSeparator />

        {/* Charts row */}
        <div>
          <SectionHeading>Observing — Last 7 Nights</SectionHeading>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, padding: 16 }}>
              <p style={{ margin: '0 0 12px', fontWeight: 600, fontSize: 13 }}>Observations per Night</p>
              <RoboLineChart
                data={NIGHTLY_DATA}
                xAxisKey="night"
                lines={[
                  { dataKey: 'observed', name: 'Observed' },
                  { dataKey: 'planned',  name: 'Planned', color: 'var(--muted-foreground)' },
                ]}
                height={220}
                showLegend
              />
            </div>
            <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, padding: 16 }}>
              <p style={{ margin: '0 0 12px', fontWeight: 600, fontSize: 13 }}>Objects by Type</p>
              <RoboBarChart
                data={TYPE_DATA}
                xAxisKey="type"
                bars={[{ dataKey: 'count', name: 'Count' }]}
                height={220}
                orientation="vertical"
              />
            </div>
          </div>
        </div>

        <RoboSeparator />

        {/* Recent activity */}
        <div>
          <SectionHeading>Recent Activity</SectionHeading>
          <RoboDataTable
            data={RECENT_EVENTS}
            columns={activityColumns}
            getRowId={(r) => r.id}
            enableSorting={false}
            enablePagination={false}
            striped
            aria-label="Recent activity feed"
          />
        </div>

      </div>
    </RoboPageShell>
  );
}

// ---------------------------------------------------------------------------
// Story
// ---------------------------------------------------------------------------

export const patternMeta = {
  demonstrates: 'The Dashboard Grid archetype: a read-only KPI summary row, line and bar trend charts, and a compact recent-activity table, all on one full page.',
  whenToUse: 'Use as the reference for any full-page dashboard where the page itself is the dashboard, not a widget dropped into another page, and no user interaction beyond reading is required.',
  keywords: ['observatory dashboard', 'kpi row', 'stat card', 'trend chart', 'bar chart', 'line chart', 'activity feed', 'dashboard grid'],
  agentPriority: 'This is the canonical storyPath for the dashboard-grid archetype in src/agent/archetypes.ts. Prioritize it whenever the feature request matches that archetype (full-page KPI-plus-charts dashboard). For a compact dashboard panel embedded inside another page or modal, use the data-dashboard archetype/template instead, not this pattern.',
};

const meta: Meta = {
  title: 'Showcase/Patterns/Dashboards/Observatory Night',
  excludeStories: ['patternMeta'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '**Archetype 5 — Dashboard Grid.** ' +
          'An at-a-glance observatory dashboard: 4 KPI StatCards, line and bar trend charts, ' +
          'and a compact recent-activity DataTable. Read-only — no user interaction needed.',
      },
    },
  },
};
export default meta;

type Story = StoryObj;

export const ObservatoryDashboardPattern: Story = {
  name: 'Observatory Night',
  render: () => <ObservatoryDashboard />,
};
