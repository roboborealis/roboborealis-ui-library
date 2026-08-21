import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';

import {
  RoboTable,
  RoboTableHeader,
  RoboTableBody,
  RoboTableFooter,
  RoboTableRow,
  RoboTableHead,
  RoboTableCell,
  RoboTableCaption,
} from './robo-table';
import { RoboEmailTable } from './robo-email-table';


function renderMissionTable(variant?: 'default' | 'striped' | 'bordered') {
  return render(
    <RoboTable variant={variant}>
      <RoboTableCaption>Active missions</RoboTableCaption>
      <RoboTableHeader>
        <RoboTableRow>
          <RoboTableHead>Spacecraft</RoboTableHead>
          <RoboTableHead>Status</RoboTableHead>
        </RoboTableRow>
      </RoboTableHeader>
      <RoboTableBody>
        <RoboTableRow>
          <RoboTableCell>Artemis II</RoboTableCell>
          <RoboTableCell>In Transit</RoboTableCell>
        </RoboTableRow>
        <RoboTableRow>
          <RoboTableCell>Orion</RoboTableCell>
          <RoboTableCell>Docked</RoboTableCell>
        </RoboTableRow>
      </RoboTableBody>
      <RoboTableFooter>
        <RoboTableRow>
          <RoboTableCell colSpan={2}>2 missions</RoboTableCell>
        </RoboTableRow>
      </RoboTableFooter>
    </RoboTable>
  );
}

describe('RoboTable', () => {
  it('renders semantic table structure with caption', () => {
    renderMissionTable();
    const table = screen.getByRole('table', { name: 'Active missions' });
    expect(table).toBeInTheDocument();
    expect(screen.getAllByRole('columnheader')).toHaveLength(2);
    expect(screen.getAllByRole('row')).toHaveLength(4); // header + 2 body + footer
    expect(screen.getByText('Artemis II')).toBeInTheDocument();
  });

  it('wraps the table in a horizontal-scroll container', () => {
    renderMissionTable();
    const table = screen.getByRole('table');
    expect(table.parentElement).toHaveAttribute('data-slot', 'table-container');
    expect(table.parentElement).toHaveClass('overflow-x-auto');
  });

  it('applies striped variant class', () => {
    renderMissionTable('striped');
    expect(screen.getByRole('table').className).toContain('nth-child(even)');
  });

  it('stripes rows using the border token for adequate contrast, not muted', () => {
    renderMissionTable('striped');
    const className = screen.getByRole('table').className;
    expect(className).toContain('var(--border)');
    expect(className).not.toContain('var(--muted)');
  });

  it('applies bordered variant class', () => {
    renderMissionTable('bordered');
    expect(screen.getByRole('table').className).toContain('border');
  });

  it('merges custom className', () => {
    render(
      <RoboTable className="my-custom">
        <RoboTableBody>
          <RoboTableRow>
            <RoboTableCell>x</RoboTableCell>
          </RoboTableRow>
        </RoboTableBody>
      </RoboTable>
    );
    expect(screen.getByRole('table')).toHaveClass('my-custom');
  });

  it('forwards ref to the table element', () => {
    const ref = React.createRef<HTMLTableElement>();
    render(
      <RoboTable ref={ref}>
        <RoboTableBody>
          <RoboTableRow>
            <RoboTableCell>x</RoboTableCell>
          </RoboTableRow>
        </RoboTableBody>
      </RoboTable>
    );
    expect(ref.current).toBeInstanceOf(HTMLTableElement);
  });

  it('has displayName set on all sub-components', () => {
    expect(RoboTable.displayName).toBe('RoboTable');
    expect(RoboTableHeader.displayName).toBe('RoboTableHeader');
    expect(RoboTableBody.displayName).toBe('RoboTableBody');
    expect(RoboTableFooter.displayName).toBe('RoboTableFooter');
    expect(RoboTableRow.displayName).toBe('RoboTableRow');
    expect(RoboTableHead.displayName).toBe('RoboTableHead');
    expect(RoboTableCell.displayName).toBe('RoboTableCell');
    expect(RoboTableCaption.displayName).toBe('RoboTableCaption');
  });

  it('no a11y violations', async () => {
    const { container } = renderMissionTable();
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('RoboEmailTable', () => {
  const columns = [
    { key: 'port', header: 'Ground Station' },
    { key: 'eta', header: 'Acquired', align: 'right' as const },
  ];
  const rows = [
    { port: 'Goldstone DSN', eta: '2026-07-04' },
    { port: 'Madrid DSN', eta: '2026-07-06' },
  ];

  it('renders columns and rows', () => {
    render(<RoboEmailTable columns={columns} rows={rows} />);
    expect(screen.getAllByRole('columnheader')).toHaveLength(2);
    expect(screen.getByText('Goldstone DSN')).toBeInTheDocument();
    expect(screen.getByText('Madrid DSN')).toBeInTheDocument();
  });

  it('renders caption when provided', () => {
    render(<RoboEmailTable columns={columns} rows={rows} caption="Flight Plan" />);
    expect(screen.getByRole('table', { name: 'Flight Plan' })).toBeInTheDocument();
  });

  it('uses inline styles only — no class attributes anywhere', () => {
    const { container } = render(
      <RoboEmailTable columns={columns} rows={rows} caption="Flight Plan" />
    );
    expect(container.querySelectorAll('[class]')).toHaveLength(0);
    // and no CSS custom properties, which email clients cannot resolve
    expect(container.innerHTML).not.toContain('var(--');
  });

  it('applies right alignment from column config', () => {
    render(<RoboEmailTable columns={columns} rows={rows} />);
    const etaHeader = screen.getByText('Acquired');
    expect(etaHeader).toHaveStyle({ textAlign: 'right' });
  });

  it('stripes odd rows by default; every row is self-contained white otherwise', () => {
    const { rerender } = render(<RoboEmailTable columns={columns} rows={rows} />);
    // Odd rows get the stripe grey…
    const secondRow = screen.getByText('Madrid DSN').closest('tr');
    expect(secondRow).toHaveStyle({ backgroundColor: '#f7f8f9' });
    // …even rows get an explicit white background (never inherit the canvas).
    const firstRow = screen.getByText('Goldstone DSN').closest('tr');
    expect(firstRow).toHaveStyle({ backgroundColor: '#ffffff' });

    // With striping off, every row is explicit white.
    rerender(<RoboEmailTable columns={columns} rows={rows} striped={false} />);
    const secondRowUnstriped = screen.getByText('Madrid DSN').closest('tr');
    expect(secondRowUnstriped).toHaveStyle({ backgroundColor: '#ffffff' });
  });

  it('no a11y violations', async () => {
    const { container } = render(
      <RoboEmailTable columns={columns} rows={rows} caption="Flight Plan" />
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
