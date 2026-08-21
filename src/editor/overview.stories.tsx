// ---------------------------------------------------------------------------
// @roboborealis/editor — Overview stories
// ---------------------------------------------------------------------------

import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { RoboRichTextEditor } from './robo-rich-text-editor';
import { EMPTY_SLATE_VALUE, type SlateValue } from './types';
import { OverviewAccordion, OverviewGroup } from '../lib/storybook/overview-layout';

// ---------------------------------------------------------------------------
// Pre-filled initial content for the "with initial content" section
// ---------------------------------------------------------------------------

const INITIAL_CONTENT: SlateValue = [
  {
    type: 'heading-one',
    children: [{ text: 'Situation Report — Anomaly Case #2024-0412' }],
  },
  {
    type: 'paragraph',
    children: [
      { text: 'At ' },
      { text: '14:32 UTC', bold: true },
      {
        text: ', spacecraft KEPLER-9 transmitted an anomaly beacon via its emergency transponder from a 550 km orbit at 51.6° inclination. Mission control is responding.',
      },
    ],
  },
  {
    type: 'bulleted-list',
    children: [
      { type: 'list-item', children: [{ text: 'Relay Sat SENTINEL-1 — link established' }] },
      { type: 'list-item', children: [{ text: 'DSN Goldstone — tracking' }] },
      { type: 'list-item', children: [{ text: 'ESA Mission Control Darmstadt (coordination)' }] },
    ],
  },
] as SlateValue;

// ---------------------------------------------------------------------------
// Read-only content
// ---------------------------------------------------------------------------

const READ_ONLY_CONTENT: SlateValue = [
  {
    type: 'heading-two',
    children: [{ text: 'Final Anomaly Summary' }],
  },
  {
    type: 'paragraph',
    children: [
      { text: 'This record is ' },
      { text: 'locked for editing', bold: true },
      { text: '. All three crew were recovered safely at 16:45 UTC.' },
    ],
  },
] as SlateValue;

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta: Meta = {
  title: 'Components/Forms/Rich Text Editor',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: 'All RoboRichTextEditor modes shown together in a single reference page.',
      },
    },
  },
};
export default meta;

type Story = StoryObj;

// ---------------------------------------------------------------------------
// Overview — all modes on one page
// ---------------------------------------------------------------------------

/**
 * All RichTextEditor modes side by side:
 * Default/empty, with initial content, read-only, char-limited (500), and auto-save.
 */
export const Overview: Story = {
  name: 'Rich Text Editor Overview',
  render: function RichTextEditorOverview() {
    const [controlled, setControlled] = React.useState<SlateValue>(EMPTY_SLATE_VALUE);

    return (
      <div style={{ padding: '8px 0' }}>
        <OverviewAccordion>

          {/* Default / empty */}
          <OverviewGroup
            value="default-empty"
            title="Default — Empty"
            description="Empty editor with placeholder text. Full toolbar enabled."
          >
            <RoboRichTextEditor
              placeholder="Start writing your report…"
              minHeight="180px"
              aria-label="Default empty editor"
            />
          </OverviewGroup>

          {/* With initial content */}
          <OverviewGroup
            value="initial-content"
            title="With Initial Content"
            description="Editor pre-filled with an orbital situation report. Fully editable."
          >
            <RoboRichTextEditor
              value={controlled}
              onChange={setControlled}
              minHeight="180px"
              aria-label="Editor with initial content"
            />
            {/* Seed the initial content on first render only */}
            {controlled === EMPTY_SLATE_VALUE && (
              <button
                type="button"
                style={{
                  marginTop: 8,
                  fontSize: '0.75rem',
                  padding: '4px 10px',
                  border: '1px solid var(--border)',
                  borderRadius: 4,
                  cursor: 'pointer',
                  background: 'var(--card)',
                  color: 'var(--muted-foreground)',
                }}
                onClick={() => setControlled(INITIAL_CONTENT)}
              >
                Load sample content
              </button>
            )}
          </OverviewGroup>

          {/* Read-only */}
          <OverviewGroup
            value="read-only"
            title="Read-Only"
            description="Content is displayed without a toolbar. Editing is disabled."
          >
            <RoboRichTextEditor
              readOnly
              value={READ_ONLY_CONTENT}
              minHeight="120px"
              aria-label="Read-only editor"
            />
          </OverviewGroup>

          {/* Char limit */}
          <OverviewGroup
            value="char-limit"
            title="With Character Limit (500)"
            description="Character counter shown below the editor. Input stops at the limit."
          >
            <RoboRichTextEditor
              maxLength={500}
              showCharCount
              placeholder="Write up to 500 characters…"
              minHeight="150px"
              aria-label="Editor with 500 char limit"
            />
          </OverviewGroup>

          {/* Auto-save */}
          <OverviewGroup
            value="auto-save"
            title="Auto-Save Mode"
            description="Drafts persist to localStorage every 3 seconds. Survives page refresh."
          >
            <RoboRichTextEditor
              storageKey="robo-editor-overview-draft"
              autoSaveMs={3000}
              placeholder="Start typing — your draft saves automatically every 3 seconds…"
              minHeight="150px"
              aria-label="Auto-save editor"
            />
          </OverviewGroup>

        </OverviewAccordion>
      </div>
    );
  },
};
