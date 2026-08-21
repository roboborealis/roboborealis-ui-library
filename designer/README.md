# RoboBorealis Designer

Storybook workspace for developing and showcasing `@roboborealis/components` components.

## Running Storybook

```bash
# From repo root
npm run storybook

# Or from this workspace
cd designer
npm run storybook
```

Opens at `http://localhost:6006`.

## What's Here

- **`stories/showcase.stories.tsx`** — Full Acme dashboard showcase demonstrating all major component categories: navigation shell, charts, data tables, forms, rich text editor, map overlays, and design tokens.
- **`.storybook/`** — Vite-based Storybook config with path aliases pointing directly into the library's `src/` so stories always reflect the current source state.

## Adding Stories

Stories can live in two places, both picked up by Storybook:

1. `designer/stories/**/*.stories.tsx` — workspace-level showcase stories
2. `src/**/*.stories.tsx` — co-located component stories (preferred for component-level docs)
