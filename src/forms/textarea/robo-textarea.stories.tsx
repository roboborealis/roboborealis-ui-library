import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { RoboTextarea } from './robo-textarea';


export const componentMeta = {
  description: 'Multi-line text input for longer-form content entry',
  category: 'input' as const,
  keywords: ['textarea', 'multiline', 'text', 'comment', 'description', 'notes', 'paragraph'],
  whenToUse: 'For multi-line text — comments, descriptions, notes, reports, narrative fields',
  whenNotToUse: 'For single-line text use RoboInput; for rich text with formatting use RoboRichTextEditor',
  pairsWith: ['RoboFormField', 'RoboButton', 'RoboLabel'],
  a11y: 'Always wrap in RoboFormField; set rows/maxLength for appropriate sizing',
};
const meta: Meta<typeof RoboTextarea> = {
  title: 'Components/Forms/RoboTextarea',
  excludeStories: ['componentMeta'],
    component: RoboTextarea,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    resize:     { control: 'radio', options: ['none', 'vertical', 'both'] },
    state:      { control: 'radio', options: ['default', 'error'] },
    disabled:   { control: 'boolean' },
    showCount:  { control: 'boolean' },
    rows:       { control: { type: 'number', min: 2, max: 12 } },
    maxLength:  { control: { type: 'number', min: 50, max: 2000, step: 50 } },
    label:      { control: 'text' },
    helperText: { control: 'text' },
    error:      { control: 'text' },
    placeholder:{ control: 'text' },
  },
};
export default meta;

type Story = StoryObj<typeof RoboTextarea>;

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

/** All states in a compact column. */
export const AllStates: Story = {
  name: 'All States',
  render: () => (
    <div className='flex flex-col gap-4 max-w-sm'>
      <RoboTextarea label='Default' placeholder='Enter any additional notes…' />
      <RoboTextarea label='Filled' defaultValue='Satellite reached orbit on schedule with no incidents.' />
      <RoboTextarea label='Error' state='error' error='This field cannot be empty.' placeholder='Describe the incident…' />
      <RoboTextarea label='Disabled' disabled defaultValue='Cannot edit this content.' />
    </div>
  ),
};

export const Default: Story = {
  args: {
    label: 'Remarks',
    placeholder: 'Enter any additional notes…',
  },
};

export const WithHelperText: Story = {
  name: 'With Helper Text',
  args: {
    label: 'Incident description',
    helperText: 'Include date, time, and location of the incident.',
    placeholder: 'Describe the incident…',
  },
};

export const ErrorState: Story = {
  name: 'Error State',
  args: {
    label: 'Incident description',
    state: 'error',
    error: 'Description is required.',
    placeholder: 'Describe the incident…',
  },
};

export const WithCharacterCount: Story = {
  name: 'With Character Count',
  args: {
    label: 'Mission notes',
    showCount: true,
    maxLength: 500,
    placeholder: 'Add notes for this mission…',
    helperText: 'Max 500 characters.',
  },
};

/** Controlled — live character count update. */
export const ControlledWithCount: Story = {
  name: 'Controlled (live count)',
  render: () => {
    const [value, setValue] = React.useState('');
    return (
      <RoboTextarea
        label='Mission briefing'
        placeholder='Write the mission summary…'
        value={value}
        onChange={(e) => setValue(e.target.value)}
        showCount
        maxLength={300}
        rows={5}
        helperText={`${value.length} / 300 characters used`}
      />
    );
  },
};

export const ResizeNone: Story = {
  name: 'Resize: none',
  args: {
    label: 'Fixed height',
    resize: 'none',
    rows: 3,
    placeholder: 'This textarea cannot be resized.',
  },
};

export const ResizeBoth: Story = {
  name: 'Resize: both',
  args: {
    label: 'Free resize',
    resize: 'both',
    placeholder: 'Drag any corner to resize.',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Archived notes',
    disabled: true,
    defaultValue: 'This record has been archived and can no longer be edited.',
  },
};

export const Playground: Story = {
  args: {
    label: 'Textarea label',
    placeholder: 'Enter text…',
    helperText: '',
    error: '',
    rows: 4,
    resize: 'vertical',
    state: 'default',
    disabled: false,
    showCount: false,
  },
};
