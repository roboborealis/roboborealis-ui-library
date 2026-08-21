import { render, screen } from '@testing-library/react';

import { RoboCalendarIconChart } from './robo-calendar-icon-chart';

const sampleData: [string, number][] = [
  ['2025-03-10', 8],
  ['2025-07-22', 15],
];

describe('RoboCalendarIconChart', () => {
  it('renders without crashing with minimal props', () => {
    const { container } = render(<RoboCalendarIconChart data={[]} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders with populated data', () => {
    const { container } = render(<RoboCalendarIconChart data={sampleData} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders default aria-label "Calendar icon chart" when no title or aria-label provided', () => {
    render(<RoboCalendarIconChart data={[]} />);
    expect(screen.getByRole('img', { name: 'Calendar icon chart' })).toBeInTheDocument();
  });

  it('uses title as aria-label when no explicit aria-label is provided', () => {
    render(<RoboCalendarIconChart data={[]} title="Constellation Status" />);
    expect(screen.getByRole('img', { name: 'Constellation Status' })).toBeInTheDocument();
  });

  it('uses custom aria-label when provided', () => {
    render(<RoboCalendarIconChart data={sampleData} aria-label="Custom icon label" />);
    expect(screen.getByRole('img', { name: 'Custom icon label' })).toBeInTheDocument();
  });

  it('applies custom className to the wrapper', () => {
    const { container } = render(
      <RoboCalendarIconChart data={sampleData} className="my-icon-chart" />,
    );
    expect(container.firstChild).toHaveClass('my-icon-chart');
  });

  it('shows loading skeleton when isLoading=true', () => {
    const { container } = render(<RoboCalendarIconChart data={[]} isLoading />);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(container.firstChild).toHaveClass('animate-pulse');
  });

  it('renders with different icon variants', () => {
    const icons = ['satellite', 'rocket', 'star', 'planet'] as const;
    icons.forEach((icon) => {
      const { container } = render(<RoboCalendarIconChart data={sampleData} icon={icon} />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });
});
