import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { RoboErrorState, RoboErrorStateStatic } from './robo-error-state';

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------


export const componentMeta = {
  description: 'Branded animated loading and error indicator with a lost-satellite illustration',
  category: 'feedback' as const,
  keywords: ['loading', 'error', 'satellite', 'animation', 'wait', 'progress', 'brand'],
  whenToUse: 'For full-page or section-level loading states with branded personality',
  whenNotToUse: 'For inline spinners use RoboSpinnerLoading; for content placeholders use RoboSkeletonLoading',
  pairsWith: ['RoboPageShell', 'RoboCard', 'RoboSkeletonLoading'],
  a11y: 'Includes aria-label="Loading" and role="status" with aria-live="polite"',
};
const meta: Meta<typeof RoboErrorState> = {
  title: 'Components/Loading/RoboErrorState',
  excludeStories: ['componentMeta'],
    component: RoboErrorState,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['loading', 'error'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    frameInterval: {
      control: { type: 'number', min: 20, max: 200, step: 5 },
    },
    errorMessage: {
      control: 'text',
    },
    retryLabel: {
      control: 'text',
    },
  },
};
export default meta;

type Story = StoryObj<typeof RoboErrorState>;

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

export const AllStates: Story = {
  name: 'All States',
  render: () => (
    <div className='flex flex-col gap-10'>
      <section className='flex flex-col gap-3'>
        <p className='text-[11px] font-bold uppercase tracking-wider text-[var(--muted-foreground)] border-b border-[var(--border)] pb-1.5'>
          Loading — sm / md / lg
        </p>
        <div className='flex items-end gap-8'>
          <div className='flex flex-col items-center gap-2'>
            <RoboErrorState variant='loading' size='sm' />
            <span className='text-xs text-[var(--muted-foreground)]'>sm</span>
          </div>
          <div className='flex flex-col items-center gap-2'>
            <RoboErrorState variant='loading' size='md' />
            <span className='text-xs text-[var(--muted-foreground)]'>md</span>
          </div>
          <div className='flex flex-col items-center gap-2'>
            <RoboErrorState variant='loading' size='lg' />
            <span className='text-xs text-[var(--muted-foreground)]'>lg</span>
          </div>
        </div>
      </section>

      <section className='flex flex-col gap-3'>
        <p className='text-[11px] font-bold uppercase tracking-wider text-[var(--muted-foreground)] border-b border-[var(--border)] pb-1.5'>
          Error — with / without retry
        </p>
        <div className='flex flex-wrap items-start gap-12'>
          <div className='flex flex-col items-center gap-2'>
            <RoboErrorState variant='error' size='md' onRetry={() => undefined} />
            <span className='text-xs text-[var(--muted-foreground)]'>error · with retry</span>
          </div>
          <div className='flex flex-col items-center gap-2'>
            <RoboErrorState variant='error' size='md' />
            <span className='text-xs text-[var(--muted-foreground)]'>error · no retry</span>
          </div>
        </div>
      </section>
    </div>
  ),
};

export const AllSizes: Story = {
  name: 'All Sizes',
  render: () => (
    <div className='flex items-end gap-8'>
      <div className='flex flex-col items-center gap-2'>
        <RoboErrorState size='sm' />
        <span className='text-xs text-[var(--muted-foreground)]'>sm</span>
      </div>
      <div className='flex flex-col items-center gap-2'>
        <RoboErrorState size='md' />
        <span className='text-xs text-[var(--muted-foreground)]'>md</span>
      </div>
      <div className='flex flex-col items-center gap-2'>
        <RoboErrorState size='lg' />
        <span className='text-xs text-[var(--muted-foreground)]'>lg</span>
      </div>
    </div>
  ),
};

export const Loading: Story = {
  name: 'Loading (Default)',
  args: {
    variant: 'loading',
    size: 'md',
  },
};

export const Error: Story = {
  name: 'Error with Retry',
  args: {
    variant: 'error',
    size: 'md',
    onRetry: () => alert('Retry clicked!'),
  },
};

export const ErrorWithoutRetry: Story = {
  name: 'Error without Retry',
  args: {
    variant: 'error',
    size: 'md',
  },
};

export const SlowAnimation: Story = {
  name: 'Slow Animation (150ms)',
  args: {
    variant: 'loading',
    size: 'lg',
    frameInterval: 150,
  },
};

export const CustomErrorMessage: Story = {
  name: 'Custom Error Message',
  args: {
    variant: 'error',
    size: 'md',
    errorMessage: '...uh... We have a problem?',
    retryLabel: 'Reload',
    onRetry: () => alert('Reload clicked!'),
  },
};

// ---------------------------------------------------------------------------
// RoboErrorStateStatic stories
// ---------------------------------------------------------------------------

const staticMeta: Meta<typeof RoboErrorStateStatic> = {
  title: 'Components/Loading/RoboErrorStateStatic',
  excludeStories: ['componentMeta'],
    component: RoboErrorStateStatic,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
};

type StaticStory = StoryObj<typeof RoboErrorStateStatic>;

export const Static: StaticStory = {
  name: 'Static Satellite',
  render: () => <RoboErrorStateStatic size='lg' />,
};

export const StaticAllSizes: StaticStory = {
  name: 'Static — All Sizes',
  render: () => (
    <div className='flex items-end gap-8'>
      <div className='flex flex-col items-center gap-2'>
        <RoboErrorStateStatic size='sm' />
        <span className='text-xs text-[var(--muted-foreground)]'>sm</span>
      </div>
      <div className='flex flex-col items-center gap-2'>
        <RoboErrorStateStatic size='md' />
        <span className='text-xs text-[var(--muted-foreground)]'>md</span>
      </div>
      <div className='flex flex-col items-center gap-2'>
        <RoboErrorStateStatic size='lg' />
        <span className='text-xs text-[var(--muted-foreground)]'>lg</span>
      </div>
    </div>
  ),
};
