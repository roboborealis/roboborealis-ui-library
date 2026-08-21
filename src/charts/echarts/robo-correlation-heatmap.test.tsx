import { render, screen } from '@testing-library/react';

import { RoboCorrelationHeatmap } from './robo-correlation-heatmap';

const labels = ['Velocity', 'Mass', 'Power'];
const correlations = [
  [1.0, 0.72, 0.45],
  [0.72, 1.0, 0.88],
  [0.45, 0.88, 1.0],
];

describe('RoboCorrelationHeatmap', () => {
  it('renders without crashing with minimal props', () => {
    const { container } = render(<RoboCorrelationHeatmap labels={[]} correlations={[]} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders with labels and correlation matrix', () => {
    const { container } = render(
      <RoboCorrelationHeatmap labels={labels} correlations={correlations} />,
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders default aria-label "Correlation heatmap" when no title or aria-label provided', () => {
    render(<RoboCorrelationHeatmap labels={[]} correlations={[]} />);
    expect(screen.getByRole('img', { name: 'Correlation heatmap chart' })).toBeInTheDocument();
  });

  it('uses title as aria-label when no explicit aria-label is provided', () => {
    render(
      <RoboCorrelationHeatmap
        labels={labels}
        correlations={correlations}
        title="Satellite Metrics Correlation"
      />,
    );
    expect(screen.getByRole('img', { name: 'Satellite Metrics Correlation' })).toBeInTheDocument();
  });

  it('uses custom aria-label when provided', () => {
    render(
      <RoboCorrelationHeatmap
        labels={labels}
        correlations={correlations}
        aria-label="Custom correlation label"
      />,
    );
    expect(screen.getByRole('img', { name: 'Custom correlation label' })).toBeInTheDocument();
  });

  it('applies custom className to the wrapper', () => {
    const { container } = render(
      <RoboCorrelationHeatmap
        labels={labels}
        correlations={correlations}
        className="my-correlation-chart"
      />,
    );
    expect(container.firstChild).toHaveClass('my-correlation-chart');
  });

  it('shows loading skeleton when isLoading=true', () => {
    const { container } = render(
      <RoboCorrelationHeatmap labels={labels} correlations={correlations} isLoading />,
    );
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(container.firstChild).toHaveClass('animate-pulse');
  });
});
