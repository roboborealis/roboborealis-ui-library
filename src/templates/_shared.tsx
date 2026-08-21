import * as React from 'react';

import type { Mode } from '@/core/providers/robo-theme-provider';

// ---------------------------------------------------------------------------
// Shared layout constants for template archetypes
// ---------------------------------------------------------------------------

export const KPI_GRID: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: 16,
};

/**
 * Appearance options for every template's Settings page.
 *
 * Defined once, deliberately. This list previously lived as five separate copies — one per
 * template — and they drifted: `System` was added to the `Mode` union but reached none of them,
 * so every starter shipped a settings page that could not express the default preference.
 *
 * Bind the control's `value` to `mode` (the stored preference, which may be `system`) and drive
 * styling off `resolvedMode` (always concrete).
 */
export const MODE_OPTIONS: { value: Mode; label: string }[] = [
  { value: 'system', label: 'System' },
  { value: 'dark', label: 'Dark' },
  { value: 'light', label: 'Light' },
];

// ---------------------------------------------------------------------------
// TemplateTopbar — TODO: replace with RoboTopbar or your app's real topbar
// ---------------------------------------------------------------------------

interface TemplateTopbarProps {
  icon: React.ReactNode;
  label: string;
  badge?: React.ReactNode;
}

export function TemplateTopbar({ icon, label, badge }: TemplateTopbarProps) {
  return (
    <div
      style={{
        height: 52,
        display: 'flex',
        alignItems: 'center',
        padding: '0 20px',
        borderBottom: '1px solid var(--border)',
        background: 'var(--card)',
        gap: 12,
      }}
    >
      <span style={{ opacity: 0.6 }}>{icon}</span>
      <span style={{ fontWeight: 700, fontSize: 15 }}>{label}</span>
      {badge}
    </div>
  );
}
