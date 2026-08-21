import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Settings, X, Filter } from 'lucide-react';

import { RoboIconButton } from './button/robo-icon-button';

// ---------------------------------------------------------------------------
// Layout constants
// ---------------------------------------------------------------------------

const rowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  flexWrap: 'wrap',
};

const itemStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 6,
};

const capLabelStyle: React.CSSProperties = {
  fontSize: '0.7rem',
  color: 'var(--muted-foreground)',
};

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta: Meta<typeof RoboIconButton> = {
  title: 'Elements/Actions/RoboIconButton',
  component: RoboIconButton,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
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

type Story = StoryObj<typeof RoboIconButton>;

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

export const AllVariants: Story = {
  name: 'All Variants',
  render: () => (
    <div style={rowStyle}>
      <div style={itemStyle}>
        <RoboIconButton aria-label='Default variant' variant='default'>
          <Settings style={{ width: 16, height: 16 }} aria-hidden='true' />
        </RoboIconButton>
        <span style={capLabelStyle}>default</span>
      </div>
      <div style={itemStyle}>
        <RoboIconButton aria-label='Secondary variant' variant='secondary'>
          <Settings style={{ width: 16, height: 16 }} aria-hidden='true' />
        </RoboIconButton>
        <span style={capLabelStyle}>secondary</span>
      </div>
      <div style={itemStyle}>
        <RoboIconButton aria-label='Tertiary variant' variant='tertiary'>
          <Settings style={{ width: 16, height: 16 }} aria-hidden='true' />
        </RoboIconButton>
        <span style={capLabelStyle}>tertiary</span>
      </div>
      <div style={itemStyle}>
        <RoboIconButton aria-label='Ghost variant' variant='ghost'>
          <Filter style={{ width: 16, height: 16 }} aria-hidden='true' />
        </RoboIconButton>
        <span style={capLabelStyle}>ghost</span>
      </div>
      <div style={itemStyle}>
        <RoboIconButton aria-label='Destructive variant' variant='destructive'>
          <X style={{ width: 16, height: 16 }} aria-hidden='true' />
        </RoboIconButton>
        <span style={capLabelStyle}>destructive</span>
      </div>
      <div style={itemStyle}>
        <RoboIconButton aria-label='Outline variant' variant='outline'>
          <Filter style={{ width: 16, height: 16 }} aria-hidden='true' />
        </RoboIconButton>
        <span style={capLabelStyle}>outline</span>
      </div>
    </div>
  ),
};

export const Default: Story = {
  args: {
    'aria-label': 'Open settings',
    variant: 'default',
    size: 'md',
  },
  render: (args) => (
    <RoboIconButton {...args}>
      <Settings style={{ width: 16, height: 16 }} aria-hidden='true' />
    </RoboIconButton>
  ),
};

export const AllSizes: Story = {
  name: 'All Sizes',
  render: () => (
    <div style={rowStyle}>
      <div style={itemStyle}>
        <RoboIconButton aria-label='Settings small' size='sm' variant='default'>
          <Settings style={{ width: 14, height: 14 }} aria-hidden='true' />
        </RoboIconButton>
        <span style={capLabelStyle}>sm</span>
      </div>
      <div style={itemStyle}>
        <RoboIconButton aria-label='Settings medium' size='md' variant='default'>
          <Settings style={{ width: 16, height: 16 }} aria-hidden='true' />
        </RoboIconButton>
        <span style={capLabelStyle}>md</span>
      </div>
      <div style={itemStyle}>
        <RoboIconButton aria-label='Settings large' size='lg' variant='default'>
          <Settings style={{ width: 20, height: 20 }} aria-hidden='true' />
        </RoboIconButton>
        <span style={capLabelStyle}>lg</span>
      </div>
    </div>
  ),
};
