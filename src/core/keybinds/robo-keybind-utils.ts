import { isKeyHotkey } from 'is-hotkey';

import type { KeybindCombo } from './robo-keybind-types';

const MODIFIER_ORDER = ['ctrl', 'alt', 'shift', 'mod'] as const;

const DISPLAY_KEY_NAMES: Record<string, string> = {
  ' ': 'Space',
  space: 'Space',
  arrowup: '↑',
  arrowdown: '↓',
  arrowleft: '←',
  arrowright: '→',
  escape: 'Esc',
  enter: '↵',
};

const DISPLAY_MODIFIER_NAMES_MAC: Record<string, string> = {
  mod: '⌘',
  ctrl: 'Ctrl',
  alt: '⌥',
  shift: '⇧',
};

const DISPLAY_MODIFIER_NAMES_OTHER: Record<string, string> = {
  mod: 'Ctrl',
  ctrl: 'Ctrl',
  alt: 'Alt',
  shift: 'Shift',
};

/** True on macOS/iOS — used to decide whether the portable `mod` modifier
 *  displays as ⌘ or Ctrl, and whether a captured Meta/Ctrl key normalizes to
 *  `mod`. SSR-safe (returns `false` when `navigator` is unavailable). */
export function isMac(): boolean {
  if (typeof navigator === 'undefined') return false;
  const platform = navigator.platform || navigator.userAgent || '';
  return /Mac|iPhone|iPod|iPad/i.test(platform);
}

function normalizeKeyName(key: string): string {
  if (key === ' ') return 'space';
  return key.toLowerCase();
}

/**
 * Builds a canonical combo string from a live keydown event, for use by
 * `RoboKeybindRecorder` when capturing a new binding. The platform's primary
 * modifier (Cmd on Mac, Ctrl elsewhere) normalizes to the portable `mod`
 * modifier so a combo recorded on one platform still resolves correctly on
 * another.
 */
export function normalizeKeyboardEvent(event: KeyboardEvent): KeybindCombo {
  const mac = isMac();
  const usedMod = mac ? event.metaKey : event.ctrlKey;
  const parts: string[] = [];
  if (event.ctrlKey && !usedMod) parts.push('ctrl');
  if (event.altKey) parts.push('alt');
  if (event.shiftKey) parts.push('shift');
  if (usedMod) parts.push('mod');

  const ordered = MODIFIER_ORDER.filter((modifier) => parts.includes(modifier));
  return [...ordered, normalizeKeyName(event.key)].join('+');
}

/**
 * Matches a canonical combo string against a live keydown event. Delegates
 * to `is-hotkey`'s `isKeyHotkey` — already a dependency (its default export
 * is used elsewhere by the rich-text editor's formatting shortcuts,
 * `src/editor/robo-rich-text-editor.tsx`) — which resolves `mod` to `metaKey`
 * on Mac / `ctrlKey` elsewhere. Uses the `byKey` matching mode (`event.key`)
 * rather than the default export's legacy `event.which`/`keyCode` matching:
 * real browsers populate `which` for physical keypresses so the default
 * export works in production, but `event.key` is the modern, non-deprecated
 * property and behaves identically in both real browsers and jsdom-based
 * tests, which don't synthesize `which` from a `key` init option.
 */
export function comboMatchesEvent(combo: KeybindCombo, event: KeyboardEvent): boolean {
  return isKeyHotkey(combo, event);
}

/**
 * Splits a canonical combo into display segments, one per key, for feeding
 * each into its own `RoboKbd` (e.g. `"mod+shift+k"` → `['⌘', '⇧', 'K']` on
 * Mac, `['Ctrl', 'Shift', 'K']` elsewhere).
 */
export function formatComboForDisplay(combo: KeybindCombo): string[] {
  const names = isMac() ? DISPLAY_MODIFIER_NAMES_MAC : DISPLAY_MODIFIER_NAMES_OTHER;
  return combo.split('+').map((segment) => {
    if (segment in names) return names[segment]!;
    if (segment in DISPLAY_KEY_NAMES) return DISPLAY_KEY_NAMES[segment]!;
    return segment.length === 1 ? segment.toUpperCase() : segment;
  });
}
