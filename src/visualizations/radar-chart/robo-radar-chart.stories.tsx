import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { RoboRadarChart } from './robo-radar-chart';
import type { RoboRadarAxis, RoboRadarProfile } from './robo-radar-chart';
import { RoboLoading } from '../../feedback/loading/robo-loading';
import { OverviewStack, OverviewSection } from '../../lib/storybook/overview-layout';

export const componentMeta = {
  description: 'Spider / radar chart comparing values across multiple dimensions. Each axis has its own min/max for mixed-magnitude data.',
  category: 'visualization' as const,
  keywords: ['radar', 'spider', 'chart', 'profile', 'dimensions', 'per-axis', 'mixed-magnitude', 'finance', 'osint', 'comparison'],
  whenToUse: 'Compare one or more profiles across multiple dimensions at once. Set per-axis min/max when dimensions span very different ranges.',
  whenNotToUse: 'Use RoboBubbleChart for two-axis scatter; RoboBarChart for single-dimension comparison',
  pairsWith: ['RoboEntityDossier', 'RoboBubbleChart', 'RoboCorrelationProvider', 'RoboCard'],
  a11y: 'Provide data table alternative for screen reader users',
  ssr: 'Client component — import via next/dynamic with { ssr: false } in the Next.js App Router.',
};

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const THREAT_AXES: RoboRadarAxis[] = [
  { id: 'confidence', label: 'Confidence', min: 0, max: 100 },
  { id: 'risk', label: 'Risk Score', min: 0, max: 100 },
  { id: 'activity', label: 'Activity', min: 0, max: 100 },
  { id: 'sources', label: 'Source Coverage', min: 0, max: 100 },
  { id: 'connections', label: 'Connections', min: 0, max: 100 },
  { id: 'recency', label: 'Recency', min: 0, max: 100 },
];

const CRAFT_A: RoboRadarProfile = {
  id: 'craft-a',
  label: 'Voyager 1',
  color: 'var(--chart-1)',
  values: { confidence: 82, risk: 64, activity: 71, sources: 90, connections: 45, recency: 95 },
};

const CRAFT_B: RoboRadarProfile = {
  id: 'craft-b',
  label: 'Cassini',
  color: 'var(--chart-2)',
  values: { confidence: 45, risk: 88, activity: 52, sources: 60, connections: 78, recency: 40 },
};

const HIGH_RISK: RoboRadarProfile = {
  id: 'high-risk',
  label: 'High Risk Entity',
  color: 'var(--destructive)',
  values: { confidence: 70, risk: 95, activity: 85, sources: 55, connections: 90, recency: 80 },
};

// ---------------------------------------------------------------------------
// Mixed-magnitude mock — monthly category spend with disparate dollar ranges.
// Per-axis `max` = 1.25× each category's value so small axes don't collapse.
// ---------------------------------------------------------------------------

const SPEND = [
  { id: 'rent',       label: 'Rent',          value: 1850 },
  { id: 'groceries',  label: 'Groceries',     value: 812 },
  { id: 'dining',     label: 'Dining',        value: 260 },
  { id: 'transport',  label: 'Transport',     value: 130 },
  { id: 'subs',       label: 'Subscriptions', value: 42 },
];

const SPEND_AXES: RoboRadarAxis[] = SPEND.map((s) => ({
  id: s.id,
  label: s.label,
  max: Math.round(s.value * 1.25),
}));

const SPEND_PROFILE: RoboRadarProfile = {
  id: 'this-month',
  label: 'This month',
  color: 'var(--chart-1)',
  values: Object.fromEntries(SPEND.map((s) => [s.id, s.value])),
};

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta: Meta<typeof RoboRadarChart> = {
  title: 'Data/Visualizations/RoboRadarChart',
  excludeStories: ['componentMeta'],
  component: RoboRadarChart,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    gridLevels: { control: { type: 'number', min: 2, max: 8 } },
    width:      { control: { type: 'number', min: 200, max: 600 } },
    height:     { control: { type: 'number', min: 200, max: 600 } },
  },
};
export default meta;

type Story = StoryObj<typeof meta>;

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

export const AllVariants: Story = {
  name: 'All Variants',
  render: () => {
    const [ready, setReady] = React.useState(false);
    React.useEffect(() => {
      const t = setTimeout(() => setReady(true), 1200);
      return () => clearTimeout(t);
    }, []);
    if (!ready) return <RoboLoading />;
    return (
      <OverviewStack>
        <OverviewSection title='RoboRadarChart'>
          <div className='flex flex-wrap gap-6'>
            <RoboRadarChart axes={THREAT_AXES} profiles={[CRAFT_A]} gridLevels={4} width={400} height={400} />
            <RoboRadarChart axes={THREAT_AXES} profiles={[CRAFT_A, CRAFT_B]} gridLevels={4} width={400} height={400} />
            <RoboRadarChart axes={THREAT_AXES} profiles={[HIGH_RISK, CRAFT_A]} gridLevels={5} width={400} height={400} />
          </div>
        </OverviewSection>
      </OverviewStack>
    );
  },
};

export const Default: Story = {
  args: {
    axes: THREAT_AXES,
    profiles: [CRAFT_A],
    gridLevels: 4,
    width: 400,
    height: 400,
  },
};

export const MultiProfile: Story = {
  name: 'Multi-Profile Comparison',
  args: {
    axes: THREAT_AXES,
    profiles: [CRAFT_A, CRAFT_B],
    gridLevels: 4,
    width: 400,
    height: 400,
  },
};

export const HighRisk: Story = {
  name: 'High Risk Entity',
  args: {
    axes: THREAT_AXES,
    profiles: [HIGH_RISK, CRAFT_A],
    gridLevels: 5,
    width: 400,
    height: 400,
  },
};

export const MixedMagnitude: Story = {
  name: 'Mixed Magnitude (per-axis min/max)',
  args: {
    axes: SPEND_AXES,
    profiles: [SPEND_PROFILE],
    gridLevels: 4,
    width: 420,
    height: 420,
  },
};
