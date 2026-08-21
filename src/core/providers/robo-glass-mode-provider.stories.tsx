import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { createLocalStorageAdapter } from '../storage-adapter';
import { RoboButton } from '../button/robo-button';
import { RoboBadge } from '../badge/robo-badge';
import { RoboGlassModeProvider, useGlassMode } from './robo-glass-mode-provider';
import { getPanelSurfaceClasses } from '@/core/glass-surface';

export const componentMeta = {
  description: 'App-wide setting controlling whether map-overlay panels render a translucent glass surface or a solid one by default',
  category: 'layout' as const,
  keywords: ['glass', 'transparent', 'blur', 'panel', 'provider', 'context', 'setting', 'map'],
  whenToUse: 'Wrap the app (typically in AppShellTemplate) to give every RoboFloatingPanel/RoboSheet/RoboInfoIsland a shared, user-controllable glass-vs-solid default',
  whenNotToUse: 'For color theme use RoboThemeProvider; for spacing use RoboDensityProvider',
  pairsWith: ['RoboFloatingPanel', 'RoboSheet', 'RoboHoverSheet', 'RoboInfoIsland'],
  a11y: 'useGlassMode() never throws — safe to call from any panel even when no provider is mounted',
};

const meta: Meta<typeof RoboGlassModeProvider> = {
  title: 'Foundation/Providers/RoboGlassModeProvider',
  excludeStories: ['componentMeta'],
  component: RoboGlassModeProvider,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Sets `data-glass-mode="on"|"off"` on `document.documentElement` and provides `useGlassMode()`. Map-overlay panels read this to decide whether their default surface is translucent glass or solid — optionally persists the selection via a `StorageAdapter`.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof RoboGlassModeProvider>;

function GlassModeControls() {
  const { glassMode, setGlassMode } = useGlassMode();
  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
        alignItems: 'center',
        padding: 32,
        borderRadius: 'var(--radius)',
        background:
          'radial-gradient(circle at 20% 30%, #0ea5e9 0%, #0369a1 35%, #0c4a6e 60%), ' +
          'linear-gradient(135deg, #0891b2, #075985 60%, #1e3a5f)',
      }}
    >
      <div style={{ display: 'flex', gap: 8 }}>
        <RoboButton variant={!glassMode ? 'default' : 'outline'} size='sm' onClick={() => setGlassMode(false)}>
          Solid
        </RoboButton>
        <RoboButton variant={glassMode ? 'default' : 'outline'} size='sm' onClick={() => setGlassMode(true)}>
          Glass
        </RoboButton>
      </div>

      <RoboBadge variant='status'>
        Glass mode: <strong style={{ marginLeft: 4 }}>{glassMode ? 'on' : 'off'}</strong>
      </RoboBadge>

      <div
        className={getPanelSurfaceClasses(glassMode)}
        style={{ width: 260, borderRadius: 'var(--radius-lg)', padding: 16 }}
      >
        <p style={{ margin: 0, fontWeight: 600 }}>Sample panel</p>
        <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.8 }}>
          Every RoboFloatingPanel/RoboSheet/RoboInfoIsland responds to this setting.
        </p>
      </div>
    </div>
  );
}

export const Interactive: Story = {
  name: 'Interactive — Toggle Glass Mode',
  render: () => (
    <RoboGlassModeProvider storageAdapter={createLocalStorageAdapter()}>
      <GlassModeControls />
    </RoboGlassModeProvider>
  ),
};

export const DefaultOff: Story = {
  name: 'Default (off)',
  render: () => (
    <RoboGlassModeProvider defaultGlassMode={false}>
      <GlassModeControls />
    </RoboGlassModeProvider>
  ),
};

export const StartOn: Story = {
  name: 'Start On',
  render: () => (
    <RoboGlassModeProvider defaultGlassMode>
      <GlassModeControls />
    </RoboGlassModeProvider>
  ),
};
