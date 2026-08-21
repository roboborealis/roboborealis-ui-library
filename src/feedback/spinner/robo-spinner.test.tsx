import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { RoboSpinnerLoading } from './robo-spinner';


describe('RoboSpinnerLoading', () => {
  it('renders with default props', () => {
    render(<RoboSpinnerLoading />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('has default aria-label "Loading"', () => {
    render(<RoboSpinnerLoading />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-label', 'Loading');
  });

  it('uses custom label when provided', () => {
    render(<RoboSpinnerLoading label='Fetching data' />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-label', 'Fetching data');
  });

  it('has aria-busy="true"', () => {
    render(<RoboSpinnerLoading />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-busy', 'true');
  });

  it('applies sm size class (h-4 w-4)', () => {
    const { container } = render(<RoboSpinnerLoading size='sm' />);
    const icon = container.querySelector('svg');
    const cls = icon?.getAttribute('class') ?? '';
    expect(cls).toContain('h-4');
    expect(cls).toContain('w-4');
  });

  it('applies md size class (h-6 w-6) by default', () => {
    const { container } = render(<RoboSpinnerLoading />);
    const icon = container.querySelector('svg');
    const cls = icon?.getAttribute('class') ?? '';
    expect(cls).toContain('h-6');
    expect(cls).toContain('w-6');
  });

  it('applies lg size class (h-8 w-8)', () => {
    const { container } = render(<RoboSpinnerLoading size='lg' />);
    const icon = container.querySelector('svg');
    const cls = icon?.getAttribute('class') ?? '';
    expect(cls).toContain('h-8');
    expect(cls).toContain('w-8');
  });

  it('applies motion-safe:animate-spin for reduced-motion support', () => {
    const { container } = render(<RoboSpinnerLoading />);
    const icon = container.querySelector('svg');
    const cls = icon?.getAttribute('class') ?? '';
    expect(cls).toContain('motion-safe:animate-spin');
  });

  it('forwards ref to the span element', () => {
    const ref = React.createRef<HTMLSpanElement>();
    render(<RoboSpinnerLoading ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });

  it('has displayName RoboSpinnerLoading', () => {
    expect(RoboSpinnerLoading.displayName).toBe('RoboSpinnerLoading');
  });

  it('passes additional className', () => {
    render(<RoboSpinnerLoading className='custom-spinner' />);
    expect(screen.getByRole('progressbar')).toHaveClass('custom-spinner');
  });

  it('no a11y violations', async () => {
    const { container } = render(<RoboSpinnerLoading />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('no a11y violations with custom label', async () => {
    const { container } = render(<RoboSpinnerLoading label='Fetching satellite data' size='lg' />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
