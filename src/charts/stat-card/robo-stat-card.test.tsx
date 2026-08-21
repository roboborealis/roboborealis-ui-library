import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';

import { RoboStatCard } from './robo-stat-card';


describe('RoboStatCard', () => {
  it('renders the value and label', () => {
    render(<RoboStatCard label='Active Satellites' value={142} />);

    expect(screen.getByText('Active Satellites')).toBeInTheDocument();
    expect(screen.getByText('142')).toBeInTheDocument();
  });

  it('renders a string value', () => {
    render(<RoboStatCard label='Status' value='Online' />);

    expect(screen.getByText('Online')).toBeInTheDocument();
  });

  it('shows a green trend indicator for positive change', () => {
    render(
      <RoboStatCard
        label='Revenue'
        value='$4,200'
        change={8.4}
        changeLabel='vs last month'
      />,
    );

    // Up arrow should be visible
    const arrowEl = screen.getByText('↑');
    expect(arrowEl).toBeInTheDocument();
    expect(arrowEl).toHaveStyle({ color: 'var(--success-text)' });

    // Percentage value also carries the green color
    const pctEl = screen.getByText('8.4%');
    expect(pctEl).toHaveStyle({ color: 'var(--success-text)' });

    // Change label rendered
    expect(screen.getByText('vs last month')).toBeInTheDocument();
  });

  it('shows a red trend indicator for negative change', () => {
    render(
      <RoboStatCard
        label='Missions'
        value={37}
        change={-3.2}
        changeLabel='vs last month'
      />,
    );

    // Down arrow
    const arrowEl = screen.getByText('↓');
    expect(arrowEl).toBeInTheDocument();
    expect(arrowEl).toHaveStyle({ color: 'var(--destructive-text)' });

    // Percentage value
    const pctEl = screen.getByText('3.2%');
    expect(pctEl).toHaveStyle({ color: 'var(--destructive-text)' });
  });

  it('renders zero change as positive (up arrow)', () => {
    render(<RoboStatCard label='Alerts' value={0} change={0} />);

    expect(screen.getByText('↑')).toBeInTheDocument();
    expect(screen.getByText('0.0%')).toBeInTheDocument();
  });

  it('does not render a change indicator when change is undefined', () => {
    render(<RoboStatCard label='Reports' value={88} />);

    expect(screen.queryByText('↑')).not.toBeInTheDocument();
    expect(screen.queryByText('↓')).not.toBeInTheDocument();
  });

  it('renders the icon slot when provided', () => {
    render(
      <RoboStatCard
        label='Ping'
        value='OK'
        icon={<span data-testid='test-icon'>icon</span>}
      />,
    );

    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  it('applies a custom className to the container', () => {
    const { container } = render(
      <RoboStatCard label='X' value='Y' className='custom-class' />,
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('passes axe accessibility checks', async () => {
    const { container } = render(
      <RoboStatCard
        label='Active Satellites'
        value={142}
        change={5.2}
        changeLabel='vs last month'
      />,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
