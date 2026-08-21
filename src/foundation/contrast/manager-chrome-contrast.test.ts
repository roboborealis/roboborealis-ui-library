import { formatHex } from 'culori';
import { describe, expect, it } from 'vitest';

import { TOKEN_MAP } from '../../../designer/.storybook/token-map';
import { MIN_TEXT_CONTRAST, contrastRatio } from './test-utils/contrast-ratio';
import { getThemeTokens, type RoboThemeMode, type RoboThemeName } from './test-utils/theme-tokens';

// Storybook's manager runs outside the preview iframe and cannot read the theme
// CSS, so its chrome colours are transcribed into TOKEN_MAP by hand. Two things
// went wrong with that, and this file guards both.
//
// Readability: `sol-light` was transcribed from the light-mode
// `--primary`, which belongs on the pale content background, while the toolbar is
// painted `--sidebar-background`. 2.07:1, unreadable.
//
// Fidelity: Readability alone was not enough: every entry's accent was
// `#F88E63`, which is `--sidebar-primary` for no theme at all, so all three themes
// rendered identically and Aurora's own accent was never shown. Contrast tests
// cannot catch that, because a wrong colour can still be perfectly readable.

/** Chrome colours painted directly onto `barBg`. Each must stay readable there. */
const BAR_FOREGROUNDS = ['barSelectedColor', 'textColor', 'barTextColor'] as const;

/**
 * Every chrome key that is a transcription of a theme token, and the token it
 * must equal. A later change extended this from the accent alone to the surfaces and
 * foreground, so Storybook's own chrome now demonstrably shows what a consuming
 * app shows.
 *
 * `appBorderColor` and the `input*` keys are absent on purpose: they have no
 * single unambiguous counterpart (Storybook draws one border colour where the
 * themes distinguish `--border` from `--sidebar-border`), so asserting one would
 * be inventing a mapping rather than checking a transcription.
 */
const TRANSCRIBED: ReadonlyArray<readonly [chromeKey: string, token: string]> = [
  ['barSelectedColor', '--sidebar-primary'],
  ['colorPrimary', '--sidebar-primary'],
  ['colorSecondary', '--sidebar-primary'],
  ['appBg', '--sidebar-background'],
  ['barBg', '--sidebar-background'],
  ['textInverseColor', '--sidebar-background'],
  ['textColor', '--sidebar-foreground'],
  ['appContentBg', '--background'],
  ['appPreviewBg', '--background'],
];

function splitEntry(entry: string): { theme: RoboThemeName; mode: RoboThemeMode } {
  const [theme, mode] = entry.split('-');
  return { theme: theme as RoboThemeName, mode: mode as RoboThemeMode };
}

describe('Storybook manager chrome meets WCAG AA against its own toolbar', () => {
  it('covers every theme/mode combination', () => {
    expect(Object.keys(TOKEN_MAP).sort()).toEqual([
      'aurora-dark',
      'aurora-light',
      'midnight-dark',
      'midnight-light',
      'sol-dark',
      'sol-light',
    ]);
  });

  for (const [entry, colors] of Object.entries(TOKEN_MAP)) {
    for (const key of BAR_FOREGROUNDS) {
      it(`${key} vs barBg — ${entry}`, () => {
        expect(contrastRatio(colors[key], colors.barBg, {})).toBeGreaterThanOrEqual(
          MIN_TEXT_CONTRAST,
        );
      });
    }
  }
});

describe('Storybook manager chrome is a faithful transcription of the theme', () => {
  for (const [entry, colors] of Object.entries(TOKEN_MAP)) {
    const { theme, mode } = splitEntry(entry);

    for (const [key, token] of TRANSCRIBED) {
      it(`${key} equals ${token} — ${entry}`, () => {
        const tokens = getThemeTokens(theme, mode);
        const expected = formatHex(tokens[token]);
        expect(expected, `${theme}/${mode} has no ${token}`).toBeTruthy();

        // Compared as hex, not as a string, so an equivalent oklch/hex spelling
        // in the theme CSS does not fail — only a genuinely different colour does.
        expect(formatHex(colors[key])?.toLowerCase()).toBe(expected?.toLowerCase());
      });
    }
  }
});

describe('--sidebar-primary is usable where the sidebar actually puts it', () => {
  // The drift hid a real accessibility failure: Aurora's accent measured 3.07:1
  // on its own sidebar. That is a live defect for consuming apps, not just for
  // Storybook, since RoboSidebar uses these tokens directly.
  for (const theme of ['midnight', 'aurora', 'sol'] as const) {
    for (const mode of ['dark', 'light'] as const) {
      const tokens = getThemeTokens(theme, mode);

      it(`--sidebar-primary vs --sidebar-background — ${theme}/${mode}`, () => {
        expect(
          contrastRatio('--sidebar-primary', '--sidebar-background', tokens),
        ).toBeGreaterThanOrEqual(MIN_TEXT_CONTRAST);
      });

      it(`--sidebar-primary-foreground vs --sidebar-primary — ${theme}/${mode}`, () => {
        expect(
          contrastRatio('--sidebar-primary-foreground', '--sidebar-primary', tokens),
        ).toBeGreaterThanOrEqual(MIN_TEXT_CONTRAST);
      });
    }
  }
});
