import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { RoboExportButton } from './robo-export-button';

// ---------------------------------------------------------------------------
// DOM API mocks — capture blob content without needing blob.text()
// ---------------------------------------------------------------------------
let capturedBlob: Blob | null = null;
let capturedDownload: string | null = null;
const mockClick = vi.fn();
const mockCreateObjectURL = vi.fn(() => 'blob:mock-url');
const mockRevokeObjectURL = vi.fn();

beforeEach(() => {
  capturedBlob = null;
  capturedDownload = null;
  mockClick.mockReset();
  mockCreateObjectURL.mockReset().mockImplementation((blob: Blob) => {
    capturedBlob = blob;
    return 'blob:mock-url';
  });
  mockRevokeObjectURL.mockReset();

  global.URL.createObjectURL = mockCreateObjectURL;
  global.URL.revokeObjectURL = mockRevokeObjectURL;

  // Intercept anchor clicks — capture download attribute at click time
  vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function(this: HTMLAnchorElement) {
    capturedDownload = this.download;
    mockClick();
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

// Helper — read a captured Blob as text via FileReader
function readBlob(blob: Blob): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsText(blob);
  });
}

const sampleData = [
  { name: 'Satellite A', noradId: '123456789', status: 'active' },
  { name: 'Satellite B', noradId: '987654321', status: 'inactive' },
];

const sampleColumns = [
  { key: 'name', label: 'Satellite Name' },
  { key: 'noradId', label: 'NORAD ID' },
  { key: 'status', label: 'Status' },
];

describe('RoboExportButton', () => {
  // ── Rendering ─────────────────────────────────────────────────────────────

  it('renders with default CSV label', () => {
    render(<RoboExportButton data={sampleData} />);
    expect(screen.getByRole('button', { name: /export csv/i })).toBeInTheDocument();
  });

  it('renders with Excel label for xlsx format', () => {
    render(<RoboExportButton data={sampleData} format='xlsx' />);
    expect(screen.getByRole('button', { name: /export excel/i })).toBeInTheDocument();
  });

  it('renders with custom label', () => {
    render(<RoboExportButton data={sampleData} label='Download Report' />);
    expect(screen.getByRole('button', { name: /download report/i })).toBeInTheDocument();
  });

  it('renders icon-only button with aria-label', () => {
    render(<RoboExportButton data={sampleData} iconOnly />);
    const btn = screen.getByRole('button', { name: /export csv/i });
    expect(btn).toBeInTheDocument();
    expect(btn.textContent).toBe('');
  });

  it('shows label text when not iconOnly', () => {
    render(<RoboExportButton data={sampleData} />);
    expect(screen.getByRole('button')).toHaveTextContent('Export CSV');
  });

  it('has data-slot="export-button"', () => {
    render(<RoboExportButton data={sampleData} />);
    expect(screen.getByRole('button')).toHaveAttribute('data-slot', 'export-button');
  });

  it('applies custom className', () => {
    render(<RoboExportButton data={sampleData} className='my-class' />);
    expect(screen.getByRole('button')).toHaveClass('my-class');
  });

  it('forwards ref to the button element', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<RoboExportButton data={sampleData} ref={ref} />);
    expect(ref.current?.tagName).toBe('BUTTON');
  });

  // ── CSV export ────────────────────────────────────────────────────────────

  it('triggers a file download on click', async () => {
    render(<RoboExportButton data={sampleData} />);
    await userEvent.click(screen.getByRole('button'));
    expect(mockCreateObjectURL).toHaveBeenCalledTimes(1);
    expect(mockClick).toHaveBeenCalledTimes(1);
  });

  it('creates a .csv file by default', async () => {
    render(<RoboExportButton data={sampleData} filename='satellites' />);
    await userEvent.click(screen.getByRole('button'));
    expect(capturedDownload).toBe('satellites.csv');
  });

  it('passes csv mime type in the Blob', async () => {
    render(<RoboExportButton data={sampleData} />);
    await userEvent.click(screen.getByRole('button'));
    expect(capturedBlob?.type).toContain('text/csv');
  });

  it('infers columns from first data row if none provided', async () => {
    render(<RoboExportButton data={[{ alpha: 1, beta: 2 }]} filename='out' />);
    await userEvent.click(screen.getByRole('button'));
    const text = await readBlob(capturedBlob!);
    expect(text).toContain('alpha');
    expect(text).toContain('beta');
  });

  it('uses provided columns for CSV headers', async () => {
    render(
      <RoboExportButton data={sampleData} columns={sampleColumns} filename='out' />,
    );
    await userEvent.click(screen.getByRole('button'));
    const text = await readBlob(capturedBlob!);
    expect(text).toContain('Satellite Name');
    expect(text).toContain('NORAD ID');
    expect(text).toContain('Status');
  });

  it('includes all data rows in CSV output', async () => {
    render(<RoboExportButton data={sampleData} columns={sampleColumns} />);
    await userEvent.click(screen.getByRole('button'));
    const text = await readBlob(capturedBlob!);
    expect(text).toContain('Satellite A');
    expect(text).toContain('Satellite B');
  });

  it('escapes commas in CSV cell values', async () => {
    const data = [{ name: 'Satellite, Alpha' }];
    render(<RoboExportButton data={data} />);
    await userEvent.click(screen.getByRole('button'));
    const text = await readBlob(capturedBlob!);
    expect(text).toContain('"Satellite, Alpha"');
  });

  it('revokes the object URL after download', async () => {
    render(<RoboExportButton data={sampleData} />);
    await userEvent.click(screen.getByRole('button'));
    expect(mockRevokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
  });

  // ── Excel export ──────────────────────────────────────────────────────────

  it('creates a .xls file for xlsx format', async () => {
    render(<RoboExportButton data={sampleData} filename='satellites' format='xlsx' />);
    await userEvent.click(screen.getByRole('button'));
    expect(capturedDownload).toBe('satellites.xls');
  });

  it('uses ms-excel mime type for xlsx format', async () => {
    render(<RoboExportButton data={sampleData} format='xlsx' />);
    await userEvent.click(screen.getByRole('button'));
    expect(capturedBlob?.type).toContain('ms-excel');
  });

  // ── Edge cases ────────────────────────────────────────────────────────────

  it('does nothing when data is empty', async () => {
    render(<RoboExportButton data={[]} />);
    await userEvent.click(screen.getByRole('button'));
    expect(mockCreateObjectURL).not.toHaveBeenCalled();
  });

  it('calls onExport callback after download', async () => {
    const onExport = vi.fn();
    render(<RoboExportButton data={sampleData} onExport={onExport} />);
    await userEvent.click(screen.getByRole('button'));
    expect(onExport).toHaveBeenCalledTimes(1);
  });

  it('does not export when disabled', async () => {
    render(<RoboExportButton data={sampleData} disabled />);
    await userEvent.click(screen.getByRole('button'));
    expect(mockCreateObjectURL).not.toHaveBeenCalled();
  });
});
