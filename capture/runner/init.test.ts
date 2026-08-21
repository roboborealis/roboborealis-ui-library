import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

import { describe, it, expect } from 'vitest';

import { buildScriptTemplate, initScript } from './init';

describe('buildScriptTemplate', () => {
  const url = 'http://localhost:6006/?path=/story/core-button--primary';

  it('uses slug derived from URL as the title', () => {
    expect(buildScriptTemplate(url)).toContain('title: core-button-primary');
  });

  it('includes the original story URL', () => {
    expect(buildScriptTemplate(url)).toContain(`story: ${url}`);
  });

  it('includes default 1280×800 viewport', () => {
    const tmpl = buildScriptTemplate(url);
    expect(tmpl).toContain('width: 1280');
    expect(tmpl).toContain('height: 800');
  });

  it('includes a placeholder wait step', () => {
    expect(buildScriptTemplate(url)).toContain('action: wait');
  });
});

describe('initScript', () => {
  it('creates the YAML file at the expected path and returns the path', () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'capture-test-'));
    const url = 'http://localhost:6006/?path=/story/core-button--primary';
    const result = initScript(url, tmpDir);
    expect(result).toBe(path.join(tmpDir, 'core-button-primary.yml'));
    expect(fs.existsSync(result)).toBe(true);
    expect(fs.readFileSync(result, 'utf-8')).toContain('title: core-button-primary');
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('throws when file already exists and overwrite is not set', () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'capture-test-'));
    const url = 'http://localhost:6006/?path=/story/core-button--primary';
    initScript(url, tmpDir);
    expect(() => initScript(url, tmpDir)).toThrow('Script already exists');
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('overwrites when overwrite option is true', () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'capture-test-'));
    const url = 'http://localhost:6006/?path=/story/core-button--primary';
    initScript(url, tmpDir);
    expect(() => initScript(url, tmpDir, { overwrite: true })).not.toThrow();
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('creates the scripts directory if it does not exist', () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'capture-test-'));
    const nestedDir = path.join(tmpDir, 'nested', 'scripts');
    const url = 'http://localhost:6006/?path=/story/core-button--primary';
    const result = initScript(url, nestedDir);
    expect(fs.existsSync(result)).toBe(true);
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });
});
