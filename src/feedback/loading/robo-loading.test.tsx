import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { RoboLoading } from './robo-loading';


// ---------------------------------------------------------------------------
// RoboLoading
// ---------------------------------------------------------------------------

describe('RoboLoading', () => {
  it('renders with role="status"', () => {
    render(<RoboLoading />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('has default aria-label "Loading"', () => {
    render(<RoboLoading />);
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Loading');
  });

  it('accepts a custom label prop', () => {
    render(<RoboLoading label='Fetching telemetry' />);
    expect(screen.getByRole('status')).toHaveAttribute(
      'aria-label',
      'Fetching telemetry',
    );
  });

  it('has aria-busy set to "true"', () => {
    render(<RoboLoading />);
    expect(screen.getByRole('status')).toHaveAttribute('aria-busy', 'true');
  });

  it('applies size variant classes', () => {
    const { rerender } = render(<RoboLoading size='sm' />);
    expect(screen.getByRole('status').className).toContain(
      '[&_.robo-loading-svg]:w-20',
    );

    rerender(<RoboLoading size='lg' />);
    expect(screen.getByRole('status').className).toContain(
      '[&_.robo-loading-svg]:w-40',
    );
  });

  it('applies default size variant (md) when size is omitted', () => {
    render(<RoboLoading />);
    expect(screen.getByRole('status').className).toContain(
      '[&_.robo-loading-svg]:w-28',
    );
  });

  it('passes additional className', () => {
    render(<RoboLoading className='my-custom-loader' />);
    expect(screen.getByRole('status')).toHaveClass('my-custom-loader');
  });

  it('forwards ref to the container div', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<RoboLoading ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('has displayName RoboLoading', () => {
    expect(RoboLoading.displayName).toBe('RoboLoading');
  });

  it('renders an SVG scene inside an aria-hidden wrapper', () => {
    const { container } = render(<RoboLoading />);
    const svgWrapper = container.querySelector('.robo-loading-svg');
    expect(svgWrapper).toBeInTheDocument();
    expect(svgWrapper).toHaveAttribute('aria-hidden', 'true');
    expect(svgWrapper?.querySelector('svg')).toBeInTheDocument();
  });

  it('no a11y violations', async () => {
    const { container } = render(<RoboLoading />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('no a11y violations with custom label', async () => {
    const { container } = render(
      <RoboLoading label='Loading mission data' size='lg' />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
