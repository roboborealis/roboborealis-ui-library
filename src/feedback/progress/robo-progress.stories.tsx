import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { RoboProgress } from './robo-progress';


export const componentMeta = {
  description: 'Determinate progress bar showing completion percentage of a task',
  category: 'feedback' as const,
  keywords: ['progress', 'bar', 'loading', 'percentage', 'completion', 'status', 'determinate'],
  whenToUse: 'For showing file upload progress, multi-step wizard completion, or long-running tasks',
  whenNotToUse: 'For indeterminate loading use RoboSpinnerLoading; for content placeholders use RoboSkeletonLoading',
  pairsWith: ['RoboCard', 'RoboAlert', 'RoboDialog'],
  a11y: 'Uses role="progressbar" with aria-valuenow, aria-valuemin, aria-valuemax',
};
const meta: Meta<typeof RoboProgress> = {
  title: 'Components/Feedback/RoboProgress',
  excludeStories: ['componentMeta'],
    component: RoboProgress,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    max: { control: 'number' },
    indeterminate: { control: 'boolean' },
    showLabel: { control: 'boolean' },
    label: { control: 'text' },
  },
};
export default meta;

type Story = StoryObj<typeof RoboProgress>;

export const AllStates: Story = {
  name: 'All States',
  render: () => (
    <div className='flex flex-col gap-4' style={{ width: 300 }}>
      <RoboProgress value={0} label='Empty' showLabel />
      <RoboProgress value={25} label='Quarter' showLabel />
      <RoboProgress value={50} label='Half' showLabel />
      <RoboProgress value={75} label='Three quarters' showLabel />
      <RoboProgress value={100} label='Complete' showLabel />
      <RoboProgress indeterminate label='Indeterminate' />
    </div>
  ),
};

export const Default: Story = {
  args: { value: 60 },
  decorators: [(Story) => <div style={{ width: 300 }}><Story /></div>],
};

export const WithLabel: Story = {
  args: { value: 75, label: 'Upload progress', showLabel: true },
  decorators: [(Story) => <div style={{ width: 300 }}><Story /></div>],
};

export const Indeterminate: Story = {
  args: { indeterminate: true, label: 'Processing' },
  decorators: [(Story) => <div style={{ width: 300 }}><Story /></div>],
};
