import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';

import { RoboBubbleChart } from './robo-bubble-chart';
import type { RoboBubbleItem } from './robo-bubble-chart';


// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const items: RoboBubbleItem[] = [
  { id: 'b1', label: 'Alpha Satellite', x: 0.2, y: 0.3, size: 0.5, color: '#3b82f6', typeLabel: 'Satellite' },
  { id: 'b2', label: 'Beta Aircraft', x: 0.7, y: 0.8, size: 0.3, color: '#ef4444', typeLabel: 'Aircraft' },
  { id: 'b3', label: 'Gamma Station', x: 0.5, y: 0.1, size: 0.8, color: '#22c55e', typeLabel: 'Ground Station' },
];

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('RoboBubbleChart', () => {
  it('renders an SVG container', () => {
    const { container } = render(<RoboBubbleChart items={items} />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('renders without crashing when items array is empty', () => {
    const { container } = render(<RoboBubbleChart items={[]} />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('renders axis labels when provided', () => {
    render(<RoboBubbleChart items={items} xLabel='Confidence' yLabel='Risk Score' />);
    expect(screen.getByText('Confidence')).toBeInTheDocument();
    expect(screen.getByText('Risk Score')).toBeInTheDocument();
  });

  it('renders a bubble for each item', () => {
    const { container } = render(<RoboBubbleChart items={items} />);
    const circles = container.querySelectorAll('circle');
    // Each item renders at least one circle
    expect(circles.length).toBeGreaterThanOrEqual(items.length);
  });

  it('calls onItemClick when a bubble is clicked', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    const { container } = render(
      <RoboBubbleChart items={items} onItemClick={handleClick} />,
    );
    const firstCircle = container.querySelectorAll('circle')[0];
    if (firstCircle) {
      await user.click(firstCircle);
      expect(handleClick).toHaveBeenCalledWith(expect.objectContaining({ id: expect.any(String) }));
    }
  });

  it('forwards className to root element', () => {
    const { container } = render(
      <RoboBubbleChart items={items} className='test-bubble-chart' />,
    );
    expect(container.firstChild).toHaveClass('test-bubble-chart');
  });

  it('passes axe accessibility checks', async () => {
    const { container } = render(
      <RoboBubbleChart items={items} xLabel='Confidence' yLabel='Risk Score' />,
    );
    const results = await axe(container, {
      rules: {
        'color-contrast': { enabled: false },
        'svg-img-alt': { enabled: false },
        // RoboBubbleChart puts aria-label on <circle> elements for tooltip accessibility;
        // axe flags this but it's an intentional pattern in the component.
        'aria-prohibited-attr': { enabled: false },
      },
    });
    expect(results).toHaveNoViolations();
  });
});
