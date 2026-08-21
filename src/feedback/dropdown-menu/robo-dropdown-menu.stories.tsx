import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { RoboAvatar } from '@/core/avatar/robo-avatar';

import {
  RoboDropdownMenu,
  RoboDropdownMenuTrigger,
  RoboDropdownMenuContent,
  RoboDropdownMenuItem,
  RoboDropdownMenuLabel,
  RoboDropdownMenuSeparator,
} from './robo-dropdown-menu';

export const componentMeta = {
  description: 'Floating menu of actions anchored to a trigger element',
  category: 'feedback' as const,
  keywords: ['dropdown', 'menu', 'context menu', 'user menu', 'actions', 'overlay'],
  whenToUse: 'For a list of actions triggered from a button or avatar — user menus, row actions, more-options menus',
  whenNotToUse: 'For arbitrary content (not a list of actions) use RoboPopover; for a full modal use RoboDialog',
  pairsWith: ['RoboAvatar', 'RoboTopbar', 'RoboButton'],
  a11y: 'Uses Radix DropdownMenu — manages focus, arrow-key navigation, and aria-expanded/role=menu',
};
const meta: Meta = {
  title: 'Components/Feedback/RoboDropdownMenu',
  excludeStories: ['componentMeta'],
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <RoboDropdownMenu>
      <RoboDropdownMenuTrigger asChild>
        <button className='px-4 py-2 rounded border border-[var(--border)] text-sm'>
          Open menu
        </button>
      </RoboDropdownMenuTrigger>
      <RoboDropdownMenuContent>
        <RoboDropdownMenuItem>Edit</RoboDropdownMenuItem>
        <RoboDropdownMenuItem>Duplicate</RoboDropdownMenuItem>
        <RoboDropdownMenuSeparator />
        <RoboDropdownMenuItem variant='destructive'>Delete</RoboDropdownMenuItem>
      </RoboDropdownMenuContent>
    </RoboDropdownMenu>
  ),
};

export const UserMenu: Story = {
  name: 'User Menu (avatar trigger)',
  render: () => (
    <RoboDropdownMenu>
      <RoboDropdownMenuTrigger asChild>
        <button aria-label='User menu'>
          <RoboAvatar fallback='AB' size='sm' />
        </button>
      </RoboDropdownMenuTrigger>
      <RoboDropdownMenuContent align='end'>
        <RoboDropdownMenuLabel>My Account</RoboDropdownMenuLabel>
        <RoboDropdownMenuSeparator />
        <RoboDropdownMenuItem>Settings</RoboDropdownMenuItem>
        <RoboDropdownMenuItem variant='destructive'>Sign out</RoboDropdownMenuItem>
      </RoboDropdownMenuContent>
    </RoboDropdownMenu>
  ),
};
