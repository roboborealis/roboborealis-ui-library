import * as React from 'react';
import { render, screen, within } from '@testing-library/react';
import { axe } from 'vitest-axe';

import { DashboardGridTemplate } from './dashboard-grid';

describe('DashboardGridTemplate', () => {
  it('renders without crashing', () => {
    render(<DashboardGridTemplate />);
  });

  describe('KPI stat cards', () => {
    it('renders all four KPI labels', () => {
      render(<DashboardGridTemplate />);
      expect(screen.getByText('Total Items')).toBeInTheDocument();
      expect(screen.getByText('Active')).toBeInTheDocument();
      expect(screen.getByText('Pending Review')).toBeInTheDocument();
      expect(screen.getByText('Open Alerts')).toBeInTheDocument();
    });

    it('renders the numeric KPI values', () => {
      render(<DashboardGridTemplate />);
      expect(screen.getByText('182')).toBeInTheDocument();
      expect(screen.getByText('139')).toBeInTheDocument();
      expect(screen.getByText('23')).toBeInTheDocument();
      expect(screen.getByText('7')).toBeInTheDocument();
    });
  });

  describe('chart areas', () => {
    it('renders both chart canvases (echarts is mocked in tests)', () => {
      render(<DashboardGridTemplate />);
      // RoboLineChart + RoboBarChart each render the mocked echarts-chart div
      expect(screen.getAllByTestId('echarts-chart')).toHaveLength(2);
    });

    it('renders the chart section titles', () => {
      render(<DashboardGridTemplate />);
      expect(screen.getByText('Activity Trend')).toBeInTheDocument();
      expect(screen.getByText('Breakdown by Type')).toBeInTheDocument();
    });
  });

  describe('activity table', () => {
    it('renders the column headers', () => {
      render(<DashboardGridTemplate />);
      expect(screen.getByRole('columnheader', { name: 'Subject' })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: 'Description' })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: 'Severity' })).toBeInTheDocument();
    });

    it('renders a row for each recent event', () => {
      render(<DashboardGridTemplate />);
      const table = screen.getByRole('table', { name: 'Recent activity feed' });
      expect(within(table).getByText('Item Alpha')).toBeInTheDocument();
      expect(within(table).getByText('Item Beta')).toBeInTheDocument();
      expect(within(table).getByText('Item Gamma')).toBeInTheDocument();
      expect(within(table).getByText('Item Delta')).toBeInTheDocument();
      expect(within(table).getByText('Item Epsilon')).toBeInTheDocument();
    });
  });

  it('has no axe violations', async () => {
    const { container } = render(<DashboardGridTemplate />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
