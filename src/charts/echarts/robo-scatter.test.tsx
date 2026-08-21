import { render, screen } from '@testing-library/react';

import { RoboScatterChart } from './robo-scatter';

// echarts-for-react is mapped to a lightweight mock via vitest.config.ts alias.

const sampleSeries = [{ name: 'Test', data: [[1, 2], [3, 4]] as [number, number][] }];

describe('RoboScatterChart', () => {
  it('renders without crashing with minimal props', () => {
    const { container } = render(<RoboScatterChart series={[]} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders with populated series data', () => {
    const { container } = render(<RoboScatterChart series={sampleSeries} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('applies default aria-label "Scatter chart" when no aria-label or title provided', () => {
    render(<RoboScatterChart series={[]} />);
    expect(screen.getByRole('img', { name: 'Scatter chart' })).toBeInTheDocument();
  });

  it('uses title as aria-label when no explicit aria-label is provided', () => {
    render(<RoboScatterChart series={[]} title='Constellation Chart' />);
    expect(screen.getByRole('img', { name: 'Constellation Chart' })).toBeInTheDocument();
  });

  it('uses custom aria-label when provided', () => {
    render(<RoboScatterChart series={sampleSeries} aria-label='Custom scatter label' />);
    expect(screen.getByRole('img', { name: 'Custom scatter label' })).toBeInTheDocument();
  });

  it('applies custom className to the wrapper', () => {
    const { container } = render(
      <RoboScatterChart series={sampleSeries} className='my-scatter-chart' />,
    );
    expect(container.firstChild).toHaveClass('my-scatter-chart');
  });

  it('renders loading skeleton when isLoading=true', () => {
    const { container } = render(
      <RoboScatterChart series={sampleSeries} isLoading height={420} />,
    );
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(container.firstChild).toHaveClass('animate-pulse');
  });

  it('renders colorByValue mode without crashing', () => {
    const colorSeries = [
      {
        name: 'Severity',
        data: [
          [10, 20, 0],
          [30, 40, 1],
          [50, 60, 2],
        ] as unknown as [number, number][],
      },
    ];
    const { container } = render(
      <RoboScatterChart series={colorSeries} colorByValue />,
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders multiple series without crashing', () => {
    const multiSeries = [
      { name: 'Group A', data: [[1, 2], [3, 4]] as [number, number][] },
      { name: 'Group B', data: [[5, 6], [7, 8]] as [number, number][] },
    ];
    const { container } = render(<RoboScatterChart series={multiSeries} />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
