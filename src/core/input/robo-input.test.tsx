import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { RoboInput } from './robo-input';

describe('RoboInput', () => {
  it('renders a text input by default', () => {
    render(<RoboInput placeholder='Type here' />);
    expect(screen.getByPlaceholderText('Type here')).toBeInTheDocument();
  });

  it('renders with label and associates it via htmlFor', () => {
    render(<RoboInput label='NORAD ID' placeholder='123456789' />);
    const label = screen.getByText('NORAD ID');
    const input = screen.getByPlaceholderText('123456789');
    expect(label).toBeInTheDocument();
    expect(input).toHaveAttribute('id');
    expect(label).toHaveAttribute('for', input.id);
  });

  it('shows required indicator when required', () => {
    render(<RoboInput label='Callsign' required />);
    expect(screen.getByText('*')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-required', 'true');
  });

  it('shows helper text', () => {
    render(<RoboInput helperText='Enter 5-digit NORAD ID' />);
    expect(screen.getByText('Enter 5-digit NORAD ID')).toBeInTheDocument();
  });

  it('sets aria-invalid and role=alert on error state', () => {
    render(<RoboInput state='error' helperText='Invalid format' />);
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByRole('alert')).toHaveTextContent('Invalid format');
  });

  it('does not set aria-invalid on success state', () => {
    render(<RoboInput state='success' helperText='Looks good!' />);
    expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-invalid');
  });

  it('accepts user input', async () => {
    const onChange = vi.fn();
    render(<RoboInput onChange={onChange} />);
    await userEvent.type(screen.getByRole('textbox'), 'Hello');
    expect(onChange).toHaveBeenCalled();
  });

  it('forwards className', () => {
    render(<RoboInput className='custom-class' />);
    expect(screen.getByRole('textbox')).toHaveClass('custom-class');
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<RoboInput ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('is disabled when disabled prop is set', () => {
    render(<RoboInput disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('renders leading and trailing icons', () => {
    render(
      <RoboInput
        leadingIcon={<span data-testid='lead-icon' />}
        trailingIcon={<span data-testid='trail-icon' />}
      />
    );
    expect(screen.getByTestId('lead-icon')).toBeInTheDocument();
    expect(screen.getByTestId('trail-icon')).toBeInTheDocument();
  });
});
