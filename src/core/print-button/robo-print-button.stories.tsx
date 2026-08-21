import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import {
  RoboTable,
  RoboTableHeader,
  RoboTableBody,
  RoboTableRow,
  RoboTableHead,
  RoboTableCell,
} from '@/tables/table/robo-table';

import { RoboPrintButton } from './robo-print-button';


export const componentMeta = {
  description: 'Print trigger that opens browser print dialog for current content',
  category: 'action' as const,
  keywords: ['print', 'pdf', 'paper', 'hardcopy', 'document', 'report'],
  whenToUse: 'For printing reports, dossiers, or page content via browser print dialog',
  whenNotToUse: 'For file export use RoboExportButton; for clipboard use RoboCopyButton',
  pairsWith: ['RoboDataTable', 'RoboCard', 'RoboPageShell', 'RoboActionButton'],
  a11y: 'Standard button accessibility; print dialog is handled by browser',
};
const meta: Meta<typeof RoboPrintButton> = {
  title: 'Elements/Actions/RoboPrintButton',
  excludeStories: ['componentMeta'],
    component: RoboPrintButton,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    label:    { control: 'text' },
    iconOnly: { control: 'boolean' },
    variant:  { control: 'select', options: ['default', 'secondary', 'ghost', 'outline', 'destructive'] },
    size:     { control: 'select', options: ['sm', 'md', 'lg'] },
  },
};
export default meta;

type Story = StoryObj<typeof RoboPrintButton>;

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

export const Default: Story = {
  args: {},
};

export const WithCustomLabel: Story = {
  name: 'Custom Label',
  args: { label: 'Print Report' },
};

export const IconOnly: Story = {
  name: 'Icon Only',
  args: { label: 'Print table', iconOnly: true },
};

/** Print a specific element via ref. Click the button to trigger a print dialog. */
export const WithTargetRef: Story = {
  name: 'With Target Ref',
  render: () => {
    const tableRef = React.useRef<HTMLDivElement>(null);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <RoboPrintButton
            targetRef={tableRef}
            label='Print table'
            pageTitle='Satellite Report'
          />
        </div>
        <div
          ref={tableRef}
          style={{
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            overflow: 'hidden',
          }}
        >
          <RoboTable>
            <RoboTableHeader>
              <RoboTableRow>
                <RoboTableHead>Satellite Name</RoboTableHead>
                <RoboTableHead>NORAD ID</RoboTableHead>
                <RoboTableHead>Status</RoboTableHead>
              </RoboTableRow>
            </RoboTableHeader>
            <RoboTableBody>
              {[
                { name: 'Voyager 1', noradId: '25544', status: 'Active' },
                { name: 'Cassini', noradId: '20580', status: 'Docked' },
                { name: 'Kepler', noradId: '43013', status: 'Signal Loss' },
              ].map((row) => (
                <RoboTableRow key={row.noradId}>
                  <RoboTableCell>{row.name}</RoboTableCell>
                  <RoboTableCell className="font-mono">{row.noradId}</RoboTableCell>
                  <RoboTableCell>{row.status}</RoboTableCell>
                </RoboTableRow>
              ))}
            </RoboTableBody>
          </RoboTable>
        </div>
      </div>
    );
  },
};

export const Playground: Story = {
  args: {
    label: 'Print',
    iconOnly: false,
    size: 'sm',
    variant: 'ghost',
  },
};
