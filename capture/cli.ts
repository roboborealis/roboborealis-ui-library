import * as fs from 'fs';
import * as path from 'path';
import { captureScreenshot } from './runner/screenshot';
import { captureVideo } from './runner/video';
import { initScript } from './runner/init';

const args = process.argv.slice(2);

function getArg(flag: string): string | undefined {
  const idx = args.indexOf(flag);
  return idx !== -1 ? args[idx + 1] : undefined;
}

function hasFlag(flag: string): boolean {
  return args.includes(flag);
}

function printUsage(): void {
  console.error('Usage:');
  console.error('  npm run capture -- --url <storybook-url> --screenshot');
  console.error('  npm run capture -- --script <path-to-yml>');
  console.error('  npm run capture -- --all');
  console.error('  npm run capture -- --init --url <storybook-url>');
}

async function main(): Promise<void> {
  const url = getArg('--url');
  const scriptPath = getArg('--script');
  const isScreenshot = hasFlag('--screenshot');
  const isInit = hasFlag('--init');
  const isAll = hasFlag('--all');

  if (isInit) {
    if (!url) {
      console.error('Error: --init requires --url');
      printUsage();
      process.exit(1);
    }
    const scriptsDir = path.join(__dirname, 'scripts');
    const out = initScript(url, scriptsDir);
    console.log(`✓ Script scaffolded: ${out}`);
    console.log(`  Edit the title and steps, then run:`);
    console.log(`  npm run capture -- --script ${out}`);
    return;
  }

  if (isScreenshot) {
    if (!url) {
      console.error('Error: --screenshot requires --url');
      printUsage();
      process.exit(1);
    }
    console.log('▶ Capturing screenshot...');
    const out = await captureScreenshot(url);
    console.log(`✓ Saved to ${out}`);
    return;
  }

  if (scriptPath) {
    await captureVideo(scriptPath);
    return;
  }

  if (isAll) {
    const scriptsDir = path.join(__dirname, 'scripts');
    const scripts = fs
      .readdirSync(scriptsDir)
      .filter((f) => f.endsWith('.yml'))
      .sort()
      .map((f) => path.join(scriptsDir, f));

    if (scripts.length === 0) {
      console.error('No .yml scripts found in capture/scripts/');
      process.exit(1);
    }

    console.log(`▶ Running all ${scripts.length} capture scripts\n`);

    const results: { name: string; ok: boolean; error?: string }[] = [];

    for (let i = 0; i < scripts.length; i++) {
      const p = scripts[i];
      const name = path.basename(p, '.yml');
      console.log(`\n[${i + 1}/${scripts.length}] ${name}`);
      try {
        await captureVideo(p);
        results.push({ name, ok: true });
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error(`✗ ${name} failed: ${msg}`);
        results.push({ name, ok: false, error: msg });
      }
    }

    const passed = results.filter((r) => r.ok).length;
    const failed = results.filter((r) => !r.ok);

    console.log('\n─────────────────────────────────────');
    console.log(`  ${passed}/${scripts.length} scripts succeeded`);
    if (failed.length > 0) {
      console.log('\n  Failed:');
      for (const r of failed) {
        console.log(`    ✗ ${r.name}: ${r.error}`);
      }
      process.exit(1);
    }
    return;
  }

  printUsage();
  process.exit(1);
}

main().catch((err: Error) => {
  console.error('Error:', err.message);
  process.exit(1);
});
