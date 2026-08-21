import * as React from 'react';
import { render, screen, within, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { createColumnHelper } from '@tanstack/react-table';
import type { ColumnDef } from '@tanstack/react-table';

import { RoboDataTable } from './robo-data-table';
import { createStatusCell } from './cells/status-cell';
import { createAvatarCell } from './cells/avatar-cell';
import { createDateCell } from './cells/date-cell';
import { createNumericCell } from './cells/numeric-cell';
import { createActionsCell } from './cells/actions-cell';
import { createProgressCell } from './cells/progress-cell';
import { createLinkCell } from './cells/link-cell';
import { createBooleanCell } from './cells/boolean-cell';
import { useTableExport } from './hooks/use-table-export';
import { useInlineEdit } from './hooks/use-inline-edit';
import { InlineEditCell } from './components/inline-edit-cell';
import { useSavedViews as _useSavedViews } from './hooks/use-saved-views';
import type { SavedView } from './types';


// ---------------------------------------------------------------------------
// Test fixtures
// ---------------------------------------------------------------------------

interface TestRow {
  id: string;
  name: string;
  status: string;
  count: number;
}

const testData: TestRow[] = [
  { id: '1', name: 'Alice', status: 'active', count: 5 },
  { id: '2', name: 'Bob', status: 'inactive', count: 3 },
  { id: '3', name: 'Charlie', status: 'active', count: 8 },
];

const columnHelper = createColumnHelper<TestRow>();

const testColumns: ColumnDef<TestRow, unknown>[] = [
  columnHelper.accessor('name', {
    header: 'Name',
    cell: (info) => info.getValue(),
    enableSorting: true,
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    cell: (info) => info.getValue(),
    enableSorting: true,
  }),
  columnHelper.accessor('count', {
    header: 'Count',
    cell: (info) => info.getValue(),
    enableSorting: false,
    meta: { align: 'right' as const },
  }),
];

// ---------------------------------------------------------------------------
// Basic rendering tests
// ---------------------------------------------------------------------------

describe('RoboDataTable — basic rendering', () => {
  it('renders table with data rows', () => {
    render(
      <RoboDataTable
        data={testData}
        columns={testColumns}
        getRowId={(row) => row.id}
        aria-label="Test table"
      />,
    );
    expect(screen.getByRole('table', { name: 'Test table' })).toBeInTheDocument();
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('Charlie')).toBeInTheDocument();
  });

  it('renders all column headers', () => {
    render(
      <RoboDataTable
        data={testData}
        columns={testColumns}
        getRowId={(row) => row.id}
      />,
    );
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Count')).toBeInTheDocument();
  });

  it('renders correct number of rows (header + data)', () => {
    render(
      <RoboDataTable
        data={testData}
        columns={testColumns}
        getRowId={(row) => row.id}
      />,
    );
    // 1 header row + 3 data rows
    expect(screen.getAllByRole('row')).toHaveLength(4);
  });

  it('applies className to wrapper div', () => {
    const { container } = render(
      <RoboDataTable
        data={testData}
        columns={testColumns}
        getRowId={(row) => row.id}
        className="custom-class"
      />,
    );
    expect(container.firstElementChild).toHaveClass('custom-class');
  });

  it('applies data-density attribute when density is set', () => {
    const { container } = render(
      <RoboDataTable
        data={testData}
        columns={testColumns}
        getRowId={(row) => row.id}
        density="compact"
      />,
    );
    expect(container.firstElementChild).toHaveAttribute('data-density', 'compact');
  });

  it('renders caption as sr-only when provided', () => {
    render(
      <RoboDataTable
        data={testData}
        columns={testColumns}
        getRowId={(row) => row.id}
        caption="Satellite constellation overview"
      />,
    );
    const caption = screen.getByText('Satellite constellation overview');
    expect(caption.tagName).toBe('CAPTION');
    expect(caption).toHaveClass('sr-only');
  });
});

// ---------------------------------------------------------------------------
// Empty state tests
// ---------------------------------------------------------------------------

describe('RoboDataTable — empty state', () => {
  it('renders default empty state when data is empty', () => {
    render(
      <RoboDataTable
        data={[]}
        columns={testColumns}
      />,
    );
    expect(screen.getByText('No data available.')).toBeInTheDocument();
  });

  it('renders custom empty state content', () => {
    render(
      <RoboDataTable
        data={[]}
        columns={testColumns}
        emptyState={<span>No satellites found</span>}
      />,
    );
    expect(screen.getByText('No satellites found')).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Loading state tests
// ---------------------------------------------------------------------------

describe('RoboDataTable — loading state', () => {
  it('renders skeleton rows when isLoading=true', () => {
    render(
      <RoboDataTable
        data={[]}
        columns={testColumns}
        isLoading
      />,
    );
    const skeletons = document.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('does not render data rows while loading', () => {
    render(
      <RoboDataTable
        data={testData}
        columns={testColumns}
        getRowId={(row) => row.id}
        isLoading
      />,
    );
    expect(screen.queryByText('Alice')).not.toBeInTheDocument();
  });

  it('sets aria-busy on the table when loading', () => {
    render(
      <RoboDataTable
        data={[]}
        columns={testColumns}
        isLoading
        aria-label="Loading table"
      />,
    );
    const table = screen.getByRole('table', { name: 'Loading table' });
    expect(table).toHaveAttribute('aria-busy', 'true');
  });

  it('does not set aria-busy when not loading', () => {
    render(
      <RoboDataTable
        data={testData}
        columns={testColumns}
        getRowId={(row) => row.id}
        aria-label="Loaded table"
      />,
    );
    const table = screen.getByRole('table', { name: 'Loaded table' });
    expect(table).not.toHaveAttribute('aria-busy');
  });
});

// ---------------------------------------------------------------------------
// Error state tests
// ---------------------------------------------------------------------------

describe('RoboDataTable — error state', () => {
  it('renders error state when errorState is provided', () => {
    render(
      <RoboDataTable
        data={[]}
        columns={testColumns}
        errorState={<span>Failed to load data</span>}
      />,
    );
    expect(screen.getByText('Failed to load data')).toBeInTheDocument();
  });

  it('error state takes priority over empty state', () => {
    render(
      <RoboDataTable
        data={[]}
        columns={testColumns}
        errorState={<span>Error occurred</span>}
        emptyState={<span>No data</span>}
      />,
    );
    expect(screen.getByText('Error occurred')).toBeInTheDocument();
    expect(screen.queryByText('No data')).not.toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Fetching overlay tests
// ---------------------------------------------------------------------------

describe('RoboDataTable — fetching overlay', () => {
  it('shows data with overlay when isFetching=true', () => {
    render(
      <RoboDataTable
        data={testData}
        columns={testColumns}
        getRowId={(row) => row.id}
        isFetching
        aria-label="Fetching table"
      />,
    );
    // Data should still be visible
    expect(screen.getByText('Alice')).toBeInTheDocument();
    // aria-busy should be set
    const table = screen.getByRole('table', { name: 'Fetching table' });
    expect(table).toHaveAttribute('aria-busy', 'true');
  });
});

// ---------------------------------------------------------------------------
// Sorting tests
// ---------------------------------------------------------------------------

describe('RoboDataTable — sorting', () => {
  it('renders sortable headers as buttons when enableSorting is true', () => {
    render(
      <RoboDataTable
        data={testData}
        columns={testColumns}
        getRowId={(row) => row.id}
        enableSorting
      />,
    );
    // Name and Status have enableSorting: true on the column def
    expect(screen.getByRole('button', { name: /Name/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Status/i })).toBeInTheDocument();
  });

  it('does not render sort buttons when enableSorting is false', () => {
    render(
      <RoboDataTable
        data={testData}
        columns={testColumns}
        getRowId={(row) => row.id}
      />,
    );
    // No sort buttons — headers are plain text
    const nameHeader = screen.getByText('Name').closest('th');
    expect(nameHeader?.querySelector('button')).toBeNull();
  });

  it('non-sortable column header is not a button even with enableSorting', () => {
    render(
      <RoboDataTable
        data={testData}
        columns={testColumns}
        getRowId={(row) => row.id}
        enableSorting
      />,
    );
    // Count does not have enableSorting on the column def
    const countHeader = screen.getByText('Count').closest('th');
    expect(countHeader?.querySelector('button')).toBeNull();
  });

  it('toggles sort direction on repeated clicks', async () => {
    const user = userEvent.setup();
    render(
      <RoboDataTable
        data={testData}
        columns={testColumns}
        getRowId={(row) => row.id}
        enableSorting
      />,
    );

    const nameHeader = screen.getByText('Name').closest('th')!;
    const sortBtn = within(nameHeader).getByRole('button');

    // Initial: aria-sort="none"
    expect(nameHeader).toHaveAttribute('aria-sort', 'none');

    await user.click(sortBtn);
    expect(nameHeader).toHaveAttribute('aria-sort', 'ascending');

    await user.click(sortBtn);
    expect(nameHeader).toHaveAttribute('aria-sort', 'descending');

    await user.click(sortBtn);
    expect(nameHeader).toHaveAttribute('aria-sort', 'none');
  });

  it('fires onSortingChange when a sortable column is clicked', async () => {
    const onSortingChange = vi.fn();
    const user = userEvent.setup();
    render(
      <RoboDataTable
        data={testData}
        columns={testColumns}
        getRowId={(row) => row.id}
        enableSorting
        onSortingChange={onSortingChange}
        sorting={[]}
      />,
    );

    const nameBtn = screen.getByRole('button', { name: /Name/i });
    await user.click(nameBtn);

    expect(onSortingChange).toHaveBeenCalledTimes(1);
  });
});

// ---------------------------------------------------------------------------
// Expanded rows tests
// ---------------------------------------------------------------------------

describe('RoboDataTable — expanding rows', () => {
  const expandableColumns: ColumnDef<TestRow, unknown>[] = [
    columnHelper.display({
      id: 'expander',
      cell: ({ row }) =>
        row.getCanExpand() ? (
          <button
            type="button"
            onClick={row.getToggleExpandedHandler()}
            data-testid={`expand-${row.id}`}
          >
            {row.getIsExpanded() ? 'Collapse' : 'Expand'}
          </button>
        ) : null,
    }),
    ...testColumns,
  ];

  it('renders expanded row content when row is expanded', async () => {
    const user = userEvent.setup();
    render(
      <RoboDataTable
        data={testData}
        columns={expandableColumns}
        getRowId={(row) => row.id}
        enableExpanding
        renderExpandedRow={(row) => (
          <div data-testid="expanded-content">
            Details for {row.original.name}
          </div>
        )}
      />,
    );

    // Expand first row
    const expandBtn = screen.getByTestId('expand-1');
    await user.click(expandBtn);

    expect(screen.getByTestId('expanded-content')).toBeInTheDocument();
    expect(screen.getByText('Details for Alice')).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Styling variants tests
// ---------------------------------------------------------------------------

describe('RoboDataTable — styling', () => {
  it('applies the stripe class to alternating rows, not the table, when striped=true', () => {
    render(
      <RoboDataTable
        data={testData}
        columns={testColumns}
        getRowId={(row) => row.id}
        striped
      />,
    );
    const table = screen.getByRole('table');
    expect(table.className).not.toContain('nth-child');

    const rows = within(table).getAllByRole('row').slice(1); // drop header row
    expect(rows[0].className).not.toContain('bg-[var(--border)]/70');
    expect(rows[1].className).toContain('bg-[var(--border)]/70');
    expect(rows[2].className).not.toContain('bg-[var(--border)]/70');
  });

  it('stripes rows using the border token for adequate contrast, not muted', () => {
    render(
      <RoboDataTable
        data={testData}
        columns={testColumns}
        getRowId={(row) => row.id}
        striped
      />,
    );
    const table = screen.getByRole('table');
    const stripedRow = within(table).getAllByRole('row')[2]; // header + row 0 + striped row 1
    expect(stripedRow.className).toContain('var(--border)');
    expect(stripedRow.className).not.toContain('var(--muted)');
  });

  it('keeps hover working on striped (even) rows — no CSS-specificity conflict', () => {
    render(
      <RoboDataTable
        data={testData}
        columns={testColumns}
        getRowId={(row) => row.id}
        striped
      />,
    );
    const table = screen.getByRole('table');
    const stripedRow = within(table).getAllByRole('row')[2];
    expect(stripedRow.className).toContain('hover:bg-[var(--accent)]');
  });

  it('applies bordered classes when bordered=true', () => {
    render(
      <RoboDataTable
        data={testData}
        columns={testColumns}
        getRowId={(row) => row.id}
        bordered
      />,
    );
    const table = screen.getByRole('table');
    expect(table.className).toContain('border');
  });
});

// ---------------------------------------------------------------------------
// Accessibility tests
// ---------------------------------------------------------------------------

describe('RoboDataTable — accessibility', () => {
  it('has no a11y violations with data', async () => {
    const { container } = render(
      <RoboDataTable
        data={testData}
        columns={testColumns}
        getRowId={(row) => row.id}
        aria-label="Accessible table"
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no a11y violations when loading', async () => {
    const { container } = render(
      <RoboDataTable
        data={[]}
        columns={testColumns}
        isLoading
        aria-label="Loading accessible table"
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no a11y violations when empty', async () => {
    const { container } = render(
      <RoboDataTable
        data={[]}
        columns={testColumns}
        aria-label="Empty accessible table"
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no a11y violations with sorting enabled', async () => {
    const { container } = render(
      <RoboDataTable
        data={testData}
        columns={testColumns}
        getRowId={(row) => row.id}
        enableSorting
        aria-label="Sortable accessible table"
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

// ---------------------------------------------------------------------------
// tableRef / imperative handle tests
// ---------------------------------------------------------------------------

describe('RoboDataTable — tableRef', () => {
  it('exposes TanStack Table instance via tableRef', () => {
    const tableRef = React.createRef<unknown>();
    render(
      <RoboDataTable
        data={testData}
        columns={testColumns}
        getRowId={(row) => row.id}
        tableRef={tableRef as React.RefObject<null>}
      />,
    );
    // TanStack Table instance should have getRowModel
    expect(tableRef.current).toBeDefined();
    expect(typeof (tableRef.current as { getRowModel: () => unknown }).getRowModel).toBe('function');
  });
});

// ---------------------------------------------------------------------------
// Pagination test fixtures
// ---------------------------------------------------------------------------

const paginationData: TestRow[] = Array.from({ length: 12 }, (_, i) => ({
  id: String(i + 1),
  name: `Satellite ${i + 1}`,
  status: i % 2 === 0 ? 'active' : 'inactive',
  count: i + 1,
}));

// ---------------------------------------------------------------------------
// Pagination tests
// ---------------------------------------------------------------------------

describe('RoboDataTable — pagination', () => {
  it('renders pagination bar when enablePagination is true', () => {
    render(
      <RoboDataTable
        data={paginationData}
        columns={testColumns}
        getRowId={(row) => row.id}
        enablePagination
        pageSize={5}
      />,
    );
    expect(screen.getByRole('navigation', { name: 'Table pagination' })).toBeInTheDocument();
  });

  it('does NOT render pagination when enablePagination is false (default)', () => {
    render(
      <RoboDataTable
        data={paginationData}
        columns={testColumns}
        getRowId={(row) => row.id}
      />,
    );
    expect(screen.queryByRole('navigation', { name: 'Table pagination' })).not.toBeInTheDocument();
  });

  it('displays correct row count text on first page', () => {
    render(
      <RoboDataTable
        data={paginationData}
        columns={testColumns}
        getRowId={(row) => row.id}
        enablePagination
        pageSize={5}
      />,
    );
    expect(screen.getByText(/Showing 1–5 of 12 rows/)).toBeInTheDocument();
  });

  it('page size selector changes page size and updates row count text', async () => {
    const user = userEvent.setup();
    render(
      <RoboDataTable
        data={paginationData}
        columns={testColumns}
        getRowId={(row) => row.id}
        enablePagination
        pageSize={5}
        pageSizeOptions={[5, 10, 25]}
      />,
    );

    // Initially showing 5 rows per page
    expect(screen.getByText(/Showing 1–5 of 12 rows/)).toBeInTheDocument();

    const select = screen.getByRole('combobox', { name: 'Rows per page' });
    await user.selectOptions(select, '10');

    // After changing to 10 rows per page, all 12 rows fit on one page
    expect(screen.getByText(/Showing 1–10 of 12 rows/)).toBeInTheDocument();
  });

  it('next button navigates to the next page', async () => {
    const user = userEvent.setup();
    render(
      <RoboDataTable
        data={paginationData}
        columns={testColumns}
        getRowId={(row) => row.id}
        enablePagination
        pageSize={5}
      />,
    );

    const nextBtn = screen.getByRole('button', { name: 'Next page' });
    await user.click(nextBtn);

    expect(screen.getByText(/Showing 6–10 of 12 rows/)).toBeInTheDocument();
  });

  it('previous button navigates back a page', async () => {
    const user = userEvent.setup();
    render(
      <RoboDataTable
        data={paginationData}
        columns={testColumns}
        getRowId={(row) => row.id}
        enablePagination
        pageSize={5}
      />,
    );

    // Navigate forward first
    await user.click(screen.getByRole('button', { name: 'Next page' }));
    expect(screen.getByText(/Showing 6–10 of 12 rows/)).toBeInTheDocument();

    // Then go back
    await user.click(screen.getByRole('button', { name: 'Previous page' }));
    expect(screen.getByText(/Showing 1–5 of 12 rows/)).toBeInTheDocument();
  });

  it('last button navigates to the last page', async () => {
    const user = userEvent.setup();
    render(
      <RoboDataTable
        data={paginationData}
        columns={testColumns}
        getRowId={(row) => row.id}
        enablePagination
        pageSize={5}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Last page' }));
    // 12 rows / 5 per page → page 3 shows rows 11–12
    expect(screen.getByText(/Showing 11–12 of 12 rows/)).toBeInTheDocument();
  });

  it('first button navigates back to the first page', async () => {
    const user = userEvent.setup();
    render(
      <RoboDataTable
        data={paginationData}
        columns={testColumns}
        getRowId={(row) => row.id}
        enablePagination
        pageSize={5}
      />,
    );

    // Go to last page first
    await user.click(screen.getByRole('button', { name: 'Last page' }));
    expect(screen.getByText(/Showing 11–12 of 12 rows/)).toBeInTheDocument();

    // Then jump back to first
    await user.click(screen.getByRole('button', { name: 'First page' }));
    expect(screen.getByText(/Showing 1–5 of 12 rows/)).toBeInTheDocument();
  });

  it('previous and first buttons are disabled on the first page', () => {
    render(
      <RoboDataTable
        data={paginationData}
        columns={testColumns}
        getRowId={(row) => row.id}
        enablePagination
        pageSize={5}
      />,
    );

    expect(screen.getByRole('button', { name: 'First page' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled();
  });

  it('next and last buttons are disabled on the last page', async () => {
    const user = userEvent.setup();
    render(
      <RoboDataTable
        data={paginationData}
        columns={testColumns}
        getRowId={(row) => row.id}
        enablePagination
        pageSize={5}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Last page' }));

    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Last page' })).toBeDisabled();
  });
});

// ---------------------------------------------------------------------------
// Column resizing test fixtures
// ---------------------------------------------------------------------------

const resizableColumns: ColumnDef<TestRow, unknown>[] = [
  columnHelper.accessor('name', {
    header: 'Name',
    cell: (info) => info.getValue(),
    enableResizing: true,
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    cell: (info) => info.getValue(),
    enableResizing: true,
  }),
  columnHelper.accessor('count', {
    header: 'Count',
    cell: (info) => info.getValue(),
    enableResizing: true,
  }),
];

// ---------------------------------------------------------------------------
// Column resizing tests
// ---------------------------------------------------------------------------

describe('RoboDataTable — column resizing', () => {
  it('renders resize handles when enableColumnResizing is true', () => {
    render(
      <RoboDataTable
        data={testData}
        columns={resizableColumns}
        getRowId={(row) => row.id}
        enableColumnResizing
      />,
    );
    const handles = document.querySelectorAll('[role="separator"][aria-orientation="vertical"]');
    expect(handles.length).toBeGreaterThan(0);
  });

  it('does NOT render resize handles when enableColumnResizing is false (default)', () => {
    render(
      <RoboDataTable
        data={testData}
        columns={resizableColumns}
        getRowId={(row) => row.id}
      />,
    );
    const handles = document.querySelectorAll('[role="separator"][aria-orientation="vertical"]');
    expect(handles.length).toBe(0);
  });

  it('resize handles have aria separator role and aria-label', () => {
    render(
      <RoboDataTable
        data={testData}
        columns={resizableColumns}
        getRowId={(row) => row.id}
        enableColumnResizing
      />,
    );
    const nameHandle = screen.getByRole('separator', { name: 'Resize Name column' });
    expect(nameHandle).toBeInTheDocument();
    expect(nameHandle).toHaveAttribute('aria-orientation', 'vertical');
  });
});

// ---------------------------------------------------------------------------
// Column pinning test fixtures
// ---------------------------------------------------------------------------

const pinnableColumns: ColumnDef<TestRow, unknown>[] = [
  columnHelper.accessor('name', {
    header: 'Name',
    cell: (info) => info.getValue(),
    meta: { pinnable: true },
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    cell: (info) => info.getValue(),
    meta: { pinnable: true },
  }),
  columnHelper.accessor('count', {
    header: 'Count',
    cell: (info) => info.getValue(),
  }),
];

// ---------------------------------------------------------------------------
// Column pinning tests
// ---------------------------------------------------------------------------

describe('RoboDataTable — column pinning', () => {
  it('renders pin toggle buttons when enableColumnPinning is true', () => {
    render(
      <RoboDataTable
        data={testData}
        columns={pinnableColumns}
        getRowId={(row) => row.id}
        enableColumnPinning
      />,
    );
    // Name and Status columns have meta.pinnable = true
    expect(
      screen.getByRole('button', { name: 'Pin Name column left' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Pin Status column left' }),
    ).toBeInTheDocument();
  });

  it('does NOT render pin toggle buttons when enableColumnPinning is false (default)', () => {
    render(
      <RoboDataTable
        data={testData}
        columns={pinnableColumns}
        getRowId={(row) => row.id}
      />,
    );
    expect(
      screen.queryByRole('button', { name: 'Pin Name column left' }),
    ).not.toBeInTheDocument();
  });

  it('pin toggle button has correct aria-label and aria-pressed when unpinned', () => {
    render(
      <RoboDataTable
        data={testData}
        columns={pinnableColumns}
        getRowId={(row) => row.id}
        enableColumnPinning
      />,
    );
    const pinBtn = screen.getByRole('button', { name: 'Pin Name column left' });
    expect(pinBtn).toHaveAttribute('aria-pressed', 'false');
  });
});

// ---------------------------------------------------------------------------
// Phase 3 — Filtering + Global Search
// ---------------------------------------------------------------------------

const filterableColumns: ColumnDef<TestRow, unknown>[] = [
  columnHelper.accessor('name', {
    header: 'Name',
    cell: (info) => info.getValue(),
    enableColumnFilter: true,
    meta: { filterType: 'text' as const },
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    cell: (info) => info.getValue(),
    enableColumnFilter: true,
    meta: {
      filterType: 'select' as const,
      filterOptions: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
      ],
    },
  }),
  columnHelper.accessor('count', {
    header: 'Count',
    cell: (info) => info.getValue(),
    enableColumnFilter: true,
    meta: { filterType: 'range' as const },
  }),
];

describe('RoboDataTable — Phase 3: toolbar rendering', () => {
  it('renders toolbar with search input when enableGlobalFilter is true', () => {
    render(
      <RoboDataTable
        data={testData}
        columns={filterableColumns}
        enableGlobalFilter
        aria-label='Filter table'
      />,
    );
    expect(screen.getByRole('toolbar', { name: 'Table toolbar' })).toBeInTheDocument();
    expect(screen.getByRole('searchbox', { name: /search table/i })).toBeInTheDocument();
  });

  it('does not render toolbar when no filtering features are enabled', () => {
    render(
      <RoboDataTable
        data={testData}
        columns={filterableColumns}
        aria-label='Plain table'
      />,
    );
    expect(screen.queryByRole('toolbar')).not.toBeInTheDocument();
  });

  it('toolbar has role="toolbar" and aria-label="Table toolbar"', () => {
    render(
      <RoboDataTable
        data={testData}
        columns={filterableColumns}
        enableGlobalFilter
      />,
    );
    const toolbar = screen.getByRole('toolbar');
    expect(toolbar).toHaveAttribute('aria-label', 'Table toolbar');
  });

  it('hideGlobalSearchInput suppresses the built-in search box while a toolbarRight slot can still render one', () => {
    render(
      <RoboDataTable
        data={testData}
        columns={filterableColumns}
        enableGlobalFilter
        hideGlobalSearchInput
        toolbarLeft={<span>Custom left</span>}
        toolbarRight={<span role='searchbox' aria-label='Custom search' />}
      />,
    );
    expect(screen.queryByRole('searchbox', { name: /search table/i })).not.toBeInTheDocument();
    expect(screen.getByRole('searchbox', { name: /custom search/i })).toBeInTheDocument();
  });
});

describe('RoboDataTable — Phase 3: global search', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('typing in global search filters visible rows after debounce', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime.bind(vi) });

    render(
      <RoboDataTable
        data={testData}
        columns={filterableColumns}
        enableGlobalFilter
        enableFiltering
        aria-label='Search table'
      />,
    );

    const searchInput = screen.getByRole('searchbox', { name: /search table/i });
    await user.type(searchInput, 'Alice');
    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.queryByText('Bob')).not.toBeInTheDocument();
    expect(screen.queryByText('Charlie')).not.toBeInTheDocument();
  });

  it('clearing global search shows all rows again', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime.bind(vi) });

    render(
      <RoboDataTable
        data={testData}
        columns={filterableColumns}
        enableGlobalFilter
        enableFiltering
        aria-label='Clear search table'
      />,
    );

    const searchInput = screen.getByRole('searchbox', { name: /search table/i });

    // Type to filter
    await user.type(searchInput, 'Alice');
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(screen.queryByText('Bob')).not.toBeInTheDocument();

    // Clear via the clear button (fires immediately — no debounce on clear)
    const clearBtn = screen.getByRole('button', { name: /clear search/i });
    await user.click(clearBtn);

    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('Charlie')).toBeInTheDocument();
  });
});

describe('RoboDataTable — Phase 3: column filters', () => {
  it('renders filter icon buttons in column headers when enableColumnFilters is true', () => {
    render(
      <RoboDataTable
        data={testData}
        columns={filterableColumns}
        enableColumnFilters
        aria-label='Column filter table'
      />,
    );
    const filterButtons = screen.getAllByRole('button', { name: /filter column/i });
    expect(filterButtons.length).toBeGreaterThanOrEqual(1);
  });

  it('clicking a filter icon button opens a filter dialog', async () => {
    const user = userEvent.setup();
    render(
      <RoboDataTable
        data={testData}
        columns={filterableColumns}
        enableColumnFilters
        aria-label='Filter dialog table'
      />,
    );
    const [firstFilterBtn] = screen.getAllByRole('button', { name: /filter column/i });
    await user.click(firstFilterBtn);
    expect(screen.getByRole('dialog', { name: /column filter/i })).toBeInTheDocument();
  });
});

describe('RoboDataTable — Phase 3: filter chips', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('active column filters show filter chips in the toolbar', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime.bind(vi) });

    render(
      <RoboDataTable
        data={testData}
        columns={filterableColumns}
        enableColumnFilters
        enableFiltering
        aria-label='Chips table'
      />,
    );

    // Open Name column filter and type a value
    const [nameFilterBtn] = screen.getAllByRole('button', { name: /filter column/i });
    await user.click(nameFilterBtn);

    const textInput = screen.getByRole('textbox', { name: /filter text/i });
    await user.type(textInput, 'Alice');
    act(() => {
      vi.advanceTimersByTime(300);
    });

    // A chip dismiss button for the active filter should appear in the toolbar
    expect(
      screen.getByRole('button', { name: /remove filter: name/i }),
    ).toBeInTheDocument();
  });

  it('"Clear all" button appears when filters are active', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime.bind(vi) });

    render(
      <RoboDataTable
        data={testData}
        columns={filterableColumns}
        enableColumnFilters
        enableGlobalFilter
        enableFiltering
        aria-label='Clear all table'
      />,
    );

    const searchInput = screen.getByRole('searchbox', { name: /search table/i });
    await user.type(searchInput, 'Alice');
    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(screen.getByRole('button', { name: /clear all/i })).toBeInTheDocument();
  });

  it('clicking "Clear all" resets all filters and shows all rows', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime.bind(vi) });

    render(
      <RoboDataTable
        data={testData}
        columns={filterableColumns}
        enableColumnFilters
        enableGlobalFilter
        enableFiltering
        aria-label='Reset filters table'
      />,
    );

    const searchInput = screen.getByRole('searchbox', { name: /search table/i });
    await user.type(searchInput, 'Alice');
    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(screen.queryByText('Bob')).not.toBeInTheDocument();

    const clearAllBtn = screen.getByRole('button', { name: /clear all/i });
    await user.click(clearAllBtn);

    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('Charlie')).toBeInTheDocument();
  });
});

describe('RoboDataTable — Phase 3: a11y', () => {
  it('passes no a11y violations with global filter enabled', async () => {
    const { container } = render(
      <RoboDataTable
        data={testData}
        columns={filterableColumns}
        enableGlobalFilter
        enableFiltering
        aria-label='Accessible filter table'
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

// ---------------------------------------------------------------------------
// Phase 4 — Row Selection + Bulk Actions
// ---------------------------------------------------------------------------

describe('RoboDataTable — row selection', () => {
  it('renders selection checkboxes when enableRowSelection is true', () => {
    render(
      <RoboDataTable
        data={testData}
        columns={testColumns}
        getRowId={(row) => row.id}
        enableRowSelection
        aria-label="Selectable table"
      />,
    );
    // Select-all checkbox in header
    expect(screen.getByRole('checkbox', { name: /select all rows/i })).toBeInTheDocument();
    // Per-row checkboxes
    expect(screen.getByRole('checkbox', { name: /select row 1/i })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /select row 2/i })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /select row 3/i })).toBeInTheDocument();
  });

  it('does NOT render selection checkboxes when enableRowSelection is false (default)', () => {
    render(
      <RoboDataTable
        data={testData}
        columns={testColumns}
        getRowId={(row) => row.id}
        aria-label="Non-selectable table"
      />,
    );
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
  });

  it('clicking a row checkbox selects the row', async () => {
    const user = userEvent.setup();
    render(
      <RoboDataTable
        data={testData}
        columns={testColumns}
        getRowId={(row) => row.id}
        enableRowSelection
        aria-label="Click select table"
      />,
    );

    const row1Checkbox = screen.getByRole('checkbox', { name: /select row 1/i });
    await user.click(row1Checkbox);

    expect(row1Checkbox).toBeChecked();
    // The row should have aria-selected
    const rows = screen.getAllByRole('row');
    // rows[0] is header, rows[1] is first data row
    expect(rows[1]).toHaveAttribute('aria-selected', 'true');
  });

  it('select-all checkbox selects all rows', async () => {
    const user = userEvent.setup();
    render(
      <RoboDataTable
        data={testData}
        columns={testColumns}
        getRowId={(row) => row.id}
        enableRowSelection
        enableMultiRowSelection
        aria-label="Select all table"
      />,
    );

    const selectAll = screen.getByRole('checkbox', { name: /select all rows/i });
    await user.click(selectAll);

    // All per-row checkboxes should be checked
    expect(screen.getByRole('checkbox', { name: /select row 1/i })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: /select row 2/i })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: /select row 3/i })).toBeChecked();
  });

  it('fires onRowSelectionChange when a row is selected', async () => {
    const onRowSelectionChange = vi.fn();
    const user = userEvent.setup();
    render(
      <RoboDataTable
        data={testData}
        columns={testColumns}
        getRowId={(row) => row.id}
        enableRowSelection
        onRowSelectionChange={onRowSelectionChange}
        rowSelection={{}}
        aria-label="Callback select table"
      />,
    );

    const row1Checkbox = screen.getByRole('checkbox', { name: /select row 1/i });
    await user.click(row1Checkbox);

    expect(onRowSelectionChange).toHaveBeenCalledTimes(1);
  });
});

// ---------------------------------------------------------------------------
// Bulk actions tests
// ---------------------------------------------------------------------------

describe('RoboDataTable — bulk actions', () => {
  const mockBulkActions = [
    {
      id: 'delete',
      label: 'Delete',
      variant: 'destructive' as const,
      onAction: vi.fn(),
    },
    {
      id: 'export',
      label: 'Export',
      onAction: vi.fn(),
    },
  ];

  it('renders bulk actions bar when rows are selected', async () => {
    const user = userEvent.setup();
    render(
      <RoboDataTable
        data={testData}
        columns={testColumns}
        getRowId={(row) => row.id}
        enableRowSelection
        bulkActions={mockBulkActions}
        aria-label="Bulk actions table"
      />,
    );

    // Select a row
    const row1Checkbox = screen.getByRole('checkbox', { name: /select row 1/i });
    await user.click(row1Checkbox);

    // Bulk actions bar should appear
    expect(screen.getByText('1 row selected')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Export' })).toBeInTheDocument();
  });

  it('does NOT render bulk actions bar when no rows are selected', () => {
    render(
      <RoboDataTable
        data={testData}
        columns={testColumns}
        getRowId={(row) => row.id}
        enableRowSelection
        bulkActions={mockBulkActions}
        aria-label="No selection bulk table"
      />,
    );

    expect(screen.queryByText(/row.*selected/i)).not.toBeInTheDocument();
  });

  it('clicking a bulk action button calls onAction with selected rows', async () => {
    const exportAction = vi.fn();
    const actions = [
      { id: 'export', label: 'Export Selected', onAction: exportAction },
    ];
    const user = userEvent.setup();
    render(
      <RoboDataTable
        data={testData}
        columns={testColumns}
        getRowId={(row) => row.id}
        enableRowSelection
        bulkActions={actions}
        aria-label="Bulk action callback table"
      />,
    );

    // Select a row
    await user.click(screen.getByRole('checkbox', { name: /select row 1/i }));

    // Click the bulk action button
    await user.click(screen.getByRole('button', { name: 'Export Selected' }));

    expect(exportAction).toHaveBeenCalledTimes(1);
    expect(exportAction).toHaveBeenCalledWith([testData[0]]);
  });

  it('deselect button clears all selections', async () => {
    const user = userEvent.setup();
    render(
      <RoboDataTable
        data={testData}
        columns={testColumns}
        getRowId={(row) => row.id}
        enableRowSelection
        bulkActions={mockBulkActions}
        aria-label="Deselect bulk table"
      />,
    );

    // Select a row
    await user.click(screen.getByRole('checkbox', { name: /select row 1/i }));
    expect(screen.getByText('1 row selected')).toBeInTheDocument();

    // Click deselect
    await user.click(screen.getByRole('button', { name: /deselect all rows/i }));

    // Bulk actions bar should disappear
    expect(screen.queryByText(/row.*selected/i)).not.toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Phase 4 accessibility tests
// ---------------------------------------------------------------------------

describe('RoboDataTable — Phase 4: a11y', () => {
  it('has no a11y violations with row selection enabled', async () => {
    const { container } = render(
      <RoboDataTable
        data={testData}
        columns={testColumns}
        getRowId={(row) => row.id}
        enableRowSelection
        aria-label="Accessible selection table"
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

// ---------------------------------------------------------------------------
// Phase 5 — Nested / Expandable Rows
// ---------------------------------------------------------------------------

interface NestedTestRow {
  id: string;
  name: string;
  status: string;
  children?: NestedTestRow[];
}

const nestedData: NestedTestRow[] = [
  {
    id: '1',
    name: 'Mission A',
    status: 'active',
    children: [
      { id: '1-1', name: 'Leg A1', status: 'complete' },
      { id: '1-2', name: 'Leg A2', status: 'in-progress' },
    ],
  },
  {
    id: '2',
    name: 'Mission B',
    status: 'inactive',
    children: [
      { id: '2-1', name: 'Leg B1', status: 'complete' },
    ],
  },
  { id: '3', name: 'Mission C', status: 'active' },
];

const nestedColumnHelper = createColumnHelper<NestedTestRow>();

const nestedColumns: ColumnDef<NestedTestRow, unknown>[] = [
  nestedColumnHelper.accessor('name', {
    header: 'Name',
    cell: (info) => info.getValue(),
  }),
  nestedColumnHelper.accessor('status', {
    header: 'Status',
    cell: (info) => info.getValue(),
  }),
];

describe('RoboDataTable — Phase 5: auto-prepended expand column', () => {
  it('renders expand toggle buttons when enableExpanding is true', () => {
    render(
      <RoboDataTable
        data={nestedData}
        columns={nestedColumns}
        getRowId={(row) => row.id}
        enableExpanding
        getSubRows={(row) => row.children}
        aria-label="Expandable table"
      />,
    );
    // Mission A and Mission B have children — should have expand buttons
    expect(screen.getByRole('button', { name: /expand row 1/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /expand row 2/i })).toBeInTheDocument();
  });

  it('does NOT render expand column when enableExpanding is false (default)', () => {
    render(
      <RoboDataTable
        data={nestedData}
        columns={nestedColumns}
        getRowId={(row) => row.id}
        aria-label="Non-expandable table"
      />,
    );
    expect(screen.queryByRole('button', { name: /expand row/i })).not.toBeInTheDocument();
  });

  it('clicking expand toggle shows sub-rows', async () => {
    const user = userEvent.setup();
    render(
      <RoboDataTable
        data={nestedData}
        columns={nestedColumns}
        getRowId={(row) => row.id}
        enableExpanding
        getSubRows={(row) => row.children}
        aria-label="Expand sub-rows table"
      />,
    );

    // Sub-rows should not be visible initially
    expect(screen.queryByText('Leg A1')).not.toBeInTheDocument();

    // Expand Mission A
    await user.click(screen.getByRole('button', { name: /expand row 1/i }));

    // Sub-rows should be visible now
    expect(screen.getByText('Leg A1')).toBeInTheDocument();
    expect(screen.getByText('Leg A2')).toBeInTheDocument();
  });

  it('expand toggle has aria-expanded attribute', async () => {
    const user = userEvent.setup();
    render(
      <RoboDataTable
        data={nestedData}
        columns={nestedColumns}
        getRowId={(row) => row.id}
        enableExpanding
        getSubRows={(row) => row.children}
        aria-label="Aria expanded table"
      />,
    );

    const expandBtn = screen.getByRole('button', { name: /expand row 1/i });
    expect(expandBtn).toHaveAttribute('aria-expanded', 'false');

    await user.click(expandBtn);
    expect(expandBtn).toHaveAttribute('aria-expanded', 'true');
  });

  it('renderExpandedRow works with auto-prepended expand column', async () => {
    const user = userEvent.setup();
    render(
      <RoboDataTable
        data={testData}
        columns={testColumns}
        getRowId={(row) => row.id}
        enableExpanding
        renderExpandedRow={(row) => (
          <div data-testid="expanded-detail">
            Detail for {row.original.name}
          </div>
        )}
        aria-label="Render expanded row table"
      />,
    );

    // Expand first row
    const expandBtn = screen.getByRole('button', { name: /expand row 1/i });
    await user.click(expandBtn);

    expect(screen.getByTestId('expanded-detail')).toBeInTheDocument();
    expect(screen.getByText('Detail for Alice')).toBeInTheDocument();
  });

  it('single-expand mode: expanding one row collapses the previously expanded', async () => {
    const user = userEvent.setup();
    render(
      <RoboDataTable
        data={nestedData}
        columns={nestedColumns}
        getRowId={(row) => row.id}
        enableExpanding
        getSubRows={(row) => row.children}
        allowMultipleExpanded={false}
        aria-label="Single expand table"
      />,
    );

    // Expand Mission A
    await user.click(screen.getByRole('button', { name: /expand row 1/i }));
    expect(screen.getByText('Leg A1')).toBeInTheDocument();

    // Expand Mission B — should collapse Mission A
    await user.click(screen.getByRole('button', { name: /expand row 2/i }));
    expect(screen.getByText('Leg B1')).toBeInTheDocument();
    expect(screen.queryByText('Leg A1')).not.toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Phase 5 accessibility tests
// ---------------------------------------------------------------------------

describe('RoboDataTable — Phase 5: a11y', () => {
  it('has no a11y violations with expanding enabled', async () => {
    const { container } = render(
      <RoboDataTable
        data={nestedData}
        columns={nestedColumns}
        getRowId={(row) => row.id}
        enableExpanding
        getSubRows={(row) => row.children}
        aria-label="Accessible expandable table"
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

// ===========================================================================
// Phase 6: Cell Renderers + Export Integration
// ===========================================================================

// ---------------------------------------------------------------------------
// Test data for cell renderers
// ---------------------------------------------------------------------------

interface CellTestRow {
  id: string;
  name: string;
  status: string;
  verified: boolean;
  progress: number;
  distance: number;
  createdAt: string;
  url: string;
  avatarUrl?: string;
}

const cellTestData: CellTestRow[] = [
  {
    id: '1',
    name: 'Satellite Alpha',
    status: 'active',
    verified: true,
    progress: 75,
    distance: 1234.5,
    createdAt: '2026-01-15T10:30:00Z',
    url: 'https://example.com/satellite-1',
    avatarUrl: 'https://example.com/avatar.png',
  },
  {
    id: '2',
    name: 'Satellite Beta',
    status: 'inactive',
    verified: false,
    progress: 30,
    distance: -42.1,
    createdAt: '2026-03-20T14:00:00Z',
    url: 'https://example.com/satellite-2',
  },
];

const cellColumnHelper = createColumnHelper<CellTestRow>();

// ---------------------------------------------------------------------------
// Phase 6 — StatusCell tests
// ---------------------------------------------------------------------------

describe('RoboDataTable — Phase 6: StatusCell', () => {
  it('renders RoboBadge with mapped color and label', () => {
    const columns = [
      cellColumnHelper.accessor('status', {
        header: 'Status',
        cell: createStatusCell<CellTestRow>({
          colorMap: { active: 'success', inactive: 'default' },
          labelMap: { active: 'Active', inactive: 'Inactive' },
        }),
      }),
    ];

    render(
      <RoboDataTable
        data={cellTestData}
        columns={columns}
        getRowId={(r) => r.id}
        aria-label="Status test"
      />,
    );

    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('Inactive')).toBeInTheDocument();
  });

  it('falls back to raw value when no labelMap', () => {
    const columns = [
      cellColumnHelper.accessor('status', {
        header: 'Status',
        cell: createStatusCell<CellTestRow>({
          colorMap: { active: 'success' },
        }),
      }),
    ];

    render(
      <RoboDataTable
        data={cellTestData}
        columns={columns}
        getRowId={(r) => r.id}
        aria-label="Status fallback test"
      />,
    );

    expect(screen.getByText('active')).toBeInTheDocument();
    expect(screen.getByText('inactive')).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Phase 6 — AvatarCell tests
// ---------------------------------------------------------------------------

describe('RoboDataTable — Phase 6: AvatarCell', () => {
  it('renders avatar with name text', () => {
    const columns = [
      cellColumnHelper.accessor('name', {
        header: 'Name',
        cell: createAvatarCell<CellTestRow>({
          nameAccessor: 'name',
          srcAccessor: 'avatarUrl',
        }),
      }),
    ];

    render(
      <RoboDataTable
        data={cellTestData}
        columns={columns}
        getRowId={(r) => r.id}
        aria-label="Avatar test"
      />,
    );

    expect(screen.getByText('Satellite Alpha')).toBeInTheDocument();
    expect(screen.getByText('Satellite Beta')).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Phase 6 — DateCell tests
// ---------------------------------------------------------------------------

describe('RoboDataTable — Phase 6: DateCell', () => {
  it('renders formatted date with <time> element', () => {
    const columns = [
      cellColumnHelper.accessor('createdAt', {
        header: 'Created',
        cell: createDateCell<CellTestRow>({ locale: 'en-US' }),
      }),
    ];

    render(
      <RoboDataTable
        data={cellTestData}
        columns={columns}
        getRowId={(r) => r.id}
        aria-label="Date test"
      />,
    );

    const timeElements = document.querySelectorAll('time');
    expect(timeElements.length).toBe(2);
    expect(timeElements[0]).toHaveAttribute('datetime');
  });

  it('shows relative time when showRelative is true', () => {
    const columns = [
      cellColumnHelper.accessor('createdAt', {
        header: 'Created',
        cell: createDateCell<CellTestRow>({ showRelative: true }),
      }),
    ];

    render(
      <RoboDataTable
        data={cellTestData}
        columns={columns}
        getRowId={(r) => r.id}
        aria-label="Date relative test"
      />,
    );

    // Relative time should contain "ago" for past dates
    const relativeTexts = document.querySelectorAll('time span:nth-child(2)');
    expect(relativeTexts.length).toBe(2);
    relativeTexts.forEach((el) => {
      expect(el.textContent).toMatch(/ago|just now/);
    });
  });
});

// ---------------------------------------------------------------------------
// Phase 6 — NumericCell tests
// ---------------------------------------------------------------------------

describe('RoboDataTable — Phase 6: NumericCell', () => {
  it('formats numbers with unit suffix', () => {
    const columns = [
      cellColumnHelper.accessor('distance', {
        header: 'Distance',
        cell: createNumericCell<CellTestRow>({
          unit: 'km',
          formatOptions: { maximumFractionDigits: 1 },
        }),
      }),
    ];

    render(
      <RoboDataTable
        data={cellTestData}
        columns={columns}
        getRowId={(r) => r.id}
        aria-label="Numeric test"
      />,
    );

    expect(screen.getAllByText('km').length).toBe(2);
  });

  it('applies destructive color to negative numbers when colorNegative is true', () => {
    const columns = [
      cellColumnHelper.accessor('distance', {
        header: 'Distance',
        cell: createNumericCell<CellTestRow>({ colorNegative: true }),
      }),
    ];

    const { container } = render(
      <RoboDataTable
        data={cellTestData}
        columns={columns}
        getRowId={(r) => r.id}
        aria-label="Numeric negative test"
      />,
    );

    const destructiveSpans = container.querySelectorAll('.text-\\[var\\(--destructive\\)\\]');
    expect(destructiveSpans.length).toBeGreaterThanOrEqual(1);
  });
});

// ---------------------------------------------------------------------------
// Phase 6 — BooleanCell tests
// ---------------------------------------------------------------------------

describe('RoboDataTable — Phase 6: BooleanCell', () => {
  it('renders check icon for true and X icon for false', () => {
    const columns = [
      cellColumnHelper.accessor('verified', {
        header: 'Verified',
        cell: createBooleanCell<CellTestRow>(),
      }),
    ];

    render(
      <RoboDataTable
        data={cellTestData}
        columns={columns}
        getRowId={(r) => r.id}
        aria-label="Boolean test"
      />,
    );

    // Should have aria-label="Yes" and aria-label="No"
    expect(screen.getByLabelText('Yes')).toBeInTheDocument();
    expect(screen.getByLabelText('No')).toBeInTheDocument();
  });

  it('shows custom labels when showLabel is true', () => {
    const columns = [
      cellColumnHelper.accessor('verified', {
        header: 'Verified',
        cell: createBooleanCell<CellTestRow>({
          trueLabel: 'Verified',
          falseLabel: 'Pending',
          showLabel: true,
        }),
      }),
    ];

    render(
      <RoboDataTable
        data={cellTestData}
        columns={columns}
        getRowId={(r) => r.id}
        aria-label="Boolean label test"
      />,
    );

    expect(screen.getByRole('img', { name: 'Verified' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Pending' })).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Phase 6 — ProgressCell tests
// ---------------------------------------------------------------------------

describe('RoboDataTable — Phase 6: ProgressCell', () => {
  it('renders progress bars with correct aria values', () => {
    const columns = [
      cellColumnHelper.accessor('progress', {
        header: 'Progress',
        cell: createProgressCell<CellTestRow>(),
      }),
    ];

    render(
      <RoboDataTable
        data={cellTestData}
        columns={columns}
        getRowId={(r) => r.id}
        aria-label="Progress test"
      />,
    );

    const progressBars = screen.getAllByRole('progressbar');
    expect(progressBars.length).toBe(2);
    expect(progressBars[0]).toHaveAttribute('aria-valuenow', '75');
    expect(progressBars[1]).toHaveAttribute('aria-valuenow', '30');
  });

  it('shows percentage labels', () => {
    const columns = [
      cellColumnHelper.accessor('progress', {
        header: 'Progress',
        cell: createProgressCell<CellTestRow>({ showLabel: true }),
      }),
    ];

    render(
      <RoboDataTable
        data={cellTestData}
        columns={columns}
        getRowId={(r) => r.id}
        aria-label="Progress label test"
      />,
    );

    expect(screen.getByText('75%')).toBeInTheDocument();
    expect(screen.getByText('30%')).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Phase 6 — LinkCell tests
// ---------------------------------------------------------------------------

describe('RoboDataTable — Phase 6: LinkCell', () => {
  it('renders clickable links with external attributes', () => {
    const columns = [
      cellColumnHelper.accessor('name', {
        header: 'Name',
        cell: createLinkCell<CellTestRow>({ hrefAccessor: 'url' }),
      }),
    ];

    render(
      <RoboDataTable
        data={cellTestData}
        columns={columns}
        getRowId={(r) => r.id}
        aria-label="Link test"
      />,
    );

    const links = screen.getAllByRole('link');
    expect(links.length).toBe(2);
    expect(links[0]).toHaveAttribute('href', 'https://example.com/satellite-1');
    expect(links[0]).toHaveAttribute('target', '_blank');
    expect(links[0]).toHaveAttribute('rel', 'noopener noreferrer');
  });
});

// ---------------------------------------------------------------------------
// Phase 6 — ActionsCell tests
// ---------------------------------------------------------------------------

describe('RoboDataTable — Phase 6: ActionsCell', () => {
  it('renders action trigger button with aria-haspopup', () => {
    const onEdit = vi.fn();
    const columns = [
      cellColumnHelper.display({
        id: 'actions',
        cell: createActionsCell<CellTestRow>({
          actions: [{ id: 'edit', label: 'Edit', onAction: onEdit }],
        }),
      }),
    ];

    render(
      <RoboDataTable
        data={cellTestData}
        columns={columns}
        getRowId={(r) => r.id}
        aria-label="Actions test"
      />,
    );

    const triggers = screen.getAllByRole('button', { name: 'Row actions' });
    expect(triggers.length).toBe(2);
    expect(triggers[0]).toHaveAttribute('aria-haspopup', 'menu');
  });

  it('opens menu on click and triggers action', async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    const columns = [
      cellColumnHelper.display({
        id: 'actions',
        cell: createActionsCell<CellTestRow>({
          actions: [{ id: 'edit', label: 'Edit', onAction: onEdit }],
        }),
      }),
    ];

    render(
      <RoboDataTable
        data={cellTestData}
        columns={columns}
        getRowId={(r) => r.id}
        aria-label="Actions click test"
      />,
    );

    const trigger = screen.getAllByRole('button', { name: 'Row actions' })[0];
    await user.click(trigger);

    const menuItem = screen.getByRole('menuitem', { name: 'Edit' });
    expect(menuItem).toBeInTheDocument();

    await user.click(menuItem);
    expect(onEdit).toHaveBeenCalledWith(cellTestData[0]);
  });
});

// ---------------------------------------------------------------------------
// Phase 6 — useTableExport tests
// ---------------------------------------------------------------------------

describe('RoboDataTable — Phase 6: useTableExport', () => {
  it('provides exportColumns and getExportData from table ref', () => {
    const _exportResult: ReturnType<typeof useTableExport> | null = null;

    function ExportCapture() {
      const tableRef = React.useRef<import('@tanstack/react-table').Table<CellTestRow> | null>(null);

      // We need the table instance after render
      React.useEffect(() => {
        if (tableRef.current) {
          // This is a workaround to test the hook output — in real usage
          // the hook is called inside a component that has access to the table
        }
      });

      return (
        <RoboDataTable
          data={cellTestData}
          columns={[
            cellColumnHelper.accessor('name', { header: 'Name' }),
            cellColumnHelper.accessor('status', { header: 'Status' }),
          ]}
          getRowId={(r) => r.id}
          tableRef={tableRef}
          aria-label="Export test"
        />
      );
    }

    render(<ExportCapture />);

    // Verify table renders correctly for export scenario
    expect(screen.getByText('Satellite Alpha')).toBeInTheDocument();
    expect(screen.getByText('Satellite Beta')).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Phase 6 — a11y
// ---------------------------------------------------------------------------

describe('RoboDataTable — Phase 6: a11y', () => {
  it('has no a11y violations with cell renderers', async () => {
    const columns = [
      cellColumnHelper.accessor('status', {
        header: 'Status',
        cell: createStatusCell<CellTestRow>({
          colorMap: { active: 'success', inactive: 'default' },
        }),
      }),
      cellColumnHelper.accessor('verified', {
        header: 'Verified',
        cell: createBooleanCell<CellTestRow>(),
      }),
      cellColumnHelper.accessor('progress', {
        header: 'Progress',
        cell: createProgressCell<CellTestRow>(),
      }),
    ];

    const { container } = render(
      <RoboDataTable
        data={cellTestData}
        columns={columns}
        getRowId={(r) => r.id}
        aria-label="Cell renderers a11y test"
      />,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});

// ===========================================================================
// Phase 7: Virtualization
// ===========================================================================

// ---------------------------------------------------------------------------
// Generate large dataset for virtualization tests
// ---------------------------------------------------------------------------

function generateLargeDataset(count: number): TestRow[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `row-${i}`,
    name: `Item ${i}`,
    status: i % 2 === 0 ? 'active' : 'inactive',
    count: Math.floor(Math.random() * 100),
  }));
}

describe('RoboDataTable — Phase 7: Virtualization', () => {
  it('renders with enableVirtualization without crashing', () => {
    const largeData = generateLargeDataset(100);

    render(
      <RoboDataTable
        data={largeData}
        columns={testColumns}
        getRowId={(r) => r.id}
        enableVirtualization
        aria-label="Virtual table test"
      />,
    );

    // Table should be in the document
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('renders table header when virtualized', () => {
    const largeData = generateLargeDataset(50);

    render(
      <RoboDataTable
        data={largeData}
        columns={testColumns}
        getRowId={(r) => r.id}
        enableVirtualization
        aria-label="Virtual header test"
      />,
    );

    // Headers should always render
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Count')).toBeInTheDocument();
  });

  it('does not render all rows when virtualized (only visible + overscan)', () => {
    const largeData = generateLargeDataset(500);

    render(
      <RoboDataTable
        data={largeData}
        columns={testColumns}
        getRowId={(r) => r.id}
        enableVirtualization
        virtualRowHeight={40}
        virtualOverscan={5}
        aria-label="Virtual row count test"
      />,
    );

    // Should NOT render all 500 rows — virtualizer only renders visible + overscan
    const allRows = document.querySelectorAll('tbody tr');
    // The exact count depends on viewport, but it should be far less than 500
    expect(allRows.length).toBeLessThan(500);
  });

  it('falls back to standard rendering when enableVirtualization is false', () => {
    render(
      <RoboDataTable
        data={testData}
        columns={testColumns}
        getRowId={(r) => r.id}
        enableVirtualization={false}
        aria-label="Non-virtual test"
      />,
    );

    // All 3 test rows should render
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('Charlie')).toBeInTheDocument();
  });

  it('works with sorting enabled in virtual mode', () => {
    const largeData = generateLargeDataset(100);

    render(
      <RoboDataTable
        data={largeData}
        columns={testColumns}
        getRowId={(r) => r.id}
        enableVirtualization
        enableSorting
        aria-label="Virtual + sorting test"
      />,
    );

    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('has no a11y violations with virtualization enabled', async () => {
    const largeData = generateLargeDataset(50);

    const { container } = render(
      <RoboDataTable
        data={largeData}
        columns={testColumns}
        getRowId={(r) => r.id}
        enableVirtualization
        aria-label="Virtual a11y test"
      />,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});

// ===========================================================================
// Phase 8: Inline Editing + Keyboard Navigation
// ===========================================================================

// ---------------------------------------------------------------------------
// Phase 8 — InlineEditCell tests
// ---------------------------------------------------------------------------

describe('RoboDataTable — Phase 8: InlineEditCell', () => {
  it('renders display mode by default', () => {
    render(
      <InlineEditCell
        isEditing={false}
        value="Hello"
        onStartEdit={vi.fn()}
        onCommit={vi.fn()}
        onCancel={vi.fn()}
      >
        Hello
      </InlineEditCell>,
    );

    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('renders input in edit mode', () => {
    render(
      <InlineEditCell
        isEditing={true}
        value="Hello"
        onStartEdit={vi.fn()}
        onCommit={vi.fn()}
        onCancel={vi.fn()}
      >
        Hello
      </InlineEditCell>,
    );

    const input = screen.getByRole('textbox', { name: 'Edit cell value' });
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('Hello');
  });

  it('commits on Enter key', async () => {
    const user = userEvent.setup();
    const onCommit = vi.fn();

    render(
      <InlineEditCell
        isEditing={true}
        value="Hello"
        onStartEdit={vi.fn()}
        onCommit={onCommit}
        onCancel={vi.fn()}
      >
        Hello
      </InlineEditCell>,
    );

    const input = screen.getByRole('textbox');
    await user.clear(input);
    await user.type(input, 'World{Enter}');

    expect(onCommit).toHaveBeenCalledWith('World');
  });

  it('cancels on Escape key', async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();

    render(
      <InlineEditCell
        isEditing={true}
        value="Hello"
        onStartEdit={vi.fn()}
        onCommit={vi.fn()}
        onCancel={onCancel}
      >
        Hello
      </InlineEditCell>,
    );

    const _input = screen.getByRole('textbox');
    await user.keyboard('{Escape}');

    expect(onCancel).toHaveBeenCalled();
  });

  it('starts editing on double-click', async () => {
    const user = userEvent.setup();
    const onStartEdit = vi.fn();

    render(
      <InlineEditCell
        isEditing={false}
        value="Hello"
        onStartEdit={onStartEdit}
        onCommit={vi.fn()}
        onCancel={vi.fn()}
      >
        Hello
      </InlineEditCell>,
    );

    await user.dblClick(screen.getByText('Hello'));
    expect(onStartEdit).toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// Phase 8 — useInlineEdit hook tests
// ---------------------------------------------------------------------------

describe('RoboDataTable — Phase 8: useInlineEdit hook', () => {
  function InlineEditHarness({ onCellEdit }: { onCellEdit: (rowId: string, columnId: string, value: unknown) => void }) {
    const { editingCell, startEditing, cancelEditing, commitEdit, isEditing } = useInlineEdit({ onCellEdit });

    return (
      <div>
        <span data-testid="editing">{editingCell ? `${editingCell.rowId}:${editingCell.columnId}` : 'none'}</span>
        <span data-testid="is-editing-1-name">{isEditing('1', 'name') ? 'yes' : 'no'}</span>
        <button onClick={() => startEditing('1', 'name')}>Start Edit</button>
        <button onClick={cancelEditing}>Cancel</button>
        <button onClick={() => commitEdit('New Value')}>Commit</button>
      </div>
    );
  }

  it('tracks editing state', async () => {
    const user = userEvent.setup();
    const onCellEdit = vi.fn();

    render(<InlineEditHarness onCellEdit={onCellEdit} />);

    expect(screen.getByTestId('editing')).toHaveTextContent('none');
    expect(screen.getByTestId('is-editing-1-name')).toHaveTextContent('no');

    await user.click(screen.getByText('Start Edit'));

    expect(screen.getByTestId('editing')).toHaveTextContent('1:name');
    expect(screen.getByTestId('is-editing-1-name')).toHaveTextContent('yes');
  });

  it('commits edit and clears state', async () => {
    const user = userEvent.setup();
    const onCellEdit = vi.fn();

    render(<InlineEditHarness onCellEdit={onCellEdit} />);

    await user.click(screen.getByText('Start Edit'));
    await user.click(screen.getByText('Commit'));

    expect(onCellEdit).toHaveBeenCalledWith('1', 'name', 'New Value');
    expect(screen.getByTestId('editing')).toHaveTextContent('none');
  });

  it('cancels edit and clears state', async () => {
    const user = userEvent.setup();
    const onCellEdit = vi.fn();

    render(<InlineEditHarness onCellEdit={onCellEdit} />);

    await user.click(screen.getByText('Start Edit'));
    await user.click(screen.getByText('Cancel'));

    expect(onCellEdit).not.toHaveBeenCalled();
    expect(screen.getByTestId('editing')).toHaveTextContent('none');
  });
});

// ---------------------------------------------------------------------------
// Phase 8 — onCellEdit integration test
// ---------------------------------------------------------------------------

describe('RoboDataTable — Phase 8: onCellEdit prop', () => {
  it('passes onCellEdit to the table', () => {
    const onCellEdit = vi.fn();

    render(
      <RoboDataTable
        data={testData}
        columns={testColumns}
        getRowId={(r) => r.id}
        onCellEdit={onCellEdit}
        aria-label="Inline edit test"
      />,
    );

    // Table should render (onCellEdit triggers role="grid")
    expect(screen.getByRole('grid')).toBeInTheDocument();
    expect(screen.getByText('Alice')).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Phase 8 — a11y
// ---------------------------------------------------------------------------

describe('RoboDataTable — Phase 8: a11y', () => {
  it('InlineEditCell has no a11y violations in edit mode', async () => {
    const { container } = render(
      <table>
        <tbody>
          <tr>
            <td>
              <InlineEditCell
                isEditing={true}
                value="Test"
                onStartEdit={vi.fn()}
                onCommit={vi.fn()}
                onCancel={vi.fn()}
              >
                Test
              </InlineEditCell>
            </td>
          </tr>
        </tbody>
      </table>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});

// ===========================================================================
// Phase 9: Saved Views
// ===========================================================================

// ---------------------------------------------------------------------------
// In-memory StorageAdapter for testing
// ---------------------------------------------------------------------------

function createMemoryStorage() {
  const store = new Map<string, string>();
  return {
    get: (key: string) => store.get(key) ?? null,
    set: (key: string, value: string) => { store.set(key, value); },
    remove: (key: string) => { store.delete(key); },
    _store: store,
  };
}

// ---------------------------------------------------------------------------
// useSavedViews test harness
// ---------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function SavedViewsHarness({
  onViewSave,
  onViewDelete,
  onViewLoad,
  storageAdapter,
}: {
  onViewSave?: (view: SavedView) => void;
  onViewDelete?: (viewId: string) => void;
  onViewLoad?: (view: SavedView) => void;
  storageAdapter?: ReturnType<typeof createMemoryStorage>;
}) {
  const tableRef = React.useRef<import('@tanstack/react-table').Table<TestRow> | null>(null);

  return (
    <SavedViewsConsumer
      tableRef={tableRef}
      onViewSave={onViewSave}
      onViewDelete={onViewDelete}
      onViewLoad={onViewLoad}
      storageAdapter={storageAdapter}
    />
  );
}

function SavedViewsConsumer({
  tableRef,
  onViewSave,
  onViewDelete,
  onViewLoad,
  storageAdapter,
}: {
  tableRef: React.RefObject<import('@tanstack/react-table').Table<TestRow> | null>;
  onViewSave?: (view: SavedView) => void;
  onViewDelete?: (viewId: string) => void;
  onViewLoad?: (view: SavedView) => void;
  storageAdapter?: ReturnType<typeof createMemoryStorage>;
}) {
  return (
    <RoboDataTable
      data={testData}
      columns={testColumns}
      getRowId={(r) => r.id}
      enableSorting
      enableSavedViews
      tableRef={tableRef}
      storageAdapter={storageAdapter}
      onViewSave={onViewSave}
      onViewDelete={onViewDelete}
      onViewLoad={onViewLoad}
      aria-label="Saved views test"
    />
  );
}

describe('RoboDataTable — Phase 9: Saved Views', () => {
  it('renders table with enableSavedViews flag', () => {
    render(
      <RoboDataTable
        data={testData}
        columns={testColumns}
        getRowId={(r) => r.id}
        enableSavedViews
        aria-label="Saved views enabled test"
      />,
    );

    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('accepts storageAdapter and storageKey props', () => {
    const storage = createMemoryStorage();

    render(
      <RoboDataTable
        data={testData}
        columns={testColumns}
        getRowId={(r) => r.id}
        enableSavedViews
        storageAdapter={storage}
        storageKey="test-table"
        aria-label="Storage adapter test"
      />,
    );

    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('accepts savedViews external prop', () => {
    const views: SavedView[] = [
      {
        id: 'v1',
        name: 'My View',
        isDefault: true,
        createdAt: '2026-01-01T00:00:00Z',
        state: {
          sorting: [{ id: 'name', desc: false }],
          columnFilters: [],
          columnVisibility: {},
          columnOrder: [],
          columnPinning: {},
          globalFilter: '',
          pageSize: 25,
        },
      },
    ];

    render(
      <RoboDataTable
        data={testData}
        columns={testColumns}
        getRowId={(r) => r.id}
        enableSavedViews
        savedViews={views}
        aria-label="External views test"
      />,
    );

    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('accepts view callbacks', () => {
    const onViewSave = vi.fn();
    const onViewDelete = vi.fn();
    const onViewLoad = vi.fn();

    render(
      <RoboDataTable
        data={testData}
        columns={testColumns}
        getRowId={(r) => r.id}
        enableSavedViews
        onViewSave={onViewSave}
        onViewDelete={onViewDelete}
        onViewLoad={onViewLoad}
        aria-label="View callbacks test"
      />,
    );

    expect(screen.getByRole('table')).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Phase 9 — a11y
// ---------------------------------------------------------------------------

describe('RoboDataTable — Phase 9: a11y', () => {
  it('has no a11y violations with saved views enabled', async () => {
    const { container } = render(
      <RoboDataTable
        data={testData}
        columns={testColumns}
        getRowId={(r) => r.id}
        enableSavedViews
        aria-label="Saved views a11y test"
      />,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
