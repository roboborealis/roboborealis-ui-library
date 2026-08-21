import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Search, Mail, Eye, EyeOff, User } from 'lucide-react';

import { RoboInput } from './robo-input';


export const componentMeta = {
  description: 'Text input field with label, validation, and helper text support',
  category: 'input' as const,
  keywords: ['input', 'text', 'field', 'form', 'type', 'search', 'email', 'number'],
  whenToUse: 'For single-line text entry — names, emails, search queries, numbers',
  whenNotToUse: 'For multi-line text use RoboTextarea; for selection use RoboSelect; for dates use RoboDatePicker',
  pairsWith: ['RoboFormField', 'RoboButton', 'RoboSelect', 'RoboLabel'],
  a11y: 'Always wrap in RoboFormField for automatic label association; required fields get aria-required',
};
const meta: Meta<typeof RoboInput> = {
  title: 'Components/Forms/RoboInput',
  excludeStories: ['componentMeta'],
    component: RoboInput,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    inputSize:   { control: 'radio', options: ['sm', 'md', 'lg'] },
    state:       { control: 'select', options: ['default', 'error', 'success', 'warning'] },
    disabled:    { control: 'boolean' },
    required:    { control: 'boolean' },
    label:       { control: 'text' },
    helperText:  { control: 'text' },
    placeholder: { control: 'text' },
  },
};
export default meta;

type Story = StoryObj<typeof RoboInput>;

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

/** All input states stacked for quick visual review. */
export const AllStates: Story = {
  name: 'All States',
  render: () => (
    <div className='flex flex-col gap-4 max-w-sm'>
      <RoboInput label='Default' placeholder='e.g. Voyager 1' />
      <RoboInput label='Filled' defaultValue='Voyager 1' />
      <RoboInput
        label='With error'
        state='error'
        helperText='NORAD ID must be exactly 5 digits.'
        defaultValue='123'
      />
      <RoboInput label='Disabled' disabled defaultValue='25544' />
      <RoboInput
        label='With start icon'
        placeholder='Search satellites…'
        leadingIcon={<Search className='h-4 w-4' />}
      />
    </div>
  ),
};

export const Default: Story = {
  args: { label: 'Satellite name', placeholder: 'e.g. Voyager 1' },
};

export const Sizes: Story = {
  name: 'Sizes',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 360 }}>
      <RoboInput label='Small (sm)' inputSize='sm' placeholder='Small input' />
      <RoboInput label='Medium (md)' inputSize='md' placeholder='Medium input' />
      <RoboInput label='Large (lg)' inputSize='lg' placeholder='Large input' />
    </div>
  ),
};

export const ValidationStates: Story = {
  name: 'Validation States',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 360 }}>
      <RoboInput label='Default' placeholder='No validation yet' />
      <RoboInput
        label='Error'
        state='error'
        helperText='NORAD ID must be exactly 5 digits.'
        defaultValue='123'
      />
      <RoboInput
        label='Success'
        state='success'
        helperText='Satellite found in registry.'
        defaultValue='25544'
      />
      <RoboInput
        label='Warning'
        state='warning'
        helperText='NORAD ID not found — check and resubmit.'
        defaultValue='11111'
      />
    </div>
  ),
};

export const WithIcons: Story = {
  name: 'With Icons',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 360 }}>
      <RoboInput
        label='Search'
        placeholder='Search satellites…'
        leadingIcon={<Search className='h-4 w-4' />}
      />
      <RoboInput
        label='Email'
        type='email'
        placeholder='name@example.com'
        leadingIcon={<Mail className='h-4 w-4' />}
      />
      <RoboInput
        label='Username'
        placeholder='Enter username'
        leadingIcon={<User className='h-4 w-4' />}
        trailingIcon={<span style={{ fontSize: '0.7rem', color: 'var(--muted-foreground)' }}>@roboborealis</span>}
      />
    </div>
  ),
};

/** Password input with show/hide toggle. */
export const PasswordField: Story = {
  name: 'Password with Toggle',
  render: () => {
    const [show, setShow] = React.useState(false);
    return (
      <RoboInput
        label='Password'
        type={show ? 'text' : 'password'}
        placeholder='Enter password'
        style={{ maxWidth: 360 }}
        trailingIcon={
          <button
            type='button'
            onClick={() => setShow((s) => !s)}
            aria-label={show ? 'Hide password' : 'Show password'}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted-foreground)', display: 'flex', alignItems: 'center' }}
          >
            {show
              ? <EyeOff className='h-4 w-4' />
              : <Eye className='h-4 w-4' />}
          </button>
        }
      />
    );
  },
};

export const WithHelperText: Story = {
  name: 'With Helper Text',
  args: {
    label: 'NORAD ID',
    helperText: '5-digit NORAD catalog number.',
    placeholder: 'e.g. 25544',
    maxLength: 5,
  },
};

export const Required: Story = {
  args: { label: 'NORAD ID', required: true, placeholder: 'Required field' },
};

export const Disabled: Story = {
  args: { label: 'COSPAR ID', disabled: true, defaultValue: '1977-084A' },
};

export const Playground: Story = {
  args: {
    label: 'Input label',
    placeholder: 'Placeholder text',
    helperText: '',
    inputSize: 'md',
    state: 'default',
    disabled: false,
    required: false,
  },
};
