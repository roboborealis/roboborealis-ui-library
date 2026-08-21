# Getting Started

New developer onboarding for contributing to `@roboborealis/components`.

---

## Prerequisites

- **Node.js LTS** (22.x or later)
- **npm 9+**
- GitHub access to [github.com/maylortaylor/roboborealis-ui-library](https://github.com/maylortaylor/roboborealis-ui-library)
- A GitHub PAT with `read:packages` + `write:packages` scope (for the npm registry)

---

## Setup

```bash
# Clone
git clone https://github.com/maylortaylor/roboborealis-ui-library.git
cd roboborealis-ui-library

# Install
npm install

# Verify everything works
npm run ci:local    # typecheck + lint + test:coverage
```

---

## Run Storybook

Storybook is the primary development and documentation environment:

```bash
npm run storybook
```

Opens at `http://localhost:6006`. Use the toolbar to switch between:
- **Midnight dark** / **Midnight light** themes
- **Aurora light** / **Aurora dark** themes
- **Compact** / **Comfortable** / **Spacious** density

Every component should look correct across all 4 theme+mode combinations.

---

## Create Your First Component

> **Check before you create.** Before scaffolding, confirm the component doesn't already exist:
> ```bash
> cat src/agent/manifest.json | grep -i "MyComponentName"
> ```
> Browse Storybook too — 200+ components are already built. Use them before creating new ones.

Use the scaffold tool — never create component files manually:

```bash
npm run scaffold:component -- --name RoboMyWidget --subpath core
```

This generates three files:
- `src/core/my-widget/robo-my-widget.tsx` — component with ref-as-prop + CVA
- `src/core/my-widget/robo-my-widget.test.tsx` — 5 standard tests
- `src/core/my-widget/robo-my-widget.stories.tsx` — Default + AllVariants stories

Implement the `TODO` placeholders in the `.tsx` file, then verify:

```bash
npm run verify:component -- --path src/core/my-widget
```

The verifier checks 21 quality gates. Fix any failures before proceeding.

---

## Run Tests

```bash
npm test                  # run once
npm run test:coverage     # with coverage report
```

Coverage threshold: 80% lines, 80% functions, 80% statements, 70% branches.

---

## Full CI Check

Run this before every MR:

```bash
npm run ci:local
```

This runs typecheck + lint + test:coverage in sequence. If it passes locally, CI will
pass too.

---

## Open a Pull Request

### Branch naming

```
<type>/TICKET-<id>_description_with_underscores
```

Examples:
- `feat/TICKET-000_add_status_badge`
- `fix/TICKET-000_date_picker_timezone`
- `chore/TICKET-000_update_deps`

### Commit format

```
TICKET-000 feat: add RoboStatusBadge component
```

### MR target

All MRs target `main`.

### Before opening

1. `npm run ci:local` passes
2. Both themes tested in Storybook (midnight + aurora, dark + light)
3. Manifest regenerated if you added a new component:
   ```bash
   npm run generate-agent-context
   ```
   If you renamed a Storybook `title`, also run `npm run check-storypaths` — it catches
   `src/agent/archetypes.ts` `storyPath` values left pointing at the old title.
4. **Version bump** — every PR to `main` must include a version bump:
   ```bash
   npm version --no-git-tag-version patch   # bug fixes, tooling, docs
   npm version --no-git-tag-version minor   # new components or features
   npm version --no-git-tag-version major   # breaking changes
   ```
   This updates both `package.json` and `package-lock.json`. Commit both files.
   Follow semver when choosing the version bump.
   If another PR merges while yours is open and its version now matches `main`, re-run the command.
   CI (`version-check.yml`) will block the merge if the version is unchanged.

---

## Key Files

| File | Purpose |
|------|---------|
| [CLAUDE.md](../CLAUDE.md) | AI agent guidance, architecture decisions, component patterns |
| [CONTRIBUTING.md](../CONTRIBUTING.md) | MR process, testing requirements, component checklist |
| [DESIGN.md](../DESIGN.md) | Machine-readable design tokens + human-readable design rules |
| [docs/theming-guide.md](./theming-guide.md) | Deep dive on the CSS variable token system |
| [docs/agent-first-architecture.md](./agent-first-architecture.md) | Agent tooling and manifest system |
| [docs/consumer-integration.md](./consumer-integration.md) | How consuming apps use @roboborealis/components — see "Starting a New App" for the default `AppShellTemplate` starting point |

---

## Project Structure

```
roboborealis-ui-library/
├── src/
│   ├── core/           ← Button, Card, Badge, Input, Chip, Avatar, Accordion
│   ├── forms/          ← Select, Textarea, Checkbox, DatePicker, FormField
│   ├── navigation/     ← Sidebar, Topbar, Tabs, Breadcrumbs, CommandPalette
│   ├── tables/         ← DataTable (TanStack) with sort, filter, pagination
│   ├── feedback/       ← Toast, Alert, Dialog, Spinner, Skeleton, Progress
│   ├── layout/         ← PageShell, Grid, Stack, Divider
│   ├── charts/         ← Line, Bar, Area, Pie, StatCard (Recharts)
│   ├── maps/           ← Mapbox wrapper, FloatingPanel, controls
│   ├── editor/         ← RichTextEditor (Slate.js)
│   ├── icons/          ← Lucide re-exports + maritime icon set
│   ├── flags/          ← Country flags + FlagSelect
│   ├── brand/          ← RoboBorealis logos and wordmarks
│   ├── osint/          ← Force graphs, sankey, correlation, timeline
│   ├── tokens/         ← TypeScript color constants
│   └── agent/          ← Machine-readable manifests and design guide
├── themes/             ← CSS variable theme files
├── scripts/            ← Scaffold, verify, manifest generators
├── docs/               ← Developer documentation (you are here)
└── designer/  ← Storybook config + Jest config
```

---

## Need Help?

- **Repository:** https://github.com/maylortaylor/roboborealis-ui-library
- **Component inventory:** `src/agent/manifest.json` — search before creating
- **Storybook:** `npm run storybook` — browse all components visually
