import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';

import { ListSearchTemplate } from './list-search';

describe('ListSearchTemplate', () => {
  describe('toolbar', () => {
    it('renders the search input', () => {
      render(<ListSearchTemplate />);
      expect(screen.getByPlaceholderText(/search by name/i)).toBeInTheDocument();
    });

    it('renders an export button', () => {
      render(<ListSearchTemplate />);
      expect(screen.getByRole('button', { name: /export/i })).toBeInTheDocument();
    });
  });

  describe('table', () => {
    it('renders placeholder rows', () => {
      render(<ListSearchTemplate />);
      // Row names are unique on the page (i01–i10 sit on the first page)
      expect(screen.getByText('Item Alpha')).toBeInTheDocument();
      expect(screen.getByText('Item Beta')).toBeInTheDocument();
      expect(screen.getByText('Item Zeta')).toBeInTheDocument();
    });

    it('renders the Name and Status column headers', () => {
      render(<ListSearchTemplate />);
      expect(screen.getByRole('columnheader', { name: 'Name' })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: 'Status' })).toBeInTheDocument();
    });
  });

  describe('search filtering', () => {
    it('narrows the visible rows to matches as the user types', async () => {
      const user = userEvent.setup();
      render(<ListSearchTemplate />);

      // Baseline: both a matching and a non-matching row are visible
      expect(screen.getByText('Item Alpha')).toBeInTheDocument();
      expect(screen.getByText('Item Zeta')).toBeInTheDocument();

      await user.type(screen.getByPlaceholderText(/search by name/i), 'Zeta');

      // The filter is synchronous (useMemo, no debounce)
      expect(screen.getByText('Item Zeta')).toBeInTheDocument();
      expect(screen.queryByText('Item Alpha')).not.toBeInTheDocument();
    });

    it('shows the empty state when nothing matches', async () => {
      const user = userEvent.setup();
      render(<ListSearchTemplate />);

      await user.type(screen.getByPlaceholderText(/search by name/i), 'zzzznomatch');

      expect(screen.getByText('No items match the current filters.')).toBeInTheDocument();
    });
  });

  it('no a11y violations', async () => {
    const { container } = render(<ListSearchTemplate />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
