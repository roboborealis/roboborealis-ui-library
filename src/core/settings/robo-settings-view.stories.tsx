import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { RoboSettingsView } from './robo-settings-view';
import { RoboAppProviders } from './robo-app-providers';

// RoboSettingsView reads the provider hooks, so every story mounts it under
// RoboAppProviders - the same default stack an app would wire once near its root.
const meta: Meta<typeof RoboSettingsView> = {
  title: 'Foundation/Providers/RoboSettingsView',
  component: RoboSettingsView,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <RoboAppProviders theme={{ defaultTheme: 'midnight', defaultMode: 'dark' }}>
        <Story />
      </RoboAppProviders>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof RoboSettingsView>;

// All five default controls: color theme, mode, density, font, date format.
export const Default: Story = {
  args: {
    description: 'Personalize the theme, density, font, and date format for this app.',
  },
};

// A lighter app that only mounts the appearance controls it uses.
export const AppearanceOnly: Story = {
  args: {
    title: 'Appearance',
    sections: ['theme', 'mode', 'font'],
  },
};
