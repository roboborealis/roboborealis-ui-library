import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { createLocalStorageAdapter } from '../storage-adapter';
import { RoboCard, RoboCardBody, RoboCardHeader } from '../card/robo-card';
import { RoboButton } from '../button/robo-button';
import { RoboTourProvider, useTourRegistry } from './robo-tour-provider';
import { RoboProductTour, type RoboTourStep } from './robo-product-tour';

export const componentMeta = {
  description:
    'Themed react-joyride wrapper backed by RoboTourProvider — auto-runs once per tour id, skips steps whose target is missing from the DOM, and marks the tour completed on finish or skip',
  category: 'layout' as const,
  keywords: ['tour', 'onboarding', 'walkthrough', 'joyride', 'spotlight', 'tooltip', 'first-run'],
  whenToUse: 'Baked into a starter template to walk a first-time user through its main feature, key sections, and Settings',
  whenNotToUse: 'For a single tooltip that isn\'t part of a persisted, restartable tour, use RoboTooltip/RoboPopover directly',
  pairsWith: ['RoboTourProvider', 'RoboTourSettingsCard', 'RoboFloatingPanel'],
  a11y: 'Renders nothing until mounted client-side; respects prefers-reduced-motion by disabling scroll-to-step animation',
};

const meta: Meta<typeof RoboProductTour> = {
  title: 'Foundation/Providers/RoboProductTour',
  excludeStories: ['componentMeta'],
  component: RoboProductTour,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Wrap the demo area in RoboTourProvider, then render RoboProductTour alongside the elements its steps target. Restarting from RoboTourSettingsCard (or useTourRegistry().restart) re-runs onBeforeStart and re-filters steps before showing the tooltip again.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof RoboProductTour>;

const DEMO_STEPS: RoboTourStep[] = [
  { target: '#story-tour-card', content: 'This card is the main feature.', skipBeacon: true },
  { target: '#story-tour-button', content: 'This button triggers an action.', skipBeacon: true },
];

function RestartControl() {
  const { list, restart } = useTourRegistry();
  const tour = list().find((t) => t.id === 'story-demo-tour');
  return (
    <RoboButton variant='outline' size='sm' onClick={() => restart('story-demo-tour')}>
      {tour?.completed ? 'Restart tour' : 'Tour in progress…'}
    </RoboButton>
  );
}

function Demo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 420 }}>
      <RoboCard id='story-tour-card'>
        <RoboCardHeader>Main feature</RoboCardHeader>
        <RoboCardBody>This is the section the first tour step highlights.</RoboCardBody>
      </RoboCard>
      <RoboButton id='story-tour-button'>Take action</RoboButton>
      <RestartControl />
      <RoboProductTour id='story-demo-tour' label='Demo tour' steps={DEMO_STEPS} />
    </div>
  );
}

export const Interactive: Story = {
  name: 'Interactive — Auto-runs Once, Restartable',
  render: () => (
    <RoboTourProvider storageAdapter={createLocalStorageAdapter()}>
      <Demo />
    </RoboTourProvider>
  ),
};
