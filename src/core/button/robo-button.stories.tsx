import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { RoboButton } from './robo-button';
import { RoboIconButton } from './robo-icon-button';


export const componentMeta = {
  description: 'Primary interactive trigger for actions and form submissions',
  category: 'action' as const,
  keywords: ['button', 'click', 'submit', 'action', 'trigger', 'cta', 'primary', 'secondary'],
  whenToUse: 'For page actions, form submissions, dialog confirmations, and destructive actions',
  whenNotToUse: 'For navigation use RoboLink or anchor tags; for icon-only actions use RoboIconButton',
  pairsWith: ['RoboDialog', 'RoboFormField', 'RoboTooltip', 'RoboDropdownMenu'],
  a11y: 'Requires visible label text; use aria-label for icon-only variants; disabled buttons remain focusable',
};
const meta: Meta<typeof RoboButton> = {
  title: 'Elements/Actions/RoboButton',
  excludeStories: ['componentMeta'],
    component: RoboButton,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'tertiary', 'ghost', 'destructive', 'outline'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    disabled: {
      control: 'boolean',
    },
  },
};
export default meta;

type Story = StoryObj<typeof RoboButton>;

export const AllVariants: Story = {
  name: 'All Variants',
  render: () => (
    <div className='flex gap-3 flex-wrap items-center'>
      <RoboButton variant='default'>Primary</RoboButton>
      <RoboButton variant='secondary'>Secondary</RoboButton>
      <RoboButton variant='tertiary'>Tertiary</RoboButton>
      <RoboButton variant='ghost'>Ghost</RoboButton>
      <RoboButton variant='destructive'>Destructive</RoboButton>
      <RoboButton variant='outline'>Outline</RoboButton>
    </div>
  ),
};

export const Default: Story = {
  args: { children: 'Button', variant: 'default', size: 'md' },
};

export const DarkMode: Story = {
  name: 'All Variants — Dark Mode',
  globals: { mode: 'dark' },
  render: () => (
    <div className='flex gap-3 flex-wrap items-center'>
      <RoboButton variant='default'>Primary</RoboButton>
      <RoboButton variant='secondary'>Secondary</RoboButton>
      <RoboButton variant='tertiary'>Tertiary</RoboButton>
      <RoboButton variant='ghost'>Ghost</RoboButton>
      <RoboButton variant='destructive'>Destructive</RoboButton>
      <RoboButton variant='outline'>Outline</RoboButton>
    </div>
  ),
};

export const LightMode: Story = {
  name: 'All Variants — Light Mode',
  globals: { mode: 'light' },
  render: () => (
    <div className='flex gap-3 flex-wrap items-center'>
      <RoboButton variant='default'>Primary</RoboButton>
      <RoboButton variant='secondary'>Secondary</RoboButton>
      <RoboButton variant='tertiary'>Tertiary</RoboButton>
      <RoboButton variant='ghost'>Ghost</RoboButton>
      <RoboButton variant='destructive'>Destructive</RoboButton>
      <RoboButton variant='outline'>Outline</RoboButton>
    </div>
  ),
};

export const AllSizes: Story = {
  name: 'All Sizes',
  render: () => (
    <div className='flex items-center gap-3'>
      <RoboButton size='sm'>Small</RoboButton>
      <RoboButton size='md'>Medium</RoboButton>
      <RoboButton size='lg'>Large</RoboButton>
    </div>
  ),
};

export const Disabled: Story = {
  args: { children: 'Disabled', disabled: true },
};

export const WithIcon: Story = {
  name: 'With Icon',
  render: () => (
    <div className='flex gap-3 flex-wrap items-center'>
      <RoboButton variant='default'>
        <svg
          width={16}
          height={16}
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth={2}
          aria-hidden='true'
        >
          <path d='M12 5v14M5 12h14' />
        </svg>
        Add Item
      </RoboButton>
      <RoboButton variant='outline'>
        <svg
          width={16}
          height={16}
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth={2}
          aria-hidden='true'
        >
          <circle cx={11} cy={11} r={8} />
          <path d='m21 21-4.35-4.35' />
        </svg>
        Search
      </RoboButton>
    </div>
  ),
};

export const AsChild: Story = {
  name: 'asChild (renders as anchor)',
  render: () => (
    <RoboButton asChild variant='default'>
      <a href='#'>Navigate</a>
    </RoboButton>
  ),
};

export const IconButtonSizes: Story = {
  name: 'RoboIconButton — All Sizes',
  render: () => (
    <div className='flex items-center gap-3'>
      <RoboIconButton aria-label='Small icon button' size='sm'>
        <svg
          width={14}
          height={14}
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth={2}
          aria-hidden='true'
        >
          <path d='M18 6 6 18M6 6l12 12' />
        </svg>
      </RoboIconButton>
      <RoboIconButton aria-label='Medium icon button' size='md'>
        <svg
          width={16}
          height={16}
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth={2}
          aria-hidden='true'
        >
          <path d='M18 6 6 18M6 6l12 12' />
        </svg>
      </RoboIconButton>
      <RoboIconButton aria-label='Large icon button' size='lg'>
        <svg
          width={20}
          height={20}
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth={2}
          aria-hidden='true'
        >
          <path d='M18 6 6 18M6 6l12 12' />
        </svg>
      </RoboIconButton>
    </div>
  ),
};
