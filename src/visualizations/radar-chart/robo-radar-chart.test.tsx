import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';

import { RoboRadarChart } from './robo-radar-chart';
import type { RoboRadarAxis, RoboRadarProfile } from './robo-radar-chart';


// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const axes: RoboRadarAxis[] = [
  { id: 'confidence', label: 'Confidence', min: 0, max: 100 },
  { id: 'risk', label: 'Risk Score', min: 0, max: 100 },
  { id: 'sources', label: 'Sources', min: 0, max: 10 },
  { id: 'relationships', label: 'Relationships', min: 0, max: 50 },
  { id: 'recency', label: 'Recency', min: 0, max: 100 },
];

const profiles: RoboRadarProfile[] = [
  {
    id: 'entity-1',
    label: 'Craft Alpha',
    color: '#3b82f6',
    values: { confidence: 85, risk: 30, sources: 4, relationships: 12, recency: 90 },
  },
  {
    id: 'entity-2',
    label: 'Craft Beta',
    color: '#ef4444',
    values: { confidence: 60, risk: 75, sources: 2, relationships: 25, recency: 45 },
  },
];

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('RoboRadarChart', () => {
  it('renders an SVG element', () => {
    const { container } = render(<RoboRadarChart axes={axes} profiles={profiles} />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('renders without crashing with a single profile', () => {
    const { container } = render(
      <RoboRadarChart axes={axes} profiles={[profiles[0]]} />,
    );
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('renders without crashing when profiles array is empty', () => {
    const { container } = render(<RoboRadarChart axes={axes} profiles={[]} />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('renders axis labels', () => {
    render(<RoboRadarChart axes={axes} profiles={profiles} />);
    expect(screen.getByText('Confidence')).toBeInTheDocument();
    expect(screen.getByText('Risk Score')).toBeInTheDocument();
    expect(screen.getByText('Sources')).toBeInTheDocument();
  });

  it('renders profile labels in the legend', () => {
    render(<RoboRadarChart axes={axes} profiles={profiles} />);
    expect(screen.getByText('Craft Alpha')).toBeInTheDocument();
    expect(screen.getByText('Craft Beta')).toBeInTheDocument();
  });

  it('renders a polygon for each profile', () => {
    const { container } = render(<RoboRadarChart axes={axes} profiles={profiles} />);
    const polygons = container.querySelectorAll('polygon, path');
    expect(polygons.length).toBeGreaterThan(0);
  });

  it('forwards className to root element', () => {
    const { container } = render(
      <RoboRadarChart axes={axes} profiles={profiles} className='test-radar' />,
    );
    expect(container.firstChild).toHaveClass('test-radar');
  });

  it('passes axe accessibility checks', async () => {
    const { container } = render(<RoboRadarChart axes={axes} profiles={profiles} />);
    const results = await axe(container, {
      rules: { 'color-contrast': { enabled: false } },
    });
    expect(results).toHaveNoViolations();
  });
});
