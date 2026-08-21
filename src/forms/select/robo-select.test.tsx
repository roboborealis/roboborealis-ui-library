import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';

import { RoboSelect } from './robo-select';


const options = [
  { value: 'us', label: 'United States' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'ca', label: 'Canada', disabled: true },
];

describe('RoboSelect', () => {
  /* ---------------------------------------------------------------- */
  /* Rendering                                                          */
  /* ---------------------------------------------------------------- */

  it('renders the trigger button', () => {
    render(<RoboSelect options={options} />);
    // Radix Select.Trigger renders as role=combobox
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('renders the label when provided', () => {
    render(<RoboSelect label='Country' options={options} />);
    expect(screen.getByText('Country')).toBeInTheDocument();
  });

  it('portals the dropdown into a provided container', async () => {
    function Harness() {
      const [el, setEl] = React.useState<HTMLDivElement | null>(null);
      return (
        <div>
          <div data-testid='scope' ref={setEl} />
          <RoboSelect options={options} container={el} aria-label='Country' />
        </div>
      );
    }
    render(<Harness />);
    await userEvent.click(screen.getByRole('combobox'));

    const scope = screen.getByTestId('scope');
    const option = await screen.findByRole('option', { name: 'United States' });
    expect(scope).toContainElement(option);
  });

  it('renders helper text when provided', () => {
    render(<RoboSelect options={options} helperText='Select your country' />);
    expect(screen.getByText('Select your country')).toBeInTheDocument();
  });

  it('renders error message when provided', () => {
    render(<RoboSelect options={options} error='Please select an option' />);
    expect(screen.getByText('Please select an option')).toBeInTheDocument();
  });

  it('error message has role="alert"', () => {
    render(<RoboSelect options={options} error='Required field' />);
    expect(screen.getByRole('alert')).toHaveTextContent('Required field');
  });

  it('renders placeholder text', () => {
    render(<RoboSelect options={options} placeholder='Pick one' />);
    expect(screen.getByText('Pick one')).toBeInTheDocument();
  });

  /* ---------------------------------------------------------------- */
  /* Disabled state                                                     */
  /* ---------------------------------------------------------------- */

  it('is disabled when disabled prop is passed', () => {
    render(<RoboSelect options={options} disabled />);
    expect(screen.getByRole('combobox')).toBeDisabled();
  });

  /* ---------------------------------------------------------------- */
  /* Required / aria attributes                                         */
  /* ---------------------------------------------------------------- */

  it('shows required indicator when required prop is provided', () => {
    render(<RoboSelect label='Country' options={options} required />);
    // The asterisk is rendered as aria-hidden — check it is in the DOM
    const labelEl = screen.getByText('Country');
    expect(labelEl.parentElement?.innerHTML).toContain('*');
  });

  it('sets aria-invalid when error is provided', () => {
    render(<RoboSelect options={options} error='Required' />);
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-invalid', 'true');
  });

  /* ---------------------------------------------------------------- */
  /* Trigger ARIA wiring                                                */
  /* ---------------------------------------------------------------- */

  it('trigger aria-expanded is "false" when closed', () => {
    render(<RoboSelect options={options} />);
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'false');
  });

  it('displays the selected value when value is controlled', () => {
    render(<RoboSelect options={options} value='uk' onValueChange={() => {}} />);
    expect(screen.getByText('United Kingdom')).toBeInTheDocument();
  });

  it('displays defaultValue text on first render', () => {
    render(
      <RoboSelect options={options} defaultValue='us' onValueChange={() => {}} />
    );
    expect(screen.getByText('United States')).toBeInTheDocument();
  });

  /* ---------------------------------------------------------------- */
  /* displayName                                                        */
  /* ---------------------------------------------------------------- */

  it('has displayName RoboSelect', () => {
    expect(RoboSelect.displayName).toBe('RoboSelect');
  });

  /* ---------------------------------------------------------------- */
  /* Accessibility                                                      */
  /* ---------------------------------------------------------------- */

  it('has no a11y violations in default state', async () => {
    const { container } = render(
      <RoboSelect label='Country' options={options} />
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no a11y violations in error state', async () => {
    const { container } = render(
      <RoboSelect label='Country' options={options} error='Required' />
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
