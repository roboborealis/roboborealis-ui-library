import {
  makeConstellation,
  makeEventHistory,
  makeStationList,
} from '@roboborealis/space-faker';
import type { SpaceEvent, Spacecraft, Station } from '@roboborealis/space-faker';

import type { RoboTreemapNode } from '../robo-treemap';

import {
  aggregateByDate,
  aggregateByHour,
  aggregateThemeRiver,
  aggregateCraftTypes,
  buildCalendarScatter,
  buildChordLinks,
  buildChordNodes,
  buildCirclePackingNodes,
  buildConstellationHierarchy,
  buildHourDayGrid,
  buildIncidentFlowLinks,
  buildIncidentFlowNodes,
  buildIncidentScatterSeries,
  buildMatrixSparklineData,
  buildParallelSeries,
  buildReportFunnel,
  buildSingleAxisSeries,
  buildSatelliteScatterSeries,
  CORR_LABELS,
  computeCorrelationMatrix,
  computeSimpleClusters,
} from './aggregations';

export interface RoboChartDataset {
  constellation: Spacecraft[];
  incidents: SpaceEvent[];
  ports: Station[];

  satelliteScatterSeries: { name: string; data: [number, number][] }[];
  incidentScatterSeries: { name: string; data: [number, number][] }[];
  satelliteClusterSeries: { name: string; data: [number, number][] }[];

  satelliteSingleAxisSeries: { name: string; data: [string, number][] }[];

  constellationReadinessPct: number;
  incidentResolutionPct: number;

  constellationHierarchy: RoboTreemapNode[];

  incidentThemeRiver: [string, number, string][];

  incidentsByHour: { name: string; value: number }[];
  satelliteTypeDistribution: { name: string; value: number }[];

  incidentHourDayGrid: [number, number, number][];

  incidentsByDate: { date: string; value: number }[];
  incidentCalendarScatter: [string, number][];

  satelliteParallelSeries: { name: string; data: number[][] }[];

  // Chord diagram
  chordNodes: { name: string; value: number }[];
  chordLinks: { source: string; target: string; value: number }[];

  // Sankey flow chart
  incidentFlowNodes: { name: string }[];
  incidentFlowLinks: { source: string; target: string; value: number }[];

  // Matrix sparkline
  matrixSparkline: { rows: string[]; columns: string[]; data: number[][][] };

  // Correlation heatmap
  satelliteCorrelationLabels: string[];
  satelliteCorrelationMatrix: number[][];

  // Circle packing
  circlePackingNodes: { name: string; value: number; category: string }[];

  // Funnel chart
  reportFunnel: { name: string; value: number }[];
}

export function createRoboChartDataset(seed = 42): RoboChartDataset {
  const constellation = makeConstellation(200, seed);
  const incidents = makeEventHistory(500, 365, seed);
  const ports = makeStationList();

  const inOrbitCount = constellation.filter((s) => s.status === 'in-orbit').length;
  const constellationReadinessPct = Math.round((inOrbitCount / constellation.length) * 100);
  const incidentResolutionPct = 60 + (seed % 31);

  return {
    constellation,
    incidents,
    ports,

    satelliteScatterSeries: buildSatelliteScatterSeries(constellation),
    incidentScatterSeries: buildIncidentScatterSeries(incidents),
    satelliteClusterSeries: computeSimpleClusters(constellation),
    satelliteSingleAxisSeries: buildSingleAxisSeries(constellation),

    constellationReadinessPct,
    incidentResolutionPct,

    constellationHierarchy: buildConstellationHierarchy(constellation),

    incidentThemeRiver: aggregateThemeRiver(incidents),

    incidentsByHour: aggregateByHour(incidents),
    satelliteTypeDistribution: aggregateCraftTypes(constellation),

    incidentHourDayGrid: buildHourDayGrid(incidents),

    incidentsByDate: aggregateByDate(incidents),
    incidentCalendarScatter: buildCalendarScatter(incidents),

    satelliteParallelSeries: buildParallelSeries(constellation),

    chordNodes: buildChordNodes(constellation),
    chordLinks: buildChordLinks(constellation),

    incidentFlowNodes: buildIncidentFlowNodes(incidents),
    incidentFlowLinks: buildIncidentFlowLinks(incidents),

    matrixSparkline: buildMatrixSparklineData(constellation),

    satelliteCorrelationLabels: CORR_LABELS,
    satelliteCorrelationMatrix: computeCorrelationMatrix(constellation),

    circlePackingNodes: buildCirclePackingNodes(constellation),

    reportFunnel: buildReportFunnel(incidents),
  };
}

export const CHART_DATASET: RoboChartDataset = createRoboChartDataset(42);
