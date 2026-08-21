import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { RoboButton } from '@/core/button/robo-button';

import { RoboErrorBoundary } from './robo-error-boundary';

export const componentMeta = {
  description: 'Catches render errors in its subtree and shows a full-page RoboErrorState instead of crashing',
  category: 'feedback' as const,
  keywords: ['error', 'boundary', 'crash', 'fallback', 'retry', 'satellite'],
  whenToUse: 'Wrap a page or app shell content area so an unexpected render error degrades gracefully',
  whenNotToUse: 'For expected/handled errors (failed form submit, failed fetch) use RoboAlert or RoboErrorState directly, not a boundary',
  pairsWith: ['RoboErrorState', 'RoboPageShell'],
  a11y: 'Delegates to RoboErrorState, which uses role="status" and an accessible retry button',
};

const meta: Meta<typeof RoboErrorBoundary> = {
  title: 'Components/Loaders/RoboErrorBoundary',
  excludeStories: ['componentMeta'],
  component: RoboErrorBoundary,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A class component — React has no hook-based equivalent for `componentDidCatch`. ' +
          'Retrying resets the boundary, unmounting and remounting the subtree.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof RoboErrorBoundary>;

function Bomb(): React.ReactElement {
  throw new Error('Simulated render error');
}

function BombOnClick() {
  const [crash, setCrash] = React.useState(false);
  if (crash) {
    throw new Error('Simulated render error');
  }
  return (
    <RoboButton variant='destructive' onClick={() => setCrash(true)}>
      Trigger an error
    </RoboButton>
  );
}

export const Default: Story = {
  name: 'Catches a render error',
  render: () => (
    <RoboErrorBoundary>
      <Bomb />
    </RoboErrorBoundary>
  ),
};

export const Interactive: Story = {
  name: 'Interactive — trigger then retry',
  render: () => (
    <RoboErrorBoundary onRetry={() => undefined}>
      <BombOnClick />
    </RoboErrorBoundary>
  ),
};

export const CustomFallback: Story = {
  name: 'Custom fallback',
  render: () => (
    <RoboErrorBoundary fallback={<p>Something went wrong. Please contact support.</p>}>
      <Bomb />
    </RoboErrorBoundary>
  ),
};
