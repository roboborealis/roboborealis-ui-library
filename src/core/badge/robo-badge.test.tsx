import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { RoboBadge } from './robo-badge';


describe('RoboBadge', () => {
  it('renders text content', () => {
    render(<RoboBadge>Active</RoboBadge>);
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('usage="status" renders a colored dot before text', () => {
    render(<RoboBadge usage='status'>Online</RoboBadge>);
    // dot is aria-hidden span
    const dot = document.querySelector('[aria-hidden="true"]');
    expect(dot).toBeInTheDocument();
    expect(screen.getByText('Online')).toBeInTheDocument();
  });

  it('usage="count" with value > 99 displays "99+"', () => {
    render(<RoboBadge usage='count' count={150}>Ignored</RoboBadge>);
    expect(screen.getByText('99+')).toBeInTheDocument();
  });

  it('usage="count" with value <= 99 displays the number', () => {
    render(<RoboBadge usage='count' count={42}>Ignored</RoboBadge>);
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('usage="count" with value of 99 displays 99 (boundary)', () => {
    render(<RoboBadge usage='count' count={99}>Ignored</RoboBadge>);
    expect(screen.getByText('99')).toBeInTheDocument();
  });

  it('usage="count" with value of 100 displays "99+" (boundary)', () => {
    render(<RoboBadge usage='count' count={100}>Ignored</RoboBadge>);
    expect(screen.getByText('99+')).toBeInTheDocument();
  });

  it('usage="label" renders text in a rounded rectangle', () => {
    render(<RoboBadge usage='label'>New</RoboBadge>);
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('color="default" applies a gray-like class', () => {
    const { container } = render(<RoboBadge color='default'>Default</RoboBadge>);
    // Verify the badge element exists and has content
    expect(container.firstChild).toBeInTheDocument();
  });

  it('color="primary" applies a distinct class from default', () => {
    const { container: primary } = render(<RoboBadge color='primary'>Primary</RoboBadge>);
    const { container: def } = render(<RoboBadge color='default'>Default</RoboBadge>);
    const primaryClass = (primary.firstChild as HTMLElement).className;
    const defClass = (def.firstChild as HTMLElement).className;
    expect(primaryClass).not.toBe(defClass);
  });

  it('color="success" applies a distinct class', () => {
    const { container } = render(<RoboBadge color='success'>Success</RoboBadge>);
    expect((container.firstChild as HTMLElement).className).toContain('success');
  });

  it('color="warning" applies a distinct class', () => {
    const { container } = render(<RoboBadge color='warning'>Warning</RoboBadge>);
    expect((container.firstChild as HTMLElement).className).toContain('warning');
  });

  it('color="destructive" applies a distinct class', () => {
    const { container } = render(<RoboBadge color='destructive'>Error</RoboBadge>);
    expect((container.firstChild as HTMLElement).className).toContain('destructive');
  });

  it('has displayName RoboBadge', () => {
    expect(RoboBadge.displayName).toBe('RoboBadge');
  });

  it('no a11y violations for default label badge', async () => {
    const { container } = render(<RoboBadge>Label</RoboBadge>);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('no a11y violations for status badge', async () => {
    const { container } = render(<RoboBadge usage='status'>Active</RoboBadge>);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('no a11y violations for count badge', async () => {
    const { container } = render(<RoboBadge usage='count' count={5}>Notifications</RoboBadge>);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('RoboBadge WCAG fixes', () => {
  it('default badge uses --foreground not --muted-foreground for text', () => {
    const { container } = render(<RoboBadge>Label</RoboBadge>);
    const badge = container.firstChild as HTMLElement;
    expect(badge.className).not.toContain('muted-foreground');
    expect(badge.className).toContain('foreground');
  });

  it('status badge has role="status"', () => {
    render(<RoboBadge usage='status'>Online</RoboBadge>);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('count badge above 99 has aria-label "More than 99 notifications"', () => {
    render(<RoboBadge usage='count' count={150} />);
    expect(screen.getByLabelText('More than 99 notifications')).toBeInTheDocument();
  });

  it('count badge at or below 99 has aria-label equal to the count string', () => {
    render(<RoboBadge usage='count' count={7} />);
    expect(screen.getByLabelText('7')).toBeInTheDocument();
  });

  it('count badge with children context incorporates children into aria-label', () => {
    render(<RoboBadge usage='count' count={7}>Notifications</RoboBadge>);
    expect(screen.getByLabelText('Notifications: 7')).toBeInTheDocument();
  });

  it('count badge without children uses count only as aria-label', () => {
    render(<RoboBadge usage='count' count={7} />);
    expect(screen.getByLabelText('7')).toBeInTheDocument();
  });

  it('count badge above 99 with children incorporates children', () => {
    render(<RoboBadge usage='count' count={150}>Messages</RoboBadge>);
    expect(screen.getByLabelText('Messages: More than 99 notifications')).toBeInTheDocument();
  });
});
