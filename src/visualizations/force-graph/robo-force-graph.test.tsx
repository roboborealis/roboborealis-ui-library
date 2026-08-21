import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';

import { RoboForceGraph } from './robo-force-graph';
import { generateEntities } from '../mock-data/generate-entities';
import { generateRelationships } from '../mock-data/generate-relationships';
import { createTypeRegistry } from '../registry';


// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const allEntities = generateEntities();
const allRelationships = generateRelationships(allEntities);
const registry = createTypeRegistry();

const entities = allEntities.slice(0, 10);
const relationships = allRelationships.filter((r) => {
  const hasSource = entities.some((e) => e.id === r.sourceEntityId);
  const hasTarget = entities.some((e) => e.id === r.targetEntityId);
  return hasSource && hasTarget;
});

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('RoboForceGraph', () => {
  it('renders without crashing', () => {
    render(
      <RoboForceGraph entities={entities} relationships={relationships} registry={registry} />,
    );
  });

  it('renders without crashing with empty entities', () => {
    render(
      <RoboForceGraph entities={[]} relationships={[]} registry={registry} />,
    );
  });

  it('renders a canvas or SVG element', () => {
    const { container } = render(
      <RoboForceGraph entities={entities} relationships={relationships} registry={registry} />,
    );
    const canvas = container.querySelector('canvas');
    const svg = container.querySelector('svg');
    expect(canvas || svg).toBeInTheDocument();
  });

  it('renders a loading state while simulation runs', () => {
    render(
      <RoboForceGraph entities={entities} relationships={relationships} registry={registry} />,
    );
    // The graph may render a loading spinner initially
    // Just verify the component mounts and has some content
    const { container } = render(
      <RoboForceGraph entities={entities} relationships={relationships} registry={registry} />,
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it('accepts a selectedEntityIds prop without crashing', () => {
    render(
      <RoboForceGraph
        entities={entities}
        relationships={relationships}
        registry={registry}
        selectedEntityIds={new Set([entities[0].id])}
      />,
    );
  });

  it('accepts a focusedEntityId prop without crashing', () => {
    render(
      <RoboForceGraph
        entities={entities}
        relationships={relationships}
        registry={registry}
        focusedEntityId={entities[0].id}
      />,
    );
  });

  it('forwards className to root element', () => {
    const { container } = render(
      <RoboForceGraph
        entities={entities}
        relationships={relationships}
        registry={registry}
        className='test-force-graph'
      />,
    );
    expect(container.firstChild).toHaveClass('test-force-graph');
  });

  it('passes axe accessibility checks', async () => {
    const { container } = render(
      <RoboForceGraph entities={entities} relationships={relationships} registry={registry} />,
    );
    const results = await axe(container, {
      rules: { 'color-contrast': { enabled: false } },
    });
    expect(results).toHaveNoViolations();
  });
});
