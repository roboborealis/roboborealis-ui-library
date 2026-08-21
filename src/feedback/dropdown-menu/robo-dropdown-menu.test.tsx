import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';

import {
  RoboDropdownMenu,
  RoboDropdownMenuTrigger,
  RoboDropdownMenuContent,
  RoboDropdownMenuItem,
  RoboDropdownMenuLabel,
  RoboDropdownMenuSeparator,
} from './robo-dropdown-menu';


function Fixture({ onSelect = vi.fn(), onSignOut = vi.fn() }: { onSelect?: () => void; onSignOut?: () => void }) {
  return (
    <RoboDropdownMenu>
      <RoboDropdownMenuTrigger>Open menu</RoboDropdownMenuTrigger>
      <RoboDropdownMenuContent>
        <RoboDropdownMenuLabel>My Account</RoboDropdownMenuLabel>
        <RoboDropdownMenuSeparator />
        <RoboDropdownMenuItem onSelect={onSelect}>Settings</RoboDropdownMenuItem>
        <RoboDropdownMenuItem variant='destructive' onSelect={onSignOut}>Sign out</RoboDropdownMenuItem>
      </RoboDropdownMenuContent>
    </RoboDropdownMenu>
  );
}

describe('RoboDropdownMenu', () => {
  it('does not render menu items until opened', () => {
    render(<Fixture />);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('opens the menu when the trigger is clicked', async () => {
    const user = userEvent.setup();
    render(<Fixture />);
    await user.click(screen.getByText('Open menu'));
    expect(screen.getByRole('menu')).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Settings' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Sign out' })).toBeInTheDocument();
    expect(screen.getByText('My Account')).toBeInTheDocument();
  });

  it('calls onSelect when an item is clicked, and closes the menu', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<Fixture onSelect={onSelect} />);
    await user.click(screen.getByText('Open menu'));
    await user.click(screen.getByRole('menuitem', { name: 'Settings' }));
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('supports keyboard navigation and selection', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<Fixture onSelect={onSelect} />);
    screen.getByText('Open menu').focus();
    await user.keyboard('{Enter}');
    expect(screen.getByRole('menu')).toBeInTheDocument();
    // Radix auto-highlights the first item on open — Enter selects it directly.
    await user.keyboard('{Enter}');
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it('applies destructive styling to the Sign out item', async () => {
    const user = userEvent.setup();
    render(<Fixture />);
    await user.click(screen.getByText('Open menu'));
    expect(screen.getByRole('menuitem', { name: 'Sign out' })).toHaveClass('text-[var(--destructive)]');
  });

  it('has no accessibility violations when open', async () => {
    const user = userEvent.setup();
    const { container } = render(<Fixture />);
    await user.click(screen.getByText('Open menu'));
    expect(await axe(container)).toHaveNoViolations();
  });
});
