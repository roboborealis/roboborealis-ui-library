import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { RoboGrid } from './robo-grid';
import { OverviewStack, OverviewSection } from '../../lib/storybook/overview-layout';

// ---------------------------------------------------------------------------
// Helper — a simple placeholder cell so the grid structure is obvious
// ---------------------------------------------------------------------------
function Cell({ children, span }: { children?: React.ReactNode; span?: number }) {
  return (
    <div
      style={{
        gridColumn: span ? `span ${span}` : undefined,
        background: 'color-mix(in oklch, var(--primary) 18%, var(--card))',
        border: '1px solid var(--primary)',
        borderRadius: 'var(--radius-sm)',
        padding: '12px 8px',
        textAlign: 'center',
        fontSize: '0.75rem',
        color: 'var(--foreground)',
      }}
    >
      {children ?? 'Cell'}
    </div>
  );
}


export const componentMeta = {
  description: 'CSS Grid layout container with responsive column configuration',
  category: 'layout' as const,
  keywords: ['grid', 'columns', 'responsive', 'layout', 'container', 'auto', 'gap'],
  whenToUse: 'For multi-column responsive layouts — card grids, form layouts, dashboard sections',
  whenNotToUse: 'For single-direction stacking use RoboStack; for page chrome use RoboPageShell',
  pairsWith: ['RoboCard', 'RoboStatCard', 'RoboStack'],
  a11y: 'Purely presentational — ensure content reading order is logical regardless of visual grid position',
};
const meta: Meta<typeof RoboGrid> = {
  title: 'Components/Layout/RoboGrid',
  excludeStories: ['componentMeta'],
    component: RoboGrid,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    cols: { control: { type: 'number', min: 1, max: 12 } },
    gap:    { control: 'select', options: ['none', 'xs', 'sm', 'md', 'lg', 'xl'] },
    rowGap: { control: 'select', options: [undefined, 'none', 'xs', 'sm', 'md', 'lg', 'xl'] },
  },
};
export default meta;

type Story = StoryObj<typeof RoboGrid>;

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

export const AllVariants: Story = {
  name: 'All Variants',
  render: () => (
    <OverviewStack>
      <OverviewSection title='2 columns'>
        <RoboGrid cols={2} gap='md'>
          <Cell>1</Cell>
          <Cell>2</Cell>
          <Cell>3</Cell>
          <Cell>4</Cell>
        </RoboGrid>
      </OverviewSection>

      <OverviewSection title='3 columns'>
        <RoboGrid cols={3} gap='md'>
          {Array.from({ length: 6 }, (_, i) => <Cell key={i}>{i + 1}</Cell>)}
        </RoboGrid>
      </OverviewSection>

      <OverviewSection title='12-col layout (span)'>
        <RoboGrid cols={12} gap='md'>
          <Cell span={12}>span 12 — full width</Cell>
          <Cell span={8}>span 8 — main</Cell>
          <Cell span={4}>span 4 — sidebar</Cell>
          <Cell span={6}>span 6</Cell>
          <Cell span={6}>span 6</Cell>
        </RoboGrid>
      </OverviewSection>
    </OverviewStack>
  ),
};

export const TwoColumns: Story = {
  name: '2 Columns',
  render: () => (
    <RoboGrid cols={2} gap='md'>
      <Cell>1</Cell>
      <Cell>2</Cell>
      <Cell>3</Cell>
      <Cell>4</Cell>
    </RoboGrid>
  ),
};

export const ThreeColumns: Story = {
  name: '3 Columns',
  render: () => (
    <RoboGrid cols={3} gap='md'>
      {Array.from({ length: 6 }, (_, i) => <Cell key={i}>{i + 1}</Cell>)}
    </RoboGrid>
  ),
};

export const FourColumns: Story = {
  name: '4 Columns',
  render: () => (
    <RoboGrid cols={4} gap='md'>
      {Array.from({ length: 8 }, (_, i) => <Cell key={i}>{i + 1}</Cell>)}
    </RoboGrid>
  ),
};

export const TwelveColumn: Story = {
  name: '12-Col Layout (standard page grid)',
  render: () => (
    <RoboGrid cols={12} gap='md'>
      {/* Full width */}
      <Cell span={12}>span 12 — full width</Cell>
      {/* 8 + 4 split */}
      <Cell span={8}>span 8 — main content</Cell>
      <Cell span={4}>span 4 — sidebar</Cell>
      {/* Three equal thirds */}
      <Cell span={4}>span 4</Cell>
      <Cell span={4}>span 4</Cell>
      <Cell span={4}>span 4</Cell>
      {/* 6 + 6 halves */}
      <Cell span={6}>span 6</Cell>
      <Cell span={6}>span 6</Cell>
    </RoboGrid>
  ),
};

export const GapSizes: Story = {
  name: 'Gap Sizes',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {(['none', 'xs', 'sm', 'md', 'lg', 'xl'] as const).map((gap) => (
        <div key={gap}>
          <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginBottom: 8 }}>
            gap=&quot;{gap}&quot;
          </p>
          <RoboGrid cols={4} gap={gap}>
            <Cell>A</Cell><Cell>B</Cell><Cell>C</Cell><Cell>D</Cell>
          </RoboGrid>
        </div>
      ))}
    </div>
  ),
};

export const SeparateRowAndColumnGap: Story = {
  name: 'Row vs Column Gap',
  render: () => (
    <RoboGrid cols={3} gap='xl' rowGap='xs'>
      {Array.from({ length: 9 }, (_, i) => <Cell key={i}>{i + 1}</Cell>)}
    </RoboGrid>
  ),
};

export const Playground: Story = {
  args: { cols: 3, gap: 'md' },
  render: (args) => (
    <RoboGrid {...args}>
      {Array.from({ length: args.cols ?? 3 }, (_, i) => <Cell key={i}>{i + 1}</Cell>)}
    </RoboGrid>
  ),
};
