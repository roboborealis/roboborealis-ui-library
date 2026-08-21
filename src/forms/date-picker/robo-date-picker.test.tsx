import * as React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';

import { RoboDatePicker } from './robo-date-picker';


describe('RoboDatePicker', () => {
  /* ---------------------------------------------------------------- */
  /* Rendering                                                          */
  /* ---------------------------------------------------------------- */

  it('renders the trigger button', () => {
    render(<RoboDatePicker />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('renders placeholder text by default', () => {
    render(<RoboDatePicker placeholder='Choose a date' />);
    expect(screen.getByText('Choose a date')).toBeInTheDocument();
  });

  it('renders the default placeholder when none is provided', () => {
    render(<RoboDatePicker />);
    expect(screen.getByText('Select a date')).toBeInTheDocument();
  });

  it('renders a label when provided', () => {
    render(<RoboDatePicker label='Start date' />);
    expect(screen.getByText('Start date')).toBeInTheDocument();
  });

  it('renders helper text when provided', () => {
    render(<RoboDatePicker helperText='Format: MMM D, YYYY' />);
    expect(screen.getByText('Format: MMM D, YYYY')).toBeInTheDocument();
  });

  it('renders error message when provided', () => {
    render(<RoboDatePicker error='Date is required' />);
    expect(screen.getByText('Date is required')).toBeInTheDocument();
  });

  it('error message has role="alert"', () => {
    render(<RoboDatePicker error='Invalid date' />);
    expect(screen.getByRole('alert')).toHaveTextContent('Invalid date');
  });

  /* ---------------------------------------------------------------- */
  /* Controlled value display                                           */
  /* ---------------------------------------------------------------- */

  it('displays formatted date when value is provided', () => {
    const date = new Date(2024, 0, 15); // Jan 15, 2024
    render(<RoboDatePicker value={date} onChange={() => {}} />);
    expect(screen.getByText('Jan 15, 2024')).toBeInTheDocument();
  });

  /* ---------------------------------------------------------------- */
  /* Disabled state                                                     */
  /* ---------------------------------------------------------------- */

  it('disables the trigger button when disabled prop is passed', () => {
    render(<RoboDatePicker disabled />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  /* ---------------------------------------------------------------- */
  /* Aria attributes                                                    */
  /* ---------------------------------------------------------------- */

  it('sets aria-invalid when error is provided', () => {
    render(<RoboDatePicker error='Required' />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-invalid', 'true');
  });

  it('sets aria-expanded=false when closed', () => {
    render(<RoboDatePicker />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'false');
  });

  it('sets aria-haspopup="dialog"', () => {
    render(<RoboDatePicker />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-haspopup', 'dialog');
  });

  /* ---------------------------------------------------------------- */
  /* Opening calendar                                                   */
  /* ---------------------------------------------------------------- */

  it('opens the calendar popover when trigger is clicked', async () => {
    const user = userEvent.setup();
    render(<RoboDatePicker />);
    await user.click(screen.getByRole('button'));
    await waitFor(() => {
      // react-day-picker renders a grid for the calendar
      expect(screen.getByRole('grid')).toBeInTheDocument();
    });
  });

  it('sets aria-expanded=true when calendar is open', async () => {
    const user = userEvent.setup();
    render(<RoboDatePicker />);
    await user.click(screen.getByRole('button'));
    await waitFor(() => {
      expect(screen.getByRole('button', { expanded: true })).toBeInTheDocument();
    });
  });

  /* ---------------------------------------------------------------- */
  /* Selecting a date                                                   */
  /* ---------------------------------------------------------------- */

  it('calls onChange when a day is selected', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<RoboDatePicker onChange={onChange} />);
    await user.click(screen.getByRole('button'));
    await waitFor(() => screen.getByRole('grid'));
    // Click the first available (non-disabled) day button
    const dayButtons = screen.getAllByRole('gridcell');
    const clickable = dayButtons.find((cell) => {
      const btn = cell.querySelector('button:not([disabled])');
      return btn !== null;
    });
    if (clickable) {
      const btn = clickable.querySelector('button:not([disabled])') as HTMLElement;
      await user.click(btn);
    }
    expect(onChange).toHaveBeenCalled();
  });

  /* ---------------------------------------------------------------- */
  /* Range mode                                                         */
  /* ---------------------------------------------------------------- */

  it('renders range mode without crashing', () => {
    render(<RoboDatePicker mode='range' />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  /* ---------------------------------------------------------------- */
  /* ref forwarding                                                     */
  /* ---------------------------------------------------------------- */

  it('forwards ref to the trigger button', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<RoboDatePicker ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  /* ---------------------------------------------------------------- */
  /* displayName                                                        */
  /* ---------------------------------------------------------------- */

  it('has displayName RoboDatePicker', () => {
    expect(RoboDatePicker.displayName).toBe('RoboDatePicker');
  });

  /* ---------------------------------------------------------------- */
  /* Accessibility                                                      */
  /* ---------------------------------------------------------------- */

  it('has no a11y violations in default state', async () => {
    const { container } = render(
      <RoboDatePicker label='Start date' />
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
