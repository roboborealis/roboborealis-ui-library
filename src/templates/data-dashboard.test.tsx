import * as React from 'react';
import { render, screen } from '@testing-library/react';

import { DataDashboardTemplate } from './data-dashboard';

describe('DataDashboardTemplate', () => {
  it('renders without crashing', () => {
    render(<DataDashboardTemplate />);
  });

  describe('KPI stat cards', () => {
    it('renders the Total Items stat card', () => {
      render(<DataDashboardTemplate />);
      expect(screen.getByText('Total Items')).toBeInTheDocument();
    });

    it('renders the Active stat card', () => {
      render(<DataDashboardTemplate />);
      // "Active" appears as both a KPI label and table status badge — getAllByText is correct
      expect(screen.getAllByText('Active').length).toBeGreaterThan(0);
    });

    it('renders the Processed Today stat card', () => {
      render(<DataDashboardTemplate />);
      expect(screen.getByText('Processed Today')).toBeInTheDocument();
    });

    it('renders the Alerts stat card', () => {
      render(<DataDashboardTemplate />);
      expect(screen.getByText('Alerts')).toBeInTheDocument();
    });

    it('renders the numeric KPI values', () => {
      render(<DataDashboardTemplate />);
      expect(screen.getByText('247')).toBeInTheDocument();
      expect(screen.getByText('89')).toBeInTheDocument();
      expect(screen.getByText('34')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
    });
  });

  describe('activity table', () => {
    it('renders the Name column header', () => {
      render(<DataDashboardTemplate />);
      expect(screen.getByRole('columnheader', { name: 'Name' })).toBeInTheDocument();
    });

    it('renders the Status column header', () => {
      render(<DataDashboardTemplate />);
      expect(screen.getByRole('columnheader', { name: 'Status' })).toBeInTheDocument();
    });

    it('renders the Category column header', () => {
      render(<DataDashboardTemplate />);
      expect(screen.getByRole('columnheader', { name: 'Category' })).toBeInTheDocument();
    });

    it('renders table rows for each activity entry', () => {
      render(<DataDashboardTemplate />);
      expect(screen.getByText('Item Alpha')).toBeInTheDocument();
      expect(screen.getByText('Item Beta')).toBeInTheDocument();
      expect(screen.getByText('Item Delta')).toBeInTheDocument();
    });

    it('renders status badges', () => {
      render(<DataDashboardTemplate />);
      expect(screen.getAllByText('Active').length).toBeGreaterThan(0);
      expect(screen.getByText('Overdue')).toBeInTheDocument();
      expect(screen.getByText('Inactive')).toBeInTheDocument();
    });
  });
});
