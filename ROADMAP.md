# @roboborealis/components Roadmap

Short-term work is tracked in the repo's issues.
This doc captures larger themes, deferred decisions, and known technical gaps — the things
Jira tickets alone don't surface.

---

## v0.6.x — In Progress

### Test coverage: visualizations + templates

Coverage thresholds were intentionally lowered in v0.5.x when `src/visualizations/` and
`src/templates/` were added. Both have zero or minimal test files.

- Add ~10 test files in `src/visualizations/` (force-graph, bubble-chart, radar, sankey, etc.)
- Add ~5 test files in `src/templates/` (smoke test per archetype render)
- Raise Vitest coverage thresholds from 67/63/62/65 toward 75 — see
  `docs/plans/plan-vitest-coverage-thresholds.md` and the exclusion rationale in
  `vitest.config.ts`

### designer: Vite 6 → 8 upgrade

- `designer/package.json` vite: `^6.4.1` → match root (`^8.0.10`)
- Validate: `npm run build-storybook` + `npm run ci:local` after upgrade
- Do in a dedicated MR — not bundled with feature work

### RoboIconButton ignores density

`RoboButton` takes its height from the density tokens (`--btn-h-sm/md/lg`), which every theme
redefines for Compact / Comfortable / Spacious. `RoboIconButton` forwards `size` to `RoboButton`
but then overrides it with hardcoded classes in its `sizeClasses` map, so tailwind-merge strips
the token-based height and the button renders a fixed size at every density.

Measured in an internal usability study, row-action menu vs. adjacent text buttons:

| Density | Text button (`sm`) | Icon button (`md`) |
| --- | --- | --- |
| Compact | 20px | 40px |
| Spacious | 32px | 40px |

- Fix in `src/core/button/robo-icon-button.tsx` — square off the density token
  (`h-[var(--btn-h-md)] w-[var(--btn-h-md)]`) instead of `h-10 w-10`
- Watch the WCAG 2.1 AA target-size floor (2.5.8, 24×24 CSS px): at Compact, `md` lands exactly
  on 24px and `sm` would fall to 20px — clamp `sm` rather than let it shrink below
- No theme work needed; the tokens already exist
- Cover all three densities with a story or unit test

---

## v0.7.0 — Medium-term

### Accessibility audit (WCAG 2.1 AA)

- Full component sweep using `vitest-axe` (already installed; currently underused)
- Create `docs/a11y-guide.md`: per-component requirements and test patterns
- Target: every component passes axe-core with zero violations

### Performance baselines

- Bundle size budgets per subpath (core, forms, tables, etc.) via `size-limit`
- Add to CI pipeline as a non-blocking warning → promote to blocking gate over 2 sprints
- Document tree-shaking strategy and expected bundle footprint
- Create `docs/performance.md`

### self-contained font bundling — DONE (technical slice)

- `.woff2` bundling shipped via `scripts/copy-fonts.ts` + `@fontsource/*` packages
  (Inter, DM Sans, Varela, Open Sans, OpenDyslexic, Sora — all OFL-1.1 licensed,
  self-hosted, zero external network calls). See `RoboFontFamilyProvider`.
- OFL-1.1 does not require the same sign-off gate as commercial/Google Fonts
  licensing, but flag this to design/legal as an explicit approval step in the
  MR if a formal sign-off is still wanted before merge — this roadmap update
  reflects the technical work only, not a business-process closure.

---

## Long-term / Backlog

### RoboAlertProvider server integration

- Client-side alert analysis exists (loitering, speed-inconsistency, voyage-deviation)
- Requires server-side rule evaluation engine and consumer backend integration
- Placeholder lives in `src/feedback/` — no timeline set

### Floating panel drag/snap E2E tests

- `src/maps/floating-panel/robo-floating-panel.test.tsx:202` — known jsdom limitation
- `jsdom` does not reliably support `getBoundingClientRect` for drag interactions
- Fix requires Playwright E2E tests or a significant jsdom improvement

### Manifest regeneration in CI

- `npm run generate-manifest` is currently manual (not enforced in the CI pipeline)
- Add a CI check that fails if the manifest is stale relative to the current component set
- Prevents silent manifest drift when developers skip the step

### verify:component as CI gate

- `npm run verify:component` is currently recommended but optional
- Promote to a required CI step for any file under `src/` matching component patterns

### Enterprise pattern library expansion

- Expand `src/templates/` from 7 → 20+ copy-adaptable full-page patterns
- Priority candidates: multi-step wizard, split-pane entity view, command center dashboard
- Consumer-driven: collect real app page screenshots, extract dominant patterns

### React 20 readiness

- Monitor React 20 RC → stable timeline
- Audit concurrent feature usage for forward compatibility
- Update `peerDependencies` when the API is stable

---

## Branch Cleanup

The following branches are merged and safe to delete after MR !70 lands on `main`.

**Local:**
```bash
git branch -d develop
git branch -d chore/no-ticket_sync_main_into_develop
git branch -d feat/no-ticket_templates_subpath
git branch -d refactor/no-ticket_robo-first-audit-consolidation
git branch -d chore/no-ticket_agent-infrastructure-audit
```

**Remote:**
```bash
git push origin --delete chore/no-ticket_bump_0.4.0
git push origin --delete chore/no-ticket_final_sync
git push origin --delete chore/no-ticket_github_migration
git push origin --delete chore/no-ticket_agent-infrastructure-audit
git push origin --delete chore/no-ticket_sync_main_into_develop
git push origin --delete chore/no-ticket_sync_main_post_0.3.0
git push origin --delete develop
git push origin --delete feat/no-ticket_templates_subpath
git push origin --delete feature/no-ticket_composition_skill_and_patterns
git push origin --delete refactor/no-ticket_robo-first-audit-consolidation
git push origin --delete release/post-0.3.0-cleanup
```
