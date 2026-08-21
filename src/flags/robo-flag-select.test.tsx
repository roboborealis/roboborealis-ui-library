import * as React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { RoboFlagSelect } from './robo-flag-select';

// Radix Select uses ResizeObserver — provide a stub for jsdom
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

describe('RoboFlagSelect', () => {
  describe('rendering', () => {
    it('renders a trigger button', () => {
      render(<RoboFlagSelect />);
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('shows the placeholder when no value is selected', () => {
      render(<RoboFlagSelect placeholder='Pick a country' />);
      expect(screen.getByText('Pick a country')).toBeInTheDocument();
    });

    it('renders a visible label', () => {
      render(<RoboFlagSelect label='Country' />);
      expect(screen.getByText('Country')).toBeInTheDocument();
    });

    it('marks required fields with an asterisk', () => {
      render(<RoboFlagSelect label='Country' required />);
      expect(screen.getByText('*')).toBeInTheDocument();
    });
  });

  describe('error state', () => {
    it('renders the error message', () => {
      render(<RoboFlagSelect error='Country is required' />);
      expect(screen.getByRole('alert')).toHaveTextContent('Country is required');
    });

    it('sets aria-invalid on the trigger', () => {
      render(<RoboFlagSelect error='Required' />);
      expect(screen.getByRole('combobox')).toHaveAttribute('aria-invalid', 'true');
    });
  });

  describe('disabled state', () => {
    it('disables the trigger', () => {
      render(<RoboFlagSelect disabled />);
      expect(screen.getByRole('combobox')).toBeDisabled();
    });
  });

  describe('controlled value', () => {
    it('shows the selected country name in the trigger', () => {
      render(<RoboFlagSelect value='us' />);
      expect(screen.getByRole('combobox')).toHaveTextContent('United States');
    });

    it('shows the correct label for a subdivisional code', () => {
      render(<RoboFlagSelect value='gb-sct' />);
      expect(screen.getByRole('combobox')).toHaveTextContent('Scotland');
    });
  });

  describe('countries prop (restricted list)', () => {
    it('only renders items from the restricted list when open', async () => {
      const user = userEvent.setup();
      render(
        <RoboFlagSelect
          label='Nation'
          countries={['us', 'gb', 'au']}
          searchable={false}
        />
      );
      await user.click(screen.getByRole('combobox'));

      await waitFor(() => {
        expect(screen.getByText('United States')).toBeInTheDocument();
        expect(screen.getByText('United Kingdom')).toBeInTheDocument();
        expect(screen.getByText('Australia')).toBeInTheDocument();
      });

      // Canada should not be present in the restricted list
      expect(screen.queryByText('Canada')).not.toBeInTheDocument();
    });
  });

  describe('search/filter', () => {
    it('shows a search input when searchable is true (default)', async () => {
      const user = userEvent.setup();
      render(<RoboFlagSelect countries={['us', 'gb', 'au']} />);
      await user.click(screen.getByRole('combobox'));
      await waitFor(() => {
        expect(screen.getByPlaceholderText('Search countries…')).toBeInTheDocument();
      });
    });

    it('hides search input when searchable is false', async () => {
      const user = userEvent.setup();
      render(<RoboFlagSelect searchable={false} countries={['us', 'gb']} />);
      await user.click(screen.getByRole('combobox'));
      await waitFor(() => {
        expect(
          screen.queryByPlaceholderText('Search countries…')
        ).not.toBeInTheDocument();
      });
    });

    it('filters items based on the search query', async () => {
      const user = userEvent.setup();
      render(<RoboFlagSelect searchable countries={['us', 'gb', 'au', 'ca', 'nz']} />);
      await user.click(screen.getByRole('combobox'));

      const searchInput = await screen.findByPlaceholderText('Search countries…');
      await user.type(searchInput, 'aus');

      await waitFor(() => {
        expect(screen.getByText('Australia')).toBeInTheDocument();
        expect(screen.queryByText('United States')).not.toBeInTheDocument();
      });
    });

    it('shows "No countries found" when search has no matches', async () => {
      const user = userEvent.setup();
      render(<RoboFlagSelect searchable countries={['us', 'gb']} />);
      await user.click(screen.getByRole('combobox'));

      const searchInput = await screen.findByPlaceholderText('Search countries…');
      await user.type(searchInput, 'zzzzz');

      await waitFor(() => {
        expect(screen.getByText('No countries found')).toBeInTheDocument();
      });
    });
  });

  describe('value selection', () => {
    it('calls onValueChange with the selected code', async () => {
      const onValueChange = vi.fn();
      const user = userEvent.setup();
      render(
        <RoboFlagSelect
          onValueChange={onValueChange}
          searchable={false}
          countries={['us', 'gb']}
        />
      );
      await user.click(screen.getByRole('combobox'));
      const gbOption = await screen.findByText('United Kingdom');
      await user.click(gbOption);

      expect(onValueChange).toHaveBeenCalledWith('gb');
    });

    it('closes the dropdown after a selection', async () => {
      const user = userEvent.setup();
      render(<RoboFlagSelect searchable={false} countries={['us', 'gb']} />);
      await user.click(screen.getByRole('combobox'));
      const usOption = await screen.findByText('United States');
      await user.click(usOption);

      await waitFor(() => {
        expect(screen.queryByText('United Kingdom')).not.toBeInTheDocument();
      });
    });
  });
});
