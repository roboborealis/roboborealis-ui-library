import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { RoboButton } from '../core/button/robo-button';
import { RoboCard, RoboCardBody, RoboCardHeader } from '../core/card/robo-card';
import { RoboBadge } from '../core/badge/robo-badge';
import { RoboInput } from '../core/input/robo-input';

const meta: Meta = {
  title: 'Foundation/Theme Switcher',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
          component:
            '@roboborealis/components ships three themes — `midnight`, `aurora`, and ' +
            '`sol` — each with light and dark modes. ' +
            'Every theme is shown on its own row below, light then dark. ' +
            'Activate via `data-theme` and `data-mode` HTML attributes.\n\n' +
            '**Note:** Each panel scopes its own `data-theme`/`data-mode` attributes on a wrapper div, ' +
            'so all variants render simultaneously regardless of the Storybook toolbar theme. ' +
            'The page padding/background outside the panels will reflect the toolbar selection — ' +
            'this is expected and does not indicate broken theming.',
      },
    },
  },
};
export default meta;

type Story = StoryObj;

// ─── Theme panel ─────────────────────────────────────────────────────────────

type ThemeName = 'midnight' | 'aurora' | 'sol';

type ThemeVariant = {
  theme: ThemeName;
  mode: 'dark' | 'light';
  label: string;
  description: string;
};

const VARIANTS: ThemeVariant[] = [
  { theme: 'midnight', mode: 'light', label: 'Midnight · Light', description: 'Light mode. Deep-purple sidebar, indigo primary on a soft lavender page.' },
  { theme: 'midnight', mode: 'dark',  label: 'Midnight · Dark',  description: 'Dark default. Deep purple surfaces, indigo CTAs.' },
  { theme: 'aurora',   mode: 'light', label: 'Aurora · Light',   description: 'Light default. Pale mint page, teal primary, purple sidebar.' },
  { theme: 'aurora',   mode: 'dark',  label: 'Aurora · Dark',    description: 'Dark mode. Deep teal surfaces, purple sidebar, aqua accents.' },
  { theme: 'sol',      mode: 'light', label: 'Sol · Light',      description: 'Light mode. Warm-cream page, gold primary.' },
  { theme: 'sol',      mode: 'dark',  label: 'Sol · Dark',       description: 'Dark default. Warm charcoal surfaces, gold primary.' },
];

const THEME_ORDER: ThemeName[] = ['midnight', 'aurora', 'sol'];

/** Both variants of one theme, light first. */
function rowFor(theme: ThemeName): ThemeVariant[] {
  return VARIANTS.filter((v) => v.theme === theme).sort((a) =>
    a.mode === 'light' ? -1 : 1,
  );
}

interface ThemePanelProps {
  variant: ThemeVariant;
}

function ThemePanel({ variant }: ThemePanelProps) {
  return (
    <div
      data-theme={variant.theme}
      data-mode={variant.mode}
      style={{
        flex: 1,
        minWidth: 220,
        borderRadius: 10,
        overflow: 'hidden',
        border: '1px solid var(--border, rgba(0,0,0,0.12))',
        background: 'var(--background)',
        color: 'var(--foreground)',
      }}
    >
      {/* Panel header */}
      <div
        style={{
          padding: '10px 14px',
          borderBottom: '1px solid var(--border, rgba(0,0,0,0.08))',
          background: 'var(--card)',
        }}
      >
        <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 2 }}>{variant.label}</div>
        <div style={{ fontSize: 11, opacity: 0.55, lineHeight: 1.4 }}>{variant.description}</div>
      </div>

      {/* Attribute hint */}
      <div
        style={{
          padding: '6px 14px',
          fontSize: 10,
          fontFamily: 'monospace',
          background: 'var(--muted)',
          color: 'var(--muted-foreground)',
          letterSpacing: '0.02em',
        }}
      >
        {`data-theme="${variant.theme}" data-mode="${variant.mode}"`}
      </div>

      {/* Sample components */}
      <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>

        {/* Buttons row */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <RoboButton size='sm' variant='default'>Primary</RoboButton>
          <RoboButton size='sm' variant='secondary'>Secondary</RoboButton>
          <RoboButton size='sm' variant='tertiary'>Tertiary</RoboButton>
          <RoboButton size='sm' variant='ghost'>Ghost</RoboButton>
        </div>

        {/* Badges row — colored via the `color` prop */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <RoboBadge color='primary'>Status</RoboBadge>
          <RoboBadge color='success'>Success</RoboBadge>
          <RoboBadge color='warning'>Warning</RoboBadge>
          <RoboBadge color='destructive'>Error</RoboBadge>
        </div>

        {/* Input */}
        <RoboInput placeholder='Search satellites…' />

        {/* Card */}
        <RoboCard>
          <RoboCardHeader>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 600, fontSize: 13 }}>Satellite Report</span>
              <RoboBadge variant='success'>Underway</RoboBadge>
            </div>
          </RoboCardHeader>
          <RoboCardBody>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12 }}>
              <Row label='Satellite' value='Sentinel-2' />
              <Row label='Velocity' value='7.66 km/s' />
              <Row label='Inclination' value='51.6°' />
            </div>
          </RoboCardBody>
        </RoboCard>

      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <span style={{ opacity: 0.5 }}>{label}</span>
      <span style={{ fontWeight: 500 }}>{value}</span>
    </div>
  );
}

// ─── Stories ─────────────────────────────────────────────────────────────────

const pick = (theme: ThemeName, mode: 'light' | 'dark') =>
  VARIANTS.find((v) => v.theme === theme && v.mode === mode)!;

export const AllThemes: Story = {
  name: 'All Themes — Side by Side',
  render: () => (
    <div style={{ maxWidth: 760 }}>
      <h2 style={{ margin: '0 0 4px', fontWeight: 700, fontSize: 20 }}>Theme Switcher</h2>
      <p style={{ margin: '0 0 20px', fontSize: 13, opacity: 0.6, maxWidth: 600 }}>
        All three themes, each on its own row — light then dark. Each panel scopes its own
        <code style={{ fontSize: 11, marginLeft: 4 }}>data-theme</code> and
        <code style={{ fontSize: 11, margin: '0 4px' }}>data-mode</code>
        attributes, so every variant renders simultaneously regardless of the toolbar.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        {THEME_ORDER.map((theme) => (
          <div key={theme}>
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                opacity: 0.55,
                marginBottom: 8,
              }}
            >
              {theme}
            </div>
            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              {rowFor(theme).map((v) => (
                <ThemePanel key={`${v.theme}-${v.mode}`} variant={v} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const MidnightDark: Story = {
  name: 'Midnight — Dark (default)',
  render: () => (
    <div style={{ maxWidth: 280 }}>
      <ThemePanel variant={pick('midnight', 'dark')} />
    </div>
  ),
};

export const MidnightLight: Story = {
  name: 'Midnight — Light',
  render: () => (
    <div style={{ maxWidth: 280 }}>
      <ThemePanel variant={pick('midnight', 'light')} />
    </div>
  ),
};

export const AuroraLight: Story = {
  name: 'Aurora — Light (default)',
  render: () => (
    <div style={{ maxWidth: 280 }}>
      <ThemePanel variant={pick('aurora', 'light')} />
    </div>
  ),
};

export const AuroraDark: Story = {
  name: 'Aurora — Dark',
  render: () => (
    <div style={{ maxWidth: 280 }}>
      <ThemePanel variant={pick('aurora', 'dark')} />
    </div>
  ),
};

export const SolLight: Story = {
  name: 'Sol — Light',
  render: () => (
    <div style={{ maxWidth: 280 }}>
      <ThemePanel variant={pick('sol', 'light')} />
    </div>
  ),
};

export const SolDark: Story = {
  name: 'Sol — Dark (default)',
  render: () => (
    <div style={{ maxWidth: 280 }}>
      <ThemePanel variant={pick('sol', 'dark')} />
    </div>
  ),
};
