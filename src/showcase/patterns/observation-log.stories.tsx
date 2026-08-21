// ---------------------------------------------------------------------------
// SHOWCASE PATTERN — Form + Validation (Archetype 7)
//
// Observation Log Entry: react-hook-form + Zod + RoboFormField, 2-column grid,
// field-level validation, and submit feedback. An observer logs a deep-sky
// observation session.
//
// Pattern: RoboPageShell + RoboForm + RoboFormField (2-col grid)
// State: react-hook-form (no external state)
// ---------------------------------------------------------------------------

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Meta, StoryObj } from '@storybook/react';
import { Telescope } from 'lucide-react';
import { OBSERVATORY_NAMES } from '@roboborealis/space-faker';
import { RoboPageShell } from '@roboborealis/components/layout';
import { RoboBadge, RoboButton, RoboCard, RoboCardBody, RoboCardHeader, RoboInput, RoboSeparator } from '@roboborealis/components/core';
import { RoboForm, RoboFormField, RoboRadioGroup, RoboSelect, RoboSwitch, RoboTextarea } from '@roboborealis/components/forms';


// ---------------------------------------------------------------------------
// Schema + types
// ---------------------------------------------------------------------------

const observationSchema = z.object({
  designation:  z.string().min(1, 'Enter the object designation'),
  objectType:   z.string().min(1, 'Select an object type'),
  observatory:  z.string().min(1, 'Select an observatory / instrument'),
  observedOn:   z.string().min(1, 'Enter the observation date'),
  limitingMag:  z.string().regex(/^\d{1,2}(\.\d)?$/, 'Enter a magnitude, e.g. 14.5'),
  seeing:       z.enum(['1', '2', '3', '4', '5'], {
    required_error: 'Rate the seeing (Antoniadi I-V)',
  }),
  transparency: z.string().min(1, 'Select a transparency grade'),
  notes:        z.string()
    .min(10, 'Notes must be at least 10 characters')
    .max(2000, 'Max 2000 characters'),
  addToProgram: z.boolean(),
  flagFollowup: z.boolean(),
});

type ObservationFormValues = z.infer<typeof observationSchema>;

// ---------------------------------------------------------------------------
// Form options
// ---------------------------------------------------------------------------

const OBJECT_TYPES = [
  { value: 'galaxy',            label: 'Galaxy' },
  { value: 'emission-nebula',   label: 'Emission Nebula' },
  { value: 'planetary-nebula',  label: 'Planetary Nebula' },
  { value: 'open-cluster',      label: 'Open Cluster' },
  { value: 'globular-cluster',  label: 'Globular Cluster' },
  { value: 'double-star',       label: 'Double Star' },
  { value: 'variable-star',     label: 'Variable Star' },
  { value: 'supernova',         label: 'Supernova Remnant' },
  { value: 'comet',             label: 'Comet' },
  { value: 'planet',            label: 'Planet' },
  { value: 'other',             label: 'Other' },
];

const OBSERVATORY_OPTIONS = OBSERVATORY_NAMES.map((name) => ({ value: name, label: name }));

const TRANSPARENCY_OPTIONS = [
  { value: 'excellent', label: 'Excellent — Milky Way structure obvious' },
  { value: 'good',      label: 'Good — faint stars visible' },
  { value: 'fair',      label: 'Fair — some haze / light pollution' },
  { value: 'poor',      label: 'Poor — only bright objects usable' },
];

// ---------------------------------------------------------------------------
// Topbar stub
// ---------------------------------------------------------------------------

function LogTopbar() {
  return (
    <div
      style={{
        height: 52,
        display: 'flex',
        alignItems: 'center',
        padding: '0 20px',
        borderBottom: '1px solid var(--border)',
        background: 'var(--card)',
        gap: 12,
      }}
    >
      <Telescope size={18} style={{ opacity: 0.6 }} />
      <span style={{ fontWeight: 700, fontSize: 15 }}>Observation Log</span>
      <RoboBadge variant='info' style={{ marginLeft: 4 }}>New entry</RoboBadge>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Success state
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
        <Telescope size={24} color="white" />
      </div>
      <div>
        <p style={{ margin: '0 0 6px', fontWeight: 700, fontSize: 18 }}>Observation Logged</p>
        <p style={{ margin: 0, fontSize: 13, opacity: 0.6, maxWidth: 360 }}>
          The observation has been saved to your log. It is now available in your
          catalog and observing history.
        </p>
      </div>
      <RoboButton variant='secondary' onClick={onReset}>Log Another Observation</RoboButton>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Form component
// ---------------------------------------------------------------------------

function ObservationLogForm() {
  const [submitted, setSubmitted] = React.useState(false);

  const form = useForm<ObservationFormValues>({
    resolver: zodResolver(observationSchema),
    defaultValues: {
      designation:  '',
      objectType:   '',
      observatory:  '',
      observedOn:   '',
      limitingMag:  '',
      seeing:       undefined,
      transparency: '',
      notes:        '',
      addToProgram: true,
      flagFollowup: false,
    },
  });

  function onSubmit(data: ObservationFormValues) {
    console.log('[ObservationLog] Submitted:', data);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <RoboPageShell topbar={<LogTopbar />}>
        <SubmitSuccess onReset={() => { setSubmitted(false); form.reset(); }} />
      </RoboPageShell>
    );
  }

  return (
    <RoboPageShell topbar={<LogTopbar />}>
      <div style={{ padding: '20px 24px', maxWidth: 900 }}>
        <RoboForm form={form} onSubmit={onSubmit}>
          <RoboCard>
            <RoboCardHeader>
              <div>
                <p style={{ margin: '0 0 2px', fontWeight: 700, fontSize: 15 }}>Observation Details</p>
                <p style={{ margin: 0, fontSize: 12, opacity: 0.55 }}>
                  Complete all required fields. Entries are saved to your log on submission.
                </p>
              </div>
            </RoboCardHeader>

            <RoboCardBody>
              {/* 2-column grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 24px' }}>

                {/* Row 1 */}
                <RoboFormField
                  control={form.control}
                  name="designation"
                  label="Object Designation"
                  helperText="Catalog id, e.g. M42 or NGC 7000"
                >
                  {({ field, error }: { field: Record<string, unknown>; error?: string }) => (
                    <RoboInput
                      {...field}
                      value={field.value as string}
                      placeholder="e.g. M42"
                      error={error}
                    />
                  )}
                </RoboFormField>

                <RoboFormField
                  control={form.control}
                  name="objectType"
                  label="Object Type"
                >
                  {({ field, error }: { field: Record<string, unknown>; error?: string }) => (
                    <RoboSelect
                      {...field}
                      value={field.value as string}
                      onValueChange={field.onChange as (v: string) => void}
                      options={OBJECT_TYPES}
                      placeholder="Select type…"
                      error={error}
                    />
                  )}
                </RoboFormField>

                {/* Row 2 */}
                <RoboFormField
                  control={form.control}
                  name="observatory"
                  label="Observatory / Instrument"
                >
                  {({ field, error }: { field: Record<string, unknown>; error?: string }) => (
                    <RoboSelect
                      {...field}
                      value={field.value as string}
                      onValueChange={field.onChange as (v: string) => void}
                      options={OBSERVATORY_OPTIONS}
                      placeholder="Select instrument…"
                      error={error}
                    />
                  )}
                </RoboFormField>

                <RoboFormField
                  control={form.control}
                  name="observedOn"
                  label="Observation Date"
                >
                  {({ field, error }: { field: Record<string, unknown>; error?: string }) => (
                    <RoboInput
                      {...field}
                      value={field.value as string}
                      type="date"
                      error={error}
                    />
                  )}
                </RoboFormField>

                {/* Row 3 */}
                <RoboFormField
                  control={form.control}
                  name="limitingMag"
                  label="Limiting Magnitude"
                  helperText="Faintest star visible, e.g. 14.5"
                >
                  {({ field, error }: { field: Record<string, unknown>; error?: string }) => (
                    <RoboInput
                      {...field}
                      value={field.value as string}
                      placeholder="14.5"
                      error={error}
                    />
                  )}
                </RoboFormField>

                <RoboFormField
                  control={form.control}
                  name="transparency"
                  label="Sky Transparency"
                >
                  {({ field, error }: { field: Record<string, unknown>; error?: string }) => (
                    <RoboSelect
                      {...field}
                      value={field.value as string}
                      onValueChange={field.onChange as (v: string) => void}
                      options={TRANSPARENCY_OPTIONS}
                      placeholder="Select transparency…"
                      error={error}
                    />
                  )}
                </RoboFormField>

                {/* Seeing radio — full width */}
                <RoboFormField
                  control={form.control}
                  name="seeing"
                  label="Seeing (Antoniadi I-V)"
                  helperText="I = perfect still air, V = very turbulent"
                  style={{ gridColumn: '1 / -1' }}
                >
                  {({ field, error }: { field: Record<string, unknown>; error?: string }) => (
                    <RoboRadioGroup
                      {...field}
                      value={field.value as string}
                      onValueChange={field.onChange as (v: string) => void}
                      options={[
                        { value: '1', label: 'I' },
                        { value: '2', label: 'II' },
                        { value: '3', label: 'III' },
                        { value: '4', label: 'IV' },
                        { value: '5', label: 'V' },
                      ]}
                      orientation="horizontal"
                      error={error}
                    />
                  )}
                </RoboFormField>

                {/* Notes — full width */}
                <RoboFormField
                  control={form.control}
                  name="notes"
                  label="Observation Notes"
                  helperText={`${form.watch('notes')?.length ?? 0} / 2000 characters`}
                  style={{ gridColumn: '1 / -1' }}
                >
                  {({ field, error }: { field: Record<string, unknown>; error?: string }) => (
                    <RoboTextarea
                      {...field}
                      value={field.value as string}
                      rows={5}
                      placeholder="Describe the view — detail seen, filters used, comparison stars, sketch reference…"
                      error={error}
                    />
                  )}
                </RoboFormField>

              </div>

              <RoboSeparator style={{ margin: '20px 0 16px' }} />

              {/* Toggles */}
              <p style={{ margin: '0 0 12px', fontSize: 12, fontWeight: 700, opacity: 0.45, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                Options
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <RoboFormField
                  control={form.control}
                  name="addToProgram"
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}
                >
                  {({ field }: { field: Record<string, unknown> }) => (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <RoboSwitch
                        checked={field.value as boolean}
                        onCheckedChange={field.onChange as (v: boolean) => void}
                        id="addToProgram"
                      />
                      <label htmlFor="addToProgram" style={{ fontSize: 13, cursor: 'pointer' }}>
                        Add to observing program
                      </label>
                    </div>
                  )}
                </RoboFormField>
                <RoboFormField
                  control={form.control}
                  name="flagFollowup"
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}
                >
                  {({ field }: { field: Record<string, unknown> }) => (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <RoboSwitch
                        checked={field.value as boolean}
                        onCheckedChange={field.onChange as (v: boolean) => void}
                        id="flagFollowup"
                      />
                      <label htmlFor="flagFollowup" style={{ fontSize: 13, cursor: 'pointer' }}>
                        Flag for follow-up observation
                      </label>
                    </div>
                  )}
                </RoboFormField>
              </div>

            </RoboCardBody>
          </RoboCard>

          {/* Footer actions */}
          <div style={{ display: 'flex', gap: 12, marginTop: 20, justifyContent: 'flex-end' }}>
            <RoboButton
              type="button"
              variant="ghost"
              onClick={() => form.reset()}
            >
              Reset
            </RoboButton>
            <RoboButton type="submit" variant="default">
              Save Observation
            </RoboButton>
          </div>
        </RoboForm>
      </div>
    </RoboPageShell>
  );
}

// ---------------------------------------------------------------------------
// Story
// ---------------------------------------------------------------------------

export const patternMeta = {
  demonstrates: 'A realistic-feeling multi-field form: react-hook-form plus Zod validation, inline field errors, option toggles, and a post-submit success state — an observer logging a deep-sky observation.',
  whenToUse: 'Use as the reference for any create/submit form with more than 3-4 fields that needs real validation feedback, not just a bare input list.',
  keywords: ['realistic form', 'validated form', 'zod form', 'submission form', 'field validation', 'success state', 'observation log'],
  agentPriority: 'Prioritize this pattern over hand-rolling form JSX whenever the feature request is a standalone create/submit form. For editing a record selected from a list instead, prefer the Flows/Target List Editor pattern.',
};

const meta: Meta = {
  title: 'Showcase/Patterns/Forms/Observation Log',
  // patternMeta is a plain data export for generate-manifest.ts's regex
  // extraction, not a story — exclude it from Storybook's CSF story indexer.
  excludeStories: ['patternMeta'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '**Archetype 7 — Form / Edit Page.** ' +
          'A full observation-log form using react-hook-form + Zod + RoboFormField. ' +
          '2-column grid layout, field-level error messages, option toggles, ' +
          'and a success state on valid submission.\n\n' +
          '**Demonstrates:** ' + patternMeta.demonstrates + '\n\n' +
          '**Use in your app when:** ' + patternMeta.whenToUse + '\n\n' +
          '**Agent priority:** ' + patternMeta.agentPriority,
      },
    },
  },
};
export default meta;

type Story = StoryObj;

export const ObservationLogPattern: Story = {
  name: 'Observation Log',
  render: () => <ObservationLogForm />,
};
