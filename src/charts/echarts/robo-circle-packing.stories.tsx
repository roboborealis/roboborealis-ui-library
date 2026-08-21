import type { Meta, StoryObj } from '@storybook/react';

import { CHART_DATASET } from './mock-data';
import { RoboCirclePacking } from './robo-circle-packing';

export const componentMeta = {
  description: 'Nested circles sizing entities by value within grouping bubbles',
  category: 'visualization' as const,
  keywords: ['circle packing', 'bubble', 'hierarchy', 'nested', 'packed', 'size', 'grouping', 'proportion', 'cluster', 'mass'],
  whenToUse: 'For showing relative sizes of items grouped into categories as packed bubbles — like satellites by mass',
  whenNotToUse: 'For strict rectangular hierarchy use RoboTreemap; for radial hierarchy use RoboSunburstChart',
  pairsWith: ['RoboCard', 'RoboTreemap', 'RoboSunburstChart'],
  a11y: 'Renders to a canvas with role img and an aria-label prop that falls back to the title; pair with a data table for screen reader users',
};

const meta: Meta<typeof RoboCirclePacking> = {
  excludeStories: ['componentMeta'],
  title: 'Data/Charts/ECharts/RoboCirclePacking',
  component: RoboCirclePacking,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    minBubbleSize: { control: { type: 'number', min: 5, max: 60, step: 5 } },
    maxBubbleSize: { control: { type: 'number', min: 30, max: 120, step: 5 } },
    height: { control: { type: 'number', min: 200, max: 800, step: 50 } },
    isLoading: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof RoboCirclePacking>;

export const ConstellationBubbles: Story = {
  name: 'Constellation Bubbles',
  args: {
    nodes: CHART_DATASET.circlePackingNodes,
    title: 'Constellation Bubble Packing — Satellites by Mass',
    height: 500,
  },
};

export const SmallBubbles: Story = {
  name: 'Small Bubbles',
  args: {
    nodes: CHART_DATASET.circlePackingNodes,
    title: 'Constellation Bubble Packing — Compact',
    minBubbleSize: 10,
    maxBubbleSize: 50,
    height: 400,
  },
};

export const Loading: Story = {
  name: 'Loading State',
  args: { nodes: [], height: 420, isLoading: true },
};

export const Playground: Story = {
  args: {
    nodes: [],
    title: 'Circle Packing',
    minBubbleSize: 20,
    maxBubbleSize: 80,
    height: 420,
    isLoading: false,
  },
};
