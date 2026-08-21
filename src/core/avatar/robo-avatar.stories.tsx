import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { RoboAvatar, RoboAvatarGroup } from './robo-avatar';


export const componentMeta = {
  description: 'User or entity identity indicator with image, initials, or icon fallback',
  category: 'display' as const,
  keywords: ['avatar', 'user', 'profile', 'image', 'initials', 'identity', 'photo'],
  whenToUse: 'For displaying user identity in headers, comments, cards, or participant lists',
  whenNotToUse: 'For brand logos use an img tag directly; for status indicators use RoboBadge',
  pairsWith: ['RoboTopbar', 'RoboCard', 'RoboTooltip', 'RoboDropdownMenu'],
  a11y: 'Always provide alt text via the alt prop; decorative avatars should use alt=""',
};
const meta: Meta<typeof RoboAvatar> = {
  title: 'Elements/Display/RoboAvatar',
  excludeStories: ['componentMeta'],
    component: RoboAvatar,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    size:   { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    status: { control: 'select', options: [undefined, 'online', 'away', 'busy', 'offline'] },
    src:    { control: 'text' },
    alt:    { control: 'text' },
    fallback: { control: 'text' },
  },
};
export default meta;

type Story = StoryObj<typeof RoboAvatar>;

// ---------------------------------------------------------------------------
// Shared sample users
// ---------------------------------------------------------------------------

const users = [
  { fallback: 'MT', alt: 'Matt Taylor' },
  { fallback: 'JD', alt: 'Jane Doe' },
  { fallback: 'RK', alt: 'Ravi Kumar' },
  { fallback: 'AL', alt: 'Ana Lima' },
  { fallback: 'OB', alt: 'Oliver Brown' },
  { fallback: 'SC', alt: 'Sofia Chen' },
];

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

export const Default: Story = {
  args: { fallback: 'MT', alt: 'Matt Taylor' },
};

export const Sizes: Story = {
  name: 'Sizes',
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <div key={size} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <RoboAvatar size={size} fallback='MT' alt='Matt Taylor' />
          <span style={{ fontSize: '0.7rem', color: 'var(--muted-foreground)' }}>{size}</span>
        </div>
      ))}
    </div>
  ),
};

export const StatusIndicators: Story = {
  name: 'Status Indicators',
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
      {([
        { status: 'online', label: 'Online' },
        { status: 'away', label: 'Away' },
        { status: 'busy', label: 'Busy' },
        { status: 'offline', label: 'Offline' },
      ] as const).map(({ status, label }) => (
        <div key={status} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <RoboAvatar size='md' fallback='MT' alt='Matt Taylor' status={status} />
          <span style={{ fontSize: '0.7rem', color: 'var(--muted-foreground)' }}>{label}</span>
        </div>
      ))}
    </div>
  ),
};

export const WithImage: Story = {
  name: 'With Image (fallback on error)',
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      {/* Valid placeholder image */}
      <RoboAvatar
        size='lg'
        src='https://i.pravatar.cc/150?img=1'
        fallback='MT'
        alt='Matt Taylor'
        status='online'
      />
      {/* Broken image → shows fallback initials */}
      <RoboAvatar
        size='lg'
        src='https://broken-url.invalid/image.jpg'
        fallback='JD'
        alt='Jane Doe (fallback)'
      />
    </div>
  ),
};

export const FallbackInitials: Story = {
  name: 'Fallback Initials',
  render: () => (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      {users.map((u) => (
        <RoboAvatar key={u.fallback} size='md' fallback={u.fallback} alt={u.alt} />
      ))}
    </div>
  ),
};

export const Group: Story = {
  name: 'Avatar Group',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginBottom: 8 }}>max=3 (shows +N overflow)</p>
        <RoboAvatarGroup max={3}>
          {users.map((u) => (
            <RoboAvatar key={u.fallback} size='md' fallback={u.fallback} alt={u.alt} />
          ))}
        </RoboAvatarGroup>
      </div>
      <div>
        <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginBottom: 8 }}>max=5</p>
        <RoboAvatarGroup max={5}>
          {users.map((u) => (
            <RoboAvatar key={u.fallback} size='md' fallback={u.fallback} alt={u.alt} />
          ))}
        </RoboAvatarGroup>
      </div>
      <div>
        <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginBottom: 8 }}>Large size</p>
        <RoboAvatarGroup max={4}>
          {users.map((u) => (
            <RoboAvatar key={u.fallback} size='lg' fallback={u.fallback} alt={u.alt} />
          ))}
        </RoboAvatarGroup>
      </div>
    </div>
  ),
};

/** Typical user row in a list or table. */
export const UserRow: Story = {
  name: 'In Context — User Row',
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        overflow: 'hidden',
        maxWidth: 380,
      }}
    >
      {[
        { fallback: 'MT', alt: 'Matt Taylor', role: 'Admin', status: 'online' as const },
        { fallback: 'JD', alt: 'Jane Doe', role: 'Operator', status: 'away' as const },
        { fallback: 'RK', alt: 'Ravi Kumar', role: 'Viewer', status: 'offline' as const },
      ].map(({ fallback, alt, role, status }, i, arr) => (
        <div
          key={fallback}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '10px 16px',
            borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : undefined,
          }}
        >
          <RoboAvatar size='sm' fallback={fallback} alt={alt} status={status} />
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 500, color: 'var(--foreground)' }}>{alt}</p>
            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>{role}</p>
          </div>
        </div>
      ))}
    </div>
  ),
};

export const Playground: Story = {
  args: {
    fallback: 'MT',
    alt: 'Matt Taylor',
    size: 'md',
    status: undefined,
  },
};
