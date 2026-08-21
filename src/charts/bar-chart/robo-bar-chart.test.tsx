import * as React from 'react';
import { render, screen } from '@testing-library/react';

import { RoboBarChart } from './robo-bar-chart';

// echarts-for-react is mapped to a lightweight mock via vitest.config.ts alias.

const sampleData = [
  { month: 'Jan', sales: 120, returns: 10 },
  { month: 'Feb', sales: 200, returns: 25 },
];

const singleBar = [{ dataKey: 'sales', name: 'Sales' }];
const multiBar = [
  { dataKey: 'sales', name: 'Sales' },
  { dataKey: 'returns', name: 'Returns' },
];

describe('RoboBarChart', () => {
  it('renders without crashing with minimal required props', () => {
    const { container } = render(
      <RoboBarChart data={sampleData} bars={singleBar} xAxisKey='month' />
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders without crashing with empty data array', () => {
    const { container } = render(
      <RoboBarChart data={[]} bars={singleBar} xAxisKey='month' />
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it('applies the default aria-label "Bar chart"', () => {
    render(
      <RoboBarChart data={sampleData} bars={singleBar} xAxisKey='month' />
    );
    expect(screen.getByRole('img', { name: 'Bar chart' })).toBeInTheDocument();
  });

  it('uses a custom aria-label when provided', () => {
    render(
      <RoboBarChart
        data={sampleData}
        bars={singleBar}
        xAxisKey='month'
        aria-label='Monthly sales chart'
      />
    );
    expect(
      screen.getByRole('img', { name: 'Monthly sales chart' })
    ).toBeInTheDocument();
  });

  it('applies custom className to the wrapper', () => {
    const { container } = render(
      <RoboBarChart
        data={sampleData}
        bars={singleBar}
        xAxisKey='month'
        className='my-bar-chart'
      />
    );
    expect(container.firstChild).toHaveClass('my-bar-chart');
  });

  it('applies default height of 300px via inline style', () => {
    const { container } = render(
      <RoboBarChart data={sampleData} bars={singleBar} xAxisKey='month' />
    );
    expect(container.firstChild).toHaveStyle({ height: '300px' });
  });

  it('applies a custom height via inline style', () => {
    const { container } = render(
      <RoboBarChart data={sampleData} bars={singleBar} xAxisKey='month' height={500} />
    );
    expect(container.firstChild).toHaveStyle({ height: '500px' });
  });

  it('renders horizontal orientation without crashing', () => {
    const { container } = render(
      <RoboBarChart
        data={sampleData}
        bars={singleBar}
        xAxisKey='month'
        orientation='horizontal'
      />
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders multiple bars without crashing', () => {
    const { container } = render(
      <RoboBarChart data={sampleData} bars={multiBar} xAxisKey='month' />
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders stacked bars without crashing', () => {
    const { container } = render(
      <RoboBarChart data={sampleData} bars={multiBar} xAxisKey='month' stacked />
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it('forwards ref to the outer wrapper div', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <RoboBarChart ref={ref} data={sampleData} bars={singleBar} xAxisKey='month' />
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('has displayName RoboBarChart', () => {
    expect(RoboBarChart.displayName).toBe('RoboBarChart');
  });
});
