import { render, screen } from '@testing-library/react';

import { RoboSunburstChart } from './robo-sunburst-chart';

const sampleData = [
  { name: 'Region A', children: [{ name: 'Type 1', value: 10 }, { name: 'Type 2', value: 20 }] },
  { name: 'Region B', children: [{ name: 'Type 3', value: 15 }] },
];

describe('RoboSunburstChart', () => {
  it('renders without crashing with empty data', () => {
    const { container } = render(<RoboSunburstChart data={[]} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders with populated data', () => {
    const { container } = render(<RoboSunburstChart data={sampleData} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('applies default aria-label "Sunburst chart"', () => {
    render(<RoboSunburstChart data={[]} />);
    expect(screen.getByRole('img', { name: 'Sunburst chart' })).toBeInTheDocument();
  });

  it('uses title as aria-label when no explicit aria-label provided', () => {
    render(<RoboSunburstChart data={sampleData} title='Constellation Breakdown' />);
    expect(screen.getByRole('img', { name: 'Constellation Breakdown' })).toBeInTheDocument();
  });

  it('uses explicit aria-label over title', () => {
    render(
      <RoboSunburstChart data={sampleData} title='Constellation Breakdown' aria-label='Custom' />,
    );
    expect(screen.getByRole('img', { name: 'Custom' })).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<RoboSunburstChart data={sampleData} className='my-sunburst' />);
    expect(container.firstChild).toHaveClass('my-sunburst');
  });

  it('renders loading skeleton when isLoading is true', () => {
    const { container } = render(<RoboSunburstChart data={sampleData} isLoading />);
    expect(container.firstChild).toHaveClass('animate-pulse');
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('applies default height of 420px', () => {
    render(<RoboSunburstChart data={sampleData} />);
    expect(screen.getByTestId('echarts-chart')).toHaveStyle({ height: '420px' });
  });

  it('applies custom height', () => {
    render(<RoboSunburstChart data={sampleData} height={600} />);
    expect(screen.getByTestId('echarts-chart')).toHaveStyle({ height: '600px' });
  });
});
