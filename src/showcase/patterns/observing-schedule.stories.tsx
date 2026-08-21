// ---------------------------------------------------------------------------
// SHOWCASE PATTERN — Filter + Table (Archetype 4 variant)
//
// Observing Schedule: a searchable, filterable list of scheduled observing
// runs across observatories. Simpler than the 3-column Object Explorer
// pattern — no detail pane, just a toolbar above RoboDataTable.
//
// Pattern: RoboPageShell + search/filter toolbar + RoboDataTable
// State: local useState for filters (no context needed)
// ---------------------------------------------------------------------------

import * as React from 'react';
import { useState, useMemo } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { createColumnHelper } from '@tanstack/react-table';
import { CalendarClock } from 'lucide-react';
import { makeObservingSchedule } from '@roboborealis/space-faker';
import type { ObservationSession } from '@roboborealis/space-faker';
import { RoboDataTable, createDateCell, createStatusCell } from '@roboborealis/components/tables';
import { RoboPageShell } from '@roboborealis/components/layout';
import { RoboBadge, RoboInput } from '@roboborealis/components/core';
import { RoboSelect } from '@roboborealis/components/forms';


// ---------------------------------------------------------------------------
// Types & mock data
// ---------------------------------------------------------------------------

type ScheduleRow = ObservationSession & { scheduledAt: Date };

const SCHEDULE: ScheduleRow[] = makeObservingSchedule(15, 7).map((s) => ({
  ...s,
  scheduledAt: new Date(s.date),
}));

const STATUS_COLOR_MAP: Record<ObservationSession['status'], 'primary' | 'success' | 'muted' | 'destructive'> = {
  scheduled: 'primary',
  observing: 'success',
  complete:  'muted',
  aborted:   'destructive',
};

const STATUS_LABEL_MAP: Record<ObservationSession['status'], string> = {
  scheduled: 'Scheduled',
  observing: 'Observing',
  complete:  'Complete',
  aborted:   'Aborted',
};

const PRIORITY_COLOR: Record<ObservationSession['priority'], string> = {
  high:   'var(--destructive, #ef4444)',
  medium: 'var(--warning, #f59e0b)',
  low:    'var(--muted-foreground, #94a3b8)',
};

// ---------------------------------------------------------------------------
// Filter options
// ---------------------------------------------------------------------------

const STATUS_OPTIONS = [
  { value: 'all',       label: 'All statuses' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'observing', label: 'Observing' },
  { value: 'complete',  label: 'Complete' },
  { value: 'aborted',   label: 'Aborted' },
];

const TRANSPARENCY_OPTIONS = [
  { value: 'all',       label: 'All transparency' },
  { value: 'Excellent', label: 'Excellent' },
  { value: 'Good',      label: 'Good' },
  { value: 'Fair',      label: 'Fair' },
  { value: 'Poor',      label: 'Poor' },
];

// ---------------------------------------------------------------------------
// Table columns
// ---------------------------------------------------------------------------

const col = createColumnHelper<ScheduleRow>();

const columns = [
  col.accessor('runId', {
    header: 'Run',
    size: 120,
    cell: (info) => (
      <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.8125rem', fontWeight: 500 }}>
        {info.getValue()}
      </span>
    ),
  }),
  col.accessor('observatory', {
    header: 'Observatory',
    size: 200,
    cell: (info) => <span style={{ fontWeight: 500 }}>{info.getValue()}</span>,
  }),
  col.accessor('observer', {
    header: 'Observer',
    size: 160,
    cell: (info) => <span style={{ fontSize: '0.8125rem' }}>{info.getValue()}</span>,
  }),
  col.accessor('targetCount', {
    header: 'Targets',
    size: 90,
    cell: (info) => (
      <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.8125rem' }}>
        {info.getValue()}
      </span>
    ),
  }),
  col.accessor('transparency', {
    header: 'Transparency',
    size: 120,
    cell: (info) => <span style={{ fontSize: '0.8125rem' }}>{info.getValue()}</span>,
  }),
  col.accessor('priority', {
    header: 'Priority',
    size: 100,
    cell: (info) => (
      <span style={{ fontSize: '0.8125rem', fontWeight: 600, textTransform: 'capitalize', color: PRIORITY_COLOR[info.getValue()] }}>
        {info.getValue()}
      </span>
    ),
  }),
  col.accessor('scheduledAt', {
    header: 'Scheduled',
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

function ScheduleTopbar() {
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
      <CalendarClock size={18} style={{ opacity: 0.6 }} />
      <span style={{ fontWeight: 700, fontSize: 15 }}>Observing Schedule</span>
      <RoboBadge variant='status' style={{ marginLeft: 4 }}>{SCHEDULE.length} runs</RoboBadge>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Pattern component
// ---------------------------------------------------------------------------

function ObservingSchedule() {
  const [search, setSearch]                 = useState('');
  const [statusFilter, setStatus]           = useState('all');
  const [transparencyFilter, setTransparency] = useState('all');

  const filtered = useMemo(() =>
    SCHEDULE.filter((r) =>
      (statusFilter === 'all' || r.status === statusFilter) &&
      (transparencyFilter === 'all' || r.transparency === transparencyFilter) &&
      (
        search === '' ||
        r.observatory.toLowerCase().includes(search.toLowerCase()) ||
        r.observer.toLowerCase().includes(search.toLowerCase()) ||
        r.runId.toLowerCase().includes(search.toLowerCase())
      )
    ), [search, statusFilter, transparencyFilter]);

  return (
    <RoboPageShell topbar={<ScheduleTopbar />}>
      <div style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* Toolbar */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <RoboInput
            placeholder="Search observatory, observer, or run…"
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
            value={transparencyFilter}
            onValueChange={setTransparency}
            options={TRANSPARENCY_OPTIONS}
          />
          {filtered.length !== SCHEDULE.length && (
            <span style={{ marginLeft: 'auto', fontSize: 12, opacity: 0.55 }}>
              {filtered.length} of {SCHEDULE.length}
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
          aria-label="Observing schedule"
          emptyState={
            <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--muted-foreground)', fontSize: 13 }}>
              No runs match the current filters.
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
  whenToUse: 'Use as the reference for a filtered schedule or log-style list where clicking a row would navigate to a separate page rather than opening an inline detail pane.',
  keywords: ['filter table', 'observing schedule', 'schedule', 'filtered list', 'report log', 'toolbar above table'],
  agentPriority: 'This is the canonical storyPath for the filter-table archetype in src/agent/archetypes.ts, and the middle case of three closely related Tables patterns. Prefer Object Catalog (list-search archetype) when the feature also needs an export action and reads as a registry or inventory; prefer this pattern when the feature is a filtered schedule or log with no export emphasis and no detail pane; prefer Object Explorer (filter-table-detail archetype) as soon as the feature needs a side panel showing full details for a selected row.',
};

const meta: Meta = {
  title: 'Showcase/Patterns/Tables/Observing Schedule',
  excludeStories: ['patternMeta'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '**Filter + Table.** ' +
          'A searchable, filterable list of scheduled observing runs across observatories. ' +
          'Simpler variant of the Filter + Table + Detail archetype — no side panel, just a compact toolbar ' +
          '(search + status + transparency) above a RoboDataTable with sorting and pagination.',
      },
    },
  },
};
export default meta;

type Story = StoryObj;

export const ObservingSchedulePattern: Story = {
  name: 'Observing Schedule',
  render: () => <ObservingSchedule />,
};
