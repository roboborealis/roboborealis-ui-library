import { describe, expect, it } from 'vitest';

import { ALL_MODES, ALL_THEMES, getThemeTokens } from './test-utils/theme-tokens';
import { MIN_TEXT_CONTRAST, contrastRatio } from './test-utils/contrast-ratio';

// the gap that let the editor toolbar ship unreadable.
//
// Every other contrast test here checks a colour as a FILL: white label on
// primary, primary against the page. Nothing checked a colour used AS TEXT
// directly on a surface, which is what RoboButton's `ghost` and `outline`
// variants do — they are transparent, so the label sits on --card or
// --background. `ghost` used --primary, which is tuned to carry white text, not
// to be text: 2.38:1 on Global's dark card, and five of six theme/modes failed.
//
// The `-text` variants exist for exactly this and are the tokens under test.
// --primary-text was simply missing, and --destructive-text/--success-text had
// been silently broken by an earlier change darkening the colours they were mixed from:
// `color-mix(var(--destructive) 85%, white)` stops clearing 4.5:1 once the base
// is dark enough. They are literals now, so they cannot drift with their base.
describe('on-surface text tokens are readable on every surface they sit on', () => {
  /** Surfaces a transparent control can be placed on. */
  const SURFACES = ['--card', '--background', '--popover'] as const;

  const ON_SURFACE_TEXT = [
    '--primary-text',
    '--destructive-text',
    '--warning-text',
    '--success-text',
    '--secondary-text',
    // The alert family was found by the coverage guard below rather than by hand,
    // which is the point of having it. All five already passed.
    '--alert-emergency-text',
    '--alert-warning-text',
    '--alert-watch-text',
    '--alert-advisory-text',
    '--alert-info-text',
  ] as const;

  for (const theme of ALL_THEMES) {
    for (const mode of ALL_MODES) {
      const tokens = getThemeTokens(theme, mode);

      for (const token of ON_SURFACE_TEXT) {
        for (const surface of SURFACES) {
          it(`${token} on ${surface} — ${theme}/${mode}`, () => {
            if (tokens[token] === undefined || tokens[surface] === undefined) return;
            expect(contrastRatio(token, surface, tokens)).toBeGreaterThanOrEqual(
              MIN_TEXT_CONTRAST,
            );
          });
        }
      }
    }
  }

  // Guards the list itself: a new `--x-text` token added to the themes without
  // being added above would otherwise never be checked.
  it('covers every --*-text token the themes define', () => {
    const defined = new Set<string>();
    for (const theme of ALL_THEMES) {
      for (const mode of ALL_MODES) {
        for (const key of Object.keys(getThemeTokens(theme, mode))) {
          if (key.endsWith('-text')) defined.add(key);
        }
      }
    }
    expect([...defined].sort()).toEqual([...ON_SURFACE_TEXT].sort());
  });
});
