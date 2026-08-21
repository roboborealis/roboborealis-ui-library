import { chromium } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { extractStorySlug, storyUrlToIframeUrl } from '../utils/url';

export async function captureScreenshot(url: string): Promise<string> {
  const iframeUrl = storyUrlToIframeUrl(url);
  const slug = extractStorySlug(url);
  const date = new Date().toISOString().split('T')[0];
  const outputPath = path.join(os.homedir(), 'Downloads', `${slug}-${date}.png`);

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });

  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    await page.goto(iframeUrl, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#storybook-root', { state: 'visible' });
    await page.screenshot({ path: outputPath });
  } finally {
    await browser.close();
  }

  return outputPath;
}
