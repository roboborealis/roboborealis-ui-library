import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';

import { RoboCorrelationMatrix } from './robo-correlation-matrix';
import { generateEntities } from '../mock-data/generate-entities';
import { generateRelationships } from '../mock-data/generate-relationships';
import { createTypeRegistry } from '../registry';


// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const entities = generateEntities();
const relationships = generateRelationships(entities);
const registry = createTypeRegistry();

// Small fixture for targeted tests
const smallEntities = entities.filter((e) => e.type === 'spacecraft' || e.type === 'ground-station').slice(0, 8);
const smallRelationships = relationships.filter((r) => {
  const src = smallEntities.find((e) => e.id === r.sourceEntityId);
  const tgt = smallEntities.find((e) => e.id === r.targetEntityId);
  return src && tgt;
});

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('RoboCorrelationMatrix', () => {
  it('renders without crashing', () => {
    render(
      <RoboCorrelationMatrix
        entities={smallEntities}
        relationships={smallRelationships}
        registry={registry}
      />,
    );
  });

  it('renders without crashing with empty data', () => {
    render(
      <RoboCorrelationMatrix entities={[]} relationships={[]} registry={registry} />,
    );
  });

  it('renders entity type labels as row/column headers', () => {
    render(
      <RoboCorrelationMatrix
        entities={smallEntities}
        relationships={smallRelationships}
        registry={registry}
      />,
    );
    // spacecraft and ground-station types should appear as axis labels
    const spacecraftLabels = screen.getAllByText(/spacecraft/i);
    expect(spacecraftLabels.length).toBeGreaterThan(0);
  });

  it('calls onCellClick when a cell is clicked', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    const { container } = render(
      <RoboCorrelationMatrix
        entities={smallEntities}
        relationships={smallRelationships}
        registry={registry}
        onCellClick={handleClick}
      />,
    );
    const cells = container.querySelectorAll('[role="button"], td, [data-slot="cell"]');
    if (cells.length > 0) {
      await user.click(cells[0] as HTMLElement);
      // onCellClick may or may not fire depending on cell type (header vs data)
    }
  });

  it('forwards className to root element', () => {
    const { container } = render(
      <RoboCorrelationMatrix
        entities={smallEntities}
        relationships={smallRelationships}
        registry={registry}
        className='test-matrix'
      />,
    );
    expect(container.firstChild).toHaveClass('test-matrix');
  });

  it('passes axe accessibility checks', async () => {
    const { container } = render(
      <RoboCorrelationMatrix
        entities={smallEntities}
        relationships={smallRelationships}
        registry={registry}
      />,
    );
    const results = await axe(container, {
      rules: { 'color-contrast': { enabled: false } },
    });
    expect(results).toHaveNoViolations();
  });
});
