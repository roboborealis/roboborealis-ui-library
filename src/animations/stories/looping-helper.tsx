import * as React from 'react';

/**
 * Remounts children on an interval so entrance animations replay in Storybook.
 * Includes a pause/resume button positioned in the top-right corner.
 */
export function Looping({
  children,
  interval = 2500,
}: {
  children: React.ReactNode;
  interval?: number;
}) {
  const [cycle, setCycle] = React.useState(0);
  const [paused, setPaused] = React.useState(false);

  React.useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setCycle((c) => c + 1), interval);
    return () => clearInterval(id);
  }, [paused, interval]);

  return (
    <div className='relative'>
      <React.Fragment key={cycle}>{children}</React.Fragment>
      <button
        onClick={() => setPaused((p) => !p)}
        className='absolute top-2 right-2 px-2 py-1 text-xs rounded bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--accent)] transition-colors'
        aria-label={paused ? 'Resume animation loop' : 'Pause animation loop'}
      >
        {paused ? '▶ Resume' : '⏸ Pause'}
      </button>
    </div>
  );
}
