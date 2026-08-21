import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { RoboCopyButton } from './robo-copy-button';


export const componentMeta = {
  description: 'One-click clipboard copy with success feedback animation',
  category: 'action' as const,
  keywords: ['copy', 'clipboard', 'paste', 'duplicate', 'text', 'code', 'snippet'],
  whenToUse: 'For copying text, IDs, coordinates, or code snippets to clipboard',
  whenNotToUse: 'For file export use RoboExportButton; for generic actions use RoboActionButton',
  pairsWith: ['RoboInput', 'RoboCard', 'RoboDataTable', 'RoboTooltip'],
  a11y: 'Announces copy success to screen readers via aria-live region',
};
const meta: Meta<typeof RoboCopyButton> = {
  title: 'Elements/Actions/RoboCopyButton',
  excludeStories: ['componentMeta'],
    component: RoboCopyButton,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    value:        { control: 'text' },
    label:        { control: 'text' },
    successLabel: { control: 'text' },
    iconOnly:     { control: 'boolean' },
    resetDelay:   { control: { type: 'number', min: 500, max: 5000, step: 500 } },
    variant:      { control: 'select', options: ['default', 'secondary', 'ghost', 'outline', 'destructive'] },
    size:         { control: 'select', options: ['sm', 'md', 'lg'] },
  },
};
export default meta;

type Story = StoryObj<typeof RoboCopyButton>;

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

export const Default: Story = {
  args: { value: 'NORAD-25544' },
};

export const WithCustomLabel: Story = {
  name: 'Custom Label',
  args: { value: 'NORAD-25544', label: 'Copy NORAD ID' },
};

export const IconOnly: Story = {
  name: 'Icon Only',
  args: { value: 'COSPAR-1977-084A', label: 'Copy COSPAR ID', iconOnly: true },
};

/** Shows how the copy button sits next to a field value. */
export const InlineWithText: Story = {
  name: 'Inline with Field Value',
  render: () => (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        padding: '6px 10px',
        fontSize: '0.875rem',
        color: 'var(--foreground)',
        fontFamily: 'var(--font-mono)',
      }}
    >
      <span>25544</span>
      <RoboCopyButton value='25544' label='Copy NORAD ID' iconOnly size='sm' />
    </div>
  ),
};

/** Demonstrates multiple copy buttons for different fields. */
export const MultipleFields: Story = {
  name: 'Multiple Copy Fields',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 360 }}>
      {[
        { label: 'NORAD ID', value: '25544' },
        { label: 'COSPAR ID', value: '1977-084A' },
        { label: 'Call Sign', value: 'ARTEMIS' },
      ].map(({ label, value }) => (
        <div
          key={label}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 12px',
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
          }}
        >
          <div>
            <span style={{ fontSize: '0.7rem', color: 'var(--muted-foreground)', display: 'block' }}>
              {label}
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem', color: 'var(--foreground)' }}>
              {value}
            </span>
          </div>
          <RoboCopyButton value={value} label={`Copy ${label}`} iconOnly />
        </div>
      ))}
    </div>
  ),
};

export const Playground: Story = {
  args: {
    value: 'Sample text to copy',
    label: 'Copy',
    successLabel: 'Copied!',
    iconOnly: false,
    resetDelay: 2000,
    size: 'sm',
    variant: 'ghost',
  },
};
