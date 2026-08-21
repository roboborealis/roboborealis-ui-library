import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Satellite, AlertTriangle, CheckCircle, Clock, Anchor } from 'lucide-react';

import { RoboChip } from './robo-chip';


export const componentMeta = {
  description: 'Interactive filter or selection token that can be toggled or dismissed',
  category: 'input' as const,
  keywords: ['chip', 'tag', 'filter', 'token', 'selection', 'dismiss', 'removable'],
  whenToUse: 'For active filter indicators, multi-select tokens, or dismissible tags',
  whenNotToUse: 'For static labels use RoboBadge; for actions use RoboButton',
  pairsWith: ['RoboFilterPanel', 'RoboSelect', 'RoboInput', 'RoboDataTable'],
  a11y: 'Dismissible chips need aria-label describing the removal action; keyboard Enter/Delete to dismiss',
};
const meta: Meta<typeof RoboChip> = {
  title: 'Elements/Display/RoboChip',
  excludeStories: ['componentMeta'],
    component: RoboChip,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    variant:  { control: 'select', options: ['default', 'primary', 'success', 'warning', 'destructive', 'outline'] },
    size:     { control: 'radio', options: ['sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
  },
};
export default meta;

type Story = StoryObj<typeof RoboChip>;

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

export const Variants: Story = {
  name: 'All Variants',
  render: () => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <RoboChip variant='default'>Default</RoboChip>
      <RoboChip variant='primary'>Primary</RoboChip>
      <RoboChip variant='success'>Success</RoboChip>
      <RoboChip variant='warning'>Warning</RoboChip>
      <RoboChip variant='destructive'>Destructive</RoboChip>
      <RoboChip variant='outline'>Outline</RoboChip>
    </div>
  ),
};

export const Default: Story = {
  args: { children: 'Active' },
};

export const Sizes: Story = {
  name: 'Sizes',
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
      <RoboChip size='sm'>Small</RoboChip>
      <RoboChip size='md'>Medium</RoboChip>
      <RoboChip size='lg'>Large</RoboChip>
    </div>
  ),
};

export const WithIcons: Story = {
  name: 'With Icons',
  render: () => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <RoboChip variant='success' icon={<CheckCircle className='h-3 w-3' />}>Active</RoboChip>
      <RoboChip variant='warning' icon={<Clock className='h-3 w-3' />}>Signal Loss</RoboChip>
      <RoboChip variant='destructive' icon={<AlertTriangle className='h-3 w-3' />}>Alert</RoboChip>
      <RoboChip variant='primary' icon={<Satellite className='h-3 w-3' />}>In transit</RoboChip>
      <RoboChip variant='default' icon={<Anchor className='h-3 w-3' />}>Docked</RoboChip>
    </div>
  ),
};

export const Dismissible: Story = {
  name: 'Dismissible (with onDismiss)',
  render: () => {
    const [tags, setTags] = React.useState(['Active', 'Sentinel', 'Probe', 'Signal Loss', 'NASA']);
    return (
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', minHeight: 32 }}>
        {tags.map((tag) => (
          <RoboChip
            key={tag}
            variant='outline'
            onDismiss={() => setTags((prev) => prev.filter((t) => t !== tag))}
            dismissLabel={`Remove ${tag}`}
          >
            {tag}
          </RoboChip>
        ))}
        {tags.length === 0 && (
          <span style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)' }}>All filters cleared.</span>
        )}
      </div>
    );
  },
};

/** Label variants — useful for tagging records with category or status. */
export const LabelVariants: Story = {
  name: 'Label Variants',
  render: () => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <RoboChip variant='primary'>Probe</RoboChip>
      <RoboChip variant='default'>Sentinel</RoboChip>
      <RoboChip variant='outline'>Under 500 kg</RoboChip>
    </div>
  ),
};

/** Satellite status badges — common pattern in tables and detail cards. */
export const SatelliteStatuses: Story = {
  name: 'Satellite Status Badges',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {[
        { label: 'Active', variant: 'success', icon: CheckCircle },
        { label: 'Signal Loss', variant: 'warning', icon: Clock },
        { label: 'Alert', variant: 'destructive', icon: AlertTriangle },
        { label: 'Docked', variant: 'primary', icon: Anchor },
        { label: 'Unknown', variant: 'default', icon: Satellite },
      ].map(({ label, variant, icon: Icon }) => (
        <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 80, fontSize: '0.8rem', color: 'var(--muted-foreground)' }}>{label}</span>
          <RoboChip
            variant={variant as 'success' | 'warning' | 'destructive' | 'primary' | 'default'}
            size='sm'
            icon={<Icon className='h-3 w-3' />}
          >
            {label}
          </RoboChip>
        </div>
      ))}
    </div>
  ),
};

/** Active filter chips — search/filter UX pattern. */
export const ActiveFilters: Story = {
  name: 'In Context — Active Filters',
  render: () => {
    const [filters, setFilters] = React.useState([
      { key: 'flag', label: 'Operator: NASA' },
      { key: 'status', label: 'Status: Active' },
      { key: 'type', label: 'Type: Probe' },
    ]);

    return (
      <div
        style={{
          padding: '12px 16px',
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          maxWidth: 440,
        }}
      >
        <p style={{ margin: '0 0 10px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Active Filters
        </p>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {filters.map((f) => (
            <RoboChip
              key={f.key}
              variant='primary'
              size='sm'
              onDismiss={() => setFilters((prev) => prev.filter((x) => x.key !== f.key))}
            >
              {f.label}
            </RoboChip>
          ))}
          {filters.length === 0 && (
            <span style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)' }}>No active filters.</span>
          )}
        </div>
      </div>
    );
  },
};

export const Playground: Story = {
  args: {
    children: 'Chip label',
    variant: 'default',
    size: 'md',
    disabled: false,
  },
};
