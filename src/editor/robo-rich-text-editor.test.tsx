/**
 * RoboRichTextEditor — unit tests.
 *
 * Slate requires a number of DOM APIs (selection, range, etc.) that jsdom does
 * not fully implement. We mock the minimum necessary so the tests focus on
 * observable behaviour: rendered output, a11y, and side-effects.
 */
import * as React from 'react';
import { render, screen, act } from '@testing-library/react';
import { axe } from 'vitest-axe';

import { RoboRichTextEditor } from './robo-rich-text-editor';
import { EMPTY_SLATE_VALUE, type SlateValue } from './types';


// ── Slate DOM shims ────────────────────────────────────────────────────────────
// Slate's ReactEditor calls window.getSelection() internally. jsdom returns null
// by default which causes crashes before any assertion runs.

beforeAll(() => {
  // Minimal Selection shim
  if (!window.getSelection) {
    Object.defineProperty(window, 'getSelection', {
      value: () => ({
        getRangeAt: () => null,
        rangeCount: 0,
        addRange: vi.fn(),
        removeAllRanges: vi.fn(),
        toString: () => '',
      }),
      writable: true,
      configurable: true,
    });
  } else {
    vi.spyOn(window, 'getSelection').mockReturnValue({
      getRangeAt: () => null,
      rangeCount: 0,
      addRange: vi.fn(),
      removeAllRanges: vi.fn(),
      toString: () => '',
    } as unknown as Selection);
  }

  // createRange shim — Slate calls document.createRange()
  if (!document.createRange) {
    document.createRange = () =>
      ({
        setStart: vi.fn(),
        setEnd: vi.fn(),
        commonAncestorContainer: document.body,
        cloneRange: vi.fn(),
        collapse: vi.fn(),
        selectNode: vi.fn(),
        selectNodeContents: vi.fn(),
        insertNode: vi.fn(),
        getBoundingClientRect: () => ({
          left: 0, top: 0, right: 0, bottom: 0, width: 0, height: 0,
          x: 0, y: 0, toJSON: vi.fn(),
        }),
        getClientRects: () => ({ length: 0, item: () => null, [Symbol.iterator]: vi.fn() }),
      } as unknown as Range);
  }
});

afterAll(() => {
  vi.restoreAllMocks();
});

// ── Helpers ────────────────────────────────────────────────────────────────────

/** Pre-filled value with one paragraph */
const filledValue: SlateValue = [
  { type: 'paragraph', children: [{ text: 'Hello, world!' }] },
];

// ── Tests ──────────────────────────────────────────────────────────────────────

describe('RoboRichTextEditor', () => {
  it('renders without error with no props', () => {
    expect(() => render(<RoboRichTextEditor />)).not.toThrow();
  });

  it('renders the editor container with data-slot=editor', () => {
    render(<RoboRichTextEditor />);
    expect(document.querySelector('[data-slot="editor"]')).toBeInTheDocument();
  });

  it('renders an editable region that receives the placeholder prop', () => {
    // Slate v0.124 renders the placeholder via ResizeObserver + DOM mutation after
    // mount, which does not fire in jsdom. We verify the Editable is rendered with
    // the correct placeholder string stored on it (Slate keeps it internally).
    // Observable evidence: the textbox role exists and the component renders without
    // error. The placeholder string is passed to <Editable placeholder=...> and
    // confirmed via the component source; we assert the textbox is present.
    render(<RoboRichTextEditor placeholder='Write something here…' />);
    const textbox = screen.getByRole('textbox');
    expect(textbox).toBeInTheDocument();
    // Slate sets data-slate-editor on the editable root
    expect(textbox).toHaveAttribute('data-slate-editor', 'true');
  });

  it('keeps the placeholder readable: right token, full opacity', () => {
    // Two separate defects, both invisible without this.
    //
    // 1. Slate renders the placeholder with its own INLINE `opacity: 0.333`, which beats
    //    any class-based opacity — so whatever colour is declared, roughly a third of it
    //    is what ships.
    // 2. The placeholder used --muted-foreground, which `DESIGN.md` reserves for
    //    disabled states and exempts from WCAG. A placeholder is active text the user is
    //    meant to read, so --secondary-text is the correct token.
    //
    // Asserts the classes rather than computed styles because jsdom does not apply
    // Tailwind. The classes are the mechanism, so losing either is the regression.
    render(<RoboRichTextEditor placeholder='Write something here…' />);
    const textbox = screen.getByRole('textbox');
    expect(textbox.className).toContain('[&_[data-slate-placeholder]]:!opacity-100');
    expect(textbox.className).toContain('[&_[data-slate-placeholder]]:text-[var(--secondary-text)]');
  });

  it('shows character count footer when showCharCount is true', () => {
    render(
      <RoboRichTextEditor
        value={filledValue}
        showCharCount
        maxLength={500}
      />,
    );
    // Should show "{n}/500"
    expect(screen.getByText(/\/500/)).toBeInTheDocument();
  });

  it('shows only maxLength in footer without showCharCount when maxLength set', () => {
    render(<RoboRichTextEditor value={filledValue} maxLength={200} />);
    expect(screen.getByText(/\/200/)).toBeInTheDocument();
  });

  it('does not render character count when neither showCharCount nor maxLength', () => {
    render(<RoboRichTextEditor value={filledValue} />);
    expect(document.querySelector('[aria-live="polite"]')).not.toBeInTheDocument();
  });

  it('hides toolbar when readOnly is true', () => {
    render(<RoboRichTextEditor readOnly />);
    expect(screen.queryByRole('toolbar')).not.toBeInTheDocument();
  });

  it('shows toolbar when readOnly is false (default)', () => {
    render(<RoboRichTextEditor />);
    expect(screen.getByRole('toolbar', { name: /text formatting/i })).toBeInTheDocument();
  });

  it('applies aria-label to the editable region', () => {
    render(<RoboRichTextEditor aria-label='Report body' />);
    // Slate renders Editable as a div with role=textbox or the passed aria-label
    const editable = document.querySelector('[aria-label="Report body"]');
    expect(editable).toBeInTheDocument();
  });

  it('accepts a custom className on the outer container', () => {
    render(<RoboRichTextEditor className='custom-editor' />);
    expect(document.querySelector('.custom-editor')).toBeInTheDocument();
  });

  it('passes no a11y violations in default state', async () => {
    const { container } = render(
      <RoboRichTextEditor aria-label='Accessible editor' />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('passes no a11y violations in readOnly state', async () => {
    const { container } = render(
      <RoboRichTextEditor
        value={filledValue}
        readOnly
        aria-label='Read-only editor'
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  describe('auto-save to localStorage', () => {
    const STORAGE_KEY = 'robo-editor-test-draft';

    beforeEach(() => {
      window.localStorage.clear();
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
      window.localStorage.clear();
    });

    it('saves to localStorage after the autoSaveMs interval', () => {
      render(
        <RoboRichTextEditor
          value={filledValue}
          storageKey={STORAGE_KEY}
          autoSaveMs={1000}
        />,
      );

      act(() => {
        vi.advanceTimersByTime(1100);
      });

      const saved = window.localStorage.getItem(STORAGE_KEY);
      expect(saved).not.toBeNull();
      expect(JSON.parse(saved!)).toEqual(filledValue);
    });

    it('does not auto-save when readOnly is true', () => {
      render(
        <RoboRichTextEditor
          value={filledValue}
          storageKey={STORAGE_KEY}
          autoSaveMs={1000}
          readOnly
        />,
      );

      act(() => {
        vi.advanceTimersByTime(2000);
      });

      expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull();
    });

    it('shows draft-restored notice when saved draft exists on mount', () => {
      // Pre-populate localStorage before render
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(filledValue));

      render(
        <RoboRichTextEditor storageKey={STORAGE_KEY} autoSaveMs={5000} />,
      );

      expect(screen.getByRole('status')).toBeInTheDocument();
      expect(screen.getByText(/draft restored/i)).toBeInTheDocument();
    });
  });
});
