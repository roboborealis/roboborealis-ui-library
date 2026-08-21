#!/usr/bin/env tsx
/**
 * scaffold-component.ts
 *
 * Scaffolds a new @roboborealis/components component with component, test, and story files,
 * then appends the barrel export to the subpath index.ts.
 *
 * Usage:
 *   npm run scaffold:component -- --name RoboFoo --subpath core
 *   npm run scaffold:component -- --name RoboFoo --subpath core --variants "variant:default,secondary"
 *   npm run scaffold:component -- --name RoboFoo --subpath core --variants "variant:default,secondary" --variants "size:sm,md,lg"
 */

import * as fs from 'fs';
import * as path from 'path';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ScaffoldOptions {
  name: string;
  subpath: string;
  variants: string[];
}

interface VariantDef {
  name: string;
  values: string[];
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const VALID_SUBPATHS = [
  'core', 'forms', 'navigation', 'tables', 'feedback',
  'layout', 'charts', 'editor', 'flags',
  'tokens', 'brand', 'foundation', 'visualizations', 'patterns',
];

// Sidebar section tiers — matches the 6-section Storybook structure:
//   Foundation / Elements / Components / Data / Showcase
// Note: 'core' defaults to Elements/Actions. For display-only atoms (badge, chip, avatar)
// manually change the generated title to Elements/Display/RoboFoo after scaffolding.
const STORYBOOK_TIER: Record<string, string> = {
  core: 'Elements/Actions',
  forms: 'Components/Forms',
  navigation: 'Components/Navigation',
  feedback: 'Components/Feedback',
  layout: 'Components/Layout',
  patterns: 'Showcase/Patterns',
  flags: 'Elements/Flags',
  charts: 'Data/Charts',
  tables: 'Data/Tables',
  editor: 'Components/Forms',
  visualizations: 'Data/Visualizations',
  icons: 'Elements/Icons',
  tokens: 'Foundation',
  brand: 'Elements/Brand',
  foundation: 'Foundation',
};

// ---------------------------------------------------------------------------
// CLI arg parsing
// ---------------------------------------------------------------------------

function parseArgs(argv: string[]): ScaffoldOptions {
  const args = argv.slice(2);
  let name = '';
  let subpath = '';
  const variants: string[] = [];

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--name' && args[i + 1]) {
      name = args[++i];
    } else if (args[i] === '--subpath' && args[i + 1]) {
      subpath = args[++i];
    } else if (args[i] === '--variants' && args[i + 1]) {
      variants.push(args[++i]);
    }
  }

  if (!name) {
    console.error('Error: --name is required (e.g. --name RoboAlert)');
    process.exit(1);
  }
  if (!subpath) {
    console.error('Error: --subpath is required (e.g. --subpath feedback)');
    process.exit(1);
  }

  return { name, subpath, variants };
}

// ---------------------------------------------------------------------------
// Name derivation helpers
// ---------------------------------------------------------------------------

/** Ensure the Robo prefix is present. */
function normalizeName(name: string): string {
  return name.startsWith('Robo') ? name : `Robo${name}`;
}

/** RoboFooBar → robo-foo-bar (treats the Robo prefix as a single unit, not 3 letters) */
function toKebab(pascalName: string): string {
  const rest = pascalName.replace(/^Robo/, '');
  const dashedRest = rest
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase()
    .replace(/^-/, '');
  return `robo-${dashedRest}`;
}

/** robo-foo-bar → foo-bar (strips Robo prefix from file folder name) */
function toDirName(kebab: string): string {
  return kebab.replace(/^robo-/, '');
}

/** RoboFooBar → roboFooBarVariants */
function toVariantsIdentifier(componentName: string): string {
  return componentName.charAt(0).toLowerCase() + componentName.slice(1) + 'Variants';
}

// ---------------------------------------------------------------------------
// Variant parsing
// ---------------------------------------------------------------------------

function parseVariants(variantStrs: string[]): VariantDef[] {
  if (variantStrs.length === 0) {
    return [
      { name: 'variant', values: ['default', 'secondary'] },
      { name: 'size', values: ['sm', 'md', 'lg'] },
    ];
  }
  return variantStrs.map((v) => {
    const colonIdx = v.indexOf(':');
    if (colonIdx === -1) {
      return { name: v, values: ['default'] };
    }
    const name = v.slice(0, colonIdx);
    const values = v.slice(colonIdx + 1).split(',').filter(Boolean);
    return { name, values };
  });
}

// ---------------------------------------------------------------------------
// File content generators
// ---------------------------------------------------------------------------

function genComponent(componentName: string, kebab: string, variants: VariantDef[]): string {
  const variantsId = toVariantsIdentifier(componentName);
  const slot = toDirName(kebab);
  const propsInterface = `${componentName}Props`;

  const variantBlocks = variants
    .map((v) => {
      const vals = v.values.map((val) => `        ${val}: '/* TODO */',`).join('\n');
      return `      ${v.name}: {\n${vals}\n      },`;
    })
    .join('\n');

  const defaultVariants = variants
    .map((v) => `      ${v.name}: '${v.values[0]}',`)
    .join('\n');

  const destructuredVariants = variants.map((v) => v.name).join(', ');

  const lines = [
    `import * as React from 'react';`,
    `import { cva, type VariantProps } from 'class-variance-authority';`,
    ``,
    `import { cn } from '@/lib/utils';`,
    ``,
    `const ${variantsId} = cva(`,
    `  '/* TODO: add base Tailwind classes */',`,
    `  {`,
    `    variants: {`,
    variantBlocks,
    `    },`,
    `    defaultVariants: {`,
    defaultVariants,
    `    },`,
    `  }`,
    `);`,
    ``,
    `export interface ${propsInterface}`,
    `  extends React.HTMLAttributes<HTMLDivElement>,`,
    `    VariantProps<typeof ${variantsId}> {`,
    `  ref?: React.Ref<HTMLDivElement>;`,
    `}`,
    ``,
    `/**`,
    ` * ${componentName} — TODO: one-line description.`,
    ` *`,
    ` * @example`,
    ` * \`\`\`tsx`,
    ` * <${componentName}>Content</${componentName}>`,
    ` * \`\`\``,
    ` */`,
    `function ${componentName}({ className, ${destructuredVariants}, ref, ...props }: ${propsInterface}) {`,
    `  return (`,
    `    <div`,
    `      ref={ref}`,
    `      data-slot='${slot}'`,
    `      className={cn(${variantsId}({ ${destructuredVariants} }), className)}`,
    `      {...props}`,
    `    />`,
    `  );`,
    `}`,
    `${componentName}.displayName = '${componentName}';`,
    ``,
    `export { ${componentName}, ${variantsId} };`,
  ];

  return lines.join('\n') + '\n';
}

function genTest(componentName: string, kebab: string, variants: VariantDef[]): string {
  const firstVariant = variants[0];
  const secondValue = firstVariant.values[1] ?? firstVariant.values[0];

  const lines = [
    `import * as React from 'react';`,
    `import { render, screen } from '@testing-library/react';`,
    `import { axe } from 'vitest-axe';`,
    ``,
    `import { ${componentName} } from './${kebab}';`,
    ``,
    ``,
    `describe('${componentName}', () => {`,
    `  it('renders with default props', () => {`,
    `    render(<${componentName}>Content</${componentName}>);`,
    `    expect(screen.getByText('Content')).toBeInTheDocument();`,
    `  });`,
    ``,
    `  it('applies default ${firstVariant.name}', () => {`,
    `    const { container } = render(<${componentName}>Default</${componentName}>);`,
    `    expect(container.firstChild).toBeInTheDocument();`,
    `  });`,
    ``,
    `  it('applies ${secondValue} ${firstVariant.name}', () => {`,
    `    const { container } = render(`,
    `      <${componentName} ${firstVariant.name}='${secondValue}'>Secondary</${componentName}>`,
    `    );`,
    `    expect(container.firstChild).toBeInTheDocument();`,
    `  });`,
    ``,
    `  it('passes className through', () => {`,
    `    const { container } = render(`,
    `      <${componentName} className='custom-class'>Content</${componentName}>`,
    `    );`,
    `    expect(container.firstChild).toHaveClass('custom-class');`,
    `  });`,
    ``,
    `  it('forwards ref to the DOM element', () => {`,
    `    const ref = React.createRef<HTMLDivElement>();`,
    `    render(<${componentName} ref={ref}>Ref test</${componentName}>);`,
    `    expect(ref.current).toBeInstanceOf(HTMLDivElement);`,
    `  });`,
    ``,
    `  it('has correct displayName', () => {`,
    `    expect(${componentName}.displayName).toBe('${componentName}');`,
    `  });`,
    ``,
    `  it('has no accessibility violations', async () => {`,
    `    const { container } = render(<${componentName}>Accessible</${componentName}>);`,
    `    expect(await axe(container)).toHaveNoViolations();`,
    `  });`,
    `});`,
  ];

  return lines.join('\n') + '\n';
}

function genStory(
  componentName: string,
  kebab: string,
  storyTitle: string,
  variants: VariantDef[]
): string {
  const firstVariant = variants[0];
  const variantOptions = firstVariant.values.map((v) => `'${v}'`).join(', ');

  const allVariantItems = firstVariant.values
    .map((v) => {
      const label = v.charAt(0).toUpperCase() + v.slice(1);
      return `      <${componentName} ${firstVariant.name}='${v}'>${label}</${componentName}>`;
    })
    .join('\n');

  const lines = [
    `import * as React from 'react';`,
    `import type { Meta, StoryObj } from '@storybook/react';`,
    ``,
    `import { ${componentName} } from './${kebab}';`,
    ``,
    `const meta: Meta<typeof ${componentName}> = {`,
    `  title: '${storyTitle}/${componentName}',`,
    `  component: ${componentName},`,
    `  tags: ['autodocs'],`,
    `  parameters: {`,
    `    layout: 'centered',`,
    `  },`,
    `  argTypes: {`,
    `    ${firstVariant.name}: {`,
    `      control: 'select',`,
    `      options: [${variantOptions}],`,
    `    },`,
    `  },`,
    `};`,
    `export default meta;`,
    ``,
    `type Story = StoryObj<typeof ${componentName}>;`,
    ``,
    `export const AllVariants: Story = {`,
    `  name: 'All Variants',`,
    `  render: () => (`,
    `    <div className='flex gap-3 flex-wrap items-center'>`,
    allVariantItems,
    `    </div>`,
    `  ),`,
    `};`,
    ``,
    `export const Default: Story = {`,
    `  args: {`,
    `    children: '${componentName}',`,
    `    ${firstVariant.name}: '${firstVariant.values[0]}',`,
    `  },`,
    `};`,
  ];

  return lines.join('\n') + '\n';
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main(): void {
  const repoRoot = path.resolve(__dirname, '..');
  const opts = parseArgs(process.argv);

  const componentName = normalizeName(opts.name);
  const kebab = toKebab(componentName);       // robo-foo-bar
  const dirName = toDirName(kebab);           // foo-bar
  const variantsId = toVariantsIdentifier(componentName);

  if (!VALID_SUBPATHS.includes(opts.subpath)) {
    console.error(
      `Error: Invalid subpath '${opts.subpath}'.\nValid: ${VALID_SUBPATHS.join(', ')}`
    );
    process.exit(1);
  }

  const storyTitle =
    STORYBOOK_TIER[opts.subpath] ??
    `Components/${opts.subpath.charAt(0).toUpperCase()}${opts.subpath.slice(1)}`;

  const variants = parseVariants(opts.variants);

  const componentDir = path.join(repoRoot, 'src', opts.subpath, dirName);
  const componentFile = path.join(componentDir, `${kebab}.tsx`);
  const testFile = path.join(componentDir, `${kebab}.test.tsx`);
  const storyFile = path.join(componentDir, `${kebab}.stories.tsx`);
  const indexFile = path.join(repoRoot, 'src', opts.subpath, 'index.ts');

  // Guard: don't overwrite an existing component
  if (fs.existsSync(componentDir)) {
    console.error(`Error: Directory already exists — ${componentDir}`);
    console.error(`If you meant to regenerate, delete the directory first.`);
    process.exit(1);
  }

  // Create files
  fs.mkdirSync(componentDir, { recursive: true });
  fs.writeFileSync(componentFile, genComponent(componentName, kebab, variants), 'utf8');
  fs.writeFileSync(testFile, genTest(componentName, kebab, variants), 'utf8');
  fs.writeFileSync(storyFile, genStory(componentName, kebab, storyTitle, variants), 'utf8');

  // Append barrel export to index.ts
  const exportLines = [
    '',
    `export { ${componentName}, ${variantsId} } from './${dirName}/${kebab}';`,
    `export type { ${componentName}Props } from './${dirName}/${kebab}';`,
    '',
  ].join('\n');

  if (fs.existsSync(indexFile)) {
    fs.appendFileSync(indexFile, exportLines, 'utf8');
  } else {
    fs.writeFileSync(indexFile, exportLines.trimStart(), 'utf8');
  }

  // Summary
  console.log(`\n✅ Scaffolded ${componentName}\n`);
  console.log('Files created:');
  console.log(`  src/${opts.subpath}/${dirName}/${kebab}.tsx`);
  console.log(`  src/${opts.subpath}/${dirName}/${kebab}.test.tsx`);
  console.log(`  src/${opts.subpath}/${dirName}/${kebab}.stories.tsx`);
  console.log(`\nBarrel export appended to:`);
  console.log(`  src/${opts.subpath}/index.ts`);
  console.log('\nNext steps:');
  console.log(`  1. Implement the component in src/${opts.subpath}/${dirName}/${kebab}.tsx`);
  console.log(`     — add Tailwind CSS variable classes to the CVA definition`);
  console.log(`     — add props, sub-components, and Radix primitives as needed`);
  console.log(`  2. Fill in the test assertions`);
  console.log(`  3. Verify: npm run verify:component -- --path src/${opts.subpath}/${dirName}`);
  console.log(`  4. Regenerate manifest: npm run generate-manifest`);
  console.log(`  5. Full check: npm run ci:local`);
}

main();
