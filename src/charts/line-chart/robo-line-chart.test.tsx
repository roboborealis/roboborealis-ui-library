import * as React from 'react';
import { render, screen } from '@testing-library/react';

import { RoboLineChart } from './robo-line-chart';

// echarts-for-react is mapped to a lightweight mock via vitest.config.ts alias.

const sampleData = [
  { month: 'Jan', value: 40, count: 10 },
  { month: 'Feb', value: 80, count: 20 },
];

const singleLine = [{ dataKey: 'value', name: 'Value' }];
const multiLine = [
  { dataKey: 'value', name: 'Value' },
  { dataKey: 'count', name: 'Count' },
];

describe('RoboLineChart', () => {
  it('renders without crashing with minimal required props', () => {
    const { container } = render(
      <RoboLineChart data={sampleData} lines={singleLine} xAxisKey='month' />
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders without crashing with empty data array', () => {
    const { container } = render(
      <RoboLineChart data={[]} lines={singleLine} xAxisKey='month' />
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it('applies the default aria-label "Line chart"', () => {
    render(
      <RoboLineChart data={sampleData} lines={singleLine} xAxisKey='month' />
    );
    expect(screen.getByRole('img', { name: 'Line chart' })).toBeInTheDocument();
  });

  it('uses a custom aria-label when provided', () => {
    render(
      <RoboLineChart
        data={sampleData}
        lines={singleLine}
        xAxisKey='month'
        aria-label='Monthly values chart'
      />
    );
    expect(
      screen.getByRole('img', { name: 'Monthly values chart' })
    ).toBeInTheDocument();
  });

  it('applies custom className to the wrapper', () => {
    const { container } = render(
      <RoboLineChart
        data={sampleData}
        lines={singleLine}
        xAxisKey='month'
        className='my-chart'
      />
    );
    expect(container.firstChild).toHaveClass('my-chart');
  });

  it('applies default height of 300px via inline style', () => {
    const { container } = render(
      <RoboLineChart data={sampleData} lines={singleLine} xAxisKey='month' />
    );
    expect(container.firstChild).toHaveStyle({ height: '300px' });
  });

  it('applies a custom height via inline style', () => {
    const { container } = render(
      <RoboLineChart data={sampleData} lines={singleLine} xAxisKey='month' height={400} />
    );
    expect(container.firstChild).toHaveStyle({ height: '400px' });
  });

  it('forwards ref to the outer wrapper div', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <RoboLineChart
        ref={ref}
        data={sampleData}
        lines={singleLine}
        xAxisKey='month'
      />
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('renders multiple lines without crashing', () => {
    const { container } = render(
      <RoboLineChart data={sampleData} lines={multiLine} xAxisKey='month' />
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it('has displayName RoboLineChart', () => {
    expect(RoboLineChart.displayName).toBe('RoboLineChart');
  });
});
