import { render, screen } from '@testing-library/react';

import { RoboThemeRiverChart } from './robo-theme-river-chart';

const sampleData: [string, number, string][] = [
  ['2024-01-01', 10, 'Anomaly'],
  ['2024-01-01', 5, 'Conjunction'],
  ['2024-02-01', 12, 'Anomaly'],
  ['2024-02-01', 8, 'Conjunction'],
];

describe('RoboThemeRiverChart', () => {
  it('renders without crashing with empty data', () => {
    const { container } = render(<RoboThemeRiverChart data={[]} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders with populated data', () => {
    const { container } = render(<RoboThemeRiverChart data={sampleData} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('applies default aria-label "Theme river chart"', () => {
    render(<RoboThemeRiverChart data={[]} />);
    expect(screen.getByRole('img', { name: 'Theme river chart' })).toBeInTheDocument();
  });

  it('uses title as aria-label when no explicit aria-label provided', () => {
    render(<RoboThemeRiverChart data={sampleData} title='Incident Flow' />);
    expect(screen.getByRole('img', { name: 'Incident Flow' })).toBeInTheDocument();
  });

  it('uses explicit aria-label over title', () => {
    render(
      <RoboThemeRiverChart data={sampleData} title='Incident Flow' aria-label='Custom' />,
    );
    expect(screen.getByRole('img', { name: 'Custom' })).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <RoboThemeRiverChart data={sampleData} className='my-river' />,
    );
    expect(container.firstChild).toHaveClass('my-river');
  });

  it('renders loading skeleton when isLoading is true', () => {
    const { container } = render(<RoboThemeRiverChart data={sampleData} isLoading />);
    expect(container.firstChild).toHaveClass('animate-pulse');
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('applies default height of 420px', () => {
    render(<RoboThemeRiverChart data={sampleData} />);
    expect(screen.getByTestId('echarts-chart')).toHaveStyle({ height: '420px' });
  });

  it('applies custom height', () => {
    render(<RoboThemeRiverChart data={sampleData} height={550} />);
    expect(screen.getByTestId('echarts-chart')).toHaveStyle({ height: '550px' });
  });
});
