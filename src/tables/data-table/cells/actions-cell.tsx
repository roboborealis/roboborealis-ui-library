'use client';

import * as React from 'react';
import type { CellContext } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';

import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// ActionsCell — row-level action dropdown menu
// ---------------------------------------------------------------------------

export interface ActionItem<TData = unknown> {
  id: string;
  label: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'destructive';
  disabled?: boolean | ((row: TData) => boolean);
  onAction: (row: TData) => void;
}

export interface ActionsCellConfig<TData = unknown> {
  actions: ActionItem<TData>[];
  /** Accessible label for the trigger button. Default: 'Row actions'. */
  ariaLabel?: string;
}

/**
 * Creates a TanStack cell renderer with a dropdown action menu.
 *
 * Uses a native `<details>/<summary>` pattern for zero-dependency dropdowns.
 * For a Radix DropdownMenu, consumers can provide their own cell renderer.
 *
 * @example
 * ```tsx
 * columnHelper.display({
 *   id: 'actions',
 *   header: '',
 *   cell: createActionsCell({
 *     actions: [
 *       { id: 'edit', label: 'Edit', onAction: (row) => openEdit(row) },
 *       { id: 'delete', label: 'Delete', variant: 'destructive', onAction: (row) => confirmDelete(row) },
 *     ],
 *   }),
 * })
 * ```
 */
export function createActionsCell<TData>(
  config: ActionsCellConfig<TData>,
): (info: CellContext<TData, unknown>) => React.ReactNode {
  const { actions, ariaLabel = 'Row actions' } = config;

  return function ActionsCell(info: CellContext<TData, unknown>) {
    const row = info.row.original;
    const [open, setOpen] = React.useState(false);
    const menuRef = React.useRef<HTMLDivElement>(null);
    const buttonRef = React.useRef<HTMLButtonElement>(null);
    const itemRefs = React.useRef<(HTMLButtonElement | null)[]>([]);

    // Focus first menu item when menu opens (WAI-ARIA menu pattern)
    React.useEffect(() => {
      if (open) {
        // Allow the DOM to render before focusing
        requestAnimationFrame(() => {
          const firstEnabled = itemRefs.current.find((el) => el && !el.disabled);
          firstEnabled?.focus();
        });
      }
    }, [open]);

    // Close on click outside
    React.useEffect(() => {
      if (!open) return;
      function handleClickOutside(e: MouseEvent) {
        if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
          setOpen(false);
        }
      }
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [open]);

    // Menu keyboard navigation (WAI-ARIA §3.15)
    const handleMenuKeyDown = (e: React.KeyboardEvent) => {
      const enabledItems = itemRefs.current.filter((el): el is HTMLButtonElement => el !== null && !el.disabled);
      const currentIndex = enabledItems.indexOf(document.activeElement as HTMLButtonElement);

      switch (e.key) {
        case 'ArrowDown': {
          e.preventDefault();
          const next = currentIndex < enabledItems.length - 1 ? currentIndex + 1 : 0;
          enabledItems[next]?.focus();
          break;
        }
        case 'ArrowUp': {
          e.preventDefault();
          const prev = currentIndex > 0 ? currentIndex - 1 : enabledItems.length - 1;
          enabledItems[prev]?.focus();
          break;
        }
        case 'Home': {
          e.preventDefault();
          enabledItems[0]?.focus();
          break;
        }
        case 'End': {
          e.preventDefault();
          enabledItems[enabledItems.length - 1]?.focus();
          break;
        }
        case 'Escape': {
          e.preventDefault();
          setOpen(false);
          buttonRef.current?.focus();
          break;
        }
        case 'Tab': {
          // Tab closes the menu and returns focus to trigger
          setOpen(false);
          break;
        }
      }
    };

    return (
      <div ref={menuRef} className="relative inline-block">
        <button
          ref={buttonRef}
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown' && !open) {
              e.preventDefault();
              setOpen(true);
            }
          }}
          aria-haspopup="menu"
          aria-expanded={open}
          aria-label={ariaLabel}
          className={cn(
            'inline-flex items-center justify-center rounded p-1',
            'text-[var(--muted-foreground)] hover:text-[var(--foreground)]',
            'hover:bg-[var(--muted)]/50',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]',
          )}
        >
          <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
        </button>

        {open && (
          <div
            role="menu"
            onKeyDown={handleMenuKeyDown}
            className={cn(
              'absolute right-0 top-full z-50 mt-1 min-w-[160px]',
              'rounded-md border border-[var(--border)] bg-[var(--popover)]',
              'py-1 shadow-md',
            )}
          >
            {actions.map((action, index) => {
              const isDisabled = typeof action.disabled === 'function'
                ? action.disabled(row)
                : action.disabled ?? false;

              return (
                <button
                  key={action.id}
                  ref={(el) => { itemRefs.current[index] = el; }}
                  type="button"
                  role="menuitem"
                  tabIndex={-1}
                  disabled={isDisabled}
                  onClick={() => {
                    if (!isDisabled) {
                      action.onAction(row);
                      setOpen(false);
                      buttonRef.current?.focus();
                    }
                  }}
                  className={cn(
                    'flex w-full items-center gap-2 px-3 py-1.5 text-sm',
                    'hover:bg-[var(--accent)] focus:bg-[var(--accent)]',
                    'focus:outline-none',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                    action.variant === 'destructive' && 'text-[var(--destructive)]',
                  )}
                >
                  {action.icon && <span className="h-4 w-4 shrink-0">{action.icon}</span>}
                  {action.label}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  };
}
