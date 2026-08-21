/**
 * RoboBorealis Color Tokens
 *
 * A reference brand palette, theme accent colors, and shared semantic colors.
 * Hex values are the immutable source of truth for programmatic color access —
 * chart palettes, dynamic styling, and tests.
 *
 * Layer architecture:
 *   Reference brand palette (brandColors)
 *       └─> Theme accent colors (accentColors)
 *               └─> CSS Custom Properties (themes/theme-midnight.css, themes/theme-aurora.css)
 *                       └─> TailwindCSS Utilities (@theme inline)
 */

// ---------------------------------------------------------------------------
// Reference Brand Palette
// ---------------------------------------------------------------------------

/** Blue | #006BA6 | Primary brand color */
export const BRAND_BLUE = '#006BA6' as const;

/** Red | #E03C31 | Errors, destructive actions, alerts */
export const BRAND_RED = '#E03C31' as const;

/** Gold | #FAE100 | Warning and highlight color */
export const BRAND_GOLD = '#FAE100' as const;

/** Silver | #A2AAAD | Neutral metallic accent */
export const BRAND_SILVER = '#A2AAAD' as const;

/** Black | #101820 | Primary text and dark backgrounds */
export const BRAND_BLACK = '#101820' as const;

/** White | #FFFFFF | Backgrounds and inverse text */
export const BRAND_WHITE = '#FFFFFF' as const;

/** Scarlet | #BA0C2F */
export const BRAND_SCARLET = '#BA0C2F' as const;

/** Brown | #B86125 */
export const BRAND_BROWN = '#B86125' as const;

/** Deep blue | #001489 */
export const BRAND_DEEP_BLUE = '#001489' as const;

/** Light blue | #00C1D5 */
export const BRAND_LIGHT_BLUE = '#00C1D5' as const;

/** Flag red | #BF0D3E */
export const FLAG_RED = '#BF0D3E' as const;

/** Flag blue (very dark navy) | #041E42 */
export const FLAG_BLUE = '#041E42' as const;

/** Accent red | #E4002B */
export const PALETTE_RED = '#E4002B' as const;

/** Accent blue | #012169 */
export const PALETTE_BLUE = '#012169' as const;

/** Accent light blue | #00A3E0 */
export const PALETTE_LIGHT_BLUE = '#00A3E0' as const;

/** Accent blue tint | #8094DD */
export const PALETTE_BLUE_ACCENT = '#8094DD' as const;

/** Dark blue | #003366 */
export const NEUTRAL_DARK_BLUE = '#003366' as const;

/** Gray | #999999 */
export const NEUTRAL_GRAY = '#999999' as const;

/** Deep red | #CC0033 */
export const NEUTRAL_RED = '#CC0033' as const;

/** Mid blue | #006699 */
export const NEUTRAL_LIGHT_BLUE = '#006699' as const;

/** Green | #339900 */
export const NEUTRAL_GREEN = '#339900' as const;

// ---------------------------------------------------------------------------
// Theme Accent Colors
// ---------------------------------------------------------------------------

/** Midnight primary — orange | #BB5600 */
export const ACCENT_PRIMARY = '#BB5600' as const;

/** Secondary — teal accent | #00888F */
export const ACCENT_SECONDARY = '#00888F' as const;

/** Sidebar green | #1A3A2A */
export const ACCENT_SIDEBAR = '#1A3A2A' as const;

/** Aurora primary — deep teal-green | #00888F */
export const ACCENT_PRIMARY_LIGHT = '#00888F' as const;

/** Aurora surface — cream blush | #FAF5F7 */
export const ACCENT_SURFACE = '#FAF5F7' as const;

// ---------------------------------------------------------------------------
// Shared Semantic Colors
// ---------------------------------------------------------------------------

/** Tertiary / tag color — Purple | #A855F7 */
export const COLOR_TERTIARY = '#A855F7' as const;

/** Error / destructive — #E03C31 */
export const COLOR_ERROR = BRAND_RED;
export const COLOR_DESTRUCTIVE = BRAND_RED;

/** Warning state — #FAE100 */
export const COLOR_WARNING = BRAND_GOLD;

/**
 * Success state. Chosen for WCAG AA contrast against white.
 */
export const COLOR_SUCCESS = '#1E7B34' as const;

/** Info — #006699 */
export const COLOR_INFO = '#006699' as const;

// ---------------------------------------------------------------------------
// Neutral / Gray Scale (Black as anchor)
// ---------------------------------------------------------------------------

export const COLOR_NEUTRAL = {
  '0': BRAND_WHITE,
  '50': '#F8F9FA',
  '100': '#F1F3F5',
  '200': '#E9ECEF',
  '300': '#DEE2E6',
  '400': '#CED4DA',
  '500': BRAND_SILVER,
  '600': '#6C757D',
  '700': '#495057',
  '800': '#343A40',
  '900': '#212529',
  '1000': BRAND_BLACK,
} as const;

// ---------------------------------------------------------------------------
// Background Colors
// ---------------------------------------------------------------------------

export const COLOR_BACKGROUND = {
  default: BRAND_WHITE,
  paper: COLOR_NEUTRAL['50'],
  elevated: BRAND_WHITE,
  dark: '#0F1923',
  darkPaper: '#1A2330',
} as const;

// ---------------------------------------------------------------------------
// Text Colors
// ---------------------------------------------------------------------------

export const COLOR_TEXT = {
  primary: COLOR_NEUTRAL['900'],
  secondary: COLOR_NEUTRAL['600'],
  disabled: COLOR_NEUTRAL['500'],
  inverse: BRAND_WHITE,
  onPrimary: BRAND_WHITE,
} as const;

// ---------------------------------------------------------------------------
// Consolidated export objects
// ---------------------------------------------------------------------------

export const brandColors = {
  // Primary
  brandBlue: BRAND_BLUE,
  brandRed: BRAND_RED,
  // Core
  brandGold: BRAND_GOLD,
  brandSilver: BRAND_SILVER,
  brandBlack: BRAND_BLACK,
  brandWhite: BRAND_WHITE,
  // Secondary
  brandScarlet: BRAND_SCARLET,
  brandBrown: BRAND_BROWN,
  brandDeepBlue: BRAND_DEEP_BLUE,
  brandLightBlue: BRAND_LIGHT_BLUE,
  // Flag
  flagRed: FLAG_RED,
  flagBlue: FLAG_BLUE,
  // Palette
  paletteRed: PALETTE_RED,
  paletteBlue: PALETTE_BLUE,
  paletteLightBlue: PALETTE_LIGHT_BLUE,
  paletteBlueAccent: PALETTE_BLUE_ACCENT,
  // Neutral
  neutralDarkBlue: NEUTRAL_DARK_BLUE,
  neutralGray: NEUTRAL_GRAY,
  neutralRed: NEUTRAL_RED,
  neutralLightBlue: NEUTRAL_LIGHT_BLUE,
  neutralGreen: NEUTRAL_GREEN,
} as const;

export type BrandColorKey = keyof typeof brandColors;

export const accentColors = {
  primary: ACCENT_PRIMARY,
  secondary: ACCENT_SECONDARY,
  sidebar: ACCENT_SIDEBAR,
  primaryLight: ACCENT_PRIMARY_LIGHT,
  surface: ACCENT_SURFACE,
} as const;

export const semanticColors = {
  tertiary: COLOR_TERTIARY,
  error: COLOR_ERROR,
  destructive: COLOR_DESTRUCTIVE,
  warning: COLOR_WARNING,
  success: COLOR_SUCCESS,
  info: COLOR_INFO,
  neutral: COLOR_NEUTRAL,
  background: COLOR_BACKGROUND,
  text: COLOR_TEXT,
} as const;

export type SemanticColorKey = keyof typeof semanticColors;
