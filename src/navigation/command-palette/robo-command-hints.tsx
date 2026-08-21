import * as React from 'react';

import { cn } from '@/lib/utils';
import { RoboKbd } from '@/core/kbd/robo-kbd';

// ---------------------------------------------------------------------------
// RoboCommandHints — keyboard hint row (key + label pairs), extracted from
// RoboCommandPalette's footer so the same hint row can be reused wherever a
// keyboard-driven overlay needs to remind users of its navigation keys.
// ---------------------------------------------------------------------------

export interface CommandHint {
  /** Glyph(s) rendered inside a RoboKbd, e.g. '↑↓', '↵', 'esc' */
  keys: string;
  /** Label describing what the key(s) do, e.g. 'navigate' */
  label: string;
}

export const DEFAULT_COMMAND_HINTS: CommandHint[] = [
  { keys: '↑↓', label: 'navigate' },
  { keys: '↵', label: 'select' },
  { keys: 'esc', label: 'close' },
];

export interface RoboCommandHintsProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Hint entries to render, left to right. Defaults to the standard navigate/select/close triad. */
  hints?: CommandHint[];
  ref?: React.Ref<HTMLDivElement>;
}

/**
 * RoboCommandHints — footer row of key + label pairs for keyboard-driven overlays.
 *
 * @example
 * ```tsx
 * <RoboCommandHints />
 * <RoboCommandHints hints={[...DEFAULT_COMMAND_HINTS, { keys: '⇥', label: 'next field' }]} />
 * ```
 */
function RoboCommandHints({
  className,
  hints = DEFAULT_COMMAND_HINTS,
  ref,
  ...props
}: RoboCommandHintsProps) {
  return (
    <div
      ref={ref}
      data-slot='command-hints'
      aria-hidden='true'
      className={cn(
        'flex items-center gap-3 border-t border-[var(--border)] px-3 py-2',
        'text-xs text-[var(--muted-foreground)]',
        className,
      )}
      {...props}
    >
      {hints.map((hint) => (
        <span key={hint.label} className='flex items-center gap-1'>
          <RoboKbd>{hint.keys}</RoboKbd>
          {hint.label}
        </span>
      ))}
    </div>
  );
}
RoboCommandHints.displayName = 'RoboCommandHints';

export { RoboCommandHints };
