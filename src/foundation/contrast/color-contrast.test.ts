import { describe, expect, it } from 'vitest';

import { createTypeRegistry } from '@/visualizations/registry';
import { ALL_MODES, ALL_THEMES, getThemeTokens } from './test-utils/theme-tokens';
import { MIN_TEXT_CONTRAST, contrastRatio } from './test-utils/contrast-ratio';

// ---------------------------------------------------------------------------
// Enforces real WCAG contrast ratios for every category/marker color used by
// RoboEntityDossier, RoboForceGraph, etc. — catches the class of bug where a
// color renders fine in one theme/mode but fails in another (e.g. the
// relationship-type "Port Call" green, which read fine in dark mode but was
// under 2:1 against the light-mode tab background before this test existed).
//
// culori's `wcagContrast` does the actual color math (relative luminance,
// not a jsdom-inert heuristic) — see contrast-ratio.ts.
// ---------------------------------------------------------------------------

const BACKGROUNDS = ['--card', '--muted'] as const;

const registry = createTypeRegistry();
const categoryColors = [
  ...registry.getEntityTypes().map(({ type, config }) => ({ label: `entity:${type}`, color: config.color })),
  ...registry.getRelationshipTypes().map(({ type, config }) => ({ label: `relationship:${type}`, color: config.color })),
]
  // `var(--muted-foreground)` is the intentional generic/fallback treatment
  // (unknown types, the catch-all `coordinate` type) — per DESIGN.md
  // it's WCAG-exempt (disabled/deemphasized-style text), not a category
  // identity color, so it's excluded from the strict 4.5:1 requirement here.
  .filter(({ color }) => color !== 'var(--muted-foreground)');

describe('category/marker colors meet WCAG AA text contrast (4.5:1)', () => {
  for (const theme of ALL_THEMES) {
    for (const mode of ALL_MODES) {
      const tokens = getThemeTokens(theme, mode);

      for (const bg of BACKGROUNDS) {
        for (const { label, color } of categoryColors) {
          it(`${label} vs ${bg} — ${theme}/${mode}`, () => {
            const ratio = contrastRatio(color, bg, tokens);
            expect(ratio).toBeGreaterThanOrEqual(MIN_TEXT_CONTRAST);
          });
        }
      }
    }
  }
});

// ---------------------------------------------------------------------------
// --secondary-text is the token for ACTIVE secondary text — placeholders, helper
// text, captions, sub-headings. `DESIGN.md` is explicit that
// --muted-foreground is for disabled states only and is WCAG-exempt, so anything a
// user is expected to read must use this token instead.
//
// The existing case below only checks it against --background. A placeholder sits
// inside an input or an editor, so --card and --popover are the surfaces that
// actually matter for it, and neither was covered.
// ---------------------------------------------------------------------------
describe('--secondary-text meets WCAG AA on the surfaces active text sits on', () => {
  const ACTIVE_TEXT_SURFACES = ['--card', '--popover', '--muted'] as const;

  for (const theme of ALL_THEMES) {
    for (const mode of ALL_MODES) {
      const tokens = getThemeTokens(theme, mode);

      for (const bg of ACTIVE_TEXT_SURFACES) {
        it(`--secondary-text vs ${bg} — ${theme}/${mode}`, () => {
          expect(contrastRatio('--secondary-text', bg, tokens)).toBeGreaterThanOrEqual(
            MIN_TEXT_CONTRAST,
          );
        });
      }
    }
  }
});

describe('--muted is visibly distinct from --card (tinted-panel separation)', () => {
  // Floor derived from theme-aurora's dark mode, which the design was
  // explicitly compared against as the "good separation" reference — every
  // theme/mode must be at least this distinguishable, not just technically
  // different.
  const globalDarkTokens = getThemeTokens('aurora', 'dark');
  const SEPARATION_FLOOR = contrastRatio('--muted', '--card', globalDarkTokens);

  for (const theme of ALL_THEMES) {
    for (const mode of ALL_MODES) {
      it(`--muted vs --card — ${theme}/${mode}`, () => {
        const tokens = getThemeTokens(theme, mode);
        const ratio = contrastRatio('--muted', '--card', tokens);
        expect(ratio).toBeGreaterThanOrEqual(SEPARATION_FLOOR - 0.01);
      });
    }
  }
});

describe('sanity net — DESIGN.md-documented pairs stay compliant', () => {
  for (const theme of ALL_THEMES) {
    for (const mode of ALL_MODES) {
      const tokens = getThemeTokens(theme, mode);

      it(`--secondary-text vs --background — ${theme}/${mode}`, () => {
        expect(contrastRatio('--secondary-text', '--background', tokens)).toBeGreaterThanOrEqual(MIN_TEXT_CONTRAST);
      });

      it(`--foreground vs --card — ${theme}/${mode}`, () => {
        expect(contrastRatio('--foreground', '--card', tokens)).toBeGreaterThanOrEqual(MIN_TEXT_CONTRAST);
      });
    }
  }
});
