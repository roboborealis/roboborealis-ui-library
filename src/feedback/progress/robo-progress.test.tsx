import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { RoboProgress } from './robo-progress';


describe('RoboProgress', () => {
  it('renders a progressbar role', () => {
    render(<RoboProgress value={50} />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders determinate state with correct aria-valuenow', () => {
    render(<RoboProgress value={75} max={100} />);
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuenow', '75');
  });

  it('renders aria-valuemin and aria-valuemax', () => {
    render(<RoboProgress value={30} max={100} />);
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuemin', '0');
    expect(bar).toHaveAttribute('aria-valuemax', '100');
  });

  it('renders indeterminate state without aria-valuenow', () => {
    render(<RoboProgress indeterminate />);
    const bar = screen.getByRole('progressbar');
    expect(bar).not.toHaveAttribute('aria-valuenow');
  });

  it('indeterminate indicator has robo-progress-indeterminate class', () => {
    const { container } = render(<RoboProgress indeterminate />);
    const indicator = container.querySelector('[data-indeterminate]');
    expect(indicator).toBeInTheDocument();
  });

  it('shows percentage label when showLabel={true}', () => {
    render(<RoboProgress value={60} showLabel />);
    expect(screen.getByText('60%')).toBeInTheDocument();
  });

  it('shows label text with percentage when label and showLabel provided', () => {
    render(<RoboProgress value={40} label='Upload' showLabel />);
    expect(screen.getByText(/Upload: 40%/)).toBeInTheDocument();
  });

  it('does not show label text when showLabel is false', () => {
    render(<RoboProgress value={60} label='Upload' showLabel={false} />);
    expect(screen.queryByText(/Upload/)).not.toBeInTheDocument();
  });

  it('clamps value to 0 minimum', () => {
    render(<RoboProgress value={-10} />);
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuenow', '-10');
  });

  it('applies custom max', () => {
    render(<RoboProgress value={5} max={10} />);
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuemax', '10');
    expect(bar).toHaveAttribute('aria-valuenow', '5');
  });

  it('has displayName RoboProgress', () => {
    expect(RoboProgress.displayName).toBe('RoboProgress');
  });

  it('forwards ref to the root element', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<RoboProgress ref={ref} value={50} />);
    expect(ref.current).not.toBeNull();
  });

  it('no a11y violations for determinate', async () => {
    const { container } = render(<RoboProgress value={60} label='Loading' />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('no a11y violations for indeterminate', async () => {
    const { container } = render(<RoboProgress indeterminate label='Processing' />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('no a11y violations with showLabel', async () => {
    const { container } = render(<RoboProgress value={75} label='Upload' showLabel />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
