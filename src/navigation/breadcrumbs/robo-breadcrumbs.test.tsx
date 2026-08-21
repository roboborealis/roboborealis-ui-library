import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';

import { RoboBreadcrumbs } from './robo-breadcrumbs';
import type { RoboBreadcrumbItem } from './robo-breadcrumbs';


const threeItems: RoboBreadcrumbItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Reports', href: '/reports' },
  { label: 'Annual Report' },
];

const manyItems: RoboBreadcrumbItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Section', href: '/section' },
  { label: 'Sub Section', href: '/section/sub' },
  { label: 'Page', href: '/section/sub/page' },
  { label: 'Detail' },
];

describe('RoboBreadcrumbs', () => {
  it('has role="navigation" with aria-label="Breadcrumb"', () => {
    render(<RoboBreadcrumbs items={threeItems} />);
    expect(screen.getByRole('navigation', { name: /breadcrumb/i })).toBeInTheDocument();
  });

  it('renders all items when within maxItems (default 4)', () => {
    render(<RoboBreadcrumbs items={threeItems} />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Reports')).toBeInTheDocument();
    expect(screen.getByText('Annual Report')).toBeInTheDocument();
  });

  it('last item has aria-current="page"', () => {
    render(<RoboBreadcrumbs items={threeItems} />);
    const lastItem = screen.getByText('Annual Report');
    expect(lastItem).toHaveAttribute('aria-current', 'page');
  });

  it('non-last items do not have aria-current', () => {
    render(<RoboBreadcrumbs items={threeItems} />);
    const homeLink = screen.getByRole('link', { name: /home/i });
    expect(homeLink).not.toHaveAttribute('aria-current');
  });

  it('renders links for items with href', () => {
    render(<RoboBreadcrumbs items={threeItems} />);
    expect(screen.getByRole('link', { name: /home/i })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: /reports/i })).toHaveAttribute('href', '/reports');
  });

  it('does not render a link for the last item', () => {
    render(<RoboBreadcrumbs items={threeItems} />);
    // Last item "Annual Report" has no link
    const links = screen.getAllByRole('link');
    const hrefs = links.map((l) => l.getAttribute('href'));
    expect(hrefs).not.toContain(undefined);
    // The "Annual Report" text should NOT be a link
    const annualSpan = screen.getByText('Annual Report');
    expect(annualSpan.tagName).not.toBe('A');
  });

  it('collapses middle items when items exceed maxItems', () => {
    render(<RoboBreadcrumbs items={manyItems} maxItems={4} />);
    // First and last always shown
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Detail')).toBeInTheDocument();
    // The "..." collapse button should be visible
    expect(screen.getByRole('button', { name: /show hidden breadcrumbs/i })).toBeInTheDocument();
    // Middle items should NOT be visible initially
    expect(screen.queryByText('Section')).not.toBeInTheDocument();
  });

  it('shows collapsed items in dropdown when "..." is clicked', async () => {
    const user = userEvent.setup();
    render(<RoboBreadcrumbs items={manyItems} maxItems={4} />);
    await user.click(screen.getByRole('button', { name: /show hidden breadcrumbs/i }));
    expect(await screen.findByText('Section')).toBeInTheDocument();
    expect(screen.getByText('Sub Section')).toBeInTheDocument();
    expect(screen.getByText('Page')).toBeInTheDocument();
  });

  it('shows all items when count equals maxItems', () => {
    const fourItems: RoboBreadcrumbItem[] = [
      { label: 'A', href: '/a' },
      { label: 'B', href: '/b' },
      { label: 'C', href: '/c' },
      { label: 'D' },
    ];
    render(<RoboBreadcrumbs items={fourItems} maxItems={4} />);
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('B')).toBeInTheDocument();
    expect(screen.getByText('C')).toBeInTheDocument();
    expect(screen.getByText('D')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /show hidden/i })).not.toBeInTheDocument();
  });

  it('handles single item (shows as current page)', () => {
    render(<RoboBreadcrumbs items={[{ label: 'Home' }]} />);
    expect(screen.getByText('Home')).toHaveAttribute('aria-current', 'page');
  });

  it('forwards ref to nav element', () => {
    const ref = React.createRef<HTMLElement>();
    render(<RoboBreadcrumbs items={threeItems} ref={ref} />);
    expect(ref.current?.tagName).toBe('NAV');
  });

  it('passes displayName', () => {
    expect(RoboBreadcrumbs.displayName).toBe('RoboBreadcrumbs');
  });

  it('no a11y violations for basic items', async () => {
    const { container } = render(<RoboBreadcrumbs items={threeItems} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('no a11y violations with many items (collapsed)', async () => {
    const { container } = render(<RoboBreadcrumbs items={manyItems} maxItems={4} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
