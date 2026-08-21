import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { RoboDataFeed } from './robo-data-feed';
import { generateEntities } from '../mock-data/generate-entities';
import { RoboLoading } from '../../feedback/loading/robo-loading';
import { OverviewStack, OverviewSection } from '../../lib/storybook/overview-layout';
import type { RoboOsintEvent } from '../types';

export const componentMeta = {
  description: 'Chronological activity feed of OSINT events linked to entities',
  category: 'visualization' as const,
  keywords: ['feed', 'events', 'activity', 'timeline', 'osint', 'log', 'stream'],
  whenToUse: 'Show a real-time or historical stream of OSINT observations linked to specific entities',
  whenNotToUse: 'Use RoboTimeline for swimlane-based entity timeline; RoboEntityDossier for single-entity deep dive',
  pairsWith: ['RoboCorrelationProvider', 'RoboEntityDossier', 'RoboTimeline', 'RoboForceGraph'],
  a11y: 'Each event row has role="row"; severity indicated by color and text label',
};

// ---------------------------------------------------------------------------
// Mock events
// ---------------------------------------------------------------------------

const now = Date.now();
const entities = generateEntities();

function makeEvents(entityIds: string[]): RoboOsintEvent[] {
  const EVENT_TEMPLATES = [
    { type: 'telemetry-report', source: 'telemetry', description: 'Telemetry report received', severity: 'info' as const },
    { type: 'ground-contact', source: 'ground-network', description: 'Contact at Goldstone Ground Station', severity: 'low' as const },
    { type: 'ground-contact', source: 'ground-network', description: 'Contact at Tidbinbilla Ground Station', severity: 'low' as const },
    { type: 'optical-obs', source: 'satellite', description: 'Optical observation recorded', severity: 'medium' as const },
    { type: 'signal-loss', source: 'telemetry', description: 'Telemetry signal loss detected — potential anomaly', severity: 'high' as const },
    { type: 'rendezvous', source: 'satellite', description: 'Spacecraft conjunction warning issued', severity: 'critical' as const },
    { type: 'operator-change', source: 'registry', description: 'Operator change registered', severity: 'medium' as const },
    { type: 'adsb-report', source: 'adsb', description: 'Aircraft transponder report received', severity: 'info' as const },
  ];

  return entityIds.flatMap((entityId, ei) =>
    EVENT_TEMPLATES.slice(0, 3 + (ei % 5)).map((tmpl, ti) => ({
      id: `ev-${entityId}-${ti}`,
      entityId,
      ...tmpl,
      timestamp: now - (ei * 3 + ti) * 1_800_000,
    })),
  );
}

const events = makeEvents(entities.slice(0, 12).map((e) => e.id));

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta: Meta<typeof RoboDataFeed> = {
  title: 'Data/Visualizations/RoboDataFeed',
  excludeStories: ['componentMeta'],
  component: RoboDataFeed,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    maxItems:        { control: { type: 'number', min: 10, max: 500 } },
    focusedEntityId: { control: 'text' },
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
        <OverviewSection title='RoboDataFeed'>
          <div className='flex flex-wrap gap-6'>
            <div className='w-80'>
              <RoboDataFeed events={events} entities={entities} maxItems={50} />
            </div>
            <div className='w-80'>
              <RoboDataFeed
                events={events.filter((e) => ['high', 'critical'].includes(e.severity ?? ''))}
                entities={entities}
                maxItems={20}
              />
            </div>
          </div>
        </OverviewSection>
      </OverviewStack>
    );
  },
};

export const Default: Story = {
  args: {
    events,
    entities,
    maxItems: 50,
  },
};

export const FocusedEntity: Story = {
  name: 'Focused on Entity',
  args: {
    events,
    entities,
    focusedEntityId: entities[0].id,
    maxItems: 50,
  },
};

export const HighSeverityFeed: Story = {
  name: 'High Severity Events',
  args: {
    events: events.filter((e) => ['high', 'critical'].includes(e.severity ?? '')),
    entities,
    maxItems: 20,
  },
};

export const Empty: Story = {
  args: {
    events: [],
    entities,
  },
};
