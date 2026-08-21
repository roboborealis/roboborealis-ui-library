import type { Meta, StoryObj } from '@storybook/react';

import { RoboDivider } from './robo-divider';
import { OverviewStack, OverviewSection } from '../../lib/storybook/overview-layout';


export const componentMeta = {
  description: 'Semantic horizontal or vertical divider with optional label',
  category: 'layout' as const,
  keywords: ['divider', 'separator', 'line', 'hr', 'section', 'break', 'rule'],
  whenToUse: 'For separating content sections with an optional label or heading text',
  whenNotToUse: 'For simple border lines use CSS border; for generic separators use RoboSeparator',
  pairsWith: ['RoboCard', 'RoboStack', 'RoboPageShell'],
  a11y: 'Uses role="separator" with aria-orientation; labeled dividers have aria-label',
};
const meta: Meta<typeof RoboDivider> = {
  title: 'Components/Layout/RoboDivider',
  excludeStories: ['componentMeta'],
    component: RoboDivider,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    orientation: { control: 'radio',  options: ['horizontal', 'vertical'] },
    variant:     { control: 'radio',  options: ['solid', 'dashed', 'dotted'] },
    label:       { control: 'text' },
    decorative:  { control: 'boolean' },
  },
};
export default meta;

type Story = StoryObj<typeof RoboDivider>;

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

export const AllVariants: Story = {
  name: 'All Variants',
  render: () => (
    <OverviewStack className='w-[400px]'>
      <OverviewSection title='Horizontal'>
        <RoboDivider />
      </OverviewSection>

      <OverviewSection title='With label'>
        <RoboDivider label='OR' />
      </OverviewSection>

      <OverviewSection title='Line variants'>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {(['solid', 'dashed', 'dotted'] as const).map((variant) => (
            <RoboDivider key={variant} variant={variant} label={variant} />
          ))}
        </div>
      </OverviewSection>

      <OverviewSection title='Vertical'>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, height: 40 }}>
          <span style={{ color: 'var(--foreground)' }}>Left</span>
          <RoboDivider orientation='vertical' />
          <span style={{ color: 'var(--foreground)' }}>Center</span>
          <RoboDivider orientation='vertical' />
          <span style={{ color: 'var(--foreground)' }}>Right</span>
        </div>
      </OverviewSection>
    </OverviewStack>
  ),
};

export const Default: Story = {
  render: () => (
    <div style={{ width: 400 }}>
      <p style={{ color: 'var(--foreground)', marginBottom: 12 }}>Content above</p>
      <RoboDivider />
      <p style={{ color: 'var(--foreground)', marginTop: 12 }}>Content below</p>
    </div>
  ),
};

export const WithLabel: Story = {
  name: 'With Label',
  render: () => (
    <div style={{ width: 400 }}>
      <RoboDivider label='OR' />
    </div>
  ),
};

export const WithNodeLabel: Story = {
  name: 'With Node Label',
  render: () => (
    <div style={{ width: 400 }}>
      <RoboDivider
        label={
          <span style={{ color: 'var(--muted-foreground)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
            Section 2 of 4
          </span>
        }
      />
    </div>
  ),
};

export const LineVariants: Story = {
  name: 'Line Variants',
  render: () => (
    <div style={{ width: 400, display: 'flex', flexDirection: 'column', gap: 24 }}>
      {(['solid', 'dashed', 'dotted'] as const).map((variant) => (
        <div key={variant}>
          <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginBottom: 8 }}>
            variant=&quot;{variant}&quot;
          </p>
          <RoboDivider variant={variant} />
        </div>
      ))}
    </div>
  ),
};

export const LineVariantsWithLabel: Story = {
  name: 'Line Variants — With Label',
  render: () => (
    <div style={{ width: 400, display: 'flex', flexDirection: 'column', gap: 24 }}>
      {(['solid', 'dashed', 'dotted'] as const).map((variant) => (
        <div key={variant}>
          <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginBottom: 8 }}>
            variant=&quot;{variant}&quot;
          </p>
          <RoboDivider variant={variant} label={variant} />
        </div>
      ))}
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, height: 48 }}>
      <span style={{ color: 'var(--foreground)' }}>Left content</span>
      <RoboDivider orientation='vertical' />
      <span style={{ color: 'var(--foreground)' }}>Right content</span>
      <RoboDivider orientation='vertical' />
      <span style={{ color: 'var(--foreground)' }}>More content</span>
    </div>
  ),
};

export const InContext: Story = {
  name: 'In Context — Form Sections',
  render: () => (
    <div
      style={{
        width: 400,
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        padding: 24,
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}
    >
      <div>
        <p style={{ color: 'var(--foreground)', fontWeight: 600, marginBottom: 4 }}>Personal Details</p>
        <p style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem' }}>Name, email, contact info</p>
      </div>
      <RoboDivider label='Satellite Information' />
      <div>
        <p style={{ color: 'var(--foreground)', fontWeight: 600, marginBottom: 4 }}>Satellite Registry</p>
        <p style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem' }}>COSPAR number, operator, class</p>
      </div>
      <RoboDivider label='OR' variant='dashed' />
      <div>
        <p style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem' }}>Enter satellite data manually</p>
      </div>
    </div>
  ),
};

export const Playground: Story = {
  args: { variant: 'solid', label: 'Label', decorative: true },
  decorators: [(Story) => <div style={{ width: 400 }}><Story /></div>],
};
