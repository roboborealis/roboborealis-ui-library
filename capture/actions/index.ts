import type { Page } from 'playwright';

export type Action =
  | { action: 'click'; selector: string; force?: boolean }
  | { action: 'click_at'; x: number; y: number }
  | { action: 'double_click_at'; x: number; y: number }
  | { action: 'hover'; selector: string; duration?: number }
  | { action: 'drag'; selector: string; deltaX: number; deltaY: number; steps?: number }
  | { action: 'type'; selector: string; text: string }
  | { action: 'scroll'; direction: 'up' | 'down'; amount: number }
  | { action: 'scroll_element'; selector: string; nth?: number; direction: 'up' | 'down'; amount: number }
  | { action: 'keyboard'; key: string }
  | { action: 'select'; selector: string; value: string }
  | { action: 'wait'; for: 'selector'; value: string }
  | { action: 'wait'; for: 'timeout'; value: number }
  | { action: 'set_theme'; theme: 'midnight' | 'aurora'; mode: 'dark' | 'light' };

export const ACTION_OVERHEAD_MS = 200;

export function estimateStepDurationMs(step: Action): number {
  switch (step.action) {
    case 'hover':
      return (step.duration ?? 0) + ACTION_OVERHEAD_MS;
    case 'wait':
      return step.for === 'timeout'
        ? step.value + ACTION_OVERHEAD_MS
        : ACTION_OVERHEAD_MS;
    case 'drag':
      return 600 + ACTION_OVERHEAD_MS;
    case 'click':
    case 'click_at':
    case 'double_click_at':
    case 'type':
    case 'scroll':
    case 'scroll_element':
    case 'keyboard':
    case 'select':
    case 'set_theme':
      return ACTION_OVERHEAD_MS;
    default: {
      const _exhaustive: never = step;
      throw new Error(`Unhandled action: ${(_exhaustive as Action).action}`);
    }
  }
}

export async function executeAction(page: Page, step: Action): Promise<void> {
  switch (step.action) {
    case 'click':
      await page.click(step.selector, step.force ? { force: true } : undefined);
      break;
    case 'click_at':
      await page.mouse.click(step.x, step.y);
      break;
    case 'double_click_at':
      await page.mouse.dblclick(step.x, step.y);
      break;
    case 'hover':
      await page.hover(step.selector);
      if (step.duration != null) await page.waitForTimeout(step.duration);
      break;
    case 'drag': {
      const el = page.locator(step.selector).first();
      const box = await el.boundingBox();
      if (!box) break;
      const cx = box.x + box.width / 2;
      const cy = box.y + box.height / 2;
      await page.mouse.move(cx, cy);
      await page.mouse.down();
      await page.mouse.move(cx + step.deltaX, cy + step.deltaY, { steps: step.steps ?? 20 });
      await page.mouse.up();
      break;
    }
    case 'type':
      await page.fill(step.selector, step.text);
      break;
    case 'scroll':
      await page.evaluate(
        ({ direction, amount }: { direction: string; amount: number }) =>
          window.scrollBy(0, direction === 'down' ? amount : -amount),
        { direction: step.direction, amount: step.amount }
      );
      break;
    case 'scroll_element': {
      const locator = page.locator(step.selector);
      const el = step.nth != null ? locator.nth(step.nth) : locator.first();
      await el.evaluate(
        (node, { direction, amount }) =>
          (node as HTMLElement).scrollBy(0, direction === 'down' ? amount : -amount),
        { direction: step.direction, amount: step.amount }
      );
      break;
    }
    case 'keyboard':
      await page.keyboard.press(step.key);
      break;
    case 'select':
      await page.selectOption(step.selector, step.value);
      break;
    case 'wait':
      if (step.for === 'selector') {
        await page.waitForSelector(step.value);
      } else {
        await page.waitForTimeout(step.value);
      }
      break;
    case 'set_theme':
      await page.evaluate(
        ({ theme, mode }: { theme: string; mode: string }) => {
          const root = document.documentElement;
          root.setAttribute('data-theme', theme);
          root.setAttribute('data-mode', mode);
          if (mode === 'dark') {
            root.classList.add('dark');
          } else {
            root.classList.remove('dark');
          }
          root.style.backgroundColor = 'var(--background)';
          root.style.color = 'var(--foreground)';
          document.body.style.backgroundColor = 'var(--background)';
          document.body.style.color = 'var(--foreground)';
        },
        { theme: step.theme, mode: step.mode }
      );
      break;
    default: {
      const _exhaustive: never = step;
      throw new Error(`Unhandled action: ${(_exhaustive as Action).action}`);
    }
  }
}
