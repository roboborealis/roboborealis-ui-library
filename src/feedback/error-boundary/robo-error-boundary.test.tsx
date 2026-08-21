import * as React from 'react';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import type { MockInstance } from 'vitest';

import { RoboErrorBoundary } from './robo-error-boundary';


// ---------------------------------------------------------------------------
// matchMedia mock — RoboErrorState (the default fallback) checks
// prefers-reduced-motion, which jsdom doesn't implement.
// ---------------------------------------------------------------------------

function mockMatchMedia(matches: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockReturnValue({
      matches,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
    }),
  });
}

function Bomb({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error('boom');
  }
  return <span>Safe content</span>;
}

describe('RoboErrorBoundary', () => {
  let consoleErrorSpy: MockInstance;

  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    mockMatchMedia(false);
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.useRealTimers();
    consoleErrorSpy.mockRestore();
  });

  it('renders children when nothing throws', () => {
    render(
      <RoboErrorBoundary>
        <Bomb shouldThrow={false} />
      </RoboErrorBoundary>
    );
    expect(screen.getByText('Safe content')).toBeInTheDocument();
  });

  it('renders the default RoboErrorState fallback when a child throws', () => {
    render(
      <RoboErrorBoundary>
        <Bomb shouldThrow={true} />
      </RoboErrorBoundary>
    );
    expect(screen.queryByText('Safe content')).not.toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
  });

  it('renders a custom fallback when provided', () => {
    render(
      <RoboErrorBoundary fallback={<span>Custom fallback</span>}>
        <Bomb shouldThrow={true} />
      </RoboErrorBoundary>
    );
    expect(screen.getByText('Custom fallback')).toBeInTheDocument();
  });

  it('calls onRetry and remounts children on retry', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime.bind(vi) });
    const onRetry = vi.fn();
    let shouldThrow = true;

    function Wrapper() {
      return (
        <RoboErrorBoundary onRetry={onRetry}>
          <Bomb shouldThrow={shouldThrow} />
        </RoboErrorBoundary>
      );
    }

    const { rerender } = render(<Wrapper />);
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    // Update the children prop to safe content *before* retrying — the boundary
    // still shows the fallback (hasError stays true) until retry resets it, but
    // the new props are now in place so the reset render succeeds.
    shouldThrow = false;
    rerender(<Wrapper />);

    await user.click(screen.getByRole('button', { name: /try again/i }));

    expect(onRetry).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Safe content')).toBeInTheDocument();
  });

  it('has correct displayName', () => {
    expect(RoboErrorBoundary.displayName).toBe('RoboErrorBoundary');
  });

  it('has no accessibility violations in the happy path', async () => {
    const { container } = render(
      <RoboErrorBoundary>
        <Bomb shouldThrow={false} />
      </RoboErrorBoundary>
    );
    vi.useRealTimers();
    expect(await axe(container)).toHaveNoViolations();
  });
});
