import { render, screen } from '@testing-library/react';

import { RoboHeatmap } from './robo-heatmap';

const xCategories = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const yCategories = ['06:00', '12:00', '18:00'];
const data: [number, number, number][] = [
  [0, 0, 5],
  [1, 1, 12],
  [2, 2, 3],
  [3, 0, 8],
  [4, 1, 1],
];

describe('RoboHeatmap', () => {
  it('renders without crashing with minimal props', () => {
    const { container } = render(
      <RoboHeatmap data={[]} xCategories={[]} yCategories={[]} />,
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders with populated data', () => {
    const { container } = render(
      <RoboHeatmap data={data} xCategories={xCategories} yCategories={yCategories} />,
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders default aria-label "Heatmap chart" when no title provided', () => {
    render(<RoboHeatmap data={[]} xCategories={[]} yCategories={[]} />);
    expect(screen.getByRole('img', { name: 'Heatmap chart' })).toBeInTheDocument();
  });

  it('uses title as aria-label', () => {
    render(
      <RoboHeatmap
        data={data}
        xCategories={xCategories}
        yCategories={yCategories}
        title="Incidents by Day and Hour"
      />,
    );
    expect(screen.getByRole('img', { name: 'Incidents by Day and Hour' })).toBeInTheDocument();
  });

  it('applies custom className to the wrapper', () => {
    const { container } = render(
      <RoboHeatmap
        data={data}
        xCategories={xCategories}
        yCategories={yCategories}
        className="my-heatmap"
      />,
    );
    expect(container.firstChild).toHaveClass('my-heatmap');
  });

  it('shows loading skeleton when isLoading=true', () => {
    const { container } = render(
      <RoboHeatmap data={[]} xCategories={[]} yCategories={[]} isLoading />,
    );
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(container.firstChild).toHaveClass('animate-pulse');
  });
});
