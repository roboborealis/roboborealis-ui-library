import * as React from 'react';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { RoboSkeletonLoading } from './robo-skeleton';


describe('RoboSkeletonLoading', () => {
  it('renders a div element', () => {
    const { container } = render(<RoboSkeletonLoading />);
    expect(container.firstChild).toBeInstanceOf(HTMLDivElement);
  });

  it('has aria-hidden="true" (decorative)', () => {
    const { container } = render(<RoboSkeletonLoading />);
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true');
  });

  it('renders text variant with correct classes', () => {
    const { container } = render(<RoboSkeletonLoading variant='text' />);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain('h-4');
    expect(el.className).toContain('w-full');
    expect(el.className).toContain('rounded');
  });

  it('renders circle variant with rounded-full', () => {
    const { container } = render(<RoboSkeletonLoading variant='circle' width={48} height={48} />);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain('rounded-full');
  });

  it('renders rect variant with rounded', () => {
    const { container } = render(<RoboSkeletonLoading variant='rect' width='100%' height={120} />);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain('rounded');
  });

  it('applies numeric width as inline px style', () => {
    const { container } = render(<RoboSkeletonLoading width={200} />);
    const el = container.firstChild as HTMLElement;
    expect(el.style.width).toBe('200px');
  });

  it('applies string width as inline style', () => {
    const { container } = render(<RoboSkeletonLoading width='50%' />);
    const el = container.firstChild as HTMLElement;
    expect(el.style.width).toBe('50%');
  });

  it('applies numeric height as inline px style', () => {
    const { container } = render(<RoboSkeletonLoading height={80} />);
    const el = container.firstChild as HTMLElement;
    expect(el.style.height).toBe('80px');
  });

  it('applies motion-safe:animate-pulse', () => {
    const { container } = render(<RoboSkeletonLoading />);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain('motion-safe:animate-pulse');
  });

  it('applies bg-[var(--muted)]', () => {
    const { container } = render(<RoboSkeletonLoading />);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain('bg-[var(--muted)]');
  });

  it('forwards ref to div element', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<RoboSkeletonLoading ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('has displayName RoboSkeletonLoading', () => {
    expect(RoboSkeletonLoading.displayName).toBe('RoboSkeletonLoading');
  });

  it('passes additional className', () => {
    const { container } = render(<RoboSkeletonLoading className='custom-class' />);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('no a11y violations for text variant', async () => {
    const { container } = render(<RoboSkeletonLoading variant='text' />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('no a11y violations for circle variant', async () => {
    const { container } = render(<RoboSkeletonLoading variant='circle' width={48} height={48} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('no a11y violations for rect variant', async () => {
    const { container } = render(<RoboSkeletonLoading variant='rect' width='100%' height={120} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
