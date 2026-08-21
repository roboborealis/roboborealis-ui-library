import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { createLocalStorageAdapter } from '../storage-adapter';
import { RoboBadge } from '../badge/robo-badge';
import { RoboButton } from '../button/robo-button';
import { RoboCard, RoboCardBody, RoboCardHeader } from '../card/robo-card';
import { RoboFontFamilyProvider, useFontFamily } from './robo-font-family-provider';
import type { FontFamily } from './robo-font-family-provider';


export const componentMeta = {
  description: 'Context provider that controls the selectable body-text font family across child components',
  category: 'layout' as const,
  keywords: ['font', 'typography', 'font family', 'dm sans', 'varela', 'open sans', 'opendyslexic', 'sora', 'accessibility', 'provider', 'context'],
  whenToUse: 'Wrap an app to let users choose a body-text font (readability, density, or dyslexia accessibility preference)',
  whenNotToUse: 'For heading/display/mono fonts, which are fixed per theme and not user-selectable',
  pairsWith: ['RoboThemeProvider', 'RoboDensityProvider'],
  a11y: 'OpenDyslexic is provided as a selectable accessibility option for dyslexic readers',
};
const meta: Meta<typeof RoboFontFamilyProvider> = {
  title: 'Foundation/Providers/RoboFontFamilyProvider',
  excludeStories: ['componentMeta'],
  component: RoboFontFamilyProvider,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Sets `data-font-family` on `document.documentElement`, driving the `--font-sans` token across all Robo components. Optionally persists the selection via a `StorageAdapter`.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof RoboFontFamilyProvider>;

const FONT_FAMILIES: { value: FontFamily; label: string }[] = [
  { value: 'inter', label: 'Inter' },
  { value: 'dm-sans', label: 'DM Sans' },
  { value: 'varela', label: 'Varela' },
  { value: 'open-sans', label: 'Open Sans' },
  { value: 'opendyslexic', label: 'OpenDyslexic' },
  { value: 'sora', label: 'Sora' },
];

const SAMPLE_TEXT =
  'The quick brown fox jumps over the lazy dog. Satellite positions are updated every 30 seconds.';

function FontFamilyControls() {
  const { fontFamily, setFontFamily } = useFontFamily();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, alignItems: 'center' }}>
      {/* Toggle buttons */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
        {FONT_FAMILIES.map((f) => (
          <RoboButton
            key={f.value}
            variant={fontFamily === f.value ? 'default' : 'outline'}
            size='sm'
            onClick={() => setFontFamily(f.value)}
          >
            {f.label}
          </RoboButton>
        ))}
      </div>

      {/* Indicator */}
      <RoboBadge variant='status'>
        Active font: <strong style={{ marginLeft: 4 }}>{fontFamily}</strong>
      </RoboBadge>

      {/* Sample body text — the point of this story is to actually see the
          letterform differences, especially for OpenDyslexic. */}
      <RoboCard className='w-96'>
        <RoboCardHeader>
          <h3 style={{ margin: 0, fontSize: '1rem' }}>Sample text</h3>
        </RoboCardHeader>
        <RoboCardBody>
          <p style={{ margin: 0, fontFamily: 'var(--font-sans)' }}>{SAMPLE_TEXT}</p>
        </RoboCardBody>
      </RoboCard>
    </div>
  );
}

export const Interactive: Story = {
  name: 'Interactive — Toggle Font Family',
  render: () => (
    <RoboFontFamilyProvider storageAdapter={createLocalStorageAdapter()}>
      <FontFamilyControls />
    </RoboFontFamilyProvider>
  ),
};

export const DefaultDMSans: Story = {
  name: 'Default (DM Sans)',
  render: () => (
    <RoboFontFamilyProvider defaultFontFamily='dm-sans'>
      <FontFamilyControls />
    </RoboFontFamilyProvider>
  ),
};

export const StartOpenDyslexic: Story = {
  name: 'Start OpenDyslexic',
  render: () => (
    <RoboFontFamilyProvider defaultFontFamily='opendyslexic'>
      <FontFamilyControls />
    </RoboFontFamilyProvider>
  ),
};
