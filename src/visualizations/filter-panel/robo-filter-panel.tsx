import * as React from 'react';

import { RoboInput } from '@/core/input/robo-input';
import { RoboButton } from '@/core/button/robo-button';
import { RoboSlider } from '@/forms/slider/robo-slider';
import { cn } from '@/lib/utils';
import type { RoboCorrelationFilters } from '@/visualizations/types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface RoboFilterPanelProps {
  /** All unique entity types in the current dataset */
  availableEntityTypes: Array<{ type: string; label: string; color: string; count: number }>;
  /** All unique source types in the current dataset */
  availableSources: Array<{ id: string; label: string; color: string; count: number }>;
  /** Current filter state */
  filters: RoboCorrelationFilters;
  /** Called when any filter changes */
  onFiltersChange: (partial: Partial<RoboCorrelationFilters>) => void;
  /** Called when filters are reset */
  onReset: () => void;
  /** Total entity count (for display) */
  totalCount: number;
  /** Filtered entity count (for display) */
  filteredCount: number;
  className?: string;
  ref?: React.Ref<HTMLDivElement>;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function toggleStringInArray(arr: string[], value: string): string[] {
  return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

interface SectionProps {
  label: string;
  children: React.ReactNode;
}

function FilterSection({ label, children }: SectionProps) {
  return (
    <div className='flex flex-col gap-2'>
      <p className='text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider'>
        {label}
      </p>
      {children}
    </div>
  );
}

interface CheckRowProps {
  id: string;
  label: string;
  count: number;
  checked: boolean;
  color: string;
  onChange: () => void;
}

function CheckRow({ id, label, count, checked, color, onChange }: CheckRowProps) {
  return (
    <label
      htmlFor={id}
      className='flex items-center gap-2 cursor-pointer group'
    >
      <input
        id={id}
        type='checkbox'
        checked={checked}
        onChange={onChange}
        className='h-3.5 w-3.5 rounded border border-[var(--border)] bg-[var(--background)] text-[var(--primary)] accent-[var(--primary)] cursor-pointer focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-1'
      />
      {/* Color swatch — dynamic color from props, inline style is intentional */}
      <span
        className='h-2.5 w-2.5 rounded-full flex-shrink-0'
        style={{ backgroundColor: color }}
        aria-hidden='true'
      />
      <span className='flex-1 text-sm text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors truncate'>
        {label}
      </span>
      <span className='text-xs text-[var(--muted-foreground)] tabular-nums'>{count}</span>
    </label>
  );
}

interface SliderRowProps {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  formatValue: (v: number) => string;
  onChange: (v: number) => void;
}

function SliderRow({ id, label, value, min, max, step, formatValue, onChange }: SliderRowProps) {
  return (
    <RoboSlider
      id={id}
      label={label}
      min={min}
      max={max}
      step={step}
      value={[value]}
      onChange={(vals) => onChange(vals[0])}
      showValue
      formatValue={(v) => formatValue(v)}
    />
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * RoboFilterPanel — floating filter panel for the OSINT correlation system.
 *
 * Renders controls for entity type, source, confidence, and risk score
 * filters. Props-only — no context dependency.
 *
 * @example
 * ```tsx
 * <RoboFilterPanel
 *   availableEntityTypes={entityTypes}
 *   availableSources={sources}
 *   filters={filters}
 *   onFiltersChange={setFilters}
 *   onReset={resetFilters}
 *   totalCount={200}
 *   filteredCount={47}
 * />
 * ```
 */
function RoboFilterPanel({
  availableEntityTypes,
  availableSources,
  filters,
  onFiltersChange,
  onReset,
  totalCount,
  filteredCount,
  className,
  ref,
}: RoboFilterPanelProps) {
    const isFiltered = filteredCount !== totalCount;

    return (
      <div
        ref={ref}
        data-slot='filter-panel'
        className={cn(
          'flex flex-col gap-4 w-64 p-4',
          'bg-[var(--card)] text-[var(--card-foreground)]',
          'border border-[var(--border)] rounded-[var(--radius)]',
          className,
        )}
      >
        {/* Header */}
        <div className='flex items-center justify-between'>
          <h3 className='text-sm font-semibold text-[var(--foreground)]'>Filters</h3>
          <span
            className={cn(
              'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium tabular-nums',
              isFiltered
                ? 'bg-[var(--primary)] text-[var(--primary-foreground)]'
                : 'bg-[var(--muted)] text-[var(--muted-foreground)]',
            )}
            aria-label={`${filteredCount} of ${totalCount} entities shown`}
          >
            {filteredCount}/{totalCount}
          </span>
        </div>

        {/* Divider */}
        <hr className='border-[var(--border)]' />

        {/* Search */}
        <FilterSection label='Search'>
          <RoboInput
            type='search'
            placeholder='Search entities…'
            value={filters.searchQuery}
            onChange={(e) => onFiltersChange({ searchQuery: e.target.value })}
            aria-label='Search entities'
          />
        </FilterSection>

        {/* Entity Types */}
        {availableEntityTypes.length > 0 && (
          <FilterSection label='Entity Types'>
            <div className='flex flex-col gap-1.5' role='group' aria-label='Filter by entity type'>
              {availableEntityTypes.map((et) => (
                <CheckRow
                  key={et.type}
                  id={`filter-entity-${et.type}`}
                  label={et.label}
                  count={et.count}
                  color={et.color}
                  checked={
                    filters.entityTypes.length === 0 ||
                    filters.entityTypes.includes(et.type)
                  }
                  onChange={() =>
                    onFiltersChange({
                      entityTypes: toggleStringInArray(filters.entityTypes, et.type),
                    })
                  }
                />
              ))}
            </div>
          </FilterSection>
        )}

        {/* Sources */}
        {availableSources.length > 0 && (
          <FilterSection label='Sources'>
            <div className='flex flex-col gap-1.5' role='group' aria-label='Filter by data source'>
              {availableSources.map((src) => (
                <CheckRow
                  key={src.id}
                  id={`filter-source-${src.id}`}
                  label={src.label}
                  count={src.count}
                  color={src.color}
                  checked={
                    filters.sourceTypes.length === 0 ||
                    filters.sourceTypes.includes(src.id)
                  }
                  onChange={() =>
                    onFiltersChange({
                      sourceTypes: toggleStringInArray(filters.sourceTypes, src.id),
                    })
                  }
                />
              ))}
            </div>
          </FilterSection>
        )}

        {/* Confidence threshold */}
        <FilterSection label='Confidence'>
          <SliderRow
            id='filter-confidence'
            label='Minimum confidence'
            value={filters.minConfidence}
            min={0}
            max={1}
            step={0.05}
            formatValue={(v) => `${Math.round(v * 100)}%`}
            onChange={(v) => onFiltersChange({ minConfidence: v })}
          />
        </FilterSection>

        {/* Risk score threshold */}
        <FilterSection label='Risk Score'>
          <SliderRow
            id='filter-risk-score'
            label='Minimum risk score'
            value={filters.minRiskScore}
            min={0}
            max={100}
            step={5}
            formatValue={(v) => String(v)}
            onChange={(v) => onFiltersChange({ minRiskScore: v })}
          />
        </FilterSection>

        {/* Divider */}
        <hr className='border-[var(--border)]' />

        {/* Reset */}
        <RoboButton
          variant='ghost'
          size='sm'
          onClick={onReset}
          disabled={!isFiltered && filters.searchQuery === '' && filters.minConfidence === 0 && filters.minRiskScore === 0}
          className='w-full'
        >
          Reset filters
        </RoboButton>
      </div>
    );
}
RoboFilterPanel.displayName = 'RoboFilterPanel';

export { RoboFilterPanel };
