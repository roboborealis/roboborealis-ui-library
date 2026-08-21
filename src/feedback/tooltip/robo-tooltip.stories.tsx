import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  RoboTooltipProvider,
  RoboTooltip,
  RoboTooltipTrigger,
  RoboTooltipContent,
} from './robo-tooltip';


export const componentMeta = {
  description: 'Hover/focus-triggered text hint for additional context on UI elements',
  category: 'feedback' as const,
  keywords: ['tooltip', 'hint', 'hover', 'info', 'help', 'context', 'description', 'title'],
  whenToUse: 'For supplementary text on icon buttons, truncated text, or abbreviated labels',
  whenNotToUse: 'For interactive content use RoboPopover; for important info that must be visible use inline text',
  pairsWith: ['RoboIconButton', 'RoboActionButton', 'RoboBadge', 'RoboAvatar'],
  a11y: 'Content is announced via aria-describedby; never put essential information only in tooltips',
};
const meta: Meta = {
  title: 'Components/Overlays/RoboTooltip',
  excludeStories: ['componentMeta'],
    tags: ['autodocs'],
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <RoboTooltipProvider>
        <Story />
      </RoboTooltipProvider>
    ),
  ],
};
export default meta;

type Story = StoryObj;

export const Positions: Story = {
  name: 'All Positions',
  render: () => (
    <div className='flex gap-6 items-center'>
      {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
        <RoboTooltip key={side}>
          <RoboTooltipTrigger asChild>
            <button className='px-3 py-1.5 rounded border border-[var(--border)] text-sm capitalize'>
              {side}
            </button>
          </RoboTooltipTrigger>
          <RoboTooltipContent side={side}>Tooltip on {side}</RoboTooltipContent>
        </RoboTooltip>
      ))}
    </div>
  ),
};

export const Default: Story = {
  render: () => (
    <RoboTooltip>
      <RoboTooltipTrigger asChild>
        <button className='px-4 py-2 rounded border border-[var(--border)] text-sm'>
          Hover me
        </button>
      </RoboTooltipTrigger>
      <RoboTooltipContent>This is a tooltip</RoboTooltipContent>
    </RoboTooltip>
  ),
};

export const OnIcon: Story = {
  name: 'On Icon Button',
  render: () => (
    <RoboTooltip>
      <RoboTooltipTrigger asChild>
        <button
          aria-label='More information'
          className='h-8 w-8 rounded-full border border-[var(--border)] flex items-center justify-center text-sm font-bold'
        >
          ?
        </button>
      </RoboTooltipTrigger>
      <RoboTooltipContent side='right'>
        Click for more information about this field
      </RoboTooltipContent>
    </RoboTooltip>
  ),
};
