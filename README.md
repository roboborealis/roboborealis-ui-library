# @roboborealis/components

[![CI](https://github.com/maylortaylor/roboborealis-ui-library/actions/workflows/ci.yml/badge.svg)](https://github.com/maylortaylor/roboborealis-ui-library/actions/workflows/ci.yml)
[![Storybook](https://img.shields.io/badge/Storybook-live-ff4785?logo=storybook&logoColor=white)](https://maylortaylor.github.io/roboborealis-ui-library/)
[![Release](https://img.shields.io/github/v/release/maylortaylor/roboborealis-ui-library?sort=semver)](https://github.com/maylortaylor/roboborealis-ui-library/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A shared React + Tailwind component library. A single source of truth for design language,
tokens, and accessible UI components.

- **Stack:** React 19, TypeScript, Tailwind v4, shadcn/ui + Radix, tsup, Storybook 10
- **Docs:** [live Storybook](https://maylortaylor.github.io/roboborealis-ui-library/)
- **Distribution:** GitHub Releases (not published to npm). The consumer install story is tracked in [the repo issues](https://github.com/maylortaylor/roboborealis-ui-library/issues).
- **License:** MIT

---

## Agent-First by Design

@roboborealis/components is built to be used by AI agents, not just human developers. The library
ships a machine-readable knowledge layer alongside every component:

```typescript
import { manifest, storiesCatalog, designGuide, archetypes } from '@roboborealis/components/agent-context';

// Inject design rules (including Robo-first and template guidance) into any LLM system prompt
const systemPrompt = `You are a RoboBorealis frontend developer.\n\n${designGuide}`;

// Pick the right page template by keyword
const match = archetypes.find(a => a.keywords.some(k => description.includes(k)));
import(`@roboborealis/components/templates`).then(m => m[match.templateExport]);

// Search components programmatically
const tables = manifest.components.filter(c => c.category === 'tables');
```

- **`manifest`** — every component with import path, variants, required props, and usage guidance
- **`storiesCatalog`** — all Storybook stories indexed with NLP keywords for fuzzy search
- **`designGuide`** — full design rules as an injectable LLM system prompt (includes Robo-first rule + template reference)
- **`archetypes`** — 7 layout archetypes with keywords, component lists, subpath lists, and template pointers

**Page templates** — copy-adaptable TSX files, one per archetype, with generic placeholder
data and `TODO` injection points:

```typescript
import { FilterTableDetailTemplate } from '@roboborealis/components/templates';
// Adapt the TODO comments: swap domain type, wire tRPC query, update column headers
```

See [docs/agent-first-architecture.md](./docs/agent-first-architecture.md) for the
full 5-stage workflow and [docs/consumer-team-ai-workflow.md](./docs/consumer-team-ai-workflow.md)
to set up your team's AI coding agent to design UIs with this library.

---

## Quick Start

> **Node 18+ required.** Run `nvm use` in the repo root (`.nvmrc` is provided) for the recommended version.

```bash
npm install                # install deps
npm run storybook          # component dev environment (localhost:6006)
npm test                   # run tests
npm run ci:local           # full CI check: typecheck + lint + test:coverage
```

---

## Where to Start

| I want to… | Read this |
|-----------|-----------|
| **Set up my dev environment** | [`docs/getting-started.md`](./docs/getting-started.md) |
| Start a new page (quick) | Import from `@roboborealis/components/templates` — pick the archetype, adapt the TODOs |
| Use this library in a consumer app | [`docs/consumer-integration.md`](./docs/consumer-integration.md) |
| Set up my AI agent with this library | [`docs/consumer-team-ai-workflow.md`](./docs/consumer-team-ai-workflow.md) |
| Check if a component already exists | `grep -i "<name>" src/agent/manifest.json` |
| Contribute a change | [`CONTRIBUTING.md`](./CONTRIBUTING.md) |
| Understand theming | [`docs/theming-guide.md`](./docs/theming-guide.md) |
| Fix something that's broken | [`docs/troubleshooting.md`](./docs/troubleshooting.md) |

---

## Architecture

```
roboborealis-ui-library/
├── src/
│   ├── core/           Button, Card, Badge, Input, Chip, Avatar, Accordion
│   ├── forms/          Select, Textarea, Checkbox, DatePicker, FormField
│   ├── navigation/     Sidebar, Topbar, Tabs, Breadcrumbs, CommandPalette
│   ├── tables/         DataTable (TanStack) — sort, filter, pagination, inline edit
│   ├── feedback/       Toast, Alert, Dialog, Spinner, Skeleton, Progress
│   ├── layout/         PageShell, Grid, Stack, Divider
│   ├── charts/         Line, Bar, Area, Pie, StatCard (Recharts)
│   ├── maps/           Mapbox wrapper, FloatingPanel, controls
│   ├── editor/         RichTextEditor (Slate.js)
│   ├── icons/          200+ Lucide re-exports + maritime icon set
│   ├── flags/          Country flags + FlagSelect dropdown
│   ├── brand/          RoboBorealis logos and wordmarks
│   ├── visualizations/ Force graphs, sankey, radar, correlation, timeline
│   ├── tokens/         TypeScript color constants
│   ├── templates/      7 copy-adaptable page templates (one per archetype —
│   │                   AppShellTemplate is the default starting point for a new app)
│   └── agent/          Machine-readable manifests, design guide, archetype registry
├── themes/             CSS variable theme files
├── scripts/            Scaffold, verify, manifest generators
├── docs/               Developer documentation
└── designer/  Storybook host (run from root: npm run storybook)
```

---

## Component Inventory

All components use the `Robo` prefix. Import from specific subpaths:

```tsx
import { RoboButton } from '@roboborealis/components/core';
import { RoboDataTable } from '@roboborealis/components/tables';
```

| Subpath | Key Components |
|---------|---------------|
| `@roboborealis/components/core` | RoboButton, RoboIconButton, RoboCard, RoboBadge, RoboInput, RoboChip, RoboAvatar, RoboAccordion, RoboSeparator, RoboCopyButton, RoboExportButton, RoboPrintButton |
| `@roboborealis/components/forms` | RoboSelect, RoboTextarea, RoboCheckbox, RoboRadioGroup, RoboSwitch, RoboSlider, RoboDatePicker, RoboFormField |
| `@roboborealis/components/navigation` | RoboSidebar, RoboTopbar, RoboTabs, RoboBreadcrumbs, RoboBottomNav, RoboCommandPalette |
| `@roboborealis/components/tables` | RoboDataTable + cell factories (status, avatar, date, actions) + hooks (export, inline edit, keyboard nav, saved views) |
| `@roboborealis/components/feedback` | RoboToast, RoboAlert, RoboDialog, RoboSpinner, RoboSkeleton, RoboProgress, RoboTooltip, RoboPopover |
| `@roboborealis/components/layout` | RoboPageShell, RoboGrid, RoboStack, RoboDivider |
| `@roboborealis/components/charts` | RoboLineChart, RoboBarChart, RoboAreaChart, RoboPieChart, RoboStatCard |
| `@roboborealis/components/maps` | RoboMapbox, RoboFloatingPanel, RoboMapOverlay, RoboAssetLayer, controls (zoom, compass, scale, layer switcher) |
| `@roboborealis/components/editor` | RoboRichTextEditor, RoboEditorToolbar |
| `@roboborealis/components/icons` | 200+ Lucide re-exports + maritime icon set |
| `@roboborealis/components/flags` | RoboFlag, RoboFlagSelect |
| `@roboborealis/components/brand` | kraken, sailorAvatar (brand image assets) |
| `@roboborealis/components/visualizations` | RoboForceGraph, RoboSankeyChart, RoboRadarChart, RoboBubbleChart, RoboCorrelationMatrix, RoboTimeline, RoboEntityDossier |
| `@roboborealis/components/tokens` | BRAND_*, PALETTE_*, ACCENT_* color constants |
| `@roboborealis/components/templates` | **AppShellTemplate** (start here for any new app — sidebar + topbar + working settings page), DataDashboardTemplate, ListSearchTemplate, FilterTableTemplate, DashboardGridTemplate, FilterTableDetailTemplate, FormValidationTemplate |
| `@roboborealis/components/agent-context` | manifest, storiesCatalog, designGuide, archetypes |

---

## Theming

Two brand themes with dark/light modes via CSS variable token swapping:

| Theme | Default Mode | Primary CTA | Design Language |
|-------|-------------|-------------|-----------------|
| `theme-midnight` | Dark | Steel blue `#3d74a0` | Dark ops dashboard |
| `theme-aurora` | Light | Brand teal `#037A85` | Clean commercial |
| `theme-neutral` | Dark | Corporate navy `#2D6FBE` | Versatile, off-brand |

Activate via HTML attributes: `data-theme`, `data-mode`, `data-density`.

See [docs/theming-guide.md](./docs/theming-guide.md) for the full token system,
density levels, light/dark switching, and Tailwind v4 bridging.

---

## Testing

```bash
npm test                  # run once
npm run test:coverage     # coverage report
npm run ci:local          # typecheck + lint + test:coverage
```

**Coverage thresholds:** 80% lines, 80% functions, 80% statements, 70% branches.

Test pattern: Jest 30 + React Testing Library + jest-axe. Co-locate test files next
to components (`robo-button.test.tsx` beside `robo-button.tsx`).

See [CONTRIBUTING.md](./CONTRIBUTING.md) for the full testing guide.

---

## Agent Tooling

@roboborealis/components ships a machine-readable knowledge layer for AI agents:

```typescript
import { manifest, storiesCatalog, designGuide } from '@roboborealis/components/agent-context';
```

CLI tools for component development:

```bash
npm run scaffold:component -- --name RoboAlert --subpath feedback
npm run verify:component -- --path src/feedback/alert
npm run generate-agent-context
```

See [docs/agent-first-architecture.md](./docs/agent-first-architecture.md) for the
full 5-stage workflow and manifest system.

---

## Consumer Setup

```bash
# .npmrc — add to your project root
@roboborealis:registry=https://registry.npmjs.org/
//registry.npmjs.org/:_authToken=${NPM_TOKEN}

# Install
npm install @roboborealis/components
npm install radix-ui      # required peer dep (installs all @radix-ui/* packages)

# Import theme
import '@roboborealis/components/theme-midnight';   # or theme-aurora
```

See [docs/consumer-integration.md](./docs/consumer-integration.md) for the full setup
including npm token setup, CI configuration, light/dark setup, Tailwind bridging, and common gotchas.

---

## Local Testing (Tarball Workflow)

Test library changes in a consuming app before publishing:

```bash
# roboborealis-ui-library
npm run build && npm pack

# consumer app
rm -rf node_modules/@roboborealis/components && npm install ../roboborealis-ui-library/roboborealis-ui-0.2.0.tgz
rm -rf .next && npm run dev
```

> `npm link` does NOT work with Next.js Turbopack — always use the tarball approach.

---

## Development

### Prerequisites

- Node.js LTS (22.x+)
- npm 9+

### Commands

| Command | Purpose |
|---------|---------|
| `npm run storybook` | Component dev environment |
| `npm run build` | Build library (CJS + ESM + .d.ts) |
| `npm test` | Run tests |
| `npm run test:coverage` | Coverage report |
| `npm run ci:local` | Full CI check |
| `npm run scaffold:component` | Generate new component from template |
| `npm run verify:component` | Check component quality gates |
| `npm run generate-agent-context` | Regenerate agent manifest + stories catalog |

### Scaffolding a New Component

```bash
npm run scaffold:component -- --name RoboStatusBadge --subpath core \
  --variants "status:active,inactive,pending" --variants "size:sm,md,lg"
```

After implementing, verify and regenerate manifests:

```bash
npm run verify:component -- --path src/core/status-badge
npm run generate-agent-context
npm run ci:local
```

---

## Git Workflow

```
main      <- protected — production releases, requires 1 approval
  └── feat/TICKET-000_description
  └── fix/TICKET-000_description
  └── chore/TICKET-000_description
```

- Never push directly to `main`
- All MRs require 1 approval + passing pipeline
- Branch format: `<type>/TICKET-XXX_description_with_underscores`
- Commit format: `TICKET-XXX feat: description`

---

## Self-Contained by Design

All assets are bundled — the library works offline and in locked-down environments:

- No external fonts, icons, or assets (no Google Fonts, no CDNs)
- No analytics, tracking, or telemetry of any kind
- No `eval` or dynamic code execution
- Run `npm audit --audit-level=high` before publishing

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for the component authoring guide, PR process,
and quality checklist.

---

## Documentation

| Document | Purpose |
|----------|---------|
| [AGENTS.md](./AGENTS.md) | AI agent guidance, architecture decisions |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | MR process, testing, component checklist |
| [DESIGN.md](./DESIGN.md) | Machine-readable design tokens (Google Labs spec) |
| [docs/getting-started.md](./docs/getting-started.md) | New developer onboarding |
| [docs/troubleshooting.md](./docs/troubleshooting.md) | Common issues and fixes |
| [docs/theming-guide.md](./docs/theming-guide.md) | CSS variable token system deep dive |
| [docs/agent-first-architecture.md](./docs/agent-first-architecture.md) | Agent tooling and manifests |
| [docs/consumer-team-ai-workflow.md](./docs/consumer-team-ai-workflow.md) | Setting up your team's AI agent with this library |
| [docs/consumer-integration.md](./docs/consumer-integration.md) | Using @roboborealis/components in your app |
