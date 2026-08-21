import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { RoboSelect } from './robo-select';

const flagStateOptions = [
  { value: 'usa', label: 'NASA' },
  { value: 'gbr', label: 'ESA' },
  { value: 'nor', label: 'JAXA' },
  { value: 'pan', label: 'Roscosmos' },
  { value: 'lbr', label: 'ISRO' },
  { value: 'mhl', label: 'CNSA' },
  { value: 'bhs', label: 'SpaceX' },
  { value: 'sgp', label: 'CSA' },
];


export const componentMeta = {
  description: 'Dropdown selection control with search, multi-select, and grouping',
  category: 'input' as const,
  keywords: ['select', 'dropdown', 'combobox', 'option', 'list', 'pick', 'choose', 'menu'],
  whenToUse: 'For selecting from 5+ options, searchable lists, or grouped selections',
  whenNotToUse: 'For 2-4 visible options use RoboRadioGroup; for boolean use RoboSwitch; for actions use RoboDropdownMenu',
  pairsWith: ['RoboFormField', 'RoboLabel', 'RoboChip', 'RoboInput'],
  a11y: 'Uses Radix Select — manages aria-expanded, listbox role, and typeahead automatically',
};
const meta: Meta<typeof RoboSelect> = {
  title: 'Components/Forms/RoboSelect',
  excludeStories: ['componentMeta'],
    component: RoboSelect,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    disabled:    { control: 'boolean' },
    label:       { control: 'text' },
    placeholder: { control: 'text' },
    helperText:  { control: 'text' },
    error:       { control: 'text' },
  },
};
export default meta;

type Story = StoryObj<typeof RoboSelect>;

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

/** All states in a column for quick visual review. */
export const AllStates: Story = {
  name: 'All States',
  render: () => (
    <div className='flex flex-col gap-4 max-w-sm'>
      <RoboSelect label='Default' options={flagStateOptions} placeholder='Select…' />
      <RoboSelect label='With value' options={flagStateOptions} defaultValue='nor' />
      <RoboSelect label='Error' options={flagStateOptions} error='This field is required.' />
      <RoboSelect label='Disabled' options={flagStateOptions} disabled defaultValue='usa' />
    </div>
  ),
};

export const Default: Story = {
  args: {
    label: 'Operator',
    placeholder: 'Select a country…',
    options: flagStateOptions,
  },
};

export const WithDefaultValue: Story = {
  name: 'With Default Value',
  args: {
    label: 'Operator',
    defaultValue: 'usa',
    options: flagStateOptions,
  },
};

export const WithHelperText: Story = {
  name: 'With Helper Text',
  args: {
    label: 'Operator',
    helperText: 'The agency that operates the satellite.',
    options: flagStateOptions,
  },
};

export const ErrorState: Story = {
  name: 'Error State',
  args: {
    label: 'Operator',
    error: 'Please select an operator.',
    options: flagStateOptions,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Operator',
    disabled: true,
    defaultValue: 'gbr',
    options: flagStateOptions,
  },
};

export const WithDisabledOptions: Story = {
  name: 'With Disabled Options',
  args: {
    label: 'Satellite class',
    placeholder: 'Select class…',
    options: [
      { value: 'cargo', label: 'Cargo Freighter' },
      { value: 'probe', label: 'Probe' },
      { value: 'passenger', label: 'Crew Capsule' },
      { value: 'fishing', label: 'CubeSat', disabled: true },
      { value: 'classified', label: 'Classified (unavailable)', disabled: true },
    ],
  },
};

/** Controlled with live-updating display value. */
export const Controlled: Story = {
  name: 'Controlled',
  render: () => {
    const [value, setValue] = React.useState<string>('');
    const selected = flagStateOptions.find((o) => o.value === value);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 320 }}>
        <RoboSelect
          label='Operator'
          placeholder='Select a country…'
          options={flagStateOptions}
          value={value}
          onValueChange={setValue}
        />
        <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', margin: 0 }}>
          Selected: <strong>{selected?.label ?? '—'}</strong>
        </p>
      </div>
    );
  },
};

export const Playground: Story = {
  args: {
    label: 'Select field',
    placeholder: 'Select…',
    helperText: '',
    error: '',
    disabled: false,
    options: flagStateOptions,
  },
};
