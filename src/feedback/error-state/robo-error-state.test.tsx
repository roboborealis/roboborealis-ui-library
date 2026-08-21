import * as React from 'react';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { RoboErrorState, RoboErrorStateStatic } from './robo-error-state';


// ---------------------------------------------------------------------------
// matchMedia mock
// ---------------------------------------------------------------------------

function mockMatchMedia(matches: boolean) {
  const listeners: Array<(e: MediaQueryListEvent) => void> = [];
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockReturnValue({
      matches,
      addEventListener: (_: string, cb: (e: MediaQueryListEvent) => void) =>
        listeners.push(cb),
      removeEventListener: (_: string, cb: (e: MediaQueryListEvent) => void) => {
        const idx = listeners.indexOf(cb);
        if (idx >= 0) listeners.splice(idx, 1);
      },
    }),
  });
  return listeners;
}

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
  mockMatchMedia(false);
});

afterEach(() => {
  vi.useRealTimers();
});

// ---------------------------------------------------------------------------
// RoboErrorState
// ---------------------------------------------------------------------------

describe('RoboErrorState', () => {
  it('renders with role="status"', () => {
    render(<RoboErrorState />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('has default aria-label "Loading"', () => {
    render(<RoboErrorState />);
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Loading');
  });

  it('uses "Error" aria-label for error variant', () => {
    render(<RoboErrorState variant='error' />);
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Error');
  });

  it('uses custom label when provided', () => {
    render(<RoboErrorState label='Fetching data' />);
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Fetching data');
  });

  it('sets aria-busy while animating', () => {
    render(<RoboErrorState />);
    expect(screen.getByRole('status')).toHaveAttribute('aria-busy', 'true');
  });

  it('clears aria-busy after animation completes', () => {
    render(<RoboErrorState frameInterval={50} />);
    // 12 frames × 50ms = 600ms to finish
    act(() => {
      vi.advanceTimersByTime(700);
    });
    expect(screen.getByRole('status')).not.toHaveAttribute('aria-busy');
  });

  it('does not show error message during animation', () => {
    render(<RoboErrorState variant='error' />);
    expect(screen.queryByText("...uh... We have a problem?")).not.toBeInTheDocument();
  });

  it('shows error message after animation completes (error variant)', () => {
    render(<RoboErrorState variant='error' frameInterval={50} />);
    act(() => {
      vi.advanceTimersByTime(700);
    });
    expect(screen.getByText("...uh... We have a problem?")).toBeInTheDocument();
  });

  it('shows retry button after animation (error variant with onRetry)', () => {
    const onRetry = vi.fn();
    render(<RoboErrorState variant='error' frameInterval={50} onRetry={onRetry} />);
    act(() => {
      vi.advanceTimersByTime(700);
    });
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument();
  });

  it('calls onRetry when retry button is clicked', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime.bind(vi) });
    const onRetry = vi.fn();
    render(<RoboErrorState variant='error' frameInterval={50} onRetry={onRetry} />);
    act(() => {
      vi.advanceTimersByTime(700);
    });
    await user.click(screen.getByRole('button', { name: 'Try again' }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('uses custom errorMessage and retryLabel', () => {
    render(
      <RoboErrorState
        variant='error'
        frameInterval={50}
        errorMessage='Custom error'
        retryLabel='Retry now'
        onRetry={() => {}}
      />,
    );
    act(() => {
      vi.advanceTimersByTime(700);
    });
    expect(screen.getByText('Custom error')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Retry now' })).toBeInTheDocument();
  });

  it('does not show retry button without onRetry callback', () => {
    render(<RoboErrorState variant='error' frameInterval={50} />);
    act(() => {
      vi.advanceTimersByTime(700);
    });
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('does not show error message for loading variant after animation', () => {
    render(<RoboErrorState variant='loading' frameInterval={50} />);
    act(() => {
      vi.advanceTimersByTime(700);
    });
    expect(screen.queryByText("...uh... We have a problem?")).not.toBeInTheDocument();
  });

  it('applies size variant classes', () => {
    const { rerender } = render(<RoboErrorState size='sm' />);
    expect(screen.getByRole('status').className).toContain('[&_.robo-error-state-svg]:w-16');

    rerender(<RoboErrorState size='lg' />);
    expect(screen.getByRole('status').className).toContain('[&_.robo-error-state-svg]:w-32');
  });

  it('forwards ref to the container div', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<RoboErrorState ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('passes additional className', () => {
    render(<RoboErrorState className='custom-class' />);
    expect(screen.getByRole('status')).toHaveClass('custom-class');
  });

  it('has displayName RoboErrorState', () => {
    expect(RoboErrorState.displayName).toBe('RoboErrorState');
  });

  it('skips animation when prefers-reduced-motion is active', () => {
    mockMatchMedia(true);
    render(<RoboErrorState variant='error' />);
    // Should show error immediately — no animation delay
    expect(screen.getByText("...uh... We have a problem?")).toBeInTheDocument();
    expect(screen.getByRole('status')).not.toHaveAttribute('aria-busy');
  });

  it('no a11y violations (loading)', async () => {
    vi.useRealTimers();
    const { container } = render(<RoboErrorState />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('no a11y violations (error with retry)', async () => {
    const { container } = render(
      <RoboErrorState variant='error' frameInterval={50} onRetry={() => {}} />,
    );
    act(() => {
      vi.advanceTimersByTime(700);
    });
    vi.useRealTimers();
    expect(await axe(container)).toHaveNoViolations();
  });
});

// ---------------------------------------------------------------------------
// RoboErrorStateStatic
// ---------------------------------------------------------------------------

describe('RoboErrorStateStatic', () => {
  it('renders with role="img"', () => {
    render(<RoboErrorStateStatic />);
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('has default aria-label "Satellite"', () => {
    render(<RoboErrorStateStatic />);
    expect(screen.getByRole('img')).toHaveAttribute('aria-label', 'Satellite');
  });

  it('uses custom label when provided', () => {
    render(<RoboErrorStateStatic label='Satellite' />);
    expect(screen.getByRole('img')).toHaveAttribute('aria-label', 'Satellite');
  });

  it('applies size variant classes', () => {
    render(<RoboErrorStateStatic size='lg' />);
    expect(screen.getByRole('img').className).toContain('[&_.robo-error-state-svg]:w-32');
  });

  it('forwards ref to the container div', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<RoboErrorStateStatic ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('has displayName RoboErrorStateStatic', () => {
    expect(RoboErrorStateStatic.displayName).toBe('RoboErrorStateStatic');
  });

  it('no a11y violations', async () => {
    vi.useRealTimers();
    const { container } = render(<RoboErrorStateStatic />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
