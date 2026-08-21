import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { createColumnHelper } from '@tanstack/react-table';
import type { SortingState, PaginationState } from '@tanstack/react-table';

import { ChevronDown, ChevronRight } from 'lucide-react';

import { RoboIconButton } from '@/core/button/robo-icon-button';
import { RoboLoading } from '@/feedback/loading/robo-loading';

import { RoboDataTable } from './robo-data-table';
import type { RoboDataTableProps } from './types';
import { createStatusCell } from './cells/status-cell';
import { createAvatarCell } from './cells/avatar-cell';
import { createDateCell } from './cells/date-cell';
import { createNumericCell } from './cells/numeric-cell';
import { createActionsCell } from './cells/actions-cell';
import { createProgressCell } from './cells/progress-cell';
import { createLinkCell } from './cells/link-cell';
import { createBooleanCell } from './cells/boolean-cell';
import { createCourseCell } from './cells/course-cell';

// ---------------------------------------------------------------------------
// Sample data
// ---------------------------------------------------------------------------

interface SatelliteRow {
  id: string;
  satellite: string;
  type: string;
  status: 'active' | 'docked' | 'inactive';
  lastSeen: string;
  reportCount: number;
}

const sampleData: SatelliteRow[] = [
  { id: '1', satellite: 'Voyager 1', type: 'Cargo Freighter', status: 'active', lastSeen: '2 min ago', reportCount: 142 },
  { id: '2', satellite: 'Cassini', type: 'Probe', status: 'docked', lastSeen: '14 min ago', reportCount: 87 },
  { id: '3', satellite: 'Hubble', type: 'Satellite', status: 'active', lastSeen: '1 hr ago', reportCount: 231 },
  { id: '4', satellite: 'Kepler', type: 'CubeSat', status: 'inactive', lastSeen: '3 hr ago', reportCount: 12 },
  { id: '5', satellite: 'Artemis I', type: 'Crew Capsule', status: 'active', lastSeen: '5 min ago', reportCount: 56 },
  { id: '6', satellite: 'New Horizons', type: 'Cargo Freighter', status: 'active', lastSeen: '8 min ago', reportCount: 98 },
  { id: '7', satellite: 'Spitzer', type: 'Telescope', status: 'docked', lastSeen: '2 hr ago', reportCount: 45 },
  { id: '8', satellite: 'ISS Zarya', type: 'Space Station', status: 'inactive', lastSeen: '6 hr ago', reportCount: 7 },
];

const largeSampleData: SatelliteRow[] = [
  ...sampleData,
  { id: '9', satellite: 'Juno', type: 'Cargo Freighter', status: 'active', lastSeen: '3 min ago', reportCount: 178 },
  { id: '10', satellite: 'Galileo', type: 'Probe', status: 'active', lastSeen: '11 min ago', reportCount: 63 },
  { id: '11', satellite: 'Sentinel-3', type: 'CubeSat', status: 'docked', lastSeen: '4 hr ago', reportCount: 29 },
  { id: '12', satellite: 'Landsat 9', type: 'Satellite', status: 'active', lastSeen: '7 min ago', reportCount: 115 },
  { id: '13', satellite: 'Dragon', type: 'Crew Capsule', status: 'inactive', lastSeen: '8 hr ago', reportCount: 34 },
  { id: '14', satellite: 'Chandra', type: 'Telescope', status: 'active', lastSeen: '22 min ago', reportCount: 91 },
  { id: '15', satellite: 'Tiangong', type: 'Space Station', status: 'active', lastSeen: '6 min ago', reportCount: 204 },
  { id: '16', satellite: 'Magellan', type: 'Probe', status: 'docked', lastSeen: '1 hr ago', reportCount: 47 },
  { id: '17', satellite: 'Pioneer 10', type: 'Cargo Freighter', status: 'active', lastSeen: '9 min ago', reportCount: 133 },
  { id: '18', satellite: 'Sentinel-5', type: 'CubeSat', status: 'inactive', lastSeen: '5 hr ago', reportCount: 18 },
  { id: '19', satellite: 'Starliner', type: 'Crew Capsule', status: 'active', lastSeen: '15 min ago', reportCount: 72 },
  { id: '20', satellite: 'Terra', type: 'Satellite', status: 'docked', lastSeen: '2 hr ago', reportCount: 59 },
];

const columnHelper = createColumnHelper<SatelliteRow>();

const sampleColumns = [
  columnHelper.accessor('satellite', {
    header: 'Satellite Name',
    cell: (info) => info.getValue(),
    enableSorting: true,
    size: 220,
  }),
  columnHelper.accessor('type', {
    header: 'Type',
    cell: (info) => info.getValue(),
    enableSorting: true,
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    cell: createStatusCell({ colorMap: { active: 'success', docked: 'primary', inactive: 'default' } }),
    enableSorting: true,
  }),
  columnHelper.accessor('lastSeen', {
    header: 'Last Seen',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('reportCount', {
    header: 'Reports',
    cell: (info) => info.getValue(),
    enableSorting: true,
    meta: { align: 'right' as const },
  }),
];

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------


export const componentMeta = {
  description: 'Full-featured data grid with sorting, filtering, pagination, and row selection',
  category: 'display' as const,
  keywords: ['table', 'grid', 'data', 'sort', 'filter', 'pagination', 'row', 'column', 'tanstack'],
  whenToUse: 'For displaying structured data with sort, filter, paginate, or select interactions',
  whenNotToUse: 'For simple key-value pairs use a description list; for cards use RoboCard grid',
  pairsWith: ['RoboExportButton', 'RoboCopyButton', 'RoboInput', 'RoboSelect', 'RoboPagination'],
  a11y: 'Uses native table semantics with scope attributes; sortable headers announce sort direction',
};
const meta: Meta<RoboDataTableProps<SatelliteRow>> = {
  title: 'Data/Tables/RoboDataTable',
  excludeStories: ['componentMeta'],
    component: RoboDataTable,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    enableSorting: { control: 'boolean' },
    enablePagination: { control: 'boolean' },
    enableRowSelection: { control: 'boolean' },
    enableColumnReordering: { control: 'boolean' },
    enableColumnResizing: { control: 'boolean' },
    enableColumnPinning: { control: 'boolean' },
    enableExpanding: { control: 'boolean' },
    isLoading: { control: 'boolean' },
    isFetching: { control: 'boolean' },
    striped: { control: 'boolean' },
    bordered: { control: 'boolean' },
    stickyHeader: { control: 'boolean' },
    density: {
      control: 'radio',
      options: ['compact', 'comfortable', 'spacious'],
    },
  },
};

export default meta;

type Story = StoryObj<RoboDataTableProps<SatelliteRow>>;

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

/**
 * All Variants — overview of the core data table states: default, loading
 * skeleton, empty, and paginated. Gated behind the loading indicator for an
 * 800 ms beat since the table is a data-heavy component.
 */
export const AllVariants: Story = {
  name: 'All Variants',
  render: () => {
    const [ready, setReady] = React.useState(false);
    React.useEffect(() => {
      const t = setTimeout(() => setReady(true), 800);
      return () => clearTimeout(t);
    }, []);
    if (!ready) return <RoboLoading />;
    return (
      <div className='flex flex-col gap-8'>
        <div>
          <p style={{ fontSize: '0.75rem', color: 'var(--secondary-text)', marginBottom: 8 }}>Default</p>
          <RoboDataTable
            data={sampleData}
            columns={sampleColumns}
            getRowId={(row) => row.id}
            aria-label='All variants — default table'
          />
        </div>
        <div>
          <p style={{ fontSize: '0.75rem', color: 'var(--secondary-text)', marginBottom: 8 }}>Loading (skeleton)</p>
          <RoboDataTable
            data={[]}
            columns={sampleColumns}
            isLoading
            aria-label='All variants — loading table'
          />
        </div>
        <div>
          <p style={{ fontSize: '0.75rem', color: 'var(--secondary-text)', marginBottom: 8 }}>Empty</p>
          <RoboDataTable
            data={[]}
            columns={sampleColumns}
            emptyState={<span>No satellite reports found for the selected criteria.</span>}
            aria-label='All variants — empty table'
          />
        </div>
        <div>
          <p style={{ fontSize: '0.75rem', color: 'var(--secondary-text)', marginBottom: 8 }}>With pagination</p>
          <RoboDataTable
            data={largeSampleData}
            columns={sampleColumns}
            getRowId={(row) => row.id}
            enableSorting
            enablePagination
            pageSize={5}
            aria-label='All variants — paginated table'
          />
        </div>
      </div>
    );
  },
};

/**
 * Default — read-only table with no features enabled.
 * The simplest possible table, showing data in a clean grid.
 */
export const Default: Story = {
  name: 'Default (Read-Only)',
  args: {
    data: sampleData,
    columns: sampleColumns,
    getRowId: (row) => row.id,
    'aria-label': 'Satellite constellation table',
  },
};

/**
 * With sorting — click column headers to sort ascending/descending.
 * Shift+click for multi-column sort.
 */
export const WithSorting: Story = {
  name: 'With Sorting',
  args: {
    data: sampleData,
    columns: sampleColumns,
    getRowId: (row) => row.id,
    enableSorting: true,
    'aria-label': 'Sortable satellite table',
  },
};

/**
 * With column reordering — drag column headers to rearrange.
 */
export const WithColumnReordering: Story = {
  name: 'With Column Reordering',
  args: {
    data: sampleData,
    columns: sampleColumns,
    getRowId: (row) => row.id,
    enableSorting: true,
    enableColumnReordering: true,
    'aria-label': 'Reorderable satellite table',
  },
};

/**
 * Loading state — shows skeleton rows while data is being fetched.
 */
export const LoadingState: Story = {
  name: 'Loading State',
  args: {
    data: [],
    columns: sampleColumns,
    isLoading: true,
    'aria-label': 'Loading satellite data',
  },
};

/**
 * Fetching overlay — data stays visible with a subtle overlay during refetch.
 */
export const FetchingState: Story = {
  name: 'Fetching State',
  args: {
    data: sampleData,
    columns: sampleColumns,
    getRowId: (row) => row.id,
    isFetching: true,
    'aria-label': 'Fetching satellite data',
  },
};

/**
 * Empty state — shown when no data is available (or after filtering).
 */
export const EmptyState: Story = {
  name: 'Empty State',
  args: {
    data: [],
    columns: sampleColumns,
    emptyState: <span>No satellite reports found for the selected criteria.</span>,
    'aria-label': 'Empty satellite table',
  },
};

/**
 * Error state — shown when a server-side fetch fails.
 */
export const ErrorState: Story = {
  name: 'Error State',
  args: {
    data: [],
    columns: sampleColumns,
    errorState: (
      <div className="text-center">
        <p className="text-[var(--destructive)] font-medium">Failed to load satellite data</p>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">Please try again or contact support.</p>
      </div>
    ),
    'aria-label': 'Error satellite table',
  },
};

/**
 * Expanded rows — click the expand button to see detail content below each row.
 */
export const ExpandedRows: Story = {
  name: 'Expanded Rows',
  args: {
    data: sampleData,
    columns: [
      columnHelper.display({
        id: 'expander',
        header: '',
        cell: ({ row }) => (
          <RoboIconButton
            size="sm"
            variant="ghost"
            aria-label={row.getIsExpanded() ? 'Collapse row' : 'Expand row'}
            onClick={row.getToggleExpandedHandler()}
          >
            {row.getIsExpanded() ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </RoboIconButton>
        ),
        size: 40,
      }),
      ...sampleColumns,
    ],
    getRowId: (row) => row.id,
    enableExpanding: true,
    renderExpandedRow: (row) => (
      <div className="py-2 px-4 text-sm text-[var(--muted-foreground)]">
        <strong>{row.original.satellite}</strong> — {row.original.type} satellite.
        Currently <em>{row.original.status}</em>. Last seen {row.original.lastSeen}.
        Total reports: {row.original.reportCount}.
      </div>
    ),
    'aria-label': 'Expandable satellite table',
  },
};

/**
 * Styling variants — striped rows, bordered cells, sticky header.
 */
export const StripedAndBordered: Story = {
  name: 'Striped + Bordered',
  args: {
    data: sampleData,
    columns: sampleColumns,
    getRowId: (row) => row.id,
    enableSorting: true,
    striped: true,
    bordered: true,
    'aria-label': 'Striped and bordered satellite table',
  },
};

/**
 * Server-side controlled — demonstrates controlled sorting + pagination
 * with manual mode. Open the Actions panel to see callback events.
 */
export const ServerSideControlled: Story = {
  name: 'Server-Side (Controlled)',
  render: () => {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [pagination, setPagination] = React.useState<PaginationState>({
      pageIndex: 0,
      pageSize: 5,
    });

    // Simulate server-side data
    const sortedData = React.useMemo(() => {
      const sorted = [...sampleData];
      if (sorting.length > 0) {
        const { id, desc } = sorting[0];
        sorted.sort((a, b) => {
          const aVal = a[id as keyof SatelliteRow];
          const bVal = b[id as keyof SatelliteRow];
          if (aVal < bVal) return desc ? 1 : -1;
          if (aVal > bVal) return desc ? -1 : 1;
          return 0;
        });
      }
      const start = pagination.pageIndex * pagination.pageSize;
      return sorted.slice(start, start + pagination.pageSize);
    }, [sorting, pagination]);

    return (
      <RoboDataTable
        data={sortedData}
        columns={sampleColumns}
        getRowId={(row) => row.id}
        enableSorting
        enablePagination
        manualSorting
        manualPagination
        sorting={sorting}
        onSortingChange={setSorting}
        pagination={pagination}
        onPaginationChange={setPagination}
        rowCount={sampleData.length}
        aria-label="Server-side controlled table"
      />
    );
  },
};

/**
 * With pagination — client-side pagination over 20 rows of satellite data.
 * Shows page navigation, page size selector, and row count.
 */
export const WithPagination: Story = {
  name: 'With Pagination',
  args: {
    data: largeSampleData,
    columns: sampleColumns,
    getRowId: (row) => row.id,
    enableSorting: true,
    enablePagination: true,
    pageSize: 5,
    'aria-label': 'Paginated satellite table',
  },
};

/**
 * With column resizing — users drag the right edge of column headers to resize.
 */
export const WithColumnResizing: Story = {
  name: 'With Column Resizing',
  args: {
    data: sampleData,
    columns: sampleColumns,
    getRowId: (row) => row.id,
    enableColumnResizing: true,
    'aria-label': 'Resizable column satellite table',
  },
};

/**
 * With column pinning — pin toggle visible on column header hover.
 * First column pre-pinned to the left. Scroll horizontally to see pinning in action.
 */
export const WithColumnPinning: Story = {
  name: 'With Column Pinning',
  render: () => (
    <div style={{ width: 600, overflow: 'auto' }}>
      <RoboDataTable
        data={sampleData}
        columns={sampleColumns}
        getRowId={(row) => row.id}
        enableColumnPinning
        columnPinning={{ left: ['satellite'], right: [] }}
        aria-label="Column pinning satellite table"
      />
    </div>
  ),
};

/**
 * All Phase 2 Features — combined story showing sorting, pagination,
 * column reordering, resizing, and pinning all enabled simultaneously.
 */
export const AllPhase2Features: Story = {
  name: 'All Phase 2 Features',
  args: {
    data: largeSampleData,
    columns: sampleColumns,
    getRowId: (row) => row.id,
    enableSorting: true,
    enablePagination: true,
    enableColumnReordering: true,
    enableColumnResizing: true,
    enableColumnPinning: true,
    pageSize: 5,
    'aria-label': 'Full-featured satellite table',
  },
};

// ---------------------------------------------------------------------------
// Phase 3 — Filtering + Global Search
// ---------------------------------------------------------------------------

/**
 * Filter-aware column definitions — adds filterType meta and enableColumnFilter
 * to each column that supports per-column filtering.
 */
const filterColumns = [
  columnHelper.accessor('satellite', {
    header: 'Satellite Name',
    cell: (info) => info.getValue(),
    enableSorting: true,
    enableColumnFilter: true,
    meta: { filterType: 'text' as const },
    size: 220,
  }),
  columnHelper.accessor('type', {
    header: 'Type',
    cell: (info) => info.getValue(),
    enableSorting: true,
    enableColumnFilter: true,
    meta: {
      filterType: 'select' as const,
      filterOptions: [
        { label: 'Cargo Freighter', value: 'Cargo Freighter' },
        { label: 'Probe', value: 'Probe' },
        { label: 'Satellite', value: 'Satellite' },
        { label: 'CubeSat', value: 'CubeSat' },
        { label: 'Crew Capsule', value: 'Crew Capsule' },
        { label: 'Telescope', value: 'Telescope' },
        { label: 'Space Station', value: 'Space Station' },
      ],
    },
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    cell: createStatusCell({ colorMap: { active: 'success', docked: 'primary', inactive: 'default' } }),
    enableSorting: true,
    enableColumnFilter: true,
    meta: {
      filterType: 'select' as const,
      filterOptions: [
        { label: 'Active', value: 'active' },
        { label: 'Docked', value: 'docked' },
        { label: 'Inactive', value: 'inactive' },
      ],
    },
  }),
  columnHelper.accessor('lastSeen', {
    header: 'Last Seen',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('reportCount', {
    header: 'Reports',
    cell: (info) => info.getValue(),
    enableSorting: true,
    enableColumnFilter: true,
    meta: { filterType: 'range' as const, align: 'right' as const },
  }),
];

/**
 * Global search — a single search input filters across all columns simultaneously.
 * Uses the toolbar search field rendered when enableGlobalFilter is true.
 */
export const WithGlobalSearch: Story = {
  name: 'With Global Search',
  args: {
    data: largeSampleData,
    columns: sampleColumns,
    getRowId: (row) => row.id,
    enableGlobalFilter: true,
    enableSorting: true,
    'aria-label': 'Searchable satellite table',
  },
};

/**
 * Column filters — per-column filter popovers driven by filterType meta.
 * Text, select, and range filter types are demonstrated here.
 */
export const WithColumnFilters: Story = {
  name: 'With Column Filters',
  args: {
    data: largeSampleData,
    columns: filterColumns,
    getRowId: (row) => row.id,
    enableSorting: true,
    enableColumnFilters: true,
    'aria-label': 'Column-filterable satellite table',
  },
};

/**
 * Global search + column filters — both filter mechanisms active together,
 * with pagination so the narrowed result set pages correctly.
 */
export const WithAllFiltering: Story = {
  name: 'Global Search + Column Filters',
  render: () => {
    return (
      <RoboDataTable
        data={largeSampleData}
        columns={filterColumns}
        getRowId={(row) => row.id}
        enableSorting
        enableGlobalFilter
        enableColumnFilters
        enablePagination
        pageSize={10}
        aria-label="Fully filterable satellite table"
      />
    );
  },
};

/**
 * All Phase 3 Features — every Phase 2 + Phase 3 feature enabled simultaneously:
 * sorting, global search, column filters, pagination, column reordering,
 * resizing, and pinning.
 */
export const AllPhase3Features: Story = {
  name: 'All Phase 3 Features',
  args: {
    data: largeSampleData,
    columns: filterColumns,
    getRowId: (row) => row.id,
    enableSorting: true,
    enableGlobalFilter: true,
    enableColumnFilters: true,
    enablePagination: true,
    enableColumnReordering: true,
    enableColumnResizing: true,
    enableColumnPinning: true,
    pageSize: 10,
    'aria-label': 'Phase 3 full-featured satellite table',
  },
};

// ---------------------------------------------------------------------------
// Phase 4 — Row Selection + Bulk Actions
// ---------------------------------------------------------------------------

/**
 * Row selection — checkbox column auto-prepended, select-all in header.
 * Click checkboxes to select rows. The row highlights with a subtle primary tint.
 */
export const WithRowSelection: Story = {
  name: 'With Row Selection',
  args: {
    data: sampleData,
    columns: sampleColumns,
    getRowId: (row) => row.id,
    enableRowSelection: true,
    enableMultiRowSelection: true,
    enableSorting: true,
    'aria-label': 'Selectable satellite table',
  },
};

/**
 * Bulk actions — select rows to see the floating action bar appear.
 * Demonstrates delete (destructive) and export actions.
 */
export const WithBulkActions: Story = {
  name: 'With Bulk Actions',
  args: {
    data: sampleData,
    columns: sampleColumns,
    getRowId: (row) => row.id,
    enableRowSelection: true,
    enableMultiRowSelection: true,
    enableSorting: true,
    bulkActions: [
      {
        id: 'export',
        label: 'Export Selected',
        onAction: (rows) => alert(`Exporting ${rows.length} row(s)`),
      },
      {
        id: 'delete',
        label: 'Delete',
        variant: 'destructive',
        onAction: (rows) => alert(`Deleting ${rows.length} row(s)`),
      },
    ],
    'aria-label': 'Bulk actions satellite table',
  },
};

/**
 * All Phase 4 Features — row selection, bulk actions, sorting, filtering,
 * pagination, and all column operations.
 */
export const AllPhase4Features: Story = {
  name: 'All Phase 4 Features',
  args: {
    data: largeSampleData,
    columns: filterColumns,
    getRowId: (row) => row.id,
    enableSorting: true,
    enableGlobalFilter: true,
    enableColumnFilters: true,
    enablePagination: true,
    enableRowSelection: true,
    enableMultiRowSelection: true,
    enableColumnReordering: true,
    enableColumnResizing: true,
    enableColumnPinning: true,
    pageSize: 10,
    bulkActions: [
      {
        id: 'export',
        label: 'Export',
        onAction: (rows) => alert(`Exporting ${rows.length} satellite(s)`),
      },
      {
        id: 'delete',
        label: 'Delete',
        variant: 'destructive',
        onAction: (rows) => alert(`Deleting ${rows.length} satellite(s)`),
      },
    ],
    'aria-label': 'Phase 4 full-featured satellite table',
  },
};

// ---------------------------------------------------------------------------
// Phase 5 — Nested / Expandable Rows
// ---------------------------------------------------------------------------

interface MissionLeg {
  id: string;
  legType: string;
  latitude: string;
  longitude: string;
  course: number;
  distanceNM: number;
}

interface MissionRow {
  id: string;
  satellite: string;
  callsign: string;
  etd: string;
  eta: string;
  status: 'active' | 'completed' | 'cancelled';
  legs?: MissionLeg[];
}

const missionLegColumnHelper = createColumnHelper<MissionLeg>();
const missionColumnHelper = createColumnHelper<MissionRow>();

const missionData: MissionRow[] = [
  {
    id: 'v1',
    satellite: 'Voyager 1',
    callsign: 'VGR1',
    etd: '2026-04-10',
    eta: '2026-04-25',
    status: 'active',
    legs: [
      { id: 'v1-l1', legType: 'Departure', latitude: '40.7128N', longitude: '74.0060W', course: 90, distanceNM: 0 },
      { id: 'v1-l2', legType: 'Waypoint', latitude: '41.2000N', longitude: '70.0000W', course: 85, distanceNM: 215 },
      { id: 'v1-l3', legType: 'Waypoint', latitude: '43.5000N', longitude: '60.0000W', course: 70, distanceNM: 540 },
    ],
  },
  {
    id: 'v2',
    satellite: 'Cassini',
    callsign: 'CAS',
    etd: '2026-04-08',
    eta: '2026-04-20',
    status: 'completed',
    legs: [
      { id: 'v2-l1', legType: 'Departure', latitude: '34.0522N', longitude: '118.2437W', course: 270, distanceNM: 0 },
      { id: 'v2-l2', legType: 'Arrival', latitude: '21.3069N', longitude: '157.8583W', course: 250, distanceNM: 2471 },
    ],
  },
  {
    id: 'v3',
    satellite: 'Hubble',
    callsign: 'HST',
    etd: '2026-04-15',
    eta: '2026-04-30',
    status: 'active',
  },
];

const missionColumns = [
  missionColumnHelper.accessor('satellite', {
    header: 'Satellite',
    cell: (info) => info.getValue(),
    enableSorting: true,
  }),
  missionColumnHelper.accessor('callsign', {
    header: 'Callsign',
    cell: (info) => info.getValue(),
  }),
  missionColumnHelper.accessor('etd', {
    header: 'ETD',
    cell: (info) => info.getValue(),
  }),
  missionColumnHelper.accessor('eta', {
    header: 'ETA',
    cell: (info) => info.getValue(),
  }),
  missionColumnHelper.accessor('status', {
    header: 'Status',
    cell: createStatusCell({ colorMap: { active: 'success', completed: 'primary', cancelled: 'destructive' } }),
  }),
];

const missionLegColumns = [
  missionLegColumnHelper.accessor('legType', { header: 'Type' }),
  missionLegColumnHelper.accessor('latitude', { header: 'Latitude' }),
  missionLegColumnHelper.accessor('longitude', { header: 'Longitude' }),
  missionLegColumnHelper.accessor('course', { header: 'Course', meta: { align: 'right' as const } }),
  missionLegColumnHelper.accessor('distanceNM', { header: 'Distance (km)', meta: { align: 'right' as const } }),
];

/**
 * Nested sub-rows — TanStack native getSubRows for hierarchical data.
 * Auto-prepended chevron column with visual depth indentation.
 */
export const NestedSubRows: Story = {
  name: 'Nested Sub-Rows (DCS Pattern)',
  render: () => (
    <RoboDataTable
      data={missionData}
      columns={missionColumns}
      getRowId={(row) => row.id}
      enableExpanding
      enableSorting
      renderExpandedRow={(row) => {
        const mission = row.original as MissionRow;
        if (!mission.legs || mission.legs.length === 0) return null;
        return (
          <div className="pl-8">
            <p className="text-xs text-[var(--muted-foreground)] mb-2 font-medium">
              Mission Legs ({mission.legs.length})
            </p>
            <RoboDataTable
              data={mission.legs}
              columns={missionLegColumns}
              getRowId={(leg) => leg.id}
              bordered
              aria-label={`Mission legs for ${mission.satellite}`}
            />
          </div>
        );
      }}
      aria-label="Mission table with nested legs"
    />
  ),
};

/**
 * Single expand mode — only one row can be expanded at a time (DCS console behavior).
 * Expanding a new row auto-collapses the previously expanded one.
 */
export const SingleExpandMode: Story = {
  name: 'Single Expand Mode',
  render: () => (
    <RoboDataTable
      data={missionData}
      columns={missionColumns}
      getRowId={(row) => row.id}
      enableExpanding
      allowMultipleExpanded={false}
      renderExpandedRow={(row) => {
        const mission = row.original as MissionRow;
        return (
          <div className="py-2 px-4 text-sm text-[var(--muted-foreground)]">
            <strong>{mission.satellite}</strong> ({mission.callsign}) —
            Departure: {mission.etd}, Arrival: {mission.eta}.
            Status: <em>{mission.status}</em>.
            {mission.legs ? ` ${mission.legs.length} legs recorded.` : ' No legs recorded.'}
          </div>
        );
      }}
      aria-label="Single-expand mission table"
    />
  ),
};

/**
 * All Phase 5 Features — expanding, selection, bulk actions, sorting, filtering, pagination.
 */
export const AllPhase5Features: Story = {
  name: 'All Phase 5 Features',
  render: () => (
    <RoboDataTable
      data={missionData}
      columns={missionColumns}
      getRowId={(row) => row.id}
      enableExpanding
      enableSorting
      enableRowSelection
      enableMultiRowSelection
      enablePagination
      pageSize={10}
      bulkActions={[
        { id: 'export', label: 'Export', onAction: (rows) => alert(`Exporting ${rows.length}`) },
      ]}
      renderExpandedRow={(row) => {
        const mission = row.original as MissionRow;
        if (!mission.legs || mission.legs.length === 0) {
          return (
            <div className="py-2 px-4 text-sm text-[var(--muted-foreground)]">
              No mission legs recorded for {mission.satellite}.
            </div>
          );
        }
        return (
          <div className="pl-8">
            <RoboDataTable
              data={mission.legs}
              columns={missionLegColumns}
              getRowId={(leg) => leg.id}
              bordered
              aria-label={`Legs for ${mission.satellite}`}
            />
          </div>
        );
      }}
      aria-label="Phase 5 full-featured mission table"
    />
  ),
};

// ===========================================================================
// Phase 6: Cell Renderers + Export Integration
// ===========================================================================

// ---------------------------------------------------------------------------
// Sample data for cell renderer stories
// ---------------------------------------------------------------------------

interface CrewMember {
  id: string;
  name: string;
  role: string;
  status: 'on-duty' | 'off-duty' | 'on-leave' | 'alert';
  certified: boolean;
  watchHours: number;
  completionPct: number;
  joinedAt: string;
  profileUrl: string;
  avatarUrl?: string;
}

const crewData: CrewMember[] = [
  {
    id: 'c1',
    name: 'James Carter',
    role: 'Commander',
    status: 'on-duty',
    certified: true,
    watchHours: 1247.5,
    completionPct: 95,
    joinedAt: '2024-03-15T08:00:00Z',
    profileUrl: 'https://example.com/crew/carter',
  },
  {
    id: 'c2',
    name: 'Sarah Chen',
    role: 'First Officer',
    status: 'on-duty',
    certified: true,
    watchHours: 856.2,
    completionPct: 88,
    joinedAt: '2024-06-22T09:30:00Z',
    profileUrl: 'https://example.com/crew/chen',
  },
  {
    id: 'c3',
    name: 'Mike Torres',
    role: 'Chief Engineer',
    status: 'off-duty',
    certified: true,
    watchHours: 2100.0,
    completionPct: 100,
    joinedAt: '2023-01-10T07:00:00Z',
    profileUrl: 'https://example.com/crew/torres',
  },
  {
    id: 'c4',
    name: 'Lisa Park',
    role: 'Comms Officer',
    status: 'on-leave',
    certified: false,
    watchHours: 320.8,
    completionPct: 42,
    joinedAt: '2025-09-01T10:00:00Z',
    profileUrl: 'https://example.com/crew/park',
  },
  {
    id: 'c5',
    name: 'David Okonkwo',
    role: 'Flight Engineer',
    status: 'alert',
    certified: true,
    watchHours: -15.3,
    completionPct: 65,
    joinedAt: '2025-11-20T06:00:00Z',
    profileUrl: 'https://example.com/crew/okonkwo',
  },
];

const crewHelper = createColumnHelper<CrewMember>();

// ---------------------------------------------------------------------------
// Story: WithStatusCells
// ---------------------------------------------------------------------------

export const WithStatusCells: Story = {
  render: () => {
    const columns = [
      crewHelper.accessor('name', { header: 'Name' }),
      crewHelper.accessor('role', { header: 'Role' }),
      crewHelper.accessor('status', {
        header: 'Status',
        cell: createStatusCell<CrewMember>({
          colorMap: {
            'on-duty': 'success',
            'off-duty': 'default',
            'on-leave': 'warning',
            alert: 'destructive',
          },
          labelMap: {
            'on-duty': 'On Duty',
            'off-duty': 'Off Duty',
            'on-leave': 'On Leave',
            alert: 'Alert',
          },
        }),
      }),
    ];

    return (
      <RoboDataTable
        data={crewData}
        columns={columns}
        getRowId={(r) => r.id}
        aria-label="Status cells demo"
      />
    );
  },
};

// ---------------------------------------------------------------------------
// Story: WithAvatarCells
// ---------------------------------------------------------------------------

export const WithAvatarCells: Story = {
  render: () => {
    const columns = [
      crewHelper.accessor('name', {
        header: 'Crew Member',
        cell: createAvatarCell<CrewMember>({
          nameAccessor: 'name',
          srcAccessor: 'avatarUrl',
        }),
      }),
      crewHelper.accessor('role', { header: 'Role' }),
    ];

    return (
      <RoboDataTable
        data={crewData}
        columns={columns}
        getRowId={(r) => r.id}
        aria-label="Avatar cells demo"
      />
    );
  },
};

// ---------------------------------------------------------------------------
// Story: WithDateCells
// ---------------------------------------------------------------------------

export const WithDateCells: Story = {
  render: () => {
    const columns = [
      crewHelper.accessor('name', { header: 'Name' }),
      crewHelper.accessor('joinedAt', {
        header: 'Joined',
        cell: createDateCell<CrewMember>({ showRelative: true }),
      }),
    ];

    return (
      <RoboDataTable
        data={crewData}
        columns={columns}
        getRowId={(r) => r.id}
        aria-label="Date cells demo"
      />
    );
  },
};

// ---------------------------------------------------------------------------
// Story: WithNumericCells
// ---------------------------------------------------------------------------

export const WithNumericCells: Story = {
  render: () => {
    const columns = [
      crewHelper.accessor('name', { header: 'Name' }),
      crewHelper.accessor('watchHours', {
        header: 'Watch Hours',
        cell: createNumericCell<CrewMember>({
          unit: 'hrs',
          formatOptions: { maximumFractionDigits: 1 },
          colorNegative: true,
        }),
        meta: { align: 'right' },
      }),
    ];

    return (
      <RoboDataTable
        data={crewData}
        columns={columns}
        getRowId={(r) => r.id}
        aria-label="Numeric cells demo"
      />
    );
  },
};

// ---------------------------------------------------------------------------
// Story: WithProgressCells
// ---------------------------------------------------------------------------

export const WithProgressCells: Story = {
  render: () => {
    const columns = [
      crewHelper.accessor('name', { header: 'Name' }),
      crewHelper.accessor('completionPct', {
        header: 'Training Completion',
        cell: createProgressCell<CrewMember>({
          thresholds: { warning: 50, success: 80 },
        }),
      }),
    ];

    return (
      <RoboDataTable
        data={crewData}
        columns={columns}
        getRowId={(r) => r.id}
        aria-label="Progress cells demo"
      />
    );
  },
};

// ---------------------------------------------------------------------------
// Story: WithBooleanCells
// ---------------------------------------------------------------------------

export const WithBooleanCells: Story = {
  render: () => {
    const columns = [
      crewHelper.accessor('name', { header: 'Name' }),
      crewHelper.accessor('certified', {
        header: 'Certified',
        cell: createBooleanCell<CrewMember>({
          trueLabel: 'Certified',
          falseLabel: 'Not Certified',
          showLabel: true,
        }),
        meta: { align: 'center' },
      }),
    ];

    return (
      <RoboDataTable
        data={crewData}
        columns={columns}
        getRowId={(r) => r.id}
        aria-label="Boolean cells demo"
      />
    );
  },
};

// ---------------------------------------------------------------------------
// Story: WithLinkCells
// ---------------------------------------------------------------------------

export const WithLinkCells: Story = {
  render: () => {
    const columns = [
      crewHelper.accessor('name', {
        header: 'Name',
        cell: createLinkCell<CrewMember>({ hrefAccessor: 'profileUrl' }),
      }),
      crewHelper.accessor('role', { header: 'Role' }),
    ];

    return (
      <RoboDataTable
        data={crewData}
        columns={columns}
        getRowId={(r) => r.id}
        aria-label="Link cells demo"
      />
    );
  },
};

// ---------------------------------------------------------------------------
// Story: WithActionsCells
// ---------------------------------------------------------------------------

export const WithActionsCells: Story = {
  render: () => {
    const columns = [
      crewHelper.accessor('name', { header: 'Name' }),
      crewHelper.accessor('role', { header: 'Role' }),
      crewHelper.display({
        id: 'actions',
        header: '',
        cell: createActionsCell<CrewMember>({
          actions: [
            { id: 'view', label: 'View Profile', onAction: (r) => alert(`View: ${r.name}`) },
            { id: 'edit', label: 'Edit', onAction: (r) => alert(`Edit: ${r.name}`) },
            {
              id: 'remove',
              label: 'Remove',
              variant: 'destructive',
              onAction: (r) => alert(`Remove: ${r.name}`),
            },
          ],
        }),
      }),
    ];

    return (
      <RoboDataTable
        data={crewData}
        columns={columns}
        getRowId={(r) => r.id}
        aria-label="Actions cells demo"
      />
    );
  },
};

// ---------------------------------------------------------------------------
// Story: AllPhase6Features — all cell renderers in one table
// ---------------------------------------------------------------------------

export const AllPhase6Features: Story = {
  render: () => {
    const columns = [
      crewHelper.accessor('name', {
        header: 'Crew Member',
        cell: createAvatarCell<CrewMember>({
          nameAccessor: 'name',
          srcAccessor: 'avatarUrl',
        }),
      }),
      crewHelper.accessor('role', { header: 'Role' }),
      crewHelper.accessor('status', {
        header: 'Status',
        cell: createStatusCell<CrewMember>({
          colorMap: {
            'on-duty': 'success',
            'off-duty': 'default',
            'on-leave': 'warning',
            alert: 'destructive',
          },
          labelMap: {
            'on-duty': 'On Duty',
            'off-duty': 'Off Duty',
            'on-leave': 'On Leave',
            alert: 'Alert',
          },
        }),
      }),
      crewHelper.accessor('certified', {
        header: 'Certified',
        cell: createBooleanCell<CrewMember>(),
        meta: { align: 'center' },
      }),
      crewHelper.accessor('watchHours', {
        header: 'Watch Hours',
        cell: createNumericCell<CrewMember>({
          unit: 'hrs',
          formatOptions: { maximumFractionDigits: 1 },
          colorNegative: true,
        }),
        meta: { align: 'right' },
      }),
      crewHelper.accessor('completionPct', {
        header: 'Training',
        cell: createProgressCell<CrewMember>({
          thresholds: { warning: 50, success: 80 },
        }),
      }),
      crewHelper.accessor('joinedAt', {
        header: 'Joined',
        cell: createDateCell<CrewMember>({ showRelative: true }),
      }),
      crewHelper.display({
        id: 'actions',
        header: '',
        cell: createActionsCell<CrewMember>({
          actions: [
            { id: 'view', label: 'View Profile', onAction: (r) => alert(`View: ${r.name}`) },
            { id: 'edit', label: 'Edit', onAction: (r) => alert(`Edit: ${r.name}`) },
            {
              id: 'remove',
              label: 'Remove',
              variant: 'destructive',
              onAction: (r) => alert(`Remove: ${r.name}`),
            },
          ],
        }),
      }),
    ];

    return (
      <RoboDataTable
        data={crewData}
        columns={columns}
        getRowId={(r) => r.id}
        enableSorting
        enablePagination
        pageSize={10}
        striped
        aria-label="Phase 6 — all cell renderers"
      />
    );
  },
};

// ===========================================================================
// Phase 7: Virtualization
// ===========================================================================

// ---------------------------------------------------------------------------
// Generate large dataset for virtual scroll stories
// ---------------------------------------------------------------------------

interface VirtualRow {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'maintenance';
  progress: number;
  distance: number;
  lastSeen: string;
}

function generateVirtualData(count: number): VirtualRow[] {
  const statuses: VirtualRow['status'][] = ['active', 'inactive', 'maintenance'];
  return Array.from({ length: count }, (_, i) => ({
    id: `v-${i}`,
    name: `Satellite ${String(i + 1).padStart(5, '0')}`,
    status: statuses[i % 3],
    progress: Math.round(Math.random() * 100),
    distance: Math.round(Math.random() * 5000 * 10) / 10,
    lastSeen: new Date(Date.now() - Math.random() * 86400000 * 30).toISOString(),
  }));
}

const virtualHelper = createColumnHelper<VirtualRow>();

const virtualColumns = [
  virtualHelper.accessor('name', { header: 'Satellite', enableSorting: true }),
  virtualHelper.accessor('status', {
    header: 'Status',
    cell: createStatusCell<VirtualRow>({
      colorMap: { active: 'success', inactive: 'default', maintenance: 'warning' },
      labelMap: { active: 'Active', inactive: 'Inactive', maintenance: 'Maintenance' },
    }),
  }),
  virtualHelper.accessor('progress', {
    header: 'Completion',
    cell: createProgressCell<VirtualRow>(),
  }),
  virtualHelper.accessor('distance', {
    header: 'Distance',
    cell: createNumericCell<VirtualRow>({ unit: 'km', formatOptions: { maximumFractionDigits: 1 } }),
    meta: { align: 'right' },
  }),
  virtualHelper.accessor('lastSeen', {
    header: 'Last Seen',
    cell: createDateCell<VirtualRow>({ showRelative: true }),
  }),
];

// ---------------------------------------------------------------------------
// Story: VirtualScroll1k
// ---------------------------------------------------------------------------

export const VirtualScroll1k: Story = {
  render: () => {
    const data = React.useMemo(() => generateVirtualData(1000), []);

    return (
      <RoboDataTable
        data={data}
        columns={virtualColumns}
        getRowId={(r) => r.id}
        enableVirtualization
        enableSorting
        striped
        aria-label="1,000 rows — virtual scroll"
      />
    );
  },
};

// ---------------------------------------------------------------------------
// Story: VirtualScroll10k
// ---------------------------------------------------------------------------

export const VirtualScroll10k: Story = {
  render: () => {
    const data = React.useMemo(() => generateVirtualData(10000), []);

    return (
      <RoboDataTable
        data={data}
        columns={virtualColumns}
        getRowId={(r) => r.id}
        enableVirtualization
        enableSorting
        striped
        aria-label="10,000 rows — virtual scroll"
      />
    );
  },
};

// ---------------------------------------------------------------------------
// Story: VirtualScrollWithSelection
// ---------------------------------------------------------------------------

export const VirtualScrollWithSelection: Story = {
  render: () => {
    const data = React.useMemo(() => generateVirtualData(5000), []);

    return (
      <RoboDataTable
        data={data}
        columns={virtualColumns}
        getRowId={(r) => r.id}
        enableVirtualization
        enableSorting
        enableRowSelection
        enableMultiRowSelection
        striped
        aria-label="5,000 rows — virtual + selection"
      />
    );
  },
};

// ===========================================================================
// Phase 8: Inline Editing + Keyboard Navigation
// ===========================================================================

// ---------------------------------------------------------------------------
// Sample data for inline editing stories
// ---------------------------------------------------------------------------

interface EditableRow {
  id: string;
  name: string;
  role: string;
  status: string;
  notes: string;
}

const editableData: EditableRow[] = [
  { id: 'e1', name: 'James Carter', role: 'Commander', status: 'active', notes: 'Senior officer' },
  { id: 'e2', name: 'Sarah Chen', role: 'First Officer', status: 'active', notes: 'Navigation certified' },
  { id: 'e3', name: 'Mike Torres', role: 'Chief Engineer', status: 'off-duty', notes: 'On rotation' },
  { id: 'e4', name: 'Lisa Park', role: 'Radio Officer', status: 'on-leave', notes: '' },
];

const editHelper = createColumnHelper<EditableRow>();

// ---------------------------------------------------------------------------
// Story: InlineEditing
// ---------------------------------------------------------------------------

export const InlineEditing: Story = {
  render: () => {
    const [data, setData] = React.useState(editableData);

    const columns = [
      editHelper.accessor('name', {
        header: 'Name',
        meta: { editable: true },
      }),
      editHelper.accessor('role', {
        header: 'Role',
        meta: { editable: true },
      }),
      editHelper.accessor('status', {
        header: 'Status',
        cell: createStatusCell<EditableRow>({
          colorMap: { active: 'success', 'off-duty': 'default', 'on-leave': 'warning' },
        }),
      }),
      editHelper.accessor('notes', {
        header: 'Notes',
        meta: { editable: true },
      }),
    ];

    const handleCellEdit = (rowId: string, columnId: string, value: unknown) => {
      setData((prev) =>
        prev.map((row) =>
          row.id === rowId ? { ...row, [columnId]: value } : row,
        ),
      );
    };

    return (
      <div>
        <p className="mb-2 text-sm text-[var(--muted-foreground)]">
          Columns marked as editable support double-click to edit. Press Enter to commit, Escape to cancel.
        </p>
        <RoboDataTable
          data={data}
          columns={columns}
          getRowId={(r) => r.id}
          onCellEdit={handleCellEdit}
          aria-label="Inline editing demo"
        />
      </div>
    );
  },
};

// ---------------------------------------------------------------------------
// Story: KeyboardNavigation
// ---------------------------------------------------------------------------

export const KeyboardNavigation: Story = {
  render: () => {
    const columns = [
      editHelper.accessor('name', { header: 'Name' }),
      editHelper.accessor('role', { header: 'Role' }),
      editHelper.accessor('status', { header: 'Status' }),
      editHelper.accessor('notes', { header: 'Notes' }),
    ];

    return (
      <div>
        <p className="mb-2 text-sm text-[var(--muted-foreground)]">
          Tab into the table, then use Arrow keys to navigate cells. Home/End for first/last column.
          Ctrl+Home/End for first/last cell in the grid.
        </p>
        <RoboDataTable
          data={editableData}
          columns={columns}
          getRowId={(r) => r.id}
          enableSorting
          aria-label="Keyboard navigation demo"
        />
      </div>
    );
  },
};

// ===========================================================================
// Phase 9: Saved Views
// ===========================================================================

// ---------------------------------------------------------------------------
// Story: SavedViews
// ---------------------------------------------------------------------------

export const SavedViews: Story = {
  render: () => {
    const [data] = React.useState(editableData);

    const columns = [
      editHelper.accessor('name', { header: 'Name', enableSorting: true }),
      editHelper.accessor('role', { header: 'Role', enableSorting: true }),
      editHelper.accessor('status', {
        header: 'Status',
        enableSorting: true,
        cell: createStatusCell<EditableRow>({
          colorMap: { active: 'success', 'off-duty': 'default', 'on-leave': 'warning' },
        }),
      }),
      editHelper.accessor('notes', { header: 'Notes' }),
    ];

    return (
      <div>
        <p className="mb-2 text-sm text-[var(--muted-foreground)]">
          Saved Views allow users to persist table configurations (sorting, filters,
          column visibility, pinning, page size). Views are stored via StorageAdapter
          and can be saved, loaded, renamed, deleted, or set as default.
        </p>
        <RoboDataTable
          data={data}
          columns={columns}
          getRowId={(r) => r.id}
          enableSorting
          enableColumnVisibility
          enableSavedViews
          enablePagination
          storageKey="storybook-saved-views"
          aria-label="Saved views demo"
        />
      </div>
    );
  },
};

// ===========================================================================
// Additional Feature Stories
// ===========================================================================

// ---------------------------------------------------------------------------
// Story: WithColumnVisibility
// ---------------------------------------------------------------------------

/**
 * Column visibility — toggle columns on/off via the column visibility dropdown.
 * Users can show/hide columns without losing their data or sorting state.
 */
export const WithColumnVisibility: Story = {
  name: 'With Column Visibility',
  args: {
    data: largeSampleData,
    columns: sampleColumns,
    getRowId: (row) => row.id,
    enableSorting: true,
    enableColumnVisibility: true,
    enablePagination: true,
    pageSize: 10,
    'aria-label': 'Column visibility satellite table',
  },
};

// ---------------------------------------------------------------------------
// Story: WithDensity
// ---------------------------------------------------------------------------

/**
 * Density variants — compact, comfortable, and spacious table density.
 * Controls row height, padding, and font size via the `data-density` CSS attribute.
 */
export const WithDensity: Story = {
  name: 'Density Variants',
  render: () => (
    <div className="flex flex-col gap-8">
      {(['compact', 'comfortable', 'spacious'] as const).map((density) => (
        <div key={density}>
          <p className="mb-2 text-sm font-medium text-[var(--muted-foreground)]">
            density=&quot;{density}&quot;
          </p>
          <RoboDataTable
            data={sampleData.slice(0, 4)}
            columns={sampleColumns}
            getRowId={(row) => row.id}
            enableSorting
            density={density}
            striped
            aria-label={`${density} density table`}
          />
        </div>
      ))}
    </div>
  ),
};

// ---------------------------------------------------------------------------
// Story: WithCourseCells
// ---------------------------------------------------------------------------

interface NavigationRow {
  id: string;
  satellite: string;
  course: number | null;
  speed: number;
  status: 'in-orbit' | 'holding' | 'docked';
}

const navigationData: NavigationRow[] = [
  { id: 'n1', satellite: 'Voyager 1', course: 142, speed: 14.2, status: 'in-orbit' },
  { id: 'n2', satellite: 'Cassini', course: 270, speed: 11.8, status: 'in-orbit' },
  { id: 'n3', satellite: 'Hubble', course: 45, speed: 16.5, status: 'in-orbit' },
  { id: 'n4', satellite: 'Kepler', course: null, speed: 0, status: 'holding' },
  { id: 'n5', satellite: 'Artemis I', course: 0, speed: 8.3, status: 'in-orbit' },
  { id: 'n6', satellite: 'New Horizons', course: 315, speed: 12.1, status: 'in-orbit' },
  { id: 'n7', satellite: 'Spitzer', course: null, speed: 0, status: 'docked' },
  { id: 'n8', satellite: 'ISS Zarya', course: 180, speed: 9.7, status: 'in-orbit' },
];

const navHelper = createColumnHelper<NavigationRow>();

/**
 * Course cells — renders a rotated arrow icon with the degree value.
 * Uses the RoboCourseIndicator core component via the createCourseCell factory.
 * Null course values show a dash placeholder.
 */
export const WithCourseCells: Story = {
  name: 'With Course Cells',
  render: () => {
    const columns = [
      navHelper.accessor('satellite', { header: 'Satellite', enableSorting: true }),
      navHelper.accessor('course', {
        header: 'Course',
        cell: createCourseCell<NavigationRow>(),
        meta: { align: 'center' as const },
      }),
      navHelper.accessor('speed', {
        header: 'Speed',
        cell: createNumericCell<NavigationRow>({ unit: 'km/s', formatOptions: { maximumFractionDigits: 1 } }),
        meta: { align: 'right' as const },
      }),
      navHelper.accessor('status', {
        header: 'Status',
        cell: createStatusCell<NavigationRow>({
          colorMap: { 'in-orbit': 'success', holding: 'warning', docked: 'default' },
          labelMap: { 'in-orbit': 'In Orbit', holding: 'Holding', docked: 'Docked' },
        }),
      }),
    ];

    return (
      <RoboDataTable
        data={navigationData}
        columns={columns}
        getRowId={(r) => r.id}
        enableSorting
        striped
        aria-label="Navigation table with course cells"
      />
    );
  },
};
