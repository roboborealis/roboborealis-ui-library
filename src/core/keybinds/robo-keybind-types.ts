/** Canonical shortcut string, e.g. `"mod+/"`, `"mod+shift+k"`, `"l"`.
 *  `mod` is a virtual modifier resolved at match time to `metaKey` on Mac /
 *  `ctrlKey` elsewhere, so a persisted combo stays portable across platforms. */
export type KeybindCombo = string;

/** Metadata a component registers with `RoboKeybindProvider` via
 *  `useKeybind`/`useRegisterKeybind`. */
export interface KeybindAction {
  /** Stable, namespaced id, e.g. `"robo.quick-panel.toggle"`. */
  id: string;
  /** Human-readable label shown in the Settings keybinds list. */
  label: string;
  /** Combo used when the user hasn't overridden this action. */
  defaultCombo: KeybindCombo;
  /**
   * Let this action's combo fire even while focus is in an `<input>`,
   * `<textarea>`, or `contenteditable` element. Default: `false` — required
   * for any single-letter or unmodified shortcut, since otherwise typing
   * ordinary text anywhere in the app would trigger it.
   */
  allowInEditableFields?: boolean;
}

/** A `KeybindAction` merged with its current effective combo (override, if
 *  any, else the default) — what `list()` returns for a Settings UI. */
export interface RegisteredKeybind extends KeybindAction {
  combo: KeybindCombo;
  isCustomized: boolean;
}
