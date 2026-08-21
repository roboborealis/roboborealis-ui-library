// ---------------------------------------------------------------------------
// @roboborealis/tables — Overview stories
//
// One page, both canonical table families in collapsible sections:
//   1. RoboTable      — static, zero-dependency, read-only (shown first)
//   2. RoboDataTable  — TanStack v8 interactive grid
//
// Uses the shared OverviewAccordion layout (type="multiple", all groups open by
// default) so each family can be collapsed independently. This accordion-per-
// section layout is the standard shape for "Overview" showcase stories.
// ---------------------------------------------------------------------------

import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { createColumnHelper } from '@tanstack/react-table';

import {
  RoboTable,
  RoboTableHeader,
  RoboTableBody,
  RoboTableFooter,
  RoboTableRow,
  RoboTableHead,
  RoboTableCell,
  RoboTableCaption,
} from './table/robo-table';
import { RoboDataTable } from './data-table/robo-data-table';
import { RoboEmailTable } from './table/robo-email-table';
import { OverviewAccordion, OverviewGroup, OverviewSection } from '../lib/storybook/overview-layout';

// ---------------------------------------------------------------------------
// Mock data — satellite records
// ---------------------------------------------------------------------------

interface SatelliteRow {
  id: string;
  satellite: string;
  type: string;
  flag: string;
  status: string;
  lastSeen: string;
  reports: number;
}

const satelliteData: SatelliteRow[] = [
  { id: '1', satellite: 'Voyager 1',     type: 'Probe',           flag: 'NASA', status: 'Active',   lastSeen: '2 min ago',  reports: 142 },
  { id: '2', satellite: 'Cassini',       type: 'Orbiter',         flag: 'ESA',  status: 'Docked',   lastSeen: '14 min ago', reports: 87  },
  { id: '3', satellite: 'Hubble',        type: 'Telescope',       flag: 'NASA', status: 'Active',   lastSeen: '1 hr ago',   reports: 231 },
  { id: '4', satellite: 'Kepler',        type: 'CubeSat',         flag: 'CSA',  status: 'Inactive', lastSeen: '3 hr ago',   reports: 12  },
  { id: '5', satellite: 'Artemis I',     type: 'Crew Capsule',    flag: 'NASA', status: 'Active',   lastSeen: '5 min ago',  reports: 56  },
  { id: '6', satellite: 'New Horizons',  type: 'Probe',           flag: 'ESA',  status: 'Active',   lastSeen: '8 min ago',  reports: 34  },
  { id: '7', satellite: 'Dawn',          type: 'Cargo Freighter', flag: 'JAXA', status: 'Docked',   lastSeen: '2 hr ago',   reports: 198 },
];

const totalReports = satelliteData.reduce((sum, v) => sum + v.reports, 0);

const columnHelper = createColumnHelper<SatelliteRow>();

const satelliteColumns = [
  columnHelper.accessor('satellite', { header: 'Satellite Name', enableSorting: true, size: 200 }),
  columnHelper.accessor('type', { header: 'Type', enableSorting: true }),
  columnHelper.accessor('flag', { header: 'Operator', enableSorting: true }),
  columnHelper.accessor('status', { header: 'Status', enableSorting: true }),
  columnHelper.accessor('lastSeen', { header: 'Last Seen' }),
  columnHelper.accessor('reports', { header: 'Reports', enableSorting: true, meta: { align: 'right' as const } }),
];

// ---------------------------------------------------------------------------
// RoboTable — static compound-component helper
// ---------------------------------------------------------------------------

function StaticSatelliteTable({
  variant,
  caption,
  withFooter,
}: {
  variant?: 'default' | 'striped' | 'bordered';
  caption?: string;
  withFooter?: boolean;
}) {
  return (
    <RoboTable variant={variant}>
      {caption && <RoboTableCaption>{caption}</RoboTableCaption>}
      <RoboTableHeader>
        <RoboTableRow>
          <RoboTableHead>Satellite Name</RoboTableHead>
          <RoboTableHead>Type</RoboTableHead>
          <RoboTableHead>Operator</RoboTableHead>
          <RoboTableHead>Status</RoboTableHead>
          <RoboTableHead className="text-right">Reports</RoboTableHead>
        </RoboTableRow>
      </RoboTableHeader>
      <RoboTableBody>
        {satelliteData.map((v) => (
          <RoboTableRow key={v.id}>
            <RoboTableCell>{v.satellite}</RoboTableCell>
            <RoboTableCell>{v.type}</RoboTableCell>
            <RoboTableCell>{v.flag}</RoboTableCell>
            <RoboTableCell>{v.status}</RoboTableCell>
            <RoboTableCell className="text-right tabular-nums">{v.reports}</RoboTableCell>
          </RoboTableRow>
        ))}
      </RoboTableBody>
      {withFooter && (
        <RoboTableFooter>
          <RoboTableRow>
            <RoboTableCell colSpan={4}>Total reports</RoboTableCell>
            <RoboTableCell className="text-right tabular-nums">{totalReports}</RoboTableCell>
          </RoboTableRow>
        </RoboTableFooter>
      )}
    </RoboTable>
  );
}

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta: Meta = {
  title: 'Data/Tables',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story:
          'Both canonical table families on one page, each in a collapsible section. RoboTable ' +
          '(static, zero-dependency) first, then RoboDataTable (TanStack Table v8 — sorting, ' +
          'pagination, loading/empty/error states).',
      },
    },
  },
};
export default meta;

type Story = StoryObj;

// ---------------------------------------------------------------------------
// Overview — every variant on one page, grouped into collapsible sections
// ---------------------------------------------------------------------------

export const Overview: Story = {
  name: 'Tables Overview',
  render: () => (
    <OverviewAccordion>

      {/* ================================================================
          GROUP 1 — RoboTable (static)
          ================================================================ */}
      <OverviewGroup
        value="robo-table"
        title="RoboTable — static"
        description={
          <>
            <strong>Zero-dependency</strong>, <strong>read-only</strong>,{' '}
            <strong>server-renderable</strong>. Use for report bodies, print views, and
            small static tables. No sorting/filtering/pagination — that is RoboDataTable.
          </>
        }
      >
        <OverviewSection title="Default" description="Plain semantic table with token styling and density-aware padding.">
          <StaticSatelliteTable />
        </OverviewSection>

        <OverviewSection title="Striped" description="Alternating row backgrounds for easier row tracking.">
          <StaticSatelliteTable variant="striped" />
        </OverviewSection>

        <OverviewSection title="Bordered" description="Full cell borders for dense, spreadsheet-style data.">
          <StaticSatelliteTable variant="bordered" />
        </OverviewSection>

        <OverviewSection title="With Caption + Footer" description="Screen-reader caption above; a totals footer row below.">
          <StaticSatelliteTable
            variant="striped"
            caption="Active constellation — report counts by satellite"
            withFooter
          />
        </OverviewSection>
      </OverviewGroup>

      {/* ================================================================
          GROUP 2 — RoboDataTable (interactive)
          ================================================================ */}
      <OverviewGroup
        value="robo-data-table"
        title="RoboDataTable — interactive"
        description={
          <>
            <strong>TanStack Table v8</strong> powered. Opt into <strong>sorting</strong>,{' '}
            <strong>filtering</strong>, <strong>pagination</strong>, <strong>selection</strong>,
            column ops, expansion, and inline editing via feature flags.
          </>
        }
      >
        <OverviewSection
          title="Read-Only"
          description="Simplest table — no sorting, no selection, no pagination. Just data."
        >
          <RoboDataTable
            data={satelliteData}
            columns={satelliteColumns}
            getRowId={(row) => row.id}
            aria-label="Read-only satellite table"
          />
        </OverviewSection>

        <OverviewSection
          title="Row Selection"
          description="Checkbox column for selecting rows. Combine with bulk actions."
        >
          <RoboDataTable
            data={satelliteData}
            columns={satelliteColumns}
            getRowId={(row) => row.id}
            enableRowSelection
            aria-label="Selectable satellite table"
          />
        </OverviewSection>

        <OverviewSection
          title="Sortable + Column Reordering"
          description="Click column headers to sort (Shift+click for multi-sort). Drag grip handles to reorder columns."
        >
          <RoboDataTable
            data={satelliteData}
            columns={satelliteColumns}
            getRowId={(row) => row.id}
            enableSorting
            enableColumnReordering
            aria-label="Sortable satellite table"
          />
        </OverviewSection>

        <OverviewSection
          title="Sortable + Pagination"
          description="Client-side pagination with a page-size selector. Combine with sorting."
        >
          <RoboDataTable
            data={satelliteData}
            columns={satelliteColumns}
            getRowId={(row) => row.id}
            enableSorting
            enablePagination
            pageSize={5}
            aria-label="Paginated satellite table"
          />
        </OverviewSection>

        <OverviewSection
          title="Striped + Bordered"
          description="Alternating row colors and cell borders for dense data views."
        >
          <RoboDataTable
            data={satelliteData}
            columns={satelliteColumns}
            getRowId={(row) => row.id}
            enableSorting
            striped
            bordered
            aria-label="Striped bordered satellite table"
          />
        </OverviewSection>

        <OverviewSection
          title="Loading State"
          description="Skeleton rows shown during initial data fetch. Density-aware row heights."
        >
          <RoboDataTable
            data={[]}
            columns={satelliteColumns}
            isLoading
            aria-label="Loading satellite data"
          />
        </OverviewSection>

        <OverviewSection
          title="Empty State"
          description="No data rows match the current query or filter criteria."
        >
          <RoboDataTable
            data={[]}
            columns={satelliteColumns}
            emptyState={<span>No satellite reports found for the selected criteria.</span>}
            aria-label="Empty satellite table"
          />
        </OverviewSection>

        <OverviewSection
          title="Error State"
          description="Server-side fetch failed. Custom error content with retry option."
        >
          <RoboDataTable
            data={[]}
            columns={satelliteColumns}
            errorState={
              <div className="text-center">
                <p className="text-[var(--destructive)] font-medium">Failed to load satellite data</p>
                <p className="text-sm text-[var(--muted-foreground)] mt-1">Check your connection and try again.</p>
              </div>
            }
            aria-label="Error satellite table"
          />
        </OverviewSection>
      </OverviewGroup>

      {/* ================================================================
          GROUP 3 — RoboEmailTable (inline-styled, email-safe)
          ================================================================ */}
      <OverviewGroup
        value="robo-email-table"
        title="RoboEmailTable — email-safe"
        description={
          <>
            <strong>Inline-styled only</strong> (email clients strip CSS vars). Renders on a white
            surface — use for report emails and print bodies, not app UI.
          </>
        }
      >
        <div style={{ background: '#ffffff', padding: 24, borderRadius: 8 }}>
          <RoboEmailTable
            caption="Active constellation — report counts by satellite"
            columns={[
              { key: 'satellite', header: 'Satellite Name' },
              { key: 'type', header: 'Type' },
              { key: 'flag', header: 'Operator' },
              { key: 'status', header: 'Status' },
              { key: 'reports', header: 'Reports', align: 'right' },
            ]}
            rows={satelliteData.map((v) => ({
              satellite: v.satellite,
              type: v.type,
              flag: v.flag,
              status: v.status,
              reports: v.reports,
            }))}
          />
        </div>
      </OverviewGroup>

    </OverviewAccordion>
  ),
};
