/**
 * RoboBorealis Design Guide for Agents
 *
 * Exported as a const string so the CLI can inject it into LLM system prompts
 * without a network fetch or .md import complexity with tsup.
 *
 * Content consolidated from AGENTS.md + CONTRIBUTING.md.
 */
export const designGuide = `# RoboBorealis Design Guide for Agents

## Robo-First Rule (Non-Negotiable)

The library ships 200+ components and 10 page templates covering virtually every UI
need. **Always use a Robo component. Never recreate one from scratch.**

Before writing any UI element, check the manifest. In a consuming app, import it:
\`\`\`ts
import { manifest, templates, archetypes } from '@roboborealis/components/agent-context';
\`\`\`
Working in the component-library repo itself, grep the same data on disk:
\`\`\`bash
grep -i "<what you need>" src/agent/manifest.json
\`\`\`

**Hard substitution table — no exceptions:**

| You need... | Use this | Never use |
|-------------|----------|-----------|
| A clickable button | \`RoboButton\` / \`RoboIconButton\` | \`<button>\`, custom div |
| A data table (sort/filter/paginate) | \`RoboDataTable\` | \`<table>\`, ag-grid, custom grid |
| A static read-only table (emails, print, reports) | \`RoboTable\` | \`<table>\`, RoboDataTable overkill |
| A text input | \`RoboInput\` | \`<input>\` |
| A dropdown / select | \`RoboSelect\` | \`<select>\`, Radix Select directly |
| A form field with label + error | \`RoboFormField\` | Label + input + error span manually |
| A card / container | \`RoboCard\` + header/body/footer slots | \`<div className="card">\` |
| A status indicator | \`RoboBadge\` | Colored \`<span>\` |
| A dismissible tag | \`RoboChip\` | Custom tag component |
| A notification (transient) | \`RoboToast\` via \`useToast()\` | \`alert()\`, custom overlay |
| A confirmation | \`RoboDialog\` | \`confirm()\`, custom modal |
| Content loading | \`RoboSkeletonLoading\` (areas) / \`RoboSpinnerLoading\` (inline) | CSS spinner, custom loader |
| A progress bar | \`RoboProgress\` | \`<progress>\`, custom bar |
| A tooltip | \`RoboTooltip\` | Custom hover overlay |
| A popover | \`RoboPopover\` | Custom floating div |
| Navigation tabs | \`RoboTabs\` | Custom tab component |
| App sidebar | \`RoboSidebar\` | Custom nav |
| App topbar | \`RoboTopbar\` | Custom header |
| Page breadcrumbs | \`RoboBreadcrumbs\` | Custom trail |
| Charts | \`RoboLineChart\` / \`RoboBarChart\` / \`RoboAreaChart\` / \`RoboPieChart\` / \`RoboStatCard\` | Raw ECharts, Chart.js |
| Rich text editor | \`RoboRichTextEditor\` | Custom Slate/Tiptap wiring |
| Country flag | \`RoboFlag\` / \`RoboFlagSelect\` | Flag emoji, custom SVG |
| Collapsible section | \`RoboAccordion\` | Custom expand/collapse |
| Horizontal rule / divider | \`RoboSeparator\` / \`RoboDivider\` | \`<hr>\` |

**The only raw HTML you should write:** structural containers (\`<div>\`, \`<span>\`)
inside a RoboCard or RoboPageShell where no Robo layout component covers that specific
grouping. Everything interactive or presentational must be a Robo component.

**If the manifest shows no Robo component for your need:** open an issue requesting
it. Do NOT build a custom one-off — it creates maintenance debt and design divergence.

## Page Templates — Start Here

Before composing any page from scratch, check if a template covers your archetype:
\`\`\`tsx
import { FilterTableDetailTemplate } from '@roboborealis/components/templates';
// Then adapt the TODO injection points — don't write the layout from scratch
\`\`\`

Available templates (import from \`@roboborealis/components/templates\`):
- \`AppShellTemplate\` — full app with sidebar + topbar
- \`DataDashboardTemplate\` — KPI cards + activity table
- \`ListSearchTemplate\` — searchable/filterable/exportable list
- \`FilterTableTemplate\` — filtered list (row → navigate away)
- \`DashboardGridTemplate\` — KPIs + charts + activity feed
- \`FilterTableDetailTemplate\` — filter list, row → side pane
- \`FormValidationTemplate\` — multi-field form with Zod validation

To pick the right template programmatically:
\`\`\`tsx
import { archetypes } from '@roboborealis/components/agent-context';
const match = archetypes.find(a => a.keywords.some(k => description.includes(k)));
// match.templateExport → the template to import
\`\`\`

Map-based pages (Archetypes 1–3) have no template — compose directly using Robo map components.

## Layout Rules

- Always wrap pages in \`<RoboPageShell>\` from \`@roboborealis/components/layout\`
- Use \`<RoboGrid>\` for 2+ column layouts, \`<RoboStack>\` for vertical sequences
- Never hardcode pixel values — use spacing tokens (\`p-1\` through \`p-16\`, 4px base)
- Sidebar width: 280px fixed, collapsible on mobile via \`<RoboSidebar>\`
- Topbar: always use \`<RoboTopbar>\` for app header with branding and user menu
- Cards are primary containers — use header/body/footer slots, not bare divs
- Accordion for secondary info — collapse data that isn't always needed

## Spacing Scale (4px base)

4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 — use Tailwind classes (p-1 through p-16).
Never go below 4px whitespace between content blocks.

## Color Rules

- Never hardcode hex values — always use CSS custom properties
- Primary actions: \`var(--primary)\` (orange in midnight theme, teal in aurora theme)
- Destructive actions: \`var(--destructive)\` only
- Never use gray text below \`var(--muted-foreground)\` (WCAG 4.5:1 minimum contrast)
- Status colors: use semantic tokens (\`--success\`, \`--warning\`, \`--destructive\`, \`--info\`)

## Typography

\`\`\`
--font-sans:    'Inter', system-ui, sans-serif        (body text)
--font-heading: 'Open Sans', system-ui, sans-serif    (headings h1-h4)
--font-display: 'Lexend', system-ui, sans-serif       (CTAs, standout labels)
--font-mono:    'JetBrains Mono', monospace           (code)
\`\`\`

Never hardcode font families — always use the CSS variables.

## Component Selection Guide

| Need | Use | Not |
|------|-----|-----|
| Lists of data (sort/filter/paginate) | \`RoboDataTable\` | Plain \`<table>\` |
| Static tables (emails, print, reports) | \`RoboTable\` | Plain \`<table>\`, RoboDataTable |
| Navigation | \`RoboSidebar\` + \`RoboTopbar\` | Custom nav elements |
| Notifications (transient) | \`RoboToast\` via \`useToast()\` | Browser \`alert()\` |
| Confirmations | \`RoboDialog\` | Browser \`confirm()\` |
| Loading (content areas) | \`RoboSkeletonLoading\` | Spinners for large areas |
| Loading (inline/buttons) | \`RoboSpinnerLoading\` | Skeleton for tiny areas |
| Charts | ECharts-based components in \`@roboborealis/components/charts\` | Third-party chart libs |
| Status indicators | \`RoboBadge\` | Custom colored spans |
| Dismissible tags | \`RoboChip\` | RoboBadge (non-interactive) |
| Rich text editing | \`RoboRichTextEditor\` | Custom Slate/Tiptap |
| Form inputs | \`RoboFormField\` + \`react-hook-form\` + Zod | Uncontrolled inputs |

## Theme Rules

Two brand themes, each with dark and light modes:

**Midnight** (\`theme-midnight.css\`):
- Import: \`import '@roboborealis/components/theme-midnight'\`
- HTML: \`<html data-theme="midnight" data-mode="dark|light">\`
- Design: forest green sidebar, deep blue-green surfaces, orange primary CTA
- Dark mode default

**Aurora** (\`theme-aurora.css\`):
- Import: \`import '@roboborealis/components/theme-aurora'\`
- HTML: \`<html data-theme="aurora" data-mode="dark|light">\`
- Design: creamy blush-white surfaces, deep teal-green primary
- Light mode default

**Rules:**
- Never override theme variables in component CSS — theme-level only
- Never mix components from different themes on the same page
- Both themes must work in both dark and light modes

## Import Rules

Always use specific subpath exports — never import from the root:

\`\`\`tsx
// Correct
import { RoboButton } from '@roboborealis/components/core';
import { RoboDataTable } from '@roboborealis/components/tables';
import { RoboLineChart } from '@roboborealis/components/charts';

// Wrong — do not use root import
import { RoboButton } from '@roboborealis/components';
\`\`\`

Available subpaths:
\`@roboborealis/components/core\` | \`/forms\` | \`/navigation\` | \`/tables\` | \`/feedback\` |
\`/layout\` | \`/charts\` | \`/editor\` | \`/icons\` | \`/tokens\` |
\`/flags\` | \`/brand\`

## Accessibility Non-Negotiables (WCAG 2.1 AA)

Every component must:
- Have a visible focus ring (2px minimum, never \`outline: none\`)
- Be fully keyboard navigable (Tab, Shift+Tab, Arrow keys where applicable)
- Have sufficient color contrast (4.5:1 for text, 3:1 for UI elements)
- Use semantic HTML (\`<button>\`, \`<input>\`, \`<nav>\`, \`<dialog>\`, etc.)
- Include proper ARIA roles, labels, and descriptions
- Handle ESC to close overlays/modals
- Announce state changes to screen readers (\`aria-live\`, \`aria-expanded\`)
- Have minimum 44x44px touch targets for interactive elements

## Self-Contained Constraints

This library is used in offline / air-gapped environments:
- No external URLs (no Google Fonts, no CDN, no analytics)
- No dynamic code evaluation (\`eval\`, \`Function\` constructor)
- No inline styles via JavaScript — use CSS classes only
- All assets bundled as base64 data URIs
- Run \`npm audit --audit-level=high\` before publishing
` as const;
