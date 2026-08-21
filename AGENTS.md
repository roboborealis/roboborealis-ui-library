# AGENTS.md - @roboborealis/components

Agent-agnostic guidance for any AI coding agent working in this repo. Vendor-specific
agent config files stay local and gitignored; this file is the tracked source of truth.

A shared React + Tailwind UI component library. 200+ components with a single design language.
Stack: React 19, TypeScript, Tailwind v4, shadcn/ui + Radix, tsup, Storybook 10, Vitest 4.

## Quick Reference
- CI gate: `npm run ci:local` (typecheck + lint + test:coverage) - run before every PR
- Build the library: `npm run build:lib` (4-pass tsup -> ESM + CJS + DTS)
- Storybook: `npm run storybook` (config in `designer/.storybook`)
- **Robo-First:** 200+ components exist - use them. `grep -i "<need>" src/agent/manifest.json` before writing any UI. Never hand-roll a button, table, input, dialog, or chart.
- **Check `src/agent/manifest.json` before creating any new component** - verify one doesn't already exist.
- Themes: `midnight` (dark-first), `aurora` (light-first), `sol` (neutral). Import one theme CSS, set `data-theme` + `data-mode` on `<html>`.

## Agent skills

This repo uses Matt Pocock's engineering flow by default when building features.

**Build flow:** `grill-with-docs` (align on the plan, write CONTEXT + ADRs) -> `to-spec`
-> `to-tickets` -> `implement` -> `code-review`. Use `wayfinder` for efforts too big for
one session, and `codebase-design` / `domain-modeling` as the vocabulary references.

### Issue tracker

Issues live in GitHub Issues (via the `gh` CLI). See `docs/agents/issue-tracker.md`.

### Triage labels

Default five-role vocabulary. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: `CONTEXT.md` + `docs/adr/` at the repo root (created lazily by the
skills). See `docs/agents/domain.md`.

## Deep Context

| Load when... | File |
|--------------|------|
| Getting started / setup | [docs/getting-started.md](docs/getting-started.md) |
| Theming (themes, tokens, data-theme, data-mode) | [docs/theming-guide.md](docs/theming-guide.md) |
| Consuming the library in an app | [docs/consumer-integration.md](docs/consumer-integration.md) |
| Agent-first architecture (manifest, design guide) | [docs/agent-first-architecture.md](docs/agent-first-architecture.md) |
| Design standards & WCAG | [DESIGN.md](DESIGN.md) |
| Contributing | [CONTRIBUTING.md](CONTRIBUTING.md) |
