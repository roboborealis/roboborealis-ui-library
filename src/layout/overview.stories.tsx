import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Home, FileText, Settings } from 'lucide-react';

import { RoboGrid } from './grid/robo-grid';
import { RoboStack } from './stack/robo-stack';
import { RoboDivider } from './divider/robo-divider';
import { RoboPageShell } from './page-shell/robo-page-shell';
import { OverviewAccordion, OverviewGroup } from '../lib/storybook/overview-layout';

// ---------------------------------------------------------------------------
// Style constants
// ---------------------------------------------------------------------------

const pageStyle: React.CSSProperties = {
  padding: 8,
};

const sectionStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
};

const headingStyle: React.CSSProperties = {
  fontSize: '1rem',
  fontWeight: 700,
  color: 'var(--foreground)',
  margin: 0,
};

const placeholderCellStyle: React.CSSProperties = {
  background: 'color-mix(in oklch, var(--primary) 18%, var(--card))',
  border: '1px solid var(--primary)',
  borderRadius: 'var(--radius-sm)',
  padding: '12px 8px',
  textAlign: 'center',
  fontSize: '0.75rem',
  color: 'var(--foreground)',
};

const stackBoxStyle: React.CSSProperties = {
  background: 'var(--primary)',
  color: 'var(--primary-foreground)',
  borderRadius: 'var(--radius-sm)',
  padding: '8px 16px',
  fontSize: '0.8rem',
  fontFamily: 'var(--font-mono)',
  whiteSpace: 'nowrap',
};

const pageShellThumbnailStyle: React.CSSProperties = {
  height: 280,
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius)',
  overflow: 'hidden',
};

// ---------------------------------------------------------------------------
// Local helper components (defined as named functions, not inline)
// ---------------------------------------------------------------------------

function PlaceholderCell({ children, span }: { children?: React.ReactNode; span?: number }) {
  return (
    <div
      style={{
        ...placeholderCellStyle,
        gridColumn: span ? `span ${span}` : undefined,
      }}
    >
      {children ?? 'Cell'}
    </div>
  );
}

function StackBox({ children }: { children: React.ReactNode }) {
  return <div style={stackBoxStyle}>{children}</div>;
}

function ShellSidebar() {
  return (
    <nav
      aria-label='Main navigation'
      style={{
        width: '11rem',
        height: '100%',
        background: 'var(--card)',
        borderRight: '1px solid var(--border)',
        padding: '0.75rem 0.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.25rem',
      }}
    >
      {[
        { label: 'Dashboard', icon: <Home size={14} /> },
        { label: 'Reports', icon: <FileText size={14} /> },
        { label: 'Settings', icon: <Settings size={14} /> },
      ].map((item) => (
        <div
          key={item.label}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 0.6rem',
            borderRadius: '6px',
            fontSize: '13px',
            color: 'var(--foreground)',
          }}
        >
          {item.icon}
          {item.label}
        </div>
      ))}
    </nav>
  );
}

function ShellTopbar() {
  return (
    <header
      role='banner'
      style={{
        height: '3rem',
        display: 'flex',
        alignItems: 'center',
        padding: '0 1rem',
        background: 'var(--card)',
        borderBottom: '1px solid var(--border)',
        fontWeight: 700,
        fontSize: '0.875rem',
      }}
    >
      Orbital Operations Center
    </header>
  );
}

function ShellContent() {
  return (
    <div style={{ padding: '1rem' }}>
      <p style={{ fontWeight: 700, marginBottom: 8, fontSize: '1rem' }}>Dashboard</p>
      <p style={{ color: 'var(--muted-foreground)', fontSize: '0.8rem', lineHeight: 1.6 }}>
        Main content — scrollable region below the topbar.
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Meta — we attach the story to the RoboGrid component but the story is
// really a composition overview, so we use a custom render each time.
// ---------------------------------------------------------------------------

const meta: Meta = {
  title: 'Components/Layout',
  parameters: { layout: 'padded' },
};
export default meta;

type Story = StoryObj;

// ---------------------------------------------------------------------------
// The one story
// ---------------------------------------------------------------------------

export const Overview: Story = {
  name: 'Layout Overview',
  render: () => (
    <div style={pageStyle}>
      <OverviewAccordion>

        {/* ── Grid ─────────────────────────────────────────────── */}
        <OverviewGroup value="grid" title="RoboGrid">
          <div style={sectionStyle}>
            <p style={headingStyle}>2 Columns</p>
            <RoboGrid cols={2} gap='md'>
              <PlaceholderCell>1</PlaceholderCell>
              <PlaceholderCell>2</PlaceholderCell>
              <PlaceholderCell>3</PlaceholderCell>
              <PlaceholderCell>4</PlaceholderCell>
            </RoboGrid>
          </div>

          <div style={sectionStyle}>
            <p style={headingStyle}>3 Columns</p>
            <RoboGrid cols={3} gap='md'>
              {Array.from({ length: 6 }, (_, i) => (
                <PlaceholderCell key={i}>{i + 1}</PlaceholderCell>
              ))}
            </RoboGrid>
          </div>

          <div style={sectionStyle}>
            <p style={headingStyle}>4 Columns</p>
            <RoboGrid cols={4} gap='md'>
              {Array.from({ length: 8 }, (_, i) => (
                <PlaceholderCell key={i}>{i + 1}</PlaceholderCell>
              ))}
            </RoboGrid>
          </div>
        </OverviewGroup>

        {/* ── Stack ────────────────────────────────────────────── */}
        <OverviewGroup value="stack" title="RoboStack">
          <div style={sectionStyle}>
            <p style={headingStyle}>Vertical (default)</p>
            <RoboStack gap='sm'>
              <StackBox>Item one</StackBox>
              <StackBox>Item two</StackBox>
              <StackBox>Item three</StackBox>
            </RoboStack>
          </div>

          <div style={sectionStyle}>
            <p style={headingStyle}>Horizontal</p>
            <RoboStack direction='horizontal' gap='md' align='center'>
              <StackBox>Left</StackBox>
              <StackBox>Center</StackBox>
              <StackBox>Right</StackBox>
            </RoboStack>
          </div>

          <div style={sectionStyle}>
            <p style={headingStyle}>Space Between</p>
            <RoboStack direction='horizontal' justify='between' align='center'>
              <StackBox>Logo</StackBox>
              <RoboStack direction='horizontal' gap='sm' align='center'>
                <StackBox>Nav A</StackBox>
                <StackBox>Nav B</StackBox>
              </RoboStack>
              <StackBox>User</StackBox>
            </RoboStack>
          </div>

          <div style={sectionStyle}>
            <p style={headingStyle}>Gap Sizes</p>
            <RoboStack gap='lg'>
              {(['xs', 'sm', 'md', 'lg'] as const).map((gap) => (
                <div key={gap}>
                  <p style={{ fontSize: '0.7rem', color: 'var(--muted-foreground)', marginBottom: 4 }}>
                    gap=&quot;{gap}&quot;
                  </p>
                  <RoboStack direction='horizontal' gap={gap} align='center'>
                    <StackBox>A</StackBox>
                    <StackBox>B</StackBox>
                    <StackBox>C</StackBox>
                  </RoboStack>
                </div>
              ))}
            </RoboStack>
          </div>
        </OverviewGroup>

        {/* ── Divider ──────────────────────────────────────────── */}
        <OverviewGroup value="divider" title="RoboDivider">
          <div style={{ maxWidth: 480, display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={sectionStyle}>
              <p style={headingStyle}>Horizontal (default)</p>
              <RoboDivider />
            </div>

            <div style={sectionStyle}>
              <p style={headingStyle}>Horizontal with label</p>
              <RoboDivider label='Section Break' />
            </div>

            <div style={sectionStyle}>
              <p style={headingStyle}>Dashed</p>
              <RoboDivider variant='dashed' label='OR' />
            </div>

            <div style={sectionStyle}>
              <p style={headingStyle}>Vertical</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, height: 40 }}>
                <span style={{ color: 'var(--foreground)', fontSize: '0.875rem' }}>Left</span>
                <RoboDivider orientation='vertical' />
                <span style={{ color: 'var(--foreground)', fontSize: '0.875rem' }}>Middle</span>
                <RoboDivider orientation='vertical' />
                <span style={{ color: 'var(--foreground)', fontSize: '0.875rem' }}>Right</span>
              </div>
            </div>
          </div>
        </OverviewGroup>

        {/* ── PageShell ────────────────────────────────────────── */}
        <OverviewGroup value="page-shell" title="RoboPageShell">
          <p style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)', margin: 0 }}>
            Thumbnail showing sidebar + topbar + content layout.
          </p>
          <div style={pageShellThumbnailStyle}>
            <RoboPageShell sidebar={<ShellSidebar />} topbar={<ShellTopbar />}>
              <ShellContent />
            </RoboPageShell>
          </div>
        </OverviewGroup>

      </OverviewAccordion>
    </div>
  ),
};
