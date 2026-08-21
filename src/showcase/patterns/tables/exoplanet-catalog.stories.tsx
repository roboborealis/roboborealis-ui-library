import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { createColumnHelper } from '@tanstack/react-table';
import { makeExoplanetCatalog } from '@roboborealis/space-faker';
import type { Exoplanet } from '@roboborealis/space-faker';
import { RoboDataTable, createActionsCell, createBooleanCell, createNumericCell, createProgressCell, createStatusCell } from '@roboborealis/components/tables';


// ---------------------------------------------------------------------------
// Exoplanet Catalog — 50 exoplanets, exercising the full RoboDataTable
// cell-renderer set (numeric, boolean, progress, status, action cells).
// ---------------------------------------------------------------------------

const methods: Exoplanet['method'][] = ['Transit', 'Radial Velocity', 'Direct Imaging', 'Microlensing', 'Astrometry'];

const planetHelper = createColumnHelper<Exoplanet>();

const planetColumns = [
  planetHelper.accessor('name', { header: 'Planet', enableSorting: true }),
  planetHelper.accessor('hostStar', { header: 'Host Star', enableSorting: true }),
  planetHelper.accessor('method', {
    header: 'Method',
    enableSorting: true,
    cell: createStatusCell<Exoplanet>({
      colorMap: {
        Transit: 'primary',
        'Radial Velocity': 'success',
        'Direct Imaging': 'warning',
        Microlensing: 'default',
        Astrometry: 'muted',
      },
    }),
    meta: { filterType: 'select' as const, filterOptions: methods.map((m) => ({ label: m, value: m })) },
  }),
  planetHelper.accessor('periodDays', {
    header: 'Period',
    cell: createNumericCell<Exoplanet>({ unit: 'd', formatOptions: { maximumFractionDigits: 1 } }),
    meta: { align: 'right' as const },
  }),
  planetHelper.accessor('radiusEarth', {
    header: 'Radius',
    cell: createNumericCell<Exoplanet>({ unit: 'R⊕', formatOptions: { maximumFractionDigits: 2 } }),
    meta: { align: 'right' as const },
  }),
  planetHelper.accessor('massEarth', {
    header: 'Mass',
    cell: createNumericCell<Exoplanet>({ unit: 'M⊕', formatOptions: { maximumFractionDigits: 2 } }),
    meta: { align: 'right' as const },
  }),
  planetHelper.accessor('confirmed', {
    header: 'Status',
    cell: createBooleanCell<Exoplanet>({ trueLabel: 'Confirmed', falseLabel: 'Candidate' }),
    meta: { align: 'center' as const },
  }),
  planetHelper.accessor('habitabilityScore', {
    header: 'Habitability',
    cell: createProgressCell<Exoplanet>({ thresholds: { warning: 40, success: 70 } }),
  }),
  planetHelper.accessor('distanceLy', {
    header: 'Distance',
    cell: createNumericCell<Exoplanet>({ unit: 'ly', formatOptions: { maximumFractionDigits: 0 } }),
    meta: { align: 'right' as const },
  }),
  planetHelper.accessor('discoveredYear', {
    header: 'Discovered',
    enableSorting: true,
    meta: { align: 'right' as const },
  }),
  planetHelper.display({
    id: 'actions',
    header: '',
    cell: createActionsCell<Exoplanet>({
      actions: [
        { id: 'view', label: 'View Details', onAction: (r) => alert(`View: ${r.name}`) },
        { id: 'observe', label: 'Add to Target List', onAction: (r) => alert(`Target: ${r.name}`) },
        { id: 'data', label: 'Open Light Curve', onAction: (r) => alert(`Light curve: ${r.name}`) },
      ],
    }),
  }),
];

export const patternMeta = {
  demonstrates: 'A fifty-exoplanet catalog table exercising the full RoboDataTable feature set together, including progress cells, boolean cells, numeric cells, and action cells.',
  whenToUse: 'Use as the reference to see the complete range of RoboDataTable cell types combined in one realistic table, when deciding which cell renderers a new table needs.',
  keywords: ['data table cell types', 'progress cell', 'boolean cell', 'numeric cell', 'action cell', 'exoplanet catalog'],
  agentPriority: 'Prioritize this pattern as the cell-type reference for RoboDataTable rather than as a page-level archetype. For the page-level list pattern itself, use Object Catalog.',
};

const meta: Meta = {
  title: 'Showcase/Patterns/Tables/Exoplanet Catalog',
  excludeStories: ['patternMeta'],
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj;

export const ExoplanetCatalog: Story = {
  render: () => {
    const data = React.useMemo(() => makeExoplanetCatalog(50, 3), []);

    return (
      <RoboDataTable
        data={data}
        columns={planetColumns}
        getRowId={(r) => r.id}
        enableSorting
        enableMultiSort
        enableGlobalFilter
        enableColumnFilters
        enablePagination
        enableRowSelection
        enableMultiRowSelection
        enableColumnPinning
        enableColumnResizing
        enableColumnVisibility
        pageSize={25}
        striped
        stickyHeader
        bulkActions={[
          {
            id: 'export',
            label: 'Export Selected',
            onAction: (rows) => alert(`Export ${rows.length} exoplanets`),
          },
          {
            id: 'target',
            label: 'Add to Target List',
            onAction: (rows) => alert(`Add ${rows.length} to target list`),
          },
        ]}
        aria-label="Exoplanet Catalog — 50 exoplanets"
      />
    );
  },
};
