import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { RoboSwitch } from './robo-switch';


export const componentMeta = {
  description: 'Toggle control for binary on/off settings with immediate effect',
  category: 'input' as const,
  keywords: ['switch', 'toggle', 'on', 'off', 'setting', 'enable', 'disable', 'boolean'],
  whenToUse: 'For settings that take immediate effect (dark mode, notifications, feature toggles)',
  whenNotToUse: 'For form submission choices use RoboCheckbox; for multi-option use RoboRadioGroup',
  pairsWith: ['RoboFormField', 'RoboLabel', 'RoboCard'],
  a11y: 'Uses role="switch" with aria-checked; label must describe the on-state',
};
const meta: Meta<typeof RoboSwitch> = {
  title: 'Components/Forms/RoboSwitch',
  excludeStories: ['componentMeta'],
    component: RoboSwitch,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    size:        { control: 'radio', options: ['sm', 'md', 'lg'] },
    checked:     { control: 'boolean' },
    disabled:    { control: 'boolean' },
    label:       { control: 'text' },
    description: { control: 'text' },
  },
};
export default meta;

type Story = StoryObj<typeof RoboSwitch>;

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

export const Default: Story = {
  args: { label: 'Enable dark mode' },
};

export const WithDescription: Story = {
  name: 'With Description',
  args: {
    label: 'Auto-refresh',
    description: 'Refresh satellite positions every 30 seconds.',
  },
};

export const Checked: Story = {
  args: { label: 'Notifications enabled', checked: true },
};

export const Disabled: Story = {
  args: { label: 'Feature unavailable', disabled: true },
};

export const DisabledOn: Story = {
  name: 'Disabled (on)',
  args: { label: 'Locked setting', disabled: true, checked: true },
};

/** All three sizes side by side. */
export const Sizes: Story = {
  name: 'Sizes',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <RoboSwitch label='Small (sm)' size='sm' />
      <RoboSwitch label='Medium (md)' size='md' />
      <RoboSwitch label='Large (lg)' size='lg' />
    </div>
  ),
};

/** Demonstrates controlled on/off toggle. */
export const Controlled: Story = {
  name: 'Controlled Toggle',
  render: () => {
    const [on, setOn] = React.useState(false);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <RoboSwitch
          label='Satellite tracking active'
          description={on ? 'Positions updating in real time.' : 'Position updates paused.'}
          checked={on}
          onCheckedChange={setOn}
        />
        <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', margin: 0 }}>
          State: <strong>{on ? 'ON' : 'OFF'}</strong>
        </p>
      </div>
    );
  },
};

/** Settings panel context. */
export const SettingsPanel: Story = {
  name: 'In Context — Settings Panel',
  render: () => (
    <div
      style={{
        width: 380,
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
      }}
    >
      {[
        { label: 'Dark mode', description: 'Switch to dark theme' },
        { label: 'Notifications', description: 'Push alerts for critical events', checked: true },
        { label: 'Auto-refresh', description: 'Update every 30 seconds' },
        { label: 'Sound alerts', description: 'Play a chime on new alerts', disabled: true },
      ].map(({ label, description, checked, disabled }, i, arr) => (
        <div
          key={label}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 0',
            borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : undefined,
          }}
        >
          <div>
            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--foreground)', fontWeight: 500 }}>{label}</p>
            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>{description}</p>
          </div>
          <RoboSwitch checked={checked} disabled={disabled} size='sm' aria-label={label} />
        </div>
      ))}
    </div>
  ),
};

export const Playground: Story = {
  args: {
    label: 'Switch label',
    description: '',
    size: 'md',
    checked: false,
    disabled: false,
  },
};
