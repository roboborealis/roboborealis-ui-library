// ---------------------------------------------------------------------------
// PATTERN — Information Display: Object Dossier
//
// Demonstrates dense data visualization combining property grids, timelines,
// relationship metadata, and status scoring into a single condensed view —
// here, an "everything about one deep-sky object" panel.
//
// Use this pattern for: object detail panels, observation-history dossiers,
// or any "everything about one entity" view.
// ---------------------------------------------------------------------------

import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { RoboEntityDossier, createTypeRegistry } from '@roboborealis/components/visualizations';
import type { RoboOsintEntity, RoboOsintEvent, RoboOsintRelationship } from '@roboborealis/components/visualizations';


const REGISTRY = createTypeRegistry();

const HOUR = 3_600_000;
const DAY = 86_400_000;
const now = Date.now();

// A hand-built astronomy knowledge graph centered on M31 (Andromeda Galaxy).
const ENTITIES: RoboOsintEntity[] = [
  {
    id: 'obj-m31',
    type: 'galaxy',
    name: 'M31 — Andromeda Galaxy',
    aliases: ['NGC 224', 'Andromeda Galaxy'],
    sources: ['optical-survey', 'photometry', 'catalog'],
    confidence: 0.98,
    firstSeen: now - 400 * DAY,
    lastSeen: now - 2 * HOUR,
    properties: {
      catalog: 'Messier 31 / NGC 224',
      type: 'Spiral Galaxy (SA(s)b)',
      constellation: 'Andromeda',
      ra: '00h 42m 44s',
      dec: '+41° 16′ 09″',
      magnitude: 3.44,
      distance: '2.54M ly',
      size: '3.2° × 1.0°',
      discovered: 'Al-Sufi, 964 AD',
    },
  },
  {
    id: 'obj-m32',
    type: 'galaxy',
    name: 'M32',
    aliases: ['NGC 221'],
    sources: ['optical-survey'],
    confidence: 0.95,
    firstSeen: now - 380 * DAY,
    lastSeen: now - 3 * DAY,
    properties: { type: 'Dwarf Elliptical', constellation: 'Andromeda', magnitude: 8.1 },
  },
  {
    id: 'obj-m110',
    type: 'galaxy',
    name: 'M110',
    aliases: ['NGC 205'],
    sources: ['optical-survey'],
    confidence: 0.94,
    firstSeen: now - 370 * DAY,
    lastSeen: now - 5 * DAY,
    properties: { type: 'Dwarf Elliptical', constellation: 'Andromeda', magnitude: 8.9 },
  },
  {
    id: 'grp-local',
    type: 'region',
    name: 'Local Group',
    sources: ['catalog'],
    confidence: 0.99,
    firstSeen: now - 400 * DAY,
    lastSeen: now - 1 * DAY,
    properties: { members: '~80 galaxies', diameter: '~10M ly' },
  },
  {
    id: 'fac-palomar',
    type: 'facility',
    name: 'Palomar Observatory',
    sources: ['registry'],
    confidence: 1,
    firstSeen: now - 400 * DAY,
    lastSeen: now - 2 * HOUR,
    properties: { instrument: 'Hale 5m', site: 'California' },
  },
];

const RELATIONSHIPS: RoboOsintRelationship[] = [
  { id: 'r1', sourceEntityId: 'obj-m31', targetEntityId: 'obj-m32', type: 'satellite-galaxy', confidence: 0.97, source: 'catalog', firstSeen: now - 380 * DAY, lastSeen: now - 3 * DAY, label: 'satellite galaxy' },
  { id: 'r2', sourceEntityId: 'obj-m31', targetEntityId: 'obj-m110', type: 'satellite-galaxy', confidence: 0.96, source: 'catalog', firstSeen: now - 370 * DAY, lastSeen: now - 5 * DAY, label: 'satellite galaxy' },
  { id: 'r3', sourceEntityId: 'obj-m31', targetEntityId: 'grp-local', type: 'member-of', confidence: 0.99, source: 'catalog', firstSeen: now - 400 * DAY, lastSeen: now - 1 * DAY, label: 'member of' },
  { id: 'r4', sourceEntityId: 'obj-m31', targetEntityId: 'fac-palomar', type: 'observed-from', confidence: 0.9, source: 'observatory', firstSeen: now - 30 * DAY, lastSeen: now - 2 * HOUR, label: 'observed from' },
];

const MOCK_EVENTS: RoboOsintEvent[] = [
  { id: 'e1', entityId: 'obj-m31', type: 'optical-obs', source: 'observatory', timestamp: now - DAY, description: 'Wide-field image captured at Palomar 5m', severity: 'info' },
  { id: 'e2', entityId: 'obj-m31', type: 'photometry', source: 'photometry', timestamp: now - 12 * HOUR, description: 'Photometry gap — cloud cover over site for 4 hours', severity: 'high' },
  { id: 'e3', entityId: 'obj-m31', type: 'transient', source: 'survey', timestamp: now - HOUR, description: 'Candidate nova flagged in outer disk for follow-up', severity: 'critical' },
];

const THIS_ENTITY = ENTITIES[0];
const RELS_FOR_ENTITY = RELATIONSHIPS.filter(
  (r) => r.sourceEntityId === THIS_ENTITY.id || r.targetEntityId === THIS_ENTITY.id,
);

export const patternMeta = {
  demonstrates: 'A dense single-entity view combining a property grid, event timeline, relationship list, and status indicators into one condensed panel.',
  whenToUse: 'Use as the reference for any everything-about-one-entity view: a deep-sky object detail panel, an observation-history dossier, or an instrument profile.',
  keywords: ['object dossier', 'property grid', 'event timeline', 'status score', 'relationship list', 'single entity view', 'detail panel'],
  agentPriority: 'Prioritize this pattern whenever the feature is a single-entity deep dive that combines a property grid, timeline, and related-items list in one panel.',
};

const meta: Meta<typeof RoboEntityDossier> = {
  title: 'Showcase/Patterns/Information Displays/Object Dossier',
  component: RoboEntityDossier,
  excludeStories: ['patternMeta'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Dense information display pattern — combines property grids, event timelines, relationship lists, and status indicators into a single panel.',
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
        entity={THIS_ENTITY}
        relationships={RELS_FOR_ENTITY}
        events={MOCK_EVENTS}
        allEntities={ENTITIES}
        registry={REGISTRY}
        onClose={() => alert('Close clicked')}
        onRelatedEntityClick={(id) => alert(`Navigate to object: ${id}`)}
      />
    </div>
  ),
};

export const CustomDateFormat: Story = {
  render: () => (
    <div className='h-[700px] w-[400px]'>
      <RoboEntityDossier
        entity={THIS_ENTITY}
        relationships={RELS_FOR_ENTITY}
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
