# AI Agent Workflow for Consumer Teams

How to configure your team's Claude Code agent to design and build UIs using
`@roboborealis/components`. This guide is for teams who want their AI agent to
understand the design system and make correct component choices automatically.

---

## What @roboborealis/components Gives Your Agent

The library ships a dedicated machine-readable knowledge layer alongside the components:

```typescript
import { manifest, storiesCatalog, designGuide, archetypes } from '@roboborealis/components/agent-context';
```

| Export | What it contains |
|--------|-----------------|
| `manifest` | Every component — name, subpath import, variants, required props, usage guidance |
| `storiesCatalog` | All Storybook stories with NLP keywords — lets agents find the right story by description |
| `designGuide` | Full design system rules as a string — inject into any LLM system prompt. Includes the Robo-first rule and template reference. |
| `archetypes` | 7 layout archetypes with keywords, components, subpaths, and template pointers — select the right starting point programmatically |

Your agent can import these at build time in scripts, or inject `designGuide` into a
system prompt for real-time assistance.

**Page templates** — 7 copy-adaptable TSX files, one per archetype. Import directly:

```typescript
import { FilterTableDetailTemplate } from '@roboborealis/components/templates';
// Adapt TODO injection points: domain type, tRPC query, column headers, filter options
```

To select the right template by feature description:
```typescript
import { archetypes } from '@roboborealis/components/agent-context';
const match = archetypes.find(a => a.keywords.some(k => description.includes(k)));
// match.templateExport → name of the template to import
// match.subpaths       → which @roboborealis/components/* subpaths to install/import
```

---

## Setting Up Your Consumer App's Claude Code

### Step 1: Add a CLAUDE.md to your app repo

Create or update your app's `CLAUDE.md` to tell your agent about `@roboborealis/components`.
Copy this starter block:

```markdown
## @roboborealis/components

This app uses `@roboborealis/components` from the RoboBorealis shared design system.

**Robo-First Rule (non-negotiable):**
The library has 200+ components. Use them. Never recreate what already exists.
- Need a button? `RoboButton`. Table? `RoboDataTable`. Input? `RoboInput`. Dialog? `RoboDialog`.
- Before writing any UI element, query the shipped agent context (no repo clone needed):
  ```ts
  import { manifest, templates, archetypes } from '@roboborealis/components/agent-context';
  ```
  With a side-by-side clone of `roboborealis-ui-library`, the same data is greppable at `src/agent/manifest.json`
- If a Robo component exists for your need → use it, no exceptions.
- Only raw HTML allowed: structural `<div>`/`<span>` containers where no Robo layout fits.

**Before building any UI page:**
1. Check if a template covers your layout: `import { ... } from '@roboborealis/components/templates'`
2. If yes — import and adapt the TODO injection points
3. If no template fits — use `/design-ui-feature` skill to compose from Robo components
4. Always import from subpaths, never from the root `@roboborealis/components`
5. Use the correct theme (midnight or aurora) — set via `data-theme` HTML attribute

**Available subpaths:**
- `@roboborealis/components/core` — Button, Card, Badge, Input, Chip, Avatar, Accordion
- `@roboborealis/components/forms` — Select, Textarea, Checkbox, DatePicker, FormField
- `@roboborealis/components/navigation` — Sidebar, Topbar, Tabs, Breadcrumbs, CommandPalette
- `@roboborealis/components/tables` — DataTable (TanStack) with sort, filter, pagination, inline edit
- `@roboborealis/components/feedback` — Toast, Alert, Dialog, Spinner, Skeleton, Progress
- `@roboborealis/components/layout` — PageShell, Grid, Stack, Divider
- `@roboborealis/components/charts` — LineChart, BarChart, AreaChart, PieChart, StatCard
- `@roboborealis/components/maps` — Mapbox wrapper, FloatingPanel, MapOverlay, controls
- `@roboborealis/components/editor` — RichTextEditor (Slate.js)
- `@roboborealis/components/icons` — 200+ Lucide re-exports + maritime icons
- `@roboborealis/components/flags` — Flag display and FlagSelect
- `@roboborealis/components/osint` — ForceGraph, SankeyChart, RadarChart, CorrelationMatrix, Timeline
- `@roboborealis/components/tokens` — TypeScript color constants

**Design system reference:** https://github.com/maylortaylor/roboborealis-ui-library
**Storybook:** (run locally: `npm run storybook` in roboborealis-ui-library)
```

### Step 1b: Point your agent at the shipped knowledge layer (high-value upgrade)

Rather than duplicating component docs, point your agent at what the package already
ships: the `agent-context` export and the generated manifest.

```markdown
## Deep Context — @roboborealis/components

- Component data: `import { manifest, storiesCatalog, archetypes } from '@roboborealis/components/agent-context'`
- Full design rules (injectable system prompt): `import { designGuide } from '@roboborealis/components/agent-context'`
- With a side-by-side clone, the same data is greppable at `src/agent/manifest.json`,
  and deeper docs live in `docs/` and `DESIGN.md`.
```

**Why this matters:** the manifest tells the agent *exactly* which props, variants, and
subpath apply to `RoboDataTable` before it writes a single line of code — and it stays
in sync with the components because it is generated from them.

---

### Step 2: Inject the design guide into your agent's system prompt

For custom tooling or Claude API integrations, inject `designGuide` as context:

```typescript
import { designGuide } from '@roboborealis/components/agent-context';

const systemPrompt = [
  'You are a frontend developer building a RoboBorealis application.',
  '',
  designGuide,
].join('\n');
```

This gives the agent the full component selection rules, theming guidance, self-contained
constraints, and accessibility requirements.

### Step 3: Search the manifest programmatically

```typescript
import { manifest } from '@roboborealis/components/agent-context';

// Find all table components
const tableComponents = manifest.components.filter(c =>
  c.category === 'tables'
);

// Find a component by name
const button = manifest.components.find(c => c.name === 'RoboButton');
console.log(button?.importPath);   // '@roboborealis/components/core'
console.log(button?.variants);     // CVA variant options
```

---

## What Your Agent Can Do Today

### ✅ Start from a template (fastest path)

For 7 common page layouts, a ready-made template exists:

```tsx
import { FilterTableDetailTemplate } from '@roboborealis/components/templates';
// The template has your layout, RoboDataTable, filter sidebar, detail pane,
// and TODO comments at every injection point. Adapt and ship.
```

Or let the agent pick the right template by keyword:
```tsx
import { archetypes } from '@roboborealis/components/agent-context';
const match = archetypes.find(a => a.keywords.some(k => description.includes(k)));
// match.templateExport → FilterTableDetailTemplate, DashboardGridTemplate, etc.
```

Templates are browsable in Storybook under `Showcase/Templates/`.

### ✅ Compose multi-component pages

Use the `/design-ui-feature` skill for map-based pages (Archetypes 1–3) or when you
need more customization than a template provides. The skill identifies the archetype,
checks for an existing template first, then outputs a full skeleton with correct Robo
components and import paths.

```
"Build me a vessel monitoring map with a floating stats panel and alert system."

→ Archetype 1: Map + Floating Panels (no template — compose directly)
→ RoboMapbox + RoboAssetLayer + RoboFloatingPanel + RoboAlertProvider
→ [outputs working TSX skeleton using only Robo map components]
```

All 7 archetypes have live examples in `Showcase/Templates/` and `Showcase/Patterns/` in Storybook.

---

### ✅ Fetch and render point-signal map layers

For a point-based signal layer on a map (incidents, alerts, sensor readings — anything
with a lat/lng and a category/severity), don't hand-roll Mapbox source/layer/click
wiring. `RoboIncidentLayer` already does it:

```tsx
import { RoboIncidentLayer } from '@roboborealis/components/maps';

function MySignalLayer({ onSelect }: { onSelect: (props: Record<string, unknown>) => void }) {
  const { data } = useMySignalFetch(); // your app's own data-fetching — API contracts vary per consumer

  return (
    <RoboIncidentLayer
      incidents={data}             // GeoJSON FeatureCollection<Point>
      severityField="severity"     // property holding 'critical' | 'high' | 'medium' | 'low'
      onIncidentClick={(f) => onSelect(f.properties)}
      sourceIdPrefix="my-signal"   // unique per mounted instance
    />
  );
}
```

`RoboIncidentLayer` owns the Mapbox source, the circle layer, the severity color
expression, and click/hover wiring — your component only owns the fetch. If your
severity is a continuous number rather than the four fixed buckets, map it to one
of `'critical'|'high'|'medium'|'low'` before passing it in (a small local
`severityBucket()` helper is enough — no library change needed).

**Don't build a second copy of `useMapSource`/`useMapLayer`/`map.on('click', ...)`
for every new point layer.** That pattern predates `RoboIncidentLayer` and is easy to
reach for out of habit. Check the manifest for `RoboIncidentLayer` (and sibling
`*Layer` components like `RoboAssetLayer`/`RoboZoneAlertLayer`) before writing new
Mapbox wiring by hand.

---

### ✅ Pick the right component

Given a feature description, your agent can search the manifest and identify
which Robo components to use. Example prompt that works well:

> "I need to build a vessel search page with a filter bar, a results table,
> and a details panel."

Agent response with access to the manifest:
- Filter bar → `RoboInput` + `RoboSelect` from `@roboborealis/components/forms`
- Results table → `RoboDataTable` from `@roboborealis/components/tables`
- Details panel → `RoboFloatingPanel` or `RoboCard` from maps/core

### ✅ Generate correct import statements

The manifest includes the exact `importPath` for every component. Your agent
will never guess wrong:

```tsx
import { RoboDataTable } from '@roboborealis/components/tables';
import { RoboButton, RoboCard } from '@roboborealis/components/core';
import { RoboSelect } from '@roboborealis/components/forms';
```

### ✅ Apply themes correctly

The design guide includes the full theming model:

```tsx
// layout.tsx — Midnight app
import '@roboborealis/components/theme-midnight';

<html data-theme="midnight">   // dark by default
```

```tsx
// layout.tsx — Aurora app
import '@roboborealis/components/theme-aurora';

<html data-theme="aurora">    // light by default
```

### ✅ Wire forms with react-hook-form + Zod

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { RoboFormField, RoboInput, RoboSelect } from '@roboborealis/components/forms';
import { RoboButton } from '@roboborealis/components/core';

const schema = z.object({
  vesselName: z.string().min(1),
  portOfArrival: z.string().min(1),
});

export function ArrivalForm() {
  const form = useForm({ resolver: zodResolver(schema) });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <RoboFormField form={form} name="vesselName" label="Vessel Name">
        <RoboInput placeholder="MV EXAMPLE" />
      </RoboFormField>
      <RoboFormField form={form} name="portOfArrival" label="Port of Arrival">
        <RoboSelect options={portOptions} />
      </RoboFormField>
      <RoboButton type="submit">Submit Report</RoboButton>
    </form>
  );
}
```

### ✅ Find Storybook examples

```typescript
import { storiesCatalog } from '@roboborealis/components/agent-context';

// Find all stories related to "table"
const tableStories = storiesCatalog.stories.filter(s =>
  s.keywords.some(k => k.includes('table'))
);
```

---

## When to Reach Back to the Library Team

If your agent (or your team) determines that a needed component does not exist in
the manifest, **do not create a one-off custom component**. Instead:

1. Check the [Storybook](http://localhost:6006) — search for related stories
2. Check if a similar component can be composed from existing Robo primitives
3. If genuinely missing, open an **issue** requesting the new component:
   - Title: `feat: add RoboYourComponent to @roboborealis/components/subpath`
   - Include: design spec or screenshot, which apps need it, when it's needed

The library team ships new components on a regular cadence. Custom one-offs in
consumer apps create maintenance burden and divergence from the design language.

---

## Reference

| Resource | Location |
|----------|---------|
| Component catalog (Storybook) | `npm run storybook` in `roboborealis-ui-library` |
| Full integration guide | [docs/consumer-integration.md](./consumer-integration.md) |
| Theming guide | [docs/theming-guide.md](./theming-guide.md) |
| Agent-first architecture | [docs/agent-first-architecture.md](./agent-first-architecture.md) |
| CLAUDE.md for this repo | [CLAUDE.md](../CLAUDE.md) |
| Design system rules (text) | `designGuide` from `@roboborealis/components/agent-context` |
| Component manifest (JSON) | `manifest` from `@roboborealis/components/agent-context` |
| Stories catalog (NLP) | `storiesCatalog` from `@roboborealis/components/agent-context` |
