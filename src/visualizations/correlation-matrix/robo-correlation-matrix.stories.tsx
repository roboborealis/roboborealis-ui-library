import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { RoboCorrelationMatrix } from './robo-correlation-matrix';
import { generateEntities } from '../mock-data/generate-entities';
import { generateRelationships } from '../mock-data/generate-relationships';
import { createTypeRegistry } from '../registry';
import { RoboLoading } from '../../feedback/loading/robo-loading';
import { OverviewStack, OverviewSection } from '../../lib/storybook/overview-layout';

export const componentMeta = {
  description: 'Heat-map matrix showing relationship counts between entity type pairs',
  category: 'visualization' as const,
  keywords: ['matrix', 'heatmap', 'correlation', 'relationships', 'entity', 'osint', 'type'],
  whenToUse: 'Reveal which entity type combinations have the most relationships in a dataset',
  whenNotToUse: 'Use RoboForceGraph to explore individual relationships; RoboSankeyFlowChart for flow volumes',
  pairsWith: ['RoboForceGraph', 'RoboSankeyFlowChart', 'RoboCorrelationProvider', 'RoboFilterPanel'],
  a11y: 'Each cell has aria-label with source type, target type, and relationship count',
};

// ---------------------------------------------------------------------------
// Shared fixtures
// ---------------------------------------------------------------------------

const entities = generateEntities();
const relationships = generateRelationships(entities);
const registry = createTypeRegistry();

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta: Meta<typeof RoboCorrelationMatrix> = {
  title: 'Data/Visualizations/RoboCorrelationMatrix',
  excludeStories: ['componentMeta'],
  component: RoboCorrelationMatrix,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    maxCellSize: { control: { type: 'number', min: 24, max: 96 } },
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
        <OverviewSection title='RoboCorrelationMatrix'>
          <div className='flex flex-wrap items-start gap-6'>
            <RoboCorrelationMatrix entities={entities} relationships={relationships} registry={registry} maxCellSize={48} />
            <RoboCorrelationMatrix entities={entities} relationships={relationships} registry={registry} maxCellSize={28} />
          </div>
        </OverviewSection>
      </OverviewStack>
    );
  },
};

export const Default: Story = {
  args: {
    entities,
    relationships,
    registry,
    maxCellSize: 48,
  },
};

export const SmallCells: Story = {
  args: {
    entities,
    relationships,
    registry,
    maxCellSize: 28,
  },
};

export const FewEntities: Story = {
  name: 'Small Dataset',
  args: {
    entities: entities.slice(0, 60),
    relationships: generateRelationships(entities.slice(0, 60), 'small'),
    registry,
  },
};
