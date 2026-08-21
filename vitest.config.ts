import * as path from 'path';
import { defineConfig } from 'vitest/config';

const r = (p: string) => path.resolve(__dirname, p);

export default defineConfig({
  resolve: {
    alias: [
      // Public subpath imports resolve to source barrels
      { find: /^@roboborealis\/components\/(.*)$/, replacement: r('src') + '/$1/index.ts' },
      // ECharts family — lightweight mocks; the real packages need canvas,
      // which jsdom does not provide
      { find: /^echarts-for-react$/, replacement: r('__mocks__/echarts-for-react.tsx') },
      { find: /^echarts\/core$/, replacement: r('__mocks__/echarts-core.ts') },
      { find: /^echarts-wordcloud$/, replacement: r('__mocks__/echarts-extension.ts') },
      { find: /^echarts-liquidfill$/, replacement: r('__mocks__/echarts-extension.ts') },
      { find: /^echarts-extension-gmap$/, replacement: r('__mocks__/echarts-extension.ts') },
      { find: /^echarts-graph-modularity$/, replacement: r('__mocks__/echarts-extension.ts') },
      { find: /^echarts-stat$/, replacement: r('__mocks__/echarts-extension.ts') },
      // Motion — render animated components transparently in jsdom
      { find: /^motion\/react$/, replacement: r('__mocks__/motion/react.tsx') },
      // Internal alias (matches tsconfig paths)
      { find: /^@\/(.*)$/, replacement: r('src') + '/$1' },
    ],
  },
  test: {
    environment: 'jsdom',
    globals: true,
    // `.storybook` is included so the stale-chunk recovery's loop guard is
    // covered — an unbounded reload loop there would be worse than the bug it
    // recovers from, and nothing else in the pipeline executes that file.
    include: ['src/**/*.test.{ts,tsx}', 'designer/.storybook/**/*.test.ts'],
    // The story smoke is excluded here and runs from vitest.smoke.config.ts as its
    // own CI job. an earlier change: it added ~240 renders to `test-coverage`, which this
    // file already documents as starved of CPU on the shared runner, and it then
    // failed on main twice — each time skipping the deploy. It stays out of the
    // blocking gate until it has burned in. Note `exclude` wins over an explicit
    // path filter, which is why the smoke needs its own config rather than a
    // `vitest run <path>` invocation.
    exclude: ['**/node_modules/**', '**/dist/**', 'src/stories-smoke.test.tsx'],
    setupFiles: ['./vitest.setup.ts'],
    // Caps worker count to match the CI container's actual CPU request/limit
    // (see the CI test-coverage job). Without this, Node sizes the
    // pool off the detected core count, which can be far higher than what the
    // container is actually allotted — spawning more workers than usable cores
    // burns time on scheduling/context-switch overhead instead of running
    // tests. Local runs (14+ cores, no container limits) still benefit from
    // capping to a sane ceiling.
    //
    // Vitest 4 removed `poolOptions`; `maxWorkers` is the top-level replacement
    // (there is no `minWorkers` — only `maxWorkers` affects the pool size).
    maxWorkers: 4,
    // Raise the per-test timeout well above Vitest's 5s default. The a11y
    // suites run jsdom + axe-core, which is CPU-heavy; on the shared CI runner
    // (throttled to `maxWorkers` cores, and often contended) a single axe
    // assertion routinely crosses 5s and fails as a timeout even though it
    // would pass — a different a11y test flakes each run. Locally these finish
    // in well under a second, so a 20s ceiling costs nothing on green runs and
    // only affects genuinely stuck tests (which the job-level timeout still
    // catches). This is the recurring `test-coverage` flake source.
    // A past change raised this from 20s to 45s. 20s was chosen on the reasoning that it
    // "costs nothing on green runs and only affects genuinely stuck tests", which
    // turned out not to hold: measured overruns of 23.3s (an axe assertion) and
    // 52s (a story render) on CI, against well under a second for both locally.
    // Those are starved containers, not stuck tests. The job-level timeout is what
    // catches genuinely stuck tests, so raising this only trades red-run wall-clock
    // for not failing work that would have passed.
    testTimeout: 45_000,
    // Never fake microtasks (queueMicrotask/nextTick) — user-event awaits them
    // internally and hangs if they are stubbed (Jest's "modern" timers never
    // faked them either).
    fakeTimers: {
      toFake: [
        'setTimeout',
        'clearTimeout',
        'setInterval',
        'clearInterval',
        'setImmediate',
        'clearImmediate',
        'Date',
        'requestAnimationFrame',
        'cancelAnimationFrame',
        'performance',
      ],
    },
    reporters: process.env.CI ? ['default', 'junit'] : ['default'],
    outputFile: { junit: './junit.xml' },
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        '**/*.stories.{ts,tsx}',
        '**/*.d.ts',
        '**/index.ts',
        // Test data generators — not production logic
        'src/visualizations/mock-data/**',
      ],
      reportsDirectory: 'coverage',
      reporter: ['text', 'lcov', 'html', 'cobertura'],
      // Ratchet: keep ~2 points below actual, raise after each MR that adds
      // tests (target 75 — see docs/plans/plan-vitest-coverage-thresholds.md).
      // Actual at migration (v8 provider): L 69.2 / F 65.6 / B 64.7 / S 67.1.
      // A past change raised these to 77/74/71/75 on the back of the story smoke
      // mounting one story per file. A past change moved that smoke into its own job,
      // so those ~10 points are gone again — and they were never assertion
      // coverage in the first place, only executed lines. Back to the honest
      // pre-smoke floor. Raise these when tests that actually assert something
      // are added.
      thresholds: {
        lines: 67,
        functions: 63,
        branches: 62,
        statements: 65,
      },
    },
  },
});
