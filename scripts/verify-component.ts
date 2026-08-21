#!/usr/bin/env tsx
/**
 * verify-component.ts
 *
 * Verifies that a component directory meets all @roboborealis/components quality gates.
 * Exits with code 1 if any required checks fail.
 *
 * Usage:
 *   npm run verify:component -- --path src/core/button
 *   npm run verify:component -- --path src/feedback/alert
 */

import * as fs from 'fs';
import * as path from 'path';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface CheckResult {
  name: string;
  passed: boolean;
  message?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function fileContains(filePath: string, pattern: RegExp | string): boolean {
  if (!fs.existsSync(filePath)) return false;
  const content = fs.readFileSync(filePath, 'utf8');
  return typeof pattern === 'string' ? content.includes(pattern) : pattern.test(content);
}

function inferComponentName(componentPath: string): string {
  // src/core/button → RoboButton
  const dirName = path.basename(componentPath); // "button"
  return (
    'Robo' +
    dirName
      .split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join('')
  );
}

function inferKebab(componentPath: string): string {
  // src/core/button → robo-button
  return `robo-${path.basename(componentPath)}`;
}

// ---------------------------------------------------------------------------
// Individual checks
// ---------------------------------------------------------------------------

function checkComponentFile(componentFile: string, componentName: string): CheckResult[] {
  const results: CheckResult[] = [];

  results.push({
    name: 'Component file exists',
    passed: fs.existsSync(componentFile),
  });

  if (!fs.existsSync(componentFile)) return results;

  results.push({
    name: 'Accepts ref as a prop (React 19 — no forwardRef)',
    passed:
      fileContains(componentFile, 'ref?: React.Ref<') &&
      !fileContains(componentFile, 'forwardRef'),
    message:
      'Components must accept ref as a regular prop (ref?: React.Ref<T> on the Props interface); React.forwardRef is obsolete under React 19',
  });

  results.push({
    name: 'Sets displayName',
    passed: fileContains(componentFile, `.displayName = '${componentName}'`),
    message: `Must have: ${componentName}.displayName = '${componentName}'`,
  });

  results.push({
    name: 'Includes data-slot attribute',
    passed: fileContains(componentFile, "data-slot="),
    message: 'Add data-slot to the root element for theming hooks',
  });

  results.push({
    name: 'Uses CVA variants',
    passed: fileContains(componentFile, 'cva('),
    message: 'Use class-variance-authority (cva) for variant definitions',
  });

  results.push({
    name: 'Uses cn() for className merging',
    passed: fileContains(componentFile, 'cn('),
    message: "Import cn from '@/lib/utils' and use it to merge classNames",
  });

  results.push({
    name: 'Exports component and variants',
    passed: fileContains(componentFile, `export { ${componentName}`),
    message: 'Both the component and its variants object must be exported',
  });

  results.push({
    name: 'No hardcoded hex colors',
    passed: !fileContains(componentFile, /#[0-9a-fA-F]{3,8}\b/),
    message: 'Use CSS variables (var(--primary)) instead of hardcoded hex values',
  });

  return results;
}

function checkTestFile(testFile: string, componentName: string): CheckResult[] {
  const results: CheckResult[] = [];

  results.push({
    name: 'Test file exists',
    passed: fs.existsSync(testFile),
  });

  if (!fs.existsSync(testFile)) return results;

  results.push({
    name: 'Includes axe accessibility test',
    passed: fileContains(testFile, 'axe(') && fileContains(testFile, 'toHaveNoViolations'),
    message: 'Add: expect(await axe(container)).toHaveNoViolations()',
  });

  results.push({
    name: 'Tests displayName',
    passed: fileContains(testFile, `displayName`),
    message: `Add: expect(${componentName}.displayName).toBe('${componentName}')`,
  });

  results.push({
    name: 'Tests ref forwarding',
    passed: fileContains(testFile, 'createRef') || fileContains(testFile, 'useRef'),
    message: 'Add a test that verifies ref.current resolves to the correct DOM element',
  });

  results.push({
    name: 'Tests default render',
    passed: fileContains(testFile, 'render(') && fileContains(testFile, 'toBeInTheDocument'),
    message: 'Add a basic render test with toBeInTheDocument assertion',
  });

  return results;
}

function checkStoryFile(storyFile: string, componentName: string): CheckResult[] {
  const results: CheckResult[] = [];

  results.push({
    name: 'Story file exists',
    passed: fs.existsSync(storyFile),
  });

  if (!fs.existsSync(storyFile)) return results;

  // Verify 6-section title format: Showcase|Foundation|Elements|Components|Data
  const titleMatch = fs
    .readFileSync(storyFile, 'utf8')
    .match(/title\s*:\s*['"`]([^'"`]+)['"`]/);
  const title = titleMatch?.[1] ?? '';
  const validTiers = ['Showcase', 'Foundation', 'Elements', 'Components', 'Data'];
  const topTier = title.split('/')[0];

  results.push({
    name: 'Story uses valid section title (Showcase|Foundation|Elements|Components|Data)',
    passed: validTiers.includes(topTier),
    message: `Current title: '${title}'. Must start with one of: ${validTiers.join(', ')}`,
  });

  results.push({
    name: 'Story title ends with component name',
    passed: title.endsWith(componentName),
    message: `Title should end with '${componentName}', got '${title}'`,
  });

  results.push({
    name: 'Has AllVariants story',
    passed: fileContains(storyFile, 'AllVariants'),
    message: 'Add: export const AllVariants: Story = { ... }',
  });

  results.push({
    name: 'Has Default story',
    passed: fileContains(storyFile, "export const Default"),
    message: 'Add: export const Default: Story = { args: { ... } }',
  });

  results.push({
    name: 'Has autodocs tag',
    passed: fileContains(storyFile, "tags: ['autodocs']"),
    message: "Add: tags: ['autodocs'] to the meta object",
  });

  return results;
}

function checkBarrelExport(indexFile: string, componentName: string): CheckResult[] {
  const results: CheckResult[] = [];

  results.push({
    name: 'Subpath index.ts exists',
    passed: fs.existsSync(indexFile),
    message: `Missing: ${indexFile}`,
  });

  if (!fs.existsSync(indexFile)) return results;

  results.push({
    name: `${componentName} is exported from index.ts`,
    passed: fileContains(indexFile, componentName),
    message: `Add: export { ${componentName} } from './... '`,
  });

  return results;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function parseArgs(argv: string[]): string {
  const args = argv.slice(2);
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--path' && args[i + 1]) {
      return args[++i];
    }
  }
  console.error('Error: --path is required (e.g. --path src/core/button)');
  process.exit(1);
}

function main(): void {
  const repoRoot = path.resolve(__dirname, '..');
  const componentRelPath = parseArgs(process.argv);

  // Normalize to relative path (strip leading src/ or absolute prefix)
  const normalized = componentRelPath.replace(/^\/workspace\/[^/]+\/[^/]+\//, '');
  const componentDir = path.join(repoRoot, normalized);

  if (!fs.existsSync(componentDir)) {
    console.error(`Error: Directory not found: ${componentDir}`);
    process.exit(1);
  }

  // Derive names
  const componentName = inferComponentName(componentDir);
  const kebab = inferKebab(componentDir);

  // Paths to check
  const componentFile = path.join(componentDir, `${kebab}.tsx`);
  const testFile = path.join(componentDir, `${kebab}.test.tsx`);
  const storyFile = path.join(componentDir, `${kebab}.stories.tsx`);
  const subpathDir = path.dirname(componentDir);
  const indexFile = path.join(subpathDir, 'index.ts');

  console.log(`\nVerifying: ${componentName}`);
  console.log(`Path: ${normalized}\n`);

  // Run all checks
  const allResults: CheckResult[] = [
    ...checkComponentFile(componentFile, componentName),
    ...checkTestFile(testFile, componentName),
    ...checkStoryFile(storyFile, componentName),
    ...checkBarrelExport(indexFile, componentName),
  ];

  let passed = 0;
  let failed = 0;

  for (const result of allResults) {
    const icon = result.passed ? '✅' : '❌';
    console.log(`${icon} ${result.name}`);
    if (!result.passed && result.message) {
      console.log(`   → ${result.message}`);
    }
    if (result.passed) passed++;
    else failed++;
  }

  console.log(`\n${passed} passed, ${failed} failed`);

  if (failed > 0) {
    console.log('\nFix the issues above, then run: npm run verify:component -- --path ' + normalized);
    process.exit(1);
  } else {
    console.log('\nAll checks passed. Ready to run: npm run ci:local');
  }
}

main();
