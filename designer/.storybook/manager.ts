import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming/create';
import { GLOBALS_UPDATED, STORY_RENDERED } from 'storybook/internal/core-events';

import { TOKEN_MAP, type ThemeKey } from './token-map';

function buildTheme(theme = 'midnight', mode = 'dark') {
  const key = `${theme}-${mode}` as ThemeKey;
  const tokens = TOKEN_MAP[key] ?? TOKEN_MAP['midnight-dark'];

  return create({
    ...tokens,
    brandTitle: 'RoboBorealis Design',
    fontBase: '"Inter", system-ui, -apple-system, sans-serif',
    fontCode: '"JetBrains Mono", "Fira Code", Consolas, monospace',
  });
}

// Directly set CSS custom properties on the manager document root.
// This is the reliable live-update path — addons.setConfig() applies on load
// but Storybook's React context may not re-render the sidebar on subsequent calls.
function applyTokensToDOM(theme = 'midnight', mode = 'dark') {
  const key = `${theme}-${mode}` as ThemeKey;
  const t = TOKEN_MAP[key] ?? TOKEN_MAP['midnight-dark'];
  const r = document.documentElement.style;
  r.setProperty('--robo-mgr-sidebar',      t.appBg);
  r.setProperty('--robo-mgr-content',      t.appContentBg);
  r.setProperty('--robo-mgr-bar',          t.barBg);
  r.setProperty('--robo-mgr-border',       t.appBorderColor);
  r.setProperty('--robo-mgr-selected',     t.barSelectedColor);
  r.setProperty('--robo-mgr-text',         t.textColor);
  r.setProperty('--robo-mgr-text-muted',   t.barTextColor);
  r.setProperty('--robo-mgr-content-text', t.contentTextColor);
  r.setProperty('--robo-mgr-primary',      t.colorPrimary);
  r.setProperty('--robo-mgr-input-bg',     t.inputBg);
  r.setProperty('--robo-mgr-input-border', t.inputBorder);
}

function applyTheme(theme = 'midnight', mode = 'dark') {
  addons.setConfig({ theme: buildTheme(theme, mode) });
  applyTokensToDOM(theme, mode);
}

// Apply default theme immediately (before any story loads)
applyTheme();

// Sync theme with the preview's toolbar globals when they change
addons.register('robo/theme-sync', () => {
  const channel = addons.getChannel();

  let lastTheme = 'midnight';
  let lastMode = 'dark';

  const applyFromGlobals = (globals: Record<string, string>) => {
    const theme = globals.theme ?? lastTheme;
    const mode = globals.mode ?? lastMode;

    if (theme !== lastTheme || mode !== lastMode) {
      lastTheme = theme;
      lastMode = mode;
      applyTheme(theme, mode);
    }
  };

  channel.on(GLOBALS_UPDATED, ({ globals }: { globals: Record<string, string> }) => {
    applyFromGlobals(globals);
  });

  // Catch-up on first story render in case globals arrived before registration
  channel.once(STORY_RENDERED, () => {
    applyTheme(lastTheme, lastMode);
  });
});
