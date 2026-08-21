import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { RoboAlert } from './robo-alert';


describe('RoboAlert', () => {
  it('renders info variant with role="status"', () => {
    render(<RoboAlert variant='info'>Information message</RoboAlert>);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders success variant with role="status"', () => {
    render(<RoboAlert variant='success'>Success message</RoboAlert>);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders warning variant with role="alert"', () => {
    render(<RoboAlert variant='warning'>Warning message</RoboAlert>);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('renders error variant with role="alert"', () => {
    render(<RoboAlert variant='error'>Error message</RoboAlert>);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('renders children content', () => {
    render(<RoboAlert variant='info'>Alert body content</RoboAlert>);
    expect(screen.getByText('Alert body content')).toBeInTheDocument();
  });

  it('renders title when provided', () => {
    render(<RoboAlert variant='success' title='Operation succeeded'>Done</RoboAlert>);
    expect(screen.getByText('Operation succeeded')).toBeInTheDocument();
  });

  it('does not render title element when omitted', () => {
    render(<RoboAlert variant='info'>No title here</RoboAlert>);
    expect(screen.queryByText('No title here')).toBeInTheDocument();
  });

  it('renders dismiss button when dismissible={true}', () => {
    render(<RoboAlert variant='info' dismissible>Message</RoboAlert>);
    expect(screen.getByRole('button', { name: /dismiss alert/i })).toBeInTheDocument();
  });

  it('does not render dismiss button when dismissible={false}', () => {
    render(<RoboAlert variant='info'>Message</RoboAlert>);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('hides alert when dismiss button is clicked', async () => {
    render(
      <RoboAlert variant='info' dismissible>
        Dismissible alert
      </RoboAlert>
    );
    await userEvent.click(screen.getByRole('button', { name: /dismiss alert/i }));
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('calls onDismiss callback when dismiss is clicked', async () => {
    const onDismiss = vi.fn();
    render(
      <RoboAlert variant='warning' dismissible onDismiss={onDismiss}>
        Message
      </RoboAlert>
    );
    await userEvent.click(screen.getByRole('button', { name: /dismiss alert/i }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('applies info variant classes', () => {
    render(<RoboAlert variant='info'>Info</RoboAlert>);
    const el = screen.getByRole('status');
    expect(el.className).toContain('border-[var(--primary)]');
  });

  it('applies error variant classes', () => {
    render(<RoboAlert variant='error'>Error</RoboAlert>);
    const el = screen.getByRole('alert');
    expect(el.className).toContain('border-[var(--destructive)]');
  });

  it('renders emergency variant with role="alert"', () => {
    render(<RoboAlert variant='emergency'>Emergency message</RoboAlert>);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('applies emergency variant classes', () => {
    render(<RoboAlert variant='emergency'>Emergency</RoboAlert>);
    const el = screen.getByRole('alert');
    expect(el.className).toContain('border-[var(--destructive)]');
  });

  it('renders left-stripe strobe element for emergency', () => {
    const { container } = render(<RoboAlert variant='emergency'>Emergency</RoboAlert>);
    const strobe = container.querySelector('[data-testid="emergency-strobe"]');
    expect(strobe).toBeInTheDocument();
    expect(strobe?.className).toContain('absolute');
  });

  it('does not render strobe element for non-emergency variants', () => {
    const { container } = render(<RoboAlert variant='error'>Error</RoboAlert>);
    expect(container.querySelector('[data-testid="emergency-strobe"]')).not.toBeInTheDocument();
  });

  it('forwards ref to the div element', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<RoboAlert ref={ref} variant='info'>Message</RoboAlert>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('has displayName RoboAlert', () => {
    expect(RoboAlert.displayName).toBe('RoboAlert');
  });

  it('no a11y violations for info variant', async () => {
    const { container } = render(<RoboAlert variant='info'>Info message</RoboAlert>);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('no a11y violations for success variant', async () => {
    const { container } = render(<RoboAlert variant='success' title='Done'>Success</RoboAlert>);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('no a11y violations for warning variant', async () => {
    const { container } = render(<RoboAlert variant='warning'>Warning</RoboAlert>);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('no a11y violations for error variant', async () => {
    const { container } = render(<RoboAlert variant='error'>Error occurred</RoboAlert>);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('no a11y violations when dismissible', async () => {
    const { container } = render(
      <RoboAlert variant='info' dismissible>Dismissible</RoboAlert>
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('no a11y violations for emergency variant', async () => {
    const { container } = render(
      <RoboAlert variant='emergency' title='ANOMALY'>Satellite signal loss</RoboAlert>
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
