// ---------------------------------------------------------------------------
// SHOWCASE PATTERN — Filter + Table + Detail (Archetype 6)
//
// Satellite Search: 3-column browse → inspect workflow.
// Left filter panel drives the table. Clicking a row opens the detail pane.
//
// Pattern: 3-column flex — RoboFilterPanel-style + RoboDataTable + RoboCard detail
// State: local useState for filters + selected satellite (no context needed)
// ---------------------------------------------------------------------------

import * as React from 'react';
import { useState, useMemo } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { createColumnHelper, type RowSelectionState } from '@tanstack/react-table';
import { Search } from 'lucide-react';
import { RoboDataTable, createDateCell, createStatusCell } from '@roboborealis/components/tables';
import { RoboBadge, RoboCard, RoboCardBody, RoboCardHeader, RoboInput, RoboSeparator } from '@roboborealis/components/core';
import { RoboSelect } from '@roboborealis/components/forms';
import { RoboFlag } from '@roboborealis/components/flags';


// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

type SatelliteStatus = 'in-orbit' | 'docked' | 'parked' | 'signal-loss';
type SatelliteType   = 'satellite' | 'probe' | 'telescope' | 'capsule';

interface Satellite {
  id: string;
  name: string;
  noradId: string;
  imo: string;
  flag: string;
  type: SatelliteType;
  status: SatelliteStatus;
  speed: number;
  heading: number;
  position: { lat: number; lng: number };
  lastReport: Date;
  destination: string;
  eta: string;
}

const SATELLITES: Satellite[] = [
  { id: 'v01', name: 'SENTINEL RELAY',   noradId: '636092123', imo: '1998-067A', flag: 'US', type: 'telescope', status: 'in-orbit',    speed: 7.66, heading: 87,  position: { lat: 26.3, lng: 56.8 }, lastReport: new Date(Date.now() - 1_800_000),  destination: 'GEO SLOT 12', eta: '2026-05-08' },
  { id: 'v02', name: 'VOYAGER PROBE',    noradId: '477123456', imo: '1977-084A', flag: 'RU', type: 'probe',     status: 'in-orbit',    speed: 7.53, heading: 263, position: { lat: 26.1, lng: 57.2 }, lastReport: new Date(Date.now() - 3_600_000),  destination: 'DEEP SPACE',  eta: '2026-05-09' },
  { id: 'v03', name: 'KEPLER SURVEYOR',  noradId: '229456789', imo: '2009-011A', flag: 'JP', type: 'satellite', status: 'parked',      speed: 0,    heading: 0,   position: { lat: 25.9, lng: 56.5 }, lastReport: new Date(Date.now() - 7_200_000),  destination: 'SUN-SYNC ORBIT', eta: 'TBD' },
  { id: 'v04', name: 'ARIANE SCOUT',     noradId: '373012345', imo: '2021-045B', flag: 'FR', type: 'probe',     status: 'in-orbit',    speed: 7.48, heading: 92,  position: { lat: 26.5, lng: 56.1 }, lastReport: new Date(Date.now() - 900_000),   destination: 'L2 HALO',     eta: '2026-05-10' },
  { id: 'v05', name: 'HUBBLE OPTIC',     noradId: '564987654', imo: '1990-037B', flag: 'US', type: 'telescope', status: 'docked',   speed: 0,    heading: 180, position: { lat: 25.3, lng: 55.4 }, lastReport: new Date(Date.now() - 14_400_000), destination: '—', eta: '—' },
  { id: 'v06', name: 'FALCON UPLINK',    noradId: '470345678', imo: '2018-092A', flag: 'AE', type: 'satellite', status: 'in-orbit',    speed: 7.71, heading: 274, position: { lat: 25.1, lng: 56.9 }, lastReport: new Date(Date.now() - 2_700_000),  destination: 'GEO SLOT 34', eta: '2026-05-11' },
  { id: 'v07', name: 'RIGEL BEACON',     noradId: '461234567', imo: '2015-077C', flag: 'IN', type: 'probe',     status: 'signal-loss', speed: 0,    heading: 0,   position: { lat: 26.8, lng: 57.5 }, lastReport: new Date(Date.now() - 86_400_000), destination: '—', eta: '—' },
  { id: 'v08', name: 'TIANGONG FERRY',   noradId: '422876543', imo: '2021-035A', flag: 'CN', type: 'satellite', status: 'parked',   speed: 0,    heading: 45,  position: { lat: 27.1, lng: 56.2 }, lastReport: new Date(Date.now() - 10_800_000), destination: 'TIANGONG', eta: 'TBD' },
  { id: 'v09', name: 'ORION CAPSULE',    noradId: '308765432', imo: '2022-156A', flag: 'US', type: 'capsule',   status: 'docked',   speed: 0,    heading: 270, position: { lat: 26.2, lng: 50.6 }, lastReport: new Date(Date.now() - 5_400_000),  destination: 'ISS', eta: '—' },
  { id: 'v10', name: 'VEGA RELAY',       noradId: '636012987', imo: '2020-061A', flag: 'US', type: 'telescope', status: 'in-orbit',    speed: 7.80, heading: 89,  position: { lat: 25.7, lng: 57.0 }, lastReport: new Date(Date.now() - 600_000),   destination: 'LUNAR GATEWAY', eta: '2026-05-07' },
];

const STATUS_COLOR_MAP: Record<SatelliteStatus, 'success' | 'warning' | 'muted' | 'destructive'> = {
  'in-orbit':    'success',
  docked:        'muted',
  parked:        'warning',
  'signal-loss': 'destructive',
};

const FLAG_OPTIONS = [
  { value: 'all', label: 'All operators' },
  ...Array.from(new Set(SATELLITES.map((v) => v.flag))).map((f) => ({ value: f, label: f })),
];

const TYPE_OPTIONS = [
  { value: 'all',       label: 'All types' },
  { value: 'satellite', label: 'Satellite' },
  { value: 'probe',     label: 'Probe' },
  { value: 'telescope', label: 'Telescope' },
  { value: 'capsule',   label: 'Crew Capsule' },
];

const STATUS_OPTIONS = [
  { value: 'all',         label: 'All statuses' },
  { value: 'in-orbit',    label: 'In Orbit' },
  { value: 'docked',      label: 'Docked' },
  { value: 'parked',      label: 'Parked' },
  { value: 'signal-loss', label: 'Signal Loss' },
];

// ---------------------------------------------------------------------------
// Table columns
// ---------------------------------------------------------------------------

const col = createColumnHelper<Satellite>();

const columns = [
  col.accessor('name', {
    header: 'Satellite',
    size: 200,
    cell: (info) => <span style={{ fontWeight: 500 }}>{info.getValue()}</span>,
  }),
  col.accessor('flag', {
    header: 'Operator',
    size: 70,
    cell: (info) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
        <RoboFlag code={info.getValue()} size="sm" />
        <span style={{ fontSize: '0.8125rem' }}>{info.getValue()}</span>
      </div>
    ),
  }),
  col.accessor('type', {
    header: 'Type',
    size: 100,
    cell: (info) => <span style={{ textTransform: 'capitalize', fontSize: '0.8125rem' }}>{info.getValue()}</span>,
  }),
  col.accessor('status', {
    header: 'Status',
    size: 100,
    cell: createStatusCell({ colorMap: STATUS_COLOR_MAP }),
  }),
  col.accessor('lastReport', {
    header: 'Last Report',
    size: 130,
    cell: createDateCell({ showRelative: true }),
  }),
];

// ---------------------------------------------------------------------------
// Detail row helper
// ---------------------------------------------------------------------------

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '5px 0' }}>
      <span style={{ opacity: 0.5 }}>{label}</span>
      <span style={{ fontWeight: 500, textAlign: 'right', maxWidth: '55%' }}>{value}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Pattern component
// ---------------------------------------------------------------------------

function SatelliteSearch() {
  const [search, setSearch]       = useState('');
  const [flagFilter, setFlag]     = useState('all');
  const [typeFilter, setType]     = useState('all');
  const [statusFilter, setStatus] = useState('all');
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const filtered = useMemo(() =>
    SATELLITES.filter((v) =>
      (flagFilter   === 'all' || v.flag   === flagFilter) &&
      (typeFilter   === 'all' || v.type   === typeFilter) &&
      (statusFilter === 'all' || v.status === statusFilter) &&
      (search === '' || v.name.toLowerCase().includes(search.toLowerCase()) || v.noradId.includes(search))
    ), [search, flagFilter, typeFilter, statusFilter]);

  const selectedId = Object.keys(rowSelection).find((k) => rowSelection[k]) ?? null;
  const selected = SATELLITES.find((v) => v.id === selectedId) ?? null;

  const filterLabel: React.CSSProperties = {
    fontSize: 11,
    fontWeight: 700,
    opacity: 0.45,
    textTransform: 'uppercase',
    letterSpacing: '0.07em',
    margin: '0 0 4px',
  };

  return (
    <div style={{ display: 'flex', height: '100%', minHeight: 560, overflow: 'hidden' }}>

      {/* ── Left: filter panel ── */}
      <aside
        style={{
          width: 240,
          flexShrink: 0,
          borderRight: '1px solid var(--border)',
          padding: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          overflowY: 'auto',
          background: 'var(--card)',
        }}
      >
        <p style={{ margin: 0, fontWeight: 700, fontSize: 14 }}>Satellite Search</p>

        <div>
          <p style={filterLabel}>Search</p>
          <div style={{ position: 'relative' }}>
            <Search size={13} style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', opacity: 0.4, pointerEvents: 'none' }} />
            <RoboInput
              placeholder="Name or NORAD ID…"
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
              style={{ paddingLeft: 28 }}
            />
          </div>
        </div>

        <div>
          <p style={filterLabel}>Operator</p>
          <RoboSelect value={flagFilter} onValueChange={setFlag} options={FLAG_OPTIONS} />
        </div>

        <div>
          <p style={filterLabel}>Satellite Type</p>
          <RoboSelect value={typeFilter} onValueChange={setType} options={TYPE_OPTIONS} />
        </div>

        <div>
          <p style={filterLabel}>Status</p>
          <RoboSelect value={statusFilter} onValueChange={setStatus} options={STATUS_OPTIONS} />
        </div>

        <RoboSeparator />
        <p style={{ margin: 0, fontSize: 12, opacity: 0.45 }}>
          {filtered.length} of {SATELLITES.length} satellites
        </p>
      </aside>

      {/* ── Center: results table ── */}
      <div style={{ flex: 1, overflow: 'auto', padding: 16 }}>
        <RoboDataTable
          data={filtered}
          columns={columns}
          getRowId={(r) => r.id}
          enableSorting
          enablePagination
          enableRowSelection
          enableMultiRowSelection={false}
          rowSelection={rowSelection}
          onRowSelectionChange={setRowSelection}
          pageSize={10}
          aria-label="Satellite search results"
          emptyState={
            <div style={{ padding: '32px 0', textAlign: 'center', color: 'var(--muted-foreground)', fontSize: 13 }}>
              No satellites match the current filters.
            </div>
          }
        />
      </div>

      {/* ── Right: detail pane — only rendered when a row is selected ── */}
      {selected && (
        <aside
          style={{
            width: 300,
            flexShrink: 0,
            borderLeft: '1px solid var(--border)',
            padding: 16,
            overflowY: 'auto',
            background: 'var(--card)',
          }}
        >
          <RoboCard>
            <RoboCardHeader>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{selected.name}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <RoboFlag code={selected.flag} size="sm" />
                  <RoboBadge variant={STATUS_COLOR_MAP[selected.status]}>
                    {selected.status}
                  </RoboBadge>
                </div>
              </div>
            </RoboCardHeader>
            <RoboCardBody>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <DetailRow label="NORAD ID"        value={<code style={{ fontSize: 12 }}>{selected.noradId}</code>} />
                <DetailRow label="COSPAR"         value={<code style={{ fontSize: 12 }}>{selected.imo}</code>} />
                <DetailRow label="Type"        value={<span style={{ textTransform: 'capitalize' }}>{selected.type}</span>} />
                <DetailRow label="Operator"    value={selected.flag} />
                <RoboSeparator style={{ margin: '6px 0' }} />
                <DetailRow label="Velocity"    value={selected.speed > 0 ? `${selected.speed} km/s` : 'Docked'} />
                <DetailRow label="Inclination" value={selected.heading > 0 ? `${selected.heading}°` : '—'} />
                <DetailRow label="Position"    value={`${selected.position.lat.toFixed(2)}°N  ${selected.position.lng.toFixed(2)}°E`} />
                <RoboSeparator style={{ margin: '6px 0' }} />
                <DetailRow label="Destination" value={selected.destination} />
                <DetailRow label="ETA"         value={selected.eta} />
                <DetailRow label="Last Report" value={
                  <span style={{ fontSize: 12 }}>
                    {new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
                      -Math.round((Date.now() - selected.lastReport.getTime()) / 60_000),
                      'minute'
                    )}
                  </span>
                } />
              </div>
            </RoboCardBody>
          </RoboCard>
        </aside>
      )}

    </div>
  );
}

// ---------------------------------------------------------------------------
// Story
// ---------------------------------------------------------------------------

export const patternMeta = {
  demonstrates: 'The Filter + Table + Detail archetype: a 3-column browse-then-inspect layout where a left filter panel drives a table in the center and a row click opens full details in a right-hand pane.',
  whenToUse: 'Use as the reference whenever a feature needs a browse-then-inspect workflow inline on one page, filtering a list and clicking for details, without navigating to a separate detail page.',
  keywords: ['filter table detail', 'browse and inspect', 'three column', 'side panel', 'detail pane', 'drill down', 'row selection'],
  agentPriority: 'This is the canonical storyPath for the filter-table-detail archetype in src/agent/archetypes.ts. Prioritize it over Flight Plan Reports as soon as the feature needs a detail pane driven by row selection; prioritize Flight Plan Reports instead when row clicks should navigate away rather than open an inline pane.',
};

const meta: Meta = {
  title: 'Showcase/Patterns/Tables/Satellite Search',
  excludeStories: ['patternMeta'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '**Archetype 6 — Filter + Table + Detail.** ' +
          'A 3-column browse → inspect layout: filter panel on the left drives the data table in the centre; ' +
          'clicking a row opens the detail pane on the right. ' +
          'State is local useState — no context needed since selection only drives one panel. ' +
          'Built using the `/design-ui-feature` skill.',
      },
    },
  },
};
export default meta;

type Story = StoryObj;

export const SatelliteSearchPattern: Story = {
  name: 'Satellite Search',
  render: () => <SatelliteSearch />,
};
