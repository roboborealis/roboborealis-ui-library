// =============================================================================
// TEMPLATE: FilterTableTemplate — Archetype 6 variant (Filter + Table, no detail pane)
//
// Pattern:  RoboPageShell + search/filter toolbar + RoboDataTable (no side pane)
// State:    Local useState for filters
// Use for:  Filtered record lists where selection drives an action (not a side pane) —
//           e.g. audit logs, submitted reports, transaction history
//
// CONSUMER IMPORTS (use these in your app):
//   import { RoboDataTable, createStatusCell, createDateCell } from '@roboborealis/components/tables';
//   import { RoboPageShell } from '@roboborealis/components/layout';
//   import { RoboBadge, RoboInput } from '@roboborealis/components/core';
//   import { RoboSelect } from '@roboborealis/components/forms';
// =============================================================================
//
// COPY-ADAPTABLE TEMPLATE — all TODO comments below are intentional injection
// points, not bugs or tech debt. Copy this file into your app and fill them in.
// See docs/agent-first-architecture.md for the copy-adapt workflow.
// =============================================================================

import * as React from 'react';
import { useState, useMemo } from 'react';
import { createColumnHelper, type ColumnDef } from '@tanstack/react-table';
import { FileText } from 'lucide-react';

import { RoboDataTable }     from '@/tables/data-table/robo-data-table';
import { createStatusCell } from '@/tables/data-table/cells/status-cell';
import { createDateCell }   from '@/tables/data-table/cells/date-cell';
import { RoboPageShell }     from '@/layout/page-shell/robo-page-shell';
import { RoboBadge }         from '@/core/badge/robo-badge';
import { RoboInput }         from '@/core/input/robo-input';
import type { SemanticColor } from '@/lib/types';
import { RoboSelect }        from '@/forms/select/robo-select';

import { TemplateTopbar } from './_shared';

// ---------------------------------------------------------------------------
// TODO: Replace with your domain type and real data
// ---------------------------------------------------------------------------

type EntryStatus = 'submitted' | 'active' | 'completed' | 'overdue' | 'cancelled';

interface Entry {
  id: string;
  ref: string;          // TODO: e.g. reference number, order ID
  name: string;
  category: string;
  region: string;       // TODO: replace with another dimension (e.g. department, team)
  submittedAt: Date;
  dueAt: Date;
  status: EntryStatus;
}

const NOW = Date.now();
const DAY = 86_400_000;

// TODO: Replace with data from your API / tRPC query
const EXAMPLE_ENTRIES: Entry[] = [
  { id: 'e01', ref: 'REF-2026-0041', name: 'Entry Alpha',   category: 'Category A', region: 'Region 1', submittedAt: new Date(NOW - 3 * DAY),  dueAt: new Date(NOW + 18 * DAY), status: 'active' },
  { id: 'e02', ref: 'REF-2026-0040', name: 'Entry Beta',    category: 'Category B', region: 'Region 2', submittedAt: new Date(NOW - 5 * DAY),  dueAt: new Date(NOW + 10 * DAY), status: 'active' },
  { id: 'e03', ref: 'REF-2026-0039', name: 'Entry Gamma',   category: 'Category A', region: 'Region 1', submittedAt: new Date(NOW - 14 * DAY), dueAt: new Date(NOW - DAY),      status: 'overdue' },
  { id: 'e04', ref: 'REF-2026-0038', name: 'Entry Delta',   category: 'Category C', region: 'Region 3', submittedAt: new Date(NOW - 8 * DAY),  dueAt: new Date(NOW + 6 * DAY),  status: 'active' },
  { id: 'e05', ref: 'REF-2026-0037', name: 'Entry Epsilon', category: 'Category B', region: 'Region 2', submittedAt: new Date(NOW - 6 * DAY),  dueAt: new Date(NOW + 2 * DAY),  status: 'active' },
  { id: 'e06', ref: 'REF-2026-0036', name: 'Entry Zeta',    category: 'Category C', region: 'Region 1', submittedAt: new Date(NOW - 2 * DAY),  dueAt: new Date(NOW + 14 * DAY), status: 'submitted' },
  { id: 'e07', ref: 'REF-2026-0035', name: 'Entry Eta',     category: 'Category A', region: 'Region 3', submittedAt: new Date(NOW - 20 * DAY), dueAt: new Date(NOW - 10 * DAY), status: 'completed' },
  { id: 'e08', ref: 'REF-2026-0034', name: 'Entry Theta',   category: 'Category B', region: 'Region 2', submittedAt: new Date(NOW - 9 * DAY),  dueAt: new Date(NOW + 3 * DAY),  status: 'active' },
  { id: 'e09', ref: 'REF-2026-0033', name: 'Entry Iota',    category: 'Category C', region: 'Region 1', submittedAt: new Date(NOW - 12 * DAY), dueAt: new Date(NOW - 2 * DAY),  status: 'completed' },
  { id: 'e10', ref: 'REF-2026-0032', name: 'Entry Kappa',   category: 'Category A', region: 'Region 3', submittedAt: new Date(NOW - DAY),      dueAt: new Date(NOW + 22 * DAY), status: 'submitted' },
  { id: 'e11', ref: 'REF-2026-0031', name: 'Entry Lambda',  category: 'Category B', region: 'Region 2', submittedAt: new Date(NOW - 7 * DAY),  dueAt: new Date(NOW + 4 * DAY),  status: 'active' },
  { id: 'e12', ref: 'REF-2026-0030', name: 'Entry Mu',      category: 'Category C', region: 'Region 1', submittedAt: new Date(NOW - 4 * DAY),  dueAt: new Date(NOW + 8 * DAY),  status: 'active' },
  { id: 'e13', ref: 'REF-2026-0029', name: 'Entry Nu',      category: 'Category A', region: 'Region 3', submittedAt: new Date(NOW - 16 * DAY), dueAt: new Date(NOW - 4 * DAY),  status: 'overdue' },
  { id: 'e14', ref: 'REF-2026-0028', name: 'Entry Xi',      category: 'Category B', region: 'Region 2', submittedAt: new Date(NOW - 11 * DAY), dueAt: new Date(NOW - 3 * DAY),  status: 'completed' },
  { id: 'e15', ref: 'REF-2026-0027', name: 'Entry Omicron', category: 'Category C', region: 'Region 1', submittedAt: new Date(NOW - DAY),      dueAt: new Date(NOW + 2 * DAY),  status: 'cancelled' },
];

type StatusColor = SemanticColor;

const STATUS_CONFIG: Record<EntryStatus, { label: string; color: StatusColor }> = {
  submitted: { label: 'Submitted', color: 'primary' },
  active:    { label: 'Active',    color: 'success' },
  completed: { label: 'Completed', color: 'default' },
  overdue:   { label: 'Overdue',   color: 'destructive' },
  cancelled: { label: 'Cancelled', color: 'default' },
};

const STATUS_COLOR_MAP = Object.fromEntries(
  Object.entries(STATUS_CONFIG).map(([k, v]) => [k, v.color]),
) as Record<string, StatusColor>;

const STATUS_LABEL_MAP = Object.fromEntries(
  Object.entries(STATUS_CONFIG).map(([k, v]) => [k, v.label]),
) as Record<string, string>;

// TODO: Replace with your actual filter options
const STATUS_OPTIONS = [
  { value: 'all',       label: 'All statuses' },
  { value: 'submitted', label: 'Submitted' },
  { value: 'active',    label: 'Active' },
  { value: 'completed', label: 'Completed' },
  { value: 'overdue',   label: 'Overdue' },
  { value: 'cancelled', label: 'Cancelled' },
];

const REGION_OPTIONS = [
  { value: 'all',      label: 'All regions' },   // TODO: rename to your dimension
  { value: 'Region 1', label: 'Region 1' },
  { value: 'Region 2', label: 'Region 2' },
  { value: 'Region 3', label: 'Region 3' },
];

// ---------------------------------------------------------------------------
// Table columns — TODO: adapt to your domain fields
// ---------------------------------------------------------------------------

const col = createColumnHelper<Entry>();

const columns = [
  col.accessor('ref', {
    header: 'Reference',   // TODO
    size: 130,
    cell: (info) => (
      <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.8125rem', fontWeight: 500 }}>
        {info.getValue()}
      </span>
    ),
  }),
  col.accessor('name', {
    header: 'Name',        // TODO
    size: 200,
    cell: (info) => <span style={{ fontWeight: 500 }}>{info.getValue()}</span>,
  }),
  col.accessor('category', {
    header: 'Category',    // TODO
    size: 120,
    cell: (info) => <span style={{ fontSize: '0.8125rem' }}>{info.getValue()}</span>,
  }),
  col.accessor('region', {
    header: 'Region',      // TODO
    size: 110,
    cell: (info) => <span style={{ fontSize: '0.8125rem' }}>{info.getValue()}</span>,
  }),
  col.accessor('submittedAt', {
    header: 'Submitted',   // TODO
    size: 150,
    cell: createDateCell({ formatOptions: { dateStyle: 'medium' }, showRelative: true }),
  }),
  col.accessor('dueAt', {
    header: 'Due',         // TODO
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
// Topbar — TODO: replace with RoboTopbar or your app's real topbar
// ---------------------------------------------------------------------------

function TableTopbar({ count }: { count: number }) {
  return (
    <TemplateTopbar
      icon={<FileText size={18} />}
      label="Records"
      badge={<RoboBadge usage='status' style={{ marginLeft: 4 }}>{count} entries</RoboBadge>}
    />
  );
}

// ---------------------------------------------------------------------------
// Template component
// ---------------------------------------------------------------------------

export function FilterTableTemplate() {
  const [search, setSearch]         = useState('');
  const [statusFilter, setStatus]   = useState('all');
  const [regionFilter, setRegion]   = useState('all');

  const filtered = useMemo(() =>
    EXAMPLE_ENTRIES.filter((e) =>
      (statusFilter === 'all' || e.status   === statusFilter) &&
      (regionFilter === 'all' || e.region   === regionFilter) &&
      (
        search === '' ||
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        e.ref.toLowerCase().includes(search.toLowerCase())
      )
    ), [search, statusFilter, regionFilter]);

  return (
    <RoboPageShell topbar={<TableTopbar count={EXAMPLE_ENTRIES.length} />}>
      <div style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* Toolbar */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          {/* TODO: Update placeholder and search fields */}
          <RoboInput
            placeholder="Search by name or reference…"
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            style={{ width: 280 }}
          />
          <RoboSelect value={statusFilter} onValueChange={setStatus} options={STATUS_OPTIONS} aria-label='Filter by status' />
          <RoboSelect value={regionFilter} onValueChange={setRegion} options={REGION_OPTIONS} aria-label='Filter by region' />
          {filtered.length !== EXAMPLE_ENTRIES.length && (
            <span style={{ marginLeft: 'auto', fontSize: 12, opacity: 0.55 }}>
              {filtered.length} of {EXAMPLE_ENTRIES.length}
            </span>
          )}
        </div>

        {/* Table */}
        <RoboDataTable
          data={filtered}
          columns={columns as unknown as ColumnDef<Entry, unknown>[]}
          getRowId={(r) => r.id}
          enableSorting
          enablePagination
          pageSize={10}
          striped
          aria-label="Entries list"   // TODO: Update aria-label
          emptyState={
            <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--muted-foreground)', fontSize: 13 }}>
              No entries match the current filters.
            </div>
          }
        />
      </div>
    </RoboPageShell>
  );
}
