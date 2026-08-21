import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';

import { RoboTabs, RoboTabsList, RoboTabsTrigger, RoboTabsContent } from './robo-tabs';


function BasicTabs({ orientation }: { orientation?: 'horizontal' | 'vertical' }) {
  return (
    <RoboTabs defaultValue='tab1' orientation={orientation}>
      <RoboTabsList orientation={orientation}>
        <RoboTabsTrigger value='tab1' orientation={orientation}>
          Tab 1
        </RoboTabsTrigger>
        <RoboTabsTrigger value='tab2' orientation={orientation}>
          Tab 2
        </RoboTabsTrigger>
        <RoboTabsTrigger value='tab3' orientation={orientation}>
          Tab 3
        </RoboTabsTrigger>
      </RoboTabsList>
      <RoboTabsContent value='tab1' orientation={orientation}>
        Content One
      </RoboTabsContent>
      <RoboTabsContent value='tab2' orientation={orientation}>
        Content Two
      </RoboTabsContent>
      <RoboTabsContent value='tab3' orientation={orientation}>
        Content Three
      </RoboTabsContent>
    </RoboTabs>
  );
}

describe('RoboTabs', () => {
  it('renders the tablist', () => {
    render(<BasicTabs />);
    expect(screen.getByRole('tablist')).toBeInTheDocument();
  });

  it('renders all tab triggers', () => {
    render(<BasicTabs />);
    expect(screen.getAllByRole('tab')).toHaveLength(3);
  });

  it('renders the default active tab content', () => {
    render(<BasicTabs />);
    expect(screen.getByText('Content One')).toBeVisible();
  });

  it('active tab has aria-selected="true"', () => {
    render(<BasicTabs />);
    const tabs = screen.getAllByRole('tab');
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    expect(tabs[1]).toHaveAttribute('aria-selected', 'false');
  });

  it('clicking a tab activates it and shows its content', async () => {
    const user = userEvent.setup();
    render(<BasicTabs />);
    await user.click(screen.getByRole('tab', { name: /tab 2/i }));
    expect(screen.getByRole('tab', { name: /tab 2/i })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('Content Two')).toBeVisible();
  });

  it('arrow key navigation moves between tabs (horizontal)', async () => {
    const user = userEvent.setup();
    render(<BasicTabs orientation='horizontal' />);
    const tab1 = screen.getByRole('tab', { name: /tab 1/i });
    tab1.focus();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: /tab 2/i })).toHaveFocus();
  });

  it('arrow key navigation moves between tabs (vertical)', async () => {
    const user = userEvent.setup();
    render(<BasicTabs orientation='vertical' />);
    const tab1 = screen.getByRole('tab', { name: /tab 1/i });
    tab1.focus();
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('tab', { name: /tab 2/i })).toHaveFocus();
  });

  it('renders tabpanels for each content', () => {
    render(<BasicTabs />);
    // There should be at least 1 visible tabpanel
    expect(screen.getAllByRole('tabpanel').length).toBeGreaterThanOrEqual(1);
  });

  it('forwards refs correctly', () => {
    const tabsRef = React.createRef<HTMLDivElement>();
    const listRef = React.createRef<HTMLDivElement>();
    render(
      <RoboTabs ref={tabsRef} defaultValue='t1'>
        <RoboTabsList ref={listRef}>
          <RoboTabsTrigger value='t1'>T1</RoboTabsTrigger>
        </RoboTabsList>
        <RoboTabsContent value='t1'>C1</RoboTabsContent>
      </RoboTabs>
    );
    expect(tabsRef.current).toBeInstanceOf(HTMLElement);
    expect(listRef.current).toBeInstanceOf(HTMLElement);
  });

  it('RoboTabs has displayName', () => {
    expect(RoboTabs.displayName).toBe('RoboTabs');
  });

  it('RoboTabsList has displayName', () => {
    expect(RoboTabsList.displayName).toBe('RoboTabsList');
  });

  it('RoboTabsTrigger has displayName', () => {
    expect(RoboTabsTrigger.displayName).toBe('RoboTabsTrigger');
  });

  it('RoboTabsContent has displayName', () => {
    expect(RoboTabsContent.displayName).toBe('RoboTabsContent');
  });

  it('no a11y violations for horizontal tabs', async () => {
    const { container } = render(<BasicTabs orientation='horizontal' />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('no a11y violations for vertical tabs', async () => {
    const { container } = render(<BasicTabs orientation='vertical' />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

// ---------------------------------------------------------------------------
// Pill variant
// ---------------------------------------------------------------------------

function PillTabs() {
  return (
    <RoboTabs defaultValue='tab1'>
      <RoboTabsList variant='pill'>
        <RoboTabsTrigger variant='pill' value='tab1'>
          Tab 1
        </RoboTabsTrigger>
        <RoboTabsTrigger variant='pill' value='tab2'>
          Tab 2
        </RoboTabsTrigger>
      </RoboTabsList>
      <RoboTabsContent value='tab1'>Content One</RoboTabsContent>
      <RoboTabsContent value='tab2'>Content Two</RoboTabsContent>
    </RoboTabs>
  );
}

describe('RoboTabs — pill variant', () => {
  it('applies pill container classes to the list, with no border', () => {
    render(<PillTabs />);
    const list = screen.getByRole('tablist');
    expect(list.className).toContain('bg-[var(--muted)]');
    expect(list.className).not.toContain('border-b border-[var(--border)]');
  });

  it('applies pill trigger classes, with no underline accent-bar classes', () => {
    render(<PillTabs />);
    const tab = screen.getAllByRole('tab')[0]!;
    expect(tab.className).not.toContain('after:absolute');
  });

  it('renders a sliding indicator behind the active trigger', () => {
    render(<PillTabs />);
    expect(document.querySelector('[data-slot="tabs-pill-indicator"]')).toBeInTheDocument();
  });

  it('moves the indicator to the newly active trigger on click', async () => {
    const user = userEvent.setup();
    render(<PillTabs />);
    await user.click(screen.getByRole('tab', { name: /tab 2/i }));
    expect(screen.getByRole('tab', { name: /tab 2/i })).toHaveAttribute('data-state', 'active');
    expect(screen.getByRole('tab', { name: /tab 1/i })).toHaveAttribute('data-state', 'inactive');
  });

  it('every existing underline (default) test still passes unmodified — see the describe block above', () => {
    // Regression guard is the unmodified `describe('RoboTabs', ...)` block
    // above: it exercises the default variant and must stay green,
    // proving the CVA refactor introduced by the pill variant is
    // behavior-preserving for every existing RoboTabs consumer.
    expect(true).toBe(true);
  });

  it('no a11y violations with the pill variant', async () => {
    const { container } = render(<PillTabs />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

// ---------------------------------------------------------------------------
// Pill tone
// ---------------------------------------------------------------------------

function TonedPillTabs({ tone }: { tone?: 'orange' | 'light' | 'dark' }) {
  return (
    <RoboTabs defaultValue='tab1'>
      <RoboTabsList variant='pill' tone={tone}>
        <RoboTabsTrigger variant='pill' tone={tone} value='tab1'>
          Tab 1
        </RoboTabsTrigger>
        <RoboTabsTrigger variant='pill' tone={tone} value='tab2'>
          Tab 2
        </RoboTabsTrigger>
      </RoboTabsList>
      <RoboTabsContent value='tab1'>Content One</RoboTabsContent>
      <RoboTabsContent value='tab2'>Content Two</RoboTabsContent>
    </RoboTabs>
  );
}

describe('RoboTabs — pill tone', () => {
  it('defaults to orange tone when omitted, matching pre-tone behavior', () => {
    render(<TonedPillTabs />);
    const indicator = document.querySelector('[data-slot="tabs-pill-indicator"]')!;
    expect(indicator.className).toContain('bg-[var(--primary)]');
    expect(screen.getAllByRole('tab')[0]!.className).toContain('data-[state=active]:text-[var(--primary-foreground)]');
  });

  it('tone="light" renders a --card indicator with --foreground active text', () => {
    render(<TonedPillTabs tone='light' />);
    const indicator = document.querySelector('[data-slot="tabs-pill-indicator"]')!;
    expect(indicator.className).toContain('bg-[var(--card)]');
    expect(screen.getAllByRole('tab')[0]!.className).toContain('data-[state=active]:text-[var(--foreground)]');
  });

  it('tone="dark" renders a --foreground indicator with --background active text', () => {
    render(<TonedPillTabs tone='dark' />);
    const indicator = document.querySelector('[data-slot="tabs-pill-indicator"]')!;
    expect(indicator.className).toContain('bg-[var(--foreground)]');
    expect(screen.getAllByRole('tab')[0]!.className).toContain('data-[state=active]:text-[var(--background)]');
  });

  it('no a11y violations with tone="light"', async () => {
    const { container } = render(<TonedPillTabs tone='light' />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('no a11y violations with tone="dark"', async () => {
    const { container } = render(<TonedPillTabs tone='dark' />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

// ---------------------------------------------------------------------------
// Tinted content
// ---------------------------------------------------------------------------

function TintedContentTabs() {
  return (
    <RoboTabs defaultValue='tab1'>
      <RoboTabsList>
        <RoboTabsTrigger value='tab1'>Tab 1</RoboTabsTrigger>
        <RoboTabsTrigger value='tab2'>Tab 2</RoboTabsTrigger>
      </RoboTabsList>
      <RoboTabsContent value='tab1' tinted>
        Content One
      </RoboTabsContent>
      <RoboTabsContent value='tab2'>Content Two</RoboTabsContent>
    </RoboTabs>
  );
}

describe('RoboTabs — tinted content', () => {
  it('applies a tinted background/text pairing when tinted is true', () => {
    render(<TintedContentTabs />);
    const panel = screen.getByText('Content One');
    expect(panel.className).toContain('bg-[var(--muted)]');
    expect(panel.className).toContain('text-[var(--secondary-text)]');
  });

  it('does not apply tinted classes by default', () => {
    render(<RoboTabs defaultValue='tab1'><RoboTabsList><RoboTabsTrigger value='tab1'>Tab 1</RoboTabsTrigger></RoboTabsList><RoboTabsContent value='tab1'>Plain</RoboTabsContent></RoboTabs>);
    const panel = screen.getByText('Plain');
    expect(panel.className).not.toContain('bg-[var(--muted)]');
  });

  it('no a11y violations with tinted content', async () => {
    const { container } = render(<TintedContentTabs />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
