import { converter, formatHex, parse } from 'culori';
import { describe, expect, it } from 'vitest';

import { ALL_MODES, ALL_THEMES, getThemeTokens } from './test-utils/theme-tokens';
import {
  MIN_TEXT_CONTRAST,
  colorDistance,
  contrastRatio,
  resolveToken,
} from './test-utils/contrast-ratio';

// a control should be recognisably the same colour in both modes.
//
// Neutral's light mode used a slate blue --primary against dark mode's orange
// (147° apart) and an amber --tertiary against dark mode's teal (130° apart).
// Those do not read as two states of one colour, they read as two different
// colours, which is what prompted this. The theme's own --secondary,
// --destructive, --warning and --success were already doing the right thing:
// identical hue, different lightness. This holds every theme to that.

const toOklch = converter('oklch');

/** Semantic roles a user perceives as "the same control, themed". */
const ROLES = [
  '--primary',
  '--secondary',
  '--tertiary',
  '--destructive',
  '--warning',
  '--success',
] as const;

/**
 * Max hue rotation between modes, in degrees.
 *
 * This is a same-family check, not an exact-match one. The defects that prompted
 * it were 147° (blue vs orange) and 130° (amber vs teal) — genuinely different
 * colours. 25° is far below that and far below the ~40°+ where a hue stops
 * reading as the same colour, while tolerating the wobble already present in the
 * other two brands: Defense's --tertiary sits at 14° and Global's --warning at
 * 20°, both still plainly the same family. Tightening below 14° means retuning
 * two brands nobody asked about; if that is ever wanted, do it deliberately
 * rather than by lowering this number.
 */
const MAX_HUE_SHIFT = 25;

/**
 * Chroma below which hue is not perceptible, so a shift there is not a defect.
 * Surfaces like --accent are intentionally warm in light mode and cool in dark
 * mode; that tracks each mode's own temperature and is not a divergence.
 */
const GREY_CHROMA = 0.03;

function hueOf(token: string, tokens: Record<string, string>) {
  const resolved = resolveToken(token, tokens);
  const color = toOklch(parse(resolved));
  if (!color) throw new Error(`Could not parse ${token} -> ${resolved}`);
  return { h: color.h ?? 0, c: color.c ?? 0 };
}

/** Shortest angular distance between two hues, 0-180. */
function hueGap(a: number, b: number): number {
  const raw = Math.abs(a - b) % 360;
  return raw > 180 ? 360 - raw : raw;
}

// an action colour must not be mistakable for a status colour.
//
// The orange --primary was ΔE 1.8 from the warning orange once warning was dark
// enough to carry white text: a primary button and a warning badge were, for
// practical purposes, the same colour. Primary is now a cool blue/teal in every
// theme and orange means warning again.
//
// Deliberately only semantic pairs — "is that button dangerous?", not "which
// button is more important?". Action roles sitting in adjacent families is fine
// and is checked separately below; a gold secondary next to an orange warning is
// the closest such pair at ΔE 11.8, which is why the shared warning orange is
// pushed to hue 50 rather than sitting nearer the gold.
describe('action colours cannot be confused with status colours', () => {
  const SEMANTIC_PAIRS = [
    ['--primary', '--warning'],
    ['--primary', '--destructive'],
    ['--primary', '--success'],
    ['--tertiary', '--warning'],
    ['--tertiary', '--destructive'],
    ['--secondary', '--warning'],
  ] as const;

  /** ΔE2000 below which two fills read as the same colour. 2 is "just visible"; 10 is comfortably distinct. */
  const MIN_SEMANTIC_DISTANCE = 10;

  for (const theme of ALL_THEMES) {
    for (const mode of ALL_MODES) {
      const tokens = getThemeTokens(theme, mode);

      for (const [action, status] of SEMANTIC_PAIRS) {
        it(`${action} is distinct from ${status} — ${theme}/${mode}`, () => {
          if (tokens[action] === undefined || tokens[status] === undefined) return;
          expect(colorDistance(action, status, tokens)).toBeGreaterThanOrEqual(
            MIN_SEMANTIC_DISTANCE,
          );
        });
      }
    }
  }
});

describe('light and dark stay the same colour family per role', () => {
  for (const theme of ALL_THEMES) {
    const dark = getThemeTokens(theme, 'dark');
    const light = getThemeTokens(theme, 'light');

    for (const role of ROLES) {
      it(`${role} keeps its hue across modes — ${theme}`, () => {
        if (dark[role] === undefined || light[role] === undefined) return;

        const d = hueOf(role, dark);
        const l = hueOf(role, light);

        // Near-grey in either mode: hue is not perceptible, nothing to enforce.
        if (d.c < GREY_CHROMA || l.c < GREY_CHROMA) return;

        expect(hueGap(d.h, l.h)).toBeLessThanOrEqual(MAX_HUE_SHIFT);
      });
    }
  }
});

// a role should be recognisable across themes, and across modes.
//
// "Someone looking at Neutral's secondary button should be able to say 'the gold
// one', and someone in the Robo theme should know which button that is." So each
// role is one colour family in every theme, in a different shade:
//
//   primary    cool blue/teal   #307790  #037A85  #2D6FBE
//   secondary  gold/khaki       #8E691F  #9D6000  #866C02
//   tertiary   grey             #63735F  #6A6F76  #656F84
//
// Two bounds, and the lower one matters as much as the upper. Too far apart and
// the role stops being recognisable; too close and the themes stop being
// distinguishable, which is the failure the first attempt at this had — three
// greys at ΔE 1.1-2.3, effectively the same colour in all three themes.
// NOTE: the themes are now deliberately DIFFERENT hue families per role
// (midnight = indigo, aurora = teal, sol = gold), not one shared family. So this
// only enforces the lower bound — the three themes must stay visually distinct
// from each other — and no longer caps the spread (an action colour is free to be
// a different hue in each theme).
describe('each theme keeps its action roles visually distinct from the other themes', () => {
  const CROSS_THEME_ROLES = ['--primary', '--secondary', '--tertiary'] as const;

  /** Below this, two themes' takes on a role are the same colour — themes stop being distinct. */
  const MIN_SHADE_DIFFERENCE = 3.5;

  for (const role of CROSS_THEME_ROLES) {
    for (const mode of ALL_MODES) {
      const themes = [...ALL_THEMES];

      for (let i = 0; i < themes.length; i++) {
        for (let j = i + 1; j < themes.length; j++) {
          const [a, b] = [themes[i], themes[j]];

          it(`${role} — ${a} vs ${b} (${mode})`, () => {
            const tokensA = getThemeTokens(a, mode);
            const tokensB = getThemeTokens(b, mode);
            if (tokensA[role] === undefined || tokensB[role] === undefined) return;

            // Distance is measured between two different themes, so both colours
            // have to be resolved before comparing — hence the shared token map.
            const distance = colorDistance(tokensA[role], tokensB[role], {});
            expect(distance).toBeGreaterThanOrEqual(MIN_SHADE_DIFFERENCE);
          });
        }
      }
    }
  }
});

// status colours are the opposite rule from action colours.
//
// An action colour is themed: primary/secondary/tertiary each stay one family but
// take a different shade per theme, so the theme stays recognisable. A status
// colour is not themed at all — "this failed" should look identical whichever
// product you are in, and the Active badge was the case that made this obvious:
// dark modes painted it a bright green with dark text, light modes a deep green
// with white text, so the same badge had two different looks in one theme and
// three across them.
//
// So these are asserted to be byte-identical everywhere, and to carry white text
// like every other fill. That is why they are excluded from the cross-theme shade
// band above — there, identical is the failure; here, identical is the point.
describe('status colours are identical across every theme and mode', () => {
  const STATUS_ROLES = ['--success', '--warning', '--destructive'] as const;

  for (const role of STATUS_ROLES) {
    it(`${role} is the same colour everywhere`, () => {
      const seen = new Set<string>();

      for (const theme of ALL_THEMES) {
        for (const mode of ALL_MODES) {
          const tokens = getThemeTokens(theme, mode);
          if (tokens[role] === undefined) continue;
          seen.add(formatHex(parse(resolveToken(role, tokens)))?.toLowerCase() ?? 'unresolved');
        }
      }

      expect([...seen]).toHaveLength(1);
    });

    it(`${role} carries white text everywhere`, () => {
      for (const theme of ALL_THEMES) {
        for (const mode of ALL_MODES) {
          const tokens = getThemeTokens(theme, mode);
          const fg = tokens[`${role}-foreground`];
          if (tokens[role] === undefined || fg === undefined) continue;

          expect(formatHex(parse(resolveToken(fg, tokens)))?.toLowerCase(), `${theme}/${mode}`).toBe(
            '#ffffff',
          );
          expect(contrastRatio(fg, role, tokens), `${theme}/${mode}`).toBeGreaterThanOrEqual(
            MIN_TEXT_CONTRAST,
          );
        }
      }
    });
  }
});
