import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { RoboSpinnerLoading } from './robo-spinner';


export const componentMeta = {
  description: 'Inline spinning indicator for in-progress operations',
  category: 'feedback' as const,
  keywords: ['spinner', 'loading', 'inline', 'processing', 'wait', 'circular', 'indicator'],
  whenToUse: 'For inline loading states — button submissions, field validation, small async operations',
  whenNotToUse: 'For full-page loading use RoboErrorState; for content placeholders use RoboSkeletonLoading',
  pairsWith: ['RoboButton', 'RoboInput', 'RoboCard'],
  a11y: 'Requires aria-label="Loading" or sr-only text; use role="status" with aria-live="polite"',
};
const meta: Meta<typeof RoboSpinnerLoading> = {
  title: 'Components/Loading/RoboSpinnerLoading',
  excludeStories: ['componentMeta'],
    component: RoboSpinnerLoading,
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

type Story = StoryObj<typeof RoboSpinnerLoading>;

export const AllSizes: Story = {
  name: 'All Sizes',
  render: () => (
    <div className='flex items-center gap-6'>
      <RoboSpinnerLoading size='sm' label='Small spinner' />
      <RoboSpinnerLoading size='md' label='Medium spinner' />
      <RoboSpinnerLoading size='lg' label='Large spinner' />
    </div>
  ),
};

export const Default: Story = {
  args: { size: 'md' },
};

export const WithCustomLabel: Story = {
  name: 'With Custom Label',
  args: { size: 'md', label: 'Fetching satellite data' },
};
