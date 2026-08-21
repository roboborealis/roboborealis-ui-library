// ---------------------------------------------------------------------------
// Elements — root Overview (showcase card-grid style)
// ---------------------------------------------------------------------------

import type { Meta, StoryObj } from '@storybook/react';

import { OverviewLinkCards } from '../lib/storybook/overview-layout';

const meta: Meta = {
  title: 'Elements',
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj;

export const Overview: Story = {
  name: 'Elements Overview',
  render: () => (
    <div style={{ maxWidth: 860 }}>
      <h2 style={{ margin: '0 0 6px', fontWeight: 700, fontSize: 22 }}>Elements</h2>
      <p style={{ margin: '0 0 24px', fontSize: 13, color: 'var(--secondary-text)', maxWidth: 600 }}>
        The smallest building blocks — actions, display primitives, flags, icons, and brand assets.
      </p>
      <OverviewLinkCards
        cards={[
          {
            title: 'Actions',
            description: 'Buttons, icon buttons, and utility buttons (copy, export, print, action).',
            links: [{ label: 'All Core components', id: 'elements-actions--overview' }],
          },
          {
            title: 'Display',
            description: 'Avatar, badge, card, chip, accordion, separator, description/field list, kbd.',
            links: [{ label: 'Display overview', id: 'elements-display--overview' }],
          },
          {
            title: 'Flags',
            description: 'Country / region flag icon and searchable flag select.',
            links: [{ label: 'Flags overview', id: 'elements-flags--overview' }],
          },
          {
            title: 'Icons',
            description: 'Orbital domain icons and curated Lucide re-exports.',
            links: [{ label: 'Icon gallery', id: 'elements-icons--all-variants' }],
          },
          {
            title: 'Brand',
            description: 'Logos and brand marks.',
            links: [{ label: 'Brand gallery', id: 'elements-brand--gallery' }],
          },
        ]}
      />
    </div>
  ),
};
