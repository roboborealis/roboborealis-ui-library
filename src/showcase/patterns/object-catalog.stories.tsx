// ---------------------------------------------------------------------------
// SHOWCASE PATTERN — List + Search (Archetype 4)
//
// Object Catalog: a searchable, filterable deep-sky object catalog with type
// filtering, row selection, and export action.
//
// Pattern: RoboPageShell + search toolbar + RoboDataTable
// No server required — mock data from @roboborealis/space-faker.
// ---------------------------------------------------------------------------

import * as React from 'react';
import { useState, useMemo } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { createColumnHelper } from '@tanstack/react-table';
import { Download, Sparkles } from 'lucide-react';
import { makeCatalog } from '@roboborealis/space-faker';
import type { DeepSkyObject } from '@roboborealis/space-faker';
import { RoboDataTable } from '@roboborealis/components/tables';
import { RoboPageShell } from '@roboborealis/components/layout';
import { RoboBadge, RoboButton, RoboInput } from '@roboborealis/components/core';
import { RoboSelect } from '@roboborealis/components/forms';


// ---------------------------------------------------------------------------
// Mock data — deterministic catalog of real deep-sky objects
// ---------------------------------------------------------------------------

const CATALOG: DeepSkyObject[] = makeCatalog(24, 42);

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

/** Format a light-year distance compactly (e.g. 2.5M ly, 4,100 ly). */
function formatDistance(ly: number): string {
  if (ly >= 1_000_000) return `${(ly / 1_000_000).toFixed(1)}M ly`;
  if (ly >= 1_000) return `${(ly / 1_000).toFixed(1)}k ly`;
  return `${ly} ly`;
}

// ---------------------------------------------------------------------------
// Columns
// ---------------------------------------------------------------------------

const col = createColumnHelper<DeepSkyObject>();

const columns = [
  col.accessor('designation', {
    header: 'Designation',
    size: 130,
    cell: (info) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Sparkles size={14} style={{ opacity: 0.4, flexShrink: 0 }} />
        <span style={{ fontWeight: 600, fontFamily: 'var(--font-mono, monospace)', fontSize: '0.8125rem' }}>
          {info.getValue()}
        </span>
      </div>
    ),
  }),
  col.accessor('commonName', {
    header: 'Common Name',
    size: 220,
    cell: (info) => <span style={{ fontWeight: 500 }}>{info.getValue()}</span>,
  }),
  col.accessor('type', {
    header: 'Type',
    size: 150,
    cell: (info) => <span style={{ fontSize: '0.8125rem' }}>{info.getValue()}</span>,
  }),
  col.accessor('constellation', {
    header: 'Constellation',
    size: 140,
    cell: (info) => <span style={{ fontSize: '0.8125rem' }}>{info.getValue()}</span>,
  }),
  col.accessor('magnitude', {
    header: 'Mag',
    size: 80,
    cell: (info) => (
      <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.8125rem' }}>
        {info.getValue().toFixed(1)}
      </span>
    ),
  }),
  col.accessor('distanceLy', {
    header: 'Distance',
    size: 110,
    cell: (info) => (
      <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.8125rem' }}>
        {formatDistance(info.getValue())}
      </span>
    ),
  }),
];

// ---------------------------------------------------------------------------
// Topbar stub
// ---------------------------------------------------------------------------

function CatalogTopbar() {
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
      <Sparkles size={18} style={{ opacity: 0.6 }} />
      <span style={{ fontWeight: 700, fontSize: 15 }}>Object Catalog</span>
      <RoboBadge variant='status' style={{ marginLeft: 4 }}>{CATALOG.length} objects</RoboBadge>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Pattern component
// ---------------------------------------------------------------------------

function ObjectCatalog() {
  const [search, setSearch]     = useState('');
  const [typeFilter, setType]   = useState('all');

  const filtered = useMemo(() =>
    CATALOG.filter((o) =>
      (typeFilter === 'all' || o.type === typeFilter) &&
      (search === '' ||
        o.commonName.toLowerCase().includes(search.toLowerCase()) ||
        o.designation.toLowerCase().includes(search.toLowerCase()))
    ), [search, typeFilter]);

  return (
    <RoboPageShell topbar={<CatalogTopbar />}>
      <div style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* Toolbar */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <RoboInput
            placeholder="Search by name or designation…"
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            style={{ width: 280 }}
          />
          <RoboSelect
            value={typeFilter}
            onValueChange={setType}
            options={TYPE_OPTIONS}
          />
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
            {filtered.length !== CATALOG.length && (
              <span style={{ fontSize: 12, opacity: 0.55 }}>
                {filtered.length} of {CATALOG.length}
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
          aria-label="Deep-sky object catalog"
          emptyState={
            <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--muted-foreground)', fontSize: 13 }}>
              No objects match the current filters.
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
  demonstrates: 'A sortable, filterable, searchable data table with an export action — the standard registry/list page, here a deep-sky object catalog.',
  whenToUse: 'Use as the reference for any full-page registry or inventory list where users search, filter by 1-3 dimensions, and optionally export results.',
  keywords: ['sortable table', 'filterable table', 'searchable table', 'registry', 'inventory', 'export list', 'catalog'],
  agentPriority: 'Prioritize this pattern over composing RoboDataTable from scratch whenever the feature request is a browsable list with search/filter, not a browse-then-inspect flow (use Object Explorer for that) or an edit flow (use Flows/Target List Editor for that).',
};

const meta: Meta = {
  title: 'Showcase/Patterns/Tables/Object Catalog',
  // patternMeta is a plain data export for generate-manifest.ts's regex
  // extraction, not a story — exclude it from Storybook's CSF story indexer.
  excludeStories: ['patternMeta'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '**Archetype 4 — List + Search Page.** ' +
          'A searchable, filterable deep-sky object catalog demonstrating the standard list page pattern: ' +
          'RoboPageShell shell, search + filter toolbar, and a RoboDataTable with sort, pagination, and row selection.\n\n' +
          '**Demonstrates:** ' + patternMeta.demonstrates + '\n\n' +
          '**Use in your app when:** ' + patternMeta.whenToUse + '\n\n' +
          '**Agent priority:** ' + patternMeta.agentPriority,
      },
    },
  },
};
export default meta;

type Story = StoryObj;

export const ObjectCatalogPattern: Story = {
  name: 'Object Catalog',
  render: () => <ObjectCatalog />,
};
