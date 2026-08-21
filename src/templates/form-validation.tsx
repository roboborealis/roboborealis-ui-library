// =============================================================================
// TEMPLATE: FormValidationTemplate — Archetype 7 (Form + Validation)
//
// Pattern:  RoboPageShell + RoboForm + RoboFormField in 2-column grid
// State:    react-hook-form (no external state needed)
// Use for:  Data entry, reports, submissions — multi-field forms with Zod validation
//           and a post-submit success state
//
// CONSUMER IMPORTS (use these in your app):
//   import { RoboPageShell } from '@roboborealis/components/layout';
//   import { RoboButton, RoboCard, RoboCardHeader, RoboCardBody,
//            RoboBadge, RoboSeparator } from '@roboborealis/components/core';
//   import { RoboInput, RoboSelect, RoboTextarea, RoboRadioGroup,
//            RoboSwitch, RoboFormField, RoboForm } from '@roboborealis/components/forms';
// =============================================================================
//
// COPY-ADAPTABLE TEMPLATE — all TODO comments below are intentional injection
// points, not bugs or tech debt. Copy this file into your app and fill them in.
// See docs/agent-first-architecture.md for the copy-adapt workflow.
// =============================================================================

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ClipboardList, CheckCircle } from 'lucide-react';

import { RoboPageShell }  from '@/layout/page-shell/robo-page-shell';
import { RoboButton }     from '@/core/button/robo-button';
import { RoboCard, RoboCardBody, RoboCardHeader } from '@/core/card/robo-card';
import { RoboBadge }      from '@/core/badge/robo-badge';
import { RoboSeparator }  from '@/core/separator/robo-separator';
import { RoboInput }      from '@/core/input/robo-input';
import { RoboSelect }     from '@/forms/select/robo-select';
import { RoboTextarea }   from '@/forms/textarea/robo-textarea';
import { RoboRadioGroup } from '@/forms/radio-group/robo-radio-group';
import { RoboSwitch }     from '@/forms/switch/robo-switch';
import { RoboFormField }  from '@/forms/form-field/robo-form-field';
import { RoboForm }       from '@/forms/form-field/robo-form-field';

import { TemplateTopbar } from './_shared';

// ---------------------------------------------------------------------------
// TODO: Replace schema with your domain's validation rules
// ---------------------------------------------------------------------------

const submissionSchema = z.object({
  category:    z.string().min(1, 'Select a category'),
  priority:    z.enum(['low', 'medium', 'high', 'critical'], {
    error: 'Select a priority level', // Zod v4: use 'error' not 'required_error'
  }),
  title:       z.string().min(2, 'Enter a title'),
  location:    z.string().min(3, 'Enter a location or identifier'),
  description: z.string()
    .min(20, 'Description must be at least 20 characters')
    .max(2000, 'Max 2000 characters'),
  notifyPrimary:   z.boolean(),
  notifySecondary: z.boolean(),
});

type SubmissionFormValues = z.infer<typeof submissionSchema>;

interface FieldRenderProps {
  value: string | boolean;
  onChange: (v: unknown) => void;
  onBlur: () => void;
  name: string;
}

// ---------------------------------------------------------------------------
// TODO: Replace with your actual select options
// ---------------------------------------------------------------------------

const CATEGORY_OPTIONS = [
  { value: 'typeA', label: 'Category A' },
  { value: 'typeB', label: 'Category B' },
  { value: 'typeC', label: 'Category C' },
  { value: 'other', label: 'Other' },
];

const PRIORITY_OPTIONS = [
  { value: 'low',      label: 'Low — monitor only' },
  { value: 'medium',   label: 'Medium — review needed' },
  { value: 'high',     label: 'High — action required' },
  { value: 'critical', label: 'Critical — immediate response' },
];

// ---------------------------------------------------------------------------
// Topbar — TODO: replace with RoboTopbar or your app's real topbar
// ---------------------------------------------------------------------------

function FormTopbar() {
  return (
    <TemplateTopbar
      icon={<ClipboardList size={18} />}
      label="New Submission"
      badge={<RoboBadge usage='label' color='warning' style={{ marginLeft: 4 }}>Draft</RoboBadge>}
    />
  );
}

// ---------------------------------------------------------------------------
// Success state — TODO: replace copy with your confirmation message
// ---------------------------------------------------------------------------

function SubmitSuccess({ onReset }: { onReset: () => void }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        padding: '60px 24px',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: 'var(--success, #22c55e)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CheckCircle size={24} color="white" />
      </div>
      <div>
        {/* TODO: Replace with your confirmation copy */}
        <p style={{ margin: '0 0 6px', fontWeight: 700, fontSize: 18 }}>Submission Received</p>
        <p style={{ margin: 0, fontSize: 13, opacity: 0.6, maxWidth: 360 }}>
          Your submission has been logged. The appropriate parties have been notified.
        </p>
      </div>
      <RoboButton variant='secondary' onClick={onReset}>Submit Another</RoboButton>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Template component
// ---------------------------------------------------------------------------

export function FormValidationTemplate() {
  const [submitted, setSubmitted] = React.useState(false);

  const form = useForm<SubmissionFormValues>({
    resolver: zodResolver(submissionSchema),
    defaultValues: {
      category:        '',
      priority:        undefined,
      title:           '',
      location:        '',
      description:     '',
      notifyPrimary:   true,
      notifySecondary: false,
    },
  });

  // TODO: Replace console.log with your form submission (e.g. tRPC mutation)
  function onSubmit(data: SubmissionFormValues) {
    console.log('[FormValidationTemplate] Submitted:', data);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <RoboPageShell topbar={<FormTopbar />}>
        <SubmitSuccess onReset={() => { setSubmitted(false); form.reset(); }} />
      </RoboPageShell>
    );
  }

  return (
    <RoboPageShell topbar={<FormTopbar />}>
      <div style={{ padding: '20px 24px', maxWidth: 900 }}>
        <RoboForm form={form} onSubmit={onSubmit}>
          <RoboCard id='form-validation-fields'>
            <RoboCardHeader>
              <div>
                {/* TODO: Replace with your section heading and helper text */}
                <p style={{ margin: '0 0 2px', fontWeight: 700, fontSize: 15 }}>Details</p>
                <p style={{ margin: 0, fontSize: 12, opacity: 0.55 }}>
                  Complete all required fields. Submissions are logged immediately on submit.
                </p>
              </div>
            </RoboCardHeader>

            <RoboCardBody>
              {/* 2-column grid — TODO: add/remove fields as needed */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 24px' }}>

                {/* Row 1 — TODO: replace field names, labels, options */}
                <RoboFormField control={form.control} name="category" label="Category">
                  {({ field, error }: { field: FieldRenderProps; error?: string }) => (
                    <RoboSelect
                      {...field}
                      value={field.value as string}
                      onValueChange={field.onChange as (v: string) => void}
                      options={CATEGORY_OPTIONS}
                      placeholder="Select category…"
                      error={error}
                    />
                  )}
                </RoboFormField>

                <RoboFormField control={form.control} name="priority" label="Priority">
                  {({ field, error }: { field: FieldRenderProps; error?: string }) => (
                    <RoboSelect
                      {...field}
                      value={field.value as string}
                      onValueChange={field.onChange as (v: string) => void}
                      options={PRIORITY_OPTIONS}
                      placeholder="Select priority…"
                      error={error}
                    />
                  )}
                </RoboFormField>

                {/* Row 2 */}
                <RoboFormField control={form.control} name="title" label="Title">
                  {({ field, error }: { field: FieldRenderProps; error?: string }) => (
                    <RoboInput
                      {...field}
                      value={field.value as string}
                      placeholder="Brief title…"
                      state={error ? 'error' : undefined}
                      helperText={error}
                    />
                  )}
                </RoboFormField>

                <RoboFormField
                  control={form.control}
                  name="location"
                  label="Location"
                  helperText="Region, site, or identifier"
                >
                  {({ field, error }: { field: FieldRenderProps; error?: string }) => (
                    <RoboInput
                      {...field}
                      value={field.value as string}
                      placeholder="e.g. Building 3, Region North"
                      state={error ? 'error' : undefined}
                    />
                  )}
                </RoboFormField>

                {/* Priority radio (full width) — TODO: keep or remove; mirror RoboSelect above */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <RoboFormField
                    control={form.control}
                    name="priority"
                    label="Priority Level"
                  >
                    {({ field, error }: { field: FieldRenderProps; error?: string }) => (
                      <RoboRadioGroup
                        {...field}
                        value={field.value as string}
                        onValueChange={field.onChange as (v: string) => void}
                        options={[
                          { value: 'low',      label: 'Low' },
                          { value: 'medium',   label: 'Medium' },
                          { value: 'high',     label: 'High' },
                          { value: 'critical', label: 'Critical' },
                        ]}
                        orientation="horizontal"
                        error={error}
                      />
                    )}
                  </RoboFormField>
                </div>

                {/* Description (full width) */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <RoboFormField
                    control={form.control}
                    name="description"
                    label="Description"
                    helperText={`${form.watch('description')?.length ?? 0} / 2000 characters`}
                  >
                    {({ field, error }: { field: FieldRenderProps; error?: string }) => (
                      <RoboTextarea
                        {...field}
                        value={field.value as string}
                        rows={5}
                        placeholder="Describe in detail…"  // TODO
                        error={error}
                      />
                    )}
                  </RoboFormField>
                </div>

              </div>

              <RoboSeparator style={{ margin: '20px 0 16px' }} />

              {/* Notification toggles — TODO: replace labels with your notification targets */}
              <p style={{ margin: '0 0 12px', fontSize: 12, fontWeight: 700, opacity: 0.45, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                Notifications
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <RoboFormField control={form.control} name="notifyPrimary">
                  {({ field }: { field: FieldRenderProps }) => (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <RoboSwitch checked={field.value as boolean} onCheckedChange={field.onChange as (v: boolean) => void} id="notifyPrimary" />
                      {/* TODO: Replace with your primary notification recipient */}
                      <label htmlFor="notifyPrimary" style={{ fontSize: 13, cursor: 'pointer' }}>Notify primary contact</label>
                    </div>
                  )}
                </RoboFormField>
                <RoboFormField control={form.control} name="notifySecondary">
                  {({ field }: { field: FieldRenderProps }) => (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <RoboSwitch checked={field.value as boolean} onCheckedChange={field.onChange as (v: boolean) => void} id="notifySecondary" />
                      {/* TODO: Replace with your secondary notification recipient */}
                      <label htmlFor="notifySecondary" style={{ fontSize: 13, cursor: 'pointer' }}>Notify secondary contact</label>
                    </div>
                  )}
                </RoboFormField>
              </div>
            </RoboCardBody>
          </RoboCard>

          {/* Footer actions */}
          <div id='form-validation-actions' style={{ display: 'flex', gap: 12, marginTop: 20, justifyContent: 'flex-end' }}>
            <RoboButton type="button" variant="ghost" onClick={() => form.reset()}>
              Reset
            </RoboButton>
            <RoboButton type="submit" variant="default">
              Submit {/* TODO */}
            </RoboButton>
          </div>
        </RoboForm>
      </div>
    </RoboPageShell>
  );
}
