// ---------------------------------------------------------------------------
// Components/Overlays — Overview
//
// Dialog, Popover, and Tooltip live under the "Overlays" sidebar group but had
// no overview of their own. This collects them on one page.
// ---------------------------------------------------------------------------

import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import {
  RoboDialog,
  RoboDialogTrigger,
  RoboDialogContent,
  RoboDialogHeader,
  RoboDialogTitle,
  RoboDialogDescription,
  RoboDialogFooter,
  RoboDialogClose,
} from './dialog/robo-dialog';
import {
  RoboPopover,
  RoboPopoverTrigger,
  RoboPopoverContent,
  RoboPopoverClose,
} from './popover/robo-popover';
import {
  RoboTooltipProvider,
  RoboTooltip,
  RoboTooltipTrigger,
  RoboTooltipContent,
} from './tooltip/robo-tooltip';
import { RoboButton } from '../core/button/robo-button';
import { OverviewAccordion, OverviewGroup } from '../lib/storybook/overview-layout';

const pageStyle: React.CSSProperties = { padding: '32px', maxWidth: 800 };
const rowStyle: React.CSSProperties = { display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' };

const meta: Meta = {
  title: 'Components/Overlays',
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj;

export const Overview: Story = {
  name: 'Overlays Overview',
  decorators: [(Story) => <RoboTooltipProvider><Story /></RoboTooltipProvider>],
  render: () => (
    <div style={pageStyle}>
      <OverviewAccordion>

        <OverviewGroup value="dialog" title="RoboDialog — sizes sm / md / lg / full">
          <div style={rowStyle}>
            {(['sm', 'md', 'lg', 'full'] as const).map((size) => (
              <RoboDialog key={size}>
                <RoboDialogTrigger asChild>
                  <RoboButton size='sm' variant='secondary'>Open {size.toUpperCase()} Dialog</RoboButton>
                </RoboDialogTrigger>
                <RoboDialogContent size={size}>
                  <RoboDialogHeader>
                    <RoboDialogTitle>Dialog — size: {size}</RoboDialogTitle>
                    <RoboDialogDescription>
                      This is the {size} dialog variant. It demonstrates max-width constraints.
                    </RoboDialogDescription>
                  </RoboDialogHeader>
                  <p className='text-sm text-[var(--foreground)] py-2'>
                    Anomaly response coordination details would appear here in the dialog body.
                  </p>
                  <RoboDialogFooter>
                    <RoboDialogClose asChild>
                      <RoboButton size='sm' variant='ghost'>Cancel</RoboButton>
                    </RoboDialogClose>
                    <RoboButton size='sm'>Confirm</RoboButton>
                  </RoboDialogFooter>
                </RoboDialogContent>
              </RoboDialog>
            ))}
          </div>
        </OverviewGroup>

        <OverviewGroup value="popover" title="RoboPopover — alignments + close button">
          <div style={rowStyle}>
            {(['start', 'center', 'end'] as const).map((align) => (
              <RoboPopover key={align}>
                <RoboPopoverTrigger asChild>
                  <RoboButton size='sm' variant='secondary'>Align: {align}</RoboButton>
                </RoboPopoverTrigger>
                <RoboPopoverContent align={align}>
                  <p className='text-sm font-semibold text-[var(--foreground)] mb-2'>Satellite Status</p>
                  <p className='text-xs text-[var(--secondary-text)]'>Alignment: <strong>{align}</strong></p>
                  <p className='text-xs text-[var(--secondary-text)] mt-1'>Velocity: 7.6 km/s · Inclination: 51.6°</p>
                  <RoboPopoverClose asChild>
                    <button className='mt-3 text-xs text-[var(--secondary-text)] hover:text-[var(--foreground)]'>Close</button>
                  </RoboPopoverClose>
                </RoboPopoverContent>
              </RoboPopover>
            ))}
          </div>
        </OverviewGroup>

        <OverviewGroup value="tooltip" title="RoboTooltip — top / right / bottom / left">
          <div style={rowStyle}>
            {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
              <RoboTooltip key={side}>
                <RoboTooltipTrigger asChild>
                  <RoboButton size='sm' variant='ghost'>Tooltip {side}</RoboButton>
                </RoboTooltipTrigger>
                <RoboTooltipContent side={side}>Tooltip on the {side}</RoboTooltipContent>
              </RoboTooltip>
            ))}
          </div>
        </OverviewGroup>

      </OverviewAccordion>
    </div>
  ),
};
