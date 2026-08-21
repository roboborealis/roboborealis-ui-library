import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { RoboEmptyState } from './robo-empty-state';


describe('RoboEmptyState', () => {
  it('renders with role="img"', () => {
    render(<RoboEmptyState />);
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('has default aria-label "No data available"', () => {
    render(<RoboEmptyState />);
    expect(screen.getByRole('img')).toHaveAttribute('aria-label', 'No data available');
  });

  it('uses custom label when provided', () => {
    render(<RoboEmptyState label='No missions found' />);
    expect(screen.getByRole('img')).toHaveAttribute('aria-label', 'No missions found');
  });

  it('applies size variant classes', () => {
    const { rerender } = render(<RoboEmptyState size='sm' />);
    expect(screen.getByRole('img').className).toContain('[&_.robo-empty-state-svg]:w-24');

    rerender(<RoboEmptyState size='lg' />);
    expect(screen.getByRole('img').className).toContain('[&_.robo-empty-state-svg]:w-48');
  });

  it('forwards ref to the container div', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<RoboEmptyState ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('has displayName RoboEmptyState', () => {
    expect(RoboEmptyState.displayName).toBe('RoboEmptyState');
  });

  it('passes additional className', () => {
    render(<RoboEmptyState className='custom-class' />);
    expect(screen.getByRole('img')).toHaveClass('custom-class');
  });

  it('no a11y violations', async () => {
    const { container } = render(<RoboEmptyState />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('no a11y violations with custom label', async () => {
    const { container } = render(<RoboEmptyState label='Empty results' size='lg' />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
