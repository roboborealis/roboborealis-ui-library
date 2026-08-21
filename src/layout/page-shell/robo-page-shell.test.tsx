import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';

import { RoboPageShell } from './robo-page-shell';


describe('RoboPageShell', () => {
  it('renders children in main content area', () => {
    render(<RoboPageShell>Page content</RoboPageShell>);
    expect(screen.getByText('Page content')).toBeInTheDocument();
  });

  it('renders main element as the content area', () => {
    render(<RoboPageShell>Content</RoboPageShell>);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('renders sidebar slot when sidebar prop is provided', () => {
    render(
      <RoboPageShell sidebar={<div data-testid='sidebar'>Sidebar</div>}>
        Content
      </RoboPageShell>
    );
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
  });

  it('does not render sidebar slot when sidebar prop is absent', () => {
    render(<RoboPageShell>Content</RoboPageShell>);
    expect(screen.queryByTestId('sidebar')).not.toBeInTheDocument();
  });

  it('renders topbar slot when topbar prop is provided', () => {
    render(
      <RoboPageShell topbar={<div data-testid='topbar'>Topbar</div>}>
        Content
      </RoboPageShell>
    );
    expect(screen.getByTestId('topbar')).toBeInTheDocument();
  });

  it('does not render topbar slot when topbar prop is absent', () => {
    render(<RoboPageShell>Content</RoboPageShell>);
    expect(screen.queryByTestId('topbar')).not.toBeInTheDocument();
  });

  it('applies grid-cols-[auto_1fr] class when sidebar is present', () => {
    const { container } = render(
      <RoboPageShell sidebar={<div>Sidebar</div>}>Content</RoboPageShell>
    );
    const root = container.firstChild as HTMLElement;
    expect(root.className).toContain('grid-cols-[auto_1fr]');
  });

  it('applies grid-cols-1 class when sidebar is absent', () => {
    const { container } = render(<RoboPageShell>Content</RoboPageShell>);
    const root = container.firstChild as HTMLElement;
    expect(root.className).toContain('grid-cols-1');
  });

  it('applies min-h-screen class', () => {
    const { container } = render(<RoboPageShell>Content</RoboPageShell>);
    const root = container.firstChild as HTMLElement;
    expect(root.className).toContain('min-h-screen');
  });

  it('forwards ref to outer div', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<RoboPageShell ref={ref}>Content</RoboPageShell>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('passes custom className', () => {
    render(<RoboPageShell className='custom-shell'>Content</RoboPageShell>);
    const root = screen.getByText('Content').closest('[class*="custom-shell"]');
    expect(root).toBeTruthy();
  });

  it('passes displayName', () => {
    expect(RoboPageShell.displayName).toBe('RoboPageShell');
  });

  it('renders full layout with all slots', () => {
    render(
      <RoboPageShell
        sidebar={<nav data-testid='sidebar'>Sidebar</nav>}
        topbar={<header data-testid='topbar'>Topbar</header>}
      >
        <p>Main content</p>
      </RoboPageShell>
    );
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('topbar')).toBeInTheDocument();
    expect(screen.getByText('Main content')).toBeInTheDocument();
  });

  it('no a11y violations with children only', async () => {
    const { container } = render(<RoboPageShell>Content</RoboPageShell>);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('no a11y violations with sidebar and topbar', async () => {
    const { container } = render(
      <RoboPageShell
        sidebar={<nav aria-label='Main navigation'>Sidebar</nav>}
        topbar={<header role='banner' aria-label='Top navigation'>Topbar</header>}
      >
        <p>Content</p>
      </RoboPageShell>
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
