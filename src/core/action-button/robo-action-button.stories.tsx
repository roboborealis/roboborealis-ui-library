import type { Meta, StoryObj } from '@storybook/react';
import { Download, Printer, Copy, Share2, Trash2 } from 'lucide-react';

import { RoboActionButton } from './robo-action-button';

export const componentMeta = {
  description: 'Composable button with built-in tooltip wrapper for icon+label action patterns',
  category: 'action' as const,
  keywords: ['action', 'button', 'tooltip', 'icon', 'utility', 'toolbar'],
  whenToUse: 'For toolbar actions and utility buttons that need a tooltip — especially when building icon-only variants',
  whenNotToUse: 'For primary page CTAs use RoboButton directly; for navigation use RoboLink',
  pairsWith: ['RoboCopyButton', 'RoboExportButton', 'RoboPrintButton', 'RoboDataTable'],
  a11y: 'Automatically applies aria-label in iconOnly mode from label or tooltipText prop',
};

const meta: Meta<typeof RoboActionButton> = {
  title: 'Elements/Actions/RoboActionButton',
  excludeStories: ['componentMeta'],
    component: RoboActionButton,
  tags: ['autodocs'],
  argTypes: {
    iconOnly: { control: 'boolean' },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    variant: { control: 'select', options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'] },
    disabled: { control: 'boolean' },
  },
};
export default meta;

type Story = StoryObj<typeof RoboActionButton>;

export const Default: Story = {
  args: {
    icon: <Download className='h-3.5 w-3.5' aria-hidden='true' />,
    label: 'Download',
    onClick: () => alert('Clicked!'),
  },
};

export const IconOnly: Story = {
  args: {
    icon: <Printer className='h-3.5 w-3.5' aria-hidden='true' />,
    label: 'Print',
    iconOnly: true,
    onClick: () => alert('Print!'),
  },
};

export const WithTooltipOverride: Story = {
  args: {
    icon: <Copy className='h-3.5 w-3.5' aria-hidden='true' />,
    label: 'Copy',
    tooltipText: 'Copy to clipboard',
    onClick: () => alert('Copied!'),
  },
};

export const Destructive: Story = {
  args: {
    icon: <Trash2 className='h-3.5 w-3.5' aria-hidden='true' />,
    label: 'Delete',
    variant: 'destructive',
    onClick: () => alert('Deleted!'),
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className='flex flex-wrap items-center gap-4'>
      <RoboActionButton
        icon={<Download className='h-3.5 w-3.5' aria-hidden='true' />}
        label='Export'
        onClick={() => {}}
      />
      <RoboActionButton
        icon={<Printer className='h-3.5 w-3.5' aria-hidden='true' />}
        label='Print'
        onClick={() => {}}
      />
      <RoboActionButton
        icon={<Copy className='h-3.5 w-3.5' aria-hidden='true' />}
        label='Copy'
        onClick={() => {}}
      />
      <RoboActionButton
        icon={<Share2 className='h-3.5 w-3.5' aria-hidden='true' />}
        label='Share'
        onClick={() => {}}
      />
      <RoboActionButton
        icon={<Download className='h-3.5 w-3.5' aria-hidden='true' />}
        label='Export'
        iconOnly
        onClick={() => {}}
      />
      <RoboActionButton
        icon={<Printer className='h-3.5 w-3.5' aria-hidden='true' />}
        label='Print'
        iconOnly
        onClick={() => {}}
      />
      <RoboActionButton
        icon={<Copy className='h-3.5 w-3.5' aria-hidden='true' />}
        label='Copy'
        iconOnly
        onClick={() => {}}
      />
    </div>
  ),
};
