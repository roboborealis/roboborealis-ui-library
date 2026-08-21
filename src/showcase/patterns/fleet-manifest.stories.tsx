// ---------------------------------------------------------------------------
// SHOWCASE PATTERN — List + Search (Archetype 4)
//
// Constellation Manifest: a searchable, filterable satellite registry with status
// filtering, row selection, and export action.
//
// Pattern: RoboPageShell + RoboTopbar + search toolbar + RoboDataTable
// No server required — all mock data.
// ---------------------------------------------------------------------------

import * as React from 'react';
import { useState, useMemo } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { createColumnHelper } from '@tanstack/react-table';
import { Download, Satellite } from 'lucide-react';
import { RoboDataTable, createDateCell, createStatusCell } from '@roboborealis/components/tables';
import { RoboPageShell } from '@roboborealis/components/layout';
import { RoboBadge, RoboButton, RoboInput } from '@roboborealis/components/core';
import { RoboSelect } from '@roboborealis/components/forms';
import { RoboFlag } from '@roboborealis/components/flags';


// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

type SatelliteStatus = 'in-orbit' | 'docked' | 'parked' | 'signal-loss';

interface Satellite {
  id: string;
  name: string;
  noradId: string;
  flag: string;
  type: 'satellite' | 'probe' | 'telescope' | 'capsule';
  status: SatelliteStatus;
  speed: number;
  lastReport: Date;
}

const SATELLITES: Satellite[] = [
  { id: 'v01', name: 'SENTINEL RELAY',    noradId: '636092123', flag: 'US', type: 'telescope', status: 'in-orbit',    speed: 7.66, lastReport: new Date(Date.now() - 1_800_000) },
  { id: 'v02', name: 'VOYAGER PROBE',     noradId: '477123456', flag: 'RU', type: 'probe',     status: 'in-orbit',    speed: 7.53, lastReport: new Date(Date.now() - 3_600_000) },
  { id: 'v03', name: 'KEPLER SURVEYOR',   noradId: '229456789', flag: 'JP', type: 'satellite', status: 'parked',      speed: 0,    lastReport: new Date(Date.now() - 7_200_000) },
  { id: 'v04', name: 'ARIANE SCOUT',      noradId: '373012345', flag: 'FR', type: 'probe',     status: 'in-orbit',    speed: 7.48, lastReport: new Date(Date.now() - 900_000) },
  { id: 'v05', name: 'HUBBLE OPTIC',      noradId: '564987654', flag: 'US', type: 'telescope', status: 'docked',      speed: 0,    lastReport: new Date(Date.now() - 14_400_000) },
  { id: 'v06', name: 'FALCON UPLINK',     noradId: '470345678', flag: 'AE', type: 'satellite', status: 'in-orbit',    speed: 7.71, lastReport: new Date(Date.now() - 2_700_000) },
  { id: 'v07', name: 'RIGEL BEACON',      noradId: '461234567', flag: 'IN', type: 'probe',     status: 'signal-loss', speed: 0,    lastReport: new Date(Date.now() - 86_400_000) },
  { id: 'v08', name: 'TIANGONG FERRY',    noradId: '422876543', flag: 'CN', type: 'satellite', status: 'parked',      speed: 0,    lastReport: new Date(Date.now() - 10_800_000) },
  { id: 'v09', name: 'ORION CAPSULE',     noradId: '308765432', flag: 'US', type: 'capsule',   status: 'docked',      speed: 0,    lastReport: new Date(Date.now() - 5_400_000) },
  { id: 'v10', name: 'VEGA RELAY',        noradId: '636012987', flag: 'US', type: 'telescope', status: 'in-orbit',    speed: 7.80, lastReport: new Date(Date.now() - 600_000) },
  { id: 'v11', name: 'BHASKARA SCAN',     noradId: '419234567', flag: 'IN', type: 'probe',     status: 'in-orbit',    speed: 7.42, lastReport: new Date(Date.now() - 1_200_000) },
  { id: 'v12', name: 'LYRA COMSAT',       noradId: '255801234', flag: 'GB', type: 'satellite', status: 'in-orbit',    speed: 3.07, lastReport: new Date(Date.now() - 4_500_000) },
  { id: 'v13', name: 'COSMOS BEACON',     noradId: '352654321', flag: 'RU', type: 'probe',     status: 'signal-loss', speed: 0,    lastReport: new Date(Date.now() - 172_800_000) },
  { id: 'v14', name: 'GALILEO OPTIC',     noradId: '470567890', flag: 'IT', type: 'satellite', status: 'in-orbit',    speed: 7.59, lastReport: new Date(Date.now() - 3_000_000) },
  { id: 'v15', name: 'POLARIS SENTINEL',  noradId: '256987123', flag: 'NO', type: 'telescope', status: 'parked',      speed: 0,    lastReport: new Date(Date.now() - 21_600_000) },
];

const STATUS_COLOR_MAP: Record<SatelliteStatus, 'success' | 'warning' | 'muted' | 'destructive'> = {
  'in-orbit':    'success',
  docked:        'muted',
  parked:        'warning',
  'signal-loss': 'destructive',
};

const STATUS_OPTIONS = [
  { value: 'all',         label: 'All statuses' },
  { value: 'in-orbit',    label: 'In Orbit' },
  { value: 'docked',      label: 'Docked' },
  { value: 'parked',      label: 'Parked' },
  { value: 'signal-loss', label: 'Signal Loss' },
];

const TYPE_OPTIONS = [
  { value: 'all',       label: 'All types' },
  { value: 'satellite', label: 'Satellite' },
  { value: 'probe',     label: 'Probe' },
  { value: 'telescope', label: 'Telescope' },
  { value: 'capsule',   label: 'Crew Capsule' },
];

// ---------------------------------------------------------------------------
// Columns
// ---------------------------------------------------------------------------

const col = createColumnHelper<Satellite>();

const columns = [
  col.accessor('name', {
    header: 'Satellite',
    size: 220,
    cell: (info) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Satellite size={14} style={{ opacity: 0.4, flexShrink: 0 }} />
        <span style={{ fontWeight: 500 }}>{info.getValue()}</span>
      </div>
    ),
  }),
  col.accessor('noradId', {
    header: 'NORAD ID',
    size: 120,
    cell: (info) => (
      <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.8125rem' }}>
        {info.getValue()}
      </span>
    ),
  }),
  col.accessor('flag', {
    header: 'Operator',
    size: 80,
    cell: (info) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <RoboFlag code={info.getValue()} size="sm" />
        <span style={{ fontSize: '0.8125rem' }}>{info.getValue()}</span>
      </div>
    ),
  }),
  col.accessor('type', {
    header: 'Type',
    size: 110,
    cell: (info) => (
      <span style={{ textTransform: 'capitalize', fontSize: '0.8125rem' }}>{info.getValue()}</span>
    ),
  }),
  col.accessor('status', {
    header: 'Status',
    size: 110,
    cell: createStatusCell({
      colorMap: STATUS_COLOR_MAP,
    }),
  }),
  col.accessor('speed', {
    header: 'Speed',
    size: 90,
    cell: (info) => (
      <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.8125rem' }}>
        {info.getValue() > 0 ? `${info.getValue()} km/s` : '—'}
      </span>
    ),
  }),
  col.accessor('lastReport', {
    header: 'Last Report',
    size: 150,
    cell: createDateCell({ showRelative: true }),
  }),
];

// ---------------------------------------------------------------------------
// Topbar stub
// ---------------------------------------------------------------------------

function ManifestTopbar() {
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
      <Satellite size={18} style={{ opacity: 0.6 }} />
      <span style={{ fontWeight: 700, fontSize: 15 }}>Constellation Manifest</span>
      <RoboBadge variant='status' style={{ marginLeft: 4 }}>{SATELLITES.length} satellites</RoboBadge>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Pattern component
// ---------------------------------------------------------------------------

function ConstellationManifest() {
  const [search, setSearch]       = useState('');
  const [statusFilter, setStatus] = useState('all');
  const [typeFilter, setType]     = useState('all');

  const filtered = useMemo(() =>
    SATELLITES.filter((v) =>
      (statusFilter === 'all' || v.status === statusFilter) &&
      (typeFilter   === 'all' || v.type   === typeFilter) &&
      (search === '' || v.name.toLowerCase().includes(search.toLowerCase()) || v.noradId.includes(search))
    ), [search, statusFilter, typeFilter]);

  return (
    <RoboPageShell topbar={<ManifestTopbar />}>
      <div style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* Toolbar */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <RoboInput
            placeholder="Search by name or NORAD ID…"
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
            value={typeFilter}
            onValueChange={setType}
            options={TYPE_OPTIONS}
          />
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
            {filtered.length !== SATELLITES.length && (
              <span style={{ fontSize: 12, opacity: 0.55 }}>
                {filtered.length} of {SATELLITES.length}
              </span>
            )}
            <RoboButton variant='secondary' size='sm'>
              <Download size={14} style={{ marginRight: 6 }} />
              Export
            </RoboButton>
          </div>
        </div>

        {/* Table */}
        <RoboDataTable
          data={filtered}
          columns={columns}
          getRowId={(row) => row.id}
          enableSorting
          enablePagination
          enableRowSelection
          pageSize={10}
          striped
          aria-label="Constellation manifest satellite list"
          emptyState={
            <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--muted-foreground)', fontSize: 13 }}>
              No satellites match the current filters.
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
  demonstrates: 'A sortable, filterable, searchable data table with an export action — the standard registry/list page.',
  whenToUse: 'Use as the reference for any full-page registry or inventory list where users search, filter by 1-3 dimensions, and optionally export results.',
  keywords: ['sortable table', 'filterable table', 'searchable table', 'registry', 'inventory', 'export list'],
  agentPriority: 'Prioritize this pattern over composing RoboDataTable from scratch whenever the feature request is a browsable list with search/filter, not a browse-then-inspect flow (use Filter + Table + Detail for that) or an edit flow (use Flows/Constellation Editor for that).',
};

const meta: Meta = {
  title: 'Showcase/Patterns/Tables/Constellation Manifest',
  // patternMeta is a plain data export for generate-manifest.ts's regex
  // extraction, not a story — exclude it from Storybook's CSF story indexer.
  excludeStories: ['patternMeta'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '**Archetype 4 — List + Search Page.** ' +
          'A searchable, filterable satellite registry demonstrating the standard list page pattern: ' +
          'RoboPageShell shell, search + filter toolbar, and a RoboDataTable with sort, pagination, and row selection. ' +
          'Built using the `/design-ui-feature` skill.\n\n' +
          '**Demonstrates:** ' + patternMeta.demonstrates + '\n\n' +
          '**Use in your app when:** ' + patternMeta.whenToUse + '\n\n' +
          '**Agent priority:** ' + patternMeta.agentPriority,
      },
    },
  },
};
export default meta;

type Story = StoryObj;

export const ConstellationManifestPattern: Story = {
  name: 'Constellation Manifest',
  render: () => <ConstellationManifest />,
};
