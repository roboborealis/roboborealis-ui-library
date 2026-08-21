import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';

import { RoboCheckbox, RoboCheckboxGroup } from './robo-checkbox';


describe('RoboCheckbox', () => {
  /* ---------------------------------------------------------------- */
  /* Rendering                                                          */
  /* ---------------------------------------------------------------- */

  it('renders a checkbox', () => {
    render(<RoboCheckbox />);
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('renders with a label', () => {
    render(<RoboCheckbox label='Accept terms' />);
    expect(screen.getByLabelText('Accept terms')).toBeInTheDocument();
  });

  it('renders a description below the label', () => {
    render(<RoboCheckbox label='Accept' description='Required to continue' />);
    expect(screen.getByText('Required to continue')).toBeInTheDocument();
  });

  it('renders helper text', () => {
    render(<RoboCheckbox label='Subscribe' helperText='We will not spam you' />);
    expect(screen.getByText('We will not spam you')).toBeInTheDocument();
  });

  it('renders error message', () => {
    render(<RoboCheckbox label='Agree' error='You must agree to continue' />);
    expect(screen.getByText('You must agree to continue')).toBeInTheDocument();
  });

  it('forwards ref to the checkbox element', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<RoboCheckbox ref={ref} label='Ref test' />);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('has displayName RoboCheckbox', () => {
    expect(RoboCheckbox.displayName).toBe('RoboCheckbox');
  });

  /* ---------------------------------------------------------------- */
  /* Error state                                                        */
  /* ---------------------------------------------------------------- */

  it('sets aria-invalid when error is provided', () => {
    render(<RoboCheckbox label='Accept' error='Required' />);
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('does not set aria-invalid when no error', () => {
    render(<RoboCheckbox label='Accept' />);
    expect(screen.getByRole('checkbox')).not.toHaveAttribute('aria-invalid');
  });

  it('error has role=alert', () => {
    render(<RoboCheckbox label='Accept' error='You must accept' />);
    expect(screen.getByRole('alert')).toHaveTextContent('You must accept');
  });

  /* ---------------------------------------------------------------- */
  /* Disabled state                                                     */
  /* ---------------------------------------------------------------- */

  it('is disabled when disabled prop is passed', () => {
    render(<RoboCheckbox label='Accept' disabled />);
    expect(screen.getByRole('checkbox')).toBeDisabled();
  });

  /* ---------------------------------------------------------------- */
  /* Checked / Indeterminate states                                     */
  /* ---------------------------------------------------------------- */

  it('renders as checked when checked=true', () => {
    render(<RoboCheckbox label='Checked' checked={true} onCheckedChange={() => {}} />);
    expect(screen.getByRole('checkbox')).toHaveAttribute('data-state', 'checked');
  });

  it('renders as unchecked by default', () => {
    render(<RoboCheckbox label='Unchecked' />);
    expect(screen.getByRole('checkbox')).toHaveAttribute('data-state', 'unchecked');
  });

  it('renders indeterminate state when indeterminate=true', () => {
    render(<RoboCheckbox label='Select all' indeterminate />);
    expect(screen.getByRole('checkbox')).toHaveAttribute('data-state', 'indeterminate');
  });

  /* ---------------------------------------------------------------- */
  /* Keyboard interaction                                               */
  /* ---------------------------------------------------------------- */

  it('toggles checked state on Space key', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<RoboCheckbox label='Accept' onCheckedChange={onChange} />);
    const checkbox = screen.getByRole('checkbox');
    checkbox.focus();
    await user.keyboard(' ');
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('calls onCheckedChange when clicked', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<RoboCheckbox label='Accept' onCheckedChange={onChange} />);
    await user.click(screen.getByRole('checkbox'));
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  /* ---------------------------------------------------------------- */
  /* Accessibility                                                      */
  /* ---------------------------------------------------------------- */

  it('has no a11y violations (unchecked)', async () => {
    const { container } = render(<RoboCheckbox label='Accept terms' />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no a11y violations (checked)', async () => {
    const { container } = render(
      <RoboCheckbox label='Accept terms' checked={true} onCheckedChange={() => {}} />
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no a11y violations in error state', async () => {
    const { container } = render(
      <RoboCheckbox label='Accept terms' error='You must accept' />
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no a11y violations when disabled', async () => {
    const { container } = render(<RoboCheckbox label='Accept terms' disabled />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

/* ------------------------------------------------------------------ */
/* RoboCheckboxGroup                                                      */
/* ------------------------------------------------------------------ */

const options = [
  { name: 'read', value: 'read', label: 'Read' },
  { name: 'write', value: 'write', label: 'Write' },
  { name: 'admin', value: 'admin', label: 'Admin', disabled: true },
];

describe('RoboCheckboxGroup', () => {
  it('renders all options', () => {
    render(<RoboCheckboxGroup options={options} />);
    expect(screen.getByLabelText('Read')).toBeInTheDocument();
    expect(screen.getByLabelText('Write')).toBeInTheDocument();
    expect(screen.getByLabelText('Admin')).toBeInTheDocument();
  });

  it('renders group label in a fieldset/legend', () => {
    render(<RoboCheckboxGroup options={options} label='Permissions' />);
    expect(screen.getByText('Permissions')).toBeInTheDocument();
  });

  it('marks checked options', () => {
    render(<RoboCheckboxGroup options={options} value={['read', 'write']} />);
    expect(screen.getByLabelText('Read')).toHaveAttribute('data-state', 'checked');
    expect(screen.getByLabelText('Write')).toHaveAttribute('data-state', 'checked');
    expect(screen.getByLabelText('Admin')).toHaveAttribute('data-state', 'unchecked');
  });

  it('calls onChange with updated values when an option is toggled on', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<RoboCheckboxGroup options={options} value={[]} onChange={onChange} />);
    await user.click(screen.getByLabelText('Read'));
    expect(onChange).toHaveBeenCalledWith(['read']);
  });

  it('calls onChange with remaining values when an option is toggled off', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <RoboCheckboxGroup options={options} value={['read', 'write']} onChange={onChange} />
    );
    await user.click(screen.getByLabelText('Read'));
    expect(onChange).toHaveBeenCalledWith(['write']);
  });

  it('disabled option cannot be clicked', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<RoboCheckboxGroup options={options} value={[]} onChange={onChange} />);
    expect(screen.getByLabelText('Admin')).toBeDisabled();
  });

  it('renders error in a role=alert', () => {
    render(
      <RoboCheckboxGroup options={options} error='Please select at least one' />
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Please select at least one');
  });

  it('has no a11y violations', async () => {
    const { container } = render(
      <RoboCheckboxGroup options={options} label='Permissions' value={['read']} />
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
