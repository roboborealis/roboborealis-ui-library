import * as fs from 'fs';
import * as path from 'path';
import { extractStorySlug } from '../utils/url';

export function buildScriptTemplate(url: string): string {
  const slug = extractStorySlug(url);
  return `title: ${slug}
description: TODO — describe what this capture demonstrates
story: ${url}
viewport:
  width: 1280
  height: 800

steps:
  - action: wait
    for: selector
    value: "body"

  - action: hover
    selector: "TODO — replace with real CSS selector"
    duration: 800

  - action: click
    selector: "TODO — replace with real CSS selector"
`;
}

export function initScript(url: string, scriptsDir: string, options?: { overwrite?: boolean }): string {
  const slug = extractStorySlug(url);
  const scriptPath = path.join(scriptsDir, `${slug}.yml`);

  if (!options?.overwrite && fs.existsSync(scriptPath)) {
    throw new Error(`Script already exists: ${scriptPath}\nPass { overwrite: true } to replace it.`);
  }

  fs.mkdirSync(scriptsDir, { recursive: true });
  fs.writeFileSync(scriptPath, buildScriptTemplate(url), 'utf-8');
  return scriptPath;
}
