import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';

import { RoboCommandHints, DEFAULT_COMMAND_HINTS } from './robo-command-hints';

describe('RoboCommandHints', () => {
  it('renders the default navigate/select/close hints', () => {
    render(<RoboCommandHints />);
    expect(screen.getByText('navigate')).toBeInTheDocument();
    expect(screen.getByText('select')).toBeInTheDocument();
    expect(screen.getByText('close')).toBeInTheDocument();
    expect(screen.getByText('↑↓')).toBeInTheDocument();
    expect(screen.getByText('↵')).toBeInTheDocument();
    expect(screen.getByText('esc')).toBeInTheDocument();
  });

  it('renders custom hints when provided', () => {
    render(<RoboCommandHints hints={[{ keys: '⇥', label: 'next field' }]} />);
    expect(screen.getByText('next field')).toBeInTheDocument();
    expect(screen.getByText('⇥')).toBeInTheDocument();
    expect(screen.queryByText('navigate')).not.toBeInTheDocument();
  });

  it('has data-slot="command-hints"', () => {
    const { container } = render(<RoboCommandHints />);
    expect(container.querySelector('[data-slot="command-hints"]')).toBeInTheDocument();
  });

  it('is aria-hidden', () => {
    const { container } = render(<RoboCommandHints />);
    expect(container.querySelector('[data-slot="command-hints"]')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
  });

  it('merges custom className', () => {
    const { container } = render(<RoboCommandHints className='custom-class' />);
    expect(container.querySelector('[data-slot="command-hints"]')).toHaveClass('custom-class');
  });

  it('forwards ref to the root element', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<RoboCommandHints ref={ref} />);
    expect(ref.current).toHaveAttribute('data-slot', 'command-hints');
  });

  it('has displayName set', () => {
    expect(RoboCommandHints.displayName).toBe('RoboCommandHints');
  });

  it('exports DEFAULT_COMMAND_HINTS for extension', () => {
    expect(DEFAULT_COMMAND_HINTS).toEqual([
      { keys: '↑↓', label: 'navigate' },
      { keys: '↵', label: 'select' },
      { keys: 'esc', label: 'close' },
    ]);
  });

  it('no a11y violations', async () => {
    const { container } = render(<RoboCommandHints />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
