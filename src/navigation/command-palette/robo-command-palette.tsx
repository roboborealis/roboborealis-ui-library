'use client';

import * as React from 'react';
import { Command } from 'cmdk';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Search, X } from 'lucide-react';

import { cn } from '@/lib/utils';
import { RoboKbd } from '@/core/kbd/robo-kbd';
import { RoboCommandHints, type CommandHint } from './robo-command-hints';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CommandItem {
  /** Unique identifier */
  id: string;
  /** Display label */
  label: string;
  /** Optional secondary description */
  description?: string;
  /** Icon rendered before the label */
  icon?: React.ReactNode;
  /** Keyboard shortcut hint (display only — not wired automatically) */
  shortcut?: string;
  /** Called when the item is selected */
  onSelect: () => void;
  /** Disable the item */
  disabled?: boolean;
}

export interface CommandGroup {
  /** Group heading */
  heading: string;
  /** Items within this group */
  items: CommandItem[];
}

export interface RoboCommandPaletteProps {
  /** Whether the palette is open */
  open: boolean;
  /** Called when the palette should close */
  onOpenChange: (open: boolean) => void;
  /** Groups of commands to display */
  groups: CommandGroup[];
  /** Placeholder text for the search input. Default: 'Search commands…' */
  placeholder?: string;
  /** Message shown when no results match the query */
  emptyMessage?: string;
  /** Called when the search query changes */
  onSearch?: (query: string) => void;
  /** Controlled search value — omit for uncontrolled */
  searchValue?: string;
  /** Footer hint entries — defaults to the standard navigate/select/close triad (see RoboCommandHints) */
  hints?: CommandHint[];
  ref?: React.Ref<HTMLDivElement>;
}

// ---------------------------------------------------------------------------
// Sub-components (internal — not exported)
// ---------------------------------------------------------------------------

function CommandOverlay({
  className,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay> & {
  ref?: React.Ref<React.ComponentRef<typeof DialogPrimitive.Overlay>>;
}) {
  return (
    <DialogPrimitive.Overlay
      ref={ref}
      className={cn(
        'fixed inset-0 z-50 bg-black/60 backdrop-blur-sm',
        'data-[state=open]:animate-in data-[state=closed]:animate-out',
        'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        'duration-[var(--duration-normal)]',
        className,
      )}
      {...props}
    />
  );
}
CommandOverlay.displayName = 'CommandOverlay';

// ---------------------------------------------------------------------------
// RoboCommandPalette
// ---------------------------------------------------------------------------

/**
 * RoboCommandPalette — keyboard-driven search and command launcher.
 *
 * Render it once near the root of your app and toggle `open` with a
 * global Cmd+K / Ctrl+K handler.
 *
 * @example
 * ```tsx
 * const [open, setOpen] = React.useState(false);
 *
 * // Wire up Cmd+K
 * React.useEffect(() => {
 *   const handler = (e: KeyboardEvent) => {
 *     if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
 *       e.preventDefault();
 *       setOpen((o) => !o);
 *     }
 *   };
 *   window.addEventListener('keydown', handler);
 *   return () => window.removeEventListener('keydown', handler);
 * }, []);
 *
 * <RoboCommandPalette
 *   open={open}
 *   onOpenChange={setOpen}
 *   groups={[
 *     {
 *       heading: 'Navigation',
 *       items: [
 *         { id: 'dashboard', label: 'Go to Dashboard', icon: <LayoutDashboard />, onSelect: () => router.push('/') },
 *       ],
 *     },
 *   ]}
 * />
 * ```
 */
function RoboCommandPalette({
  open,
  onOpenChange,
  groups,
  placeholder = 'Search commands…',
  emptyMessage = 'No results found.',
  onSearch,
  searchValue,
  hints,
  ref,
}: RoboCommandPaletteProps) {
  const isControlled = searchValue !== undefined;
  const [internalQuery, setInternalQuery] = React.useState('');
  const query = isControlled ? searchValue : internalQuery;

  const handleSearch = React.useCallback(
    (value: string) => {
      if (!isControlled) setInternalQuery(value);
      onSearch?.(value);
    },
    [isControlled, onSearch],
  );

  // Clear query on close
  React.useEffect(() => {
    if (!open && !isControlled) setInternalQuery('');
  }, [open, isControlled]);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <CommandOverlay />

        <DialogPrimitive.Content
          aria-describedby={undefined}
          className={cn(
            'fixed left-1/2 top-[20vh] z-50 -translate-x-1/2',
            'w-full max-w-lg',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
            'data-[state=closed]:slide-out-to-top-1 data-[state=open]:slide-in-from-top-1',
            'duration-[var(--duration-normal)]',
          )}
        >
          <DialogPrimitive.Title className='sr-only'>
            Command palette
          </DialogPrimitive.Title>

          <Command
            ref={ref}
            data-slot='command-palette'
            className={cn(
              'overflow-hidden rounded-[var(--radius-lg)]',
              'border border-[var(--border)]',
              'bg-[var(--card)]',
              'shadow-[var(--shadow-lg)]',
            )}
            shouldFilter={!onSearch} // disable built-in filter when consumer filters externally
            loop
          >
            {/* Search input */}
            <div
              className='flex items-center gap-2 border-b border-[var(--border)] px-3'
              data-slot='command-input-wrapper'
            >
              <Search
                className='h-4 w-4 shrink-0 text-[var(--muted-foreground)]'
                aria-hidden='true'
              />
              <Command.Input
                value={query}
                onValueChange={handleSearch}
                placeholder={placeholder}
                className={cn(
                  'flex h-12 w-full bg-transparent py-3 text-sm',
                  'text-[var(--foreground)]',
                  'placeholder:text-[var(--muted-foreground)]',
                  'outline-none',
                  'disabled:cursor-not-allowed disabled:opacity-50',
                )}
                aria-label={placeholder}
              />
              <DialogPrimitive.Close
                className={cn(
                  'flex h-6 w-6 shrink-0 items-center justify-center rounded',
                  'text-[var(--muted-foreground)] hover:text-[var(--foreground)]',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]',
                )}
                aria-label='Close command palette'
              >
                <X className='h-3.5 w-3.5' aria-hidden='true' />
              </DialogPrimitive.Close>
            </div>

            {/* Results list */}
            <Command.List
              className='max-h-80 overflow-y-auto overscroll-contain p-1'
              aria-label='Command palette results'
            >
              <Command.Empty
                className='py-8 text-center text-sm text-[var(--muted-foreground)]'
              >
                {emptyMessage}
              </Command.Empty>

              {groups.map((group) => (
                <Command.Group
                  key={group.heading}
                  heading={group.heading}
                  className={cn(
                    '[&_[cmdk-group-heading]]:px-2',
                    '[&_[cmdk-group-heading]]:py-1.5',
                    '[&_[cmdk-group-heading]]:text-xs',
                    '[&_[cmdk-group-heading]]:font-medium',
                    '[&_[cmdk-group-heading]]:text-[var(--muted-foreground)]',
                    '[&_[cmdk-group-heading]]:uppercase',
                    '[&_[cmdk-group-heading]]:tracking-wider',
                    // Hide empty groups
                    '[&:not(:has([cmdk-item]))]:hidden',
                  )}
                >
                  {group.items.map((item) => (
                    <Command.Item
                      key={item.id}
                      value={`${item.label} ${item.description ?? ''}`}
                      disabled={item.disabled}
                      onSelect={() => {
                        item.onSelect();
                        onOpenChange(false);
                      }}
                      className={cn(
                        'flex items-center gap-2.5 rounded-[var(--radius-sm)] px-2 py-2',
                        'text-sm text-[var(--foreground)]',
                        'cursor-pointer select-none',
                        'aria-disabled:cursor-not-allowed aria-disabled:opacity-40',
                        // Highlighted state (keyboard navigation + hover)
                        'data-[selected=true]:bg-[var(--accent)] data-[selected=true]:text-[var(--accent-foreground)]',
                        'transition-colors duration-[var(--duration-instant)]',
                      )}
                    >
                      {item.icon && (
                        <span
                          className='flex h-4 w-4 shrink-0 items-center justify-center text-[var(--muted-foreground)]'
                          aria-hidden='true'
                        >
                          {item.icon}
                        </span>
                      )}

                      <span className='flex-1 truncate'>{item.label}</span>

                      {item.description && (
                        <span className='truncate text-xs text-[var(--muted-foreground)]'>
                          {item.description}
                        </span>
                      )}

                      {item.shortcut && (
                        <RoboKbd
                          className='hidden sm:inline-flex px-1.5 py-0.5'
                          aria-label={`Shortcut: ${item.shortcut}`}
                        >
                          {item.shortcut}
                        </RoboKbd>
                      )}
                    </Command.Item>
                  ))}
                </Command.Group>
              ))}
            </Command.List>

            <RoboCommandHints hints={hints} />
          </Command>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
RoboCommandPalette.displayName = 'RoboCommandPalette';

export { RoboCommandPalette };
