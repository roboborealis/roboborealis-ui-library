import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { createColumnHelper } from '@tanstack/react-table';
import { RoboDataTable, createActionsCell, createAvatarCell, createDateCell, createStatusCell } from '@roboborealis/components/tables';


// ---------------------------------------------------------------------------
// Report Audit Log — 100 reports, inline edit for review status, bulk approve
// ---------------------------------------------------------------------------

interface AuditReport {
  id: string;
  reportId: string;
  type: 'FP' | 'PR' | 'DR' | 'FR' | 'CDM';
  satellite: string;
  submittedBy: string;
  submittedAt: string;
  reviewStatus: 'pending' | 'approved' | 'rejected' | 'under-review';
  reviewedBy?: string;
  reviewedAt?: string;
  notes: string;
}

const reportTypes: AuditReport['type'][] = ['FP', 'PR', 'DR', 'FR', 'CDM'];
const reviewStatuses: AuditReport['reviewStatus'][] = ['pending', 'approved', 'rejected', 'under-review'];
const reviewers = ['J. Carter', 'S. Chen', 'M. Torres', 'L. Park', 'D. Okonkwo'];
const satellites = ['Vega Sentinel', 'Rigel Probe', 'Lyra Pioneer', 'Orion Voyager', 'Andromeda Explorer'];

function generateReports(count: number): AuditReport[] {
  return Array.from({ length: count }, (_, i) => {
    const status = reviewStatuses[i % 4];
    return {
      id: `rpt-${i}`,
      reportId: `RPT-${String(20260000 + i)}`,
      type: reportTypes[i % 5],
      satellite: satellites[i % 5],
      submittedBy: reviewers[i % 5],
      submittedAt: new Date(Date.now() - Math.random() * 86400000 * 60).toISOString(),
      reviewStatus: status,
      reviewedBy: status !== 'pending' ? reviewers[(i + 2) % 5] : undefined,
      reviewedAt: status !== 'pending' ? new Date(Date.now() - Math.random() * 86400000 * 7).toISOString() : undefined,
      notes: status === 'rejected' ? 'Missing required fields' : '',
    };
  });
}

const reportHelper = createColumnHelper<AuditReport>();

const reportColumns = [
  reportHelper.accessor('reportId', { header: 'Report ID', enableSorting: true }),
  reportHelper.accessor('type', {
    header: 'Type',
    cell: createStatusCell<AuditReport>({
      colorMap: { FP: 'primary', PR: 'success', DR: 'warning', FR: 'destructive', CDM: 'default' },
    }),
    meta: { filterType: 'select' as const, filterOptions: reportTypes.map((t) => ({ label: t, value: t })) },
  }),
  reportHelper.accessor('satellite', { header: 'Satellite', enableSorting: true }),
  reportHelper.accessor('submittedBy', {
    header: 'Submitted By',
    cell: createAvatarCell<AuditReport>({ nameAccessor: 'submittedBy', size: 'xs' }),
  }),
  reportHelper.accessor('submittedAt', {
    header: 'Submitted',
    cell: createDateCell<AuditReport>({ showRelative: true }),
    enableSorting: true,
  }),
  reportHelper.accessor('reviewStatus', {
    header: 'Review Status',
    cell: createStatusCell<AuditReport>({
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
    cell: createActionsCell<AuditReport>({
      actions: [
        { id: 'view', label: 'View Report', onAction: (r) => alert(`View: ${r.reportId}`) },
        { id: 'approve', label: 'Approve', onAction: (r) => alert(`Approve: ${r.reportId}`) },
        { id: 'reject', label: 'Reject', variant: 'destructive', onAction: (r) => alert(`Reject: ${r.reportId}`) },
      ],
    }),
  }),
];

export const patternMeta = {
  demonstrates: 'A hundred-row audit log with inline editing of review status on each row and a bulk-approve action across selected rows.',
  whenToUse: 'Use as the reference whenever a feature needs a review queue where rows can be approved individually or in bulk, with status changed inline in the table.',
  keywords: ['audit log', 'inline edit', 'bulk approve', 'review status', 'row selection action'],
  agentPriority: 'Prioritize this pattern over Flight Plan Reports whenever the feature needs inline row editing or bulk actions, not just filtering and browsing.',
};

const meta: Meta = {
  title: 'Showcase/Patterns/Tables/Report Audit Log',
  excludeStories: ['patternMeta'],
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj;

export const ReportAuditLog: Story = {
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
        aria-label="Report Audit Log — 100 reports"
      />
    );
  },
};
