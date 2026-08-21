import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { RoboButton } from '../core/button/robo-button';
import { RoboInput } from '../core/input/robo-input';
import { RoboTextarea } from './textarea/robo-textarea';
import { RoboSelect } from './select/robo-select';
import { RoboCheckboxGroup } from './checkbox/robo-checkbox';
import { RoboRadioGroup } from './radio-group/robo-radio-group';
import { RoboSwitch } from './switch/robo-switch';
import { RoboSlider } from './slider/robo-slider';
import { RoboDatePicker } from './date-picker/robo-date-picker';
import { OverviewAccordion, OverviewGroup } from '../lib/storybook/overview-layout';

// ---------------------------------------------------------------------------
// Style constants
// ---------------------------------------------------------------------------

const pageStyle: React.CSSProperties = {
  padding: '32px 24px',
  maxWidth: 860,
};

const twoColStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 16,
};

const rowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: 16,
  flexWrap: 'wrap',
};

// ---------------------------------------------------------------------------
// Overview story — all form controls in one view
// ---------------------------------------------------------------------------

function FormsOverview() {
  const [description, setDescription] = React.useState('');
  const [country, setCountry] = React.useState('');
  const [reportDate, setReportDate] = React.useState<Date | undefined>(undefined);
  const [permissions, setPermissions] = React.useState<string[]>(['read']);
  const [frequency, setFrequency] = React.useState('daily');
  const [notifications, setNotifications] = React.useState(true);
  const [volume, setVolume] = React.useState([40]);

  return (
    <div style={pageStyle}>
      <OverviewAccordion>

        {/* RoboInput */}
        <OverviewGroup value="input" title="RoboInput — states">
          <div style={twoColStyle}>
            <RoboInput label='Default' placeholder='e.g. Voyager 1' />
            <RoboInput label='With value' defaultValue='Sentinel-2' />
            <RoboInput
              label='Error state'
              state='error'
              helperText='NORAD ID must be exactly 9 digits.'
              defaultValue='123'
            />
            <RoboInput label='Disabled' disabled defaultValue='Locked field' />
          </div>
        </OverviewGroup>

        {/* RoboSelect */}
        <OverviewGroup value="select" title="RoboSelect — states">
          <div style={twoColStyle}>
            <RoboSelect
              label='Satellite type'
              placeholder='Select a type…'
              options={[
                { value: 'cargo', label: 'Cargo Freighter' },
                { value: 'probe', label: 'Probe' },
                { value: 'passenger', label: 'Crew Capsule' },
                { value: 'fishing', label: 'CubeSat' },
              ]}
              value={country}
              onValueChange={setCountry}
              helperText='Select the satellite classification'
            />
            <RoboSelect
              label='Country (pre-selected)'
              options={[
                { value: 'us', label: 'United States' },
                { value: 'uk', label: 'United Kingdom' },
                { value: 'au', label: 'Australia' },
              ]}
              value='us'
              onValueChange={() => {}}
            />
            <RoboSelect
              label='Error state'
              placeholder='Required field…'
              options={[
                { value: 'a', label: 'Option A' },
                { value: 'b', label: 'Option B' },
              ]}
              error='Please select an option'
            />
            <RoboSelect
              label='Disabled'
              placeholder='Disabled select'
              options={[{ value: 'a', label: 'Option A' }]}
              disabled
            />
          </div>
        </OverviewGroup>

        {/* RoboTextarea */}
        <OverviewGroup value="textarea" title="RoboTextarea">
          <RoboTextarea
            label='Mission remarks'
            helperText='Optional notes about the mission or incident'
            maxLength={300}
            showCount
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder='Describe any notable events during the mission…'
          />
        </OverviewGroup>

        {/* RoboDatePicker */}
        <OverviewGroup value="datepicker" title="RoboDatePicker — single & range">
          <div style={twoColStyle}>
            <RoboDatePicker
              label='Departure date'
              placeholder='Select date'
              value={reportDate}
              onChange={setReportDate}
              helperText='Date the satellite was launched'
            />
            <RoboDatePicker
              label='Mission window'
              placeholder='Select date range'
              mode='range'
              helperText='Select start and end dates'
            />
          </div>
        </OverviewGroup>

        {/* RoboCheckboxGroup */}
        <OverviewGroup value="checkbox" title="RoboCheckboxGroup">
          <RoboCheckboxGroup
            label='User permissions'
            helperText='Select all applicable access levels'
            options={[
              { name: 'read',  value: 'read',  label: 'Read',  description: 'View all records in the system' },
              { name: 'write', value: 'write', label: 'Write', description: 'Create and edit records' },
              { name: 'admin', value: 'admin', label: 'Admin', description: 'Full system access', disabled: true },
            ]}
            value={permissions}
            onChange={setPermissions}
          />
        </OverviewGroup>

        {/* RoboRadioGroup */}
        <OverviewGroup value="radio" title="RoboRadioGroup">
          <RoboRadioGroup
            label='Notification frequency'
            options={[
              { value: 'realtime', label: 'Real-time',      description: 'Immediate alerts for all events' },
              { value: 'daily',    label: 'Daily digest',   description: 'Summary sent at 09:00 local time' },
              { value: 'weekly',   label: 'Weekly summary', description: 'Sent every Monday morning' },
            ]}
            value={frequency}
            onValueChange={setFrequency}
          />
        </OverviewGroup>

        {/* RoboSwitch */}
        <OverviewGroup value="switch" title="RoboSwitch — states & sizes">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <RoboSwitch
              size='sm'
              label='Email notifications (sm)'
              description='Receive email alerts for critical events'
              checked={notifications}
              onCheckedChange={setNotifications}
            />
            <RoboSwitch
              size='md'
              label='Push notifications (md)'
              description='In-app push alerts — default size'
              defaultChecked
            />
            <RoboSwitch
              size='lg'
              label='SMS alerts (lg)'
              description='Text message alerts — disabled'
              disabled
            />
          </div>
        </OverviewGroup>

        {/* RoboSlider */}
        <OverviewGroup value="slider" title="RoboSlider">
          <div style={{ maxWidth: 480 }}>
            <RoboSlider
              label='Alert volume'
              min={0}
              max={100}
              step={5}
              value={volume}
              onChange={setVolume}
              showValue
              formatValue={(v) => `${v}%`}
              helperText='Adjust the audio volume for alert notifications'
            />
          </div>
          <div style={rowStyle}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <RoboSlider
                label='Search radius (nm)'
                min={0}
                max={500}
                step={10}
                defaultValue={[100]}
                showValue
                formatValue={(v) => `${v} nm`}
              />
            </div>
            <div style={{ flex: 1, minWidth: 200 }}>
              <RoboSlider
                label='Speed limit (locked)'
                disabled
                defaultValue={[20]}
                min={0}
                max={40}
                showValue
                formatValue={(v) => `${v} km/s`}
              />
            </div>
          </div>
        </OverviewGroup>

      </OverviewAccordion>

      {/* Submit row */}
      <div style={{ display: 'flex', gap: 8, padding: '24px 0 8px' }}>
        <RoboButton type='submit' variant='default' size='md'>
          Save settings
        </RoboButton>
        <RoboButton type='button' variant='ghost' size='md'>
          Cancel
        </RoboButton>
      </div>

    </div>
  );
}

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta: Meta = {
  title: 'Components/Forms',
  parameters: { layout: 'padded' },
};
export default meta;

export const Overview: StoryObj = {
  name: 'Forms Overview',
  render: () => <FormsOverview />,
};
