# @roboborealis/capture

Playwright-based CLI for capturing screenshots and video walkthroughs of Storybook stories. Used to generate visual documentation and regression reference images.

## Prerequisites

Storybook must be running before using capture commands.

```bash
npm run storybook  # starts at http://localhost:6006
```

## Usage

```bash
# Single screenshot — capture one story by URL
npm run capture -- --url http://localhost:6006/?path=/story/showcase-patterns-dashboards--dashboard --screenshot

# Script-driven — run a YAML capture script (sequence of actions + screenshot steps)
npm run capture -- --script capture/scripts/my-script.yml

# Capture all — run all YAML scripts in capture/scripts/
npm run capture:all

# Scaffold a new script — generates a starter YAML for a given story URL
npm run capture -- --init --url http://localhost:6006/?path=/story/...
```

## Capture Scripts

Scripts live in `capture/scripts/` as YAML files. Use `--init` to scaffold a new one.

Each script specifies a story URL, optional interaction steps (clicks, types, waits), and a screenshot step. Run `npm run capture -- --script <path>` to execute it.

## Output

Screenshots are saved to `~/Downloads/` as `<story-slug>-<date>.png`.
