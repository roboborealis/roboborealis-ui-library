import type * as React from 'react';

import type { RoboOsintSeverity } from '../../types';

// ---------------------------------------------------------------------------
// Shared presentation helpers for the entity-dossier sections. Extracted from
// robo-entity-dossier.tsx so the section components can live in their own files
// while sharing one copy of the risk/confidence/severity colour mapping.
// ---------------------------------------------------------------------------

/** Returns a confidence bar color based on the 0–1 score. */
export function confidenceColor(confidence: number): string {
  if (confidence >= 0.7) return 'var(--color-green-500, #22c55e)';
  if (confidence >= 0.4) return 'var(--color-amber-500, #f59e0b)';
  return 'var(--color-red-500, #ef4444)';
}

/** Returns inline background color style for a risk score (0–100). */
export function riskBadgeStyle(score: number): React.CSSProperties {
  if (score >= 75) return { backgroundColor: 'var(--color-red-600, #dc2626)', color: '#fff' };
  if (score >= 50) return { backgroundColor: 'var(--color-orange-500, #f97316)', color: '#fff' };
  if (score >= 25) return { backgroundColor: 'var(--color-amber-500, #f59e0b)', color: '#000' };
  return { backgroundColor: 'var(--color-green-600, #16a34a)', color: '#fff' };
}

export function riskLabel(score: number): string {
  if (score >= 75) return 'Critical';
  if (score >= 50) return 'High';
  if (score >= 25) return 'Medium';
  return 'Low';
}

/** Returns a dot color for event severity. */
export function severityDotStyle(severity: RoboOsintSeverity | undefined): React.CSSProperties {
  switch (severity) {
    case 'critical': return { backgroundColor: 'var(--color-red-600, #dc2626)' };
    case 'high':     return { backgroundColor: 'var(--color-orange-500, #f97316)' };
    case 'medium':   return { backgroundColor: 'var(--color-amber-500, #f59e0b)' };
    case 'low':      return { backgroundColor: 'var(--color-blue-500, #3b82f6)' };
    case 'info':
    default:         return { backgroundColor: 'var(--muted-foreground)' };
  }
}

export const SECTION_HEADER_CLASS =
  'text-xs font-semibold uppercase tracking-widest text-[var(--muted-foreground)]';

export const MAX_EVENTS_SHOWN = 20;
