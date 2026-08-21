// ---------------------------------------------------------------------------
// PATTERN — Information Display: Entity Dossier
//
// Demonstrates dense data visualization combining property grids, timelines,
// relationship metadata, and risk scoring into a single condensed view.
//
// Use this pattern for: intelligence entity profiles, satellite detail panels,
// personnel dossiers, or any "everything about one entity" view.
// ---------------------------------------------------------------------------

import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { RoboEntityDossier, createTypeRegistry, generateEntities, generateRelationships } from '@roboborealis/components/visualizations';
import type { RoboOsintEvent } from '@roboborealis/components/visualizations';


const REGISTRY = createTypeRegistry();
const ENTITIES = generateEntities('info-display-demo');
const RELATIONSHIPS = generateRelationships(ENTITIES, 'info-display-rels');

const MOCK_EVENTS: RoboOsintEvent[] = [
  { id: 'e1', entityId: ENTITIES[0].id, type: 'ground-contact', source: 'ground-network', timestamp: Date.now() - 86400000, description: 'Ground contact at Canberra station', severity: 'info' },
  { id: 'e2', entityId: ENTITIES[0].id, type: 'signal-loss', source: 'telemetry', timestamp: Date.now() - 43200000, description: 'Telemetry gap detected for 4 hours', severity: 'high' },
  { id: 'e3', entityId: ENTITIES[0].id, type: 'watchlist-match', source: 'osint', timestamp: Date.now() - 3600000, description: 'Potential match against restricted-operator list', severity: 'critical' },
];

export const patternMeta = {
  demonstrates: 'A dense single-entity view combining a property grid, event timeline, relationship list, and risk indicators into one condensed panel.',
  whenToUse: 'Use as the reference for any everything-about-one-entity view: an intelligence entity profile, a satellite detail panel, or a personnel dossier.',
  keywords: ['entity dossier', 'property grid', 'event timeline', 'risk score', 'relationship list', 'single entity view', 'detail panel'],
  agentPriority: 'Prioritize this pattern whenever the feature is a single-entity deep dive. For a multi-entity correlation workspace that uses this same dossier component as one panel among several, use OSINT Correlation instead.',
};

const meta: Meta<typeof RoboEntityDossier> = {
  title: 'Showcase/Patterns/Information Displays/Entity Dossier',
  component: RoboEntityDossier,
  excludeStories: ['patternMeta'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Dense information display pattern — combines property grids, event timelines, relationship lists, and risk indicators into a single panel.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof RoboEntityDossier>;

export const Default: Story = {
  render: () => (
    <div className='h-[700px] w-[400px]'>
      <RoboEntityDossier
        entity={ENTITIES[0]}
        relationships={RELATIONSHIPS.filter(
          (r) => r.sourceEntityId === ENTITIES[0].id || r.targetEntityId === ENTITIES[0].id,
        )}
        events={MOCK_EVENTS}
        allEntities={ENTITIES}
        registry={REGISTRY}
        onClose={() => alert('Close clicked')}
        onRelatedEntityClick={(id) => alert(`Navigate to entity: ${id}`)}
      />
    </div>
  ),
};

export const CustomDateFormat: Story = {
  render: () => (
    <div className='h-[700px] w-[400px]'>
      <RoboEntityDossier
        entity={ENTITIES[0]}
        relationships={RELATIONSHIPS.filter(
          (r) => r.sourceEntityId === ENTITIES[0].id || r.targetEntityId === ENTITIES[0].id,
        )}
        events={MOCK_EVENTS}
        allEntities={ENTITIES}
        registry={REGISTRY}
        formatTimestamp={(epochMs) =>
          new Date(epochMs).toISOString().replace('T', ' ').slice(0, 16) + 'Z'
        }
      />
    </div>
  ),
};
