import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { createLocalStorageAdapter } from '../storage-adapter';
import { RoboTourProvider, useTour } from './robo-tour-provider';
import { RoboTourSettingsCard } from './robo-tour-settings-card';

export const componentMeta = {
  description:
    'Settings card that lists every tour registered with RoboTourProvider, each with its own Restart tour button — the generic UI every starter template\'s Settings view drops in',
  category: 'layout' as const,
  keywords: ['tour', 'onboarding', 'settings', 'restart', 'walkthrough'],
  whenToUse: 'In any starter template\'s Settings view, alongside RoboTourProvider and one or more RoboProductTour instances',
  whenNotToUse: 'If the app has no RoboTourProvider mounted — this card throws without one',
  pairsWith: ['RoboTourProvider', 'RoboProductTour'],
  a11y: 'Each restart action is a labeled RoboButton — zero axe violations',
};

const meta: Meta<typeof RoboTourSettingsCard> = {
  title: 'Foundation/Providers/RoboTourSettingsCard',
  excludeStories: ['componentMeta'],
  component: RoboTourSettingsCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};
export default meta;

type Story = StoryObj<typeof RoboTourSettingsCard>;

function RegisteredTours() {
  useTour({ id: 'map-dashboard-starter', label: 'Map dashboard tour' });
  useTour({ id: 'app-shell', label: 'Basic app tour' });
  return null;
}

export const Default: Story = {
  render: () => (
    <RoboTourProvider storageAdapter={createLocalStorageAdapter()}>
      <RegisteredTours />
      <div style={{ width: 360 }}>
        <RoboTourSettingsCard />
      </div>
    </RoboTourProvider>
  ),
};

export const Empty: Story = {
  name: 'No Tours Registered',
  render: () => (
    <RoboTourProvider>
      <div style={{ width: 360 }}>
        <RoboTourSettingsCard />
      </div>
    </RoboTourProvider>
  ),
};
