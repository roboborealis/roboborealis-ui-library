import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { RoboLoading } from './robo-loading';

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------


export const componentMeta = {
  description: 'Branded animated loader with an orbiting-satellite motif',
  category: 'feedback' as const,
  keywords: ['loading', 'satellite', 'orbit', 'animation', 'space', 'brand', 'splash'],
  whenToUse: 'For full-page loading states with space branding',
  whenNotToUse: 'For inline spinners use RoboSpinnerLoading; for fast-loading states use RoboSkeletonLoading',
  pairsWith: ['RoboPageShell', 'RoboCard'],
  a11y: 'Includes aria-label="Loading" and role="status" with aria-live="polite"',
};
const meta: Meta<typeof RoboLoading> = {
  title: 'Components/Loading/RoboLoading',
  excludeStories: ['componentMeta'],
    component: RoboLoading,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    label: {
      control: 'text',
    },
  },
};
export default meta;

type Story = StoryObj<typeof RoboLoading>;

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

export const AllSizes: Story = {
  name: 'All Sizes',
  render: () => (
    <div className='flex items-end gap-8'>
      <div className='flex flex-col items-center gap-2'>
        <RoboLoading size='sm' />
        <span className='text-xs text-[var(--muted-foreground)]'>sm</span>
      </div>
      <div className='flex flex-col items-center gap-2'>
        <RoboLoading size='md' />
        <span className='text-xs text-[var(--muted-foreground)]'>md</span>
      </div>
      <div className='flex flex-col items-center gap-2'>
        <RoboLoading size='lg' />
        <span className='text-xs text-[var(--muted-foreground)]'>lg</span>
      </div>
    </div>
  ),
};

export const Default: Story = {
  name: 'Default',
  args: {
    size: 'md',
  },
};

export const CustomLabel: Story = {
  name: 'Custom Label',
  args: {
    size: 'lg',
    label: 'Fetching telemetry',
  },
};
