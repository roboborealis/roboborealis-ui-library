import * as React from 'react';
import { render, screen } from '@testing-library/react';

import { RoboPieChart } from './robo-pie-chart';

// echarts-for-react is mapped to a lightweight mock via vitest.config.ts alias.

const sampleData = [
  { name: 'Alpha', value: 60 },
  { name: 'Beta', value: 30 },
  { name: 'Gamma', value: 10 },
];

describe('RoboPieChart', () => {
  it('renders without crashing with minimal required props', () => {
    const { container } = render(<RoboPieChart data={sampleData} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders without crashing with empty data array', () => {
    const { container } = render(<RoboPieChart data={[]} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('applies the default aria-label "Pie chart"', () => {
    render(<RoboPieChart data={sampleData} />);
    expect(screen.getByRole('img', { name: 'Pie chart' })).toBeInTheDocument();
  });

  it('uses a custom aria-label when provided', () => {
    render(
      <RoboPieChart data={sampleData} aria-label='Distribution breakdown' />
    );
    expect(
      screen.getByRole('img', { name: 'Distribution breakdown' })
    ).toBeInTheDocument();
  });

  it('applies custom className to the wrapper', () => {
    const { container } = render(
      <RoboPieChart data={sampleData} className='my-pie-chart' />
    );
    expect(container.firstChild).toHaveClass('my-pie-chart');
  });

  it('applies default height of 300px via inline style', () => {
    const { container } = render(<RoboPieChart data={sampleData} />);
    expect(container.firstChild).toHaveStyle({ height: '300px' });
  });

  it('applies a custom height via inline style', () => {
    const { container } = render(<RoboPieChart data={sampleData} height={250} />);
    expect(container.firstChild).toHaveStyle({ height: '250px' });
  });

  it('renders donut variant without crashing', () => {
    const { container } = render(<RoboPieChart data={sampleData} donut />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('forwards ref to the outer wrapper div', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<RoboPieChart ref={ref} data={sampleData} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('renders with per-item color overrides without crashing', () => {
    const coloredData = [
      { name: 'Alpha', value: 60, color: '#ff0000' },
      { name: 'Beta', value: 40, color: '#00ff00' },
    ];
    const { container } = render(<RoboPieChart data={coloredData} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('has displayName RoboPieChart', () => {
    expect(RoboPieChart.displayName).toBe('RoboPieChart');
  });
});
