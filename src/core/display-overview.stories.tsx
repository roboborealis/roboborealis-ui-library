// ---------------------------------------------------------------------------
// Elements/Display — Overview (showcase card-grid style)
// ---------------------------------------------------------------------------

import type { Meta, StoryObj } from '@storybook/react';

import { OverviewLinkCards } from '../lib/storybook/overview-layout';

const meta: Meta = {
  title: 'Elements/Display',
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj;

export const Overview: Story = {
  name: 'Display Overview',
  render: () => (
    <div style={{ maxWidth: 860 }}>
      <h2 style={{ margin: '0 0 6px', fontWeight: 700, fontSize: 22 }}>Display</h2>
      <p style={{ margin: '0 0 24px', fontSize: 13, color: 'var(--secondary-text)', maxWidth: 600 }}>
        Read-only presentation primitives — containers, labels, and value readouts. Click any component to
        see its variants.
      </p>
      <OverviewLinkCards
        cards={[
          {
            title: 'Containers & labels',
            description: 'Cards, accordions, avatars, badges, chips, separators, and keyboard keys.',
            links: [
              { label: 'RoboCard', id: 'elements-display-robocard--all-variants' },
              { label: 'RoboAccordion', id: 'elements-display-roboaccordion--all-variants' },
              { label: 'RoboAvatar', id: 'elements-display-roboavatar--all-variants' },
              { label: 'RoboBadge', id: 'elements-display-robobadge--all-sizes' },
              { label: 'RoboChip', id: 'elements-display-robochip--active-filters' },
              { label: 'RoboSeparator', id: 'elements-display-roboseparator--all-variants' },
              { label: 'RoboKbd', id: 'elements-display-robokbd--all-variants' },
            ],
          },
          {
            title: 'Value readouts',
            description: 'Key-value lists and the orbital course indicator.',
            links: [
              { label: 'RoboDescriptionList', id: 'elements-display-robodescriptionlist--composed' },
              { label: 'RoboFieldList', id: 'elements-display-robofieldlist--default' },
              { label: 'RoboCourseIndicator', id: 'elements-display-robocourseindicator--all-sizes' },
            ],
          },
        ]}
      />
    </div>
  ),
};
