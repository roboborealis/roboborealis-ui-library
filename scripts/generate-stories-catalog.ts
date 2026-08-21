#!/usr/bin/env tsx
/**
 * generate-stories-catalog.ts
 *
 * Reads all *.stories.tsx files under src/ and generates
 * src/agent/stories-catalog.json with NLP-searchable metadata.
 *
 * Each story entry includes:
 *   - Storybook URL pattern (for paste-matching)
 *   - Keywords for search
 *   - Component name and export path
 *
 * Usage:
 *   npm run generate-stories-catalog
 */

import * as fs from 'fs';
import * as path from 'path';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface StoryCatalogEntry {
  id: string;
  title: string;
  storyName: string;
  urlPattern: string;
  component: string;
  export: string;
  keywords: string[];
}

interface StoriesCatalog {
  generated: string;
  version: string;
  description: string;
  storyCount: number;
  stories: StoryCatalogEntry[];
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const SUBPATH_MAP: Record<string, string> = {
  core: '@roboborealis/components/core',
  forms: '@roboborealis/components/forms',
  navigation: '@roboborealis/components/navigation',
  tables: '@roboborealis/components/tables',
  feedback: '@roboborealis/components/feedback',
  layout: '@roboborealis/components/layout',
  charts: '@roboborealis/components/charts',
  visualizations: '@roboborealis/components/visualizations',
  editor: '@roboborealis/components/editor',
  icons: '@roboborealis/components/icons',
  tokens: '@roboborealis/components/tokens',
  flags: '@roboborealis/components/flags',
  showcase: '@roboborealis/components',
};

// ---------------------------------------------------------------------------
// File discovery
// ---------------------------------------------------------------------------

function findStoryFiles(dir: string): string[] {
  const results: string[] = [];
  if (!fs.existsSync(dir)) return results;

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

// ---------------------------------------------------------------------------
// Extraction helpers
// ---------------------------------------------------------------------------

// Scoped to start searching from the `const meta` declaration onward — a bare
// content-wide match picks up the first `title:` anywhere in the file, including
// unrelated local mock-data fields declared above the meta block (e.g. a mock
// panel's `title: 'Asset Layer'` in map-builder.stories.tsx), which silently
// mislabels the file's real Storybook title and every export attributed to it.
function extractTitle(content: string): string | null {
  const metaDeclIndex = content.search(/\bconst\s+meta\s*:/);
  const searchContent = metaDeclIndex >= 0 ? content.slice(metaDeclIndex) : content;
  const match = searchContent.match(/title\s*:\s*['"`]([^'"`]+)['"`]/);
  return match ? match[1] : null;
}

function extractStoryNames(content: string): string[] {
  const names: string[] = [];
  const pattern = /^export const (\w+)/gm;
  let m: RegExpExecArray | null;
  while ((m = pattern.exec(content)) !== null) {
    if (m[1] !== 'default') names.push(m[1]);
  }
  return names;
}

function extractComponent(content: string): string | null {
  const match = content.match(/component\s*:\s*(\w+)/);
  return match ? match[1] : null;
}

/**
 * Convert Storybook title + story name to the URL-compatible ID.
 * "Components/Core/RoboButton" + "AllVariants" => "components-core-robobutton--allvariants"
 */
function toStoryId(title: string, storyName: string): string {
  const titlePart = title
    .replace(/\s*\/\s*/g, '-')
    .replace(/\s+/g, '-')
    .toLowerCase();

  const storyPart = storyName
    .replace(/([A-Z])/g, (_, c, i) => (i > 0 ? '-' : '') + c.toLowerCase())
    .replace(/^-/, '');

  return `${titlePart}--${storyPart}`;
}

/**
 * Derive keywords from the title segments, component name, and story name.
 */
function deriveKeywords(title: string, componentName: string | null, storyName: string): string[] {
  const keywords = new Set<string>();

  const segments = title.split('/');
  for (const seg of segments) {
    const words = seg
      .replace(/Robo/g, '')
      .replace(/([A-Z])/g, ' $1')
      .trim()
      .toLowerCase()
      .split(/\s+/);
    for (const w of words) {
      if (w.length > 2) keywords.add(w);
    }
  }

  if (componentName) {
    const compWords = componentName
      .replace(/Robo/g, '')
      .replace(/([A-Z])/g, ' $1')
      .trim()
      .toLowerCase()
      .split(/\s+/);
    for (const w of compWords) {
      if (w.length > 2) keywords.add(w);
    }
  }

  const storyWords = storyName
    .replace(/([A-Z])/g, ' $1')
    .trim()
    .toLowerCase()
    .split(/\s+/);
  for (const w of storyWords) {
    if (w.length > 2) keywords.add(w);
  }

  return Array.from(keywords).sort();
}

/**
 * Derive the subpath export from the story file path.
 */
function deriveExport(storyFile: string, srcDir: string): string {
  const relative = path.relative(srcDir, storyFile);
  const topDir = relative.split(path.sep)[0];
  return SUBPATH_MAP[topDir] ?? '@roboborealis/components';
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main(): void {
  const repoRoot = path.resolve(__dirname, '..');
  const srcDir = path.join(repoRoot, 'src');
  const outputPath = path.join(srcDir, 'agent', 'stories-catalog.json');

  const storyFiles = findStoryFiles(srcDir);
  console.log(`Found ${storyFiles.length} story files`);

  const stories: StoryCatalogEntry[] = [];

  for (const file of storyFiles) {
    const content = fs.readFileSync(file, 'utf8');
    const title = extractTitle(content);
    if (!title) continue;

    const storyNames = extractStoryNames(content);
    const component = extractComponent(content);
    const exportPath = deriveExport(file, srcDir);

    for (const storyName of storyNames) {
      const id = toStoryId(title, storyName);
      const urlPattern = `?path=/story/${id}`;

      stories.push({
        id,
        title: `${title}/${storyName}`,
        storyName,
        urlPattern,
        component: component ?? title.split('/').pop() ?? 'Unknown',
        export: exportPath,
        keywords: deriveKeywords(title, component, storyName),
      });
    }
  }

  stories.sort((a, b) => a.title.localeCompare(b.title));

  const catalog: StoriesCatalog = {
    generated: new Date().toISOString(),
    version: '1.0.0',
    description: 'NLP-searchable story catalog for @roboborealis/components Storybook. Auto-generated \u2014 do not edit manually.',
    storyCount: stories.length,
    stories,
  };

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(catalog, null, 2) + '\n', 'utf8');

  console.log(`\nGenerated: ${outputPath}`);
  console.log(`  ${stories.length} story entries from ${storyFiles.length} files`);
}

main();
