'use client';

import * as React from 'react';
import * as ToastPrimitive from '@radix-ui/react-toast';
import { cva, type VariantProps } from 'class-variance-authority';
import { CheckCircle, AlertTriangle, XCircle, X } from 'lucide-react';

import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Variant styles
// ---------------------------------------------------------------------------

const toastVariants = cva(
  'group relative flex items-start gap-3 rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-3 shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=open]:slide-in-from-bottom-2 data-[swipe=end]:slide-out-to-right-full data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=cancel]:translate-x-0 data-[swipe=cancel]:transition-[transform_200ms_ease-out] duration-[var(--duration-normal)]',
  {
    variants: {
      variant: {
        default: '',
        success:
          'border-[var(--success)] text-[var(--success-text)]',
        warning:
          'border-[var(--warning)] text-[var(--warning-text)]',
        error:
          'border-[var(--destructive)] text-[var(--destructive)]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const variantIcons: Record<string, React.ElementType | null> = {
  default: null,
  success: CheckCircle,
  warning: AlertTriangle,
  error: XCircle,
};

// ---------------------------------------------------------------------------
// Context for useRoboToast
// ---------------------------------------------------------------------------

export interface ToastOptions {
  title: string;
  description?: string;
  variant?: 'default' | 'success' | 'warning' | 'error';
  duration?: number;
}

interface ToastItem extends ToastOptions {
  id: string;
}

interface RoboToastContextValue {
  toast: (options: ToastOptions) => void;
}

const RoboToastContext = React.createContext<RoboToastContextValue | null>(null);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

type SwipeDirection = 'up' | 'down' | 'left' | 'right';

export interface RoboToastProviderProps {
  children: React.ReactNode;
  /** Swipe direction to dismiss (default: "right") */
  swipeDirection?: SwipeDirection;
  /** Maximum number of visible toasts (default: 3) */
  maxToasts?: number;
}

/**
 * RoboToastProvider — wraps the app and provides the `useRoboToast` context.
 *
 * Must be placed near the root of your component tree.
 */
function RoboToastProvider({
  children,
  swipeDirection = 'right',
  maxToasts = 3,
}: RoboToastProviderProps) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);

  const toast = React.useCallback((options: ToastOptions) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setToasts((prev) => [...prev.slice(-(maxToasts - 1)), { ...options, id }]);
  }, [maxToasts]);

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <RoboToastContext.Provider value={{ toast }}>
      <ToastPrimitive.Provider swipeDirection={swipeDirection}>
        {children}
        {toasts.map((t) => (
          <RoboToast
            key={t.id}
            variant={t.variant ?? 'default'}
            duration={t.duration ?? 5000}
            onOpenChange={(open) => {
              if (!open) removeToast(t.id);
            }}
          >
            <div className='flex flex-col gap-0.5 flex-1 min-w-0'>
              {t.title && <RoboToastTitle>{t.title}</RoboToastTitle>}
              {t.description && (
                <RoboToastDescription>{t.description}</RoboToastDescription>
              )}
            </div>
            <RoboToastClose />
          </RoboToast>
        ))}
        <RoboToastViewport />
      </ToastPrimitive.Provider>
    </RoboToastContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// useRoboToast hook
// ---------------------------------------------------------------------------

/**
 * useRoboToast — returns a `toast()` function to imperatively show toasts.
 *
 * Must be used inside `<RoboToastProvider>`.
 *
 * @example
 * ```tsx
 * const { toast } = useRoboToast();
 * toast({ title: 'Saved!', variant: 'success' });
 * ```
 */
function useRoboToast(): RoboToastContextValue {
  const ctx = React.useContext(RoboToastContext);
  if (!ctx) {
    throw new Error('useRoboToast must be used inside <RoboToastProvider>');
  }
  return ctx;
}

// ---------------------------------------------------------------------------
// Primitive re-exports with styling
// ---------------------------------------------------------------------------

/** Viewport — fixed position container where toasts are rendered. */
function RoboToastViewport({
  className,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<typeof ToastPrimitive.Viewport> & {
  ref?: React.Ref<React.ComponentRef<typeof ToastPrimitive.Viewport>>;
}) {
  return (
    <ToastPrimitive.Viewport
      ref={ref}
      className={cn(
        'fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-[380px] max-w-[calc(100vw-2rem)]',
        className
      )}
      {...props}
    />
  );
}
RoboToastViewport.displayName = 'RoboToastViewport';

/** Individual toast message. */
function RoboToast({
  className,
  variant,
  children,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<typeof ToastPrimitive.Root> &
  VariantProps<typeof toastVariants> & {
    ref?: React.Ref<React.ComponentRef<typeof ToastPrimitive.Root>>;
  }) {
  const Icon = variantIcons[variant ?? 'default'];
  return (
    <ToastPrimitive.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    >
      {Icon && <Icon className='h-5 w-5 shrink-0 mt-0.5' aria-hidden='true' />}
      {children}
    </ToastPrimitive.Root>
  );
}
RoboToast.displayName = 'RoboToast';

/** Toast title. */
function RoboToastTitle({
  className,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<typeof ToastPrimitive.Title> & {
  ref?: React.Ref<React.ComponentRef<typeof ToastPrimitive.Title>>;
}) {
  return (
    <ToastPrimitive.Title
      ref={ref}
      className={cn('text-sm font-semibold text-[var(--foreground)]', className)}
      {...props}
    />
  );
}
RoboToastTitle.displayName = 'RoboToastTitle';

/** Toast description / body text. */
function RoboToastDescription({
  className,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<typeof ToastPrimitive.Description> & {
  ref?: React.Ref<React.ComponentRef<typeof ToastPrimitive.Description>>;
}) {
  return (
    <ToastPrimitive.Description
      ref={ref}
      className={cn('text-xs text-[var(--muted-foreground)]', className)}
      {...props}
    />
  );
}
RoboToastDescription.displayName = 'RoboToastDescription';

/** Toast close (dismiss) button. */
function RoboToastClose({
  className,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<typeof ToastPrimitive.Close> & {
  ref?: React.Ref<React.ComponentRef<typeof ToastPrimitive.Close>>;
}) {
  return (
    <ToastPrimitive.Close
      ref={ref}
      aria-label='Close notification'
      className={cn(
        'shrink-0 ml-auto -mt-0.5 rounded opacity-70 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] transition-opacity',
        className
      )}
      {...props}
    >
      <X className='h-4 w-4' aria-hidden='true' />
    </ToastPrimitive.Close>
  );
}
RoboToastClose.displayName = 'RoboToastClose';

/** Toast action button (e.g. "Undo"). */
function RoboToastAction({
  className,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<typeof ToastPrimitive.Action> & {
  ref?: React.Ref<React.ComponentRef<typeof ToastPrimitive.Action>>;
}) {
  return (
    <ToastPrimitive.Action
      ref={ref}
      className={cn(
        'shrink-0 rounded border border-[var(--border)] px-3 py-1 text-xs font-medium hover:bg-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] transition-colors',
        className
      )}
      {...props}
    />
  );
}
RoboToastAction.displayName = 'RoboToastAction';

export {
  RoboToastProvider,
  RoboToastViewport,
  RoboToast,
  RoboToastTitle,
  RoboToastDescription,
  RoboToastClose,
  RoboToastAction,
  useRoboToast,
  toastVariants,
};
