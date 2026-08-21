import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { RoboSlider } from './robo-slider';
import { OverviewStack, OverviewSection } from '../../lib/storybook/overview-layout';

// ---------------------------------------------------------------------------
// Style constants
// ---------------------------------------------------------------------------

const sectionStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
};

const valueDisplayStyle: React.CSSProperties = {
  fontSize: '0.75rem',
  color: 'var(--muted-foreground)',
  margin: 0,
};

// ---------------------------------------------------------------------------
// Value formatters (module-level — not inline)
// ---------------------------------------------------------------------------

function formatKnots(v: number): string {
  return `${v} km/s`;
}

function formatCurrency(v: number): string {
  return `$${v.toLocaleString()}`;
}

function formatKilometers(v: number): string {
  return `${v} nm`;
}

// ---------------------------------------------------------------------------
// Controlled variant sub-component (module-level)
// ---------------------------------------------------------------------------

function ControlledVariant() {
  const [value, setValue] = React.useState([25]);

  return (
    <div style={sectionStyle}>
      <RoboSlider
        label='Search radius'
        min={0}
        max={200}
        step={5}
        value={value}
        onChange={setValue}
        showValue
        formatValue={formatKilometers}
        helperText='Drag the handle — value is tracked in React state.'
      />
      <p style={valueDisplayStyle}>
        Current value: <strong>{value[0]} nm</strong>
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta: Meta<typeof RoboSlider> = {
  title: 'Components/Forms/RoboSlider',
  component: RoboSlider,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};
export default meta;

type Story = StoryObj<typeof RoboSlider>;

// ---------------------------------------------------------------------------
// All Variants story
// ---------------------------------------------------------------------------

export const AllVariants: Story = {
  name: 'All Variants',
  render: () => (
    <OverviewStack>

      <OverviewSection title='Basic'>
        <RoboSlider
          label='Search radius'
          min={0}
          max={100}
          defaultValue={[40]}
        />
      </OverviewSection>

      <OverviewSection title='With value display (showValue)'>
        <RoboSlider
          label='Max speed'
          min={0}
          max={30}
          step={1}
          defaultValue={[15]}
          showValue
        />
      </OverviewSection>

      <OverviewSection title='Custom formatter — km/s'>
        <RoboSlider
          label='Speed threshold'
          min={0}
          max={40}
          step={1}
          defaultValue={[18]}
          showValue
          formatValue={formatKnots}
        />
      </OverviewSection>

      <OverviewSection title='Custom formatter — currency'>
        <RoboSlider
          label='Budget cap'
          min={0}
          max={100000}
          step={500}
          defaultValue={[25000]}
          showValue
          formatValue={formatCurrency}
        />
      </OverviewSection>

      <OverviewSection title='With helper text'>
        <RoboSlider
          label='Visibility threshold'
          min={0}
          max={20}
          step={0.5}
          defaultValue={[5]}
          showValue
          formatValue={formatKilometers}
          helperText='Alert when visibility drops below this value.'
        />
      </OverviewSection>

      <OverviewSection title='With error'>
        <RoboSlider
          label='Depth limit'
          min={0}
          max={100}
          defaultValue={[0]}
          showValue
          error='Value must be within operational range (1–100).'
        />
      </OverviewSection>

      <OverviewSection title='Disabled'>
        <RoboSlider
          label='Speed limit (locked)'
          min={0}
          max={40}
          defaultValue={[20]}
          showValue
          formatValue={formatKnots}
          disabled
          helperText='This setting is controlled by system policy.'
        />
      </OverviewSection>

      <OverviewSection title='Controlled (useState)'>
        <ControlledVariant />
      </OverviewSection>

    </OverviewStack>
  ),
};
