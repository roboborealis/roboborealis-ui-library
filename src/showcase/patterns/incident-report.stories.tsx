// ---------------------------------------------------------------------------
// SHOWCASE PATTERN — Form + Validation (Archetype 7)
//
// Incident Report Form: react-hook-form + Zod + RoboFormField, 2-column grid,
// field-level validation, and submit feedback.
//
// Pattern: RoboPageShell + RoboForm + RoboFormField (2-col grid)
// State: react-hook-form (no external state)
// ---------------------------------------------------------------------------

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Meta, StoryObj } from '@storybook/react';
import { FileWarning } from 'lucide-react';
import { RoboPageShell } from '@roboborealis/components/layout';
import { RoboBadge, RoboButton, RoboCard, RoboCardBody, RoboCardHeader, RoboInput, RoboSeparator } from '@roboborealis/components/core';
import { RoboForm, RoboFormField, RoboRadioGroup, RoboSelect, RoboSwitch, RoboTextarea } from '@roboborealis/components/forms';


// ---------------------------------------------------------------------------
// Schema + types
// ---------------------------------------------------------------------------

const incidentSchema = z.object({
  incidentType:  z.string().min(1, 'Select an incident type'),
  satelliteMmsi:    z.string()
    .regex(/^\d{9}$/, 'NORAD ID must be exactly 9 digits'),
  satelliteName:    z.string().min(2, 'Enter the satellite name'),
  location:      z.string().min(3, 'Enter a location (port, coordinates, or region)'),
  severity:      z.enum(['low', 'medium', 'high', 'critical'], {
    required_error: 'Select a severity level',
  }),
  description:   z.string()
    .min(20, 'Description must be at least 20 characters')
    .max(2000, 'Max 2000 characters'),
  notifyCoast:   z.boolean(),
  notifyOwner:   z.boolean(),
});

type IncidentFormValues = z.infer<typeof incidentSchema>;

// ---------------------------------------------------------------------------
// Form options
// ---------------------------------------------------------------------------

const INCIDENT_TYPES = [
  { value: 'anomaly',       label: 'Satellite in Anomaly' },
  { value: 'deorbit',       label: 'Deorbit / Reentry' },
  { value: 'conjunction',   label: 'Conjunction Warning' },
  { value: 'signal-loss',   label: 'Loss of Signal' },
  { value: 'debris',        label: 'Debris Event' },
  { value: 'propulsion',    label: 'Propulsion Failure' },
  { value: 'payload',       label: 'Payload / Stability Issue' },
  { value: 'medical',       label: 'Crew Medical Emergency' },
  { value: 'security',      label: 'Security / Interference' },
  { value: 'other',         label: 'Other' },
];

const SEVERITY_OPTIONS = [
  { value: 'low',      label: 'Low — Monitor; no immediate action' },
  { value: 'medium',   label: 'Medium — Heightened watch' },
  { value: 'high',     label: 'High — Immediate response likely' },
  { value: 'critical', label: 'Critical — Anomaly response team activation' },
];

// ---------------------------------------------------------------------------
// Topbar stub
// ---------------------------------------------------------------------------

function ReportTopbar() {
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
      <FileWarning size={18} style={{ opacity: 0.6 }} />
      <span style={{ fontWeight: 700, fontSize: 15 }}>Incident Report</span>
      <RoboBadge variant='warning' style={{ marginLeft: 4 }}>New</RoboBadge>
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
        <FileWarning size={24} color="white" />
      </div>
      <div>
        <p style={{ margin: '0 0 6px', fontWeight: 700, fontSize: 18 }}>Report Submitted</p>
        <p style={{ margin: 0, fontSize: 13, opacity: 0.6, maxWidth: 360 }}>
          The incident report has been logged and the appropriate parties have been notified.
          A case number has been assigned.
        </p>
      </div>
      <RoboButton variant='secondary' onClick={onReset}>File Another Report</RoboButton>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Form component
// ---------------------------------------------------------------------------

function IncidentReportForm() {
  const [submitted, setSubmitted] = React.useState(false);

  const form = useForm<IncidentFormValues>({
    resolver: zodResolver(incidentSchema),
    defaultValues: {
      incidentType: '',
      satelliteMmsi:   '',
      satelliteName:   '',
      location:     '',
      severity:     undefined,
      description:  '',
      notifyCoast:  true,
      notifyOwner:  false,
    },
  });

  function onSubmit(data: IncidentFormValues) {
    console.log('[IncidentReport] Submitted:', data);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <RoboPageShell topbar={<ReportTopbar />}>
        <SubmitSuccess onReset={() => { setSubmitted(false); form.reset(); }} />
      </RoboPageShell>
    );
  }

  return (
    <RoboPageShell topbar={<ReportTopbar />}>
      <div style={{ padding: '20px 24px', maxWidth: 900 }}>
        <RoboForm form={form} onSubmit={onSubmit}>
          <RoboCard>
            <RoboCardHeader>
              <div>
                <p style={{ margin: '0 0 2px', fontWeight: 700, fontSize: 15 }}>Incident Details</p>
                <p style={{ margin: 0, fontSize: 12, opacity: 0.55 }}>
                  Complete all required fields. Reports are logged immediately on submission.
                </p>
              </div>
            </RoboCardHeader>

            <RoboCardBody>
              {/* 2-column grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 24px' }}>

                {/* Row 1 */}
                <RoboFormField
                  control={form.control}
                  name="incidentType"
                  label="Incident Type"
                >
                  {({ field, error }: { field: Record<string, unknown>; error?: string }) => (
                    <RoboSelect
                      {...field}
                      value={field.value as string}
                      onValueChange={field.onChange as (v: string) => void}
                      options={INCIDENT_TYPES}
                      placeholder="Select type…"
                      error={error}
                    />
                  )}
                </RoboFormField>

                <RoboFormField
                  control={form.control}
                  name="severity"
                  label="Severity"
                >
                  {({ field, error }: { field: Record<string, unknown>; error?: string }) => (
                    <RoboSelect
                      {...field}
                      value={field.value as string}
                      onValueChange={field.onChange as (v: string) => void}
                      options={SEVERITY_OPTIONS}
                      placeholder="Select severity…"
                      error={error}
                    />
                  )}
                </RoboFormField>

                {/* Row 2 */}
                <RoboFormField
                  control={form.control}
                  name="satelliteMmsi"
                  label="Satellite NORAD ID"
                  helperText="9-digit orbital identification number"
                >
                  {({ field, error }: { field: Record<string, unknown>; error?: string }) => (
                    <RoboInput
                      {...field}
                      value={field.value as string}
                      placeholder="123456789"
                      maxLength={9}
                      error={error}
                    />
                  )}
                </RoboFormField>

                <RoboFormField
                  control={form.control}
                  name="satelliteName"
                  label="Satellite Name"
                >
                  {({ field, error }: { field: Record<string, unknown>; error?: string }) => (
                    <RoboInput
                      {...field}
                      value={field.value as string}
                      placeholder="e.g. SENTINEL RELAY"
                      error={error}
                    />
                  )}
                </RoboFormField>

                {/* Row 3 */}
                <RoboFormField
                  control={form.control}
                  name="location"
                  label="Location"
                  helperText="Orbit, coordinates, or region"
                  style={{ gridColumn: '1 / -1' }}
                >
                  {({ field, error }: { field: Record<string, unknown>; error?: string }) => (
                    <RoboInput
                      {...field}
                      value={field.value as string}
                      placeholder="e.g. GEO 105.5°W — 35,786 km altitude"
                      error={error}
                    />
                  )}
                </RoboFormField>

                {/* Severity radio — full width */}
                <RoboFormField
                  control={form.control}
                  name="severity"
                  label="Severity Level"
                  style={{ gridColumn: '1 / -1' }}
                >
                  {({ field, error }: { field: Record<string, unknown>; error?: string }) => (
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

                {/* Description — full width */}
                <RoboFormField
                  control={form.control}
                  name="description"
                  label="Incident Description"
                  helperText={`${form.watch('description')?.length ?? 0} / 2000 characters`}
                  style={{ gridColumn: '1 / -1' }}
                >
                  {({ field, error }: { field: Record<string, unknown>; error?: string }) => (
                    <RoboTextarea
                      {...field}
                      value={field.value as string}
                      rows={5}
                      placeholder="Describe the incident in detail — circumstances, actions taken, current status…"
                      error={error}
                    />
                  )}
                </RoboFormField>

              </div>

              <RoboSeparator style={{ margin: '20px 0 16px' }} />

              {/* Notification toggles */}
              <p style={{ margin: '0 0 12px', fontSize: 12, fontWeight: 700, opacity: 0.45, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                Notifications
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <RoboFormField
                  control={form.control}
                  name="notifyCoast"
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}
                >
                  {({ field }: { field: Record<string, unknown> }) => (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <RoboSwitch
                        checked={field.value as boolean}
                        onCheckedChange={field.onChange as (v: boolean) => void}
                        id="notifyCoast"
                      />
                      <label htmlFor="notifyCoast" style={{ fontSize: 13, cursor: 'pointer' }}>
                        Notify mission control watch desk
                      </label>
                    </div>
                  )}
                </RoboFormField>
                <RoboFormField
                  control={form.control}
                  name="notifyOwner"
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}
                >
                  {({ field }: { field: Record<string, unknown> }) => (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <RoboSwitch
                        checked={field.value as boolean}
                        onCheckedChange={field.onChange as (v: boolean) => void}
                        id="notifyOwner"
                      />
                      <label htmlFor="notifyOwner" style={{ fontSize: 13, cursor: 'pointer' }}>
                        Notify satellite owner / operator
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
              Submit Report
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
  demonstrates: 'A realistic-feeling multi-field form: react-hook-form plus Zod validation, inline field errors, notification toggles, and a post-submit success state.',
  whenToUse: 'Use as the reference for any create/submit form with more than 3-4 fields that needs real validation feedback, not just a bare input list.',
  keywords: ['realistic form', 'validated form', 'zod form', 'submission form', 'field validation', 'success state'],
  agentPriority: 'Prioritize this pattern over hand-rolling form JSX whenever the feature request is a standalone create/submit form. For editing a record selected from a list instead, prefer the Flows/Constellation Editor pattern.',
};

const meta: Meta = {
  title: 'Showcase/Patterns/Forms/Incident Report',
  // patternMeta is a plain data export for generate-manifest.ts's regex
  // extraction, not a story — exclude it from Storybook's CSF story indexer.
  excludeStories: ['patternMeta'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '**Archetype 7 — Form / Edit Page.** ' +
          'A full incident report form using react-hook-form + Zod + RoboFormField. ' +
          '2-column grid layout, field-level error messages, notification toggles, ' +
          'and a success state on valid submission. ' +
          'Built using the `/design-ui-feature` skill.\n\n' +
          '**Demonstrates:** ' + patternMeta.demonstrates + '\n\n' +
          '**Use in your app when:** ' + patternMeta.whenToUse + '\n\n' +
          '**Agent priority:** ' + patternMeta.agentPriority,
      },
    },
  },
};
export default meta;

type Story = StoryObj;

export const IncidentReportPattern: Story = {
  name: 'Incident Report',
  render: () => <IncidentReportForm />,
};
