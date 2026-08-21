import { render, screen } from '@testing-library/react';

import { RoboCalendarBarChart } from './robo-calendar-bar-chart';

const sampleData: [string, number][] = [
  ['2025-01-01', 5],
  ['2025-06-15', 12],
  ['2025-12-31', 3],
];

describe('RoboCalendarBarChart', () => {
  it('renders without crashing with minimal props', () => {
    const { container } = render(<RoboCalendarBarChart data={[]} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders with populated data', () => {
    const { container } = render(<RoboCalendarBarChart data={sampleData} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders default aria-label "Calendar bar chart" when no title or aria-label provided', () => {
    render(<RoboCalendarBarChart data={[]} />);
    expect(screen.getByRole('img', { name: 'Calendar bar chart' })).toBeInTheDocument();
  });

  it('uses title as aria-label when no explicit aria-label is provided', () => {
    render(<RoboCalendarBarChart data={[]} title="Incident Calendar" />);
    expect(screen.getByRole('img', { name: 'Incident Calendar' })).toBeInTheDocument();
  });

  it('uses custom aria-label when provided', () => {
    render(<RoboCalendarBarChart data={sampleData} aria-label="Custom calendar label" />);
    expect(screen.getByRole('img', { name: 'Custom calendar label' })).toBeInTheDocument();
  });

  it('applies custom className to the wrapper', () => {
    const { container } = render(
      <RoboCalendarBarChart data={sampleData} className="my-calendar-chart" />,
    );
    expect(container.firstChild).toHaveClass('my-calendar-chart');
  });

  it('shows loading skeleton when isLoading=true', () => {
    const { container } = render(<RoboCalendarBarChart data={[]} isLoading />);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(container.firstChild).toHaveClass('animate-pulse');
  });

  it('renders with an explicit year prop', () => {
    const { container } = render(<RoboCalendarBarChart data={sampleData} year={2025} />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
