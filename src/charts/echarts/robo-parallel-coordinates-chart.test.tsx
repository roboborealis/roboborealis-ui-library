import { render, screen } from '@testing-library/react';

import { RoboParallelCoordinatesChart } from './robo-parallel-coordinates-chart';

const sampleAxes = [
  { dim: 0, name: 'Velocity' },
  { dim: 1, name: 'Power' },
  { dim: 2, name: 'Mass' },
];

const sampleSeries = [
  { name: 'Probe', data: [[12, 8, 80000], [10, 15, 120000]] },
  { name: 'Tug', data: [[5, 3, 500]] },
];

describe('RoboParallelCoordinatesChart', () => {
  it('renders without crashing with minimal props', () => {
    const { container } = render(
      <RoboParallelCoordinatesChart series={sampleSeries} axes={sampleAxes} />,
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders without crashing with empty series', () => {
    const { container } = render(
      <RoboParallelCoordinatesChart series={[]} axes={sampleAxes} />,
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it('applies default aria-label "Parallel coordinates chart"', () => {
    render(<RoboParallelCoordinatesChart series={sampleSeries} axes={sampleAxes} />);
    expect(
      screen.getByRole('img', { name: 'Parallel coordinates chart' }),
    ).toBeInTheDocument();
  });

  it('uses title as aria-label when provided', () => {
    render(
      <RoboParallelCoordinatesChart
        series={sampleSeries}
        axes={sampleAxes}
        title='Constellation Dimensions'
      />,
    );
    expect(screen.getByRole('img', { name: 'Constellation Dimensions' })).toBeInTheDocument();
  });

  it('uses explicit aria-label over title', () => {
    render(
      <RoboParallelCoordinatesChart
        series={sampleSeries}
        axes={sampleAxes}
        title='Constellation Dimensions'
        aria-label='Custom label'
      />,
    );
    expect(screen.getByRole('img', { name: 'Custom label' })).toBeInTheDocument();
  });

  it('applies custom className to the wrapper', () => {
    const { container } = render(
      <RoboParallelCoordinatesChart
        series={sampleSeries}
        axes={sampleAxes}
        className='my-parallel'
      />,
    );
    expect(container.firstChild).toHaveClass('my-parallel');
  });

  it('renders loading skeleton when isLoading is true', () => {
    const { container } = render(
      <RoboParallelCoordinatesChart series={sampleSeries} axes={sampleAxes} isLoading />,
    );
    expect(container.firstChild).toHaveClass('animate-pulse');
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('applies default height of 440px', () => {
    render(<RoboParallelCoordinatesChart series={sampleSeries} axes={sampleAxes} />);
    expect(screen.getByTestId('echarts-chart')).toHaveStyle({ height: '440px' });
  });

  it('applies custom height', () => {
    render(
      <RoboParallelCoordinatesChart series={sampleSeries} axes={sampleAxes} height={650} />,
    );
    expect(screen.getByTestId('echarts-chart')).toHaveStyle({ height: '650px' });
  });
});
