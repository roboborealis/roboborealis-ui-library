import { render, screen } from '@testing-library/react';
import { RoboNumberTicker } from './robo-number-ticker';

describe('RoboNumberTicker', () => {
  it('renders the value with role=status', () => {
    render(<RoboNumberTicker value={42} />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('has tabular-nums class', () => {
    const { container } = render(<RoboNumberTicker value={99} />);
    expect(container.firstChild).toHaveClass('tabular-nums');
  });
});
