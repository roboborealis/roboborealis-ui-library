import type { Meta, StoryObj } from '@storybook/react';

import { RoboBreadcrumbs } from './robo-breadcrumbs';
import type { RoboBreadcrumbItem } from './robo-breadcrumbs';
import { OverviewStack, OverviewSection } from '../../lib/storybook/overview-layout';

const meta: Meta<typeof RoboBreadcrumbs> = {
  title: 'Components/Navigation/RoboBreadcrumbs',
  component: RoboBreadcrumbs,
  parameters: {
    layout: 'padded',
  },
};
export default meta;

type Story = StoryObj<typeof RoboBreadcrumbs>;

// ---------------------------------------------------------------------------
// Shared item sets
// ---------------------------------------------------------------------------

const twoItems: RoboBreadcrumbItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Orbital Ops' },
];

const threeItems: RoboBreadcrumbItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Orbital Ops', href: '/orbital-ops' },
  { label: 'Satellite Reports' },
];

const fourItems: RoboBreadcrumbItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Orbital Ops', href: '/orbital-ops' },
  { label: 'Satellite Reports', href: '/orbital-ops/satellite-reports' },
  { label: 'FR Report #1234' },
];

const sixItems: RoboBreadcrumbItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Orbital Ops', href: '/orbital-ops' },
  { label: 'Low Earth Orbit', href: '/orbital-ops/low-earth-orbit' },
  { label: 'Satellite Reports', href: '/orbital-ops/low-earth-orbit/satellite-reports' },
  { label: 'Final Reports', href: '/orbital-ops/low-earth-orbit/satellite-reports/final' },
  { label: 'FR Report #1234' },
];

const noLinksItems: RoboBreadcrumbItem[] = [
  { label: 'Home' },
  { label: 'Orbital Ops' },
  { label: 'FR Report #1234' },
];

const singleItem: RoboBreadcrumbItem[] = [
  { label: 'Home' },
];

// ---------------------------------------------------------------------------
// Shared styles
// ---------------------------------------------------------------------------

const rowStyle: React.CSSProperties = {
  padding: '0.75rem 1rem',
  background: 'var(--card)',
  borderRadius: 'var(--radius)',
  border: '1px solid var(--border)',
  marginBottom: '0.5rem',
};

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

export const AllVariants: Story = {
  name: 'All Variants',
  render: () => (
    <OverviewStack>
      <OverviewSection title='2 items'>
        <div style={rowStyle}>
          <RoboBreadcrumbs items={twoItems} />
        </div>
      </OverviewSection>

      <OverviewSection title='3 items'>
        <div style={rowStyle}>
          <RoboBreadcrumbs items={threeItems} />
        </div>
      </OverviewSection>

      <OverviewSection title='4 items'>
        <div style={rowStyle}>
          <RoboBreadcrumbs items={fourItems} />
        </div>
      </OverviewSection>

      <OverviewSection title='Overflow — 6 items collapse to dropdown (maxItems=4)'>
        <div style={rowStyle}>
          <RoboBreadcrumbs items={sixItems} maxItems={4} />
        </div>
      </OverviewSection>

      <OverviewSection title='No links — last item only (plain text)'>
        <div style={rowStyle}>
          <RoboBreadcrumbs items={noLinksItems} />
        </div>
      </OverviewSection>

      <OverviewSection title='Single item'>
        <div style={rowStyle}>
          <RoboBreadcrumbs items={singleItem} />
        </div>
      </OverviewSection>
    </OverviewStack>
  ),
};
