import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Meta, StoryObj } from '@storybook/react';

import { RoboFormField, RoboForm, RoboFormSubmit, type RoboFormFieldProps } from './robo-form-field';
import { RoboInput } from '@/core/input/robo-input';
import { RoboSelect } from '@/forms/select/robo-select';
import { RoboTextarea } from '@/forms/textarea/robo-textarea';

/**
 * RoboFormField wraps react-hook-form's `Controller` and connects a label,
 * helper text, and error display to any input. RoboForm and RoboFormSubmit are
 * convenience wrappers around `FormProvider` and `<button type="submit">`.
 */
// RoboFormField uses generics so we cast to enable the autodocs prop table

export const componentMeta = {
  description: 'Form field wrapper providing label, validation, and helper text for any input',
  category: 'input' as const,
  keywords: ['form', 'field', 'label', 'validation', 'error', 'helper', 'required', 'wrapper'],
  whenToUse: 'Wrap every form input — provides label association, error display, and helper text',
  whenNotToUse: 'For standalone labels without validation use RoboLabel; for non-form content use RoboCard',
  pairsWith: ['RoboInput', 'RoboSelect', 'RoboTextarea', 'RoboCheckbox', 'RoboRadioGroup'],
  a11y: 'Automatically associates label with input via htmlFor; error messages use role="alert"',
};
const meta: Meta<RoboFormFieldProps> = {
  title: 'Components/Forms/RoboFormField',
  excludeStories: ['componentMeta'],
    component: RoboFormField as React.ComponentType<RoboFormFieldProps>,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};
export default meta;

type Story = StoryObj<RoboFormFieldProps>;

// ---------------------------------------------------------------------------
// Schemas
// ---------------------------------------------------------------------------

const satelliteSchema = z.object({
  satelliteName: z.string().min(2, 'Name must be at least 2 characters'),
  noradId: z.string().regex(/^\d{9}$/, 'NORAD ID must be exactly 9 digits'),
  operator: z.string().min(1, 'Operator is required'),
  remarks: z.string().optional(),
});

type SatelliteForm = z.infer<typeof satelliteSchema>;

const flagOptions = [
  { value: 'usa', label: 'NASA' },
  { value: 'gbr', label: 'ESA' },
  { value: 'nor', label: 'JAXA' },
  { value: 'pan', label: 'Roscosmos' },
];

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

/** All field states stacked for quick visual review. */
export const AllStates: Story = {
  name: 'All States',
  render: () => {
    const form = useForm({
      defaultValues: { required: '', hint: '', error: 'X', disabled: 'Archived value' },
    });
    React.useEffect(() => {
      form.setError('error', { message: 'This field is required.' });
    }, [form]);
    return (
      <div className='flex flex-col gap-4 max-w-sm'>
        <RoboFormField control={form.control} name='required' label='Required' required>
          {({ field }) => <RoboInput {...field} placeholder='Required field' />}
        </RoboFormField>
        <RoboFormField
          control={form.control}
          name='hint'
          label='With hint'
          helperText='Official registered name.'
        >
          {({ field }) => <RoboInput {...field} placeholder='e.g. Voyager 1' />}
        </RoboFormField>
        <RoboFormField control={form.control} name='error' label='With error'>
          {({ field, error }) => <RoboInput {...field} error={error} />}
        </RoboFormField>
        <RoboFormField control={form.control} name='disabled' label='Disabled'>
          {({ field }) => <RoboInput {...field} disabled />}
        </RoboFormField>
      </div>
    );
  },
};

/** Basic single field — shows the raw RoboFormField building block. */
export const SingleField: Story = {
  name: 'Single Field',
  render: () => {
    const form = useForm({ defaultValues: { satelliteName: '' } });
    return (
      <div style={{ maxWidth: 360 }}>
        <RoboFormField
          control={form.control}
          name='satelliteName'
          label='Satellite name'
          helperText='Official registered name.'
          rules={{ required: 'Satellite name is required' }}
        >
          {({ field, error }) => (
            <RoboInput
              {...field}
              placeholder='e.g. Voyager 1'
              error={error}
            />
          )}
        </RoboFormField>
      </div>
    );
  },
};

/** Full satellite registration form with Zod validation. */
export const SatelliteRegistrationForm: Story = {
  name: 'Satellite Registration Form',
  render: () => {
    const form = useForm<SatelliteForm>({
      resolver: zodResolver(satelliteSchema),
      defaultValues: { satelliteName: '', noradId: '', operator: '', remarks: '' },
    });

    const [submitted, setSubmitted] = React.useState<SatelliteForm | null>(null);

    return (
      <div style={{ maxWidth: 440 }}>
        <RoboForm
          form={form}
          onSubmit={(values) => setSubmitted(values as SatelliteForm)}
          style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
        >
          <RoboFormField
            control={form.control}
            name='satelliteName'
            label='Satellite name'
            helperText='Official registered name.'
          >
            {({ field, error }) => (
              <RoboInput {...field} placeholder='e.g. Voyager 1' error={error} />
            )}
          </RoboFormField>

          <RoboFormField
            control={form.control}
            name='noradId'
            label='NORAD ID'
            helperText='9-digit NORAD catalog number.'
          >
            {({ field, error }) => (
              <RoboInput {...field} placeholder='e.g. 338234511' maxLength={9} error={error} />
            )}
          </RoboFormField>

          <RoboFormField
            control={form.control}
            name='operator'
            label='Operator'
          >
            {({ field, error }) => (
              <RoboSelect
                {...field}
                options={flagOptions}
                placeholder='Select country…'
                error={error}
                onValueChange={field.onChange}
              />
            )}
          </RoboFormField>

          <RoboFormField
            control={form.control}
            name='remarks'
            label='Remarks'
          >
            {({ field }) => (
              <RoboTextarea
                {...field}
                placeholder='Optional notes…'
                rows={3}
              />
            )}
          </RoboFormField>

          <RoboFormSubmit>Register Satellite</RoboFormSubmit>
        </RoboForm>

        {submitted && (
          <pre
            style={{
              marginTop: 16,
              padding: 12,
              background: 'var(--muted)',
              borderRadius: 'var(--radius)',
              fontSize: '0.75rem',
              color: 'var(--foreground)',
            }}
          >
            {JSON.stringify(submitted, null, 2)}
          </pre>
        )}
      </div>
    );
  },
};

/** Pre-filled form with validation errors on submit. */
export const WithValidationErrors: Story = {
  name: 'Validation Errors (submit to see)',
  render: () => {
    const form = useForm<SatelliteForm>({
      resolver: zodResolver(satelliteSchema),
      defaultValues: { satelliteName: 'X', noradId: '123', operator: '', remarks: '' },
    });

    return (
      <div style={{ maxWidth: 440 }}>
        <RoboForm
          form={form}
          onSubmit={() => {}}
          style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
        >
          <RoboFormField control={form.control} name='satelliteName' label='Satellite name'>
            {({ field, error }) => (
              <RoboInput {...field} placeholder='Satellite name' error={error} />
            )}
          </RoboFormField>

          <RoboFormField control={form.control} name='noradId' label='NORAD ID'>
            {({ field, error }) => (
              <RoboInput {...field} placeholder='NORAD ID' error={error} />
            )}
          </RoboFormField>

          <RoboFormField control={form.control} name='operator' label='Operator'>
            {({ field, error }) => (
              <RoboSelect
                {...field}
                options={flagOptions}
                placeholder='Select country…'
                error={error}
                onValueChange={field.onChange}
              />
            )}
          </RoboFormField>

          <RoboFormSubmit>Submit (shows errors)</RoboFormSubmit>
        </RoboForm>
      </div>
    );
  },
};

/** Loading state for the submit button. */
export const LoadingSubmit: Story = {
  name: 'Loading Submit Button',
  render: () => {
    const form = useForm({ defaultValues: { name: '' } });
    const [loading, setLoading] = React.useState(false);

    const handleSubmit = async () => {
      setLoading(true);
      await new Promise((r) => setTimeout(r, 2000));
      setLoading(false);
    };

    return (
      <div style={{ maxWidth: 360 }}>
        <RoboForm
          form={form}
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
        >
          <RoboFormField control={form.control} name='name' label='Satellite name'>
            {({ field }) => <RoboInput {...field} placeholder='Satellite name' />}
          </RoboFormField>
          <RoboFormSubmit loading={loading}>
            {loading ? 'Saving…' : 'Save satellite'}
          </RoboFormSubmit>
        </RoboForm>
      </div>
    );
  },
};
