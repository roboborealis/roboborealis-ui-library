// =============================================================================
// TEMPLATE: FilterTableDetailTemplate — Archetype 6 (Filter + Table + Detail)
//
// Pattern:  3-column flex — filter sidebar | results table | conditional detail pane
// State:    Local useState for filters + selectedId (no context needed)
// Use for:  Browse → inspect workflows with multi-criteria filtering
//
// CONSUMER IMPORTS (use these in your app):
//   import { RoboDataTable, createStatusCell, createDateCell } from '@roboborealis/components/tables';
//   import { RoboCard, RoboCardHeader, RoboCardBody, RoboBadge,
//            RoboInput, RoboSeparator } from '@roboborealis/components/core';
//   import { RoboSelect } from '@roboborealis/components/forms';
// =============================================================================
//
// COPY-ADAPTABLE TEMPLATE — all TODO comments below are intentional injection
// points, not bugs or tech debt. Copy this file into your app and fill them in.
// See docs/agent-first-architecture.md for the copy-adapt workflow.
// =============================================================================

import * as React from 'react';
import { useState, useMemo } from 'react';
import { createColumnHelper, type RowSelectionState, type ColumnDef } from '@tanstack/react-table';
import { Search } from 'lucide-react';

import { RoboDataTable }     from '@/tables/data-table/robo-data-table';
import { createStatusCell } from '@/tables/data-table/cells/status-cell';
import { createDateCell }   from '@/tables/data-table/cells/date-cell';
import { RoboCard, RoboCardBody, RoboCardHeader } from '@/core/card/robo-card';
import { RoboBadge }         from '@/core/badge/robo-badge';
import { RoboSeparator }     from '@/core/separator/robo-separator';
import { RoboInput }         from '@/core/input/robo-input';
import { RoboSelect }        from '@/forms/select/robo-select';

// ---------------------------------------------------------------------------
// TODO: Replace with your domain type
// ---------------------------------------------------------------------------

type RecordStatus = 'active' | 'inactive' | 'pending' | 'archived';
type RecordCategory = string; // TODO: replace with your category union type

interface DataRecord {
  id: string;
  name: string;
  category: RecordCategory;
  status: RecordStatus;
  metadata1: string; // TODO: replace with a domain field (e.g. location, owner, type)
  metadata2: string; // TODO: replace with another domain field
  updatedAt: Date;
  details: string;   // TODO: replace with rich detail content
}

// TODO: Replace with real data from your API / tRPC query
const EXAMPLE_RECORDS: DataRecord[] = [
  { id: 'r01', name: 'Record Alpha',   category: 'Category A', status: 'active',   metadata1: 'Region 1', metadata2: 'Tag X', updatedAt: new Date(Date.now() - 1_800_000),  details: 'Detail text for Record Alpha.'   },
  { id: 'r02', name: 'Record Beta',    category: 'Category B', status: 'pending',  metadata1: 'Region 2', metadata2: 'Tag Y', updatedAt: new Date(Date.now() - 3_600_000),  details: 'Detail text for Record Beta.'    },
  { id: 'r03', name: 'Record Gamma',   category: 'Category A', status: 'inactive', metadata1: 'Region 1', metadata2: 'Tag Z', updatedAt: new Date(Date.now() - 7_200_000),  details: 'Detail text for Record Gamma.'   },
  { id: 'r04', name: 'Record Delta',   category: 'Category C', status: 'active',   metadata1: 'Region 3', metadata2: 'Tag X', updatedAt: new Date(Date.now() - 900_000),   details: 'Detail text for Record Delta.'   },
  { id: 'r05', name: 'Record Epsilon', category: 'Category B', status: 'archived', metadata1: 'Region 2', metadata2: 'Tag Y', updatedAt: new Date(Date.now() - 14_400_000), details: 'Detail text for Record Epsilon.' },
  { id: 'r06', name: 'Record Zeta',    category: 'Category C', status: 'active',   metadata1: 'Region 1', metadata2: 'Tag Z', updatedAt: new Date(Date.now() - 2_700_000),  details: 'Detail text for Record Zeta.'    },
  { id: 'r07', name: 'Record Eta',     category: 'Category A', status: 'pending',  metadata1: 'Region 3', metadata2: 'Tag X', updatedAt: new Date(Date.now() - 86_400_000), details: 'Detail text for Record Eta.'     },
  { id: 'r08', name: 'Record Theta',   category: 'Category B', status: 'inactive', metadata1: 'Region 2', metadata2: 'Tag Y', updatedAt: new Date(Date.now() - 10_800_000), details: 'Detail text for Record Theta.'   },
];

const STATUS_COLOR_MAP: Record<RecordStatus, 'success' | 'warning' | 'default' | 'destructive'> = {
  active:   'success',
  pending:  'warning',
  inactive: 'default',
  archived: 'destructive',
};

// TODO: Populate from your data (unique values or hardcoded options)
const CATEGORY_OPTIONS = [
  { value: 'all', label: 'All categories' },
  { value: 'Category A', label: 'Category A' },
  { value: 'Category B', label: 'Category B' },
  { value: 'Category C', label: 'Category C' },
];

const STATUS_OPTIONS = [
  { value: 'all',      label: 'All statuses' },
  { value: 'active',   label: 'Active' },
  { value: 'pending',  label: 'Pending' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'archived', label: 'Archived' },
];

// ---------------------------------------------------------------------------
// Table columns — TODO: adapt headers and accessors to your domain type
// ---------------------------------------------------------------------------

const col = createColumnHelper<DataRecord>();

const columns = [
  col.accessor('name', {
    header: 'Name',
    size: 200,
    cell: (info) => <span style={{ fontWeight: 500 }}>{info.getValue()}</span>,
  }),
  col.accessor('category', {
    header: 'Category',
    size: 120,
    cell: (info) => <span style={{ fontSize: '0.8125rem' }}>{info.getValue()}</span>,
  }),
  col.accessor('status', {
    header: 'Status',
    size: 100,
    cell: createStatusCell({ colorMap: STATUS_COLOR_MAP }),
  }),
  col.accessor('updatedAt', {
    header: 'Updated',
    size: 130,
    cell: createDateCell({ showRelative: true }),
  }),
];

// ---------------------------------------------------------------------------
// Detail pane helper
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
// Template component
// ---------------------------------------------------------------------------

export function FilterTableDetailTemplate() {
  const [search, setSearch]             = useState('');
  const [categoryFilter, setCategory]   = useState('all');
  const [statusFilter, setStatus]       = useState('all');
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const filtered = useMemo(() =>
    EXAMPLE_RECORDS.filter((r) =>
      (categoryFilter === 'all' || r.category === categoryFilter) &&
      (statusFilter   === 'all' || r.status   === statusFilter) &&
      (search === '' || r.name.toLowerCase().includes(search.toLowerCase()))
    ), [search, categoryFilter, statusFilter]);

  const selectedId = Object.keys(rowSelection).find((k) => rowSelection[k]) ?? null;
  const selected   = EXAMPLE_RECORDS.find((r) => r.id === selectedId) ?? null;

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
        id='filter-table-detail-filters'
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
        {/* TODO: Replace title with your page/section name */}
        <p style={{ margin: 0, fontWeight: 700, fontSize: 14 }}>Browse Records</p>

        <div>
          <p style={filterLabel}>Search</p>
          <div style={{ position: 'relative' }}>
            <Search size={13} style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', opacity: 0.4, pointerEvents: 'none' }} />
            <RoboInput
              placeholder="Search by name…"
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
              style={{ paddingLeft: 28 }}
            />
          </div>
        </div>

        {/* TODO: Add or remove filter selects to match your domain's filter dimensions */}
        <div>
          <p style={filterLabel}>Category</p>
          <RoboSelect value={categoryFilter} onValueChange={setCategory} options={CATEGORY_OPTIONS} aria-label='Filter by category' />
        </div>

        <div>
          <p style={filterLabel}>Status</p>
          <RoboSelect value={statusFilter} onValueChange={setStatus} options={STATUS_OPTIONS} aria-label='Filter by status' />
        </div>

        <RoboSeparator />
        <p style={{ margin: 0, fontSize: 12, opacity: 0.45 }}>
          {filtered.length} of {EXAMPLE_RECORDS.length} records
        </p>
      </aside>

      {/* ── Center: results table ── */}
      <div id='filter-table-detail-table' style={{ flex: 1, overflow: 'auto', padding: 16 }}>
        <RoboDataTable
          data={filtered}
          columns={columns as unknown as ColumnDef<DataRecord, unknown>[]}
          getRowId={(r) => r.id}
          enableSorting
          enablePagination
          enableRowSelection
          enableMultiRowSelection={false}
          rowSelection={rowSelection}
          onRowSelectionChange={setRowSelection}
          pageSize={10}
          aria-label="Records list"  // TODO: Update aria-label
          emptyState={
            <div style={{ padding: '32px 0', textAlign: 'center', color: 'var(--muted-foreground)', fontSize: 13 }}>
              No records match the current filters.
            </div>
          }
        />
      </div>

      {/* ── Right: detail pane — only rendered when a row is selected ── */}
      {selected && (
        <aside
          style={{
            width: 280,
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
                {/* TODO: Replace with your record's primary identifier display */}
                <div style={{ fontWeight: 700, fontSize: 14 }}>{selected.name}</div>
                <RoboBadge usage='label' color={STATUS_COLOR_MAP[selected.status]}>
                  {selected.status}
                </RoboBadge>
              </div>
            </RoboCardHeader>
            <RoboCardBody>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {/* TODO: Replace these rows with your domain's detail fields */}
                <DetailRow label="Category"  value={selected.category} />
                <DetailRow label="Field 1"   value={selected.metadata1} />
                <DetailRow label="Field 2"   value={selected.metadata2} />
                <RoboSeparator style={{ margin: '6px 0' }} />
                <DetailRow label="Details"   value={selected.details} />
                <DetailRow label="Updated"   value={selected.updatedAt.toLocaleDateString()} />
              </div>
            </RoboCardBody>
          </RoboCard>
        </aside>
      )}

    </div>
  );
}
