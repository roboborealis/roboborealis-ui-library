import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { RoboSeparator } from './robo-separator';
import { RoboCard, RoboCardHeader, RoboCardBody, RoboCardFooter } from '../card/robo-card';
import { RoboButton } from '../button/robo-button';


export const componentMeta = {
  description: 'Visual divider line between content sections or list items',
  category: 'layout' as const,
  keywords: ['separator', 'divider', 'line', 'hr', 'horizontal', 'vertical', 'rule'],
  whenToUse: 'For visual separation between content sections, sidebar groups, or list items',
  whenNotToUse: 'For spacing without a visible line use margin/padding; for section headers use headings',
  pairsWith: ['RoboSidebar', 'RoboCard', 'RoboAccordion', 'RoboStack'],
  a11y: 'Renders as role="separator" with appropriate orientation (horizontal/vertical)',
};
const meta: Meta<typeof RoboSeparator> = {
  title: 'Elements/Display/RoboSeparator',
  excludeStories: ['componentMeta'],
    component: RoboSeparator,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
    label: {
      control: 'text',
    },
  },
};
export default meta;

type Story = StoryObj<typeof RoboSeparator>;

export const Horizontal: Story = {
  render: () => (
    <div className='w-64'>
      <p style={{ marginBottom: 8 }}>Above the separator</p>
      <RoboSeparator />
      <p style={{ marginTop: 8 }}>Below the separator</p>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, height: 48 }}>
      <span>Left content</span>
      <RoboSeparator orientation='vertical' />
      <span>Right content</span>
    </div>
  ),
};

export const HorizontalWithLabel: Story = {
  name: 'Horizontal with Label',
  render: () => (
    <div className='w-72'>
      <RoboButton variant='default' className='w-full'>Sign in</RoboButton>
      <div style={{ marginTop: 16, marginBottom: 16 }}>
        <RoboSeparator label='Or continue with' />
      </div>
      <RoboButton variant='outline' className='w-full'>Sign in with SSO</RoboButton>
    </div>
  ),
};

export const InContext: Story = {
  name: 'In Context (between card sections)',
  render: () => (
    <RoboCard className='w-80'>
      <RoboCardHeader>
        <h3>Satellite Details</h3>
      </RoboCardHeader>
      <RoboCardBody>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <p style={{ fontSize: 12, opacity: 0.6 }}>Name</p>
            <p>Sentinel-2</p>
          </div>
          <RoboSeparator />
          <div>
            <p style={{ fontSize: 12, opacity: 0.6 }}>NORAD ID</p>
            <p>25544</p>
          </div>
          <RoboSeparator />
          <div>
            <p style={{ fontSize: 12, opacity: 0.6 }}>Status</p>
            <p>En Route</p>
          </div>
        </div>
      </RoboCardBody>
      <RoboCardFooter>
        <RoboButton size='sm' variant='outline'>View Full Report</RoboButton>
      </RoboCardFooter>
    </RoboCard>
  ),
};
