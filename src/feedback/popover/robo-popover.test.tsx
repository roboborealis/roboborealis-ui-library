import * as React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import {
  RoboPopover,
  RoboPopoverTrigger,
  RoboPopoverContent,
  RoboPopoverClose,
} from './robo-popover';


// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------

function BasicPopover() {
  return (
    <RoboPopover>
      <RoboPopoverTrigger asChild>
        <button>Open popover</button>
      </RoboPopoverTrigger>
      <RoboPopoverContent>
        <p>Popover body content</p>
        <RoboPopoverClose asChild>
          <button>Close</button>
        </RoboPopoverClose>
      </RoboPopoverContent>
    </RoboPopover>
  );
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('RoboPopover', () => {
  it('trigger renders in the document', () => {
    render(<BasicPopover />);
    expect(screen.getByRole('button', { name: /open popover/i })).toBeInTheDocument();
  });

  it('popover content is not visible before trigger click', () => {
    render(<BasicPopover />);
    expect(screen.queryByText('Popover body content')).not.toBeInTheDocument();
  });

  it('opens when trigger is clicked', async () => {
    render(<BasicPopover />);
    await userEvent.click(screen.getByRole('button', { name: /open popover/i }));
    await waitFor(() => {
      expect(screen.getByText('Popover body content')).toBeInTheDocument();
    });
  });

  it('closes when ESC is pressed while open', async () => {
    render(<BasicPopover />);
    await userEvent.click(screen.getByRole('button', { name: /open popover/i }));
    await waitFor(() => {
      expect(screen.getByText('Popover body content')).toBeInTheDocument();
    });
    await userEvent.keyboard('{Escape}');
    await waitFor(() => {
      expect(screen.queryByText('Popover body content')).not.toBeInTheDocument();
    });
  });

  it('closes when RoboPopoverClose is clicked', async () => {
    render(<BasicPopover />);
    await userEvent.click(screen.getByRole('button', { name: /open popover/i }));
    await waitFor(() => {
      expect(screen.getByText('Popover body content')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByRole('button', { name: /^close$/i }));
    await waitFor(() => {
      expect(screen.queryByText('Popover body content')).not.toBeInTheDocument();
    });
  });

  it('applies correct classes to content', async () => {
    render(<BasicPopover />);
    await userEvent.click(screen.getByRole('button', { name: /open popover/i }));
    await waitFor(() => {
      const content = screen.getByText('Popover body content').closest('div');
      expect(content?.className).toContain('bg-[var(--card)]');
      expect(content?.className).toContain('border-[var(--border)]');
    });
  });

  it('RoboPopoverContent has displayName', () => {
    expect(RoboPopoverContent.displayName).toBe('RoboPopoverContent');
  });

  it('no a11y violations when popover is open', async () => {
    const { container } = render(
      <RoboPopover open>
        <RoboPopoverTrigger asChild>
          <button>Open</button>
        </RoboPopoverTrigger>
        <RoboPopoverContent>
          <p>Content inside popover</p>
        </RoboPopoverContent>
      </RoboPopover>
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('no a11y violations when closed', async () => {
    const { container } = render(<BasicPopover />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
