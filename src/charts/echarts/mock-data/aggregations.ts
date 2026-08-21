import type { SpaceEvent, Spacecraft } from '@roboborealis/space-faker';

import type { RoboTreemapNode } from '../robo-treemap';

export function groupByField<T>(items: T[], field: keyof T): Record<string, T[]> {
  const result: Record<string, T[]> = {};
  for (const item of items) {
    const key = String(item[field]);
    if (!result[key]) result[key] = [];
    result[key].push(item);
  }
  return result;
}

export function buildConstellationHierarchy(constellation: Spacecraft[]): RoboTreemapNode[] {
  const byType = groupByField(constellation, 'spacecraftType');
  return Object.entries(byType).map(([type, craft]) => {
    const byClass = groupByField(craft, 'spacecraftClass');
    return {
      name: type,
      children: Object.entries(byClass).map(([cls, classCraft]) => {
        const byStatus = groupByField(classCraft, 'status');
        return {
          name: cls,
          children: Object.entries(byStatus).map(([status, statusCraft]) => ({
            name: status,
            value: statusCraft.length,
          })),
        };
      }),
    };
  });
}

export function aggregateByHour(events: SpaceEvent[]): { name: string; value: number }[] {
  const counts = new Array<number>(24).fill(0);
  for (const evt of events) {
    const hour = new Date(evt.timestamp).getHours();
    counts[hour]++;
  }
  return counts.map((value, h) => ({
    name: `${String(h).padStart(2, '0')}:00`,
    value,
  }));
}

export function aggregateCraftTypes(constellation: Spacecraft[]): { name: string; value: number }[] {
  const counts: Record<string, number> = {};
  for (const s of constellation) {
    counts[s.spacecraftType] = (counts[s.spacecraftType] ?? 0) + 1;
  }
  return Object.entries(counts).map(([name, value]) => ({ name, value }));
}

// Returns the ISO Monday of the week containing `date` as a YYYY-MM-DD string.
// ECharts time axis can parse date strings but not ISO week codes ("2025-W03").
function getWeekStartDate(date: Date): string {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = d.getUTCDay() || 7; // Mon=1 … Sun=7
  d.setUTCDate(d.getUTCDate() - (day - 1));
  return d.toISOString().slice(0, 10);
}

export function aggregateThemeRiver(events: SpaceEvent[]): [string, number, string][] {
  const counts: Record<string, number> = {};
  for (const evt of events) {
    const week = getWeekStartDate(new Date(evt.timestamp));
    const key = `${week}||${evt.type}`;
    counts[key] = (counts[key] ?? 0) + 1;
  }
  return Object.entries(counts)
    .map(([key, count]) => {
      const sep = key.indexOf('||');
      return [key.slice(0, sep), count, key.slice(sep + 2)] as [string, number, string];
    })
    .sort((a, b) => a[0].localeCompare(b[0]));
}

export function buildHourDayGrid(events: SpaceEvent[]): [number, number, number][] {
  // counts[hour][day]
  const counts: number[][] = Array.from({ length: 24 }, () => new Array<number>(7).fill(0));
  for (const evt of events) {
    const d = new Date(evt.timestamp);
    counts[d.getHours()][d.getDay()]++;
  }
  const result: [number, number, number][] = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let day = 0; day < 7; day++) {
      result.push([hour, day, counts[hour][day]]);
    }
  }
  return result;
}

export function buildSatelliteScatterSeries(
  constellation: Spacecraft[],
): { name: string; data: [number, number][] }[] {
  const byType = groupByField(constellation, 'spacecraftType');
  return Object.entries(byType).map(([name, craft]) => ({
    name,
    data: craft.map((s) => [s.velocityKmS, s.massKg] as [number, number]),
  }));
}

const CLUSTER_LABELS = [
  'High Velocity Low Power',
  'High Velocity High Power',
  'Low Velocity Low Power',
  'Low Velocity High Power',
];

// Fixed centroids: velocityKmS (0–8) × powerKw (0.5–84)
const CLUSTER_CENTROIDS: [number, number][] = [
  [7, 12],
  [7, 60],
  [2, 12],
  [2, 60],
];

export function computeSimpleClusters(constellation: Spacecraft[]): { name: string; data: [number, number][] }[] {
  const clusterData: [number, number][][] = Array.from({ length: 4 }, () => []);

  for (const s of constellation) {
    let minDist = Infinity;
    let nearest = 0;
    for (let i = 0; i < 4; i++) {
      const c = CLUSTER_CENTROIDS[i];
      const dx = s.velocityKmS - c[0];
      const dy = s.powerKw - c[1];
      const dist = dx * dx + dy * dy;
      if (dist < minDist) {
        minDist = dist;
        nearest = i;
      }
    }
    clusterData[nearest].push([s.velocityKmS, s.powerKw]);
  }

  return clusterData.map((data, i) => ({
    name: CLUSTER_LABELS[i] ?? `Cluster ${String.fromCharCode(65 + i)}`,
    data,
  }));
}

export function buildParallelSeries(constellation: Spacecraft[]): { name: string; data: number[][] }[] {
  const byType = groupByField(constellation, 'spacecraftType');
  return Object.entries(byType).map(([name, craft]) => ({
    name,
    data: craft.map((s) => [s.velocityKmS, s.powerKw, s.massKg, s.lengthM, s.solarPanelSpanM]),
  }));
}

export function buildIncidentScatterSeries(
  events: SpaceEvent[],
): { name: string; data: [number, number][] }[] {
  const bySeverity = groupByField(events, 'severity');
  return Object.entries(bySeverity).map(([name, evts]) => ({
    name,
    data: evts.map((evt) => [evt.position.lng, evt.position.lat] as [number, number]),
  }));
}

function countByDate(events: SpaceEvent[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const evt of events) {
    const date = evt.timestamp.slice(0, 10);
    counts[date] = (counts[date] ?? 0) + 1;
  }
  return counts;
}

export function buildCalendarScatter(events: SpaceEvent[]): [string, number][] {
  return Object.entries(countByDate(events))
    .map(([date, count]) => [date, count] as [string, number])
    .sort((a, b) => a[0].localeCompare(b[0]));
}

export function aggregateByDate(events: SpaceEvent[]): { date: string; value: number }[] {
  return Object.entries(countByDate(events))
    .map(([date, value]) => ({ date, value }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function buildSingleAxisSeries(
  constellation: Spacecraft[],
): { name: string; data: [string, number][] }[] {
  const byType = groupByField(constellation, 'spacecraftType');
  return Object.entries(byType).map(([name, craft]) => ({
    name,
    data: craft.map((s) => [s.timestamp, s.massKg] as [string, number]),
  }));
}

// ---------------------------------------------------------------------------
// Chord Diagram
// ---------------------------------------------------------------------------

export function buildChordNodes(constellation: Spacecraft[]): { name: string; value: number }[] {
  const counts: Record<string, number> = {};
  for (const s of constellation) counts[s.spacecraftType] = (counts[s.spacecraftType] ?? 0) + 1;
  return Object.entries(counts).map(([name, value]) => ({ name, value }));
}

export function buildChordLinks(
  constellation: Spacecraft[],
): { source: string; target: string; value: number }[] {
  // Co-location: craft sharing a launch site create links between their types
  const siteCraft: Record<string, string[]> = {};
  for (const s of constellation) {
    if (!siteCraft[s.launchSite]) siteCraft[s.launchSite] = [];
    siteCraft[s.launchSite].push(s.spacecraftType);
  }
  const pairCounts: Record<string, number> = {};
  for (const types of Object.values(siteCraft)) {
    for (let i = 0; i < types.length; i++) {
      for (let j = i + 1; j < types.length; j++) {
        const a = types[i] as string;
        const b = types[j] as string;
        if (a === b) continue;
        const key = [a, b].sort().join('||');
        pairCounts[key] = (pairCounts[key] ?? 0) + 1;
      }
    }
  }
  return Object.entries(pairCounts)
    .map(([key, value]) => {
      const sep = key.indexOf('||');
      return { source: key.slice(0, sep), target: key.slice(sep + 2), value };
    })
    .sort((a, b) => b.value - a.value)
    .slice(0, 24);
}

// ---------------------------------------------------------------------------
// Matrix Sparkline
// ---------------------------------------------------------------------------

const SPARKLINE_METRIC_KEYS = ['velocityKmS', 'massKg', 'powerKw', 'lengthM', 'solarPanelSpanM'] as const;
export const SPARKLINE_METRIC_LABELS = ['Velocity (km/s)', 'Mass (kg)', 'Power (kW)', 'Length (m)', 'Solar Span (m)'];

export function buildMatrixSparklineData(constellation: Spacecraft[]): {
  rows: string[];
  columns: string[];
  data: number[][][];
} {
  const byType = groupByField(constellation, 'spacecraftType');
  const rows = Object.keys(byType);
  const POINTS = 20;

  const data: number[][][] = rows.map((type) => {
    const craft = (byType[type] ?? []).sort((a, b) => a.timestamp.localeCompare(b.timestamp));
    return SPARKLINE_METRIC_KEYS.map((metric) => {
      const step = Math.max(1, Math.floor(craft.length / POINTS));
      return Array.from({ length: POINTS }, (_, i) => {
        const idx = Math.min(i * step, craft.length - 1);
        return Number(craft[idx]?.[metric] ?? 0);
      });
    });
  });

  return { rows, columns: SPARKLINE_METRIC_LABELS, data };
}

// ---------------------------------------------------------------------------
// Correlation Heatmap (Pearson)
// ---------------------------------------------------------------------------

function pearson(xs: number[], ys: number[]): number {
  const n = xs.length;
  if (n < 2) return 0;
  const mx = xs.reduce((s, x) => s + x, 0) / n;
  const my = ys.reduce((s, y) => s + y, 0) / n;
  let num = 0, dx2 = 0, dy2 = 0;
  for (let i = 0; i < n; i++) {
    const dx = (xs[i] ?? 0) - mx;
    const dy = (ys[i] ?? 0) - my;
    num += dx * dy;
    dx2 += dx * dx;
    dy2 += dy * dy;
  }
  const denom = Math.sqrt(dx2 * dy2);
  return denom === 0 ? 0 : Math.round((num / denom) * 100) / 100;
}

const CORR_KEYS = ['velocityKmS', 'massKg', 'lengthM', 'solarPanelSpanM', 'powerKw'] as const;
export const CORR_LABELS = ['Velocity', 'Mass', 'Length', 'Solar Span', 'Power'];

export function computeCorrelationMatrix(constellation: Spacecraft[]): number[][] {
  const series = CORR_KEYS.map((k) => constellation.map((s) => s[k]));
  const n = CORR_KEYS.length;
  return Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => pearson(series[i] as number[], series[j] as number[])),
  );
}

// ---------------------------------------------------------------------------
// Circle Packing
// ---------------------------------------------------------------------------

export function buildCirclePackingNodes(constellation: Spacecraft[]): {
  name: string;
  value: number;
  category: string;
}[] {
  // Sample up to 80 spacecraft for readability
  return constellation.slice(0, 80).map((s) => ({
    name: s.name,
    value: s.massKg,
    category: s.spacecraftType,
  }));
}

// ---------------------------------------------------------------------------
// Funnel Chart
// ---------------------------------------------------------------------------

export function buildReportFunnel(events: SpaceEvent[]): { name: string; value: number }[] {
  const total = events.length;
  const assigned = events.filter((e) => e.status === 'assigned' || e.status === 'resolved').length;
  const resolved = events.filter((e) => e.status === 'resolved').length;
  return [
    { name: 'Reported', value: total },
    { name: 'Triaged', value: Math.round(total * 0.92) },
    { name: 'Assigned', value: assigned },
    { name: 'Investigated', value: Math.round(assigned * 0.85) },
    { name: 'Resolved', value: resolved },
  ];
}

// ---------------------------------------------------------------------------
// Sankey Flow (Event Type -> Severity -> Status)
// ---------------------------------------------------------------------------

export function buildIncidentFlowNodes(events: SpaceEvent[]): { name: string }[] {
  const types = new Set(events.map((e) => e.type));
  const severities = new Set(events.map((e) => e.severity));
  const statuses = new Set(events.map((e) => e.status));
  return [
    ...Array.from(types).map((name) => ({ name })),
    ...Array.from(severities).map((name) => ({ name })),
    ...Array.from(statuses).map((name) => ({ name })),
  ];
}

export function buildIncidentFlowLinks(
  events: SpaceEvent[],
): { source: string; target: string; value: number }[] {
  const typeToSeverity: Record<string, number> = {};
  const severityToStatus: Record<string, number> = {};

  for (const event of events) {
    const tsKey = `${event.type}||${event.severity}`;
    typeToSeverity[tsKey] = (typeToSeverity[tsKey] ?? 0) + 1;

    const svKey = `${event.severity}||${event.status}`;
    severityToStatus[svKey] = (severityToStatus[svKey] ?? 0) + 1;
  }

  const links: { source: string; target: string; value: number }[] = [];
  for (const [key, value] of Object.entries(typeToSeverity)) {
    const [source, target] = key.split('||');
    links.push({ source: source as string, target: target as string, value });
  }
  for (const [key, value] of Object.entries(severityToStatus)) {
    const [source, target] = key.split('||');
    links.push({ source: source as string, target: target as string, value });
  }
  return links;
}
