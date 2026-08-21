import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { RoboStack } from './robo-stack';
import { OverviewStack, OverviewSection } from '../../lib/storybook/overview-layout';

function Box({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: 'var(--primary)',
        color: 'var(--primary-foreground)',
        borderRadius: 'var(--radius-sm)',
        padding: '8px 16px',
        fontSize: '0.8rem',
        fontFamily: 'var(--font-mono)',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </div>
  );
}


export const componentMeta = {
  description: 'Flexbox layout primitive for vertical or horizontal item stacking',
  category: 'layout' as const,
  keywords: ['stack', 'flex', 'vertical', 'horizontal', 'spacing', 'gap', 'container'],
  whenToUse: 'For stacking elements vertically or horizontally with consistent gap spacing',
  whenNotToUse: 'For complex grid layouts use RoboGrid; for full-page structure use RoboPageShell',
  pairsWith: ['RoboCard', 'RoboButton', 'RoboFormField', 'RoboBadge'],
  a11y: 'Purely presentational — ensure logical DOM order matches visual order',
};
const meta: Meta<typeof RoboStack> = {
  title: 'Components/Layout/RoboStack',
  excludeStories: ['componentMeta'],
    component: RoboStack,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    direction: { control: 'radio',  options: ['vertical', 'horizontal'] },
    gap:       { control: 'select', options: ['none', 'xs', 'sm', 'md', 'lg', 'xl'] },
    align:     { control: 'select', options: ['start', 'center', 'end', 'stretch', 'baseline'] },
    justify:   { control: 'select', options: ['start', 'center', 'end', 'between', 'around', 'evenly'] },
    wrap:      { control: 'boolean' },
    inline:    { control: 'boolean' },
  },
};
export default meta;

type Story = StoryObj<typeof RoboStack>;

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

export const AllVariants: Story = {
  name: 'All Variants',
  render: () => (
    <OverviewStack>
      <OverviewSection title='Vertical'>
        <RoboStack gap='md'>
          <Box>Item one</Box>
          <Box>Item two</Box>
          <Box>Item three</Box>
        </RoboStack>
      </OverviewSection>

      <OverviewSection title='Horizontal'>
        <RoboStack direction='horizontal' gap='md' align='center'>
          <Box>Left</Box>
          <Box>Center</Box>
          <Box>Right</Box>
        </RoboStack>
      </OverviewSection>

      <OverviewSection title='Gap sizes (horizontal)'>
        <RoboStack gap='lg'>
          {(['none', 'xs', 'sm', 'md', 'lg', 'xl'] as const).map((gap) => (
            <div key={gap}>
              <p style={{ fontSize: '0.7rem', color: 'var(--muted-foreground)', marginBottom: 4 }}>
                gap=&quot;{gap}&quot;
              </p>
              <RoboStack direction='horizontal' gap={gap} align='center'>
                <Box>A</Box>
                <Box>B</Box>
                <Box>C</Box>
              </RoboStack>
            </div>
          ))}
        </RoboStack>
      </OverviewSection>
    </OverviewStack>
  ),
};

export const Vertical: Story = {
  render: () => (
    <RoboStack gap='md'>
      <Box>Item one</Box>
      <Box>Item two</Box>
      <Box>Item three</Box>
    </RoboStack>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <RoboStack direction='horizontal' gap='md' align='center'>
      <Box>Left</Box>
      <Box>Center</Box>
      <Box>Right</Box>
    </RoboStack>
  ),
};

export const SpaceBetween: Story = {
  name: 'Horizontal — Space Between',
  render: () => (
    <RoboStack direction='horizontal' justify='between' align='center'>
      <Box>Logo</Box>
      <RoboStack direction='horizontal' gap='sm' align='center'>
        <Box>Nav A</Box>
        <Box>Nav B</Box>
        <Box>Nav C</Box>
      </RoboStack>
      <Box>User</Box>
    </RoboStack>
  ),
};

export const GapSizes: Story = {
  name: 'Gap Sizes (horizontal)',
  render: () => (
    <RoboStack gap='xl'>
      {(['none', 'xs', 'sm', 'md', 'lg', 'xl'] as const).map((gap) => (
        <div key={gap}>
          <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginBottom: 4 }}>
            gap=&quot;{gap}&quot;
          </p>
          <RoboStack direction='horizontal' gap={gap} align='center'>
            <Box>A</Box>
            <Box>B</Box>
            <Box>C</Box>
          </RoboStack>
        </div>
      ))}
    </RoboStack>
  ),
};

export const Wrapping: Story = {
  name: 'Wrap (horizontal)',
  render: () => (
    <div style={{ width: 340, border: '1px dashed var(--border)', borderRadius: 'var(--radius)', padding: 8 }}>
      <RoboStack direction='horizontal' gap='sm' wrap>
        {['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta'].map((name) => (
          <Box key={name}>{name}</Box>
        ))}
      </RoboStack>
    </div>
  ),
};

export const AlignmentVariants: Story = {
  name: 'Alignment Variants',
  render: () => (
    <RoboStack gap='lg'>
      {(['start', 'center', 'end'] as const).map((align) => (
        <div key={align}>
          <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginBottom: 4 }}>
            align=&quot;{align}&quot;
          </p>
          <RoboStack direction='horizontal' gap='md' align={align}
            style={{ border: '1px dashed var(--border)', borderRadius: 'var(--radius)', padding: 8, height: 64 }}
          >
            <Box>Short</Box>
            <div style={{ ...{ background: 'var(--primary)', color: 'var(--primary-foreground)', borderRadius: 'var(--radius-sm)', padding: '8px 16px', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' } }}>
              Tall<br/>item
            </div>
            <Box>Short</Box>
          </RoboStack>
        </div>
      ))}
    </RoboStack>
  ),
};

export const Playground: Story = {
  args: { direction: 'horizontal', gap: 'md', align: 'center', justify: 'start' },
  render: (args) => (
    <RoboStack {...args}>
      <Box>Alpha</Box>
      <Box>Beta</Box>
      <Box>Gamma</Box>
    </RoboStack>
  ),
};
