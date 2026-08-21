import type { StorybookConfig } from '@storybook/react-vite';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const libRoot = path.resolve(__dirname, '../..');

const config: StorybookConfig = {
  stories: [
    '../../src/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-a11y',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  async viteFinal(config) {
    const { mergeConfig } = await import('vite');
    const basePath = process.env.STORYBOOK_BASE_PATH ?? '';

    return mergeConfig(config, {
      base: basePath ? `${basePath}/` : '/',
      css: {
        postcss: {
          plugins: [
            // Tailwind v4 — @theme inline processing
            (await import('@tailwindcss/postcss')).default,
          ],
        },
      },
      // Shared echarts instance strategy for ECharts extension packages.
      //
      // Problem: esbuild co-bundles echarts-for-react, echarts-wordcloud, and
      // echarts-extension-gmap into one build, CJS-wrapping each with private
      // init_XXX initializer functions. When code-split, cross-chunk init_XXX
      // references are incomplete → `ReferenceError: init_Component is not defined`.
      //
      // Also: echarts-wordcloud + echarts-extension-gmap import 'echarts/lib/echarts'
      // while echarts-for-react uses 'echarts' (dist) → two different echarts instances
      // → wordCloud series registered on the wrong instance → "Unknown series wordCloud".
      //
      // Fix:
      //   1. `include: ['echarts']` — standalone pre-bundled echarts chunk
      //   2. `external: ['echarts']` — every esbuild dep bundle imports echarts from
      //      that chunk; no inline CJS wrapping of echarts → no init_XXX cross-chunk issues
      //   3. `exclude: [wordcloud, gmap]` — serve via Vite's Rollup pipeline where the
      //      alias `echarts/lib/echarts → echarts` redirects to the standalone chunk;
      //      fast-deep-equal in echarts-for-react is incompatible with Rollup exclusion,
      //      so echarts-for-react stays in esbuild (not excluded)
      //   4. echarts-graph-modularity is CJS (module.exports = require('./src/main'))
      //      so it MUST be pre-bundled by esbuild (cannot be excluded). With echarts
      //      external, esbuild emits a static ESM import for echarts → no init_XXX.
      optimizeDeps: {
        include: ['echarts'],
        // Wordcloud + gmap are ESM and use 'echarts/lib/echarts'. Excluding them sends
        // them through Vite's Rollup pipeline where the alias below redirects to the
        // pre-bundled echarts chunk. Do NOT exclude echarts-for-react (CJS dep
        // fast-deep-equal breaks in Rollup) or echarts-graph-modularity (CJS require).
        exclude: ['echarts-wordcloud', 'echarts-extension-gmap'],
        esbuildOptions: {
          external: ['echarts'],
        },
      },
      resolve: {
        // Force a single copy of React — designer/node_modules has its own
        // react + react-dom, which creates two React instances. Hooks called in the
        // library components would be owned by a different React than Storybook's
        // renderer, causing a silent "Invalid hook call" crash that leaves the
        // preview iframe stuck and the manager spinning forever.
        dedupe: ['react', 'react-dom', 'react-dom/client'],
        alias: [
          // echarts-wordcloud + echarts-extension-gmap import from 'echarts/lib/echarts'.
          // echarts-graph-modularity/src/main imports from 'echarts/core'.
          // Both are source-level aliases for the main echarts bundle — redirect them
          // to 'echarts' so all extension packages share the same pre-bundled instance.
          { find: 'echarts/lib/echarts', replacement: 'echarts' },
          { find: 'echarts/core', replacement: 'echarts' },
          // agent-context: source lives in src/agent/, not src/agent-context/ — must precede the generic regex
          { find: '@roboborealis/components/agent-context', replacement: `${libRoot}/src/agent/index.ts` },
          // Public subpath aliases — resolve @roboborealis/components/<subpath> to barrel files
          // Must come FIRST for highest specificity
          { find: /^@roboborealis\/components\/(.*)/, replacement: `${libRoot}/src/$1/index.ts` },
          // Library src paths — must be declared BEFORE the catch-all '@' alias
          // so that '@/lib/utils' → src/lib/utils (not designer/lib/utils)
          // when used from within library source files in ../../src/
          { find: /^@\/lib\/(.*)/, replacement: `${libRoot}/src/lib/$1` },
          { find: /^@\/core\/(.*)/, replacement: `${libRoot}/src/core/$1` },
          { find: /^@\/icons\/(.*)/, replacement: `${libRoot}/src/icons/$1` },
          { find: /^@\/navigation\/(.*)/, replacement: `${libRoot}/src/navigation/$1` },
          { find: /^@\/tables\/(.*)/, replacement: `${libRoot}/src/tables/$1` },
          { find: /^@\/feedback\/(.*)/, replacement: `${libRoot}/src/feedback/$1` },
          { find: /^@\/layout\/(.*)/, replacement: `${libRoot}/src/layout/$1` },
          { find: /^@\/forms\/(.*)/, replacement: `${libRoot}/src/forms/$1` },
          { find: /^@\/charts\/(.*)/, replacement: `${libRoot}/src/charts/$1` },
          { find: /^@\/editor\/(.*)/, replacement: `${libRoot}/src/editor/$1` },
          { find: /^@\/visualizations\/(.*)/, replacement: `${libRoot}/src/visualizations/$1` },
          { find: /^@\/flags\/(.*)/, replacement: `${libRoot}/src/flags/$1` },
          { find: /^@\/brand\/(.*)/, replacement: `${libRoot}/src/brand/$1` },
          { find: /^@\/tokens\/(.*)/, replacement: `${libRoot}/src/tokens/$1` },
          { find: /^@\/foundation\/(.*)/, replacement: `${libRoot}/src/foundation/$1` },
          { find: /^@\/showcase\/(.*)/, replacement: `${libRoot}/src/showcase/$1` },
          { find: /^@\/types\/(.*)/, replacement: `${libRoot}/src/types/$1` },
          { find: /^@\/animations\/(.*)/, replacement: `${libRoot}/src/animations/$1` },
          { find: '@/animations', replacement: `${libRoot}/src/animations/index.ts` },
          // Designer-app catch-all: @/ → designer/ for app-level imports
          { find: '@', replacement: path.resolve(__dirname, '..') },
        ],
      },
    });
  },
};

export default config;
