import * as React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import {
  RoboTooltipProvider,
  RoboTooltip,
  RoboTooltipTrigger,
  RoboTooltipContent,
  DEFAULT_TOOLTIP_DELAY_MS,
} from './robo-tooltip';


// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------

function BasicTooltip({ content = 'Tooltip text', delayDuration = 0 }) {
  return (
    <RoboTooltipProvider delayDuration={delayDuration}>
      <RoboTooltip>
        <RoboTooltipTrigger asChild>
          <button>Hover me</button>
        </RoboTooltipTrigger>
        <RoboTooltipContent>{content}</RoboTooltipContent>
      </RoboTooltip>
    </RoboTooltipProvider>
  );
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('RoboTooltip', () => {
  it('trigger renders in the document', () => {
    render(<BasicTooltip />);
    expect(screen.getByRole('button', { name: /hover me/i })).toBeInTheDocument();
  });

  it('tooltip content is not visible before hover', () => {
    render(<BasicTooltip />);
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('tooltip content becomes visible after hover', async () => {
    render(<BasicTooltip />);
    await userEvent.hover(screen.getByRole('button', { name: /hover me/i }));
    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });
  });

  it('tooltip content has the correct text', async () => {
    render(<BasicTooltip content='Satellite info' />);
    await userEvent.hover(screen.getByRole('button', { name: /hover me/i }));
    await waitFor(() => {
      // Radix renders tooltip text twice (visible + hidden sr span); use getAllByText
      const matches = screen.getAllByText('Satellite info');
      expect(matches.length).toBeGreaterThan(0);
    });
  });

  it('tooltip content has role="tooltip"', async () => {
    render(<BasicTooltip />);
    await userEvent.hover(screen.getByRole('button', { name: /hover me/i }));
    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });
  });

  it('applies correct bg class to content', async () => {
    render(<BasicTooltip />);
    await userEvent.hover(screen.getByRole('button', { name: /hover me/i }));
    await waitFor(() => {
      // The visible content div is the parent of the hidden role="tooltip" span
      // Query the popper content wrapper's first child div which has our classes
      const contentDiv = document.querySelector('[data-radix-popper-content-wrapper] > div');
      expect(contentDiv?.getAttribute('class')).toContain('bg-[var(--foreground)]');
      expect(contentDiv?.getAttribute('class')).toContain('text-[var(--background)]');
    });
  });

  it('RoboTooltipContent has displayName', () => {
    expect(RoboTooltipContent.displayName).toBe('RoboTooltipContent');
  });

  it('defaults delayDuration to 150ms when not overridden', () => {
    expect(DEFAULT_TOOLTIP_DELAY_MS).toBe(150);
  });

  it('no a11y violations when tooltip is visible', async () => {
    const { container } = render(
      <RoboTooltipProvider delayDuration={0}>
        <RoboTooltip open>
          <RoboTooltipTrigger asChild>
            <button>Trigger</button>
          </RoboTooltipTrigger>
          <RoboTooltipContent>Tooltip content</RoboTooltipContent>
        </RoboTooltip>
      </RoboTooltipProvider>
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
