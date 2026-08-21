import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { RoboPrintButton } from './robo-print-button';

// ---------------------------------------------------------------------------
// window.open / window.print mocks
// ---------------------------------------------------------------------------
const mockPrint = vi.fn();
const mockClose = vi.fn();
const mockFocus = vi.fn();

// Minimal print window — document mirrors what the component accesses
const mockPrintDoc = {
  title: '',
  head: { appendChild: vi.fn() },
  body: { appendChild: vi.fn() },
  createElement: (tag: string) => document.createElement(tag),
};

const mockPrintWindow = {
  document: mockPrintDoc,
  print: mockPrint,
  close: mockClose,
  focus: mockFocus,
};

// userEvent with advanceTimers so fake timers + async clicks work together
function setup() {
  return userEvent.setup({ advanceTimers: vi.advanceTimersByTime.bind(vi) });
}

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
  vi.spyOn(window, 'open').mockReturnValue(mockPrintWindow as unknown as Window);
  vi.spyOn(window, 'print').mockImplementation(() => {});
  mockPrint.mockReset();
  mockClose.mockReset();
  mockFocus.mockReset();
  mockPrintDoc.head.appendChild.mockReset();
  mockPrintDoc.body.appendChild.mockReset();
});

afterEach(() => {
  vi.runOnlyPendingTimers();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('RoboPrintButton', () => {
  // ── Rendering ─────────────────────────────────────────────────────────────

  it('renders with default label', () => {
    render(<RoboPrintButton />);
    expect(screen.getByRole('button', { name: /print/i })).toBeInTheDocument();
  });

  it('renders with custom label', () => {
    render(<RoboPrintButton label='Print Report' />);
    expect(screen.getByRole('button', { name: /print report/i })).toBeInTheDocument();
  });

  it('renders icon-only button with aria-label', () => {
    render(<RoboPrintButton label='Print table' iconOnly />);
    const btn = screen.getByRole('button', { name: 'Print table' });
    expect(btn).toBeInTheDocument();
    expect(btn.textContent).toBe('');
  });

  it('shows label text when not iconOnly', () => {
    render(<RoboPrintButton label='Print' />);
    expect(screen.getByRole('button')).toHaveTextContent('Print');
  });

  it('has data-slot="print-button"', () => {
    render(<RoboPrintButton />);
    expect(screen.getByRole('button')).toHaveAttribute('data-slot', 'print-button');
  });

  it('applies custom className', () => {
    render(<RoboPrintButton className='my-class' />);
    expect(screen.getByRole('button')).toHaveClass('my-class');
  });

  it('forwards ref to the button element', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<RoboPrintButton ref={ref} />);
    expect(ref.current?.tagName).toBe('BUTTON');
  });

  // ── Print behaviour ────────────────────────────────────────────────────────

  it('falls back to window.print() when no target is given', async () => {
    const user = setup();
    render(<RoboPrintButton />);
    await user.click(screen.getByRole('button'));
    expect(window.print).toHaveBeenCalledTimes(1);
    expect(window.open).not.toHaveBeenCalled();
  });

  it('opens a new window when targetRef resolves to an element', async () => {
    const user = setup();
    const divRef = React.createRef<HTMLDivElement>();
    render(
      <>
        <div ref={divRef} data-testid='content'>Table content</div>
        <RoboPrintButton targetRef={divRef as React.RefObject<HTMLElement>} />
      </>,
    );
    await user.click(screen.getByRole('button'));
    expect(window.open).toHaveBeenCalledWith('', '_blank', expect.stringContaining('width'));
  });

  it('calls print() after the delay when a window was opened', async () => {
    const user = setup();
    const divRef = React.createRef<HTMLDivElement>();
    render(
      <>
        <div ref={divRef}>content</div>
        <RoboPrintButton targetRef={divRef as React.RefObject<HTMLElement>} />
      </>,
    );
    await user.click(screen.getByRole('button'));
    expect(mockPrint).not.toHaveBeenCalled();
    vi.advanceTimersByTime(250);
    expect(mockPrint).toHaveBeenCalledTimes(1);
    expect(mockClose).toHaveBeenCalledTimes(1);
  });

  it('falls back to window.print() when popup is blocked (open returns null)', async () => {
    vi.spyOn(window, 'open').mockReturnValue(null);
    const user = setup();
    const divRef = React.createRef<HTMLDivElement>();
    render(
      <>
        <div ref={divRef}>content</div>
        <RoboPrintButton targetRef={divRef as React.RefObject<HTMLElement>} />
      </>,
    );
    await user.click(screen.getByRole('button'));
    expect(window.print).toHaveBeenCalledTimes(1);
  });

  it('falls back to window.print() when targetSelector matches nothing', async () => {
    const user = setup();
    render(<RoboPrintButton targetSelector='#nonexistent-element' />);
    await user.click(screen.getByRole('button'));
    expect(window.print).toHaveBeenCalledTimes(1);
  });

  it('does not open print window when disabled', async () => {
    const user = setup();
    render(<RoboPrintButton disabled />);
    await user.click(screen.getByRole('button'));
    expect(window.open).not.toHaveBeenCalled();
    expect(window.print).not.toHaveBeenCalled();
  });
});
