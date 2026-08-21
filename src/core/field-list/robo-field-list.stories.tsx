import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { RoboFieldList } from './robo-field-list';

export const componentMeta = {
  description: 'Striped label/value readout for a single record — muted label left, mono value right',
  category: 'display' as const,
  keywords: ['field list', 'readout', 'key value', 'label value', 'striped', 'record', 'detail', 'panel', 'anomaly'],
  whenToUse: 'Dense readout of one record\'s fields in a panel or card — anomaly summaries, inspector details, status readouts',
  whenNotToUse: 'Plain (unstriped) key-value pairs (use RoboDescriptionList); multi-row tabular data (use RoboTable/RoboDataTable); editable fields (use RoboFormField)',
  pairsWith: ['RoboCard', 'RoboBadge'],
  a11y: 'Real dl/dt/dd semantics — screen readers announce each label/value pair as a term/detail',
};

const meta: Meta<typeof RoboFieldList> = {
  title: 'Elements/Display/RoboFieldList',
  component: RoboFieldList,
  excludeStories: ['componentMeta'],
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Compact striped readout of a single record\'s fields — muted label on the left, mono ' +
          'right-aligned value on the right, zebra striping and per-row dividers. The striping keeps ' +
          'dense readouts scannable. For plain key-value pairs use `RoboDescriptionList`; for rows of ' +
          'many records use `RoboTable`/`RoboDataTable`.',
      },
    },
  },
  argTypes: {
    striped: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof RoboFieldList>;

const satelliteFields = [
  { label: 'Spacecraft', value: 'VOYAGER 1' },
  { label: 'NORAD ID', value: '25544' },
  { label: 'Altitude', value: '420 km' },
  { label: 'Velocity', value: '7.66 km/s' },
  { label: 'Last Contact', value: '2026-07-04 14:02Z' },
];

export const Default: Story = {
  args: { fields: satelliteFields },
  render: (args) => (
    <div style={{ maxWidth: 320 }}>
      <RoboFieldList {...args} />
    </div>
  ),
};

export const Unstriped: Story = {
  name: 'Without Striping',
  args: { fields: satelliteFields, striped: false },
  render: (args) => (
    <div style={{ maxWidth: 320 }}>
      <RoboFieldList {...args} />
    </div>
  ),
};
