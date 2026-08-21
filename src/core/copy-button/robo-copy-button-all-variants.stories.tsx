import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { RoboCopyButton } from './robo-copy-button';
import { OverviewStack, OverviewSection } from '../../lib/storybook/overview-layout';

// ---------------------------------------------------------------------------
// Layout constants
// ---------------------------------------------------------------------------

const rowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  flexWrap: 'wrap',
};

const fieldContainerStyle: React.CSSProperties = {
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
};

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta: Meta<typeof RoboCopyButton> = {
  title: 'Elements/Actions/RoboCopyButton',
  component: RoboCopyButton,
  parameters: { layout: 'padded' },
};
export default meta;

type Story = StoryObj<typeof RoboCopyButton>;

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

export const AllVariants: Story = {
  name: 'All Variants',
  render: () => (
    <OverviewStack>

      <OverviewSection title='Default'>
        <div style={rowStyle}>
          <RoboCopyButton value='NORAD-25544' />
        </div>
      </OverviewSection>

      <OverviewSection title='With custom label'>
        <div style={rowStyle}>
          <RoboCopyButton value='NORAD-25544' label='Copy NORAD ID' />
          <RoboCopyButton value='COSPAR-1977-084A' label='Copy COSPAR ID' />
          <RoboCopyButton value='ARTEMIS' label='Copy Call Sign' />
        </div>
      </OverviewSection>

      <OverviewSection title='Icon only'>
        <div style={rowStyle}>
          <RoboCopyButton value='25544' label='Copy NORAD ID' iconOnly />
          <RoboCopyButton value='1977-084A' label='Copy COSPAR ID' iconOnly />
        </div>
      </OverviewSection>

      <OverviewSection title='All sizes'>
        <div style={rowStyle}>
          <RoboCopyButton value='25544' label='Copy (sm)' size='sm' />
          <RoboCopyButton value='25544' label='Copy (md)' size='md' />
          <RoboCopyButton value='25544' label='Copy (lg)' size='lg' />
        </div>
      </OverviewSection>

      <OverviewSection title='Inline field context'>
        <div style={rowStyle}>
          <div style={fieldContainerStyle}>
            <span>25544</span>
            <RoboCopyButton value='25544' label='Copy NORAD ID' iconOnly size='sm' />
          </div>
          <div style={fieldContainerStyle}>
            <span>1977-084A</span>
            <RoboCopyButton value='1977-084A' label='Copy COSPAR ID' iconOnly size='sm' />
          </div>
          <div style={fieldContainerStyle}>
            <span>ARTEMIS</span>
            <RoboCopyButton value='ARTEMIS' label='Copy Call Sign' iconOnly size='sm' />
          </div>
        </div>
      </OverviewSection>

    </OverviewStack>
  ),
};
