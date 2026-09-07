import { format } from 'date-fns';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type DateFormatId =
  | 'MM/DD/YYYY'
  | 'M/D/YYYY'
  | 'MM.DD.YYYY'
  | 'MM-DD-YYYY'
  | 'DD/MM/YYYY'
  | 'YYYY-MM-DD'
  | 'MMM D, YYYY'
  | 'MMMM D, YYYY'
  | 'MMMM Do, YYYY'
  | 'ddd, MMM D, YYYY';

// ---------------------------------------------------------------------------
// Patterns
// ---------------------------------------------------------------------------

const DATE_FNS_PATTERNS: Record<DateFormatId, string> = {
  'MM/DD/YYYY': 'MM/dd/yyyy',
  'M/D/YYYY': 'M/d/yyyy',
  'MM.DD.YYYY': 'MM.dd.yyyy',
  'MM-DD-YYYY': 'MM-dd-yyyy',
  'DD/MM/YYYY': 'dd/MM/yyyy',
  'YYYY-MM-DD': 'yyyy-MM-dd',
  'MMM D, YYYY': 'MMM d, yyyy',
  'MMMM D, YYYY': 'MMMM d, yyyy',
  'MMMM Do, YYYY': 'MMMM do, yyyy',
  'ddd, MMM D, YYYY': 'EEE, MMM d, yyyy',
};

/**
 * date-fns pattern for the spelled-out long form shown in date tooltips,
 * e.g. "March 9th, 2026" — independent of the user's chosen display format.
 */
const LONG_DATE_PATTERN = 'MMMM do, yyyy';

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

/**
 * Long, spelled-out date for tooltips/hover, e.g. "March 9th, 2026". Fixed form,
 * not affected by the display-format setting. Returns '—' for null/invalid input.
 */
export function formatDateLong(input: Date | string | number | null | undefined): string {
  const d = parseInput(input);
  return d ? format(toUtcShifted(d), LONG_DATE_PATTERN) : '—';
}

/** Dropdown options for a date-format setting — each label embeds a live example. */
export const DATE_FORMAT_OPTIONS: { value: DateFormatId; label: string }[] = (
  Object.keys(DATE_FNS_PATTERNS) as DateFormatId[]
).map((value) => ({
  value,
  label: `${value} (${formatDate(new Date(), value)})`,
}));
