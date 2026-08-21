<!-- @format -->

# Contributing to RoboBorealis Design System

Thank you for contributing to the RoboBorealis Design System! This guide explains how to develop, test, and document components.

## Scaffolding New Components (Recommended)

> **Check before you create.** Search `src/agent/manifest.json` to confirm the component doesn't already exist:
> ```bash
> cat src/agent/manifest.json | grep -i "MyComponentName"
> ```
> Also browse Storybook (`npm run storybook`) — if it's already there, use it or extend it rather than duplicating.

Use the scaffold tool to generate components with all required patterns pre-wired:

```bash
# Basic — generates component + test + story with default variants
npm run scaffold:component -- --name RoboAlert --subpath feedback

# Custom variants
npm run scaffold:component -- --name RoboStatusBadge --subpath core \
  --variants "status:active,inactive,pending" --variants "size:sm,md,lg"
```

After scaffolding, implement the `TODO` placeholders in the generated `.tsx` file, then verify:

```bash
npm run verify:component -- --path src/feedback/alert
```

The verifier checks 21 quality gates: ref-as-prop (no forwardRef), displayName, data-slot, CVA, no hardcoded hex,
axe tests, 4-tier story title, AllVariants story, barrel export, and more.

When done, update the manifests and run CI:

```bash
npm run generate-agent-context       # update agent manifest + stories catalog
npm run ci:local                     # full check: typecheck + lint + test
```

The scaffold script sets up subpath selection, variant patterns, and file structure for you.

---

## Component Authoring Patterns

Every Robo component must follow these patterns (the scaffold tool applies them automatically):

1. **`ref` as a prop** (`ref?: React.Ref<T>`) — React 19 ref-as-prop; never `React.forwardRef`
2. **`displayName`** — always set for DevTools debugging
3. **`data-slot="<name>"`** — on the root element for testing/styling hooks
4. **CVA variants** — use `class-variance-authority` for variant axes
5. **`cn()` utility** — for className merging (never concat strings)
6. **Robo prefix** — all components: `RoboButton`, `RoboInput`, etc.
7. **Named exports** — for tree-shaking (`export { RoboButton }`, not `export default`)
8. **No hardcoded hex** — use CSS custom properties only
9. **No inline styles** — Tailwind classes only

### Styling Guidelines

- Use **CSS variables** for colors (never hardcoded hex)
- Support **light and dark modes** via `data-mode` attribute
- Use **semantic naming** (primary, secondary, destructive, muted)

---

## Testing Requirements

### Coverage Threshold

Coverage thresholds are enforced by CI. The **global** enforced minimums are lower than the target because the visualizations and templates are still gaining coverage (see the ratchet note in `vitest.config.ts`):

| Metric | Enforced (CI) | Target |
|--------|--------------|--------|
| Lines | 67% | 80% |
| Statements | 65% | 80% |
| Functions | 63% | 80% |
| Branches | 62% | 70% |

**For new components and modified files, aim for ≥75% on your own changes.** The global thresholds ratchet upward over time — never lower them, and each new component should push the number up.

```bash
npm run test:coverage
```

If the build fails on coverage, check `coverage/index.html` to see which files are below threshold.

### Running Tests

```bash
npm test                 # Run all tests once
npm run test:watch      # Run in watch mode (during development)
npm run test:coverage   # Generate coverage report
```

### Test File Location

Place test files next to their component:

```
src/core/button/
├── robo-button.tsx
├── robo-button.test.tsx    ← Test file here
└── robo-button.stories.tsx
```

### axe Setup (vitest-axe)

The `toHaveNoViolations` matcher is registered globally in `vitest.setup.ts` —
test files only import the runner:

```typescript
import { axe } from "vitest-axe"
```

Then use in tests:

```typescript
const { container } = render(<RoboComponent />)
const results = await axe(container)
expect(results).toHaveNoViolations()
```

---

## Storybook Requirements

### Auto-Generated Documentation

Add `tags: ["autodocs"]` to enable auto-doc generation from TypeScript props:

```typescript
const meta = {
  title: "Components/Button",
  component: RoboButton,
  tags: ["autodocs"],  // ← This enables auto-docs
} satisfies Meta<typeof RoboButton>
```

### Variant Controls

Use `argTypes` for interactive prop controls:

```typescript
argTypes: {
  variant: {
    control: "select",
    options: ["primary", "secondary", "outline"],
  },
  size: {
    control: "select",
    options: ["sm", "md", "lg"],
  },
}
```

### Gallery Stories

Include stories that showcase all variants and sizes:

```typescript
export const AllVariants: Story = {
  render: () => (
    <div className="flex gap-4">
      <RoboButton variant="primary">Primary</RoboButton>
      <RoboButton variant="secondary">Secondary</RoboButton>
      <RoboButton variant="outline">Outline</RoboButton>
    </div>
  ),
}
```

---

## Available Commands

```bash
# Development
npm run storybook       # Start Storybook (component playground)
npm test                # Run Jest tests
npm run test:watch      # Watch mode
npm run test:coverage   # Coverage report

# Building & Quality
npm run build           # Build library via tsup
npm run typecheck       # TypeScript check
npm run lint            # ESLint check
npm run lint:fix        # ESLint auto-fix
npm run ci:local        # Full CI: typecheck + lint + test:coverage

# Scaffolding & Manifests
npm run scaffold:component -- --name RoboFoo --subpath core
npm run verify:component -- --path src/core/foo
npm run generate-agent-context
```

---

## Commit Message Guidelines

Use clear, descriptive commit messages:

```
feat: add RoboButton component with tests and Storybook

- Implement ref-as-prop wrapper around shadcn/ui Button
- Add 5 comprehensive tests (render, props, interactions, a11y, ref)
- Create Storybook story with variant and size galleries
- Achieve 85% test coverage
```

---

## Manifest Regeneration

After adding or renaming any component, run `npm run generate-agent-context` before opening your MR:

```bash
npm run generate-agent-context
```

CI enforces this on every MR (the `agent-context-freshness` job regenerates and diffs `src/agent/manifest.json` and `src/agent/stories-catalog.json`) — a stale manifest breaks downstream AI agents and programmatic component search.

---

## Self-Contained Assets

The library bundles all its assets so it works offline and in locked-down environments. Do not add external assets, fonts, analytics, or third-party network integrations — inline or bundle everything instead.

---

## `src/showcase/`

`src/showcase/` contains full-page compositions, not individual component demos: `Showcase/Templates` (copy-adaptable Starter apps + content-only archetype templates) and `Showcase/Patterns` (granular, single-concept domain demos, e.g. a Fleet Monitor page). Add here when building a new compound domain pattern or template. Individual component demonstrations belong in the component's own `*.stories.tsx` file.

---

## CI/CD Pipeline

The GitHub Actions pipeline automatically:

1. **Installs dependencies**
2. **Runs linting** (ESLint)
3. **Runs tests** (Jest) with coverage reporting
4. **Checks TypeScript** types
5. **Scans for security vulnerabilities** (SAST, dependency scanning)

Ensure all checks pass before merging.

---

## Support & Questions

- Read [docs/getting-started.md](docs/getting-started.md) for onboarding
- Browse Storybook (`npm run storybook`) for existing components
- Check [CLAUDE.md](./CLAUDE.md) for navigation to topic files
- Contact the RoboBorealis Design System team
