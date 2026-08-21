// ---------------------------------------------------------------------------
// SHOWCASE PATTERN — Filter + Table + Detail (Archetype 6)
//
// Object Explorer: 3-column browse → inspect workflow over a deep-sky catalog.
// Left filter panel drives the table. Clicking a row opens the detail pane.
//
// Pattern: 3-column flex — filter panel + RoboDataTable + RoboCard detail
// State: local useState for filters + selected object (no context needed)
// ---------------------------------------------------------------------------

import * as React from 'react';
import { useState, useMemo } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { createColumnHelper, type RowSelectionState } from '@tanstack/react-table';
import { Search } from 'lucide-react';
import { makeCatalog } from '@roboborealis/space-faker';
import type { DeepSkyObject } from '@roboborealis/space-faker';
import { RoboDataTable } from '@roboborealis/components/tables';
import { RoboBadge, RoboCard, RoboCardBody, RoboCardHeader, RoboInput, RoboSeparator } from '@roboborealis/components/core';
import { RoboSelect } from '@roboborealis/components/forms';


// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const CATALOG: DeepSkyObject[] = makeCatalog(20, 11);

const TYPE_OPTIONS = [
  { value: 'all',               label: 'All types' },
  { value: 'Galaxy',            label: 'Galaxy' },
  { value: 'Emission Nebula',   label: 'Emission Nebula' },
  { value: 'Planetary Nebula',  label: 'Planetary Nebula' },
  { value: 'Open Cluster',      label: 'Open Cluster' },
  { value: 'Globular Cluster',  label: 'Globular Cluster' },
  { value: 'Double Star',       label: 'Double Star' },
  { value: 'Variable Star',     label: 'Variable Star' },
  { value: 'Supernova Remnant', label: 'Supernova Remnant' },
];

const CONSTELLATION_OPTIONS = [
  { value: 'all', label: 'All constellations' },
  ...Array.from(new Set(CATALOG.map((o) => o.constellation)))
    .sort()
    .map((c) => ({ value: c, label: c })),
];

function formatDistance(ly: number): string {
  if (ly >= 1_000_000) return `${(ly / 1_000_000).toFixed(1)}M ly`;
  if (ly >= 1_000) return `${(ly / 1_000).toFixed(1)}k ly`;
  return `${ly} ly`;
}

// ---------------------------------------------------------------------------
// Table columns
// ---------------------------------------------------------------------------

const col = createColumnHelper<DeepSkyObject>();

const columns = [
  col.accessor('designation', {
    header: 'Designation',
    size: 120,
    cell: (info) => (
      <span style={{ fontWeight: 600, fontFamily: 'var(--font-mono, monospace)', fontSize: '0.8125rem' }}>
        {info.getValue()}
      </span>
    ),
  }),
  col.accessor('commonName', {
    header: 'Common Name',
    size: 200,
    cell: (info) => <span style={{ fontWeight: 500 }}>{info.getValue()}</span>,
  }),
  col.accessor('type', {
    header: 'Type',
    size: 140,
    cell: (info) => <span style={{ fontSize: '0.8125rem' }}>{info.getValue()}</span>,
  }),
  col.accessor('magnitude', {
    header: 'Mag',
    size: 70,
    cell: (info) => (
      <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.8125rem' }}>
        {info.getValue().toFixed(1)}
      </span>
    ),
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

function ObjectExplorer() {
  const [search, setSearch]               = useState('');
  const [typeFilter, setType]             = useState('all');
  const [constellationFilter, setConstel] = useState('all');
  const [rowSelection, setRowSelection]   = useState<RowSelectionState>({});

  const filtered = useMemo(() =>
    CATALOG.filter((o) =>
      (typeFilter === 'all' || o.type === typeFilter) &&
      (constellationFilter === 'all' || o.constellation === constellationFilter) &&
      (search === '' ||
        o.commonName.toLowerCase().includes(search.toLowerCase()) ||
        o.designation.toLowerCase().includes(search.toLowerCase()))
    ), [search, typeFilter, constellationFilter]);

  const selectedId = Object.keys(rowSelection).find((k) => rowSelection[k]) ?? null;
  const selected = CATALOG.find((o) => o.id === selectedId) ?? null;

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
        <p style={{ margin: 0, fontWeight: 700, fontSize: 14 }}>Object Explorer</p>

        <div>
          <p style={filterLabel}>Search</p>
          <div style={{ position: 'relative' }}>
            <Search size={13} style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', opacity: 0.4, pointerEvents: 'none' }} />
            <RoboInput
              placeholder="Name or designation…"
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
              style={{ paddingLeft: 28 }}
            />
          </div>
        </div>

        <div>
          <p style={filterLabel}>Object Type</p>
          <RoboSelect value={typeFilter} onValueChange={setType} options={TYPE_OPTIONS} />
        </div>

        <div>
          <p style={filterLabel}>Constellation</p>
          <RoboSelect value={constellationFilter} onValueChange={setConstel} options={CONSTELLATION_OPTIONS} />
        </div>

        <RoboSeparator />
        <p style={{ margin: 0, fontSize: 12, opacity: 0.45 }}>
          {filtered.length} of {CATALOG.length} objects
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
          aria-label="Deep-sky object search results"
          emptyState={
            <div style={{ padding: '32px 0', textAlign: 'center', color: 'var(--muted-foreground)', fontSize: 13 }}>
              No objects match the current filters.
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
                <div style={{ fontWeight: 700, fontSize: 14 }}>{selected.commonName}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <RoboBadge variant='info'>{selected.designation}</RoboBadge>
                </div>
              </div>
            </RoboCardHeader>
            <RoboCardBody>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <DetailRow label="Type"          value={selected.type} />
                <DetailRow label="Constellation" value={selected.constellation} />
                <RoboSeparator style={{ margin: '6px 0' }} />
                <DetailRow label="Right Asc."    value={<code style={{ fontSize: 12 }}>{selected.ra}</code>} />
                <DetailRow label="Declination"   value={<code style={{ fontSize: 12 }}>{selected.dec}</code>} />
                <DetailRow label="Magnitude"     value={selected.magnitude.toFixed(1)} />
                <DetailRow label="Distance"      value={formatDistance(selected.distanceLy)} />
                <RoboSeparator style={{ margin: '6px 0' }} />
                <DetailRow label="Discovered"    value={selected.discoveredYear > 0 ? selected.discoveredYear : `${Math.abs(selected.discoveredYear)} BCE`} />
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
  agentPriority: 'This is the canonical storyPath for the filter-table-detail archetype in src/agent/archetypes.ts. Prioritize it over Observing Schedule as soon as the feature needs a detail pane driven by row selection; prioritize Observing Schedule instead when row clicks should navigate away rather than open an inline pane.',
};

const meta: Meta = {
  title: 'Showcase/Patterns/Tables/Object Explorer',
  excludeStories: ['patternMeta'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '**Archetype 6 — Filter + Table + Detail.** ' +
          'A 3-column browse → inspect layout: filter panel on the left drives the data table in the centre; ' +
          'clicking a row opens the detail pane on the right. ' +
          'State is local useState — no context needed since selection only drives one panel.',
      },
    },
  },
};
export default meta;

type Story = StoryObj;

export const ObjectExplorerPattern: Story = {
  name: 'Object Explorer',
  render: () => <ObjectExplorer />,
};
