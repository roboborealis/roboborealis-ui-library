import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { RoboAlert } from './robo-alert';
import { OverviewStack, OverviewSection } from '../../lib/storybook/overview-layout';


export const componentMeta = {
  description: 'Static banner for important messages, warnings, or status notifications',
  category: 'feedback' as const,
  keywords: ['alert', 'banner', 'message', 'warning', 'error', 'info', 'success', 'notification'],
  whenToUse: 'For persistent page-level messages — form errors, system status, deprecation warnings',
  whenNotToUse: 'For transient notifications use RoboToast; for inline field errors use RoboFormField',
  pairsWith: ['RoboPageShell', 'RoboCard', 'RoboButton'],
  a11y: 'Uses role="alert" for urgent messages or role="status" for informational; includes aria-live region',
};
const meta: Meta<typeof RoboAlert> = {
  title: 'Components/Feedback/RoboAlert',
  excludeStories: ['componentMeta'],
    component: RoboAlert,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['info', 'success', 'warning', 'error', 'emergency'],
    },
    dismissible: { control: 'boolean' },
    title: { control: 'text' },
  },
};
export default meta;

type Story = StoryObj<typeof RoboAlert>;

export const AllVariants: Story = {
  name: 'All Variants',
  render: () => (
    <OverviewStack>
      <OverviewSection title='RoboAlert'>
        <div className='flex flex-col gap-3' style={{ width: 400 }}>
          <RoboAlert variant='info'>Information message.</RoboAlert>
          <RoboAlert variant='success' title='Success'>Operation completed.</RoboAlert>
          <RoboAlert variant='warning' title='Warning'>Please review before continuing.</RoboAlert>
          <RoboAlert variant='error' title='Error'>Something went wrong.</RoboAlert>
          <RoboAlert variant='emergency' title='ANOMALY — Satellite Signal Loss'>Immediate assistance required.</RoboAlert>
        </div>
      </OverviewSection>
    </OverviewStack>
  ),
};

export const Info: Story = {
  args: { variant: 'info', children: 'This is an informational message.' },
  decorators: [(Story) => <div style={{ width: 400 }}><Story /></div>],
};

export const Success: Story = {
  args: {
    variant: 'success',
    title: 'Operation succeeded',
  excludeStories: ['componentMeta'],
      children: 'Your changes have been saved successfully.',
  },
  decorators: [(Story) => <div style={{ width: 400 }}><Story /></div>],
};

export const Warning: Story = {
  args: {
    variant: 'warning',
    title: 'Proceed with caution',
  excludeStories: ['componentMeta'],
      children: 'This action cannot be undone.',
  },
  decorators: [(Story) => <div style={{ width: 400 }}><Story /></div>],
};

export const Error: Story = {
  args: {
    variant: 'error',
    title: 'Something went wrong',
  excludeStories: ['componentMeta'],
      children: 'Failed to save changes. Please try again.',
  },
  decorators: [(Story) => <div style={{ width: 400 }}><Story /></div>],
};

export const Emergency: Story = {
  args: {
    variant: 'emergency',
    title: 'ANOMALY — Satellite Signal Loss',
  excludeStories: ['componentMeta'],
      children: 'Voyager 1 has broadcast an anomaly signal. Immediate assistance required.',
  },
  decorators: [(Story) => <div style={{ width: 400 }}><Story /></div>],
};

export const Dismissible: Story = {
  args: {
    variant: 'info',
    dismissible: true,
    title: 'Dismissible alert',
  excludeStories: ['componentMeta'],
      children: 'Click the X button to dismiss this alert.',
  },
  decorators: [(Story) => <div style={{ width: 400 }}><Story /></div>],
};
