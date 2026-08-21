// ---------------------------------------------------------------------------
// SHOWCASE PATTERN — Flows: Table → Form Connected Mini-App
//
// A small, connected flow rather than an isolated component demo: browse a
// night's target list in a data table, click a row to edit it in a real
// validated form, save back to the table. Meant to let a developer "feel" how
// a table-driven detail edit flow behaves end to end before building one.
//
// Pattern: RoboDataTable (row click selects) + RoboForm/RoboFormField (Zod) that
// writes the edited target back into the table's local state on submit.
// No server required — catalog data from @roboborealis/space-faker.
//
// patternMeta below documents when to reach for this pattern vs. building from
// scratch — see scripts/generate-manifest.ts's ReferencePattern extraction.
// ---------------------------------------------------------------------------

import * as React from 'react';
import { useMemo, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { createColumnHelper } from '@tanstack/react-table';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Sparkles, X } from 'lucide-react';
import { makeCatalog } from '@roboborealis/space-faker';
import { RoboDataTable, createStatusCell } from '@roboborealis/components/tables';
import { RoboPageShell } from '@roboborealis/components/layout';
import { RoboCard, RoboCardBody, RoboCardHeader, RoboButton, RoboBadge, RoboInput } from '@roboborealis/components/core';
import { RoboForm, RoboFormField, RoboSelect } from '@roboborealis/components/forms';

// ---------------------------------------------------------------------------
// componentMeta / patternMeta — agent-consumable guidance
// ---------------------------------------------------------------------------

export const patternMeta = {
  demonstrates: 'A connected table-to-form mini-flow: select a row, edit it in a validated form, save the change back to the table — not just an isolated table or form demo.',
  whenToUse: 'Use as the reference when a feature needs a click-a-row-edit-it-see-the-table-update flow — e.g. target-list management, roster editing, inline record correction. Not for read-only browsing (use List + Search or Filter + Table + Detail instead) or multi-step wizards.',
  keywords: ['edit in place', 'table to form', 'connected flow', 'select and edit', 'save back to table', 'mini app', 'target list editor'],
  agentPriority: 'Prioritize this pattern over composing RoboDataTable + RoboForm from scratch whenever the feature request describes editing a record selected from a list, rather than a standalone create form (use Form + Validation archetype for that) or a read-only detail pane (use Filter + Table + Detail archetype for that).',
};

// ---------------------------------------------------------------------------
// Types & mock data — @roboborealis/space-faker, seeded for stable snapshots
// ---------------------------------------------------------------------------

type TargetStatus = 'planned' | 'observed' | 'skipped';
type TargetPriority = 'low' | 'medium' | 'high';

interface TargetItem {
  id: string;
  designation: string;
  commonName: string;
  type: string;
  status: TargetStatus;
  priority: TargetPriority;
  minAltitude: number;
}

const INITIAL_TARGETS: TargetItem[] = makeCatalog(8, 42).map((o, i) => ({
  id: o.id,
  designation: o.designation,
  commonName: o.commonName,
  type: o.type,
  status: (['planned', 'observed', 'skipped'] as const)[i % 3],
  priority: (['high', 'medium', 'low'] as const)[i % 3],
  minAltitude: 20 + (i * 7) % 55,
}));

const STATUS_OPTIONS = [
  { value: 'planned',  label: 'Planned' },
  { value: 'observed', label: 'Observed' },
  { value: 'skipped',  label: 'Skipped' },
];

const PRIORITY_OPTIONS = [
  { value: 'high',   label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low',    label: 'Low' },
];

const STATUS_COLOR_MAP: Record<TargetStatus, 'primary' | 'success' | 'muted'> = {
  planned:  'primary',
  observed: 'success',
  skipped:  'muted',
};

const editSchema = z.object({
  commonName:  z.string().min(2, 'Enter a target name'),
  status:      z.enum(['planned', 'observed', 'skipped']),
  priority:    z.enum(['low', 'medium', 'high']),
  minAltitude: z.coerce.number().min(0, 'Altitude cannot be negative').max(90, 'Altitude must be 90° or less'),
});

type EditFormValues = z.infer<typeof editSchema>;

interface FieldRenderProps {
  value: string | number;
  onChange: (v: unknown) => void;
  onBlur: () => void;
  name: string;
}

// ---------------------------------------------------------------------------
// Columns
// ---------------------------------------------------------------------------

const col = createColumnHelper<TargetItem>();

const columns = [
  col.accessor('commonName', {
    header: 'Target',
    size: 220,
    cell: (info) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Sparkles size={14} style={{ opacity: 0.4, flexShrink: 0 }} />
        <span style={{ fontWeight: 500 }}>{info.getValue()}</span>
      </div>
    ),
  }),
  col.accessor('designation', {
    header: 'Designation',
    size: 120,
    cell: (info) => (
      <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.8125rem' }}>{info.getValue()}</span>
    ),
  }),
  col.accessor('status', {
    header: 'Status',
    size: 120,
    cell: createStatusCell({ colorMap: STATUS_COLOR_MAP }),
  }),
  col.accessor('priority', {
    header: 'Priority',
    size: 100,
    cell: (info) => <span style={{ textTransform: 'capitalize', fontSize: '0.8125rem' }}>{info.getValue()}</span>,
  }),
  col.accessor('minAltitude', {
    header: 'Min Alt',
    size: 90,
    cell: (info) => `${info.getValue()}°`,
  }),
];

// ---------------------------------------------------------------------------
// Edit panel — form + validation, writes back into the target list on submit
// ---------------------------------------------------------------------------

function TargetEditPanel({
  target,
  onSave,
  onCancel,
}: {
  target: TargetItem;
  onSave: (updated: TargetItem) => void;
  onCancel: () => void;
}) {
  const form = useForm<EditFormValues>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      commonName: target.commonName,
      status: target.status,
      priority: target.priority,
      minAltitude: target.minAltitude,
    },
  });

  function onSubmit(data: EditFormValues) {
    onSave({ ...target, ...data });
  }

  return (
    <RoboCard>
      <RoboCardHeader>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={{ margin: 0, fontWeight: 700, fontSize: 14 }}>Edit Target</p>
          <RoboButton variant='ghost' size='sm' onClick={onCancel} aria-label='Close editor'>
            <X size={16} />
          </RoboButton>
        </div>
      </RoboCardHeader>
      <RoboCardBody>
        <RoboForm form={form} onSubmit={onSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <RoboFormField control={form.control} name="commonName" label="Name">
              {({ field, error }: { field: FieldRenderProps; error?: string }) => (
                <RoboInput
                  {...field}
                  value={field.value as string}
                  state={error ? 'error' : undefined}
                  helperText={error}
                />
              )}
            </RoboFormField>
            <RoboFormField control={form.control} name="status" label="Status">
              {({ field }: { field: FieldRenderProps }) => (
                <RoboSelect
                  {...field}
                  value={field.value as string}
                  onValueChange={field.onChange as (v: string) => void}
                  options={STATUS_OPTIONS}
                />
              )}
            </RoboFormField>
            <RoboFormField control={form.control} name="priority" label="Priority">
              {({ field }: { field: FieldRenderProps }) => (
                <RoboSelect
                  {...field}
                  value={field.value as string}
                  onValueChange={field.onChange as (v: string) => void}
                  options={PRIORITY_OPTIONS}
                />
              )}
            </RoboFormField>
            <RoboFormField control={form.control} name="minAltitude" label="Min Altitude (°)">
              {({ field, error }: { field: FieldRenderProps; error?: string }) => (
                <RoboInput
                  {...field}
                  type="number"
                  value={field.value as string}
                  state={error ? 'error' : undefined}
                  helperText={error}
                />
              )}
            </RoboFormField>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 4 }}>
              <RoboButton type="button" variant="ghost" onClick={onCancel}>Cancel</RoboButton>
              <RoboButton type="submit">Save</RoboButton>
            </div>
          </div>
        </RoboForm>
      </RoboCardBody>
    </RoboCard>
  );
}

// ---------------------------------------------------------------------------
// Pattern component
// ---------------------------------------------------------------------------

function TargetListEditor() {
  const [targets, setTargets]       = useState<TargetItem[]>(INITIAL_TARGETS);
  const [editingId, setEditingId]   = useState<string | null>(null);
  const [lastSavedId, setLastSaved] = useState<string | null>(null);

  const editing = useMemo(() => targets.find((t) => t.id === editingId) ?? null, [targets, editingId]);

  function handleSave(updated: TargetItem) {
    setTargets((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    setLastSaved(updated.id);
    setEditingId(null);
  }

  return (
    <RoboPageShell>
      <div style={{ display: 'flex', height: '100%', minHeight: 480 }}>
        <div style={{ flex: 1, minWidth: 0, padding: 16, overflow: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <p style={{ margin: 0, fontWeight: 700, fontSize: 14 }}>Tonight's Target List</p>
            <RoboBadge usage='status' size='sm'>{targets.length} targets</RoboBadge>
            {lastSavedId && (
              <RoboBadge usage='label' color='success' size='sm'>
                Saved {targets.find((t) => t.id === lastSavedId)?.commonName}
              </RoboBadge>
            )}
          </div>
          <RoboDataTable
            data={targets}
            columns={columns}
            getRowId={(row) => row.id}
            enableSorting
            enablePagination
            enableRowSelection
            enableMultiRowSelection={false}
            rowSelection={editingId ? { [editingId]: true } : {}}
            onRowSelectionChange={(sel) => {
              const currentSelection = editingId ? { [editingId]: true } : {};
              const selectionState = typeof sel === 'function' ? sel(currentSelection) : sel;
              const id = Object.keys(selectionState).find((k) => selectionState[k]);
              setEditingId(id ?? null);
            }}
            pageSize={8}
            aria-label="Target list — click a row to edit"
          />
        </div>

        {editing && (
          <aside style={{ width: 300, flexShrink: 0, borderLeft: '1px solid var(--border)', padding: 16, overflowY: 'auto' }}>
            <TargetEditPanel
              target={editing}
              onSave={handleSave}
              onCancel={() => setEditingId(null)}
            />
          </aside>
        )}
      </div>
    </RoboPageShell>
  );
}

// ---------------------------------------------------------------------------
// Story
// ---------------------------------------------------------------------------

const meta: Meta = {
  title: 'Showcase/Patterns/Flows/Target List Editor',
  // patternMeta is a plain data export for generate-manifest.ts's regex
  // extraction, not a story — exclude it from Storybook's CSF story indexer.
  excludeStories: ['patternMeta'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '**Demonstrates:** ' + patternMeta.demonstrates + ' \n\n' +
          '**Use in your app when:** ' + patternMeta.whenToUse + ' \n\n' +
          '**Agent priority:** ' + patternMeta.agentPriority,
      },
    },
  },
};
export default meta;

type Story = StoryObj;

export const TargetListEditorPattern: Story = {
  name: 'Target List Editor',
  render: () => <TargetListEditor />,
};
