import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';

import { RoboTextarea } from './textarea/robo-textarea';
import { RoboSelect, RoboSelectTrigger, RoboSelectContent, RoboSelectItem, RoboSelectValue } from './select/robo-select';
import { RoboCheckboxGroup } from './checkbox/robo-checkbox';
import { RoboRadioGroup } from './radio-group/robo-radio-group';
import { RoboSwitch } from './switch/robo-switch';
import { RoboSlider } from './slider/robo-slider';
import { RoboInput } from '@/core/input/robo-input';

import { RoboFadeIn } from '@/animations/primitives/robo-fade';
import { RoboStagger } from '@/animations/primitives/robo-stagger';
import { RoboSlideIn } from '@/animations/primitives/robo-slide';
import { Looping } from '@/animations/stories/looping-helper';

// ---------------------------------------------------------------------------

const meta: Meta = {
  title: 'Elements/Animated Forms',
  parameters: { layout: 'padded' },
};
export default meta;

// ---------------------------------------------------------------------------
// Full form — all controls staggered in
// ---------------------------------------------------------------------------
export const AnimatedFormControls: StoryObj = {
  name: 'Form controls — RoboStagger entrance',
  render: () => (
    <Looping>
      <div className='max-w-sm'>
        <RoboStagger className='flex flex-col gap-5'>
          <div className='flex flex-col gap-1.5'>
            <label className='text-sm font-medium text-[var(--foreground)]'>Satellite Name</label>
            <RoboInput placeholder='Voyager 1' />
          </div>

          <div className='flex flex-col gap-1.5'>
            <label className='text-sm font-medium text-[var(--foreground)]'>Satellite Type</label>
            <RoboSelect>
              <RoboSelectTrigger>
                <RoboSelectValue placeholder='Select type...' />
              </RoboSelectTrigger>
              <RoboSelectContent>
                <RoboSelectItem value='cargo'>Cargo Freighter</RoboSelectItem>
                <RoboSelectItem value='probe'>Probe</RoboSelectItem>
                <RoboSelectItem value='passenger'>Crew Capsule</RoboSelectItem>
                <RoboSelectItem value='fishing'>CubeSat</RoboSelectItem>
              </RoboSelectContent>
            </RoboSelect>
          </div>

          <div className='flex flex-col gap-1.5'>
            <label className='text-sm font-medium text-[var(--foreground)]'>Notes</label>
            <RoboTextarea placeholder='Additional satellite notes...' rows={3} />
          </div>

          <div className='flex flex-col gap-1.5'>
            <label className='text-sm font-medium text-[var(--foreground)]'>Risk Level</label>
            <RoboSlider min={0} max={100} step={5} defaultValue={[20]} />
            <p className='text-xs text-[var(--muted-foreground)]'>Minimum risk score threshold</p>
          </div>
        </RoboStagger>
      </div>
    </Looping>
  ),
};

// ---------------------------------------------------------------------------
// RoboCheckboxGroup — fade in
// ---------------------------------------------------------------------------
export const CheckboxGroupEntrance: StoryObj = {
  name: 'RoboCheckboxGroup — fade entrance',
  render: () => (
    <Looping>
      <RoboFadeIn preset='standard' slideY={12}>
        <RoboCheckboxGroup
          label='Alert Types'
          options={[
            { name: 'ais-gap', value: 'ais-gap', label: 'AIS Gap' },
            { name: 'port-entry', value: 'port-entry', label: 'Port Entry' },
            { name: 'sar', value: 'sar', label: 'SAR Anomaly' },
            { name: 'weather', value: 'weather', label: 'Weather Advisory' },
          ]}
          value={['ais-gap', 'sar']}
        />
      </RoboFadeIn>
    </Looping>
  ),
};

// ---------------------------------------------------------------------------
// RoboRadioGroup — slide in from left
// ---------------------------------------------------------------------------
export const RadioGroupEntrance: StoryObj = {
  name: 'RoboRadioGroup — slide-in from left',
  render: () => (
    <Looping>
      <RoboSlideIn from='left'>
        <RoboRadioGroup
          defaultValue='active'
          className='flex flex-col gap-2'
          options={[
            { value: 'active', label: 'Active missions' },
            { value: 'completed', label: 'Completed missions' },
            { value: 'all', label: 'All missions' },
          ]}
        />
      </RoboSlideIn>
    </Looping>
  ),
};

// ---------------------------------------------------------------------------
// RoboSwitch — RoboFadeIn with stagger
// ---------------------------------------------------------------------------
export const SwitchGroupEntrance: StoryObj = {
  name: 'RoboSwitch — stagger entrance',
  render: () => (
    <Looping>
      <RoboStagger className='flex flex-col gap-4 max-w-xs'>
        {[
          { id: 'ais', label: 'AIS Monitoring', defaultChecked: true },
          { id: 'alerts', label: 'Real-time Alerts', defaultChecked: true },
          { id: 'history', label: 'Historical Data', defaultChecked: false },
          { id: 'export', label: 'Auto-export Reports', defaultChecked: false },
        ].map(({ id, label, defaultChecked }) => (
          <div key={id} className='flex items-center justify-between'>
            <span className='text-sm text-[var(--foreground)]'>{label}</span>
            <RoboSwitch defaultChecked={defaultChecked} aria-label={label} />
          </div>
        ))}
      </RoboStagger>
    </Looping>
  ),
};
