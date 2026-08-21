import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { RoboBubbleChart } from './robo-bubble-chart';
import type { RoboBubbleItem } from './robo-bubble-chart';
import { RoboLoading } from '../../feedback/loading/robo-loading';
import { OverviewStack, OverviewSection } from '../../lib/storybook/overview-layout';

export const componentMeta = {
  description: '2-D scatter plot with sized, colored bubbles for entity risk/confidence profiling',
  category: 'visualization' as const,
  keywords: ['bubble', 'scatter', 'chart', 'risk', 'confidence', 'correlation', 'osint'],
  whenToUse: 'Compare entities across two numeric dimensions (e.g. confidence vs risk) with a third size dimension',
  whenNotToUse: 'Use RoboRadarChart for multi-axis profiling; RoboForceGraph for relationship topology',
  pairsWith: ['RoboCorrelationProvider', 'RoboFilterPanel', 'RoboEntityDossier', 'RoboForceGraph'],
  a11y: 'Provide a data table alternative; each bubble has a tooltip with label and values',
};

// ---------------------------------------------------------------------------
// Mock data helpers
// ---------------------------------------------------------------------------

const ENTITY_COLORS: Record<string, string> = {
  spacecraft: 'var(--chart-1)',
  aircraft: 'var(--chart-2)',
  company: 'var(--chart-3)',
  person: 'var(--chart-4)',
  station: 'var(--chart-5)',
};

function makeBubbles(count: number): RoboBubbleItem[] {
  const types = Object.keys(ENTITY_COLORS);
  return Array.from({ length: count }, (_, i) => {
    const type = types[i % types.length];
    return {
      id: `entity-${i}`,
      label: `${type.charAt(0).toUpperCase() + type.slice(1)} ${i + 1}`,
      x: Math.sin(i * 0.8) * 0.4 + 0.5,
      y: Math.cos(i * 0.6) * 0.35 + 0.5,
      size: 0.1 + (i % 5) * 0.15,
      color: ENTITY_COLORS[type],
      typeLabel: type.charAt(0).toUpperCase() + type.slice(1),
      metadata: { confidence: (0.5 + Math.sin(i) * 0.3).toFixed(2), riskScore: Math.floor(i * 4.2) % 100 },
    };
  });
}

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta: Meta<typeof RoboBubbleChart> = {
  title: 'Data/Visualizations/RoboBubbleChart',
  excludeStories: ['componentMeta'],
  component: RoboBubbleChart,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    xLabel:    { control: 'text' },
    yLabel:    { control: 'text' },
    sizeLabel: { control: 'text' },
    xTicks:    { control: { type: 'number', min: 2, max: 10 } },
    yTicks:    { control: { type: 'number', min: 2, max: 10 } },
    width:     { control: { type: 'number', min: 300, max: 900 } },
    height:    { control: { type: 'number', min: 200, max: 600 } },
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
        <OverviewSection title='RoboBubbleChart'>
          <div className='flex flex-col gap-6'>
            <RoboBubbleChart
              items={makeBubbles(25)}
              xLabel='Confidence'
              yLabel='Risk Score'
              sizeLabel='Relationship Count'
              width={640}
              height={400}
            />
            <RoboBubbleChart
              items={makeBubbles(80)}
              xLabel='Confidence'
              yLabel='Risk Score'
              sizeLabel='Relationship Count'
              width={800}
              height={500}
            />
          </div>
        </OverviewSection>
      </OverviewStack>
    );
  },
};

export const Default: Story = {
  args: {
    items: makeBubbles(25),
    xLabel: 'Confidence',
    yLabel: 'Risk Score',
    sizeLabel: 'Relationship Count',
    width: 640,
    height: 400,
  },
};

export const LargeDataset: Story = {
  args: {
    items: makeBubbles(80),
    xLabel: 'Confidence',
    yLabel: 'Risk Score',
    sizeLabel: 'Relationship Count',
    width: 800,
    height: 500,
  },
};

export const Empty: Story = {
  args: {
    items: [],
    xLabel: 'Confidence',
    yLabel: 'Risk Score',
    sizeLabel: 'Count',
    width: 640,
    height: 400,
  },
};
