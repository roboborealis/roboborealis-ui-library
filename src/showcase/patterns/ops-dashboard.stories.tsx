// ---------------------------------------------------------------------------
// SHOWCASE PATTERN — Dashboard Grid (Archetype 5)
//
// Ops Center Dashboard: at-a-glance KPI summary, trend charts, and a
// recent activity feed. Read-only — no user interaction required.
//
// Pattern: RoboPageShell + 4× RoboStatCard + RoboLineChart + RoboBarChart
//          + compact RoboDataTable
// ---------------------------------------------------------------------------

import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { createColumnHelper } from '@tanstack/react-table';
import { Activity, AlertTriangle, FileText, Gauge, Satellite } from 'lucide-react';
import { RoboBarChart, RoboLineChart, RoboStatCard } from '@roboborealis/components/charts';
import { RoboDataTable, createDateCell, createStatusCell } from '@roboborealis/components/tables';
import { RoboPageShell } from '@roboborealis/components/layout';
import { RoboBadge, RoboSeparator } from '@roboborealis/components/core';


// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const TRAFFIC_DATA = [
  { day: 'Mon', active: 168, reported: 154 },
  { day: 'Tue', active: 172, reported: 160 },
  { day: 'Wed', active: 185, reported: 171 },
  { day: 'Thu', active: 179, reported: 165 },
  { day: 'Fri', active: 182, reported: 175 },
  { day: 'Sat', active: 194, reported: 183 },
  { day: 'Sun', active: 182, reported: 174 },
];

const TYPE_DATA = [
  { type: 'Satellite', count: 74 },
  { type: 'Probe',     count: 52 },
  { type: 'Telescope', count: 38 },
  { type: 'Capsule',   count: 12 },
  { type: 'Other',     count: 6 },
];

type EventSeverity = 'info' | 'warning' | 'critical';

interface ActivityEvent {
  id: string;
  satellite: string;
  event: string;
  severity: EventSeverity;
  timestamp: Date;
}

const RECENT_EVENTS: ActivityEvent[] = [
  { id: 'e1', satellite: 'FALCON UPLINK',   event: 'FR submitted — orbit insertion complete', severity: 'info',     timestamp: new Date(Date.now() - 420_000) },
  { id: 'e2', satellite: 'SENTINEL RELAY',  event: 'Velocity drop below 5 km/s — alert triggered', severity: 'warning',  timestamp: new Date(Date.now() - 900_000) },
  { id: 'e3', satellite: 'RIGEL BEACON',    event: 'Telemetry overdue by 24h',         severity: 'critical', timestamp: new Date(Date.now() - 3_600_000) },
  { id: 'e4', satellite: 'KEPLER SURVEYOR', event: 'Launch report received',           severity: 'info',     timestamp: new Date(Date.now() - 7_200_000) },
  { id: 'e5', satellite: 'COSMOS GUARDIAN', event: 'Telemetry overdue by 48h',         severity: 'critical', timestamp: new Date(Date.now() - 14_400_000) },
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
  col.accessor('satellite', {
    header: 'Satellite',
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
      <span style={{ fontWeight: 700, fontSize: 15 }}>Ops Center</span>
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

function OpsDashboard() {
  return (
    <RoboPageShell topbar={<DashboardTopbar />}>
      <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* KPI row */}
        <div>
          <SectionHeading>Key Metrics — Today</SectionHeading>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
            <RoboStatCard
              label="Active Satellites"
              value={182}
              change={4.2}
              changeLabel="vs yesterday"
              icon={<Satellite size={18} />}
            />
            <RoboStatCard
              label="Open Alerts"
              value={7}
              change={-2}
              changeLabel="vs yesterday"
              icon={<AlertTriangle size={18} />}
            />
            <RoboStatCard
              label="Reports Due"
              value={23}
              change={12}
              changeLabel="this week"
              icon={<FileText size={18} />}
            />
            <RoboStatCard
              label="Avg Velocity"
              value="7.6 km/s"
              icon={<Gauge size={18} />}
            />
          </div>
        </div>

        <RoboSeparator />

        {/* Charts row */}
        <div>
          <SectionHeading>Traffic — Last 7 Days</SectionHeading>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, padding: 16 }}>
              <p style={{ margin: '0 0 12px', fontWeight: 600, fontSize: 13 }}>Satellite Traffic</p>
              <RoboLineChart
                data={TRAFFIC_DATA}
                xAxisKey="day"
                lines={[
                  { dataKey: 'active',   name: 'Active satellites' },
                  { dataKey: 'reported', name: 'Reports received', color: 'var(--muted-foreground)' },
                ]}
                height={220}
                showLegend
              />
            </div>
            <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, padding: 16 }}>
              <p style={{ margin: '0 0 12px', fontWeight: 600, fontSize: 13 }}>Satellite Types</p>
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
  whenToUse: 'Use as the reference for any full-page operations dashboard where the page itself is the dashboard, not a widget dropped into another page, and no user interaction beyond reading is required.',
  keywords: ['ops dashboard', 'kpi row', 'stat card', 'trend chart', 'bar chart', 'line chart', 'activity feed', 'dashboard grid'],
  agentPriority: 'This is the canonical storyPath for the dashboard-grid archetype in src/agent/archetypes.ts. Prioritize it whenever the feature request matches that archetype (full-page KPI-plus-charts dashboard). For a compact dashboard panel embedded inside another page or modal, use the data-dashboard archetype/template instead, not this pattern.',
};

const meta: Meta = {
  title: 'Showcase/Patterns/Dashboards/Ops Center',
  excludeStories: ['patternMeta'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '**Archetype 5 — Dashboard Grid.** ' +
          'An at-a-glance operations dashboard: 4 KPI StatCards, line and bar trend charts, ' +
          'and a compact recent-activity DataTable. Read-only — no user interaction needed. ' +
          'Built using the `/design-ui-feature` skill.',
      },
    },
  },
};
export default meta;

type Story = StoryObj;

export const OpsDashboardPattern: Story = {
  name: 'Ops Center Dashboard',
  render: () => <OpsDashboard />,
};
