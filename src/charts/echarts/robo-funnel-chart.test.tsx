import { render, screen } from '@testing-library/react';

import { RoboFunnelChart } from './robo-funnel-chart';

const stages = [
  { name: 'Satellites Tracked', value: 500 },
  { name: 'Reports Submitted', value: 320 },
  { name: 'Reports Reviewed', value: 200 },
  { name: 'Reports Approved', value: 175 },
];

describe('RoboFunnelChart', () => {
  it('renders without crashing with minimal props', () => {
    const { container } = render(<RoboFunnelChart stages={[]} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders with stage data', () => {
    const { container } = render(<RoboFunnelChart stages={stages} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders default aria-label "Funnel chart" when no title or aria-label provided', () => {
    render(<RoboFunnelChart stages={[]} />);
    expect(screen.getByRole('img', { name: 'Funnel chart' })).toBeInTheDocument();
  });

  it('uses title as aria-label when no explicit aria-label is provided', () => {
    render(<RoboFunnelChart stages={stages} title="Report Pipeline" />);
    expect(screen.getByRole('img', { name: 'Report Pipeline' })).toBeInTheDocument();
  });

  it('uses custom aria-label when provided', () => {
    render(<RoboFunnelChart stages={stages} aria-label="Custom funnel label" />);
    expect(screen.getByRole('img', { name: 'Custom funnel label' })).toBeInTheDocument();
  });

  it('applies custom className to the wrapper', () => {
    const { container } = render(
      <RoboFunnelChart stages={stages} className="my-funnel-chart" />,
    );
    expect(container.firstChild).toHaveClass('my-funnel-chart');
  });

  it('shows loading skeleton when isLoading=true', () => {
    const { container } = render(<RoboFunnelChart stages={stages} isLoading />);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(container.firstChild).toHaveClass('animate-pulse');
  });

  it('renders with showPercentage=true', () => {
    const { container } = render(<RoboFunnelChart stages={stages} showPercentage />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders ascending sort variant', () => {
    const { container } = render(<RoboFunnelChart stages={stages} sort="ascending" />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
