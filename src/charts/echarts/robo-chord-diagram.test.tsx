import { render, screen } from '@testing-library/react';

import { RoboChordDiagram } from './robo-chord-diagram';

const nodes = [
  { name: 'NASA', value: 100 },
  { name: 'ESA', value: 80 },
  { name: 'Roscosmos', value: 60 },
];

const links = [
  { source: 'NASA', target: 'ESA', value: 40 },
  { source: 'ESA', target: 'Roscosmos', value: 25 },
  { source: 'Roscosmos', target: 'NASA', value: 15 },
];

describe('RoboChordDiagram', () => {
  it('renders without crashing with minimal props', () => {
    const { container } = render(<RoboChordDiagram nodes={[]} links={[]} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders with nodes and links data', () => {
    const { container } = render(<RoboChordDiagram nodes={nodes} links={links} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders default aria-label "Chord diagram" when no title or aria-label provided', () => {
    render(<RoboChordDiagram nodes={[]} links={[]} />);
    expect(screen.getByRole('img', { name: 'Chord diagram chart' })).toBeInTheDocument();
  });

  it('uses title as aria-label when no explicit aria-label is provided', () => {
    render(<RoboChordDiagram nodes={nodes} links={links} title="Operator Relations" />);
    expect(screen.getByRole('img', { name: 'Operator Relations' })).toBeInTheDocument();
  });

  it('uses custom aria-label when provided', () => {
    render(<RoboChordDiagram nodes={nodes} links={links} aria-label="Custom chord label" />);
    expect(screen.getByRole('img', { name: 'Custom chord label' })).toBeInTheDocument();
  });

  it('applies custom className to the wrapper', () => {
    const { container } = render(
      <RoboChordDiagram nodes={nodes} links={links} className="my-chord-chart" />,
    );
    expect(container.firstChild).toHaveClass('my-chord-chart');
  });

  it('shows loading skeleton when isLoading=true', () => {
    const { container } = render(<RoboChordDiagram nodes={nodes} links={links} isLoading />);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(container.firstChild).toHaveClass('animate-pulse');
  });

  it('renders with target lineColorMode', () => {
    const { container } = render(
      <RoboChordDiagram nodes={nodes} links={links} lineColorMode="target" />,
    );
    expect(container.firstChild).toBeInTheDocument();
  });
});
