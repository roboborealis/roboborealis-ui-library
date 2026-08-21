import { render, screen } from '@testing-library/react';

import { RoboMatrixSparkline } from './robo-matrix-sparkline';

const rows = ['Cargo Freighter', 'Probe'];
const columns = ['Velocity', 'Anomalies'];
const data = [
  [[10, 12, 8, 15], [2, 1, 3, 0]],
  [[20, 18, 22, 19], [0, 2, 1, 4]],
];

describe('RoboMatrixSparkline', () => {
  it('renders without crashing with minimal props', () => {
    const { container } = render(
      <RoboMatrixSparkline rows={[]} columns={[]} data={[]} />,
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders with rows, columns, and data', () => {
    const { container } = render(
      <RoboMatrixSparkline rows={rows} columns={columns} data={data} />,
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders default aria-label "Matrix sparkline chart" when no title or aria-label provided', () => {
    render(<RoboMatrixSparkline rows={[]} columns={[]} data={[]} />);
    expect(screen.getByRole('img', { name: 'Matrix sparkline chart' })).toBeInTheDocument();
  });

  it('uses title as aria-label when no explicit aria-label is provided', () => {
    render(<RoboMatrixSparkline rows={rows} columns={columns} data={data} title="Constellation Trends" />);
    expect(screen.getByRole('img', { name: 'Constellation Trends' })).toBeInTheDocument();
  });

  it('uses custom aria-label when provided', () => {
    render(
      <RoboMatrixSparkline
        rows={rows}
        columns={columns}
        data={data}
        aria-label="Custom matrix label"
      />,
    );
    expect(screen.getByRole('img', { name: 'Custom matrix label' })).toBeInTheDocument();
  });

  it('applies custom className to the wrapper', () => {
    const { container } = render(
      <RoboMatrixSparkline rows={rows} columns={columns} data={data} className="my-sparkline" />,
    );
    expect(container.firstChild).toHaveClass('my-sparkline');
  });

  it('shows loading skeleton when isLoading=true', () => {
    const { container } = render(
      <RoboMatrixSparkline rows={rows} columns={columns} data={data} isLoading />,
    );
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(container.firstChild).toHaveClass('animate-pulse');
  });
});
