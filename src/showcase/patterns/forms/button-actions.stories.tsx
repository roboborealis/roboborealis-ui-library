import * as React from 'react';
import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Settings, Filter, Search, Plus, Edit, Trash2 } from 'lucide-react';
import { RoboButton, RoboCopyButton, RoboExportButton, RoboIconButton, RoboPrintButton, type RoboExportColumn } from '@roboborealis/components/core';


// ---------------------------------------------------------------------------
// Sample data for export
// ---------------------------------------------------------------------------

const sampleObjects = [
  { name: 'Andromeda Galaxy', designation: 'M31', constellation: 'Andromeda', magnitude: '3.4' },
  { name: 'Orion Nebula', designation: 'M42', constellation: 'Orion', magnitude: '4.0' },
  { name: 'Ring Nebula', designation: 'M57', constellation: 'Lyra', magnitude: '8.8' },
];

const objectColumns: RoboExportColumn[] = [
  { key: 'name', label: 'Common Name' },
  { key: 'designation', label: 'Designation' },
  { key: 'constellation', label: 'Constellation' },
  { key: 'magnitude', label: 'Magnitude' },
];

// ---------------------------------------------------------------------------
// Style constants
// ---------------------------------------------------------------------------

const pageStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 36,
  padding: 24,
  maxWidth: 860,
};

const sectionStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
};

const sectionHeadingStyle: React.CSSProperties = {
  fontSize: '0.7rem',
  fontWeight: 700,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: 'var(--muted-foreground)',
  margin: 0,
  paddingBottom: 4,
  borderBottom: '1px solid var(--border)',
};

const rowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  flexWrap: 'wrap',
};

const clickBadgeStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  padding: '2px 8px',
  borderRadius: 9999,
  background: 'var(--muted)',
  color: 'var(--muted-foreground)',
  fontSize: '0.7rem',
  fontFamily: 'var(--font-mono)',
};

const iconGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(6, auto)',
  gap: 12,
  alignItems: 'center',
  justifyContent: 'start',
};

const iconCellStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 4,
};

const iconLabelStyle: React.CSSProperties = {
  fontSize: '0.65rem',
  color: 'var(--muted-foreground)',
  textAlign: 'center',
};

const copyRowStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
};

const copyItemStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  padding: '6px 10px',
  background: 'var(--card)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius)',
  fontSize: '0.875rem',
  color: 'var(--foreground)',
  fontFamily: 'var(--font-mono)',
};

const utilityRowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  flexWrap: 'wrap',
};

const BUTTON_VARIANTS = [
  'default',
  'secondary',
  'tertiary',
  'ghost',
  'destructive',
  'outline',
] as const;

const BUTTON_SIZES = ['sm', 'md', 'lg'] as const;

const ICON_VARIANTS = [
  'default',
  'secondary',
  'tertiary',
  'ghost',
  'destructive',
  'outline',
] as const;

const ICON_SIZES = ['sm', 'md', 'lg'] as const;

const ICON_DEFS = [
  { icon: Settings, label: 'Settings' },
  { icon: Filter, label: 'Filter' },
  { icon: Search, label: 'Search' },
  { icon: Plus, label: 'Add' },
  { icon: Edit, label: 'Edit' },
  { icon: Trash2, label: 'Delete' },
] as const;

const COPY_TARGETS = [
  { label: 'Designation', value: 'M31' },
  { label: 'Right Asc.', value: '00h 42m' },
  { label: 'Declination', value: '+41° 16\'' },
];

// ---------------------------------------------------------------------------
// Helper components
// ---------------------------------------------------------------------------

function ClickCounter({ count }: { count: number }) {
  return <span style={clickBadgeStyle}>clicks: {count}</span>;
}

// ---------------------------------------------------------------------------
// Main playground component
// ---------------------------------------------------------------------------

function ButtonActionsDemo() {
  const [variantClicks, setVariantClicks] = useState<Record<string, number>>({});
  const [primaryClicks, setPrimaryClicks] = useState(0);

  function handleVariantClick(variant: string) {
    setVariantClicks((prev) => ({ ...prev, [variant]: (prev[variant] ?? 0) + 1 }));
  }

  return (
    <div style={pageStyle}>
      {/* All variants */}
      <div style={sectionStyle}>
        <p style={sectionHeadingStyle}>RoboButton — All Variants</p>
        <div style={rowStyle}>
          {BUTTON_VARIANTS.map((variant) => (
            <React.Fragment key={variant}>
              <RoboButton
                variant={variant}
                onClick={() => handleVariantClick(variant)}
              >
                {variant.charAt(0).toUpperCase() + variant.slice(1)}
              </RoboButton>
              {(variantClicks[variant] ?? 0) > 0 && (
                <ClickCounter count={variantClicks[variant]} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* All sizes */}
      <div style={sectionStyle}>
        <p style={sectionHeadingStyle}>RoboButton — All Sizes</p>
        <div style={rowStyle}>
          {BUTTON_SIZES.map((size) => (
            <RoboButton key={size} size={size} onClick={() => setPrimaryClicks((c) => c + 1)}>
              {size.toUpperCase()}
            </RoboButton>
          ))}
          {primaryClicks > 0 && <ClickCounter count={primaryClicks} />}
        </div>
      </div>

      {/* Icon button grid: 6 variants × 3 sizes = 18 */}
      <div style={sectionStyle}>
        <p style={sectionHeadingStyle}>RoboIconButton — 6 Variants × 3 Sizes</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {ICON_SIZES.map((size) => (
            <div key={size} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--muted-foreground)' }}>
                size=&quot;{size}&quot;
              </span>
              <div style={iconGridStyle}>
                {ICON_VARIANTS.map((variant, vi) => {
                  const { icon: Icon, label } = ICON_DEFS[vi];
                  return (
                    <div key={variant} style={iconCellStyle}>
                      <RoboIconButton
                        aria-label={`${label} — ${variant}`}
                        variant={variant}
                        size={size}
                      >
                        <Icon style={{ width: size === 'sm' ? 14 : size === 'lg' ? 20 : 16, height: size === 'sm' ? 14 : size === 'lg' ? 20 : 16 }} aria-hidden='true' />
                      </RoboIconButton>
                      <span style={iconLabelStyle}>{variant}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Copy button examples */}
      <div style={sectionStyle}>
        <p style={sectionHeadingStyle}>RoboCopyButton — 3 Copy Targets</p>
        <div style={copyRowStyle}>
          {COPY_TARGETS.map(({ label, value }) => (
            <div key={label} style={copyItemStyle}>
              <span style={{ fontSize: '0.7rem', color: 'var(--muted-foreground)', minWidth: 60 }}>
                {label}
              </span>
              <span>{value}</span>
              <RoboCopyButton value={value} label={`Copy ${label}`} iconOnly size='sm' />
            </div>
          ))}
        </div>
      </div>

      {/* Export + Print */}
      <div style={sectionStyle}>
        <p style={sectionHeadingStyle}>RoboExportButton + RoboPrintButton</p>
        <div style={utilityRowStyle}>
          <RoboExportButton
            data={sampleObjects}
            columns={objectColumns}
            filename='catalog'
            format='csv'
          />
          <RoboExportButton
            data={sampleObjects}
            columns={objectColumns}
            filename='catalog'
            format='xlsx'
          />
          <RoboPrintButton label='Print Report' />
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

export const patternMeta = {
  demonstrates: 'A gallery of the button and action-button family in one place: standard buttons plus copy, export, print, and icon-only action buttons against sample export data.',
  whenToUse: 'Use as the reference when a feature needs a toolbar or action row combining several of these specialized buttons, or to see them all side by side before picking which to use.',
  keywords: ['button gallery', 'copy button', 'export button', 'print button', 'icon button', 'action row', 'toolbar buttons'],
  agentPriority: 'Prioritize this pattern for reference on button variety and placement conventions. It is not a page-level pattern, so do not use it as an archetype substitute; pair it with a list or dashboard pattern such as Object Catalog that needs an action toolbar.',
};

const meta: Meta = {
  title: 'Showcase/Patterns/Forms/Button & Actions',
  excludeStories: ['patternMeta'],
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};
export default meta;

type Story = StoryObj;

export const ButtonActionsPlayground: Story = {
  name: 'Button & Actions — Interactive Playground',
  render: () => <ButtonActionsDemo />,
};
