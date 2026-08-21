'use client';

import * as React from 'react';
import { createEditor, type Descendant } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import { withHistory } from 'slate-history';
import isHotkey from 'is-hotkey';

import { cn } from '@/lib/utils';
import { RoboEditorToolbar } from './toolbar/robo-editor-toolbar';
import { RoboLeaf } from './leaf';
import { RoboElement } from './element';
import { toggleMark, slateToText } from './utils';
import { EMPTY_SLATE_VALUE, type SlateValue } from './types';

// ── Keyboard shortcut map ──────────────────────────────────────────────────────

const HOTKEYS: Record<string, 'bold' | 'italic' | 'underline'> = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
};

// ── Props ──────────────────────────────────────────────────────────────────────

export interface RoboRichTextEditorProps {
  /** Controlled value (Slate Descendant array). */
  value?: SlateValue;
  /** Uncontrolled initial value. Defaults to a single empty paragraph. */
  defaultValue?: SlateValue;
  /** Called whenever the editor content changes. */
  onChange?: (value: SlateValue) => void;
  /** Render the editor in read-only mode (hides toolbar). */
  readOnly?: boolean;
  /** Placeholder text shown when the editor is empty. */
  placeholder?: string;
  /** Maximum character limit (plain-text characters). */
  maxLength?: number;
  /** Show character count beneath the editor. */
  showCharCount?: boolean;
  /**
   * localStorage key for auto-saving the draft.
   * When provided, the editor loads the draft on mount and saves periodically.
   */
  storageKey?: string;
  /** Auto-save interval in milliseconds. Default: 5000. */
  autoSaveMs?: number;
  /** CSS min-height for the editable area. Default: '200px'. */
  minHeight?: string;
  /** CSS max-height for the editable area (makes it scrollable). */
  maxHeight?: string;
  className?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
}

// ── Component ──────────────────────────────────────────────────────────────────

/**
 * RoboRichTextEditor — a Slate.js rich-text editor for the @roboborealis/components design
 * system. Supports bold/italic/underline, headings (H1–H4), bulleted and
 * numbered lists, links, keyboard shortcuts, read-only mode, character limits,
 * and auto-save to localStorage.
 *
 * Data format: Slate JSON (`SlateValue`, i.e. `Descendant[]`).
 *
 * @example
 * ```tsx
 * const [value, setValue] = useState<SlateValue>(EMPTY_SLATE_VALUE);
 *
 * <RoboRichTextEditor
 *   value={value}
 *   onChange={setValue}
 *   placeholder="Start writing..."
 *   showCharCount
 *   maxLength={2000}
 *   storageKey="my-draft"
 * />
 * ```
 */
export function RoboRichTextEditor({
  value: controlledValue,
  defaultValue,
  onChange,
  readOnly = false,
  placeholder = 'Start writing…',
  maxLength,
  showCharCount = false,
  storageKey,
  autoSaveMs = 5000,
  minHeight = '200px',
  maxHeight,
  className,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
}: RoboRichTextEditorProps) {
  // ── Editor instance (stable across re-renders) ─────────────────────────────
  const editor = React.useMemo(() => withHistory(withReact(createEditor())), []);

  // ── Internal state for uncontrolled usage ──────────────────────────────────
  const initialValue = React.useMemo<SlateValue>(() => {
    let base: SlateValue;

    // If a storageKey is given, try to load a saved draft first.
    if (storageKey && typeof window !== 'undefined') {
      const saved = window.localStorage.getItem(storageKey);
      if (saved) {
        try {
          const parsed = JSON.parse(saved) as SlateValue;
          if (Array.isArray(parsed) && parsed.length > 0) {
            base = parsed; // already a fresh parse → unique references
          } else {
            base = controlledValue ?? defaultValue ?? EMPTY_SLATE_VALUE;
          }
        } catch {
          base = controlledValue ?? defaultValue ?? EMPTY_SLATE_VALUE;
        }
      } else {
        base = controlledValue ?? defaultValue ?? EMPTY_SLATE_VALUE;
      }
    } else {
      base = controlledValue ?? defaultValue ?? EMPTY_SLATE_VALUE;
    }

    // Deep-clone so each editor instance owns unique node object references.
    // Slate's WeakMap (NODE_TO_INDEX / NODE_TO_PARENT) keyed by object identity —
    // sharing the same objects across multiple editors causes "Unable to find path" errors.
    return JSON.parse(JSON.stringify(base)) as SlateValue;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally empty — only runs once on mount

  const [internalValue, setInternalValue] = React.useState<SlateValue>(initialValue);

  // The "live" value — prefer controlled prop if provided
  const currentValue = controlledValue ?? internalValue;

  // ── Draft-restored notice ──────────────────────────────────────────────────
  const [draftRestored, setDraftRestored] = React.useState(false);

  React.useEffect(() => {
    if (storageKey && typeof window !== 'undefined') {
      const saved = window.localStorage.getItem(storageKey);
      if (saved) {
        try {
          const parsed = JSON.parse(saved) as SlateValue;
          if (Array.isArray(parsed) && parsed.length > 0) {
            setDraftRestored(true);
            // Auto-dismiss after 4 s
            const t = setTimeout(() => setDraftRestored(false), 4000);
            return () => clearTimeout(t);
          }
        } catch {
          // Ignore
        }
      }
    }
    return undefined;
  }, [storageKey]);

  // ── Auto-save ──────────────────────────────────────────────────────────────
  const latestValueRef = React.useRef<SlateValue>(currentValue);
  latestValueRef.current = currentValue;

  React.useEffect(() => {
    if (!storageKey || readOnly) return undefined;

    const id = setInterval(() => {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(
          storageKey,
          JSON.stringify(latestValueRef.current),
        );
      }
    }, autoSaveMs);

    return () => clearInterval(id);
  }, [storageKey, readOnly, autoSaveMs]);

  // ── Character count ────────────────────────────────────────────────────────
  const charCount = React.useMemo(
    () => slateToText(currentValue).length,
    [currentValue],
  );

  // ── Change handler ─────────────────────────────────────────────────────────
  const handleChange = React.useCallback(
    (newValue: Descendant[]) => {
      const slateValue = newValue as SlateValue;
      setInternalValue(slateValue);
      onChange?.(slateValue);
    },
    [onChange],
  );

  // ── Keyboard handler ───────────────────────────────────────────────────────
  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      // Enforce character limit
      if (maxLength !== undefined && charCount >= maxLength) {
        const isPrintable =
          event.key.length === 1 &&
          !event.ctrlKey &&
          !event.metaKey &&
          !event.altKey;
        if (isPrintable) {
          event.preventDefault();
          return;
        }
      }

      for (const hotkey in HOTKEYS) {
        if (isHotkey(hotkey, event as unknown as KeyboardEvent)) {
          event.preventDefault();
          const mark = HOTKEYS[hotkey];
          toggleMark(editor, mark);
          return;
        }
      }
    },
    [editor, maxLength, charCount],
  );

  // ── Renderers ──────────────────────────────────────────────────────────────
  const renderLeaf = React.useCallback(
    (props: Parameters<typeof RoboLeaf>[0]) => <RoboLeaf {...props} />,
    [],
  );

  const renderElement = React.useCallback(
    (props: Parameters<typeof RoboElement>[0]) => <RoboElement {...props} />,
    [],
  );

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div
      className={cn(
        'flex flex-col overflow-hidden rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card)]',
        className,
      )}
      data-slot='editor'
    >
      <Slate
        editor={editor}
        initialValue={initialValue}
        onChange={handleChange}
      >
        {/* Toolbar — hidden in read-only mode */}
        {!readOnly && <RoboEditorToolbar />}

        {/* Draft restored notice */}
        {draftRestored && (
          <div
            role='status'
            aria-live='polite'
            className='flex items-center gap-2 border-b border-[var(--border)] bg-[var(--muted)] px-3 py-1.5 text-xs text-[var(--muted-foreground)]'
          >
            Draft restored from local storage.
            <button
              type='button'
              className='ml-auto text-xs underline hover:no-underline'
              onClick={() => setDraftRestored(false)}
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Editable area */}
        <div
          className='overflow-y-auto'
          style={{ minHeight, maxHeight }}
        >
          <Editable
            readOnly={readOnly}
            placeholder={placeholder}
            renderLeaf={renderLeaf}
            renderElement={renderElement}
            onKeyDown={handleKeyDown}
            aria-label={ariaLabel}
            aria-describedby={ariaDescribedBy}
            spellCheck
            className={cn(
              'h-full min-h-full px-4 py-3 font-sans text-base text-[var(--foreground)] outline-none',
              'focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-inset',
              // The `!` is load-bearing. Slate renders the placeholder with its own
              // INLINE `opacity: 0.333`, which beats any class-based opacity — so the
              // colour declared on the line below was never what shipped, whatever it
              // was set to. Removing this `!` silently reverts the placeholder to
              // roughly a third of its intended contrast.
              '[&_[data-slate-placeholder]]:!opacity-100',
              // --secondary-text, not --muted-foreground. A placeholder is ACTIVE text
              // that the user is meant to read, and `DESIGN.md` reserves
              // --muted-foreground for disabled states, where WCAG contrast does not
              // apply. --secondary-text is the documented token for this and is held to
              // 4.5:1 by the contrast suite.
              '[&_[data-slate-placeholder]]:text-[var(--secondary-text)]',
              readOnly && 'cursor-default select-text',
            )}
          />
        </div>

        {/* Footer: char count */}
        {(showCharCount || maxLength !== undefined) && (
          <div
            className='flex items-center justify-end border-t border-[var(--border)] px-3 py-1 text-xs text-[var(--muted-foreground)]'
            aria-live='polite'
            aria-atomic='true'
          >
            <span>
              {charCount}
              {maxLength !== undefined && (
                <span
                  className={
                    charCount >= maxLength
                      ? 'text-[var(--destructive)]'
                      : undefined
                  }
                >
                  /{maxLength}
                </span>
              )}
            </span>
          </div>
        )}
      </Slate>
    </div>
  );
}

RoboRichTextEditor.displayName = 'RoboRichTextEditor';
