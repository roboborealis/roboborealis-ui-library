---
name: "@roboborealis/components"
version: "0.2.0"
spec: "design.md/alpha"
description: >
  Shared design system for RoboBorealis (US) and RoboBorealis (UK).
  Two brand themes, WCAG 2.1 AA compliant, self-contained environments.
  Machine-readable token spec (design.md/alpha). The human/agent RULES digest
  (WCAG usage rules, focus rings, semantic color patterns) lives in this file.

> [!WARNING] The theme CSS is authoritative, not this file
> These values are a hand-maintained snapshot and roughly half of them had already
> drifted from `themes/theme-*.css` before TICKET-000 — quoting a value here that no
> longer exists is what TICKET-000 was about. Read the theme files, or the tests in
> `src/foundation/contrast/`, when the answer has to be right. The role meanings
> and usage rules below are the part worth trusting. Deduplicating this properly is
> TICKET-000.

colors:
  brand:
    brand_orange: { value: "oklch(0.5702 0.1514 49.7)", hex: "#BB5600", use: "Warning status. NOT primary — see TICKET-000" }
    brand_teal: { value: "oklch(0.30 0.062 198)", hex: "#084349", use: "Secondary brand anchor, sidebar surfaces" }
    brand_teal_secondary: { value: "oklch(0.53 0.12 195)", hex: "#00888F", use: "Secondary accent" }
    brand_blue: { value: "oklch(0.40 0.15 265)", hex: "#354193", use: "Tertiary accent, French blue" }

  defense_dark:
    primary: { value: "oklch(0.540 0.090 245)", hex: "#3d74a0", use: "Steel blue CTA", wcag: "5.01:1 white label / 4.0:1 vs bg" }
    background: { value: "oklch(0.25 0.005 240)", hex: "#292B2D" }
    foreground: { value: "oklch(0.93 0.006 220)" }
    sidebar_background: { value: "oklch(0.19 0.008 200)", hex: "#1B2022" }
    card: { value: "oklch(0.29 0.004 240)" }
    muted: { value: "oklch(0.31 0.004 240)" }
    destructive: { value: "oklch(0.64 0.21 27)" }
    warning: { value: "oklch(0.555 0.16 50)", hex: "#B94E00", use: "Orange means warning, never primary", wcag: "5.06:1 white label" }
    success: { value: "oklch(0.68 0.17 155)" }
    secondary: { value: "see theme-midnight.css", use: "Deep French blue" }
    tertiary: { value: "oklch(0.540 0.03 250)", hex: "#627080", use: "Gunmetal tertiary" }

  defense_light:
    primary: { value: "oklch(0.540 0.090 245)", hex: "#3d74a0", use: "Same steel blue as dark mode" }
    background: { value: "oklch(0.94 0.008 215)" }
    foreground: { value: "oklch(0.12 0.03 220)" }
    sidebar_background: { value: "oklch(0.20 0.075 162)" }
    card: { value: "oklch(1 0 0)", hex: "#FFFFFF" }
    destructive: { value: "oklch(0.58 0.21 27)" }
    warning: { value: "oklch(0.555 0.16 50)", hex: "#B94E00" }
    success: { value: "oklch(0.50 0.17 155)" }

  global_light:
    primary: { value: "oklch(0.530 0.09 206)", hex: "#037A85", use: "Brand teal CTA", wcag: "5.08:1 white label / 4.7:1 vs bg" }
    background: { value: "oklch(0.97 0.008 185)", hex: "#F3F9F8" }
    foreground: { value: "oklch(0.17 0.040 195)", hex: "#0A292B" }
    sidebar_background: { value: "oklch(0.24 0.056 195)", hex: "#0A3438" }
    card: { value: "oklch(1 0 0)", hex: "#FFFFFF" }
    destructive: { value: "oklch(0.55 0.22 27)", hex: "#D63637" }
    success: { value: "oklch(0.52 0.18 142)", hex: "#008000" }

  global_dark:
    primary: { value: "oklch(0.530 0.09 206)", hex: "#037A85", use: "Same brand teal as light mode" }
    background: { value: "oklch(0.20 0.055 195)", hex: "#002727" }
    foreground: { value: "oklch(0.93 0.006 220)" }
    sidebar_background: { value: "oklch(0.24 0.056 195)", hex: "#0A3438" }
    card: { value: "oklch(0.27 0.068 195)", hex: "#003D3D" }

typography:
  font_sans: { value: "'Inter', system-ui, -apple-system, sans-serif", use: "Body text" }
  font_heading: { value: "'Open Sans', system-ui, -apple-system, sans-serif", use: "Headings h1-h4" }
  font_display: { value: "'Lexend', system-ui, -apple-system, sans-serif", use: "CTAs, standout labels" }
  font_mono: { value: "'JetBrains Mono', 'Fira Code', Consolas, monospace", use: "Code" }
  scale:
    xs: { size: "12px", use: "Labels, captions" }
    sm: { size: "14px", use: "Secondary text, helper text" }
    base: { size: "16px", use: "Body text (default)" }
    lg: { size: "18px", use: "Emphasized body" }
    xl: { size: "20px", use: "Small headings" }
    2xl: { size: "24px", use: "H4" }
    3xl: { size: "30px", use: "H3" }
    4xl: { size: "36px", use: "H2" }

spacing:
  base: "4px"
  scale: [4, 8, 12, 16, 24, 32, 48, 64]
  tokens:
    space_1: "0.25rem"
    space_2: "0.5rem"
    space_3: "0.75rem"
    space_4: "1rem"
    space_6: "1.5rem"
    space_8: "2rem"
    space_12: "3rem"
    space_16: "4rem"

border_radius:
  sm: "0.25rem"
  md: "0.375rem"
  lg: "0.5rem"
  xl: "0.75rem"
  full: "9999px"

elevation:
  sm: "0 1px 2px 0 oklch(0 0 0 / 0.50)"
  md: "0 4px 8px -2px oklch(0 0 0 / 0.60), 0 2px 4px -2px oklch(0 0 0 / 0.44)"
  lg: "0 12px 20px -4px oklch(0 0 0 / 0.65), 0 4px 8px -4px oklch(0 0 0 / 0.48)"

density:
  compact: { scale: 0.5, font_size: "12px", use: "Operational dashboards, maximum data density" }
  comfortable: { scale: 1.0, font_size: "14px", use: "Default for most views" }
  spacious: { scale: 1.25, font_size: "16px", use: "Forms, settings, onboarding" }

animation:
  duration_fast: "120ms"
  duration_normal: "220ms"
  duration_slow: "380ms"
  ease_default: "cubic-bezier(0.4, 0, 0.2, 1)"

components:
  import_root: "@roboborealis/components"
  subpaths:
    - path: "/core"
      components: [RoboButton, RoboIconButton, RoboInput, RoboCard, RoboBadge, RoboChip, RoboAvatar, RoboAccordion, RoboSeparator, RoboCopyButton, RoboExportButton, RoboPrintButton]
    - path: "/forms"
      components: [RoboSelect, RoboTextarea, RoboCheckbox, RoboRadioGroup, RoboSwitch, RoboSlider, RoboDatePicker, RoboFormField]
    - path: "/navigation"
      components: [RoboSidebar, RoboTopbar, RoboTabs, RoboBreadcrumbs, RoboBottomNav, RoboCommandPalette]
    - path: "/tables"
      components: [RoboDataTable]
    - path: "/feedback"
      components: [RoboToast, RoboAlert, RoboDialog, RoboSpinner, RoboSkeleton, RoboProgress, RoboTooltip, RoboPopover, RoboKrakenLoader, RoboKrakenStatic, RoboShipWavesLoader, RoboTreasureMap]
    - path: "/layout"
      components: [RoboPageShell, RoboGrid, RoboStack, RoboDivider]
    - path: "/charts"
      components: [RoboLineChart, RoboBarChart, RoboAreaChart, RoboPieChart, RoboStatCard]
    - path: "/maps"
      components: [RoboMapbox, RoboFloatingPanel, RoboMapOverlay]
    - path: "/editor"
      components: [RoboRichTextEditor]
    - path: "/icons"
      components: [Lucide re-exports, Maritime icon set]
    - path: "/flags"
      components: [RoboFlag, RoboFlagSelect]
    - path: "/brand"
      components: [kraken, sailorAvatar (brand image assets)]
    - path: "/osint"
      components: [RoboForceGraph, RoboSankeyChart, RoboRadarChart, RoboBubbleChart, RoboCorrelationMatrix, RoboTimeline, RoboEntityDossier]
---

# @roboborealis/components Design System

## Overview

Single design language for **RoboBorealis** and
**RoboBorealis** (UK commercial). Two brand themes, each with dark and light
modes, built on CSS variable token swapping with zero JavaScript runtime cost.

- **self-contained** — no external URLs, no CDN, no analytics, all assets bundled
- **WCAG 2.1 AA** — hard requirement for accessibility compliance
- **Desktop + iPad first** — responsive but not mobile-first

Token source files: `themes/theme-midnight.css` and `themes/theme-aurora.css`

---

## Colors

### Brand Palette

| Token | Hex | OKLCH | Use |
|-------|-----|-------|-----|
| `--brand-orange` | #BB5600 | `oklch(0.5702 0.1514 49.7)` | Warning status. **Not** primary — TICKET-000 |
| `--brand-teal` | #084349 | `oklch(0.30 0.062 198)` | Secondary anchor, sidebar surfaces |
| `--brand-teal-secondary` | #00888F | `oklch(0.53 0.12 195)` | Secondary accent |
| `--brand-blue` | #354193 | `oklch(0.40 0.15 265)` | Tertiary accent (French blue) |

### Semantic Tokens

Components use semantic CSS variables, not raw colors. The active theme determines
the actual value.

| Token | Midnight Dark | Midnight Light | Aurora Light | Aurora Dark |
|-------|-------------|---------------|--------------|-------------|
| `--primary` | Orange #F88E63 | Teal #1A5C50 | Teal #084349 | Orange #F88E63 |
| `--background` | Charcoal #292B2D | Light blue-teal | Near-white #F3F9F8 | Deep teal #002727 |
| `--sidebar-background` | Deep #1B2022 | Forest green | Dark teal #0A3438 | Dark teal #0A3438 |
| `--destructive` | Red | Red | Red #D63637 | Red |
| `--warning` | Amber | Amber | Amber | Amber |
| `--success` | Green | Green | Green #008000 | Bright green |

### WCAG Contrast Ratios

All primary/foreground combinations pass WCAG 2.1 AA (4.5:1 minimum):

- Midnight dark: orange on charcoal = **5.7:1**
- Midnight light: teal on white = **7.0:1**
- Aurora light: teal on white = **11.0:1**
- Aurora dark: orange on deep teal = **9.0:1**

### Rules

- Never hardcode hex values — always use `var(--token-name)`
- Primary actions: `var(--primary)` only
- Status colors: `--success`, `--warning`, `--destructive` (never `--primary` for status)
- Never use text below `var(--muted-foreground)` contrast level

---

## Typography

| Variable | Font | Use |
|----------|------|-----|
| `--font-sans` | Inter | Body text |
| `--font-heading` | Open Sans | Headings (h1-h4) |
| `--font-display` | Lexend | CTAs, standout labels |
| `--font-mono` | JetBrains Mono | Code blocks |

Never hardcode font families — always use the CSS variables. Apps can override any
font var in their root CSS.

### Type Scale

| Token | Size | Use |
|-------|------|-----|
| `text-xs` | 12px | Labels, captions |
| `text-sm` | 14px | Secondary text, helper text |
| `text-base` | 16px | Body text (default) |
| `text-lg` | 18px | Emphasized body |
| `text-xl` | 20px | Small headings |
| `text-2xl` | 24px | H4 |
| `text-3xl` | 30px | H3 |
| `text-4xl` | 36px | H2 |

---

## Layout & Spacing

**4px base unit.** Use Tailwind classes `p-1` through `p-16`. Never go below 4px
whitespace between content blocks.

| Token | Value | Tailwind |
|-------|-------|----------|
| `--space-1` | 4px (0.25rem) | `p-1` |
| `--space-2` | 8px (0.5rem) | `p-2` |
| `--space-3` | 12px (0.75rem) | `p-3` |
| `--space-4` | 16px (1rem) | `p-4` |
| `--space-6` | 24px (1.5rem) | `p-6` |
| `--space-8` | 32px (2rem) | `p-8` |
| `--space-12` | 48px (3rem) | `p-12` |
| `--space-16` | 64px (4rem) | `p-16` |

### Density

Set via `data-density` attribute on `<html>`:

| Level | Scale | Font Size | Use |
|-------|-------|-----------|-----|
| `compact` | 0.5x | 12px | Operational dashboards, maximum data density |
| `comfortable` | 1.0x | 14px | Default for most views |
| `spacious` | 1.25x | 16px | Forms, settings, onboarding |

Density affects spacing tokens, button heights, input heights, and card padding.

---

## Elevation

Three shadow levels, defined per theme (dark shadows are heavier than light):

| Level | Use |
|-------|-----|
| `--shadow-sm` | Cards, subtle separation |
| `--shadow-md` | Dropdowns, popovers |
| `--shadow-lg` | Modals, floating panels |

---

## Components

All components use the `Robo` prefix. Import from specific subpaths:

```tsx
import { RoboButton } from '@roboborealis/components/core';
import { RoboDataTable } from '@roboborealis/components/tables';
```

### Component Selection Guide

| Need | Use | Not |
|------|-----|-----|
| Clickable actions | `RoboButton` | `<button>` |
| Data lists (>5 rows) | `RoboDataTable` | `<table>` |
| App navigation | `RoboSidebar` + `RoboTopbar` | Custom nav |
| Transient notifications | `RoboToast` | `alert()` |
| Confirmations | `RoboDialog` | `confirm()` |
| Content loading | `RoboSkeleton` | Spinners for large areas |
| Inline loading | `RoboSpinner` | Skeleton for tiny areas |
| Status indicators | `RoboBadge` | Colored spans |
| Dismissible tags | `RoboChip` | RoboBadge |
| Content containers | `RoboCard` | Bare `<div>` |
| Charts | `RoboLineChart` etc. | Third-party chart libs |
| Maps | `RoboMapbox` | Raw mapbox-gl |
| Rich text | `RoboRichTextEditor` | Custom Slate |
| Form inputs | `RoboFormField` + react-hook-form + Zod | Uncontrolled inputs |

Full component inventory: `src/agent/manifest.json`

---

## Do's and Don'ts

### Do

- Use CSS variables for all colors: `var(--primary)`, `var(--background)`
- Use `RoboPageShell` to wrap all page content
- Use `RoboGrid` for multi-column, `RoboStack` for vertical sequences
- Use `RoboCard` as the primary content container
- Use `RoboFormField` wrapper for all form inputs
- Import from subpaths: `@roboborealis/components/core`, not `@roboborealis/components`
- Test both themes (midnight + aurora) and both modes (dark + light)
- Meet WCAG 2.1 AA: focus rings, keyboard nav, 4.5:1 contrast, semantic HTML
- Check `src/agent/manifest.json` before creating any new component

### Don't

- Hardcode hex colors in `className` or inline styles
- Use `outline: none` — always style focus rings (2px minimum)
- Import server-only code — this is a client-side library
- Load fonts, icons, or assets from external URLs (self-contained constraint)
- Use dynamic code execution (`Function` constructor or similar)
- Inject styles via JavaScript — use CSS classes only
- Add analytics, tracking, or telemetry of any kind
- Override theme variables in component CSS — theme-level overrides only
- Create new primitives when a Robo component exists (check manifest first)
