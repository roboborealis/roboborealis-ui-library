import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { RoboAvatar, RoboAvatarGroup } from './robo-avatar';
import { OverviewStack, OverviewSection } from '../../lib/storybook/overview-layout';

// ---------------------------------------------------------------------------
// Layout constants
// ---------------------------------------------------------------------------

const rowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 16,
  flexWrap: 'wrap',
};

const itemStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 6,
};

const capLabelStyle: React.CSSProperties = {
  fontSize: '0.7rem',
  color: 'var(--muted-foreground)',
};

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta: Meta<typeof RoboAvatar> = {
  title: 'Elements/Display/RoboAvatar',
  component: RoboAvatar,
  parameters: { layout: 'padded' },
};
export default meta;

type Story = StoryObj<typeof RoboAvatar>;

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

export const AllVariants: Story = {
  name: 'All Variants',
  render: () => (
    <OverviewStack>

      <OverviewSection title='All sizes (xs → xl) with fallback initials'>
        <div style={rowStyle}>
          {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
            <div key={size} style={itemStyle}>
              <RoboAvatar size={size} fallback='MT' alt='Matt Taylor' />
              <span style={capLabelStyle}>{size}</span>
            </div>
          ))}
        </div>
      </OverviewSection>

      <OverviewSection title='All status indicators'>
        <div style={rowStyle}>
          {([
            { status: 'online',  label: 'Online'  },
            { status: 'away',    label: 'Away'    },
            { status: 'busy',    label: 'Busy'    },
            { status: 'offline', label: 'Offline' },
          ] as const).map(({ status, label }) => (
            <div key={status} style={itemStyle}>
              <RoboAvatar size='md' fallback='MT' alt='Matt Taylor' status={status} />
              <span style={capLabelStyle}>{label}</span>
            </div>
          ))}
        </div>
      </OverviewSection>

      <OverviewSection title='Fallback initials — multiple users'>
        <div style={rowStyle}>
          {(['MT', 'JD', 'RK', 'AL', 'OB', 'SC'] as const).map((f) => (
            <RoboAvatar key={f} size='md' fallback={f} alt={f} />
          ))}
        </div>
      </OverviewSection>

      <OverviewSection title='RoboAvatarGroup with max overflow'>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <p style={{ ...capLabelStyle, marginBottom: 8 }}>max=3 (shows +N overflow)</p>
            <RoboAvatarGroup max={3}>
              {(['MT', 'JD', 'RK', 'AL', 'OB', 'SC'] as const).map((f) => (
                <RoboAvatar key={f} size='md' fallback={f} alt={f} />
              ))}
            </RoboAvatarGroup>
          </div>
          <div>
            <p style={{ ...capLabelStyle, marginBottom: 8 }}>max=4</p>
            <RoboAvatarGroup max={4}>
              {(['MT', 'JD', 'RK', 'AL', 'OB', 'SC'] as const).map((f) => (
                <RoboAvatar key={f} size='md' fallback={f} alt={f} />
              ))}
            </RoboAvatarGroup>
          </div>
          <div>
            <p style={{ ...capLabelStyle, marginBottom: 8 }}>max=5, lg size</p>
            <RoboAvatarGroup max={5}>
              {(['MT', 'JD', 'RK', 'AL', 'OB', 'SC'] as const).map((f) => (
                <RoboAvatar key={f} size='lg' fallback={f} alt={f} />
              ))}
            </RoboAvatarGroup>
          </div>
        </div>
      </OverviewSection>

    </OverviewStack>
  ),
};
