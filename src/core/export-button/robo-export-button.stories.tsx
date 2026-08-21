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

import { RoboExportButton, type RoboExportColumn } from './robo-export-button';


export const componentMeta = {
  description: 'Data export trigger supporting CSV and XLSX formats with download feedback',
  category: 'action' as const,
  keywords: ['export', 'download', 'csv', 'xlsx', 'excel', 'spreadsheet', 'data'],
  whenToUse: 'For exporting table data, reports, or filtered datasets to CSV/XLSX',
  whenNotToUse: 'For clipboard copy use RoboCopyButton; for print use RoboPrintButton',
  pairsWith: ['RoboDataTable', 'RoboToolbar', 'RoboActionButton'],
  a11y: 'Announces export initiation; file download is handled by browser natively',
};
const meta: Meta<typeof RoboExportButton> = {
  title: 'Elements/Actions/RoboExportButton',
  excludeStories: ['componentMeta'],
    component: RoboExportButton,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    format:   { control: 'radio', options: ['csv', 'xlsx'] },
    filename: { control: 'text' },
    label:    { control: 'text' },
    iconOnly: { control: 'boolean' },
    variant:  { control: 'select', options: ['default', 'secondary', 'ghost', 'outline', 'destructive'] },
    size:     { control: 'select', options: ['sm', 'md', 'lg'] },
  },
};
export default meta;

type Story = StoryObj<typeof RoboExportButton>;

// ---------------------------------------------------------------------------
// Shared sample data
// ---------------------------------------------------------------------------

const satellites = [
  { name: 'Voyager 1', noradId: '25544', flag: 'NASA', status: 'Active' },
  { name: 'Cassini', noradId: '20580', flag: 'ESA', status: 'Docked' },
  { name: 'Kepler',  noradId: '43013', flag: 'JAXA', status: 'Signal Loss' },
];

const satelliteColumns: RoboExportColumn[] = [
  { key: 'name',   label: 'Satellite Name' },
  { key: 'noradId',   label: 'NORAD ID' },
  { key: 'flag',   label: 'Operator' },
  { key: 'status', label: 'Status' },
];

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

export const DefaultCsv: Story = {
  name: 'CSV (default)',
  args: { data: satellites, columns: satelliteColumns, filename: 'satellites' },
};

export const ExcelFormat: Story = {
  name: 'Excel Format',
  args: { data: satellites, columns: satelliteColumns, filename: 'satellites', format: 'xlsx' },
};

export const IconOnlyCsv: Story = {
  name: 'Icon Only — CSV',
  args: { data: satellites, columns: satelliteColumns, iconOnly: true },
};

export const IconOnlyExcel: Story = {
  name: 'Icon Only — Excel',
  args: { data: satellites, columns: satelliteColumns, format: 'xlsx', iconOnly: true },
};

export const CustomLabel: Story = {
  name: 'Custom Label',
  args: { data: satellites, columns: satelliteColumns, label: 'Download Report', filename: 'satellite-report' },
};

/** Table with an export toolbar showing both formats. */
export const WithDataTable: Story = {
  name: 'Export Toolbar',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
        <RoboExportButton data={satellites} columns={satelliteColumns} filename='satellites' />
        <RoboExportButton data={satellites} columns={satelliteColumns} filename='satellites' format='xlsx' />
      </div>
      <div
        style={{
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          overflow: 'hidden',
        }}
      >
        <RoboTable>
          <RoboTableHeader>
            <RoboTableRow>
              {satelliteColumns.map((c) => (
                <RoboTableHead key={c.key}>{c.label}</RoboTableHead>
              ))}
            </RoboTableRow>
          </RoboTableHeader>
          <RoboTableBody>
            {satellites.map((row) => (
              <RoboTableRow key={row.noradId}>
                <RoboTableCell>{row.name}</RoboTableCell>
                <RoboTableCell className="font-mono">{row.noradId}</RoboTableCell>
                <RoboTableCell>{row.flag}</RoboTableCell>
                <RoboTableCell>{row.status}</RoboTableCell>
              </RoboTableRow>
            ))}
          </RoboTableBody>
        </RoboTable>
      </div>
    </div>
  ),
};

export const Playground: Story = {
  args: {
    data: satellites,
    columns: satelliteColumns,
    filename: 'export',
    format: 'csv',
    iconOnly: false,
    size: 'sm',
    variant: 'ghost',
  },
};
