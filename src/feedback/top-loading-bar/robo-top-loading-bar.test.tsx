import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';

import { RoboTopLoadingBar } from './robo-top-loading-bar';

describe('RoboTopLoadingBar', () => {
  it('renders a progressbar when active', () => {
    render(<RoboTopLoadingBar active />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders nothing when inactive', () => {
    const { container } = render(<RoboTopLoadingBar active={false} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('applies a custom height', () => {
    render(<RoboTopLoadingBar active height={6} />);
    expect(screen.getByRole('progressbar')).toHaveStyle({ height: '6px' });
  });

  it('applies the lg size variant', () => {
    render(<RoboTopLoadingBar active size='lg' />);
    expect(screen.getByRole('progressbar')).toHaveClass('h-1');
  });

  it('passes className through', () => {
    render(<RoboTopLoadingBar active className='custom-class' />);
    expect(screen.getByRole('progressbar')).toHaveClass('custom-class');
  });

  it('forwards ref to the DOM element', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<RoboTopLoadingBar active ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('has correct displayName', () => {
    expect(RoboTopLoadingBar.displayName).toBe('RoboTopLoadingBar');
  });

  it('has no accessibility violations when active', async () => {
    const { container } = render(<RoboTopLoadingBar active />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
