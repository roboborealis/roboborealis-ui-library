import * as React from 'react';
import * as RadixTabs from '@radix-ui/react-tabs';
import { motion, useReducedMotion } from 'motion/react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import { RoboFadeIn } from '@/animations';
import { buildPresets } from '../../animations/config/animation-presets';
import { useAnimationTokens } from '../../animations/config/use-animation-tokens';

// Shared orientation type — matches Radix's orientation string union
type TabOrientation = 'horizontal' | 'vertical';

/** Visual style of the tab list/triggers. `pill` renders a segmented
 *  background with a sliding active-indicator (shadcn Base UI Tabs style);
 *  `underline` is the original accent-bar style. Default: `underline`. */
export type RoboTabsVariant = 'underline' | 'pill';

/** Active-indicator color for the `pill` variant. `orange` is the original
 *  brand-accent look; `light`/`dark` swap in a white or near-black capsule
 *  for contexts that want a more neutral pill. No effect on `underline`.
 *  Default: `orange`. */
export type RoboTabsTone = 'orange' | 'light' | 'dark';

// ─── Root ─────────────────────────────────────────────────────────────────────

// RoboTabs uses Radix's orientation prop directly (already typed there).
// We do NOT add a separate CVA variant for Root to avoid the TS2320 conflict
// (Radix's TabsProps.orientation and CVA's VariantProps.orientation clash).
export type RoboTabsProps = React.ComponentPropsWithoutRef<typeof RadixTabs.Root> & {
  ref?: React.Ref<React.ComponentRef<typeof RadixTabs.Root>>;
};

/**
 * RoboTabs — Radix UI Tabs wrapper with Robo styling.
 *
 * @example
 * ```tsx
 * <RoboTabs defaultValue="overview">
 *   <RoboTabsList>
 *     <RoboTabsTrigger value="overview">Overview</RoboTabsTrigger>
 *     <RoboTabsTrigger value="details">Details</RoboTabsTrigger>
 *   </RoboTabsList>
 *   <RoboTabsContent value="overview">Overview content</RoboTabsContent>
 *   <RoboTabsContent value="details">Details content</RoboTabsContent>
 * </RoboTabs>
 * ```
 */
function RoboTabs({ className, orientation = 'horizontal', ref, ...props }: RoboTabsProps) {
  return (
    <RadixTabs.Root
      ref={ref}
      orientation={orientation}
      className={cn(
        'flex',
        orientation === 'vertical' ? 'flex-row' : 'flex-col',
        className
      )}
      {...props}
    />
  );
}
RoboTabs.displayName = 'RoboTabs';

// ─── List ──────────────────────────────────────────────────────────────────────

const tabsListVariants = cva('flex shrink-0', {
  variants: {
    orientation: {
      horizontal: 'flex-row border-b border-[var(--border)] gap-0',
      vertical: 'flex-col border-r border-[var(--border)] gap-0 min-w-[10rem]',
    },
    variant: {
      // No extra container styling — existing behavior, unchanged.
      underline: '',
      // rounded-full (not var(--radius)) for a true capsule/pill track, and
      // flex-wrap so a list of triggers that doesn't fit wraps onto a second
      // row instead of overflowing — a pill tab list is commonly used inside
      // a width-constrained container (e.g. RoboQuickPanel) that must never
      // horizontal-scroll.
      pill: 'relative flex-wrap rounded-full bg-[var(--muted)] p-1 gap-1',
    },
  },
  compoundVariants: [
    // Pill style has no border — the orientation border-b/border-r is the
    // underline variant's job, so strip it back off for pill.
    { variant: 'pill', orientation: 'horizontal', class: 'border-b-0' },
    { variant: 'pill', orientation: 'vertical', class: 'border-r-0 min-w-0' },
  ],
  defaultVariants: {
    orientation: 'horizontal',
    variant: 'underline',
  },
});

export interface RoboTabsListProps
  extends React.ComponentPropsWithoutRef<typeof RadixTabs.List> {
  /** Layout orientation — defaults to horizontal */
  orientation?: TabOrientation;
  /** Visual style — defaults to underline */
  variant?: RoboTabsVariant;
  /** Pill indicator color — only affects `variant='pill'`. Defaults to orange. */
  tone?: RoboTabsTone;
  ref?: React.Ref<React.ComponentRef<typeof RadixTabs.List>>;
}

function RoboTabsList({ className, orientation = 'horizontal', variant = 'underline', tone = 'orange', ref, children, ...props }: RoboTabsListProps) {
  // State, not a plain ref: ref callbacks commit bottom-up, so a child like
  // RoboTabsPillIndicator would still see a null ref on its own first layout
  // effect if this were a mutable ref written by the same callback — by the
  // time this List's own ref fires, the child has already run. Routing it
  // through state instead means the callback's `setContainer` schedules a
  // re-render that hands the indicator a real node before its effect runs.
  const [container, setContainer] = React.useState<HTMLDivElement | null>(null);

  const setRefs = React.useCallback(
    (node: HTMLDivElement | null) => {
      setContainer(node);
      if (typeof ref === 'function') ref(node);
      else if (ref) (ref as React.RefObject<HTMLDivElement | null>).current = node;
    },
    [ref]
  );

  return (
    <RadixTabs.List
      ref={setRefs}
      className={cn(tabsListVariants({ orientation, variant }), className)}
      {...props}
    >
      {variant === 'pill' && <RoboTabsPillIndicator container={container} tone={tone} />}
      {children}
    </RadixTabs.List>
  );
}
RoboTabsList.displayName = 'RoboTabsList';

// ─── Pill sliding indicator ─────────────────────────────────────────────────
//
// Renders a single indicator element inside RoboTabsList and animates its
// position/size to match whichever sibling trigger Radix has marked
// `data-state="active"`. This measures the DOM directly (via a
// MutationObserver watching that attribute, plus a ResizeObserver for layout
// changes) rather than sharing a motion/react `layoutId` across per-trigger
// decorative elements — that alternative would require knowing which
// RoboTabsTrigger is active at render time, which Radix does not expose
// through a public context/hook. Reading its own `data-state` attribute,
// which Radix already stamps onto the DOM for the `data-[state=active]:`
// Tailwind selectors used elsewhere in this file, needs no such access.
// ─────────────────────────────────────────────────────────────────────────

const tabsIndicatorVariants = cva('absolute left-0 top-0 z-0 rounded-full shadow-[var(--shadow-sm)]', {
  variants: {
    tone: {
      // var(--primary) is the confirmed, theme-correct "brand accent" token —
      // already WCAG-AA remapped per theme/mode (see DESIGN.md's
      // "Brand Orange on Light Backgrounds" note) — never hardcode the
      // orange hex.
      orange: 'bg-[var(--primary)]',
      // --card is the elevated-surface token (white in light mode, a
      // lighter teal card in dark mode) — distinct from the --muted track
      // it sits on in both modes, giving the pill visible definition.
      light: 'bg-[var(--card)]',
      // --foreground on a --muted track always reads as the highest-
      // contrast "solid" fill in either theme.
      dark: 'bg-[var(--foreground)]',
    },
  },
  defaultVariants: { tone: 'orange' },
});

interface RoboTabsPillIndicatorProps {
  container: HTMLElement | null;
  tone?: RoboTabsTone;
}

function RoboTabsPillIndicator({ container, tone = 'orange' }: RoboTabsPillIndicatorProps) {
  const reduced = useReducedMotion();
  const tokens = useAnimationTokens();
  const presets = buildPresets(tokens);
  const [rect, setRect] = React.useState<{ x: number; y: number; width: number; height: number } | null>(null);

  React.useLayoutEffect(() => {
    if (!container) return;

    // Tracks whichever trigger is currently observed for its own resize —
    // re-pointed at the active trigger every time `measure` runs. Needed
    // because the active trigger can grow from 0×0 to its natural size
    // after this effect's first measurement (e.g. while an ancestor panel
    // is still mid mount/expand animation) without the
    // *container*'s own box ever resizing — the container-only
    // ResizeObserver below would never see that and the indicator would be
    // stuck at its stale zero-size rect.
    let activeResizeObserver: ResizeObserver | null = null;

    const measure = () => {
      const active = container.querySelector<HTMLElement>('[data-state="active"]');
      setRect(
        active
          ? { x: active.offsetLeft, y: active.offsetTop, width: active.offsetWidth, height: active.offsetHeight }
          : null
      );

      activeResizeObserver?.disconnect();
      if (active) {
        activeResizeObserver = new ResizeObserver(measure);
        activeResizeObserver.observe(active);
      }
    };

    measure();

    const mutationObserver = new MutationObserver(measure);
    mutationObserver.observe(container, { attributes: true, attributeFilter: ['data-state'], subtree: true });

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(container);

    return () => {
      mutationObserver.disconnect();
      resizeObserver.disconnect();
      activeResizeObserver?.disconnect();
    };
  }, [container]);

  if (!rect) return null;

  return (
    <motion.div
      aria-hidden='true'
      data-slot='tabs-pill-indicator'
      className={tabsIndicatorVariants({ tone })}
      animate={{ x: rect.x, y: rect.y, width: rect.width, height: rect.height }}
      transition={reduced ? { duration: 0 } : presets.standard.enter}
    />
  );
}

// ─── Trigger ──────────────────────────────────────────────────────────────────

const tabsTriggerVariants = cva(
  [
    'inline-flex items-center justify-center whitespace-nowrap text-sm font-medium',
    'text-[var(--muted-foreground)] transition-colors duration-[var(--duration-fast)]',
    'disabled:pointer-events-none disabled:opacity-50',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-1',
    'data-[state=active]:text-[var(--foreground)]',
  ].join(' '),
  {
    variants: {
      orientation: {
        horizontal: '',
        vertical: '',
      },
      variant: {
        underline: '',
        // rounded-full to match the sliding RoboTabsPillIndicator's capsule
        // shape. No background here — the indicator sibling renders behind
        // the active trigger; this just needs to sit above it (z-10).
        pill: 'relative z-10 rounded-full px-3 py-1.5',
      },
      // Only meaningful when variant='pill' — see the compoundVariants
      // below for the actual active-text-color overrides per tone.
      tone: {
        orange: '',
        light: '',
        dark: '',
      },
    },
    compoundVariants: [
      // Re-homed verbatim from the pre-variant version of this file — byte-
      // identical output for the default (`underline`) path.
      {
        variant: 'underline',
        orientation: 'horizontal',
        class: [
          'px-4 py-2.5 relative',
          'after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5',
          'after:bg-transparent data-[state=active]:after:bg-[var(--primary)]',
          'after:transition-colors after:duration-[var(--duration-fast)]',
          'hover:text-[var(--foreground)]',
        ].join(' '),
      },
      {
        variant: 'underline',
        orientation: 'vertical',
        class: [
          'px-4 py-2.5 relative justify-start',
          'before:absolute before:left-0 before:top-0 before:bottom-0 before:w-0.5',
          'before:bg-transparent data-[state=active]:before:bg-[var(--primary)]',
          'before:transition-colors before:duration-[var(--duration-fast)]',
          'hover:text-[var(--foreground)] hover:bg-[var(--accent)]',
        ].join(' '),
      },
      // The pill indicator behind the active trigger is var(--primary)
      // (brand orange) — the base string's data-[state=active]:text-[var(--foreground)]
      // isn't readable against that, so pill overrides it with the paired
      // on-primary foreground token (same pairing RoboBadge/RoboButton use for
      // any --primary-filled surface).
      {
        variant: 'pill',
        tone: 'orange',
        class: 'data-[state=active]:text-[var(--primary-foreground)]',
      },
      // light tone's indicator is --card (white/near-white) — the base
      // string's data-[state=active]:text-[var(--foreground)] already reads
      // correctly against that, so this is explicit-but-redundant, kept for
      // clarity/searchability rather than silently relying on the base.
      {
        variant: 'pill',
        tone: 'light',
        class: 'data-[state=active]:text-[var(--foreground)]',
      },
      // dark tone's indicator is --foreground (a solid, near-opposite-of-
      // background fill) — --background is guaranteed to contrast with
      // --foreground in every theme/mode, so it's the correct "inverse
      // text" token here without needing a dedicated one.
      {
        variant: 'pill',
        tone: 'dark',
        class: 'data-[state=active]:text-[var(--background)]',
      },
    ],
    defaultVariants: {
      orientation: 'horizontal',
      variant: 'underline',
      tone: 'orange',
    },
  }
);

export interface RoboTabsTriggerProps
  extends React.ComponentPropsWithoutRef<typeof RadixTabs.Trigger>,
    VariantProps<typeof tabsTriggerVariants> {
  ref?: React.Ref<React.ComponentRef<typeof RadixTabs.Trigger>>;
}

function RoboTabsTrigger({ className, orientation = 'horizontal', variant = 'underline', tone = 'orange', ref, ...props }: RoboTabsTriggerProps) {
  return (
    <RadixTabs.Trigger
      ref={ref}
      className={cn(tabsTriggerVariants({ orientation, variant, tone }), className)}
      {...props}
    />
  );
}
RoboTabsTrigger.displayName = 'RoboTabsTrigger';

// ─── Content ──────────────────────────────────────────────────────────────────

const tabsContentVariants = cva(
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-1',
  {
    variants: {
      orientation: {
        horizontal: 'pt-4',
        vertical: 'pl-4 flex-1',
      },
      // Opt-in tinted panel for visual separation from the rest of the
      // surface it sits on — same bg/text token pairing RoboAccordionContent
      // uses for its expanded-section tint (--secondary-text is the token
      // that's actually paired with --muted for readable text; see
      // DESIGN.md's note that --muted-foreground is disabled-only).
      tinted: {
        true: 'bg-[var(--muted)] text-[var(--secondary-text)] rounded-[var(--radius)]',
        false: '',
      },
    },
    compoundVariants: [
      // cn()'s tailwind-merge pass resolves pt-4/p-4 and pl-4/p-4 conflicts
      // by keeping whichever occurs last in the concatenated class string —
      // these compound classes are appended after the base orientation
      // classes, so the tinted spacing correctly wins over the directional-
      // only padding above.
      { orientation: 'horizontal', tinted: true, class: 'p-4 mt-2' },
      { orientation: 'vertical', tinted: true, class: 'p-4 ml-2' },
    ],
    defaultVariants: {
      orientation: 'horizontal',
      tinted: false,
    },
  }
);

export interface RoboTabsContentProps
  extends React.ComponentPropsWithoutRef<typeof RadixTabs.Content>,
    VariantProps<typeof tabsContentVariants> {
  /** Fade tab content in when the tab becomes active. Default: false */
  animateContent?: boolean;
  ref?: React.Ref<React.ComponentRef<typeof RadixTabs.Content>>;
}

function RoboTabsContent({ className, orientation = 'horizontal', tinted = false, animateContent = false, children, ref, ...props }: RoboTabsContentProps) {
  return (
    <RadixTabs.Content
      ref={ref}
      className={cn(tabsContentVariants({ orientation, tinted }), className)}
      {...props}
    >
      {animateContent ? <RoboFadeIn preset='standard'>{children}</RoboFadeIn> : children}
    </RadixTabs.Content>
  );
}
RoboTabsContent.displayName = 'RoboTabsContent';

export {
  RoboTabs,
  RoboTabsList,
  RoboTabsTrigger,
  RoboTabsContent,
  tabsListVariants,
  tabsTriggerVariants,
  tabsContentVariants,
  tabsIndicatorVariants,
};
