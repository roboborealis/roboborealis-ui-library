import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { RoboButton } from '../core/button/robo-button';
import { RoboCard, RoboCardBody, RoboCardHeader } from '../core/card/robo-card';
import { RoboBadge } from '../core/badge/robo-badge';
import {
  RoboTable,
  RoboTableHeader,
  RoboTableBody,
  RoboTableRow,
  RoboTableHead,
  RoboTableCell,
} from '../tables/table/robo-table';

const meta: Meta = {
  title: 'Foundation/Getting Started',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'New to @roboborealis/components? Start here. This story walks through installation, ' +
          'theme selection, component imports, and the available subpaths.',
      },
    },
  },
};
export default meta;

type Story = StoryObj;

// ─── Shared styles ────────────────────────────────────────────────────────────

const prose: React.CSSProperties = { maxWidth: 760 };
const h2: React.CSSProperties = { fontSize: 22, fontWeight: 700, margin: '0 0 6px' };
const h3: React.CSSProperties = { fontSize: 15, fontWeight: 700, margin: '24px 0 6px' };
const p: React.CSSProperties = { fontSize: 13, opacity: 0.7, margin: '0 0 12px', lineHeight: 1.6 };
const code: React.CSSProperties = {
  display: 'block',
  background: 'var(--muted, rgba(0,0,0,0.05))',
  borderRadius: 6,
  padding: '12px 16px',
  fontSize: 12,
  fontFamily: 'monospace',
  lineHeight: 1.7,
  whiteSpace: 'pre',
  overflowX: 'auto',
  margin: '0 0 16px',
};
const tag: React.CSSProperties = {
  display: 'inline-block',
  fontSize: 11,
  fontWeight: 600,
  background: 'var(--primary, #F88E63)',
  color: 'var(--primary-foreground, #fff)',
  borderRadius: 4,
  padding: '1px 6px',
  marginRight: 6,
  verticalAlign: 'middle',
};
const divider: React.CSSProperties = {
  borderTop: '1px solid var(--border, #e5e7eb)',
  margin: '28px 0',
};

// ─── Subpath table ────────────────────────────────────────────────────────────

const SUBPATHS = [
  { path: '@roboborealis/components/core', contents: 'Button, Card, Badge, Input, Chip, Avatar, Accordion, Separator' },
  { path: '@roboborealis/components/forms', contents: 'Select, Textarea, Checkbox, RadioGroup, Switch, DatePicker, FormField' },
  { path: '@roboborealis/components/navigation', contents: 'Sidebar, Topbar, Tabs, Breadcrumbs, CommandPalette, BottomNav' },
  { path: '@roboborealis/components/tables', contents: 'DataTable with sort, filter, pagination, selection, inline edit' },
  { path: '@roboborealis/components/feedback', contents: 'Toast, Alert, Dialog, Spinner, Skeleton, Progress, Tooltip' },
  { path: '@roboborealis/components/layout', contents: 'PageShell, Grid, Stack, Divider' },
  { path: '@roboborealis/components/charts', contents: 'LineChart, BarChart, AreaChart, PieChart, StatCard' },
  { path: '@roboborealis/components/editor', contents: 'RichTextEditor (Slate.js), EditorToolbar' },
  { path: '@roboborealis/components/icons', contents: '200+ Lucide re-exports + orbital icon set' },
  { path: '@roboborealis/components/flags', contents: 'Country flag display + FlagSelect dropdown' },
  { path: '@roboborealis/components/visualizations', contents: 'ForceGraph, SankeyChart, RadarChart, CorrelationMatrix, Timeline, EntityDossier' },
  { path: '@roboborealis/components/tokens', contents: 'TypeScript color constants (BRAND_*, PALETTE_*, ACCENT_*)' },
  { path: '@roboborealis/components/agent-context', contents: 'manifest, storiesCatalog, designGuide — for AI agents' },
];

const monoStyle: React.CSSProperties = { fontFamily: 'monospace', fontSize: 11 };

// ─── Stories ─────────────────────────────────────────────────────────────────

export const GettingStarted: Story = {
  name: 'Getting Started',
  render: () => (
    <div style={prose}>
      <h2 style={h2}>Getting Started with @roboborealis/components</h2>
      <p style={p}>
        @roboborealis/components is a shared React + Tailwind component library.
        Single source of truth for design language, accessible components, and design tokens across all
        your applications.
      </p>

      <div style={divider} />

      <h3 style={h3}><span style={tag}>1</span> Install</h3>
      <p style={p}>Configure your <code>.npmrc</code> to authenticate with the GitHub Package Registry, then install:</p>
      <pre style={code}>{`# .npmrc
@roboborealis:registry=https://npm.pkg.github.com/
//npm.pkg.github.com/:_authToken=\${GITHUB_TOKEN}

# Terminal
npm install @roboborealis/components
npm install radix-ui   # required peer dependency`}</pre>

      <h3 style={h3}><span style={tag}>2</span> Pick a Theme</h3>
      <p style={p}>Import exactly one theme in your root layout. Both themes support dark and light modes.</p>
      <pre style={code}>{`// layout.tsx — dark-first apps
import '@roboborealis/components/theme-midnight';

// layout.tsx — light-first apps
import '@roboborealis/components/theme-aurora';`}</pre>
      <p style={p}>Activate the theme and mode via HTML attributes:</p>
      <pre style={code}>{`<html data-theme="midnight">               // Midnight dark (default)
<html data-theme="midnight" data-mode="light">  // Midnight light
<html data-theme="aurora">                 // Aurora light (default)
<html data-theme="aurora" data-mode="dark">    // Aurora dark`}</pre>

      <h3 style={h3}><span style={tag}>3</span> Import Components</h3>
      <p style={p}>Always import from specific subpaths — never from the bare <code>@roboborealis/components</code> root.</p>
      <pre style={code}>{`import { RoboButton, RoboCard } from '@roboborealis/components/core';
import { RoboDataTable }       from '@roboborealis/components/tables';
import { RoboPageShell }       from '@roboborealis/components/layout';`}</pre>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 16 }}>
        <RoboButton variant='default'>Primary action</RoboButton>
        <RoboButton variant='secondary'>Secondary</RoboButton>
        <RoboButton variant='ghost'>Ghost</RoboButton>
        <RoboBadge variant='success'>Active</RoboBadge>
        <RoboBadge variant='warning'>Pending</RoboBadge>
      </div>

      <RoboCard style={{ marginBottom: 16 }}>
        <RoboCardHeader>
          <div style={{ fontWeight: 600 }}>Example Card</div>
        </RoboCardHeader>
        <RoboCardBody>
          <p style={{ ...p, margin: 0 }}>
            Components pick up their colours and spacing from the active <code>data-theme</code> + <code>data-mode</code>.
            Toggle the theme in the Storybook toolbar to see this story change.
          </p>
        </RoboCardBody>
      </RoboCard>

      <h3 style={h3}><span style={tag}>4</span> Available Subpaths</h3>
      <RoboTable style={{ marginBottom: 16 }}>
        <RoboTableHeader>
          <RoboTableRow>
            <RoboTableHead>Subpath</RoboTableHead>
            <RoboTableHead>Contents</RoboTableHead>
          </RoboTableRow>
        </RoboTableHeader>
        <RoboTableBody>
          {SUBPATHS.map(({ path, contents }) => (
            <RoboTableRow key={path}>
              <RoboTableCell><span style={monoStyle}>{path}</span></RoboTableCell>
              <RoboTableCell>{contents}</RoboTableCell>
            </RoboTableRow>
          ))}
        </RoboTableBody>
      </RoboTable>

      <p style={{ ...p, fontSize: 12 }}>
        See <strong>Foundation/Theme Switcher</strong> for a live side-by-side comparison of all four theme variants.
        See <strong>Foundation/Density Showcase</strong> for compact / comfortable / spacious density modes.
      </p>
    </div>
  ),
};
