// Storybook chrome colours per theme × mode, transcribed by hand from
// themes/theme-*.css. Storybook's manager runs outside the preview iframe and
// cannot read the CSS custom properties, so these are literal hexes.
//
// Two rules govern a transcription,:
//
// 1. Anything painted on `barBg` or `appBg` takes a `--sidebar-*` token, never
//    `--primary`. `--primary` is scoped to the content area, so in light mode
//    it is a dark colour chosen to sit on a pale surface — on the dark bar it
//    disappears. `sol-light` shipped `--primary` there at 2.07:1.
// 2. All six entries use base:'dark' because Robo has dark sidebars in every
//    mode. base:'light' makes Storybook inject light-chrome CSS that overrides
//    appBg and turns the sidebar white; content-area colours are overridden
//    individually instead.
//
// `src/foundation/contrast/manager-chrome-contrast.test.ts` enforces both rules.
// It measures every bar colour against its own `barBg`, AND asserts that each
// value below equals the theme token it claims to transcribe — so these cannot
// drift from the themes again. Every value here is therefore derived, not chosen:
// change the theme, then change this, and the test will tell you if they disagree.
//
// That fidelity check is why an earlier fix had to correct the themes first. Until then
// every entry used `#F88E63`, which was `--sidebar-primary` for no theme at all,
// so all three themes rendered identically here and Aurora's own accent was never
// shown. Contrast checks could never have caught that: a wrong colour can still be
// perfectly readable.
//
// Lives in its own module, free of side effects, so that test can import it —
// manager.ts calls `addons.setConfig()` at module scope.
export const TOKEN_MAP = {
  'midnight-dark': {
    base: 'dark' as const,
    appBg: '#120226',            // = --sidebar-background (deep purple)
    appContentBg: '#0d011e',     // = --background
    appPreviewBg: '#0d011e',
    appBorderColor: '#2a2e52',
    barBg: '#120226',
    barSelectedColor: '#a376e9', // = --sidebar-primary (purple)
    barHoverColor: '#e4e6f6',
    barTextColor: '#9aa0c8',
    textColor: '#d9d5e3',        // = --sidebar-foreground
    textMutedColor: '#9aa0c8',
    textInverseColor: '#120226',
    colorPrimary: '#a376e9',
    colorSecondary: '#a376e9',
    inputBg: '#1a1e3e',
    inputBorder: '#2a2e52',
    inputTextColor: '#e4e6f6',
    inputBorderRadius: 4,
  },
  'midnight-light': {
    base: 'dark' as const,       // sidebar stays dark; content overridden below
    appBg: '#120226',            // = --sidebar-background (deep purple)
    appContentBg: '#ebe4fa',     // = --background (soft lavender pastel)
    appPreviewBg: '#ebe4fa',
    appBorderColor: '#dcdff0',
    barBg: '#120226',            // toolbar matches sidebar
    barSelectedColor: '#a376e9', // = --sidebar-primary
    barHoverColor: '#e4e6f6',
    barTextColor: '#9aa0c8',
    textColor: '#d9d5e3',        // = --sidebar-foreground
    textMutedColor: '#9aa0c8',
    textInverseColor: '#120226',
    inputBg: '#1a1e3e',
    inputBorder: '#2a2e52',
    inputTextColor: '#e4e6f6',
    colorPrimary: '#a376e9',
    colorSecondary: '#a376e9',
    inputBorderRadius: 4,
  },
  'aurora-light': {
    base: 'dark' as const,       // sidebar stays dark; content overridden below
    appBg: '#3e1759',            // = --sidebar-background, the brand deep purple
    appContentBg: '#d3efeb',     // = --background (pale mint)
    appPreviewBg: '#d3efeb',
    appBorderColor: '#51316b',
    barBg: '#3e1759',            // toolbar matches sidebar
    barSelectedColor: '#bca1ed', // = --sidebar-primary, Aurora's lavender
    barHoverColor: '#ded3f5',
    barTextColor: '#a299b4',
    textColor: '#e6e2f0',
    textMutedColor: '#a299b4',
    textInverseColor: '#3e1759',
    colorPrimary: '#bca1ed',
    colorSecondary: '#bca1ed',
    inputBg: '#573771',
    inputBorder: '#684783',
    inputTextColor: '#f0ecfa',
    inputBorderRadius: 8,
  },
  'aurora-dark': {
    base: 'dark' as const,
    appBg: '#3e1759',
    appContentBg: '#00131d',
    appPreviewBg: '#00131d',
    appBorderColor: '#51316b',
    barBg: '#3e1759',
    barSelectedColor: '#bca1ed',
    barHoverColor: '#F5F5F5',
    barTextColor: '#A6A6A6',
    textColor: '#e6e2f0',
    textMutedColor: '#A6A6A6',
    textInverseColor: '#3e1759',
    colorPrimary: '#bca1ed',
    colorSecondary: '#bca1ed',
    inputBg: '#573771',
    inputBorder: '#684783',
    inputTextColor: '#F5F5F5',
    inputBorderRadius: 8,
  },
  'sol-dark': {
    base: 'dark' as const,
    appBg: '#211208',            // = --sidebar-background
    appContentBg: '#180c05',     // = --background
    appPreviewBg: '#180c05',
    appBorderColor: '#3A3C3E',
    barBg: '#211208',
    barSelectedColor: '#e1a01d', // = --sidebar-primary, the theme primary lightened for the sidebar
    barHoverColor: '#E4E8EC',
    barTextColor: '#8D9399',
    textColor: '#e7dcd0',
    textMutedColor: '#8D9399',
    textInverseColor: '#211208',
    colorPrimary: '#e1a01d',
    colorSecondary: '#e1a01d',
    inputBg: '#292B2D',
    inputBorder: '#3A3C3E',
    inputTextColor: '#E4E8EC',
    inputBorderRadius: 4,
  },
  'sol-light': {
    base: 'dark' as const,       // sidebar stays dark; content overridden below
    appBg: '#211208',            // = --sidebar-background, same in both modes
    appContentBg: '#f5e9d9',     // = --background (soft warm-cream pastel)
    appPreviewBg: '#f5e9d9',
    appBorderColor: '#D8D4CE',
    barBg: '#211208',
    barSelectedColor: '#e1a01d', // = --sidebar-primary; the bar is dark in light mode too
    barHoverColor: '#E8E4DF',
    barTextColor: '#8D9399',
    textColor: '#e7dcd0',
    textMutedColor: '#8D9399',
    textInverseColor: '#211208',
    colorPrimary: '#e1a01d',
    colorSecondary: '#e1a01d',
    inputBg: '#23282B',
    inputBorder: '#3A3C3E',
    inputTextColor: '#E4E8EC',
    inputBorderRadius: 4,
  },
} as const;

export type ThemeKey = keyof typeof TOKEN_MAP;
