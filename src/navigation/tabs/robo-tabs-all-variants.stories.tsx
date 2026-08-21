import type { Meta, StoryObj } from '@storybook/react';

import { RoboTabs, RoboTabsList, RoboTabsTrigger, RoboTabsContent } from './robo-tabs';
import { OverviewStack, OverviewSection } from '../../lib/storybook/overview-layout';

const meta: Meta<typeof RoboTabs> = {
  title: 'Components/Navigation/RoboTabs',
  component: RoboTabs,
  parameters: {
    layout: 'padded',
  },
};
export default meta;

type Story = StoryObj<typeof RoboTabs>;

// ---------------------------------------------------------------------------
// Shared styles
// ---------------------------------------------------------------------------

const tabsWrapperStyle: React.CSSProperties = {
  padding: '1rem',
  background: 'var(--card)',
  borderRadius: 'var(--radius)',
  border: '1px solid var(--border)',
  marginBottom: '1rem',
};

const contentBlockStyle: React.CSSProperties = {
  padding: '0.75rem',
  background: 'var(--muted)',
  borderRadius: 'var(--radius)',
  fontSize: '0.875rem',
  color: 'var(--muted-foreground)',
  lineHeight: 1.6,
};

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

export const AllVariants: Story = {
  name: 'All Variants',
  render: () => (
    <OverviewStack>
      <OverviewSection title='Horizontal tabs'>
        <div style={tabsWrapperStyle}>
          <RoboTabs defaultValue='overview' orientation='horizontal'>
              <RoboTabsList orientation='horizontal'>
                <RoboTabsTrigger value='overview' orientation='horizontal'>Overview</RoboTabsTrigger>
                <RoboTabsTrigger value='satellites' orientation='horizontal'>Satellites</RoboTabsTrigger>
                <RoboTabsTrigger value='reports' orientation='horizontal'>Reports</RoboTabsTrigger>
                <RoboTabsTrigger value='alerts' orientation='horizontal'>Alerts</RoboTabsTrigger>
              </RoboTabsList>
              <RoboTabsContent value='overview' orientation='horizontal'>
                <div style={contentBlockStyle}>
                  Overview — constellation-wide metrics and status at a glance. Track active missions,
                  satellite positions, and recent activity across all registered assets.
                </div>
              </RoboTabsContent>
              <RoboTabsContent value='satellites' orientation='horizontal'>
                <div style={contentBlockStyle}>
                  Satellites — registered satellite catalog. View call signs, NORAD catalog IDs,
                  spacecraft types, and current mission status for the full constellation.
                </div>
              </RoboTabsContent>
              <RoboTabsContent value='reports' orientation='horizontal'>
                <div style={contentBlockStyle}>
                  Reports — mission and position reports. Access Final Reports (FR),
                  Position Reports (PR), and Departure Reports (DR) for all satellites.
                </div>
              </RoboTabsContent>
              <RoboTabsContent value='alerts' orientation='horizontal'>
                <div style={contentBlockStyle}>
                  Alerts — active anomaly alerts and zone boundary notifications.
                  Acknowledge and escalate alerts to mission control centers.
                </div>
              </RoboTabsContent>
            </RoboTabs>
        </div>
      </OverviewSection>

      <OverviewSection title='Vertical tabs'>
        <div style={tabsWrapperStyle}>
          <RoboTabs defaultValue='overview' orientation='vertical'>
              <RoboTabsList orientation='vertical'>
                <RoboTabsTrigger value='overview' orientation='vertical'>Overview</RoboTabsTrigger>
                <RoboTabsTrigger value='satellites' orientation='vertical'>Satellites</RoboTabsTrigger>
                <RoboTabsTrigger value='reports' orientation='vertical'>Reports</RoboTabsTrigger>
                <RoboTabsTrigger value='alerts' orientation='vertical'>Alerts</RoboTabsTrigger>
              </RoboTabsList>
              <RoboTabsContent value='overview' orientation='vertical'>
                <div style={contentBlockStyle}>
                  Overview — constellation-wide metrics and status at a glance. Track active missions,
                  satellite positions, and recent activity across all registered assets.
                </div>
              </RoboTabsContent>
              <RoboTabsContent value='satellites' orientation='vertical'>
                <div style={contentBlockStyle}>
                  Satellites — registered satellite catalog. View call signs, NORAD catalog IDs,
                  spacecraft types, and current mission status for the full constellation.
                </div>
              </RoboTabsContent>
              <RoboTabsContent value='reports' orientation='vertical'>
                <div style={contentBlockStyle}>
                  Reports — mission and position reports. Access Final Reports (FR),
                  Position Reports (PR), and Departure Reports (DR) for all satellites.
                </div>
              </RoboTabsContent>
              <RoboTabsContent value='alerts' orientation='vertical'>
                <div style={contentBlockStyle}>
                  Alerts — active anomaly alerts and zone boundary notifications.
                  Acknowledge and escalate alerts to mission control centers.
                </div>
              </RoboTabsContent>
            </RoboTabs>
        </div>
      </OverviewSection>
    </OverviewStack>
  ),
};
