import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Satellite, FileText, MapPin, AlertTriangle } from 'lucide-react';

import {
  RoboAccordion,
  RoboAccordionItem,
  RoboAccordionTrigger,
  RoboAccordionContent,
} from './robo-accordion';


export const componentMeta = {
  description: 'Collapsible content sections for progressive disclosure',
  category: 'display' as const,
  keywords: ['accordion', 'collapse', 'expand', 'disclosure', 'section', 'faq', 'toggle'],
  whenToUse: 'For progressive disclosure of secondary content, FAQ sections, or grouped settings',
  whenNotToUse: 'For navigation between views use RoboTabs; for single toggle use a disclosure button',
  pairsWith: ['RoboCard', 'RoboPageShell', 'RoboSeparator'],
  a11y: 'Uses Radix Accordion — manages aria-expanded, aria-controls, and keyboard navigation automatically',
};
const meta: Meta<typeof RoboAccordion> = {
  title: 'Elements/Display/RoboAccordion',
  excludeStories: ['componentMeta'],
    component: RoboAccordion,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    type:        { control: 'radio', options: ['single', 'multiple'] },
    collapsible: { control: 'boolean' },
  },
};
export default meta;

type Story = StoryObj<typeof RoboAccordion>;

// ---------------------------------------------------------------------------
// Shared content helpers
// ---------------------------------------------------------------------------

const satelliteSections = [
  {
    value: 'identity',
    label: 'Satellite Identity',
    content: (
      <dl style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px', margin: 0, fontSize: '0.875rem' }}>
        {[
          ['Name', 'Voyager 1'],
          ['COSPAR ID', '1977-084A'],
          ['NORAD ID', '25544'],
          ['Call Sign', 'ARTEMIS'],
          ['Operator', 'NASA'],
          ['Launch Mass', '721 kg'],
        ].map(([k, v]) => (
          <React.Fragment key={k}>
            <dt style={{ color: 'var(--muted-foreground)', fontWeight: 500 }}>{k}</dt>
            <dd style={{ margin: 0, color: 'var(--foreground)', fontFamily: 'var(--font-mono)' }}>{v}</dd>
          </React.Fragment>
        ))}
      </dl>
    ),
  },
  {
    value: 'mission',
    label: 'Current Mission',
    content: (
      <dl style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px', margin: 0, fontSize: '0.875rem' }}>
        {[
          ['Launch Site', 'Cape Canaveral, USA'],
          ['Destination', 'Interstellar space'],
          ['Launched', '14 Apr 2026 09:00'],
          ['Arrival', '28 Apr 2026 14:00'],
          ['Velocity', '7.66 km/s'],
          ['Inclination', '51.6°'],
        ].map(([k, v]) => (
          <React.Fragment key={k}>
            <dt style={{ color: 'var(--muted-foreground)', fontWeight: 500 }}>{k}</dt>
            <dd style={{ margin: 0, color: 'var(--foreground)', fontFamily: 'var(--font-mono)' }}>{v}</dd>
          </React.Fragment>
        ))}
      </dl>
    ),
  },
  {
    value: 'reports',
    label: 'Filed Reports',
    content: (
      <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: '0.875rem', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {['TM — Telemetry (12 Apr)', 'OD — Orbit Determination (14 Apr)', 'TM — Telemetry (15 Apr)'].map((r) => (
          <li key={r} style={{ color: 'var(--foreground)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <FileText style={{ width: 14, height: 14, color: 'var(--muted-foreground)', flexShrink: 0 }} />
            {r}
          </li>
        ))}
      </ul>
    ),
  },
];

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

export const Default: Story = {
  name: 'Single (collapsible)',
  render: () => (
    <div style={{ maxWidth: 520 }}>
      <RoboAccordion type='single' collapsible>
        {satelliteSections.map(({ value, label, content }) => (
          <RoboAccordionItem key={value} value={value}>
            <RoboAccordionTrigger>{label}</RoboAccordionTrigger>
            <RoboAccordionContent>{content}</RoboAccordionContent>
          </RoboAccordionItem>
        ))}
      </RoboAccordion>
    </div>
  ),
};

export const Multiple: Story = {
  name: 'Multiple (open at once)',
  render: () => (
    <div style={{ maxWidth: 520 }}>
      <RoboAccordion type='multiple' defaultValue={['identity', 'mission']}>
        {satelliteSections.map(({ value, label, content }) => (
          <RoboAccordionItem key={value} value={value}>
            <RoboAccordionTrigger>{label}</RoboAccordionTrigger>
            <RoboAccordionContent>{content}</RoboAccordionContent>
          </RoboAccordionItem>
        ))}
      </RoboAccordion>
    </div>
  ),
};

export const WithIcons: Story = {
  name: 'Triggers with Icons',
  render: () => {
    const sections = [
      { value: 'satellite', icon: Satellite, label: 'Satellite Identity', body: 'COSPAR ID, NORAD ID, call sign, operator.' },
      { value: 'location', icon: MapPin, label: 'Position', body: 'Sub-satellite point and inclination.' },
      { value: 'reports', icon: FileText, label: 'Filed Reports', body: 'Telemetry, tracking, and command history.' },
      { value: 'alerts', icon: AlertTriangle, label: 'Active Alerts', body: 'Signal-loss events, safety flags.' },
    ];
    return (
      <div style={{ maxWidth: 520 }}>
        <RoboAccordion type='single' collapsible>
          {sections.map(({ value, icon: Icon, label, body }) => (
            <RoboAccordionItem key={value} value={value}>
              <RoboAccordionTrigger
                icon={<Icon className='h-4 w-4 text-[var(--muted-foreground)]' />}
              >
                {label}
              </RoboAccordionTrigger>
              <RoboAccordionContent>
                <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>{body}</p>
              </RoboAccordionContent>
            </RoboAccordionItem>
          ))}
        </RoboAccordion>
      </div>
    );
  },
};

/** Nested inside a card — common information-density pattern. */
export const InCard: Story = {
  name: 'In Context — Detail Card',
  render: () => (
    <div
      style={{
        maxWidth: 520,
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        overflow: 'hidden',
      }}
    >
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
        <p style={{ margin: 0, fontWeight: 600, color: 'var(--foreground)' }}>Voyager 1</p>
        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--muted-foreground)' }}>NORAD 25544 · Active</p>
      </div>
      <RoboAccordion type='single' collapsible>
        {satelliteSections.map(({ value, label, content }) => (
          <RoboAccordionItem key={value} value={value} style={{ borderBottom: '1px solid var(--border)' }}>
            <RoboAccordionTrigger style={{ padding: '12px 20px' }}>{label}</RoboAccordionTrigger>
            <RoboAccordionContent style={{ padding: '0 20px 16px' }}>{content}</RoboAccordionContent>
          </RoboAccordionItem>
        ))}
      </RoboAccordion>
    </div>
  ),
};

export const Playground: Story = {
  args: { type: 'single', collapsible: true },
  render: (args) => (
    <div style={{ maxWidth: 520 }}>
      <RoboAccordion {...args}>
        {satelliteSections.map(({ value, label, content }) => (
          <RoboAccordionItem key={value} value={value}>
            <RoboAccordionTrigger>{label}</RoboAccordionTrigger>
            <RoboAccordionContent>{content}</RoboAccordionContent>
          </RoboAccordionItem>
        ))}
      </RoboAccordion>
    </div>
  ),
};
