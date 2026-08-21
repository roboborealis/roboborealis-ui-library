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
    name: 'Forms',
    stories: [
      { label: 'Observation Log', id: 'showcase-patterns-forms-observation-log--observation-log-pattern' },
      { label: 'Form Controls', id: 'showcase-patterns-forms-form-controls--form-controls-playground' },
      { label: 'Button & Actions', id: 'showcase-patterns-forms-button-actions--button-actions-playground' },
    ],
    description: 'react-hook-form + Zod + RoboFormField 2-column grid, plus control and action-button galleries.',
  },
  {
    name: 'Tables',
    stories: [
      { label: 'Object Catalog', id: 'showcase-patterns-tables-object-catalog--object-catalog-pattern' },
      { label: 'Observing Schedule', id: 'showcase-patterns-tables-observing-schedule--observing-schedule-pattern' },
      { label: 'Object Explorer', id: 'showcase-patterns-tables-object-explorer--object-explorer-pattern' },
      { label: 'Observation Review Queue', id: 'showcase-patterns-tables-observation-review-queue--observation-review-queue' },
      { label: 'Exoplanet Catalog', id: 'showcase-patterns-tables-exoplanet-catalog--exoplanet-catalog' },
      { label: 'Observing Run History', id: 'showcase-patterns-tables-observing-run-history--observing-run-history-with-nested-observations' },
    ],
    description: 'Data table patterns from list+search up to 3-column filter → table → detail, inline-edit queues, and nested master-detail. All powered by RoboDataTable.',
  },
  {
    name: 'Dashboards',
    stories: [
      { label: 'Observatory Night', id: 'showcase-patterns-dashboards-observatory-night--observatory-dashboard-pattern' },
    ],
    description: 'KPI StatCards + line/bar charts + recent activity table. The standard at-a-glance dashboard view.',
  },
  {
    name: 'Flows',
    stories: [
      { label: 'Target List Editor', id: 'showcase-patterns-flows-target-list-editor--target-list-editor-pattern' },
    ],
    description: 'Connected table → form mini-app: select a row, edit it in a validated form, save back to the table.',
  },
  {
    name: 'Information Displays',
    stories: [
      { label: 'Object Dossier', id: 'showcase-patterns-information-displays-object-dossier--default' },
    ],
    description: 'Dense single-entity view: property grid, event timeline, relationships, and status indicators.',
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
