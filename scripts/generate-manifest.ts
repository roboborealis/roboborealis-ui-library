#!/usr/bin/env tsx
/**
 * generate-manifest.ts
 *
 * Single source of truth for the agent manifest. Merges the former
 * generate-agent-manifest.ts (flat story-file scan) and
 * generate-enriched-manifest.ts (ts-morph enrichment + sidecar merge) into one
 * generator that emits ONLY src/agent/manifest.json — the file shipped to
 * consumers via the `@roboborealis/components/agent-context` export and the
 * stable in-repo path for local grep-based discovery.
 *
 * NOTE: all `.exec(` calls in this file are RegExp.prototype.exec (string
 * matching) — no child_process / shell execution happens here.
 *
 * Per entry:
 *   - flat fields: name, entryKind, section, storybookPath, importPath,
 *     storyFile, sourceFile, stories
 *   - enrichment: variants (CVA), requiredProps, subComponents
 *     (ts-morph AST when available, regex fallback)
 *   - componentMeta from the story file's `export const componentMeta = {...}`
 *     merged with the hand-maintained sidecar (src/agent/component-metadata.json)
 *   - animation prop auto-detection from the co-located source
 *
 * Plus top-level `templates` (from src/templates/index.ts + src/agent/archetypes.ts)
 * and `referencePatterns` (from src/showcase/patterns).
 *
 * Validation (generation fails on):
 *   - a componentMeta.category outside the strict enum
 *   - a template whose preview story cannot be resolved to a real Storybook path
 *
 * Usage:
 *   npm run generate-manifest
 *   npm run generate-agent-context   (manifest + stories catalog)
 */

import * as fs from 'fs';
import * as path from 'path';

import { archetypes } from '../src/agent/archetypes';
import { extractTitle } from './lib/extract-story-title';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

const VALID_CATEGORIES = [
  'action',
  'input',
  'display',
  'feedback',
  'navigation',
  'layout',
  'visualization',
] as const;

type Category = (typeof VALID_CATEGORIES)[number];

type EntryKind = 'component' | 'gallery' | 'showcase' | 'foundation' | 'pattern-demo';

interface VariantInfo {
  name: string;
  values: string[];
}

interface ComponentMeta {
  description?: string;
  category?: Category | string;
  keywords?: string[];
  whenToUse?: string;
  whenNotToUse?: string;
  neverUse?: string;
  pairsWith?: string[];
  a11y?: string;
  accessibilityNote?: string;
  /** Animation props supported, e.g. "animateEntrance: boolean — RoboFadeIn standard" */
  animation?: string;
}

interface ManifestEntry {
  name: string;
  entryKind: EntryKind;
  /** Present on secondary entries whose name duplicates a primary component entry
   *  (overview/aggregate stories) — filter these out for unambiguous name lookups. */
  aggregate?: true;
  section: string;
  storybookPath: string | null;
  importPath: string;
  storyFile: string | null;
  sourceFile: string | null;
  stories: string[];
  /** All .displayName assignments found in the source file (compound components). */
  subComponents: string[];
  variants: VariantInfo[];
  requiredProps: string[];
  componentMeta: ComponentMeta | null;
}

interface TemplateEntry {
  name: string;
  kind: 'shell' | 'starter' | 'content';
  importPath: '@roboborealis/components/templates';
  sourceFile: string;
  archetypeId: string | null;
  storybookPath: string;
  description: string;
  components: string[];
  notes: string;
}

interface PatternMeta {
  demonstrates?: string;
  whenToUse?: string;
  keywords?: string[];
  agentPriority?: string;
}

interface ReferencePattern {
  name: string;
  sourceFile: string;
  demonstratesComponents: string[];
  patternMeta: PatternMeta | null;
}

interface SidecarEntry {
  description?: string;
  category?: string;
  keywords?: string[];
  whenToUse?: string;
  whenNotToUse?: string;
  neverUse?: string;
  pairsWith?: string[];
  a11y?: string;
  accessibilityNote?: string;
}

/** Sidecar fields become componentMeta; story-file componentMeta wins on conflict. */
function sidecarToMeta(entry: SidecarEntry): Partial<ComponentMeta> {
  const meta: Partial<ComponentMeta> = {};
  if (entry.description) meta.description = entry.description;
  if (entry.category) meta.category = entry.category;
  if (entry.keywords) meta.keywords = entry.keywords;
  if (entry.whenToUse) meta.whenToUse = entry.whenToUse;
  if (entry.whenNotToUse) meta.whenNotToUse = entry.whenNotToUse;
  if (entry.neverUse) meta.neverUse = entry.neverUse;
  if (entry.pairsWith) meta.pairsWith = entry.pairsWith;
  if (entry.a11y) meta.a11y = entry.a11y;
  if (entry.accessibilityNote) meta.accessibilityNote = entry.accessibilityNote;
  return meta;
}

// ---------------------------------------------------------------------------
// File discovery
// ---------------------------------------------------------------------------

function walkFiles(dir: string, predicate: (name: string) => boolean): string[] {
  const results: string[] = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkFiles(fullPath, predicate));
    } else if (entry.isFile() && predicate(entry.name)) {
      results.push(fullPath);
    }
  }
  return results;
}

const findStoryFiles = (dir: string) => walkFiles(dir, (n) => n.endsWith('.stories.tsx'));

const findComponentSources = (dir: string) =>
  walkFiles(
    dir,
    (n) =>
      n.startsWith('robo-') &&
      n.endsWith('.tsx') &&
      !n.includes('.test.') &&
      !n.includes('.stories.')
  );

// ---------------------------------------------------------------------------
// Extraction helpers (regex)
// ---------------------------------------------------------------------------

function extractExcludeStories(content: string): Set<string> {
  const arrMatch = content.match(/excludeStories\s*:\s*\[([^\]]+)\]/);
  if (arrMatch) {
    return new Set(
      arrMatch[1]
        .split(',')
        .map((s) => s.trim().replace(/^['"`]|['"`]$/g, ''))
        .filter((s) => s.length > 0)
    );
  }
  const strMatch = content.match(/excludeStories\s*:\s*['"`]([^'"`]+)['"`]/);
  return strMatch ? new Set([strMatch[1]]) : new Set();
}

/**
 * Extract each story's display `name:` — scoped to the FIRST `name:` inside each
 * `export const X` block. A content-wide scan would also match `name:` keys in
 * mock-data objects (vessels, options, fixtures), polluting the valid-story-path
 * set that template preview validation relies on — the same hazard extractTitle()
 * is hardened against for `title:`.
 */
function extractStoryDisplayNames(content: string): string[] {
  const names: string[] = [];
  const excluded = extractExcludeStories(content);
  const chunks = content.split(/^export const /m).slice(1);
  for (const chunk of chunks) {
    const exportName = chunk.match(/^(\w+)/)?.[1];
    if (!exportName || exportName === 'default' || excluded.has(exportName)) continue;
    const nameMatch = chunk.match(/name\s*:\s*['"`]([^'"`]+)['"`]/);
    if (nameMatch) names.push(nameMatch[1]);
  }
  return names;
}

function extractStoryNames(content: string): string[] {
  const names: string[] = [];
  const excluded = extractExcludeStories(content);
  const pattern = /^export const (\w+)/gm;
  let m: RegExpExecArray | null;
  while ((m = pattern.exec(content)) !== null) {
    if (m[1] !== 'default' && !excluded.has(m[1])) {
      names.push(m[1]);
    }
  }
  return names;
}

function extractAllDisplayNames(content: string): string[] {
  const names: string[] = [];
  const pattern = /\.displayName\s*=\s*['"](\w+)['"]/g;
  let m: RegExpExecArray | null;
  while ((m = pattern.exec(content)) !== null) {
    if (!names.includes(m[1])) names.push(m[1]);
  }
  return names;
}

function extractJSDocDescription(content: string, componentName: string): string | null {
  const pattern = new RegExp(
    `/\\*\\*([\\s\\S]*?)\\*/\\s*(?:const|export const|export function|function)\\s+${componentName}\\b`,
    'm'
  );
  const match = content.match(pattern);
  if (!match) return null;

  const lines = match[1]
    .split('\n')
    .map((l) => l.replace(/^\s*\*\s?/, '').trim())
    .filter((l) => l.length > 0 && !l.startsWith('@'));
  if (lines.length === 0) return null;

  const firstLine = lines[0];
  const dashIdx = firstLine.indexOf('—'); // em dash
  if (dashIdx !== -1) {
    return firstLine.slice(dashIdx + 1).trim().replace(/\.$/, '');
  }
  return firstLine;
}

function extractCVAVariants(content: string): VariantInfo[] {
  const cvaMatch = content.match(/cva\(\s*['"`][^'"`]*['"`]\s*,\s*\{([\s\S]*?)\}\s*\)/);
  if (!cvaMatch) return [];

  const variantsMatch = cvaMatch[1].match(
    /variants\s*:\s*\{([\s\S]*?)\}\s*,?\s*(?:defaultVariants|compoundVariants|\})/
  );
  if (!variantsMatch) return [];

  const results: VariantInfo[] = [];
  const groupPattern = /(\w+)\s*:\s*\{([^}]+)\}/g;
  let groupMatch: RegExpExecArray | null;
  while ((groupMatch = groupPattern.exec(variantsMatch[1])) !== null) {
    const values: string[] = [];
    const valuePattern = /(\w+)\s*:/g;
    let valueMatch: RegExpExecArray | null;
    while ((valueMatch = valuePattern.exec(groupMatch[2])) !== null) {
      values.push(valueMatch[1]);
    }
    if (values.length > 0) results.push({ name: groupMatch[1], values });
  }
  return results;
}

function extractRequiredProps(content: string, componentName: string): string[] {
  const interfacePattern = new RegExp(
    `(?:export\\s+)?interface\\s+${componentName}Props[^{]*\\{([\\s\\S]*?)\\}`,
    'm'
  );
  const match = content.match(interfacePattern);
  if (!match) return [];

  const props: string[] = [];
  for (const line of match[1].split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*'))
      continue;
    const propMatch = trimmed.match(/^(\w+)\s*:\s/);
    if (propMatch && !['className', 'children', 'style', 'ref'].includes(propMatch[1])) {
      props.push(propMatch[1]);
    }
  }
  return props;
}

// ---------------------------------------------------------------------------
// componentMeta / patternMeta extraction
// ---------------------------------------------------------------------------

function extractMetaBlock(content: string, exportName: string): string | null {
  const match = content.match(
    new RegExp(`export\\s+const\\s+${exportName}\\s*=\\s*\\{([\\s\\S]*?)\\}\\s*;`)
  );
  return match ? match[1] : null;
}

// Regex FALLBACK only, used when ts-morph is unavailable (see MetaProject
// below for the primary AST-based path). Matches up to the first embedded
// quote character of any kind, so this fallback truncates values containing
// literal ' " or ` characters — the AST path does not have this limitation.
function metaStrField(block: string, name: string): string | undefined {
  const m = block.match(new RegExp(`${name}\\s*:\\s*['"\`]([^'"\`]+)['"\`]`));
  return m ? m[1] : undefined;
}

function metaArrField(block: string, name: string): string[] | undefined {
  const m = block.match(new RegExp(`${name}\\s*:\\s*\\[([^\\]]+)\\]`));
  if (!m) return undefined;
  return m[1]
    .split(',')
    .map((s) => s.trim().replace(/^['"`]|['"`]$/g, ''))
    .filter((s) => s.length > 0);
}

function extractComponentMeta(content: string): ComponentMeta | null {
  const block = extractMetaBlock(content, 'componentMeta');
  if (!block) return null;
  return {
    description: metaStrField(block, 'description'),
    category: metaStrField(block, 'category'),
    keywords: metaArrField(block, 'keywords'),
    whenToUse: metaStrField(block, 'whenToUse'),
    whenNotToUse: metaStrField(block, 'whenNotToUse'),
    pairsWith: metaArrField(block, 'pairsWith'),
    a11y: metaStrField(block, 'a11y'),
    animation: metaStrField(block, 'animation'),
  };
}

function extractPatternMeta(content: string): PatternMeta | null {
  const block = extractMetaBlock(content, 'patternMeta');
  if (!block) return null;
  return {
    demonstrates: metaStrField(block, 'demonstrates'),
    whenToUse: metaStrField(block, 'whenToUse'),
    keywords: metaArrField(block, 'keywords'),
    agentPriority: metaStrField(block, 'agentPriority'),
  };
}

// ---------------------------------------------------------------------------
// componentMeta / patternMeta extraction — ts-morph AST (primary path)
//
// Reads string/array literal values straight off the AST (getLiteralValue()),
// so embedded ' " ` characters inside a meta string are handled correctly —
// unlike the regex fallback above, which stops at the first such character.
// ---------------------------------------------------------------------------

interface MetaProject {
  project: import('ts-morph').Project;
  SyntaxKind: typeof import('ts-morph').SyntaxKind;
}

async function createMetaProject(repoRoot: string): Promise<MetaProject | null> {
  try {
    const { Project, SyntaxKind } = await import('ts-morph');
    const project = new Project({
      tsConfigFilePath: path.join(repoRoot, 'tsconfig.json'),
      skipAddingFilesFromTsConfig: true,
    });
    return { project, SyntaxKind };
  } catch (err) {
    console.warn(
      'ts-morph unavailable — enrichment/componentMeta/patternMeta extraction falling back to regex:',
      err
    );
    return null;
  }
}

function findMetaObjectLiteral(
  sourceFile: import('ts-morph').SourceFile,
  SyntaxKind: MetaProject['SyntaxKind'],
  exportName: string
): import('ts-morph').ObjectLiteralExpression | null {
  const init = sourceFile.getVariableDeclaration(exportName)?.getInitializer();
  return init?.asKind(SyntaxKind.ObjectLiteralExpression) ?? null;
}

/**
 * Strip `as const` / `as Foo` / `satisfies Foo` / redundant parens so the
 * literal underneath is reachable — e.g. `category: 'feedback' as const,`
 * (the codebase's standard style for the category field) is an AsExpression
 * wrapping a StringLiteral, not a bare StringLiteral.
 */
function unwrapExpression(
  node: import('ts-morph').Node,
  SyntaxKind: MetaProject['SyntaxKind']
): import('ts-morph').Node {
  let current = node;
  for (;;) {
    const inner =
      current.asKind(SyntaxKind.AsExpression) ??
      current.asKind(SyntaxKind.SatisfiesExpression) ??
      current.asKind(SyntaxKind.ParenthesizedExpression);
    if (!inner) return current;
    current = inner.getExpression();
  }
}

function astStringValue(
  node: import('ts-morph').Node,
  SyntaxKind: MetaProject['SyntaxKind']
): string | undefined {
  const unwrapped = unwrapExpression(node, SyntaxKind);
  return (
    unwrapped.asKind(SyntaxKind.StringLiteral)?.getLiteralValue() ??
    unwrapped.asKind(SyntaxKind.NoSubstitutionTemplateLiteral)?.getLiteralValue()
  );
}

// A property exists but yields no value here only when its initializer is a
// literal shape this extractor doesn't unwrap (template literal with
// substitutions, concatenation, a computed value, ...). That's exactly the
// silent-data-loss failure mode this file was rewritten to eliminate — warn
// instead of quietly emitting `undefined`, the way the `as const` regression
// during development of this AST path would have been caught immediately.
function warnUnsupportedLiteral(filePath: string, name: string, init: import('ts-morph').Node) {
  console.warn(
    `${filePath}: componentMeta/patternMeta field '${name}' has an unsupported literal shape ` +
      `(${init.getKindName()}) — value dropped. Use a plain string/template literal or array of them.`
  );
}

function astStrField(
  obj: import('ts-morph').ObjectLiteralExpression,
  SyntaxKind: MetaProject['SyntaxKind'],
  name: string,
  filePath: string
): string | undefined {
  const init = obj.getProperty(name)?.asKind(SyntaxKind.PropertyAssignment)?.getInitializer();
  if (!init) return undefined;
  const value = astStringValue(init, SyntaxKind);
  if (value === undefined) warnUnsupportedLiteral(filePath, name, init);
  return value;
}

function astArrField(
  obj: import('ts-morph').ObjectLiteralExpression,
  SyntaxKind: MetaProject['SyntaxKind'],
  name: string,
  filePath: string
): string[] | undefined {
  const rawInit = obj.getProperty(name)?.asKind(SyntaxKind.PropertyAssignment)?.getInitializer();
  if (!rawInit) return undefined;
  const init = unwrapExpression(rawInit, SyntaxKind).asKind(SyntaxKind.ArrayLiteralExpression);
  if (!init) {
    warnUnsupportedLiteral(filePath, name, rawInit);
    return undefined;
  }
  const values: string[] = [];
  for (const el of init.getElements()) {
    const v = astStringValue(el, SyntaxKind);
    if (v !== undefined) values.push(v);
    else warnUnsupportedLiteral(filePath, `${name}[]`, el);
  }
  return values;
}

function extractComponentMetaAst(
  sourceFile: import('ts-morph').SourceFile,
  SyntaxKind: MetaProject['SyntaxKind']
): ComponentMeta | null {
  const obj = findMetaObjectLiteral(sourceFile, SyntaxKind, 'componentMeta');
  if (!obj) return null;
  const filePath = sourceFile.getFilePath();
  return {
    description: astStrField(obj, SyntaxKind, 'description', filePath),
    category: astStrField(obj, SyntaxKind, 'category', filePath),
    keywords: astArrField(obj, SyntaxKind, 'keywords', filePath),
    whenToUse: astStrField(obj, SyntaxKind, 'whenToUse', filePath),
    whenNotToUse: astStrField(obj, SyntaxKind, 'whenNotToUse', filePath),
    pairsWith: astArrField(obj, SyntaxKind, 'pairsWith', filePath),
    a11y: astStrField(obj, SyntaxKind, 'a11y', filePath),
    animation: astStrField(obj, SyntaxKind, 'animation', filePath),
  };
}

function extractPatternMetaAst(
  sourceFile: import('ts-morph').SourceFile,
  SyntaxKind: MetaProject['SyntaxKind']
): PatternMeta | null {
  const obj = findMetaObjectLiteral(sourceFile, SyntaxKind, 'patternMeta');
  if (!obj) return null;
  const filePath = sourceFile.getFilePath();
  return {
    demonstrates: astStrField(obj, SyntaxKind, 'demonstrates', filePath),
    whenToUse: astStrField(obj, SyntaxKind, 'whenToUse', filePath),
    keywords: astArrField(obj, SyntaxKind, 'keywords', filePath),
    agentPriority: astStrField(obj, SyntaxKind, 'agentPriority', filePath),
  };
}

function extractComponentMetaFor(
  metaProject: MetaProject | null,
  filePath: string,
  content: string
): ComponentMeta | null {
  if (metaProject) {
    try {
      const sourceFile = metaProject.project.addSourceFileAtPath(filePath);
      return extractComponentMetaAst(sourceFile, metaProject.SyntaxKind);
    } catch (err) {
      console.warn(
        `ts-morph failed to parse componentMeta in ${filePath} — falling back to regex:`,
        err
      );
    }
  }
  return extractComponentMeta(content);
}

function extractPatternMetaFor(
  metaProject: MetaProject | null,
  filePath: string,
  content: string
): PatternMeta | null {
  if (metaProject) {
    try {
      const sourceFile = metaProject.project.addSourceFileAtPath(filePath);
      return extractPatternMetaAst(sourceFile, metaProject.SyntaxKind);
    } catch (err) {
      console.warn(
        `ts-morph failed to parse patternMeta in ${filePath} — falling back to regex:`,
        err
      );
    }
  }
  return extractPatternMeta(content);
}

// ---------------------------------------------------------------------------
// Animation prop auto-detection
// ---------------------------------------------------------------------------

const ANIMATE_PROP_DESCRIPTIONS: Record<string, string> = {
  animateEntrance: 'animateEntrance: boolean — fade-in entrance via RoboFadeIn (preset: standard)',
  animateValue: 'animateValue: boolean — number ticker animation on value change',
  animate: 'animate: boolean — entrance animation (scale-in or slide-in depending on component)',
  animateItems: 'animateItems: boolean — staggered item entrance with CSS animation-delay',
  animateContent: 'animateContent: boolean — RoboFadeIn on tab panel content swap',
  animateRowStagger: 'animateRowStagger: boolean — staggered row entrance via CSS animation-delay',
  transitionVariant:
    'transitionVariant?: RoboTransitionVariant — selectable enter/exit animation style (curtain-wipe, pixel-dissolve, iris-clip, venetian-blinds, depth-fade); default reproduces existing behavior unchanged',
};

/**
 * Extracts the text of every `export interface XxxProps ... { ... }` block
 * from a source string, using brace-depth matching so multi-line interfaces
 * (including `extends A, B` clauses and nested object/generic types) are
 * captured up to their real closing brace — not the first `}` encountered.
 *
 * Scoping animation-prop detection to these blocks (rather than the whole
 * file) avoids false positives from unrelated in-body object literals that
 * happen to share a key name with a real prop (e.g. a local
 * `{ animate: ..., transition: ... }` object passed to `motion.div`, which is
 * not a component prop at all).
 */
function extractPropsInterfaceBlocks(source: string): string[] {
  const blocks: string[] = [];
  const headerRe = /interface\s+\w*Props\b[^{]*\{/g;
  let headerMatch: RegExpMatchArray | null;
  headerRe.lastIndex = 0;
  while ((headerMatch = headerRe.exec(source))) {
    const matchIndex = headerMatch.index ?? 0;
    const braceStart = matchIndex + headerMatch[0].length - 1; // index of the opening '{'
    let depth = 1;
    let i = braceStart + 1;
    while (i < source.length && depth > 0) {
      if (source[i] === '{') depth++;
      else if (source[i] === '}') depth--;
      i++;
    }
    // i is now one past the matching closing brace (or source.length if unterminated)
    blocks.push(source.slice(matchIndex, i));
    headerRe.lastIndex = i;
  }
  return blocks;
}

function detectAnimationProps(sourceFiles: string[]): string | undefined {
  const existing = sourceFiles.filter((f) => fs.existsSync(f));
  if (existing.length === 0) return undefined;

  // Scan each file's `...Props` interface block(s) only; fall back to the
  // whole file when a file has no such block, so components that don't
  // follow the `export interface XxxProps` convention aren't regressed.
  const scanTargets = existing.map((f) => {
    const content = fs.readFileSync(f, 'utf8');
    const propsBlocks = extractPropsInterfaceBlocks(content);
    return propsBlocks.length > 0 ? propsBlocks.join('\n') : content;
  });
  const combined = scanTargets.join('\n');

  const found: string[] = [];
  for (const [prop, desc] of Object.entries(ANIMATE_PROP_DESCRIPTIONS)) {
    if (new RegExp(`\\b${prop}\\??\\s*:`).test(combined)) found.push(desc);
  }
  return found.length > 0 ? found.join('; ') : undefined;
}

// ---------------------------------------------------------------------------
// ts-morph enrichment (primary path, regex fallback)
// ---------------------------------------------------------------------------

interface Enrichment {
  variants: VariantInfo[];
  requiredProps: string[];
  description: string | null;
}

async function extractWithTsMorph(
  sourceFilePaths: string[],
  metaProject: MetaProject | null
): Promise<Map<string, Enrichment>> {
  const results = new Map<string, Enrichment>();
  if (!metaProject) return results;
  const { project, SyntaxKind } = metaProject;
  try {
    for (const filePath of sourceFilePaths) {
      const sourceFile = project.addSourceFileAtPath(filePath);
      const content = sourceFile.getFullText();
      const displayNames = extractAllDisplayNames(content);
      const primaryName = displayNames[0];
      if (!primaryName) continue;

      const variants: VariantInfo[] = [];
      for (const call of sourceFile.getDescendantsOfKind(SyntaxKind.CallExpression)) {
        if (call.getExpression().getText() === 'cva' && call.getArguments().length >= 2) {
          const configArg = call.getArguments()[1];
          if (configArg.getKind() === SyntaxKind.ObjectLiteralExpression) {
            const configObj = configArg.asKindOrThrow(SyntaxKind.ObjectLiteralExpression);
            const variantsProp = configObj.getProperty('variants');
            if (variantsProp && variantsProp.getKind() === SyntaxKind.PropertyAssignment) {
              const variantsObj = variantsProp
                .asKindOrThrow(SyntaxKind.PropertyAssignment)
                .getInitializerIfKindOrThrow(SyntaxKind.ObjectLiteralExpression);
              for (const prop of variantsObj.getProperties()) {
                if (prop.getKind() === SyntaxKind.PropertyAssignment) {
                  const pa = prop.asKindOrThrow(SyntaxKind.PropertyAssignment);
                  const init = pa.getInitializer();
                  if (init && init.getKind() === SyntaxKind.ObjectLiteralExpression) {
                    const values = init
                      .asKindOrThrow(SyntaxKind.ObjectLiteralExpression)
                      .getProperties()
                      .map((p) =>
                        p.getKind() === SyntaxKind.PropertyAssignment
                          ? p.asKindOrThrow(SyntaxKind.PropertyAssignment).getName()
                          : null
                      )
                      .filter((v): v is string => v !== null);
                    variants.push({ name: pa.getName(), values });
                  }
                }
              }
            }
          }
        }
      }

      const requiredProps: string[] = [];
      const propsInterface = sourceFile
        .getInterfaces()
        .find((i) => i.getName().endsWith('Props'));
      if (propsInterface) {
        for (const prop of propsInterface.getProperties()) {
          if (!prop.hasQuestionToken()) {
            const propName = prop.getName();
            if (!['className', 'children', 'style', 'ref'].includes(propName)) {
              requiredProps.push(propName);
            }
          }
        }
      }

      const description = extractJSDocDescription(content, primaryName);
      results.set(filePath, { variants, requiredProps, description });
    }
  } catch (err) {
    // ts-morph not available — caller falls back to regex per file. Log the
    // cause: a silent env-specific failure here changes enrichment output and
    // would otherwise surface only as a cryptic agent-context-freshness diff.
    console.warn('ts-morph extraction failed — falling back to regex enrichment:', err);
    return new Map();
  }
  return results;
}

function regexEnrichment(content: string, name: string): Enrichment {
  return {
    variants: extractCVAVariants(content),
    requiredProps: extractRequiredProps(content, name),
    description: extractJSDocDescription(content, name),
  };
}

// ---------------------------------------------------------------------------
// Derivation helpers
// ---------------------------------------------------------------------------

function deriveImportPath(file: string, srcDir: string): string {
  const relative = path.relative(srcDir, file);
  const topLevelSection = relative.split(path.sep)[0];
  return `@roboborealis/components/${topLevelSection}`;
}

function deriveComponentName(title: string | null, file: string): string {
  if (title) {
    const segments = title.split('/');
    return segments[segments.length - 1];
  }
  const stem = path.basename(file, '.stories.tsx').replace(/\.tsx$/, '');
  return stem
    .split('-')
    .map((part) => (part === 'robo' ? 'Robo' : part.charAt(0).toUpperCase() + part.slice(1)))
    .join('');
}

function deriveEntryKind(storybookPath: string | null, name: string): EntryKind {
  if (!storybookPath) return 'component';
  if (storybookPath.startsWith('Foundation/') || storybookPath === 'Foundation')
    return 'foundation';
  if (storybookPath.startsWith('Showcase/Patterns/')) return 'pattern-demo';
  if (storybookPath.startsWith('Showcase/') || storybookPath === 'Showcase') return 'showcase';
  // Overview/gallery/animation-demo stories (titles like 'Components/Feedback'
  // or 'Elements/Actions/Animated Elements') are not importable components —
  // only Robo-named entries are real component API surface.
  return /^Robo/.test(name) ? 'component' : 'gallery';
}

/** RoboButton → robo-button */
function kebabName(name: string): string {
  return name
    .replace(/^Robo/, 'robo-')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase()
    .replace(/^robo-?/, 'robo-');
}

function toRel(repoRoot: string, file: string): string {
  return path.relative(repoRoot, file).split(path.sep).join('/');
}

// ---------------------------------------------------------------------------
// Reference patterns
// ---------------------------------------------------------------------------

function scanReferencePatterns(
  srcDir: string,
  repoRoot: string,
  metaProject: MetaProject | null
): ReferencePattern[] {
  const patternsDir = path.join(srcDir, 'showcase', 'patterns');
  const patterns: ReferencePattern[] = [];

  for (const fullPath of findStoryFiles(patternsDir)) {
    const content = fs.readFileSync(fullPath, 'utf8');
    const title = extractTitle(content);

    const components: string[] = [];
    const importPattern = /import\s+\{([^}]+)\}/g;
    let impMatch: RegExpExecArray | null;
    while ((impMatch = importPattern.exec(content)) !== null) {
      components.push(
        ...impMatch[1].split(',').map((s) => s.trim()).filter((s) => s.startsWith('Robo'))
      );
    }

    const name = title
      ? title.split('/').pop() ?? path.basename(fullPath, '.stories.tsx')
      : path.basename(fullPath, '.stories.tsx');

    patterns.push({
      name,
      sourceFile: toRel(repoRoot, fullPath),
      demonstratesComponents: [...new Set(components)],
      patternMeta: extractPatternMetaFor(metaProject, fullPath, content),
    });
  }

  return patterns.sort((a, b) => a.name.localeCompare(b.name));
}

// ---------------------------------------------------------------------------
// Templates
// ---------------------------------------------------------------------------

/** Extract the `// TEMPLATE: Name — description` header + `Use for:` line. */
function extractTemplateDescription(content: string): string | null {
  const headerMatch = content.match(/\/\/\s*TEMPLATE:\s*\w+\s*—\s*(.+)/);
  const useForMatch = content.match(/\/\/\s*Use for:\s*(.+(?:\n\/\/\s{4,}.+)*)/);
  const parts: string[] = [];
  if (headerMatch) parts.push(headerMatch[1].trim());
  if (useForMatch) {
    parts.push(
      'Use for: ' +
        useForMatch[1]
          .split('\n')
          .map((l) => l.replace(/^\/\/\s*/, '').trim())
          .join(' ')
    );
  }
  return parts.length > 0 ? parts.join(' ') : null;
}

/** All Robo* identifiers referenced in the template's import statements. */
function extractTemplateComponents(content: string): string[] {
  const names = new Set<string>();
  const importPattern = /import\s+\{([^}]+)\}\s+from/g;
  let m: RegExpExecArray | null;
  while ((m = importPattern.exec(content)) !== null) {
    for (const id of m[1].split(',')) {
      const trimmed = id.trim();
      if (trimmed.startsWith('Robo')) names.add(trimmed);
    }
  }
  return [...names];
}

/**
 * Map template export name → Storybook path by scanning src/showcase/templates
 * story files: each `export const X` block is inspected for the `<SomeTemplate`
 * it renders and the story `name:` it declares.
 */
function buildTemplateStoryMap(srcDir: string): Map<string, string> {
  const map = new Map<string, string>();
  const templatesStoriesDir = path.join(srcDir, 'showcase', 'templates');

  for (const file of findStoryFiles(templatesStoriesDir)) {
    const content = fs.readFileSync(file, 'utf8');
    const title = extractTitle(content);
    if (!title) continue;

    const chunks = content.split(/^export const /m).slice(1);
    for (const chunk of chunks) {
      const templateMatch = chunk.match(/<(\w+Template)\b/);
      const nameMatch = chunk.match(/name\s*:\s*['"`]([^'"`]+)['"`]/);
      if (templateMatch && !map.has(templateMatch[1])) {
        map.set(
          templateMatch[1],
          nameMatch ? `${title}/${nameMatch[1]}` : title
        );
      }
    }
  }
  return map;
}

function buildTemplates(
  srcDir: string,
  repoRoot: string,
  validStoryPaths: Set<string>,
  errors: string[]
): TemplateEntry[] {
  const indexPath = path.join(srcDir, 'templates', 'index.ts');
  const indexContent = fs.readFileSync(indexPath, 'utf8');

  const exportPattern = /export\s+\{\s*(\w+)\s*\}\s+from\s+'\.\/([\w-]+)'/g;
  const exports: { name: string; file: string }[] = [];
  let m: RegExpExecArray | null;
  while ((m = exportPattern.exec(indexContent)) !== null) {
    exports.push({ name: m[1], file: m[2] });
  }

  const storyMap = buildTemplateStoryMap(srcDir);
  const templates: TemplateEntry[] = [];

  for (const exp of exports) {
    const sourceFile = path.join(srcDir, 'templates', `${exp.file}.tsx`);
    const content = fs.readFileSync(sourceFile, 'utf8');

    const kind: TemplateEntry['kind'] =
      exp.name === 'AppShellTemplate'
        ? 'shell'
        : exp.name.endsWith('StarterTemplate')
          ? 'starter'
          : 'content';

    const archetype = archetypes.find((a) => a.templateExport === exp.name);

    // Preview resolution: prefer a dedicated template story; fall back to the
    // archetype's linked pattern story. Fail if neither resolves — templates
    // must never be invisible in Storybook again.
    let storybookPath = storyMap.get(exp.name) ?? null;
    if (storybookPath && !validStoryPaths.has(storybookPath)) storybookPath = null;
    if (!storybookPath && archetype && validStoryPaths.has(archetype.storyPath)) {
      storybookPath = archetype.storyPath;
    }
    if (!storybookPath) {
      errors.push(
        `template '${exp.name}' has no resolvable Storybook preview (no template story renders it and no archetype storyPath matches)`
      );
      continue;
    }

    const description = extractTemplateDescription(content) ?? archetype?.whenToUse ?? null;
    if (!description) {
      errors.push(`template '${exp.name}' has no description (missing // TEMPLATE: header)`);
      continue;
    }

    templates.push({
      name: exp.name,
      kind,
      importPath: '@roboborealis/components/templates',
      sourceFile: toRel(repoRoot, sourceFile),
      archetypeId: archetype?.id ?? null,
      storybookPath,
      description,
      components: extractTemplateComponents(content),
      notes:
        'Copy-adapt template: generic placeholder data with TODO comments at every injection point. Copy into your app and fill them in.',
    });
  }

  return templates;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  const repoRoot = path.resolve(__dirname, '..');
  const srcDir = path.join(repoRoot, 'src');
  const outputPath = path.join(srcDir, 'agent', 'manifest.json');
  const sidecarPath = path.join(srcDir, 'agent', 'component-metadata.json');
  const useRegexOnly = process.argv.includes('--regex-only');
  const errors: string[] = [];
  const warnings: string[] = [];

  const pkg = JSON.parse(fs.readFileSync(path.join(repoRoot, 'package.json'), 'utf8')) as {
    version?: string;
  };

  const sidecar: Record<string, SidecarEntry> = fs.existsSync(sidecarPath)
    ? JSON.parse(fs.readFileSync(sidecarPath, 'utf8'))
    : {};

  // -- Pass 1: story-file scan (grep parity with the old flat manifest) -------
  const storyFiles = findStoryFiles(srcDir);
  const entries: ManifestEntry[] = [];
  const coveredSourceFiles = new Set<string>();
  const validStoryPaths = new Set<string>();

  interface StoryScan {
    storyFile: string;
    content: string;
    title: string | null;
    sourceFile: string | null;
  }
  const scans: StoryScan[] = [];

  for (const storyFile of storyFiles) {
    const content = fs.readFileSync(storyFile, 'utf8');
    const title = extractTitle(content);
    if (title) {
      validStoryPaths.add(title);
      for (const storyName of extractStoryDisplayNames(content)) {
        validStoryPaths.add(`${title}/${storyName}`);
      }
    }
    const candidateSource = storyFile.replace('.stories.tsx', '.tsx');
    const sourceFile = fs.existsSync(candidateSource) ? candidateSource : null;
    if (sourceFile) coveredSourceFiles.add(sourceFile);
    scans.push({ storyFile, content, title, sourceFile });
  }

  // -- Pass 2: source scan for story-less exported robo-* components -----------
  const allSources = findComponentSources(srcDir);
  const uncovered = allSources.filter((f) => !coveredSourceFiles.has(f));

  // Only include story-less sources whose primary displayName (or file stem) is
  // actually exported from a top-level barrel — internal sub-parts stay out.
  const barrelCache = new Map<string, string>();
  function barrelContent(topDir: string): string {
    if (!barrelCache.has(topDir)) {
      const barrels = walkFiles(path.join(srcDir, topDir), (n) => n === 'index.ts');
      barrelCache.set(topDir, barrels.map((b) => fs.readFileSync(b, 'utf8')).join('\n'));
    }
    return barrelCache.get(topDir)!;
  }

  const sourceOnlyEntries: { file: string; content: string; name: string }[] = [];
  for (const file of uncovered) {
    const content = fs.readFileSync(file, 'utf8');
    const displayNames = extractAllDisplayNames(content);
    const name = displayNames[0] ?? deriveComponentName(null, file);
    const topDir = path.relative(srcDir, file).split(path.sep)[0];
    if (!new RegExp(`\\b${name}\\b`).test(barrelContent(topDir))) continue; // not publicly exported
    sourceOnlyEntries.push({ file, content, name });
  }

  // -- Enrichment (ts-morph over every source we touch, regex fallback) -------
  const metaProject = useRegexOnly ? null : await createMetaProject(repoRoot);
  const enrichTargets = [
    ...scans.filter((s) => s.sourceFile).map((s) => s.sourceFile as string),
    ...sourceOnlyEntries.map((s) => s.file),
  ];
  const tsMorphData = await extractWithTsMorph(enrichTargets, metaProject);
  console.log(
    tsMorphData.size > 0
      ? `ts-morph enriched ${tsMorphData.size} source files`
      : 'ts-morph unavailable — regex fallback'
  );

  function enrich(sourceFile: string | null, name: string): Enrichment {
    if (!sourceFile) return { variants: [], requiredProps: [], description: null };
    const fromAst = tsMorphData.get(sourceFile);
    if (fromAst) return fromAst;
    return regexEnrichment(fs.readFileSync(sourceFile, 'utf8'), name);
  }

  // -- Build entries from story scans ------------------------------------------
  for (const scan of scans) {
    const { storyFile, content, title, sourceFile } = scan;
    const importPath = deriveImportPath(storyFile, srcDir);
    const name = deriveComponentName(title, storyFile);
    const section = title
      ? title.split('/').slice(0, -1).join('/')
      : importPath.replace('@roboborealis/components/', '');
    const storybookPath = title ?? `${section}/${name}`;

    const enrichment = enrich(sourceFile, name);
    const compMeta = extractComponentMetaFor(metaProject, storyFile, content);
    const sidecarEntry = sidecar[name] ?? {};

    // Merge: story componentMeta wins, sidecar fills gaps, JSDoc last resort.
    let meta: ComponentMeta | null = compMeta;
    if (Object.keys(sidecarEntry).length > 0 || enrichment.description) {
      const cleanCompMeta = Object.fromEntries(
        Object.entries(compMeta ?? {}).filter(([, v]) => v !== undefined)
      );
      meta = {
        ...(enrichment.description ? { description: enrichment.description } : {}),
        ...sidecarToMeta(sidecarEntry),
        ...cleanCompMeta,
      };
    }

    const autoAnimation = detectAnimationProps(
      [sourceFile, path.join(path.dirname(storyFile), 'types.ts')].filter(
        (f): f is string => f !== null
      )
    );
    if (autoAnimation) {
      meta = meta ?? {};
      if (!meta.animation) meta.animation = autoAnimation;
    }

    entries.push({
      name,
      entryKind: deriveEntryKind(storybookPath, name),
      section,
      storybookPath,
      importPath,
      storyFile: toRel(repoRoot, storyFile),
      sourceFile: sourceFile ? toRel(repoRoot, sourceFile) : null,
      stories: extractStoryNames(content),
      subComponents: sourceFile
        ? extractAllDisplayNames(fs.readFileSync(sourceFile, 'utf8'))
        : [],
      variants: enrichment.variants,
      requiredProps: enrichment.requiredProps,
      componentMeta: meta,
    });
  }

  // -- Build entries from story-less sources -----------------------------------
  for (const { file, content, name } of sourceOnlyEntries) {
    const importPath = deriveImportPath(file, srcDir);
    const enrichment = enrich(file, name);
    const sidecarEntry = sidecar[name] ?? {};

    let meta: ComponentMeta | null = null;
    if (Object.keys(sidecarEntry).length > 0 || enrichment.description) {
      meta = {
        ...(enrichment.description ? { description: enrichment.description } : {}),
        ...sidecarToMeta(sidecarEntry),
      };
    }

    entries.push({
      name,
      entryKind: 'component',
      section: importPath.replace('@roboborealis/components/', ''),
      storybookPath: null,
      importPath,
      storyFile: null,
      sourceFile: toRel(repoRoot, file),
      stories: [],
      subComponents: extractAllDisplayNames(content),
      variants: enrichment.variants,
      requiredProps: enrichment.requiredProps,
      componentMeta: meta,
    });
  }

  // -- Aggregate dedup: same name from multiple story files --------------------
  const byName = new Map<string, ManifestEntry[]>();
  for (const e of entries) {
    const list = byName.get(e.name) ?? [];
    list.push(e);
    byName.set(e.name, list);
  }
  for (const [name, list] of byName) {
    if (list.length < 2) continue;
    // Primary: the entry whose story/source file stem is the kebab-case of the
    // component name (its own dedicated file); everything else is an aggregate
    // (overview/gallery stories re-presenting the same component).
    const kebab = kebabName(name);
    const primary =
      list.find((e) => {
        const stem = path.basename(e.storyFile ?? e.sourceFile ?? '', '.tsx').replace(
          '.stories',
          ''
        );
        return stem === kebab;
      }) ?? list.sort((a, b) => (a.storybookPath ?? '').localeCompare(b.storybookPath ?? ''))[0];
    for (const e of list) {
      if (e !== primary) e.aggregate = true;
    }
  }

  // -- Category enum validation -------------------------------------------------
  const validCategorySet = new Set<string>(VALID_CATEGORIES);
  let missingCategory = 0;
  for (const e of entries) {
    if (e.entryKind !== 'component' || e.aggregate) continue;
    const cat = e.componentMeta?.category;
    if (cat && !validCategorySet.has(cat)) {
      errors.push(
        `'${e.name}' has invalid componentMeta.category '${cat}' — must be one of: ${VALID_CATEGORIES.join(', ')}`
      );
    }
    if (e.componentMeta && !cat) missingCategory++;
  }

  entries.sort(
    (a, b) =>
      (a.storybookPath ?? `zzz/${a.name}`).localeCompare(b.storybookPath ?? `zzz/${b.name}`) ||
      a.name.localeCompare(b.name)
  );

  // -- Templates + patterns ------------------------------------------------------
  const templates = buildTemplates(srcDir, repoRoot, validStoryPaths, errors);
  const referencePatterns = scanReferencePatterns(srcDir, repoRoot, metaProject);

  // -- Phantom guard: guidance strings naming non-existent *Template exports ----
  const templateNames = new Set(templates.map((t) => t.name));
  const guidanceJson = JSON.stringify(entries);
  const phantomPattern = /\b([A-Z]\w+Template)\b/g;
  const phantomsSeen = new Set<string>();
  let pm: RegExpExecArray | null;
  while ((pm = phantomPattern.exec(guidanceJson)) !== null) {
    if (!templateNames.has(pm[1])) phantomsSeen.add(pm[1]);
  }
  for (const phantom of phantomsSeen) {
    warnings.push(
      `guidance text references '${phantom}' which is not an export of @roboborealis/components/templates`
    );
  }

  if (errors.length > 0) {
    console.error(`\nERROR: manifest generation failed with ${errors.length} error(s):\n`);
    for (const err of errors) console.error(`  - ${err}`);
    process.exit(1);
  }

  // -- Write ---------------------------------------------------------------------
  const manifest = {
    generated: new Date().toISOString(),
    version: pkg.version ?? '0.0.0',
    schemaVersion: '3.0.0',
    description:
      'Agent-readable catalog for @roboborealis/components. Auto-generated by scripts/generate-manifest.ts — do not edit manually. Shipped via the @roboborealis/components/agent-context export; also readable in-repo at src/agent/manifest.json.',
    generatorScript: 'scripts/generate-manifest.ts',
    categories: VALID_CATEGORIES,
    componentCount: entries.length,
    templateCount: templates.length,
    referencePatternCount: referencePatterns.length,
    components: entries,
    templates,
    referencePatterns,
  };

  fs.writeFileSync(outputPath, JSON.stringify(manifest, null, 2) + '\n', 'utf8');

  // -- Summary --------------------------------------------------------------------
  const primaries = entries.filter((e) => !e.aggregate);
  const withMeta = primaries.filter((e) => e.componentMeta !== null).length;
  const withKeywords = primaries.filter(
    (e) => (e.componentMeta?.keywords?.length ?? 0) > 0
  ).length;
  const withVariants = primaries.filter((e) => e.variants.length > 0).length;
  const withPatternMeta = referencePatterns.filter((p) => p.patternMeta !== null).length;

  console.log(`\nGenerated: ${toRel(repoRoot, outputPath)}`);
  console.log(`  ${entries.length} entries (${primaries.length} primary, ${entries.length - primaries.length} aggregate)`);
  console.log(`  ${withMeta} with componentMeta, ${withKeywords} with keywords, ${withVariants} with CVA variants`);
  console.log(`  ${missingCategory} componentMeta entries still missing a category`);
  console.log(`  ${templates.length} templates, ${referencePatterns.length} reference patterns (${withPatternMeta} with patternMeta)`);
  for (const w of warnings) console.warn(`  WARN: ${w}`);
}

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
