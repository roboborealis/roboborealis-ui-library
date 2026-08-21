import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { RoboCopyButton } from '@/core/copy-button/robo-copy-button';
import { RoboPrintButton } from '@/core/print-button/robo-print-button';
import { RoboExportButton, type RoboExportColumn } from '@/core/export-button/robo-export-button';
import {
  RoboTable,
  RoboTableHeader,
  RoboTableBody,
  RoboTableRow,
  RoboTableHead,
  RoboTableCell,
} from '@/tables/table/robo-table';

/**
 * Demonstrates all three utility action buttons together in realistic contexts.
 *
 * - **RoboCopyButton** — copies a value to the clipboard
 * - **RoboPrintButton** — prints a target element in an isolated window
 * - **RoboExportButton** — downloads data as CSV or Excel
 *
 * These are commonly combined in a compact toolbar next to a data table or
 * detail card.
 */

export const componentMeta = {
  description: 'Grouped action button toolbar combining copy, export, and print',
  category: 'action' as const,
  keywords: ['utility', 'toolbar', 'actions', 'copy', 'export', 'print', 'group'],
  whenToUse: 'For data action toolbars above tables or detail panels — bundles copy/export/print',
  whenNotToUse: 'For individual actions use RoboCopyButton, RoboExportButton, or RoboPrintButton directly',
  pairsWith: ['RoboDataTable', 'RoboCard', 'RoboPageShell'],
  a11y: 'Wrap in role="toolbar" with aria-label describing the action group',
};
const meta: Meta = {
  title: 'Elements/Actions/Utility Buttons',
  excludeStories: ['componentMeta'],
    parameters: { layout: 'padded' },
};
export default meta;

type Story = StoryObj;

// ---------------------------------------------------------------------------
// Shared data
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

/** All toolbar configurations side by side — icon-only, labelled, and inline copy. */
export const AllVariants: Story = {
  name: 'All Variants',
  render: () => {
    const fields = [
      { label: 'NORAD ID', value: '25544' },
      { label: 'COSPAR ID', value: '1977-084A' },
      { label: 'Call Sign', value: 'ARTEMIS' },
    ];
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 480 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>Icon-only toolbar</span>
          <div style={{ display: 'flex', gap: 2 }}>
            <RoboCopyButton value={satellites.map((v) => v.name).join(', ')} label='Copy satellite names' iconOnly />
            <RoboExportButton data={satellites} columns={satelliteColumns} filename='satellites' label='Export CSV' iconOnly />
            <RoboExportButton data={satellites} columns={satelliteColumns} filename='satellites' format='xlsx' label='Export Excel' iconOnly />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>Labelled toolbar</span>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <RoboCopyButton value='25544' label='Copy NORAD ID' />
            <RoboExportButton data={satellites} columns={satelliteColumns} filename='satellites' />
            <RoboExportButton data={satellites} columns={satelliteColumns} filename='satellites' format='xlsx' />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>Inline copy on field values</span>
          {fields.map(({ label, value }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: 280 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem', color: 'var(--foreground)' }}>
                {label}: {value}
              </span>
              <RoboCopyButton value={value} label={`Copy ${label}`} iconOnly />
            </div>
          ))}
        </div>
      </div>
    );
  },
};

/** Action toolbar with icon-only buttons — the most compact form. */
export const IconOnlyToolbar: Story = {
  name: 'Icon-Only Toolbar',
  render: () => {
    const tableRef = React.useRef<HTMLDivElement>(null);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* Toolbar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '8px 12px',
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
          }}
        >
          <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--foreground)' }}>
            Satellite Registry
          </span>
          <div style={{ display: 'flex', gap: 2 }}>
            <RoboCopyButton
              value={satellites.map((v) => v.name).join(', ')}
              label='Copy satellite names'
              iconOnly
            />
            <RoboPrintButton
              targetRef={tableRef}
              label='Print table'
              iconOnly
            />
            <RoboExportButton
              data={satellites}
              columns={satelliteColumns}
              filename='satellites'
              label='Export CSV'
              iconOnly
            />
            <RoboExportButton
              data={satellites}
              columns={satelliteColumns}
              filename='satellites'
              format='xlsx'
              label='Export Excel'
              iconOnly
            />
          </div>
        </div>

        {/* Table */}
        <div
          ref={tableRef}
          style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}
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
    );
  },
};

/** Labelled buttons in a row — useful in larger panels or drawers. */
export const LabelledToolbar: Story = {
  name: 'Labelled Toolbar',
  render: () => {
    const contentRef = React.useRef<HTMLDivElement>(null);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 480 }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <RoboCopyButton value='25544' label='Copy NORAD ID' />
          <RoboPrintButton targetRef={contentRef} label='Print' />
          <RoboExportButton data={satellites} columns={satelliteColumns} filename='satellites' />
          <RoboExportButton data={satellites} columns={satelliteColumns} filename='satellites' format='xlsx' />
        </div>
        <div
          ref={contentRef}
          style={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            padding: 16,
          }}
        >
          <p style={{ color: 'var(--foreground)', margin: 0, fontSize: '0.875rem' }}>
            <strong>NORAD ID:</strong> 25544 &nbsp;·&nbsp;
            <strong>COSPAR ID:</strong> 1977-084A &nbsp;·&nbsp;
            <strong>Operator:</strong> NASA
          </p>
        </div>
      </div>
    );
  },
};

/** Copy button inline with a read-only field value. */
export const CopyFieldValues: Story = {
  name: 'Copy Field Values',
  render: () => {
    const fields = [
      { label: 'NORAD ID', value: '25544' },
      { label: 'COSPAR ID', value: '1977-084A' },
      { label: 'Call Sign', value: 'ARTEMIS' },
      { label: 'Operator', value: 'NASA' },
    ];

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          maxWidth: 340,
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          padding: 16,
        }}
      >
        <p style={{ margin: '0 0 8px', fontWeight: 600, fontSize: '0.875rem', color: 'var(--foreground)' }}>
          Satellite Identifiers
        </p>
        {fields.map(({ label, value }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: '0.7rem', color: 'var(--muted-foreground)', display: 'block' }}>{label}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem', color: 'var(--foreground)' }}>{value}</span>
            </div>
            <RoboCopyButton value={value} label={`Copy ${label}`} iconOnly />
          </div>
        ))}
      </div>
    );
  },
};
