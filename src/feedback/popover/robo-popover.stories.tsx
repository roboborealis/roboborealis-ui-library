import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  RoboPopover,
  RoboPopoverTrigger,
  RoboPopoverContent,
  RoboPopoverClose,
} from './robo-popover';


export const componentMeta = {
  description: 'Floating content panel anchored to a trigger element',
  category: 'feedback' as const,
  keywords: ['popover', 'popup', 'floating', 'dropdown', 'panel', 'anchor', 'overlay'],
  whenToUse: 'For contextual content panels — filter dropdowns, info panels, or mini-forms',
  whenNotToUse: 'For simple text hints use RoboTooltip; for full modals use RoboDialog; for menus use RoboDropdownMenu',
  pairsWith: ['RoboButton', 'RoboInput', 'RoboCard'],
  a11y: 'Uses Radix Popover — manages focus trap, escape-to-close, and aria-expanded',
};
const meta: Meta = {
  title: 'Components/Overlays/RoboPopover',
  excludeStories: ['componentMeta'],
    tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <RoboPopover>
      <RoboPopoverTrigger asChild>
        <button className='px-4 py-2 rounded border border-[var(--border)] text-sm'>
          Open popover
        </button>
      </RoboPopoverTrigger>
      <RoboPopoverContent>
        <p className='text-sm text-[var(--foreground)]'>
          This is popover content. It can contain any React elements.
        </p>
      </RoboPopoverContent>
    </RoboPopover>
  ),
};

export const WithActions: Story = {
  name: 'With Actions',
  render: () => (
    <RoboPopover>
      <RoboPopoverTrigger asChild>
        <button className='px-4 py-2 rounded bg-[var(--primary)] text-[var(--primary-foreground)] text-sm'>
          More options
        </button>
      </RoboPopoverTrigger>
      <RoboPopoverContent>
        <div className='flex flex-col gap-2'>
          <p className='text-sm font-semibold text-[var(--foreground)] mb-1'>Actions</p>
          <button className='text-left text-sm px-2 py-1.5 rounded hover:bg-[var(--accent)]'>
            Edit
          </button>
          <button className='text-left text-sm px-2 py-1.5 rounded hover:bg-[var(--accent)]'>
            Duplicate
          </button>
          <button className='text-left text-sm px-2 py-1.5 rounded text-[var(--destructive)] hover:bg-[var(--destructive)]/10'>
            Delete
          </button>
          <RoboPopoverClose asChild>
            <button className='mt-1 text-xs text-[var(--muted-foreground,#6b7280)] hover:text-[var(--foreground)]'>
              Close
            </button>
          </RoboPopoverClose>
        </div>
      </RoboPopoverContent>
    </RoboPopover>
  ),
};
