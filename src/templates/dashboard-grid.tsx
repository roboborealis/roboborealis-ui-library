// =============================================================================
// TEMPLATE: DashboardGridTemplate — Archetype 5 (Dashboard Grid)
//
// Pattern:  RoboPageShell + 4× RoboStatCard + 2× charts + compact activity table
// State:    Read-only — no user interaction, no local state
// Use for:  At-a-glance operational dashboards with KPIs, trends, and activity feeds
//
// CONSUMER IMPORTS (use these in your app):
//   import { RoboStatCard, RoboLineChart, RoboBarChart } from '@roboborealis/components/charts';
//   import { RoboDataTable, createStatusCell, createDateCell } from '@roboborealis/components/tables';
//   import { RoboPageShell } from '@roboborealis/components/layout';
//   import { RoboBadge, RoboSeparator } from '@roboborealis/components/core';
// =============================================================================
//
// COPY-ADAPTABLE TEMPLATE — all TODO comments below are intentional injection
// points, not bugs or tech debt. Copy this file into your app and fill them in.
// See docs/agent-first-architecture.md for the copy-adapt workflow.
// =============================================================================

import * as React from 'react';
import { createColumnHelper, type ColumnDef } from '@tanstack/react-table';
import { Activity, AlertTriangle, CheckCircle, Clock, TrendingUp } from 'lucide-react';

import { RoboStatCard }  from '@/charts/stat-card/robo-stat-card';
import { RoboLineChart } from '@/charts/line-chart/robo-line-chart';
import { RoboBarChart }  from '@/charts/bar-chart/robo-bar-chart';
import { RoboDataTable } from '@/tables/data-table/robo-data-table';
import { createStatusCell } from '@/tables/data-table/cells/status-cell';
import { createDateCell }   from '@/tables/data-table/cells/date-cell';
import { RoboPageShell } from '@/layout/page-shell/robo-page-shell';
import { RoboBadge }     from '@/core/badge/robo-badge';
import { RoboSeparator } from '@/core/separator/robo-separator';

import { TemplateTopbar, KPI_GRID } from './_shared';

// ---------------------------------------------------------------------------
// TODO: Replace with real data from your API / tRPC query
// ---------------------------------------------------------------------------

// TODO: Replace x-axis key and data series names with your time-series fields
const TREND_DATA = [
  { period: 'Mon', primary: 42, secondary: 38 },
  { period: 'Tue', primary: 47, secondary: 43 },
  { period: 'Wed', primary: 51, secondary: 46 },
  { period: 'Thu', primary: 48, secondary: 44 },
  { period: 'Fri', primary: 55, secondary: 50 },
  { period: 'Sat', primary: 60, secondary: 54 },
  { period: 'Sun', primary: 53, secondary: 49 },
];

// TODO: Replace with your breakdown categories and counts
const BREAKDOWN_DATA = [
  { label: 'Type A', count: 74 },
  { label: 'Type B', count: 52 },
  { label: 'Type C', count: 38 },
  { label: 'Type D', count: 12 },
  { label: 'Other',  count: 6 },
];

type EventSeverity = 'info' | 'warning' | 'critical';

interface ActivityEvent {
  id: string;
  subject: string;  // TODO: rename to your event's primary descriptor
  description: string;
  severity: EventSeverity;
  timestamp: Date;
}

// TODO: Replace with real events from your API
const RECENT_EVENTS: ActivityEvent[] = [
  { id: 'e1', subject: 'Item Alpha',  description: 'Status changed to active',     severity: 'info',     timestamp: new Date(Date.now() - 420_000) },
  { id: 'e2', subject: 'Item Beta',   description: 'Threshold exceeded — alert',   severity: 'warning',  timestamp: new Date(Date.now() - 900_000) },
  { id: 'e3', subject: 'Item Gamma',  description: 'Action overdue by 24h',        severity: 'critical', timestamp: new Date(Date.now() - 3_600_000) },
  { id: 'e4', subject: 'Item Delta',  description: 'Submission received',          severity: 'info',     timestamp: new Date(Date.now() - 7_200_000) },
  { id: 'e5', subject: 'Item Epsilon', description: 'Review overdue by 48h',       severity: 'critical', timestamp: new Date(Date.now() - 14_400_000) },
];

const SEVERITY_COLOR_MAP: Record<EventSeverity, 'default' | 'warning' | 'destructive'> = {
  info:     'default',
  warning:  'warning',
  critical: 'destructive',
};

// ---------------------------------------------------------------------------
// Activity table columns — TODO: adapt to your event shape
// ---------------------------------------------------------------------------

const col = createColumnHelper<ActivityEvent>();

const activityColumns = [
  col.accessor('subject', {
    header: 'Subject',    // TODO: rename
    size: 180,
    cell: (info) => <span style={{ fontWeight: 500 }}>{info.getValue()}</span>,
  }),
  col.accessor('description', {
    header: 'Description',
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
// Topbar — TODO: replace with RoboTopbar or your app's real topbar
// ---------------------------------------------------------------------------

function DashboardTopbar() {
  return (
    <TemplateTopbar
      icon={<Activity size={18} />}
      label="Overview Dashboard"
      badge={<RoboBadge usage='status' style={{ marginLeft: 4 }}>Live</RoboBadge>}
    />
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ margin: '0 0 12px', fontSize: 12, fontWeight: 700, opacity: 0.45, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
      {children}
    </p>
  );
}

// ---------------------------------------------------------------------------
// Template component
// ---------------------------------------------------------------------------

export function DashboardGridTemplate() {
  return (
    <RoboPageShell topbar={<DashboardTopbar />}>
      <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* KPI row — TODO: replace labels, values, change%, and icons with real metrics */}
        <div id='dashboard-grid-kpi-row'>
          <SectionHeading>Key Metrics — Today</SectionHeading>
          <div style={KPI_GRID}>
            <RoboStatCard
              label="Total Items"       // TODO
              value={182}               // TODO: wire to real data
              change={4.2}
              changeLabel="vs yesterday"
              icon={<TrendingUp size={18} />}
            />
            <RoboStatCard
              label="Active"            // TODO
              value={139}
              change={8.3}
              changeLabel="vs yesterday"
              icon={<CheckCircle size={18} />}
            />
            <RoboStatCard
              label="Pending Review"    // TODO
              value={23}
              change={12}
              changeLabel="this week"
              icon={<Clock size={18} />}
            />
            <RoboStatCard
              label="Open Alerts"       // TODO
              value={7}
              change={-2}
              changeLabel="vs yesterday"
              icon={<AlertTriangle size={18} />}
            />
          </div>
        </div>

        <RoboSeparator />

        {/* Charts row — TODO: replace xAxisKey, line/bar dataKeys with your field names */}
        <div id='dashboard-grid-charts-row'>
          <SectionHeading>Trend — Last 7 Days</SectionHeading>  {/* TODO */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, padding: 16 }}>
              <p style={{ margin: '0 0 12px', fontWeight: 600, fontSize: 13 }}>Activity Trend</p>   {/* TODO */}
              <RoboLineChart
                data={TREND_DATA}
                xAxisKey="period"
                lines={[
                  { dataKey: 'primary',   name: 'Primary metric' },    // TODO
                  { dataKey: 'secondary', name: 'Secondary metric', color: 'var(--muted-foreground)' }, // TODO
                ]}
                height={220}
                showLegend
              />
            </div>
            <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, padding: 16 }}>
              <p style={{ margin: '0 0 12px', fontWeight: 600, fontSize: 13 }}>Breakdown by Type</p>  {/* TODO */}
              <RoboBarChart
                data={BREAKDOWN_DATA}
                xAxisKey="label"
                bars={[{ dataKey: 'count', name: 'Count' }]}
                height={220}
                orientation="vertical"
              />
            </div>
          </div>
        </div>

        <RoboSeparator />

        {/* Activity feed — TODO: wire to real event data */}
        <div id='dashboard-grid-activity-feed'>
          <SectionHeading>Recent Activity</SectionHeading>
          <RoboDataTable
            data={RECENT_EVENTS}
            columns={activityColumns as unknown as ColumnDef<ActivityEvent, unknown>[]}
            getRowId={(r) => r.id}
            enableSorting={false}
            enablePagination={false}
            striped
            aria-label="Recent activity feed"  // TODO
          />
        </div>

      </div>
    </RoboPageShell>
  );
}
