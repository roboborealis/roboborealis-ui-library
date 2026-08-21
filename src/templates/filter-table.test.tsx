import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { FilterTableTemplate } from './filter-table';

describe('FilterTableTemplate', () => {
  it('renders without crashing', () => {
    render(<FilterTableTemplate />);
  });

  describe('filter toolbar', () => {
    it('renders the search input', () => {
      render(<FilterTableTemplate />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('renders the status filter select', () => {
      render(<FilterTableTemplate />);
      expect(screen.getByText('All statuses')).toBeInTheDocument();
    });

    it('renders the region filter select', () => {
      render(<FilterTableTemplate />);
      expect(screen.getByText('All regions')).toBeInTheDocument();
    });
  });

  describe('data table', () => {
    it('renders the Reference column header', () => {
      render(<FilterTableTemplate />);
      expect(screen.getByRole('columnheader', { name: 'Reference' })).toBeInTheDocument();
    });

    it('renders the Status column header', () => {
      render(<FilterTableTemplate />);
      expect(screen.getByRole('columnheader', { name: 'Status' })).toBeInTheDocument();
    });

    it('renders example entries on first page', () => {
      render(<FilterTableTemplate />);
      // First two entries are always on page 1 regardless of page size
      expect(screen.getByText('REF-2026-0041')).toBeInTheDocument();
      expect(screen.getByText('REF-2026-0040')).toBeInTheDocument();
    });

    it('renders row data for entry names', () => {
      render(<FilterTableTemplate />);
      expect(screen.getByText('Entry Alpha')).toBeInTheDocument();
      expect(screen.getByText('Entry Beta')).toBeInTheDocument();
    });

    it('renders status badge labels', () => {
      render(<FilterTableTemplate />);
      const activeBadges = screen.getAllByText('Active');
      expect(activeBadges.length).toBeGreaterThan(0);
      expect(screen.getAllByText('Overdue').length).toBeGreaterThan(0);
    });
  });

  describe('search filtering', () => {
    it('filters rows by search text', async () => {
      const user = userEvent.setup();
      render(<FilterTableTemplate />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'Alpha');

      expect(screen.getByText('Entry Alpha')).toBeInTheDocument();
      expect(screen.queryByText('Entry Beta')).not.toBeInTheDocument();
    });

    it('shows no rows when search matches nothing', async () => {
      const user = userEvent.setup();
      render(<FilterTableTemplate />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'ZZZZZNOTFOUND');

      expect(screen.queryByText('Entry Alpha')).not.toBeInTheDocument();
    });
  });
});
