import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';

import { RoboFadeIn }          from '../primitives/robo-fade';
import { RoboSlideIn }         from '../primitives/robo-slide';
import { RoboScaleIn }         from '../primitives/robo-scale';
import { RoboStagger }         from '../primitives/robo-stagger';
import { RoboNumberTicker }    from '../advanced/robo-number-ticker';
import { RoboTextEffect }      from '../advanced/robo-text-effect';
import { RoboTransitionPanel } from '../advanced/robo-transition-panel';

import { Looping } from './looping-helper';

// ---------------------------------------------------------------------------

const meta: Meta = {
  title: 'Foundation/Animations',
  parameters: { layout: 'padded' },
};
export default meta;

export const FadeIn: StoryObj = {
  name: 'RoboFadeIn — looping',
  render: () => (
    <Looping>
      <div className='flex flex-col gap-4 p-2'>
        <RoboFadeIn preset='subtle'>
          <div className='p-4 bg-[var(--card)] rounded border border-[var(--border)]'>
            Subtle (fast, opacity only)
          </div>
        </RoboFadeIn>
        <RoboFadeIn preset='standard' slideY={16}>
          <div className='p-4 bg-[var(--card)] rounded border border-[var(--border)]'>
            Standard (normal, fade + slide 16px)
          </div>
        </RoboFadeIn>
        <RoboFadeIn preset='expressive' slideY={24}>
          <div className='p-4 bg-[var(--card)] rounded border border-[var(--border)]'>
            Expressive (spring, slide 24px)
          </div>
        </RoboFadeIn>
      </div>
    </Looping>
  ),
};

export const SlideIn: StoryObj = {
  name: 'RoboSlideIn — all directions, looping',
  render: () => (
    <Looping>
      <div className='grid grid-cols-2 gap-4 p-2'>
        {(['top', 'bottom', 'left', 'right'] as const).map((dir, i) => (
          <RoboSlideIn key={dir} from={dir} delay={i * 0.06}>
            <div className='p-4 bg-[var(--card)] rounded border border-[var(--border)] text-center text-sm'>
              from {dir}
            </div>
          </RoboSlideIn>
        ))}
      </div>
    </Looping>
  ),
};

export const ScaleIn: StoryObj = {
  name: 'RoboScaleIn — looping',
  render: () => (
    <Looping>
      <div className='p-2'>
        <RoboScaleIn>
          <div className='p-8 bg-[var(--card)] rounded-lg border border-[var(--border)] text-center text-lg font-medium'>
            Scale entrance (spring, 0.92 → 1.0)
          </div>
        </RoboScaleIn>
      </div>
    </Looping>
  ),
};

export const Stagger: StoryObj = {
  name: 'RoboStagger — looping',
  render: () => (
    <Looping interval={3000}>
      <RoboStagger className='flex flex-col gap-2 p-2'>
        {[
          'Constellation status',
          'Active missions',
          'Open alerts',
          'Pending reports',
          'Satellite positions',
          'Recent incidents',
        ].map((label, i) => (
          <div key={i} className='p-3 bg-[var(--card)] rounded border border-[var(--border)] text-sm'>
            {label}
          </div>
        ))}
      </RoboStagger>
    </Looping>
  ),
};

export const NumberTicker: StoryObj = {
  name: 'RoboNumberTicker — spring counting',
  render: () => {
    const [val, setVal] = React.useState(247);
    React.useEffect(() => {
      const id = setInterval(
        () => setVal((v) => v + Math.floor(Math.random() * 50) + 5),
        2000,
      );
      return () => clearInterval(id);
    }, []);
    return (
      <div className='flex flex-col gap-3 p-6 items-start'>
        <p className='text-xs text-[var(--muted-foreground)] uppercase tracking-widest'>
          Active Satellites
        </p>
        <RoboNumberTicker
          value={val}
          className='text-6xl font-bold text-[var(--primary)] tabular-nums'
        />
        <p className='text-xs text-[var(--muted-foreground)]'>
          Updates every 2s (spring animation)
        </p>
      </div>
    );
  },
};

export const TextEffect: StoryObj = {
  name: 'RoboTextEffect — fade / slide-up / blur, looping',
  render: () => (
    <Looping interval={3500}>
      <div className='flex flex-col gap-8 p-4'>
        <RoboTextEffect
          text='Constellation Overview'
          variant='slide-up'
          as='h1'
          className='text-3xl font-bold text-[var(--foreground)]'
        />
        <RoboTextEffect
          text='42 Active incidents in the last 24 hours'
          variant='blur'
          className='text-base text-[var(--muted-foreground)]'
        />
        <RoboTextEffect
          text='Real-time orbital intelligence platform'
          variant='fade'
          split='char'
          className='text-sm text-[var(--foreground)]'
        />
      </div>
    </Looping>
  ),
};

export const TransitionPanel: StoryObj = {
  name: 'RoboTransitionPanel — auto-cycling',
  render: () => {
    const panels = [
      {
        key: 'overview',
        content: (
          <div className='p-6 bg-[var(--card)] rounded h-24 flex items-center font-medium'>
            Overview Panel
          </div>
        ),
      },
      {
        key: 'history',
        content: (
          <div className='p-6 bg-[var(--muted)] rounded h-24 flex items-center font-medium'>
            History Panel
          </div>
        ),
      },
      {
        key: 'alerts',
        content: (
          <div className='p-6 bg-[var(--card)] rounded h-24 flex items-center font-medium text-[var(--destructive-text)]'>
            Alerts Panel
          </div>
        ),
      },
    ];
    const keys = panels.map((p) => p.key);
    const [idx, setIdx] = React.useState(0);
    const [dir, setDir] = React.useState<'horizontal' | 'vertical' | 'fade'>('horizontal');
    const [paused, setPaused] = React.useState(false);

    React.useEffect(() => {
      if (paused) return;
      const id = setInterval(() => setIdx((i) => (i + 1) % keys.length), 2000);
      return () => clearInterval(id);
    }, [paused, keys.length]);

    return (
      <div className='flex flex-col gap-4 max-w-md'>
        <div className='flex items-center gap-2'>
          {keys.map((k, i) => (
            <button
              key={k}
              className={`px-3 py-1 rounded text-sm ${i === idx ? 'bg-[var(--primary)] text-[var(--primary-foreground)]' : 'bg-[var(--muted)] text-[var(--foreground)]'}`}
              onClick={() => { setIdx(i); setPaused(true); }}
            >
              {k}
            </button>
          ))}
          <button
            onClick={() => setPaused((p) => !p)}
            className='ml-auto px-2 py-1 text-xs rounded bg-[var(--muted)] text-[var(--muted-foreground)]'
          >
            {paused ? '▶' : '⏸'}
          </button>
        </div>
        <div className='flex gap-2 text-xs'>
          {(['horizontal', 'vertical', 'fade'] as const).map((d) => (
            <button
              key={d}
              onClick={() => setDir(d)}
              className={`px-2 py-1 rounded border text-xs ${dir === d ? 'border-[var(--primary)] text-[var(--primary)]' : 'border-[var(--border)] text-[var(--muted-foreground)]'}`}
            >
              {d}
            </button>
          ))}
        </div>
        <RoboTransitionPanel panels={panels} activeKey={keys[idx]} direction={dir} />
      </div>
    );
  },
};
