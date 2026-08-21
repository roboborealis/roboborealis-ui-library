import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { Home, FileText, Settings } from 'lucide-react';

import { RoboBottomNav } from './robo-bottom-nav';
import type { RoboBottomNavItem } from './robo-bottom-nav';


const baseItems: RoboBottomNavItem[] = [
  { label: 'Home', icon: <Home />, href: '/home' },
  { label: 'Reports', icon: <FileText />, href: '/reports' },
  { label: 'Settings', icon: <Settings />, href: '/settings' },
];

describe('RoboBottomNav', () => {
  it('has role="navigation" with aria-label="Bottom navigation"', () => {
    render(<RoboBottomNav items={baseItems} />);
    expect(screen.getByRole('navigation', { name: /bottom navigation/i })).toBeInTheDocument();
  });

  it('renders all nav items as links', () => {
    render(<RoboBottomNav items={baseItems} />);
    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /reports/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /settings/i })).toBeInTheDocument();
  });

  it('renders item labels', () => {
    render(<RoboBottomNav items={baseItems} />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Reports')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('marks active item with aria-current="page"', () => {
    render(<RoboBottomNav items={baseItems} activePath='/reports' />);
    const reportsLink = screen.getByRole('link', { name: /reports/i });
    expect(reportsLink).toHaveAttribute('aria-current', 'page');
  });

  it('non-active items do not have aria-current', () => {
    render(<RoboBottomNav items={baseItems} activePath='/reports' />);
    expect(screen.getByRole('link', { name: /home/i })).not.toHaveAttribute('aria-current');
    expect(screen.getByRole('link', { name: /settings/i })).not.toHaveAttribute('aria-current');
  });

  it('renders correct hrefs', () => {
    render(<RoboBottomNav items={baseItems} />);
    expect(screen.getByRole('link', { name: /home/i })).toHaveAttribute('href', '/home');
    expect(screen.getByRole('link', { name: /reports/i })).toHaveAttribute('href', '/reports');
  });

  it('links have minimum 44px touch target height via min-h class', () => {
    render(<RoboBottomNav items={baseItems} />);
    const links = screen.getAllByRole('link');
    links.forEach((link) => {
      expect(link.className).toContain('min-h-');
    });
  });

  it('forwards ref to nav element', () => {
    const ref = React.createRef<HTMLElement>();
    render(<RoboBottomNav items={baseItems} ref={ref} />);
    expect(ref.current?.tagName).toBe('NAV');
  });

  it('passes custom className', () => {
    render(<RoboBottomNav items={baseItems} className='custom-bottom-nav' />);
    expect(screen.getByRole('navigation')).toHaveClass('custom-bottom-nav');
  });

  it('renders with no items without crashing', () => {
    render(<RoboBottomNav items={[]} />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('passes displayName', () => {
    expect(RoboBottomNav.displayName).toBe('RoboBottomNav');
  });

  it('no a11y violations with default props', async () => {
    const { container } = render(<RoboBottomNav items={baseItems} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('no a11y violations with active item', async () => {
    const { container } = render(<RoboBottomNav items={baseItems} activePath='/home' />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
