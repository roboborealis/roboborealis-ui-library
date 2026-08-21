import * as React from 'react';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { RoboCorrelationProvider, useRoboCorrelation } from './robo-correlation-provider';
import { generateEntities } from '../mock-data/generate-entities';
import { generateRelationships } from '../mock-data/generate-relationships';
import type { RoboOsintEvent } from '../types';

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const entities = generateEntities();
const relationships = generateRelationships(entities);

const now = Date.now();
const events: RoboOsintEvent[] = entities.slice(0, 5).map((e, i) => ({
  id: `ev-${i}`,
  entityId: e.id,
  type: 'telemetry-report',
  source: 'telemetry',
  description: `Test event ${i}`,
  severity: 'info' as const,
  timestamp: now - i * 3_600_000,
}));

// ---------------------------------------------------------------------------
// Consumer component
// ---------------------------------------------------------------------------

function ContextConsumer() {
  const { filteredEntities, filteredRelationships, filters, actions } = useRoboCorrelation();
  return (
    <div>
      <span data-testid='entity-count'>{filteredEntities.length}</span>
      <span data-testid='rel-count'>{filteredRelationships.length}</span>
      <span data-testid='search-query'>{filters.searchQuery}</span>
      <button
        onClick={() => actions.setFilters({ entityTypes: ['spacecraft'] })}
        data-testid='filter-spacecraft'
      >
        Filter Spacecraft
      </button>
      <button
        onClick={() => actions.setFilters({ searchQuery: 'test-query' })}
        data-testid='set-search'
      >
        Set Search
      </button>
      <button onClick={() => actions.resetFilters()} data-testid='reset'>
        Reset
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('RoboCorrelationProvider', () => {
  it('renders children without crashing', () => {
    render(
      <RoboCorrelationProvider entities={entities} relationships={relationships}>
        <div data-testid='child'>child content</div>
      </RoboCorrelationProvider>,
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('provides all entities to children initially', () => {
    render(
      <RoboCorrelationProvider entities={entities} relationships={relationships}>
        <ContextConsumer />
      </RoboCorrelationProvider>,
    );
    expect(screen.getByTestId('entity-count').textContent).toBe(String(entities.length));
  });

  it('provides all relationships to children initially', () => {
    render(
      <RoboCorrelationProvider entities={entities} relationships={relationships}>
        <ContextConsumer />
      </RoboCorrelationProvider>,
    );
    const relCount = parseInt(screen.getByTestId('rel-count').textContent ?? '0', 10);
    expect(relCount).toBeGreaterThan(0);
  });

  it('filters entities when entityTypes filter is applied', async () => {
    const user = userEvent.setup();
    render(
      <RoboCorrelationProvider entities={entities} relationships={relationships}>
        <ContextConsumer />
      </RoboCorrelationProvider>,
    );

    const spacecraftCount = entities.filter((e) => e.type === 'spacecraft').length;
    await user.click(screen.getByTestId('filter-spacecraft'));

    const displayedCount = parseInt(screen.getByTestId('entity-count').textContent ?? '0', 10);
    expect(displayedCount).toBe(spacecraftCount);
  });

  it('filters entities by searchQuery', async () => {
    const user = userEvent.setup();
    const targetEntity = entities[0];

    function SearchConsumer() {
      const { filteredEntities, actions } = useRoboCorrelation();
      return (
        <div>
          <span data-testid='count'>{filteredEntities.length}</span>
          <button
            onClick={() => actions.setFilters({ searchQuery: targetEntity.name })}
            data-testid='search'
          >
            Search
          </button>
        </div>
      );
    }

    render(
      <RoboCorrelationProvider entities={entities} relationships={relationships}>
        <SearchConsumer />
      </RoboCorrelationProvider>,
    );

    await user.click(screen.getByTestId('search'));

    const count = parseInt(screen.getByTestId('count').textContent ?? '0', 10);
    expect(count).toBeGreaterThanOrEqual(1);
    expect(count).toBeLessThan(entities.length);
  });

  it('resets filters to initial state', async () => {
    const user = userEvent.setup();
    render(
      <RoboCorrelationProvider entities={entities} relationships={relationships}>
        <ContextConsumer />
      </RoboCorrelationProvider>,
    );

    await user.click(screen.getByTestId('filter-spacecraft'));
    await user.click(screen.getByTestId('reset'));

    expect(screen.getByTestId('entity-count').textContent).toBe(String(entities.length));
  });

  it('applies defaultFilters on mount', () => {
    render(
      <RoboCorrelationProvider
        entities={entities}
        relationships={relationships}
        defaultFilters={{ entityTypes: ['spacecraft'] }}
      >
        <ContextConsumer />
      </RoboCorrelationProvider>,
    );

    const spacecraftCount = entities.filter((e) => e.type === 'spacecraft').length;
    expect(screen.getByTestId('entity-count').textContent).toBe(String(spacecraftCount));
  });

  it('accepts events prop without crashing', () => {
    render(
      <RoboCorrelationProvider entities={entities} relationships={relationships} events={events}>
        <div data-testid='ok'>ok</div>
      </RoboCorrelationProvider>,
    );
    expect(screen.getByTestId('ok')).toBeInTheDocument();
  });
});
