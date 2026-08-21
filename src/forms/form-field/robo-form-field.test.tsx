import * as React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm } from 'react-hook-form';
import { axe } from 'vitest-axe';

import { RoboFormField, RoboForm, RoboFormSubmit } from './robo-form-field';


/* ------------------------------------------------------------------ */
/* Test helpers                                                          */
/* ------------------------------------------------------------------ */

interface TestFormValues {
  email: string;
  name: string;
}

/**
 * Minimal harness that wraps RoboFormField with the required RoboForm / FormProvider context.
 */
function TestForm({
  onSubmit = () => {},
  defaultValues = {},
}: {
  onSubmit?: (values: TestFormValues) => void;
  defaultValues?: Partial<TestFormValues>;
}) {
  const form = useForm<TestFormValues>({ defaultValues: { email: '', name: '', ...defaultValues } });

  return (
    <RoboForm form={form} onSubmit={onSubmit}>
      <RoboFormField<TestFormValues, 'email'>
        name='email'
        label='Email address'
        helperText='We will never share your email'
        required
      >
        {({ field, error, id }) => (
          <input
            id={id}
            type='email'
            aria-label='Email address'
            aria-invalid={error ? true : undefined}
            {...field}
          />
        )}
      </RoboFormField>
      <RoboFormSubmit>Submit</RoboFormSubmit>
    </RoboForm>
  );
}

/**
 * Form with a validation rule to trigger error state.
 */
function TestFormWithValidation({
  onSubmit = () => {},
}: {
  onSubmit?: (values: TestFormValues) => void;
}) {
  const form = useForm<TestFormValues>({ defaultValues: { email: '', name: '' } });

  return (
    <RoboForm form={form} onSubmit={onSubmit}>
      <RoboFormField<TestFormValues, 'email'>
        name='email'
        label='Email'
        rules={{ required: 'Email is required' }}
      >
        {({ field, error, id }) => (
          <>
            <input
              id={id}
              type='email'
              aria-label='Email'
              aria-invalid={error ? true : undefined}
              {...field}
            />
            {error && (
              <p role='alert' data-testid='field-error'>
                {error}
              </p>
            )}
          </>
        )}
      </RoboFormField>
      <RoboFormSubmit>Submit</RoboFormSubmit>
    </RoboForm>
  );
}

/* ------------------------------------------------------------------ */
/* RoboFormField tests                                                    */
/* ------------------------------------------------------------------ */

describe('RoboFormField', () => {
  /* ---------------------------------------------------------------- */
  /* Rendering                                                          */
  /* ---------------------------------------------------------------- */

  it('renders the label when provided', () => {
    render(<TestForm />);
    expect(screen.getByText('Email address')).toBeInTheDocument();
  });

  it('renders helper text when provided', () => {
    render(<TestForm />);
    expect(screen.getByText('We will never share your email')).toBeInTheDocument();
  });

  it('renders the children (input) via render prop', () => {
    render(<TestForm />);
    expect(screen.getByRole('textbox', { name: 'Email address' })).toBeInTheDocument();
  });

  it('passes a unique id to the children render prop', () => {
    render(<TestForm />);
    const input = screen.getByRole('textbox', { name: 'Email address' });
    expect(input.id).toBeTruthy();
  });

  it('required indicator is visible in the label', () => {
    render(<TestForm />);
    const label = screen.getByText('Email address');
    expect(label.parentElement?.innerHTML).toContain('*');
  });

  /* ---------------------------------------------------------------- */
  /* Error state                                                        */
  /* ---------------------------------------------------------------- */

  it('shows validation error message after failed submit', async () => {
    const user = userEvent.setup();
    render(<TestFormWithValidation />);
    await user.click(screen.getByRole('button', { name: 'Submit' }));
    await waitFor(() => {
      expect(screen.getByTestId('field-error')).toHaveTextContent('Email is required');
    });
  });

  it('error has role="alert"', async () => {
    const user = userEvent.setup();
    render(<TestFormWithValidation />);
    await user.click(screen.getByRole('button', { name: 'Submit' }));
    await waitFor(() => {
      const alerts = screen.getAllByRole('alert');
      expect(alerts.length).toBeGreaterThan(0);
      expect(alerts.some((el) => el.textContent === 'Email is required')).toBe(true);
    });
  });

  /* ---------------------------------------------------------------- */
  /* RoboForm                                                            */
  /* ---------------------------------------------------------------- */

  it('calls onSubmit when form is submitted with valid data', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(
      <TestFormWithValidation onSubmit={onSubmit} />
    );
    await user.type(screen.getByRole('textbox', { name: 'Email' }), 'test@example.com');
    await user.click(screen.getByRole('button', { name: 'Submit' }));
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ email: 'test@example.com' }),
        expect.anything()
      );
    });
  });

  it('renders RoboFormSubmit as a submit button', () => {
    render(<TestForm />);
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
  });

  /* ---------------------------------------------------------------- */
  /* displayName                                                        */
  /* ---------------------------------------------------------------- */

  it('RoboFormField has displayName', () => {
    expect(RoboFormField.displayName).toBe('RoboFormField');
  });

  it('RoboForm has displayName', () => {
    expect(RoboForm.displayName).toBe('RoboForm');
  });

  it('RoboFormSubmit has displayName', () => {
    expect(RoboFormSubmit.displayName).toBe('RoboFormSubmit');
  });

  /* ---------------------------------------------------------------- */
  /* Accessibility                                                      */
  /* ---------------------------------------------------------------- */

  it('has no a11y violations in default state', async () => {
    const { container } = render(<TestForm />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
