import * as React from 'react';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';

import {
  SatelliteIcon,
  RocketIcon,
  PlanetIcon,
  TelescopeIcon,
  StarIcon,
  OrbitIcon,
  CometIcon,
  CompassIcon,
  RadarIcon,
  WaypointIcon,
  ReportIcon,
} from './index';


// ---------------------------------------------------------------------------
// All celestial icons share the same forwardRef SVG pattern. Test each one
// for: renders SVG, className passthrough, aria-hidden, displayName, size prop.
// ---------------------------------------------------------------------------

const icons = [
  { name: 'SatelliteIcon', Component: SatelliteIcon },
  { name: 'RocketIcon', Component: RocketIcon },
  { name: 'PlanetIcon', Component: PlanetIcon },
  { name: 'TelescopeIcon', Component: TelescopeIcon },
  { name: 'StarIcon', Component: StarIcon },
  { name: 'OrbitIcon', Component: OrbitIcon },
  { name: 'CometIcon', Component: CometIcon },
  { name: 'CompassIcon', Component: CompassIcon },
  { name: 'RadarIcon', Component: RadarIcon },
  { name: 'WaypointIcon', Component: WaypointIcon },
  { name: 'ReportIcon', Component: ReportIcon },
];

describe('Celestial Icons', () => {
  for (const { name, Component } of icons) {
    describe(name, () => {
      it('renders an SVG element', () => {
        const { container } = render(<Component />);
        expect(container.querySelector('svg')).toBeInTheDocument();
      });

      it('has displayName set', () => {
        expect(Component.displayName).toBe(name);
      });

      it('applies aria-hidden by default', () => {
        const { container } = render(<Component />);
        expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
      });

      it('passes className through to SVG', () => {
        const { container } = render(<Component className='custom-class' />);
        expect(container.querySelector('svg')).toHaveClass('custom-class');
      });

      it('respects size prop', () => {
        const { container } = render(<Component size={32} />);
        const svg = container.querySelector('svg');
        expect(svg).toHaveAttribute('width', '32');
        expect(svg).toHaveAttribute('height', '32');
      });

      it('forwards ref to SVG element', () => {
        const ref = React.createRef<SVGSVGElement>();
        render(<Component ref={ref} />);
        expect(ref.current).toBeInstanceOf(SVGSVGElement);
      });
    });
  }

  it('passes axe accessibility checks', async () => {
    const { container } = render(
      <div>
        {icons.map(({ name, Component }) => (
          <Component key={name} />
        ))}
      </div>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
