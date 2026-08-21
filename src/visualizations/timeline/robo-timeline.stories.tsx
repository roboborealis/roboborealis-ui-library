import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { RoboTimeline } from './robo-timeline';
import type { RoboTimelineLane, RoboTimelineItem } from './robo-timeline';
import { generateEntities } from '../mock-data/generate-entities';
import { RoboLoading } from '../../feedback/loading/robo-loading';
import { OverviewStack, OverviewSection } from '../../lib/storybook/overview-layout';
import type { RoboOsintEvent } from '../types';

export const componentMeta = {
  description: 'Swimlane timeline: events plotted on a shared time axis. Accepts a domain-neutral shape (lanes/items) or the OSINT shape (entities/events).',
  category: 'visualization' as const,
  keywords: ['timeline', 'swimlane', 'events', 'temporal', 'lanes', 'milestones', 'finance', 'osint', 'dark-period', 'activity'],
  whenToUse: 'Show when things were active across lanes, spot gaps, and correlate events on one time axis. Use lanes/items for non-OSINT data (finance, ops, project milestones).',
  whenNotToUse: 'Use RoboDataFeed for a flat event log; RoboEntityDossier for single-entity detail',
  pairsWith: ['RoboDataFeed', 'RoboCorrelationProvider', 'RoboFilterPanel', 'RoboEntityDossier'],
  a11y: 'SVG has role="img"; set ariaLabel to describe the timeline. Each dot exposes a <title> with lane label, time, and description.',
  ssr: 'Client component — import via next/dynamic with { ssr: false } in the Next.js App Router.',
};

// ---------------------------------------------------------------------------
// Mock events
// ---------------------------------------------------------------------------

const now = Date.now();
const HOUR = 3_600_000;
const DAY = 86_400_000;

const entities = generateEntities().filter((e) => e.type === 'spacecraft').slice(0, 8);

function makeEventsForEntities(): RoboOsintEvent[] {
  const TYPES = [
    { type: 'telemetry-report', source: 'telemetry', severity: 'info' as const },
    { type: 'ground-contact', source: 'ground-network', severity: 'low' as const },
    { type: 'signal-loss', source: 'telemetry', severity: 'high' as const },
    { type: 'optical-obs', source: 'satellite', severity: 'medium' as const },
    { type: 'rendezvous', source: 'satellite', severity: 'critical' as const },
  ];

  return entities.flatMap((entity, ei) => {
    const baseOffset = ei * 4 * HOUR;
    return TYPES.slice(0, 2 + (ei % 3) + 1).map((tmpl, ti) => ({
      id: `ev-${entity.id}-${ti}`,
      entityId: entity.id,
      ...tmpl,
      description: `${tmpl.type} for ${entity.name}`,
      timestamp: now - baseOffset - ti * 6 * HOUR,
    }));
  });
}

const events = makeEventsForEntities();

// ---------------------------------------------------------------------------
// Domain-neutral (finance) mock — lanes/items, no OSINT fields
// ---------------------------------------------------------------------------

const financeLanes: RoboTimelineLane[] = [
  { id: 'savings', label: 'Savings' },
  { id: 'income',  label: 'Income' },
  { id: 'spend',   label: 'Category spend' },
];

// Lanes carry no start/end — the activity bars derive from item timestamps.
// Every item supplies an explicit colour, so the severity legend stays hidden.
const financeItems: RoboTimelineItem[] = [
  { id: 'f1', laneId: 'savings', timestamp: now - 90 * DAY, description: '$5k saved',  color: 'var(--chart-1)' },
  { id: 'f2', laneId: 'savings', timestamp: now - 30 * DAY, description: '$10k saved', color: 'var(--chart-1)' },
  { id: 'f3', laneId: 'income',  timestamp: now - 60 * DAY, description: 'Annual bonus', color: 'var(--chart-2)' },
  { id: 'f4', laneId: 'spend',   timestamp: now - 45 * DAY, description: 'Groceries spike', color: 'var(--chart-3)' },
  { id: 'f5', laneId: 'spend',   timestamp: now - 10 * DAY, description: 'Travel', color: 'var(--chart-3)' },
];

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta: Meta<typeof RoboTimeline> = {
  title: 'Data/Visualizations/RoboTimeline',
  excludeStories: ['componentMeta'],
  component: RoboTimeline,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    width:  { control: { type: 'number', min: 400, max: 1200 } },
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
        <OverviewSection title='RoboTimeline'>
          <div className='flex flex-col gap-6'>
            <RoboTimeline entities={entities} events={events} width={800} />
          </div>
        </OverviewSection>
      </OverviewStack>
    );
  },
};

export const Default: Story = {
  args: {
    entities,
    events,
    width: 800,
  },
};

export const ManyEntities: Story = {
  name: 'Many Entities',
  args: {
    entities: generateEntities().slice(0, 20),
    events: (() => {
      const ents = generateEntities().slice(0, 20);
      return ents.flatMap((e, i) => [
        { id: `e${i}-0`, entityId: e.id, type: 'telemetry-report', source: 'telemetry', description: 'Telemetry report', severity: 'info' as const, timestamp: now - i * 5 * HOUR },
        { id: `e${i}-1`, entityId: e.id, type: 'ground-contact', source: 'ground-network', description: 'Ground contact', severity: 'low' as const, timestamp: now - i * 5 * HOUR - 2 * HOUR },
      ]);
    })(),
    width: 900,
  },
};

export const GenericLanes: Story = {
  name: 'Generic Lanes (finance, no OSINT fields)',
  args: {
    lanes: financeLanes,
    items: financeItems,
    ariaLabel: 'Savings milestones and category spend',
    width: 800,
  },
};

export const SparseActivity: Story = {
  name: 'Sparse Activity (Dark Periods)',
  args: {
    entities: entities.slice(0, 4),
    events: [
      { id: 'sp-1', entityId: entities[0].id, type: 'telemetry-report', source: 'telemetry', description: 'Early observation', severity: 'info', timestamp: now - 7 * DAY },
      { id: 'sp-2', entityId: entities[0].id, type: 'optical-obs', source: 'satellite', description: 'Optical observation', severity: 'medium', timestamp: now - 1 * DAY },
      { id: 'sp-3', entityId: entities[1].id, type: 'ground-contact', source: 'ground-network', description: 'Ground contact', severity: 'low', timestamp: now - 5 * DAY },
      { id: 'sp-4', entityId: entities[2].id, type: 'rendezvous', source: 'satellite', description: 'Conjunction warning', severity: 'critical', timestamp: now - 3 * DAY },
    ],
    width: 800,
  },
};
