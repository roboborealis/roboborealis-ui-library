import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Layers as LayersIcon } from 'lucide-react';

import {
  RoboQuickPanel,
  RoboQuickPanelHeader,
  RoboQuickPanelTitle,
  RoboQuickPanelBody,
  RoboQuickPanelPinButton,
  useRoboQuickPanel,
} from './robo-quick-panel';
import { RoboTabs, RoboTabsList, RoboTabsTrigger, RoboTabsContent } from '../tabs/robo-tabs';
import { RoboGlassModeProvider } from '@/core/providers/robo-glass-mode-provider';
import { RoboBadge } from '@/core/badge/robo-badge';
import { RoboButton } from '@/core/button/robo-button';
import { cn } from '@/lib/utils';
import type { RoboTransitionVariant } from '@/animations';

// ---------------------------------------------------------------------------
// Generic app background — deliberately not a map (RoboQuickPanel is a
// navigation-layer component, not maps-specific), unlike RoboPeekSheet's
// stories which use a MockMap/MapBackground. `translateZ(0)` establishes a
// containing block so the panel's `position: fixed` root stays scoped to
// this demo box instead of the full page.
// ---------------------------------------------------------------------------

function AppBackground({ height = 480, children }: { height?: number; children?: React.ReactNode }) {
  return (
    <div
      style={{
        position: 'relative',
        height,
        background: 'var(--muted)',
        borderRadius: 'var(--radius)',
        overflow: 'hidden',
        transform: 'translateZ(0)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <p style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem', margin: 0 }}>App content</p>
      {children}
    </div>
  );
}

const RECENT_ITEMS = ['Voyager 1', 'Cassini', 'Kepler'];
const NOTIFICATIONS = ['New alert near VOY-1042', 'Item Alpha entered active status', 'Report FR-2291 submitted'];

function QuickPanelLayersDemo() {
  const [checked, setChecked] = React.useState<Record<string, boolean>>({ debris: true, links: true });
  const groups = [
    { id: 'threats', label: 'Orbital threats', color: '#dc2626', layers: [{ id: 'debris', label: 'Debris fields' }] },
    { id: 'infra', label: 'Infrastructure', color: '#16a34a', layers: [{ id: 'links', label: 'Ground station links' }] },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {groups.map((group) => (
        <div key={group.id}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <span aria-hidden='true' style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: group.color }} />
            <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>{group.label}</span>
          </div>
          {group.layers.map((layer) => (
            <label key={layer.id} style={{ display: 'flex', alignItems: 'center', gap: 8, paddingLeft: 14, fontSize: '0.8125rem' }}>
              <input
                type='checkbox'
                checked={checked[layer.id] ?? false}
                onChange={(e) => setChecked((prev) => ({ ...prev, [layer.id]: e.target.checked }))}
              />
              <span>{layer.label}</span>
            </label>
          ))}
        </div>
      ))}
    </div>
  );
}

/**
 * The four Storybook demo tabs specified for this component: Recent /
 * favorites, Notifications / activity (with a RoboBadge count), Quick
 * settings, and Layers. Demo-only content, not shipped as part of the
 * library — RoboQuickPanel itself ships as a content-agnostic shell.
 */
function DemoTabs() {
  const { activeTab, setActiveTab } = useRoboQuickPanel();
  return (
    <RoboTabs value={activeTab} onValueChange={setActiveTab}>
      <RoboTabsList variant='pill'>
        <RoboTabsTrigger variant='pill' value='recent'>Recent</RoboTabsTrigger>
        <RoboTabsTrigger variant='pill' value='notifications' style={{ gap: 6 }}>
          Notifications
          <RoboBadge usage='count' color='destructive' size='sm' count={3} aria-label='Notifications: 3 unread' />
        </RoboTabsTrigger>
        <RoboTabsTrigger variant='pill' value='settings'>Settings</RoboTabsTrigger>
        <RoboTabsTrigger variant='pill' value='layers'>Layers</RoboTabsTrigger>
      </RoboTabsList>

      <RoboTabsContent value='recent'>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {RECENT_ITEMS.map((item) => (
            <p key={item} style={{ margin: 0, fontSize: '0.8125rem' }}>{item}</p>
          ))}
        </div>
      </RoboTabsContent>

      <RoboTabsContent value='notifications'>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {NOTIFICATIONS.map((n) => (
            <p key={n} style={{ margin: 0, fontSize: '0.8125rem' }}>{n}</p>
          ))}
        </div>
      </RoboTabsContent>

      <RoboTabsContent value='settings'>
        <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--muted-foreground)' }}>
          Quick toggles for your most-used settings would live here.
        </p>
      </RoboTabsContent>

      <RoboTabsContent value='layers'>
        <QuickPanelLayersDemo />
      </RoboTabsContent>
    </RoboTabs>
  );
}

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

export const componentMeta = {
  description: 'A peek-docked, pinnable, tabbed utility panel that can be summoned from anywhere in the app — shortcuts, recents, notifications, quick settings.',
  category: 'navigation' as const,
  keywords: ['quick panel', 'utility panel', 'peek', 'pin', 'sidebar', 'tabs', 'shortcuts', 'notifications', 'keybind', 'cmd+/'],
  whenToUse: 'For an always-available, app-wide utility surface a user can peek at, pin open, or summon via keyboard shortcut — not for page-specific content',
  whenNotToUse: 'For a page-scoped click-triggered overlay use RoboSheet; for map-only glanceable overlays use RoboPeekSheet; for a command/search launcher use RoboCommandPalette',
  pairsWith: ['RoboTabs', 'RoboTopbar', 'RoboCommandPalette', 'RoboBadge', 'RoboKeybindProvider'],
  a11y: 'role="complementary" landmark, not a modal dialog — no focus trap; peek/pin handle is a real <button> with aria-pressed (single click, independent of hover) and a tooltip explaining the double-click-to-pin gesture on the body; supports controlled open/onOpenChange for external keybind toggling with an aria-live announcement on programmatic open/close',
};

const meta: Meta<typeof RoboQuickPanel> = {
  title: 'Components/Navigation/RoboQuickPanel',
  excludeStories: ['componentMeta'],
  component: RoboQuickPanel,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    side: { control: 'radio', options: ['top', 'right', 'bottom', 'left'] },
    peekSize: { control: { type: 'number', min: 12, max: 48, step: 2 } },
    transparent: { control: 'boolean' },
  },
};
export default meta;

type Story = StoryObj<typeof RoboQuickPanel>;

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

export const Default: Story = {
  render: () => (
    <AppBackground>
      <RoboQuickPanel side='right' icon={<LayersIcon className='h-4 w-4' />}>
        <RoboQuickPanelHeader>
          <RoboQuickPanelTitle>Quick panel</RoboQuickPanelTitle>
          <RoboQuickPanelPinButton />
        </RoboQuickPanelHeader>
        <RoboQuickPanelBody>
          <p style={{ margin: 0, fontSize: '0.8125rem' }}>
            Hover the edge to peek. Double-click here (or click the pin icon) to pin it open.
          </p>
        </RoboQuickPanelBody>
      </RoboQuickPanel>
    </AppBackground>
  ),
};

export const Pinned: Story = {
  render: () => (
    <AppBackground>
      <RoboQuickPanel side='right' icon={<LayersIcon className='h-4 w-4' />} pinned>
        <RoboQuickPanelHeader>
          <RoboQuickPanelTitle>Quick panel</RoboQuickPanelTitle>
          <RoboQuickPanelPinButton />
        </RoboQuickPanelHeader>
        <RoboQuickPanelBody>
          <p style={{ margin: 0, fontSize: '0.8125rem' }}>Starts pinned open.</p>
        </RoboQuickPanelBody>
      </RoboQuickPanel>
    </AppBackground>
  ),
};

export const PillTabs: Story = {
  name: 'Pill Tabs',
  render: () => (
    <AppBackground height={420}>
      <RoboQuickPanel side='right' pinned defaultActiveTab='recent'>
        <RoboQuickPanelHeader>
          <RoboQuickPanelTitle>Quick panel</RoboQuickPanelTitle>
          <RoboQuickPanelPinButton />
        </RoboQuickPanelHeader>
        <RoboQuickPanelBody>
          <DemoTabs />
        </RoboQuickPanelBody>
      </RoboQuickPanel>
    </AppBackground>
  ),
};

export const KitchenSink: Story = {
  name: 'Kitchen Sink — 4 Demo Tabs',
  render: () => (
    <AppBackground height={480}>
      <RoboQuickPanel side='right' pinned defaultActiveTab='recent'>
        <RoboQuickPanelHeader>
          <RoboQuickPanelTitle>Quick panel</RoboQuickPanelTitle>
          <RoboQuickPanelPinButton />
        </RoboQuickPanelHeader>
        <RoboQuickPanelBody>
          <DemoTabs />
        </RoboQuickPanelBody>
      </RoboQuickPanel>
    </AppBackground>
  ),
};

export const Transparent: Story = {
  name: 'Transparent (Glass)',
  render: () => (
    <RoboGlassModeProvider defaultGlassMode>
      <AppBackground>
        <RoboQuickPanel side='right' icon={<LayersIcon className='h-4 w-4' />}>
          <RoboQuickPanelHeader>
            <RoboQuickPanelTitle>Quick panel</RoboQuickPanelTitle>
            <RoboQuickPanelPinButton />
          </RoboQuickPanelHeader>
          <RoboQuickPanelBody>
            <p style={{ margin: 0, fontSize: '0.8125rem' }}>Glass surface.</p>
          </RoboQuickPanelBody>
        </RoboQuickPanel>
      </AppBackground>
    </RoboGlassModeProvider>
  ),
};

export const Playground: Story = {
  args: { side: 'right', peekSize: 20, transparent: false },
  render: (args) => (
    <AppBackground>
      <RoboQuickPanel {...args} icon={<LayersIcon className='h-4 w-4' />}>
        <RoboQuickPanelHeader>
          <RoboQuickPanelTitle>Quick panel</RoboQuickPanelTitle>
          <RoboQuickPanelPinButton />
        </RoboQuickPanelHeader>
        <RoboQuickPanelBody>
          <p style={{ margin: 0, fontSize: '0.8125rem' }}>Playground content.</p>
        </RoboQuickPanelBody>
      </RoboQuickPanel>
    </AppBackground>
  ),
};

/**
 * Demonstrates the controlled `open`/`onOpenChange` and
 * `activeTab`/`onActiveTabChange` contract a real keybind handler would
 * drive — standing in for `useKeybind` since a live global listener isn't
 * practical inside a Storybook iframe. This is the exact shape
 * `AppShellTemplate` wires up for real via `RoboKeybindProvider`.
 */
export const ControlledOpen: Story = {
  name: 'Controlled Open + Active Tab (keybind contract demo)',
  render: () => {
    function Demo() {
      const [open, setOpen] = React.useState(false);
      const [activeTab, setActiveTab] = React.useState('recent');
      return (
        <AppBackground height={420}>
          <div style={{ position: 'absolute', top: 12, left: 12, zIndex: 60, display: 'flex', gap: 8 }}>
            <RoboButton size='sm' onClick={() => setOpen((o) => !o)}>
              Toggle (simulates Cmd+/)
            </RoboButton>
            <RoboButton
              size='sm'
              variant='outline'
              onClick={() => {
                setOpen(true);
                setActiveTab('layers');
              }}
            >
              Open Layers (simulates L)
            </RoboButton>
          </div>
          <RoboQuickPanel side='right' open={open} onOpenChange={setOpen} activeTab={activeTab} onActiveTabChange={setActiveTab}>
            <RoboQuickPanelHeader>
              <RoboQuickPanelTitle>Quick panel</RoboQuickPanelTitle>
              <RoboQuickPanelPinButton />
            </RoboQuickPanelHeader>
            <RoboQuickPanelBody>
              <DemoTabs />
            </RoboQuickPanelBody>
          </RoboQuickPanel>
        </AppBackground>
      );
    }
    return <Demo />;
  },
};

// ---------------------------------------------------------------------------
// TransitionVariants — manual variant switcher, with the peek<->expand cycle
// driven by a real, toggling `open` boolean rather than <Looping>'s
// remount-on-an-interval trick. Identical rationale to
// robo-peek-sheet.stories.tsx's own `TransitionVariants` story: RoboQuickPanel
// is always mounted and merely *resizes* between peek/expanded — remounting
// it (as <Looping> does by bumping a `key`) doesn't animate anything, since a
// fresh mount just paints instantly at whatever `expanded` happens to
// evaluate to on that first render. `open` is driven here (rather than
// `pinned`, as robo-peek-sheet.stories.tsx does) since it's RoboQuickPanel's
// own distinguishing feature — the controlled "force open" keybind
// integration seam — and composes into the same `expanded` boolean via
// `usePeekPin`'s `extraExpanded` exactly like a toggling `pinned` would.
// ---------------------------------------------------------------------------

const QUICK_PANEL_TRANSITION_VARIANTS: RoboTransitionVariant[] = [
  'default',
  'curtain-wipe',
  'pixel-dissolve',
  'iris-clip',
  'venetian-blinds',
  'depth-fade',
];

const TRANSITION_DEMO_INTERVAL_MS = 1800;

export const TransitionVariants: Story = {
  name: 'Transition Variants',
  render: () => {
    function TransitionVariantsDemo() {
      const [variant, setVariant] = React.useState<RoboTransitionVariant>('default');
      const [open, setOpen] = React.useState(false);
      const [paused, setPaused] = React.useState(false);

      // Ticks `open` false<->true on an interval so `expanded` (from
      // usePeekPin: `pinned || hovering || extraExpanded`) genuinely flips
      // every cycle — this is what actually drives the peek<->expand
      // transition, unlike a hardcoded value or a <Looping> remount (see
      // comment above). Resets to `false` whenever the selected variant
      // changes, so switching variants always starts from a clean "peek"
      // state instead of picking up mid-cycle.
      React.useEffect(() => {
        setOpen(false);
        if (paused) return;
        const id = setInterval(() => setOpen((o) => !o), TRANSITION_DEMO_INTERVAL_MS);
        return () => clearInterval(id);
      }, [variant, paused]);

      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, fontSize: '0.75rem' }}>
            {QUICK_PANEL_TRANSITION_VARIANTS.map((v) => (
              <button
                key={v}
                onClick={() => setVariant(v)}
                className={cn(
                  'px-2 py-1 rounded border text-xs capitalize',
                  variant === v
                    ? 'border-[var(--primary)] text-[var(--primary)]'
                    : 'border-[var(--border)] text-[var(--muted-foreground)]'
                )}
              >
                {v}
              </button>
            ))}
            <button
              onClick={() => setPaused((p) => !p)}
              className='ml-auto px-2 py-1 rounded bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--accent)] transition-colors text-xs'
              aria-label={paused ? 'Resume animation loop' : 'Pause animation loop'}
            >
              {paused ? '▶ Resume' : '⏸ Pause'}
            </button>
          </div>
          <AppBackground height={480}>
            <RoboQuickPanel
              side='right'
              icon={<LayersIcon className='h-4 w-4' />}
              transitionVariant={variant}
              open={open}
              onOpenChange={setOpen}
            >
              <RoboQuickPanelHeader>
                <RoboQuickPanelTitle className='capitalize'>{variant}</RoboQuickPanelTitle>
                <RoboQuickPanelPinButton />
              </RoboQuickPanelHeader>
              <RoboQuickPanelBody>
                <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--muted-foreground)' }}>
                  Cycles peek↔expand automatically every {TRANSITION_DEMO_INTERVAL_MS / 1000}s so the transition
                  replays without manually hovering.
                </p>
              </RoboQuickPanelBody>
            </RoboQuickPanel>
          </AppBackground>
        </div>
      );
    }

    return <TransitionVariantsDemo />;
  },
};
