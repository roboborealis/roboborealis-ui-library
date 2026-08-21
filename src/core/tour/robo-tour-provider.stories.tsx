import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { createLocalStorageAdapter } from '../storage-adapter';
import { RoboBadge } from '../badge/robo-badge';
import { RoboButton } from '../button/robo-button';
import { RoboTourProvider, useTour, useTourRegistry } from './robo-tour-provider';

export const componentMeta = {
  description:
    'Registry provider for named, independently-restartable guided tours, with localStorage-backed completion state per tour — mirrors RoboKeybindProvider\'s registry shape',
  category: 'layout' as const,
  keywords: ['tour', 'onboarding', 'walkthrough', 'joyride', 'provider', 'context', 'registry', 'settings'],
  whenToUse: 'Wrap the app (typically in a starter template) so any component can register a named tour via useTour/RoboProductTour, and users can restart any of them from Settings via RoboTourSettingsCard',
  whenNotToUse: 'For a single ad-hoc tooltip walkthrough with no persistence or Settings entry, drive react-joyride directly instead',
  pairsWith: ['RoboProductTour', 'RoboTourSettingsCard'],
  a11y: 'useTour() never throws — outside a mounted RoboTourProvider it falls back to a working, non-persisted in-memory default so RoboProductTour keeps functioning standalone (Storybook, tests, un-adopted consumer apps)',
};

const meta: Meta<typeof RoboTourProvider> = {
  title: 'Foundation/Providers/RoboTourProvider',
  excludeStories: ['componentMeta'],
  component: RoboTourProvider,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Registers named tours (id + label), persists each one\'s completion flag under its own storage key, and exposes a whole-registry accessor (useTourRegistry) for Settings UIs to list and restart every tour generically.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof RoboTourProvider>;

function TourDemo({ id, label }: { id: string; label: string }) {
  const { completed, complete } = useTour({ id, label });
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
      <span>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <RoboBadge usage='label' color={completed ? 'success' : 'default'} size='sm'>
          {completed ? 'Completed' : 'Not taken'}
        </RoboBadge>
        <RoboButton variant='outline' size='sm' onClick={complete} disabled={completed}>
          Mark complete
        </RoboButton>
      </div>
    </div>
  );
}

function RestartAllDemo() {
  const { restartAll } = useTourRegistry();
  return (
    <RoboButton variant='ghost' size='sm' onClick={restartAll}>
      Restart all tours
    </RoboButton>
  );
}

function TwoTourDemo() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        width: 360,
        padding: 16,
        borderRadius: 'var(--radius)',
        border: '1px solid var(--border)',
        background: 'var(--card)',
      }}
    >
      <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
        Each tour tracks its own completion state, independently.
      </p>
      <TourDemo id='demo.map-dashboard-starter' label='Map dashboard tour' />
      <TourDemo id='demo.app-shell' label='Basic app tour' />
      <RestartAllDemo />
    </div>
  );
}

export const Interactive: Story = {
  name: 'Interactive — Two Registered Tours',
  render: () => (
    <RoboTourProvider storageAdapter={createLocalStorageAdapter()}>
      <TwoTourDemo />
    </RoboTourProvider>
  ),
};
