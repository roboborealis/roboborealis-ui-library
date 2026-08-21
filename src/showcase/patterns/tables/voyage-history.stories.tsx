import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { createColumnHelper } from '@tanstack/react-table';
import { RoboDataTable, createDateCell, createNumericCell, createStatusCell } from '@roboborealis/components/tables';


// ---------------------------------------------------------------------------
// Mission History — 200 missions with nested mission legs (DCS pattern)
// ---------------------------------------------------------------------------

interface MissionLeg {
  id: string;
  reportType: 'FP' | 'PR' | 'DR' | 'FR';
  receivedDate: string;
  course: number;
  speed: number;
  distanceNM: number;
}

interface Mission {
  id: string;
  satellite: string;
  callsign: string;
  missionNumber: string;
  status: 'active' | 'completed' | 'cancelled';
  departurePort: string;
  arrivalPort: string;
  etd: string;
  eta: string;
  totalDistanceNM: number;
  legs: MissionLeg[];
}

const ports = ['Low Earth Orbit', 'Lunar Gateway', 'Geostationary Orbit', 'Sun-Synchronous Orbit', 'L2 Point', 'ISS', 'Mars Transfer', 'Tiangong', 'Lunar Orbit', 'Halo Orbit'];
const reportTypes: MissionLeg['reportType'][] = ['FP', 'PR', 'DR', 'FR'];

function generateMissions(count: number): Mission[] {
  return Array.from({ length: count }, (_, i) => {
    const legCount = Math.floor(Math.random() * 5) + 1;
    const legs = Array.from({ length: legCount }, (_, j) => ({
      id: `v${i}-leg${j}`,
      reportType: reportTypes[j % 4],
      receivedDate: new Date(Date.now() - (legCount - j) * 86400000 * 2 - Math.random() * 86400000).toISOString(),
      course: Math.floor(Math.random() * 360),
      speed: Math.round(Math.random() * 20 * 10) / 10,
      distanceNM: Math.round(Math.random() * 500 * 10) / 10,
    }));

    return {
      id: `mission-${i}`,
      satellite: `${['Vega', 'Rigel', 'Lyra', 'Orion'][i % 4]} ${['Sentinel', 'Probe', 'Pioneer'][Math.floor(i / 4) % 3]}`,
      callsign: `CALL${String(1000 + i)}`,
      missionNumber: `MSN-${String(2026000 + i)}`,
      status: (['active', 'completed', 'cancelled'] as const)[i % 3],
      departurePort: ports[i % 10],
      arrivalPort: ports[(i + 3) % 10],
      etd: new Date(Date.now() - Math.random() * 86400000 * 30).toISOString(),
      eta: new Date(Date.now() + Math.random() * 86400000 * 14).toISOString(),
      totalDistanceNM: Math.round(Math.random() * 5000),
      legs,
    };
  });
}

const missionHelper = createColumnHelper<Mission>();
const legHelper = createColumnHelper<MissionLeg>();

const missionColumns = [
  missionHelper.accessor('satellite', { header: 'Satellite', enableSorting: true }),
  missionHelper.accessor('callsign', { header: 'Callsign' }),
  missionHelper.accessor('missionNumber', { header: 'Mission #', enableSorting: true }),
  missionHelper.accessor('status', {
    header: 'Status',
    cell: createStatusCell<Mission>({
      colorMap: { active: 'success', completed: 'default', cancelled: 'destructive' },
      labelMap: { active: 'Active', completed: 'Completed', cancelled: 'Cancelled' },
    }),
  }),
  missionHelper.accessor('departurePort', { header: 'From', enableSorting: true }),
  missionHelper.accessor('arrivalPort', { header: 'To', enableSorting: true }),
  missionHelper.accessor('etd', {
    header: 'ETD',
    cell: createDateCell<Mission>({ formatOptions: { dateStyle: 'medium' } }),
    enableSorting: true,
  }),
  missionHelper.accessor('eta', {
    header: 'ETA',
    cell: createDateCell<Mission>({ showRelative: true }),
    enableSorting: true,
  }),
  missionHelper.accessor('totalDistanceNM', {
    header: 'Distance',
    cell: createNumericCell<Mission>({ unit: 'km' }),
    meta: { align: 'right' as const },
  }),
];

const legColumns = [
  legHelper.accessor('reportType', {
    header: 'Report Type',
    cell: createStatusCell<MissionLeg>({
      colorMap: { FP: 'primary', PR: 'success', DR: 'warning', FR: 'destructive' },
    }),
  }),
  legHelper.accessor('receivedDate', {
    header: 'Received',
    cell: createDateCell<MissionLeg>({ showRelative: true }),
  }),
  legHelper.accessor('course', {
    header: 'Course',
    cell: createNumericCell<MissionLeg>({ unit: '°' }),
    meta: { align: 'right' as const },
  }),
  legHelper.accessor('speed', {
    header: 'Speed',
    cell: createNumericCell<MissionLeg>({ unit: 'km/s', formatOptions: { maximumFractionDigits: 1 } }),
    meta: { align: 'right' as const },
  }),
  legHelper.accessor('distanceNM', {
    header: 'Distance',
    cell: createNumericCell<MissionLeg>({ unit: 'km', formatOptions: { maximumFractionDigits: 1 } }),
    meta: { align: 'right' as const },
  }),
];

export const patternMeta = {
  demonstrates: 'A two hundred-row mission history table with nested, expandable mission legs, using standard date and status cell renderers.',
  whenToUse: 'Use as the reference for a general-purpose nested master-detail table at larger row counts, when the feature does not need to match the a reference console schema exactly.',
  keywords: ['mission history', 'nested mission legs', 'expandable table', 'large row count', 'date cell', 'status cell'],
  agentPriority: 'Prioritize this pattern over DCS Routes Table when the feature needs a general nested-table pattern at scale rather than a faithful reproduction of the a reference console routes schema.',
};

const meta: Meta = {
  title: 'Showcase/Patterns/Tables/Mission History',
  excludeStories: ['patternMeta'],
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj;

export const MissionHistoryWithNestedLegs: Story = {
  render: () => {
    const data = React.useMemo(() => generateMissions(200), []);

    return (
      <RoboDataTable
        data={data}
        columns={missionColumns}
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
          const mission = row.original;
          if (mission.legs.length === 0) {
            return (
              <div className="py-2 text-sm text-[var(--muted-foreground)]">
                No mission legs recorded.
              </div>
            );
          }
          return (
            <div className="pl-8">
              <p className="mb-2 text-xs font-medium text-[var(--muted-foreground)]">
                Mission Legs ({mission.legs.length} reports)
              </p>
              <RoboDataTable
                data={mission.legs}
                columns={legColumns}
                getRowId={(leg) => leg.id}
                bordered
                aria-label={`Legs for ${mission.satellite} - ${mission.missionNumber}`}
              />
            </div>
          );
        }}
        aria-label="Mission History — 200 missions with nested legs"
      />
    );
  },
};
