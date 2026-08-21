import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { RoboTopLoadingBar } from './robo-top-loading-bar';
import { OverviewStack, OverviewSection } from '../../lib/storybook/overview-layout';

export const componentMeta = {
  description: 'Thin indeterminate loading bar pinned to the top of the viewport, for background/route-level loading signals',
  category: 'feedback' as const,
  keywords: ['loading', 'progress', 'top bar', 'nprogress', 'route change', 'indeterminate'],
  whenToUse: 'When one or more async operations (data fetches, route transitions) are in flight and you want a passive, non-blocking global loading cue',
  whenNotToUse: 'For a known completion percentage use RoboProgress; for a scoped/inline loading state use RoboSpinnerLoading or RoboSkeletonLoading',
  pairsWith: ['RoboFloatingPanel', 'RoboMapbox'],
  a11y: 'Uses role="progressbar" with aria-valuetext="Loading" (indeterminate — no aria-valuenow)',
};
const meta: Meta<typeof RoboTopLoadingBar> = {
  title: 'Components/Feedback/RoboTopLoadingBar',
  excludeStories: ['componentMeta'],
  component: RoboTopLoadingBar,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    active: { control: 'boolean' },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    height: { control: { type: 'number', min: 1, max: 12, step: 1 } },
  },
};
export default meta;

type Story = StoryObj<typeof RoboTopLoadingBar>;

export const Default: Story = {
  args: {
    active: true,
  },
};

export const AllVariants: Story = {
  name: 'All Variants',
  render: () => (
    <OverviewStack>
      <OverviewSection title='RoboTopLoadingBar'>
        <div className='flex flex-col gap-6'>
          {(['sm', 'md', 'lg'] as const).map((size) => (
            <div key={size} style={{ position: 'relative', height: 60, border: '1px dashed var(--border)' }}>
              <RoboTopLoadingBar active size={size} />
              <p className='p-3 text-sm text-[var(--muted-foreground)]'>size=&quot;{size}&quot;</p>
            </div>
          ))}
        </div>
      </OverviewSection>
    </OverviewStack>
  ),
};

export const Active: Story = {
  render: (args) => (
    <div style={{ position: 'relative', height: 120, border: '1px dashed var(--border)' }}>
      <RoboTopLoadingBar {...args} />
      <p className='p-4 text-sm text-[var(--muted-foreground)]'>Bar animates across the top of this container.</p>
    </div>
  ),
  args: {
    active: true,
    height: 3,
  },
};

export const Inactive: Story = {
  render: (args) => (
    <div style={{ position: 'relative', height: 120, border: '1px dashed var(--border)' }}>
      <RoboTopLoadingBar {...args} />
      <p className='p-4 text-sm text-[var(--muted-foreground)]'>Nothing renders when inactive.</p>
    </div>
  ),
  args: {
    active: false,
  },
};
