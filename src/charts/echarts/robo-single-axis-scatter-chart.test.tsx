import { render, screen } from '@testing-library/react';

import { RoboSingleAxisScatterChart } from './robo-single-axis-scatter-chart';

const sampleSeries = [
  { name: 'Probe', data: [['2024-01-15', 80000], ['2024-03-10', 95000]] as [string, number][] },
  { name: 'Tug', data: [['2024-02-01', 500], ['2024-04-20', 650]] as [string, number][] },
];

describe('RoboSingleAxisScatterChart', () => {
  it('renders without crashing with empty series', () => {
    const { container } = render(<RoboSingleAxisScatterChart series={[]} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders with populated series', () => {
    const { container } = render(<RoboSingleAxisScatterChart series={sampleSeries} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('applies default aria-label "Single axis scatter chart"', () => {
    render(<RoboSingleAxisScatterChart series={[]} />);
    expect(
      screen.getByRole('img', { name: 'Single axis scatter chart' }),
    ).toBeInTheDocument();
  });

  it('uses title as aria-label when no explicit aria-label provided', () => {
    render(<RoboSingleAxisScatterChart series={sampleSeries} title='Constellation Activity' />);
    expect(screen.getByRole('img', { name: 'Constellation Activity' })).toBeInTheDocument();
  });

  it('uses explicit aria-label over title', () => {
    render(
      <RoboSingleAxisScatterChart
        series={sampleSeries}
        title='Constellation Activity'
        aria-label='Custom label'
      />,
    );
    expect(screen.getByRole('img', { name: 'Custom label' })).toBeInTheDocument();
  });

  it('applies custom className to the wrapper', () => {
    const { container } = render(
      <RoboSingleAxisScatterChart series={sampleSeries} className='my-chart' />,
    );
    expect(container.firstChild).toHaveClass('my-chart');
  });

  it('renders loading skeleton when isLoading is true', () => {
    const { container } = render(
      <RoboSingleAxisScatterChart series={sampleSeries} isLoading />,
    );
    expect(container.firstChild).toHaveClass('animate-pulse');
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('applies default height of 420px', () => {
    render(<RoboSingleAxisScatterChart series={sampleSeries} />);
    expect(screen.getByTestId('echarts-chart')).toHaveStyle({ height: '420px' });
  });

  it('applies custom height', () => {
    render(<RoboSingleAxisScatterChart series={sampleSeries} height={600} />);
    expect(screen.getByTestId('echarts-chart')).toHaveStyle({ height: '600px' });
  });
});
