import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { OverviewAccordion, OverviewGroup, StoryLink } from '../lib/storybook/overview-layout';

const meta: Meta = {
  title: 'Foundation',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Foundation is the prerequisite layer of the design system — tokens, icons, and providers that all components depend on.',
      },
    },
  },
};
export default meta;

type Story = StoryObj;

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
  gap: 12,
};

const cardStyle: React.CSSProperties = {
  padding: '16px 20px',
  borderRadius: 8,
  border: '1px solid var(--border)',
  background: 'var(--card)',
};

const cardTitleStyle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  margin: '0 0 4px',
};

const cardDescStyle: React.CSSProperties = {
  fontSize: 12,
  color: 'var(--secondary-text)',
  margin: 0,
  lineHeight: 1.5,
};

export const Overview: Story = {
  name: 'Foundation Overview',
  render: () => (
    <div style={{ maxWidth: 900 }}>
      <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 0, marginBottom: 8 }}>Foundation</h2>
      <p style={{ fontSize: 14, color: 'var(--secondary-text)', marginBottom: 24, marginTop: 0, maxWidth: 600 }}>
        The prerequisite layer. These are not components — they are the building blocks everything else
        depends on: design tokens, icons, and runtime providers.
      </p>

      <OverviewAccordion>

        <OverviewGroup
          value="icons"
          title="Icons"
          description="Orbital domain icons and Lucide re-exports used throughout the system."
        >
          <div style={gridStyle}>
            <div style={cardStyle}>
              <p style={cardTitleStyle}>
                <StoryLink id="elements-icons--celestial-gallery">Celestial Icons</StoryLink>
              </p>
              <p style={cardDescStyle}>Custom SVG icons — satellites, telescopes, and navigation symbols.</p>
            </div>
            <div style={cardStyle}>
              <p style={cardTitleStyle}>
                <StoryLink id="elements-icons--lucide-favorites-section">Lucide Re-exports</StoryLink>
              </p>
              <p style={cardDescStyle}>Curated Lucide icons re-exported for consistency. Use these instead of importing Lucide directly.</p>
            </div>
          </div>
        </OverviewGroup>

        <OverviewGroup
          value="providers"
          title="Providers"
          description="Runtime context providers that control theming and density across the application."
        >
          <div style={gridStyle}>
            <div style={cardStyle}>
              <p style={cardTitleStyle}>
                <StoryLink id="foundation-providers-robothemeprovider--interactive">RoboThemeProvider</StoryLink>
              </p>
              <p style={cardDescStyle}>
                Switches between <code>midnight</code> and <code>aurora</code> brand themes via <code>data-theme</code>.
                Persists via optional storage adapter.
              </p>
            </div>
            <div style={cardStyle}>
              <p style={cardTitleStyle}>
                <StoryLink id="foundation-providers-robodensityprovider--interactive">RoboDensityProvider</StoryLink>
              </p>
              <p style={cardDescStyle}>
                Controls <code>compact</code>, <code>comfortable</code>, and <code>spacious</code> density
                via <code>data-density</code>. Affects spacing across all components.
              </p>
            </div>
            <div style={cardStyle}>
              <p style={cardTitleStyle}>
                <StoryLink id="foundation-providers--overview">All providers →</StoryLink>
              </p>
              <p style={cardDescStyle}>Font family, glass mode, date format, keybinds, map settings, and product tour.</p>
            </div>
          </div>
        </OverviewGroup>

        <OverviewGroup
          value="design-tokens"
          title="Design Tokens"
          description="CSS custom-property tokens — colours, typography, spacing. See the Design Tokens story for live values."
        >
          <div style={gridStyle}>
            <div style={cardStyle}>
              <p style={cardTitleStyle}>
                <StoryLink id="foundation-design-tokens--color-tokens">Color Tokens</StoryLink>
              </p>
              <p style={cardDescStyle}>Semantic colour roles: <code>--primary</code>, <code>--background</code>, <code>--foreground</code>, <code>--border</code>, <code>--muted</code>, and more.</p>
            </div>
            <div style={cardStyle}>
              <p style={cardTitleStyle}>
                <StoryLink id="foundation-design-tokens--typography-tokens">Typography Tokens</StoryLink>
              </p>
              <p style={cardDescStyle}><code>--font-sans</code> · <code>--font-heading</code> · <code>--font-display</code> · <code>--font-mono</code></p>
            </div>
            <div style={cardStyle}>
              <p style={cardTitleStyle}>
                <StoryLink id="foundation-design-tokens--spacing-tokens">Spacing / Density Tokens</StoryLink>
              </p>
              <p style={cardDescStyle}>Spacing and sizing tokens that scale with the active density setting.</p>
            </div>
          </div>
        </OverviewGroup>

      </OverviewAccordion>
    </div>
  ),
};
