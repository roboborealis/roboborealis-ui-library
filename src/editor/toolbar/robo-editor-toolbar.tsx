'use client';

import * as React from 'react';
import { useSlate } from 'slate-react';
import { Bold, Italic, Underline, List, ListOrdered, Link2, Link2Off } from 'lucide-react';

import { RoboIconButton } from '@/core/button/robo-icon-button';
import { cn } from '@/lib/utils';
import {
  isMarkActive,
  toggleMark,
  isBlockActive,
  toggleBlock,
  insertLink,
  removeLink,
} from '../utils';
import type { CustomElement } from '../types';

// ── Types ─────────────────────────────────────────────────────────────────────

type MarkFormat = 'bold' | 'italic' | 'underline' | 'code';
type BlockFormat = CustomElement['type'];

export interface RoboEditorToolbarProps {
  className?: string;
}

// ── Divider ────────────────────────────────────────────────────────────────────

function RoboEditorDivider() {
  return (
    <span
      role='separator'
      aria-orientation='vertical'
      className='mx-1 inline-block h-5 w-px bg-[var(--border)]'
    />
  );
}

// ── Mark button ────────────────────────────────────────────────────────────────

interface MarkButtonProps {
  format: MarkFormat;
  label: string;
  children: React.ReactNode;
}

function MarkButton({ format, label, children }: MarkButtonProps) {
  const editor = useSlate();
  const active = isMarkActive(editor, format);

  return (
    <RoboIconButton
      aria-label={label}
      aria-pressed={active}
      variant={active ? 'default' : 'ghost'}
      size='sm'
      onMouseDown={(e) => {
        e.preventDefault();
        toggleMark(editor, format);
      }}
    >
      {children}
    </RoboIconButton>
  );
}

// ── Block button ───────────────────────────────────────────────────────────────

interface BlockButtonProps {
  format: BlockFormat;
  label: string;
  children: React.ReactNode;
}

function BlockButton({ format, label, children }: BlockButtonProps) {
  const editor = useSlate();
  const active = isBlockActive(editor, format);

  return (
    <RoboIconButton
      aria-label={label}
      aria-pressed={active}
      variant={active ? 'default' : 'ghost'}
      size='sm'
      onMouseDown={(e) => {
        e.preventDefault();
        toggleBlock(editor, format);
      }}
    >
      {children}
    </RoboIconButton>
  );
}

// ── Link button ────────────────────────────────────────────────────────────────

function LinkButton() {
  const editor = useSlate();
  const active = isBlockActive(editor, 'link');

  return (
    <RoboIconButton
      aria-label='Insert link'
      aria-pressed={active}
      variant={active ? 'default' : 'ghost'}
      size='sm'
      onMouseDown={(e) => {
        e.preventDefault();
        if (active) {
          removeLink(editor);
          return;
        }
        const url = window.prompt('Enter link URL:');
        if (url) {
          insertLink(editor, url);
        }
      }}
    >
      <Link2 size={14} aria-hidden='true' />
    </RoboIconButton>
  );
}

function UnlinkButton() {
  const editor = useSlate();
  const active = isBlockActive(editor, 'link');

  return (
    <RoboIconButton
      aria-label='Remove link'
      disabled={!active}
      variant='ghost'
      size='sm'
      onMouseDown={(e) => {
        e.preventDefault();
        if (active) {
          removeLink(editor);
        }
      }}
    >
      <Link2Off size={14} aria-hidden='true' />
    </RoboIconButton>
  );
}

// ── Toolbar ────────────────────────────────────────────────────────────────────

/**
 * RoboEditorToolbar — format toolbar for RoboRichTextEditor.
 * Must be rendered inside a `<Slate>` provider context.
 *
 * @example
 * <Slate editor={editor} initialValue={value}>
 *   <RoboEditorToolbar />
 *   <Editable ... />
 * </Slate>
 */
export function RoboEditorToolbar({ className }: RoboEditorToolbarProps) {
  return (
    <div
      role='toolbar'
      aria-label='Text formatting'
      className={cn(
        'flex flex-wrap items-center gap-0.5 border-b border-[var(--border)] bg-[var(--card)] px-2 py-1.5',
        className,
      )}
    >
      {/* Marks */}
      <MarkButton format='bold' label='Bold (Ctrl+B)'>
        <Bold size={14} aria-hidden='true' />
      </MarkButton>
      <MarkButton format='italic' label='Italic (Ctrl+I)'>
        <Italic size={14} aria-hidden='true' />
      </MarkButton>
      <MarkButton format='underline' label='Underline (Ctrl+U)'>
        <Underline size={14} aria-hidden='true' />
      </MarkButton>

      <RoboEditorDivider />

      {/* Headings */}
      <BlockButton format='heading-one' label='Heading 1'>
        H1
      </BlockButton>
      <BlockButton format='heading-two' label='Heading 2'>
        H2
      </BlockButton>
      <BlockButton format='heading-three' label='Heading 3'>
        H3
      </BlockButton>
      <BlockButton format='heading-four' label='Heading 4'>
        H4
      </BlockButton>
      <BlockButton format='paragraph' label='Paragraph'>
        ¶
      </BlockButton>

      <RoboEditorDivider />

      {/* Lists */}
      <BlockButton format='bulleted-list' label='Bulleted list'>
        <List size={14} aria-hidden='true' />
      </BlockButton>
      <BlockButton format='numbered-list' label='Numbered list'>
        <ListOrdered size={14} aria-hidden='true' />
      </BlockButton>

      <RoboEditorDivider />

      {/* Links */}
      <LinkButton />
      <UnlinkButton />
    </div>
  );
}

RoboEditorToolbar.displayName = 'RoboEditorToolbar';
