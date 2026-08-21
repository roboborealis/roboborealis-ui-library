import { composeStories } from '@storybook/react';
import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

// a story that cannot load should fail the pipeline, not the website.
//
// COVERS: every story file is imported (a file that throws at module scope takes
// its whole page down in Storybook), every story in it is composed, and the first
// story of each file is rendered.
//
// DOES NOT COVER: rendering every story. Rendering one story per file keeps this
// smoke test fast; interaction and visual coverage stay with the per-component
// tests either way.

const storyModules = import.meta.glob('./**/*.stories.tsx', { eager: true });

afterEach(cleanup);

describe('every story file loads, composes, and mounts', () => {
  const paths = Object.keys(storyModules).sort();

  // Guards the glob: a path change that quietly matched nothing would turn this
  // whole suite into a no-op that still reports green.
  it('finds the full story catalogue', () => {
    expect(paths.length).toBeGreaterThan(150);
  });

  for (const path of paths) {
    // Composing happens outside `it`, so a file that fails to compose fails
    // collection loudly rather than being reported as one skipped test.
    const stories = Object.entries(
      composeStories(storyModules[path] as Parameters<typeof composeStories>[0]),
    );
    if (stories.length === 0) continue;

    const [name, Story] = stories[0];
    it(`${path} — ${name}`, () => {
      expect(render(<Story />).container).toBeTruthy();
    });
  }
});
