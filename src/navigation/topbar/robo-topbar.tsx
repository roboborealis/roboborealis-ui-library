'use client';

import * as React from 'react';
import { Menu, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import { useRoboRouterAdapter } from '@/navigation/router-adapter';

/*
 * `text-[var(--card-foreground)]` pairs the text with the surface this sets.
 *
 * The topbar painted `bg-[var(--card)]` and set no foreground at all. Its own controls
 * (hamburger, nav links) colour themselves, so the gap only showed in the **slots** —
 * `logo`, `center-widget`, `command-palette-trigger`, `user-menu` — whose content
 * inherited from outside the topbar. On a page whose body text is not card-foreground,
 * slot content came out at the page's colour on a card surface. a consumer app hit this and
 * worked around it with three separate inline `style={{ color: 'var(--…)' }}` on
 * individual slot children.
 *
 * This is the library's own established pairing — surface components write
 * `bg-[var(--card)] … text-[var(--card-foreground)]` together. The topbar was the outlier.
 */
const topbarVariants = cva(
  'sticky top-0 z-40 flex items-center h-14 w-full px-4 gap-3 bg-[var(--card)] text-[var(--card-foreground)] border-b border-[var(--border)]',
  {
    variants: {
      variant: {
        default: '',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface RoboTopbarProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof topbarVariants> {
  /** Logo slot — rendered after the hamburger button */
  logo?: React.ReactNode;
  /** Navigation links rendered in the center area */
  navLinks?: Array<{ label: string; href: string }>;
  /**
   * Arbitrary content centered in the topbar. Rendered in place of the
   * center spacer — only takes effect when `navLinks` is omitted (the two
   * don't compose into one centered region together).
   */
  centerWidget?: React.ReactNode;
  /** User menu slot — rendered on the right side */
  userMenu?: React.ReactNode;
  /** Slot for a command palette (Cmd+K) trigger button, rendered before the user menu */
  commandPaletteTrigger?: React.ReactNode;
  /** Called when the hamburger menu button is clicked */
  onMenuToggle?: () => void;
  /**
   * When provided, swaps the hamburger button's generic `Menu` icon for a
   * directional `PanelLeftClose`/`PanelLeftOpen` pair — matching `RoboSidebar`'s
   * own toggle — and updates its `aria-label` to "Collapse sidebar"/"Expand
   * sidebar" accordingly. Omit to keep the generic hamburger icon and "Toggle
   * menu" label, e.g. when `onMenuToggle` drives a temporary overlay menu
   * rather than a persistent collapsible sidebar.
   */
  sidebarOpen?: boolean;
  ref?: React.Ref<HTMLElement>;
}

/**
 * RoboTopbar — sticky top navigation bar with logo, nav links, and user menu slots.
 *
 * @example
 * ```tsx
 * <RoboTopbar
 *   logo={<img src="/logo.svg" alt="Acme" />}
 *   onMenuToggle={() => setSidebarOpen(o => !o)}
 *   sidebarOpen={sidebarOpen}
 *   commandPaletteTrigger={<CommandPaletteButton />}
 *   userMenu={<UserDropdown />}
 * />
 * ```
 */
function RoboTopbar({
  className,
  variant,
  logo,
  navLinks,
  centerWidget,
  userMenu,
  commandPaletteTrigger,
  onMenuToggle,
  sidebarOpen,
  ref,
  ...props
}: RoboTopbarProps) {
  const { Link: RouterLink } = useRoboRouterAdapter();

  return (
    <header
      ref={ref}
      role='banner'
      aria-label='Top navigation'
      className={cn(topbarVariants({ variant }), className)}
      {...props}
    >
      {/* Hamburger button — only rendered when the consumer wires a handler for it */}
      {onMenuToggle && (
        <button
          type='button'
          onClick={onMenuToggle}
          aria-label={sidebarOpen === undefined ? 'Toggle menu' : sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          className={cn(
            'flex items-center justify-center w-10 h-10 rounded-md flex-shrink-0',
            'text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--accent)]',
            'transition-colors duration-[var(--duration-fast)]',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-1'
          )}
        >
          {sidebarOpen === undefined ? (
            <Menu className='w-5 h-5' />
          ) : sidebarOpen ? (
            <PanelLeftClose className='w-5 h-5' />
          ) : (
            <PanelLeftOpen className='w-5 h-5' />
          )}
        </button>
      )}

      {/* Logo slot */}
      {logo && (
        <div className='flex items-center flex-shrink-0' data-slot='logo'>
          {logo}
        </div>
      )}

      {/* Nav links — flex-1 to push user menu to the right */}
      <nav
        aria-label='Primary navigation'
        className='hidden md:flex items-center gap-1 flex-1 ml-2'
      >
        {navLinks?.map((link) => (
          <RouterLink
            key={link.href}
            to={link.href}
            className={cn(
              'px-3 py-1.5 rounded-md text-sm font-medium',
              'text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--accent)]',
              'transition-colors duration-[var(--duration-fast)]',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-1'
            )}
          >
            {link.label}
          </RouterLink>
        ))}
      </nav>

      {/* Spacer when no navLinks — also hosts `centerWidget`, if given */}
      {!navLinks && (
        <div className='flex-1 flex items-center justify-center' data-slot='center-widget'>
          {centerWidget}
        </div>
      )}

      {/* Command palette trigger slot */}
      {commandPaletteTrigger && (
        <div className='flex items-center flex-shrink-0' data-slot='command-palette-trigger'>
          {commandPaletteTrigger}
        </div>
      )}

      {/* User menu slot */}
      {userMenu && (
        <div className='flex items-center flex-shrink-0 ml-auto' data-slot='user-menu'>
          {userMenu}
        </div>
      )}
    </header>
  );
}
RoboTopbar.displayName = 'RoboTopbar';

export { RoboTopbar, topbarVariants };
