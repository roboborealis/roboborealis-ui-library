import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { RoboKbd } from './robo-kbd';

export const componentMeta = {
  description: 'Keyboard key / shortcut indicator on a semantic kbd element',
  category: 'display' as const,
  keywords: ['kbd', 'keyboard', 'shortcut', 'hotkey', 'key', 'command', 'hint'],
  whenToUse: 'Showing keyboard shortcuts in menus, tooltips, command palettes, settings, and documentation',
  whenNotToUse: 'Clickable buttons (use RoboButton) or status labels (use RoboBadge)',
  pairsWith: ['RoboCommandPalette', 'RoboTooltip', 'RoboDropdown'],
  a11y: 'Semantic kbd element; pass aria-label when the glyph alone is ambiguous (e.g. aria-label=Shortcut: Cmd+K)',
};

const meta: Meta<typeof RoboKbd> = {
  title: 'Elements/Display/RoboKbd',
  component: RoboKbd,
  excludeStories: ['componentMeta'],
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Keyboard shortcut chip extracted from the command palette so shortcut hints render identically everywhere.',
      },
    },
  },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md'] },
  },
};

export default meta;
type Story = StoryObj<typeof RoboKbd>;

export const Default: Story = {
  args: { children: '⌘K' },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
        <RoboKbd>⌘K</RoboKbd>
        <RoboKbd>↵</RoboKbd>
        <RoboKbd>esc</RoboKbd>
      </span>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
        <RoboKbd size="md">Ctrl</RoboKbd>
        <span>+</span>
        <RoboKbd size="md">Shift</RoboKbd>
        <span>+</span>
        <RoboKbd size="md">P</RoboKbd>
      </span>
    </div>
  ),
};
