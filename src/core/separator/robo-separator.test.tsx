import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { RoboSeparator } from './robo-separator';


describe('RoboSeparator', () => {
  it('renders with role="separator" by default', () => {
    render(<RoboSeparator />);
    expect(screen.getByRole('separator')).toBeInTheDocument();
  });

  it('orientation="horizontal" (default) renders aria-orientation="horizontal"', () => {
    render(<RoboSeparator orientation='horizontal' />);
    expect(screen.getByRole('separator')).toHaveAttribute('aria-orientation', 'horizontal');
  });

  it('orientation="vertical" renders aria-orientation="vertical"', () => {
    render(<RoboSeparator orientation='vertical' />);
    expect(screen.getByRole('separator')).toHaveAttribute('aria-orientation', 'vertical');
  });

  it('renders label text when label prop is provided', () => {
    render(<RoboSeparator label='Section' />);
    expect(screen.getByText('Section')).toBeInTheDocument();
  });

  it('does not render label text when label prop is absent', () => {
    render(<RoboSeparator />);
    // No text nodes other than the separator element itself
    expect(screen.queryByText(/./)).not.toBeInTheDocument();
  });

  it('has displayName RoboSeparator', () => {
    expect(RoboSeparator.displayName).toBe('RoboSeparator');
  });

  it('forwards ref to the separator element', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<RoboSeparator ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('no a11y violations for horizontal separator', async () => {
    const { container } = render(<RoboSeparator />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('no a11y violations for vertical separator', async () => {
    const { container } = render(<RoboSeparator orientation='vertical' />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('no a11y violations for labeled separator', async () => {
    const { container } = render(<RoboSeparator label='Section Header' />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
