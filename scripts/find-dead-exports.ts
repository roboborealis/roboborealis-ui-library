/**
 * find-dead-exports.ts — report-only scan for internal exports that nothing uses.
 *
 * Run:  npx tsx scripts/find-dead-exports.ts
 *
 * "Dead" here means: an export in src/ that is NOT part of the package's public
 * surface (not reachable from any src/<domain>/index.ts entry barrel, following
 * `export *` and re-export chains) AND is never referenced by any other file in
 * the project — including tests and stories.
 *
 * This is a REPORT. It deletes nothing. A listed symbol is a candidate to review
 * by hand: some are kept deliberately (future API, symmetry), so confirm before
 * removing, and remember consumer apps outside this repo are invisible to it.
 *
 * KNOWN LIMITATION: ts-morph's reference resolution occasionally misses a real
 * reference (e.g. DEFAULT_TOOLTIP_DELAY_MS is used by robo-tooltip.test.tsx yet
 * still lands in the "never referenced" bucket). Treat the list as a strong
 * first-pass filter that dramatically narrows the search — NOT an authoritative
 * delete list. Always grep the symbol before removing it.
 *
 * Why the naive "no references anywhere" scan over-reports and this one doesn't:
 *   - `export *` barrels create no reference nodes → resolved via getExportedDeclarations.
 *   - entry barrels re-export a subset → the public surface is computed from the entries.
 *   - test/story files sit outside tsconfig → added explicitly so their refs count.
 */
import { Project, Node } from 'ts-morph';

const isTestOrStory = (p: string) => /\.(test|stories)\.[tj]sx?$/.test(p);
const isBarrel = (p: string) => /(^|\/)index\.ts$/.test(p);
const isDecl = (p: string) => p.endsWith('.d.ts');
const key = (n: Node) => `${n.getSourceFile().getFilePath()}:${n.getStart()}`;

// Use tsconfig for its compilerOptions (path aliases etc.) but DON'T inherit its
// include/exclude — tsconfig excludes *.test.tsx, which would make the language
// service blind to unit-test references and mis-flag test-only symbols as dead.
// Add every src file ourselves so tests and stories are in the program.
const project = new Project({
  tsConfigFilePath: 'tsconfig.json',
  skipAddingFilesFromTsConfig: true,
});
project.addSourceFilesAtPaths('src/**/*.{ts,tsx}');

// Public surface: everything reachable from a top-level domain entry barrel.
const entryFiles = project.getSourceFiles('src/*/index.ts');
const publicKeys = new Set<string>();
for (const entry of entryFiles) {
  for (const decls of entry.getExportedDeclarations().values()) {
    for (const decl of decls) publicKeys.add(key(decl));
  }
}

type Finding = { name: string; file: string; kind: string };
const dead: Finding[] = [];
const testsOnly: Finding[] = [];

for (const file of project.getSourceFiles('src/**/*.{ts,tsx}')) {
  const path = file.getFilePath();
  if (isDecl(path) || isTestOrStory(path) || isBarrel(path)) continue;
  const rel = path.replace(process.cwd() + '/', '');

  for (const [name, decls] of file.getExportedDeclarations()) {
    for (const decl of decls) {
      if (decl.getSourceFile() !== file) continue; // only decls defined here
      if (publicKeys.has(key(decl))) continue; // part of the public API
      if (!Node.isReferenceFindable(decl)) continue;

      let usedNonTest = false;
      let usedTest = false;
      for (const ref of decl.findReferencesAsNodes()) {
        const refPath = ref.getSourceFile().getFilePath();
        if (refPath === path) continue; // same-file use / the declaration itself
        if (isTestOrStory(refPath)) usedTest = true;
        else usedNonTest = true;
      }

      if (usedNonTest) continue;
      const finding = { name, file: rel, kind: decl.getKindName() };
      (usedTest ? testsOnly : dead).push(finding);
    }
  }
}

const fmt = (list: Finding[]) =>
  list
    .sort((a, b) => a.file.localeCompare(b.file) || a.name.localeCompare(b.name))
    .map((f) => `  ${f.file}  ::  ${f.name}  (${f.kind})`)
    .join('\n');

console.log(`\nPublic surface: ${publicKeys.size} exported declarations across ${entryFiles.length} entry barrels.`);
console.log(`\n=== Not public AND never referenced (review before deleting) : ${dead.length} ===`);
console.log(dead.length ? fmt(dead) : '  (none)');
console.log(`\n=== Not public, referenced ONLY by tests/stories : ${testsOnly.length} ===`);
console.log(testsOnly.length ? fmt(testsOnly) : '  (none)');
console.log('');
