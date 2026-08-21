import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { RoboPrintButton } from './robo-print-button';
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

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta: Meta<typeof RoboPrintButton> = {
  title: 'Elements/Actions/RoboPrintButton',
  component: RoboPrintButton,
  parameters: { layout: 'padded' },
};
export default meta;

type Story = StoryObj<typeof RoboPrintButton>;

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

export const AllVariants: Story = {
  name: 'All Variants',
  render: () => (
    <OverviewStack>

      <OverviewSection title='Default'>
        <div style={rowStyle}>
          <RoboPrintButton />
        </div>
      </OverviewSection>

      <OverviewSection title='Custom label'>
        <div style={rowStyle}>
          <RoboPrintButton label='Print Report' />
          <RoboPrintButton label='Print Summary' />
        </div>
      </OverviewSection>

      <OverviewSection title='Icon only'>
        <div style={rowStyle}>
          <RoboPrintButton iconOnly label='Print' />
        </div>
      </OverviewSection>

      <OverviewSection title='All sizes'>
        <div style={rowStyle}>
          <RoboPrintButton size='sm' label='Print (sm)' />
          <RoboPrintButton size='md' label='Print (md)' />
          <RoboPrintButton size='lg' label='Print (lg)' />
        </div>
      </OverviewSection>

    </OverviewStack>
  ),
};
