import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { createLocalStorageAdapter } from '../storage-adapter';
import { RoboBadge } from '../badge/robo-badge';
import { RoboKbd } from '../kbd/robo-kbd';
import { RoboKeybindProvider, useKeybind } from './robo-keybind-provider';
import { formatComboForDisplay } from './robo-keybind-utils';

export const componentMeta = {
  description: 'Registry provider for reassignable global keyboard shortcuts, with localStorage-backed overrides layered on code-registered defaults',
  category: 'layout' as const,
  keywords: ['keybind', 'shortcut', 'hotkey', 'keyboard', 'provider', 'context', 'registry', 'settings'],
  whenToUse: 'Wrap the app (typically in AppShellTemplate) so any component can register a reassignable shortcut via useKeybind/useRegisterKeybind, and users can rebind it from Settings via RoboKeybindRecorder',
  whenNotToUse: 'For a single fixed, non-reassignable shortcut with no Settings UI, a local keydown listener (as RoboCommandPalette\'s own docs show) is simpler',
  pairsWith: ['RoboKeybindRecorder', 'RoboQuickPanel', 'RoboKbd'],
  a11y: 'useRegisterKeybind()/useKeybind() never throw — outside a mounted RoboKeybindProvider they fall back to a working, non-persisted in-memory default so components keep functioning standalone (Storybook, tests, un-adopted consumer apps)',
};

const meta: Meta<typeof RoboKeybindProvider> = {
  title: 'Foundation/Providers/RoboKeybindProvider',
  excludeStories: ['componentMeta'],
  component: RoboKeybindProvider,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Mounts one global keydown listener and matches every registered action\'s effective combo against each event, skipping matches while focus is in an editable field unless the action opts in.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof RoboKeybindProvider>;

function ActionDemo({ id, label, defaultCombo }: { id: string; label: string; defaultCombo: string }) {
  const [fired, setFired] = React.useState(0);
  const { combo } = useKeybind({ id, label, defaultCombo }, () => setFired((n) => n + 1));
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
      <span>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {formatComboForDisplay(combo).map((segment, i) => (
          <RoboKbd key={i}>{segment}</RoboKbd>
        ))}
        <RoboBadge usage='count' color='primary' size='sm' count={fired} aria-label={`${label} fired ${fired} times`} />
      </div>
    </div>
  );
}

function TwoActionDemo() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        width: 320,
        padding: 16,
        borderRadius: 'var(--radius)',
        border: '1px solid var(--border)',
        background: 'var(--card)',
      }}
    >
      <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
        Click into this frame, then press a shortcut below.
      </p>
      <ActionDemo id='demo.toggle' label='Toggle panel' defaultCombo='mod+/' />
      <ActionDemo id='demo.layers' label='Open layers' defaultCombo='l' />
    </div>
  );
}

export const Interactive: Story = {
  name: 'Interactive — Two Registered Actions',
  render: () => (
    <RoboKeybindProvider storageAdapter={createLocalStorageAdapter()}>
      <TwoActionDemo />
    </RoboKeybindProvider>
  ),
};
