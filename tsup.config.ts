import { defineConfig, type Options } from 'tsup';

// Component entries — banner-injected "use client" (esbuild strips the
// per-file directives when bundling, so the directive is re-applied at the
// chunk level; every one of these entries contains interactive components).
//
// Split into batches run as SEPARATE `tsup` process invocations (see
// package.json's `build:lib`, which chains `TSUP_BATCH=1 tsup && ...`) —
// building all 16 subpaths' ESM+CJS+non-incremental DTS in one process
// peaks well past what our CI runner's fixed (non-overridable) pod memory
// allotment allows. A single `defineConfig([...])` array does NOT give this
// isolation: tsup runs array entries sequentially within the same process,
// so peak memory is still the sum, not the max. Separate process
// invocations are the only way to actually free memory between batches.
// Batch groupings are arbitrary — just roughly-equal-sized buckets — not
// grouped by any dependency relationship.
const CLIENT_ENTRY_BATCHES: Record<string, Record<string, string>> = {
  '1': {
    core: 'src/core/index.ts',
    forms: 'src/forms/index.ts',
    navigation: 'src/navigation/index.ts',
    tables: 'src/tables/index.ts',
    feedback: 'src/feedback/index.ts',
    layout: 'src/layout/index.ts',
  },
  '2': {
    charts: 'src/charts/index.ts',
    editor: 'src/editor/index.ts',
    icons: 'src/icons/index.ts',
    flags: 'src/flags/index.ts',
  },
  '3': {
    visualizations: 'src/visualizations/index.ts',
    templates: 'src/templates/index.ts',
    animations: 'src/animations/index.ts',
    router: 'src/router/index.ts',
  },
};

// Data/knowledge entries — NO "use client": these must stay importable from
// React Server Components and Node tooling (agent-context is read server-side).
const SERVER_SAFE_ENTRIES = {
  agent: 'src/agent/index.ts',
  tokens: 'src/tokens/index.ts',
};

// TSUP_BATCH selects which slice this process invocation builds: '1'|'2'|'3'
// for a CLIENT_ENTRY_BATCHES group, 'server' for SERVER_SAFE_ENTRIES, or
// unset to build everything in one process (only used by ad hoc/manual
// `npx tsup` runs — `npm run build:lib` always sets it).
const batch = process.env.TSUP_BATCH;
const clientEntries = batch && batch !== 'server'
  ? CLIENT_ENTRY_BATCHES[batch]
  : Object.assign({}, ...Object.values(CLIENT_ENTRY_BATCHES));
// Only the very first invocation in the chain should wipe dist/ — every
// later batch (2, 3, server) must append to it, not clean it out from
// under the previous batch's output.
const isFirstInvocation = !batch || batch === '1';

const shared: Options = {
  format: ['esm', 'cjs'],
  dts: {
    compilerOptions: {
      incremental: false,
      ignoreDeprecations: '6.0',
    },
  },
  sourcemap: true,
  external: [
    'react',
    'react-dom',
    /^@radix-ui\//,
    'radix-ui',
    'slate',
    'slate-react',
    'slate-history',
    'react-hook-form',
    '@hookform/resolvers',
    '@tanstack/react-table',
    '@tanstack/react-virtual',
    'zod',
    'react-day-picker',
    'date-fns',
    'echarts',
    'echarts-for-react',
    'echarts-wordcloud',
    'echarts-liquidfill',
    'echarts-extension-gmap',
    'motion',
    '@tanstack/react-router',
  ],
  esbuildOptions(options) {
    options.alias = { '@': './src' };
    // Inline SVG and PNG assets as base64 data URIs — self-contained, no external URLs
    options.loader = {
      ...options.loader,
      '.svg': 'dataurl',
      '.png': 'dataurl',
    };
  },
  outDir: 'dist',
  splitting: false,
  outExtension({ format }) {
    return { js: format === 'esm' ? '.mjs' : '.cjs' };
  },
};

const clientConfig: Options = {
  ...shared,
  entry: clientEntries,
  banner: { js: '"use client";' },
  clean: isFirstInvocation,
};

const serverConfig: Options = {
  ...shared,
  entry: SERVER_SAFE_ENTRIES,
  clean: false, // never first — either a later batch, or client always ran first above
};

export default defineConfig(
  batch === 'server' ? [serverConfig] : batch ? [clientConfig] : [clientConfig, serverConfig]
);
