import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import {
  RoboTable,
  RoboTableHeader,
  RoboTableBody,
  RoboTableFooter,
  RoboTableRow,
  RoboTableHead,
  RoboTableCell,
  RoboTableCaption,
} from './robo-table';
import { RoboEmailTable } from './robo-email-table';

export const componentMeta = {
  description: 'Static read-only HTML table with zero dependencies — the lightweight counterpart to RoboDataTable',
  category: 'display' as const,
  keywords: ['table', 'static', 'simple', 'dumb', 'read-only', 'html table', 'email', 'print', 'report', 'grid', 'rows', 'columns'],
  whenToUse: 'Static read-only tabular data — report bodies, emails, print views, server-rendered pages, or any small table that needs no interactivity',
  whenNotToUse: 'Sorting, filtering, pagination, selection, or inline editing — use RoboDataTable. For email HTML output use RoboEmailTable (inline styles survive email clients)',
  pairsWith: ['RoboCard', 'RoboPrintButton', 'RoboExportButton', 'RoboBadge'],
  a11y: 'Real table semantics (table/thead/tbody/th/td); use RoboTableCaption to name the table for screen readers; RoboTableHead emits scope=col by default (pass scope=row for row headers)',
};

const meta: Meta<typeof RoboTable> = {
  title: 'Data/Tables/RoboTable',
  component: RoboTable,
  excludeStories: ['componentMeta'],
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'The "dumb" table: real `<table>` semantics, token styling, density-aware padding, **zero TanStack**. ' +
          'Renders server-side, prints cleanly, and tree-shakes to almost nothing. ' +
          'Need sorting/filtering/pagination? That is `RoboDataTable`. ' +
          'Need HTML for an **email body**? Use `RoboEmailTable` — inline styles only, since email clients strip stylesheets and cannot resolve CSS variables.',
      },
    },
  },
  argTypes: {
    variant: { control: 'select', options: ['default', 'striped', 'bordered'] },
  },
};

export default meta;
type Story = StoryObj<typeof RoboTable>;

const missions = [
  { satellite: 'Artemis II', flag: 'NASA', departure: 'Cape Canaveral, FL', eta: '2026-07-04 14:00Z', status: 'In Transit' },
  { satellite: 'Orion', flag: 'ESA', departure: 'Kennedy LC-39A', eta: '2026-07-05 08:30Z', status: 'In Transit' },
  { satellite: 'Sentinel-1', flag: 'ESA', departure: 'Vandenberg SFB', eta: '2026-07-06 22:15Z', status: 'Docked' },
  { satellite: 'Progress MS', flag: 'Roscosmos', departure: 'Baikonur', eta: '2026-07-08 05:45Z', status: 'Holding' },
];

function MissionTable({ variant }: { variant?: 'default' | 'striped' | 'bordered' }) {
  return (
    <RoboTable variant={variant}>
      <RoboTableCaption>Active missions — generated 2026-07-03</RoboTableCaption>
      <RoboTableHeader>
        <RoboTableRow>
          <RoboTableHead>Spacecraft</RoboTableHead>
          <RoboTableHead>Operator</RoboTableHead>
          <RoboTableHead>Launch Site</RoboTableHead>
          <RoboTableHead>ETA</RoboTableHead>
          <RoboTableHead>Status</RoboTableHead>
        </RoboTableRow>
      </RoboTableHeader>
      <RoboTableBody>
        {missions.map((v) => (
          <RoboTableRow key={v.satellite}>
            <RoboTableCell>{v.satellite}</RoboTableCell>
            <RoboTableCell>{v.flag}</RoboTableCell>
            <RoboTableCell>{v.departure}</RoboTableCell>
            <RoboTableCell>{v.eta}</RoboTableCell>
            <RoboTableCell>{v.status}</RoboTableCell>
          </RoboTableRow>
        ))}
      </RoboTableBody>
      <RoboTableFooter>
        <RoboTableRow>
          <RoboTableCell colSpan={4}>Total active missions</RoboTableCell>
          <RoboTableCell>{missions.length}</RoboTableCell>
        </RoboTableRow>
      </RoboTableFooter>
    </RoboTable>
  );
}

export const Default: Story = {
  render: () => <MissionTable />,
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '2rem' }}>
      <MissionTable variant="default" />
      <MissionTable variant="striped" />
      <MissionTable variant="bordered" />
    </div>
  ),
};

export const EmailTable: Story = {
  name: 'Email Table',
  parameters: {
    docs: {
      description: {
        story:
          'RoboEmailTable renders with inline styles and literal colors only — no classes, no CSS variables — ' +
          'so the markup survives email clients. Every row sets its own background, so the table stays legible ' +
          'regardless of the client. Shown here inside a white email-body preview (the surface it is designed for). ' +
          'Pair with `renderToStaticMarkup` from react-dom/server to produce an email body.',
      },
    },
  },
  render: () => (
    // Email tables render inside a white email body, not the app canvas.
    // This preview frame reproduces that so the story reads correctly in
    // both Storybook light and dark chrome.
    <div
      style={{
        background: '#ffffff',
        padding: 24,
        borderRadius: 8,
        maxWidth: 640,
        boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
      }}
    >
      <RoboEmailTable
        caption="Flight Plan Summary — Artemis II"
        columns={[
          { key: 'port', header: 'Ground Station' },
          { key: 'arrival', header: 'Acquired', align: 'right' },
          { key: 'departure', header: 'Loss of Signal', align: 'right' },
        ]}
        rows={[
          { port: 'Goldstone DSN', arrival: '—', departure: '2026-07-01 09:00Z' },
          { port: 'Madrid DSN', arrival: '2026-07-02 18:00Z', departure: '2026-07-03 06:00Z' },
          { port: 'Canberra DSN', arrival: '2026-07-04 14:00Z', departure: '—' },
        ]}
      />
    </div>
  ),
};
