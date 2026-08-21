import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { RoboRadioGroup } from './robo-radio-group';

const reportTypeOptions = [
  { value: 'fr', label: 'Final Report (FR)', description: 'Filed at end of mission' },
  { value: 'pr', label: 'Position Report (PR)', description: 'Interim position update' },
  { value: 'sp', label: 'Special Report (SP)', description: 'Filed on special events' },
  { value: 'dr', label: 'Deviation Report (DR)', description: 'Route deviation notification' },
];


export const componentMeta = {
  description: 'Mutually exclusive option selector for single-choice form fields',
  category: 'input' as const,
  keywords: ['radio', 'option', 'select', 'single', 'choice', 'exclusive', 'group'],
  whenToUse: 'For mutually exclusive choices with 2-5 visible options (payment type, priority level)',
  whenNotToUse: 'For many options use RoboSelect; for boolean toggle use RoboCheckbox or RoboSwitch',
  pairsWith: ['RoboFormField', 'RoboLabel', 'RoboCard'],
  a11y: 'Uses role="radiogroup" with arrow-key navigation between options; one must always be selected if required',
};
const meta: Meta<typeof RoboRadioGroup> = {
  title: 'Components/Forms/RoboRadioGroup',
  excludeStories: ['componentMeta'],
    component: RoboRadioGroup,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    orientation: { control: 'radio', options: ['vertical', 'horizontal'] },
    disabled:    { control: 'boolean' },
    label:       { control: 'text' },
    helperText:  { control: 'text' },
    error:       { control: 'text' },
  },
};
export default meta;

type Story = StoryObj<typeof RoboRadioGroup>;

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

export const Default: Story = {
  args: {
    label: 'Report type',
    options: reportTypeOptions,
  },
};

export const WithHelperText: Story = {
  name: 'With Helper Text',
  args: {
    label: 'Report type',
    helperText: 'Select the type that matches your current mission event.',
    options: reportTypeOptions,
  },
};

export const WithError: Story = {
  name: 'With Error',
  args: {
    label: 'Report type',
    error: 'Please select a report type to continue.',
    options: reportTypeOptions,
  },
};

export const Horizontal: Story = {
  name: 'Horizontal Layout',
  args: {
    label: 'Satellite status',
    orientation: 'horizontal',
    options: [
      { value: 'active', label: 'Active' },
      { value: 'docked', label: 'Docked' },
      { value: 'overdue', label: 'Overdue' },
    ],
  },
};

export const WithDisabledOption: Story = {
  name: 'With Disabled Option',
  args: {
    label: 'Filing method',
    options: [
      { value: 'web', label: 'Web portal' },
      { value: 'api', label: 'API integration' },
      { value: 'fax', label: 'Fax', disabled: true, description: 'Legacy — being phased out' },
    ],
  },
};

export const AllDisabled: Story = {
  name: 'Disabled Group',
  args: {
    label: 'Report type',
    disabled: true,
    options: reportTypeOptions,
  },
};

/** Controlled — shows selected value in real time. */
export const Controlled: Story = {
  name: 'Controlled',
  render: () => {
    const [value, setValue] = React.useState('pr');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <RoboRadioGroup
          label='Report type'
          options={reportTypeOptions}
          value={value}
          onValueChange={setValue}
        />
        <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', margin: 0 }}>
          Selected: <strong>{value}</strong>
        </p>
      </div>
    );
  },
};

export const Playground: Story = {
  args: {
    label: 'Choose an option',
    helperText: '',
    error: '',
    orientation: 'vertical',
    disabled: false,
    options: [
      { value: 'a', label: 'Option A' },
      { value: 'b', label: 'Option B' },
      { value: 'c', label: 'Option C' },
    ],
  },
};
