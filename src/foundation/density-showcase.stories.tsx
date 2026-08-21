import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { RoboButton } from '../core/button/robo-button';
import { RoboInput } from '../core/input/robo-input';
import { RoboCard, RoboCardBody, RoboCardFooter, RoboCardHeader } from '../core/card/robo-card';
import { RoboBadge } from '../core/badge/robo-badge';

const meta: Meta = {
  title: 'Foundation/Density Showcase',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Shows all three density modes side by side on the same components. ' +
          'Density is controlled by `data-density` on `<html>` — either via the toolbar or RoboDensityProvider.',
      },
    },
  },
};
export default meta;

type Story = StoryObj;

// ─── Inline CSS variable sets per density level ───────────────────────────────
// RoboDensityProvider writes data-density to document.documentElement, so all
// panels would fight over the same <html> attribute. Instead, we inject the
// token values directly on each wrapper div — CSS custom properties cascade
// down to any component that references var(--btn-h-md), var(--card-p), etc.

type Density = 'compact' | 'comfortable' | 'spacious';

const DENSITY_VARS: Record<Density, React.CSSProperties> = {
  compact: {
    ['--btn-h-sm' as string]: '20px',
    ['--btn-h-md' as string]: '24px',
    ['--btn-h-lg' as string]: '30px',
    ['--btn-px-sm' as string]: '6px',
    ['--btn-px-md' as string]: '8px',
    ['--btn-px-lg' as string]: '12px',
    ['--input-h-sm' as string]: '20px',
    ['--input-h-md' as string]: '24px',
    ['--input-h-lg' as string]: '30px',
    ['--card-p' as string]: '6px',
    fontSize: '0.75rem',
  },
  comfortable: {
    ['--btn-h-sm' as string]: '26px',
    ['--btn-h-md' as string]: '32px',
    ['--btn-h-lg' as string]: '40px',
    ['--btn-px-sm' as string]: '10px',
    ['--btn-px-md' as string]: '12px',
    ['--btn-px-lg' as string]: '18px',
    ['--input-h-sm' as string]: '26px',
    ['--input-h-md' as string]: '32px',
    ['--input-h-lg' as string]: '40px',
    ['--card-p' as string]: '14px',
    fontSize: '0.875rem',
  },
  spacious: {
    ['--btn-h-sm' as string]: '32px',
    ['--btn-h-md' as string]: '40px',
    ['--btn-h-lg' as string]: '48px',
    ['--btn-px-sm' as string]: '12px',
    ['--btn-px-md' as string]: '16px',
    ['--btn-px-lg' as string]: '24px',
    ['--input-h-sm' as string]: '32px',
    ['--input-h-md' as string]: '40px',
    ['--input-h-lg' as string]: '48px',
    ['--card-p' as string]: '24px',
    fontSize: '1rem',
  },
};

// ─── Density panel wrapper ────────────────────────────────────────────────────

interface DensityPanelProps {
  density: Density;
  children: React.ReactNode;
}

function DensityPanel({ density, children }: DensityPanelProps) {
  return (
    <div
      style={{
        flex: 1,
        minWidth: 220,
        padding: '1rem',
        borderRadius: '0.5rem',
        border: '1px solid var(--border, #e5e7eb)',
        background: 'var(--background, transparent)',
        ...DENSITY_VARS[density],
      }}
    >
      <div style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.4, marginBottom: '0.75rem' }}>
        {density}
      </div>
      {children}
    </div>
  );
}

// ─── Sample content ───────────────────────────────────────────────────────────

function SampleContent() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--card-p, 12px)' }}>
      <RoboCard>
        <RoboCardHeader>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 600 }}>Satellite Report</span>
            <RoboBadge variant='status'>Active</RoboBadge>
          </div>
        </RoboCardHeader>
        <RoboCardBody>
          <RoboInput placeholder='Satellite name or NORAD ID' />
        </RoboCardBody>
        <RoboCardFooter style={{ gap: 'var(--btn-px-sm, 8px)' }}>
          <RoboButton size='sm' variant='default'>Submit</RoboButton>
          <RoboButton size='sm' variant='ghost'>Cancel</RoboButton>
        </RoboCardFooter>
      </RoboCard>

      <RoboCard>
        <RoboCardBody>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ opacity: 0.5 }}>Satellite</span>
              <span style={{ fontWeight: 500 }}>Sentinel-2</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ opacity: 0.5 }}>Velocity</span>
              <span>7.66 km/s</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ opacity: 0.5 }}>Status</span>
              <RoboBadge variant='success'>In transit</RoboBadge>
            </div>
          </div>
        </RoboCardBody>
      </RoboCard>
    </div>
  );
}

// ─── Stories ─────────────────────────────────────────────────────────────────

export const AllDensities: Story = {
  name: 'All Densities — Side by Side',
  render: () => (
    <div style={{ maxWidth: 960 }}>
      <h2 style={{ margin: '0 0 4px', fontWeight: 700 }}>Density Showcase</h2>
      <p style={{ margin: '0 0 20px', fontSize: '0.8125rem', opacity: 0.55 }}>
        Same components rendered at all three density levels simultaneously.
        Each panel injects its own CSS variable scope — no global state needed.
      </p>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <DensityPanel density='compact'><SampleContent /></DensityPanel>
        <DensityPanel density='comfortable'><SampleContent /></DensityPanel>
        <DensityPanel density='spacious'><SampleContent /></DensityPanel>
      </div>
    </div>
  ),
};

export const Compact: Story = {
  name: 'Compact',
  render: () => (
    <DensityPanel density='compact'><SampleContent /></DensityPanel>
  ),
};

export const Comfortable: Story = {
  name: 'Comfortable (default)',
  render: () => (
    <DensityPanel density='comfortable'><SampleContent /></DensityPanel>
  ),
};

export const Spacious: Story = {
  name: 'Spacious',
  render: () => (
    <DensityPanel density='spacious'><SampleContent /></DensityPanel>
  ),
};
