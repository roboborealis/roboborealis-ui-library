import * as React from 'react';
import { Pin } from 'lucide-react';

import type { StorageAdapter } from '@/core/storage-adapter';

// ---------------------------------------------------------------------------
// Shared pin/hover/gesture logic for edge-docked "peek" panels (RoboPeekSheet
// and RoboQuickPanel). Previously duplicated byte-for-byte between the two
// (each with a comment asking future maintainers to "keep the two in sync")
// — centralized here so a gesture change only has to be made in one place.
// (RoboSidebar briefly used this too, for its own hover-preview overlay;
// that usage was removed when the sidebar moved to a plain click-to-toggle
// model.)
// ---------------------------------------------------------------------------

/** Elements a body double-click shouldn't also pin the panel for — they
 * already have their own click behavior (a checkbox toggling, a link
 * navigating, etc.). */
export const PIN_ON_CLICK_SKIP_SELECTOR =
  'button, a[href], input, select, textarea, label, [role="button"], [contenteditable="true"]';

export interface UsePeekPinOptions {
  /** Controlled pinned state. Omit for uncontrolled (persisted) behavior. */
  pinned?: boolean;
  /** Fires whenever pinned state changes, controlled or not. */
  onPinnedChange?: (pinned: boolean) => void;
  storageAdapter?: StorageAdapter;
  /** Only read/written when `storageAdapter` is provided. Default: `'robo-peek-pin'`. */
  storageKey?: string;
  /** Uncontrolled initial value used only when nothing is persisted yet under
   * `storageKey`. Default: `false`. */
  defaultPinned?: boolean;
  /** Icon shown while hovering but not pinned. Omit if the consumer doesn't
   * use the icon-precedence output (e.g. RoboSidebar has its own icon logic). */
  icon?: React.ReactNode;
  /** The chevron/default icon shown at rest and once pinned falls away.
   * Only needed if the consumer reads `handleIcon`/`iconKey`. */
  DefaultIcon?: React.ComponentType<{ className?: string }>;
  /** An extra boolean that should also force `expanded = true`, independent
   * of hover/pin (e.g. RoboQuickPanel's external `open` signal). */
  extraExpanded?: boolean;
}

export interface UsePeekPinResult {
  pinned: boolean;
  setPinned: (next: boolean) => void;
  hovering: boolean;
  expanded: boolean;
  hoverHandlers: { onMouseEnter: () => void; onMouseLeave: () => void };
  /** Spread onto the body/content wrapper's `onDoubleClick`. Already
   * incorporates the skip-selector and the "already pinned" short-circuit. */
  handleBodyDoubleClick: (e: React.MouseEvent<HTMLElement>) => void;
  iconKey: 'pinned' | 'custom' | 'chevron';
  handleIcon: React.ReactNode;
}

/**
 * usePeekPin — pinned/hovering/expanded state plus the "double-click the body
 * to pin" gesture shared by every edge-docked peek panel in this library.
 *
 * The panel's own explicit handle/toggle button should keep calling
 * `setPinned(!pinned)` directly on a plain single click — that's the
 * deliberate, always-available keyboard/touch affordance, independent of
 * this hook's ambient double-click-the-body gesture.
 */
export function usePeekPin({
  pinned: pinnedProp,
  onPinnedChange,
  storageAdapter,
  storageKey = 'robo-peek-pin',
  defaultPinned = false,
  icon,
  DefaultIcon,
  extraExpanded = false,
}: UsePeekPinOptions): UsePeekPinResult {
  const isControlled = pinnedProp !== undefined;
  const [internalPinned, setInternalPinned] = React.useState<boolean>(() => {
    if (!storageAdapter) return defaultPinned;
    const stored = storageAdapter.get(storageKey);
    return stored === null ? defaultPinned : stored === 'true';
  });
  const pinned = pinnedProp ?? internalPinned;

  const setPinned = React.useCallback(
    (next: boolean) => {
      if (!isControlled) setInternalPinned(next);
      storageAdapter?.set(storageKey, String(next));
      onPinnedChange?.(next);
    },
    [isControlled, onPinnedChange, storageAdapter, storageKey],
  );

  const [hovering, setHovering] = React.useState(false);
  const expanded = pinned || hovering || extraExpanded;

  const hoverHandlers = React.useMemo(
    () => ({
      onMouseEnter: () => setHovering(true),
      onMouseLeave: () => setHovering(false),
    }),
    [],
  );

  const handleBodyDoubleClick = React.useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (pinned) return;
      if ((e.target as HTMLElement).closest(PIN_ON_CLICK_SKIP_SELECTOR)) return;
      setPinned(true);
    },
    [pinned, setPinned],
  );

  // Chevron (collapsed-at-rest) and Pin (pinned) always win over a custom
  // `icon` — the custom icon, if any, only shows while hovering but not yet
  // pinned. Meaningless (and unused) for consumers that don't pass `icon`.
  const iconKey: UsePeekPinResult['iconKey'] = pinned ? 'pinned' : hovering && icon ? 'custom' : 'chevron';
  const handleIcon =
    iconKey === 'pinned'
      ? React.createElement(Pin, { className: 'h-3.5 w-3.5' })
      : iconKey === 'custom'
        ? icon
        : DefaultIcon
          ? React.createElement(DefaultIcon, { className: 'h-3.5 w-3.5' })
          : null;

  return { pinned, setPinned, hovering, expanded, hoverHandlers, handleBodyDoubleClick, iconKey, handleIcon };
}
