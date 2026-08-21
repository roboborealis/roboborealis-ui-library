import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { RoboSkeletonLoading } from './robo-skeleton';


export const componentMeta = {
  description: 'Content placeholder animation mimicking the shape of expected content',
  category: 'feedback' as const,
  keywords: ['skeleton', 'placeholder', 'loading', 'shimmer', 'pulse', 'content', 'ghost'],
  whenToUse: 'For content loading placeholders that match the layout of the expected content',
  whenNotToUse: 'For page-level loading use RoboErrorState; for inline operations use RoboSpinnerLoading',
  pairsWith: ['RoboCard', 'RoboDataTable', 'RoboAvatar', 'RoboBadge'],
  a11y: 'Use aria-busy="true" on the parent container; aria-label="Loading content" on skeleton region',
};
const meta: Meta<typeof RoboSkeletonLoading> = {
  title: 'Components/Loading/RoboSkeletonLoading',
  excludeStories: ['componentMeta'],
    component: RoboSkeletonLoading,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['text', 'circle', 'rect'],
    },
  },
};
export default meta;

type Story = StoryObj<typeof RoboSkeletonLoading>;

export const Text: Story = {
  args: { variant: 'text' },
  decorators: [(Story) => <div style={{ width: 300 }}><Story /></div>],
};

export const Circle: Story = {
  args: { variant: 'circle', width: 48, height: 48 },
};

export const Rect: Story = {
  args: { variant: 'rect', width: 300, height: 120 },
};

export const CardSkeleton: Story = {
  name: 'Card Loading State',
  render: () => (
    <div className='flex flex-col gap-3 p-4 rounded border border-[var(--border)] w-72'>
      <div className='flex items-center gap-3'>
        <RoboSkeletonLoading variant='circle' width={40} height={40} />
        <div className='flex-1 flex flex-col gap-2'>
          <RoboSkeletonLoading variant='text' width='60%' />
          <RoboSkeletonLoading variant='text' width='40%' />
        </div>
      </div>
      <RoboSkeletonLoading variant='rect' height={120} />
      <RoboSkeletonLoading variant='text' />
      <RoboSkeletonLoading variant='text' width='80%' />
    </div>
  ),
};
