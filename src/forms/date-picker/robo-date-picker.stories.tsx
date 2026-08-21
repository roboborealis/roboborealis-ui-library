import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { RoboDatePicker } from './robo-date-picker';


export const componentMeta = {
  description: 'Calendar-based date selection with range support and locale formatting',
  category: 'input' as const,
  keywords: ['date', 'calendar', 'picker', 'range', 'time', 'schedule', 'day', 'month'],
  whenToUse: 'For selecting dates, date ranges, or datetime values in forms and filters',
  whenNotToUse: 'For time-only input use a time picker; for relative time ("last 7 days") use RoboSelect',
  pairsWith: ['RoboFormField', 'RoboInput', 'RoboButton', 'RoboPopover'],
  a11y: 'Calendar grid uses role="grid" with arrow-key navigation; announce selected date to screen readers',
};
const meta: Meta<typeof RoboDatePicker> = {
  title: 'Components/Forms/RoboDatePicker',
  excludeStories: ['componentMeta'],
    component: RoboDatePicker,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    mode:       { control: 'radio', options: ['single', 'range'] },
    disabled:   { control: 'boolean' },
    required:   { control: 'boolean' },
    label:      { control: 'text' },
    placeholder:{ control: 'text' },
    helperText: { control: 'text' },
    error:      { control: 'text' },
  },
};
export default meta;

type Story = StoryObj<typeof RoboDatePicker>;

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

/** All states at a glance. */
export const AllStates: Story = {
  name: 'All States',
  render: () => {
    const WithValue = () => {
      const [date, setDate] = React.useState<Date | undefined>(new Date());
      return <RoboDatePicker label='With value' value={date} onChange={setDate} />;
    };
    return (
      <div className='flex flex-col gap-4 max-w-sm'>
        <RoboDatePicker label='Default' placeholder='Select a date…' />
        <WithValue />
        <RoboDatePicker label='Disabled' disabled placeholder='Not available' />
      </div>
    );
  },
};

export const Default: Story = {
  args: {
    label: 'Departure date',
    placeholder: 'Select a date…',
  },
};

export const WithHelperText: Story = {
  name: 'With Helper Text',
  args: {
    label: 'Scheduled arrival',
    helperText: 'Enter the expected port arrival date.',
  },
};

export const WithError: Story = {
  name: 'With Error',
  args: {
    label: 'Departure date',
    error: 'Departure date is required.',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Filing deadline',
    disabled: true,
    placeholder: 'Read only',
  },
};

export const Required: Story = {
  args: {
    label: 'Departure date',
    required: true,
    placeholder: 'Select a date…',
  },
};

/** Controlled single date. */
export const Controlled: Story = {
  name: 'Controlled — Single Date',
  render: () => {
    const [date, setDate] = React.useState<Date | undefined>(undefined);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 320 }}>
        <RoboDatePicker
          label='Departure date'
          value={date}
          onChange={setDate}
          helperText='Select any future date.'
        />
        <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', margin: 0 }}>
          Selected: <strong>{date ? date.toLocaleDateString() : '—'}</strong>
        </p>
      </div>
    );
  },
};

/** Future-only — past dates disabled. */
export const FutureDatesOnly: Story = {
  name: 'Future Dates Only',
  render: () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return (
      <RoboDatePicker
        label='Scheduled departure'
        helperText='Cannot depart in the past.'
        minDate={today}
        placeholder='Select a future date…'
      />
    );
  },
};

export const Playground: Story = {
  args: {
    label: 'Pick a date',
    placeholder: 'Select a date…',
    helperText: '',
    error: '',
    disabled: false,
    required: false,
    mode: 'single',
  },
};
