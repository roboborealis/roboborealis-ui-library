import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import {
  RoboDialog,
  RoboDialogTrigger,
  RoboDialogContent,
  RoboDialogHeader,
  RoboDialogTitle,
  RoboDialogDescription,
  RoboDialogFooter,
  RoboDialogClose,
} from './robo-dialog';
import { RoboButton } from '../../core/button/robo-button';

// ---------------------------------------------------------------------------
// Style constants — no inline objects inside render functions
// ---------------------------------------------------------------------------

const rowStyle: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '12px',
  alignItems: 'center',
};

const formFieldStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
};

const labelStyle: React.CSSProperties = {
  fontSize: '13px',
  fontWeight: 500,
  color: 'var(--foreground)',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px 12px',
  fontSize: '14px',
  borderRadius: 'var(--radius)',
  border: '1px solid var(--border)',
  background: 'var(--input, var(--background))',
  color: 'var(--foreground)',
  outline: 'none',
};

const textareaStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px 12px',
  fontSize: '14px',
  borderRadius: 'var(--radius)',
  border: '1px solid var(--border)',
  background: 'var(--input, var(--background))',
  color: 'var(--foreground)',
  outline: 'none',
  minHeight: '100px',
  resize: 'vertical',
};

const formBodyStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  paddingTop: '4px',
  paddingBottom: '8px',
};

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta: Meta = {
  title: 'Components/Overlays/RoboDialog',
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;

type Story = StoryObj;

// ---------------------------------------------------------------------------
// All Sizes story — sm / md / lg / full
// ---------------------------------------------------------------------------

export const AllSizes: Story = {
  name: 'All Sizes — sm/md/lg/full',
  render: () => (
    <div style={rowStyle}>
      {/* sm */}
      <RoboDialog>
        <RoboDialogTrigger asChild>
          <RoboButton size='sm' variant='secondary'>Open SM</RoboButton>
        </RoboDialogTrigger>
        <RoboDialogContent size='sm'>
          <RoboDialogHeader>
            <RoboDialogTitle>Small dialog</RoboDialogTitle>
            <RoboDialogDescription>
              This is a compact dialog suited for quick confirmations or brief messages.
            </RoboDialogDescription>
          </RoboDialogHeader>
          <p className='text-sm text-[var(--foreground)] py-2'>
            Are you sure you want to delete this record? This cannot be undone.
          </p>
          <RoboDialogFooter>
            <RoboDialogClose asChild>
              <RoboButton size='sm' variant='ghost'>Cancel</RoboButton>
            </RoboDialogClose>
            <RoboButton size='sm' variant='destructive'>Delete</RoboButton>
          </RoboDialogFooter>
        </RoboDialogContent>
      </RoboDialog>

      {/* md */}
      <RoboDialog>
        <RoboDialogTrigger asChild>
          <RoboButton size='sm' variant='secondary'>Open MD</RoboButton>
        </RoboDialogTrigger>
        <RoboDialogContent size='md'>
          <RoboDialogHeader>
            <RoboDialogTitle>Medium dialog</RoboDialogTitle>
            <RoboDialogDescription>
              The default dialog size — suitable for most content including forms and detail views.
            </RoboDialogDescription>
          </RoboDialogHeader>
          <p className='text-sm text-[var(--foreground)] py-2'>
            Satellite MV NORTHERN STAR has been flagged for a routine safety inspection. Review
            the outstanding items before scheduling the next port call.
          </p>
          <RoboDialogFooter>
            <RoboDialogClose asChild>
              <RoboButton size='sm' variant='ghost'>Cancel</RoboButton>
            </RoboDialogClose>
            <RoboButton size='sm'>Confirm</RoboButton>
          </RoboDialogFooter>
        </RoboDialogContent>
      </RoboDialog>

      {/* lg */}
      <RoboDialog>
        <RoboDialogTrigger asChild>
          <RoboButton size='sm' variant='secondary'>Open LG</RoboButton>
        </RoboDialogTrigger>
        <RoboDialogContent size='lg'>
          <RoboDialogHeader>
            <RoboDialogTitle>Large dialog</RoboDialogTitle>
            <RoboDialogDescription>
              A wide dialog for detailed content — mission summaries, data tables, or multi-section forms.
            </RoboDialogDescription>
          </RoboDialogHeader>
          <p className='text-sm text-[var(--foreground)] py-2'>
            This large dialog provides ample space for complex content such as mission details,
            anomaly response timelines, or multi-field forms that would feel cramped in a
            smaller panel.
          </p>
          <RoboDialogFooter>
            <RoboDialogClose asChild>
              <RoboButton size='sm' variant='ghost'>Close</RoboButton>
            </RoboDialogClose>
            <RoboButton size='sm'>Save</RoboButton>
          </RoboDialogFooter>
        </RoboDialogContent>
      </RoboDialog>

      {/* full */}
      <RoboDialog>
        <RoboDialogTrigger asChild>
          <RoboButton size='sm' variant='secondary'>Open FULL</RoboButton>
        </RoboDialogTrigger>
        <RoboDialogContent size='full'>
          <RoboDialogHeader>
            <RoboDialogTitle>Full-width dialog</RoboDialogTitle>
            <RoboDialogDescription>
              Spans nearly the full viewport width — use for immersive workflows or map-centric views.
            </RoboDialogDescription>
          </RoboDialogHeader>
          <p className='text-sm text-[var(--foreground)] py-2'>
            Full-width dialogs are ideal when the content requires the maximum available screen
            space, such as an anomaly response map overlay, a large data grid, or a
            multi-step workflow wizard.
          </p>
          <RoboDialogFooter>
            <RoboDialogClose asChild>
              <RoboButton size='sm' variant='ghost'>Close</RoboButton>
            </RoboDialogClose>
            <RoboButton size='sm'>Submit</RoboButton>
          </RoboDialogFooter>
        </RoboDialogContent>
      </RoboDialog>
    </div>
  ),
};

// ---------------------------------------------------------------------------
// With Form Inside story
// ---------------------------------------------------------------------------

export const WithForm: Story = {
  name: 'With Form Inside',
  render: () => (
    <RoboDialog>
      <RoboDialogTrigger asChild>
        <RoboButton>Add Satellite Note</RoboButton>
      </RoboDialogTrigger>
      <RoboDialogContent size='md'>
        <RoboDialogHeader>
          <RoboDialogTitle>Add satellite note</RoboDialogTitle>
          <RoboDialogDescription>
            Attach a note to this satellite record. Notes are visible to all operators.
          </RoboDialogDescription>
        </RoboDialogHeader>

        <div style={formBodyStyle}>
          <div style={formFieldStyle}>
            <label htmlFor='note-subject' style={labelStyle}>
              Subject
            </label>
            <input
              id='note-subject'
              type='text'
              placeholder='e.g. Engine maintenance completed'
              style={inputStyle}
            />
          </div>

          <div style={formFieldStyle}>
            <label htmlFor='note-body' style={labelStyle}>
              Note
            </label>
            <textarea
              id='note-body'
              placeholder='Describe the observation or action taken...'
              style={textareaStyle}
            />
          </div>
        </div>

        <RoboDialogFooter>
          <RoboDialogClose asChild>
            <RoboButton variant='ghost'>Cancel</RoboButton>
          </RoboDialogClose>
          <RoboButton>Save note</RoboButton>
        </RoboDialogFooter>
      </RoboDialogContent>
    </RoboDialog>
  ),
};
