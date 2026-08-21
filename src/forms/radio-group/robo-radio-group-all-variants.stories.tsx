import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { RoboRadioGroup } from './robo-radio-group';
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
// Data constants
// ---------------------------------------------------------------------------

const spaceOptions = [
  { value: 'fr', label: 'Final Report' },
  { value: 'pr', label: 'Position Report' },
  { value: 'sp', label: 'SP Report' },
];

const spaceOptionsWithDesc = [
  { value: 'fr', label: 'Final Report', description: 'Filed at the end of a mission' },
  { value: 'pr', label: 'Position Report', description: 'Periodic mid-mission position update' },
  { value: 'sp', label: 'SP Report', description: 'Filed on special navigation events' },
];

const spaceOptionsWithDisabled = [
  { value: 'fr', label: 'Final Report' },
  { value: 'pr', label: 'Position Report' },
  { value: 'sp', label: 'SP Report', disabled: true, description: 'Currently unavailable' },
];

// ---------------------------------------------------------------------------
// Controlled variant sub-component (module-level)
// ---------------------------------------------------------------------------

function ControlledVariant() {
  const [value, setValue] = React.useState('fr');

  return (
    <div style={sectionStyle}>
      <RoboRadioGroup
        label='Report type (controlled)'
        options={spaceOptions}
        value={value}
        onValueChange={setValue}
        helperText='Selection is tracked in React state.'
      />
      <p style={valueDisplayStyle}>
        Selected: <strong>{value}</strong>
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta: Meta<typeof RoboRadioGroup> = {
  title: 'Components/Forms/RoboRadioGroup',
  component: RoboRadioGroup,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};
export default meta;

type Story = StoryObj<typeof RoboRadioGroup>;

// ---------------------------------------------------------------------------
// All Variants story
// ---------------------------------------------------------------------------

export const AllVariants: Story = {
  name: 'All Variants',
  render: () => (
    <OverviewStack>

      <OverviewSection title='Vertical (default)'>
        <RoboRadioGroup
          label='Report type'
          options={spaceOptions}
          defaultValue='pr'
        />
      </OverviewSection>

      <OverviewSection title='Horizontal'>
        <RoboRadioGroup
          label='Report type'
          orientation='horizontal'
          options={spaceOptions}
          defaultValue='fr'
        />
      </OverviewSection>

      <OverviewSection title='With helper text'>
        <RoboRadioGroup
          label='Report type'
          options={spaceOptionsWithDesc}
          helperText='Select the report type that matches this mission event.'
          defaultValue='sp'
        />
      </OverviewSection>

      <OverviewSection title='With error'>
        <RoboRadioGroup
          label='Report type'
          options={spaceOptions}
          error='Please select a report type to continue.'
        />
      </OverviewSection>

      <OverviewSection title='With disabled option'>
        <RoboRadioGroup
          label='Report type'
          options={spaceOptionsWithDisabled}
          defaultValue='fr'
        />
      </OverviewSection>

      <OverviewSection title='All disabled'>
        <RoboRadioGroup
          label='Report type (locked)'
          options={spaceOptions}
          disabled
          defaultValue='pr'
          helperText='This field is read-only for the current user.'
        />
      </OverviewSection>

      <OverviewSection title='Controlled'>
        <ControlledVariant />
      </OverviewSection>

    </OverviewStack>
  ),
};
