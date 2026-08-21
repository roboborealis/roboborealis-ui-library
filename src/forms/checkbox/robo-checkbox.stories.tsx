import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { RoboCheckbox, RoboCheckboxGroup } from './robo-checkbox';


export const componentMeta = {
  description: 'Binary toggle input for boolean options or multi-select lists',
  category: 'input' as const,
  keywords: ['checkbox', 'check', 'toggle', 'boolean', 'multi-select', 'option', 'tick'],
  whenToUse: 'For boolean options (terms acceptance), multi-select lists, or filter toggles',
  whenNotToUse: 'For mutually exclusive options use RoboRadioGroup; for on/off settings use RoboSwitch',
  pairsWith: ['RoboFormField', 'RoboLabel', 'RoboFilterPanel'],
  a11y: 'Always associate with a label; indeterminate state needs aria-checked="mixed"',
};
const meta: Meta<typeof RoboCheckbox> = {
  title: 'Components/Forms/RoboCheckbox',
  excludeStories: ['componentMeta'],
    component: RoboCheckbox,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    checked:       { control: 'select', options: [true, false, 'indeterminate'] },
    disabled:      { control: 'boolean' },
    label:         { control: 'text' },
    description:   { control: 'text' },
    helperText:    { control: 'text' },
    error:         { control: 'text' },
  },
};
export default meta;

type Story = StoryObj<typeof RoboCheckbox>;

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

export const Default: Story = {
  args: { label: 'Accept terms and conditions' },
};

export const WithDescription: Story = {
  name: 'With Description',
  args: {
    label: 'Enable notifications',
    description: 'Receive alerts when a satellite status changes.',
  },
};

export const WithHelperText: Story = {
  name: 'With Helper Text',
  args: {
    label: 'Subscribe to weekly digest',
    helperText: 'You can unsubscribe at any time.',
  },
};

export const WithError: Story = {
  name: 'With Error',
  args: {
    label: 'Accept terms and conditions',
    error: 'You must accept the terms to continue.',
    checked: false,
  },
};

export const Indeterminate: Story = {
  args: {
    label: 'Select all satellites',
    checked: 'indeterminate',
    description: '3 of 7 satellites selected',
  },
};

export const Disabled: Story = {
  args: { label: 'Disabled option', disabled: true, checked: false },
};

export const DisabledChecked: Story = {
  name: 'Disabled (checked)',
  args: { label: 'Locked option', disabled: true, checked: true },
};

/** All states in one view. */
export const AllStates: Story = {
  name: 'All States',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <RoboCheckbox label='Unchecked' />
      <RoboCheckbox label='Checked' defaultChecked />
      <RoboCheckbox label='Indeterminate' checked='indeterminate' />
      <RoboCheckbox label='With description' description='Extra context shown below.' />
      <RoboCheckbox label='With helper text' helperText='This is additional guidance.' />
      <RoboCheckbox label='With error' error='This field is required.' />
      <RoboCheckbox label='Disabled' disabled />
      <RoboCheckbox label='Disabled checked' disabled checked />
    </div>
  ),
};

/** RoboCheckboxGroup — multiple options with shared state. */
export const Group: Story = {
  name: 'Checkbox Group',
  render: () => {
    const [selected, setSelected] = React.useState<string[]>(['email']);
    return (
      <RoboCheckboxGroup
        label='Notification preferences'
        helperText='Select all that apply.'
        options={[
          { value: 'email', label: 'Email', description: 'Daily digest to your inbox' },
          { value: 'sms', label: 'SMS', description: 'Immediate alerts to your phone' },
          { value: 'push', label: 'Push notifications' },
          { value: 'slack', label: 'Slack', disabled: true, description: 'Coming soon' },
        ]}
        value={selected}
        onChange={setSelected}
      />
    );
  },
};

export const Playground: Story = {
  args: {
    label: 'Checkbox label',
    description: '',
    helperText: '',
    error: '',
    checked: false,
    disabled: false,
  },
};
