import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { createColumnHelper } from '@tanstack/react-table';
import { makeObservationHistory } from '@roboborealis/space-faker';
import type { Observation, ObservationSession } from '@roboborealis/space-faker';
import { RoboDataTable, createDateCell, createNumericCell, createStatusCell } from '@roboborealis/components/tables';


// ---------------------------------------------------------------------------
// Observing Run History — 200 observing runs with nested per-target
// observations (master-detail expandable rows).
// ---------------------------------------------------------------------------

const runHelper = createColumnHelper<ObservationSession>();
const obsHelper = createColumnHelper<Observation>();

const runColumns = [
  runHelper.accessor('runId', { header: 'Run #', enableSorting: true }),
  runHelper.accessor('observatory', { header: 'Observatory', enableSorting: true }),
  runHelper.accessor('observer', { header: 'Observer', enableSorting: true }),
  runHelper.accessor('status', {
    header: 'Status',
    cell: createStatusCell<ObservationSession>({
      colorMap: { complete: 'success', aborted: 'destructive', scheduled: 'primary', observing: 'warning' },
      labelMap: { complete: 'Complete', aborted: 'Aborted', scheduled: 'Scheduled', observing: 'Observing' },
    }),
  }),
  runHelper.accessor('transparency', { header: 'Transparency', enableSorting: true }),
  runHelper.accessor('date', {
    header: 'Date',
    cell: createDateCell<ObservationSession>({ formatOptions: { dateStyle: 'medium' } }),
    enableSorting: true,
  }),
  runHelper.accessor('targetCount', {
    header: 'Targets',
    cell: createNumericCell<ObservationSession>({}),
    meta: { align: 'right' as const },
  }),
];

const obsColumns = [
  obsHelper.accessor('target', { header: 'Target' }),
  obsHelper.accessor('targetType', { header: 'Type' }),
  obsHelper.accessor('instrument', { header: 'Instrument' }),
  obsHelper.accessor('seeing', {
    header: 'Seeing',
    cell: createNumericCell<Observation>({}),
    meta: { align: 'right' as const },
  }),
  obsHelper.accessor('limitingMagnitude', {
    header: 'Lim. Mag',
    cell: createNumericCell<Observation>({ formatOptions: { maximumFractionDigits: 1 } }),
    meta: { align: 'right' as const },
  }),
  obsHelper.accessor('startTime', {
    header: 'Started',
    cell: createDateCell<Observation>({ showRelative: true }),
  }),
  obsHelper.accessor('durationMin', {
    header: 'Duration',
    cell: createNumericCell<Observation>({ unit: 'min' }),
    meta: { align: 'right' as const },
  }),
];

export const patternMeta = {
  demonstrates: 'A two hundred-row observing-run history table with nested, expandable per-target observations, using standard date, status, and numeric cell renderers.',
  whenToUse: 'Use as the reference for a general-purpose nested master-detail table at larger row counts.',
  keywords: ['observing run history', 'nested observations', 'expandable table', 'large row count', 'date cell', 'status cell', 'master detail'],
  agentPriority: 'Prioritize this pattern when the feature needs a general nested master-detail table at scale, with a parent row expanding to reveal its child records.',
};

const meta: Meta = {
  title: 'Showcase/Patterns/Tables/Observing Run History',
  excludeStories: ['patternMeta'],
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj;

export const ObservingRunHistoryWithNestedObservations: Story = {
  render: () => {
    const data = React.useMemo(() => makeObservationHistory(200, 5), []);

    return (
      <RoboDataTable
        data={data}
        columns={runColumns}
        getRowId={(r) => r.id}
        enableSorting
        enableMultiSort
        enableGlobalFilter
        enablePagination
        enableExpanding
        pageSize={25}
        striped
        stickyHeader
        renderExpandedRow={(row) => {
          const run = row.original;
          if (run.observations.length === 0) {
            return (
              <div className="py-2 text-sm text-[var(--muted-foreground)]">
                No observations recorded.
              </div>
            );
          }
          return (
            <div className="pl-8">
              <p className="mb-2 text-xs font-medium text-[var(--muted-foreground)]">
                Observations ({run.observations.length} targets)
              </p>
              <RoboDataTable
                data={run.observations}
                columns={obsColumns}
                getRowId={(o) => o.id}
                bordered
                aria-label={`Observations for ${run.observatory} - ${run.runId}`}
              />
            </div>
          );
        }}
        aria-label="Observing Run History — 200 runs with nested observations"
      />
    );
  },
};
