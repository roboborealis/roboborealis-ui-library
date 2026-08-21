import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { FormValidationTemplate } from './form-validation';

describe('FormValidationTemplate', () => {
  it('renders without crashing', () => {
    render(<FormValidationTemplate />);
  });

  describe('form fields', () => {
    it('renders the title input', () => {
      render(<FormValidationTemplate />);
      expect(screen.getByPlaceholderText('Brief title…')).toBeInTheDocument();
    });

    it('renders the location input', () => {
      render(<FormValidationTemplate />);
      expect(screen.getByPlaceholderText('e.g. Building 3, Region North')).toBeInTheDocument();
    });

    it('renders the description textarea', () => {
      render(<FormValidationTemplate />);
      expect(screen.getByPlaceholderText('Describe in detail…')).toBeInTheDocument();
    });

    it('renders notification toggle switches', () => {
      render(<FormValidationTemplate />);
      expect(screen.getByLabelText('Notify primary contact')).toBeInTheDocument();
      expect(screen.getByLabelText('Notify secondary contact')).toBeInTheDocument();
    });

    it('renders the priority radio group with all options', () => {
      render(<FormValidationTemplate />);
      expect(screen.getByRole('radio', { name: 'Low' })).toBeInTheDocument();
      expect(screen.getByRole('radio', { name: 'Medium' })).toBeInTheDocument();
      expect(screen.getByRole('radio', { name: 'High' })).toBeInTheDocument();
      expect(screen.getByRole('radio', { name: 'Critical' })).toBeInTheDocument();
    });
  });

  describe('action buttons', () => {
    it('renders a submit button', () => {
      render(<FormValidationTemplate />);
      expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
    });

    it('renders a reset button', () => {
      render(<FormValidationTemplate />);
      expect(screen.getByRole('button', { name: /reset/i })).toBeInTheDocument();
    });
  });

  describe('form validation', () => {
    it('shows title validation error when submitting an empty form', async () => {
      const user = userEvent.setup();
      render(<FormValidationTemplate />);

      await user.click(screen.getByRole('button', { name: /submit/i }));

      // RoboFormField renders the error in both helper-text and error-label elements
      const errors = await screen.findAllByText(/enter a title/i);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('shows description length error when description is too short', async () => {
      const user = userEvent.setup();
      render(<FormValidationTemplate />);

      await user.type(screen.getByPlaceholderText('Describe in detail…'), 'too short');
      await user.click(screen.getByRole('button', { name: /submit/i }));

      const errors = await screen.findAllByText(/at least 20 characters/i);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('shows location validation error when location is missing', async () => {
      const user = userEvent.setup();
      render(<FormValidationTemplate />);

      await user.type(screen.getByPlaceholderText('Brief title…'), 'My Title');
      await user.click(screen.getByRole('button', { name: /submit/i }));

      expect(await screen.findByText(/enter a location/i)).toBeInTheDocument();
    });
  });

  describe('reset functionality', () => {
    it('clears inputs when reset is clicked', async () => {
      const user = userEvent.setup();
      render(<FormValidationTemplate />);

      const titleInput = screen.getByPlaceholderText('Brief title…');
      await user.type(titleInput, 'My Title');
      expect(titleInput).toHaveValue('My Title');

      await user.click(screen.getByRole('button', { name: /reset/i }));
      expect(titleInput).toHaveValue('');
    });
  });
});
