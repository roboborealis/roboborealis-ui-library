import { render, screen } from '@testing-library/react';

import { RoboSankeyFlowChart } from './robo-sankey-flow-chart';

const nodes = [
  { name: 'Anomaly' },
  { name: 'Conjunction' },
  { name: 'high' },
  { name: 'low' },
  { name: 'resolved' },
  { name: 'open' },
];

const links = [
  { source: 'Anomaly', target: 'high', value: 40 },
  { source: 'Conjunction', target: 'low', value: 25 },
  { source: 'high', target: 'resolved', value: 30 },
  { source: 'low', target: 'open', value: 20 },
];

describe('RoboSankeyFlowChart', () => {
  it('renders without crashing with minimal props', () => {
    const { container } = render(<RoboSankeyFlowChart nodes={[]} links={[]} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders with nodes and links data', () => {
    const { container } = render(<RoboSankeyFlowChart nodes={nodes} links={links} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders default aria-label "Sankey flow chart" when no title or aria-label provided', () => {
    render(<RoboSankeyFlowChart nodes={[]} links={[]} />);
    expect(screen.getByRole('img', { name: 'Sankey flow chart' })).toBeInTheDocument();
  });

  it('uses title as aria-label when no explicit aria-label is provided', () => {
    render(<RoboSankeyFlowChart nodes={nodes} links={links} title="Incident Flow" />);
    expect(screen.getByRole('img', { name: 'Incident Flow' })).toBeInTheDocument();
  });

  it('uses custom aria-label when provided', () => {
    render(<RoboSankeyFlowChart nodes={nodes} links={links} aria-label="Custom sankey label" />);
    expect(screen.getByRole('img', { name: 'Custom sankey label' })).toBeInTheDocument();
  });

  it('applies custom className to the wrapper', () => {
    const { container } = render(
      <RoboSankeyFlowChart nodes={nodes} links={links} className="my-sankey-chart" />,
    );
    expect(container.firstChild).toHaveClass('my-sankey-chart');
  });

  it('shows loading skeleton when isLoading=true', () => {
    const { container } = render(<RoboSankeyFlowChart nodes={nodes} links={links} isLoading />);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(container.firstChild).toHaveClass('animate-pulse');
  });

  // Regression/confidence test: this component (like RoboChordDiagram) relies on
  // echarts-for-react's `notMerge` to give ECharts a clean option on every
  // update. A prior investigation suspected notMerge was insufficient
  // for sankey's node-depth layout specifically and that suspicion turned out to
  // be a false positive (stale bundler cache in the reproducing app, not a real
  // echarts/echarts-for-react issue - confirmed via a 28+ re-render Storybook
  // stress test). This test locks in "re-rendering with a brand-new nodes/links
  // array reference doesn't throw or break rendering" so a future regression
  // (e.g. someone removing `notMerge`) is caught here instead of rediscovered
  // the hard way in a consuming app.
  it('keeps rendering correctly across re-renders with a fresh nodes/links reference each time', () => {
    const { container, rerender } = render(
      <RoboSankeyFlowChart nodes={nodes} links={links} />,
    );

    for (let i = 0; i < 5; i++) {
      // Spread into new arrays/objects each time - same values, new identity,
      // mirroring what a derived-from-props/context useMemo does on every
      // parent re-render in a real app.
      const freshNodes = nodes.map((n) => ({ ...n }));
      const freshLinks = links.map((l) => ({ ...l }));
      rerender(<RoboSankeyFlowChart nodes={freshNodes} links={freshLinks} />);
    }

    expect(container.firstChild).toBeInTheDocument();
    expect(screen.getByRole('img')).toBeInTheDocument();
  });
});
