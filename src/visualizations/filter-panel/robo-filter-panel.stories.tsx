import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { RoboFilterPanel } from './robo-filter-panel';
import { RoboLoading } from '../../feedback/loading/robo-loading';
import { OverviewStack, OverviewSection } from '../../lib/storybook/overview-layout';
import type { RoboCorrelationFilters } from '../types';

export const componentMeta = {
  description: 'OSINT correlation filter panel — entity types, sources, confidence, and risk score filters',
  category: 'visualization' as const,
  keywords: ['filter', 'panel', 'osint', 'entity', 'type', 'source', 'confidence', 'risk'],
  whenToUse: 'Place alongside RoboForceGraph, RoboDataFeed, or RoboCorrelationMatrix to let users narrow the dataset',
  whenNotToUse: 'Use RoboDataTable column filters for tabular data; RoboFilterPanel is OSINT-specific',
  pairsWith: ['RoboCorrelationProvider', 'RoboForceGraph', 'RoboDataFeed', 'RoboCorrelationMatrix'],
  a11y: 'All filter controls are keyboard accessible; toggle buttons use aria-pressed',
};

// ---------------------------------------------------------------------------
// Default filter state
// ---------------------------------------------------------------------------

const DEFAULT_FILTERS: RoboCorrelationFilters = {
  entityTypes: [],
  sourceTypes: [],
  severityLevels: [],
  searchQuery: '',
  dateRange: null,
  geoRegion: null,
  minConfidence: 0,
  minRiskScore: 0,
};

const ENTITY_TYPES = [
  { type: 'spacecraft', label: 'Spacecraft', color: 'var(--chart-1)', count: 30 },
  { type: 'aircraft', label: 'Aircraft', color: 'var(--chart-2)', count: 15 },
  { type: 'company', label: 'Company', color: 'var(--chart-3)', count: 10 },
  { type: 'person', label: 'Person', color: 'var(--chart-4)', count: 8 },
  { type: 'ground-station', label: 'Ground Station', color: 'var(--chart-5)', count: 12 },
];

const SOURCE_TYPES = [
  { id: 'telemetry', label: 'Telemetry', color: '#06B6D4', count: 85 },
  { id: 'adsb', label: 'ADS-B Aviation', color: '#8B5CF6', count: 45 },
  { id: 'satellite', label: 'Optical Tracking', color: '#F59E0B', count: 62 },
  { id: 'ground-network', label: 'Ground Network', color: '#10B981', count: 38 },
  { id: 'registry', label: 'Object Registry', color: '#64748B', count: 24 },
];

// ---------------------------------------------------------------------------
// Interactive wrapper for controlled stories
// ---------------------------------------------------------------------------

function FilterPanelDemo(props: Omit<React.ComponentProps<typeof RoboFilterPanel>, 'filters' | 'onFiltersChange' | 'onReset'>) {
  const [filters, setFilters] = React.useState<RoboCorrelationFilters>(DEFAULT_FILTERS);
  const filteredCount = Math.max(0, props.totalCount - filters.entityTypes.length * 5 - Math.floor(filters.minRiskScore / 10));

  return (
    <RoboFilterPanel
      {...props}
      filters={filters}
      filteredCount={filteredCount}
      onFiltersChange={(partial) => setFilters((prev) => ({ ...prev, ...partial }))}
      onReset={() => setFilters(DEFAULT_FILTERS)}
    />
  );
}

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta: Meta<typeof FilterPanelDemo> = {
  title: 'Data/Visualizations/RoboFilterPanel',
  excludeStories: ['componentMeta'],
  component: FilterPanelDemo,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};
export default meta;

type Story = StoryObj<typeof meta>;

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

export const AllVariants: Story = {
  name: 'All Variants',
  render: () => {
    const [ready, setReady] = React.useState(false);
    React.useEffect(() => {
      const t = setTimeout(() => setReady(true), 1200);
      return () => clearTimeout(t);
    }, []);
    if (!ready) return <RoboLoading />;
    return (
      <OverviewStack>
        <OverviewSection title='RoboFilterPanel'>
          <div className='flex flex-wrap items-start gap-6'>
            <FilterPanelDemo
              availableEntityTypes={ENTITY_TYPES}
              availableSources={SOURCE_TYPES}
              totalCount={75}
            />
            <RoboFilterPanel
              availableEntityTypes={ENTITY_TYPES}
              availableSources={SOURCE_TYPES}
              filters={{ ...DEFAULT_FILTERS, entityTypes: ['spacecraft', 'aircraft'], minConfidence: 0.5, minRiskScore: 25 }}
              onFiltersChange={() => {}}
              onReset={() => {}}
              totalCount={75}
              filteredCount={28}
            />
          </div>
        </OverviewSection>
      </OverviewStack>
    );
  },
};

export const Default: Story = {
  args: {
    availableEntityTypes: ENTITY_TYPES,
    availableSources: SOURCE_TYPES,
    totalCount: 75,
  },
};

export const ActiveFilters: Story = {
  name: 'Pre-applied Filters',
  render: () => (
    <RoboFilterPanel
      availableEntityTypes={ENTITY_TYPES}
      availableSources={SOURCE_TYPES}
      filters={{ ...DEFAULT_FILTERS, entityTypes: ['spacecraft', 'aircraft'], minConfidence: 0.5, minRiskScore: 25 }}
      onFiltersChange={() => {}}
      onReset={() => {}}
      totalCount={75}
      filteredCount={28}
    />
  ),
};

export const Narrow: Story = {
  name: 'Narrow Panel (300px)',
  args: {
    availableEntityTypes: ENTITY_TYPES,
    availableSources: SOURCE_TYPES,
    totalCount: 75,
    className: 'w-[300px]',
  },
};
