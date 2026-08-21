import * as React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import {
  RoboDialog,
  RoboDialogTrigger,
  RoboDialogContent,
  RoboDialogTitle,
  RoboDialogDescription,
  RoboDialogHeader,
  RoboDialogFooter,
  RoboDialogClose,
} from './robo-dialog';


// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function BasicDialog({ defaultOpen = false }: { defaultOpen?: boolean }) {
  return (
    <RoboDialog defaultOpen={defaultOpen}>
      <RoboDialogTrigger asChild>
        <button>Open dialog</button>
      </RoboDialogTrigger>
      <RoboDialogContent>
        <RoboDialogHeader>
          <RoboDialogTitle>Confirm action</RoboDialogTitle>
          <RoboDialogDescription>This action cannot be undone.</RoboDialogDescription>
        </RoboDialogHeader>
        <RoboDialogFooter>
          <RoboDialogClose asChild>
            <button>Cancel</button>
          </RoboDialogClose>
          <button>Confirm</button>
        </RoboDialogFooter>
      </RoboDialogContent>
    </RoboDialog>
  );
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('RoboDialog', () => {
  it('does not show dialog content by default', () => {
    render(<BasicDialog />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('opens when trigger is clicked', async () => {
    render(<BasicDialog />);
    await userEvent.click(screen.getByRole('button', { name: /open dialog/i }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('dialog element has role="dialog"', async () => {
    render(<BasicDialog />);
    await userEvent.click(screen.getByRole('button', { name: /open dialog/i }));
    // Radix manages modal semantics — check the dialog role is present
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('renders title and description when open', async () => {
    render(<BasicDialog />);
    await userEvent.click(screen.getByRole('button', { name: /open dialog/i }));
    expect(screen.getByText('Confirm action')).toBeInTheDocument();
    expect(screen.getByText('This action cannot be undone.')).toBeInTheDocument();
  });

  it('has a close (X) button with aria-label="Close dialog"', async () => {
    render(<BasicDialog />);
    await userEvent.click(screen.getByRole('button', { name: /open dialog/i }));
    expect(screen.getByRole('button', { name: /close dialog/i })).toBeInTheDocument();
  });

  it('closes when the X button is clicked', async () => {
    render(<BasicDialog />);
    await userEvent.click(screen.getByRole('button', { name: /open dialog/i }));
    await userEvent.click(screen.getByRole('button', { name: /close dialog/i }));
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  // -------------------------------------------------------------------------
  // showCloseButton — mandatory dialogs
  // -------------------------------------------------------------------------

  /**
   * A consent gate or blocking error is rendered with `open` controlled and no
   * `onOpenChange`, which left the X wired to a handler that did nothing: it took a
   * tab stop, showed a focus ring, and silently did nothing when activated. There
   * was no way to remove it. a consumer app's persistent warning shipped with exactly that.
   */
  it('omits the close button when showCloseButton is false', () => {
    render(
      <RoboDialog open>
        <RoboDialogContent showCloseButton={false}>
          <RoboDialogTitle>Mandatory notice</RoboDialogTitle>
        </RoboDialogContent>
      </RoboDialog>
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /close dialog/i })).not.toBeInTheDocument();
  });

  it('omits it from the tab order entirely, rather than hiding it visually', () => {
    render(
      <RoboDialog open>
        <RoboDialogContent showCloseButton={false}>
          <RoboDialogTitle>Mandatory notice</RoboDialogTitle>
          <button>Acknowledge</button>
        </RoboDialogContent>
      </RoboDialog>
    );

    // The only focusable control is the app's own button. A visually-hidden close
    // button would still show up here, which is the bug this prop exists to avoid.
    const focusable = screen.getAllByRole('button');
    expect(focusable).toHaveLength(1);
    expect(focusable[0]).toHaveAccessibleName('Acknowledge');
  });

  it('still renders the close button by default, so existing consumers are unaffected', () => {
    render(
      <RoboDialog open>
        <RoboDialogContent>
          <RoboDialogTitle>Ordinary dialog</RoboDialogTitle>
        </RoboDialogContent>
      </RoboDialog>
    );

    expect(screen.getByRole('button', { name: /close dialog/i })).toBeInTheDocument();
  });

  it('closes when ESC key is pressed', async () => {
    render(<BasicDialog />);
    await userEvent.click(screen.getByRole('button', { name: /open dialog/i }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('applies sm size class', () => {
    render(
      <RoboDialog defaultOpen>
        <RoboDialogContent size='sm'>
          <RoboDialogTitle>Small dialog</RoboDialogTitle>
        </RoboDialogContent>
      </RoboDialog>
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog.className).toContain('max-w-sm');
  });

  it('applies lg size class', () => {
    render(
      <RoboDialog defaultOpen>
        <RoboDialogContent size='lg'>
          <RoboDialogTitle>Large dialog</RoboDialogTitle>
        </RoboDialogContent>
      </RoboDialog>
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog.className).toContain('max-w-2xl');
  });

  it('no a11y violations when dialog is open', async () => {
    const { container } = render(
      <div>
        <RoboDialog defaultOpen>
          <RoboDialogContent>
            <RoboDialogTitle>Accessible dialog</RoboDialogTitle>
            <RoboDialogDescription>Dialog description for screen readers.</RoboDialogDescription>
          </RoboDialogContent>
        </RoboDialog>
      </div>
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has displayName RoboDialogContent', () => {
    expect(RoboDialogContent.displayName).toBe('RoboDialogContent');
  });

  it('has displayName RoboDialogTitle', () => {
    expect(RoboDialogTitle.displayName).toBe('RoboDialogTitle');
  });

  it('has displayName RoboDialogDescription', () => {
    expect(RoboDialogDescription.displayName).toBe('RoboDialogDescription');
  });

  it('has displayName RoboDialogHeader', () => {
    expect(RoboDialogHeader.displayName).toBe('RoboDialogHeader');
  });

  it('has displayName RoboDialogFooter', () => {
    expect(RoboDialogFooter.displayName).toBe('RoboDialogFooter');
  });
});
