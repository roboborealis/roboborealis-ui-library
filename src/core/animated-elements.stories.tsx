import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';

import { RoboButton } from './button/robo-button';
import { RoboIconButton } from './button/robo-icon-button';
import { RoboActionButton } from './action-button/robo-action-button';
import { RoboCopyButton } from './copy-button/robo-copy-button';
import { RoboSeparator } from './separator/robo-separator';
import { RoboCard, RoboCardBody, RoboCardHeader } from './card/robo-card';
import { RoboBadge } from './badge/robo-badge';

import { RoboFadeIn } from '@/animations/primitives/robo-fade';
import { RoboStagger } from '@/animations/primitives/robo-stagger';
import { RoboScaleIn } from '@/animations/primitives/robo-scale';
import { RoboSlideIn } from '@/animations/primitives/robo-slide';
import { Looping } from '@/animations/stories/looping-helper';

// ---------------------------------------------------------------------------

const meta: Meta = {
  title: 'Elements/Animated Elements',
  parameters: { layout: 'padded' },
};
export default meta;

// ---------------------------------------------------------------------------
// Button group — RoboStagger entrance
// ---------------------------------------------------------------------------
export const ButtonGroupStagger: StoryObj = {
  name: 'RoboButton — group stagger entrance',
  render: () => (
    <Looping>
      <RoboStagger className='flex flex-wrap gap-3'>
        <RoboButton>Default</RoboButton>
        <RoboButton variant='secondary'>Secondary</RoboButton>
        <RoboButton variant='tertiary'>Tertiary</RoboButton>
        <RoboButton variant='outline'>Outline</RoboButton>
        <RoboButton variant='ghost'>Ghost</RoboButton>
        <RoboButton variant='destructive'>Destructive</RoboButton>
      </RoboStagger>
    </Looping>
  ),
};

// ---------------------------------------------------------------------------
// RoboIconButton — RoboScaleIn
// ---------------------------------------------------------------------------
export const IconButtonEntrance: StoryObj = {
  name: 'RoboIconButton — scale entrance',
  render: () => (
    <Looping>
      <div className='flex gap-3'>
        {['Edit', 'Delete', 'Settings', 'Add', 'Close'].map((label, i) => (
          <RoboScaleIn key={label} delay={i * 0.07}>
            <RoboIconButton aria-label={label}>
              <span className='text-xs font-bold'>{label[0]}</span>
            </RoboIconButton>
          </RoboScaleIn>
        ))}
      </div>
    </Looping>
  ),
};

// ---------------------------------------------------------------------------
// RoboActionButton — RoboFadeIn standard
// ---------------------------------------------------------------------------
export const ActionButtonEntrance: StoryObj = {
  name: 'RoboActionButton — fade entrance',
  render: () => (
    <Looping>
      <RoboFadeIn preset='standard'>
        <RoboActionButton
          label='Export Report'
          description='Download the current constellation report as a PDF'
          onClick={() => undefined}
        />
      </RoboFadeIn>
    </Looping>
  ),
};

// ---------------------------------------------------------------------------
// RoboCopyButton — RoboSlideIn
// ---------------------------------------------------------------------------
export const CopyButtonEntrance: StoryObj = {
  name: 'RoboCopyButton — slide-in entrance',
  render: () => (
    <Looping>
      <RoboSlideIn from='left'>
        <div className='flex items-center gap-2 px-3 py-2 bg-[var(--card)] rounded border border-[var(--border)]'>
          <code className='text-sm text-[var(--foreground)]'>NORAD ID: 366998830</code>
          <RoboCopyButton value='366998830' />
        </div>
      </RoboSlideIn>
    </Looping>
  ),
};

// ---------------------------------------------------------------------------
// RoboSeparator — RoboFadeIn subtle between content blocks
// ---------------------------------------------------------------------------
export const SeparatorEntrance: StoryObj = {
  name: 'RoboSeparator — fade-in between content',
  render: () => (
    <Looping>
      <RoboFadeIn preset='subtle'>
        <div className='flex flex-col gap-3 max-w-xs'>
          <p className='text-sm text-[var(--foreground)]'>Constellation Status: Active</p>
          <RoboSeparator />
          <p className='text-sm text-[var(--muted-foreground)]'>Last updated: 2 minutes ago</p>
          <RoboSeparator />
          <p className='text-sm text-[var(--muted-foreground)]'>Satellites tracked: 247</p>
        </div>
      </RoboFadeIn>
    </Looping>
  ),
};

// ---------------------------------------------------------------------------
// RoboBadge — RoboScaleIn group stagger
// ---------------------------------------------------------------------------
export const BadgeGroupStagger: StoryObj = {
  name: 'RoboBadge — scale-in stagger',
  render: () => (
    <Looping>
      <div className='flex flex-wrap gap-2'>
        {[
          { label: 'Telemetry', color: 'primary' as const },
          { label: 'Anomaly', color: 'red' as const },
          { label: 'Station Pass', color: 'green' as const },
          { label: 'Monitoring', color: 'amber' as const },
          { label: 'Archived', color: 'secondary' as const },
        ].map(({ label, color }, i) => (
          <RoboScaleIn key={label} delay={i * 0.08}>
            <RoboBadge color={color}>{label}</RoboBadge>
          </RoboScaleIn>
        ))}
      </div>
    </Looping>
  ),
};

// ---------------------------------------------------------------------------
// RoboCard — RoboFadeIn standard
// ---------------------------------------------------------------------------
export const CardEntrance: StoryObj = {
  name: 'RoboCard — fade entrance',
  render: () => (
    <Looping>
      <RoboFadeIn preset='standard' slideY={16}>
        <RoboCard className='max-w-xs'>
          <RoboCardHeader>
            <p className='text-xs uppercase tracking-widest text-[var(--muted-foreground)]'>
              Active Satellites
            </p>
          </RoboCardHeader>
          <RoboCardBody>
            <p className='text-3xl font-bold text-[var(--primary)]'>247</p>
          </RoboCardBody>
        </RoboCard>
      </RoboFadeIn>
    </Looping>
  ),
};
