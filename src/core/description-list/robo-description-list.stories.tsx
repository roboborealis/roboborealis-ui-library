import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import {
  RoboDescriptionList,
  RoboDescriptionTerm,
  RoboDescriptionDetail,
} from './robo-description-list';

export const componentMeta = {
  description: 'Semantic key-value display on dl/dt/dd — labeled read-only values in detail panels and report metadata',
  category: 'display' as const,
  keywords: ['description list', 'definition list', 'dl', 'key value', 'properties', 'metadata', 'detail', 'label', 'read-only'],
  whenToUse: 'Displaying labeled values that are read, not edited — satellite detail panels, report metadata blocks, settings summaries, entity properties',
  whenNotToUse: 'Editable values (use RoboFormField), tabular multi-row data (use RoboTable or RoboDataTable)',
  pairsWith: ['RoboCard', 'RoboEntityDossier', 'RoboBadge', 'RoboSeparator'],
  a11y: 'Real dl/dt/dd semantics — screen readers announce term/detail pairs; keys auto-formatted from snake_case to Title Case',
};

const meta: Meta<typeof RoboDescriptionList> = {
  title: 'Elements/Display/RoboDescriptionList',
  component: RoboDescriptionList,
  excludeStories: ['componentMeta'],
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Key-value display on real `<dl>/<dt>/<dd>` semantics. Two APIs: pass `items` (an object — keys are ' +
          'Title-Cased, values formatted, nulls become em-dashes) for the quick path, or compose ' +
          '`RoboDescriptionTerm`/`RoboDescriptionDetail` children for full control. Promoted from the entity ' +
          'dossier property grid, which now consumes this primitive.',
      },
    },
  },
  argTypes: {
    layout: { control: 'select', options: ['grid', 'stacked'] },
  },
};

export default meta;
type Story = StoryObj<typeof RoboDescriptionList>;

const satellite = {
  spacecraft_name: 'Voyager 1',
  operator: 'NASA',
  norad_id: 25544,
  cospar_id: '1977-084A',
  signal_active: true,
  last_contact: 'Goldstone, CA',
  destination: null,
};

export const Default: Story = {
  render: () => <RoboDescriptionList items={satellite} />,
};

export const Stacked: Story = {
  render: () => <RoboDescriptionList layout="stacked" items={satellite} />,
};

export const Composed: Story = {
  render: () => (
    <RoboDescriptionList>
      <RoboDescriptionTerm>Spacecraft</RoboDescriptionTerm>
      <RoboDescriptionDetail>Voyager 1</RoboDescriptionDetail>
      <RoboDescriptionTerm>Status</RoboDescriptionTerm>
      <RoboDescriptionDetail>
        <strong>Active</strong> — cruising at 7.66 km/s
      </RoboDescriptionDetail>
    </RoboDescriptionList>
  ),
};
