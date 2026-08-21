import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { cva, type VariantProps } from 'class-variance-authority';
import { X } from 'lucide-react';

import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Size variants for the dialog content panel
// ---------------------------------------------------------------------------

const dialogContentVariants = cva(
  'fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%] bg-[var(--card)] rounded-lg shadow-xl border border-[var(--border)] p-6 w-full',
  {
    variants: {
      size: {
        sm: 'max-w-sm',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        full: 'max-w-[calc(100vw-2rem)]',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

export const DIALOG_SIZES = ['sm', 'md', 'lg', 'full'] as const;
export type DialogSize = typeof DIALOG_SIZES[number];

// ---------------------------------------------------------------------------
// Primitives
// ---------------------------------------------------------------------------

/** Root dialog — controls open/closed state. */
const RoboDialog = DialogPrimitive.Root;
RoboDialog.displayName = 'RoboDialog';

/** Trigger element that opens the dialog on click. */
const RoboDialogTrigger = DialogPrimitive.Trigger;
RoboDialogTrigger.displayName = 'RoboDialogTrigger';

/** Close element that closes the dialog. */
const RoboDialogClose = DialogPrimitive.Close;
RoboDialogClose.displayName = 'RoboDialogClose';

// ---------------------------------------------------------------------------
// RoboDialogContent
// ---------------------------------------------------------------------------

export interface RoboDialogContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,
    VariantProps<typeof dialogContentVariants> {
  ref?: React.Ref<React.ComponentRef<typeof DialogPrimitive.Content>>;
  /**
   * Whether to render the close (X) button in the top-right. Defaults to `true`.
   *
   * Set `false` for a dialog the user must not dismiss — a consent gate, a
   * blocking error, a required step. Such a dialog is typically rendered with
   * `open` controlled and no `onOpenChange`, which leaves the X wired to a
   * handler that does nothing: it draws focus, takes a tab stop, shows a focus
   * ring, and silently does nothing when activated. That is worse than having no
   * button at all, and there was previously no way to remove it.
   */
  showCloseButton?: boolean;
}

/**
 * RoboDialogContent — the visible panel rendered inside the overlay.
 *
 * Includes a close (X) button in the top-right corner unless `showCloseButton`
 * is `false`.
 * Radix handles: focus trap, ESC close, `aria-modal`, `aria-labelledby`, `aria-describedby`.
 *
 * **Fully non-dismissible dialogs** need more than `showCloseButton={false}`, because
 * Radix also closes on Escape and on a click outside. Combine all three:
 *
 * ```tsx
 * <RoboDialogContent
 *   showCloseButton={false}
 *   onEscapeKeyDown={(e) => e.preventDefault()}
 *   onPointerDownOutside={(e) => e.preventDefault()}
 * >
 * ```
 *
 * (A dialog whose `open` is controlled with no `onOpenChange` already ignores those
 * two paths, since there is no handler to move the state — but relying on that is
 * implicit, and it breaks the moment someone wires `onOpenChange` up.)
 */
function RoboDialogContent({
  className,
  size,
  children,
  ref,
  showCloseButton = true,
  ...props
}: RoboDialogContentProps) {
  return (
    <DialogPrimitive.Portal>
      {/* Overlay */}
      <DialogPrimitive.Overlay
        className='fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 duration-[var(--duration-normal)]'
      />
      {/* Content */}
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          dialogContentVariants({ size }),
          'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 duration-[var(--duration-normal)]',
          className
        )}
        {...props}
      >
        {children}
        {/* Default close button in top-right — omitted entirely for a mandatory dialog,
            rather than hidden, so it takes no tab stop and is invisible to screen readers. */}
        {showCloseButton ? (
          <DialogPrimitive.Close
            aria-label='Close dialog'
            className='absolute right-4 top-4 rounded opacity-70 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 transition-opacity'
          >
            <X className='h-4 w-4' aria-hidden='true' />
          </DialogPrimitive.Close>
        ) : null}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}
RoboDialogContent.displayName = 'RoboDialogContent';

// ---------------------------------------------------------------------------
// Layout sub-components
// ---------------------------------------------------------------------------

/** Header section — wraps title and optional description. */
function RoboDialogHeader({
  className,
  ref,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> }) {
  return (
    <div
      ref={ref}
      className={cn('mb-4 flex flex-col gap-1', className)}
      {...props}
    />
  );
}
RoboDialogHeader.displayName = 'RoboDialogHeader';

/** Title of the dialog — announced to screen readers via `aria-labelledby`. */
function RoboDialogTitle({
  className,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title> & {
  ref?: React.Ref<React.ComponentRef<typeof DialogPrimitive.Title>>;
}) {
  return (
    <DialogPrimitive.Title
      ref={ref}
      className={cn('text-lg font-semibold text-[var(--foreground)]', className)}
      {...props}
    />
  );
}
RoboDialogTitle.displayName = 'RoboDialogTitle';

/** Description / body of the dialog — referenced via `aria-describedby`. */
function RoboDialogDescription({
  className,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description> & {
  ref?: React.Ref<React.ComponentRef<typeof DialogPrimitive.Description>>;
}) {
  return (
    <DialogPrimitive.Description
      ref={ref}
      className={cn('text-sm text-[var(--muted-foreground)]', className)}
      {...props}
    />
  );
}
RoboDialogDescription.displayName = 'RoboDialogDescription';

/** Footer section — wraps action buttons. */
function RoboDialogFooter({
  className,
  ref,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> }) {
  return (
    <div
      ref={ref}
      className={cn('mt-6 flex justify-end gap-3', className)}
      {...props}
    />
  );
}
RoboDialogFooter.displayName = 'RoboDialogFooter';

export {
  RoboDialog,
  RoboDialogTrigger,
  RoboDialogContent,
  RoboDialogHeader,
  RoboDialogTitle,
  RoboDialogDescription,
  RoboDialogFooter,
  RoboDialogClose,
  dialogContentVariants,
};
