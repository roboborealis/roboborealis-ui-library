'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// InlineEditCell — editable cell wrapper (double-click or Enter to edit)
// ---------------------------------------------------------------------------

export interface InlineEditCellProps {
  /** Current display value (rendered when not editing). */
  children: React.ReactNode;
  /** Whether this cell is currently in edit mode. */
  isEditing: boolean;
  /** Current value for the edit input. */
  value: unknown;
  /** Start editing this cell. */
  onStartEdit: () => void;
  /** Commit the current edit value. */
  onCommit: (value: unknown) => void;
  /** Cancel editing. */
  onCancel: () => void;
  /** Custom edit component from column meta. */
  editComponent?: React.ComponentType<{
    value: unknown;
    onCommit: (value: unknown) => void;
    onCancel: () => void;
  }>;
}

/**
 * InlineEditCell wraps a table cell's content with edit-on-double-click behavior.
 *
 * When `isEditing` is true, renders either a custom `editComponent` or a default
 * text input. Pressing Enter commits; Escape cancels.
 */
export function InlineEditCell({
  children,
  isEditing,
  value,
  onStartEdit,
  onCommit,
  onCancel,
  editComponent: EditComponent,
}: InlineEditCellProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const cancelledRef = React.useRef(false);
  const [editValue, setEditValue] = React.useState(String(value ?? ''));

  // Focus input when entering edit mode
  React.useEffect(() => {
    if (isEditing && inputRef.current) {
      cancelledRef.current = false;
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  // Reset edit value when entering edit mode
  React.useEffect(() => {
    if (isEditing) {
      setEditValue(String(value ?? ''));
    }
  }, [isEditing, value]);

  if (isEditing) {
    if (EditComponent) {
      return <EditComponent value={value} onCommit={onCommit} onCancel={onCancel} />;
    }

    return (
      <input
        ref={inputRef}
        type="text"
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            onCommit(editValue);
          }
          if (e.key === 'Escape') {
            e.preventDefault();
            cancelledRef.current = true;
            onCancel();
          }
        }}
        onBlur={() => {
          if (!cancelledRef.current) {
            onCommit(editValue);
          }
          cancelledRef.current = false;
        }}
        aria-label="Edit cell value"
        className={cn(
          'w-full rounded border border-[var(--ring)] bg-[var(--background)]',
          'px-2 py-1 text-sm outline-none',
          'focus:ring-2 focus:ring-[var(--ring)]',
        )}
      />
    );
  }

  return (
    <span
      onDoubleClick={onStartEdit}
      className="cursor-default"
      title="Double-click to edit"
    >
      {children}
    </span>
  );
}
