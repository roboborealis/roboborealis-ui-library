import type { Meta, StoryObj } from '@storybook/react';
import { Compass, Heart, Gift } from 'lucide-react';

import { RoboTabs, RoboTabsList, RoboTabsTrigger, RoboTabsContent } from './robo-tabs';


export const componentMeta = {
  description: 'Horizontal/vertical tab navigation for switching between content panels, with an underline or pill (sliding indicator) visual style',
  category: 'navigation' as const,
  keywords: ['tabs', 'tablist', 'panel', 'switch', 'view', 'section', 'horizontal', 'pill', 'segmented', 'sliding indicator'],
  whenToUse: 'For switching between related content panels within the same page context',
  whenNotToUse: 'For page-level navigation use RoboSidebar; for progressive disclosure use RoboAccordion',
  pairsWith: ['RoboCard', 'RoboPageShell', 'RoboBadge', 'RoboQuickPanel'],
  a11y: 'Uses role="tablist" + role="tab" + role="tabpanel"; arrow keys move between tabs; the pill variant\'s sliding indicator is a decorative, aria-hidden sibling that never wraps or replaces Radix\'s own trigger a11y wiring',
};
const meta: Meta<typeof RoboTabs> = {
  title: 'Components/Navigation/RoboTabs',
  excludeStories: ['componentMeta'],
    component: RoboTabs,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    orientation: {
      control: 'radio',
      options: ['horizontal', 'vertical'],
      description: 'Tab layout direction',
    },
    variant: {
      control: 'radio',
      options: ['underline', 'pill'],
      description: 'Visual style — underline accent bar, or a pill with a sliding indicator',
    },
    tone: {
      control: 'radio',
      options: ['orange', 'light', 'dark'],
      description: 'Pill indicator color — orange (brand accent), light (white pill), or dark (near-black pill). Only affects variant="pill".',
    },
  },
};
export default meta;

type Story = StoryObj<typeof RoboTabs>;

export const Default: Story = {
  args: { orientation: 'horizontal', defaultValue: 'overview' },
  render: (args) => (
    <RoboTabs {...args}>
      <RoboTabsList orientation={args.orientation}>
        <RoboTabsTrigger value='overview' orientation={args.orientation}>Overview</RoboTabsTrigger>
        <RoboTabsTrigger value='details' orientation={args.orientation}>Details</RoboTabsTrigger>
        <RoboTabsTrigger value='history' orientation={args.orientation}>History</RoboTabsTrigger>
      </RoboTabsList>
      <RoboTabsContent value='overview' orientation={args.orientation}>
        <p>Overview content — satellite tracking data and key metrics.</p>
      </RoboTabsContent>
      <RoboTabsContent value='details' orientation={args.orientation}>
        <p>Detailed satellite information including call sign, NORAD ID, and mass.</p>
      </RoboTabsContent>
      <RoboTabsContent value='history' orientation={args.orientation}>
        <p>Historical mission records and position reports.</p>
      </RoboTabsContent>
    </RoboTabs>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <RoboTabs defaultValue='overview' orientation='horizontal'>
      <RoboTabsList orientation='horizontal'>
        <RoboTabsTrigger value='overview' orientation='horizontal'>Overview</RoboTabsTrigger>
        <RoboTabsTrigger value='details' orientation='horizontal'>Details</RoboTabsTrigger>
        <RoboTabsTrigger value='history' orientation='horizontal'>History</RoboTabsTrigger>
      </RoboTabsList>
      <RoboTabsContent value='overview' orientation='horizontal'>
        <p>Overview content — satellite tracking data and key metrics.</p>
      </RoboTabsContent>
      <RoboTabsContent value='details' orientation='horizontal'>
        <p>Detailed satellite information including call sign, NORAD ID, and mass.</p>
      </RoboTabsContent>
      <RoboTabsContent value='history' orientation='horizontal'>
        <p>Historical mission records and position reports.</p>
      </RoboTabsContent>
    </RoboTabs>
  ),
};

export const Vertical: Story = {
  render: () => (
    <RoboTabs defaultValue='overview' orientation='vertical'>
      <RoboTabsList orientation='vertical'>
        <RoboTabsTrigger value='overview' orientation='vertical'>Overview</RoboTabsTrigger>
        <RoboTabsTrigger value='details' orientation='vertical'>Details</RoboTabsTrigger>
        <RoboTabsTrigger value='history' orientation='vertical'>History</RoboTabsTrigger>
      </RoboTabsList>
      <RoboTabsContent value='overview' orientation='vertical'>
        <p>Overview content — satellite tracking data and key metrics.</p>
      </RoboTabsContent>
      <RoboTabsContent value='details' orientation='vertical'>
        <p>Detailed satellite information including call sign, NORAD ID, and mass.</p>
      </RoboTabsContent>
      <RoboTabsContent value='history' orientation='vertical'>
        <p>Historical mission records and position reports.</p>
      </RoboTabsContent>
    </RoboTabs>
  ),
};

export const WithDisabledTab: Story = {
  render: () => (
    <RoboTabs defaultValue='active' orientation='horizontal'>
      <RoboTabsList>
        <RoboTabsTrigger value='active'>Active</RoboTabsTrigger>
        <RoboTabsTrigger value='disabled' disabled>
          Disabled
        </RoboTabsTrigger>
        <RoboTabsTrigger value='other'>Other</RoboTabsTrigger>
      </RoboTabsList>
      <RoboTabsContent value='active'>Active tab content</RoboTabsContent>
      <RoboTabsContent value='disabled'>Disabled tab content</RoboTabsContent>
      <RoboTabsContent value='other'>Other tab content</RoboTabsContent>
    </RoboTabs>
  ),
};

export const PillVariant: Story = {
  name: 'Pill Variant',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginBottom: 8 }}>underline (default)</p>
        <RoboTabs defaultValue='overview'>
          <RoboTabsList>
            <RoboTabsTrigger value='overview'>Overview</RoboTabsTrigger>
            <RoboTabsTrigger value='details'>Details</RoboTabsTrigger>
            <RoboTabsTrigger value='history'>History</RoboTabsTrigger>
          </RoboTabsList>
          <RoboTabsContent value='overview'><p>Overview content.</p></RoboTabsContent>
          <RoboTabsContent value='details'><p>Details content.</p></RoboTabsContent>
          <RoboTabsContent value='history'><p>History content.</p></RoboTabsContent>
        </RoboTabs>
      </div>
      <div>
        <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginBottom: 8 }}>pill — segmented background, sliding indicator</p>
        <RoboTabs defaultValue='overview'>
          <RoboTabsList variant='pill'>
            <RoboTabsTrigger variant='pill' value='overview'>Overview</RoboTabsTrigger>
            <RoboTabsTrigger variant='pill' value='details'>Details</RoboTabsTrigger>
            <RoboTabsTrigger variant='pill' value='history'>History</RoboTabsTrigger>
          </RoboTabsList>
          <RoboTabsContent value='overview'><p>Overview content.</p></RoboTabsContent>
          <RoboTabsContent value='details'><p>Details content.</p></RoboTabsContent>
          <RoboTabsContent value='history'><p>History content.</p></RoboTabsContent>
        </RoboTabs>
      </div>
    </div>
  ),
};

export const PillTones: Story = {
  name: 'Pill Tones',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {(['orange', 'light', 'dark'] as const).map((tone) => (
        <div key={tone}>
          <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginBottom: 8 }}>
            tone=&quot;{tone}&quot;{tone === 'orange' ? ' (default)' : ''}
          </p>
          <RoboTabs defaultValue='overview'>
            <RoboTabsList variant='pill' tone={tone}>
              <RoboTabsTrigger variant='pill' tone={tone} value='overview'>Overview</RoboTabsTrigger>
              <RoboTabsTrigger variant='pill' tone={tone} value='details'>Details</RoboTabsTrigger>
              <RoboTabsTrigger variant='pill' tone={tone} value='history'>History</RoboTabsTrigger>
            </RoboTabsList>
            <RoboTabsContent value='overview'><p>Overview content.</p></RoboTabsContent>
            <RoboTabsContent value='details'><p>Details content.</p></RoboTabsContent>
            <RoboTabsContent value='history'><p>History content.</p></RoboTabsContent>
          </RoboTabs>
        </div>
      ))}
    </div>
  ),
};

/**
 * `tinted` on `RoboTabsContent` gives the active panel a `--muted`
 * background for visual separation from whatever surface the tabs sit on —
 * useful in a dense panel (e.g. a floating inspector) where the tab list
 * alone doesn't read as clearly distinct from the rest of the content.
 */
export const TintedContent: Story = {
  name: 'Tinted Content',
  render: () => (
    <RoboTabs defaultValue='overview'>
      <RoboTabsList variant='pill' tone='orange'>
        <RoboTabsTrigger variant='pill' tone='orange' value='overview'>Overview</RoboTabsTrigger>
        <RoboTabsTrigger variant='pill' tone='orange' value='details'>Details</RoboTabsTrigger>
      </RoboTabsList>
      <RoboTabsContent value='overview' tinted>
        <p>Overview content — the panel behind this text is tinted with --muted for separation.</p>
      </RoboTabsContent>
      <RoboTabsContent value='details' tinted>
        <p>Details content — also tinted.</p>
      </RoboTabsContent>
    </RoboTabs>
  ),
};

/**
 * `RoboTabsTrigger` accepts arbitrary children, so an icon before the label
 * needs no dedicated `icon` prop — just render it as a sibling before the
 * text, sized/spaced with a plain wrapper span.
 */
export const WithIcons: Story = {
  name: 'With Icons',
  render: () => (
    <RoboTabs defaultValue='explore'>
      <RoboTabsList variant='pill' tone='dark'>
        <RoboTabsTrigger variant='pill' tone='dark' value='explore'>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Compass size={14} /> Explore
          </span>
        </RoboTabsTrigger>
        <RoboTabsTrigger variant='pill' tone='dark' value='favorites'>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Heart size={14} /> Favorites
          </span>
        </RoboTabsTrigger>
        <RoboTabsTrigger variant='pill' tone='dark' value='surprise'>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Gift size={14} /> Surprise Me
          </span>
        </RoboTabsTrigger>
      </RoboTabsList>
      <RoboTabsContent value='explore'>
        <p>Discover fresh ideas, trending topics, and hidden gems curated just for you.</p>
      </RoboTabsContent>
      <RoboTabsContent value='favorites'>
        <p>Your saved favorites.</p>
      </RoboTabsContent>
      <RoboTabsContent value='surprise'>
        <p>Something unexpected.</p>
      </RoboTabsContent>
    </RoboTabs>
  ),
};

export const ManyTabs: Story = {
  render: () => (
    <RoboTabs defaultValue='tab1'>
      <RoboTabsList>
        {['Tab 1', 'Tab 2', 'Tab 3', 'Tab 4', 'Tab 5'].map((label, i) => (
          <RoboTabsTrigger key={label} value={`tab${i + 1}`}>
            {label}
          </RoboTabsTrigger>
        ))}
      </RoboTabsList>
      {['Tab 1', 'Tab 2', 'Tab 3', 'Tab 4', 'Tab 5'].map((label, i) => (
        <RoboTabsContent key={label} value={`tab${i + 1}`}>
          <p>{label} content</p>
        </RoboTabsContent>
      ))}
    </RoboTabs>
  ),
};
