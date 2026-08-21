import type { Meta, StoryObj } from '@storybook/react';

import { RoboBreadcrumbs } from './robo-breadcrumbs';
import type { RoboBreadcrumbItem } from './robo-breadcrumbs';


export const componentMeta = {
  description: 'Hierarchical navigation path showing the current page location',
  category: 'navigation' as const,
  keywords: ['breadcrumb', 'path', 'hierarchy', 'navigation', 'back', 'trail', 'location'],
  whenToUse: 'For showing page hierarchy and enabling navigation back to parent sections',
  whenNotToUse: 'For primary navigation use RoboSidebar; for related pages use links',
  pairsWith: ['RoboPageShell', 'RoboTopbar'],
  a11y: 'Uses nav with aria-label="Breadcrumb"; current page marked with aria-current="page"',
};
const meta: Meta<typeof RoboBreadcrumbs> = {
  title: 'Components/Navigation/RoboBreadcrumbs',
  excludeStories: ['componentMeta'],
    component: RoboBreadcrumbs,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
};
export default meta;

type Story = StoryObj<typeof RoboBreadcrumbs>;

const threeItems: RoboBreadcrumbItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Reports', href: '/reports' },
  { label: 'Annual Report' },
];

const manyItems: RoboBreadcrumbItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Operations', href: '/operations' },
  { label: 'Low Earth Orbit', href: '/operations/low-earth-orbit' },
  { label: 'Satellite Details', href: '/operations/low-earth-orbit/satellite' },
  { label: 'Final Report' },
];

export const Default: Story = {
  args: {
    items: threeItems,
  },
};

export const TwoItems: Story = {
  args: {
    items: [
      { label: 'Home', href: '/' },
      { label: 'Reports' },
    ],
  },
};

export const SingleItem: Story = {
  args: {
    items: [{ label: 'Home' }],
  },
};

export const WithOverflow: Story = {
  args: {
    items: manyItems,
    maxItems: 4,
  },
};

export const CustomMaxItems: Story = {
  args: {
    items: manyItems,
    maxItems: 3,
  },
};

export const NoLinks: Story = {
  args: {
    items: [
      { label: 'Section A' },
      { label: 'Section B' },
      { label: 'Current Page' },
    ],
  },
};
