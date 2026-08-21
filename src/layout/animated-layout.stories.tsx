import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { RoboGrid } from './grid/robo-grid';
import { RoboStack } from './stack/robo-stack';
import { RoboDivider } from './divider/robo-divider';
import { RoboPageShell } from './page-shell/robo-page-shell';

import { RoboFadeIn } from '@/animations/primitives/robo-fade';
import { RoboStagger } from '@/animations/primitives/robo-stagger';
import { RoboSlideIn } from '@/animations/primitives/robo-slide';
import { Looping } from '@/animations/stories/looping-helper';

// ---------------------------------------------------------------------------

const meta: Meta = {
  title: 'Components/Animated Layout',
  parameters: { layout: 'padded' },
};
export default meta;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const placeholderStyle: React.CSSProperties = {
  background: 'color-mix(in oklch, var(--primary) 16%, var(--card))',
  border: '1px solid var(--primary)',
  borderRadius: 'var(--radius-sm)',
  padding: '12px 8px',
  textAlign: 'center',
  fontSize: '0.75rem',
  color: 'var(--foreground)',
};

const boxStyle: React.CSSProperties = {
  background: 'var(--primary)',
  color: 'var(--primary-foreground)',
  borderRadius: 'var(--radius-sm)',
  padding: '8px 16px',
  fontSize: '0.8rem',
  fontFamily: 'var(--font-mono)',
  whiteSpace: 'nowrap',
};

// ---------------------------------------------------------------------------
// RoboGrid — RoboStagger cells
// ---------------------------------------------------------------------------
export const GridEntrance: StoryObj = {
  name: 'RoboGrid — stagger cells',
  render: () => (
    <Looping>
      <RoboGrid cols={3} gap='md' className='max-w-lg'>
        {Array.from({ length: 6 }, (_, i) => (
          <RoboFadeIn key={i} delay={i * 0.06} preset='standard' slideY={12}>
            <div style={placeholderStyle}>Cell {i + 1}</div>
          </RoboFadeIn>
        ))}
      </RoboGrid>
    </Looping>
  ),
};

// ---------------------------------------------------------------------------
// RoboStack — RoboStagger items
// ---------------------------------------------------------------------------
export const StackEntrance: StoryObj = {
  name: 'RoboStack — stagger items',
  render: () => (
    <Looping>
      <RoboStagger>
        <RoboStack direction='row' gap='sm'>
          {['Alpha', 'Bravo', 'Charlie', 'Delta'].map((name) => (
            <div key={name} style={boxStyle}>{name}</div>
          ))}
        </RoboStack>
      </RoboStagger>
    </Looping>
  ),
};

// ---------------------------------------------------------------------------
// RoboDivider — RoboFadeIn + slide content above/below
// ---------------------------------------------------------------------------
export const DividerEntrance: StoryObj = {
  name: 'RoboDivider — fade content sections',
  render: () => (
    <Looping>
      <div className='flex flex-col gap-3 max-w-sm'>
        <RoboSlideIn from='top' delay={0}>
          <p className='text-sm text-[var(--foreground)]'>Constellation Status Overview</p>
        </RoboSlideIn>
        <RoboFadeIn preset='subtle' delay={0.1}>
          <RoboDivider label='Active Routes' />
        </RoboFadeIn>
        <RoboSlideIn from='bottom' delay={0.2}>
          <p className='text-sm text-[var(--muted-foreground)]'>
            247 satellites active · 3 in anomaly · 12 awaiting port entry
          </p>
        </RoboSlideIn>
        <RoboFadeIn preset='subtle' delay={0.3}>
          <RoboDivider label='Alerts' />
        </RoboFadeIn>
        <RoboSlideIn from='bottom' delay={0.4}>
          <p className='text-sm text-[var(--muted-foreground)]'>
            6 open alerts · 2 high severity · 1 SAR anomaly
          </p>
        </RoboSlideIn>
      </div>
    </Looping>
  ),
};

// ---------------------------------------------------------------------------
// RoboPageShell — RoboFadeIn on the whole shell
// ---------------------------------------------------------------------------
export const PageShellEntrance: StoryObj = {
  name: 'RoboPageShell — fade entrance',
  render: () => (
    <Looping>
      <div style={{ height: 280, border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
        <RoboFadeIn preset='standard'>
          <RoboPageShell
            topbar={
              <div className='px-4 py-2 border-b border-[var(--border)] text-sm font-semibold text-[var(--foreground)]'>
                Constellation Operations
              </div>
            }
          >
            <div className='p-6 text-sm text-[var(--muted-foreground)]'>
              Page content fades in with the shell
            </div>
          </RoboPageShell>
        </RoboFadeIn>
      </div>
    </Looping>
  ),
};
