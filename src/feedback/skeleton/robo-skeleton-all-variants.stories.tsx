import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { RoboSkeletonLoading } from './robo-skeleton';
import { OverviewStack, OverviewSection } from '../../lib/storybook/overview-layout';

// ---------------------------------------------------------------------------
// Style constants — no inline objects inside render functions
// ---------------------------------------------------------------------------

const pageStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '40px',
  padding: '32px',
  maxWidth: '640px',
};

const sectionStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
};

const sectionHeaderStyle: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: 700,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: 'var(--muted-foreground, #6b7280)',
  marginBottom: '4px',
  borderBottom: '1px solid var(--border)',
  paddingBottom: '6px',
};

const rowStyle: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '12px',
  alignItems: 'center',
};

const textGroupStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  width: '300px',
};

// Card skeleton sub-layout constants
const cardStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  padding: '16px',
  borderRadius: '8px',
  border: '1px solid var(--border)',
  width: '280px',
};

const cardHeaderRowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
};

const cardTextGroupStyle: React.CSSProperties = {
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
  gap: '6px',
};

const cardFooterRowStyle: React.CSSProperties = {
  display: 'flex',
  gap: '8px',
  marginTop: '4px',
};

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

export const componentMeta = {
  description: 'Decorative loading placeholder in text, circle, and rect variants',
  category: 'feedback' as const,
  keywords: ['skeleton', 'loading', 'placeholder', 'shimmer', 'pulse', 'ghost', 'content'],
  whenToUse: 'While content or data is loading to preserve layout and reduce perceived wait',
  whenNotToUse: 'For button loading states use RoboSpinner; for branded full-page loads use RoboLoading or RoboErrorState',
  pairsWith: ['RoboCard', 'RoboDataTable', 'RoboStack'],
  a11y: 'Always rendered aria-hidden since it is purely decorative; respects prefers-reduced-motion via motion-safe pulse',
};

const meta: Meta<typeof RoboSkeletonLoading> = {
  title: 'Components/Loading/RoboSkeletonLoading',
  excludeStories: ['componentMeta'],
  component: RoboSkeletonLoading,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj<typeof RoboSkeletonLoading>;

// ---------------------------------------------------------------------------
// All Variants story — text / circle / rect
// ---------------------------------------------------------------------------

export const AllVariants: Story = {
  name: 'All Variants',
  render: () => (
    <OverviewStack>

      {/* Text */}
      <OverviewSection title='Text — multiple widths'>
        <div style={textGroupStyle}>
          <RoboSkeletonLoading variant='text' />
          <RoboSkeletonLoading variant='text' width='85%' />
          <RoboSkeletonLoading variant='text' width='70%' />
          <RoboSkeletonLoading variant='text' width='50%' />
          <RoboSkeletonLoading variant='text' width='35%' />
        </div>
      </OverviewSection>

      {/* Circle */}
      <OverviewSection title='Circle — 3 sizes'>
        <div style={rowStyle}>
          <RoboSkeletonLoading variant='circle' width={32} height={32} />
          <RoboSkeletonLoading variant='circle' width={48} height={48} />
          <RoboSkeletonLoading variant='circle' width={64} height={64} />
        </div>
      </OverviewSection>

      {/* Rect */}
      <OverviewSection title='Rect — card-shaped'>
        <div style={rowStyle}>
          <RoboSkeletonLoading variant='rect' width={160} height={90} />
          <RoboSkeletonLoading variant='rect' width={240} height={120} />
          <RoboSkeletonLoading variant='rect' width={300} height={160} />
        </div>
      </OverviewSection>

    </OverviewStack>
  ),
};

// ---------------------------------------------------------------------------
// Card Loading State story — full RoboCard skeleton mockup
// ---------------------------------------------------------------------------

export const CardLoadingState: Story = {
  name: 'Card Loading State',
  render: () => (
    <div style={pageStyle}>
      <section style={sectionStyle}>
        <p style={sectionHeaderStyle}>RoboCard skeleton — header + body + footer</p>

        <div style={cardStyle}>
          {/* Card header row: avatar + title/subtitle */}
          <div style={cardHeaderRowStyle}>
            <RoboSkeletonLoading variant='circle' width={40} height={40} />
            <div style={cardTextGroupStyle}>
              <RoboSkeletonLoading variant='text' width='60%' />
              <RoboSkeletonLoading variant='text' width='40%' />
            </div>
          </div>

          {/* Card image / media area */}
          <RoboSkeletonLoading variant='rect' height={120} />

          {/* Card body text lines */}
          <RoboSkeletonLoading variant='text' />
          <RoboSkeletonLoading variant='text' width='90%' />
          <RoboSkeletonLoading variant='text' width='75%' />

          {/* Card footer: two action button placeholders */}
          <div style={cardFooterRowStyle}>
            <RoboSkeletonLoading variant='rect' width={80} height={32} />
            <RoboSkeletonLoading variant='rect' width={80} height={32} />
          </div>
        </div>
      </section>
    </div>
  ),
};
