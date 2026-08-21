import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import {
  RoboTable,
  RoboTableHeader,
  RoboTableBody,
  RoboTableRow,
  RoboTableHead,
  RoboTableCell,
} from '@/tables/table/robo-table';

import { RoboCourseIndicator } from './robo-course-indicator';


export const componentMeta = {
  description: 'Visual compass indicator showing satellite orbital heading or inclination',
  category: 'display' as const,
  keywords: ['course', 'heading', 'compass', 'bearing', 'direction', 'satellite', 'navigation', 'orbital'],
  whenToUse: 'For displaying orbital inclination, RAAN, or heading in orbital contexts',
  whenNotToUse: 'For general directional arrows use an icon',
  pairsWith: ['RoboDataTable', 'RoboCard'],
  a11y: 'Include aria-label with human-readable course value (e.g., "Course: 045 degrees")',
};
const meta: Meta<typeof RoboCourseIndicator> = {
  title: 'Elements/Display/RoboCourseIndicator',
  excludeStories: ['componentMeta'],
    component: RoboCourseIndicator,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    course: { control: { type: 'range', min: 0, max: 360, step: 1 } },
    display: { control: 'radio', options: ['both', 'arrow', 'value'] },
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
    iconSize: { control: { type: 'number', min: 8, max: 48 } },
  },
};
export default meta;

type Story = StoryObj<typeof RoboCourseIndicator>;

// ---------------------------------------------------------------------------
// All Sizes — headings across all sizes
// ---------------------------------------------------------------------------

export const AllSizes: Story = {
  name: 'All Sizes',
  render: () => (
    <div className='flex flex-col gap-6'>
      <div className='flex items-end gap-6'>
        <div className='flex flex-col items-center gap-1'>
          <span className='text-xs text-[var(--muted-foreground)]'>sm</span>
          <RoboCourseIndicator course={135} size='sm' />
        </div>
        <div className='flex flex-col items-center gap-1'>
          <span className='text-xs text-[var(--muted-foreground)]'>md</span>
          <RoboCourseIndicator course={135} size='md' />
        </div>
        <div className='flex flex-col items-center gap-1'>
          <span className='text-xs text-[var(--muted-foreground)]'>lg</span>
          <RoboCourseIndicator course={135} size='lg' />
        </div>
      </div>
      <div className='grid grid-cols-4 gap-4'>
        {[
          { label: 'N', course: 0 },
          { label: 'NE', course: 45 },
          { label: 'E', course: 90 },
          { label: 'SE', course: 135 },
          { label: 'S', course: 180 },
          { label: 'SW', course: 225 },
          { label: 'W', course: 270 },
          { label: 'NW', course: 315 },
        ].map(({ label, course }) => (
          <div key={label} className='flex flex-col items-center gap-1 p-3 rounded border border-[var(--border)]'>
            <span className='text-xs font-medium text-[var(--muted-foreground)]'>{label}</span>
            <RoboCourseIndicator course={course} size='lg' />
          </div>
        ))}
      </div>
    </div>
  ),
};

// ---------------------------------------------------------------------------
// Default — interactive playground
// ---------------------------------------------------------------------------

export const Default: Story = {
  args: {
    course: 142,
    display: 'both',
    size: 'md',
  },
};

// ---------------------------------------------------------------------------
// Display modes
// ---------------------------------------------------------------------------

export const ArrowOnly: Story = {
  name: 'Arrow Only',
  args: { course: 225, display: 'arrow', size: 'md' },
};

export const ValueOnly: Story = {
  name: 'Value Only',
  args: { course: 315, display: 'value', size: 'md' },
};

export const BothArrowAndValue: Story = {
  name: 'Both (Default)',
  args: { course: 90, display: 'both', size: 'md' },
};

// ---------------------------------------------------------------------------
// Compass rose — 8 cardinal + intercardinal directions
// ---------------------------------------------------------------------------

const compassPoints = [
  { label: 'N', course: 0 },
  { label: 'NE', course: 45 },
  { label: 'E', course: 90 },
  { label: 'SE', course: 135 },
  { label: 'S', course: 180 },
  { label: 'SW', course: 225 },
  { label: 'W', course: 270 },
  { label: 'NW', course: 315 },
];

export const CompassRose: Story = {
  name: 'Compass Rose',
  render: () => (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-[var(--muted-foreground)]">
        All 8 cardinal and intercardinal directions — arrow should point in the correct direction.
      </p>
      <div className="grid grid-cols-4 gap-4">
        {compassPoints.map(({ label, course }) => (
          <div key={label} className="flex flex-col items-center gap-1 p-3 rounded border border-[var(--border)]">
            <span className="text-xs font-medium text-[var(--muted-foreground)]">{label}</span>
            <RoboCourseIndicator course={course} size="lg" />
          </div>
        ))}
      </div>
    </div>
  ),
};

// ---------------------------------------------------------------------------
// Null / undefined
// ---------------------------------------------------------------------------

export const NullCourse: Story = {
  name: 'Null Course',
  render: () => (
    <div className="flex gap-6">
      <div className="flex flex-col items-center gap-1">
        <span className="text-xs text-[var(--muted-foreground)]">null</span>
        <RoboCourseIndicator course={null} />
      </div>
      <div className="flex flex-col items-center gap-1">
        <span className="text-xs text-[var(--muted-foreground)]">undefined</span>
        <RoboCourseIndicator course={undefined} />
      </div>
    </div>
  ),
};

// ---------------------------------------------------------------------------
// Display mode comparison
// ---------------------------------------------------------------------------

export const DisplayModeComparison: Story = {
  name: 'Display Mode Comparison',
  render: () => (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-[var(--muted-foreground)]">
        Same course (225°) shown in all three display modes and sizes.
      </p>
      <RoboTable variant="bordered" className="w-auto text-sm">
        <RoboTableHeader>
          <RoboTableRow>
            <RoboTableHead>Mode</RoboTableHead>
            <RoboTableHead className="text-center">sm</RoboTableHead>
            <RoboTableHead className="text-center">md</RoboTableHead>
            <RoboTableHead className="text-center">lg</RoboTableHead>
          </RoboTableRow>
        </RoboTableHeader>
        <RoboTableBody>
          {(['both', 'arrow', 'value'] as const).map((display) => (
            <RoboTableRow key={display}>
              <RoboTableCell className="font-mono text-xs">{display}</RoboTableCell>
              {(['sm', 'md', 'lg'] as const).map((size) => (
                <RoboTableCell key={size} className="text-center">
                  <RoboCourseIndicator course={225} display={display} size={size} />
                </RoboTableCell>
              ))}
            </RoboTableRow>
          ))}
        </RoboTableBody>
      </RoboTable>
    </div>
  ),
};
