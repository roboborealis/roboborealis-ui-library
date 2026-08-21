import { chromium } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import * as yaml from 'js-yaml';
import type { Action } from '../actions/index';
import { executeAction } from '../actions/index';
import { splitSteps, totalDurationMs } from '../utils/split';
import { storyUrlToIframeUrl } from '../utils/url';

const MAX_VIDEO_MS = 60_000;

interface Viewport {
  width: number;
  height: number;
}

export interface CaptureScript {
  title: string;
  description?: string;
  story: string;
  viewport?: Viewport;
  auth?: { type: string; token: string };
  steps: Action[];
}

function resolveOutputPath(title: string, part?: number): string {
  const name = part != null ? `${title}-part${part}.webm` : `${title}.webm`;
  let candidate = path.join(os.homedir(), 'Downloads', name);
  if (!fs.existsSync(candidate)) return candidate;
  let n = 2;
  while (true) {
    const suffix = part != null ? `${title}-part${part}-${n}.webm` : `${title}-${n}.webm`;
    candidate = path.join(os.homedir(), 'Downloads', suffix);
    if (!fs.existsSync(candidate)) return candidate;
    n++;
  }
}

async function recordChunk(
  iframeUrl: string,
  steps: Action[],
  viewport: Viewport,
  outputPath: string
): Promise<void> {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'robo-capture-'));
  const browser = await chromium.launch();
  try {
    const context = await browser.newContext({
      viewport,
      recordVideo: { dir: tmpDir, size: viewport },
    });
    const page = await context.newPage();

    await page.goto(iframeUrl, { waitUntil: 'domcontentloaded' });
    // Storybook 10 sometimes renders "No Preview" on the first load of the
    // iframe URL. A reload forces the story to render properly.
    await page.waitForTimeout(600);
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#storybook-root', { state: 'visible' });

    // Inject a visible cursor overlay so the recording shows mouse position
    // and click feedback (scale-down on mousedown + amber ripple on click).
    await page.evaluate(() => {
      const style = document.createElement('style');
      style.textContent = `
        #robo-cursor {
          position: fixed; width: 18px; height: 18px; border-radius: 50%;
          background: rgba(255,255,255,0.92); border: 2px solid rgba(0,0,0,0.55);
          transform: translate(-50%,-50%); pointer-events: none;
          z-index: 2147483647; transition: transform 0.08s ease, opacity 0.1s;
          box-shadow: 0 1px 4px rgba(0,0,0,0.35);
        }
        #robo-cursor.down { transform: translate(-50%,-50%) scale(0.65); }
        @keyframes robo-ripple {
          0%   { transform: translate(-50%,-50%) scale(0); opacity: 0.9; }
          100% { transform: translate(-50%,-50%) scale(3.5); opacity: 0; }
        }
        .robo-ripple {
          position: fixed; width: 26px; height: 26px; border-radius: 50%;
          border: 2px solid #f59e0b; pointer-events: none;
          z-index: 2147483646;
          animation: robo-ripple 0.45s cubic-bezier(0.4,0,0.2,1) forwards;
        }
      `;
      document.head.appendChild(style);

      const cursor = document.createElement('div');
      cursor.id = 'robo-cursor';
      document.body.appendChild(cursor);

      document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top  = e.clientY + 'px';
      }, true);

      document.addEventListener('mousedown', (e) => {
        cursor.classList.add('down');
        const ripple = document.createElement('div');
        ripple.className = 'robo-ripple';
        ripple.style.left = e.clientX + 'px';
        ripple.style.top  = e.clientY + 'px';
        document.body.appendChild(ripple);
        setTimeout(() => ripple.remove(), 500);
      }, true);

      document.addEventListener('mouseup', () => cursor.classList.remove('down'), true);
    });

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      process.stdout.write(`  [${i + 1}/${steps.length}] ${step.action}...`);
      await executeAction(page, step);
      process.stdout.write(' ✓\n');
    }

    await context.close();
  } finally {
    await browser.close();
  }

  // Playwright saves the video when context closes; find and move it
  const files = fs.readdirSync(tmpDir).filter((f) => f.endsWith('.webm'));
  if (files.length === 0) throw new Error('Playwright did not produce a video file');
  fs.renameSync(path.join(tmpDir, files[0]), outputPath);
  fs.rmSync(tmpDir, { recursive: true, force: true });
}

export async function captureVideo(scriptPath: string): Promise<void> {
  const raw = fs.readFileSync(scriptPath, 'utf-8');
  const script = yaml.load(raw) as CaptureScript;
  const viewport = script.viewport ?? { width: 1280, height: 800 };
  const iframeUrl = storyUrlToIframeUrl(script.story);
  const totalMs = totalDurationMs(script.steps);
  const chunks =
    totalMs > MAX_VIDEO_MS ? splitSteps(script.steps, MAX_VIDEO_MS) : [script.steps];

  console.log(`▶ Capturing: ${script.title}`);
  console.log(`  Story:   ${script.story}`);
  console.log(`  Steps:   ${script.steps.length}`);

  if (chunks.length > 1) {
    console.log(
      `\n⚠ Script exceeds 60s (estimated ${Math.round(totalMs / 1000)}s) — splitting into ${chunks.length} parts automatically`
    );
  }

  fs.mkdirSync(path.join(os.homedir(), 'Downloads'), { recursive: true });

  for (let i = 0; i < chunks.length; i++) {
    const part = chunks.length > 1 ? i + 1 : undefined;
    const outputPath = resolveOutputPath(script.title, part);
    if (part != null) {
      console.log(`\n  Part ${part}/${chunks.length} (${chunks[i].length} steps):`);
    } else {
      console.log('');
    }
    await recordChunk(iframeUrl, chunks[i], viewport, outputPath);
    console.log(`\n✓ Saved to ${outputPath}`);
  }
}
