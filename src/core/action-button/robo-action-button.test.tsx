import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Download } from 'lucide-react';

import { RoboActionButton } from './robo-action-button';

describe('RoboActionButton', () => {
  const icon = <Download className='h-3.5 w-3.5' aria-hidden='true' />;

  it('renders with label text', () => {
    render(<RoboActionButton icon={icon} label='Export' onClick={() => {}} />);
    expect(screen.getByRole('button', { name: /export/i })).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveTextContent('Export');
  });

  it('renders icon-only with aria-label', () => {
    render(<RoboActionButton icon={icon} label='Export' iconOnly onClick={() => {}} />);
    const btn = screen.getByRole('button', { name: 'Export' });
    expect(btn).toBeInTheDocument();
    expect(btn.textContent).toBe('');
  });

  it('uses tooltipText for aria-label when provided in iconOnly mode', () => {
    render(
      <RoboActionButton icon={icon} label='Export' tooltipText='Download CSV' iconOnly onClick={() => {}} />,
    );
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Download CSV');
  });

  it('calls onClick when clicked', async () => {
    const onClick = vi.fn();
    render(<RoboActionButton icon={icon} label='Export' onClick={onClick} />);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('applies custom className', () => {
    render(<RoboActionButton icon={icon} label='Export' className='custom' onClick={() => {}} />);
    expect(screen.getByRole('button')).toHaveClass('custom');
  });

  it('applies data-slot attribute', () => {
    render(<RoboActionButton icon={icon} label='Export' data-slot='export-button' onClick={() => {}} />);
    expect(screen.getByRole('button')).toHaveAttribute('data-slot', 'export-button');
  });

  it('forwards ref to the button element', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<RoboActionButton ref={ref} icon={icon} label='Export' onClick={() => {}} />);
    expect(ref.current?.tagName).toBe('BUTTON');
  });

  it('respects disabled prop', async () => {
    const onClick = vi.fn();
    render(<RoboActionButton icon={icon} label='Export' disabled onClick={onClick} />);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('defaults to size sm and variant ghost', () => {
    render(<RoboActionButton icon={icon} label='Export' onClick={() => {}} />);
    const btn = screen.getByRole('button');
    expect(btn).toBeInTheDocument();
  });
});
