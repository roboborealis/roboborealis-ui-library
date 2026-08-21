/**
 * check-archetype-storypaths.ts
 *
 * Guards against exactly the kind of staleness that motivated this script:
 * src/agent/archetypes.ts's `storyPath` values are hand-typed strings into an
 * independently-reorganized Storybook tree, and have already gone stale twice
 * (a deleted 'Core/Layout/App Shell' story, a dissolved 'Domain' section) with
 * nothing catching it. generate-manifest.ts's stale-manifest check in
 * validate-manifest.yml can't see this — it only diffs agent/manifest.json
 * against itself, and archetypes.ts is hand-authored, not generated.
 *
 * This script scans every *.stories.tsx file for its `title` and each story's
 * `name`, builds the set of paths that actually exist in Storybook (a bare
 * title, for single-focus pattern files; or `${title}/${name}`, for
 * multi-story files like the Templates showcase), and fails if any
 * archetypes.ts storyPath isn't in that set.
 *
 * Usage:
 *   npx tsx scripts/check-archetype-storypaths.ts
 *   npm run check-storypaths
 */

import * as fs from 'fs';
import * as path from 'path';

import { archetypes } from '../src/agent/archetypes';
import { extractTitle } from './lib/extract-story-title';

function findStoryFiles(dir: string): string[] {
  const results: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findStoryFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.stories.tsx')) {
      results.push(fullPath);
    }
  }

  return results;
}

function main(): void {
  const repoRoot = path.resolve(__dirname, '..');
  const srcDir = path.join(repoRoot, 'src');
  const storyFiles = findStoryFiles(srcDir);

  const validPaths = new Set<string>();

  for (const file of storyFiles) {
    const content = fs.readFileSync(file, 'utf8');
    // Scoped to the meta block (shared with generate-manifest.ts) — a
    // content-wide match would pick up `title:` fields in mock data declared
    // above the meta, registering a phantom title instead of the real one.
    const title = extractTitle(content);
    if (!title) continue;

    // A bare title is valid (single-focus pattern files, e.g. Fleet Manifest).
    validPaths.add(title);

    // title/name is valid for every named story in the file (multi-story
    // files, e.g. the Templates showcase with Basic App / Dashboard Starter / ...).
    // Scoped to the first `name:` inside each `export const X` block — a
    // content-wide scan would also match `name:` keys in mock-data objects.
    const chunks = content.split(/^export const /m).slice(1);
    for (const chunk of chunks) {
      const nameMatch = chunk.match(/name\s*:\s*['"`]([^'"`]+)['"`]/);
      if (nameMatch) validPaths.add(`${title}/${nameMatch[1]}`);
    }
  }

  const failures: string[] = [];
  for (const archetype of archetypes) {
    if (!validPaths.has(archetype.storyPath)) {
      failures.push(`  '${archetype.id}' has storyPath '${archetype.storyPath}' which does not match any Storybook title or title/name`);
    }
  }

  if (failures.length > 0) {
    console.error(`\nERROR: ${failures.length} stale storyPath value(s) in src/agent/archetypes.ts:\n`);
    console.error(failures.join('\n'));
    console.error('\nFix by updating storyPath to the current title (or title/name), or updating/removing the archetype entry if the story was removed.\n');
    process.exit(1);
  }

  console.log(`OK: all ${archetypes.length} archetype storyPath values resolve to a real Storybook story.`);
}

main();
