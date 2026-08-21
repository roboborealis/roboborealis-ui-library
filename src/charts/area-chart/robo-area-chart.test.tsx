import * as React from 'react';
import { render, screen } from '@testing-library/react';

import { RoboAreaChart } from './robo-area-chart';

// echarts-for-react is mapped to a lightweight mock via vitest.config.ts alias.

const sampleData = [
  { month: 'Jan', revenue: 4000, cost: 2400 },
  { month: 'Feb', revenue: 3000, cost: 1398 },
];

const singleArea = [{ dataKey: 'revenue', name: 'Revenue' }];
const multiArea = [
  { dataKey: 'revenue', name: 'Revenue' },
  { dataKey: 'cost', name: 'Cost' },
];

describe('RoboAreaChart', () => {
  it('renders without crashing with minimal required props', () => {
    const { container } = render(
      <RoboAreaChart data={sampleData} areas={singleArea} xAxisKey='month' />
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders without crashing with empty data array', () => {
    const { container } = render(
      <RoboAreaChart data={[]} areas={singleArea} xAxisKey='month' />
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it('applies the default aria-label "Area chart"', () => {
    render(
      <RoboAreaChart data={sampleData} areas={singleArea} xAxisKey='month' />
    );
    expect(screen.getByRole('img', { name: 'Area chart' })).toBeInTheDocument();
  });

  it('uses a custom aria-label when provided', () => {
    render(
      <RoboAreaChart
        data={sampleData}
        areas={singleArea}
        xAxisKey='month'
        aria-label='Monthly revenue trend'
      />
    );
    expect(
      screen.getByRole('img', { name: 'Monthly revenue trend' })
    ).toBeInTheDocument();
  });

  it('applies custom className to the wrapper', () => {
    const { container } = render(
      <RoboAreaChart
        data={sampleData}
        areas={singleArea}
        xAxisKey='month'
        className='my-area-chart'
      />
    );
    expect(container.firstChild).toHaveClass('my-area-chart');
  });

  it('applies default height of 300px via inline style', () => {
    const { container } = render(
      <RoboAreaChart data={sampleData} areas={singleArea} xAxisKey='month' />
    );
    expect(container.firstChild).toHaveStyle({ height: '300px' });
  });

  it('applies a custom height via inline style', () => {
    const { container } = render(
      <RoboAreaChart
        data={sampleData}
        areas={singleArea}
        xAxisKey='month'
        height={450}
      />
    );
    expect(container.firstChild).toHaveStyle({ height: '450px' });
  });

  it('renders multiple areas without crashing', () => {
    const { container } = render(
      <RoboAreaChart data={sampleData} areas={multiArea} xAxisKey='month' />
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders stacked areas without crashing', () => {
    const { container } = render(
      <RoboAreaChart data={sampleData} areas={multiArea} xAxisKey='month' stacked />
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it('forwards ref to the outer wrapper div', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <RoboAreaChart
        ref={ref}
        data={sampleData}
        areas={singleArea}
        xAxisKey='month'
      />
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('has displayName RoboAreaChart', () => {
    expect(RoboAreaChart.displayName).toBe('RoboAreaChart');
  });
});
