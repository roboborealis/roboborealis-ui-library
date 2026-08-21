import type * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { StoryLink } from '../lib/storybook/overview-layout';

const meta: Meta = {
  title: 'Showcase',
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj<typeof meta>;

interface PatternStory {
  label: string;
  id: string;
}

const PATTERNS: { name: string; stories: PatternStory[]; description: string }[] = [
  {
    name: 'Maps',
    stories: [
      { label: 'Constellation Monitor', id: 'showcase-patterns-maps-constellation-monitor--constellation-monitor' },
    ],
    description: 'Full-screen Mapbox patterns: floating stat panels, asset layers, alert integration, and animated timeline tracks.',
  },
  {
    name: 'Tables',
    stories: [
      { label: 'Constellation Manifest', id: 'showcase-patterns-tables-constellation-manifest--constellation-manifest-pattern' },
      { label: 'Flight Plan Reports', id: 'showcase-patterns-tables-flight-plan-reports--sailing-plan-reports-pattern' },
      { label: 'Satellite Search', id: 'showcase-patterns-tables-satellite-search--satellite-search-pattern' },
    ],
    description: 'Data table patterns from simple list+search up to 3-column filter → table → detail. All powered by RoboDataTable.',
  },
  {
    name: 'Dashboards',
    stories: [
      { label: 'Ops Center', id: 'showcase-patterns-dashboards-ops-center--ops-dashboard-pattern' },
    ],
    description: 'KPI StatCards + line/bar charts + recent activity table. The standard at-a-glance ops view.',
  },
  {
    name: 'Intelligence',
    stories: [
      { label: 'Correlation Analysis', id: 'showcase-patterns-intelligence-correlation-analysis--default' },
    ],
    description: 'Filter panel + network visualization (force graph, matrix, sankey) + entity dossier/data feed.',
  },
  {
    name: 'Forms',
    stories: [
      { label: 'Incident Report', id: 'showcase-patterns-forms-incident-report--incident-report-pattern' },
    ],
    description: 'react-hook-form + Zod + RoboFormField 2-column grid. Field-level errors, submit feedback via RoboToast.',
  },
];

const chipStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  fontSize: 11,
  fontWeight: 600,
  padding: '3px 9px',
  borderRadius: 999,
  background: 'color-mix(in oklch, var(--primary) 12%, transparent)',
  border: '1px solid color-mix(in oklch, var(--primary) 40%, transparent)',
  color: 'var(--primary-text)',
  cursor: 'pointer',
};

export const Overview: Story = {
  name: 'Showcase Overview',
  render: () => (
    <div style={{ maxWidth: 860 }}>
      <h2 style={{ margin: '0 0 6px', fontWeight: 700, fontSize: 22 }}>Showcase / Patterns</h2>
      <p style={{ margin: '0 0 28px', fontSize: 13, color: 'var(--secondary-text)', maxWidth: 580 }}>
        Production-ready full-page compositions. Every pattern is built from @roboborealis/components
        components only — no custom primitives. Click any pattern below to open it. Use these as starting
        points when building new features in an application.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
        {PATTERNS.map((p) => (
          <div
            key={p.name}
            style={{
              padding: '16px 18px',
              borderRadius: 8,
              border: '1px solid var(--border)',
              background: 'var(--card)',
            }}
          >
            <p style={{ margin: '0 0 4px', fontWeight: 700, fontSize: 13 }}>{p.name}</p>
            <p style={{ margin: '0 0 8px', fontSize: 12, color: 'var(--secondary-text)', lineHeight: 1.5 }}>{p.description}</p>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {p.stories.map((s) => (
                <StoryLink key={s.id} id={s.id}>
                  <span style={chipStyle}>{s.label} <span aria-hidden="true">→</span></span>
                </StoryLink>
              ))}
            </div>
          </div>
        ))}
      </div>
      <p style={{ marginTop: 28, fontSize: 12, color: 'var(--secondary-text)' }}>
        AI agents: use the <code>/design-ui-feature</code> skill to compose any of these patterns from a
        feature description.
      </p>
    </div>
  ),
};
