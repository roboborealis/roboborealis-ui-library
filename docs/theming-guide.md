# Theming Guide

@roboborealis/components uses **CSS variable token swapping** for theming — zero JavaScript runtime
cost. Three brand themes ship with the library, each supporting dark and light modes plus
three density levels.

---

## Architecture Overview

```
themes/
  theme-midnight.css   ← RoboBorealis (US) — dark default
  theme-aurora.css    ← RoboBorealis (UK) — light default
  theme-neutral.css   ← Neutral — charcoal dark / warm cream light
  theme-midnight.css       ← DEPRECATED — re-exports theme-midnight.css
```

Each theme file defines CSS custom properties under `[data-theme]` compound selectors.
Components reference semantic tokens like `var(--primary)` and `var(--background)` —
the active theme determines the actual value. No JavaScript theme provider is needed
for the token system itself.

---

## Theme Activation

### HTML Attributes

Three `data-*` attributes on `<html>` control the visual output:

| Attribute | Values | Default |
|-----------|--------|---------|
| `data-theme` | `"midnight"`, `"aurora"`, or `"neutral"` | Required — no fallback |
| `data-mode` | `"dark"` or `"light"` | Midnight: dark. Aurora: light. Neutral: dark |
| `data-density` | `"compact"`, `"comfortable"`, `"spacious"` | `comfortable` |

```html
<!-- Midnight dark (default) -->
<html data-theme="midnight">

<!-- Midnight light -->
<html data-theme="midnight" data-mode="light">

<!-- Aurora light (default) -->
<html data-theme="aurora">

<!-- Aurora dark -->
<html data-theme="aurora" data-mode="dark">

<!-- With density -->
<html data-theme="midnight" data-density="compact">
```

### Importing a Theme

**Default: import all three theme CSS files in your root layout.** Every starter-app
template (`AppShellTemplate`, `DashboardStarterTemplate`, `TableStarterTemplate`,
`FormStarterTemplate`, `MapDashboardStarterTemplate`) ships a Settings page with a Color
theme picker offering Midnight/Aurora/Neutral — if your layout only imports one theme's
CSS, switching to either of the other two silently breaks (every `--card`/`--border`/
`--foreground` token resolves to nothing, since no matching `[data-theme=...]` rule
exists to define them). Importing all three is always safe: they're each scoped under
their own `[data-theme='...']` selector, so only the one matching the current
`data-theme` attribute actually applies.

```tsx
// layout.tsx
import '@roboborealis/components/theme-midnight';
import '@roboborealis/components/theme-aurora';
import '@roboborealis/components/theme-neutral';
```

Only omit a theme's import if your app deliberately locks itself to a single brand and
has **removed** the corresponding option(s) from its own copy-adapted Settings page's
`THEME_OPTIONS` list — otherwise the picker will offer a choice it can't actually render.

---

## Theme Comparison

### Midnight (`theme-midnight.css`)

| Mode | Primary | Background | Sidebar | Design Language |
|------|---------|------------|---------|----------------|
| Dark (default) | Steel blue `#3d74a0` | Deep green `#051506` | Military green `#192519` | Dark ops dashboard |
| Light | Steel blue `#3d74a0` | Sage-green `#EFF3EE` | Military green `#192519` | Military professional |

- Steel blue `--primary`, khaki-gold `--secondary` `#8E691F`, olive-grey `--tertiary` `#63735F`. Same colours in both modes
- Olive was tried as the primary first and rejected as too yellow-green; a steel blue after that read too teal. Chroma is deliberately low (0.045) so it looks faded rather than saturated
- Dark sidebar in both modes, a desaturated military green `#192519`. It was `#010401` — black with a trace of green — until TICKET-000
- Orange is reserved for `--warning`. Primary was orange until TICKET-000, which made it indistinguishable from a warning badge once warning was dark enough for white text (ΔE 1.8)

### Aurora (`theme-aurora.css`)

| Mode | Primary | Background | Sidebar | Design Language |
|------|---------|------------|---------|----------------|
| Light (default) | Brand teal `#037A85` | Light gray `#F6F6F4` | Dark teal `#0A3438` | Clean commercial |
| Dark | Brand teal `#037A85` | Deep teal `#002727` | Dark teal `#0A3438` | Deep teal dashboard |

- Brand teal (`--primary`) is the CTA in both modes — Aurora's own identity, where it used to be orange
- `--secondary` is amber gold `#9D6000` and `--tertiary` a neutral grey `#6A6F76` — the same roles, same families, different shades from the other two themes
- Sidebar is always dark teal `#0A3438` (brand identity)
- `--sidebar-primary` is the theme's own primary lightened to read on that sidebar, in every theme — it used to be the brand orange everywhere
- Light mode has warm neutral surfaces, not blue-tinted

### Neutral (`theme-neutral.css`)

| Mode | Primary | Background | Sidebar | Design Language |
|------|---------|------------|---------|----------------|
| Dark (default) | Corporate navy `#2D6FBE` | Charcoal `#202224` | Deep `#101515` | Neutral ops |
| Light | Corporate navy `#2D6FBE` | Warm cream `#F7F5F1` | Dark charcoal `#101515` | Clean commercial |

- Corporate navy `--primary`, olive-gold `--secondary` `#866C02`, blue-grey `--tertiary` `#656F84`
- Light and dark share every role's hue, differing only in lightness (TICKET-000) — the surfaces are the deliberate exception, warm cream against cool charcoal
- Dark mode's charcoal is otherwise the pre-rebrand palette
- Use for apps that don't fit the green (Midnight) or deep teal (Aurora) brand palette

### Roles Are Consistent Across Themes

Each role is one colour family everywhere, in a different shade per theme, so a
control is recognisable whichever theme you are in — "the gold button" means the
same button in all three. Dark and light use the identical value.

| Role | Family | Midnight | Aurora | Neutral |
|---|---|---|---|---|
| `--primary` | cool blue / teal | `#3d74a0` | `#037A85` | `#2D6FBE` |
| `--secondary` | gold / khaki | `#8E691F` | `#9D6000` | `#866C02` |
| `--tertiary` | grey | `#63735F` | `#6A6F76` | `#656F84` |
| `--warning` | orange | `#B94E00` | `#B94E00` | `#B94E00` |
| `--destructive` | red | `#D62526` | `#D62526` | `#D62526` |
| `--success` | green | `#008144` | `#008144` | `#008144` |

Status colours are the opposite rule: identical in every theme and mode, because
"this failed" should not look different per product. Action colours are themed;
status colours are not. Every fill in the table takes white text.

Enforced in `src/foundation/contrast/` with a lower bound as well as an upper one:
too far apart and the role stops being recognisable, too close and the themes stop
being distinguishable.

### Brand Palette (Shared)

Both themes define the same brand constants:

| Token | Hex | Use |
|-------|-----|-----|
| `--brand-orange` | `#BB5600` | Warning status — **not** primary (TICKET-000) |
| `--brand-teal` | `#084349` | Secondary brand anchor |
| `--brand-teal-secondary` | `#00888F` | Secondary accent |
| `--brand-blue` | `#354193` | Tertiary accent (French blue) |

---

## Token Categories

### Surfaces (depth hierarchy)

```
sidebar-background < background < card < popover
```

Each level is progressively lighter (dark mode) or uses different surfaces (light mode)
to create visual depth without shadows alone.

### Semantic Colors

| Token | Use |
|-------|-----|
| `--primary` | Primary CTA buttons, links, focus rings |
| `--secondary` | Secondary buttons, badges |
| `--tertiary` | Tertiary buttons, tags |
| `--destructive` | Delete, remove, error actions |
| `--warning` | Caution states — orange. Primary is never orange |
| `--success` | Confirmation, positive states |
| `--muted` | Subdued surfaces |
| `--accent` | Hover backgrounds |

Each semantic token has a matching `-foreground` token for text on that surface.

### Typography

```css
--font-sans:    'Inter', system-ui, sans-serif;      /* body text */
--font-heading: 'Open Sans', system-ui, sans-serif;  /* headings h1-h4 */
--font-display: 'Lexend', system-ui, sans-serif;     /* CTAs, standout labels */
--font-mono:    'JetBrains Mono', monospace;          /* code */
```

Apps can override any font variable in their root CSS. Never hardcode font families.

### Spacing

4px base unit. Both themes define the same spacing scale:

| Token | Value |
|-------|-------|
| `--space-1` | 0.25rem (4px) |
| `--space-2` | 0.5rem (8px) |
| `--space-3` | 0.75rem (12px) |
| `--space-4` | 1rem (16px) |
| `--space-6` | 1.5rem (24px) |
| `--space-8` | 2rem (32px) |
| `--space-12` | 3rem (48px) |
| `--space-16` | 4rem (64px) |

### Border Radius

| Token | Midnight | Aurora |
|-------|---------|--------|
| `--radius-sm` | 0.25rem | 0.375rem |
| `--radius` / `--radius-md` | 0.375rem | 0.5rem |
| `--radius-lg` | 0.5rem | 0.625rem |
| `--radius-xl` | 0.75rem | 0.875rem |
| `--radius-full` | 9999px | 9999px |

Aurora uses slightly larger radii for a softer, more commercial feel.

### Shadows

Three levels per theme. Dark mode shadows are heavier than light mode.

| Token | Use |
|-------|-----|
| `--shadow-sm` | Cards, subtle separation |
| `--shadow-md` | Dropdowns, popovers |
| `--shadow-lg` | Modals, floating panels |

---

## Density System

Density affects spacing tokens, button heights, input heights, card padding, and
base font size.

| Level | Scale | Font Size | Button Height (md) | Card Padding | Use |
|-------|-------|-----------|---------------------|-------------|-----|
| `compact` | 0.5x | 12px | 24px | 6px | Operational dashboards |
| `comfortable` | 1.0x | 14px | 32px | 14px | Default for most views |
| `spacious` | 1.25x | 16px | 40px | 24px | Forms, settings, onboarding |

Set density via the `data-density` attribute on `<html>`. When no density is set,
`comfortable` is the default.

---

## Light/Dark Switching

Use `data-mode` — **not** the `.dark` CSS class — for dark/light switching. The theme
CSS selectors target `[data-theme][data-mode]`, not `.dark`.

**`RoboThemeProvider` owns this. Do not install next-themes.** Earlier versions of this guide told
you to add next-themes alongside the provider, because the provider had no `system` option and
could not act before first paint. Both gaps closed in 0.29.0, and running the two together is
actively harmful — they both write `documentElement.dataset.mode` and nothing arbitrates between
them, so the provider can overwrite next-themes from stale state.

```tsx
// layout.tsx
import Script from 'next/script';
import { getRoboThemeScript, RoboThemeProvider } from '@roboborealis/components/core';

// One object into both — they read the same storage independently, so mismatched defaults mean
// the script paints one thing and the provider immediately renders another.
const themeConfig = { storageKey: 'robo-theme', defaultTheme: 'midnight', defaultMode: 'system' } as const;

// beforeInteractive is hoisted into <head> and runs before first paint. An effect cannot:
// by the time React has mounted, the wrong mode is already on screen.
<Script id="robo-theme" strategy="beforeInteractive">{getRoboThemeScript(themeConfig)}</Script>
<RoboThemeProvider {...themeConfig}>{children}</RoboThemeProvider>
```

`mode` is the stored preference and may be `system`; `resolvedMode` is the concrete value applied.
Bind settings controls to `mode`, drive styling off `resolvedMode`.

Server-rendered apps have a better option — `createCookieStorageAdapter()` plus `initial` read from
cookies during SSR, which needs no script at all. Scoping the theme to part of the page uses
`applyTo="none"`. Both are covered in
[consumer-integration.md § 5](consumer-integration.md), along with how to migrate off next-themes.

**Already using class-based `dark:` utilities?** Repoint the Tailwind variant rather than asking the
library to emit a `.dark` class — one line, and every existing `dark:` utility keeps working:

```css
@custom-variant dark (&:is([data-mode='dark'] *));
```

---

## Tailwind v4 Token Bridging

Tailwind v4 uses `@theme inline` to map CSS variables to utility classes. Add this
to your consumer app's `globals.css`:

```css
@theme inline {
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-destructive: var(--destructive);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-sidebar-background: var(--sidebar-background);
  --radius-sm: var(--radius-sm);
  --radius-md: var(--radius);
  --radius-lg: var(--radius-lg);
}
```

This lets you write `bg-primary`, `text-foreground`, `border-border` etc. in Tailwind
and have them resolve to the active theme's token values.

---

## WCAG 2.1 AA Compliance

Two different requirements apply to a primary button, and this table used to
conflate them — it measured the button fill against the page and then checked it
against 4.5:1, which is the threshold for *text*. The fill only has to reach 3:1,
as a non-text UI component (WCAG 2.1, 1.4.11). The 4.5:1 test belongs to the
label sitting on that fill.

| Theme + Mode | Primary | Label on it (needs 4.5:1) | Fill vs page (needs 3:1) |
|---|---|---|---|
| Midnight dark | Steel blue `#3d74a0` | 5.01:1 | 4.0:1 |
| Midnight light | Steel blue `#3d74a0` | 5.01:1 | 4.0:1 |
| Aurora light | Brand teal `#037A85` | 5.08:1 | 4.7:1 |
| Aurora dark | Brand teal `#037A85` | 5.08:1 | 3.1:1 |
| Neutral dark | Corporate navy `#2D6FBE` | 5.10:1 | 3.1:1 |
| Neutral light | Corporate navy `#2D6FBE` | 5.10:1 | 4.7:1 |

Every label clears 4.5:1 and every fill clears 3:1. The labels are all white now
(TICKET-000) — no role uses dark text.

`src/foundation/contrast/` enforces all of this, plus that no action colour sits
within ΔE 10 of a status colour, so a primary button can never again be mistaken
for a warning.

---

## Rules

- Never hardcode hex values — always use `var(--token-name)`
- Never override theme variables in component CSS — theme-level overrides only
- Always test both themes and both modes before opening an MR
- Use `--warning` (amber) for warning states, not `--primary` (even when primary is orange)
- Use `--destructive` for errors and delete actions, not red hex values
- The `theme-midnight` export is deprecated — use `theme-midnight` instead

---

## Migrating from `theme-midnight` to `theme-midnight`

`theme-midnight` was the original name and still re-exports `theme-midnight.css`, but it will be removed in a future major version. Migrate now:

1. **Update the import in your consumer app's `layout.tsx`:**
   ```tsx
   // Before
   import '@roboborealis/components/theme-midnight';
   // After
   import '@roboborealis/components/theme-midnight';
   ```

2. **No CSS class or attribute changes needed** — `theme-midnight` and `theme-midnight` define identical tokens. The `data-theme="midnight"` attribute and all `var(--token-name)` references are unchanged.

3. **Clear the Next.js cache** after the change:
   ```bash
   rm -rf .next && npm run dev
   ```
