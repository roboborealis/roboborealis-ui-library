import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { RoboBadge } from './robo-badge';


export const componentMeta = {
  description: 'Small status label for categorization, counts, or metadata annotation',
  category: 'display' as const,
  keywords: ['badge', 'tag', 'label', 'status', 'count', 'notification', 'indicator'],
  whenToUse: 'For status indicators, category labels, notification counts, or metadata tags',
  whenNotToUse: 'For interactive filter chips use RoboChip; for action buttons use RoboButton',
  pairsWith: ['RoboCard', 'RoboDataTable', 'RoboTopbar', 'RoboAvatar'],
  a11y: 'Non-interactive by default; add role="status" for live-updating counts',
};
const meta: Meta<typeof RoboBadge> = {
  title: 'Elements/Display/RoboBadge',
  excludeStories: ['componentMeta'],
    component: RoboBadge,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    usage: {
      control: 'select',
      options: ['label', 'status', 'count'],
    },
    color: {
      control: 'select',
      options: ['default', 'primary', 'success', 'warning', 'destructive'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    count: {
      control: 'number',
    },
  },
};
export default meta;

type Story = StoryObj<typeof RoboBadge>;

export const Default: Story = {
  args: { children: 'New', usage: 'label', color: 'default' },
};

export const AllUsageVariants: Story = {
  name: 'All Usage × Color variants',
  render: () => {
    const usages = ['label', 'status', 'count'] as const;
    const colors = ['default', 'primary', 'success', 'warning', 'destructive'] as const;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {usages.map((usage) => (
          <div key={usage} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 64, fontSize: 12, opacity: 0.6 }}>{usage}</span>
            {colors.map((color) => (
              <RoboBadge
                key={color}
                usage={usage}
                color={color}
                count={usage === 'count' ? 7 : undefined}
              >
                {usage === 'count' ? 'Notifs' : color}
              </RoboBadge>
            ))}
          </div>
        ))}
      </div>
    );
  },
};

export const CountOverflow: Story = {
  name: 'Count — overflow 99+',
  render: () => (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <RoboBadge usage='count' count={5} color='primary'>Alerts</RoboBadge>
      <RoboBadge usage='count' count={99} color='primary'>Alerts</RoboBadge>
      <RoboBadge usage='count' count={100} color='primary'>Alerts</RoboBadge>
      <RoboBadge usage='count' count={999} color='destructive'>Errors</RoboBadge>
    </div>
  ),
};

export const AllSizes: Story = {
  name: 'All Sizes',
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <RoboBadge size='sm' color='primary'>Small</RoboBadge>
      <RoboBadge size='md' color='primary'>Medium</RoboBadge>
      <RoboBadge size='lg' color='primary'>Large</RoboBadge>
    </div>
  ),
};
