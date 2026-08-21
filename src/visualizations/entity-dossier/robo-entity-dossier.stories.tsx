import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { RoboEntityDossier } from './robo-entity-dossier';
import { generateEntities } from '../mock-data/generate-entities';
import { generateRelationships } from '../mock-data/generate-relationships';
import { createTypeRegistry } from '../registry';
import { RoboLoading } from '../../feedback/loading/robo-loading';
import { OverviewStack, OverviewSection } from '../../lib/storybook/overview-layout';
import type { RoboOsintEvent } from '../types';

export const componentMeta = {
  description: 'Detailed single-entity dossier panel with properties, relationships, and event history',
  category: 'visualization' as const,
  keywords: ['dossier', 'entity', 'detail', 'panel', 'relationships', 'events', 'osint', 'intelligence'],
  whenToUse: 'Display a deep-dive view of a selected entity — properties, connected entities, event history',
  whenNotToUse: 'Use RoboDataFeed for a multi-entity event stream; RoboForceGraph for relationship topology',
  pairsWith: ['RoboForceGraph', 'RoboDataFeed', 'RoboTimeline', 'RoboCorrelationProvider'],
  a11y: 'Accordion sections are keyboard accessible; confidence and risk scores have text alternatives',
};

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const now = Date.now();
const allEntities = generateEntities();
const allRelationships = generateRelationships(allEntities);
const registry = createTypeRegistry();

const satellite = allEntities.find((e) => e.type === 'spacecraft')!;
const person = allEntities.find((e) => e.type === 'person')!;

const craftEvents: RoboOsintEvent[] = [
  { id: 'ev-1', entityId: satellite.id, type: 'telemetry-report', source: 'telemetry', description: 'Telemetry report received in low Earth orbit', severity: 'info', timestamp: now - 3_600_000 },
  { id: 'ev-2', entityId: satellite.id, type: 'ground-contact', source: 'ground-network', description: 'Contact at Goldstone Ground Station', severity: 'low', timestamp: now - 86_400_000 },
  { id: 'ev-3', entityId: satellite.id, type: 'signal-loss', source: 'telemetry', description: 'Telemetry lost for 6 hours — potential anomaly', severity: 'high', timestamp: now - 3 * 86_400_000 },
  { id: 'ev-4', entityId: satellite.id, type: 'rendezvous', source: 'satellite', description: 'Spacecraft conjunction warning issued', severity: 'critical', timestamp: now - 5 * 86_400_000 },
];

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta: Meta<typeof RoboEntityDossier> = {
  title: 'Data/Visualizations/RoboEntityDossier',
  excludeStories: ['componentMeta'],
  component: RoboEntityDossier,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    onClose: { action: 'closed' },
    onRelatedEntityClick: { action: 'relatedEntityClicked' },
  },
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
        <OverviewSection title='RoboEntityDossier'>
          <div className='flex flex-wrap items-start gap-6'>
            <div className='w-[360px]'>
              <RoboEntityDossier
                entity={satellite}
                relationships={allRelationships.filter(
                  (r) => r.sourceEntityId === satellite.id || r.targetEntityId === satellite.id,
                )}
                events={craftEvents}
                allEntities={allEntities}
                registry={registry}
                formatTimestamp={(ms) => new Date(ms).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
              />
            </div>
            <div className='w-[360px]'>
              <RoboEntityDossier
                entity={{ ...satellite, riskScore: 92, confidence: 0.85 }}
                relationships={allRelationships.filter(
                  (r) => r.sourceEntityId === satellite.id || r.targetEntityId === satellite.id,
                )}
                events={craftEvents}
                allEntities={allEntities}
                registry={registry}
              />
            </div>
          </div>
        </OverviewSection>
      </OverviewStack>
    );
  },
};

export const SpacecraftEntity: Story = {
  name: 'Spacecraft Entity',
  args: {
    entity: satellite,
    relationships: allRelationships.filter(
      (r) => r.sourceEntityId === satellite.id || r.targetEntityId === satellite.id,
    ),
    events: craftEvents,
    allEntities,
    registry,
    formatTimestamp: (ms) => new Date(ms).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }),
  },
};

export const PersonEntity: Story = {
  name: 'Person Entity',
  args: {
    entity: person,
    relationships: allRelationships.filter(
      (r) => r.sourceEntityId === person.id || r.targetEntityId === person.id,
    ),
    events: [],
    allEntities,
    registry,
  },
};

export const HighRisk: Story = {
  name: 'High Risk Entity',
  args: {
    entity: { ...satellite, riskScore: 92, confidence: 0.85 },
    relationships: allRelationships.filter(
      (r) => r.sourceEntityId === satellite.id || r.targetEntityId === satellite.id,
    ),
    events: craftEvents,
    allEntities,
    registry,
  },
};

export const NoRelationships: Story = {
  name: 'Isolated Entity',
  args: {
    entity: allEntities.find((e) => e.type === 'ground-station')!,
    relationships: [],
    events: [],
    allEntities,
    registry,
  },
};

/**
 * Demonstrates `maxHeight` — the dossier shrinks to fit its content, and
 * collapsing an accordion section shrinks the whole card instead of leaving
 * empty space below (the bug this prop fixes: a hardcoded `height` on a
 * consumer's wrapper div previously forced the dossier to stay tall
 * regardless of which sections were expanded). The dashed box is just a
 * visual reference for the `maxHeight` cap — the dossier never grows past
 * it, but shrinks freely below it.
 */
export const ShrinkToFit: Story = {
  name: 'Shrink to fit (maxHeight)',
  render: () => (
    <div
      style={{
        maxHeight: '76vh',
        width: 360,
        border: '1px dashed var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: 2,
      }}
    >
      <RoboEntityDossier
        entity={satellite}
        relationships={allRelationships.filter(
          (r) => r.sourceEntityId === satellite.id || r.targetEntityId === satellite.id,
        )}
        events={craftEvents}
        allEntities={allEntities}
        registry={registry}
        maxHeight="76vh"
      />
    </div>
  ),
};

/**
 * Demonstrates `layout="tabs"` — the header (icon/name/badges/confidence/
 * risk) stays static, and everything else becomes 4 tabs ordered by
 * relevance: Events & Relationships, More Data, Data Sources, Advanced.
 * The fixture is enriched with `position`/`iconKey` on the entity and
 * `strength`/`metadata` on a relationship plus `metadata` on an event so
 * all 4 tabs have real content — those fields aren't shown anywhere in the
 * default `accordion` layout.
 */
export const Tabbed: Story = {
  name: 'Tabbed Layout',
  args: {
    entity: {
      ...satellite,
      position: { lat: 35.43, lng: -116.9 },
      iconKey: 'SFGPUCF----K',
    },
    relationships: allRelationships
      .filter((r) => r.sourceEntityId === satellite.id || r.targetEntityId === satellite.id)
      .map((r, i) => (i === 0 ? { ...r, strength: 0.6, metadata: { registryCountry: 'US' } } : r)),
    events: craftEvents.map((e, i) => (i === 0 ? { ...e, metadata: { antenna: 'DSS-14' } } : e)),
    allEntities,
    registry,
    layout: 'tabs',
  },
};
