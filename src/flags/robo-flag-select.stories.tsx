import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { RoboFlagSelect } from './robo-flag-select';


export const componentMeta = {
  description: 'Searchable country flag selector dropdown for form inputs',
  category: 'input' as const,
  keywords: ['flag', 'select', 'country', 'dropdown', 'search', 'iso', 'picker', 'nation'],
  whenToUse: 'For selecting a country in forms — satellite registry, ground station location, nationality',
  whenNotToUse: 'For displaying a flag without selection use RoboFlag; for general dropdowns use RoboSelect',
  pairsWith: ['RoboFormField', 'RoboFlag', 'RoboInput'],
  a11y: 'Uses combobox pattern with typeahead search; selected country announced with full name',
};
const meta: Meta<typeof RoboFlagSelect> = {
  title: 'Elements/Flags/RoboFlagSelect',
  excludeStories: ['componentMeta'],
    component: RoboFlagSelect,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: '320px' }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof RoboFlagSelect>;

/* ------------------------------------------------------------------ */
/* All states                                                           */
/* ------------------------------------------------------------------ */

export const AllStates: Story = {
  name: 'All States',
  render: () => (
    <div className='flex flex-col gap-4 max-w-sm'>
      <RoboFlagSelect label='Default' placeholder='Select a country…' searchable />
      <RoboFlagSelect label='With value' defaultValue='gb' searchable />
      <RoboFlagSelect label='Disabled' value='us' disabled />
      <RoboFlagSelect label='Error' placeholder='Select a country…' error='Country is required' required />
      <RoboFlagSelect label='Searchable = false' placeholder='Select a country…' searchable={false} />
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/* Default — all 255 countries, searchable                             */
/* ------------------------------------------------------------------ */

export const Default: Story = {
  args: {
    label: 'Country',
    placeholder: 'Select a country…',
    searchable: true,
  },
};

/* ------------------------------------------------------------------ */
/* Five Eyes — limited country list                                     */
/* ------------------------------------------------------------------ */

export const FiveEyes: Story = {
  name: 'Five Eyes (restricted list)',
  args: {
    label: 'Partner Nation',
    placeholder: 'Select country…',
    countries: ['us', 'gb', 'au', 'ca', 'nz'],
    searchable: false,
  },
};

/* ------------------------------------------------------------------ */
/* NATO members                                                         */
/* ------------------------------------------------------------------ */

export const NATO: Story = {
  name: 'NATO members',
  args: {
    label: 'NATO Nation',
    placeholder: 'Select NATO nation…',
    countries: [
      'al', 'be', 'bg', 'ca', 'hr', 'cz', 'dk', 'ee', 'fi', 'fr',
      'de', 'gr', 'hu', 'is', 'it', 'lv', 'lt', 'lu', 'me', 'nl',
      'mk', 'no', 'pl', 'pt', 'ro', 'sk', 'si', 'es', 'se', 'tr',
      'gb', 'us',
    ],
    searchable: true,
  },
};

/* ------------------------------------------------------------------ */
/* With Error                                                           */
/* ------------------------------------------------------------------ */

export const WithError: Story = {
  name: 'Error state',
  args: {
    label: 'Country',
    placeholder: 'Select a country…',
    error: 'Country is required',
    required: true,
  },
};

/* ------------------------------------------------------------------ */
/* Disabled                                                             */
/* ------------------------------------------------------------------ */

export const Disabled: Story = {
  args: {
    label: 'Country (read-only)',
    value: 'us',
    disabled: true,
  },
};

/* ------------------------------------------------------------------ */
/* Pre-selected value                                                   */
/* ------------------------------------------------------------------ */

export const Preselected: Story = {
  name: 'Pre-selected value',
  args: {
    label: 'Country',
    defaultValue: 'gb',
    searchable: true,
  },
};

/* ------------------------------------------------------------------ */
/* No search                                                            */
/* ------------------------------------------------------------------ */

export const NoSearch: Story = {
  name: 'Without search filter',
  args: {
    label: 'Country',
    searchable: false,
  },
};

/* ------------------------------------------------------------------ */
/* Controlled                                                           */
/* ------------------------------------------------------------------ */

export const Controlled: Story = {
  name: 'Controlled (with external state)',
  render: () => {
    const [value, setValue] = React.useState('us');
    return (
      <div className='flex flex-col gap-4'>
        <RoboFlagSelect
          label='Country'
          value={value}
          onValueChange={setValue}
          searchable
        />
        <p className='text-sm text-[var(--muted-foreground)]'>
          Selected code: <strong className='text-[var(--foreground)]'>{value}</strong>
        </p>
      </div>
    );
  },
};
