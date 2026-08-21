import * as fs from 'node:fs';
import * as path from 'node:path';

// ---------------------------------------------------------------------------
// Parses `themes/theme-*.css` into flat token maps per (theme, mode).
//
// The files use a `[data-theme='x'] { ...shared... &[data-mode='dark'] {
// ...dark overrides... } &[data-mode='light'] { ...light overrides... } }`
// shape (see themes/theme-midnight.css). This walks braces rather than
// hardcoding line numbers/selectors so it keeps working as the files grow —
// it strips out every nested `&[...] { ... }` sub-block (mode overrides,
// font-family overrides, density overrides, ...) from the theme body, then
// treats whatever's left as the shared/mode-independent tokens and whichever
// removed block matches the requested mode as the override layer.
// ---------------------------------------------------------------------------

export type RoboThemeName = 'midnight' | 'aurora' | 'sol';
export type RoboThemeMode = 'light' | 'dark';

const THEME_FILES: Record<RoboThemeName, string> = {
  midnight: 'theme-midnight.css',
  aurora: 'theme-aurora.css',
  sol: 'theme-sol.css',
};

/** Finds the substring inside the first balanced `{ ... }` starting at `openIndex` (index of the `{`). Returns [innerContent, indexAfterClosingBrace]. */
function readBalancedBlock(text: string, openIndex: number): [string, number] {
  let depth = 0;
  let i = openIndex;
  const start = openIndex + 1;
  for (; i < text.length; i++) {
    if (text[i] === '{') depth++;
    else if (text[i] === '}') {
      depth--;
      if (depth === 0) return [text.slice(start, i), i + 1];
    }
  }
  throw new Error('Unbalanced braces while parsing theme CSS');
}

interface StrippedBlock {
  selector: string;
  content: string;
}

/** Removes every top-level nested `&[...] { ... }` block from `body`, returning the remaining (mode-independent) text plus each removed block keyed by its selector text. */
function stripNestedBlocks(body: string): { remainder: string; blocks: StrippedBlock[] } {
  const blocks: StrippedBlock[] = [];
  let remainder = '';
  let i = 0;
  while (i < body.length) {
    const nextAmp = body.indexOf('&', i);
    if (nextAmp === -1) {
      remainder += body.slice(i);
      break;
    }
    const openBrace = body.indexOf('{', nextAmp);
    if (openBrace === -1) {
      remainder += body.slice(i);
      break;
    }
    // Everything between nextAmp and openBrace is the selector list for this
    // nested block (may include multiple comma-separated selectors, e.g.
    // `&[data-mode='dark'], &:not([data-mode]) {`).
    const selector = body.slice(nextAmp, openBrace);
    remainder += body.slice(i, nextAmp);
    const [content, afterClose] = readBalancedBlock(body, openBrace);
    blocks.push({ selector, content });
    i = afterClose;
  }
  return { remainder, blocks };
}

/** Extracts `--token: value;` pairs from a chunk of CSS (ignores anything after the first `;` on each declaration, so trailing `/* comment *\/` is dropped). */
function extractTokens(css: string): Record<string, string> {
  const tokens: Record<string, string> = {};
  const matches = css.matchAll(/--([a-zA-Z0-9-]+)\s*:\s*([^;]+);/g);
  for (const match of matches) {
    tokens[`--${match[1]}`] = match[2].trim();
  }
  return tokens;
}

const themeTokenCache = new Map<RoboThemeName, { shared: Record<string, string>; dark: Record<string, string>; light: Record<string, string> }>();

function loadTheme(theme: RoboThemeName) {
  const cached = themeTokenCache.get(theme);
  if (cached) return cached;

  const filePath = path.resolve(__dirname, '../../../../themes', THEME_FILES[theme]);
  const css = fs.readFileSync(filePath, 'utf-8');

  const themeSelectorMatch = css.match(new RegExp(`\\[data-theme=['"]${theme}['"]\\]\\s*\\{`));
  if (!themeSelectorMatch || themeSelectorMatch.index === undefined) {
    throw new Error(`Could not find [data-theme='${theme}'] block in ${filePath}`);
  }
  const openBrace = themeSelectorMatch.index + themeSelectorMatch[0].length - 1;
  const [body] = readBalancedBlock(css, openBrace);

  const { remainder, blocks } = stripNestedBlocks(body);
  const shared = extractTokens(remainder);
  const darkBlock = blocks.find((b) => b.selector.includes("data-mode='dark'") || b.selector.includes('data-mode="dark"'));
  const lightBlock = blocks.find((b) => b.selector.includes("data-mode='light'") || b.selector.includes('data-mode="light"'));

  const result = {
    shared,
    dark: darkBlock ? extractTokens(darkBlock.content) : {},
    light: lightBlock ? extractTokens(lightBlock.content) : {},
  };
  themeTokenCache.set(theme, result);
  return result;
}

/** Flat `--token -> value` map for a given theme/mode, with mode-specific overrides layered on top of shared tokens. */
export function getThemeTokens(theme: RoboThemeName, mode: RoboThemeMode): Record<string, string> {
  const { shared, dark, light } = loadTheme(theme);
  return { ...shared, ...(mode === 'dark' ? dark : light) };
}

export const ALL_THEMES: readonly RoboThemeName[] = ['midnight', 'aurora', 'sol'];
export const ALL_MODES: readonly RoboThemeMode[] = ['light', 'dark'];
