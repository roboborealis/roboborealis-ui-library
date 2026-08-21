import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { RoboChip } from './robo-chip';

describe('RoboChip', () => {
  it('renders children', () => {
    render(<RoboChip>Active</RoboChip>);
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('does not render dismiss button without onDismiss', () => {
    render(<RoboChip>Filter</RoboChip>);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders dismiss button when onDismiss is provided', () => {
    render(<RoboChip onDismiss={() => {}}>Tag</RoboChip>);
    expect(screen.getByRole('button', { name: 'Remove' })).toBeInTheDocument();
  });

  it('calls onDismiss when dismiss button clicked', async () => {
    const onDismiss = vi.fn();
    render(<RoboChip onDismiss={onDismiss}>Tag</RoboChip>);
    await userEvent.click(screen.getByRole('button', { name: 'Remove' }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('uses custom dismissLabel for accessibility', () => {
    render(<RoboChip onDismiss={() => {}} dismissLabel='Remove satellite filter'>Tag</RoboChip>);
    expect(screen.getByRole('button', { name: 'Remove satellite filter' })).toBeInTheDocument();
  });

  it('renders icon', () => {
    render(<RoboChip icon={<span data-testid='chip-icon' />}>Tagged</RoboChip>);
    expect(screen.getByTestId('chip-icon')).toBeInTheDocument();
  });

  it('forwards className', () => {
    render(<RoboChip className='my-chip'>Content</RoboChip>);
    // getByText returns the span element itself when text is its direct child
    expect(screen.getByText('Content')).toHaveClass('my-chip');
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLSpanElement>();
    render(<RoboChip ref={ref}>Chip</RoboChip>);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });

  // ── Focus ring ─────────────────────────────────────────────────────────────

  it('does not suppress focus ring with focus-within:outline-none on the chip wrapper', () => {
    const { container } = render(<RoboChip onDismiss={() => {}}>Tag</RoboChip>);
    const chipWrapper = container.firstChild as HTMLElement;
    const className = chipWrapper?.className ?? '';
    expect(className).not.toContain('focus-within:outline-none');
  });

  // ── ARIA grouping ──────────────────────────────────────────────────────────

  it('adds role="group" and aria-label when onDismiss is provided', () => {
    render(<RoboChip onDismiss={() => {}}>Active</RoboChip>);
    const group = screen.getByRole('group', { name: 'Active' });
    expect(group).toBeInTheDocument();
  });

  it('does not add role="group" when onDismiss is not provided', () => {
    render(<RoboChip>Static</RoboChip>);
    expect(screen.queryByRole('group')).not.toBeInTheDocument();
  });

  // ── Logical margin properties ──────────────────────────────────────────────

  it('uses logical margin classes (ms-0.5/-me-0.5) on the dismiss button', () => {
    const { container } = render(<RoboChip onDismiss={() => {}}>Tag</RoboChip>);
    const btn = container.querySelector('button')!;
    expect(btn.className).toContain('ms-0.5');
    expect(btn.className).toContain('-me-0.5');
    expect(btn.className).not.toContain('ml-0.5');
    expect(btn.className).not.toContain('-mr-0.5');
  });
});
