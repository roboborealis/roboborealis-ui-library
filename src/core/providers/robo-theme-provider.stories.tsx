import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { createLocalStorageAdapter } from '../storage-adapter';
import { RoboBadge } from '../badge/robo-badge';
import { RoboButton } from '../button/robo-button';
import { RoboCard, RoboCardBody, RoboCardFooter, RoboCardHeader } from '../card/robo-card';
import { RoboThemeProvider, useTheme } from './robo-theme-provider';
import type { Theme, Mode } from './robo-theme-provider';


export const componentMeta = {
  description:
    'Context provider that owns theme tokens (midnight/aurora/sol) and light/dark mode (including system) for its children. Pair with getRoboThemeScript() to apply the saved mode before first paint.',
  category: 'layout' as const,
  keywords: [
    'theme',
    'provider',
    'dark',
    'light',
    'system',
    'midnight',
    'aurora',
    'sol',
    'tokens',
    'mode',
    'resolvedMode',
    'applyTo',
    'getRoboThemeScript',
    'pre-paint',
    'flash',
    'prefers-color-scheme',
    'createCookieStorageAdapter',
    'next-themes',
  ],
  whenToUse:
    'Wrap your app root to apply Robo theme tokens and own light/dark. It owns the mode axis outright — do not install next-themes alongside it. Use applyTo="none" plus themeAttributes to scope the theme to part of the page.',
  whenNotToUse:
    'For density spacing use RoboDensityProvider; for one-off overrides use CSS variables directly. Do not use it to set data-theme on a subtree without applyTo="none" — it writes documentElement by default.',
  pairsWith: ['RoboDensityProvider', 'RoboPageShell', 'getRoboThemeScript', 'createCookieStorageAdapter'],
  a11y: 'Ensure sufficient color contrast in both light and dark themes (WCAG AA 4.5:1 minimum). Offering the system option lets users inherit an OS-level contrast preference rather than forcing one.',
};
const meta: Meta<typeof RoboThemeProvider> = {
  title: 'Foundation/Providers/RoboThemeProvider',
  excludeStories: ['componentMeta'],
    component: RoboThemeProvider,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Sets `data-theme` and `data-mode` on `document.documentElement`, enabling CSS variable token swapping across the `midnight`, `aurora`, and `sol` themes in `dark`/`light` mode. Persists via a `StorageAdapter` (defaults to `localStorage`; use `createCookieStorageAdapter()` when the server needs to read the preference).\n\n' +
          '`mode` is the stored preference and may be `system`, which follows the OS live. `resolvedMode` is the concrete `dark`/`light` actually applied — bind settings controls to `mode`, and drive styling off `resolvedMode`.\n\n' +
          'Pair with `getRoboThemeScript()` in a blocking `<head>` script to apply the saved mode before first paint; an effect always runs too late to prevent a flash. Pass `applyTo="none"` to keep the attributes off `<html>` and spread `themeAttributes` onto your own wrapper instead, scoping the theme to part of the page.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof RoboThemeProvider>;

const THEMES: Theme[] = ['midnight', 'aurora', 'sol'];
const MODES: Mode[] = ['system', 'dark', 'light'];

function ThemeControls() {
  const { theme, mode, resolvedMode, setTheme, setMode } = useTheme();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, alignItems: 'center' }}>
      {/* Theme selector */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: '0.75rem', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Theme
        </span>
        <div style={{ display: 'flex', gap: 8 }}>
          {THEMES.map((t) => (
            <RoboButton
              key={t}
              variant={theme === t ? 'default' : 'outline'}
              size='sm'
              onClick={() => setTheme(t)}
            >
              {t}
            </RoboButton>
          ))}
        </div>
      </div>

      {/* Mode selector */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: '0.75rem', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Mode
        </span>
        <div style={{ display: 'flex', gap: 8 }}>
          {MODES.map((m) => (
            <RoboButton
              key={m}
              variant={mode === m ? 'secondary' : 'ghost'}
              size='sm'
              onClick={() => setMode(m)}
            >
              {m}
            </RoboButton>
          ))}
        </div>
      </div>

      {/* Active state badge. Shows the resolution when they differ — pick System and change your
          OS appearance to watch this update live, with no reload. */}
      <RoboBadge variant='status'>
        {theme} / {mode}
        {mode !== resolvedMode ? ` → ${resolvedMode}` : ''}
      </RoboBadge>

      {/* Sample card */}
      <RoboCard className='w-72'>
        <RoboCardHeader>
          <h3 style={{ margin: 0, fontSize: '1rem' }}>Satellite Report</h3>
          <p style={{ margin: 0, fontSize: '0.75rem', opacity: 0.6 }}>
            Theme: {theme} · Mode: {mode} · Applied: {resolvedMode}
          </p>
        </RoboCardHeader>
        <RoboCardBody>
          <p style={{ margin: 0 }}>Component colours adapt to the active theme and mode via CSS variables.</p>
        </RoboCardBody>
        <RoboCardFooter className='gap-2'>
          <RoboButton size='sm' variant='default'>Approve</RoboButton>
          <RoboButton size='sm' variant='ghost'>Dismiss</RoboButton>
        </RoboCardFooter>
      </RoboCard>
    </div>
  );
}

export const Interactive: Story = {
  name: 'Interactive — Switch Theme & Mode',
  render: () => (
    <RoboThemeProvider storageAdapter={createLocalStorageAdapter()}>
      <ThemeControls />
    </RoboThemeProvider>
  ),
};

export const MidnightTheme: Story = {
  name: 'Midnight Theme (default)',
  render: () => (
    <RoboThemeProvider defaultTheme='midnight'>
      <ThemeControls />
    </RoboThemeProvider>
  ),
};

export const AuroraTheme: Story = {
  name: 'Aurora Theme',
  render: () => (
    <RoboThemeProvider defaultTheme='aurora'>
      <ThemeControls />
    </RoboThemeProvider>
  ),
};

export const SolTheme: Story = {
  name: 'Sol Theme',
  render: () => (
    <RoboThemeProvider defaultTheme='sol'>
      <ThemeControls />
    </RoboThemeProvider>
  ),
};
