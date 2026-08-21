import { render, screen } from '@testing-library/react';

import { RoboTreemap } from './robo-treemap';

const data = [
  { name: 'Cargo Freighter', value: 120, children: [
    { name: 'Heavy Lifter', value: 80 },
    { name: 'Orbiter', value: 40 },
  ]},
  { name: 'Probe', value: 85 },
  { name: 'CubeSat', value: 30 },
];

describe('RoboTreemap', () => {
  it('renders without crashing with minimal props', () => {
    const { container } = render(<RoboTreemap data={[]} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders with nested data', () => {
    const { container } = render(<RoboTreemap data={data} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders default aria-label "Treemap chart" when no title provided', () => {
    render(<RoboTreemap data={[]} />);
    expect(screen.getByRole('img', { name: 'Treemap chart' })).toBeInTheDocument();
  });

  it('uses title as aria-label', () => {
    render(<RoboTreemap data={data} title="Constellation by Satellite Type" />);
    expect(screen.getByRole('img', { name: 'Constellation by Satellite Type' })).toBeInTheDocument();
  });

  it('applies custom className to the wrapper', () => {
    const { container } = render(<RoboTreemap data={data} className="my-treemap" />);
    expect(container.firstChild).toHaveClass('my-treemap');
  });

  it('shows loading skeleton when isLoading=true', () => {
    const { container } = render(<RoboTreemap data={data} isLoading />);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(container.firstChild).toHaveClass('animate-pulse');
  });

  it('renders sequential colorScheme', () => {
    const { container } = render(<RoboTreemap data={data} colorScheme="sequential" />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
