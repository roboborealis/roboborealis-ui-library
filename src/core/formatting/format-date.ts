import { format } from 'date-fns';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type DateFormatId = 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD' | 'MMM D, YYYY';

// ---------------------------------------------------------------------------
// Patterns
// ---------------------------------------------------------------------------

const DATE_FNS_PATTERNS: Record<DateFormatId, string> = {
  'MM/DD/YYYY': 'MM/dd/yyyy',
  'DD/MM/YYYY': 'dd/MM/yyyy',
  'YYYY-MM-DD': 'yyyy-MM-dd',
  'MMM D, YYYY': 'MMM d, yyyy',
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Reinterprets a Date's UTC fields as local, so date-fns' local-time-based
 * `format()` prints the true UTC calendar date/time. This app's data is UTC
 * throughout (satellite telemetry timestamps) — avoids adding date-fns-tz as a
 * second date dependency just to force UTC formatting.
 */
function toUtcShifted(d: Date): Date {
  return new Date(
    d.getUTCFullYear(),
    d.getUTCMonth(),
    d.getUTCDate(),
    d.getUTCHours(),
    d.getUTCMinutes(),
    d.getUTCSeconds(),
  );
}

function parseInput(input: Date | string | number | null | undefined): Date | null {
  if (input == null) return null;
  const d = input instanceof Date ? input : new Date(input);
  return isNaN(d.getTime()) ? null : d;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/** Formats just the date portion. Returns '—' for null/invalid input. */
export function formatDate(
  input: Date | string | number | null | undefined,
  formatId: DateFormatId,
): string {
  const d = parseInput(input);
  return d ? format(toUtcShifted(d), DATE_FNS_PATTERNS[formatId]) : '—';
}

/**
 * Date portion (per the format setting) plus a fixed 24h UTC time suffix, for
 * displays that show a precise instant rather than just a calendar date.
 */
export function formatDateTime(
  input: Date | string | number | null | undefined,
  formatId: DateFormatId,
): string {
  const d = parseInput(input);
  return d ? format(toUtcShifted(d), `${DATE_FNS_PATTERNS[formatId]} HH:mm:ss'Z'`) : '—';
}

/** Dropdown options for a date-format setting — each label embeds a live example. */
export const DATE_FORMAT_OPTIONS: { value: DateFormatId; label: string }[] = (
  Object.keys(DATE_FNS_PATTERNS) as DateFormatId[]
).map((value) => ({
  value,
  label: `${value} (${formatDate(new Date(), value)})`,
}));
