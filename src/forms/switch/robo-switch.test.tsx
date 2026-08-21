import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';

import { RoboSwitch } from './robo-switch';


describe('RoboSwitch', () => {
  /* ---------------------------------------------------------------- */
  /* Rendering                                                          */
  /* ---------------------------------------------------------------- */

  it('renders a switch button', () => {
    render(<RoboSwitch />);
    expect(screen.getByRole('switch')).toBeInTheDocument();
  });

  it('renders with a visible label', () => {
    render(<RoboSwitch label='Enable notifications' />);
    expect(screen.getByLabelText('Enable notifications')).toBeInTheDocument();
  });

  it('renders a description', () => {
    render(<RoboSwitch label='Dark mode' description='Applies globally' />);
    expect(screen.getByText('Applies globally')).toBeInTheDocument();
  });

  it('forwards ref to the switch element', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<RoboSwitch ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('has displayName RoboSwitch', () => {
    expect(RoboSwitch.displayName).toBe('RoboSwitch');
  });

  /* ---------------------------------------------------------------- */
  /* Error state — aria-invalid                                         */
  /* ---------------------------------------------------------------- */

  it('sets aria-invalid via custom prop when passed through', () => {
    // RoboSwitch does not have a direct error prop, but can receive aria-invalid
    render(<RoboSwitch label='Terms' aria-invalid='true' />);
    expect(screen.getByRole('switch')).toHaveAttribute('aria-invalid', 'true');
  });

  /* ---------------------------------------------------------------- */
  /* Size variants                                                       */
  /* ---------------------------------------------------------------- */

  it('renders sm size track class', () => {
    render(<RoboSwitch size='sm' />);
    const sw = screen.getByRole('switch');
    expect(sw.className).toContain('h-5');
    expect(sw.className).toContain('w-9');
  });

  it('renders md size track class (default)', () => {
    render(<RoboSwitch />);
    const sw = screen.getByRole('switch');
    expect(sw.className).toContain('h-6');
    expect(sw.className).toContain('w-11');
  });

  it('renders lg size track class', () => {
    render(<RoboSwitch size='lg' />);
    const sw = screen.getByRole('switch');
    expect(sw.className).toContain('h-7');
  });

  /* ---------------------------------------------------------------- */
  /* Checked / Unchecked states                                          */
  /* ---------------------------------------------------------------- */

  it('is unchecked by default', () => {
    render(<RoboSwitch />);
    expect(screen.getByRole('switch')).toHaveAttribute('data-state', 'unchecked');
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false');
  });

  it('is checked when checked=true', () => {
    render(<RoboSwitch checked={true} onCheckedChange={() => {}} />);
    expect(screen.getByRole('switch')).toHaveAttribute('data-state', 'checked');
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
  });

  /* ---------------------------------------------------------------- */
  /* Disabled state                                                     */
  /* ---------------------------------------------------------------- */

  it('is disabled when disabled prop is passed', () => {
    render(<RoboSwitch label='Notify' disabled />);
    expect(screen.getByRole('switch')).toBeDisabled();
  });

  /* ---------------------------------------------------------------- */
  /* Keyboard interaction                                               */
  /* ---------------------------------------------------------------- */

  it('toggles on Space key', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<RoboSwitch label='Toggle' onCheckedChange={onChange} />);
    screen.getByRole('switch').focus();
    await user.keyboard(' ');
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('calls onCheckedChange when clicked', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<RoboSwitch label='Toggle' onCheckedChange={onChange} />);
    await user.click(screen.getByRole('switch'));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('does not call onCheckedChange when disabled', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<RoboSwitch label='Toggle' disabled onCheckedChange={onChange} />);
    await user.click(screen.getByRole('switch'));
    expect(onChange).not.toHaveBeenCalled();
  });

  /* ---------------------------------------------------------------- */
  /* Accessibility                                                      */
  /* ---------------------------------------------------------------- */

  it('has no a11y violations (off)', async () => {
    const { container } = render(<RoboSwitch label='Enable notifications' />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no a11y violations (on)', async () => {
    const { container } = render(
      <RoboSwitch label='Enable notifications' checked={true} onCheckedChange={() => {}} />
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no a11y violations when disabled', async () => {
    const { container } = render(<RoboSwitch label='Enable notifications' disabled />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no a11y violations with description', async () => {
    const { container } = render(
      <RoboSwitch label='Dark mode' description='Applies globally to the app' size='lg' />
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
