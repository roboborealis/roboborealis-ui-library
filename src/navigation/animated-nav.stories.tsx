import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import {
  Map,
  FileText,
  Satellite,
  Bell,
  Settings,
  Search,
  BarChart2,
  LogOut,
  Users,
} from 'lucide-react';

import { RoboTopbar } from './topbar/robo-topbar';
import { RoboBottomNav } from './bottom-nav/robo-bottom-nav';
import { RoboCommandPalette, type CommandGroup } from './command-palette/robo-command-palette';

import { RoboFadeIn } from '@/animations/primitives/robo-fade';
import { RoboSlideIn } from '@/animations/primitives/robo-slide';
import { Looping } from '@/animations/stories/looping-helper';

// ---------------------------------------------------------------------------

const meta: Meta = {
  title: 'Components/Animated Navigation',
  parameters: { layout: 'padded' },
};
export default meta;

// ---------------------------------------------------------------------------
// Shared data
// ---------------------------------------------------------------------------

const bottomNavItems = [
  { label: 'Map', icon: <Map size={20} />, href: '/map' },
  { label: 'Reports', icon: <FileText size={20} />, href: '/reports' },
  { label: 'Satellites', icon: <Satellite size={20} />, href: '/satellites' },
  { label: 'Alerts', icon: <Bell size={20} />, href: '/alerts' },
  { label: 'Settings', icon: <Settings size={20} />, href: '/settings' },
];

const commandGroups: CommandGroup[] = [
  {
    heading: 'Navigation',
    items: [
      { id: 'map', label: 'Live Map', icon: <Map className='h-4 w-4' />, shortcut: 'G M', onSelect: () => undefined },
      { id: 'satellites', label: 'Satellite Registry', icon: <Satellite className='h-4 w-4' />, shortcut: 'G V', onSelect: () => undefined },
      { id: 'reports', label: 'Reports', icon: <FileText className='h-4 w-4' />, shortcut: 'G R', onSelect: () => undefined },
      { id: 'analytics', label: 'Analytics', icon: <BarChart2 className='h-4 w-4' />, onSelect: () => undefined },
    ],
  },
  {
    heading: 'Actions',
    items: [
      { id: 'new-report', label: 'New Mission Report', icon: <FileText className='h-4 w-4' />, shortcut: 'N R', onSelect: () => undefined },
      { id: 'search', label: 'Search Satellites', icon: <Search className='h-4 w-4' />, onSelect: () => undefined },
    ],
  },
  {
    heading: 'Account',
    items: [
      { id: 'profile', label: 'My Profile', icon: <Users className='h-4 w-4' />, onSelect: () => undefined },
      { id: 'logout', label: 'Sign Out', icon: <LogOut className='h-4 w-4' />, onSelect: () => undefined },
    ],
  },
];

// ---------------------------------------------------------------------------
// RoboTopbar — RoboFadeIn standard
// ---------------------------------------------------------------------------
export const TopbarEntrance: StoryObj = {
  name: 'RoboTopbar — fade-in entrance',
  render: () => (
    <Looping>
      <RoboFadeIn preset='standard'>
        <RoboTopbar
          logo={<span className='font-bold text-base'>Acme</span>}
          navLinks={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Reports', href: '/reports' },
            { label: 'Constellation', href: '/constellation' },
          ]}
          userMenu={
            <div className='w-8 h-8 rounded-full bg-[var(--primary)] flex items-center justify-center text-[var(--primary-foreground)] text-xs font-bold'>
              MT
            </div>
          }
        />
      </RoboFadeIn>
    </Looping>
  ),
};

// ---------------------------------------------------------------------------
// RoboBottomNav — RoboSlideIn from bottom
// ---------------------------------------------------------------------------
export const BottomNavEntrance: StoryObj = {
  name: 'RoboBottomNav — slide-in from bottom',
  render: () => (
    <Looping>
      <RoboSlideIn from='bottom'>
        <RoboBottomNav items={bottomNavItems} activeHref='/map' />
      </RoboSlideIn>
    </Looping>
  ),
};

// ---------------------------------------------------------------------------
// RoboCommandPalette — open/close — RoboFadeIn around trigger
// ---------------------------------------------------------------------------
function CommandPaletteDemo() {
  const [open, setOpen] = React.useState(false);
  const [paused, setPaused] = React.useState(false);

  React.useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setOpen((v) => !v), 2500);
    return () => clearInterval(id);
  }, [paused]);

  return (
    <div className='relative h-[420px] flex flex-col items-center justify-start gap-4 pt-8'>
      <RoboFadeIn preset='subtle'>
        <p className='text-sm text-[var(--muted-foreground)]'>
          Command palette auto-opens/closes to show the dialog animation.
        </p>
      </RoboFadeIn>
      <button
        onClick={() => setPaused((p) => !p)}
        className='px-3 py-1.5 text-sm rounded bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--accent)] transition-colors'
      >
        {paused ? '▶ Resume' : '⏸ Pause'}
      </button>
      <RoboCommandPalette
        open={open}
        onOpenChange={setOpen}
        groups={commandGroups}
        placeholder='Search satellites, reports, actions...'
      />
    </div>
  );
}

export const CommandPaletteAnimation: StoryObj = {
  name: 'RoboCommandPalette — dialog open/close animation',
  render: () => <CommandPaletteDemo />,
};
