import { createElement } from 'react';
import type { Preview, Decorator } from '@storybook/react';
import { installStaleChunkRecovery } from './stale-chunk-recovery';
import './globals.css';
import '../../themes/theme-midnight.css';
import '../../themes/theme-aurora.css';
import '../../themes/theme-sol.css';
import './preview-theme.css';

// Selectable font families — imported straight from @fontsource/* (resolved
// via npm workspace hoisting to the root node_modules) so Storybook renders
// real letterforms for each option, not just a CSS variable name change.
// Only the published npm package needs the generated fonts/ directory
// (scripts/copy-fonts.ts); local Storybook dev can import node_modules directly.
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/700.css';
import '@fontsource/dm-sans/400.css';
import '@fontsource/dm-sans/500.css';
import '@fontsource/dm-sans/700.css';
import '@fontsource/varela/400.css';
import '@fontsource/open-sans/400.css';
import '@fontsource/open-sans/700.css';
import '@fontsource/opendyslexic/400.css';
import '@fontsource/opendyslexic/700.css';
import '@fontsource/sora/400.css';
import '@fontsource/sora/500.css';
import '@fontsource/sora/700.css';

// Story chunks are lazy-loaded, so they are the first thing to break when the
// private-Pages auth cookie lapses or a new deploy rotates the content hashes.
// See stale-chunk-recovery.ts for why a reload is the only recovery.
installStaleChunkRecovery();

/**
 * Synchronises Storybook toolbar globals → HTML root data-* attributes.
 *
 * theme:       midnight | aurora
 * mode:        dark | light
 * density:     compact | comfortable | spacious
 * fontFamily:  inter | dm-sans | varela | open-sans | opendyslexic | sora
 */
const themeDecorator: Decorator = (Story, context) => {
  const { theme, mode, density, fontFamily } = context.globals;

  if (typeof document !== 'undefined') {
    const root = document.documentElement;

    // ── Theme ─────────────────────────────────────────────
    const activeTheme = theme ?? 'midnight';
    root.setAttribute('data-theme', activeTheme);

    // ── Light / Dark mode ─────────────────────────────────
    // Aurora defaults to light; Midnight + Neutral default to dark
    const defaultMode = activeTheme === 'aurora' ? 'light' : 'dark';
    root.setAttribute('data-mode', mode || defaultMode);

    // ── Density ───────────────────────────────────────────
    root.setAttribute('data-density', density || 'comfortable');

    // ── Font family ───────────────────────────────────────
    root.setAttribute('data-font-family', fontFamily || 'dm-sans');

    // ── Legacy dark class (for any shadcn components that use .dark) ──
    const resolvedMode = mode || (activeTheme === 'aurora' ? 'light' : 'dark');
    if (resolvedMode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // ── Force body + html to immediately reflect CSS var changes ──
    // Setting the var() reference as an inline style keeps it reactive —
    // the browser resolves the variable at paint time, not at setAttribute time.
    root.style.backgroundColor = 'var(--background)';
    root.style.color = 'var(--foreground)';
    document.body.style.backgroundColor = 'var(--background)';
    document.body.style.color = 'var(--foreground)';
  }

  return createElement(Story);
};

const preview: Preview = {
  parameters: {
    options: {
      storySort: {
        order: [
          'Showcase', [
            'Overview',
            'Templates', ['Basic App', 'Dashboard Starter', 'Table Starter', 'Form Starter', 'Content', ['*'], '*'],
            'Patterns', ['*'],
            '*',
          ],
          'Foundation', [
            'Overview', 'Getting Started', 'Design Tokens', 'Theme Switcher', 'Density Showcase',
            'Providers', ['Overview', '*'],
            '*',
          ],
          'Data', [
            'Overview',
            'Charts', ['Overview', 'ECharts', ['*'], '*'],
            'Visualizations', ['Overview', '*'],
            'Tables', ['Overview', '*'],
            '*',
          ],
          'Components', [
            'Overview',
            'Forms', ['Overview', '*'],
            'Navigation', ['Overview', '*'],
            'Overlays', ['*'],
            'Feedback', ['Overview', '*'],
            'Loading', ['Overview', '*'],
            'Layout', ['Overview', '*'],
            '*',
          ],
          'Elements', [
            'Overview',
            'Actions', ['Overview', '*'],
            'Display', ['*'],
            'Flags', ['Overview', '*'],
            'Icons', ['*'],
            'Brand', ['Overview', '*'],
            '*',
          ],
          '*',
        ],
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      config: {},
    },
    backgrounds: {
      // Theme CSS vars control background — disable the Storybook bg addon
      disable: true,
    },
  },

  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Brand theme',
      defaultValue: 'midnight',
      toolbar: {
        icon: 'paintbrush',
        items: [
          { value: 'midnight', icon: 'contrast', title: 'Midnight' },
          { value: 'aurora',   icon: 'star',     title: 'Aurora' },
          { value: 'sol',      icon: 'circle',  title: 'Sol' },
        ],
        showName: true,
        dynamicTitle: true,
      },
    },
    mode: {
      name: 'Mode',
      description: 'Light or dark mode',
      defaultValue: 'dark',
      toolbar: {
        icon: 'moon',
        items: [
          { value: 'dark',  icon: 'moon',  title: 'Dark' },
          { value: 'light', icon: 'sun', title: 'Light' },
        ],
        showName: true,
        dynamicTitle: true,
      },
    },
    density: {
      name: 'Density',
      description: 'Layout density — affects spacing and font scale',
      defaultValue: 'comfortable',
      toolbar: {
        icon: 'listunordered',
        items: [
          { value: 'compact',     title: 'Compact' },
          { value: 'comfortable', title: 'Comfortable' },
          { value: 'spacious',    title: 'Spacious' },
        ],
        showName: true,
        dynamicTitle: true,
      },
    },
    fontFamily: {
      name: 'Font',
      description: 'Body text font family',
      defaultValue: 'dm-sans',
      toolbar: {
        icon: 'font',
        items: [
          { value: 'inter',        title: 'Inter' },
          { value: 'dm-sans',      title: 'DM Sans' },
          { value: 'varela',       title: 'Varela' },
          { value: 'open-sans',    title: 'Open Sans' },
          { value: 'opendyslexic', title: 'OpenDyslexic' },
          { value: 'sora',         title: 'Sora' },
        ],
        showName: true,
        dynamicTitle: true,
      },
    },
  },

  decorators: [themeDecorator],
};

export default preview;
