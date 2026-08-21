import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { RoboAlert } from './alert/robo-alert';
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
import { RoboProgress } from './progress/robo-progress';
import { RoboSkeletonLoading } from './skeleton/robo-skeleton';
import { RoboSpinnerLoading } from './spinner/robo-spinner';
import {
  RoboToastProvider,
  RoboToastViewport,
  useRoboToast,
} from './toast/robo-toast';
import {
  RoboTooltipProvider,
  RoboTooltip,
  RoboTooltipTrigger,
  RoboTooltipContent,
} from './tooltip/robo-tooltip';
import {
  RoboDropdownMenu,
  RoboDropdownMenuTrigger,
  RoboDropdownMenuContent,
  RoboDropdownMenuItem,
  RoboDropdownMenuSeparator,
} from './dropdown-menu/robo-dropdown-menu';
import { RoboEmptyState } from './empty-state/robo-empty-state';
import { RoboButton } from '../core/button/robo-button';
import { OverviewAccordion, OverviewGroup } from '../lib/storybook/overview-layout';

// ---------------------------------------------------------------------------
// Style constants — no inline objects inside render functions
// ---------------------------------------------------------------------------

const pageStyle: React.CSSProperties = {
  padding: '32px',
  maxWidth: '800px',
};

const sectionStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
};

const rowStyle: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '12px',
  alignItems: 'center',
};

const progressColumnStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  width: '320px',
};

const skeletonCardStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  padding: '16px',
  borderRadius: '8px',
  border: '1px solid var(--border)',
  width: '280px',
};

const skeletonRowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
};

const skeletonTextGroupStyle: React.CSSProperties = {
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
  gap: '6px',
};

// ---------------------------------------------------------------------------
// Toast trigger helper — must be inside RoboToastProvider
// ---------------------------------------------------------------------------

function ToastGrid() {
  const { toast } = useRoboToast();

  return (
    <div style={rowStyle}>
      <RoboButton
        size='sm'
        variant='default'
        onClick={() =>
          toast({ title: 'Default', description: 'Default toast message.' })
        }
      >
        Default Toast
      </RoboButton>
      <RoboButton
        size='sm'
        variant='secondary'
        onClick={() =>
          toast({ title: 'Success', description: 'Operation succeeded.', variant: 'success' })
        }
      >
        Success Toast
      </RoboButton>
      <RoboButton
        size='sm'
        variant='secondary'
        onClick={() =>
          toast({ title: 'Warning', description: 'Proceed with caution.', variant: 'warning' })
        }
      >
        Warning Toast
      </RoboButton>
      <RoboButton
        size='sm'
        variant='secondary'
        onClick={() =>
          toast({ title: 'Error', description: 'Something went wrong.', variant: 'error' })
        }
      >
        Error Toast
      </RoboButton>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta: Meta = {
  title: 'Components/Feedback',
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj;

// ---------------------------------------------------------------------------
// Overview story
// ---------------------------------------------------------------------------

export const Overview: Story = {
  name: 'Feedback Overview',
  decorators: [
    (Story) => (
      <RoboToastProvider>
        <RoboTooltipProvider>
          <Story />
          <RoboToastViewport />
        </RoboTooltipProvider>
      </RoboToastProvider>
    ),
  ],
  render: () => (
    <div style={pageStyle}>
      <OverviewAccordion>

        {/* -------------------------------------------------------------- */}
        {/* ALERT                                                          */}
        {/* -------------------------------------------------------------- */}
        <OverviewGroup value="alert" title="RoboAlert — 5 variants + dismissible">
          <div style={sectionStyle}>
            <RoboAlert variant='info'>Informational message about the current state.</RoboAlert>
            <RoboAlert variant='success' title='Operation succeeded'>
              Your changes have been saved successfully.
            </RoboAlert>
            <RoboAlert variant='warning' title='Proceed with caution'>
              Please review the active missions before confirming this action.
            </RoboAlert>
            <RoboAlert variant='error' title='Something went wrong'>
              Failed to save changes. Please try again.
            </RoboAlert>
            <RoboAlert variant='emergency' title='ALERT — Spacecraft Anomaly'>
              Voyager 1 has broadcast an anomaly signal. Immediate assistance required.
            </RoboAlert>
            <RoboAlert variant='info' dismissible title='Dismissible'>
              Click the X button to dismiss this alert.
            </RoboAlert>
          </div>
        </OverviewGroup>

        {/* -------------------------------------------------------------- */}
        {/* DIALOG                                                         */}
        {/* -------------------------------------------------------------- */}
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
                    Anomaly response details would appear here in the dialog body.
                    This content area scales with the dialog size.
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

        {/* -------------------------------------------------------------- */}
        {/* POPOVER                                                        */}
        {/* -------------------------------------------------------------- */}
        <OverviewGroup value="popover" title="RoboPopover — alignments + close button">
          <div style={rowStyle}>
            {(['start', 'center', 'end'] as const).map((align) => (
              <RoboPopover key={align}>
                <RoboPopoverTrigger asChild>
                  <RoboButton size='sm' variant='secondary'>Align: {align}</RoboButton>
                </RoboPopoverTrigger>
                <RoboPopoverContent align={align}>
                  <p className='text-sm font-semibold text-[var(--foreground)] mb-2'>
                    Spacecraft Status
                  </p>
                  <p className='text-xs text-[var(--muted-foreground,#6b7280)]'>
                    Alignment: <strong>{align}</strong>
                  </p>
                  <p className='text-xs text-[var(--muted-foreground,#6b7280)] mt-1'>
                    Velocity: 7.6 km/s · Inclination: 51.6°
                  </p>
                  <RoboPopoverClose asChild>
                    <button className='mt-3 text-xs text-[var(--muted-foreground,#6b7280)] hover:text-[var(--foreground)]'>
                      Close
                    </button>
                  </RoboPopoverClose>
                </RoboPopoverContent>
              </RoboPopover>
            ))}
          </div>
        </OverviewGroup>

        {/* -------------------------------------------------------------- */}
        {/* TOOLTIP                                                        */}
        {/* -------------------------------------------------------------- */}
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

        {/* -------------------------------------------------------------- */}
        {/* TOAST                                                          */}
        {/* -------------------------------------------------------------- */}
        <OverviewGroup value="toast" title="RoboToast — trigger all 4 variants">
          <ToastGrid />
        </OverviewGroup>

        {/* -------------------------------------------------------------- */}
        {/* PROGRESS                                                       */}
        {/* -------------------------------------------------------------- */}
        <OverviewGroup value="progress" title="RoboProgress — determinate + indeterminate">
          <div style={progressColumnStyle}>
            <RoboProgress value={0} label='Empty' showLabel />
            <RoboProgress value={33} label='In progress' showLabel />
            <RoboProgress value={66} label='Almost there' showLabel />
            <RoboProgress value={100} label='Complete' showLabel />
            <RoboProgress indeterminate label='Processing...' />
          </div>
        </OverviewGroup>

        {/* -------------------------------------------------------------- */}
        {/* SPINNER                                                        */}
        {/* -------------------------------------------------------------- */}
        <OverviewGroup value="spinner" title="RoboSpinnerLoading — sm / md / lg">
          <div style={rowStyle}>
            <RoboSpinnerLoading size='sm' label='Small spinner' />
            <RoboSpinnerLoading size='md' label='Medium spinner' />
            <RoboSpinnerLoading size='lg' label='Large spinner' />
          </div>
        </OverviewGroup>

        {/* -------------------------------------------------------------- */}
        {/* SKELETON                                                       */}
        {/* -------------------------------------------------------------- */}
        <OverviewGroup value="skeleton" title="RoboSkeletonLoading — text / circle / rect + card loading">
          <div style={rowStyle}>
            <div style={skeletonCardStyle}>
              <p className='text-xs text-[var(--muted-foreground,#6b7280)]'>Card Loading State</p>
              <div style={skeletonRowStyle}>
                <RoboSkeletonLoading variant='circle' width={40} height={40} />
                <div style={skeletonTextGroupStyle}>
                  <RoboSkeletonLoading variant='text' width='60%' />
                  <RoboSkeletonLoading variant='text' width='40%' />
                </div>
              </div>
              <RoboSkeletonLoading variant='rect' height={80} />
              <RoboSkeletonLoading variant='text' />
              <RoboSkeletonLoading variant='text' width='80%' />
            </div>

            <div style={sectionStyle}>
              <p className='text-xs text-[var(--muted-foreground,#6b7280)]'>Text lines</p>
              <RoboSkeletonLoading variant='text' width={200} />
              <RoboSkeletonLoading variant='text' width={160} />
              <RoboSkeletonLoading variant='text' width={120} />
            </div>

            <div style={rowStyle}>
              <RoboSkeletonLoading variant='circle' width={32} height={32} />
              <RoboSkeletonLoading variant='circle' width={48} height={48} />
              <RoboSkeletonLoading variant='circle' width={64} height={64} />
            </div>
          </div>
        </OverviewGroup>

        {/* -------------------------------------------------------------- */}
        {/* DROPDOWN MENU                                                  */}
        {/* -------------------------------------------------------------- */}
        <OverviewGroup value="dropdown" title="RoboDropdownMenu — actions menu">
          <RoboDropdownMenu>
            <RoboDropdownMenuTrigger asChild>
              <RoboButton size='sm' variant='secondary'>Open menu</RoboButton>
            </RoboDropdownMenuTrigger>
            <RoboDropdownMenuContent>
              <RoboDropdownMenuItem>Edit</RoboDropdownMenuItem>
              <RoboDropdownMenuItem>Duplicate</RoboDropdownMenuItem>
              <RoboDropdownMenuSeparator />
              <RoboDropdownMenuItem variant='destructive'>Delete</RoboDropdownMenuItem>
            </RoboDropdownMenuContent>
          </RoboDropdownMenu>
        </OverviewGroup>

        {/* -------------------------------------------------------------- */}
        {/* EMPTY STATE                                                    */}
        {/* -------------------------------------------------------------- */}
        <OverviewGroup value="empty-state" title="RoboEmptyState — sizes">
          <div style={rowStyle}>
            <RoboEmptyState size='sm' />
            <RoboEmptyState size='md' />
          </div>
        </OverviewGroup>

      </OverviewAccordion>
    </div>
  ),
};
