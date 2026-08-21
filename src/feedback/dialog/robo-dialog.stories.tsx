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
} from './robo-dialog';
import { RoboButton } from '@/core/button/robo-button';


export const componentMeta = {
  description: 'Modal overlay for confirmations, forms, or focused tasks requiring user attention',
  category: 'feedback' as const,
  keywords: ['dialog', 'modal', 'overlay', 'confirm', 'popup', 'form', 'prompt', 'lightbox'],
  whenToUse: 'For confirmations, destructive action warnings, focused forms, or detail views',
  whenNotToUse: 'For non-blocking info use RoboToast; for inline expansion use RoboAccordion; for menus use RoboDropdownMenu',
  pairsWith: ['RoboButton', 'RoboFormField', 'RoboAlert'],
  a11y: 'Traps focus, returns focus on close, uses aria-labelledby on the title element',
};
const meta: Meta = {
  title: 'Components/Overlays/RoboDialog',
  excludeStories: ['componentMeta'],
    tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <RoboDialog>
      <RoboDialogTrigger asChild>
        <RoboButton variant='default'>Open Dialog</RoboButton>
      </RoboDialogTrigger>
      <RoboDialogContent>
        <RoboDialogHeader>
          <RoboDialogTitle>Confirm action</RoboDialogTitle>
          <RoboDialogDescription>
            Are you sure you want to proceed? This action cannot be undone.
          </RoboDialogDescription>
        </RoboDialogHeader>
        <RoboDialogFooter>
          <RoboDialogClose asChild>
            <RoboButton variant='outline'>Cancel</RoboButton>
          </RoboDialogClose>
          <RoboButton variant='default'>Confirm</RoboButton>
        </RoboDialogFooter>
      </RoboDialogContent>
    </RoboDialog>
  ),
};

export const SmallDialog: Story = {
  name: 'Small Dialog',
  render: () => (
    <RoboDialog>
      <RoboDialogTrigger asChild>
        <RoboButton variant='default'>Open Small Dialog</RoboButton>
      </RoboDialogTrigger>
      <RoboDialogContent size='sm'>
        <RoboDialogHeader>
          <RoboDialogTitle>Quick confirm</RoboDialogTitle>
        </RoboDialogHeader>
        <RoboDialogFooter>
          <RoboDialogClose asChild>
            <RoboButton variant='outline'>Cancel</RoboButton>
          </RoboDialogClose>
          <RoboButton variant='default'>OK</RoboButton>
        </RoboDialogFooter>
      </RoboDialogContent>
    </RoboDialog>
  ),
};

export const LargeDialog: Story = {
  name: 'Large Dialog',
  render: () => (
    <RoboDialog>
      <RoboDialogTrigger asChild>
        <RoboButton variant='default'>Open Large Dialog</RoboButton>
      </RoboDialogTrigger>
      <RoboDialogContent size='lg'>
        <RoboDialogHeader>
          <RoboDialogTitle>Satellite details</RoboDialogTitle>
          <RoboDialogDescription>Full satellite information and history.</RoboDialogDescription>
        </RoboDialogHeader>
        <div className='py-4 text-sm text-[var(--foreground)]'>
          Detailed content goes here.
        </div>
        <RoboDialogFooter>
          <RoboDialogClose asChild>
            <RoboButton variant='outline'>Close</RoboButton>
          </RoboDialogClose>
        </RoboDialogFooter>
      </RoboDialogContent>
    </RoboDialog>
  ),
};

/**
 * A dialog the user must not dismiss — a consent gate, a blocking error, a required
 * step. `showCloseButton={false}` removes the X entirely rather than hiding it, so it
 * takes no tab stop and screen readers never announce it.
 *
 * The two Radix escape hatches are closed explicitly alongside it. A controlled `open`
 * with no `onOpenChange` already ignores them, but relying on that is implicit and
 * breaks the moment someone wires the handler up.
 */
export const MandatoryDialog: Story = {
  name: 'Mandatory (no close button)',
  render: () => (
    <RoboDialog open>
      <RoboDialogContent
        showCloseButton={false}
        onEscapeKeyDown={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <RoboDialogHeader>
          <RoboDialogTitle>Terms of use</RoboDialogTitle>
          <RoboDialogDescription>
            You must acknowledge these terms before continuing. There is no way out of
            this dialog except the button below.
          </RoboDialogDescription>
        </RoboDialogHeader>
        <RoboDialogFooter>
          <RoboButton variant='default'>I acknowledge</RoboButton>
        </RoboDialogFooter>
      </RoboDialogContent>
    </RoboDialog>
  ),
};
