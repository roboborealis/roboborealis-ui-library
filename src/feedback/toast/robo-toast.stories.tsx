import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  RoboToastProvider,
  RoboToastViewport,
  RoboToast,
  RoboToastTitle,
  RoboToastDescription,
  RoboToastClose,
  RoboToastAction,
  useRoboToast,
} from './robo-toast';
import { RoboButton } from '@/core/button/robo-button';

import { OverviewStack, OverviewSection } from '../../lib/storybook/overview-layout';


export const componentMeta = {
  description: 'Transient notification that appears briefly then auto-dismisses',
  category: 'feedback' as const,
  keywords: ['toast', 'notification', 'snackbar', 'message', 'transient', 'dismiss', 'alert'],
  whenToUse: 'For transient success/error/info messages that auto-dismiss (save confirmation, action feedback)',
  whenNotToUse: 'For persistent messages use RoboAlert; for blocking confirmations use RoboDialog',
  pairsWith: ['RoboButton', 'RoboPageShell'],
  a11y: 'Uses aria-live="polite" for info and aria-live="assertive" for errors; auto-dismiss respects prefers-reduced-motion',
};
const meta: Meta = {
  title: 'Components/Feedback/RoboToast',
  excludeStories: ['componentMeta'],
    tags: ['autodocs'],
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <RoboToastProvider>
        <Story />
        <RoboToastViewport />
      </RoboToastProvider>
    ),
  ],
};
export default meta;

type Story = StoryObj;

function ToastTrigger({
  variant,
  label,
}: {
  variant?: 'default' | 'success' | 'warning' | 'error';
  label: string;
}) {
  const { toast } = useRoboToast();
  return (
    <RoboButton
      variant='default'
      onClick={() =>
        toast({
          title: `${label} Toast`,
          description: 'This is the toast description.',
          variant,
        })
      }
    >
      Show {label} Toast
    </RoboButton>
  );
}

export const AllVariants: Story = {
  name: 'All Variants',
  render: () => (
    <OverviewStack>
      <OverviewSection title='RoboToast'>
        <div className='flex gap-3 flex-wrap'>
          <ToastTrigger variant='default' label='Default' />
          <ToastTrigger variant='success' label='Success' />
          <ToastTrigger variant='warning' label='Warning' />
          <ToastTrigger variant='error' label='Error' />
        </div>
      </OverviewSection>
    </OverviewStack>
  ),
};

export const Default: Story = {
  render: () => <ToastTrigger variant='default' label='Default' />,
};

export const Success: Story = {
  render: () => <ToastTrigger variant='success' label='Success' />,
};

export const Warning: Story = {
  render: () => <ToastTrigger variant='warning' label='Warning' />,
};

export const Error: Story = {
  render: () => <ToastTrigger variant='error' label='Error' />,
};

export const WithAction: Story = {
  name: 'With Action',
  render: () => (
    <RoboToastProvider>
      <RoboToast open variant='default'>
        <div className='flex flex-col gap-0.5 flex-1'>
          <RoboToastTitle>File deleted</RoboToastTitle>
          <RoboToastDescription>The file has been removed.</RoboToastDescription>
        </div>
        <RoboToastAction altText='Undo delete'>Undo</RoboToastAction>
        <RoboToastClose />
      </RoboToast>
      <RoboToastViewport />
    </RoboToastProvider>
  ),
};
