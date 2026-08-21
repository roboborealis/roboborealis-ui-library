/**
 * verify-storybook-assets.ts
 *
 * an earlier change. `build-storybook` succeeding is not the same as the built site being
 * loadable: a truncated upload, a partial cache restore, or a Vite config change
 * that stops emitting a chunk all produce a green pipeline and a site where every
 * story reports "Failed to fetch dynamically imported module". Nothing between
 * the build and the deploy checked that the files the site asks for are the files
 * the site ships.
 *
 * Collects every `assets/*` reference in the build's HTML and JS and fails if any
 * target is missing or zero-length.
 *
 * Usage:
 *   npx tsx scripts/verify-storybook-assets.ts [buildDir]
 *   npm run verify:storybook-assets
 */

import * as fs from 'fs';
import * as path from 'path';

const BUILD_DIR = path.resolve(process.cwd(), process.argv[2] ?? 'storybook-static');

/** File types that can carry a reference to another built asset. */
const SCANNABLE = /\.(html|js|mjs|json)$/;

/**
 * Matches `assets/<name>.<ext>` however it is quoted or concatenated — Vite emits
 * these in `<script src>`, in `__vitePreload` argument arrays, and in plain string
 * literals inside chunks.
 */
const ASSET_REFERENCE = /assets\/[A-Za-z0-9._-]+\.(?:js|mjs|css)/g;

/** Only a few referrers are ever printed, so there is no reason to accumulate more. */
const MAX_REFERRERS_TRACKED = 4;

function main(): void {
  if (!fs.existsSync(BUILD_DIR)) {
    console.error(`✖ No Storybook build at ${BUILD_DIR}. Run \`npm run build-storybook\` first.`);
    process.exit(1);
  }

  // Referenced asset → the files that ask for it, so a failure names the page a
  // user would have landed on rather than just the missing hash.
  const referencedBy = new Map<string, Set<string>>();

  for (const entry of fs.readdirSync(BUILD_DIR, { recursive: true, withFileTypes: true })) {
    if (!entry.isFile() || !SCANNABLE.test(entry.name)) continue;

    const full = path.join(entry.parentPath, entry.name);
    const relative = path.relative(BUILD_DIR, full);

    for (const reference of fs.readFileSync(full, 'utf-8').match(ASSET_REFERENCE) ?? []) {
      const referrers = referencedBy.get(reference) ?? new Set<string>();
      if (referrers.size < MAX_REFERRERS_TRACKED) referrers.add(relative);
      referencedBy.set(reference, referrers);
    }
  }

  if (referencedBy.size === 0) {
    console.error(`✖ Found no asset references at all under ${BUILD_DIR} — the build looks empty.`);
    process.exit(1);
  }

  const broken: string[] = [];
  for (const [reference, referrers] of referencedBy) {
    // One syscall answers both questions: `undefined` means missing, size 0 means empty.
    const stat = fs.statSync(path.join(BUILD_DIR, reference), { throwIfNoEntry: false });
    if (stat && stat.size > 0) continue;

    const problem = stat ? 'empty  ' : 'missing';
    broken.push(`${problem}  ${reference}  ← referenced by ${[...referrers].sort().join(', ')}`);
  }

  if (broken.length > 0) {
    console.error(`✖ ${broken.length} broken asset reference(s) in ${BUILD_DIR}:\n`);
    for (const line of broken.sort()) console.error(`  ${line}`);
    console.error('\nDeploying this build would show "Failed to fetch dynamically imported module".');
    process.exit(1);
  }

  console.log(`✔ ${referencedBy.size} asset references resolve, all non-empty.`);
}

main();
