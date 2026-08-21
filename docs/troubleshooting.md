# Troubleshooting

Common issues and fixes when working in `@roboborealis/components`.

---

## Environment Setup

### Node version mismatch

`npm install` or `npm run ci:local` fails with version errors.

- Run `nvm use` from the repo root (`.nvmrc` pins Node 22)
- Verify: `node --version` should show `v22.x`
- Install nvm if needed: [https://github.com/nvm-sh/nvm](https://github.com/nvm-sh/nvm)

### GitHub token / npm 401

`npm install` fails with 401 for `@roboborealis` scoped packages.

- Your GitHub PAT needs `read:packages` scope
- Add to `.npmrc` in the repo root: `//registry.npmjs.org/:_authToken=${GITHUB_TOKEN}`
- Set in shell: `export GITHUB_TOKEN=<your-pat>`
- Test it: `curl -H "Authorization: Bearer $GITHUB_TOKEN" https://api.github.com/user`

### Clone permission errors

Clone over HTTPS — use your GitHub username and a PAT as the password, or SSH:
```bash
git clone https://github.com/maylortaylor/roboborealis-ui-library.git
```

---

## Storybook won't start or shows a blank screen

**Symptom:** `npm run storybook` exits immediately, or the browser opens to a blank/error page.

**Fixes:**
1. Delete the Storybook cache and reinstall:
   ```bash
   rm -rf node_modules/.cache/storybook
   npm install
   npm run storybook
   ```
2. If you see `Cannot find module` errors, a new dep was added — `npm install` again.
3. If the port is already in use: `lsof -i :6006` to find the process, then `kill <PID>`.

---

## CSS variables not applying / theme looks wrong

**Symptom:** Components render with no colors, wrong colors, or ignore dark/light mode.

**Root causes and fixes:**

1. **Missing `data-theme` attribute** — The theme requires `data-theme="midnight"` or `data-theme="aurora"` on `<html>`. Without it, no CSS tokens load.

2. **Using `.dark` class instead of `data-mode`** — the theme CSS matches `[data-mode='dark']` / `[data-mode='light']` and nothing else. `RoboThemeProvider` writes that attribute; do not install next-themes alongside it (see below). If your app already has class-based `dark:` utilities, repoint the Tailwind variant instead of rewriting them:
   ```css
   @custom-variant dark (&:is([data-mode='dark'] *));
   ```

2b. **next-themes installed alongside `RoboThemeProvider`** — two writers on `documentElement.dataset.mode` with nothing arbitrating between them. The classic symptom: set Appearance to System, change your OS mode, then change the colour theme — `data-mode` snaps back to the mode from page load while Tailwind's class stays put, so the two disagree and nothing repairs it. Remove next-themes; `RoboThemeProvider` has covered `system` and pre-paint since 0.29.0. Migration steps: [consumer-integration.md § 5](consumer-integration.md).

3. **Stale Next.js CSS cache** — After reinstalling `@roboborealis/components`, always clear `.next`:
   ```bash
   rm -rf .next && npm run dev
   ```

4. **Consumer CSS overriding theme tokens** — If your `globals.css` defines `:root { --primary: ... }` or `.dark { ... }`, it will override the RoboBorealis theme. Remove any hardcoded token values and let `theme-midnight.css` / `theme-aurora.css` own them.

5. **Tailwind v4 not bridged** — If Tailwind utilities like `bg-primary` aren't working, you need the `@theme inline` block in `globals.css`. See [`docs/theming-guide.md`](./theming-guide.md#tailwind-v4-token-bridging).

---

## Test coverage threshold failures

**Symptom:** `npm run test:coverage` fails with "Coverage threshold not met".

**Fixes:**
1. Run `npm run test:coverage` and look for the red table rows — these are the files below threshold (80% lines/functions/statements, 70% branches).
2. Add tests for uncovered branches in those files.
3. If a file is a re-export barrel (`index.ts`) and is being counted, it may need a `/* istanbul ignore */` comment or a trivial import test.

---

## Turbopack `@source` directive panic (Next.js 16)

**Symptom:** Consumer app crashes on `npm run dev` with a Turbopack error about `@source` scanning too many files.

**Fix:** Restrict the `@source` glob in your consumer's `globals.css` to JS files only:

```css
/* globals.css — do NOT use a bare directory path */
@source "../../node_modules/@roboborealis/components/dist/*.{mjs,cjs,js}";
```

A bare `@source "../../node_modules/@roboborealis/components/dist"` causes Turbopack to scan every file including CSS, causing a panic.

---

## Component missing from `agent/manifest.json`

**Symptom:** A component you just added doesn't appear when searching the manifest, or the AI agent doesn't know about it.

**Fix:** Regenerate the agent context:
```bash
npm run generate-agent-context
```

Commit the updated `src/agent/manifest.json` and `src/agent/stories-catalog.json` alongside your component changes.

---

## `npm link` broken with Next.js Turbopack

**Symptom:** `npm link @roboborealis/components` appears to install but components don't render, or you get duplicate React errors.

**Explanation:** `npm link` creates a symlink that Turbopack doesn't resolve the same way as a real package. Always use the tarball workflow for local testing:

```bash
# In roboborealis-ui-library
npm run build && npm pack   # → roboborealis-ui-X.Y.Z.tgz

# In consumer app
rm -rf node_modules/@roboborealis/components
npm install ../roboborealis-ui-library/roboborealis-ui-X.Y.Z.tgz
rm -rf .next && npm run dev
```

See [`docs/consumer-integration.md`](./consumer-integration.md) for the full tarball workflow.

---

## Type errors after upgrading the library

**Symptom:** TypeScript errors appear in consumer code after updating `@roboborealis/components`.

**Fixes:**
1. Check `CHANGELOG.md` for any breaking prop changes in the new version.
2. Clear the TypeScript cache: `rm -rf node_modules/.cache/typescript`.
3. Restart your TypeScript server in VS Code: `Cmd+Shift+P → TypeScript: Restart TS Server`.

---

## `npm run ci:local` fails locally but I don't know why

Run each check in isolation to isolate the failure:

```bash
npx tsc --noEmit             # typecheck only
npx eslint src               # lint only
npm run test:coverage        # tests + coverage
```

The first failing command will show the exact error.
