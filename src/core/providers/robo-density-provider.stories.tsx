import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { createLocalStorageAdapter } from '../storage-adapter';
import { RoboBadge } from '../badge/robo-badge';
import { RoboButton } from '../button/robo-button';
import { RoboCard, RoboCardBody, RoboCardFooter, RoboCardHeader } from '../card/robo-card';
import { RoboDensityProvider, useDensity } from './robo-density-provider';
import type { Density } from './robo-density-provider';


export const componentMeta = {
  description: 'Context provider that controls spacing density across child components',
  category: 'layout' as const,
  keywords: ['density', 'compact', 'comfortable', 'spacious', 'spacing', 'provider', 'context'],
  whenToUse: 'Wrap sections or pages to uniformly control component density (compact, default, spacious)',
  whenNotToUse: 'For theme colors use RoboThemeProvider; for individual spacing use Tailwind classes',
  pairsWith: ['RoboThemeProvider', 'RoboPageShell', 'RoboDataTable'],
  a11y: 'Compact density should not reduce touch targets below 44x44px on mobile',
};
const meta: Meta<typeof RoboDensityProvider> = {
  title: 'Foundation/Providers/RoboDensityProvider',
  excludeStories: ['componentMeta'],
    component: RoboDensityProvider,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Sets `data-density` on `document.documentElement`, driving compact/comfortable/spacious spacing tokens across all Robo components. Optionally persists the selection via a `StorageAdapter`.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof RoboDensityProvider>;

const DENSITIES: Density[] = ['compact', 'comfortable', 'spacious'];

function DensityControls() {
  const { density, setDensity } = useDensity();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, alignItems: 'center' }}>
      {/* Toggle buttons */}
      <div style={{ display: 'flex', gap: 8 }}>
        {DENSITIES.map((d) => (
          <RoboButton
            key={d}
            variant={density === d ? 'default' : 'outline'}
            size='sm'
            onClick={() => setDensity(d)}
          >
            {d.charAt(0).toUpperCase() + d.slice(1)}
          </RoboButton>
        ))}
      </div>

      {/* Indicator */}
      <RoboBadge variant='status'>
        Active density: <strong style={{ marginLeft: 4 }}>{density}</strong>
      </RoboBadge>

      {/* Sample card that visually responds (when theme CSS vars are loaded) */}
      <RoboCard className='w-72'>
        <RoboCardHeader>
          <h3 style={{ margin: 0, fontSize: '1rem' }}>Sample Card</h3>
          <p style={{ margin: 0, fontSize: '0.75rem', opacity: 0.6 }}>Responds to density</p>
        </RoboCardHeader>
        <RoboCardBody>
          <p style={{ margin: 0 }}>Content area — padding adjusts with density.</p>
        </RoboCardBody>
        <RoboCardFooter className='gap-2'>
          <RoboButton size='sm' variant='default'>Save</RoboButton>
          <RoboButton size='sm' variant='ghost'>Cancel</RoboButton>
        </RoboCardFooter>
      </RoboCard>
    </div>
  );
}

export const Interactive: Story = {
  name: 'Interactive — Toggle Density',
  render: () => (
    <RoboDensityProvider storageAdapter={createLocalStorageAdapter()}>
      <DensityControls />
    </RoboDensityProvider>
  ),
};

export const DefaultComfortable: Story = {
  name: 'Default (comfortable)',
  render: () => (
    <RoboDensityProvider defaultDensity='comfortable'>
      <DensityControls />
    </RoboDensityProvider>
  ),
};

export const StartCompact: Story = {
  name: 'Start Compact',
  render: () => (
    <RoboDensityProvider defaultDensity='compact'>
      <DensityControls />
    </RoboDensityProvider>
  ),
};

export const StartSpacious: Story = {
  name: 'Start Spacious',
  render: () => (
    <RoboDensityProvider defaultDensity='spacious'>
      <DensityControls />
    </RoboDensityProvider>
  ),
};
