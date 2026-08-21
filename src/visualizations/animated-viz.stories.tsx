import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';

import { RoboBubbleChart, type RoboBubbleItem } from './bubble-chart/robo-bubble-chart';
import { RoboCorrelationMatrix } from './correlation-matrix/robo-correlation-matrix';
import { RoboRadarChart, type RoboRadarAxis, type RoboRadarProfile } from './radar-chart/robo-radar-chart';
import { RoboTimeline } from './timeline/robo-timeline';
import { RoboFilterPanel } from './filter-panel/robo-filter-panel';
import { RoboEntityDossier } from './entity-dossier/robo-entity-dossier';
import type { RoboCorrelationFilters, RoboOsintEntity, RoboOsintRelationship, RoboOsintEvent } from './types';
import { createTypeRegistry } from './registry';

import { RoboCalendarBarChart } from '@/charts/echarts/robo-calendar-bar-chart';
import { RoboFadeIn } from '@/animations/primitives/robo-fade';
import { RoboStagger } from '@/animations/primitives/robo-stagger';
import { RoboInView } from '@/animations/advanced/robo-in-view';
import { Looping } from '@/animations/stories/looping-helper';

// ---------------------------------------------------------------------------

const meta: Meta = {
  title: 'Data/Animated Visualizations',
  parameters: { layout: 'padded' },
};
export default meta;

// ---------------------------------------------------------------------------
// Shared data
// ---------------------------------------------------------------------------

const BUBBLE_ITEMS: RoboBubbleItem[] = [
  { id: 'v1', label: 'Voyager 1', x: 0.8, y: 0.7, size: 0.6, color: 'var(--chart-1)', typeLabel: 'Spacecraft' },
  { id: 'v2', label: 'Orion', x: 0.3, y: 0.5, size: 0.4, color: 'var(--chart-2)', typeLabel: 'Spacecraft' },
  { id: 'c1', label: 'Orbital Dynamics', x: 0.6, y: 0.9, size: 0.8, color: 'var(--chart-3)', typeLabel: 'Company' },
  { id: 'p1', label: 'S. Ride', x: 0.2, y: 0.3, size: 0.3, color: 'var(--chart-4)', typeLabel: 'Person' },
  { id: 'p2', label: 'Goldstone Station', x: 0.9, y: 0.2, size: 0.5, color: 'var(--chart-5)', typeLabel: 'Ground Station' },
  { id: 'v3', label: 'Kepler', x: 0.45, y: 0.75, size: 0.35, color: 'var(--chart-1)', typeLabel: 'Spacecraft' },
  { id: 'c2', label: 'Nova Freight', x: 0.7, y: 0.35, size: 0.55, color: 'var(--chart-3)', typeLabel: 'Company' },
];

const RADAR_AXES: RoboRadarAxis[] = [
  { id: 'confidence', label: 'Confidence' },
  { id: 'risk', label: 'Risk Score' },
  { id: 'sources', label: 'Source Coverage' },
  { id: 'recency', label: 'Recency' },
  { id: 'relationships', label: 'Relationships' },
];

const RADAR_PROFILES: RoboRadarProfile[] = [
  {
    id: 'craft1',
    label: 'Voyager 1',
    color: 'var(--chart-1)',
    values: { confidence: 82, risk: 65, sources: 90, recency: 75, relationships: 55 },
  },
  {
    id: 'craft2',
    label: 'Orion',
    color: 'var(--chart-2)',
    values: { confidence: 45, risk: 88, sources: 60, recency: 40, relationships: 72 },
  },
];

const DEFAULT_FILTERS: RoboCorrelationFilters = {
  entityTypes: [],
  sourceTypes: [],
  severityLevels: [],
  searchQuery: '',
  dateRange: null,
  geoRegion: null,
  minConfidence: 0,
  minRiskScore: 0,
};

const ENTITY_TYPES = [
  { type: 'spacecraft', label: 'Spacecraft', color: 'var(--chart-1)', count: 30 },
  { type: 'aircraft', label: 'Aircraft', color: 'var(--chart-2)', count: 15 },
  { type: 'company', label: 'Company', color: 'var(--chart-3)', count: 10 },
  { type: 'person', label: 'Person', color: 'var(--chart-4)', count: 8 },
];

const SOURCE_TYPES = [
  { id: 'telemetry', label: 'Telemetry', color: '#06B6D4', count: 85 },
  { id: 'satellite', label: 'Optical Tracking', color: '#F59E0B', count: 62 },
  { id: 'ground-network', label: 'Ground Network', color: '#10B981', count: 38 },
];

const REGISTRY = createTypeRegistry();

const DEMO_ENTITY: RoboOsintEntity = {
  id: 'e1',
  type: 'spacecraft',
  name: 'Voyager 1',
  confidence: 0.82,
  riskScore: 65,
  firstSeen: Date.now() - 30 * 86_400_000,
  lastSeen: Date.now() - 3_600_000,
  sources: ['telemetry', 'satellite'],
  properties: {
    noradId: '25544',
    operator: 'NASA',
    massKg: '45,200',
    launchYear: '2012',
  },
};

const DEMO_RELATIONSHIPS: RoboOsintRelationship[] = [];
const DEMO_EVENTS: RoboOsintEvent[] = [];

// Matrix demo — 4 entity types with cross-relationships
const MATRIX_ENTITIES: RoboOsintEntity[] = [
  { id: 'm1', type: 'spacecraft', name: 'Voyager 1', confidence: 0.8, riskScore: 65, firstSeen: 0, lastSeen: 0, sources: ['telemetry'], properties: {} },
  { id: 'm2', type: 'spacecraft', name: 'Orion', confidence: 0.5, riskScore: 40, firstSeen: 0, lastSeen: 0, sources: ['telemetry'], properties: {} },
  { id: 'm3', type: 'company', name: 'Orbital Dynamics', confidence: 0.7, riskScore: 30, firstSeen: 0, lastSeen: 0, sources: ['osint'], properties: {} },
  { id: 'm4', type: 'company', name: 'Nova Freight', confidence: 0.6, riskScore: 20, firstSeen: 0, lastSeen: 0, sources: ['osint'], properties: {} },
  { id: 'm5', type: 'person', name: 'S. Ride', confidence: 0.9, riskScore: 75, firstSeen: 0, lastSeen: 0, sources: ['humint'], properties: {} },
  { id: 'm6', type: 'person', name: 'Y. Gagarin', confidence: 0.4, riskScore: 50, firstSeen: 0, lastSeen: 0, sources: ['humint'], properties: {} },
  { id: 'm7', type: 'aircraft', name: 'N-4421X', confidence: 0.6, riskScore: 55, firstSeen: 0, lastSeen: 0, sources: ['adsb'], properties: {} },
];
const MATRIX_RELS: RoboOsintRelationship[] = [
  { id: 'r1', sourceEntityId: 'm1', targetEntityId: 'm3', type: 'owned_by', confidence: 0.8 },
  { id: 'r2', sourceEntityId: 'm1', targetEntityId: 'm4', type: 'leased_by', confidence: 0.6 },
  { id: 'r3', sourceEntityId: 'm2', targetEntityId: 'm3', type: 'owned_by', confidence: 0.7 },
  { id: 'r4', sourceEntityId: 'm3', targetEntityId: 'm5', type: 'controlled_by', confidence: 0.9 },
  { id: 'r5', sourceEntityId: 'm4', targetEntityId: 'm6', type: 'controlled_by', confidence: 0.5 },
  { id: 'r6', sourceEntityId: 'm5', targetEntityId: 'm7', type: 'linked_to', confidence: 0.4 },
  { id: 'r7', sourceEntityId: 'm1', targetEntityId: 'm5', type: 'linked_to', confidence: 0.7 },
  { id: 'r8', sourceEntityId: 'm2', targetEntityId: 'm6', type: 'linked_to', confidence: 0.5 },
];

// Timeline demo — 5 entities with events over 7 days
const NOW = Date.now();
const DAY = 86_400_000;
const TIMELINE_ENTITIES: RoboOsintEntity[] = [
  { id: 't1', type: 'spacecraft', name: 'Voyager 1', confidence: 0.8, riskScore: 65, firstSeen: NOW - 7 * DAY, lastSeen: NOW - 2 * DAY, sources: ['telemetry'], properties: {} },
  { id: 't2', type: 'spacecraft', name: 'Orion', confidence: 0.5, riskScore: 40, firstSeen: NOW - 6 * DAY, lastSeen: NOW - 1 * DAY, sources: ['satellite'], properties: {} },
  { id: 't3', type: 'company', name: 'Orbital Dynamics', confidence: 0.7, riskScore: 30, firstSeen: NOW - 5 * DAY, lastSeen: NOW - 3 * DAY, sources: ['osint'], properties: {} },
  { id: 't4', type: 'person', name: 'J. Smith', confidence: 0.9, riskScore: 75, firstSeen: NOW - 7 * DAY, lastSeen: NOW - 0.5 * DAY, sources: ['humint'], properties: {} },
  { id: 't5', type: 'aircraft', name: 'N-4421X', confidence: 0.6, riskScore: 55, firstSeen: NOW - 4 * DAY, lastSeen: NOW - 1.5 * DAY, sources: ['adsb'], properties: {} },
];
const TIMELINE_EVENTS: RoboOsintEvent[] = [
  { id: 'ev1', entityId: 't1', timestamp: NOW - 6.5 * DAY, type: 'telemetry-alert', source: 'telemetry', description: 'Entered restricted orbit', severity: 'high' },
  { id: 'ev2', entityId: 't1', timestamp: NOW - 4 * DAY, type: 'ground-contact', source: 'ground-network', description: 'Ground contact Canberra', severity: 'info' },
  { id: 'ev3', entityId: 't1', timestamp: NOW - 2.5 * DAY, type: 'signal-loss', source: 'telemetry', description: 'Telemetry gap detected', severity: 'critical' },
  { id: 'ev4', entityId: 't2', timestamp: NOW - 5.5 * DAY, type: 'dark-period', source: 'satellite', description: 'Signal blackout started', severity: 'medium' },
  { id: 'ev5', entityId: 't2', timestamp: NOW - 3 * DAY, type: 'optical-obs', source: 'satellite', description: 'Reacquired optically', severity: 'low' },
  { id: 'ev6', entityId: 't2', timestamp: NOW - 1.5 * DAY, type: 'operator-change', source: 'osint', description: 'Operator change detected', severity: 'high' },
  { id: 'ev7', entityId: 't3', timestamp: NOW - 4.5 * DAY, type: 'corporate-event', source: 'osint', description: 'Ownership transfer', severity: 'medium' },
  { id: 'ev8', entityId: 't3', timestamp: NOW - 3.5 * DAY, type: 'corporate-event', source: 'osint', description: 'New director appointed', severity: 'low' },
  { id: 'ev9', entityId: 't4', timestamp: NOW - 6 * DAY, type: 'travel', source: 'humint', description: 'Travel to Baikonur', severity: 'info' },
  { id: 'ev10', entityId: 't4', timestamp: NOW - 3 * DAY, type: 'financial', source: 'humint', description: 'Financial transaction flagged', severity: 'high' },
  { id: 'ev11', entityId: 't4', timestamp: NOW - 0.5 * DAY, type: 'meeting', source: 'humint', description: 'Meeting with known associate', severity: 'medium' },
  { id: 'ev12', entityId: 't5', timestamp: NOW - 3.5 * DAY, type: 'flight-plan', source: 'adsb', description: 'Flight plan filed', severity: 'info' },
  { id: 'ev13', entityId: 't5', timestamp: NOW - 2 * DAY, type: 'routing-anomaly', source: 'adsb', description: 'Irregular routing detected', severity: 'critical' },
];

// Calendar bar chart — 3 months of daily incident counts
const CALENDAR_DATA: [string, number][] = (() => {
  const d: [string, number][] = [];
  const start = new Date('2025-01-01');
  for (let i = 0; i < 90; i++) {
    const dt = new Date(start.getTime() + i * DAY);
    const iso = dt.toISOString().slice(0, 10);
    // Simulate sporadic activity with some busy periods
    const val = Math.max(0, Math.round(Math.sin(i * 0.3) * 8 + Math.sin(i * 0.7) * 4 + 8));
    d.push([iso, val]);
  }
  return d;
})();

// ---------------------------------------------------------------------------
// RoboBubbleChart — bubbles pop in with spring stagger
// ---------------------------------------------------------------------------
export const BubbleChartEntrance: StoryObj = {
  name: 'RoboBubbleChart — bubble draw animation',
  render: () => (
    <Looping>
      <RoboBubbleChart
        items={BUBBLE_ITEMS}
        xLabel='Confidence'
        yLabel='Risk Score'
        sizeLabel='Relationships'
        width={420}
        height={320}
      />
    </Looping>
  ),
};

// ---------------------------------------------------------------------------
// RoboRadarChart — polygon arms expand from center
// ---------------------------------------------------------------------------
export const RadarChartEntrance: StoryObj = {
  name: 'RoboRadarChart — polygon draw animation',
  render: () => (
    <Looping>
      <RoboRadarChart
        axes={RADAR_AXES}
        profiles={RADAR_PROFILES}
        width={360}
        height={320}
      />
    </Looping>
  ),
};

// ---------------------------------------------------------------------------
// RoboCorrelationMatrix — cells cascade in
// ---------------------------------------------------------------------------
export const CorrelationMatrixEntrance: StoryObj = {
  name: 'RoboCorrelationMatrix — cell cascade animation',
  render: () => (
    <Looping>
      <div className='max-w-lg'>
        <RoboCorrelationMatrix
          entities={MATRIX_ENTITIES}
          relationships={MATRIX_RELS}
          registry={REGISTRY}
          maxCellSize={52}
        />
      </div>
    </Looping>
  ),
};

// ---------------------------------------------------------------------------
// RoboTimeline — bars grow left-to-right, dots pop in per row
// ---------------------------------------------------------------------------
export const TimelineEntrance: StoryObj = {
  name: 'RoboTimeline — bar + dot draw animation',
  render: () => (
    <Looping>
      <RoboTimeline
        entities={TIMELINE_ENTITIES}
        events={TIMELINE_EVENTS}
        width={820}
      />
    </Looping>
  ),
};

// ---------------------------------------------------------------------------
// ECharts — bars animate on mount via ECharts animationDuration theme config
// ---------------------------------------------------------------------------
export const EChartsDrawAnimation: StoryObj = {
  name: 'ECharts — calendar bar draw animation',
  render: () => (
    <Looping>
      <RoboCalendarBarChart
        data={CALENDAR_DATA}
        year={2025}
        title='Daily Incidents'
        height={220}
        animateEntrance
      />
    </Looping>
  ),
};

// ---------------------------------------------------------------------------
// RoboFilterPanel — RoboSlideIn from left, in-view trigger
// ---------------------------------------------------------------------------
function FilterPanelDemo() {
  const [filters, setFilters] = React.useState<RoboCorrelationFilters>(DEFAULT_FILTERS);

  return (
    <RoboInView once={false}>
      <RoboFilterPanel
        availableEntityTypes={ENTITY_TYPES}
        availableSources={SOURCE_TYPES}
        filters={filters}
        onFiltersChange={(partial) => setFilters((prev) => ({ ...prev, ...partial }))}
        onReset={() => setFilters(DEFAULT_FILTERS)}
        totalCount={63}
        filteredCount={63 - filters.entityTypes.length * 5}
      />
    </RoboInView>
  );
}

export const FilterPanelEntrance: StoryObj = {
  name: 'RoboFilterPanel — in-view entrance',
  render: () => (
    <div className='max-w-xs'>
      <FilterPanelDemo />
    </div>
  ),
};

// ---------------------------------------------------------------------------
// RoboEntityDossier — RoboStagger panels
// ---------------------------------------------------------------------------
export const EntityDossierEntrance: StoryObj = {
  name: 'RoboEntityDossier — fade entrance',
  render: () => (
    <Looping>
      <RoboFadeIn preset='standard' slideY={16}>
        <RoboEntityDossier
          entity={DEMO_ENTITY}
          relationships={DEMO_RELATIONSHIPS}
          events={DEMO_EVENTS}
          allEntities={[DEMO_ENTITY]}
          registry={REGISTRY}
          onClose={() => undefined}
        />
      </RoboFadeIn>
    </Looping>
  ),
};

// ---------------------------------------------------------------------------
// All SVG visualizations — side-by-side stagger overview
// ---------------------------------------------------------------------------
export const VisualizationsOverview: StoryObj = {
  name: 'All visualizations — stagger overview',
  render: () => (
    <Looping>
      <RoboStagger className='flex flex-wrap gap-6 items-start'>
        <RoboBubbleChart
          items={BUBBLE_ITEMS}
          xLabel='Confidence'
          yLabel='Risk Score'
          sizeLabel='Relationships'
          width={300}
          height={240}
        />
        <RoboRadarChart
          axes={RADAR_AXES}
          profiles={RADAR_PROFILES}
          width={280}
          height={240}
        />
      </RoboStagger>
    </Looping>
  ),
};
