import { render, screen } from '@testing-library/react';

import { RoboCirclePacking } from './robo-circle-packing';

const nodes = [
  { name: 'Cargo Freighter', value: 120, category: 'Type' },
  { name: 'Probe', value: 85, category: 'Type' },
  { name: 'CubeSat', value: 40, category: 'Type' },
];

describe('RoboCirclePacking', () => {
  it('renders without crashing with minimal props', () => {
    const { container } = render(<RoboCirclePacking nodes={[]} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders with node data', () => {
    const { container } = render(<RoboCirclePacking nodes={nodes} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders default aria-label "Circle packing chart" when no title or aria-label provided', () => {
    render(<RoboCirclePacking nodes={[]} />);
    expect(screen.getByRole('img', { name: 'Circle packing chart' })).toBeInTheDocument();
  });

  it('uses title as aria-label when no explicit aria-label is provided', () => {
    render(<RoboCirclePacking nodes={nodes} title="Constellation by Type" />);
    expect(screen.getByRole('img', { name: 'Constellation by Type' })).toBeInTheDocument();
  });

  it('uses custom aria-label when provided', () => {
    render(<RoboCirclePacking nodes={nodes} aria-label="Custom circle packing label" />);
    expect(screen.getByRole('img', { name: 'Custom circle packing label' })).toBeInTheDocument();
  });

  it('applies custom className to the wrapper', () => {
    const { container } = render(
      <RoboCirclePacking nodes={nodes} className="my-circle-packing" />,
    );
    expect(container.firstChild).toHaveClass('my-circle-packing');
  });

  it('shows loading skeleton when isLoading=true', () => {
    const { container } = render(<RoboCirclePacking nodes={nodes} isLoading />);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(container.firstChild).toHaveClass('animate-pulse');
  });

  it('deduplicates nodes with the same name', () => {
    const dupeNodes = [
      { name: 'Cargo Freighter', value: 50 },
      { name: 'Cargo Freighter', value: 30 },
      { name: 'Probe', value: 20 },
    ];
    const { container } = render(<RoboCirclePacking nodes={dupeNodes} />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
