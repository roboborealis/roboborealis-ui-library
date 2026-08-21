/**
 * changelog.ts
 *
 * Two audiences:
 *  - Every MR ('generate'/'check', the default): keeps `## [Unreleased]`
 *    continuously up to date with every commit since the last `v*` tag,
 *    REPLACING whatever `## [Unreleased]` section is already there (or
 *    inserting fresh if none exists) rather than stacking a new one on
 *    every run. This is what makes running `generate` on every single PR
 *    safe and idempotent instead of producing duplicate sections.
 *  - The release step ('release', see docs/release-process.md): renames
 *    the current `## [Unreleased]` section to the version being released,
 *    dated today, by regenerating with `--tag` and swapping it in in the
 *    same place. Only run this once, as part of cutting an actual release.
 *
 * git-cliff's own --prepend inserts at the absolute top of the file, which
 * would duplicate cliff.toml's header above the file's existing hand-written
 * preamble every run — so this script splices freshly generated sections in
 * right after a fixed marker comment instead, leaving the static preamble
 * and every previously-released section below untouched.
 *
 * Usage:
 *   npx tsx scripts/changelog.ts generate   # update/replace ## [Unreleased], write the file
 *   npx tsx scripts/changelog.ts check      # fail if ## [Unreleased] is stale
 *   npx tsx scripts/changelog.ts release    # rename ## [Unreleased] to the version in package.json
 */

import { execFileSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const ROOT = path.join(__dirname, '..');
const CHANGELOG_PATH = path.join(ROOT, 'CHANGELOG.md');
const MARKER = '<!-- git-cliff:insert-here -->';
const UNRELEASED_HEADING = '## [Unreleased]';

function getLastTag(): string | null {
  try {
    return execFileSync('git', ['describe', '--tags', '--abbrev=0'], {
      encoding: 'utf-8',
      cwd: ROOT,
    }).trim();
  } catch {
    return null;
  }
}

function getNextVersionTag(): string {
  const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf-8'));
  return `v${pkg.version}`;
}

// tagged=false -> renders "## [Unreleased]" (every-MR use). tagged=true ->
// renders "## [x.y.z] - date" (release use).
function generateSection(tagged: boolean): string {
  const lastTag = getLastTag();
  const args = ['git-cliff'];
  if (lastTag) args.push(`${lastTag}..HEAD`);
  if (tagged) args.push('--tag', getNextVersionTag());
  return execFileSync('npx', args, { encoding: 'utf-8', cwd: ROOT }).trim();
}

// True if generateSection(false) has no actual commits under it — just the
// bare "## [Unreleased]" heading. This is the expected, valid state
// immediately after a release (before any new commits land).
function isEmptySection(section: string): boolean {
  return section.trim() === UNRELEASED_HEADING;
}

// Finds the span [start, end) of the section immediately after the marker
// whose heading line equals `heading` -- end is the index of the next
// "## [" heading, or end-of-file. Returns null if that heading isn't the
// first thing after the marker (including if nothing is there yet).
function findSectionSpan(
  existing: string,
  heading: string
): { start: number; end: number } {
  const markerIndex = existing.indexOf(MARKER);
  if (markerIndex === -1) {
    throw new Error(
      `CHANGELOG.md is missing the "${MARKER}" marker comment -- add it once, ` +
        'right after the static preamble and before the first "## [" heading.'
    );
  }
  const afterMarker = markerIndex + MARKER.length;
  const rest = existing.slice(afterMarker);
  const leadingWs = rest.match(/^\s*/)?.[0].length ?? 0;
  const start = afterMarker + leadingWs;
  if (!existing.startsWith(heading, start)) {
    return { start, end: start }; // not present -- zero-length span at insert point
  }
  const searchFrom = start + heading.length;
  const nextHeadingRel = existing.slice(searchFrom).search(/\n## \[/);
  const end = nextHeadingRel === -1 ? existing.length : searchFrom + nextHeadingRel + 1;
  return { start, end };
}

// Replaces the section matching `heading` right after the marker with
// `section` if present, otherwise inserts `section` fresh at that same spot
// (before whatever else is already there).
function upsertSection(existing: string, heading: string, section: string): string {
  const { start, end } = findSectionSpan(existing, heading);
  return existing.slice(0, start) + section + '\n\n' + existing.slice(end);
}

const mode = process.argv[2];

if (mode === 'generate') {
  const existing = fs.readFileSync(CHANGELOG_PATH, 'utf-8');
  const section = generateSection(false);
  fs.writeFileSync(CHANGELOG_PATH, upsertSection(existing, UNRELEASED_HEADING, section));
  console.log('CHANGELOG.md updated.');
} else if (mode === 'check') {
  const existing = fs.readFileSync(CHANGELOG_PATH, 'utf-8');
  const unreleasedSection = generateSection(false);
  const expected = upsertSection(existing, UNRELEASED_HEADING, unreleasedSection);
  const unreleasedSpan = findSectionSpan(existing, UNRELEASED_HEADING);
  const noUnreleasedPresent = unreleasedSpan.start === unreleasedSpan.end;

  // A release commit legitimately has no "## [Unreleased]" (its whole job is
  // to rename it away) but doesn't have its own tag yet either -- so
  // generateSection(false) still reports the same commits as pending. Valid
  // if what's actually there instead is exactly the freshly-generated
  // *versioned* section for those same commits (i.e. `release` ran correctly).
  const versionedSection = generateSection(true);
  const afterMarker = existing
    .slice(existing.indexOf(MARKER) + MARKER.length)
    .replace(/^\s+/, '');
  const matchesJustReleased = noUnreleasedPresent && afterMarker.startsWith(versionedSection);

  const upToDate =
    expected === existing ||
    // Right after a release whose tag now exists, there's legitimately no
    // "## [Unreleased]" and nothing new has landed since -- a clean state.
    (isEmptySection(unreleasedSection) && noUnreleasedPresent) ||
    matchesJustReleased;

  if (!upToDate) {
    console.error(
      'ERROR: CHANGELOG.md is stale -- run `npm run changelog:generate` and commit the result.'
    );
    process.exit(1);
  }
  console.log('CHANGELOG.md is up to date.');
} else if (mode === 'release') {
  const existing = fs.readFileSync(CHANGELOG_PATH, 'utf-8');
  const section = generateSection(true);
  fs.writeFileSync(CHANGELOG_PATH, upsertSection(existing, UNRELEASED_HEADING, section));
  console.log(`CHANGELOG.md: [Unreleased] -> ${section.split('\n')[0]}`);
} else {
  console.error('Usage: tsx scripts/changelog.ts <generate|check|release>');
  process.exit(1);
}
