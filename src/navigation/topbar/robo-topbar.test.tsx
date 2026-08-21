import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';

import { RoboTopbar } from './robo-topbar';


describe('RoboTopbar', () => {
  it('renders a banner landmark', () => {
    render(<RoboTopbar />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('has aria-label "Top navigation"', () => {
    render(<RoboTopbar />);
    expect(screen.getByRole('banner')).toHaveAttribute('aria-label', 'Top navigation');
  });

  /*
   * The topbar painted `bg-[var(--card)]` and set no foreground, so slot content —
   * which has no colour of its own — inherited the page's text colour onto a card
   * surface. a consumer app compensated with three inline `style={{ color: … }}` on
   * individual slot children before this was fixed here.
   *
   * Asserted as a pair: a future edit that changes the surface without the text, or
   * drops the text class, fails here rather than surfacing as unreadable slot content
   * in whichever consumer notices first.
   */
  it('pairs its card surface with card-foreground text, so slots inherit a readable colour', () => {
    render(<RoboTopbar logo={<span>Acme</span>} />);

    const banner = screen.getByRole('banner');
    expect(banner).toHaveClass('bg-[var(--card)]');
    expect(banner).toHaveClass('text-[var(--card-foreground)]');
  });

  it('renders the hamburger toggle button when onMenuToggle is provided', () => {
    render(<RoboTopbar onMenuToggle={() => undefined} />);
    expect(screen.getByRole('button', { name: /toggle menu/i })).toBeInTheDocument();
  });

  it('does not render the hamburger toggle button when onMenuToggle is absent', () => {
    render(<RoboTopbar />);
    expect(screen.queryByRole('button', { name: /toggle menu/i })).not.toBeInTheDocument();
  });

  it('calls onMenuToggle when hamburger is clicked', async () => {
    const user = userEvent.setup();
    const onMenuToggle = vi.fn();
    render(<RoboTopbar onMenuToggle={onMenuToggle} />);
    await user.click(screen.getByRole('button', { name: /toggle menu/i }));
    expect(onMenuToggle).toHaveBeenCalledTimes(1);
  });

  it('labels the hamburger "Collapse sidebar" and shows PanelLeftClose when sidebarOpen is true', () => {
    render(<RoboTopbar onMenuToggle={() => undefined} sidebarOpen={true} />);
    const button = screen.getByRole('button', { name: 'Collapse sidebar' });
    expect(button.querySelector('.lucide-panel-left-close')).toBeInTheDocument();
  });

  it('labels the hamburger "Expand sidebar" and shows PanelLeftOpen when sidebarOpen is false', () => {
    render(<RoboTopbar onMenuToggle={() => undefined} sidebarOpen={false} />);
    const button = screen.getByRole('button', { name: 'Expand sidebar' });
    expect(button.querySelector('.lucide-panel-left-open')).toBeInTheDocument();
  });

  it('keeps the generic "Toggle menu" hamburger when sidebarOpen is omitted', () => {
    render(<RoboTopbar onMenuToggle={() => undefined} />);
    const button = screen.getByRole('button', { name: 'Toggle menu' });
    expect(button.querySelector('.lucide-menu')).toBeInTheDocument();
  });

  it('renders logo slot when logo prop is provided', () => {
    render(<RoboTopbar logo={<span data-testid='logo'>Logo</span>} />);
    expect(screen.getByTestId('logo')).toBeInTheDocument();
  });

  it('does not render logo slot when logo prop is absent', () => {
    render(<RoboTopbar />);
    expect(screen.queryByTestId('logo')).not.toBeInTheDocument();
  });

  it('renders navLinks when provided', () => {
    render(
      <RoboTopbar
        navLinks={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Reports', href: '/reports' },
        ]}
      />
    );
    expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /reports/i })).toBeInTheDocument();
  });

  it('renders user menu slot when userMenu prop is provided', () => {
    render(<RoboTopbar userMenu={<button type='button'>User</button>} />);
    expect(screen.getByRole('button', { name: /user/i })).toBeInTheDocument();
  });

  it('renders commandPaletteTrigger slot when provided', () => {
    render(
      <RoboTopbar
        commandPaletteTrigger={<button data-testid='cmdk-trigger'>⌘K</button>}
      />
    );
    expect(screen.getByTestId('cmdk-trigger')).toBeInTheDocument();
  });

  it('does not render commandPaletteTrigger slot when absent', () => {
    render(<RoboTopbar />);
    expect(screen.queryByTestId('cmdk-trigger')).not.toBeInTheDocument();
  });

  it('forwards ref to the header element', () => {
    const ref = React.createRef<HTMLElement>();
    render(<RoboTopbar ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLElement);
    expect(ref.current?.tagName).toBe('HEADER');
  });

  it('passes displayName', () => {
    expect(RoboTopbar.displayName).toBe('RoboTopbar');
  });

  it('passes custom className', () => {
    render(<RoboTopbar className='custom-topbar' />);
    expect(screen.getByRole('banner')).toHaveClass('custom-topbar');
  });

  it('no a11y violations with default props', async () => {
    const { container } = render(<RoboTopbar />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('no a11y violations with logo and navLinks', async () => {
    const { container } = render(
      <RoboTopbar
        logo={<span>Logo</span>}
        navLinks={[{ label: 'Home', href: '/home' }]}
        commandPaletteTrigger={<button type='button'>Search…</button>}
        userMenu={<button type='button'>Profile</button>}
      />
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
