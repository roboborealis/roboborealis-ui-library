import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';

import { RoboTimeline } from './robo-timeline';
import type { RoboTimelineLane, RoboTimelineItem } from './robo-timeline';
import type { RoboOsintEntity, RoboOsintEvent } from '../types';


// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const now = Date.now();
const oneDay = 86_400_000;

const entities: RoboOsintEntity[] = [
  {
    id: 'e1',
    type: 'spacecraft',
    name: 'Voyager 1',
    sources: ['telemetry'],
    confidence: 0.9,
    firstSeen: now - oneDay * 7,
    lastSeen: now,
    properties: {},
  },
  {
    id: 'e2',
    type: 'aircraft',
    name: 'Flight AA-100',
    sources: ['radar'],
    confidence: 0.8,
    firstSeen: now - oneDay * 3,
    lastSeen: now - oneDay,
    properties: {},
  },
];

const events: RoboOsintEvent[] = [
  {
    id: 'ev1',
    entityId: 'e1',
    type: 'telemetry-report',
    source: 'telemetry',
    timestamp: now - oneDay * 5,
    description: 'Telemetry report',
    severity: 'info',
  },
  {
    id: 'ev2',
    entityId: 'e1',
    type: 'ground-contact',
    source: 'ground-network',
    timestamp: now - oneDay * 2,
    description: 'Ground station contact',
    severity: 'high',
  },
  {
    id: 'ev3',
    entityId: 'e2',
    type: 'radar-contact',
    source: 'radar',
    timestamp: now - oneDay * 2,
    description: 'Radar contact',
    severity: 'medium',
  },
];

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('RoboTimeline', () => {
  it('renders an SVG element', () => {
    const { container } = render(
      <RoboTimeline entities={entities} events={events} width={800} height={200} />,
    );
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('renders entity names as labels', () => {
    render(<RoboTimeline entities={entities} events={events} width={800} height={200} />);
    expect(screen.getByText('Voyager 1')).toBeInTheDocument();
    expect(screen.getByText('Flight AA-100')).toBeInTheDocument();
  });

  it('renders empty state when no entities have events', () => {
    render(<RoboTimeline entities={entities} events={[]} width={800} height={200} />);
    expect(screen.getByText(/no events/i)).toBeInTheDocument();
  });

  it('respects maxRows prop', () => {
    const manyEntities = Array.from({ length: 30 }, (_, i) => ({
      id: `e${i}`,
      type: 'spacecraft' as const,
      name: `Craft ${i}`,
      sources: ['telemetry'],
      confidence: 0.9,
      firstSeen: now - oneDay,
      lastSeen: now,
      properties: {},
    }));
    const manyEvents = manyEntities.map((e, i) => ({
      id: `ev${i}`,
      entityId: e.id,
      type: 'report',
      source: 'telemetry',
      timestamp: now - 3_600_000,
      description: `Event ${i}`,
      severity: 'info' as const,
    }));

    render(
      <RoboTimeline entities={manyEntities} events={manyEvents} width={800} height={400} maxRows={5} />,
    );
    // Should only show 5 entity labels
    expect(screen.getByText('Craft 0')).toBeInTheDocument();
    expect(screen.queryByText('Craft 10')).not.toBeInTheDocument();
  });

  it('accepts className prop', () => {
    const { container } = render(
      <RoboTimeline
        entities={entities}
        events={events}
        width={800}
        height={200}
        className='custom-timeline'
      />,
    );
    expect(container.firstChild).toHaveClass('custom-timeline');
  });

  it('passes axe accessibility checks', async () => {
    const { container } = render(
      <RoboTimeline entities={entities} events={events} width={800} height={200} />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('shows the severity legend for OSINT (no explicit colours) data', () => {
    render(<RoboTimeline entities={entities} events={events} width={800} height={200} />);
    expect(screen.getByText('critical')).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Domain-neutral lanes/items API
// ---------------------------------------------------------------------------

const lanes: RoboTimelineLane[] = [
  { id: 'savings', label: 'Savings' }, // no start/end — derived from items
  { id: 'spend', label: 'Category spend' },
];

const items: RoboTimelineItem[] = [
  { id: 'i1', laneId: 'savings', timestamp: now - oneDay * 90, description: '$5k saved', color: 'var(--chart-1)' },
  { id: 'i2', laneId: 'savings', timestamp: now - oneDay * 10, description: '$10k saved', color: 'var(--chart-1)' },
  { id: 'i3', laneId: 'spend', timestamp: now - oneDay * 30, description: 'Groceries spike', color: 'var(--chart-3)' },
];

describe('RoboTimeline — neutral lanes/items', () => {
  it('renders lane labels from the lanes prop', () => {
    render(<RoboTimeline lanes={lanes} items={items} width={800} height={200} />);
    expect(screen.getByText('Savings')).toBeInTheDocument();
    expect(screen.getByText('Category spend')).toBeInTheDocument();
  });

  it('renders a dot per item with a lane/time/description tooltip', () => {
    const { container } = render(
      <RoboTimeline lanes={lanes} items={items} width={800} height={200} />,
    );
    // <title> elements carry the tooltip text
    const titles = Array.from(container.querySelectorAll('title')).map((t) => t.textContent);
    expect(titles.some((t) => t?.includes('$5k saved'))).toBe(true);
    expect(titles.some((t) => t?.includes('Savings'))).toBe(true);
  });

  it('derives lane start/end from item timestamps when omitted (activity bar renders)', () => {
    const { container } = render(
      <RoboTimeline lanes={lanes} items={items} width={800} height={200} />,
    );
    // Two lanes with items → two activity bars (muted rects) + dots present
    expect(container.querySelectorAll('rect').length).toBeGreaterThan(0);
    expect(container.querySelectorAll('circle').length).toBe(items.length);
  });

  it('applies the ariaLabel prop', () => {
    render(
      <RoboTimeline lanes={lanes} items={items} ariaLabel='Savings milestones' width={800} height={200} />,
    );
    expect(screen.getByRole('img', { name: 'Savings milestones' })).toBeInTheDocument();
  });

  it('defaults the accessible label to "Event timeline"', () => {
    render(<RoboTimeline lanes={lanes} items={items} width={800} height={200} />);
    expect(screen.getByRole('img', { name: 'Event timeline' })).toBeInTheDocument();
  });

  it('hides the severity legend when all items supply explicit colours', () => {
    render(<RoboTimeline lanes={lanes} items={items} width={800} height={200} />);
    expect(screen.queryByText('critical')).not.toBeInTheDocument();
  });

  it('renders empty state when items reference no lanes', () => {
    render(<RoboTimeline lanes={lanes} items={[]} width={800} height={200} />);
    expect(screen.getByText(/no events/i)).toBeInTheDocument();
  });

  it('derives lanes from items when only items are provided', () => {
    render(<RoboTimeline items={items} width={800} height={200} />);
    // laneIds 'savings' and 'spend' become derived lanes (label = laneId)
    expect(screen.getByText('savings')).toBeInTheDocument();
    expect(screen.getByText('spend')).toBeInTheDocument();
    expect(screen.queryByText(/no events/i)).not.toBeInTheDocument();
  });

  it('applies lane.color to the activity bar', () => {
    const { container } = render(
      <RoboTimeline
        lanes={[{ id: 'savings', label: 'Savings', color: 'rgb(1, 2, 3)' }]}
        items={items.filter((i) => i.laneId === 'savings')}
        width={800}
        height={200}
      />,
    );
    const fills = Array.from(container.querySelectorAll('rect')).map((r) => r.getAttribute('fill'));
    expect(fills).toContain('rgb(1, 2, 3)');
  });

  it('preserves a caller-supplied start/end while deriving the other bound', () => {
    // Only `end` supplied → start derives from items; end stays fixed.
    const fixedEnd = now;
    const { container } = render(
      <RoboTimeline
        lanes={[{ id: 'savings', label: 'Savings', end: fixedEnd }]}
        items={items.filter((i) => i.laneId === 'savings')}
        width={800}
        height={200}
      />,
    );
    // Renders without throwing and shows the lane + its dots
    expect(screen.getByText('Savings')).toBeInTheDocument();
    expect(container.querySelectorAll('circle').length).toBe(2);
  });
});
