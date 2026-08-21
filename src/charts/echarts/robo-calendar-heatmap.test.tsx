import { render, screen } from '@testing-library/react';

import { RoboCalendarHeatmap } from './robo-calendar-heatmap';

const sampleData = [
  { date: '2025-01-01', value: 5 },
  { date: '2025-06-15', value: 12 },
  { date: '2025-12-31', value: 3 },
];

describe('RoboCalendarHeatmap', () => {
  it('renders without crashing with minimal props', () => {
    const { container } = render(<RoboCalendarHeatmap data={[]} year={2025} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders with populated data', () => {
    const { container } = render(<RoboCalendarHeatmap data={sampleData} year={2025} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders default aria-label "Calendar heatmap" when no title provided', () => {
    render(<RoboCalendarHeatmap data={[]} year={2025} />);
    expect(screen.getByRole('img', { name: 'Calendar heatmap' })).toBeInTheDocument();
  });

  it('uses title as aria-label', () => {
    render(<RoboCalendarHeatmap data={[]} year={2025} title="Incident Density" />);
    expect(screen.getByRole('img', { name: 'Incident Density' })).toBeInTheDocument();
  });

  it('applies custom className to the wrapper', () => {
    const { container } = render(
      <RoboCalendarHeatmap data={sampleData} year={2025} className="my-calendar-heatmap" />,
    );
    expect(container.firstChild).toHaveClass('my-calendar-heatmap');
  });

  it('shows loading skeleton when isLoading=true', () => {
    const { container } = render(<RoboCalendarHeatmap data={[]} year={2025} isLoading />);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(container.firstChild).toHaveClass('animate-pulse');
  });
});
