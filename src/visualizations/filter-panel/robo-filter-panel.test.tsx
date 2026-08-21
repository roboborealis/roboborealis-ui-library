import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';

import { RoboFilterPanel } from './robo-filter-panel';
import type { RoboCorrelationFilters } from '../types';


// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const entityTypes = [
  { type: 'spacecraft', label: 'Spacecraft', color: '#3b82f6', count: 12 },
  { type: 'ground-station', label: 'Ground Station', color: '#22c55e', count: 5 },
];

const sources = [
  { id: 'telemetry', label: 'Telemetry', color: '#6366f1', count: 20 },
  { id: 'satellite', label: 'Satellite', color: '#f59e0b', count: 8 },
];

const defaultFilters: RoboCorrelationFilters = {
  entityTypes: [],
  sourceTypes: [],
  severityLevels: [],
  searchQuery: '',
  dateRange: null,
  geoRegion: null,
  minConfidence: 0,
  minRiskScore: 0,
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('RoboFilterPanel', () => {
  it('renders entity type checkboxes', () => {
    render(
      <RoboFilterPanel
        availableEntityTypes={entityTypes}
        availableSources={sources}
        filters={defaultFilters}
        onFiltersChange={vi.fn()}
        onReset={vi.fn()}
        totalCount={17}
        filteredCount={17}
      />,
    );
    expect(screen.getByText('Spacecraft')).toBeInTheDocument();
    expect(screen.getByText('Ground Station')).toBeInTheDocument();
  });

  it('renders source checkboxes', () => {
    render(
      <RoboFilterPanel
        availableEntityTypes={entityTypes}
        availableSources={sources}
        filters={defaultFilters}
        onFiltersChange={vi.fn()}
        onReset={vi.fn()}
        totalCount={17}
        filteredCount={17}
      />,
    );
    expect(screen.getByText('Telemetry')).toBeInTheDocument();
    expect(screen.getByText('Satellite')).toBeInTheDocument();
  });

  it('calls onFiltersChange when a checkbox is toggled', async () => {
    const user = userEvent.setup();
    const onFiltersChange = vi.fn();
    render(
      <RoboFilterPanel
        availableEntityTypes={entityTypes}
        availableSources={sources}
        filters={defaultFilters}
        onFiltersChange={onFiltersChange}
        onReset={vi.fn()}
        totalCount={17}
        filteredCount={17}
      />,
    );

    const spacecraftCheckbox = screen.getByRole('checkbox', { name: /spacecraft/i });
    await user.click(spacecraftCheckbox);
    expect(onFiltersChange).toHaveBeenCalled();
  });

  it('calls onReset when reset button is clicked', async () => {
    const user = userEvent.setup();
    const onReset = vi.fn();
    render(
      <RoboFilterPanel
        availableEntityTypes={entityTypes}
        availableSources={sources}
        filters={{ ...defaultFilters, entityTypes: ['spacecraft'] as string[] }}
        onFiltersChange={vi.fn()}
        onReset={onReset}
        totalCount={17}
        filteredCount={12}
      />,
    );

    const resetButton = screen.getByRole('button', { name: /reset/i });
    await user.click(resetButton);
    expect(onReset).toHaveBeenCalledTimes(1);
  });

  it('displays filtered/total count', () => {
    render(
      <RoboFilterPanel
        availableEntityTypes={entityTypes}
        availableSources={sources}
        filters={{ ...defaultFilters, entityTypes: ['spacecraft'] as string[] }}
        onFiltersChange={vi.fn()}
        onReset={vi.fn()}
        totalCount={17}
        filteredCount={12}
      />,
    );
    expect(screen.getByLabelText('12 of 17 entities shown')).toBeInTheDocument();
  });

  it('accepts className prop', () => {
    const { container } = render(
      <RoboFilterPanel
        availableEntityTypes={entityTypes}
        availableSources={sources}
        filters={defaultFilters}
        onFiltersChange={vi.fn()}
        onReset={vi.fn()}
        totalCount={17}
        filteredCount={17}
        className='custom-panel'
      />,
    );
    expect(container.firstChild).toHaveClass('custom-panel');
  });

  it('passes axe accessibility checks', async () => {
    const { container } = render(
      <RoboFilterPanel
        availableEntityTypes={entityTypes}
        availableSources={sources}
        filters={defaultFilters}
        onFiltersChange={vi.fn()}
        onReset={vi.fn()}
        totalCount={17}
        filteredCount={17}
      />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
