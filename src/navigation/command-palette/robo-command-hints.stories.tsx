import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { RoboCommandHints, DEFAULT_COMMAND_HINTS } from './robo-command-hints';

export const componentMeta = {
  description: 'Keyboard hint row (key + label pairs) shown in command palette footers',
  category: 'navigation' as const,
  keywords: ['hints', 'footer', 'kbd', 'keyboard', 'shortcuts', 'command palette'],
  whenToUse: 'Footer row of a command palette or similar keyboard-driven overlay to remind users of navigation keys',
  whenNotToUse: 'For a single inline shortcut hint use RoboKbd directly',
  pairsWith: ['RoboCommandPalette', 'RoboKbd'],
  a11y: 'Purely decorative — aria-hidden; do not rely on it to convey required information to screen reader users',
};

const meta: Meta<typeof RoboCommandHints> = {
  title: 'Components/Navigation/RoboCommandHints',
  component: RoboCommandHints,
  excludeStories: ['componentMeta'],
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;

type Story = StoryObj<typeof RoboCommandHints>;

export const Default: Story = {
  render: () => <RoboCommandHints />,
};

export const AllVariants: Story = {
  name: 'All Variants',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <RoboCommandHints />
      <RoboCommandHints
        hints={[...DEFAULT_COMMAND_HINTS, { keys: '⇥', label: 'next field' }]}
      />
    </div>
  ),
};
