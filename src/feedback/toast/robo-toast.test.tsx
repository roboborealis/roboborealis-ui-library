import * as React from 'react';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import {
  RoboToastProvider,
  RoboToastViewport,
  RoboToast,
  RoboToastTitle,
  RoboToastDescription,
  RoboToastClose,
  useRoboToast,
} from './robo-toast';


// ---------------------------------------------------------------------------
// Helper: renders children inside the full provider setup
// ---------------------------------------------------------------------------
function WithProvider({ children }: { children: React.ReactNode }) {
  return <RoboToastProvider>{children}</RoboToastProvider>;
}

// ---------------------------------------------------------------------------
// RoboToastProvider
// ---------------------------------------------------------------------------
describe('RoboToastProvider', () => {
  it('renders children', () => {
    render(
      <RoboToastProvider>
        <div data-testid='child'>Hello</div>
      </RoboToastProvider>
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// useRoboToast
// ---------------------------------------------------------------------------
describe('useRoboToast', () => {
  it('returns a toast function', () => {
    let toastFn: ((...args: unknown[]) => void) | undefined;

    function Consumer() {
      const { toast } = useRoboToast();
      toastFn = toast;
      return null;
    }

    render(
      <WithProvider>
        <Consumer />
      </WithProvider>
    );

    expect(typeof toastFn).toBe('function');
  });

  it('throws when used outside RoboToastProvider', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    function BadConsumer() {
      useRoboToast();
      return null;
    }
    expect(() => render(<BadConsumer />)).toThrow(
      'useRoboToast must be used inside <RoboToastProvider>'
    );
    consoleSpy.mockRestore();
  });

  it('calling toast() renders a toast with the given title', async () => {
    function Consumer() {
      const { toast } = useRoboToast();
      return (
        <button onClick={() => toast({ title: 'Hello Toast', variant: 'success' })}>
          Show
        </button>
      );
    }

    render(
      <WithProvider>
        <Consumer />
      </WithProvider>
    );

    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: /show/i }));
    });

    expect(screen.getByText('Hello Toast')).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// RoboToast variants — check class on the toast root element directly
// ---------------------------------------------------------------------------
describe('RoboToast variants', () => {
  it('success variant has correct border class', () => {
    const { container } = render(
      <RoboToastProvider>
        <RoboToast variant='success' open>
          <RoboToastTitle>Done</RoboToastTitle>
        </RoboToast>
        <RoboToastViewport />
      </RoboToastProvider>
    );
    // Find the toast root — it's the li[data-state="open"] element rendered by Radix
    const toastEl = container.querySelector('li[data-state="open"]');
    expect(toastEl?.getAttribute('class')).toContain('border-[var(--success');
  });

  it('warning variant has correct border class', () => {
    const { container } = render(
      <RoboToastProvider>
        <RoboToast variant='warning' open>
          <RoboToastTitle>Warning</RoboToastTitle>
        </RoboToast>
        <RoboToastViewport />
      </RoboToastProvider>
    );
    const toastEl = container.querySelector('li[data-state="open"]');
    expect(toastEl?.getAttribute('class')).toContain('border-[var(--warning');
  });

  it('error variant has correct border class', () => {
    const { container } = render(
      <RoboToastProvider>
        <RoboToast variant='error' open>
          <RoboToastTitle>Error</RoboToastTitle>
        </RoboToast>
        <RoboToastViewport />
      </RoboToastProvider>
    );
    const toastEl = container.querySelector('li[data-state="open"]');
    expect(toastEl?.getAttribute('class')).toContain('border-[var(--destructive)]');
  });
});

// ---------------------------------------------------------------------------
// RoboToastViewport
// ---------------------------------------------------------------------------
describe('RoboToastViewport', () => {
  it('viewport ol element has no a11y violations', async () => {
    // Radix Toast renders two role="region" wrappers (live announcer + viewport)
    // which axe flags as landmark-unique on the full container.
    // We scope axe to just the ol (the styled viewport list) to verify our
    // RoboToastViewport classes are accessible.
    const { container } = render(
      <RoboToastProvider>
        <RoboToastViewport />
      </RoboToastProvider>
    );
    const ol = container.querySelector('ol');
    expect(ol).not.toBeNull();
    expect(await axe(ol as HTMLElement)).toHaveNoViolations();
  });
});

// ---------------------------------------------------------------------------
// RoboToastClose
// ---------------------------------------------------------------------------
describe('RoboToastClose', () => {
  it('has aria-label "Close notification"', () => {
    render(
      <RoboToastProvider>
        <RoboToast open>
          <RoboToastTitle>Title</RoboToastTitle>
          <RoboToastClose />
        </RoboToast>
        <RoboToastViewport />
      </RoboToastProvider>
    );
    expect(
      screen.getByRole('button', { name: /close notification/i })
    ).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Sub-components displayName
// ---------------------------------------------------------------------------
describe('displayName', () => {
  it('RoboToastViewport', () => expect(RoboToastViewport.displayName).toBe('RoboToastViewport'));
  it('RoboToast', () => expect(RoboToast.displayName).toBe('RoboToast'));
  it('RoboToastTitle', () => expect(RoboToastTitle.displayName).toBe('RoboToastTitle'));
  it('RoboToastDescription', () => expect(RoboToastDescription.displayName).toBe('RoboToastDescription'));
  it('RoboToastClose', () => expect(RoboToastClose.displayName).toBe('RoboToastClose'));
});
