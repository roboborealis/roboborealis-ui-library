# Consumer Integration Guide

How to use `@roboborealis/components` in your application (Next.js, React, etc.).

---

## 1. Configure npm Registry

Add to your project's `.npmrc`:

```
@roboborealis:registry=https://registry.npmjs.org/
//registry.npmjs.org/:_authToken=${NPM_TOKEN}
```

Get a token from [npmjs.com → Access Tokens](https://www.npmjs.com/settings/~/tokens):
- Type: **Granular Access Token** with `Read and Write` or `Read-only` scope on the `@roboborealis` org
- For local dev: add `NPM_TOKEN=<your-token>` to your `.env.local` (gitignored)
- For CI pipelines: add `NPM_TOKEN` as a repository secret (`Settings → Secrets → Actions`)

> **Migrating from GitHub Package Registry?** Replace `GITHUB_TOKEN` with `NPM_TOKEN` in your CI secrets and update `.npmrc` as shown above.

---

## 2. Install

```bash
npm install @roboborealis/components
npm install radix-ui    # installs all required @radix-ui/* peer dependencies
```

Optional peer dependency:
- `mapbox-gl` — only needed if you use `@roboborealis/components/maps`

---

## 3. Import Theme

Import exactly one theme in your root layout file:

```tsx
// layout.tsx or _app.tsx
import '@roboborealis/components/theme-midnight'; // RoboBorealis apps (US)
// OR
import '@roboborealis/components/theme-aurora';  // RoboBorealis apps (UK)
```

Both themes use CSS variable token swapping — no JavaScript runtime cost.

> **Migrating from `theme-midnight`?** Replace with `theme-midnight` and change
> `data-theme="midnight"` to `data-theme="midnight"`. The output is identical.
> `theme-midnight` will be removed in v1.0.

---

## 4. Set HTML Attributes

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

---

## 5. Configure light/dark

**`RoboThemeProvider` owns light/dark. Do not install next-themes.**

Earlier versions of this guide told you to add next-themes alongside `RoboThemeProvider`, because
the provider had no `system` option and could not act before first paint. Both gaps are closed as
of 0.29.0, and running the two together is actively harmful: they both write
`documentElement.dataset.mode`, nothing arbitrates between them, and the provider can overwrite
next-themes from stale state. See *Migrating off next-themes* below.

`mode` is the stored preference (`'dark' | 'light' | 'system'`). `resolvedMode` is the concrete
`'dark' | 'light'` that is actually applied. **Bind settings controls to `mode`; drive styling off
`resolvedMode`.** `data-mode` always carries the resolved value, because the theme CSS matches
`[data-mode='dark']` / `[data-mode='light']` and nothing else.

Pick one of two setups, based on whether your **server** can read the preference.

### 5a. Client-root apps — localStorage plus a pre-paint script

Use this when your root layout is a client component, or you simply persist to localStorage. The
script is not optional: a React effect always runs after the browser has painted, so without it a
user whose saved mode differs from the default sees a flash of the wrong one.

```tsx
// layout.tsx
import Script from 'next/script';
import { getRoboThemeScript, RoboThemeProvider } from '@roboborealis/components/core';

// One object into both. They are independent code paths reading the same storage, so if their
// defaults differ the script paints one thing and the provider immediately renders another.
const themeConfig = {
  storageKey: 'robo-color-theme',
  defaultTheme: 'midnight',
  defaultMode: 'system',
} as const;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="midnight" suppressHydrationWarning>
      <body>
        {/* Must be beforeInteractive — it is hoisted into <head> and runs before first paint. */}
        <Script id="robo-theme" strategy="beforeInteractive">
          {getRoboThemeScript(themeConfig)}
        </Script>
        <RoboThemeProvider {...themeConfig}>{children}</RoboThemeProvider>
      </body>
    </html>
  );
}
```

### 5b. Server-rendered apps — cookies, no script at all

Better when you can use it. The server reads the cookie, so the *first server-rendered HTML*
already carries the right attributes — there is nothing left to flash, and no inline script.

```tsx
// app/layout.tsx  (a server component)
import { cookies } from 'next/headers';
import { createCookieStorageAdapter, RoboThemeProvider } from '@roboborealis/components/core';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const store = await cookies();
  const initial = {
    theme: store.get('robo-theme:theme')?.value,
    mode: store.get('robo-theme:mode')?.value,
  };

  return (
    <html lang="en">
      <body>
        {/* On the server every StorageAdapter is inert, so `initial` is the only source the first
            render has. Unrecognised values are ignored, so untrusted cookies are safe to pass. */}
        <RoboThemeProvider storageAdapter={createCookieStorageAdapter()} initial={initial}>
          {children}
        </RoboThemeProvider>
      </body>
    </html>
  );
}
```

One caveat: `prefers-color-scheme` has no server-side answer. With `mode: 'system'` the server
renders `light` and the client corrects on mount. Pin the mode if that one frame matters.

### 5c. Scoping the theme to part of the page

If your app serves separately-styled routes from one root layout — a public marketing site
alongside a themed console, say — do **not** let the provider re-tokenize `<html>`. Pass
`applyTo="none"` and spread the attributes onto a wrapper you render:

```tsx
'use client';
import { useTheme } from '@roboborealis/components/core';

function ThemeScope({ children }: { children: React.ReactNode }) {
  const { themeAttributes } = useTheme();
  // CSS custom properties inherit and every theme-*.css block is scoped under [data-theme='…'],
  // so this re-tokenizes the subtree only. The element must also *paint* with those tokens —
  // <body> is outside the scope, so its background resolves against your own :root.
  return <div {...themeAttributes} className="bg-background text-foreground">{children}</div>;
}
```

Every appearance provider takes `applyTo` and exposes a matching attribute bag:
`RoboDensityProvider` → `densityAttributes`, `RoboFontFamilyProvider` → `fontFamilyAttributes`,
`RoboGlassModeProvider` → `glassModeAttributes`.

### Migrating off next-themes

1. `npm uninstall next-themes` and delete its `<ThemeProvider>`.
2. Add the script (5a) or `initial` (5b).
3. Carry the old preference across. next-themes stores a raw string under `theme`; move it to
   `{storageKey}:mode` in a one-shot pre-paint script, before `getRoboThemeScript` runs, and delete
   the old key.
4. Repoint anything reading next-themes' `useTheme()` at `useTheme()` from
   `@roboborealis/components/core` — including toast libraries, which commonly read it directly.
   Feed those `resolvedMode`, not `mode`.
5. **If your Tailwind `dark:` variant is class-based**, repoint it at the attribute rather than
   asking the library to emit a `.dark` class — one line, and every existing `dark:` utility keeps
   working untouched:

   ```css
   @custom-variant dark (&:is([data-mode='dark'] *));
   ```

   Emitting a class instead tends to collide: a `.dark { --background: … }` block in your own
   `globals.css` sits at the same specificity as the library theme, so the two fight and different
   components pick different winners.

---

## 6. Bridge Tokens to Tailwind v4

Add `@theme inline` in your `globals.css` to map design tokens to Tailwind utilities:

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

This lets you use `bg-primary`, `text-foreground`, `border-border` etc. and have them
resolve to the active theme's values.

---

## 7. Restrict `@source` for Turbopack

Next.js Turbopack panics if Tailwind scans the entire `dist/` directory. Restrict
the glob to JS files:

```css
/* globals.css */
@source "../../node_modules/@roboborealis/components/dist/*.{mjs,cjs,js}";
```

---

## 8. Use Components

```tsx
import { RoboButton } from '@roboborealis/components/core';
import { RoboDataTable } from '@roboborealis/components/tables';
import { RoboPageShell } from '@roboborealis/components/layout';
```

Always import from specific subpaths, not the root `@roboborealis/components`.

### Starting a New App

Don't hand-build navigation chrome or a settings screen — start from `AppShellTemplate`,
the default starting point for any new app:

```tsx
import { AppShellTemplate } from '@roboborealis/components/templates';
```

Copy `src/templates/app-shell.tsx` from this repo into your app and adapt the marked
`TODO` injection points. It ships, working out of the box:
- A sidebar with a pinned **Settings** footer item (via `RoboSidebar`'s `footerItems` prop)
  and your real nav items above it
- A topbar with a conditionally-rendered mobile menu toggle
- A working **Settings** page — color theme (`midnight`/`aurora`/`neutral`), mode
  (`dark`/`light`), and density (`compact`/`comfortable`/`spacious`) — wired to
  `RoboThemeProvider` and `RoboDensityProvider`, both persisted to `localStorage` by default

See it live in Storybook under `Showcase/Templates → App Shell — Archetype 1` or
`Core/Layout/App Shell`.

### Available Subpaths

| Import | Contents |
|--------|----------|
| `@roboborealis/components/core` | Button, Input, Card, Badge, Avatar, Chip, Accordion, Separator |
| `@roboborealis/components/forms` | Select, Textarea, Checkbox, DatePicker, FormField, Zod schemas |
| `@roboborealis/components/navigation` | Sidebar, Topbar, Tabs, Breadcrumbs, CommandPalette, BottomNav |
| `@roboborealis/components/tables` | DataTable with sort, filter, pagination, selection, inline edit |
| `@roboborealis/components/feedback` | Toast, Alert, Dialog, Spinner, Skeleton, Progress, Tooltip |
| `@roboborealis/components/layout` | PageShell, Grid, Stack, Divider |
| `@roboborealis/components/charts` | LineChart, BarChart, AreaChart, PieChart, StatCard |
| `@roboborealis/components/maps` | Mapbox wrapper, FloatingPanel, MapOverlay, controls |
| `@roboborealis/components/editor` | RichTextEditor (Slate.js) |
| `@roboborealis/components/icons` | 200+ Lucide re-exports + maritime icon set |
| `@roboborealis/components/flags` | Country flags + FlagSelect dropdown |
| `@roboborealis/components/brand` | RoboBorealis logos and wordmarks |
| `@roboborealis/components/osint` | Force graphs, sankey, radar, correlation, timeline |
| `@roboborealis/components/tokens` | TypeScript color constants |

---

## Common Gotchas

### Don't redefine theme tokens in `globals.css`

Remove any `:root` or `.dark` blocks that hardcode `--primary`, `--background`,
`--sidebar`, etc. These override the theme CSS and break components.

```css
/* BAD — remove these */
:root {
  --primary: #000000;
  --background: #ffffff;
}

/* GOOD — let theme-midnight.css or theme-aurora.css own all tokens */
```

### `npm link` doesn't work with Turbopack

Next.js 16 Turbopack resolves symlinks outside the project root and panics.
Use the tarball workflow instead (see below).

### Missing peer dependency errors

If you see warnings about `@radix-ui/*` packages, install the umbrella package:

```bash
npm install radix-ui
```

This installs all `@radix-ui/react-*` packages in a single command.

### Versioning: pin with `~` until v1.0

This library is pre-1.0. Minor bumps (`0.6.x → 0.7.0`) may include breaking changes.
Until v1.0, use tilde pinning in your `package.json`:

```json
"@roboborealis/components": "~0.6.0"
```

Until v1.0, minor version bumps may include breaking changes — check the CHANGELOG before upgrading.

---

## Local Testing (Tarball Workflow)

Use this to test unreleased library changes in your consuming app.

### Build and pack

```bash
# In roboborealis-ui-library
npm run build
npm pack          # produces roboborealis-ui-0.2.0.tgz
```

### Install in consumer

```bash
# In your consumer app
rm -rf node_modules/@roboborealis/components
npm install ../roboborealis-ui-library/roboborealis-ui-0.2.0.tgz
```

> `rm -rf` first because npm skips re-extraction if the tarball path matches the
> lockfile.

### Restart dev server

```bash
rm -rf .next      # clear Next.js CSS bundle cache
npm run dev
```

### Iterate

```bash
# roboborealis-ui-library
npm run build && npm pack

# consumer app
rm -rf node_modules/@roboborealis/components && npm install ../roboborealis-ui-library/roboborealis-ui-0.2.0.tgz
rm -rf .next && npm run dev
```

---

## App Patterns Cookbook

For patterns specific to consumer apps — tRPC integration, Prisma queries, form wiring with Zod, and
full-page examples — see the showcase patterns under `src/showcase/`.

To set up your team's AI agent (Claude Code) to generate UIs using this library, see
[`docs/consumer-team-ai-workflow.md`](./consumer-team-ai-workflow.md).
