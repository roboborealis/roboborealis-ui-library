import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { RoboForceGraph } from './robo-force-graph';
import { generateEntities } from '../mock-data/generate-entities';
import { generateRelationships } from '../mock-data/generate-relationships';
import { createTypeRegistry } from '../registry';
import { RoboLoading } from '../../feedback/loading/robo-loading';
import { OverviewStack, OverviewSection } from '../../lib/storybook/overview-layout';

export const componentMeta = {
  description: 'Force-directed graph for OSINT entity relationship topology exploration',
  category: 'visualization' as const,
  keywords: ['force', 'graph', 'network', 'topology', 'osint', 'entity', 'relationship', 'link'],
  whenToUse: 'Explore entity relationship networks — spacecraft ownership chains, comms networks, ground-contact clusters',
  whenNotToUse: 'Use RoboCorrelationMatrix for type-to-type aggregates; RoboSankeyFlowChart for flow volumes',
  pairsWith: ['RoboCorrelationProvider', 'RoboEntityDossier', 'RoboFilterPanel', 'RoboDataFeed'],
  a11y: 'Graph nodes have aria-label with entity name and type; keyboard navigation via Tab+Enter',
};

// ---------------------------------------------------------------------------
// Shared fixtures
// ---------------------------------------------------------------------------

const allEntities = generateEntities();
const allRelationships = generateRelationships(allEntities);
const registry = createTypeRegistry();

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta: Meta<typeof RoboForceGraph> = {
  title: 'Data/Visualizations/RoboForceGraph',
  excludeStories: ['componentMeta'],
  component: RoboForceGraph,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    width:  { control: { type: 'number', min: 300, max: 1200 } },
    height: { control: { type: 'number', min: 200, max: 800 } },
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
        <OverviewSection title='RoboForceGraph'>
          <div className='flex flex-col gap-6'>
            <RoboForceGraph
              entities={allEntities}
              relationships={allRelationships}
              registry={registry}
              width={900}
              height={600}
            />
          </div>
        </OverviewSection>
      </OverviewStack>
    );
  },
};

export const Default: Story = {
  args: {
    entities: allEntities.slice(0, 60),
    relationships: generateRelationships(allEntities.slice(0, 60), 'small'),
    registry,
    width: 800,
    height: 500,
  },
};

export const LargeNetwork: Story = {
  name: 'Large Network',
  args: {
    entities: allEntities,
    relationships: allRelationships,
    registry,
    width: 900,
    height: 600,
  },
};

export const SpacecraftSubgraph: Story = {
  name: 'Spacecraft Subgraph',
  args: {
    entities: allEntities.filter((e) => ['spacecraft', 'ground-station', 'company'].includes(e.type)),
    relationships: allRelationships.filter((r) => {
      const ids = new Set(
        allEntities.filter((e) => ['spacecraft', 'ground-station', 'company'].includes(e.type)).map((e) => e.id),
      );
      return ids.has(r.sourceEntityId) && ids.has(r.targetEntityId);
    }),
    registry,
    width: 800,
    height: 500,
  },
};

export const WithSelection: Story = {
  name: 'With Selected Entity',
  args: {
    entities: allEntities.slice(0, 60),
    relationships: generateRelationships(allEntities.slice(0, 60), 'sel-seed'),
    registry,
    selectedEntityIds: new Set(['spacecraft-001']),
    focusedEntityId: 'spacecraft-001',
    width: 800,
    height: 500,
  },
};
