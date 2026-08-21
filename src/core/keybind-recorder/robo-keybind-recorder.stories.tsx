import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { RoboKeybindRecorder } from './robo-keybind-recorder';

export const componentMeta = {
  description: 'Press-keys-to-record control for reassigning a keyboard shortcut, displaying the captured combo via RoboKbd',
  category: 'input' as const,
  keywords: ['keybind', 'shortcut', 'recorder', 'capture', 'hotkey', 'settings', 'input'],
  whenToUse: 'Settings pages that let users reassign a shortcut registered with RoboKeybindProvider',
  whenNotToUse: 'Read-only shortcut display — use RoboKbd directly',
  pairsWith: ['RoboKeybindProvider', 'RoboKbd'],
  a11y: 'aria-live="polite" announces the listening state via its accessible name; Escape or blur cancels without committing; focus ring visible in both idle and listening states',
};

const meta: Meta<typeof RoboKeybindRecorder> = {
  title: 'Components/Forms/RoboKeybindRecorder',
  excludeStories: ['componentMeta'],
  component: RoboKeybindRecorder,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};
export default meta;

type Story = StoryObj<typeof RoboKeybindRecorder>;

export const Default: Story = {
  render: () => {
    function Demo() {
      const [combo, setCombo] = React.useState('mod+/');
      return <RoboKeybindRecorder combo={combo} onChange={setCombo} />;
    }
    return <Demo />;
  },
};

export const WithConflict: Story = {
  name: 'With Conflict',
  render: () => <RoboKeybindRecorder combo='l' onChange={() => undefined} conflictWith='Open Layers' />,
};

export const AllStates: Story = {
  name: 'All States',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginBottom: 6 }}>Idle</p>
        <RoboKeybindRecorder combo='mod+/' onChange={() => undefined} />
      </div>
      <div>
        <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginBottom: 6 }}>Multi-key combo</p>
        <RoboKeybindRecorder combo='mod+shift+k' onChange={() => undefined} />
      </div>
      <div>
        <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginBottom: 6 }}>Conflict</p>
        <RoboKeybindRecorder combo='l' onChange={() => undefined} conflictWith='Open Layers' />
      </div>
      <div>
        <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginBottom: 6 }}>
          Click, then press a key (listening state)
        </p>
        <RoboKeybindRecorder combo='mod+/' onChange={() => undefined} />
      </div>
    </div>
  ),
};
