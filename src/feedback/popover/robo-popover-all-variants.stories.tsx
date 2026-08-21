import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import {
  RoboPopover,
  RoboPopoverTrigger,
  RoboPopoverContent,
  RoboPopoverClose,
} from './robo-popover';
import { RoboButton } from '../../core/button/robo-button';

// ---------------------------------------------------------------------------
// Style constants — no inline objects inside render functions
// ---------------------------------------------------------------------------

const rowStyle: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '12px',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '48px 24px',
};

const statusRowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '4px',
};

const statusDotStyle: React.CSSProperties = {
  display: 'inline-block',
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  backgroundColor: 'var(--success, #22c55e)',
  marginRight: '6px',
};

const dividerStyle: React.CSSProperties = {
  borderTop: '1px solid var(--border)',
  margin: '8px 0',
};

const closeButtonStyle: React.CSSProperties = {
  marginTop: '4px',
  fontSize: '12px',
  color: 'var(--muted-foreground, #6b7280)',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: '2px 0',
};

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta: Meta = {
  title: 'Components/Overlays/RoboPopover',
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;

type Story = StoryObj;

// ---------------------------------------------------------------------------
// All Alignments story — start / center / end
// ---------------------------------------------------------------------------

export const AllAlignments: Story = {
  name: 'All Alignments — start/center/end',
  render: () => (
    <div style={rowStyle}>
      {/* start */}
      <RoboPopover>
        <RoboPopoverTrigger asChild>
          <RoboButton size='sm' variant='secondary'>Align: start</RoboButton>
        </RoboPopoverTrigger>
        <RoboPopoverContent align='start'>
          <p className='text-sm font-semibold text-[var(--foreground)] mb-2'>
            Satellite Status — HUBBLE
          </p>
          <div style={statusRowStyle}>
            <span className='text-xs text-[var(--muted-foreground,#6b7280)]'>Status</span>
            <span className='text-xs font-medium text-[var(--foreground)]'>
              <span style={statusDotStyle} aria-hidden='true' />
              Active
            </span>
          </div>
          <div style={statusRowStyle}>
            <span className='text-xs text-[var(--muted-foreground,#6b7280)]'>Velocity</span>
            <span className='text-xs font-medium text-[var(--foreground)]'>7.6 km/s</span>
          </div>
          <div style={statusRowStyle}>
            <span className='text-xs text-[var(--muted-foreground,#6b7280)]'>Inclination</span>
            <span className='text-xs font-medium text-[var(--foreground)]'>28.5°</span>
          </div>
          <p className='text-xs text-[var(--muted-foreground,#6b7280)] mt-2'>
            Align: <strong>start</strong>
          </p>
        </RoboPopoverContent>
      </RoboPopover>

      {/* center */}
      <RoboPopover>
        <RoboPopoverTrigger asChild>
          <RoboButton size='sm' variant='secondary'>Align: center</RoboButton>
        </RoboPopoverTrigger>
        <RoboPopoverContent align='center'>
          <p className='text-sm font-semibold text-[var(--foreground)] mb-2'>
            Satellite Status — KEPLER
          </p>
          <div style={statusRowStyle}>
            <span className='text-xs text-[var(--muted-foreground,#6b7280)]'>Status</span>
            <span className='text-xs font-medium text-[var(--foreground)]'>
              <span style={statusDotStyle} aria-hidden='true' />
              Operational
            </span>
          </div>
          <div style={statusRowStyle}>
            <span className='text-xs text-[var(--muted-foreground,#6b7280)]'>Velocity</span>
            <span className='text-xs font-medium text-[var(--foreground)]'>7.4 km/s</span>
          </div>
          <div style={statusRowStyle}>
            <span className='text-xs text-[var(--muted-foreground,#6b7280)]'>Inclination</span>
            <span className='text-xs font-medium text-[var(--foreground)]'>51.6°</span>
          </div>
          <p className='text-xs text-[var(--muted-foreground,#6b7280)] mt-2'>
            Align: <strong>center</strong>
          </p>
        </RoboPopoverContent>
      </RoboPopover>

      {/* end */}
      <RoboPopover>
        <RoboPopoverTrigger asChild>
          <RoboButton size='sm' variant='secondary'>Align: end</RoboButton>
        </RoboPopoverTrigger>
        <RoboPopoverContent align='end'>
          <p className='text-sm font-semibold text-[var(--foreground)] mb-2'>
            Satellite Status — SENTINEL-2
          </p>
          <div style={statusRowStyle}>
            <span className='text-xs text-[var(--muted-foreground,#6b7280)]'>Status</span>
            <span className='text-xs font-medium text-[var(--foreground)]'>
              <span style={statusDotStyle} aria-hidden='true' />
              Safe mode
            </span>
          </div>
          <div style={statusRowStyle}>
            <span className='text-xs text-[var(--muted-foreground,#6b7280)]'>Velocity</span>
            <span className='text-xs font-medium text-[var(--foreground)]'>0.0 km/s</span>
          </div>
          <div style={statusRowStyle}>
            <span className='text-xs text-[var(--muted-foreground,#6b7280)]'>Inclination</span>
            <span className='text-xs font-medium text-[var(--foreground)]'>—</span>
          </div>
          <p className='text-xs text-[var(--muted-foreground,#6b7280)] mt-2'>
            Align: <strong>end</strong>
          </p>
        </RoboPopoverContent>
      </RoboPopover>
    </div>
  ),
};

// ---------------------------------------------------------------------------
// With Close Button story
// ---------------------------------------------------------------------------

export const WithClose: Story = {
  name: 'With Close Button',
  render: () => (
    <div style={rowStyle}>
      <RoboPopover>
        <RoboPopoverTrigger asChild>
          <RoboButton>View satellite details</RoboButton>
        </RoboPopoverTrigger>
        <RoboPopoverContent align='center'>
          <p className='text-sm font-semibold text-[var(--foreground)] mb-1'>
            SENTINEL-1
          </p>
          <p className='text-xs text-[var(--muted-foreground,#6b7280)] mb-3'>
            COSPAR 9876543 · Earth-observation satellite
          </p>

          <div style={statusRowStyle}>
            <span className='text-xs text-[var(--muted-foreground,#6b7280)]'>Last seen</span>
            <span className='text-xs font-medium text-[var(--foreground)]'>2 min ago</span>
          </div>
          <div style={statusRowStyle}>
            <span className='text-xs text-[var(--muted-foreground,#6b7280)]'>Ground station</span>
            <span className='text-xs font-medium text-[var(--foreground)]'>Svalbard</span>
          </div>
          <div style={statusRowStyle}>
            <span className='text-xs text-[var(--muted-foreground,#6b7280)]'>ETA</span>
            <span className='text-xs font-medium text-[var(--foreground)]'>Apr 21 06:00 UTC</span>
          </div>

          <div style={dividerStyle} aria-hidden='true' />

          <div className='flex gap-2'>
            <RoboButton size='sm' variant='ghost' className='flex-1'>
              View report
            </RoboButton>
            <RoboPopoverClose asChild>
              <button style={closeButtonStyle} aria-label='Close popover'>
                Close
              </button>
            </RoboPopoverClose>
          </div>
        </RoboPopoverContent>
      </RoboPopover>
    </div>
  ),
};
