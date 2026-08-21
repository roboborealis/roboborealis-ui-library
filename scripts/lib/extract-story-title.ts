/**
 * Extract the `title` field from a stories file's default export meta object.
 * Scoped to start searching from the `const meta` declaration onward — a bare
 * content-wide match picks up the first `title:` anywhere in the file, including
 * unrelated local mock-data fields declared above the meta block (e.g. the
 * `title: 'Vessel Engine Fire'` fixture in robo-incident-layer.stories.tsx).
 *
 * Shared by generate-manifest.ts and check-archetype-storypaths.ts so the two
 * scripts can't drift on what counts as a story file's title.
 */
export function extractTitle(content: string): string | null {
  const metaDeclIndex = content.search(/\bconst\s+meta\s*:/);
  const searchContent = metaDeclIndex >= 0 ? content.slice(metaDeclIndex) : content;
  const match = searchContent.match(/title\s*:\s*['"`]([^'"`]+)['"`]/);
  return match ? match[1] : null;
}
