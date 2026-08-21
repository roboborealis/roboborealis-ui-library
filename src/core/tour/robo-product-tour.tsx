'use client';

import * as React from 'react';
import { Joyride, EVENTS, type Step, type EventData, type Props as JoyrideProps, type Options } from 'react-joyride';
import { useReducedMotion } from 'motion/react';

import { useTour } from './robo-tour-provider';
import { ensureSafePlacement } from './robo-tour-placement';

/** A single tour step — re-exported `react-joyride` `Step` so consumers don't
 *  need a direct dependency on `react-joyride` to author steps. */
export type RoboTourStep = Step;

const THEMED_DEFAULTS: Partial<Options> = {
  primaryColor: 'var(--primary)',
  textColor: 'var(--foreground)',
  backgroundColor: 'var(--popover)',
  arrowColor: 'var(--popover)',
  overlayColor: 'rgba(0, 0, 0, 0.5)', // matches RoboDialog's scrim (bg-black/50)
  zIndex: 10000, // always above floating panels, map controls, and app chrome
  buttons: ['back', 'skip', 'primary'],
};

export interface RoboProductTourProps extends Omit<JoyrideProps, 'run' | 'steps' | 'onEvent'> {
  /** Stable, namespaced id, e.g. `'map-dashboard-starter'`. Also the storage
   *  key suffix (`robo-tour:${id}`) and the id Settings restarts by. */
  id: string;
  /** Human-readable label shown in the Settings tour list. */
  label: string;
  steps: RoboTourStep[];
  /** Auto-run on first mount if this tour hasn't been completed yet. Default: `true`. */
  autoStart?: boolean;
  /**
   * Runs before the tour starts — on auto-start AND on every restart from
   * `RoboTourSettingsCard`. Use this to force-expand a collapsed panel,
   * await async content, or otherwise get the DOM into
   * the state the steps below assume. After it resolves, any step whose
   * `target` still doesn't resolve via `document.querySelector` is skipped
   * rather than left to hang.
   */
  onBeforeStart?: () => void | Promise<void>;
}

/**
 * RoboProductTour — themed `react-joyride` wrapper backed by `useTour`.
 * Auto-runs once per tour `id` (persisted via `RoboTourProvider`), skips
 * steps whose target isn't in the DOM after `onBeforeStart` resolves, and
 * marks the tour completed on finish or skip. Any additional `react-joyride`
 * prop (e.g. `spotlightPadding`, `disableOverlayClose`, a custom
 * `tooltipComponent`) passes straight through.
 *
 * Renders nothing during SSR / before the first client-side paint — Joyride
 * reads `document`/`window` directly.
 *
 * Before each run, every step's target is measured against the viewport and
 * its `placement` (explicit or Joyride's `'bottom'` default) is swapped for a
 * side that actually has room, falling back to `'center'` if none does — so
 * a target that spans the full viewport height/width (a sidebar, the main
 * content area) can't push its tooltip off-screen. You can still set
 * `placement` explicitly for a deliberate side; it's only overridden when it
 * wouldn't fit.
 *
 * @example
 * ```tsx
 * <RoboProductTour
 *   id="map-dashboard-starter"
 *   label="Map dashboard tour"
 *   steps={MAP_DASHBOARD_TOUR_STEPS}
 * />
 * ```
 */
function RoboProductTour({
  id,
  label,
  steps,
  autoStart = true,
  onBeforeStart,
  options,
  ...joyrideProps
}: RoboProductTourProps) {
  const { completed, complete, onRestart } = useTour({ id, label });
  const [mounted, setMounted] = React.useState(false);
  const [run, setRun] = React.useState(false);
  const [visibleSteps, setVisibleSteps] = React.useState<RoboTourStep[]>([]);
  const reducedMotion = useReducedMotion();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const prepareAndRun = React.useCallback(async () => {
    await onBeforeStart?.();
    const viewport = { width: window.innerWidth, height: window.innerHeight };
    const nextSteps: RoboTourStep[] = [];
    for (const step of steps) {
      if (typeof step.target === 'string') {
        const element = document.querySelector<HTMLElement>(step.target);
        if (!element) continue; // target not in DOM — skip step rather than hang
        nextSteps.push(ensureSafePlacement(step, element.getBoundingClientRect(), viewport));
      } else if (step.target instanceof HTMLElement) {
        nextSteps.push(ensureSafePlacement(step, step.target.getBoundingClientRect(), viewport));
      } else {
        nextSteps.push(step); // function/ref targets resolve later, inside Joyride itself
      }
    }
    setVisibleSteps(nextSteps);
    setRun(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [steps, onBeforeStart]);

  React.useEffect(() => {
    if (mounted && autoStart && !completed) void prepareAndRun();
    // Only re-run this on the mounted/autoStart/completed transitions that
    // decide WHETHER to auto-start — not on every `prepareAndRun` identity
    // change, which would re-trigger the tour whenever a caller passes an
    // inline (non-memoized) `onBeforeStart`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, autoStart, completed]);

  React.useEffect(() => onRestart(() => void prepareAndRun()), [onRestart, prepareAndRun]);

  const handleEvent = React.useCallback(
    (data: EventData) => {
      if (data.type === EVENTS.TOUR_END) {
        setRun(false);
        complete();
      }
    },
    [complete]
  );

  if (!mounted) return null;

  return (
    <Joyride
      run={run}
      steps={visibleSteps}
      continuous
      scrollToFirstStep={!reducedMotion}
      onEvent={handleEvent}
      options={{ ...THEMED_DEFAULTS, ...options }}
      {...joyrideProps}
    />
  );
}
RoboProductTour.displayName = 'RoboProductTour';

export { RoboProductTour };
