import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { RoboCorrelationProvider, useRoboCorrelation } from './robo-correlation-provider';
import { RoboForceGraph } from '../force-graph/robo-force-graph';
import { RoboFilterPanel } from '../filter-panel/robo-filter-panel';
import { RoboDataFeed } from '../data-feed/robo-data-feed';
import { generateEntities } from '../mock-data/generate-entities';
import { generateRelationships } from '../mock-data/generate-relationships';
import { createTypeRegistry } from '../registry';
import { RoboLoading } from '../../feedback/loading/robo-loading';
import { OverviewStack, OverviewSection } from '../../lib/storybook/overview-layout';
import type { RoboOsintEvent } from '../types';

export const componentMeta = {
  description: 'State management context provider that wires OSINT entities, relationships, events, filters, and selection together',
  category: 'visualization' as const,
  keywords: ['provider', 'context', 'osint', 'correlation', 'state', 'filter', 'selection', 'focus'],
  whenToUse: 'Wrap any OSINT visualization page to provide shared filter + selection state across ForceGraph, DataFeed, FilterPanel, and EntityDossier',
  whenNotToUse: 'Do not use if you only need a single standalone chart — RoboCorrelationProvider is for multi-component OSINT workspaces',
  pairsWith: ['RoboForceGraph', 'RoboDataFeed', 'RoboFilterPanel', 'RoboEntityDossier', 'RoboCorrelationMatrix'],
  a11y: 'The provider itself renders no UI — accessibility requirements come from child components',
};

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const entities = generateEntities();
const relationships = generateRelationships(entities);
const registry = createTypeRegistry();

const now = Date.now();
const HOUR = 3_600_000;
const events: RoboOsintEvent[] = entities.slice(0, 15).flatMap((e, i) => [
  { id: `ev-${i}-a`, entityId: e.id, type: 'telemetry-report', source: 'telemetry', description: `${e.type} observation`, severity: 'info' as const, timestamp: now - i * 2 * HOUR },
  { id: `ev-${i}-b`, entityId: e.id, type: 'optical-obs', source: 'satellite', description: 'Optical observation', severity: i % 5 === 0 ? 'high' as const : 'low' as const, timestamp: now - i * 3 * HOUR },
]);

// ---------------------------------------------------------------------------
// Consumer component — reads from context to show integration
// ---------------------------------------------------------------------------

function CorrelationWorkspace() {
  const { filteredEntities, filteredRelationships, filters, actions } = useRoboCorrelation();

  const entityTypes = React.useMemo(() => {
    const counts = new Map<string, number>();
    filteredEntities.forEach((e) => counts.set(e.type, (counts.get(e.type) ?? 0) + 1));
    return Array.from(counts.entries()).map(([type, count]) => ({
      type, count,
      label: type.charAt(0).toUpperCase() + type.slice(1),
      color: 'var(--chart-1)',
    }));
  }, [filteredEntities]);

  return (
    <div className='flex gap-4 h-[600px]'>
      <div className='w-64 shrink-0 overflow-y-auto border border-[var(--border)] rounded-lg p-3'>
        <RoboFilterPanel
          availableEntityTypes={entityTypes}
          availableSources={[
            { id: 'telemetry', label: 'Telemetry', color: 'var(--chart-2)', count: 85 },
            { id: 'satellite', label: 'Optical Tracking', color: 'var(--chart-3)', count: 62 },
          ]}
          filters={filters}
          onFiltersChange={actions.setFilters}
          onReset={actions.resetFilters}
          totalCount={entities.length}
          filteredCount={filteredEntities.length}
        />
      </div>
      <div className='flex-1 min-w-0'>
        <RoboForceGraph
          entities={filteredEntities.slice(0, 30)}
          relationships={filteredRelationships}
          registry={registry}
          onEntityClick={(e) => actions.focusEntity(e.id)}
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta: Meta<typeof RoboCorrelationProvider> = {
  title: 'Data/Visualizations/RoboCorrelationProvider',
  excludeStories: ['componentMeta'],
  component: RoboCorrelationProvider,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj<typeof meta>;

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

export const AllVariants: Story = {
  name: 'All Variants',
  render: () => {
    const [ready, setReady] = React.useState(false);
    React.useEffect(() => {
      const t = setTimeout(() => setReady(true), 1200);
      return () => clearTimeout(t);
    }, []);
    if (!ready) return <RoboLoading />;
    return (
      <OverviewStack>
        <OverviewSection title='RoboCorrelationProvider'>
          <div className='p-4'>
            <RoboCorrelationProvider entities={entities} relationships={relationships} events={events}>
              <CorrelationWorkspace />
            </RoboCorrelationProvider>
          </div>
        </OverviewSection>
      </OverviewStack>
    );
  },
};

export const Default: Story = {
  name: 'Integrated Workspace',
  render: () => (
    <div className='p-4'>
      <RoboCorrelationProvider entities={entities} relationships={relationships} events={events}>
        <CorrelationWorkspace />
      </RoboCorrelationProvider>
    </div>
  ),
};

export const WithDefaultFilters: Story = {
  name: 'Pre-filtered (Spacecraft + Stations)',
  render: () => (
    <div className='p-4'>
      <RoboCorrelationProvider
        entities={entities}
        relationships={relationships}
        defaultFilters={{ entityTypes: ['spacecraft', 'ground-station'] }}
      >
        <CorrelationWorkspace />
      </RoboCorrelationProvider>
    </div>
  ),
};

export const DataFeedIntegration: Story = {
  name: 'With Data Feed',
  render: () => {
    function FeedWorkspace() {
      const { filteredEntities, focusedEntityId, actions } = useRoboCorrelation();
      return (
        <div className='flex gap-4'>
          <RoboForceGraph
            entities={filteredEntities.slice(0, 20)}
            relationships={relationships}
            registry={registry}
            focusedEntityId={focusedEntityId}
            onEntityClick={(e) => actions.focusEntity(e.id)}
            width={600}
            height={400}
          />
          <div className='w-80'>
            <RoboDataFeed
              events={events}
              entities={filteredEntities}
              focusedEntityId={focusedEntityId}
              onEntityClick={(id) => actions.focusEntity(id)}
            />
          </div>
        </div>
      );
    }
    return (
      <div className='p-4'>
        <RoboCorrelationProvider entities={entities} relationships={relationships} events={events}>
          <FeedWorkspace />
        </RoboCorrelationProvider>
      </div>
    );
  },
};
