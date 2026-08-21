import { render, screen } from '@testing-library/react';

import { RoboCalendarScatterChart } from './robo-calendar-scatter-chart';

const sampleData: [string, number][] = [
  ['2024-01-05', 3],
  ['2024-01-12', 7],
  ['2024-03-22', 2],
  ['2024-06-10', 5],
];

describe('RoboCalendarScatterChart', () => {
  it('renders without crashing with empty data', () => {
    const { container } = render(<RoboCalendarScatterChart data={[]} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders with populated data', () => {
    const { container } = render(<RoboCalendarScatterChart data={sampleData} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('applies default aria-label "Calendar scatter chart"', () => {
    render(<RoboCalendarScatterChart data={[]} />);
    expect(
      screen.getByRole('img', { name: 'Calendar scatter chart' }),
    ).toBeInTheDocument();
  });

  it('uses title as aria-label when no explicit aria-label provided', () => {
    render(<RoboCalendarScatterChart data={sampleData} title='Daily Incidents' />);
    expect(screen.getByRole('img', { name: 'Daily Incidents' })).toBeInTheDocument();
  });

  it('uses explicit aria-label over title', () => {
    render(
      <RoboCalendarScatterChart
        data={sampleData}
        title='Daily Incidents'
        aria-label='Custom label'
      />,
    );
    expect(screen.getByRole('img', { name: 'Custom label' })).toBeInTheDocument();
  });

  it('applies custom className to the wrapper', () => {
    const { container } = render(
      <RoboCalendarScatterChart data={sampleData} className='my-calendar' />,
    );
    expect(container.firstChild).toHaveClass('my-calendar');
  });

  it('renders loading skeleton when isLoading is true', () => {
    const { container } = render(
      <RoboCalendarScatterChart data={sampleData} isLoading />,
    );
    expect(container.firstChild).toHaveClass('animate-pulse');
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('applies default height of 200px', () => {
    render(<RoboCalendarScatterChart data={sampleData} />);
    expect(screen.getByTestId('echarts-chart')).toHaveStyle({ height: '200px' });
  });

  it('applies custom height', () => {
    render(<RoboCalendarScatterChart data={sampleData} height={300} />);
    expect(screen.getByTestId('echarts-chart')).toHaveStyle({ height: '300px' });
  });
});
