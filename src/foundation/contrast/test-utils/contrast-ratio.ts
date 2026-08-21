import { differenceCiede2000, formatHex, interpolate, parse, wcagContrast } from 'culori';

const MAX_VAR_INDIRECTION = 5;

/** WCAG AA minimum contrast for normal-size text. Shared so an AA/AAA change lands in one place. */
export const MIN_TEXT_CONTRAST = 4.5;

/** Resolves a CSS value that may be a `var(--token)` reference (including one
 *  token pointing at another token) down to a raw, culori-parseable color
 *  string. Non-`var()` values (raw `oklch(...)`, hex, etc.) pass through
 *  unchanged. */
/**
 * `color-mix(in oklch, var(--x) 85%, white)` — the themes' idiom for "this colour,
 * nudged toward white/black".
 *
 * These were invisible to these tests until an earlier change: `wcagContrast` cannot parse a
 * `color-mix()` string, so every assertion touching one threw rather than failed,
 * and the alert `-text` family went unmeasured entirely. Resolving it here is what
 * makes those tokens testable.
 */
const COLOR_MIX = /^color-mix\(\s*in\s+oklch\s*,\s*(.+?)\s+([\d.]+)%\s*,\s*(.+?)\s*\)$/;

function resolveColorMix(value: string, tokens: Record<string, string>): string | null {
  const match = value.match(COLOR_MIX);
  if (!match) return null;

  const [, baseRaw, percentRaw, otherRaw] = match;
  const base = parse(resolveToken(baseRaw, tokens));
  const other = parse(resolveToken(otherRaw, tokens));
  if (!base || !other) return null;

  // `85%` means 85% of base, so the interpolation sits 15% of the way to `other`.
  const towardOther = 1 - Number(percentRaw) / 100;
  const mixed = interpolate([base, other], 'oklch')(towardOther);
  return formatHex(mixed) ?? null;
}

export function resolveToken(value: string, tokens: Record<string, string>): string {
  let current = value.trim();
  for (let i = 0; i < MAX_VAR_INDIRECTION; i++) {
    const mixed = resolveColorMix(current, tokens);
    if (mixed) return mixed;

    // Accept both `var(--token)` and a bare `--token` (the latter lets
    // callers pass token names directly, e.g. contrastRatio('--muted', ...)).
    const varMatch = current.match(/^var\((--[a-zA-Z0-9-]+)\)$/);
    const bareMatch = !varMatch && /^--[a-zA-Z0-9-]+$/.test(current) ? current : null;
    const tokenName = varMatch?.[1] ?? bareMatch;
    if (!tokenName) return current;
    const resolved = tokens[tokenName];
    if (resolved === undefined) {
      throw new Error(`Unknown token referenced: ${tokenName}`);
    }
    current = resolved.trim();
  }
  throw new Error(`Too many levels of var() indirection resolving: ${value}`);
}

/** WCAG contrast ratio between two colors/tokens, resolving `var(--x)` references against `tokens` first. */
export function contrastRatio(fg: string, bg: string, tokens: Record<string, string>): number {
  const resolvedFg = resolveToken(fg, tokens);
  const resolvedBg = resolveToken(bg, tokens);
  const ratio = wcagContrast(resolvedFg, resolvedBg);
  if (ratio === undefined || Number.isNaN(ratio)) {
    throw new Error(`Could not compute contrast between "${resolvedFg}" (from ${fg}) and "${resolvedBg}" (from ${bg})`);
  }
  return ratio;
}

const deltaE2000 = differenceCiede2000();

/**
 * Perceptual distance (ΔE2000) between two colours or tokens. ~2 is "just
 * visible", ~10 is comfortably distinct.
 *
 * NOTE THE `formatHex` CALLS. `differenceCiede2000` silently misreads an
 * `oklch(...)` string — it returned 18.51 for a pair whose true distance is 1.75,
 * apparently treating the chroma and hue numbers as Lab a/b. That produced wrong
 * figures in an earlier change before it was caught. Converting to hex first is what makes
 * this correct, so do not "simplify" it away.
 */
export function colorDistance(a: string, b: string, tokens: Record<string, string>): number {
  const hexA = formatHex(parse(resolveToken(a, tokens)));
  const hexB = formatHex(parse(resolveToken(b, tokens)));
  if (!hexA || !hexB) throw new Error(`Could not resolve "${a}" or "${b}" to a colour`);

  const distance = deltaE2000(hexA, hexB);
  if (Number.isNaN(distance)) throw new Error(`Could not measure distance ${hexA} vs ${hexB}`);
  return distance;
}
