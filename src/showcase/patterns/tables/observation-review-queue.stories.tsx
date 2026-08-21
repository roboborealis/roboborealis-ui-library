import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { createColumnHelper } from '@tanstack/react-table';
import { RoboDataTable, createActionsCell, createAvatarCell, createDateCell, createStatusCell } from '@roboborealis/components/tables';


// ---------------------------------------------------------------------------
// Observation Review Queue — 100 submitted observations, inline edit for
// review status, bulk approve/reject.
// ---------------------------------------------------------------------------

interface ObservationReport {
  id: string;
  obsId: string;
  category: 'GAL' | 'NEB' | 'CLU' | 'DBL' | 'VAR';
  target: string;
  observer: string;
  submittedAt: string;
  reviewStatus: 'pending' | 'approved' | 'rejected' | 'under-review';
  reviewedBy?: string;
  reviewedAt?: string;
  notes: string;
}

const categories: ObservationReport['category'][] = ['GAL', 'NEB', 'CLU', 'DBL', 'VAR'];
const reviewStatuses: ObservationReport['reviewStatus'][] = ['pending', 'approved', 'rejected', 'under-review'];
const reviewers = ['V. Rubin', 'C. Chandra', 'N. Okonkwo', 'L. Tanaka', 'P. Anand'];
const targets = ['M31 — Andromeda', 'M42 — Orion Nebula', 'M13 — Hercules Cluster', 'Albireo', 'Algol'];

function generateReports(count: number): ObservationReport[] {
  return Array.from({ length: count }, (_, i) => {
    const status = reviewStatuses[i % 4];
    return {
      id: `obs-${i}`,
      obsId: `OBS-${String(20260000 + i)}`,
      category: categories[i % 5],
      target: targets[i % 5],
      observer: reviewers[i % 5],
      submittedAt: new Date(Date.now() - Math.random() * 86400000 * 60).toISOString(),
      reviewStatus: status,
      reviewedBy: status !== 'pending' ? reviewers[(i + 2) % 5] : undefined,
      reviewedAt: status !== 'pending' ? new Date(Date.now() - Math.random() * 86400000 * 7).toISOString() : undefined,
      notes: status === 'rejected' ? 'Missing calibration frames' : '',
    };
  });
}

const reportHelper = createColumnHelper<ObservationReport>();

const reportColumns = [
  reportHelper.accessor('obsId', { header: 'Observation ID', enableSorting: true }),
  reportHelper.accessor('category', {
    header: 'Category',
    cell: createStatusCell<ObservationReport>({
      colorMap: { GAL: 'primary', NEB: 'success', CLU: 'warning', DBL: 'destructive', VAR: 'default' },
    }),
    meta: { filterType: 'select' as const, filterOptions: categories.map((t) => ({ label: t, value: t })) },
  }),
  reportHelper.accessor('target', { header: 'Target', enableSorting: true }),
  reportHelper.accessor('observer', {
    header: 'Observer',
    cell: createAvatarCell<ObservationReport>({ nameAccessor: 'observer', size: 'xs' }),
  }),
  reportHelper.accessor('submittedAt', {
    header: 'Submitted',
    cell: createDateCell<ObservationReport>({ showRelative: true }),
    enableSorting: true,
  }),
  reportHelper.accessor('reviewStatus', {
    header: 'Review Status',
    cell: createStatusCell<ObservationReport>({
      colorMap: { pending: 'warning', approved: 'success', rejected: 'destructive', 'under-review': 'primary' },
      labelMap: { pending: 'Pending', approved: 'Approved', rejected: 'Rejected', 'under-review': 'Under Review' },
    }),
    meta: { filterType: 'select' as const, filterOptions: reviewStatuses.map((s) => ({ label: s.replace('-', ' ').replace(/\b\w/g, (c) => c.toUpperCase()), value: s })), editable: true },
  }),
  reportHelper.accessor('notes', {
    header: 'Notes',
    meta: { editable: true },
  }),
  reportHelper.display({
    id: 'actions',
    header: '',
    cell: createActionsCell<ObservationReport>({
      actions: [
        { id: 'view', label: 'View Observation', onAction: (r) => alert(`View: ${r.obsId}`) },
        { id: 'approve', label: 'Approve', onAction: (r) => alert(`Approve: ${r.obsId}`) },
        { id: 'reject', label: 'Reject', variant: 'destructive', onAction: (r) => alert(`Reject: ${r.obsId}`) },
      ],
    }),
  }),
];

export const patternMeta = {
  demonstrates: 'A hundred-row review queue with inline editing of review status on each row and a bulk-approve action across selected rows.',
  whenToUse: 'Use as the reference whenever a feature needs a review queue where rows can be approved individually or in bulk, with status changed inline in the table.',
  keywords: ['review queue', 'inline edit', 'bulk approve', 'review status', 'row selection action', 'observation review'],
  agentPriority: 'Prioritize this pattern over Observing Schedule whenever the feature needs inline row editing or bulk actions, not just filtering and browsing.',
};

const meta: Meta = {
  title: 'Showcase/Patterns/Tables/Observation Review Queue',
  excludeStories: ['patternMeta'],
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj;

export const ObservationReviewQueue: Story = {
  render: () => {
    const [data, setData] = React.useState(() => generateReports(100));

    const handleCellEdit = (rowId: string, columnId: string, value: unknown) => {
      setData((prev) =>
        prev.map((row) =>
          row.id === rowId ? { ...row, [columnId]: value } : row,
        ),
      );
    };

    return (
      <RoboDataTable
        data={data}
        columns={reportColumns}
        getRowId={(r) => r.id}
        enableSorting
        enableGlobalFilter
        enableColumnFilters
        enablePagination
        enableRowSelection
        enableMultiRowSelection
        pageSize={25}
        striped
        stickyHeader
        onCellEdit={handleCellEdit}
        bulkActions={[
          {
            id: 'approve',
            label: 'Approve Selected',
            onAction: (rows) => {
              setData((prev) =>
                prev.map((r) =>
                  rows.some((s) => s.id === r.id) ? { ...r, reviewStatus: 'approved' as const } : r,
                ),
              );
            },
          },
          {
            id: 'reject',
            label: 'Reject Selected',
            variant: 'destructive',
            onAction: (rows) => {
              setData((prev) =>
                prev.map((r) =>
                  rows.some((s) => s.id === r.id) ? { ...r, reviewStatus: 'rejected' as const } : r,
                ),
              );
            },
          },
        ]}
        aria-label="Observation Review Queue — 100 observations"
      />
    );
  },
};
