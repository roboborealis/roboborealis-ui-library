// ---------------------------------------------------------------------------
// SHOWCASE PATTERN — Filter + Table (Archetype 4 variant)
//
// Flight Plan Reports: a searchable, filterable list of flight plans
// filed by satellites at departure. Simpler than the 3-column satellite-search
// pattern — no detail pane, just a toolbar above RoboDataTable.
//
// Pattern: RoboPageShell + search/filter toolbar + RoboDataTable
// State: local useState for filters (no context needed)
// ---------------------------------------------------------------------------

import * as React from 'react';
import { useState, useMemo } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { createColumnHelper } from '@tanstack/react-table';
import { FileText } from 'lucide-react';
import { RoboDataTable, createDateCell, createStatusCell } from '@roboborealis/components/tables';
import { RoboPageShell } from '@roboborealis/components/layout';
import { RoboBadge, RoboInput } from '@roboborealis/components/core';
import { RoboSelect } from '@roboborealis/components/forms';
import { RoboFlag } from '@roboborealis/components/flags';


// ---------------------------------------------------------------------------
// Types & mock data
// ---------------------------------------------------------------------------

type ReportStatus = 'filed' | 'active' | 'arrived' | 'overdue' | 'cancelled';

interface SailingPlanReport {
  id: string;
  reportRef: string;
  satelliteName: string;
  noradId: string;
  flag: string;
  departurePort: string;
  destinationPort: string;
  region: 'americas' | 'europe' | 'asia-pacific' | 'middle-east' | 'africa';
  departureDate: Date;
  eta: Date;
  filedDate: Date;
  status: ReportStatus;
}

const NOW = Date.now();
const DAY = 86_400_000;

const REPORTS: SailingPlanReport[] = [
  {
    id: 'r01', reportRef: 'FPR-2026-0041', satelliteName: 'SENTINEL RELAY',   noradId: '636092123', flag: 'US',
    departurePort: 'CAPE CANAVERAL', destinationPort: 'GEO SLOT 12', region: 'americas',
    departureDate: new Date(NOW - 3 * DAY), eta: new Date(NOW + 18 * DAY),  filedDate: new Date(NOW - 3 * DAY + 2 * 3_600_000),
    status: 'active',
  },
  {
    id: 'r02', reportRef: 'FPR-2026-0040', satelliteName: 'VOYAGER PROBE',      noradId: '477123456', flag: 'CN',
    departurePort: 'WENCHANG', destinationPort: 'DEEP SPACE', region: 'asia-pacific',
    departureDate: new Date(NOW - 5 * DAY), eta: new Date(NOW + 10 * DAY),  filedDate: new Date(NOW - 5 * DAY + 3_600_000),
    status: 'active',
  },
  {
    id: 'r03', reportRef: 'FPR-2026-0039', satelliteName: 'KEPLER SURVEYOR',    noradId: '229456789', flag: 'JP',
    departurePort: 'TANEGASHIMA', destinationPort: 'SUN-SYNC ORBIT', region: 'asia-pacific',
    departureDate: new Date(NOW - 14 * DAY), eta: new Date(NOW - DAY),      filedDate: new Date(NOW - 14 * DAY + 1_800_000),
    status: 'overdue',
  },
  {
    id: 'r04', reportRef: 'FPR-2026-0038', satelliteName: 'ARIANE SCOUT',       noradId: '373012345', flag: 'FR',
    departurePort: 'KOUROU', destinationPort: 'L2 HALO ORBIT', region: 'europe',
    departureDate: new Date(NOW - 8 * DAY), eta: new Date(NOW + 6 * DAY),   filedDate: new Date(NOW - 8 * DAY + 3_600_000),
    status: 'active',
  },
  {
    id: 'r05', reportRef: 'FPR-2026-0037', satelliteName: 'FALCON UPLINK',      noradId: '564987654', flag: 'US',
    departurePort: 'VANDENBERG', destinationPort: 'LOW EARTH ORBIT', region: 'americas',
    departureDate: new Date(NOW - 6 * DAY), eta: new Date(NOW + 2 * DAY),   filedDate: new Date(NOW - 6 * DAY + 7_200_000),
    status: 'active',
  },
  {
    id: 'r06', reportRef: 'FPR-2026-0036', satelliteName: 'DAWN ROVER',         noradId: '470345678', flag: 'AE',
    departurePort: 'CAPE CANAVERAL', destinationPort: 'LUNAR ORBIT', region: 'americas',
    departureDate: new Date(NOW - 2 * DAY), eta: new Date(NOW + 14 * DAY),  filedDate: new Date(NOW - 2 * DAY + 900_000),
    status: 'filed',
  },
  {
    id: 'r07', reportRef: 'FPR-2026-0035', satelliteName: 'RIGEL BEACON',       noradId: '461234567', flag: 'IN',
    departurePort: 'SRIHARIKOTA', destinationPort: 'POLAR ORBIT', region: 'asia-pacific',
    departureDate: new Date(NOW - 20 * DAY), eta: new Date(NOW - 10 * DAY), filedDate: new Date(NOW - 20 * DAY + 3_600_000),
    status: 'arrived',
  },
  {
    id: 'r08', reportRef: 'FPR-2026-0034', satelliteName: 'PERSEUS ORBITER',    noradId: '422876543', flag: 'RU',
    departurePort: 'PLESETSK', destinationPort: 'MOLNIYA ORBIT', region: 'europe',
    departureDate: new Date(NOW - 9 * DAY), eta: new Date(NOW + 3 * DAY),   filedDate: new Date(NOW - 9 * DAY + 1_800_000),
    status: 'active',
  },
  {
    id: 'r09', reportRef: 'FPR-2026-0033', satelliteName: 'LYRA COMSAT',        noradId: '308765432', flag: 'US',
    departurePort: 'CAPE CANAVERAL', destinationPort: 'GEO SLOT 34', region: 'americas',
    departureDate: new Date(NOW - 12 * DAY), eta: new Date(NOW - 2 * DAY),  filedDate: new Date(NOW - 12 * DAY + 3_600_000),
    status: 'arrived',
  },
  {
    id: 'r10', reportRef: 'FPR-2026-0032', satelliteName: 'VEGA RELAY',         noradId: '636012987', flag: 'US',
    departurePort: 'CAPE CANAVERAL', destinationPort: 'LUNAR GATEWAY', region: 'americas',
    departureDate: new Date(NOW - DAY), eta: new Date(NOW + 22 * DAY),       filedDate: new Date(NOW - DAY + 3_600_000),
    status: 'filed',
  },
  {
    id: 'r11', reportRef: 'FPR-2026-0031', satelliteName: 'BHASKARA SCAN',      noradId: '419234567', flag: 'IN',
    departurePort: 'SRIHARIKOTA', destinationPort: 'SUN-SYNC ORBIT', region: 'asia-pacific',
    departureDate: new Date(NOW - 7 * DAY), eta: new Date(NOW + 4 * DAY),   filedDate: new Date(NOW - 7 * DAY + 7_200_000),
    status: 'active',
  },
  {
    id: 'r12', reportRef: 'FPR-2026-0030', satelliteName: 'ATLAS FERRY',        noradId: '255801234', flag: 'IT',
    departurePort: 'KOUROU', destinationPort: 'GEO TRANSFER ORBIT', region: 'europe',
    departureDate: new Date(NOW - 4 * DAY), eta: new Date(NOW + 8 * DAY),   filedDate: new Date(NOW - 4 * DAY + 1_800_000),
    status: 'active',
  },
  {
    id: 'r13', reportRef: 'FPR-2026-0029', satelliteName: 'COSMOS GUARDIAN',    noradId: '352654321', flag: 'RU',
    departurePort: 'BAIKONUR', destinationPort: 'DEEP SPACE', region: 'europe',
    departureDate: new Date(NOW - 16 * DAY), eta: new Date(NOW - 4 * DAY),  filedDate: new Date(NOW - 16 * DAY + 3_600_000),
    status: 'overdue',
  },
  {
    id: 'r14', reportRef: 'FPR-2026-0028', satelliteName: 'AURORA SCOUT',       noradId: '470567890', flag: 'AE',
    departurePort: 'CAPE CANAVERAL', destinationPort: 'LOW EARTH ORBIT', region: 'africa',
    departureDate: new Date(NOW - 11 * DAY), eta: new Date(NOW - 3 * DAY),  filedDate: new Date(NOW - 11 * DAY + 900_000),
    status: 'arrived',
  },
  {
    id: 'r15', reportRef: 'FPR-2026-0027', satelliteName: 'POLARIS SENTINEL',   noradId: '256987123', flag: 'NO',
    departurePort: 'ANDØYA', destinationPort: 'POLAR ORBIT', region: 'europe',
    departureDate: new Date(NOW - DAY), eta: new Date(NOW + 2 * DAY),        filedDate: new Date(NOW - DAY + 1_800_000),
    status: 'cancelled',
  },
];

const STATUS_COLOR_MAP: Record<ReportStatus, 'default' | 'primary' | 'success' | 'warning' | 'muted' | 'destructive'> = {
  filed:     'primary',
  active:    'success',
  arrived:   'muted',
  overdue:   'destructive',
  cancelled: 'default',
};

const STATUS_LABEL_MAP: Record<ReportStatus, string> = {
  filed:     'Filed',
  active:    'Active',
  arrived:   'Arrived',
  overdue:   'Overdue',
  cancelled: 'Cancelled',
};

// ---------------------------------------------------------------------------
// Filter options
// ---------------------------------------------------------------------------

const STATUS_OPTIONS = [
  { value: 'all',       label: 'All statuses' },
  { value: 'filed',     label: 'Filed' },
  { value: 'active',    label: 'Active' },
  { value: 'arrived',   label: 'Arrived' },
  { value: 'overdue',   label: 'Overdue' },
  { value: 'cancelled', label: 'Cancelled' },
];

const REGION_OPTIONS = [
  { value: 'all',          label: 'All regions' },
  { value: 'americas',     label: 'Americas' },
  { value: 'europe',       label: 'Europe' },
  { value: 'asia-pacific', label: 'Asia-Pacific' },
  { value: 'middle-east',  label: 'Middle East' },
  { value: 'africa',       label: 'Africa' },
];

// ---------------------------------------------------------------------------
// Table columns
// ---------------------------------------------------------------------------

const col = createColumnHelper<SailingPlanReport>();

const columns = [
  col.accessor('reportRef', {
    header: 'Report Ref',
    size: 130,
    cell: (info) => (
      <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.8125rem', fontWeight: 500 }}>
        {info.getValue()}
      </span>
    ),
  }),
  col.accessor('satelliteName', {
    header: 'Satellite',
    size: 200,
    cell: (info) => <span style={{ fontWeight: 500 }}>{info.getValue()}</span>,
  }),
  col.accessor('flag', {
    header: 'Operator',
    size: 75,
    cell: (info) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <RoboFlag code={info.getValue()} size="sm" />
        <span style={{ fontSize: '0.8125rem' }}>{info.getValue()}</span>
      </div>
    ),
  }),
  col.accessor('departurePort', {
    header: 'Departure',
    size: 140,
    cell: (info) => <span style={{ fontSize: '0.8125rem' }}>{info.getValue()}</span>,
  }),
  col.accessor('destinationPort', {
    header: 'Destination',
    size: 140,
    cell: (info) => <span style={{ fontSize: '0.8125rem' }}>{info.getValue()}</span>,
  }),
  col.accessor('departureDate', {
    header: 'Departed',
    size: 150,
    cell: createDateCell({ formatOptions: { dateStyle: 'medium' }, showRelative: true }),
  }),
  col.accessor('eta', {
    header: 'ETA',
    size: 150,
    cell: createDateCell({ formatOptions: { dateStyle: 'medium' }, showRelative: true }),
  }),
  col.accessor('status', {
    header: 'Status',
    size: 110,
    cell: createStatusCell({ colorMap: STATUS_COLOR_MAP, labelMap: STATUS_LABEL_MAP }),
  }),
];

// ---------------------------------------------------------------------------
// Topbar
// ---------------------------------------------------------------------------

function ReportsTopbar() {
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
      <FileText size={18} style={{ opacity: 0.6 }} />
      <span style={{ fontWeight: 700, fontSize: 15 }}>Flight Plan Reports</span>
      <RoboBadge variant='status' style={{ marginLeft: 4 }}>{REPORTS.length} reports</RoboBadge>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Pattern component
// ---------------------------------------------------------------------------

function SailingPlanReports() {
  const [search, setSearch]         = useState('');
  const [statusFilter, setStatus]   = useState('all');
  const [regionFilter, setRegion]   = useState('all');

  const filtered = useMemo(() =>
    REPORTS.filter((r) =>
      (statusFilter === 'all' || r.status === statusFilter) &&
      (regionFilter === 'all' || r.region === regionFilter) &&
      (
        search === '' ||
        r.satelliteName.toLowerCase().includes(search.toLowerCase()) ||
        r.noradId.includes(search) ||
        r.reportRef.toLowerCase().includes(search.toLowerCase())
      )
    ), [search, statusFilter, regionFilter]);

  return (
    <RoboPageShell topbar={<ReportsTopbar />}>
      <div style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* Toolbar */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <RoboInput
            placeholder="Search satellite, NORAD ID, or ref…"
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            style={{ width: 280 }}
          />
          <RoboSelect
            value={statusFilter}
            onValueChange={setStatus}
            options={STATUS_OPTIONS}
          />
          <RoboSelect
            value={regionFilter}
            onValueChange={setRegion}
            options={REGION_OPTIONS}
          />
          {filtered.length !== REPORTS.length && (
            <span style={{ marginLeft: 'auto', fontSize: 12, opacity: 0.55 }}>
              {filtered.length} of {REPORTS.length}
            </span>
          )}
        </div>

        {/* Table */}
        <RoboDataTable
          data={filtered}
          columns={columns}
          getRowId={(r) => r.id}
          enableSorting
          enablePagination
          pageSize={10}
          striped
          aria-label="Flight plan reports"
          emptyState={
            <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--muted-foreground)', fontSize: 13 }}>
              No reports match the current filters.
            </div>
          }
        />
      </div>
    </RoboPageShell>
  );
}

// ---------------------------------------------------------------------------
// Story
// ---------------------------------------------------------------------------

export const patternMeta = {
  demonstrates: 'The Filter + Table archetype: a searchable, filterable list of records with a toolbar above the table and no side detail pane.',
  whenToUse: 'Use as the reference for a filtered report or log-style list where clicking a row would navigate to a separate page rather than opening an inline detail pane.',
  keywords: ['filter table', 'flight plan', 'flight plan report', 'filtered list', 'report log', 'toolbar above table'],
  agentPriority: 'This is the canonical storyPath for the filter-table archetype in src/agent/archetypes.ts, and the middle case of three closely related Tables patterns. Prefer Constellation Manifest (list-search archetype) when the feature also needs an export action and reads as a registry or inventory; prefer this pattern when the feature is a filtered report or log with no export emphasis and no detail pane; prefer Satellite Search (filter-table-detail archetype) as soon as the feature needs a side panel showing full details for a selected row.',
};

const meta: Meta = {
  title: 'Showcase/Patterns/Tables/Flight Plan Reports',
  excludeStories: ['patternMeta'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '**Filter + Table.** ' +
          'A searchable, filterable list of flight plan reports filed by satellites at departure. ' +
          'Simpler variant of the Filter + Table + Detail archetype — no side panel, just a compact toolbar ' +
          '(search + status + region) above a RoboDataTable with sorting and pagination. ' +
          'Built using the `/design-ui-feature` skill.',
      },
    },
  },
};
export default meta;

type Story = StoryObj;

export const SailingPlanReportsPattern: Story = {
  name: 'Flight Plan Reports',
  render: () => <SailingPlanReports />,
};
