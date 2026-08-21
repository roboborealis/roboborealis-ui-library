'use client';

import * as React from 'react';
import { cva } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import { RoboKbd } from '../kbd/robo-kbd';
import { normalizeKeyboardEvent, formatComboForDisplay } from '../keybinds/robo-keybind-utils';
import type { KeybindCombo } from '../keybinds/robo-keybind-types';

const keybindRecorderVariants = cva(
  [
    'inline-flex items-center gap-1 rounded-[var(--radius)] border px-2 py-1',
    'text-sm transition-colors duration-[var(--duration-fast)]',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-1',
  ].join(' '),
  {
    variants: {
      state: {
        idle: 'border-[var(--border)] bg-[var(--background)] hover:bg-[var(--accent)]/50',
        listening: 'border-[var(--ring)] bg-[var(--accent)]/30',
      },
    },
    defaultVariants: { state: 'idle' },
  }
);

const IGNORED_KEYS = ['Control', 'Meta', 'Alt', 'Shift'];

export interface RoboKeybindRecorderProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  /** Current combo, displayed via `RoboKbd` segments when idle. */
  combo: KeybindCombo;
  /** Fires with the normalized combo once a new key combination is captured. */
  onChange: (combo: KeybindCombo) => void;
  /** Fires when the user cancels (Escape or blur) without committing. */
  onCancel?: () => void;
  /**
   * Label of another action already bound to the pending combo — renders an
   * inline warning instead of silently allowing the swap. Purely
   * presentational; the caller (e.g. a Settings keybinds list) computes this
   * by comparing against every other registered combo.
   */
  conflictWith?: string;
  ref?: React.Ref<HTMLButtonElement>;
}

/**
 * RoboKeybindRecorder — "click, then press keys" control for reassigning a
 * keyboard shortcut. Idle state shows the current combo via `RoboKbd`;
 * clicking (or focusing + Space/Enter) enters a listening state that
 * captures the next non-modifier keydown, normalizes it, and calls
 * `onChange`. Escape or blurring away cancels without committing.
 *
 * @example
 * ```tsx
 * <RoboKeybindRecorder
 *   combo={keybind.combo}
 *   onChange={(next) => setCombo(keybind.id, next)}
 *   conflictWith={conflictingAction?.label}
 * />
 * ```
 */
function RoboKeybindRecorder({
  className,
  combo,
  onChange,
  onCancel,
  conflictWith,
  ref,
  ...props
}: RoboKeybindRecorderProps) {
  const [listening, setListening] = React.useState(false);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (!listening) return;
    event.preventDefault();
    if (event.key === 'Escape') {
      setListening(false);
      onCancel?.();
      return;
    }
    if (IGNORED_KEYS.includes(event.key)) return;
    const next = normalizeKeyboardEvent(event.nativeEvent);
    setListening(false);
    onChange(next);
  };

  const handleBlur = () => {
    if (!listening) return;
    setListening(false);
    onCancel?.();
  };

  const idleLabel = `Keyboard shortcut ${formatComboForDisplay(combo).join(' ')} — press to change`;

  return (
    <button
      ref={ref}
      type='button'
      data-slot='keybind-recorder'
      aria-live='polite'
      aria-label={listening ? 'Listening for new shortcut — press Escape to cancel' : idleLabel}
      className={cn(keybindRecorderVariants({ state: listening ? 'listening' : 'idle' }), className)}
      onClick={() => setListening(true)}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      {...props}
    >
      {listening ? (
        <span className='text-[var(--muted-foreground)]'>Press keys…</span>
      ) : (
        formatComboForDisplay(combo).map((segment, i) => <RoboKbd key={i}>{segment}</RoboKbd>)
      )}
      {conflictWith && !listening && (
        <span role='alert' className='ml-1 text-xs text-[var(--destructive)]'>
          Already used by {conflictWith}
        </span>
      )}
    </button>
  );
}
RoboKeybindRecorder.displayName = 'RoboKeybindRecorder';

export { RoboKeybindRecorder, keybindRecorderVariants };
