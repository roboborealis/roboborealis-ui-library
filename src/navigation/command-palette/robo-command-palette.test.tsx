import * as React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { RoboCommandPalette } from './robo-command-palette';
import type { CommandGroup } from './robo-command-palette';

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const mockSelect = vi.fn();

const groups: CommandGroup[] = [
  {
    heading: 'Navigation',
    items: [
      { id: 'dashboard', label: 'Go to Dashboard', onSelect: mockSelect },
      { id: 'satellites',   label: 'View Satellites',    description: 'All tracked satellites', onSelect: mockSelect },
    ],
  },
  {
    heading: 'Actions',
    items: [
      { id: 'new-report', label: 'New Report',   shortcut: '⌘N', onSelect: mockSelect },
      { id: 'disabled',   label: 'Disabled item', onSelect: mockSelect, disabled: true },
    ],
  },
];

function Fixture(props: Partial<React.ComponentProps<typeof RoboCommandPalette>>) {
  const [open, setOpen] = React.useState(true);
  return (
    <RoboCommandPalette
      open={open}
      onOpenChange={setOpen}
      groups={groups}
      {...props}
    />
  );
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

beforeEach(() => {
  mockSelect.mockClear();
});

describe('RoboCommandPalette', () => {
  it('renders nothing when closed', () => {
    render(<Fixture open={false} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders the dialog when open', () => {
    render(<Fixture />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('renders the search input with default placeholder', () => {
    render(<Fixture />);
    expect(screen.getByPlaceholderText('Search commands…')).toBeInTheDocument();
  });

  it('renders a custom placeholder', () => {
    render(<Fixture placeholder='Type to search…' />);
    expect(screen.getByPlaceholderText('Type to search…')).toBeInTheDocument();
  });

  it('renders all command items', () => {
    render(<Fixture />);
    expect(screen.getByText('Go to Dashboard')).toBeInTheDocument();
    expect(screen.getByText('View Satellites')).toBeInTheDocument();
    expect(screen.getByText('New Report')).toBeInTheDocument();
  });

  it('renders group headings', () => {
    render(<Fixture />);
    expect(screen.getByText('Navigation')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });

  it('renders item descriptions', () => {
    render(<Fixture />);
    expect(screen.getByText('All tracked satellites')).toBeInTheDocument();
  });

  it('renders keyboard shortcut hints', () => {
    render(<Fixture />);
    expect(screen.getByText('⌘N')).toBeInTheDocument();
  });

  it('calls onSelect and closes when an item is clicked', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(<Fixture onOpenChange={onOpenChange} />);

    await user.click(screen.getByText('Go to Dashboard'));

    expect(mockSelect).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('closes when the close button is clicked', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(<Fixture onOpenChange={onOpenChange} />);

    await user.click(screen.getByLabelText('Close command palette'));

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('closes when Escape is pressed', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(<Fixture onOpenChange={onOpenChange} />);

    await user.keyboard('{Escape}');

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('filters items when search query is typed', async () => {
    const user = userEvent.setup();
    render(<Fixture />);

    await user.type(screen.getByPlaceholderText('Search commands…'), 'satellite');

    await waitFor(() => {
      expect(screen.getByText('View Satellites')).toBeInTheDocument();
    });
    // Dashboard should be filtered out
    await waitFor(() => {
      expect(screen.queryByText('Go to Dashboard')).not.toBeInTheDocument();
    });
  });

  it('shows empty message when no items match', async () => {
    const user = userEvent.setup();
    render(<Fixture emptyMessage='Nothing here.' />);

    await user.type(screen.getByPlaceholderText('Search commands…'), 'xyzzy_no_match');

    await waitFor(() => {
      expect(screen.getByText('Nothing here.')).toBeInTheDocument();
    });
  });

  it('calls onSearch when query changes', async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();
    render(<Fixture onSearch={onSearch} />);

    await user.type(screen.getByPlaceholderText('Search commands…'), 'rep');

    expect(onSearch).toHaveBeenCalledWith(expect.stringContaining('r'));
  });

  it('renders controlled search value', () => {
    render(<Fixture searchValue='satellites' />);
    const input = screen.getByPlaceholderText('Search commands…') as HTMLInputElement;
    expect(input.value).toBe('satellites');
  });

  it('renders the keyboard navigation hints footer', () => {
    render(<Fixture />);
    // Footer contains arrow, enter, and esc hints
    expect(screen.getByText('navigate')).toBeInTheDocument();
    expect(screen.getByText('select')).toBeInTheDocument();
    expect(screen.getByText('close')).toBeInTheDocument();
  });

  it('has an accessible dialog title for screen readers', () => {
    render(<Fixture />);
    // sr-only title should still be in the DOM
    expect(screen.getByText('Command palette')).toBeInTheDocument();
  });
});
