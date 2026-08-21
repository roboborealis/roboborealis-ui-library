import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Satellite, FileText, MapPin, AlertTriangle } from 'lucide-react';

import {
  RoboAccordion,
  RoboAccordionItem,
  RoboAccordionTrigger,
  RoboAccordionContent,
} from './robo-accordion';
import { RoboCard, RoboCardHeader, RoboCardBody } from '../card/robo-card';
import { OverviewStack, OverviewSection } from '../../lib/storybook/overview-layout';

// ---------------------------------------------------------------------------
// Layout constants
// ---------------------------------------------------------------------------

const descriptionStyle: React.CSSProperties = {
  margin: 0,
  fontSize: '0.875rem',
  color: 'var(--muted-foreground)',
};

const dlGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '8px 16px',
  margin: 0,
  fontSize: '0.875rem',
};

const dtStyle: React.CSSProperties = {
  color: 'var(--muted-foreground)',
  fontWeight: 500,
};

const ddStyle: React.CSSProperties = {
  margin: 0,
  color: 'var(--foreground)',
  fontFamily: 'var(--font-mono)',
};

// ---------------------------------------------------------------------------
// Shared data
// ---------------------------------------------------------------------------

const identityContent = (
  <dl style={dlGridStyle}>
    {([
      ['Name', 'Voyager 1'],
      ['COSPAR ID', '1977-084A'],
      ['NORAD ID', '25544'],
      ['Operator', 'NASA'],
    ] as const).map(([k, v]) => (
      <React.Fragment key={k}>
        <dt style={dtStyle}>{k}</dt>
        <dd style={ddStyle}>{v}</dd>
      </React.Fragment>
    ))}
  </dl>
);

const missionContent = (
  <dl style={dlGridStyle}>
    {([
      ['Launch Site', 'Cape Canaveral, USA'],
      ['Destination', 'Interstellar space'],
      ['Arrival', '28 Apr 2026 14:00'],
      ['Velocity', '7.66 km/s'],
    ] as const).map(([k, v]) => (
      <React.Fragment key={k}>
        <dt style={dtStyle}>{k}</dt>
        <dd style={ddStyle}>{v}</dd>
      </React.Fragment>
    ))}
  </dl>
);

const reportsContent = (
  <p style={descriptionStyle}>TM — Telemetry (12 Apr), OD — Orbit Determination (14 Apr), TM — Telemetry (15 Apr)</p>
);

const iconSections = [
  { value: 'satellite',   icon: Satellite,      label: 'Satellite Identity', body: 'COSPAR ID, NORAD ID, call sign, operator.' },
  { value: 'location', icon: MapPin,         label: 'Position',        body: 'Sub-satellite point and inclination.' },
  { value: 'reports',  icon: FileText,       label: 'Filed Reports',   body: 'Telemetry, tracking, and command history.' },
  { value: 'alerts',   icon: AlertTriangle,  label: 'Active Alerts',   body: 'Signal-loss events, safety flags.' },
];

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta: Meta<typeof RoboAccordion> = {
  title: 'Elements/Display/RoboAccordion',
  component: RoboAccordion,
  parameters: { layout: 'padded' },
};
export default meta;

type Story = StoryObj<typeof RoboAccordion>;

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

export const AllVariants: Story = {
  name: 'All Variants',
  render: () => (
    <OverviewStack>

      <OverviewSection title='Single — collapsible'>
        <RoboAccordion type='single' collapsible>
          <RoboAccordionItem value='identity'>
            <RoboAccordionTrigger>Satellite Identity</RoboAccordionTrigger>
            <RoboAccordionContent>{identityContent}</RoboAccordionContent>
          </RoboAccordionItem>
          <RoboAccordionItem value='mission'>
            <RoboAccordionTrigger>Current Mission</RoboAccordionTrigger>
            <RoboAccordionContent>{missionContent}</RoboAccordionContent>
          </RoboAccordionItem>
          <RoboAccordionItem value='reports'>
            <RoboAccordionTrigger>Filed Reports</RoboAccordionTrigger>
            <RoboAccordionContent>{reportsContent}</RoboAccordionContent>
          </RoboAccordionItem>
        </RoboAccordion>
      </OverviewSection>

      <OverviewSection title='Multiple — two open by default'>
        <RoboAccordion type='multiple' defaultValue={['identity', 'mission']}>
          <RoboAccordionItem value='identity'>
            <RoboAccordionTrigger>Satellite Identity</RoboAccordionTrigger>
            <RoboAccordionContent>{identityContent}</RoboAccordionContent>
          </RoboAccordionItem>
          <RoboAccordionItem value='mission'>
            <RoboAccordionTrigger>Current Mission</RoboAccordionTrigger>
            <RoboAccordionContent>{missionContent}</RoboAccordionContent>
          </RoboAccordionItem>
          <RoboAccordionItem value='reports'>
            <RoboAccordionTrigger>Filed Reports</RoboAccordionTrigger>
            <RoboAccordionContent>{reportsContent}</RoboAccordionContent>
          </RoboAccordionItem>
        </RoboAccordion>
      </OverviewSection>

      <OverviewSection title='Triggers with icons'>
        <RoboAccordion type='single' collapsible>
          {iconSections.map(({ value, icon: Icon, label, body }) => (
            <RoboAccordionItem key={value} value={value}>
              <RoboAccordionTrigger
                icon={<Icon style={{ width: 16, height: 16, color: 'var(--muted-foreground)' }} aria-hidden='true' />}
              >
                {label}
              </RoboAccordionTrigger>
              <RoboAccordionContent>
                <p style={descriptionStyle}>{body}</p>
              </RoboAccordionContent>
            </RoboAccordionItem>
          ))}
        </RoboAccordion>
      </OverviewSection>

      <OverviewSection title='Nested in a card'>
        <RoboCard>
          <RoboCardHeader>
            <p style={{ margin: 0, fontWeight: 600, color: 'var(--foreground)' }}>Voyager 1</p>
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--muted-foreground)' }}>NORAD 25544 · Active</p>
          </RoboCardHeader>
          <RoboCardBody style={{ padding: 0 }}>
            <RoboAccordion type='single' collapsible>
              <RoboAccordionItem value='identity' style={{ borderBottom: '1px solid var(--border)' }}>
                <RoboAccordionTrigger style={{ padding: '12px 24px' }}>Satellite Identity</RoboAccordionTrigger>
                <RoboAccordionContent style={{ padding: '0 24px 16px' }}>{identityContent}</RoboAccordionContent>
              </RoboAccordionItem>
              <RoboAccordionItem value='mission' style={{ borderBottom: '1px solid var(--border)' }}>
                <RoboAccordionTrigger style={{ padding: '12px 24px' }}>Current Mission</RoboAccordionTrigger>
                <RoboAccordionContent style={{ padding: '0 24px 16px' }}>{missionContent}</RoboAccordionContent>
              </RoboAccordionItem>
              <RoboAccordionItem value='reports'>
                <RoboAccordionTrigger style={{ padding: '12px 24px' }}>Filed Reports</RoboAccordionTrigger>
                <RoboAccordionContent style={{ padding: '0 24px 16px' }}>{reportsContent}</RoboAccordionContent>
              </RoboAccordionItem>
            </RoboAccordion>
          </RoboCardBody>
        </RoboCard>
      </OverviewSection>

    </OverviewStack>
  ),
};
