import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { RoboExportButton } from './robo-export-button';
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
// Mock data
// ---------------------------------------------------------------------------

const mockData = [
  { name: 'Satellite Alpha', status: 'Active', position: '26.5N 56.3E' },
];

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta: Meta<typeof RoboExportButton> = {
  title: 'Elements/Actions/RoboExportButton',
  component: RoboExportButton,
  parameters: { layout: 'padded' },
};
export default meta;

type Story = StoryObj<typeof RoboExportButton>;

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

export const AllVariants: Story = {
  name: 'All Variants',
  render: () => (
    <OverviewStack>

      <OverviewSection title='CSV (default)'>
        <div style={rowStyle}>
          <RoboExportButton data={mockData} filename='satellites' />
        </div>
      </OverviewSection>

      <OverviewSection title='Excel format'>
        <div style={rowStyle}>
          <RoboExportButton data={mockData} filename='satellites' format='xlsx' />
        </div>
      </OverviewSection>

      <OverviewSection title='Icon only'>
        <div style={rowStyle}>
          <RoboExportButton data={mockData} filename='satellites' iconOnly />
          <RoboExportButton data={mockData} filename='satellites' format='xlsx' iconOnly />
        </div>
      </OverviewSection>

      <OverviewSection title='Custom label'>
        <div style={rowStyle}>
          <RoboExportButton data={mockData} filename='satellite-report' label='Download Report' />
          <RoboExportButton data={mockData} filename='satellite-report' format='xlsx' label='Download Excel' />
        </div>
      </OverviewSection>

      <OverviewSection title='All sizes'>
        <div style={rowStyle}>
          <RoboExportButton data={mockData} size='sm' label='Export (sm)' />
          <RoboExportButton data={mockData} size='md' label='Export (md)' />
          <RoboExportButton data={mockData} size='lg' label='Export (lg)' />
        </div>
      </OverviewSection>

    </OverviewStack>
  ),
};
