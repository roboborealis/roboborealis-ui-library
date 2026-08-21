import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';

import { RoboKbd } from './robo-kbd';


describe('RoboKbd', () => {
  it('renders a semantic kbd element with its content', () => {
    render(<RoboKbd>⌘K</RoboKbd>);
    const kbd = screen.getByText('⌘K');
    expect(kbd.tagName).toBe('KBD');
    expect(kbd).toHaveAttribute('data-slot', 'kbd');
  });

  it('applies size variants', () => {
    const { rerender } = render(<RoboKbd>K</RoboKbd>);
    expect(screen.getByText('K').className).toContain('text-[10px]');

    rerender(<RoboKbd size="md">K</RoboKbd>);
    expect(screen.getByText('K').className).toContain('text-xs');
  });

  it('merges custom className', () => {
    render(<RoboKbd className="hidden">K</RoboKbd>);
    expect(screen.getByText('K')).toHaveClass('hidden');
  });

  it('passes through aria-label', () => {
    render(<RoboKbd aria-label="Shortcut: Cmd+K">⌘K</RoboKbd>);
    expect(screen.getByLabelText('Shortcut: Cmd+K')).toBeInTheDocument();
  });

  it('forwards ref to the kbd element', () => {
    const ref = React.createRef<HTMLElement>();
    render(<RoboKbd ref={ref}>K</RoboKbd>);
    expect(ref.current?.tagName).toBe('KBD');
  });

  it('has displayName set', () => {
    expect(RoboKbd.displayName).toBe('RoboKbd');
  });

  it('no a11y violations', async () => {
    const { container } = render(
      <p>
        Press <RoboKbd>⌘K</RoboKbd> to open the command palette
      </p>
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
