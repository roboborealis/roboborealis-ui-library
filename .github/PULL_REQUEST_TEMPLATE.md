## What
<!-- One paragraph: what this PR does and why -->

## Changes
<!-- List key files changed -->
- `path/to/file` -- description

## Component Checklist
- [ ] Uses `React.forwardRef` + `displayName`
- [ ] Props interface extends correct HTML element type
- [ ] All variants defined in CVA
- [ ] Supports `className` override via `cn()`
- [ ] JSDoc with `@example`
- [ ] Works across all themes (neutral / aurora / midnight)
- [ ] Works in `compact` / `comfortable` / `spacious` density modes
- [ ] WCAG 2.1 AA: keyboard nav, focus ring, contrast ≥ 4.5:1, aria
- [ ] Unit tests ≥ 75% coverage on modified files
- [ ] Storybook story (Default + AllVariants + States)
- [ ] a11y story passes axe scan

## Quality
- [ ] No hardcoded secrets, tokens, or API keys
- [ ] No `console.log` in production code paths
- [ ] `npm audit` clean

## Pipeline
- [ ] `npm test` passes locally
- [ ] `npm run build:lib` produces correct `dist/` output
- [ ] `npm run typecheck` exits 0
