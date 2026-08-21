import { defineConfig } from 'vitest/config';

import baseConfig from './vitest.config';

// the story smoke runs from here rather than inside `test-coverage`.
//
// It mounts one story per file and has caught three real defects, so it earns its
// place in the pipeline. But it also failed on main twice in one day, both times
// after passing on the merge request, and both times skipping the deploy. Neither
// failure was a broken story: the shared runner starves this job of CPU when
// several jobs run at once (vitest.config.ts documents that at length), and
// `robo-flag-select` took 52s there against 0.3s locally.
//
// So: its own job, its own generous ceiling, and `allow_failure` in
// CI while it burns in. Coverage is off — story mounting executes
// code without asserting anything about it, and counting it inflated the
// thresholds by ~10 points in an earlier change for no real gain in confidence.
//
// NOT `mergeConfig`: that concatenates arrays, so the base `include` and the base
// `exclude` (which excludes this very file) both survive, and the result runs the
// whole suite except the smoke — the exact opposite of the intent.
export default defineConfig({
  resolve: baseConfig.resolve,
  test: {
    ...baseConfig.test,
    include: ['src/stories-smoke.test.tsx'],
    exclude: ['**/node_modules/**', '**/dist/**'],
    // 6x the base 20s. Absolute rather than proportional: the failure mode is a
    // starved container, so the ceiling only has to outlast a stall.
    testTimeout: 120_000,
    coverage: { enabled: false },
    reporters: process.env.CI ? ['default', 'junit'] : ['default'],
    outputFile: { junit: './junit-story-smoke.xml' },
  },
});
