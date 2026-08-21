import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';

import { RoboRadioGroup } from './robo-radio-group';


const options = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly', description: 'Sent every Monday' },
  { value: 'monthly', label: 'Monthly', disabled: true },
];

describe('RoboRadioGroup', () => {
  /* ---------------------------------------------------------------- */
  /* Rendering                                                          */
  /* ---------------------------------------------------------------- */

  it('renders all options as radio buttons', () => {
    render(<RoboRadioGroup options={options} />);
    expect(screen.getAllByRole('radio')).toHaveLength(3);
  });

  it('renders option labels', () => {
    render(<RoboRadioGroup options={options} />);
    expect(screen.getByLabelText('Daily')).toBeInTheDocument();
    expect(screen.getByLabelText('Weekly')).toBeInTheDocument();
    expect(screen.getByLabelText('Monthly')).toBeInTheDocument();
  });

  it('renders a group label inside a fieldset legend', () => {
    render(<RoboRadioGroup options={options} label='Frequency' />);
    expect(screen.getByText('Frequency')).toBeInTheDocument();
  });

  it('renders option description text', () => {
    render(<RoboRadioGroup options={options} />);
    expect(screen.getByText('Sent every Monday')).toBeInTheDocument();
  });

  it('renders helper text when provided', () => {
    render(<RoboRadioGroup options={options} helperText='Select one option' />);
    expect(screen.getByText('Select one option')).toBeInTheDocument();
  });

  it('renders error message when provided', () => {
    render(<RoboRadioGroup options={options} error='Please select an option' />);
    expect(screen.getByText('Please select an option')).toBeInTheDocument();
  });

  it('error message has role="alert"', () => {
    render(<RoboRadioGroup options={options} error='Required' />);
    expect(screen.getByRole('alert')).toHaveTextContent('Required');
  });

  /* ---------------------------------------------------------------- */
  /* State                                                              */
  /* ---------------------------------------------------------------- */

  it('marks the controlled value as checked', () => {
    render(<RoboRadioGroup options={options} value='weekly' />);
    expect(screen.getByLabelText('Weekly')).toHaveAttribute('data-state', 'checked');
  });

  it('marks other options as unchecked when value is controlled', () => {
    render(<RoboRadioGroup options={options} value='weekly' />);
    expect(screen.getByLabelText('Daily')).toHaveAttribute('data-state', 'unchecked');
  });

  it('disables individual options that have disabled=true', () => {
    render(<RoboRadioGroup options={options} />);
    expect(screen.getByLabelText('Monthly')).toBeDisabled();
  });

  it('disables all options when the group disabled prop is set', () => {
    render(<RoboRadioGroup options={options} disabled />);
    const radios = screen.getAllByRole('radio');
    radios.forEach((radio) => expect(radio).toBeDisabled());
  });

  /* ---------------------------------------------------------------- */
  /* Interaction                                                        */
  /* ---------------------------------------------------------------- */

  it('calls onValueChange when an option is clicked', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<RoboRadioGroup options={options} onValueChange={onValueChange} />);
    await user.click(screen.getByLabelText('Daily'));
    expect(onValueChange).toHaveBeenCalledWith('daily');
  });

  it('calls onValueChange with correct value when switching selection', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <RoboRadioGroup options={options} value='daily' onValueChange={onValueChange} />
    );
    await user.click(screen.getByLabelText('Weekly'));
    expect(onValueChange).toHaveBeenCalledWith('weekly');
  });

  /* ---------------------------------------------------------------- */
  /* Orientation                                                        */
  /* ---------------------------------------------------------------- */

  it('renders horizontal orientation without crashing', () => {
    const { container } = render(
      <RoboRadioGroup options={options} orientation='horizontal' />
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  /* ---------------------------------------------------------------- */
  /* displayName                                                        */
  /* ---------------------------------------------------------------- */

  it('has displayName RoboRadioGroup', () => {
    expect(RoboRadioGroup.displayName).toBe('RoboRadioGroup');
  });

  /* ---------------------------------------------------------------- */
  /* Accessibility                                                      */
  /* ---------------------------------------------------------------- */

  it('has no a11y violations in default state', async () => {
    const { container } = render(
      <RoboRadioGroup options={options} label='Frequency' />
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no a11y violations in error state', async () => {
    const { container } = render(
      <RoboRadioGroup options={options} label='Frequency' error='Required' />
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
