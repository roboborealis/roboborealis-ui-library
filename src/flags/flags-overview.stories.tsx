import type { Meta, StoryObj } from '@storybook/react';

import { OverviewLinkCards } from '../lib/storybook/overview-layout';

const meta: Meta = {
  title: 'Elements/Flags',
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  name: 'Flags Overview',
  render: () => (
    <div style={{ maxWidth: 860 }}>
      <h2 style={{ margin: '0 0 6px', fontWeight: 700, fontSize: 22 }}>Flags</h2>
      <p style={{ margin: '0 0 24px', fontSize: 13, color: 'var(--secondary-text)', maxWidth: 600 }}>
        Country and region flag components for satellite origins, nationality indicators, and geographic
        selectors. Click a component to see its variants.
      </p>
      <OverviewLinkCards
        cards={[
          {
            title: 'RoboFlag',
            description: 'Renders a flag icon by ISO 3166-1 alpha-2 country code.',
            links: [
              { label: 'Gallery', id: 'elements-flags-roboflag--gallery' },
              { label: 'All sizes', id: 'elements-flags-roboflag--all-sizes' },
            ],
          },
          {
            title: 'RoboFlagSelect',
            description: 'Searchable dropdown combining a flag icon with country name for form inputs.',
            links: [
              { label: 'All states', id: 'elements-flags-roboflagselect--all-states' },
              { label: 'Default', id: 'elements-flags-roboflagselect--default' },
            ],
          },
        ]}
      />
    </div>
  ),
};
