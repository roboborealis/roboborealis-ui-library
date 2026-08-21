#!/usr/bin/env tsx
/**
 * copy-fonts.ts
 *
 * Copies the specific weight CSS + woff2 files this library actually uses
 * from each @fontsource/* package in node_modules into fonts/<name>/ at the
 * repo root, alongside the LICENSE. This directory is what package.json
 * `files`/`exports` ship — not node_modules — so consumers get self-hosted
 * font assets without installing @fontsource/* themselves (offline: no CDN, no
 * external URLs, everything bundled).
 *
 * Each package's internal `files/` subfolder is copied verbatim so the
 * weight CSS's `url(./files/...)` references keep working with no rewriting.
 *
 * NOTE: the `.exec(` call below is RegExp.prototype.exec (string pattern
 * matching) — no child_process / shell execution happens in this file.
 *
 * Usage:
 *   npm run copy-fonts
 */

import * as fs from 'fs';
import * as path from 'path';

const ROOT = path.resolve(__dirname, '..');
const FONTS_OUT_DIR = path.join(ROOT, 'fonts');

interface FontSpec {
  /** @fontsource/<pkg> directory name */
  pkg: string;
  /** Output directory name under fonts/ */
  name: string;
  /** Weight CSS files to copy, e.g. ['400.css', '700.css'] */
  weightFiles: string[];
}

const FONTS: FontSpec[] = [
  { pkg: 'dm-sans', name: 'dm-sans', weightFiles: ['400.css', '500.css', '700.css'] },
  { pkg: 'inter', name: 'inter', weightFiles: ['400.css', '500.css', '700.css'] },
  { pkg: 'open-sans', name: 'open-sans', weightFiles: ['400.css', '700.css'] },
  { pkg: 'opendyslexic', name: 'opendyslexic', weightFiles: ['400.css', '700.css'] },
  { pkg: 'sora', name: 'sora', weightFiles: ['400.css', '500.css', '700.css'] },
  // Varela ships regular weight only — no bold cut exists in this family.
  { pkg: 'varela', name: 'varela', weightFiles: ['400.css'] },
];

// Drop the legacy .woff fallback from each src list — Tailwind v4/React 19
// already assume modern evergreen browsers with woff2 support, and shipping
// both formats would double the font-file payload for no practical benefit.
function stripWoffFallback(cssContent: string): string {
  return cssContent.replace(/,\s*url\(\.\/files\/[^)]+\.woff\)\s*format\('woff'\)/g, '');
}

function extractFileUrls(cssContent: string): string[] {
  const urls: string[] = [];
  const regex = /url\((\.\/files\/[^)]+\.woff2)\)/g;
  let match: RegExpExecArray | null;
  // RegExp.prototype.exec — string pattern matching, not child_process.exec.
  while ((match = regex.exec(cssContent)) !== null) {
    urls.push(match[1].replace(/^\.\//, ''));
  }
  return urls;
}

function copyFont(spec: FontSpec) {
  const pkgDir = path.join(ROOT, 'node_modules', '@fontsource', spec.pkg);
  const outDir = path.join(FONTS_OUT_DIR, spec.name);
  const outFilesDir = path.join(outDir, 'files');

  fs.mkdirSync(outFilesDir, { recursive: true });

  const referencedFiles = new Set<string>();
  const importLines: string[] = [];

  for (const weightFile of spec.weightFiles) {
    const srcPath = path.join(pkgDir, weightFile);
    if (!fs.existsSync(srcPath)) {
      throw new Error(`copy-fonts: ${spec.pkg}/${weightFile} not found — check FONTS spec`);
    }
    const content = stripWoffFallback(fs.readFileSync(srcPath, 'utf-8'));
    fs.writeFileSync(path.join(outDir, weightFile), content);
    importLines.push(`@import './${weightFile}';`);

    for (const relFile of extractFileUrls(content)) {
      referencedFiles.add(relFile);
    }
  }

  for (const relFile of referencedFiles) {
    const srcFile = path.join(pkgDir, relFile);
    const destFile = path.join(outDir, relFile);
    fs.mkdirSync(path.dirname(destFile), { recursive: true });
    fs.copyFileSync(srcFile, destFile);
  }

  const licenseSrc = path.join(pkgDir, 'LICENSE');
  if (fs.existsSync(licenseSrc)) {
    fs.copyFileSync(licenseSrc, path.join(outDir, 'LICENSE'));
  }

  fs.writeFileSync(path.join(outDir, 'index.css'), importLines.join('\n') + '\n');

  console.log(`✔ fonts/${spec.name}/ (${spec.weightFiles.length} weights, ${referencedFiles.size} font files)`);
}

function main() {
  fs.mkdirSync(FONTS_OUT_DIR, { recursive: true });
  for (const spec of FONTS) {
    copyFont(spec);
  }
}

main();
