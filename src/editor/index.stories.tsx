import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';

import { RoboRichTextEditor } from './robo-rich-text-editor';
import { EMPTY_SLATE_VALUE, type SlateValue } from './types';

// ── Meta ───────────────────────────────────────────────────────────────────────

const meta: Meta<typeof RoboRichTextEditor> = {
  title: 'Components/Forms/RoboRichTextEditor',
  component: RoboRichTextEditor,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    a11y: { config: {} },
  },
  argTypes: {
    placeholder: { control: 'text' },
    readOnly: { control: 'boolean' },
    showCharCount: { control: 'boolean' },
    maxLength: { control: 'number' },
    minHeight: { control: 'text' },
    maxHeight: { control: 'text' },
    storageKey: { control: 'text' },
    autoSaveMs: { control: 'number' },
  },
};

export default meta;

type Story = StoryObj<typeof RoboRichTextEditor>;

// ── AllStates ────────────────────────────────────────────────────────────────

const sampleContent: SlateValue = [
  {
    type: 'heading-two',
    children: [{ text: 'Situation Report' }],
  },
  {
    type: 'paragraph',
    children: [
      { text: 'Spacecraft ' },
      { text: 'KEPLER-9', bold: true },
      { text: ' transmitted a telemetry anomaly at 14:32 UTC. Mission control assets are on station.' },
    ],
  },
];

/** Editor pre-filled with sample content showing the default editable state. */
export const AllStates: Story = {
  name: 'All States',
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [value, setValue] = React.useState<SlateValue>(sampleContent);
    return (
      <div className='flex flex-col gap-4'>
        <RoboRichTextEditor
          value={value}
          onChange={setValue}
          placeholder='Start writing your report…'
          minHeight='240px'
          aria-label='Report editor'
        />
      </div>
    );
  },
};

// ── Default ────────────────────────────────────────────────────────────────────

/**
 * Default story: empty editor with all features enabled.
 */
export const Default: Story = {
  args: {
    placeholder: 'Start writing your report…',
    minHeight: '240px',
    'aria-label': 'Report editor',
  },
};

// ── Controlled ─────────────────────────────────────────────────────────────────

/**
 * Demonstrates controlled mode — external state drives the value.
 */
export const Controlled: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [value, setValue] = React.useState<SlateValue>(EMPTY_SLATE_VALUE);

    return (
      <div className='flex flex-col gap-4'>
        <RoboRichTextEditor
          value={value}
          onChange={setValue}
          placeholder='Controlled editor…'
          aria-label='Controlled editor'
        />
        <pre className='rounded border border-[var(--border)] bg-[var(--muted)] p-3 text-xs text-[var(--muted-foreground)]'>
          {JSON.stringify(value, null, 2)}
        </pre>
      </div>
    );
  },
};

// ── ReadOnly ───────────────────────────────────────────────────────────────────

/** Pre-filled content displayed in read-only mode (no toolbar). */
export const ReadOnly: Story = {
  args: {
    readOnly: true,
    'aria-label': 'Read-only report',
    value: [
      {
        type: 'heading-one',
        children: [{ text: 'Situation Report' }],
      },
      {
        type: 'paragraph',
        children: [
          { text: 'At ' },
          { text: '14:32 UTC', bold: true },
          {
            text: ', spacecraft KEPLER-9 transmitted an anomaly beacon via its emergency transponder from a 550 km orbit at 51.6° inclination.',
          },
        ],
      },
      {
        type: 'heading-two',
        children: [{ text: 'Responding Assets' }],
      },
      {
        type: 'bulleted-list',
        children: [
          { type: 'list-item', children: [{ text: 'DSN Goldstone — tracking' }] },
          { type: 'list-item', children: [{ text: 'Relay Sat SENTINEL-1 — link established' }] },
          { type: 'list-item', children: [{ text: 'ESA Mission Control Darmstadt (coordination)' }] },
        ],
      },
    ] as SlateValue,
  },
};

// ── WithCharLimit ──────────────────────────────────────────────────────────────

/** Editor with a 500-character limit and visible character counter. */
export const WithCharLimit: Story = {
  args: {
    maxLength: 500,
    showCharCount: true,
    placeholder: 'Write up to 500 characters…',
    'aria-label': 'Limited editor',
  },
};

// ── AutoSave ───────────────────────────────────────────────────────────────────

/**
 * Editor with auto-save enabled. Changes persist to localStorage under
 * `robo-editor-demo-draft` and are restored on re-mount.
 */
export const AutoSave: Story = {
  args: {
    storageKey: 'robo-editor-demo-draft',
    autoSaveMs: 3000,
    placeholder: 'Start typing — your draft saves automatically every 3 seconds…',
    'aria-label': 'Auto-save editor',
  },
};

// ── ReportDocument ─────────────────────────────────────────────────────────────

/**
 * Pre-filled with a sample orbital situation report structure.
 * Shows headings, bold marks, bulleted lists, and numbered steps.
 */
export const ReportDocument: Story = {
  args: {
    minHeight: '400px',
    'aria-label': 'Orbital situation report',
    value: [
      {
        type: 'heading-one',
        children: [{ text: 'Situation Report — Anomaly Case #2024-0412' }],
      },
      {
        type: 'heading-two',
        children: [{ text: '1. Anomaly Summary' }],
      },
      {
        type: 'paragraph',
        children: [
          { text: 'On ' },
          { text: '12 April 2024 at 09:15 UTC', bold: true },
          {
            text: ', Mission Control Houston received an anomaly alert via the Deep Space Network. A crewed capsule reported a cabin-pressure fault in a 420 km orbit at 51.6° inclination.',
          },
        ],
      },
      {
        type: 'heading-two',
        children: [{ text: '2. Spacecraft Details' }],
      },
      {
        type: 'bulleted-list',
        children: [
          {
            type: 'list-item',
            children: [{ text: 'Spacecraft name: ', bold: true }, { text: 'CREW CAPSULE ORION-4' }],
          },
          {
            type: 'list-item',
            children: [{ text: 'NORAD ID: ', bold: true }, { text: '55129' }],
          },
          {
            type: 'list-item',
            children: [{ text: 'Crew on board: ', bold: true }, { text: '3 (mission specialists)' }],
          },
          {
            type: 'list-item',
            children: [{ text: 'Last known position: ', bold: true }, { text: '420 km altitude, 51.6° inclination' }],
          },
        ],
      },
      {
        type: 'heading-two',
        children: [{ text: '3. Actions Taken' }],
      },
      {
        type: 'numbered-list',
        children: [
          {
            type: 'list-item',
            children: [{ text: 'Broadcast ANOMALY ALERT on Deep Space Network — 09:17 UTC' }],
          },
          {
            type: 'list-item',
            children: [{ text: 'Tasked relay satellite SENTINEL-1 for continuous link' }],
          },
          {
            type: 'list-item',
            children: [{ text: 'Tasked recovery vehicle DRAGON-2 for rendezvous' }],
          },
          {
            type: 'list-item',
            children: [{ text: 'Notified ESA Mission Control Darmstadt for coordination' }],
          },
        ],
      },
      {
        type: 'heading-two',
        children: [{ text: '4. Current Status' }],
      },
      {
        type: 'paragraph',
        children: [
          {
            text: 'Recovery assets on station. Capsule crew ',
          },
          { text: 'recovered safely', bold: true },
          { text: '. Case closed 14:45 UTC.' },
        ],
      },
    ] as SlateValue,
  },
};
