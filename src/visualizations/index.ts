// @roboborealis/components/visualizations — Data visualization components
//
// Usage: import { RoboCorrelationProvider, RoboForceGraph } from '@roboborealis/components/visualizations';

// ---------- Core types ----------

export type {
  RoboEntityType,
  RoboRelationshipType,
  RoboOsintSeverity,
  RoboOsintEntity,
  RoboOsintRelationship,
  RoboOsintEvent,
  RoboDataSourceConfig,
  RoboCorrelationFilters,
} from './types';

// ---------- Registry ----------

export { createTypeRegistry } from './registry';
export type {
  RoboTypeRegistry,
  RoboEntityTypeConfig,
  RoboRelationshipTypeConfig,
} from './registry';

// ---------- Correlation Provider (context + state) ----------

export { RoboCorrelationContext, RoboCorrelationProvider, useRoboCorrelation } from './correlation-provider';
export type { RoboCorrelationContextValue, RoboCorrelationProviderProps } from './correlation-provider';

// ---------- Filter Panel ----------

export { RoboFilterPanel } from './filter-panel';
export type { RoboFilterPanelProps } from './filter-panel';

// ---------- Data Feed ----------

export { RoboDataFeed } from './data-feed';
export type { RoboDataFeedProps } from './data-feed';

// ---------- Force Graph ----------

export { RoboForceGraph } from './force-graph';
export type { RoboForceGraphProps } from './force-graph';

// ---------- Entity Dossier ----------

export { RoboEntityDossier, RoboDossierPropertyGrid, formatKey, formatValue } from './entity-dossier';
export type { RoboEntityDossierProps, RoboDossierPropertyGridProps } from './entity-dossier';

// ---------- Correlation Matrix ----------

export { RoboCorrelationMatrix } from './correlation-matrix';
export type { RoboCorrelationMatrixProps } from './correlation-matrix';

// ---------- Timeline ----------

export { RoboTimeline } from './timeline';
export type { RoboTimelineProps, RoboTimelineLane, RoboTimelineItem } from './timeline';

// ---------- Bubble Chart ----------

export { RoboBubbleChart } from './bubble-chart';
export type { RoboBubbleChartProps, RoboBubbleItem } from './bubble-chart';

// ---------- Radar Chart ----------

export { RoboRadarChart } from './radar-chart';
export type { RoboRadarChartProps, RoboRadarAxis, RoboRadarProfile } from './radar-chart';

// ---------- Token resolution (for SVG viz colours) ----------
//
// The SVG visualizations accept `var(--token)` colour strings directly. Use
// these only when you need a *resolved* concrete colour. Sourced from the
// standalone `charts/utils` module (no ECharts dependency).

export { getChartColor, resolveToken } from '@/charts/utils';

// ---------- Mock data (for testing & Storybook) ----------

export { generateEntities, generateRelationships, createRng } from './mock-data';
export type { SeededRng } from './mock-data';
