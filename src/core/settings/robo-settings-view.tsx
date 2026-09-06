'use client';

import * as React from 'react';

import { RoboCard, RoboCardBody } from '@/core/card/robo-card';
import { useTheme, type Theme, type Mode } from '@/core/providers/robo-theme-provider';
import { useDensity, type Density } from '@/core/providers/robo-density-provider';
import { useFontFamily, type FontFamily } from '@/core/providers/robo-font-family-provider';
import { useDateFormat, type DateFormatId } from '@/core/providers/robo-date-format-provider';
import { DATE_FORMAT_OPTIONS } from '@/core/formatting/format-date';

// ---------------------------------------------------------------------------
// A reusable settings page for the display preferences every app built on this
// library shares: color theme, light/dark/system mode, density, font family, and
// date format. Each control is bound to the matching provider hook and persists
// via that provider's storage adapter, so a choice survives a reload.
//
// Drop it under RoboAppProviders (or your own equivalent provider stack) and
// wire a sidebar footer item to its route:
//
//   footerItems={[{ id: 'settings', label: 'Settings',
//                   icon: <Settings size={18} />, href: '/settings' }]}
//
// Each section only calls its own provider's hook, so `sections` lets you drop
// any control whose provider you have not mounted.
// ---------------------------------------------------------------------------

export type RoboSettingSection = 'theme' | 'mode' | 'density' | 'font' | 'dateFormat';

const DEFAULT_SECTIONS: RoboSettingSection[] = ['theme', 'mode', 'density', 'font', 'dateFormat'];

const THEME_OPTIONS: { value: Theme; label: string }[] = [
  { value: 'midnight', label: 'Midnight (dark)' },
  { value: 'aurora', label: 'Aurora (light)' },
  { value: 'sol', label: 'Sol (warm)' },
];

const MODE_OPTIONS: { value: Mode; label: string }[] = [
  { value: 'dark', label: 'Dark' },
  { value: 'light', label: 'Light' },
  { value: 'system', label: 'Match system' },
];

const DENSITY_OPTIONS: { value: Density; label: string }[] = [
  { value: 'compact', label: 'Compact' },
  { value: 'comfortable', label: 'Comfortable' },
  { value: 'spacious', label: 'Spacious' },
];

// The library ships no font-options constant, so declare one from the FontFamily
// union. opendyslexic is labelled for what it does, not by its raw name.
const FONT_FAMILY_OPTIONS: { value: FontFamily; label: string }[] = [
  { value: 'inter', label: 'Inter' },
  { value: 'dm-sans', label: 'DM Sans' },
  { value: 'varela', label: 'Varela Round' },
  { value: 'open-sans', label: 'Open Sans' },
  { value: 'sora', label: 'Sora' },
  { value: 'opendyslexic', label: 'OpenDyslexic (accessibility font for dyslexic readers)' },
];

const rootStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: 640,
  margin: '0 auto',
  display: 'flex',
  flexDirection: 'column',
  gap: 24,
};

const fieldsStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
};

const selectStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px 10px',
  borderRadius: 8,
  border: '1px solid var(--border)',
  background: 'var(--background)',
  color: 'var(--foreground)',
  fontSize: '0.875rem',
};

// A labelled native select bound to a typed setter. Native because it is fully
// accessible with no extra wiring and cannot drift from the union it edits.
function SettingField<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: readonly { value: T; label: string }[];
  onChange: (value: T) => void;
}) {
  const id = React.useId();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label htmlFor={id} style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--foreground)' }}>
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        style={selectStyle}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

// Each section calls only its own provider's hook, so a section can be omitted
// when its provider is not mounted.
function ThemeSection() {
  const { theme, setTheme } = useTheme();
  return <SettingField label="Color theme" value={theme} options={THEME_OPTIONS} onChange={setTheme} />;
}

function ModeSection() {
  const { mode, setMode } = useTheme();
  return <SettingField label="Appearance mode" value={mode} options={MODE_OPTIONS} onChange={setMode} />;
}

function DensitySection() {
  const { density, setDensity } = useDensity();
  return <SettingField label="Density" value={density} options={DENSITY_OPTIONS} onChange={setDensity} />;
}

function FontSection() {
  const { fontFamily, setFontFamily } = useFontFamily();
  return <SettingField label="Font" value={fontFamily} options={FONT_FAMILY_OPTIONS} onChange={setFontFamily} />;
}

function DateFormatSection() {
  const { dateFormat, setDateFormat } = useDateFormat();
  return (
    <SettingField
      label="Date format"
      value={dateFormat}
      options={DATE_FORMAT_OPTIONS}
      onChange={setDateFormat as (value: DateFormatId) => void}
    />
  );
}

export interface RoboSettingsViewProps {
  /** Which controls to render, in order. Default: all five. */
  sections?: RoboSettingSection[];
  /** Page heading. Default: "Settings". */
  title?: string;
  /** Optional sub-heading under the title. */
  description?: string;
  /** Class applied to the root element. */
  className?: string;
}

/**
 * The library's default settings page. Renders one labelled control per section,
 * each bound to the matching provider hook. Mount it under `RoboAppProviders`.
 */
export function RoboSettingsView({
  sections = DEFAULT_SECTIONS,
  title = 'Settings',
  description,
  className,
}: RoboSettingsViewProps) {
  return (
    <div className={className} style={rootStyle}>
      <div>
        <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: 'var(--foreground)' }}>
          {title}
        </h1>
        {description ? (
          <p style={{ margin: '4px 0 0', fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
            {description}
          </p>
        ) : null}
      </div>

      <RoboCard>
        <RoboCardBody>
          <div style={fieldsStyle}>
            {sections.includes('theme') && <ThemeSection />}
            {sections.includes('mode') && <ModeSection />}
            {sections.includes('density') && <DensitySection />}
            {sections.includes('font') && <FontSection />}
            {sections.includes('dateFormat') && <DateFormatSection />}
          </div>
        </RoboCardBody>
      </RoboCard>
    </div>
  );
}

RoboSettingsView.displayName = 'RoboSettingsView';
