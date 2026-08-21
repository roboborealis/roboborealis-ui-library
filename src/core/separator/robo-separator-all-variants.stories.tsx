import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { RoboSeparator } from './robo-separator';
import { OverviewStack, OverviewSection } from '../../lib/storybook/overview-layout';

// ---------------------------------------------------------------------------
// Layout constants
// ---------------------------------------------------------------------------

const bodyTextStyle: React.CSSProperties = {
  margin: 0,
  fontSize: '0.875rem',
  color: 'var(--foreground)',
};

const sectionBlockStyle: React.CSSProperties = {
  padding: '10px 0',
  fontSize: '0.875rem',
  color: 'var(--foreground)',
};

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta: Meta<typeof RoboSeparator> = {
  title: 'Elements/Display/RoboSeparator',
  component: RoboSeparator,
  parameters: { layout: 'padded' },
};
export default meta;

type Story = StoryObj<typeof RoboSeparator>;

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

export const AllVariants: Story = {
  name: 'All Variants',
  render: () => (
    <OverviewStack>

      <OverviewSection title='Horizontal (default)'>
        <p style={bodyTextStyle}>Content above</p>
        <RoboSeparator />
        <p style={bodyTextStyle}>Content below</p>
      </OverviewSection>

      <OverviewSection title='Vertical'>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, height: 48 }}>
          <span style={bodyTextStyle}>Left</span>
          <RoboSeparator orientation='vertical' />
          <span style={bodyTextStyle}>Center</span>
          <RoboSeparator orientation='vertical' />
          <span style={bodyTextStyle}>Right</span>
        </div>
      </OverviewSection>

      <OverviewSection title='Horizontal with label'>
        <p style={bodyTextStyle}>Sign in with email</p>
        <div style={{ marginTop: 12, marginBottom: 12 }}>
          <RoboSeparator label='Or continue with' />
        </div>
        <p style={bodyTextStyle}>Sign in with SSO</p>
      </OverviewSection>

      <OverviewSection title='Multiple separators — sectioned content'>
        <div
          style={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            overflow: 'hidden',
          }}
        >
          {(['Satellite Name', 'NORAD ID', 'Operator', 'Status'] as const).map((label, i, arr) => (
            <React.Fragment key={label}>
              <div style={{ padding: '10px 16px' }}>
                <p style={{ margin: '0 0 2px', fontSize: '0.7rem', color: 'var(--muted-foreground)' }}>{label}</p>
                <p style={sectionBlockStyle}>
                  {label === 'Satellite Name' ? 'Voyager 1'
                    : label === 'NORAD ID' ? '25544'
                    : label === 'Operator' ? 'NASA'
                    : 'Active'}
                </p>
              </div>
              {i < arr.length - 1 && <RoboSeparator />}
            </React.Fragment>
          ))}
        </div>
      </OverviewSection>

    </OverviewStack>
  ),
};
