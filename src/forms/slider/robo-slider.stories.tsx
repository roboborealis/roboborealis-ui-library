import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { RoboSlider } from './robo-slider';


export const componentMeta = {
  description: 'Range input for selecting numeric values within a defined min-max',
  category: 'input' as const,
  keywords: ['slider', 'range', 'numeric', 'value', 'min', 'max', 'track', 'thumb'],
  whenToUse: 'For selecting numeric values within a range — opacity, zoom level, time offsets',
  whenNotToUse: 'For precise numeric entry use RoboInput with type="number"; for date ranges use RoboDatePicker',
  pairsWith: ['RoboFormField', 'RoboLabel', 'RoboTooltip'],
  a11y: 'Requires aria-label or aria-labelledby; announces current value on change',
};
const meta: Meta<typeof RoboSlider> = {
  title: 'Components/Forms/RoboSlider',
  excludeStories: ['componentMeta'],
    component: RoboSlider,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    min:        { control: { type: 'number' } },
    max:        { control: { type: 'number' } },
    step:       { control: { type: 'number', min: 1 } },
    showValue:  { control: 'boolean' },
    disabled:   { control: 'boolean' },
    label:      { control: 'text' },
    helperText: { control: 'text' },
    error:      { control: 'text' },
  },
};
export default meta;

type Story = StoryObj<typeof RoboSlider>;

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

export const Default: Story = {
  args: {
    label: 'Search radius',
    min: 0,
    max: 100,
    defaultValue: [40],
  },
};

export const WithValueDisplay: Story = {
  name: 'With Value Display',
  args: {
    label: 'Max speed (km/s)',
    min: 0,
    max: 30,
    step: 1,
    defaultValue: [15],
    showValue: true,
  },
};

export const CustomFormatter: Story = {
  name: 'Custom Value Format',
  args: {
    label: 'Search radius',
    min: 0,
    max: 500,
    step: 10,
    defaultValue: [100],
    showValue: true,
    formatValue: (v: number) => `${v} nm`,
  },
};

export const WithHelperText: Story = {
  name: 'With Helper Text',
  args: {
    label: 'Visibility threshold',
    helperText: 'Alert when visibility drops below this value (orbital miles).',
    min: 0,
    max: 20,
    step: 0.5,
    defaultValue: [5],
    showValue: true,
    formatValue: (v: number) => `${v} nm`,
  },
};

export const WithError: Story = {
  name: 'With Error',
  args: {
    label: 'Depth limit',
    error: 'Value must be within operational range.',
    min: 0,
    max: 100,
    defaultValue: [0],
    showValue: true,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Speed limit (locked)',
    disabled: true,
    defaultValue: [20],
    min: 0,
    max: 40,
    showValue: true,
    formatValue: (v: number) => `${v} km/s`,
  },
};

/** Controlled — value reflected in state. */
export const Controlled: Story = {
  name: 'Controlled',
  render: () => {
    const [value, setValue] = React.useState([25]);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 380 }}>
        <RoboSlider
          label='Search radius'
          min={0}
          max={200}
          step={5}
          value={value}
          onChange={setValue}
          showValue
          formatValue={(v) => `${v} nm`}
        />
        <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', margin: 0 }}>
          Current value: <strong>{value[0]} nm</strong>
        </p>
      </div>
    );
  },
};

export const Playground: Story = {
  args: {
    label: 'Slider label',
    min: 0,
    max: 100,
    step: 1,
    defaultValue: [50],
    showValue: true,
    disabled: false,
  },
};
