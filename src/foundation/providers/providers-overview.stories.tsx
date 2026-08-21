import type { Meta, StoryObj } from '@storybook/react';

import { StoryLink } from '../../lib/storybook/overview-layout';

const meta: Meta = {
  title: 'Foundation/Providers',
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  name: 'Providers Overview',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: 640 }}>
      <h2 style={{ margin: 0 }}>Providers</h2>
      <p style={{ margin: 0, color: 'var(--secondary-text)' }}>
        React context providers that configure global application appearance and behavior.
      </p>
      <ul style={{ margin: 0, paddingLeft: '1.2rem', lineHeight: 1.9 }}>
        <li>
          <StoryLink id="foundation-providers-robothemeprovider--interactive">RoboThemeProvider</StoryLink>{' '}
          — switches between <code>midnight</code> and <code>aurora</code> brand themes
        </li>
        <li>
          <StoryLink id="foundation-providers-robodensityprovider--interactive">RoboDensityProvider</StoryLink>{' '}
          — controls component density: <code>compact</code> | <code>comfortable</code> | <code>spacious</code>
        </li>
        <li>
          <StoryLink id="foundation-providers-robofontfamilyprovider--interactive">RoboFontFamilyProvider</StoryLink>{' '}
          — font family incl. an OpenDyslexic option
        </li>
        <li>
          <StoryLink id="foundation-providers-roboglassmodeprovider--interactive">RoboGlassModeProvider</StoryLink>{' '}
          — glass / frosted-surface mode
        </li>
        <li>
          <StoryLink id="foundation-providers-robodateformatprovider--interactive">RoboDateFormatProvider</StoryLink>{' '}
          — US / international / ISO date formatting
        </li>
      </ul>
      <p style={{ margin: 0, color: 'var(--secondary-text)' }}>
        Both theme and density providers are required at the application root. Wrap your app with
        RoboThemeProvider first, then RoboDensityProvider.
      </p>
    </div>
  ),
};
