import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { RoboButton } from '../core/button/robo-button';
import { RoboCard, RoboCardBody, RoboCardHeader } from '../core/card/robo-card';
import { RoboBadge } from '../core/badge/robo-badge';
import { RoboInput } from '../core/input/robo-input';
import { RoboSwitch } from '../forms/switch/robo-switch';
import { RoboSlider } from '../forms/slider/robo-slider';
import { RoboSelect } from '../forms/select/robo-select';
import { RoboTextarea } from '../forms/textarea/robo-textarea';
import { RoboCheckbox } from '../forms/checkbox/robo-checkbox';
import { RoboRadioGroup } from '../forms/radio-group/robo-radio-group';
import {
  RoboTable,
  RoboTableHeader,
  RoboTableBody,
  RoboTableRow,
  RoboTableHead,
  RoboTableCell,
} from '../tables/table/robo-table';
import {
  RoboAccordion,
  RoboAccordionItem,
  RoboAccordionTrigger,
  RoboAccordionContent,
} from '../core/accordion/robo-accordion';
import { getPanelSurfaceClasses } from '../core/glass-surface';

const meta: Meta = {
  title: 'Foundation/Surface Style',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'An app-wide **surface style** sits orthogonal to the colour theme: `flat`, ' +
          '`glass`, and `neumorphism`. It is a single `data-surface-style` attribute on `<html>` ' +
          'written by `RoboSurfaceStyleProvider` (import `@roboborealis/ui/surface-styles`).\n\n' +
          '**Flat** — standard flat design: no drop shadows, borders/dividers kept.\n\n' +
          '**Glass** — translucent, blurred *overlay panels* (`RoboFloatingPanel`, `RoboSheet`, ' +
          '`RoboInfoIsland`, `RoboQuickPanel`). Ordinary cards/forms are unaffected, so the glass ' +
          'effect shows on the dedicated glass panel in each sampler (over a textured backdrop). ' +
          'Wire it up by also calling `setGlassMode(true)` when the style is `glass`.\n\n' +
          '**Neumorphism** — reuses the active theme\'s own colours and swaps the shared ' +
          '`--shadow-*` tokens to a soft raised/pressed recipe. Surfaces read as extruded, buttons ' +
          'press in on `:active`, inputs and switch tracks are gently carved in. Dark mode is ' +
          'retuned separately so the highlight stays subtle.\n\n' +
          'Every theme (`midnight`, `aurora`, `sol`) is shown in both light and dark mode. Each ' +
          'panel scopes its own `data-theme` / `data-mode` / `data-surface-style` attributes, so ' +
          'all render simultaneously regardless of the Storybook toolbar.',
      },
    },
  },
};
export default meta;

type Story = StoryObj;

type SurfaceStyle = 'flat' | 'glass' | 'neumorphism';
type ThemeName = 'midnight' | 'aurora' | 'sol';
type Mode = 'light' | 'dark';

const THEMES: ThemeName[] = ['midnight', 'aurora', 'sol'];
const MODES: Mode[] = ['light', 'dark'];

const STYLE_ORDER: SurfaceStyle[] = ['flat', 'glass', 'neumorphism'];

const STYLE_META: Record<SurfaceStyle, { label: string; hint: string }> = {
  flat: { label: 'Flat', hint: 'data-surface-style="flat" — no shadows, borders kept' },
  glass: { label: 'Glass', hint: 'data-surface-style="glass" — translucent overlay panels' },
  neumorphism: { label: 'Neumorphism', hint: 'data-surface-style="neumorphism"' },
};

interface PanelProps {
  theme: ThemeName;
  mode: Mode;
  style: SurfaceStyle;
  /** Header shown above the sampler. */
  title: string;
  subtitle: string;
}

const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low' },
  { value: 'med', label: 'Medium' },
  { value: 'high', label: 'High' },
];

const CONTACT_OPTIONS = [
  { value: 'email', label: 'Email' },
  { value: 'sms', label: 'SMS', description: 'Standard rates apply' },
  { value: 'none', label: 'Do not contact' },
];

const groupLabel: React.CSSProperties = {
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  opacity: 0.5,
};

/** One themed + moded sampler for a single surface style. */
function SurfacePanel({ theme, mode, style, title, subtitle }: PanelProps) {
  const [on, setOn] = React.useState(true);
  const [contact, setContact] = React.useState('email');
  // Callback ref so RoboSelect can portal its dropdown INTO this themed panel — a
  // portal to document.body would inherit Storybook's root theme instead.
  const [panelEl, setPanelEl] = React.useState<HTMLDivElement | null>(null);
  const isGlass = style === 'glass';
  return (
    <div
      ref={setPanelEl}
      data-theme={theme}
      data-mode={mode}
      data-surface-style={style}
      style={{
        flex: 1,
        minWidth: 340,
        maxWidth: 460,
        borderRadius: 14,
        background: 'var(--background)',
        color: 'var(--foreground)',
      }}
    >
      <div style={{ padding: '12px 20px 0' }}>
        <div style={{ fontSize: 12, fontWeight: 700 }}>{title}</div>
        <div style={{ fontSize: 10, fontFamily: 'monospace', opacity: 0.55 }}>{subtitle}</div>
      </div>

      <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 22 }}>
        {/* Overlay panel — the surface glass mode actually changes. Only the glass
            style needs the textured backdrop (to reveal the blur); flat/neumorphism
            render the panel plainly. */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={groupLabel}>Overlay panel</span>
          <div
            style={{
              position: 'relative',
              borderRadius: 16,
              padding: isGlass ? 22 : 0,
              overflow: 'hidden',
              // Glass needs something to blur — a soft, out-of-focus colour scene
              // (theme hues), not a hard frame. Flat/neu render the panel plainly.
              backgroundImage: isGlass
                ? [
                    'radial-gradient(60% 80% at 15% 20%, color-mix(in oklch, var(--primary) 70%, transparent), transparent 70%)',
                    'radial-gradient(55% 75% at 85% 30%, color-mix(in oklch, var(--secondary) 65%, transparent), transparent 70%)',
                    'radial-gradient(70% 90% at 60% 95%, color-mix(in oklch, var(--accent) 75%, transparent), transparent 70%)',
                  ].join(', ')
                : undefined,
            }}
          >
            <div
              className={getPanelSurfaceClasses(isGlass)}
              style={{ borderRadius: 12, padding: 14 }}
            >
              <div style={{ fontSize: 13, fontWeight: 700 }}>Now playing</div>
              <div style={{ fontSize: 11, opacity: 0.7 }}>
                {isGlass ? 'Translucent + blurred' : 'Solid surface'}
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={groupLabel}>Buttons</span>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <RoboButton variant='default'>Primary</RoboButton>
            <RoboButton variant='secondary'>Secondary</RoboButton>
            <RoboButton variant='destructive'>Delete</RoboButton>
            <RoboButton variant='outline'>Outline</RoboButton>
            <RoboButton variant='ghost'>Ghost</RoboButton>
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <RoboBadge color='primary'>Active</RoboBadge>
            <RoboBadge color='success'>Online</RoboBadge>
            <RoboBadge color='warning'>Pending</RoboBadge>
            <RoboBadge color='destructive'>Error</RoboBadge>
          </div>
        </div>

        {/* Card */}
        <RoboCard>
          <RoboCardHeader>Humidity</RoboCardHeader>
          <RoboCardBody>
            <div style={{ fontSize: 30, fontWeight: 700 }}>42%</div>
          </RoboCardBody>
        </RoboCard>

        {/* A bigger form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <span style={groupLabel}>Form</span>
          <RoboInput label='Full name' placeholder='Ada Lovelace' />
          <RoboInput label='Email' type='email' placeholder='ada@example.com' />
          <RoboSelect
            label='Priority'
            placeholder='Choose one'
            options={PRIORITY_OPTIONS}
            defaultValue='med'
            container={panelEl}
          />
          <RoboTextarea label='Notes' placeholder='Anything we should know?' helperText='Max 200 chars' />
          <RoboRadioGroup
            label='Preferred contact'
            options={CONTACT_OPTIONS}
            value={contact}
            onValueChange={setContact}
          />
          <RoboCheckbox label='Email me product updates' />
          <RoboSwitch label='Auto-sync' checked={on} onCheckedChange={setOn} />
          <RoboSlider label='Volume' defaultValue={[40]} />
          <div style={{ display: 'flex', gap: 8 }}>
            <RoboButton variant='default'>Save</RoboButton>
            <RoboButton variant='ghost'>Cancel</RoboButton>
          </div>
        </div>

        {/* Table */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={groupLabel}>Table</span>
          <RoboTable variant='striped'>
            <RoboTableHeader>
              <RoboTableRow>
                <RoboTableHead>Track</RoboTableHead>
                <RoboTableHead>Artist</RoboTableHead>
                <RoboTableHead>Status</RoboTableHead>
              </RoboTableRow>
            </RoboTableHeader>
            <RoboTableBody>
              <RoboTableRow>
                <RoboTableCell>Ocean Eyes</RoboTableCell>
                <RoboTableCell>Billie Eilish</RoboTableCell>
                <RoboTableCell><RoboBadge color='success'>Playing</RoboBadge></RoboTableCell>
              </RoboTableRow>
              <RoboTableRow>
                <RoboTableCell>Positions</RoboTableCell>
                <RoboTableCell>Ariana Grande</RoboTableCell>
                <RoboTableCell><RoboBadge>Queued</RoboBadge></RoboTableCell>
              </RoboTableRow>
              <RoboTableRow>
                <RoboTableCell>Dakiti</RoboTableCell>
                <RoboTableCell>Bad Bunny</RoboTableCell>
                <RoboTableCell><RoboBadge>Queued</RoboBadge></RoboTableCell>
              </RoboTableRow>
            </RoboTableBody>
          </RoboTable>
        </div>
      </div>
    </div>
  );
}

const rowStyle: React.CSSProperties = {
  display: 'flex',
  gap: 20,
  flexWrap: 'wrap',
  alignItems: 'flex-start',
};

/** Every theme + mode for a single surface style. */
function StyleGrid({ style }: { style: SurfaceStyle }) {
  return (
    <div style={rowStyle}>
      {THEMES.flatMap((theme) =>
        MODES.map((mode) => (
          <SurfacePanel
            key={`${theme}-${mode}`}
            theme={theme}
            mode={mode}
            style={style}
            title={`${theme} · ${mode}`}
            subtitle={`data-theme="${theme}" data-mode="${mode}"`}
          />
        ))
      )}
    </div>
  );
}

/**
 * All three surface styles, each across every theme + mode, in collapsible
 * accordion sections. Neumorphism is expanded by default.
 */
export const AllStyles: Story = {
  render: () => (
    <RoboAccordion type='multiple' defaultValue={['neumorphism']}>
      {STYLE_ORDER.map((style) => (
        <RoboAccordionItem key={style} value={style}>
          <RoboAccordionTrigger>
            {STYLE_META[style].label}
            <span style={{ fontWeight: 400, fontFamily: 'monospace', fontSize: 11, opacity: 0.6, marginLeft: 8 }}>
              {STYLE_META[style].hint}
            </span>
          </RoboAccordionTrigger>
          <RoboAccordionContent>
            <div style={{ paddingTop: 12 }}>
              <StyleGrid style={style} />
            </div>
          </RoboAccordionContent>
        </RoboAccordionItem>
      ))}
    </RoboAccordion>
  ),
};

/** Flat surface style across every theme + mode. */
export const Flat: Story = { render: () => <StyleGrid style='flat' /> };

/** Glass surface style across every theme + mode (affects the overlay panel). */
export const Glass: Story = { render: () => <StyleGrid style='glass' /> };

/** Neumorphism surface style across every theme + mode. */
export const Neumorphism: Story = { render: () => <StyleGrid style='neumorphism' /> };
