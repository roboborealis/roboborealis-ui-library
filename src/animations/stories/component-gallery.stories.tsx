import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';

import { RoboAccordion, RoboAccordionItem, RoboAccordionTrigger, RoboAccordionContent } from '@/core/accordion/robo-accordion';
import { RoboButton } from '@/core/button/robo-button';
import { RoboCard, RoboCardHeader, RoboCardBody } from '@/core/card/robo-card';
import { RoboAlert } from '@/feedback/alert/robo-alert';
import { RoboBadge } from '@/core/badge/robo-badge';
import { RoboChip } from '@/core/chip/robo-chip';
import { RoboAvatar } from '@/core/avatar/robo-avatar';
import { RoboProgress } from '@/feedback/progress/robo-progress';
import { RoboStatCard } from '@/charts/stat-card/robo-stat-card';
import {
  RoboDialog,
  RoboDialogTrigger,
  RoboDialogContent,
  RoboDialogHeader,
  RoboDialogTitle,
  RoboDialogDescription,
} from '@/feedback/dialog/robo-dialog';
import {
  RoboSelect,
  RoboSelectTrigger,
  RoboSelectContent,
  RoboSelectItem,
  RoboSelectValue,
} from '@/forms/select/robo-select';
import { RoboToastProvider, useRoboToast } from '@/feedback/toast/robo-toast';

import { RoboStagger }       from '../primitives/robo-stagger';
import { RoboFadeIn }        from '../primitives/robo-fade';
import { RoboTextEffect }    from '../advanced/robo-text-effect';
import { RoboNumberTicker }  from '../advanced/robo-number-ticker';

// ---------------------------------------------------------------------------

const meta: Meta = {
  title: 'Foundation/Animations/Component Gallery',
  parameters: { layout: 'padded' },
};
export default meta;

// ---------------------------------------------------------------------------
// Accordion: auto-opens/closes on loop
// ---------------------------------------------------------------------------
export const AccordionAnimation: StoryObj = {
  name: 'Accordion — auto open/close',
  render: () => {
    const items = ['satellite-status', 'incident-history', 'ground-passes'];
    const [open, setOpen] = React.useState<string>('');
    const [idx, setIdx] = React.useState(0);
    const [paused, setPaused] = React.useState(false);

    React.useEffect(() => {
      if (paused) return;
      const id = setInterval(() => {
        setIdx((i) => {
          const next = (i + 1) % (items.length + 1);
          setOpen(next < items.length ? items[next] : '');
          return next;
        });
      }, 1800);
      return () => clearInterval(id);
    }, [paused]);

    return (
      <div className='max-w-md relative'>
        <RoboAccordion type='single' value={open} onValueChange={setOpen} collapsible>
          <RoboAccordionItem value='satellite-status'>
            <RoboAccordionTrigger>Satellite Status</RoboAccordionTrigger>
            <RoboAccordionContent>
              <div className='text-sm text-[var(--muted-foreground)]'>
                247 satellites active · 3 in anomaly · 12 awaiting deployment
              </div>
            </RoboAccordionContent>
          </RoboAccordionItem>
          <RoboAccordionItem value='incident-history'>
            <RoboAccordionTrigger>Incident History</RoboAccordionTrigger>
            <RoboAccordionContent>
              <div className='text-sm text-[var(--muted-foreground)]'>
                42 incidents this week · 8 resolved · 6 pending review
              </div>
            </RoboAccordionContent>
          </RoboAccordionItem>
          <RoboAccordionItem value='ground-passes'>
            <RoboAccordionTrigger>Ground Passes</RoboAccordionTrigger>
            <RoboAccordionContent>
              <div className='text-sm text-[var(--muted-foreground)]'>
                Next 24h: 18 passes · 14 downlinks · 3 reschedules
              </div>
            </RoboAccordionContent>
          </RoboAccordionItem>
        </RoboAccordion>
        <button
          onClick={() => setPaused((p) => !p)}
          className='absolute top-0 right-0 px-2 py-1 text-xs rounded bg-[var(--muted)] text-[var(--muted-foreground)]'
        >
          {paused ? '▶ Resume' : '⏸ Pause'}
        </button>
      </div>
    );
  },
};

// ---------------------------------------------------------------------------
// Dialog: open/close on button click
// ---------------------------------------------------------------------------
export const DialogAnimation: StoryObj = {
  name: 'Dialog — open/close animation',
  render: () => (
    <div className='flex flex-col gap-4 items-start'>
      <p className='text-sm text-[var(--muted-foreground)]'>
        Click to see the zoom-in + fade-in entrance animation:
      </p>
      <RoboDialog>
        <RoboDialogTrigger asChild>
          <RoboButton>Open Constellation Report</RoboButton>
        </RoboDialogTrigger>
        <RoboDialogContent>
          <RoboDialogHeader>
            <RoboDialogTitle>Constellation Report — June 2026</RoboDialogTitle>
            <RoboDialogDescription>
              Summary of constellation activity for the last 30 days.
            </RoboDialogDescription>
          </RoboDialogHeader>
          <div className='mt-4 text-sm text-[var(--muted-foreground)]'>
            <p>Active missions: 247 · Completed: 1,842 · Incidents: 42</p>
          </div>
        </RoboDialogContent>
      </RoboDialog>
    </div>
  ),
};

// ---------------------------------------------------------------------------
// Select: popover open/close
// ---------------------------------------------------------------------------
export const SelectAnimation: StoryObj = {
  name: 'Select — popover animation (click dropdown)',
  render: () => (
    <div className='flex flex-col gap-4'>
      <p className='text-sm text-[var(--muted-foreground)]'>
        Open the dropdown to see the slide-in/fade-in popover animation:
      </p>
      <RoboSelect>
        <RoboSelectTrigger className='w-[220px]'>
          <RoboSelectValue placeholder='Select satellite type...' />
        </RoboSelectTrigger>
        <RoboSelectContent>
          <RoboSelectItem value='cargo'>Cargo</RoboSelectItem>
          <RoboSelectItem value='probe'>Probe</RoboSelectItem>
          <RoboSelectItem value='passenger'>Passenger</RoboSelectItem>
          <RoboSelectItem value='fishing'>Fishing</RoboSelectItem>
          <RoboSelectItem value='tug'>Tug</RoboSelectItem>
        </RoboSelectContent>
      </RoboSelect>
    </div>
  ),
};

// ---------------------------------------------------------------------------
// Toast: auto-fires on loop
// ---------------------------------------------------------------------------
function ToastDemo() {
  const { toast } = useRoboToast();
  const messages = [
    { title: 'Signal acquired', description: 'Voyager 1 — Deep Space Network' },
    { title: 'Incident resolved', description: 'Alert #2847 closed by Ops team' },
    { title: 'New mission started', description: 'Orbiter Orion — launch → orbit' },
    { title: 'Conjunction alert', description: 'Collision avoidance activated — LEO track 6721', variant: 'error' as const },
  ];
  const [msgIdx, setMsgIdx] = React.useState(0);
  const [paused, setPaused] = React.useState(false);

  React.useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setMsgIdx((i) => {
        const next = (i + 1) % messages.length;
        const m = messages[next];
        toast({ title: m.title, description: m.description, variant: m.variant });
        return next;
      });
    }, 3000);
    return () => clearInterval(id);
  }, [paused, toast]);

  return (
    <div className='flex flex-col gap-4 items-start'>
      <button
        onClick={() => setPaused((p) => !p)}
        className='px-3 py-1.5 text-sm rounded bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--accent)] transition-colors'
      >
        {paused ? '▶ Resume (auto-fires every 3s)' : '⏸ Pause toasts'}
      </button>
      <p className='text-xs text-[var(--muted-foreground)]'>
        Toasts slide up from the bottom right corner
      </p>
    </div>
  );
}

export const ToastAnimation: StoryObj = {
  name: 'Toast — slide-in from bottom, auto-firing',
  render: () => (
    <RoboToastProvider>
      <ToastDemo />
    </RoboToastProvider>
  ),
};

// ---------------------------------------------------------------------------
// Buttons: hover/focus transition-colors
// ---------------------------------------------------------------------------
export const ButtonAnimations: StoryObj = {
  name: 'Buttons — hover transition-colors',
  render: () => (
    <div className='flex flex-col gap-6 p-2'>
      <p className='text-sm text-[var(--muted-foreground)]'>
        Hover each button to see the color transition (theme-speed aware):
      </p>
      <div className='flex flex-wrap gap-3'>
        <RoboButton>Default</RoboButton>
        <RoboButton variant='secondary'>Secondary</RoboButton>
        <RoboButton variant='tertiary'>Tertiary</RoboButton>
        <RoboButton variant='outline'>Outline</RoboButton>
        <RoboButton variant='ghost'>Ghost</RoboButton>
        <RoboButton variant='destructive'>Destructive</RoboButton>
      </div>
      <div className='flex flex-wrap gap-3'>
        <RoboButton size='sm'>Small</RoboButton>
        <RoboButton size='md'>Medium</RoboButton>
        <RoboButton size='lg'>Large</RoboButton>
      </div>
    </div>
  ),
};

// ---------------------------------------------------------------------------
// Dashboard: composite (all animations together)
// ---------------------------------------------------------------------------
export const DashboardComposite: StoryObj = {
  name: 'Dashboard — composite (all animations working together)',
  render: () => {
    const [activeSatellites, setActiveSatellites] = React.useState(247);
    const [incidents, setIncidents] = React.useState(42);
    const [cycle, setCycle] = React.useState(0);
    const [paused, setPaused] = React.useState(false);

    React.useEffect(() => {
      if (paused) return;
      const id = setInterval(() => {
        setActiveSatellites((v) => v + Math.floor(Math.random() * 5) - 2);
        setIncidents((v) => Math.max(0, v + Math.floor(Math.random() * 3) - 1));
        setCycle((c) => c + 1);
      }, 3000);
      return () => clearInterval(id);
    }, [paused]);

    const recentItems = [
      'Voyager 1 acquired — Deep Space Network',
      'Alert #2847 resolved by Ops',
      'Orion departed — Mars transfer',
      'Space weather advisory: solar flare',
    ];

    return (
      <div className='max-w-2xl relative'>
        <button
          onClick={() => setPaused((p) => !p)}
          className='absolute top-0 right-0 px-2 py-1 text-xs rounded bg-[var(--muted)] text-[var(--muted-foreground)] z-10'
        >
          {paused ? '▶ Resume' : '⏸ Pause'}
        </button>

        <RoboTextEffect
          text='Constellation Operations'
          variant='slide-up'
          as='h2'
          className='text-2xl font-bold text-[var(--foreground)] mb-6'
        />

        <div className='grid grid-cols-3 gap-4 mb-6'>
          <RoboCard>
            <RoboCardHeader>
              <p className='text-xs uppercase tracking-widest text-[var(--muted-foreground)]'>
                Active Satellites
              </p>
            </RoboCardHeader>
            <RoboCardBody>
              <RoboNumberTicker
                value={activeSatellites}
                className='text-3xl font-bold text-[var(--primary)]'
              />
            </RoboCardBody>
          </RoboCard>
          <RoboCard>
            <RoboCardHeader>
              <p className='text-xs uppercase tracking-widest text-[var(--muted-foreground)]'>
                Open Incidents
              </p>
            </RoboCardHeader>
            <RoboCardBody>
              <RoboNumberTicker
                value={incidents}
                className='text-3xl font-bold text-[var(--warning-text)]'
              />
            </RoboCardBody>
          </RoboCard>
          <RoboCard>
            <RoboCardHeader>
              <p className='text-xs uppercase tracking-widest text-[var(--muted-foreground)]'>
                Ports Monitored
              </p>
            </RoboCardHeader>
            <RoboCardBody>
              <RoboNumberTicker
                value={18}
                className='text-3xl font-bold text-[var(--success-text)]'
              />
            </RoboCardBody>
          </RoboCard>
        </div>

        <RoboFadeIn key={`header-${cycle}`} preset='subtle'>
          <h3 className='text-sm font-semibold text-[var(--foreground)] mb-3'>
            Recent Activity
          </h3>
        </RoboFadeIn>
        <RoboStagger key={`stagger-${cycle}`} className='flex flex-col gap-2'>
          {recentItems.map((item, i) => (
            <div
              key={i}
              className='px-3 py-2 bg-[var(--card)] rounded border border-[var(--border)] text-sm text-[var(--foreground)]'
            >
              {item}
            </div>
          ))}
        </RoboStagger>
      </div>
    );
  },
};

// ---------------------------------------------------------------------------
// Phase 1–3 built-in animate* props showcase
// ---------------------------------------------------------------------------
export const BuiltInAnimateProps: StoryObj = {
  name: 'Built-in animate* props — Phase 1–3 showcase',
  render: () => {
    const [cycle, setCycle] = React.useState(0);
    const [paused, setPaused] = React.useState(false);

    React.useEffect(() => {
      if (paused) return;
      const id = setInterval(() => setCycle((c) => c + 1), 3200);
      return () => clearInterval(id);
    }, [paused]);

    return (
      <div className='flex flex-col gap-6 max-w-2xl relative'>
        <button
          onClick={() => setPaused((p) => !p)}
          className='absolute top-0 right-0 px-2 py-1 text-xs rounded bg-[var(--muted)] text-[var(--muted-foreground)]'
        >
          {paused ? '▶ Resume' : '⏸ Pause'}
        </button>

        {/* RoboStatCard — animateEntrance + animateValue */}
        <div className='flex flex-wrap gap-4'>
          <RoboStatCard
            key={`stat-${cycle}`}
            label='Active Satellites'
            value={247}
            animateEntrance
            animateValue
            className='min-w-[160px]'
          />
          <RoboStatCard
            key={`stat2-${cycle}`}
            label='Alerts'
            value={12}
            animateEntrance
            animateValue
            change={3}
            changeLabel='since yesterday'
            className='min-w-[160px]'
          />
        </div>

        {/* RoboAlert — animate */}
        <RoboAlert key={`alert-${cycle}`} animate variant='warning' title='Space Weather Advisory'>
          Solar storm forecast for polar orbit — 12 satellites in affected zone.
        </RoboAlert>

        {/* RoboProgress — animateEntrance */}
        <RoboProgress key={`prog-${cycle}`} animateEntrance value={68} label='Constellation Coverage' showValue />

        {/* RoboCard — animateEntrance */}
        <RoboCard key={`card-${cycle}`} animateEntrance className='p-4'>
          <RoboCardHeader>
            <p className='text-xs uppercase tracking-widest text-[var(--muted-foreground)]'>Ground Stations</p>
          </RoboCardHeader>
          <RoboCardBody>
            <p className='text-3xl font-bold text-[var(--primary)]'>18</p>
          </RoboCardBody>
        </RoboCard>

        {/* RoboBadge + RoboChip + RoboAvatar row */}
        <div className='flex flex-wrap gap-3 items-center'>
          <RoboBadge key={`badge-${cycle}`} animate color='primary'>TLM</RoboBadge>
          <RoboBadge key={`badge2-${cycle}`} animate color='red' style={{ animationDelay: '80ms' }}>ALERT</RoboBadge>
          <RoboChip key={`chip-${cycle}`} animate label='Monitoring' />
          <RoboChip key={`chip2-${cycle}`} animate label='AOS' style={{ animationDelay: '80ms' }} />
          <RoboAvatar key={`av-${cycle}`} animateEntrance name='Voyager' size='md' />
        </div>
      </div>
    );
  },
};
