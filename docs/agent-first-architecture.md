# Agent-First Architecture

@roboborealis/components ships a machine-readable knowledge layer alongside the component library.
This lets AI agents (coding assistants and custom CLI tools) discover components,
scaffold new ones, verify quality, and stay in sync with the design system — all without
human-in-the-loop lookup.

---

## `@roboborealis/components/agent-context` Subpath

The agent knowledge layer is published as a dedicated subpath export:

```typescript
import { manifest, storiesCatalog, designGuide, archetypes } from '@roboborealis/components/agent-context';
```

| Export | Type | Purpose |
|--------|------|---------|
| `manifest` | JSON object | Enriched component catalog — name, export path, variants, required props, usage guidance |
| `storiesCatalog` | JSON object | All Storybook stories with URL patterns and NLP keywords for fuzzy search |
| `designGuide` | `string` | Design rules formatted as an injectable LLM system prompt |
| `archetypes` | `readonly Archetype[]` | Registry of templated page archetypes (plus 2 foundational/variant entries) with keywords, components, and template pointers — see [Templates vs. Patterns](#templates-vs-patterns--the-storybook-hierarchy) below |

The `agent-context` subpath is built by tsup alongside the UI bundles. It appears in
`package.json` exports as `./agent-context`.

---

## Templates vs. Patterns — the Storybook hierarchy

**This is the canonical explanation.** `src/showcase/README.md` points here rather
than re-explaining it — if you're updating this relationship, update it here first.

Two related but distinct things live under `Showcase/` in Storybook:

- **Templates** (`src/templates/`, shown under `Showcase/Templates`) — copy-adaptable
  React components with generic placeholder data and `TODO` comments at every domain
  injection point. Two kinds:
  - **Starter apps** (`AppShellTemplate`, `DashboardStarterTemplate`,
    `TableStarterTemplate`, `FormStarterTemplate`, `MapDashboardStarterTemplate`) —
    full sidebar+page compositions. Copy the whole file to bootstrap a new app from
    scratch. Shown as "Basic App" / "Dashboard Starter" / "Table Starter" /
    "Form Starter" / "Map Starter" in Storybook — no numeric archetype labels, since
    they're curated combinations, not one of the 7 archetypes.
  - **Content-only archetype templates** (`ListSearchTemplate`, `FilterTableTemplate`,
    `DashboardGridTemplate`, `FilterTableDetailTemplate`, `FormValidationTemplate`,
    `MapDashboardTemplate`, plus `DataDashboardTemplate` as a compact variant) — drop
    into an existing app's own `RoboPageShell` when adding a single new page. These map
    onto Archetypes 1, 4-7 in `design-ui-feature.md`'s decision tree (Archetypes 2-3
    are map-based and still have no template).
- **Patterns** (`src/showcase/patterns/`, shown under `Showcase/Patterns`) — granular,
  single-design-concept demonstrations with realistic (ideally
  `@roboborealis/maritime-faker`-backed) data, organized by concept category
  (`Tables/`, `Forms/`, `Maps/`, `Dashboards/`, `Intelligence/`, `Information
  Displays/`, `Flows/`). A Pattern shows *one thing done well* — a sortable/filterable
  table, a map with floating panels, a realistic form, or (in `Flows/`) a small
  connected mini-flow like a table wired to an edit form — not a full app.

**Why both exist:** a Template is what you copy; a Pattern is what you look at to
decide *whether* to copy it, or to see a specific interaction (row-select → edit,
filter → drill-down) working end to end before building your own version.

### The `storyPath` cross-link, and why it needs `check-storypaths`

`src/agent/archetypes.ts` links each archetype to a live Storybook example via
`storyPath` — a hand-typed string like `'Showcase/Templates/Basic App'` or
`'Showcase/Patterns/Tables/Fleet Manifest'`. This string has already gone stale twice
(a deleted story, a dissolved Storybook section) because nothing checked it against
the actual Storybook tree. `npm run check-storypaths`
(`scripts/check-archetype-storypaths.ts`) now runs in CI on every MR — the
`validate-manifest.yml` GitHub Actions job (`.github/workflows/`) — and fails the build
if any `storyPath` no longer resolves to a real story title or `title/name` pair.
Run it locally after renaming or moving any Storybook title.

### `patternMeta` — agent-consumable guidance on Patterns

Components document usage guidance via an `export const componentMeta = {...}` block
that `generate-manifest.ts` extracts into `src/agent/manifest.json`. Patterns
now have the equivalent: an optional `export const patternMeta = {...}` block per
story file with `demonstrates`, `whenToUse`, `keywords`, and `agentPriority` fields,
extracted the same way into `src/agent/manifest.json`'s `referencePatterns[].patternMeta`.
Not every pattern has one yet — it's opt-in, backfilled on the highest-traffic
patterns first (Fleet Manifest, Incident Report, Fleet Editor). See
`src/showcase/patterns/flows/fleet-editor.stories.tsx` for the reference example.

### Templates by export

```typescript
import { FilterTableDetailTemplate } from '@roboborealis/components/templates';
```

| Export | Archetype | When to use |
|--------|-----------|-------------|
| `AppShellTemplate` | Foundational (not numbered) | Full starter app — "Basic App" in Storybook, the mandatory default for any new app |
| `DashboardStarterTemplate` | Foundational (not numbered) | Full starter app — sidebar + Dashboard Grid content |
| `TableStarterTemplate` | Foundational (not numbered) | Full starter app — sidebar + Filter + Table + Detail content |
| `FormStarterTemplate` | Foundational (not numbered) | Full starter app — sidebar + Form + Validation content |
| `MapDashboardStarterTemplate` | Foundational (not numbered) | Full starter app — sidebar + Map Dashboard content |
| `DataDashboardTemplate` | Compact variant of Archetype 5 | KPI row + activity table (no charts), drop into an existing page |
| `ListSearchTemplate` | Archetype 4 | Searchable, filterable, exportable list |
| `FilterTableTemplate` | Archetype 6 variant | Filtered list, row → navigate away |
| `DashboardGridTemplate` | Archetype 5 | KPIs + trend charts + activity feed |
| `FilterTableDetailTemplate` | Archetype 6 | Filter list, row → side pane |
| `FormValidationTemplate` | Archetype 7 | Multi-field form with Zod validation |
| `MapDashboardTemplate` | Archetype 1 | RoboMapbox + asset table, layer, and legend floating panels |

### Selecting an archetype programmatically

```typescript
import { archetypes } from '@roboborealis/components/agent-context';

// Match by keyword
const match = archetypes.find(a =>
  a.keywords.some(k => featureDescription.toLowerCase().includes(k))
);

console.log(match?.templateExport);  // 'FilterTableDetailTemplate'
console.log(match?.subpaths);        // ['@roboborealis/components/tables', '@roboborealis/components/core', ...]
```

See `src/agent/archetypes.ts` for the full registry with `keywords[]`, `components[]`,
`subpaths[]`, and `whenToUse` guidance.

---

## Source Files

### `src/agent/manifest.json` (the unified manifest)

Auto-generated by `scripts/generate-manifest.ts` — one file, one generator. Discovery
is the union of a Storybook story-file scan (every story entry, grep parity) and a
`robo-*.tsx` source scan that catches exported components without stories. Each entry
carries:

- `name` / `entryKind` (`component` | `gallery` | `showcase` | `foundation` | `pattern-demo`) /
  `aggregate` (marks overview-story duplicates so name lookups stay unambiguous)
- `section`, `storybookPath`, `importPath`, `storyFile`, `sourceFile`, `stories`
- `subComponents` — every `.displayName` in the source file (compound components)
- `variants` (CVA) and `requiredProps` — ts-morph AST extraction with a regex
  fallback (`--regex-only` for faster runs)
- `componentMeta` — merged from the story file's `export const componentMeta` block,
  the hand-maintained sidecar (`src/agent/component-metadata.json`), and the JSDoc
  description. `category` is validated against a strict enum
  (`action | input | display | feedback | navigation | layout | visualization | maps`)
  — generation fails on an invalid value.

The manifest also carries a top-level `templates` array (all 10 exports of
`@roboborealis/components/templates`, with kind, archetype link, Storybook preview
path, and description — generation fails if a template loses its preview) and
`referencePatterns` (the Showcase patterns with their `patternMeta`).

```bash
npm run generate-agent-context   # manifest + stories catalog
```

### `src/agent/stories-catalog.json`

NLP-searchable index of all 549+ Storybook stories. Each entry has:
- `id` — Storybook story ID
- `title` — hierarchical title (`Core/Elements/RoboButton`)
- `urlPattern` — Storybook URL fragment
- `keywords` — tokenized search terms

```bash
npm run generate-stories-catalog
```

### `src/agent/design-guide.ts`

A const string containing the full design system rules — layout, colors, typography,
component selection, theme usage, accessibility, and self-contained constraints. Designed to be
injected directly into an LLM system prompt:

```typescript
import { designGuide } from '@roboborealis/components/agent-context';

const systemPrompt = `You are a frontend developer assistant.\n\n${designGuide}`;
```

---

## 5-Stage Workflow

The agent tooling follows a strict discover → compose → scaffold → verify → publish
workflow, driven by the npm scripts below:

### 1. Discover

Check if a component already exists before creating anything new.

```bash
# Search the manifest
grep -i 'YourComponentName' src/agent/manifest.json
```

**Rule:** If a similar component exists, use it. Do not create duplicates.

### 2. Compose

Plan the component before writing code:
- Choose the correct **subpath** (core, forms, feedback, etc.)
- Define **variants** and **props**
- Determine the **Storybook section** (Elements, Components, Data, Maps, Foundation, Showcase)

**Subpath selection guide:**

| The component is... | Subpath |
|---------------------|---------|
| A universal primitive (button, card, badge, avatar, chip) | `core` |
| A form input or field wrapper | `forms` |
| Navigation chrome (sidebar, topbar, tabs, breadcrumbs, command palette) | `navigation` |
| Tabular data display | `tables` |
| A status/feedback surface (alert, toast, dialog, skeleton, spinner) | `feedback` |
| A page/section layout scaffold (page shell, grid, stack, divider) | `layout` |
| A chart, KPI, or data visualization | `charts` (ECharts) or `visualizations` |
| Map-related (layers, controls, panels, overlays) | `maps` |
| Rich text editing | `editor` |
| A copy-adaptable page template | `templates` |

### 3. Scaffold

Generate component, test, and story files from the standard template:

```bash
# Basic scaffold
npm run scaffold:component -- --name RoboAlert --subpath feedback

# With custom variants
npm run scaffold:component -- --name RoboStatusBadge --subpath core \
  --variants "status:active,inactive,pending" --variants "size:sm,md,lg"
```

This generates:
- `src/{subpath}/{dir}/robo-{name}.tsx` — component with ref-as-prop + CVA + data-slot
- `src/{subpath}/{dir}/robo-{name}.test.tsx` — 5 standard tests (render, props, interaction, a11y, ref)
- `src/{subpath}/{dir}/robo-{name}.stories.tsx` — Default + AllVariants stories
- Appends export to `src/{subpath}/index.ts` barrel file

### 4. Verify

Run the quality gate checker after implementing the component:

```bash
npm run verify:component -- --path src/feedback/alert
```

Checks 21 quality gates including:
- ref accepted as a prop (React 19 — no forwardRef)
- `displayName` set
- `data-slot` attribute present
- CVA variants defined
- `cn()` for className merging
- No hardcoded hex colors
- Test file with axe a11y check
- Story file with correct tier title and AllVariants story
- Barrel export present

### 5. Publish

Regenerate the agent context so the new component is discoverable:

```bash
npm run generate-agent-context
```

This also runs automatically after `npm run build-storybook` (via the
`postbuild-storybook` hook) and before every publish (via `prepublishOnly`).
CI fails any MR that leaves `src/agent/manifest.json` or
`src/agent/stories-catalog.json` stale.

---

## Using Agent Context in Practice

### AI Agents

Agents working in this repo should:

1. **Before creating a component** — check `src/agent/manifest.json`
2. **When choosing components** — search the manifest by keyword/category (`componentMeta.category` is a strict enum)
3. **When scaffolding** — use `npm run scaffold:component`, never create files manually
4. **After implementing** — run `npm run verify:component` before opening an MR

### Custom CLI Tools

The `agent-context` subpath is a regular npm export. Any tool can import it:

```typescript
import { manifest } from '@roboborealis/components/agent-context';

// Find all chart components
const charts = manifest.components.filter(c => c.category === 'charts');

// Find components with "table" in their name
const tables = manifest.components.filter(c =>
  c.name.toLowerCase().includes('table')
);
```

### LLM System Prompt Injection

```typescript
import { designGuide } from '@roboborealis/components/agent-context';

// Inject into any LLM system prompt
const prompt = [
  'You are a RoboBorealis frontend developer assistant.',
  '',
  designGuide,
].join('\n');
```

---

## Regenerating the Agent Context

Run the single generator command when the component inventory changes:

```bash
npm run generate-agent-context   # manifest + stories catalog (NLP keywords)
```

CI enforces freshness on every MR (the `agent-context-freshness` CI job; GitHub
`validate-manifest.yml` on the mirror), and `prepublishOnly` regenerates before
any npm publish.
