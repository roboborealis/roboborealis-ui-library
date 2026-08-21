import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { RoboSwitch } from './robo-switch';
import { RoboCard, RoboCardHeader, RoboCardBody } from '../../core/card/robo-card';
import { RoboDivider } from '../../layout/divider/robo-divider';
import { OverviewStack, OverviewSection } from '../../lib/storybook/overview-layout';

// ---------------------------------------------------------------------------
// Style constants
// ---------------------------------------------------------------------------

const sizesRowStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
};

const settingRowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '12px 0',
};

const settingTextStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
};

const settingLabelStyle: React.CSSProperties = {
  margin: 0,
  fontSize: '0.875rem',
  fontWeight: 500,
  color: 'var(--foreground)',
};

const settingDescStyle: React.CSSProperties = {
  margin: 0,
  fontSize: '0.75rem',
  color: 'var(--muted-foreground)',
};

const cardTitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: '0.9375rem',
  fontWeight: 700,
  color: 'var(--foreground)',
};

const cardSubtitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: '0.8125rem',
  color: 'var(--muted-foreground)',
};

// ---------------------------------------------------------------------------
// Settings panel data
// ---------------------------------------------------------------------------

interface SettingItem {
  id: string;
  label: string;
  description: string;
  defaultChecked?: boolean;
  disabled?: boolean;
}

const settingsConfig: SettingItem[] = [
  {
    id: 'tracking',
    label: 'Live tracking',
    description: 'Update satellite positions in real time.',
    defaultChecked: true,
  },
  {
    id: 'alerts',
    label: 'Emergency alerts',
    description: 'Receive anomaly and signal-loss notifications.',
    defaultChecked: true,
  },
  {
    id: 'dark',
    label: 'Dark mode',
    description: 'Use the dark theme across the application.',
    defaultChecked: false,
  },
];

// ---------------------------------------------------------------------------
// Sub-components (module-level)
// ---------------------------------------------------------------------------

function SettingRow({ item, isLast }: { item: SettingItem; isLast: boolean }) {
  const [checked, setChecked] = React.useState(item.defaultChecked ?? false);

  return (
    <>
      <div style={settingRowStyle}>
        <div style={settingTextStyle}>
          <p style={settingLabelStyle}>{item.label}</p>
          <p style={settingDescStyle}>{item.description}</p>
        </div>
        <RoboSwitch
          checked={checked}
          onCheckedChange={setChecked}
          disabled={item.disabled}
          size='sm'
          aria-label={item.label}
        />
      </div>
      {!isLast && <RoboDivider decorative />}
    </>
  );
}

function SettingsPanelStory() {
  return (
    <RoboCard style={{ maxWidth: 420 }}>
      <RoboCardHeader>
        <div>
          <p style={cardTitleStyle}>User Preferences</p>
          <p style={cardSubtitleStyle}>Manage your notification and display settings</p>
        </div>
      </RoboCardHeader>
      <RoboCardBody>
        {settingsConfig.map((item, i) => (
          <SettingRow key={item.id} item={item} isLast={i === settingsConfig.length - 1} />
        ))}
      </RoboCardBody>
    </RoboCard>
  );
}

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta: Meta<typeof RoboSwitch> = {
  title: 'Components/Forms/RoboSwitch',
  component: RoboSwitch,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};
export default meta;

type Story = StoryObj<typeof RoboSwitch>;

// ---------------------------------------------------------------------------
// All Variants story
// ---------------------------------------------------------------------------

export const AllVariants: Story = {
  name: 'All Variants',
  render: () => (
    <OverviewStack>

      {/* Sizes */}
      <OverviewSection title='All 3 Sizes'>
        <div style={sizesRowStyle}>
          <RoboSwitch label='Small (sm)' size='sm' />
          <RoboSwitch label='Medium (md)' size='md' />
          <RoboSwitch label='Large (lg)' size='lg' />
        </div>
      </OverviewSection>

      {/* With description */}
      <OverviewSection title='With description'>
        <RoboSwitch
          label='Auto-refresh'
          description='Refresh satellite positions every 30 seconds.'
          size='md'
        />
      </OverviewSection>

      {/* Checked default */}
      <OverviewSection title='Checked (defaultChecked)'>
        <RoboSwitch
          label='Emergency alerts enabled'
          description='You will receive all anomaly and signal-loss notifications.'
          checked
          size='md'
        />
      </OverviewSection>

      {/* Disabled off */}
      <OverviewSection title='Disabled (off)'>
        <RoboSwitch
          label='Feature unavailable'
          description='This setting is controlled by your organisation.'
          disabled
          size='md'
        />
      </OverviewSection>

      {/* Disabled on */}
      <OverviewSection title='Disabled (on)'>
        <RoboSwitch
          label='Mandatory logging'
          description='Required by compliance policy — cannot be disabled.'
          disabled
          checked
          size='md'
        />
      </OverviewSection>

      {/* Settings panel */}
      <OverviewSection title='Settings panel'>
        <SettingsPanelStory />
      </OverviewSection>

    </OverviewStack>
  ),
};
