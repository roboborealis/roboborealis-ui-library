import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { RoboCard, RoboCardHeader, RoboCardBody, RoboCardFooter } from './robo-card';
import { RoboButton } from '../button/robo-button';
import { OverviewStack, OverviewSection } from '../../lib/storybook/overview-layout';


export const componentMeta = {
  description: 'Contained surface for grouping related content with optional header and actions',
  category: 'display' as const,
  keywords: ['card', 'panel', 'container', 'surface', 'tile', 'content', 'group'],
  whenToUse: 'For grouping related content into a visual unit — stat cards, entity summaries, feature sections',
  whenNotToUse: 'For full-page layout use RoboPageShell; for list items use RoboDataTable rows',
  pairsWith: ['RoboBadge', 'RoboButton', 'RoboStatCard', 'RoboSkeletonLoading'],
  a11y: 'Use appropriate heading levels inside cards; add aria-label if the card is a landmark region',
};
const meta: Meta<typeof RoboCard> = {
  title: 'Elements/Display/RoboCard',
  excludeStories: ['componentMeta'],
    component: RoboCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outlined', 'elevated', 'ghost'],
    },
    hoverable: {
      control: 'boolean',
    },
  },
};
export default meta;

type Story = StoryObj<typeof RoboCard>;

export const AllVariants: Story = {
  name: 'All Variants',
  render: () => (
    <OverviewStack>
      <OverviewSection title='RoboCard'>
        <div className='flex flex-wrap gap-4 items-start'>
          {(['default', 'outlined', 'elevated', 'ghost'] as const).map((variant) => (
            <RoboCard key={variant} variant={variant} className='w-56'>
              <RoboCardHeader>
                <strong style={{ textTransform: 'capitalize' }}>{variant}</strong>
              </RoboCardHeader>
              <RoboCardBody>
                <p>Card content for the {variant} variant.</p>
              </RoboCardBody>
            </RoboCard>
          ))}
        </div>
      </OverviewSection>
    </OverviewStack>
  ),
};

export const Default: Story = {
  render: () => (
    <RoboCard className='w-80'>
      <RoboCardBody>Default card with body content.</RoboCardBody>
    </RoboCard>
  ),
};

export const WithAllSlots: Story = {
  name: 'With Header + Body + Footer',
  render: () => (
    <RoboCard className='w-80'>
      <RoboCardHeader>
        <h3>Satellite Report</h3>
        <p style={{ fontSize: '0.875rem', opacity: 0.7 }}>Final orbit report</p>
      </RoboCardHeader>
      <RoboCardBody>
        <p>Spacecraft has reached target orbit. All systems nominal.</p>
      </RoboCardBody>
      <RoboCardFooter className='gap-2'>
        <RoboButton size='sm' variant='default'>Approve</RoboButton>
        <RoboButton size='sm' variant='outline'>Review</RoboButton>
      </RoboCardFooter>
    </RoboCard>
  ),
};

export const Hoverable: Story = {
  name: 'Hoverable',
  render: () => (
    <RoboCard hoverable className='w-80'>
      <RoboCardHeader>
        <h3>Hoverable Card</h3>
      </RoboCardHeader>
      <RoboCardBody>
        <p>Hover over this card to see the shadow transition.</p>
      </RoboCardBody>
    </RoboCard>
  ),
};

export const ElevatedWithContent: Story = {
  name: 'Elevated with Full Content',
  render: () => (
    <RoboCard variant='elevated' hoverable className='w-96'>
      <RoboCardHeader>
        <h3>Anomaly Response Operation</h3>
        <p style={{ fontSize: '0.875rem', opacity: 0.7 }}>Constellation coordination</p>
      </RoboCardHeader>
      <RoboCardBody>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ opacity: 0.7 }}>Satellite</span>
            <span>Sentinel-2</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ opacity: 0.7 }}>Status</span>
            <span>En route</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ opacity: 0.7 }}>ETA</span>
            <span>14:30 UTC</span>
          </div>
        </div>
      </RoboCardBody>
      <RoboCardFooter className='gap-2'>
        <RoboButton size='sm' variant='default'>Dispatch</RoboButton>
        <RoboButton size='sm' variant='ghost'>Details</RoboButton>
      </RoboCardFooter>
    </RoboCard>
  ),
};
