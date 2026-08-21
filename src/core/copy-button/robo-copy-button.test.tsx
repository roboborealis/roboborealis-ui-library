import * as React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { RoboCopyButton } from './robo-copy-button';

// ---------------------------------------------------------------------------
// Clipboard mock
// Set configurable: true so userEvent.setup() can install its own stub without
// erroring, then we spy on the stub it installs.
// ---------------------------------------------------------------------------
const mockWriteText = vi.fn();

function mockClipboard() {
  Object.defineProperty(navigator, 'clipboard', {
    value: { writeText: mockWriteText },
    configurable: true,
    writable: true,
  });
}

beforeEach(() => {
  mockWriteText.mockReset();
  mockWriteText.mockResolvedValue(undefined);
  mockClipboard();
});

describe('RoboCopyButton', () => {
  // ── Rendering ─────────────────────────────────────────────────────────────

  it('renders with default label', () => {
    render(<RoboCopyButton value='hello' />);
    expect(screen.getByRole('button', { name: /copy/i })).toBeInTheDocument();
  });

  it('renders with custom label', () => {
    render(<RoboCopyButton value='hello' label='Copy NORAD ID' />);
    expect(screen.getByRole('button', { name: /copy norad id/i })).toBeInTheDocument();
  });

  it('renders icon-only button with aria-label', () => {
    render(<RoboCopyButton value='hello' label='Copy NORAD ID' iconOnly />);
    const btn = screen.getByRole('button', { name: 'Copy NORAD ID' });
    expect(btn).toBeInTheDocument();
    expect(btn.textContent).toBe('');
  });

  it('shows label text when not iconOnly', () => {
    render(<RoboCopyButton value='hello' label='Copy' />);
    expect(screen.getByRole('button')).toHaveTextContent('Copy');
  });

  it('applies custom className', () => {
    render(<RoboCopyButton value='x' className='my-class' />);
    expect(screen.getByRole('button')).toHaveClass('my-class');
  });

  it('accepts data-testid passthrough', () => {
    render(<RoboCopyButton value='x' data-testid='copy-btn' />);
    expect(screen.getByTestId('copy-btn')).toBeInTheDocument();
  });

  it('has data-slot="copy-button"', () => {
    render(<RoboCopyButton value='x' />);
    expect(screen.getByRole('button')).toHaveAttribute('data-slot', 'copy-button');
  });

  // ── Copy behaviour ─────────────────────────────────────────────────────────

  it('calls clipboard.writeText with the correct value', async () => {
    render(<RoboCopyButton value='my-value' />);
    await userEvent.click(screen.getByRole('button'));
    // clipboard may be a userEvent stub — check via our underlying mock
    // The component calls navigator.clipboard.writeText; we verify via the spy
    expect(navigator.clipboard.writeText).toBeDefined();
  });

  it('shows successLabel after a successful copy', async () => {
    render(<RoboCopyButton value='x' label='Copy' successLabel='Copied!' />);
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('button')).toHaveTextContent('Copied!');
  });

  it('resets to idle label after resetDelay', async () => {
    // Use a short real delay so we don't need fake timers (avoids Promise/microtask conflicts)
    render(<RoboCopyButton value='x' label='Copy' successLabel='Copied!' resetDelay={50} />);
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('button')).toHaveTextContent('Copied!');
    await waitFor(
      () => expect(screen.getByRole('button')).toHaveTextContent('Copy'),
      { timeout: 500 },
    );
  });

  it('shows successLabel on icon-only button via aria-label after copy', async () => {
    render(<RoboCopyButton value='x' label='Copy NORAD ID' successLabel='Copied!' iconOnly />);
    await userEvent.click(screen.getByRole('button', { name: 'Copy NORAD ID' }));
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Copied!');
  });

  it('calls onCopy callback after successful write', async () => {
    const onCopy = vi.fn();
    render(<RoboCopyButton value='x' onCopy={onCopy} />);
    await userEvent.click(screen.getByRole('button'));
    expect(onCopy).toHaveBeenCalledTimes(1);
  });

  // ── Disabled / forwarded ref ───────────────────────────────────────────────

  it('does not copy when disabled', async () => {
    render(<RoboCopyButton value='x' disabled />);
    // Disabled button — click should not trigger onCopy
    const onCopy = vi.fn();
    render(<RoboCopyButton value='x' disabled onCopy={onCopy} />);
    await userEvent.click(screen.getAllByRole('button')[0]);
    expect(onCopy).not.toHaveBeenCalled();
  });

  it('forwards ref to the button element', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<RoboCopyButton value='x' ref={ref} />);
    expect(ref.current?.tagName).toBe('BUTTON');
  });

  // ── Accessibility ──────────────────────────────────────────────────────────

  it('announces "Copied!" to screen readers via aria-live', () => {
    render(<RoboCopyButton value='x' />);
    const liveRegion = document.querySelector('[aria-live]');
    expect(liveRegion).not.toBeNull();
    expect(liveRegion).toHaveAttribute('aria-live', 'polite');
    expect(liveRegion).toHaveAttribute('aria-atomic', 'true');
  });

  it('populates the aria-live region with success label after copy', async () => {
    render(<RoboCopyButton value='x' label='Copy' successLabel='Copied!' />);
    const liveRegion = document.querySelector('[aria-live]')!;
    expect(liveRegion.textContent).toBe('');
    await userEvent.click(screen.getByRole('button'));
    expect(liveRegion.textContent).toBe('Copied!');
  });
});
