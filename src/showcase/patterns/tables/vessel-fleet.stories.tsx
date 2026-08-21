import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { createColumnHelper } from '@tanstack/react-table';
import { RoboDataTable, createActionsCell, createBooleanCell, createDateCell, createNumericCell, createProgressCell, createStatusCell } from '@roboborealis/components/tables';


// ---------------------------------------------------------------------------
// Satellite Constellation Manager — 50 satellites, all features
// ---------------------------------------------------------------------------

interface Satellite {
  id: string;
  name: string;
  callsign: string;
  type: 'cargo' | 'probe' | 'crew' | 'cubesat' | 'defense';
  flag: string;
  status: 'in-orbit' | 'holding' | 'docked' | 'anomaly' | 'signal-loss';
  amverParticipant: boolean;
  lastReportAge: number;
  missionCompletion: number;
  speed: number;
  heading: number;
  destination: string;
  eta: string;
  lastSeen: string;
}

const types: Satellite['type'][] = ['cargo', 'probe', 'crew', 'cubesat', 'defense'];
const statuses: Satellite['status'][] = ['in-orbit', 'holding', 'docked', 'anomaly', 'signal-loss'];
const flags = ['NASA', 'ESA', 'JAXA', 'ISRO', 'ROS', 'SPX', 'CNSA', 'CSA', 'KARI', 'UAE'];
const destinations = ['Low Earth Orbit', 'Lunar Gateway', 'Geostationary Orbit', 'Sun-Synchronous Orbit', 'L2 Point', 'ISS', 'Mars Transfer', 'Tiangong', 'Lunar Orbit', 'Halo Orbit'];

function generateSatellites(count: number): Satellite[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `v-${i}`,
    name: `${['Vega', 'Rigel', 'Lyra', 'Orion', 'Andromeda'][i % 5]} ${['Sentinel', 'Probe', 'Pioneer', 'Voyager', 'Explorer'][Math.floor(i / 5) % 5]} ${i + 1}`,
    callsign: `${flags[i % 10]}${String(1000 + i)}`,
    type: types[i % 5],
    flag: flags[i % 10],
    status: statuses[i % 5],
    amverParticipant: i % 3 !== 0,
    lastReportAge: Math.floor(Math.random() * 48),
    missionCompletion: Math.round(Math.random() * 100),
    speed: Math.round(Math.random() * 25 * 10) / 10,
    heading: Math.floor(Math.random() * 360),
    destination: destinations[i % 10],
    eta: new Date(Date.now() + Math.random() * 86400000 * 14).toISOString(),
    lastSeen: new Date(Date.now() - Math.random() * 86400000 * 2).toISOString(),
  }));
}

const satelliteHelper = createColumnHelper<Satellite>();

const satelliteColumns = [
  satelliteHelper.accessor('name', { header: 'Satellite Name', enableSorting: true }),
  satelliteHelper.accessor('callsign', { header: 'Callsign', enableSorting: true }),
  satelliteHelper.accessor('type', {
    header: 'Type',
    enableSorting: true,
    meta: { filterType: 'select' as const, filterOptions: types.map((t) => ({ label: t.charAt(0).toUpperCase() + t.slice(1), value: t })) },
  }),
  satelliteHelper.accessor('flag', { header: 'Operator', enableSorting: true }),
  satelliteHelper.accessor('status', {
    header: 'Status',
    enableSorting: true,
    cell: createStatusCell<Satellite>({
      colorMap: {
        'in-orbit': 'success',
        holding: 'primary',
        docked: 'default',
        anomaly: 'destructive',
        'signal-loss': 'warning',
      },
      labelMap: {
        'in-orbit': 'In Orbit',
        holding: 'Holding',
        docked: 'Docked',
        anomaly: 'Anomaly',
        'signal-loss': 'Signal Loss',
      },
    }),
  }),
  satelliteHelper.accessor('amverParticipant', {
    header: 'DSN Tracked',
    cell: createBooleanCell<Satellite>({ trueLabel: 'Enrolled', falseLabel: 'No' }),
    meta: { align: 'center' as const },
  }),
  satelliteHelper.accessor('speed', {
    header: 'Speed',
    cell: createNumericCell<Satellite>({ unit: 'km/s', formatOptions: { maximumFractionDigits: 1 } }),
    meta: { align: 'right' as const },
  }),
  satelliteHelper.accessor('missionCompletion', {
    header: 'Mission Progress',
    cell: createProgressCell<Satellite>({ thresholds: { warning: 40, success: 75 } }),
  }),
  satelliteHelper.accessor('destination', { header: 'Destination', enableSorting: true }),
  satelliteHelper.accessor('eta', {
    header: 'ETA',
    cell: createDateCell<Satellite>({ showRelative: true }),
    enableSorting: true,
  }),
  satelliteHelper.accessor('lastSeen', {
    header: 'Last Report',
    cell: createDateCell<Satellite>({ showRelative: true }),
    enableSorting: true,
  }),
  satelliteHelper.display({
    id: 'actions',
    header: '',
    cell: createActionsCell<Satellite>({
      actions: [
        { id: 'view', label: 'View Details', onAction: (r) => alert(`View: ${r.name}`) },
        { id: 'track', label: 'Track Satellite', onAction: (r) => alert(`Track: ${r.name}`) },
        { id: 'report', label: 'Request Report', onAction: (r) => alert(`Report: ${r.name}`) },
      ],
    }),
  }),
];

export const patternMeta = {
  demonstrates: 'A fifty-satellite constellation manager table exercising the full RoboDataTable feature set together, including progress cells, boolean cells, and action cells.',
  whenToUse: 'Use as the reference to see the complete range of RoboDataTable cell types combined in one realistic table, when deciding which cell renderers a new table needs.',
  keywords: ['data table cell types', 'progress cell', 'boolean cell', 'action cell', 'constellation manager table'],
  agentPriority: 'Prioritize this pattern as the cell-type reference for RoboDataTable rather than as a page-level archetype. For the page-level list pattern itself, use Constellation Manifest.',
};

const meta: Meta = {
  title: 'Showcase/Patterns/Tables/Satellite Constellation',
  excludeStories: ['patternMeta'],
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj;

export const SatelliteConstellationManager: Story = {
  render: () => {
    const data = React.useMemo(() => generateSatellites(50), []);

    return (
      <RoboDataTable
        data={data}
        columns={satelliteColumns}
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
            onAction: (rows) => alert(`Export ${rows.length} satellites`),
          },
          {
            id: 'request-report',
            label: 'Request Reports',
            onAction: (rows) => alert(`Request reports for ${rows.length} satellites`),
          },
        ]}
        aria-label="Satellite Constellation Manager — 50 satellites"
      />
    );
  },
};
