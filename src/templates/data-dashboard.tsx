// =============================================================================
// TEMPLATE: DataDashboardTemplate — compact variant of Archetype 5 (Dashboard Grid)
// Not a separately numbered archetype — see design-ui-feature.md's decision tree.
//
// Pattern:  4× RoboStatCard + RoboCard-wrapped RoboDataTable
// State:    Read-only — no user interaction, no local state
// Use for:  Compact dashboard panels — drop into a RoboPageShell content area.
//           For a full-page dashboard with charts, use DashboardGridTemplate instead.
//
// CONSUMER IMPORTS (use these in your app):
//   import { RoboStatCard } from '@roboborealis/components/charts';
//   import { RoboDataTable } from '@roboborealis/components/tables';
//   import { RoboCard, RoboCardHeader, RoboCardBody, RoboBadge } from '@roboborealis/components/core';
// =============================================================================
//
// COPY-ADAPTABLE TEMPLATE — all TODO comments below are intentional injection
// points, not bugs or tech debt. Copy this file into your app and fill them in.
// See docs/agent-first-architecture.md for the copy-adapt workflow.
// =============================================================================

import { createColumnHelper, type ColumnDef } from '@tanstack/react-table';
import { TrendingUp, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

import { RoboStatCard }  from '@/charts/stat-card/robo-stat-card';
import { RoboDataTable } from '@/tables/data-table/robo-data-table';
import { RoboCard, RoboCardHeader, RoboCardBody } from '@/core/card/robo-card';
import { RoboBadge }     from '@/core/badge/robo-badge';

import { KPI_GRID } from './_shared';

// ---------------------------------------------------------------------------
// TODO: Replace with your domain type and real data
// ---------------------------------------------------------------------------

interface ActivityRow {
  id: string;
  name: string;      // TODO: rename to match your row's primary field
  status: string;    // TODO: rename — use createStatusCell from @roboborealis/components/tables for typed colors
  category: string;  // TODO: rename
  updatedAt: string; // TODO: replace with Date and use createDateCell for relative formatting
}

// TODO: Replace with real data from your API / tRPC query
const ACTIVITY_ROWS: ActivityRow[] = [
  { id: '1', name: 'Item Alpha',   status: 'Active',   category: 'Category A', updatedAt: '2 min ago' },
  { id: '2', name: 'Item Beta',    status: 'Inactive', category: 'Category B', updatedAt: '14 min ago' },
  { id: '3', name: 'Item Gamma',   status: 'Active',   category: 'Category A', updatedAt: '1 hr ago' },
  { id: '4', name: 'Item Delta',   status: 'Overdue',  category: 'Category C', updatedAt: '3 hr ago' },
  { id: '5', name: 'Item Epsilon', status: 'Active',   category: 'Category B', updatedAt: '5 min ago' },
];

// Inline status badge — or replace with createStatusCell from @roboborealis/components/tables
const STATUS_COLORS: Record<string, 'success' | 'default' | 'destructive' | 'warning'> = {
  Active:   'success',
  Inactive: 'default',
  Overdue:  'destructive',
  Pending:  'warning',
};

const col = createColumnHelper<ActivityRow>();

// TODO: Adapt column headers and accessors to your ActivityRow type
const columns = [
  col.accessor('name', {
    header: 'Name',       // TODO
    size: 220,
    cell: (info) => <span style={{ fontWeight: 500 }}>{info.getValue()}</span>,
  }),
  col.accessor('status', {
    header: 'Status',
    size: 120,
    cell: (info) => {
      const s = info.getValue();
      return (
        <RoboBadge usage='label' color={STATUS_COLORS[s] ?? 'default'} size='sm'>
          {s}
        </RoboBadge>
      );
    },
  }),
  col.accessor('category', {
    header: 'Category',   // TODO
    size: 150,
  }),
  col.accessor('updatedAt', {
    header: 'Updated',
    size: 130,
  }),
];

// ---------------------------------------------------------------------------
// Template component
// ---------------------------------------------------------------------------

export function DataDashboardTemplate() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* KPI stat cards — TODO: replace labels, values, change%, and icons with real metrics */}
      <div style={KPI_GRID}>
        <RoboStatCard
          label="Total Items"           // TODO
          value={247}                   // TODO: wire to real data
          change={4.1}
          changeLabel="vs last month"
          icon={<TrendingUp className='h-5 w-5' />}
        />
        <RoboStatCard
          label="Active"                // TODO
          value={89}
          change={8.3}
          changeLabel="vs last week"
          icon={<CheckCircle className='h-5 w-5' />}
        />
        <RoboStatCard
          label="Processed Today"       // TODO
          value={34}
          change={12.0}
          changeLabel="vs yesterday"
          icon={<Clock className='h-5 w-5' />}
        />
        <RoboStatCard
          label="Alerts"               // TODO
          value={3}
          change={-25}
          changeLabel="vs yesterday"
          icon={<AlertTriangle className='h-5 w-5' />}
        />
      </div>

      {/* Recent activity table — TODO: replace with real activity data */}
      <RoboCard>
        <RoboCardHeader>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <p style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--foreground)' }}>
              Recent Activity  {/* TODO */}
            </p>
            <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--muted-foreground)' }}>
              Latest updates across your records  {/* TODO */}
            </p>
          </div>
        </RoboCardHeader>
        <RoboCardBody>
          <RoboDataTable
            data={ACTIVITY_ROWS}
            columns={columns as unknown as ColumnDef<ActivityRow, unknown>[]}
            getRowId={(r) => r.id}
            enableSorting={false}
            enablePagination={false}
            aria-label="Recent activity"  // TODO: Update aria-label
          />
        </RoboCardBody>
      </RoboCard>

    </div>
  );
}
