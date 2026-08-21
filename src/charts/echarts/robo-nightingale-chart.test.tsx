import { render, screen } from '@testing-library/react';

import { RoboNightingaleChart } from './robo-nightingale-chart';

const sampleData = [
  { name: 'Night', value: 42 },
  { name: 'Morning', value: 95 },
  { name: 'Afternoon', value: 78 },
  { name: 'Evening', value: 55 },
];

describe('RoboNightingaleChart', () => {
  it('renders without crashing with minimal props', () => {
    const { container } = render(<RoboNightingaleChart data={[]} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders with populated data', () => {
    const { container } = render(<RoboNightingaleChart data={sampleData} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('applies default aria-label "Nightingale chart"', () => {
    render(<RoboNightingaleChart data={[]} />);
    expect(screen.getByRole('img', { name: 'Nightingale chart' })).toBeInTheDocument();
  });

  it('uses title as aria-label when no explicit aria-label provided', () => {
    render(<RoboNightingaleChart data={sampleData} title='Constellation Composition' />);
    expect(screen.getByRole('img', { name: 'Constellation Composition' })).toBeInTheDocument();
  });

  it('uses explicit aria-label over title', () => {
    render(
      <RoboNightingaleChart
        data={sampleData}
        title='Constellation Composition'
        aria-label='Custom label'
      />,
    );
    expect(screen.getByRole('img', { name: 'Custom label' })).toBeInTheDocument();
  });

  it('applies custom className to the wrapper', () => {
    const { container } = render(
      <RoboNightingaleChart data={sampleData} className='my-nightingale' />,
    );
    expect(container.firstChild).toHaveClass('my-nightingale');
  });

  it('renders loading skeleton when isLoading is true', () => {
    const { container } = render(<RoboNightingaleChart data={sampleData} isLoading />);
    expect(container.firstChild).toHaveClass('animate-pulse');
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('applies default height of 420px', () => {
    render(<RoboNightingaleChart data={sampleData} />);
    expect(screen.getByTestId('echarts-chart')).toHaveStyle({ height: '420px' });
  });

  it('applies custom height', () => {
    render(<RoboNightingaleChart data={sampleData} height={600} />);
    expect(screen.getByTestId('echarts-chart')).toHaveStyle({ height: '600px' });
  });
});
