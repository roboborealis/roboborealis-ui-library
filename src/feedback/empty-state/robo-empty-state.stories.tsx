import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { RoboEmptyState } from './robo-empty-state';


export const componentMeta = {
  description: 'Branded empty state illustration with a starfield-and-telescope theme',
  category: 'feedback' as const,
  keywords: ['empty', 'state', 'telescope', 'starfield', 'illustration', 'no-data', 'placeholder', 'brand'],
  whenToUse: 'For empty states when no data exists yet — first-run experiences or filtered-to-empty views',
  whenNotToUse: 'For loading states use RoboSkeletonLoading; for errors use RoboAlert',
  pairsWith: ['RoboButton', 'RoboCard', 'RoboPageShell'],
  a11y: 'Include descriptive alt text; pair with actionable guidance text for screen reader users',
};
const meta: Meta<typeof RoboEmptyState> = {
  title: 'Components/Feedback/RoboEmptyState',
  excludeStories: ['componentMeta'],
    component: RoboEmptyState,
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

type Story = StoryObj<typeof RoboEmptyState>;

export const AllSizes: Story = {
  name: 'All Sizes',
  render: () => (
    <div className='flex items-end gap-8'>
      <div className='flex flex-col items-center gap-2'>
        <RoboEmptyState size='sm' />
        <span className='text-xs text-[var(--muted-foreground)]'>sm</span>
      </div>
      <div className='flex flex-col items-center gap-2'>
        <RoboEmptyState size='md' />
        <span className='text-xs text-[var(--muted-foreground)]'>md</span>
      </div>
      <div className='flex flex-col items-center gap-2'>
        <RoboEmptyState size='lg' />
        <span className='text-xs text-[var(--muted-foreground)]'>lg</span>
      </div>
    </div>
  ),
};

export const Default: Story = {
  args: { size: 'md' },
};

export const WithCustomLabel: Story = {
  name: 'With Custom Label',
  args: { size: 'md', label: 'No missions found' },
};
