'use client';

import * as React from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { cva } from 'class-variance-authority';
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Pin } from 'lucide-react';

import { cn } from '@/lib/utils';
import { useGlassMode } from '@/core/providers/robo-glass-mode-provider';
import { getPanelSurfaceClasses } from '@/core/glass-surface';
import { type StorageAdapter, createLocalStorageAdapter } from '@/core/storage-adapter';
import { usePeekPin } from '@/core/hooks/use-peek-pin';
import { RoboTooltipProvider, RoboTooltip, RoboTooltipTrigger, RoboTooltipContent } from '@/feedback/tooltip/robo-tooltip';
import { buildPresets } from '../../animations/config/animation-presets';
import { useAnimationTokens } from '../../animations/config/use-animation-tokens';
import { usePanelTransitionMotion } from '../../animations/use-panel-transition-motion';
import type { RoboTransitionVariant } from '../../animations/variants/panel-transitions';

const defaultStorageAdapter = createLocalStorageAdapter();

export const QUICK_PANEL_SIDES = ['top', 'right', 'bottom', 'left'] as const;
export type RoboQuickPanelSide = (typeof QUICK_PANEL_SIDES)[number];

const DEFAULT_ICONS: Record<RoboQuickPanelSide, React.ComponentType<{ className?: string }>> = {
  left: ChevronRight,
  right: ChevronLeft,
  top: ChevronDown,
  bottom: ChevronUp,
};

/** Points the "double-click to pin" tooltip away from the dock edge, into the visible content. */
const TOOLTIP_SIDE: Record<RoboQuickPanelSide, 'left' | 'right' | 'top' | 'bottom'> = {
  left: 'right',
  right: 'left',
  top: 'bottom',
  bottom: 'top',
};

const quickPanelVariants = cva('fixed z-50', {
  variants: {
    side: {
      top: 'inset-x-0 top-0 border-b',
      bottom: 'inset-x-0 bottom-0 border-t',
      left: 'inset-y-0 left-0 border-r',
      right: 'inset-y-0 right-0 border-l',
    },
  },
  defaultVariants: { side: 'right' },
});

const HANDLE_POSITION_CLASSES: Record<RoboQuickPanelSide, string> = {
  top: 'bottom-0 left-0 w-full',
  bottom: 'top-0 left-0 w-full',
  left: 'right-0 top-0 h-full',
  right: 'left-0 top-0 h-full',
};

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

interface RoboQuickPanelContextValue {
  expanded: boolean;
  pinned: boolean;
  setPinned: (next: boolean) => void;
  open: boolean;
  setOpen: (next: boolean) => void;
  activeTab: string | undefined;
  setActiveTab: (next: string) => void;
  side: RoboQuickPanelSide;
}

const RoboQuickPanelContext = React.createContext<RoboQuickPanelContextValue | null>(null);

/**
 * Reads the enclosing `RoboQuickPanel`'s open/pinned/active-tab state — for a
 * custom header control, or to lift `activeTab`/`setActiveTab` into a
 * `RoboTabs` composed inside `RoboQuickPanelBody`. Throws when used outside a
 * `RoboQuickPanel`.
 *
 * @example
 * ```tsx
 * function MyQuickPanelTabs() {
 *   const { activeTab, setActiveTab } = useRoboQuickPanel();
 *   return (
 *     <RoboTabs value={activeTab} onValueChange={setActiveTab}>
 *       ...
 *     </RoboTabs>
 *   );
 * }
 * ```
 */
function useRoboQuickPanel(): RoboQuickPanelContextValue {
  const ctx = React.useContext(RoboQuickPanelContext);
  if (!ctx) {
    throw new Error('useRoboQuickPanel must be used within a RoboQuickPanel');
  }
  return ctx;
}

// ---------------------------------------------------------------------------
// RoboQuickPanel (root)
// ---------------------------------------------------------------------------

export interface RoboQuickPanelProps {
  /** Edge to dock to. Default: `'right'`. */
  side?: RoboQuickPanelSide;
  /** Thickness of the collapsed peek sliver, in px. Default: `20`. */
  peekSize?: number;
  /**
   * Size (width for left/right, height for top/bottom) when expanded, as a
   * CSS length. Default: `undefined` — sizes to fit content, up to
   * `maxExpandedSize`, instead of always expanding to a fixed size.
   */
  expandedSize?: string;
  /**
   * Ceiling on the expanded size when auto-sizing to content. Ignored when
   * `expandedSize` is set explicitly. Default: `'60vw'` — generous enough
   * that a multi-tab `RoboTabsList variant="pill"` header has room to lay out
   * on one line instead of wrapping; content still sizes to its natural
   * width below that ceiling, so simple single-line content isn't affected.
   */
  maxExpandedSize?: string;
  /** Icon shown in the peek handle. Defaults to a chevron pointing toward the expand direction. */
  icon?: React.ReactNode;
  /** Accessible name for the panel's `role="complementary"` landmark. Default: `'Quick panel'`. */
  label?: string;

  // ---- Pin state (persisted, same contract as RoboPeekSheet) ----
  pinned?: boolean;
  onPinnedChange?: (pinned: boolean) => void;
  storageAdapter?: StorageAdapter;
  /** Default: `'robo-quick-panel-pinned'`. */
  storageKey?: string;

  // ---- NEW: controlled "force open" — the keybind integration seam ----
  /**
   * Controlled force-open state, independent of hover/pin. When `true`, the
   * panel expands whenever `open` is true, in addition to expanding on hover
   * or when pinned. Wire a global keybind handler to this via
   * `setOpen(!open)` to summon the panel from anywhere without needing to
   * know about — or fight with — the internal hover/pin state.
   *
   * Omit both `open`/`onOpenChange` for a peek-and-pin-only experience
   * identical to `RoboPeekSheet`.
   */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Uncontrolled initial value for `open` when not controlled. Default: `false`. */
  defaultOpen?: boolean;

  // ---- NEW: active-tab bookkeeping, persisted like `pinned` ----
  /**
   * Controlled active-tab value. Lift this — together with
   * `onActiveTabChange` — into the `RoboTabs value`/`onValueChange` you
   * compose inside `RoboQuickPanelBody` (or read both via
   * `useRoboQuickPanel()` from within). This is what lets an external keybind
   * jump straight to a tab, e.g. `setOpen(true); setActiveTab('layers')`.
   * When uncontrolled, the last active tab persists via `storageAdapter` and
   * is restored next time the panel opens. Pass `defaultActiveTab` matching
   * your first tab's value to avoid an uncontrolled-to-controlled switch
   * warning in the composed `RoboTabs`.
   */
  activeTab?: string;
  onActiveTabChange?: (value: string) => void;
  defaultActiveTab?: string;
  /** Default: `'robo-quick-panel-active-tab'`. */
  activeTabStorageKey?: string;

  /**
   * Renders a translucent, blurred glass surface instead of a solid card
   * background. Default: follows the app-wide `useGlassMode()` setting —
   * pass an explicit boolean to override for just this panel.
   */
  transparent?: boolean;
  /**
   * Selects the enter/exit-style transition played every time the panel
   * toggles between peek and expanded. `'default'` reproduces the original
   * hand-written resize exactly — a zero-behavior-change no-op if omitted.
   *
   * RoboQuickPanel-specific semantics (same reinterpretation `RoboPeekSheet`
   * uses, since this panel is architecturally identical — always mounted,
   * only `expanded` toggles, never mounts/unmounts):
   * - `'iris-clip'`'s circular reveal is centered on the peek **handle**, not
   *   the panel center — it reads as "expanding out of the handle" rather
   *   than a generic center-iris.
   * - `'curtain-wipe'` / `'pixel-dissolve'` / `'venetian-blinds'` split their
   *   mask along the panel's *short* axis (perpendicular to the
   *   width/height being resized), and are remounted internally on every
   *   peek↔expand toggle (via `useMaskReplay`,
   *   `src/core/hooks/use-mask-replay.ts`, shared with `RoboPeekSheet`) so the
   *   mask's reveal/conceal animation actually replays each time — including
   *   when the toggle is driven by `open`/`pinned`/hover, since all three
   *   are folded into the same `expanded` boolean by `usePeekPin`.
   * Default: `'default'`.
   */
  transitionVariant?: RoboTransitionVariant;
  children?: React.ReactNode;
  className?: string;
  ref?: React.Ref<HTMLDivElement>;
}

/**
 * RoboQuickPanel — a peek-docked, pinnable, tabbed utility panel that can be
 * summoned from anywhere in the app: shortcuts, recents, notifications,
 * quick settings. Architecturally a `RoboPeekSheet` (always mounted, resizes
 * between a peek sliver and an expanded footprint, no modal semantics) with
 * one addition — a controlled `open` signal so an external global keybind
 * can flash it open without fighting hover/pin state.
 *
 * Non-modal: `role="complementary"`, no focus trap — the rest of the app
 * stays fully interactive and tabbable, unlike `RoboSheet`. Ships as a shell:
 * compose your own tab content (typically `RoboTabs variant="pill"`) inside
 * `RoboQuickPanelBody`.
 *
 * The peek handle is a real `<button>` — a single click always pins/unpins
 * it, independent of hover, for keyboard/touch users. Double-clicking
 * anywhere else in the expanded body also pins it (unless the click lands on
 * an interactive element), with a tooltip over the handle explaining the
 * gesture.
 *
 * A distant trigger (e.g. a topbar icon) should drive the same `open` state
 * you pass to this component directly — the same pattern already used for
 * `RoboCommandPalette` — rather than reaching for `RoboQuickPanelTrigger`,
 * which is for a trigger rendered *inside* the panel itself (e.g. a header
 * close affordance).
 *
 * @example
 * ```tsx
 * const [open, setOpen] = React.useState(false);
 * useKeybind({ id: 'robo.quick-panel.toggle', label: 'Toggle Quick Panel', defaultCombo: 'mod+/' }, () => setOpen((o) => !o));
 *
 * <RoboQuickPanel open={open} onOpenChange={setOpen} side="right">
 *   <RoboQuickPanelHeader>
 *     <RoboQuickPanelTitle>Quick panel</RoboQuickPanelTitle>
 *     <RoboQuickPanelPinButton />
 *   </RoboQuickPanelHeader>
 *   <RoboQuickPanelBody>
 *     <RoboTabs defaultValue="recent">
 *       <RoboTabsList variant="pill">
 *         <RoboTabsTrigger variant="pill" value="recent">Recent</RoboTabsTrigger>
 *       </RoboTabsList>
 *       <RoboTabsContent value="recent">...</RoboTabsContent>
 *     </RoboTabs>
 *   </RoboQuickPanelBody>
 * </RoboQuickPanel>
 * ```
 */
function RoboQuickPanel({
  side = 'right',
  peekSize = 20,
  expandedSize,
  maxExpandedSize = '60vw',
  icon,
  label = 'Quick panel',
  pinned: pinnedProp,
  onPinnedChange,
  storageAdapter = defaultStorageAdapter,
  storageKey = 'robo-quick-panel-pinned',
  open: openProp,
  onOpenChange,
  defaultOpen = false,
  activeTab: activeTabProp,
  onActiveTabChange,
  defaultActiveTab,
  activeTabStorageKey = 'robo-quick-panel-active-tab',
  transparent,
  transitionVariant = 'default',
  children,
  className,
  ref,
}: RoboQuickPanelProps) {
  const { glassMode } = useGlassMode();
  const glass = transparent ?? glassMode;
  const tokens = useAnimationTokens();
  const presets = buildPresets(tokens);
  const reduced = useReducedMotion();

  // ---- open (the keybind integration seam) — stays local, not part of the
  // shared pin/hover hook, but feeds it as `extraExpanded`. ----
  const isOpenControlled = openProp !== undefined;
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const open = openProp ?? internalOpen;
  const setOpen = React.useCallback(
    (next: boolean) => {
      if (!isOpenControlled) setInternalOpen(next);
      onOpenChange?.(next);
    },
    [isOpenControlled, onOpenChange]
  );

  const DefaultIcon = DEFAULT_ICONS[side];

  const { pinned, setPinned, expanded, hoverHandlers, handleBodyDoubleClick, iconKey, handleIcon } = usePeekPin({
    pinned: pinnedProp,
    onPinnedChange,
    storageAdapter,
    storageKey,
    icon,
    DefaultIcon,
    extraExpanded: open,
  });

  // ---- activeTab (persisted bookkeeping for jump-to-tab keybinds) — stays local. ----
  const isActiveTabControlled = activeTabProp !== undefined;
  const [internalActiveTab, setInternalActiveTab] = React.useState<string | undefined>(() => {
    if (isActiveTabControlled) return undefined;
    return storageAdapter.get(activeTabStorageKey) ?? defaultActiveTab;
  });
  const activeTab = activeTabProp ?? internalActiveTab;
  const setActiveTab = React.useCallback(
    (next: string) => {
      if (!isActiveTabControlled) {
        setInternalActiveTab(next);
        storageAdapter.set(activeTabStorageKey, next);
      }
      onActiveTabChange?.(next);
    },
    [isActiveTabControlled, onActiveTabChange, storageAdapter, activeTabStorageKey]
  );

  // ---- Escape collapses `open` only — never unpins a deliberate pin, and
  // never fights hover (moving the mouse already collapses that). ----
  React.useEffect(() => {
    if (!expanded) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      if (open) setOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [expanded, open, setOpen]);

  // ---- aria-live announcement, only for `open`-driven transitions — hover
  // changes are deliberately silent (would be noisy for AT users moving
  // their mouse near the edge). ----
  const [announcement, setAnnouncement] = React.useState('');
  const prevOpenRef = React.useRef(open);
  React.useEffect(() => {
    if (prevOpenRef.current !== open) {
      setAnnouncement(open ? 'Quick panel opened' : 'Quick panel closed');
      prevOpenRef.current = open;
    }
  }, [open]);

  // Shared peek↔expand transition logic (depth-fade / iris-clip / masked
  // variants, mask-replay timing) lives in usePanelTransitionMotion, shared
  // with RoboPeekSheet. `expanded` here is `pinned || hovering || open` (via
  // usePeekPin), so a toggle via any of the three still replays the mask.
  const { horizontal, sizeKey, MaskOverlay, maskVisible, maskCycleKey, buildMotionProps } =
    usePanelTransitionMotion({ transitionVariant, tokens, reduced, side, expanded });

  const sizeTarget = expanded ? (expandedSize ?? 'auto') : `${peekSize}px`;
  const dynamicMotionProps: Record<string, unknown> = buildMotionProps({ [sizeKey]: sizeTarget });

  const contextValue = React.useMemo<RoboQuickPanelContextValue>(
    () => ({ expanded, pinned, setPinned, open, setOpen, activeTab, setActiveTab, side }),
    [expanded, pinned, setPinned, open, setOpen, activeTab, setActiveTab, side]
  );

  return (
    <RoboQuickPanelContext.Provider value={contextValue}>
      <RoboTooltipProvider>
        <motion.div
          ref={ref}
          data-slot='quick-panel'
          data-expanded={expanded ? 'true' : 'false'}
          role='complementary'
          aria-label={label}
          {...hoverHandlers}
          className={cn(quickPanelVariants({ side }), 'overflow-x-hidden', getPanelSurfaceClasses(glass), className)}
          style={{ [horizontal ? 'maxWidth' : 'maxHeight']: expandedSize ?? maxExpandedSize }}
          {...dynamicMotionProps}
        >
          <RoboTooltip>
            <RoboTooltipTrigger asChild>
              <button
                type='button'
                aria-pressed={pinned}
                aria-label={pinned ? 'Unpin panel' : 'Pin panel open'}
                onClick={() => setPinned(!pinned)}
                className={cn(
                  'absolute z-10 flex items-center justify-center',
                  pinned
                    ? 'text-[var(--primary)] hover:text-[var(--primary)] hover:bg-[var(--accent)]/50'
                    : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--accent)]/50',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]',
                  HANDLE_POSITION_CLASSES[side]
                )}
                style={{ [horizontal ? 'width' : 'height']: peekSize }}
              >
                <motion.span
                  key={iconKey}
                  initial={reduced ? undefined : { scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={reduced ? { duration: 0 } : presets.expressive.enter}
                  className='flex items-center justify-center'
                >
                  {handleIcon}
                </motion.span>
              </button>
            </RoboTooltipTrigger>
            <RoboTooltipContent side={TOOLTIP_SIDE[side]} sideOffset={8}>
              {pinned ? 'Unpin' : 'Double-click to pin'}
            </RoboTooltipContent>
          </RoboTooltip>

          {MaskOverlay && (
            <AnimatePresence>
              {maskVisible && (
                // Unstyled/non-positioned wrapper — matches RoboPeekSheet's
                // approach (see robo-peek-sheet.tsx): it establishes no
                // containing block of its own, so the mask's `absolute
                // inset-0` resolves against the nearest positioned ancestor
                // (this `fixed` root), covering it exactly as if the wrapper
                // weren't there. Only exists to carry `aria-hidden`, since
                // MaskOverlay's prop type has no accessibility escape hatch
                // of its own.
                <div aria-hidden='true' key={maskCycleKey}>
                  <MaskOverlay glass={glass} />
                </div>
              )}
            </AnimatePresence>
          )}

          <div
            data-slot='quick-panel-content'
            onDoubleClick={handleBodyDoubleClick}
            className={cn(
              'flex flex-col gap-3 overflow-x-hidden overflow-y-auto p-4 transition-opacity',
              horizontal ? 'h-full' : 'w-full',
              expanded ? 'opacity-100' : 'pointer-events-none opacity-0'
            )}
            // Extra padding on the side facing the app content, so content
            // clears the handle strip that's always sitting on that edge.
            style={{
              paddingLeft: side === 'right' ? peekSize + 16 : undefined,
              paddingRight: side === 'left' ? peekSize + 16 : undefined,
              paddingBottom: side === 'top' ? peekSize + 16 : undefined,
              paddingTop: side === 'bottom' ? peekSize + 16 : undefined,
            }}
          >
            {children}
          </div>

          <span className='sr-only' role='status' aria-live='polite'>
            {announcement}
          </span>
        </motion.div>
      </RoboTooltipProvider>
    </RoboQuickPanelContext.Provider>
  );
}
RoboQuickPanel.displayName = 'RoboQuickPanel';

// ---------------------------------------------------------------------------
// RoboQuickPanelTrigger — a trigger rendered *inside* the panel (e.g. a
// header close affordance). A distant topbar trigger should drive the same
// `open` state passed to `RoboQuickPanel` directly instead — see the root
// component's JSDoc.
// ---------------------------------------------------------------------------

export interface RoboQuickPanelTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  ref?: React.Ref<HTMLButtonElement>;
}

function RoboQuickPanelTrigger({ onClick, ref, ...props }: RoboQuickPanelTriggerProps) {
  const { open, setOpen } = useRoboQuickPanel();
  return (
    <button
      ref={ref}
      type='button'
      aria-pressed={open}
      onClick={(event) => {
        onClick?.(event);
        setOpen(!open);
      }}
      {...props}
    />
  );
}
RoboQuickPanelTrigger.displayName = 'RoboQuickPanelTrigger';

// ---------------------------------------------------------------------------
// RoboQuickPanelPinButton — the pin toggle, extracted (unlike RoboPeekSheet's
// inline handle) so it can be relocated into a custom header layout.
// ---------------------------------------------------------------------------

export interface RoboQuickPanelPinButtonProps {
  className?: string;
  ref?: React.Ref<HTMLButtonElement>;
}

function RoboQuickPanelPinButton({ className, ref }: RoboQuickPanelPinButtonProps) {
  const { pinned, setPinned } = useRoboQuickPanel();
  return (
    <RoboTooltip>
      <RoboTooltipTrigger asChild>
        <button
          ref={ref}
          type='button'
          aria-pressed={pinned}
          aria-label={pinned ? 'Unpin panel' : 'Pin panel open'}
          onClick={() => setPinned(!pinned)}
          className={cn(
            'inline-flex items-center justify-center rounded-[var(--radius)] p-1.5',
            'text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--accent)]/50',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]',
            className
          )}
        >
          <Pin className={cn('h-3.5 w-3.5', pinned && 'fill-current')} />
        </button>
      </RoboTooltipTrigger>
      <RoboTooltipContent side='bottom' sideOffset={8}>
        {pinned ? 'Unpin' : 'Double-click to pin'}
      </RoboTooltipContent>
    </RoboTooltip>
  );
}
RoboQuickPanelPinButton.displayName = 'RoboQuickPanelPinButton';

// ---------------------------------------------------------------------------
// Layout sub-components — plain wrappers, same shape as RoboSheetHeader/Title/Footer
// ---------------------------------------------------------------------------

/** Header row — typically a `RoboQuickPanelTitle` + `RoboQuickPanelPinButton`. */
function RoboQuickPanelHeader({
  className,
  ref,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> }) {
  return (
    <div
      ref={ref}
      data-slot='quick-panel-header'
      className={cn('flex items-center justify-between gap-2', className)}
      {...props}
    />
  );
}
RoboQuickPanelHeader.displayName = 'RoboQuickPanelHeader';

/** Title of the panel. */
function RoboQuickPanelTitle({
  className,
  ref,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement> & { ref?: React.Ref<HTMLHeadingElement> }) {
  return <h2 ref={ref} data-slot='quick-panel-title' className={cn('text-sm font-semibold', className)} {...props} />;
}
RoboQuickPanelTitle.displayName = 'RoboQuickPanelTitle';

/** Scrollable content region — typically a `RoboTabs variant="pill"` composition. */
function RoboQuickPanelBody({
  className,
  ref,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> }) {
  return <div ref={ref} data-slot='quick-panel-body' className={cn('min-h-0 flex-1', className)} {...props} />;
}
RoboQuickPanelBody.displayName = 'RoboQuickPanelBody';

/** Optional bottom slot — e.g. an "Open full settings" link. */
function RoboQuickPanelFooter({
  className,
  ref,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> }) {
  return (
    <div ref={ref} data-slot='quick-panel-footer' className={cn('mt-auto flex justify-end gap-2 pt-2', className)} {...props} />
  );
}
RoboQuickPanelFooter.displayName = 'RoboQuickPanelFooter';

export {
  RoboQuickPanel,
  quickPanelVariants,
  RoboQuickPanelTrigger,
  RoboQuickPanelHeader,
  RoboQuickPanelTitle,
  RoboQuickPanelBody,
  RoboQuickPanelFooter,
  RoboQuickPanelPinButton,
  useRoboQuickPanel,
};
