import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';

import { RoboTextarea } from './robo-textarea';


describe('RoboTextarea', () => {
  /* ---------------------------------------------------------------- */
  /* Rendering                                                          */
  /* ---------------------------------------------------------------- */

  it('renders a textarea element', () => {
    render(<RoboTextarea />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('renders with a visible label', () => {
    render(<RoboTextarea label='Description' />);
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
  });

  it('renders helper text', () => {
    render(<RoboTextarea helperText='Enter a description' />);
    expect(screen.getByText('Enter a description')).toBeInTheDocument();
  });

  it('renders error message', () => {
    render(<RoboTextarea error='This field is required' />);
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('displays the character count when showCount and maxLength are set', () => {
    render(<RoboTextarea maxLength={100} showCount defaultValue='hello' />);
    expect(screen.getByText('5/100')).toBeInTheDocument();
  });

  it('does not show count when showCount is false', () => {
    render(<RoboTextarea maxLength={100} defaultValue='hello' />);
    expect(screen.queryByText(/\/100/)).not.toBeInTheDocument();
  });

  it('applies default rows=4', () => {
    render(<RoboTextarea />);
    expect(screen.getByRole('textbox')).toHaveAttribute('rows', '4');
  });

  it('applies custom rows', () => {
    render(<RoboTextarea rows={8} />);
    expect(screen.getByRole('textbox')).toHaveAttribute('rows', '8');
  });

  it('forwards ref to the textarea element', () => {
    const ref = React.createRef<HTMLTextAreaElement>();
    render(<RoboTextarea ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
  });

  it('has displayName RoboTextarea', () => {
    expect(RoboTextarea.displayName).toBe('RoboTextarea');
  });

  /* ---------------------------------------------------------------- */
  /* Error state                                                        */
  /* ---------------------------------------------------------------- */

  it('sets aria-invalid when error is provided', () => {
    render(<RoboTextarea error='Required' />);
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('does not set aria-invalid when there is no error', () => {
    render(<RoboTextarea />);
    expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-invalid');
  });

  it('error message has role=alert', () => {
    render(<RoboTextarea error='Something went wrong' />);
    expect(screen.getByRole('alert')).toHaveTextContent('Something went wrong');
  });

  it('error message takes precedence over helperText', () => {
    render(<RoboTextarea helperText='Helper' error='Error' />);
    expect(screen.queryByText('Helper')).not.toBeInTheDocument();
    expect(screen.getByText('Error')).toBeInTheDocument();
  });

  it('aria-describedby points to helper when no error', () => {
    render(<RoboTextarea helperText='Some help' />);
    const textarea = screen.getByRole('textbox');
    const helperId = textarea.getAttribute('aria-describedby');
    expect(helperId).toBeTruthy();
    const helperEl = document.getElementById(helperId!);
    expect(helperEl).toHaveTextContent('Some help');
  });

  it('aria-describedby points to error element when error is present', () => {
    render(<RoboTextarea error='Oops' />);
    const textarea = screen.getByRole('textbox');
    const describedBy = textarea.getAttribute('aria-describedby');
    expect(describedBy).toBeTruthy();
    const errorEl = document.getElementById(describedBy!);
    expect(errorEl).toHaveTextContent('Oops');
  });

  /* ---------------------------------------------------------------- */
  /* Disabled state                                                     */
  /* ---------------------------------------------------------------- */

  it('is disabled when disabled prop is passed', () => {
    render(<RoboTextarea disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  /* ---------------------------------------------------------------- */
  /* Keyboard interaction                                               */
  /* ---------------------------------------------------------------- */

  it('accepts typed input', async () => {
    const user = userEvent.setup();
    render(<RoboTextarea />);
    const ta = screen.getByRole('textbox');
    await user.click(ta);
    await user.type(ta, 'hello world');
    expect(ta).toHaveValue('hello world');
  });

  it('updates character count as user types', async () => {
    const user = userEvent.setup();
    render(<RoboTextarea maxLength={50} showCount />);
    const ta = screen.getByRole('textbox');
    await user.type(ta, 'abc');
    expect(screen.getByText('3/50')).toBeInTheDocument();
  });

  it('respects controlled value', () => {
    render(<RoboTextarea value='controlled' onChange={() => {}} />);
    expect(screen.getByRole('textbox')).toHaveValue('controlled');
  });

  /* ---------------------------------------------------------------- */
  /* Accessibility                                                      */
  /* ---------------------------------------------------------------- */

  it('has no a11y violations with default props', async () => {
    const { container } = render(<RoboTextarea label='Description' />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no a11y violations in error state', async () => {
    const { container } = render(
      <RoboTextarea label='Notes' error='This field is required' />
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no a11y violations when disabled', async () => {
    const { container } = render(<RoboTextarea label='Notes' disabled />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no a11y violations with showCount', async () => {
    const { container } = render(
      <RoboTextarea label='Bio' maxLength={200} showCount defaultValue='Hello' />
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
