import { render, screen } from '@testing-library/react';

import { RoboGaugeChart } from './robo-gauge-chart';

// echarts-for-react is mapped to a lightweight mock via vitest.config.ts alias.

const thresholds = [
  { value: 50, color: 'red' },
  { value: 100, color: 'green' },
];

describe('RoboGaugeChart', () => {
  it('renders without crashing with minimal props', () => {
    const { container } = render(<RoboGaugeChart value={50} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders arc variant (default)', () => {
    const { container } = render(<RoboGaugeChart value={50} variant='arc' />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders ring variant', () => {
    const { container } = render(<RoboGaugeChart value={50} variant='ring' />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders grade variant with colorThresholds', () => {
    const { container } = render(
      <RoboGaugeChart value={50} variant='grade' colorThresholds={thresholds} />,
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it('shows loading skeleton when isLoading=true', () => {
    const { container } = render(<RoboGaugeChart value={50} isLoading />);
    expect(container.firstChild).toHaveClass('animate-pulse');
  });

  it('does not render role="img" when loading', () => {
    render(<RoboGaugeChart value={50} isLoading />);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('uses default aria-label "Gauge chart" when no aria-label or name provided', () => {
    render(<RoboGaugeChart value={50} />);
    expect(screen.getByRole('img', { name: 'Gauge chart' })).toBeInTheDocument();
  });

  it('uses name prop as aria-label when name is provided and no aria-label prop', () => {
    render(<RoboGaugeChart value={50} name='Constellation Ready' />);
    expect(screen.getByRole('img', { name: 'Constellation Ready' })).toBeInTheDocument();
  });

  it('uses custom aria-label when provided', () => {
    render(<RoboGaugeChart value={50} aria-label='Custom gauge label' />);
    expect(screen.getByRole('img', { name: 'Custom gauge label' })).toBeInTheDocument();
  });

  it('applies className to wrapper div', () => {
    const { container } = render(
      <RoboGaugeChart value={50} className='my-gauge-chart' />,
    );
    expect(container.firstChild).toHaveClass('my-gauge-chart');
  });
});
