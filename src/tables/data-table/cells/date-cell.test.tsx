import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { createDateCell } from './date-cell';
import { RoboDateFormatProvider } from '@/core/providers/robo-date-format-provider';

interface Row {
  createdAt: string | null;
}

const SAMPLE: Row = { createdAt: '2026-03-04T15:06:07.000Z' };

function renderCellElement(row: Row, config?: Parameters<typeof createDateCell>[0]) {
  const cell = createDateCell<Row>(config);
  const info = { getValue: () => row.createdAt } as Parameters<typeof cell>[0];
  return React.createElement(cell, info);
}

function renderCell(row: Row, config?: Parameters<typeof createDateCell>[0]) {
  return render(<>{renderCellElement(row, config)}</>);
}

describe('createDateCell', () => {
  it('falls back to the default Intl format when no provider is mounted and no formatOptions passed', () => {
    renderCell(SAMPLE);
    // en-US medium dateStyle + short timeStyle renders something like "Mar 4, 2026, 3:06 PM"
    expect(screen.getByText(/Mar 4, 2026/)).toBeInTheDocument();
  });

  it('reacts to the RoboDateFormatProvider setting when no formatOptions is passed', () => {
    render(
      <RoboDateFormatProvider defaultDateFormat='YYYY-MM-DD'>
        {renderCellElement(SAMPLE)}
      </RoboDateFormatProvider>
    );
    expect(screen.getByText('2026-03-04')).toBeInTheDocument();
  });

  it('ignores the provider and uses explicit formatOptions as an escape hatch', () => {
    render(
      <RoboDateFormatProvider defaultDateFormat='YYYY-MM-DD'>
        {renderCellElement(SAMPLE, { formatOptions: { dateStyle: 'medium' } })}
      </RoboDateFormatProvider>
    );
    expect(screen.getByText('Mar 4, 2026')).toBeInTheDocument();
    expect(screen.queryByText('2026-03-04')).not.toBeInTheDocument();
  });

  it('renders nothing for a null value', () => {
    const { container } = renderCell({ createdAt: null });
    expect(container).toBeEmptyDOMElement();
  });

  it('renders an em dash for an invalid date string', () => {
    renderCell({ createdAt: 'not-a-date' });
    expect(screen.getByText('—')).toBeInTheDocument();
  });

  it('shows relative time when showRelative is true', () => {
    renderCell(SAMPLE, { showRelative: true });
    // Sample is far in the past/future relative to "now" — just assert the relative span rendered
    expect(document.querySelector('time > span.block')).not.toBeNull();
  });
});
