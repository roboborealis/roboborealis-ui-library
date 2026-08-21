// =============================================================================
// TEMPLATE: ListSearchTemplate — Archetype 4 (List + Search)
//
// Pattern:  RoboPageShell + search/filter toolbar + RoboDataTable with row selection
// State:    Local useState for search + filters
// Use for:  Registry/inventory pages — searchable, filterable, exportable lists
//
// CONSUMER IMPORTS (use these in your app):
//   import { RoboDataTable, createStatusCell, createDateCell } from '@roboborealis/components/tables';
//   import { RoboPageShell } from '@roboborealis/components/layout';
//   import { RoboButton, RoboInput, RoboBadge } from '@roboborealis/components/core';
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
import { Download, List } from 'lucide-react';

import { RoboDataTable }     from '@/tables/data-table/robo-data-table';
import { createStatusCell } from '@/tables/data-table/cells/status-cell';
import { createDateCell }   from '@/tables/data-table/cells/date-cell';
import { RoboPageShell }     from '@/layout/page-shell/robo-page-shell';
import { RoboButton }        from '@/core/button/robo-button';
import { RoboInput }         from '@/core/input/robo-input';
import { RoboBadge }         from '@/core/badge/robo-badge';
import { RoboSelect }        from '@/forms/select/robo-select';

import { TemplateTopbar } from './_shared';

// ---------------------------------------------------------------------------
// TODO: Replace with your domain type and real data
// ---------------------------------------------------------------------------

type ItemStatus = 'active' | 'inactive' | 'pending' | 'archived';
type ItemType   = string; // TODO: replace with your type union

interface ListItem {
  id: string;
  name: string;
  type: ItemType;
  status: ItemStatus;
  owner: string;    // TODO: replace with a domain field
  updatedAt: Date;
}

// TODO: Replace with data from your API / tRPC query
const EXAMPLE_ITEMS: ListItem[] = [
  { id: 'i01', name: 'Item Alpha',   type: 'Type A', status: 'active',   owner: 'Team 1', updatedAt: new Date(Date.now() - 1_800_000) },
  { id: 'i02', name: 'Item Beta',    type: 'Type B', status: 'active',   owner: 'Team 2', updatedAt: new Date(Date.now() - 3_600_000) },
  { id: 'i03', name: 'Item Gamma',   type: 'Type A', status: 'inactive', owner: 'Team 1', updatedAt: new Date(Date.now() - 7_200_000) },
  { id: 'i04', name: 'Item Delta',   type: 'Type C', status: 'active',   owner: 'Team 3', updatedAt: new Date(Date.now() - 900_000) },
  { id: 'i05', name: 'Item Epsilon', type: 'Type B', status: 'archived', owner: 'Team 2', updatedAt: new Date(Date.now() - 14_400_000) },
  { id: 'i06', name: 'Item Zeta',    type: 'Type C', status: 'active',   owner: 'Team 1', updatedAt: new Date(Date.now() - 2_700_000) },
  { id: 'i07', name: 'Item Eta',     type: 'Type A', status: 'pending',  owner: 'Team 3', updatedAt: new Date(Date.now() - 86_400_000) },
  { id: 'i08', name: 'Item Theta',   type: 'Type B', status: 'inactive', owner: 'Team 2', updatedAt: new Date(Date.now() - 10_800_000) },
  { id: 'i09', name: 'Item Iota',    type: 'Type C', status: 'active',   owner: 'Team 1', updatedAt: new Date(Date.now() - 5_400_000) },
  { id: 'i10', name: 'Item Kappa',   type: 'Type A', status: 'active',   owner: 'Team 3', updatedAt: new Date(Date.now() - 600_000) },
  { id: 'i11', name: 'Item Lambda',  type: 'Type B', status: 'pending',  owner: 'Team 2', updatedAt: new Date(Date.now() - 1_200_000) },
  { id: 'i12', name: 'Item Mu',      type: 'Type C', status: 'active',   owner: 'Team 1', updatedAt: new Date(Date.now() - 4_500_000) },
];

const STATUS_COLOR_MAP: Record<ItemStatus, 'success' | 'warning' | 'default' | 'destructive'> = {
  active:   'success',
  pending:  'warning',
  inactive: 'default',
  archived: 'destructive',
};

// TODO: Replace with your actual status options
const STATUS_OPTIONS = [
  { value: 'all',      label: 'All statuses' },
  { value: 'active',   label: 'Active' },
  { value: 'pending',  label: 'Pending' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'archived', label: 'Archived' },
];

// TODO: Replace with your actual type options
const TYPE_OPTIONS = [
  { value: 'all',    label: 'All types' },
  { value: 'Type A', label: 'Type A' },
  { value: 'Type B', label: 'Type B' },
  { value: 'Type C', label: 'Type C' },
];

// ---------------------------------------------------------------------------
// Table columns — TODO: adapt headers and accessors to your domain type
// ---------------------------------------------------------------------------

const col = createColumnHelper<ListItem>();

const columns = [
  col.accessor('name', {
    header: 'Name',     // TODO
    size: 220,
    cell: (info) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <List size={14} style={{ opacity: 0.4, flexShrink: 0 }} />
        <span style={{ fontWeight: 500 }}>{info.getValue()}</span>
      </div>
    ),
  }),
  col.accessor('type', {
    header: 'Type',     // TODO
    size: 110,
    cell: (info) => <span style={{ fontSize: '0.8125rem' }}>{info.getValue()}</span>,
  }),
  col.accessor('status', {
    header: 'Status',
    size: 110,
    cell: createStatusCell({ colorMap: STATUS_COLOR_MAP }),
  }),
  col.accessor('owner', {
    header: 'Owner',    // TODO
    size: 120,
    cell: (info) => <span style={{ fontSize: '0.8125rem' }}>{info.getValue()}</span>,
  }),
  col.accessor('updatedAt', {
    header: 'Updated',
    size: 150,
    cell: createDateCell({ showRelative: true }),
  }),
];

// ---------------------------------------------------------------------------
// Topbar — TODO: replace with RoboTopbar or your app's real topbar
// ---------------------------------------------------------------------------

function ListTopbar({ count }: { count: number }) {
  return (
    <TemplateTopbar
      icon={<List size={18} />}
      label="Records"
      badge={<RoboBadge usage='status' style={{ marginLeft: 4 }}>{count} items</RoboBadge>}
    />
  );
}

// ---------------------------------------------------------------------------
// Template component
// ---------------------------------------------------------------------------

export function ListSearchTemplate() {
  const [search, setSearch]           = useState('');
  const [statusFilter, setStatus]     = useState('all');
  const [typeFilter, setType]         = useState('all');

  const filtered = useMemo(() =>
    EXAMPLE_ITEMS.filter((item) =>
      (statusFilter === 'all' || item.status === statusFilter) &&
      (typeFilter   === 'all' || item.type   === typeFilter) &&
      (search === '' || item.name.toLowerCase().includes(search.toLowerCase()))
    ), [search, statusFilter, typeFilter]);

  // TODO: Wire export to your CSV/PDF export logic
  function handleExport() {
    console.log('[ListSearchTemplate] Export triggered for', filtered.length, 'items');
  }

  return (
    <RoboPageShell topbar={<ListTopbar count={EXAMPLE_ITEMS.length} />}>
      <div style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* Toolbar */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          {/* TODO: Update placeholder text to match your searchable fields */}
          <RoboInput
            placeholder="Search by name…"
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            style={{ width: 280 }}
          />
          <RoboSelect value={statusFilter} onValueChange={setStatus} options={STATUS_OPTIONS} aria-label='Filter by status' />
          <RoboSelect value={typeFilter}   onValueChange={setType}   options={TYPE_OPTIONS} aria-label='Filter by type' />

          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
            {filtered.length !== EXAMPLE_ITEMS.length && (
              <span style={{ fontSize: 12, opacity: 0.55 }}>
                {filtered.length} of {EXAMPLE_ITEMS.length}
              </span>
            )}
            <RoboButton variant='secondary' size='sm' onClick={handleExport}>
              <Download size={14} style={{ marginRight: 6 }} />
              Export
            </RoboButton>
          </div>
        </div>

        {/* Table */}
        <RoboDataTable
          data={filtered}
          columns={columns as unknown as ColumnDef<ListItem, unknown>[]}
          getRowId={(row) => row.id}
          enableSorting
          enablePagination
          enableRowSelection
          pageSize={10}
          striped
          aria-label="Items list"    // TODO: Update aria-label
          emptyState={
            <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--muted-foreground)', fontSize: 13 }}>
              No items match the current filters.
            </div>
          }
        />
      </div>
    </RoboPageShell>
  );
}
