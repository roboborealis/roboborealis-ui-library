import * as React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { Satellite } from 'lucide-react';
import type { RoboTransitionVariant } from '@/animations';

import { RoboGlassModeProvider } from '@/core/providers/robo-glass-mode-provider';
import type { StorageAdapter } from '@/core/storage-adapter';

// ---------------------------------------------------------------------------
// motion/react mock — lets the "respects reduced motion" tests below force
// `useReducedMotion()` to report `true` without depending on
// `window.matchMedia` (see robo-peek-sheet.test.tsx for the identical
// rationale). Defaults to `false` so every other test in this file keeps
// exercising the real non-reduced-motion path.
// ---------------------------------------------------------------------------

const mockUseReducedMotion = vi.fn(() => false);

vi.mock('motion/react', async () => {
  const actual = await vi.importActual<typeof import('motion/react')>('motion/react');
  return { ...actual, useReducedMotion: () => mockUseReducedMotion() };
});

const { RoboQuickPanel, useRoboQuickPanel } = await import('./robo-quick-panel');
const { motion } = await import('motion/react');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeMockAdapter(initial: Record<string, string> = {}): StorageAdapter {
  const store = { ...initial };
  return {
    get: vi.fn((key: string) => store[key] ?? null),
    set: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    remove: vi.fn((key: string) => {
      delete store[key];
    }),
  };
}

function getRoot(): HTMLElement {
  return document.querySelector('[data-slot="quick-panel"]') as HTMLElement;
}

function getContent(): HTMLElement {
  return document.querySelector('[data-slot="quick-panel-content"]') as HTMLElement;
}

// ---------------------------------------------------------------------------
// Tests — hover/pin mechanics mirror robo-peek-sheet.test.tsx's coverage
// ---------------------------------------------------------------------------

describe('RoboQuickPanel', () => {
  afterEach(() => {
    window.localStorage.clear();
  });

  it('renders children', () => {
    render(
      <RoboQuickPanel>
        <p>Quick content</p>
      </RoboQuickPanel>
    );
    expect(screen.getByText('Quick content')).toBeInTheDocument();
  });

  it('is collapsed by default', () => {
    render(
      <RoboQuickPanel>
        <p>Content</p>
      </RoboQuickPanel>
    );
    expect(getRoot().dataset.expanded).toBe('false');
  });

  it('expands on hover and collapses on mouse leave when not pinned/open', () => {
    render(
      <RoboQuickPanel>
        <p>Content</p>
      </RoboQuickPanel>
    );
    fireEvent.mouseEnter(getRoot());
    expect(getRoot().dataset.expanded).toBe('true');
    fireEvent.mouseLeave(getRoot());
    expect(getRoot().dataset.expanded).toBe('false');
  });

  it('stays expanded after mouse leave once pinned', async () => {
    const user = userEvent.setup();
    render(
      <RoboQuickPanel>
        <p>Content</p>
      </RoboQuickPanel>
    );
    await user.click(screen.getByRole('button', { name: /pin panel open/i }));
    fireEvent.mouseLeave(getRoot());
    expect(getRoot().dataset.expanded).toBe('true');
  });

  it('persists pinned state to storageAdapter on toggle', async () => {
    const adapter = makeMockAdapter();
    const user = userEvent.setup();
    render(
      <RoboQuickPanel storageAdapter={adapter}>
        <p>Content</p>
      </RoboQuickPanel>
    );
    await user.click(screen.getByRole('button', { name: /pin panel open/i }));
    expect(adapter.set).toHaveBeenCalledWith('robo-quick-panel-pinned', 'true');
  });

  // ---- NEW: controlled `open` mechanics ----

  it('open=true expands the panel with no hover and no pin', () => {
    render(
      <RoboQuickPanel open onOpenChange={vi.fn()}>
        <p>Content</p>
      </RoboQuickPanel>
    );
    expect(getRoot().dataset.expanded).toBe('true');
  });

  it('toggling the parent open state expands/collapses the panel', () => {
    function Harness() {
      const [open, setOpen] = React.useState(false);
      return (
        <div>
          <button onClick={() => setOpen((o) => !o)}>Toggle</button>
          <RoboQuickPanel open={open} onOpenChange={setOpen}>
            <p>Content</p>
          </RoboQuickPanel>
        </div>
      );
    }
    render(<Harness />);
    expect(getRoot().dataset.expanded).toBe('false');
    fireEvent.click(screen.getByText('Toggle'));
    expect(getRoot().dataset.expanded).toBe('true');
    fireEvent.click(screen.getByText('Toggle'));
    expect(getRoot().dataset.expanded).toBe('false');
  });

  it('composes expanded = pinned || hovering || open rather than overwriting', async () => {
    const user = userEvent.setup();
    function Harness() {
      const [open, setOpen] = React.useState(true);
      return (
        <div>
          <button onClick={() => setOpen(false)}>Close</button>
          <RoboQuickPanel open={open} onOpenChange={setOpen}>
            <p>Content</p>
          </RoboQuickPanel>
        </div>
      );
    }
    render(<Harness />);
    await user.click(screen.getByRole('button', { name: /pin panel open/i }));
    expect(getRoot().dataset.expanded).toBe('true');
    fireEvent.click(screen.getByText('Close'));
    // `open` is now false, but `pinned` alone keeps it expanded.
    expect(getRoot().dataset.expanded).toBe('true');
  });

  it('uncontrolled open (prop omitted) never self-activates — identical to RoboPeekSheet', () => {
    render(
      <RoboQuickPanel>
        <p>Content</p>
      </RoboQuickPanel>
    );
    expect(getRoot().dataset.expanded).toBe('false');
    fireEvent.mouseEnter(getRoot());
    fireEvent.mouseLeave(getRoot());
    expect(getRoot().dataset.expanded).toBe('false');
  });

  // ---- Escape handling ----

  it('Escape while open collapses open, without touching pinned', async () => {
    const user = userEvent.setup();
    function Harness() {
      const [open, setOpen] = React.useState(true);
      return (
        <RoboQuickPanel open={open} onOpenChange={setOpen}>
          <p>Content</p>
        </RoboQuickPanel>
      );
    }
    render(<Harness />);
    expect(getRoot().dataset.expanded).toBe('true');
    await user.keyboard('{Escape}');
    expect(getRoot().dataset.expanded).toBe('false');
  });

  it('Escape while only hovering (not open, not pinned) does nothing', async () => {
    const user = userEvent.setup();
    render(
      <RoboQuickPanel>
        <p>Content</p>
      </RoboQuickPanel>
    );
    fireEvent.mouseEnter(getRoot());
    expect(getRoot().dataset.expanded).toBe('true');
    await user.keyboard('{Escape}');
    expect(getRoot().dataset.expanded).toBe('true');
  });

  it('Escape while pinned does not unpin', async () => {
    const user = userEvent.setup();
    render(
      <RoboQuickPanel>
        <p>Content</p>
      </RoboQuickPanel>
    );
    await user.click(screen.getByRole('button', { name: /pin panel open/i }));
    await user.keyboard('{Escape}');
    fireEvent.mouseLeave(getRoot());
    expect(getRoot().dataset.expanded).toBe('true');
  });

  // ---- aria-live announcement ----

  it('announces open/close only for open-driven transitions, not hover', () => {
    function Harness() {
      const [open, setOpen] = React.useState(false);
      return (
        <div>
          <button onClick={() => setOpen(true)}>Open</button>
          <RoboQuickPanel open={open} onOpenChange={setOpen}>
            <p>Content</p>
          </RoboQuickPanel>
        </div>
      );
    }
    render(<Harness />);
    const status = document.querySelector('[role="status"]') as HTMLElement;
    expect(status.textContent).toBe('');
    fireEvent.mouseEnter(getRoot());
    fireEvent.mouseLeave(getRoot());
    expect(status.textContent).toBe('');
    fireEvent.click(screen.getByText('Open'));
    expect(status.textContent).toBe('Quick panel opened');
  });

  // ---- activeTab ----

  it('supports a controlled activeTab prop', () => {
    function Consumer() {
      const { activeTab } = useRoboQuickPanel();
      return <p>Active: {activeTab}</p>;
    }
    render(
      <RoboQuickPanel activeTab='layers' onActiveTabChange={vi.fn()}>
        <Consumer />
      </RoboQuickPanel>
    );
    expect(screen.getByText('Active: layers')).toBeInTheDocument();
  });

  it('persists uncontrolled activeTab via storageAdapter and restores it on remount', () => {
    const adapter = makeMockAdapter();

    function Consumer() {
      const { activeTab, setActiveTab } = useRoboQuickPanel();
      return (
        <div>
          <p>Active: {activeTab ?? 'none'}</p>
          <button onClick={() => setActiveTab('layers')}>Go to layers</button>
        </div>
      );
    }

    const { unmount } = render(
      <RoboQuickPanel storageAdapter={adapter}>
        <Consumer />
      </RoboQuickPanel>
    );
    fireEvent.click(screen.getByText('Go to layers'));
    expect(adapter.set).toHaveBeenCalledWith('robo-quick-panel-active-tab', 'layers');
    unmount();

    render(
      <RoboQuickPanel storageAdapter={adapter}>
        <Consumer />
      </RoboQuickPanel>
    );
    expect(screen.getByText('Active: layers')).toBeInTheDocument();
  });

  // ---- Glass mode ----

  it('renders solid by default with no RoboGlassModeProvider mounted', () => {
    render(
      <RoboQuickPanel>
        <p>Content</p>
      </RoboQuickPanel>
    );
    expect(getRoot().className).not.toContain('backdrop-blur-2xl');
  });

  it('follows the app-wide glass mode setting when no transparent prop is passed', () => {
    render(
      <RoboGlassModeProvider defaultGlassMode>
        <RoboQuickPanel>
          <p>Content</p>
        </RoboQuickPanel>
      </RoboGlassModeProvider>
    );
    expect(getRoot().className).toContain('backdrop-blur-2xl');
  });

  it('an explicit transparent prop overrides the app-wide setting', () => {
    render(
      <RoboGlassModeProvider defaultGlassMode>
        <RoboQuickPanel transparent={false}>
          <p>Content</p>
        </RoboQuickPanel>
      </RoboGlassModeProvider>
    );
    expect(getRoot().className).not.toContain('backdrop-blur-2xl');
  });

  // ---- Structure / a11y ----

  it('has role="complementary" with an accessible name', () => {
    render(
      <RoboQuickPanel label='Quick panel'>
        <p>Content</p>
      </RoboQuickPanel>
    );
    expect(screen.getByRole('complementary', { name: 'Quick panel' })).toBeInTheDocument();
  });

  it('forwards ref to the root element', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <RoboQuickPanel ref={ref}>
        <p>Content</p>
      </RoboQuickPanel>
    );
    expect(ref.current).toBe(getRoot());
  });

  it('has displayName RoboQuickPanel', () => {
    expect(RoboQuickPanel.displayName).toBe('RoboQuickPanel');
  });

  it('no a11y violations when collapsed', async () => {
    const { container } = render(
      <RoboQuickPanel>
        <p>Content</p>
      </RoboQuickPanel>
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('no a11y violations when open', async () => {
    const { container } = render(
      <RoboQuickPanel open onOpenChange={vi.fn()}>
        <p>Content</p>
      </RoboQuickPanel>
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  // ---- Handle icon precedence — mirrors robo-peek-sheet.test.tsx ----

  describe('handle icon precedence', () => {
    it('shows the directional chevron at rest, even with a custom icon prop', () => {
      render(
        <RoboQuickPanel icon={<Satellite />}>
          <p>Content</p>
        </RoboQuickPanel>
      );
      const button = screen.getByRole('button', { name: /pin panel open/i });
      expect(button.querySelector('svg.lucide-chevron-left')).toBeInTheDocument();
      expect(button.querySelector('svg.lucide-satellite')).not.toBeInTheDocument();
    });

    it('shows the custom icon while hovering, not pinned', () => {
      render(
        <RoboQuickPanel icon={<Satellite />}>
          <p>Content</p>
        </RoboQuickPanel>
      );
      fireEvent.mouseEnter(getRoot());
      const button = screen.getByRole('button', { name: /pin panel open/i });
      expect(button.querySelector('svg.lucide-satellite')).toBeInTheDocument();
      expect(button.querySelector('svg.lucide-chevron-left')).not.toBeInTheDocument();
    });

    it('always shows Pin when pinned, even with a custom icon prop', async () => {
      const user = userEvent.setup();
      render(
        <RoboQuickPanel icon={<Satellite />}>
          <p>Content</p>
        </RoboQuickPanel>
      );
      await user.click(screen.getByRole('button', { name: /pin panel open/i }));
      const button = screen.getByRole('button', { name: /unpin panel/i });
      expect(button.querySelector('svg.lucide-pin')).toBeInTheDocument();
      expect(button.querySelector('svg.lucide-satellite')).not.toBeInTheDocument();
    });

    it('applies the primary color treatment to the handle when pinned', async () => {
      const user = userEvent.setup();
      render(
        <RoboQuickPanel>
          <p>Content</p>
        </RoboQuickPanel>
      );
      await user.click(screen.getByRole('button', { name: /pin panel open/i }));
      const button = screen.getByRole('button', { name: /unpin panel/i });
      expect(button.className).toContain('text-[var(--primary)]');
    });
  });

  // ---- Double-click-to-pin — mirrors robo-peek-sheet.test.tsx ----

  describe('double-click-to-pin', () => {
    it('a single click on non-interactive body content does NOT pin the panel', () => {
      render(
        <RoboQuickPanel>
          <p>Just some text</p>
        </RoboQuickPanel>
      );
      fireEvent.mouseEnter(getRoot());
      fireEvent.click(screen.getByText('Just some text'));
      fireEvent.mouseLeave(getRoot());
      expect(getRoot().dataset.expanded).toBe('false');
    });

    it('double-clicking non-interactive body content pins the panel', () => {
      render(
        <RoboQuickPanel>
          <p>Just some text</p>
        </RoboQuickPanel>
      );
      fireEvent.mouseEnter(getRoot());
      fireEvent.doubleClick(screen.getByText('Just some text'));
      fireEvent.mouseLeave(getRoot());
      expect(getRoot().dataset.expanded).toBe('true');
    });

    it('double-clicking an interactive element inside the body does not pin it', () => {
      render(
        <RoboQuickPanel>
          <button type='button'>Do a thing</button>
        </RoboQuickPanel>
      );
      fireEvent.mouseEnter(getRoot());
      fireEvent.doubleClick(screen.getByRole('button', { name: 'Do a thing' }));
      fireEvent.mouseLeave(getRoot());
      expect(getRoot().dataset.expanded).toBe('false');
    });

    it('does nothing extra when double-clicking body content that is already pinned', async () => {
      const onPinnedChange = vi.fn();
      const user = userEvent.setup();
      render(
        <RoboQuickPanel onPinnedChange={onPinnedChange}>
          <p>Just some text</p>
        </RoboQuickPanel>
      );
      await user.click(screen.getByRole('button', { name: /pin panel open/i }));
      onPinnedChange.mockClear();
      fireEvent.doubleClick(screen.getByText('Just some text'));
      expect(onPinnedChange).not.toHaveBeenCalled();
    });
  });

  describe('tooltip', () => {
    it('shows "Double-click to pin" over the handle when unpinned', async () => {
      const user = userEvent.setup();
      render(
        <RoboQuickPanel>
          <p>Body</p>
        </RoboQuickPanel>
      );
      await user.hover(screen.getByRole('button', { name: /pin panel open/i }));
      // Radix renders the tooltip text twice (visible bubble + an SR-only
      // duplicate) — assert at least one match rather than a single one.
      expect((await screen.findAllByText('Double-click to pin')).length).toBeGreaterThan(0);
    });
  });

  // ---- Body background — mirrors robo-peek-sheet.test.tsx ----

  describe('body background', () => {
    it('never applies a bg-[var(--background)] override in solid mode (matches the glass surface convention)', () => {
      render(
        <RoboQuickPanel>
          <p>Content</p>
        </RoboQuickPanel>
      );
      expect(getContent().className).not.toContain('bg-[var(--background)]');
    });

    it('never applies a bg-[var(--background)] override in glass mode', () => {
      render(
        <RoboGlassModeProvider defaultGlassMode>
          <RoboQuickPanel>
            <p>Content</p>
          </RoboQuickPanel>
        </RoboGlassModeProvider>
      );
      expect(getContent().className).not.toContain('bg-[var(--background)]');
    });
  });

  // -------------------------------------------------------------------------
  // transitionVariant — mirrors robo-peek-sheet.test.tsx's coverage. Toggles
  // are driven via `open` (this component's own distinguishing feature and
  // the more natural control for a controlled boolean toggle) rather than
  // clicking the pin handle, though pin/hover still compose into the same
  // `expanded` boolean underneath (via usePeekPin's `extraExpanded: open`).
  // -------------------------------------------------------------------------

  describe('transitionVariant', () => {
    afterEach(() => {
      mockUseReducedMotion.mockReturnValue(false);
    });

    function ToggleHarness({ transitionVariant }: { transitionVariant?: RoboTransitionVariant }) {
      const [open, setOpen] = React.useState(false);
      return (
        <div>
          <button onClick={() => setOpen((o) => !o)}>Toggle open</button>
          <RoboQuickPanel open={open} onOpenChange={setOpen} transitionVariant={transitionVariant}>
            <p>Content</p>
          </RoboQuickPanel>
        </div>
      );
    }

    async function toggleOpen(user: ReturnType<typeof userEvent.setup>) {
      await act(async () => {
        await user.click(screen.getByText('Toggle open'));
      });
    }

    it('renders identically to before when omitted (defaults to "default")', () => {
      render(
        <RoboQuickPanel>
          <p>Content</p>
        </RoboQuickPanel>
      );
      expect(getRoot()).toBeInTheDocument();
      expect(getRoot().dataset.expanded).toBe('false');
    });

    it('renders identically to before when explicitly set to "default"', () => {
      render(
        <RoboQuickPanel transitionVariant='default'>
          <p>Content</p>
        </RoboQuickPanel>
      );
      expect(getRoot()).toBeInTheDocument();
      fireEvent.mouseEnter(getRoot());
      expect(getRoot().dataset.expanded).toBe('true');
    });

    const NON_DEFAULT_VARIANTS: RoboTransitionVariant[] = [
      'curtain-wipe',
      'pixel-dissolve',
      'iris-clip',
      'venetian-blinds',
      'depth-fade',
    ];

    it.each(NON_DEFAULT_VARIANTS)('renders without throwing when transitionVariant="%s"', (variant) => {
      expect(() =>
        render(
          <RoboQuickPanel transitionVariant={variant}>
            <p>Content</p>
          </RoboQuickPanel>
        )
      ).not.toThrow();
      expect(getRoot()).toBeInTheDocument();
    });

    it.each(NON_DEFAULT_VARIANTS)(
      'expands and collapses without throwing when transitionVariant="%s"',
      async (variant) => {
        const user = userEvent.setup();
        render(<ToggleHarness transitionVariant={variant} />);
        await toggleOpen(user);
        expect(getRoot().dataset.expanded).toBe('true');
        await toggleOpen(user);
        expect(getRoot().dataset.expanded).toBe('false');
      }
    );

    describe('with reduced motion enabled', () => {
      beforeEach(() => {
        mockUseReducedMotion.mockReturnValue(true);
      });

      it.each([...NON_DEFAULT_VARIANTS, 'default' as const])(
        'renders and toggles correctly regardless of variant ("%s")',
        async (variant) => {
          const user = userEvent.setup();
          render(<ToggleHarness transitionVariant={variant} />);
          expect(() => getRoot()).not.toThrow();
          await toggleOpen(user);
          expect(getRoot().dataset.expanded).toBe('true');
        }
      );
    });

    describe('masked variants (curtain-wipe / pixel-dissolve / venetian-blinds)', () => {
      // Fake timers instead of a real ~300ms sleep — see robo-peek-sheet.test.tsx
      // for the identical rationale (avoids flakiness risk and noisy
      // "environment not configured to support act(...)" warnings).
      beforeEach(() => {
        vi.useFakeTimers({ shouldAdvanceTime: true });
      });

      afterEach(() => {
        vi.useRealTimers();
      });

      function setupFakeTimerUser() {
        return userEvent.setup({ advanceTimers: vi.advanceTimersByTime, delay: null });
      }

      it('replays the mask overlay on a second toggle, not just the first', async () => {
        const user = setupFakeTimerUser();
        render(<ToggleHarness transitionVariant='curtain-wipe' />);

        // First toggle (peek -> expanded): mask mounts and is visible.
        await toggleOpen(user);
        expect(document.querySelector('[data-slot="curtain-wipe-mask-start"]')).toBeTruthy();

        // Let the mask's unmount-timer fully elapse so it unmounts again.
        // curtain-wipe's delay is a flat tokens.durationNormal (220ms at
        // fallback tokens) — 300ms comfortably covers it.
        await act(async () => {
          await vi.advanceTimersByTimeAsync(300);
        });
        expect(document.querySelector('[data-slot="curtain-wipe-mask-start"]')).toBeFalsy();

        // Second toggle (expanded -> peek) must replay the mask too — this
        // is the exact scenario a naive permanently-mounted <MaskOverlay/>
        // would fail (it would have only animated once, on first render).
        await toggleOpen(user);
        expect(document.querySelector('[data-slot="curtain-wipe-mask-start"]')).toBeTruthy();
      });

      it('replays the mask on a rapid second toggle that arrives before the first cycle unmounts', async () => {
        // Regression test for the same-value setState bail-out bug — see
        // robo-peek-sheet.test.tsx's identical test for the full rationale.
        const user = setupFakeTimerUser();
        render(<ToggleHarness transitionVariant='curtain-wipe' />);

        // First toggle (peek -> expanded): mask mounts.
        await toggleOpen(user);
        const firstMaskNode = document.querySelector('[data-slot="curtain-wipe-mask-start"]');
        expect(firstMaskNode).toBeTruthy();

        // Advance LESS than the unmount delay (220ms at fallback tokens) —
        // the first cycle's mask is still mounted and `visible` is still
        // `true` when the second toggle below fires.
        await act(async () => {
          await vi.advanceTimersByTimeAsync(50);
        });
        expect(document.querySelector('[data-slot="curtain-wipe-mask-start"]')).toBeTruthy();

        // Second toggle (expanded -> peek), fired mid-cycle.
        await toggleOpen(user);

        // The mask element present right after the rapid second toggle must
        // be a genuinely DIFFERENT DOM node than the one from the first
        // toggle — proving a fresh mount actually happened.
        const secondMaskNode = document.querySelector('[data-slot="curtain-wipe-mask-start"]');
        expect(secondMaskNode).toBeTruthy();
        expect(secondMaskNode).not.toBe(firstMaskNode);

        // Let this (fresh, restarted) cycle's timer fully elapse.
        await act(async () => {
          await vi.advanceTimersByTimeAsync(300);
        });
        expect(document.querySelector('[data-slot="curtain-wipe-mask-start"]')).toBeFalsy();

        // A THIRD toggle (peek -> expanded again) must still replay the mask
        // as yet another fresh node.
        await toggleOpen(user);
        const thirdMaskNode = document.querySelector('[data-slot="curtain-wipe-mask-start"]');
        expect(thirdMaskNode).toBeTruthy();
        expect(thirdMaskNode).not.toBe(secondMaskNode);
      });

      it('renders the mask overlay as non-interactive and aria-hidden', async () => {
        const user = setupFakeTimerUser();
        render(<ToggleHarness transitionVariant='curtain-wipe' />);
        await toggleOpen(user);
        // NOTE: the handle's icon `<svg>` also carries its own unrelated
        // `aria-hidden="true"` and comes first in document order, so we
        // can't just grab the first `[aria-hidden="true"]` match — locate
        // the mask cell directly, then walk up to find its aria-hidden
        // ancestor wrapper.
        const maskCell = getRoot().querySelector('[data-slot="curtain-wipe-mask-start"]');
        expect(maskCell).toBeTruthy();
        const hiddenWrapper = maskCell?.closest('[aria-hidden="true"]');
        expect(hiddenWrapper).toBeTruthy();
        expect(maskCell?.parentElement?.className).toContain('pointer-events-none');
      });

      it('no a11y violations with a masked variant expanded', async () => {
        const user = setupFakeTimerUser();
        const { container } = render(<ToggleHarness transitionVariant='venetian-blinds' />);
        await toggleOpen(user);
        expect(await axe(container)).toHaveNoViolations();
      });
    });

    // -------------------------------------------------------------------
    // iris-clip / depth-fade — see robo-peek-sheet.test.tsx's identical
    // comment for why we spy on motion.div's render method rather than
    // asserting DOM styles (JSDOM never drives motion/react's rAF-based
    // animated-style application).
    // -------------------------------------------------------------------

    function spyOnRootMotionDiv() {
      return vi.spyOn(motion.div, 'render');
    }

    function latestRootAnimateProp(spy: ReturnType<typeof spyOnRootMotionDiv>): Record<string, unknown> {
      const calls = spy.mock.calls as unknown as Array<[Record<string, unknown>]>;
      const rootCalls = calls.filter((call) => call[0]?.['data-slot'] === 'quick-panel');
      const last = rootCalls[rootCalls.length - 1];
      return (last?.[0]?.['animate'] ?? {}) as Record<string, unknown>;
    }

    describe('iris-clip', () => {
      it('sets a circular clip-path that changes with the expanded state', async () => {
        const spy = spyOnRootMotionDiv();
        const user = userEvent.setup();
        render(<ToggleHarness transitionVariant='iris-clip' />);
        const collapsedClip = latestRootAnimateProp(spy)['clipPath'];
        expect(collapsedClip).toContain('circle(0%');

        await toggleOpen(user);
        const expandedClip = latestRootAnimateProp(spy)['clipPath'];
        expect(expandedClip).toContain('circle(150%');
        expect(expandedClip).not.toBe(collapsedClip);

        spy.mockRestore();
      });
    });

    describe('depth-fade', () => {
      it('applies expanded-dependent scale/opacity/blur that differ between peek and expanded', async () => {
        const spy = spyOnRootMotionDiv();
        const user = userEvent.setup();
        render(<ToggleHarness transitionVariant='depth-fade' />);
        const collapsed = latestRootAnimateProp(spy);
        expect(collapsed['scale']).toBeDefined();
        expect(collapsed['filter']).toBeDefined();

        await toggleOpen(user);
        const expanded = latestRootAnimateProp(spy);

        // Expanded ("revealed") should read as the crisp, fully-scaled,
        // unblurred look; peek ("receded") should read as the subtly
        // scaled-down, blurred look — derived from buildDepthFade's
        // `animate`/`exit` values respectively (see the depth-fade
        // reinterpretation comment in robo-quick-panel.tsx).
        expect(expanded['scale']).not.toBe(collapsed['scale']);
        expect(expanded['filter']).not.toBe(collapsed['filter']);
        expect(expanded['scale']).toBe(1);
        expect(expanded['filter']).toBe('blur(0px)');

        spy.mockRestore();
      });
    });
  });
});
