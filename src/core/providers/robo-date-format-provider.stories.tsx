import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { createLocalStorageAdapter } from '../storage-adapter';
import { RoboBadge } from '../badge/robo-badge';
import { RoboCard, RoboCardBody, RoboCardHeader } from '../card/robo-card';
import { RoboSelect } from '../../forms/select/robo-select';
import { DATE_FORMAT_OPTIONS } from '../formatting/format-date';
import { RoboDateFormatProvider, useDateFormat } from './robo-date-format-provider';
import type { DateFormatId } from './robo-date-format-provider';

export const componentMeta = {
  description: 'Context provider that controls the app-wide date display format, with a bound formatDate/formatDateTime helper',
  category: 'layout' as const,
  keywords: ['date', 'format', 'date format', 'settings', 'provider', 'context', 'locale'],
  whenToUse: 'Wrap the app to let users choose how dates are displayed everywhere, and to give every date display a live-reactive formatter',
  whenNotToUse: 'For a single fixed date format regardless of user preference, call formatDate/formatDateTime directly with an explicit DateFormatId',
  pairsWith: ['RoboThemeProvider', 'RoboDensityProvider', 'RoboDataTable', 'createDateCell'],
  a11y: 'The date-format dropdown is a standard RoboSelect — keyboard operable, labeled options',
};

const meta: Meta<typeof RoboDateFormatProvider> = {
  title: 'Foundation/Providers/RoboDateFormatProvider',
  excludeStories: ['componentMeta'],
  component: RoboDateFormatProvider,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Persists a chosen `DateFormatId` via a `StorageAdapter` and exposes `formatDate`/`formatDateTime` bound to the current setting. `createDateCell` (from `@roboborealis/components/tables`) reacts to this automatically when mounted.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof RoboDateFormatProvider>;

const SAMPLE_DATE = '2026-03-04T15:06:07.000Z';

function DateFormatControls() {
  const { dateFormat, setDateFormat, formatDate, formatDateTime } = useDateFormat();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, alignItems: 'center' }}>
      <div style={{ width: 260 }}>
        <RoboSelect
          options={DATE_FORMAT_OPTIONS}
          value={dateFormat}
          onValueChange={(v) => setDateFormat(v as DateFormatId)}
        />
      </div>

      <RoboBadge variant='status'>
        Active format: <strong style={{ marginLeft: 4 }}>{dateFormat}</strong>
      </RoboBadge>

      <RoboCard className='w-72'>
        <RoboCardHeader>
          <h3 style={{ margin: 0, fontSize: '1rem' }}>Sample Date</h3>
          <p style={{ margin: 0, fontSize: '0.75rem', opacity: 0.6 }}>Reacts to the setting above</p>
        </RoboCardHeader>
        <RoboCardBody style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span>formatDate: {formatDate(SAMPLE_DATE)}</span>
          <span>formatDateTime: {formatDateTime(SAMPLE_DATE)}</span>
        </RoboCardBody>
      </RoboCard>
    </div>
  );
}

export const Interactive: Story = {
  name: 'Interactive — Choose Date Format',
  render: () => (
    <RoboDateFormatProvider storageAdapter={createLocalStorageAdapter()}>
      <DateFormatControls />
    </RoboDateFormatProvider>
  ),
};

export const DefaultUS: Story = {
  name: 'Default (MM/DD/YYYY)',
  render: () => (
    <RoboDateFormatProvider defaultDateFormat='MM/DD/YYYY'>
      <DateFormatControls />
    </RoboDateFormatProvider>
  ),
};

export const StartISO: Story = {
  name: 'Start ISO (YYYY-MM-DD)',
  render: () => (
    <RoboDateFormatProvider defaultDateFormat='YYYY-MM-DD'>
      <DateFormatControls />
    </RoboDateFormatProvider>
  ),
};

export const StartInternational: Story = {
  name: 'Start International (DD/MM/YYYY)',
  render: () => (
    <RoboDateFormatProvider defaultDateFormat='DD/MM/YYYY'>
      <DateFormatControls />
    </RoboDateFormatProvider>
  ),
};
