// ---------------------------------------------------------------------------
// Components — root Overview (showcase card-grid style)
// ---------------------------------------------------------------------------

import type { Meta, StoryObj } from '@storybook/react';

import { OverviewLinkCards } from '../lib/storybook/overview-layout';

const meta: Meta = {
  title: 'Components',
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj;

export const Overview: Story = {
  name: 'Components Overview',
  render: () => (
    <div style={{ maxWidth: 860 }}>
      <h2 style={{ margin: '0 0 6px', fontWeight: 700, fontSize: 22 }}>Components</h2>
      <p style={{ margin: '0 0 24px', fontSize: 13, color: 'var(--secondary-text)', maxWidth: 600 }}>
        Interactive UI building blocks. Each group has its own overview — click through to see every
        component and its variants.
      </p>
      <OverviewLinkCards
        cards={[
          {
            title: 'Feedback',
            description: 'Alerts, dialogs, popovers, tooltips, toasts, progress, dropdowns, and empty states.',
            links: [{ label: 'All Feedback', id: 'components-feedback--overview' }],
          },
          {
            title: 'Forms',
            description: 'Inputs, selects, checkboxes, radios, switches, sliders, date pickers.',
            links: [
              { label: 'All Form controls', id: 'components-forms--overview' },
              { label: 'Rich Text Editor', id: 'components-forms-rich-text-editor--overview' },
            ],
          },
          {
            title: 'Overlays',
            description: 'Dialog, Popover, and Tooltip.',
            links: [{ label: 'All Overlays', id: 'components-overlays--overview' }],
          },
          {
            title: 'Navigation',
            description: 'Topbar, sidebar, bottom nav, breadcrumbs, tabs, command palette, quick panel.',
            links: [{ label: 'All Navigation', id: 'components-navigation--overview' }],
          },
          {
            title: 'Layout',
            description: 'Grid, stack, divider, and page shell primitives.',
            links: [{ label: 'All Layout', id: 'components-layout--overview' }],
          },
          {
            title: 'Loading',
            description: 'Spinners, skeletons, branded loaders, and the top loading bar.',
            links: [{ label: 'All Loaders', id: 'components-loading--overview' }],
          },
        ]}
      />
    </div>
  ),
};
