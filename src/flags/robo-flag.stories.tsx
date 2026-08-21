import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { FLAG_DATA } from './flag-data';
import { RoboFlag } from './robo-flag';


export const componentMeta = {
  description: 'Country flag icon rendered from ISO 3166-1 alpha-2 code',
  category: 'display' as const,
  keywords: ['flag', 'country', 'iso', 'nation', 'icon', 'registry', 'orbital'],
  whenToUse: 'For displaying satellite operator, country of origin, or ground station nation',
  whenNotToUse: 'For flag selection in forms use RoboFlagSelect; for generic icons use Lucide icons',
  pairsWith: ['RoboDataTable', 'RoboCard', 'RoboBadge', 'RoboFlagSelect'],
  a11y: 'Always provide aria-label with country name — never rely on flag alone for identification',
};
const meta: Meta<typeof RoboFlag> = {
  title: 'Elements/Flags/RoboFlag',
  excludeStories: ['componentMeta'],
    component: RoboFlag,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
    },
    rounded: { control: 'boolean' },
  },
};
export default meta;

type Story = StoryObj<typeof RoboFlag>;

/* ------------------------------------------------------------------ */
/* All sizes — across several countries                                 */
/* ------------------------------------------------------------------ */

export const AllSizes: Story = {
  name: 'All Sizes',
  render: () => (
    <div className='flex flex-col gap-4'>
      {(['us', 'gb', 'jp', 'fr', 'au'] as const).map((code) => (
        <div key={code} className='flex gap-3 flex-wrap items-center'>
          <span className='w-8 text-xs uppercase text-[var(--muted-foreground)]'>{code}</span>
          {(['xs', 'sm', 'md', 'lg'] as const).map((size) => (
            <div key={size} className='flex flex-col items-center gap-1'>
              <RoboFlag code={code} size={size} />
              <span className='text-xs text-[var(--muted-foreground)]'>{size}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/* Single flag                                                          */
/* ------------------------------------------------------------------ */

export const Default: Story = {
  args: {
    code: 'us',
    size: 'md',
    rounded: true,
  },
};

export const UnitedKingdom: Story = {
  args: {
    code: 'gb',
    size: 'md',
  },
};

export const UnknownCode: Story = {
  name: 'Unknown code (fallback)',
  args: {
    code: 'xx',
    size: 'md',
  },
};

/* ------------------------------------------------------------------ */
/* Rounded vs Sharp corners                                             */
/* ------------------------------------------------------------------ */

export const RoundedVariants: Story = {
  name: 'Rounded vs Sharp',
  render: () => (
    <div className='flex items-center gap-6'>
      <div className='flex flex-col items-center gap-2'>
        <RoboFlag code='jp' size='lg' rounded={true} />
        <span className='text-xs text-[var(--muted-foreground)]'>rounded</span>
      </div>
      <div className='flex flex-col items-center gap-2'>
        <RoboFlag code='jp' size='lg' rounded={false} />
        <span className='text-xs text-[var(--muted-foreground)]'>sharp</span>
      </div>
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/* Flag Gallery (all 255)                                               */
/* ------------------------------------------------------------------ */

export const Gallery: Story = {
  name: 'Flag Gallery (all countries)',
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
        gap: '12px',
      }}
    >
      {FLAG_DATA.map((entry) => (
        <div
          key={entry.code}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <RoboFlag code={entry.code} size='md' />
          <span
            style={{
              fontSize: '10px',
              color: 'var(--muted-foreground)',
              textAlign: 'center',
              lineHeight: 1.3,
            }}
          >
            {entry.code.toUpperCase()}
          </span>
          <span
            style={{
              fontSize: '9px',
              color: 'var(--muted-foreground)',
              textAlign: 'center',
              lineHeight: 1.2,
              maxWidth: '72px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
            title={entry.label}
          >
            {entry.label}
          </span>
        </div>
      ))}
    </div>
  ),
};
